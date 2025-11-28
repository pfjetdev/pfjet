'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useWindowScroll } from '@uidotdev/usehooks'
import { motion, AnimatePresence, useMotionValue, useTransform } from 'framer-motion'
import Image from 'next/image'
import SearchForm from './SearchForm'
import MobileSearchForm from './MobileSearchForm'
import { Plane, Plus, Search, MoveRight, AlertCircle } from 'lucide-react'
import { toast } from 'sonner'
import { useFormContext } from '@/contexts/FormContext'
import { cn } from '@/lib/utils'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"

const HeroSection = () => {
  const { theme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [activeTab, setActiveTab] = useState('plane')
  const [focusTrigger, setFocusTrigger] = useState(0)
  const [fieldToFocus, setFieldToFocus] = useState<'from' | 'to' | 'date' | null>(null)
  const [isSticky, setIsSticky] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const [isMobileStickyVisible, setIsMobileStickyVisible] = useState(false)
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false)

  // Track window scroll position
  const [{ y }] = useWindowScroll()

  // Check screen size on mount and resize
  useEffect(() => {
    const checkScreenSize = () => {
      setIsDesktop(window.innerWidth >= 768)
    }

    checkScreenSize()
    window.addEventListener('resize', checkScreenSize)

    return () => window.removeEventListener('resize', checkScreenSize)
  }, [])

  // Use global form context
  const { formData, updateFormData, mobileDrawerTrigger } = useFormContext()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Handle mobile drawer trigger from context (e.g., when clicking on TopRoutes on mobile)
  // Use ref to track previous value and only react to actual changes, not initial mount
  const prevMobileDrawerTrigger = useRef(mobileDrawerTrigger)
  useEffect(() => {
    if (mobileDrawerTrigger > 0 && mobileDrawerTrigger !== prevMobileDrawerTrigger.current) {
      setIsMobileSearchOpen(true)
    }
    prevMobileDrawerTrigger.current = mobileDrawerTrigger
  }, [mobileDrawerTrigger])

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
    const scrollPosition = y ?? 0

    // Desktop: полная форма становится sticky после прокрутки 200px
    const shouldBeSticky = isDesktop && scrollPosition > 200

    // Mobile: компактная полоска появляется после прокрутки 300px
    const shouldShowMobileSticky = !isDesktop && scrollPosition > 300

    // Мгновенное обновление для лучшего UX
    if (shouldBeSticky !== isSticky) {
      setIsSticky(shouldBeSticky)
    }

    if (shouldShowMobileSticky !== isMobileStickyVisible) {
      setIsMobileStickyVisible(shouldShowMobileSticky)
    }
  }, [y, isSticky, isDesktop, isMobileStickyVisible])

  const handleFormChange = (field: string, value: string) => {
    updateFormData(field, value)
  }

  const handleAddDestination = () => {
    // Check if we're on mobile
    const isMobileView = !isDesktop

    // Sequential validation: check each field and focus/show error for the first empty one
    if (!formData.from) {
      if (isMobileView) {
        // On mobile, open the drawer and show toast
        setIsMobileSearchOpen(true)
        toast.error('Select departure airport', {
          description: 'Please select where you\'re flying from first.',
          icon: <AlertCircle className="w-5 h-5" />,
        })
      } else {
        setFieldToFocus('from')
        setFocusTrigger(prev => prev + 1)
      }
      return
    }

    if (!formData.to) {
      if (isMobileView) {
        setIsMobileSearchOpen(true)
        toast.error('Select destination airport', {
          description: 'Please select where you\'re flying to.',
          icon: <AlertCircle className="w-5 h-5" />,
        })
      } else {
        setFieldToFocus('to')
        setFocusTrigger(prev => prev + 1)
      }
      return
    }

    if (!formData.date) {
      if (isMobileView) {
        setIsMobileSearchOpen(true)
        toast.error('Select departure date', {
          description: 'Please select when you want to fly.',
          icon: <AlertCircle className="w-5 h-5" />,
        })
      } else {
        setFieldToFocus('date')
        setFocusTrigger(prev => prev + 1)
      }
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

  return (
    <section className="w-full px-4">
      <div className="max-w-7xl mx-auto">
        <div
          className="min-h-[700px] md:h-[600px] md:rounded-3xl md:border md:border-border bg-background/50 backdrop-blur-sm flex flex-col items-center justify-start relative overflow-hidden pb-6"
        >
          {/* Background Image - hidden on mobile, using next/image for optimization */}
          {/* Light theme image - shown by default, hidden when dark theme is active */}
          {/* Only render on desktop to avoid loading 72KB image on mobile where it's hidden */}
          {isDesktop && (
            <div className="absolute inset-0">
              <Image
                src="/day.jpg"
                alt="Private jet background"
                fill
                priority
                fetchPriority="high"
                quality={85}
                className={cn(
                  "object-cover object-center transition-opacity duration-300",
                  mounted && theme === 'dark' ? "opacity-0" : "opacity-100"
                )}
                sizes="(min-width: 768px) 100vw, 0px"
              />
              {/* Dark theme image - only visible when dark theme is active */}
              {mounted && theme === 'dark' && (
                <Image
                  src="/night.jpg"
                  alt="Private jet background"
                  fill
                  loading="lazy"
                  quality={85}
                  className="object-cover object-center opacity-100"
                  sizes="(min-width: 768px) 100vw, 0px"
                />
              )}
            </div>
          )}

          {/* Overlay - hidden on mobile */}
          <div className="hidden md:block absolute inset-0 bg-black/20" />
          
          {/* Content */}
          <div className="text-center md:text-center space-y-3 md:space-y-6 px-0 md:px-8 relative z-10 mb-6 md:mb-8 pt-[40px] md:pt-[60px] w-full">
            <div className="text-left md:text-center space-y-1 md:space-y-2">
              <h1 className="text-3xl md:text-6xl lg:text-7xl font-bold text-foreground md:text-white drop-shadow-lg" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Private jet travel
              </h1>
            </div>
            <p className="text-left md:text-center text-base md:text-xl text-foreground/80 md:text-white/90 md:max-w-2xl md:mx-auto drop-shadow-md">
              Explore Any Destination Worldwide
            </p>

            {/* Mobile Jet Sharing Toggle - visible on mobile only */}
            <div className="md:hidden flex justify-start">
              <div className={cn(
                "flex backdrop-blur-sm rounded-full p-0.5 border transition-all",
                theme === 'dark'
                  ? 'bg-gray-800/80 border-gray-600/50'
                  : 'bg-gray-100 border-gray-300'
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
                        : 'text-gray-700 hover:bg-gray-200'
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
                        : 'text-gray-700 hover:bg-gray-200'
                  )}
                >
                  <svg width="16" height="16" viewBox="0 0 24 35" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" clipRule="evenodd" d="M8.59855 27.1096H7.24941C5.80099 27.1096 4.52631 26.1533 4.12042 24.7633C4.1175 24.753 4.11457 24.7443 4.11311 24.7341C4.11311 24.7341 0.255647 9.09188 0.125569 8.56036C0.0423422 8.26834 0 7.96611 0 7.66241V7.65657V2.10959C0 1.55037 0.221935 1.01451 0.617606 0.618821C1.0133 0.223131 1.54915 0.00121485 2.10837 0.00121485H4.40947C5.32787 0.00121485 6.1105 0.589628 6.39958 1.40874H6.90625C7.31655 1.40874 7.70929 1.57227 7.99987 1.86136C8.29043 2.15192 8.45249 2.54468 8.45249 2.95498V5.73355C8.45249 6.14386 8.28896 6.5366 7.99987 6.82718C7.70931 7.11774 7.31655 7.27979 6.90625 7.27979H6.53393L8.55618 15.7206L9.78414 14.6606C9.91701 14.5467 10.0864 14.4839 10.2616 14.4839H21.2445C21.6475 14.4839 21.9746 14.811 21.9746 15.214C21.9746 15.6169 21.6475 15.944 21.2445 15.944H10.5318L8.93886 17.3194L9.72295 20.5944H20.741C22.5399 20.5944 24 22.0545 24 23.8534C24 25.6523 22.5399 27.1124 20.741 27.1124H17.869L19.3393 33.2593C19.3919 33.4768 19.3408 33.706 19.2021 33.8813C19.0634 34.0565 18.8531 34.1587 18.6297 34.1587H7.83668C7.61329 34.1587 7.40156 34.0565 7.26435 33.8813C7.12564 33.7061 7.07599 33.4768 7.12709 33.2593L8.59742 27.1124L8.59855 27.1096ZM6.51646 5.81842H6.90486C6.92822 5.81842 6.95012 5.80966 6.96618 5.7936C6.98224 5.77754 6.991 5.75564 6.991 5.73228V2.9537C6.991 2.93034 6.98224 2.90844 6.96618 2.89238C6.95012 2.87632 6.92822 2.86756 6.90486 2.86756H6.51646V5.81842ZM10.0995 27.1096L8.76209 32.6959H17.7038L16.3663 27.1096H10.098H10.0995ZM7.24941 25.6495H20.7393C21.7322 25.6495 22.5396 24.8436 22.5396 23.8492C22.5396 22.8564 21.7337 22.0489 20.7393 22.0489H9.146C8.80872 22.0489 8.51524 21.8168 8.43641 21.4897L7.69321 18.3885L6.75 19.2017C6.44484 19.4646 5.98344 19.431 5.72063 19.1258C5.45781 18.8207 5.49139 18.3593 5.79655 18.0965L7.31068 16.7911L5.07672 7.46965C5.06358 7.41417 5.05627 7.35722 5.05627 7.30028V2.10952C5.05627 1.75033 4.76572 1.45977 4.40652 1.45977H2.10542C1.93313 1.45977 1.76814 1.52839 1.64694 1.64958C1.52575 1.77077 1.45713 1.93576 1.45713 2.10807V7.65504V7.66089C1.45713 7.83172 1.48195 8.00109 1.52867 8.16464C1.53159 8.17486 1.53451 8.18362 1.53597 8.19384C1.53597 8.19384 5.38335 23.7934 5.52352 24.3675C5.75275 25.1268 6.45215 25.6481 7.24645 25.6481L7.24941 25.6495ZM20.2153 0C21.2184 0 22.1806 0.398605 22.8902 1.1082C23.5998 1.81779 23.9984 2.78003 23.9984 3.78308V7.01719C23.9984 8.02028 23.5998 8.98248 22.8902 9.69208C22.1806 10.4017 21.2183 10.8003 20.2153 10.8003H20.1832C19.1801 10.8003 18.2179 10.4017 17.5083 9.69208C16.7987 8.98248 16.4001 8.02024 16.4001 7.01719V3.78308C16.4001 2.77999 16.7987 1.81779 17.5083 1.1082C18.2179 0.398605 19.1801 0 20.1832 0H20.2153ZM20.2153 1.46008H20.1832C19.567 1.46008 18.9757 1.70538 18.5406 2.14048C18.104 2.57707 17.8602 3.16694 17.8602 3.78308V7.01719C17.8602 7.63334 18.1055 8.22471 18.5406 8.65979C18.9757 9.09492 19.567 9.34019 20.1832 9.34019H20.2153C20.8314 9.34019 21.4228 9.0949 21.8579 8.65979C22.293 8.22321 22.5383 7.63334 22.5383 7.01719V3.78308C22.5383 3.16694 22.293 2.57557 21.8579 2.14048C21.4213 1.70536 20.8314 1.46008 20.2153 1.46008Z" fill="currentColor"/>
                  </svg>
                  <span>Jet Sharing</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Forms Container */}
          <div className="relative z-10 w-full px-0 md:px-4 space-y-3">
            {/* Jet Sharing Toggle - visible on desktop only */}
            <div className="hidden md:flex justify-center">
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
            </div>

            {/* Desktop Search Form - hidden on mobile */}
            <motion.div
              className="hidden md:block w-full max-w-6xl mx-auto"
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

            {/* Mobile Search Form - visible on mobile only */}
            <div className="md:hidden w-full max-w-md mx-auto">
              <MobileSearchForm
                formData={formData}
                onFormChange={handleFormChange}
              />
            </div>

            {/* Add Destination Button */}
            <div className="w-full max-w-6xl mx-auto">
              <motion.button
                whileHover={{ scale: 1.02, x: 2 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleAddDestination}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 text-sm font-medium backdrop-blur-sm",
                  theme === 'dark'
                    ? 'bg-gray-800/80 border border-gray-600/50 text-gray-200 hover:bg-gray-700/80'
                    : 'bg-white border border-gray-200 text-gray-900 hover:bg-gray-50 shadow-sm'
                )}
              >
                <Plus size={16} />
                <span>Add a destination</span>
              </motion.button>
            </div>
          </div>

          {/* Bottom Left Text - hidden on mobile */}
          <div className="hidden md:block absolute bottom-6 left-6 z-10">
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
              <div className={cn(
                "backdrop-blur-md rounded-2xl shadow-2xl p-3",
                theme === 'dark'
                  ? "bg-white/95 border border-border/20"
                  : "bg-[#0F142E]/95 border border-white/10"
              )}>
                <SearchForm
                  formData={formData}
                  onFormChange={handleFormChange}
                  isSticky={true}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Sticky Search Bar - compact version at top */}
      <AnimatePresence>
        {isMobileStickyVisible && mounted && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{
              type: "spring",
              stiffness: 400,
              damping: 30
            }}
            className="fixed top-2 left-4 right-4 z-50 md:hidden"
          >
            <button
              onClick={() => setIsMobileSearchOpen(true)}
              className={cn(
                "w-full backdrop-blur-md rounded-2xl shadow-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform",
                theme === 'dark'
                  ? "bg-white/95 border border-border/20"
                  : "bg-[#0F142E]/95 border border-white/10"
              )}
            >
              <div className="flex items-center gap-3 flex-1">
                <div className="p-2 rounded-lg bg-[#DF1F3D]/20">
                  <Search className="w-5 h-5 text-[#DF1F3D]" />
                </div>
                <div className="text-left flex-1">
                  {formData.from && formData.to ? (
                    <p className={cn(
                      "text-sm font-semibold",
                      theme === 'dark' ? "text-foreground" : "text-white"
                    )}>
                      {formData.from} → {formData.to}
                    </p>
                  ) : (
                    <p className={cn(
                      "text-sm font-semibold",
                      theme === 'dark' ? "text-muted-foreground" : "text-white/70"
                    )}>
                      Search flights
                    </p>
                  )}
                  {formData.date && (
                    <p className={cn(
                      "text-xs",
                      theme === 'dark' ? "text-muted-foreground" : "text-white/60"
                    )}>
                      {formData.date}
                    </p>
                  )}
                </div>
              </div>
              <div className="p-2 rounded-lg bg-[#DF1F3D]">
                <MoveRight className="w-4 h-4 text-white" />
              </div>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mobile Search Drawer */}
      <Drawer open={isMobileSearchOpen} onOpenChange={setIsMobileSearchOpen}>
        <DrawerContent className="h-[95vh]">
          <DrawerHeader>
            <DrawerTitle className="text-2xl font-semibold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
              Search Flights
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-4 pb-6 overflow-y-auto">
            <MobileSearchForm
              formData={formData}
              onFormChange={handleFormChange}
            />
          </div>
        </DrawerContent>
      </Drawer>
    </section>
  )
}

export default HeroSection