'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { userRegistrationSchema, type UserRegistrationData } from '@/schemas/validationSchemas'
import { useStore } from '@/store/useStore'
import { useState } from 'react'

export default function UserRegistrationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { setUser, setLoading } = useStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
    reset,
    watch
  } = useForm<UserRegistrationData>({
    resolver: zodResolver(userRegistrationSchema),
    mode: 'onChange'
  })

  const onSubmit = async (data: UserRegistrationData) => {
    setIsSubmitting(true)
    setLoading(true)
    
    try {
      // Симуляция API запроса
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Создаем пользователя из данных формы
      const newUser = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        age: data.age
      }
      
      setUser(newUser)
      reset()
      alert('Регистрация успешно завершена!')
    } catch (error) {
      alert('Ошибка при регистрации')
    } finally {
      setIsSubmitting(false)
      setLoading(false)
    }
  }

  const password = watch('password')

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-card rounded-lg shadow-md border border-border">
      <h2 className="text-2xl font-bold mb-6 text-center text-card-foreground">
        Регистрация
      </h2>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {/* Имя */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-foreground mb-1">
            Имя
          </label>
          <input
            {...register('name')}
            type="text"
            id="name"
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.name ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Введите ваше имя"
          />
          {errors.name && (
            <p className="mt-1 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1">
            Email
          </label>
          <input
            {...register('email')}
            type="email"
            id="email"
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.email ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Введите ваш email"
          />
          {errors.email && (
            <p className="mt-1 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        {/* Пароль */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-foreground mb-1">
            Пароль
          </label>
          <input
            {...register('password')}
            type="password"
            id="password"
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.password ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Введите пароль"
          />
          {errors.password && (
            <p className="mt-1 text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {/* Подтверждение пароля */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-foreground mb-1">
            Подтвердите пароль
          </label>
          <input
            {...register('confirmPassword')}
            type="password"
            id="confirmPassword"
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.confirmPassword ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Подтвердите пароль"
          />
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        {/* Возраст */}
        <div>
          <label htmlFor="age" className="block text-sm font-medium text-foreground mb-1">
            Возраст
          </label>
          <input
            {...register('age', { valueAsNumber: true })}
            type="number"
            id="age"
            min="18"
            max="120"
            className={`w-full px-3 py-2 border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring ${
              errors.age ? 'border-destructive' : 'border-input'
            }`}
            placeholder="Введите ваш возраст"
          />
          {errors.age && (
            <p className="mt-1 text-sm text-destructive">{errors.age.message}</p>
          )}
        </div>

        {/* Согласие с условиями */}
        <div className="flex items-center">
          <input
            {...register('terms')}
            type="checkbox"
            id="terms"
            className="h-4 w-4 text-primary focus:ring-ring border-input rounded"
          />
          <label htmlFor="terms" className="ml-2 block text-sm text-foreground">
            Я согласен с условиями использования
          </label>
        </div>
        {errors.terms && (
          <p className="text-sm text-destructive">{errors.terms.message}</p>
        )}

        {/* Кнопка отправки */}
        <button
          type="submit"
          disabled={!isValid || isSubmitting}
          className={`w-full py-2 px-4 rounded-md font-medium transition-colors ${
            isValid && !isSubmitting
              ? 'bg-primary hover:bg-primary/90 text-primary-foreground'
              : 'bg-muted text-muted-foreground cursor-not-allowed'
          }`}
        >
          {isSubmitting ? 'Регистрация...' : 'Зарегистрироваться'}
        </button>
      </form>
    </div>
  )
}