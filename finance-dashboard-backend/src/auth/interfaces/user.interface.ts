import { UserRole } from '../../users/schemas/user.schema';

export interface AuthenticatedUser {
  userId: string;
  organizationId: string;
  role: UserRole;
  email: string;
  name: string;
}
