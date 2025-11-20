import { User } from '../../domain/entities/user';

/**
 * User repository interface (port)
 */
export interface UserRepository {
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  save(user: User): Promise<User>;
}

