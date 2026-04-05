import { Injectable, UnauthorizedException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { UserRole } from '../users/schemas/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService
  ) {}

  async register(registerDto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerDto.email);
    if (existingUser) {
      throw new BadRequestException('User already exists');
    }
    
    try {
        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        let organizationId = '';
        let inviteCode = '';
        let role = registerDto.role || UserRole.VIEWER;

        if (registerDto.inviteCode) {
            const organizer = await this.usersService.findByInviteCode(registerDto.inviteCode);
            if (!organizer) {
                throw new BadRequestException('Invalid invite code. Please check with your team admin.');
            }
            organizationId = organizer.organizationId;
            inviteCode = organizer.inviteCode; // Inherit the same invite code for the org
            role = registerDto.role || UserRole.VIEWER;
        } else {
            // New Organization - This user is the Admin
            organizationId = `org_${Math.random().toString(36).substring(2, 11)}`;
            inviteCode = `ZORVYN-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
            role = UserRole.ADMIN; // No invite code = Owner/Admin
        }

        const newUser = await this.usersService.create({
            name: registerDto.name,
            email: registerDto.email,
            password: hashedPassword,
            role: role as UserRole,
            organizationId,
            inviteCode,
        });

        return { 
          message: 'User registered successfully', 
          userId: newUser._id,
          inviteCode: newUser.inviteCode,
          organizationId: newUser.organizationId
        };
    } catch (error: any) {
        if (error instanceof BadRequestException) throw error;
        if (error.name === 'ValidationError' || error.code === 11000) {
            throw new BadRequestException(error.message || 'Validation failed');
        }
        throw new InternalServerErrorException('Error registering user');
    }
  }

  async login(loginDto: LoginDto) {
    const user = await this.usersService.findByEmail(loginDto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Ensure the ID is a string for JWT signing - this prevents 500 errors
    const token = this.jwtService.sign({ 
      userId: user._id.toString(), 
      organizationId: user.organizationId.toString(),
      inviteCode: user.inviteCode,
      name: user.name,
      role: user.role 
    });

    return { 
      access_token: token, 
      user: { 
        id: user._id.toString(), 
        name: user.name, 
        email: user.email, 
        role: user.role,
        inviteCode: user.inviteCode
      } 
    };
  }
}


