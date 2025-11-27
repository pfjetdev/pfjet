'use client'

import { ArrowUpRight } from 'lucide-react'

interface MobileOrderBarProps {
  price: string
  onCreateOrder: () => void
  priceSubtitle?: string
}

export default function MobileOrderBar({ price, onCreateOrder, priceSubtitle }: MobileOrderBarProps) {
  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-card border-t border-border shadow-2xl z-50 safe-area-inset-bottom">
      <div className="px-4 py-3 flex items-center justify-between gap-4">
        {/* Price */}
        <div>
          <p
            className="text-2xl font-bold text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            {price}
          </p>
          {priceSubtitle && (
            <p
              className="text-xs text-muted-foreground"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              {priceSubtitle}
            </p>
          )}
        </div>

        {/* CTA Button */}
        <button
          onClick={onCreateOrder}
          className="flex items-center gap-2 px-6 py-3 bg-[#DF1F3D] hover:bg-[#c91a35] text-white rounded-full transition-all duration-200 active:scale-95 shadow-lg group whitespace-nowrap"
        >
          <span
            className="text-sm font-bold tracking-wide uppercase"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Create Order
          </span>
          <div className="w-5 h-5 bg-white text-[#DF1F3D] rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
            <ArrowUpRight className="w-3 h-3" strokeWidth={3} />
          </div>
        </button>
      </div>
    </div>
  )
}
