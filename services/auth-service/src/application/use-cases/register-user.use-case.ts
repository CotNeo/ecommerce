import { UserRepository } from '../ports/user.repository';
import { PasswordHasher } from '../ports/password-hasher';
import { User } from '../../domain/entities/user';

/**
 * Register user use case
 * @param email User's email
 * @param password User's password
 * @param firstName Optional first name
 * @param lastName Optional last name
 * @returns Created user data
 */
export class RegisterUserUseCase {
  constructor(
    private userRepository: UserRepository = new (require('../../infrastructure/persistence/user.repository').UserRepositoryImpl)(),
    private passwordHasher: PasswordHasher = new (require('../../infrastructure/password-hasher').BcryptPasswordHasher)()
  ) {}

  async execute(input: {
    email: string;
    password: string;
    firstName?: string;
    lastName?: string;
  }) {
    // 1. Check if user exists
    const existingUser = await this.userRepository.findByEmail(input.email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    // 2. Hash password
    const hashedPassword = await this.passwordHasher.hash(input.password);

    // 3. Create user entity
    const user = User.create({
      email: input.email,
      password: hashedPassword,
      firstName: input.firstName,
      lastName: input.lastName,
    });

    // 4. Save user
    const savedUser = await this.userRepository.save(user);

    // 5. Return user data (without password)
    return {
      id: savedUser.id,
      email: savedUser.email,
      firstName: savedUser.firstName,
      lastName: savedUser.lastName,
      createdAt: savedUser.createdAt,
    };
  }
}

