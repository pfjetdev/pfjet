'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

type TableName = 'empty_leg_routes' | 'jet_sharing_routes'

export async function deleteRoute(id: string, table: TableName) {
  const supabase = await createClient()

  const { error } = await supabase
    .from(table)
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting route:', error)
    return { success: false, error: error.message }
  }

  const path = table === 'empty_leg_routes' ? '/admin/empty-legs' : '/admin/jet-sharing'
  revalidatePath(path)
  return { success: true }
}

export async function togglePopular(id: string, isPopular: boolean, table: TableName) {
  const supabase = await createClient()

  const { error } = await supabase
    .from(table)
    .update({ is_popular: isPopular })
    .eq('id', id)

  if (error) {
    console.error('Error updating route:', error)
    return { success: false, error: error.message }
  }

  const path = table === 'empty_leg_routes' ? '/admin/empty-legs' : '/admin/jet-sharing'
  revalidatePath(path)
  return { success: true }
}

export async function createRoute(data: {
  from_city_id: string
  to_city_id: string
  aircraft_category: string
  distance_nm: number | null
  duration: string
  is_popular: boolean
}, table: TableName) {
  const supabase = await createClient()

  const { error } = await supabase
    .from(table)
    .insert([data])

  if (error) {
    console.error('Error creating route:', error)
    return { success: false, error: error.message }
  }

  const path = table === 'empty_leg_routes' ? '/admin/empty-legs' : '/admin/jet-sharing'
  revalidatePath(path)
  return { success: true }
}
