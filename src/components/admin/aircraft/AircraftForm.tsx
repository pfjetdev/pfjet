'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Loader2, X, Plus, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { createAircraft, updateAircraft } from './actions'
import Image from 'next/image'

const categories = [
  { value: 'turboprop', label: 'Turboprop' },
  { value: 'very-light', label: 'Very Light' },
  { value: 'light', label: 'Light' },
  { value: 'midsize', label: 'Midsize' },
  { value: 'super-mid', label: 'Super-mid' },
  { value: 'heavy', label: 'Heavy' },
  { value: 'ultra-long', label: 'Ultra Long' },
  { value: 'vip-airliner', label: 'VIP Airliner' },
]

const formSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required'),
  category_slug: z.string().min(1, 'Category is required'),
  description: z.string().min(1, 'Description is required'),
  full_description: z.string().optional(),
  passengers: z.string().min(1, 'Passengers is required'),
  range: z.string().min(1, 'Range is required'),
  speed: z.string().min(1, 'Speed is required'),
  baggage: z.string().optional(),
  cabin_height: z.string().optional(),
  cabin_width: z.string().optional(),
  image: z.string().optional(),
})

type FormData = z.infer<typeof formSchema>

interface Aircraft {
  id: string
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
}

interface AircraftFormProps {
  aircraft?: Aircraft | null
}

export function AircraftForm({ aircraft }: AircraftFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [features, setFeatures] = useState<string[]>(aircraft?.features || [])
  const [newFeature, setNewFeature] = useState('')
  const [gallery, setGallery] = useState<string[]>(aircraft?.gallery || [])
  const [newGalleryUrl, setNewGalleryUrl] = useState('')

  const isEditing = !!aircraft

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: aircraft?.name || '',
      slug: aircraft?.slug || '',
      category_slug: aircraft?.category_slug || '',
      description: aircraft?.description || '',
      full_description: aircraft?.full_description || '',
      passengers: aircraft?.passengers || '',
      range: aircraft?.range || '',
      speed: aircraft?.speed || '',
      baggage: aircraft?.baggage || '',
      cabin_height: aircraft?.cabin_height || '',
      cabin_width: aircraft?.cabin_width || '',
      image: aircraft?.image || '',
    },
  })

  const categorySlug = watch('category_slug')
  const imageUrl = watch('image')

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '')
  }

  const getCategoryLabel = (slug: string) => {
    return categories.find(c => c.value === slug)?.label || slug
  }

  const addFeature = () => {
    if (newFeature.trim() && !features.includes(newFeature.trim())) {
      setFeatures([...features, newFeature.trim()])
      setNewFeature('')
    }
  }

  const removeFeature = (feature: string) => {
    setFeatures(features.filter(f => f !== feature))
  }

  const addGalleryImage = () => {
    if (newGalleryUrl.trim() && !gallery.includes(newGalleryUrl.trim())) {
      setGallery([...gallery, newGalleryUrl.trim()])
      setNewGalleryUrl('')
    }
  }

  const removeGalleryImage = (url: string) => {
    setGallery(gallery.filter(g => g !== url))
  }

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)

    const payload = {
      ...data,
      category: getCategoryLabel(data.category_slug),
      full_description: data.full_description || '',
      baggage: data.baggage || '',
      cabin_height: data.cabin_height || '',
      cabin_width: data.cabin_width || '',
      image: data.image || '',
      features,
      gallery,
    }

    try {
      let result
      if (isEditing && aircraft) {
        result = await updateAircraft(aircraft.id, payload)
      } else {
        result = await createAircraft(payload)
      }

      if (result.success) {
        toast.success(isEditing ? 'Aircraft updated' : 'Aircraft created')
        router.push('/admin/aircraft')
        router.refresh()
      } else {
        toast.error(result.error || 'Something went wrong')
      }
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                {...register('name')}
                onChange={(e) => {
                  register('name').onChange(e)
                  if (!isEditing) {
                    setValue('slug', generateSlug(e.target.value))
                  }
                }}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug *</Label>
              <Input id="slug" {...register('slug')} />
              {errors.slug && (
                <p className="text-sm text-destructive">{errors.slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={categorySlug}
                onValueChange={(value) => setValue('category_slug', value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.category_slug && (
                <p className="text-sm text-destructive">{errors.category_slug.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Short Description *</Label>
              <Textarea id="description" {...register('description')} rows={3} />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="full_description">Full Description</Label>
              <Textarea id="full_description" {...register('full_description')} rows={5} />
            </div>
          </CardContent>
        </Card>

        {/* Specifications */}
        <Card>
          <CardHeader>
            <CardTitle>Specifications</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="passengers">Passengers *</Label>
                <Input id="passengers" {...register('passengers')} placeholder="e.g., 6-8" />
                {errors.passengers && (
                  <p className="text-sm text-destructive">{errors.passengers.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="range">Range *</Label>
                <Input id="range" {...register('range')} placeholder="e.g., 2,000 nm" />
                {errors.range && (
                  <p className="text-sm text-destructive">{errors.range.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="speed">Speed *</Label>
                <Input id="speed" {...register('speed')} placeholder="e.g., 450 ktas" />
                {errors.speed && (
                  <p className="text-sm text-destructive">{errors.speed.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="baggage">Baggage</Label>
                <Input id="baggage" {...register('baggage')} placeholder="e.g., 50 cu ft" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cabin_height">Cabin Height</Label>
                <Input id="cabin_height" {...register('cabin_height')} placeholder="e.g., 4.8 ft" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cabin_width">Cabin Width</Label>
                <Input id="cabin_width" {...register('cabin_width')} placeholder="e.g., 5.1 ft" />
              </div>
            </div>

            <Separator />

            {/* Features */}
            <div className="space-y-2">
              <Label>Features</Label>
              <div className="flex gap-2">
                <Input
                  value={newFeature}
                  onChange={(e) => setNewFeature(e.target.value)}
                  placeholder="Add feature..."
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addFeature()
                    }
                  }}
                />
                <Button type="button" variant="secondary" onClick={addFeature}>
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {features.map((feature) => (
                  <Badge key={feature} variant="secondary" className="gap-1">
                    {feature}
                    <button
                      type="button"
                      onClick={() => removeFeature(feature)}
                      className="ml-1 hover:text-destructive"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Images */}
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Main Image */}
          <div className="space-y-2">
            <Label htmlFor="image">Main Image URL</Label>
            <Input id="image" {...register('image')} placeholder="https://..." />
            {imageUrl && (
              <div className="relative h-48 w-full max-w-md rounded-lg overflow-hidden bg-muted mt-2">
                <Image
                  src={imageUrl}
                  alt="Preview"
                  fill
                  className="object-cover"
                  sizes="400px"
                />
              </div>
            )}
          </div>

          <Separator />

          {/* Gallery */}
          <div className="space-y-2">
            <Label>Gallery Images</Label>
            <div className="flex gap-2">
              <Input
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Image URL..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addGalleryImage()
                  }
                }}
              />
              <Button type="button" variant="secondary" onClick={addGalleryImage}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {gallery.map((url, index) => (
                <div key={index} className="relative group">
                  <div className="relative h-24 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={url}
                      alt={`Gallery ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="200px"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeGalleryImage(url)}
                    className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
              {gallery.length === 0 && (
                <div className="col-span-full flex items-center justify-center h-24 rounded-lg border-2 border-dashed text-muted-foreground">
                  <div className="flex flex-col items-center gap-1">
                    <ImageIcon className="h-6 w-6" />
                    <span className="text-xs">No gallery images</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-4">
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          {isEditing ? 'Update Aircraft' : 'Create Aircraft'}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
