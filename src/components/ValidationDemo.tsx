'use client'

import { useState } from 'react'
import { validateData, userProfileSchema } from '@/schemas/validationSchemas'

export default function ValidationDemo() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: ''
  })
  const [validationResult, setValidationResult] = useState<{
    success: boolean
    data?: any
    errors?: string[]
  } | null>(null)

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleValidate = () => {
    const dataToValidate = {
      ...formData,
      age: formData.age ? parseInt(formData.age) : undefined
    }
    
    const result = validateData(userProfileSchema, dataToValidate)
    setValidationResult(result)
  }

  return (
    <div className="p-6 bg-card rounded-lg border border-border shadow-sm">
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Name:
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
            placeholder="Enter name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Email:
          </label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => handleInputChange('email', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
            placeholder="Enter email"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-card-foreground mb-2">
            Age:
          </label>
          <input
            type="number"
            value={formData.age}
            onChange={(e) => handleInputChange('age', e.target.value)}
            className="w-full px-3 py-2 border border-input bg-background text-foreground rounded-md focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
            placeholder="Enter age"
          />
        </div>
        
        <button
          onClick={handleValidate}
          className="w-full py-2 px-4 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 font-medium transition-colors"
        >
          Validate
        </button>
        
        {validationResult && (
          <div className={`mt-4 p-4 rounded-md border ${
            validationResult.success 
              ? 'bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-800' 
              : 'bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-800'
          }`}>
            {validationResult.success ? (
              <div>
                <p className="text-green-800 dark:text-green-200 font-medium mb-2 flex items-center gap-2">
                  <span className="text-green-600 dark:text-green-400">✅</span>
                  Validation successful!
                </p>
                <pre className="text-sm text-green-700 dark:text-green-300 bg-green-100 dark:bg-green-900/30 p-3 rounded border overflow-x-auto">
                  {JSON.stringify(validationResult.data, null, 2)}
                </pre>
              </div>
            ) : (
              <div>
                <p className="text-red-800 dark:text-red-200 font-medium mb-2 flex items-center gap-2">
                  <span className="text-red-600 dark:text-red-400">❌</span>
                  Validation errors:
                </p>
                <ul className="text-sm text-red-700 dark:text-red-300 space-y-1">
                  {validationResult.errors?.map((error, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-red-500 dark:text-red-400 mt-0.5">•</span>
                      <span>{error}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}