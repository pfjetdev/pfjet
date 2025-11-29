import { AircraftForm } from '@/components/admin/aircraft/AircraftForm'

export default function NewAircraftPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Add Aircraft</h1>
        <p className="text-muted-foreground">
          Add a new aircraft to your fleet
        </p>
      </div>

      <AircraftForm />
    </div>
  )
}
