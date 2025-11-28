import { Plane, ArrowRight } from 'lucide-react'

const FlightClassBanner = () => {
  return (
    <section className="w-full px-6 lg:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="relative overflow-hidden rounded-xl border transition-all duration-300 bg-muted border-border">
          {/* Content */}
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-4 p-5 lg:p-6">
            {/* Left Side - Text Content */}
            <div className="flex-1 text-center lg:text-left">
              <div className="flex items-center justify-center lg:justify-start gap-2 mb-2">
                <Plane className="w-4 h-4" style={{ color: 'var(--brand-red)' }} />
                <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--brand-red)' }}>
                  Commercial Flights
                </span>
              </div>

              <h2 className="text-lg lg:text-xl font-bold mb-1 text-foreground" style={{ fontFamily: 'Clash Display, sans-serif' }}>
                Looking for Business or First Class?
              </h2>

              <p className="text-sm text-muted-foreground">
                Book premium commercial flights with exclusive deals and best prices
              </p>
            </div>

            {/* Right Side - CTA Button */}
            <div className="flex-shrink-0">
              <a
                href="https://your-flight-search-site.com"
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 px-6 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:opacity-90 text-white"
                style={{ backgroundColor: 'var(--brand-red)' }}
              >
                <span>Search Flights</span>
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default FlightClassBanner
