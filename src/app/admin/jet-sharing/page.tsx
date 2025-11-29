import { createClient } from '@/lib/supabase/server'
import { RoutesTable } from '@/components/admin/empty-legs/RoutesTable'
import { RoutesFilters } from '@/components/admin/empty-legs/RoutesFilters'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardDescription } from '@/components/ui/card'
import { Plus } from 'lucide-react'
import Link from 'next/link'

interface SearchParams {
  category?: string
  popular?: string
}

async function getRoutes(searchParams: SearchParams) {
  const supabase = await createClient()

  let query = supabase
    .from('jet_sharing_routes')
    .select(`
      id,
      from_city_id,
      to_city_id,
      aircraft_category,
      distance_nm,
      duration,
      is_popular,
      from_city:cities!jet_sharing_routes_from_city_id_fkey (
        id,
        name,
        country_code
      ),
      to_city:cities!jet_sharing_routes_to_city_id_fkey (
        id,
        name,
        country_code
      )
    `)
    .order('is_popular', { ascending: false })
    .order('aircraft_category')

  if (searchParams.category && searchParams.category !== 'all') {
    query = query.eq('aircraft_category', searchParams.category)
  }

  if (searchParams.popular === 'true') {
    query = query.eq('is_popular', true)
  }

  const { data, error } = await query

  if (error) {
    console.error('Error fetching routes:', error)
    return []
  }

  return data || []
}

async function getCategories() {
  const supabase = await createClient()

  const { data } = await supabase
    .from('jet_sharing_routes')
    .select('aircraft_category')

  if (!data) return []

  const unique = [...new Set(data.map(r => r.aircraft_category))].sort()
  return unique
}

export default async function JetSharingPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const [routes, categories] = await Promise.all([
    getRoutes(params),
    getCategories(),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Jet Sharing Routes</h1>
          <p className="text-muted-foreground">
            Manage routes for shared flights ({routes.length} routes)
          </p>
        </div>
        <Button asChild>
          <Link href="/admin/jet-sharing/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Route
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <CardDescription>
            These routes are used to generate jet sharing offers. Passengers can share seats on scheduled flights.
          </CardDescription>
          <RoutesFilters categories={categories} />
        </CardHeader>
        <CardContent className="p-0">
          <RoutesTable routes={routes} type="jet_sharing" />
        </CardContent>
      </Card>
    </div>
  )
}
