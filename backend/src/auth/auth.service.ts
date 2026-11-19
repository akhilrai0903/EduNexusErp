import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from './entities/user.entity';
import { UserProfile } from './entities/user-profile.entity';
import { LoginSession } from './entities/login-session.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { AuthResponse } from './interfaces/auth-response.interface';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(UserProfile)
    private userProfileRepository: Repository<UserProfile>,
    @InjectRepository(LoginSession)
    private loginSessionRepository: Repository<LoginSession>,
    private jwtService: JwtService,
  ) {}

  async register(createUserDto: CreateUserDto): Promise<AuthResponse> {
    const { email, password, role, tenantId, schoolId, ...profileData } = createUserDto;

    // Check if user already exists
    const existingUser = await this.userRepository.findOne({
      where: { email, tenantId, schoolId },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists in this school');
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create user
    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      role,
      tenantId,
      schoolId,
      isActive: true,
    });

    const savedUser = await this.userRepository.save(user);

    // Create user profile
    const userProfile = this.userProfileRepository.create({
      userId: savedUser.id,
      tenantId,
      schoolId,
      ...profileData,
    });

    await this.userProfileRepository.save(userProfile);

    // Generate JWT token
    const payload: JwtPayload = {
      sub: savedUser.id,
      email: savedUser.email,
      role: savedUser.role,
      tenantId: savedUser.tenantId,
      schoolId: savedUser.schoolId,
    };

    const accessToken = this.jwtService.sign(payload);

    // Create login session
    await this.createLoginSession(savedUser.id, accessToken, savedUser.tenantId, savedUser.schoolId);

    return {
      user: {
        id: savedUser.id,
        email: savedUser.email,
        role: savedUser.role,
        tenantId: savedUser.tenantId,
        schoolId: savedUser.schoolId,
        firstName: profileData.firstName,
        lastName: profileData.lastName,
      },
      accessToken,
      expiresIn: '24h',
    };
  }

  async login(loginDto: LoginDto): Promise<AuthResponse> {
    const { email, password, tenantId, schoolId } = loginDto;

    // Find user - for super admin, ignore tenant/school restrictions
    // We need to use query builder to include the password field (which has select: false)
    let user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.profiles', 'profiles')
      .addSelect('user.password')
      .where('user.email = :email', { email })
      .getOne();

    // If user is found and is super_admin, allow login
    // Otherwise, check with tenant and school restrictions
    if (user && user.role === 'super_admin') {
      // Super admin found, proceed with login
    } else {
      // Regular user, must match tenant and school
      user = await this.userRepository
        .createQueryBuilder('user')
        .leftJoinAndSelect('user.profiles', 'profiles')
        .addSelect('user.password')
        .where('user.email = :email', { email })
        .andWhere('user.tenantId = :tenantId', { tenantId })
        .andWhere('user.schoolId = :schoolId', { schoolId })
        .getOne();
    }

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('Account is deactivated');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Generate JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      schoolId: user.schoolId,
    };

    const accessToken = this.jwtService.sign(payload);

    // Create login session
    await this.createLoginSession(user.id, accessToken, user.tenantId, user.schoolId);

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        schoolId: user.schoolId,
        firstName: user.profiles?.[0]?.firstName,
        lastName: user.profiles?.[0]?.lastName,
      },
      accessToken,
      expiresIn: '24h',
    };
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
      relations: ['profiles'],
    });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('User not found or inactive');
    }

    return user;
  }

  async logout(token: string): Promise<void> {
    await this.loginSessionRepository.update(
      { token },
      { isActive: false, logoutAt: new Date() }
    );
  }

  async refreshToken(token: string): Promise<AuthResponse> {
    const session = await this.loginSessionRepository.findOne({
      where: { token, isActive: true },
      relations: ['user'],
    });

    if (!session) {
      throw new UnauthorizedException('Invalid session');
    }

    const user = session.user;

    // Generate new JWT token
    const payload: JwtPayload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
      schoolId: user.schoolId,
    };

    const newAccessToken = this.jwtService.sign(payload);

    // Update session with new token
    await this.loginSessionRepository.update(
      { id: session.id },
      { token: newAccessToken, lastActivityAt: new Date() }
    );

    return {
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
        schoolId: user.schoolId,
        firstName: user.profiles?.[0]?.firstName,
        lastName: user.profiles?.[0]?.lastName,
      },
      accessToken: newAccessToken,
      expiresIn: '24h',
    };
  }

  async changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Verify old password
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Hash new password
    const saltRounds = 12;
    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);

    // Update password
    await this.userRepository.update(userId, { password: hashedNewPassword });

    // Invalidate all active sessions
    await this.loginSessionRepository.update(
      { userId, isActive: true },
      { isActive: false, logoutAt: new Date() }
    );
  }

  async resetPassword(email: string, tenantId: string, schoolId: string): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { email, tenantId, schoolId },
    });

    if (!user) {
      // Don't reveal if user exists or not for security
      return;
    }

    // Generate temporary password (in real app, send email with reset link)
    const temporaryPassword = this.generateTemporaryPassword();
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(temporaryPassword, saltRounds);

    await this.userRepository.update(user.id, { password: hashedPassword });

    // Invalidate all active sessions
    await this.loginSessionRepository.update(
      { userId: user.id, isActive: true },
      { isActive: false, logoutAt: new Date() }
    );

    // TODO: Send email with temporary password
    console.log(`Temporary password for ${email}: ${temporaryPassword}`);
  }

  async getUserById(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
      relations: ['profiles'],
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUsersByTenant(tenantId: string, schoolId?: string): Promise<User[]> {
    const where: any = { tenantId };
    if (schoolId) {
      where.schoolId = schoolId;
    }

    return this.userRepository.find({
      where,
      relations: ['profiles'],
      order: { createdAt: 'DESC' },
    });
  }

  async updateUserStatus(userId: string, isActive: boolean): Promise<void> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    await this.userRepository.update(userId, { isActive });

    // If deactivating, invalidate all active sessions
    if (!isActive) {
      await this.loginSessionRepository.update(
        { userId, isActive: true },
        { isActive: false, logoutAt: new Date() }
      );
    }
  }

  private async createLoginSession(userId: string, token: string, tenantId: string, schoolId: string): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now
    
    const session = this.loginSessionRepository.create({
      userId,
      token,
      sessionToken: token, // Use the same token for sessionToken for simplicity
      tenantId,
      schoolId,
      expiresAt,
      loginAt: new Date(),
      lastActivityAt: new Date(),
      isActive: true,
      ipAddress: '127.0.0.1', // TODO: Get real IP from request
      userAgent: 'School Suite App', // TODO: Get real user agent
    });

    await this.loginSessionRepository.save(session);
  }

  private generateTemporaryPassword(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 12; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
}