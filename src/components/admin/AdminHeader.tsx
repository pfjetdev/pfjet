'use client'

import { SidebarTrigger } from '@/components/ui/sidebar'
import { Separator } from '@/components/ui/separator'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { usePathname } from 'next/navigation'
import { useMemo } from 'react'

const routeLabels: Record<string, string> = {
  admin: 'Dashboard',
  orders: 'Orders',
  aircraft: 'Aircraft',
  countries: 'Countries',
  'empty-legs': 'Empty Legs',
  'jet-sharing': 'Jet Sharing',
  new: 'New',
  edit: 'Edit',
}

export function AdminHeader() {
  const pathname = usePathname()

  const breadcrumbs = useMemo(() => {
    const segments = pathname.split('/').filter(Boolean)
    const items: { label: string; href: string; isLast: boolean }[] = []

    let currentPath = ''
    segments.forEach((segment, index) => {
      currentPath += `/${segment}`
      const label = routeLabels[segment] || segment
      items.push({
        label,
        href: currentPath,
        isLast: index === segments.length - 1,
      })
    })

    return items
  }, [pathname])

  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <Breadcrumb>
        <BreadcrumbList>
          {breadcrumbs.map((item, index) => (
            <BreadcrumbItem key={item.href}>
              {item.isLast ? (
                <BreadcrumbPage>{item.label}</BreadcrumbPage>
              ) : (
                <>
                  <BreadcrumbLink href={item.href}>{item.label}</BreadcrumbLink>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
                </>
              )}
            </BreadcrumbItem>
          ))}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  )
}
