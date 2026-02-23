import { apiClient } from '@/lib/axios'
import type { ApiResponse } from '@/types'
import type { AuthResponse, LoginCredentials } from '../types/auth.types'

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      credentials
    )
    return response.data
  },

  logout: async (): Promise<void> => {
    await apiClient.post('/auth/logout')
  },

  refreshToken: async (refreshToken: string): Promise<Pick<AuthResponse, 'tokens'>> => {
    const response = await apiClient.post<ApiResponse<Pick<AuthResponse, 'tokens'>>>(
      '/auth/refresh',
      { refreshToken }
    )
    return response.data
  },

  getMe: async (): Promise<AuthResponse['user']> => {
    const response = await apiClient.get<ApiResponse<AuthResponse['user']>>('/auth/me')
    return response.data
  },
}
