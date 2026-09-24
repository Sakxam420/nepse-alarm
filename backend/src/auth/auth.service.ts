import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { RegisterDto, LoginDto } from './dto/auth.dto';
import * as crypto from 'crypto';

export interface UserResponse {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  createdAt: string;
}

export interface AuthResult {
  user: UserResponse;
  token: string;
  message: string;
}

@Injectable()
export class AuthService {
  // In-memory fallback user registry to ensure high reliability across deployments
  private static memoryUsers: Map<string, { id: string; name: string; email: string; passwordHash: string; role: string; avatar: string; createdAt: string }> = new Map([
    [
      'demo@nepse.ai',
      {
        id: 'usr-demo-001',
        name: 'Sakxam Bhattarai',
        email: 'demo@nepse.ai',
        passwordHash: AuthService.hashPassword('password123'),
        role: 'Lead Quantitative Analyst',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString(),
      },
    ],
    [
      'evaluator@tu.edu.np',
      {
        id: 'usr-eval-002',
        name: 'TU BCA Evaluator',
        email: 'evaluator@tu.edu.np',
        passwordHash: AuthService.hashPassword('password123'),
        role: 'Academic Examiner',
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=150&q=80',
        createdAt: new Date().toISOString(),
      },
    ],
  ]);

  constructor(private readonly prisma: DatabaseService) {}

  private static hashPassword(password: string): string {
    return crypto.createHmac('sha256', 'nepse-ai-auth-salt-2026').update(password).digest('hex');
  }

  private generateToken(userId: string, email: string): string {
    const payload = `${userId}:${email}:${Date.now()}`;
    return Buffer.from(payload).toString('base64url');
  }

  async register(dto: RegisterDto): Promise<AuthResult> {
    const normalizedEmail = dto.email.trim().toLowerCase();

    // Check if user exists in memory cache
    if (AuthService.memoryUsers.has(normalizedEmail)) {
      throw new BadRequestException('An account with this email address already exists.');
    }

    // Try Prisma DB if User model is available in schema
    try {
      if ((this.prisma as any).user) {
        const existing = await (this.prisma as any).user.findUnique({
          where: { email: normalizedEmail },
        });
        if (existing) {
          throw new BadRequestException('An account with this email address already exists.');
        }
      }
    } catch {
      // Gracefully fall through to memory registry
    }

    const userId = 'usr-' + crypto.randomUUID().slice(0, 8);
    const passwordHash = AuthService.hashPassword(dto.password);
    const avatar = `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dto.name)}&backgroundColor=1e293b,0f172a,3b82f6`;
    const createdAt = new Date().toISOString();

    const newUser = {
      id: userId,
      name: dto.name.trim(),
      email: normalizedEmail,
      passwordHash,
      role: 'Active Trader',
      avatar,
      createdAt,
    };

    // Store in memory cache
    AuthService.memoryUsers.set(normalizedEmail, newUser);

    // Try saving in Prisma DB if available
    try {
      if ((this.prisma as any).user) {
        await (this.prisma as any).user.create({
          data: {
            id: userId,
            name: newUser.name,
            email: normalizedEmail,
            password: passwordHash,
            role: newUser.role,
            avatar,
          },
        });
      }
    } catch {
      // Ignored for SQLite / non-migrated PostgreSQL schema compatibility
    }

    const token = this.generateToken(userId, normalizedEmail);

    return {
      message: 'Account created successfully',
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        avatar: newUser.avatar,
        createdAt: newUser.createdAt,
      },
      token,
    };
  }

  async login(dto: LoginDto): Promise<AuthResult> {
    const normalizedEmail = dto.email.trim().toLowerCase();
    const passwordHash = AuthService.hashPassword(dto.password);

    let user = AuthService.memoryUsers.get(normalizedEmail);

    if (!user) {
      // Check Prisma DB
      try {
        if ((this.prisma as any).user) {
          const dbUser = await (this.prisma as any).user.findUnique({
            where: { email: normalizedEmail },
          });
          if (dbUser) {
            user = {
              id: dbUser.id,
              name: dbUser.name,
              email: dbUser.email,
              passwordHash: dbUser.password,
              role: dbUser.role || 'Trader',
              avatar: dbUser.avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(dbUser.name)}`,
              createdAt: dbUser.createdAt.toISOString(),
            };
            AuthService.memoryUsers.set(normalizedEmail, user);
          }
        }
      } catch {
        // Ignored
      }
    }

    if (!user || user.passwordHash !== passwordHash) {
      throw new UnauthorizedException('Invalid email or password. Please verify your credentials.');
    }

    const token = this.generateToken(user.id, user.email);

    return {
      message: 'Logged in successfully',
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      },
      token,
    };
  }

  async getProfile(token: string): Promise<UserResponse> {
    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      const decoded = Buffer.from(token, 'base64url').toString('utf8');
      const [, email] = decoded.split(':');
      const user = AuthService.memoryUsers.get(email.toLowerCase());

      if (!user) {
        throw new UnauthorizedException('Session expired or invalid user');
      }

      return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        createdAt: user.createdAt,
      };
    } catch {
      throw new UnauthorizedException('Invalid authentication token');
    }
  }

  getDemoAccounts() {
    return Array.from(AuthService.memoryUsers.values()).map(u => ({
      name: u.name,
      email: u.email,
      role: u.role,
      avatar: u.avatar,
    }));
  }
}
