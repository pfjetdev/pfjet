import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { OrdersTable } from '@/components/admin/orders/OrdersTable'
import { OrdersFilters } from '@/components/admin/orders/OrdersFilters'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'

interface SearchParams {
  page?: string
  status?: string
  type?: string
  search?: string
  sort?: string
  order?: string
}

async function getOrders(searchParams: SearchParams) {
  const supabase = await createClient()

  const page = parseInt(searchParams.page || '1')
  const perPage = 20
  const offset = (page - 1) * perPage

  let query = supabase
    .from('orders')
    .select('*', { count: 'exact' })

  // Filter by status
  if (searchParams.status && searchParams.status !== 'all') {
    query = query.eq('status', searchParams.status)
  }

  // Filter by type
  if (searchParams.type && searchParams.type !== 'all') {
    query = query.eq('order_type', searchParams.type)
  }

  // Search
  if (searchParams.search) {
    const search = searchParams.search.toLowerCase()
    query = query.or(`name.ilike.%${search}%,email.ilike.%${search}%,phone.ilike.%${search}%`)
  }

  // Sorting
  const sortField = searchParams.sort || 'created_at'
  const sortOrder = searchParams.order === 'asc' ? true : false
  query = query.order(sortField, { ascending: sortOrder })

  // Pagination
  query = query.range(offset, offset + perPage - 1)

  const { data, count, error } = await query

  if (error) {
    console.error('Error fetching orders:', error)
    return { orders: [], total: 0, page, perPage }
  }

  return {
    orders: data || [],
    total: count || 0,
    page,
    perPage,
  }
}

export default async function OrdersPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>
}) {
  const params = await searchParams
  const { orders, total, page, perPage } = await getOrders(params)
  const totalPages = Math.ceil(total / perPage)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Orders</h1>
        <p className="text-muted-foreground">
          Manage customer orders and requests ({total} total)
        </p>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <OrdersFilters />
        </CardHeader>
        <CardContent className="p-0">
          <Suspense fallback={<TableSkeleton />}>
            <OrdersTable
              orders={orders}
              currentPage={page}
              totalPages={totalPages}
              total={total}
            />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}

function TableSkeleton() {
  return (
    <div className="p-4 space-y-4">
      {Array.from({ length: 10 }).map((_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  )
}
