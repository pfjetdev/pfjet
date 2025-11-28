'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MoveRight, Plane, Car, Hotel, Gift, X, Check, Phone, ArrowUpRight } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer"
import { useIsMobile } from "@/hooks/useIsMobile"
import { cn } from "@/lib/utils"

const packages = [
  {
    id: 'jet',
    title: 'Private Jet',
    subtitle: 'Luxury air travel',
    image: '/jet.jpg',
    icon: Plane,
    description: 'Experience the ultimate in air travel with our fleet of meticulously maintained private jets. Skip the lines, avoid crowded terminals, and arrive refreshed.',
    features: [
      'Access to 5,000+ airports worldwide',
      'Flexible departure times',
      'Personalized in-flight catering',
      'Dedicated flight crew',
      'Wi-Fi and entertainment systems',
      'Pet-friendly cabins available'
    ],
    startingPrice: 'From $5,000/hour'
  },
  {
    id: 'transfer',
    title: 'Luxury Transfer',
    subtitle: 'Premium ground transport',
    image: '/car.jpg',
    icon: Car,
    description: 'Seamless door-to-door transportation in our fleet of luxury vehicles. Professional chauffeurs ensure you travel in comfort and style.',
    features: [
      'Mercedes S-Class, BMW 7 Series, Rolls Royce',
      'Professional uniformed chauffeurs',
      'Meet & greet at airports',
      'Real-time flight tracking',
      'Complimentary refreshments',
      '24/7 availability'
    ],
    startingPrice: 'From $150/transfer'
  },
  {
    id: 'hotel',
    title: 'Hotel',
    subtitle: 'Luxury accommodations',
    image: '/hotel.jpg',
    icon: Hotel,
    description: 'Stay at the world\'s finest hotels and resorts. We partner with leading luxury properties to ensure exceptional experiences.',
    features: [
      '5-star hotels and exclusive resorts',
      'VIP check-in and room upgrades',
      'Best rate guarantee',
      'Concierge services',
      'Spa and wellness access',
      'Fine dining reservations'
    ],
    startingPrice: 'From $500/night'
  },
  {
    id: 'bonus',
    title: 'Exclusive Bonuses',
    subtitle: 'Special perks and rewards',
    image: '/bonus.jpg',
    icon: Gift,
    description: 'Unlock exclusive benefits when you book complete packages. Our loyal clients enjoy special perks that enhance every journey.',
    features: [
      'Priority booking for peak seasons',
      'Complimentary upgrades',
      'Access to exclusive events',
      'Personal travel concierge',
      'Loyalty rewards program',
      'Special occasion arrangements'
    ],
    startingPrice: 'Included with packages'
  }
]

interface PackageModalProps {
  pkg: typeof packages[0] | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface OrderFormModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

// Package Order Form Component
function PackageOrderForm({ onSuccess }: { onSuccess?: () => void }) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [selectedServices, setSelectedServices] = useState<string[]>(['jet', 'bonus'])
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const services = [
    { id: 'jet', label: 'Private Jet', icon: Plane, alwaysIncluded: false },
    { id: 'transfer', label: 'Luxury Transfer', icon: Car, alwaysIncluded: false },
    { id: 'hotel', label: 'Hotel', icon: Hotel, alwaysIncluded: false },
    { id: 'bonus', label: 'Exclusive Bonuses', icon: Gift, alwaysIncluded: true },
  ]

