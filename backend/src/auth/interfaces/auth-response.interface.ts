import { User } from '../entities/user.entity';

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    role: string;
    tenantId: string;
    schoolId: string;
    firstName?: string;
    lastName?: string;
  };
  accessToken: string;
  expiresIn: string;
}
