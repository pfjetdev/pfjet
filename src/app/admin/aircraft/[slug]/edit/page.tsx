import { notFound } from 'next/navigation'
import { AircraftForm } from '@/components/admin/aircraft/AircraftForm'
import { getAircraftBySlug } from '@/components/admin/aircraft/actions'

interface EditAircraftPageProps {
  params: Promise<{ slug: string }>
}

export default async function EditAircraftPage({ params }: EditAircraftPageProps) {
  const { slug } = await params
  const aircraft = await getAircraftBySlug(slug)

  if (!aircraft) {
    notFound()
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Edit Aircraft</h1>
        <p className="text-muted-foreground">
          Editing: {aircraft.name}
        </p>
      </div>

      <AircraftForm aircraft={aircraft} />
    </div>
  )
}
