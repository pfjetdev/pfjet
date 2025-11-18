'use client'

import { useEffect, useState, useRef } from 'react'
import { X, Calendar, MapPin } from 'lucide-react'

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  event: {
    title: string
    price: string
    description?: string
    date?: string
    location?: string
    capacity?: string
    image?: string
  }
}

const EventModal = ({ isOpen, onClose, event }: EventModalProps) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const modalRef = useRef<HTMLDivElement>(null)
  const startY = useRef(0)

  // Управление анимацией появления/исчезновения
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
      // Небольшая задержка для плавного появления
      setTimeout(() => setIsAnimating(true), 10)
    } else {
      setIsAnimating(false)
      setDragY(0)
      setIsDragging(false)
      // Ждем завершения анимации перед скрытием
      setTimeout(() => setIsVisible(false), 300)
    }
  }, [isOpen])

  // Обработка свайпа
  const handleTouchStart = (e: React.TouchEvent) => {
    startY.current = e.touches[0].clientY
    setIsDragging(true)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return
    
    const currentY = e.touches[0].clientY
    const deltaY = currentY - startY.current
    
    // Разрешаем только свайп вниз
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleTouchEnd = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    // Если свайп больше 100px, закрываем модалку
    if (dragY > 100) {
      onClose()
    } else {
      // Возвращаем в исходное положение
      setDragY(0)
    }
  }

  // Обработка мыши для десктопа
  const handleMouseDown = (e: React.MouseEvent) => {
    startY.current = e.clientY
    setIsDragging(true)
  }

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return
    
    const deltaY = e.clientY - startY.current
    
    if (deltaY > 0) {
      setDragY(deltaY)
    }
  }

  const handleMouseUp = () => {
    if (!isDragging) return
    
    setIsDragging(false)
    
    if (dragY > 100) {
      onClose()
    } else {
      setDragY(0)
    }
  }

  // Добавляем обработчики мыши для десктопа
  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove)
      document.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragY])

  // Закрытие модалки по Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isVisible) return null

  const opacity = Math.max(0, 1 - dragY / 300)
  const translateY = isDragging ? dragY : 0

  return (
    <div className="fixed inset-0 z-50">
      {/* Backdrop */}
      <div 
        className={`absolute inset-0 bg-black transition-opacity duration-300 ease-out`}
        style={{ 
          opacity: isAnimating ? 0.5 * opacity : 0 
        }}
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="absolute inset-x-0 bottom-0 flex justify-center">
        <div 
          ref={modalRef}
          className={`
            w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded-t-3xl shadow-2xl
            transform transition-transform duration-300 ease-out
            ${isAnimating && !isDragging ? 'translate-y-0' : ''}
          `}
          style={{
            transform: `translateY(${
              isAnimating && !isDragging 
                ? '0px' 
                : isDragging 
                  ? `${translateY}px` 
                  : '100%'
            })`
          }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
        >
          {/* Handle */}
          <div className="flex justify-center pt-4 pb-2">
            <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full cursor-pointer" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 pb-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Event Details
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
            </button>
          </div>

          {/* Content */}
          <div className="px-6 pb-8 space-y-6 max-h-[70vh] overflow-y-auto">
            {/* Event Image */}
            {event.image && (
              <div className="w-full h-48 rounded-lg overflow-hidden mb-6">
                <img 
                  src={event.image} 
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Event Title and Price */}
            <div className="flex justify-between items-start mb-6">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                {event.title}
              </h3>
              <div className="text-right">
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{event.price}</p>
              </div>
            </div>

            {/* Event Details - In One Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {event.date && (
                <div className="flex items-center space-x-3">
                  <Calendar className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Date</p>
                    <p className="text-gray-900 dark:text-white font-medium text-sm">{event.date}</p>
                  </div>
                </div>
              )}

              {event.location && (
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-gray-600 dark:text-gray-400 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Location</p>
                    <p className="text-gray-900 dark:text-white font-medium text-sm">{event.location}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            {event.description && (
              <div>
                <h4 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                  Description
                </h4>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {event.description}
                </p>
              </div>
            )}

            {/* Action Button */}
            <div className="pt-4 pb-4">
              <button 
                className="w-full text-white px-8 py-4 rounded-lg font-medium transition-colors duration-200 shadow-lg hover:opacity-90"
                style={{ backgroundColor: 'var(--brand-red)' }}
              >
                Ask for details
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EventModal