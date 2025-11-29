'use client'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Users,
  Plane,
  DollarSign,
  MessageSquare,
  Link as LinkIcon
} from 'lucide-react'

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

interface OrderDetailsDialogProps {
  order: Order | null
  open: boolean
  onOpenChange: (open: boolean) => void
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

export function OrderDetailsDialog({ order, open, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto p-6">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <DialogTitle>Order Details</DialogTitle>
            <Badge className={`${statusColors[order.status]} border`}>
              {order.status}
            </Badge>
            <Badge variant="outline">
              {typeLabels[order.order_type] || order.order_type}
            </Badge>
          </div>
          <DialogDescription>
            Created on {new Date(order.created_at).toLocaleString()}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Customer Info */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Customer Information</h3>
            <div className="grid gap-3">
              <div className="flex items-center gap-3">
                <User className="h-4 w-4 text-muted-foreground" />
                <span>{order.name}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${order.email}`} className="text-primary hover:underline">
                  {order.email}
                </a>
              </div>
              {order.phone && (
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <a href={`tel:${order.phone}`} className="text-primary hover:underline">
                    {order.phone}
                  </a>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Flight Details */}
          {(order.from_location || order.to_location || order.departure_date) && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-3">Flight Details</h3>
                <div className="grid gap-3">
                  {order.from_location && order.to_location && (
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>
                        {order.from_location} → {order.to_location}
                      </span>
                    </div>
                  )}
                  {order.departure_date && (
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{new Date(order.departure_date).toLocaleDateString()}</span>
                    </div>
                  )}
                  {order.departure_time && (
                    <div className="flex items-center gap-3">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>{order.departure_time}</span>
                    </div>
                  )}
                  {order.passengers && (
                    <div className="flex items-center gap-3">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{order.passengers} passengers</span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Multi-city Routes */}
          {order.routes && order.routes.length > 0 && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-3">Routes</h3>
                <div className="space-y-3">
                  {order.routes.map((route, index) => (
                    <div key={index} className="p-3 rounded-lg bg-muted/50">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-medium bg-primary/10 text-primary px-2 py-0.5 rounded">
                          Leg {index + 1}
                        </span>
                      </div>
                      <div className="grid gap-1 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          {route.from} → {route.to}
                        </div>
                        <div className="flex items-center gap-4 text-muted-foreground">
                          <span>{route.date}</span>
                          <span>{route.time}</span>
                          <span>{route.passengers} pax</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Product Info */}
          {(order.product_name || order.price) && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-3">Product</h3>
                <div className="grid gap-3">
                  {order.product_name && (
                    <div className="flex items-center gap-3">
                      <Plane className="h-4 w-4 text-muted-foreground" />
                      <span>{order.product_name}</span>
                      {order.product_type && (
                        <Badge variant="outline" className="text-xs">
                          {order.product_type}
                        </Badge>
                      )}
                    </div>
                  )}
                  {order.price && (
                    <div className="flex items-center gap-3">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="font-semibold">
                        {order.currency || 'USD'} {order.price.toLocaleString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Message */}
          {order.message && (
            <>
              <div>
                <h3 className="text-sm font-semibold mb-3">Message</h3>
                <div className="flex gap-3">
                  <MessageSquare className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                  <p className="text-sm whitespace-pre-wrap">{order.message}</p>
                </div>
              </div>
              <Separator />
            </>
          )}

          {/* Source URL */}
          {order.source_url && (
            <div>
              <h3 className="text-sm font-semibold mb-3">Source</h3>
              <div className="flex items-center gap-3">
                <LinkIcon className="h-4 w-4 text-muted-foreground" />
                <a
                  href={order.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary hover:underline truncate max-w-[400px]"
                >
                  {order.source_url}
                </a>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
