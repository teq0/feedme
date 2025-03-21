import bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { AppDataSource } from '../config/data-source';
import { User } from '../models/user.entity';
import { CreateUserDto, OidcUserData, UpdateUserDto, UserRole } from '../types/user.types';
import { ApiError } from '../middleware/error-handler';
import { logger } from '../utils/logger';

export class UserService {
  private userRepository: Repository<User>;

  constructor() {
    this.userRepository = AppDataSource.getRepository(User);
  }

  /**
   * Find a user by ID
   */
  async findById(id: string): Promise<User | null> {
    return this.userRepository.findOneBy({ id });
  }

  /**
   * Find a user by email
   */
  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findOneBy({ email });
  }

  /**
   * Create a new user
   */
  async create(userData: CreateUserDto): Promise<User> {
    // Check if user with this email already exists
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      throw new ApiError(409, 'User with this email already exists');
    }

    // Hash password if provided
    let hashedPassword: string | undefined;
    if (userData.password) {
      hashedPassword = await bcrypt.hash(userData.password, 10);
    }

    // Create new user
    const user = this.userRepository.create({
      ...userData,
      password: hashedPassword,
      role: userData.role || UserRole.USER,
    });

    // Save user to database
    await this.userRepository.save(user);
    logger.info(`User created: ${user.id}`);

    return user;
  }

  /**
   * Update a user
   */
  async update(id: string, userData: UpdateUserDto): Promise<User> {
    // Find user
    const user = await this.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    // Hash password if provided
    if (userData.password) {
      userData.password = await bcrypt.hash(userData.password, 10);
    }

    // Update user
    this.userRepository.merge(user, userData);
    await this.userRepository.save(user);
    logger.info(`User updated: ${user.id}`);

    return user;
  }

  /**
   * Delete a user
   */
  async delete(id: string): Promise<void> {
    const user = await this.findById(id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }

    await this.userRepository.remove(user);
    logger.info(`User deleted: ${id}`);
  }

  /**
   * Validate user credentials
   */
  async validateUser(email: string, password: string): Promise<User | null> {
    const user = await this.findByEmail(email);
    if (!user || !user.password) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }

  /**
   * Find or create a user from OIDC data
   */
  async findOrCreateOidcUser(oidcData: OidcUserData): Promise<User> {
    // Try to find user by email
    let user = await this.findByEmail(oidcData.email);

    if (user) {
      // Update provider info if user exists
      if (!user.provider || !user.providerId) {
        user.provider = oidcData.provider;
        user.providerId = oidcData.providerId;
        await this.userRepository.save(user);
        logger.info(`Updated OIDC info for user: ${user.id}`);
      }
    } else {
      // Create new user if not found
      user = this.userRepository.create({
        email: oidcData.email,
        name: oidcData.name,
        picture: oidcData.picture,
        provider: oidcData.provider,
        providerId: oidcData.providerId,
        role: UserRole.USER,
      });

      await this.userRepository.save(user);
      logger.info(`Created new user from OIDC: ${user.id}`);
    }

    return user;
  }

  /**
   * Get all users (admin only)
   */
  async findAll(page = 1, limit = 10): Promise<{ users: User[]; total: number }> {
    const [users, total] = await this.userRepository.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return { users, total };
  }
}