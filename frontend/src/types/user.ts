// User role enum
export enum UserRole {
  ADMIN = 'admin',
  USER = 'user',
}

// User interface
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  role: UserRole;
}

// User creation DTO
export interface RegisterUserDto {
  name: string;
  email: string;
  password: string;
}

// User login DTO
export interface LoginUserDto {
  email: string;
  password: string;
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
  name?: string;
  role: UserRole;
  iat?: number;
  exp?: number;
}