import { UserRepository as IUserRepository } from '../../application/ports/user.repository';
import { User } from '../../domain/entities/user';
import { UserRole } from '@ecommerce/shared-kernel';
import { getPrismaClient } from './prisma-client';

/**
 * User repository implementation with Prisma
 */
export class UserRepositoryImpl implements IUserRepository {
  private prisma = getPrismaClient();

  /**
   * Find user by ID
   */
  async findById(id: string): Promise<User | null> {
    console.log('[UserRepository] Finding user by ID:', id);
    try {
      const userData = await (this.prisma as any).user.findUnique({
        where: { id },
      });

      if (!userData) {
        console.log('[UserRepository] User not found:', id);
        return null;
      }

      return this.mapToDomain(userData);
    } catch (error) {
      console.error('[UserRepository] Error finding user by ID:', error);
      throw error;
    }
  }

  /**
   * Find user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    console.log('[UserRepository] Finding user by email:', email);
    try {
      // Debug: Check Prisma Client structure
      if (process.env.NODE_ENV === 'development') {
        console.log('[UserRepository] Prisma Client keys:', Object.keys(this.prisma));
        console.log('[UserRepository] Has user property?', 'user' in this.prisma);
        if ((this.prisma as any).user) {
          console.log('[UserRepository] User model found');
        } else {
          console.error('[UserRepository] User model NOT found in Prisma Client!');
          console.error('[UserRepository] Available models:', Object.keys(this.prisma).filter(k => !k.startsWith('_')));
        }
      }

      const userData = await (this.prisma as any).user.findUnique({
        where: { email },
      });

      if (!userData) {
        console.log('[UserRepository] User not found:', email);
        return null;
      }

      return this.mapToDomain(userData);
    } catch (error) {
      console.error('[UserRepository] Error finding user by email:', error);
      throw error;
    }
  }

  /**
   * Save user (create or update)
   */
  async save(user: User): Promise<User> {
    console.log('[UserRepository] Saving user:', user.id);
    try {
      // Check if user exists
      const existingUser = await (this.prisma as any).user.findUnique({
        where: { id: user.id },
      });

      let userData;
      if (existingUser) {
        // Update existing user
        userData = await (this.prisma as any).user.update({
          where: { id: user.id },
          data: {
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            updatedAt: new Date(),
          },
        });
        console.log('[UserRepository] User updated successfully:', userData.id);
      } else {
        // Create new user
        userData = await (this.prisma as any).user.create({
          data: {
            id: user.id,
            email: user.email,
            password: user.password,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
          },
        });
        console.log('[UserRepository] User created successfully:', userData.id);
      }

      return this.mapToDomain(userData);
    } catch (error) {
      console.error('[UserRepository] Error saving user:', error);
      throw error;
    }
  }

  /**
   * Map Prisma model to domain entity
   */
  private mapToDomain(userData: {
    id: string;
    email: string;
    password: string;
    firstName: string | null;
    lastName: string | null;
    role: UserRole;
    createdAt: Date;
    updatedAt: Date;
  }): User {
    return new User(
      userData.id,
      userData.email,
      userData.password,
      userData.firstName || undefined,
      userData.lastName || undefined,
      userData.role,
      userData.createdAt,
      userData.updatedAt
    );
  }
}