  const toggleService = (id: string) => {
    // Don't allow toggling always-included services
    const service = services.find(s => s.id === id)
    if (service?.alwaysIncluded) return

    setSelectedServices(prev =>
      prev.includes(id)
        ? prev.filter(s => s !== id)
        : [...prev, id]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log('Package order:', {
      name,
      email,
      phone: `${countryCode}${phone}`,
      selectedServices,
      message
    })

    setIsSubmitting(false)
    onSuccess?.()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Services Selection */}
      <div>
        <label
          className="block text-sm font-medium text-foreground mb-3"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Select Services
        </label>
        <div className="grid grid-cols-2 gap-2">
          {services.map((service) => {
            const Icon = service.icon
            const isSelected = selectedServices.includes(service.id) || service.alwaysIncluded
            return (
              <button
                key={service.id}
                type="button"
                onClick={() => toggleService(service.id)}
                disabled={service.alwaysIncluded}
                className={cn(
                  "flex items-center gap-2 p-3 rounded-xl border transition-all text-left relative",
                  isSelected
                    ? "bg-primary/10 border-primary text-primary"
                    : "bg-muted/50 border-border text-muted-foreground hover:bg-muted",
                  service.alwaysIncluded && "cursor-default opacity-80"
                )}
              >
                <Icon className="w-4 h-4" />
                <span className="text-xs font-medium" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  {service.label}
                </span>
                {service.alwaysIncluded && (
                  <span className="absolute -top-1.5 -right-1.5 text-[8px] bg-primary text-white px-1.5 py-0.5 rounded-full font-medium">
                    Included
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </div>

      {/* Name Input */}
      <div>
        <label
          htmlFor="pkg-name"
          className="block text-sm font-medium text-foreground mb-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Name
        </label>
        <input
          type="text"
          id="pkg-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Enter your name"
          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-muted transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          required
        />
      </div>

      {/* Email Input */}
      <div>
        <label
          htmlFor="pkg-email"
          className="block text-sm font-medium text-foreground mb-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Email
        </label>
        <input
          type="email"
          id="pkg-email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-muted transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
          required
        />
      </div>

      {/* Phone Input */}
      <div>
        <label
          htmlFor="pkg-phone"
          className="block text-sm font-medium text-foreground mb-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Phone
        </label>
        <div className="flex gap-2">
          <select
            value={countryCode}
            onChange={(e) => setCountryCode(e.target.value)}
            className="px-3 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-muted transition-all cursor-pointer"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            <option value="+1">🇺🇸 +1</option>
            <option value="+44">🇬🇧 +44</option>
            <option value="+33">🇫🇷 +33</option>
            <option value="+49">🇩🇪 +49</option>
            <option value="+7">🇷🇺 +7</option>
            <option value="+373">🇲🇩 +373</option>
          </select>
          <input
            type="tel"
            id="pkg-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            className="flex-1 px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-muted transition-all"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
            required
          />
        </div>
      </div>

      {/* Message */}
      <div>
        <label
          htmlFor="pkg-message"
          className="block text-sm font-medium text-foreground mb-2"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          Additional Details <span className="text-muted-foreground">(optional)</span>
        </label>
        <textarea
          id="pkg-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell us about your trip plans, dates, destinations..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-muted transition-all resize-none"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isSubmitting || selectedServices.length === 0}
        className="w-full flex items-center justify-between px-6 py-4 bg-[#DF1F3D] hover:bg-[#c91a35] disabled:bg-muted disabled:text-muted-foreground text-white rounded-full transition-all duration-200 active:scale-95 shadow-lg hover:shadow-xl group"
      >
        <span
          className="text-sm font-bold tracking-wider uppercase"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        >
          {isSubmitting ? 'Sending...' : 'Request Quote'}
        </span>
        <div className="w-6 h-6 bg-white text-[#DF1F3D] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
          <ArrowUpRight className="w-4 h-4" strokeWidth={3} />
        </div>
      </button>

      <p className="text-xs text-center text-muted-foreground">
        We'll get back to you within 2 hours
      </p>
    </form>
  )
}

function OrderFormModal({ open, onOpenChange }: OrderFormModalProps) {
  const isMobile = useIsMobile()
  const [submitted, setSubmitted] = useState(false)

  const handleSuccess = () => {
    setSubmitted(true)
    setTimeout(() => {
      onOpenChange(false)
      setSubmitted(false)
    }, 2000)
  }

  const content = submitted ? (
    <div className="py-12 text-center space-y-4">
      <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto">
        <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
      </div>
      <h3 className="text-xl font-semibold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
        Request Sent!
      </h3>
      <p className="text-sm text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
        Our team will contact you shortly.
      </p>
    </div>
  ) : (
    <PackageOrderForm onSuccess={handleSuccess} />
  )

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="pb-safe max-h-[95vh]">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {submitted ? '' : 'Order Package'}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-6 overflow-y-auto">
            {content}
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="p-6 pt-4">
          {!submitted && (
            <button
              onClick={() => onOpenChange(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          )}

          {!submitted && (
            <DialogHeader className="text-center pb-4">
              <DialogTitle
                className="text-xl font-semibold"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                Order Package
              </DialogTitle>
            </DialogHeader>
          )}
          {content}
        </div>
      </DialogContent>
    </Dialog>
  )
}

function PackageContent({ pkg }: { pkg: typeof packages[0] }) {
  const Icon = pkg.icon

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div className="relative h-48 rounded-xl overflow-hidden">
        <Image
          src={pkg.image}
          alt={pkg.title}
          fill
          className="object-cover object-center"
          sizes="(max-width: 768px) 100vw, 400px"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center">
            <Icon className="w-6 h-6 text-white" />
          </div>
          <div>
            <p className="text-white/80 text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {pkg.startingPrice}
            </p>
          </div>
        </div>
      </div>

      {/* Description */}
      <p
        className="text-sm text-muted-foreground leading-relaxed"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {pkg.description}
      </p>

      {/* Features */}
      <div className="space-y-3">
        <h4
          className="text-sm font-semibold text-foreground"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          What's Included
        </h4>
        <ul className="space-y-2">
          {pkg.features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-3">
              <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span
                className="text-sm text-muted-foreground"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                {feature}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* CTA */}
      <div className="pt-2 space-y-3">
        <a
          href="tel:+14158542675"
          className="w-full flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-white font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
        >
          <Phone className="w-4 h-4" />
          <span>Call to Book</span>
        </a>
        <p className="text-xs text-center text-muted-foreground">
          Or email us at <a href="mailto:book@privatejet.com" className="underline">book@privatejet.com</a>
        </p>
      </div>
    </div>
  )
}

function PackageModal({ pkg, open, onOpenChange }: PackageModalProps) {
  const isMobile = useIsMobile()

  if (!pkg) return null

  if (isMobile) {
    return (
      <Drawer open={open} onOpenChange={onOpenChange}>
        <DrawerContent className="pb-safe max-h-[90vh]">
          <DrawerHeader className="text-center pb-2">
            <DrawerTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {pkg.title}
            </DrawerTitle>
          </DrawerHeader>
          <div className="px-6 pb-6 overflow-y-auto">
            <PackageContent pkg={pkg} />
          </div>
        </DrawerContent>
      </Drawer>
    )
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <div className="p-6 pt-4">
          <button
            onClick={() => onOpenChange(false)}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>

          <DialogHeader className="text-center pb-4">
            <DialogTitle
              className="text-xl font-semibold"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              {pkg.title}
            </DialogTitle>
          </DialogHeader>
          <PackageContent pkg={pkg} />
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function PackagesSection() {
  const [selectedPackage, setSelectedPackage] = useState<typeof packages[0] | null>(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [orderFormOpen, setOrderFormOpen] = useState(false)

  const handlePackageClick = (pkg: typeof packages[0]) => {
    setSelectedPackage(pkg)
    setModalOpen(true)
  }

  const handleOrderClick = () => {
    setOrderFormOpen(true)
  }

  return (
    <section className="py-8 md:py-16 px-4 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-start lg:items-center">
          {/* Left side - Title and text */}
          <div className="flex flex-col space-y-4 md:space-y-6">
            <div className="w-full md:w-4/5">
              <h2 className="text-3xl md:text-6xl font-medium text-foreground mb-3 md:mb-6" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Packages
              </h2>
              <p className="text-sm md:text-lg text-foreground/80 leading-relaxed" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                Discover exclusive service packages that will make your journey unforgettable.
                From private jets to luxury hotels - we offer a complete range of premium services.
              </p>
            </div>
            <button
              onClick={handleOrderClick}
              className="text-white px-6 md:px-8 py-2.5 md:py-3 rounded-full font-medium transition-all duration-200 flex items-center space-x-2 shadow-lg w-fit text-sm md:text-base hover:opacity-90 hover:scale-105 active:scale-95"
              style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
            >
              <span>Order Package</span>
              <MoveRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right side - Bento Grid */}
          <div className="grid grid-cols-2 gap-2 md:gap-4 h-[280px] md:h-[500px]">
            {packages.map((pkg) => {
              const Icon = pkg.icon
              return (
                <div
                  key={pkg.id}
                  onClick={() => handlePackageClick(pkg)}
                  className="relative rounded-xl overflow-hidden cursor-pointer active:scale-[0.98] md:hover:scale-[1.02] transition-all duration-300 group"
                >
                  <Image
                    src={pkg.image}
                    alt={pkg.title}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all" />

                  {/* Icon badge */}
                  <div className="absolute top-3 right-3 w-8 h-8 md:w-10 md:h-10 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Icon className="w-4 h-4 md:w-5 md:h-5 text-white" />
                  </div>

                  <div className="absolute bottom-3 md:bottom-6 left-3 md:left-6 right-3 md:right-6 text-white">
                    <h3 className="text-sm md:text-2xl font-bold" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                      {pkg.title}
                    </h3>
                    <p className="text-white/90 text-xs md:text-sm hidden md:block" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                      {pkg.subtitle}
                    </p>
                    <div className="flex items-center gap-1 mt-1 md:mt-2 text-white/80 group-hover:text-white transition-colors">
                      <span className="text-[10px] md:text-xs" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                        Learn more
                      </span>
                      <MoveRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Package Modal/Drawer */}
      <PackageModal
        pkg={selectedPackage}
        open={modalOpen}
        onOpenChange={setModalOpen}
      />

      {/* Order Form Modal/Drawer */}
      <OrderFormModal
        open={orderFormOpen}
        onOpenChange={setOrderFormOpen}
      />
    </section>
  )
}