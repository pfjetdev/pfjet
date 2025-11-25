'use client'

import { useState, useMemo, useCallback } from 'react'
import { JetSharingFlight } from '@/types/jetSharing'
import JetSharingCard from '@/components/JetSharingCard'
import JetSharingFilters from '@/components/JetSharingFilters'
import JetSharingFiltersMobile from '@/components/JetSharingFiltersMobile'
import { filterJetSharingFlights } from '@/lib/jetSharingGenerator'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

interface JetSharingClientProps {
  initialFlights: JetSharingFlight[]
}

const ITEMS_PER_PAGE = 12

export default function JetSharingClient({ initialFlights }: JetSharingClientProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [filters, setFilters] = useState<{
    from?: string
    to?: string
    dateFrom?: string
    dateTo?: string
    minPrice?: number
    maxPrice?: number
    category?: string
    categories?: string[]
    minSeats?: number
  }>({})

  // Calculate min and max prices from available flights
  const priceRange = useMemo(() => {
    if (initialFlights.length === 0) {
      return { min: 0, max: 10000 }
    }

    const prices = initialFlights.map(flight => flight.pricePerSeat)
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    }
  }, [initialFlights])

  const handleFilterChange = useCallback((newFilters: any) => {
    setFilters(newFilters)
    setCurrentPage(1) // Reset to first page when filters change
  }, [])

  // Calculate active filters count
  const activeFiltersCount = useMemo(() => {
    let count = 0
    if (filters.from) count++
    if (filters.to) count++
    if (filters.dateFrom) count++
    if (filters.dateTo) count++
    if (filters.maxPrice && filters.maxPrice < priceRange.max) count++
    if (filters.minPrice && filters.minPrice > priceRange.min) count++
    if (filters.categories && filters.categories.length > 0) count++
    if (filters.minSeats) count++
    return count
  }, [filters, priceRange])

  // Filter flights based on current filters
  const filteredFlights = useMemo(() => {
    return filterJetSharingFlights(initialFlights, filters)
  }, [initialFlights, filters])

  // Calculate pagination
  const totalPages = Math.ceil(filteredFlights.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentFlights = filteredFlights.slice(startIndex, endIndex)

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages: (number | 'ellipsis')[] = []
    const maxPagesToShow = 5

    if (totalPages <= maxPagesToShow) {
      // Show all pages if total is small
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      // Always show first page
      pages.push(1)

      if (currentPage > 3) {
        pages.push('ellipsis')
      }

      // Show pages around current page
      const startPage = Math.max(2, currentPage - 1)
      const endPage = Math.min(totalPages - 1, currentPage + 1)

      for (let i = startPage; i <= endPage; i++) {
        pages.push(i)
      }

      if (currentPage < totalPages - 2) {
        pages.push('ellipsis')
      }

      // Always show last page
      if (totalPages > 1) {
        pages.push(totalPages)
      }
    }

    return pages
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    // Scroll to top of results
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {/* Mobile Filters Drawer */}
      <JetSharingFiltersMobile
        onFilterChange={handleFilterChange}
        minPrice={priceRange.min}
        maxPrice={priceRange.max}
        activeFiltersCount={activeFiltersCount}
      />

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left: Filters - Desktop Only */}
        <div className="hidden lg:block">
          <JetSharingFilters
            onFilterChange={handleFilterChange}
            minPrice={priceRange.min}
            maxPrice={priceRange.max}
          />
        </div>

        {/* Right: Cards Grid */}
        <div className="flex-1">
          {filteredFlights.length === 0 ? (
            <div className="flex items-center justify-center min-h-[600px]">
              <div className="max-w-2xl text-center space-y-6 px-6">
                {/* Icon */}
                <div className="flex justify-center">
                  <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center">
                    <svg
                      className="w-10 h-10 text-muted-foreground"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                      />
                    </svg>
                  </div>
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h3
                    className="text-2xl font-bold text-foreground"
                    style={{ fontFamily: 'Clash Display, sans-serif' }}
                  >
                    No Shared Flights Found
                  </h3>
                  <p
                    className="text-base text-muted-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    We couldn't find a Jet Sharing flight matching your criteria at the moment.
                  </p>
                </div>

                {/* Contact Info */}
                <div className="space-y-4 pt-4">
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    But don't worry! We have other options for you:
                  </p>

                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <div className="flex items-center justify-center gap-2">
                      <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                      </svg>
                      <p
                        className="text-sm font-medium text-foreground"
                        style={{ fontFamily: 'Montserrat, sans-serif' }}
                      >
                        Call us for personalized assistance
                      </p>
                    </div>
                    <a
                      href="tel:+14158542675"
                      className="inline-block text-2xl font-bold text-primary hover:text-primary/80 transition-colors"
                      style={{ fontFamily: 'Clash Display, sans-serif' }}
                    >
                      +1 (415) 854-2675
                    </a>
                  </div>

                  {/* Premium Flight Options */}
                  <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                    <p
                      className="text-sm font-medium text-foreground"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Or explore our premium flight options:
                    </p>
                    <div className="flex flex-wrap justify-center gap-3">
                      <a
                        href="https://www.priorityflyers.com/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-white font-medium hover:opacity-90 transition-all shadow-lg"
                        style={{ backgroundColor: 'var(--brand-red)', fontFamily: 'Montserrat, sans-serif' }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                        </svg>
                        Search Business & First Class
                      </a>
                    </div>
                    <p
                      className="text-xs text-muted-foreground"
                      style={{ fontFamily: 'Montserrat, sans-serif' }}
                    >
                      Premium commercial flights with luxury amenities
                    </p>
                  </div>
                </div>

                {/* Try adjusting filters */}
                <div className="pt-4">
                  <p
                    className="text-sm text-muted-foreground"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}
                  >
                    You can also try adjusting your filters to see more available shared flights
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <p className="text-xs sm:text-sm text-muted-foreground" style={{ fontFamily: 'Montserrat, sans-serif' }}>
                  Found {filteredFlights.length} shared flight{filteredFlights.length !== 1 ? 's' : ''} •
                  Page {currentPage} of {totalPages}
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {currentFlights.map((flight) => (
                  <JetSharingCard
                    key={flight.id}
                    id={flight.id}
                    from={flight.from.city}
                    to={flight.to.city}
                    date={new Date(flight.departureDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    time={flight.departureTime}
                    totalSeats={flight.totalSeats}
                    availableSeats={flight.availableSeats}
                    price={flight.pricePerSeat}
                    image={flight.to.image || '/day.jpg'}
                    aircraftName={flight.aircraft.name}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <Pagination>
                    <PaginationContent>
                      {/* Previous Button */}
                      <PaginationItem>
                        <PaginationPrevious
                          onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                          className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>

                      {/* Page Numbers */}
                      {getPageNumbers().map((page, index) => (
                        <PaginationItem key={index}>
                          {page === 'ellipsis' ? (
                            <PaginationEllipsis />
                          ) : (
                            <PaginationLink
                              onClick={() => handlePageChange(page)}
                              isActive={currentPage === page}
                              className="cursor-pointer"
                            >
                              {page}
                            </PaginationLink>
                          )}
                        </PaginationItem>
                      ))}

                      {/* Next Button */}
                      <PaginationItem>
                        <PaginationNext
                          onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                          className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  )
}
