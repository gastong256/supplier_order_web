import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router'
import { authApi } from '../api/authApi'
import { useAuthStore } from '../store/authStore'
import type { LoginCredentials } from '../types/auth.types'

export function useLogin() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),

    onSuccess: (data) => {
      localStorage.setItem('access_token', data.tokens.accessToken)
      setAuth(data.user, data.tokens.accessToken)
      void navigate('/', { replace: true })
    },

    onError: (error) => {
      console.error('Login failed:', error)
    },
  })
}
