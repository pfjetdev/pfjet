'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { ChevronLeft, ChevronRight, MoreHorizontal, ArrowUpDown, Eye, Trash2, CheckCircle } from 'lucide-react'
import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { OrderDetailsDialog } from './OrderDetailsDialog'
import { updateOrderStatus, deleteOrder } from './actions'

interface Order {
  id: string
  name: string
  email: string
  phone: string
  order_type: string
  status: string
  from_location: string | null
  to_location: string | null
  departure_date: string | null
  departure_time: string | null
  passengers: number | null
  product_name: string | null
  product_type: string | null
  price: number | null
  currency: string | null
  message: string | null
  source_url: string | null
  routes: Array<{
    from: string
    to: string
    date: string
    time: string
    passengers: number
  }> | null
  created_at: string
}

interface OrdersTableProps {
  orders: Order[]
  currentPage: number
  totalPages: number
  total: number
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  contacted: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  confirmed: 'bg-green-500/10 text-green-500 border-green-500/20',
  completed: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  cancelled: 'bg-red-500/10 text-red-500 border-red-500/20',
}

const typeLabels: Record<string, string> = {
  charter: 'Charter',
  empty_leg: 'Empty Leg',
  jet_sharing: 'Jet Sharing',
  search: 'Search',
  contact: 'Contact',
  multi_city: 'Multi City',
}

export function OrdersTable({ orders, currentPage, totalPages, total }: OrdersTableProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [orderToDelete, setOrderToDelete] = useState<Order | null>(null)

  const handlePageChange = (page: number) => {
    const params = new URLSearchParams(searchParams.toString())
    if (page === 1) {
      params.delete('page')
    } else {
      params.set('page', page.toString())
    }
    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleSort = (field: string) => {
    const params = new URLSearchParams(searchParams.toString())
    const currentSort = params.get('sort')
    const currentOrder = params.get('order')

    if (currentSort === field) {
      params.set('order', currentOrder === 'asc' ? 'desc' : 'asc')
    } else {
      params.set('sort', field)
      params.set('order', 'desc')
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    const result = await updateOrderStatus(orderId, newStatus)
    if (result.success) {
      toast.success('Status updated')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update status')
    }
  }

  const handleDelete = async () => {
    if (!orderToDelete) return

    const result = await deleteOrder(orderToDelete.id)
    if (result.success) {
      toast.success('Order deleted')
      setDeleteDialogOpen(false)
      setOrderToDelete(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete order')
    }
  }

  const openDetails = (order: Order) => {
    setSelectedOrder(order)
    setDetailsOpen(true)
  }

  const confirmDelete = (order: Order) => {
    setOrderToDelete(order)
    setDeleteDialogOpen(true)
  }

  if (orders.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No orders found
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort('name')}
                >
                  Customer
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Route</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  size="sm"
                  className="-ml-3 h-8"
                  onClick={() => handleSort('created_at')}
                >
                  Date
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.map((order) => (
              <TableRow key={order.id}>
                <TableCell>
                  <div className="space-y-1">
                    <p className="font-medium">{order.name}</p>
                    <p className="text-xs text-muted-foreground">{order.email}</p>
                    {order.phone && (
                      <p className="text-xs text-muted-foreground">{order.phone}</p>
                    )}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="font-normal">
                    {typeLabels[order.order_type] || order.order_type}
                  </Badge>
                </TableCell>
                <TableCell>
                  {order.from_location && order.to_location ? (
                    <div className="text-sm">
                      <span>{order.from_location}</span>
                      <span className="mx-1 text-muted-foreground">→</span>
                      <span>{order.to_location}</span>
                    </div>
                  ) : order.product_name ? (
                    <span className="text-sm">{order.product_name}</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="text-sm">
                    {new Date(order.created_at).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </TableCell>
                <TableCell>
                  <Badge className={`${statusColors[order.status]} border`}>
                    {order.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem onClick={() => openDetails(order)}>
                        <Eye className="mr-2 h-4 w-4" />
                        View Details
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuLabel className="text-xs text-muted-foreground">
                        Change Status
                      </DropdownMenuLabel>
                      {['new', 'contacted', 'confirmed', 'completed', 'cancelled'].map((status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => handleStatusChange(order.id, status)}
                          disabled={order.status === status}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          {status.charAt(0).toUpperCase() + status.slice(1)}
                        </DropdownMenuItem>
                      ))}
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => confirmDelete(order)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <p className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages} ({total} orders)
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage <= 1 || isPending}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages || isPending}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Details Dialog */}
      <OrderDetailsDialog
        order={selectedOrder}
        open={detailsOpen}
        onOpenChange={setDetailsOpen}
      />

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Order</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this order from {orderToDelete?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
