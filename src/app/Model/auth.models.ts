// auth.models.ts
export interface LoginDto {
  username: string;  // Basic login credentials
  password: string;
}

export interface RegisterDto {
  email: string;     // User registration data
  username: string;
  password: string;
}

export interface TokenResponse {
  accessToken: string;    // JWT token response structure
  refreshToken: string;
}

// Simplified interfaces - LoginCredentials can be merged with LoginDto
export interface LoginResponse {
  token: string;    // Single token response structure
}