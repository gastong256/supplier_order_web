import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { loginSchema } from '../schemas/loginSchema'
import { useLogin } from '../hooks/useLogin'
import type { LoginFormValues } from '../schemas/loginSchema'

export function LoginForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const loginMutation = useLogin()

  const onSubmit = (values: LoginFormValues) => {
    loginMutation.mutate(values)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input
        label="Email"
        type="email"
        placeholder="you@example.com"
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Password"
        type="password"
        placeholder="••••••••"
        error={errors.password?.message}
        {...register('password')}
      />

      {loginMutation.isError && (
        <p role="alert" className="text-sm font-medium text-destructive">
          {loginMutation.error instanceof Error
            ? loginMutation.error.message
            : 'Login failed. Please try again.'}
        </p>
      )}

      <Button type="submit" isLoading={loginMutation.isPending} className="w-full">
        {loginMutation.isPending ? 'Signing in...' : 'Sign in'}
      </Button>
    </form>
  )
}
