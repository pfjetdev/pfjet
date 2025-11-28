"use client"

import * as React from "react"
import { Calendar as CalendarIcon, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface MobileDateTimePickerProps {
  date: string
  time: string
  onDateChange: (date: string) => void
  onTimeChange: (time: string) => void
  theme?: string
}

export function MobileDateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  theme
}: MobileDateTimePickerProps) {
  const [openDate, setOpenDate] = React.useState(false)

  // Parse date string to local Date to avoid timezone issues
  const parseLocalDate = (dateStr: string): Date => {
    const [year, month, day] = dateStr.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? parseLocalDate(date) : undefined
  )

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate)
      // Use local date to avoid timezone issues (toISOString converts to UTC which can shift the day)
      const year = newDate.getFullYear()
      const month = String(newDate.getMonth() + 1).padStart(2, '0')
      const day = String(newDate.getDate()).padStart(2, '0')
      onDateChange(`${year}-${month}-${day}`)
      setOpenDate(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = parseLocalDate(dateStr)
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Date Picker */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <CalendarIcon className={cn(
            "w-4 h-4",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )} />
          <span className={cn(
            "text-xs font-medium",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            Departure Date
          </span>
        </div>
        <Drawer open={openDate} onOpenChange={setOpenDate}>
          <DrawerTrigger asChild>
            <Button
              variant="ghost"
              className={cn(
                "w-full justify-start text-left font-medium p-0 h-auto hover:bg-transparent",
                theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
              )}
            >
              {date ? formatDate(date) : 'Select date'}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="overflow-hidden">
            <DrawerHeader className="sr-only">
              <DrawerTitle>Select departure date</DrawerTitle>
              <DrawerDescription>Choose your departure date</DrawerDescription>
            </DrawerHeader>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
              fromDate={new Date()}
              fromMonth={new Date()}
              initialFocus
              fixedWeeks
              showOutsideDays={false}
              className="mx-auto [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
            />
          </DrawerContent>
        </Drawer>
      </div>

      {/* Time Picker */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock className={cn(
            "w-4 h-4",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )} />
          <span className={cn(
            "text-xs font-medium",
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            Departure Time
          </span>
        </div>
        <Input
          type="time"
          value={time || '10:00'}
          onChange={(e) => onTimeChange(e.target.value)}
          className={cn(
            "bg-transparent border-0 text-sm font-medium focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto",
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          )}
        />
      </div>
    </div>
  )
}
