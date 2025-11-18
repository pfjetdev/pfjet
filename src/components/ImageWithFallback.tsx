'use client'

import { useState } from 'react'
import Image from 'next/image'

interface ImageWithFallbackProps {
  src: string
  alt: string
  fill?: boolean
  className?: string
  priority?: boolean
  width?: number
  height?: number
}

export default function ImageWithFallback({
  src,
  alt,
  fill,
  className,
  priority,
  width,
  height,
}: ImageWithFallbackProps) {
  const [imgSrc, setImgSrc] = useState(src)
  const [hasError, setHasError] = useState(false)

  // Проверяем, является ли изображение placeholder'ом
  const isPlaceholder = src.includes('photo-1506905925346-21bda4d32df4') ||
                        src.includes('photo-1477959858617-67f85cf4f1df')

  // Используем gradient как fallback
  const fallbackGradient = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'

  const handleError = () => {
    setHasError(true)
  }

  if (hasError || isPlaceholder) {
    // Показываем красивый gradient вместо изображения
    return (
      <div
        className={`${className} relative overflow-hidden`}
        style={{
          background: fallbackGradient,
          width: fill ? '100%' : width,
          height: fill ? '100%' : height,
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center text-white/80">
            <svg
              className="w-16 h-16 mx-auto mb-2 opacity-50"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <p className="text-sm font-medium opacity-70">
              {alt}
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Image
      src={imgSrc}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      priority={priority}
      onError={handleError}
    />
  )
}
