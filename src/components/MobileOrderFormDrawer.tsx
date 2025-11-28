'use client'

import { useState } from 'react'
import { X, ArrowUpRight, ChevronDown, ChevronUp, User, Mail, Phone, CreditCard } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import { cn } from '@/lib/utils'

interface MobileOrderFormDrawerProps {
  jetName: string
  price: string
  open: boolean
  onOpenChange: (open: boolean) => void
  isJetSharing?: boolean
  availableSeats?: number
  selectedPassengers?: number
}

export default function MobileOrderFormDrawer({
  jetName,
  price,
  open,
  onOpenChange,
  isJetSharing = false,
  availableSeats = 1,
  selectedPassengers = 1,
}: MobileOrderFormDrawerProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [countryCode, setCountryCode] = useState('+1')
  const [orderConditionsOpen, setOrderConditionsOpen] = useState(false)
  const [cancellationPolicyOpen, setCancellationPolicyOpen] = useState(false)

  // Extract price number from string (e.g., "$ 2,340" -> 2340)
  const pricePerSeat = parseFloat(price.replace(/[^0-9.]/g, ''))
  const totalPrice = isJetSharing ? pricePerSeat * selectedPassengers : pricePerSeat

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    console.log('Order created:', { jetName, name, email, phone: `${countryCode}${phone}`, price })
    onOpenChange(false)
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={true}>
      <DrawerContent className="pb-safe flex flex-col max-h-[95vh]">
        {/* Header */}
        <DrawerHeader className="border-b border-border px-5 py-4 flex flex-row items-center justify-between bg-background shrink-0">
          <DrawerTitle
            className="text-xl font-semibold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Create Order
          </DrawerTitle>
          <DrawerClose asChild>
            <button className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors">
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto min-h-0" data-vaul-no-drag>
          <form onSubmit={handleSubmit} className="px-5 py-5 space-y-5">
            {/* Name Input */}
            <div className="space-y-2">
              <label
                htmlFor="mobile-name"
                className="text-sm font-medium text-foreground flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <User className="w-4 h-4 text-muted-foreground" />
                Name
              </label>
              <input
                type="text"
                id="mobile-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-4 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label
                htmlFor="mobile-email"
                className="text-sm font-medium text-foreground flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <Mail className="w-4 h-4 text-muted-foreground" />
                Email
              </label>
              <input
                type="email"
                id="mobile-email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full px-4 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
                required
              />
            </div>

            {/* Phone Input with Country Code */}
            <div className="space-y-2">
              <label
                htmlFor="mobile-phone"
                className="text-sm font-medium text-foreground flex items-center gap-2"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                <Phone className="w-4 h-4 text-muted-foreground" />
                Phone
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="px-3 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all cursor-pointer"
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
                  id="mobile-phone"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="Enter phone number"
                  className="flex-1 px-4 py-3.5 rounded-xl bg-muted/50 border border-border text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50 transition-all"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                  required
                />
              </div>
            </div>

            {/* Price Display */}
            <div className="bg-muted/30 rounded-2xl p-5 border border-border">
              <div className="flex items-center gap-2 mb-2">
                <CreditCard className="w-4 h-4 text-muted-foreground" />
                <p
                  className="text-sm font-medium text-muted-foreground"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  Total Price
                </p>
              </div>
              <p
                className="text-4xl font-bold text-foreground"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                $ {totalPrice.toLocaleString()}
              </p>
              {isJetSharing && selectedPassengers > 1 && (
                <p
                  className="text-xs text-muted-foreground mt-2"
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  ${pricePerSeat.toLocaleString()} × {selectedPassengers} passengers
                </p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-[#DF1F3D] hover:bg-[#c91a35] text-white rounded-full transition-all duration-200 active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <span
                className="text-sm font-bold tracking-wider uppercase"
                style={{ fontFamily: 'Montserrat, sans-serif' }}
              >
                Create Order
              </span>
              <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                <ArrowUpRight className="w-4 h-4" strokeWidth={2.5} />
              </div>
            </button>

            {/* Expandable Sections */}
            <div className="space-y-1 pt-2">
              {/* Order Conditions */}
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => setOrderConditionsOpen(!orderConditionsOpen)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span
                    className="text-sm font-medium text-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Order conditions
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      orderConditionsOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    orderConditionsOpen ? "max-h-48 pb-4" : "max-h-0"
                  )}
                >
                  <div
                    className="text-sm text-muted-foreground space-y-2 pl-1"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <p>• Full payment required at booking confirmation</p>
                    <p>• Flight schedule subject to weather conditions</p>
                    <p>• Additional charges may apply for route changes</p>
                    <p>• Passengers must arrive 30 minutes before departure</p>
                  </div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="border-t border-border">
                <button
                  type="button"
                  onClick={() => setCancellationPolicyOpen(!cancellationPolicyOpen)}
                  className="w-full flex items-center justify-between py-4 text-left group"
                >
                  <span
                    className="text-sm font-medium text-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    Cancellation policy
                  </span>
                  <ChevronDown
                    className={cn(
                      "w-4 h-4 text-muted-foreground transition-transform duration-200",
                      cancellationPolicyOpen && "rotate-180"
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200",
                    cancellationPolicyOpen ? "max-h-48 pb-4" : "max-h-0"
                  )}
                >
                  <div
                    className="text-sm text-muted-foreground space-y-2 pl-1"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    <p>• 100% refund if cancelled 48+ hours before departure</p>
                    <p>• 50% refund if cancelled 24-48 hours before departure</p>
                    <p>• No refund if cancelled less than 24 hours before</p>
                    <p>• Weather-related cancellations: full refund or reschedule</p>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
