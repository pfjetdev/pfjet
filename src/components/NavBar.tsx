'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Phone, Plane, Route, Mail, ChevronRight, CalendarDays } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { ThemeToggle } from './ThemeToggle'
import { AnimatedMenuIcon } from './AnimatedMenuIcon'
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet'

const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { theme } = useTheme()

  const navigationItems = [
    { name: 'Empty Legs', href: '/empty-legs', icon: Plane, description: 'Browse available flights' },
    { name: 'Events', href: '/events', icon: CalendarDays, description: 'Exclusive VIP events' },
    { name: 'Top Routes', href: '#top-routes', icon: Route, description: 'Popular destinations' },
    { name: 'Our Fleet', href: '/aircraft', icon: Plane, description: 'View our aircraft' },
    { name: 'Contact Us', href: '/contact', icon: Mail, description: 'Get in touch' },
  ]

  return (
    <nav className="w-full py-4 px-4 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Link href="/" className="cursor-pointer">
            <Image
              src={theme === 'dark' ? '/white-logo.svg' : '/black-logo.svg'}
              alt="Logo"
              width={170}
              height={40}
              className="h-5 w-auto"
              priority
              suppressHydrationWarning
            />
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-8">
          {navigationItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className="text-foreground hover:text-primary transition-colors duration-200 font-medium"
            >
              {item.name}
            </a>
          ))}
        </div>

        {/* Right Side - Phone & Theme Toggle */}
        <div className="flex items-center space-x-3">
          {/* Desktop Phone Button with Number */}
          <a
            href="tel:+14158542675"
            className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#DF1F3D' }}
          >
            <Phone className="h-4 w-4 text-white" />
            <span className="text-white font-medium">+1-415-854-2675</span>
          </a>

          {/* Mobile Phone Icon Only */}
          <a
            href="tel:+14158542675"
            className="sm:hidden lg:hidden p-2 rounded-lg transition-all duration-200 active:scale-95"
            style={{ backgroundColor: '#DF1F3D' }}
            aria-label="Call us"
          >
            <Phone className="h-4 w-4 text-white" />
          </a>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button - Always visible */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-all duration-200 hover:scale-110 active:scale-95 relative z-[100]"
            aria-label="Toggle menu"
            style={{ pointerEvents: 'auto' }}
          >
            <AnimatedMenuIcon isOpen={isOpen} />
          </button>

          {/* Mobile Menu - Sheet */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetContent side="right" className="w-[90vw] sm:w-[90vw] p-0 flex flex-col" hideCloseButton>
              {/* Header with gradient */}
              <div className="relative px-4 pt-5 pb-4 border-b border-border/50 bg-gradient-to-br from-primary/5 via-transparent to-transparent">
                <SheetHeader>
                  <SheetTitle className="text-left text-lg font-bold">
                    Menu
                  </SheetTitle>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Explore our services
                  </p>
                </SheetHeader>
                {/* Decorative element */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-3xl -z-10" />
              </div>

              {/* Scrollable content */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {/* Menu Items */}
                <div className="flex flex-col gap-1.5">
                  {navigationItems.map((item, index) => {
                    const Icon = item.icon
                    return (
                      <a
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="group relative flex items-center gap-3 p-3 rounded-xl hover:bg-gradient-to-br hover:from-primary/10 hover:to-primary/5 transition-all duration-300 overflow-hidden border border-transparent hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10"
                        style={{
                          animationDelay: `${index * 75}ms`,
                          animation: isOpen ? 'slideInBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                          opacity: 0
                        }}
                      >
                        {/* Icon with gradient background */}
                        <div className="relative flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-sm">
                          <Icon className="h-4 w-4 text-primary" />
                          {/* Shine effect */}
                          <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-foreground group-hover:text-primary transition-colors duration-200">
                            {item.name}
                          </div>
                          <div className="text-xs text-muted-foreground group-hover:text-foreground/70 transition-colors">
                            {item.description}
                          </div>
                        </div>

                        {/* Arrow with animation */}
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all duration-300" />

                        {/* Animated gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/0 via-primary/5 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10"
                             style={{
                               background: 'linear-gradient(90deg, transparent, rgba(var(--primary), 0.05) 50%, transparent)',
                               animation: 'shimmer 2s infinite'
                             }}
                        />
                      </a>
                    )
                  })}
                </div>

                {/* Divider with style */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border/50"></div>
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-3 text-muted-foreground font-medium">
                      Contact
                    </span>
                  </div>
                </div>

                {/* Contact Section - Enhanced */}
                <div className="space-y-3">
                  <a
                    href="tel:+14158542675"
                    className="group relative flex items-center gap-3 p-3.5 rounded-xl overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-xl"
                    style={{
                      backgroundColor: '#DF1F3D',
                      animation: isOpen ? 'slideInBounce 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' : 'none',
                      animationDelay: `${navigationItems.length * 75}ms`,
                      opacity: 0
                    }}
                  >
                    {/* Animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/10 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity"
                         style={{ animation: 'shimmer 2s infinite' }}
                    />

                    <div className="relative w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                      <Phone className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1 relative z-10">
                      <div className="text-white/90 text-[10px] font-medium uppercase tracking-wider">
                        Call us now
                      </div>
                      <div className="text-white font-bold text-sm mt-0.5">
                        +1-415-854-2675
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-300" />
                  </a>

                  {/* Additional info card */}
                  <div className="p-3 rounded-xl bg-muted/50 backdrop-blur-sm border border-border/50">
                    <p className="text-xs text-muted-foreground">
                      Available 24/7 for your private aviation needs
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer - Enhanced */}
              <div className="px-4 py-3 border-t border-border/50 bg-muted/30 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <div className="text-[10px] text-muted-foreground">
                    © 2025 Private Jet Services
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] text-muted-foreground">Online</span>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>

      <style jsx>{`
        @keyframes slideInBounce {
          from {
            opacity: 0;
            transform: translateX(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateX(0) scale(1);
          }
        }

        @keyframes shimmer {
          0% {
            transform: translateX(-100%);
          }
          100% {
            transform: translateX(100%);
          }
        }
      `}</style>
    </nav>
  )
}

export default NavBar