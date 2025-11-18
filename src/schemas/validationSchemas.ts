import { z } from 'zod'

// Схема для регистрации пользователя
export const userRegistrationSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  
  email: z
    .string()
    .email('Введите корректный email адрес')
    .min(1, 'Email обязателен'),
  
  password: z
    .string()
    .min(8, 'Пароль должен содержать минимум 8 символов')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 
      'Пароль должен содержать минимум одну заглавную букву, одну строчную букву и одну цифру'),
  
  confirmPassword: z.string(),
  
  age: z
    .number()
    .min(18, 'Возраст должен быть не менее 18 лет')
    .max(120, 'Возраст не должен превышать 120 лет'),
  
  terms: z
    .boolean()
    .refine(val => val === true, 'Необходимо согласиться с условиями использования')
}).refine(data => data.password === data.confirmPassword, {
  message: 'Пароли не совпадают',
  path: ['confirmPassword']
})

// Схема для входа в систему
export const loginSchema = z.object({
  email: z
    .string()
    .email('Введите корректный email адрес')
    .min(1, 'Email обязателен'),
  
  password: z
    .string()
    .min(1, 'Пароль обязателен'),
  
  rememberMe: z.boolean().optional()
})

// Схема для профиля пользователя
export const userProfileSchema = z.object({
  name: z
    .string()
    .min(2, 'Имя должно содержать минимум 2 символа')
    .max(50, 'Имя не должно превышать 50 символов'),
  
  email: z
    .string()
    .email('Введите корректный email адрес'),
  
  bio: z
    .string()
    .max(500, 'Биография не должна превышать 500 символов')
    .optional(),
  
  website: z
    .string()
    .url('Введите корректный URL')
    .optional()
    .or(z.literal('')),
  
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Введите корректный номер телефона')
    .optional()
    .or(z.literal(''))
})

// Схема для создания поста
export const postSchema = z.object({
  title: z
    .string()
    .min(5, 'Заголовок должен содержать минимум 5 символов')
    .max(100, 'Заголовок не должен превышать 100 символов'),
  
  content: z
    .string()
    .min(10, 'Содержание должно содержать минимум 10 символов')
    .max(5000, 'Содержание не должно превышать 5000 символов'),
  
  tags: z
    .array(z.string().min(1, 'Тег не может быть пустым'))
    .max(5, 'Максимум 5 тегов')
    .optional(),
  
  published: z.boolean().default(false)
})

// Типы, выведенные из схем
export type UserRegistrationData = z.infer<typeof userRegistrationSchema>
export type LoginData = z.infer<typeof loginSchema>
export type UserProfileData = z.infer<typeof userProfileSchema>
export type PostData = z.infer<typeof postSchema>

// Функция для валидации данных
export const validateData = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.issues.map((err: z.ZodIssue) => err.message)
      return { success: false, errors }
    }
    return { success: false, errors: ['Неизвестная ошибка валидации'] }
  }
}