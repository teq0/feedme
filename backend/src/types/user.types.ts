// User role enum
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// User interface
export interface IUser {
  id: string;
  email: string;
  password?: string;
  name: string;
  picture?: string;
  role: UserRole;
  createdAt: Date;
  updatedAt: Date;
}

// User creation DTO
export interface CreateUserDto {
  email: string;
  password?: string;
  name: string;
  picture?: string;
  role?: UserRole;
}

// User update DTO
export interface UpdateUserDto {
  email?: string;
  password?: string;
  name?: string;
  picture?: string;
  role?: UserRole;
}

// User login DTO
export interface LoginUserDto {
  email: string;
  password: string;
}

// OIDC user data
export interface OidcUserData {
  provider: string;
  providerId: string;
  email: string;
  name: string;
  picture?: string;
}

// Auth tokens
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// JWT payload
export interface JwtPayload {
  sub: string;
  email: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}