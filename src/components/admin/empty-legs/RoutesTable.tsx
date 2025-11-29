'use client'

import { useRouter } from 'next/navigation'
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
import { MoreHorizontal, Pencil, Trash2, Star, Clock, MapPin } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'
import { deleteRoute, togglePopular } from './actions'

interface City {
  id: string
  name: string
  country_code: string
}

interface Route {
  id: string
  from_city_id: string
  to_city_id: string
  aircraft_category: string
  distance_nm: number | null
  duration: string
  is_popular: boolean
  from_city: City | City[]
  to_city: City | City[]
}

// Helper to get city from potentially array response
function getCity(city: City | City[]): City | null {
  if (Array.isArray(city)) {
    return city[0] || null
  }
  return city
}

interface RoutesTableProps {
  routes: Route[]
  type: 'empty_leg' | 'jet_sharing'
}

export function RoutesTable({ routes, type }: RoutesTableProps) {
  const router = useRouter()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [routeToDelete, setRouteToDelete] = useState<Route | null>(null)

  const tableName = type === 'empty_leg' ? 'empty_leg_routes' : 'jet_sharing_routes'

  const handleDelete = async () => {
    if (!routeToDelete) return

    const result = await deleteRoute(routeToDelete.id, tableName)
    if (result.success) {
      toast.success('Route deleted')
      setDeleteDialogOpen(false)
      setRouteToDelete(null)
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to delete route')
    }
  }

  const handleTogglePopular = async (route: Route) => {
    const result = await togglePopular(route.id, !route.is_popular, tableName)
    if (result.success) {
      toast.success(route.is_popular ? 'Removed from popular' : 'Added to popular')
      router.refresh()
    } else {
      toast.error(result.error || 'Failed to update')
    }
  }

  const confirmDelete = (route: Route) => {
    setRouteToDelete(route)
    setDeleteDialogOpen(true)
  }

  if (routes.length === 0) {
    return (
      <div className="p-8 text-center text-muted-foreground">
        No routes found
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]"></TableHead>
              <TableHead>Route</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Duration</TableHead>
              <TableHead>Distance</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.map((route) => (
              <TableRow key={route.id}>
                <TableCell>
                  {route.is_popular && (
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  )}
                </TableCell>
                <TableCell>
                  {(() => {
                    const fromCity = getCity(route.from_city)
                    const toCity = getCity(route.to_city)
                    return (
                      <>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <span className="font-medium">{fromCity?.name}</span>
                            <span className="text-muted-foreground mx-2">→</span>
                            <span className="font-medium">{toCity?.name}</span>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground ml-6">
                          {fromCity?.country_code} → {toCity?.country_code}
                        </div>
                      </>
                    )
                  })()}
                </TableCell>
                <TableCell>
                  <Badge variant="outline">{route.aircraft_category}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-3 w-3 text-muted-foreground" />
                    {route.duration}
                  </div>
                </TableCell>
                <TableCell>
                  {route.distance_nm ? (
                    <span className="text-sm">{route.distance_nm} nm</span>
                  ) : (
                    <span className="text-sm text-muted-foreground">—</span>
                  )}
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
                      <DropdownMenuItem onClick={() => handleTogglePopular(route)}>
                        <Star className="mr-2 h-4 w-4" />
                        {route.is_popular ? 'Remove from Popular' : 'Mark as Popular'}
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => confirmDelete(route)}
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

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Route</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the route from {routeToDelete ? getCity(routeToDelete.from_city)?.name : ''} to {routeToDelete ? getCity(routeToDelete.to_city)?.name : ''}? This action cannot be undone.
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
