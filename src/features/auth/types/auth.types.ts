export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'staff' | 'viewer'
  avatarUrl?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthTokens {
  accessToken: string
  refreshToken: string
  expiresIn: number
}

export interface AuthResponse {
  user: User
  tokens: AuthTokens
}
