"use client"

import * as React from "react"
import { Calendar as CalendarIcon, MoveUpRight } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { parseDateString, formatDateString, isToday, isTomorrow } from "@/lib/dateUtils"
import { format } from "date-fns"

interface MobileDatePickerProps {
  date: string
  onDateChange: (date: string) => void
  theme?: string
}

export function MobileDatePickerNew({
  date,
  onDateChange,
  theme
}: MobileDatePickerProps) {
  const [open, setOpen] = React.useState(false)

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? parseDateString(date) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(
    date ? parseDateString(date) : new Date()
  )

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate)
      // Use date-fns format to avoid timezone issues
      onDateChange(formatDateString(newDate))
      setOpen(false)
    }
  }

  const formatDateLabel = (dateStr: string) => {
    if (!dateStr) return 'Select date'

    if (isToday(dateStr)) return 'Today'
    if (isTomorrow(dateStr)) return 'Tomorrow'

    // Use date-fns format for consistent parsing
    const d = parseDateString(dateStr)
    return format(d, 'EEE, MMM d')
  }

  return (
    <>
      {/* Trigger */}
      <div
        onClick={() => setOpen(true)}
        className={cn(
          "rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md h-28 flex flex-col relative",
          theme === 'dark'
            ? 'bg-gray-800/95 border-white/20 hover:bg-gray-800/80'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        )}
      >
        <div className="flex items-start justify-between">
          <CalendarIcon className={cn(
            "w-6 h-6",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )} />
          <div className={cn(
            "p-1.5 rounded-full",
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          )}>
            <MoveUpRight className={cn(
              "w-3.5 h-3.5",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )} />
          </div>
        </div>
        <div className="mt-auto">
          <div className={cn(
            "text-sm font-semibold",
            theme === 'dark' ? 'text-white' : 'text-gray-900'
          )}>
            Departure
          </div>
          {date && (
            <div className={cn(
              "text-xs mt-0.5",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {formatDateLabel(date)}
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="p-0">
          <DialogHeader className="text-center pt-6 pb-2 px-4">
            <DialogTitle className="text-xl font-semibold">Select departure date</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground mt-1">
              Choose when you want to depart
            </DialogDescription>
            <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-2">
              <span>←</span>
              <span>Swipe to change month</span>
              <span>→</span>
            </div>
          </DialogHeader>

          <div className="px-4 pb-6">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              className="mx-auto rounded-lg [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
