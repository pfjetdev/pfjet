'use client'

import { useState } from 'react'
import { useTheme } from 'next-themes'
import { Phone, Menu, X } from 'lucide-react'
import Image from 'next/image'
import { ThemeToggle } from './ThemeToggle'

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { theme } = useTheme()

  const navigationItems = [
    { name: 'Empty Legs', href: '/empty-legs' },
    { name: 'Top Routes', href: '#top-routes' },
    { name: 'Our Fleet', href: '/aircraft' },
    { name: 'Contact Us', href: '#contact' },
  ]

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="w-full py-4 px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <div className="flex-shrink-0">
          <Image
            src={theme === 'dark' ? '/white-logo.svg' : '/black-logo.svg'}
            alt="Logo"
            width={170}
            height={40}
            className="h-5 w-auto"
            priority
          />
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
        <div className="flex items-center space-x-4">
          {/* Phone Button */}
          <a
            href="tel:+14158542675"
            className="hidden sm:flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105"
            style={{ backgroundColor: '#DF1F3D' }}
          >
            <Phone className="h-4 w-4 text-white" />
            <span className="text-white font-medium">+1-415-854-2675</span>
          </a>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* Mobile Menu Button */}
          <button
            onClick={toggleMenu}
            className="lg:hidden p-2 rounded-md text-foreground hover:bg-muted transition-colors"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden mt-4 pb-4 border-t border-border">
          <div className="flex flex-col space-y-4 pt-4">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-200 font-medium px-2 py-1"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </a>
            ))}
            
            {/* Mobile Phone Button */}
            <a
              href="tel:+14158542675"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 hover:scale-105 w-fit"
              style={{ backgroundColor: '#DF1F3D' }}
            >
              <Phone className="h-4 w-4 text-white" />
              <span className="text-white font-medium">+1-415-854-2675</span>
            </a>
          </div>
        </div>
      )}
    </nav>
  )
}

export default NavBar