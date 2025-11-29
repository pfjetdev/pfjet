'use client'

import { usePathname } from 'next/navigation'
import NavBar from '@/components/NavBar'

export function ConditionalNavBar() {
  const pathname = usePathname()

  // Don't show NavBar on admin pages
  if (pathname.startsWith('/admin')) {
    return null
  }

  return <NavBar />
}
