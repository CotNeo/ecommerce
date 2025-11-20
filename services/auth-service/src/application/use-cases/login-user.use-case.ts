import { UserRepository } from '../ports/user.repository';
import { PasswordHasher } from '../ports/password-hasher';
import { TokenGenerator } from '../ports/token-generator';

/**
 * Login user use case
 * @param email User's email
 * @param password User's password
 * @returns Access token, refresh token, and user data
 */
export class LoginUserUseCase {
  constructor(
    private userRepository: UserRepository = new (require('../../infrastructure/persistence/user.repository').UserRepositoryImpl)(),
    private passwordHasher: PasswordHasher = new (require('../../infrastructure/password-hasher').BcryptPasswordHasher)(),
    private tokenGenerator: TokenGenerator = new (require('../../infrastructure/token-generator').JwtTokenGenerator)()
  ) {}

  async execute(input: { email: string; password: string }) {
    // 1. Find user by email
    const user = await this.userRepository.findByEmail(input.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // 2. Verify password
    const isValid = await this.passwordHasher.compare(input.password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    // 3. Generate tokens
    const accessToken = this.tokenGenerator.generateAccessToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    const refreshToken = this.tokenGenerator.generateRefreshToken({
      userId: user.id,
    });

    // 4. Save refresh token (optional, can be stored in DB)

    // 5. Return tokens and user data
    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
      },
    };
  }
}

