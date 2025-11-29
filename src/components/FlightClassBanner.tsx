'use client'

import { Plane, ArrowRight } from 'lucide-react'
import Image from 'next/image'

const FlightClassBanner = () => {
  return (
    <section className="w-full px-4 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-2xl bg-[#0F142E]">

          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6 p-6 lg:p-8">
            {/* Left Side - Icon */}
            <div className="hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/10 flex-shrink-0">
              <Plane className="w-8 h-8 text-white" />
            </div>

            {/* Middle - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#DF1F3D]">
                  Commercial Flights
                </span>
              </div>

              <h2
                className="text-xl lg:text-2xl font-bold mb-2 text-white"
                style={{ fontFamily: 'Clash Display, sans-serif' }}
              >
                Looking for Business or First Class?
              </h2>

              <p className="text-sm lg:text-base text-white/70 max-w-lg">
                Book premium commercial flights with exclusive deals and best prices
              </p>
            </div>

            {/* Right Side - CTA Button */}
            <div className="flex-shrink-0">
              <a
                href="https://your-flight-search-site.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-3 px-6 lg:px-8 py-3 lg:py-4 rounded-xl font-semibold text-sm lg:text-base transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-[#DF1F3D]/20 text-white bg-[#DF1F3D]"
              >
                <span>Search Flights</span>
                <ArrowRight className="w-4 h-4 lg:w-5 lg:h-5 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>

          {/* Bottom accent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#DF1F3D] to-transparent opacity-50" />
        </div>
      </div>
    </section>
  )
}

export default FlightClassBanner
