// auth.models.ts

export interface LoginDto {
    username: string;
    password: string;
  }
  
  export interface RegisterDto {
    email: string;
    username: string;
    password: string;
  }
  
  export interface TokenResponse {
    accessToken: string;
    refreshToken: string;
  }
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  
  export interface LoginResponse {
    token: string;
  }