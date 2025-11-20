import { UserRepository } from '../ports/user.repository';
import { TokenGenerator } from '../ports/token-generator';

/**
 * Get current user use case
 * @param token JWT access token
 * @returns Current user data
 */
export class GetCurrentUserUseCase {
  constructor(
    private userRepository: UserRepository = new (require('../../infrastructure/persistence/user.repository').UserRepositoryImpl)(),
    private tokenGenerator: TokenGenerator = new (require('../../infrastructure/token-generator').JwtTokenGenerator)()
  ) {}

  async execute(token: string) {
    // 1. Verify and decode token
    const payload = this.tokenGenerator.verifyAccessToken(token);
    if (!payload) {
      throw new Error('Invalid token');
    }

    // 2. Find user
    const user = await this.userRepository.findById(payload.userId);
    if (!user) {
      throw new Error('User not found');
    }

    // 3. Return user data (without password)
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }
}

