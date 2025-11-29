'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deleteAircraft(id: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('aircraft')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting aircraft:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/aircraft')
  return { success: true }
}

export async function createAircraft(data: {
  name: string
  slug: string
  category: string
  category_slug: string
  description: string
  full_description: string
  passengers: string
  range: string
  speed: string
  baggage: string
  cabin_height: string
  cabin_width: string
  features: string[]
  gallery: string[]
  image: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('aircraft')
    .insert([data])

  if (error) {
    console.error('Error creating aircraft:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/aircraft')
  return { success: true }
}

export async function updateAircraft(id: string, data: {
  name: string
  slug: string
  category: string
  category_slug: string
  description: string
  full_description: string
  passengers: string
  range: string
  speed: string
  baggage: string
  cabin_height: string
  cabin_width: string
  features: string[]
  gallery: string[]
  image: string
}) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('aircraft')
    .update(data)
    .eq('id', id)

  if (error) {
    console.error('Error updating aircraft:', error)
    return { success: false, error: error.message }
  }

  revalidatePath('/admin/aircraft')
  revalidatePath(`/admin/aircraft/${data.slug}/edit`)
  return { success: true }
}

export async function getAircraftBySlug(slug: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('aircraft')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching aircraft:', error)
    return null
  }

  return data
}
