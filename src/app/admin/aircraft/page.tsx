import { createClient } from '@/lib/supabase/server'
import { AircraftTable } from '@/components/admin/aircraft/AircraftTable'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface SearchParams {
  category?: string
}

async function getAircraft(searchParams: SearchParams) {
  const supabase = await createClient()

  let query = supabase
    .from('aircraft')
    .select('*')
    .order('category_slug')
    .order('name')

  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('category_slug', searchParams.category)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching aircraft:', error)
    return []
  }

  return data || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('aircraft')
    .select('category, category_slug')
    .order('category_slug')

  if (!data) return []

  // Get unique categories
  const uniqueCategories = data.reduce((acc: { category: string; category_slug: string }[], curr) => {
    if (!acc.find(c => c.category_slug === curr.category_slug)) {
      acc.push({ category: curr.category, category_slug: curr.category_slug })
    }
    return acc
  }, [])

  return uniqueCategories
}

export default async function AircraftPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [aircraft, categories] = await Promise.all([
    getAircraft(params),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Aircraft</h1>
          <p className="text-muted-foreground">
            Manage your fleet ({aircraft.length} aircraft)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/aircraft/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Aircraft
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <AircraftFilters categories={categories} />
        </CardHeader>
        <CardContent className="p-0">
          <AircraftTable aircraft={aircraft} />
        </CardContent>
      </Card>
    </div>
  )
}

import { AircraftFilters } from '@/components/admin/aircraft/AircraftFilters'
