'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useWindowScroll } from '@uidotdev/usehooks'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import SearchForm from './SearchForm'
import { Plane, Plus } from 'lucide-react'
import { useFormContext } from '@/contexts/FormContext'
import { cn } from '@/lib/utils'

const HeroSection = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('plane')
  const [focusTrigger, setFocusTrigger] = useState(0)
  const [fieldToFocus, setFieldToFocus] = useState<'from' | 'to' | 'date' | null>(null)
  const [isSticky, setIsSticky] = useState(false)

  // Track window scroll position
  const [{ y }] = useWindowScroll()

  // Use global form context
  const { formData, updateFormData } = useFormContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Motion values for smooth scroll-based animations
  const scrollY = useMotionValue(y ?? 0)
  const formOpacity = useTransform(scrollY, [0, 150, 200], [1, 0.5, 0])
  const formScale = useTransform(scrollY, [0, 150, 200], [1, 0.97, 0.94])

  // Update motion value when scroll changes
  useEffect(() => {
    scrollY.set(y ?? 0)
  }, [y, scrollY])

  // Определяем sticky состояние на основе scroll позиции
  useEffect(() => {
    // Форма становится sticky после прокрутки 200px для более быстрого появления
    const shouldBeSticky = (y ?? 0) > 200

    // Мгновенное обновление для лучшего UX
    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky)
    }
  }, [y, isSticky])

  const handleFormChange = (field: string, value: string) => {
    updateFormData(field, value)
  }

  const handleAddDestination = () => {
    // Sequential validation: check each field and focus the first empty one
    if (!formData.from) {
      setFieldToFocus('from')
      setFocusTrigger(prev => prev + 1)
      return
    }

    if (!formData.to) {
      setFieldToFocus('to')
      setFocusTrigger(prev => prev + 1)
      return
    }

    if (!formData.date) {
      setFieldToFocus('date')
      setFocusTrigger(prev => prev + 1)
      return
    }

    // All required fields filled, navigate to multi-city
    const params = new URLSearchParams({
      from: formData.from,
      to: formData.to,
      date: formData.date,
      time: formData.time,
      passengers: formData.passengers
    })
    router.push(`/multi-city?${params.toString()}`)
  }

  if (!mounted) {
    return null
  }

  const backgroundImage = theme === 'dark' ? '/night.jpg' : '/day.jpg'

  return (
    <section className="w-full px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div 
          className="h-[600px] rounded-3xl border border-border bg-background/50 backdrop-blur-sm flex flex-col items-center justify-start relative overflow-hidden"
          style={{ borderRadius: '24px' }}
        >
          {/* Background Image */}
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ 
              backgroundImage: `url(${backgroundImage})`,
            }}
          />
          
          {/* Overlay */}
          <div className="absolute inset-0 bg-black/40" />
          
          {/* Content */}
          <div className="text-center space-y-6 px-8 relative z-10 mb-8 pt-[60px]">
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white drop-shadow-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Private jet travel
            </h1>
            <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto drop-shadow-md">
              Explore Any Destination Worldwide
            </p>
          </div>

          {/* Forms Container */}
          <div className="relative z-10 w-full px-4 space-y-3">
            {/* Jet Sharing Toggle - остается на месте */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="flex justify-center"
            >
              <div className={cn(
                "flex backdrop-blur-sm rounded-full p-0.5 border transition-all",
                theme === 'dark'
                  ? 'bg-gray-800/80 border-gray-600/50'
                  : 'bg-white/10 border-white/20'
              )}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab('plane')}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                    activeTab === 'plane'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700/50'
                        : 'text-white hover:bg-white/10'
                  )}
                >
                  <Plane size={16} />
                  <span>Private Jet</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => router.push('/jet-sharing')}
                  className={cn(
                    "flex items-center gap-1.5 px-4 py-2 rounded-full transition-all duration-200 text-sm font-medium",
                    activeTab === 'seat'
                      ? 'bg-white text-gray-900 shadow-lg'
                      : theme === 'dark'
                        ? 'text-gray-200 hover:bg-gray-700/50'
                        : 'text-white hover:bg-white/10'
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 24 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.59855 27.1096H7.24941C5.80099 27.1096 4.52631 26.1533 4.12042 24.7633C4.1175 24.753 4.11457 24.7443 4.11311 24.7341C4.11311 24.7341 0.255647 9.09188 0.125569 8.56036C0.0423422 8.26834 0 7.96611 0 7.66241V7.65657V2.10959C0 1.55037 0.221935 1.01451 0.617606 0.618821C1.0133 0.223131 1.54915 0.00121485 2.10837 0.00121485H4.40947C5.32787 0.00121485 6.1105 0.589628 6.39958 1.40874H6.90625C7.31655 1.40874 7.70929 1.57227 7.99987 1.86136C8.29043 2.15192 8.45249 2.54468 8.45249 2.95498V5.73355C8.45249 6.14386 8.28896 6.5366 7.99987 6.82718C7.70931 7.11774 7.31655 7.27979 6.90625 7.27979H6.53393L8.55618 15.7206L9.78414 14.6606C9.91701 14.5467 10.0864 14.4839 10.2616 14.4839H21.2445C21.6475 14.4839 21.9746 14.811 21.9746 15.214C21.9746 15.6169 21.6475 15.944 21.2445 15.944H10.5318L8.93886 17.3194L9.72295 20.5944H20.741C22.5399 20.5944 24 22.0545 24 23.8534C24 25.6523 22.5399 27.1124 20.741 27.1124H17.869L19.3393 33.2593C19.3919 33.4768 19.3408 33.706 19.2021 33.8813C19.0634 34.0565 18.8531 34.1587 18.6297 34.1587H7.83668C7.61329 34.1587 7.40156 34.0565 7.26435 33.8813C7.12564 33.7061 7.07599 33.4768 7.12709 33.2593L8.59742 27.1124L8.59855 27.1096ZM6.51646 5.81842H6.90486C6.92822 5.81842 6.95012 5.80966 6.96618 5.7936C6.98224 5.77754 6.991 5.75564 6.991 5.73228V2.9537C6.991 2.93034 6.98224 2.90844 6.96618 2.89238C6.95012 2.87632 6.92822 2.86756 6.90486 2.86756H6.51646V5.81842ZM10.0995 27.1096L8.76209 32.6959H17.7038L16.3663 27.1096H10.098H10.0995ZM7.24941 25.6495H20.7393C21.7322 25.6495 22.5396 24.8436 22.5396 23.8492C22.5396 22.8564 21.7337 22.0489 20.7393 22.0489H9.146C8.80872 22.0489 8.51524 21.8168 8.43641 21.4897L7.69321 18.3885L6.75 19.2017C6.44484 19.4646 5.98344 19.431 5.72063 19.1258C5.45781 18.8207 5.49139 18.3593 5.79655 18.0965L7.31068 16.7911L5.07672 7.46965C5.06358 7.41417 5.05627 7.35722 5.05627 7.30028V2.10952C5.05627 1.75033 4.76572 1.45977 4.40652 1.45977H2.10542C1.93313 1.45977 1.76814 1.52839 1.64694 1.64958C1.52575 1.77077 1.45713 1.93576 1.45713 2.10807V7.65504V7.66089C1.45713 7.83172 1.48195 8.00109 1.52867 8.16464C1.53159 8.17486 1.53451 8.18362 1.53597 8.19384C1.53597 8.19384 5.38335 23.7934 5.52352 24.3675C5.75275 25.1268 6.45215 25.6481 7.24645 25.6481L7.24941 25.6495ZM20.2153 0C21.2184 0 22.1806 0.398605 22.8902 1.1082C23.5998 1.81779 23.9984 2.78003 23.9984 3.78308V7.01719C23.9984 8.02028 23.5998 8.98248 22.8902 9.69208C22.1806 10.4017 21.2183 10.8003 20.2153 10.8003H20.1832C19.1801 10.8003 18.2179 10.4017 17.5083 9.69208C16.7987 8.98248 16.4001 8.02024 16.4001 7.01719V3.78308C16.4001 2.77999 16.7987 1.81779 17.5083 1.1082C18.2179 0.398605 19.1801 0 20.1832 0H20.2153ZM20.2153 1.46008H20.1832C19.567 1.46008 18.9757 1.70538 18.5406 2.14048C18.104 2.57707 17.8602 3.16694 17.8602 3.78308V7.01719C17.8602 7.63334 18.1055 8.22471 18.5406 8.65979C18.9757 9.09492 19.567 9.34019 20.1832 9.34019H20.2153C20.8314 9.34019 21.4228 9.0949 21.8579 8.65979C22.293 8.22321 22.5383 7.63334 22.5383 7.01719V3.78308C22.5383 3.16694 22.293 2.57557 21.8579 2.14048C21.4213 1.70536 20.8314 1.46008 20.2153 1.46008Z" fill="currentColor"/>
                  </svg>
                  <span>Jet Sharing</span>
                </motion.button>
              </div>
            </motion.div>

            {/* Search Form - with conditional sticky styles */}
            <motion.div
              className="w-full max-w-6xl mx-auto"
              style={{
                opacity: formOpacity,
                scale: formScale,
              }}
              transition={{
                type: "spring",
                stiffness: 100,
                damping: 20
              }}
            >
              <SearchForm
                formData={formData}
                onFormChange={handleFormChange}
                focusTrigger={focusTrigger}
                fieldToFocus={fieldToFocus}
              />
            </motion.div>

            {/* Add Destination Button - остается на месте */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="w-full max-w-6xl mx-auto"
            >
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddDestination}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm",
                  theme === 'dark'
                    ? 'bg-gray-800/80 border border-gray-600/50 text-gray-200 hover:bg-gray-700/80'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                )}
              >
                <Plus size={16} />
                <span>Add a destination</span>
              </motion.button>
            </motion.div>
          </div>

          {/* Bottom Left Text */}
          <div className="absolute bottom-6 left-6 z-10">
            <p className={`text-sm max-w-xs ${
              theme === 'dark'
                ? 'text-gray-200'
                : 'text-white'
            } drop-shadow-md`}>
              Book a private jet to any destination worldwide with unmatched luxury and flexibility.
            </p>
          </div>
        </div>
      </div>

      {/* Sticky Form Portal - appears outside hero when scrolling */}
      <AnimatePresence>
        {isSticky && mounted && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{
              type: "spring",
              stiffness: 500,
              damping: 35,
              mass: 0.5
            }}
            className="fixed top-2 left-0 right-0 z-50 px-2 md:px-4"
          >
            <div className="w-full max-w-[1400px] mx-auto">
              <div className="bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border/50 p-3">
                <SearchForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  focusTrigger={focusTrigger}
                  fieldToFocus={fieldToFocus}
                  isSticky={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default HeroSection