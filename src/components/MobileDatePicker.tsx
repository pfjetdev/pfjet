"use client"

import * as React from "react"
import { Calendar as CalendarIcon, MoveUpRight } from "lucide-react"
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
import { cn } from "@/lib/utils"

interface MobileDatePickerProps {
  date: string
  onDateChange: (date: string) => void
  theme?: string
}

export function MobileDatePicker({
  date,
  onDateChange,
  theme
}: MobileDatePickerProps) {
  const [open, setOpen] = React.useState(false)
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? new Date(date) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(
    date ? new Date(date) : new Date()
  )

  // Touch swipe handling
  const [touchStart, setTouchStart] = React.useState<number | null>(null)
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return

    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe) {
      // Swipe left - next month
      const newMonth = new Date(month || new Date())
      newMonth.setMonth(newMonth.getMonth() + 1)
      setMonth(newMonth)
    }

    if (isRightSwipe) {
      // Swipe right - previous month (only if not before current month)
      const newMonth = new Date(month || new Date())
      const today = new Date()
      newMonth.setMonth(newMonth.getMonth() - 1)

      // Don't go before current month
      if (newMonth >= new Date(today.getFullYear(), today.getMonth(), 1)) {
        setMonth(newMonth)
      }
    }
  }

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      setSelectedDate(newDate)
      onDateChange(newDate.toISOString().split('T')[0])
      setOpen(false)
    }
  }

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Select date'
    const d = new Date(dateStr)
    const today = new Date()
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    // Check if it's today
    if (d.toDateString() === today.toDateString()) {
      return 'Today'
    }

    // Check if it's tomorrow
    if (d.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow'
    }

    // Otherwise format as "Mon, Jan 15"
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    })
  }

  const getFullDate = (dateStr: string) => {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <div className={cn(
          "rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md h-28 flex flex-col relative",
          theme === 'dark'
            ? 'bg-gray-800/95 border-white/20 hover:bg-gray-800/80'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        )}>
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
                {formatDate(date)}
              </div>
            )}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="max-h-[95dvh] overflow-hidden pb-safe">
        <DrawerHeader className="text-center pt-6 pb-2">
          <DrawerTitle className="text-xl font-semibold">Select departure date</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-1">
            Choose when you want to depart
          </DrawerDescription>
          <div className="text-xs text-muted-foreground mt-2 flex items-center justify-center gap-2">
            <span>←</span>
            <span>Swipe to change month</span>
            <span>→</span>
          </div>
        </DrawerHeader>
        <div
          className="px-4 pb-6 touch-pan-y"
          style={{ touchAction: 'pan-y' }}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          data-vaul-no-drag
        >
          <Calendar
            mode="single"
            month={month}
            onMonthChange={setMonth}
            selected={selectedDate}
            onSelect={handleDateSelect}
            disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            fromDate={new Date()}
            fromMonth={new Date()}
            initialFocus
            fixedWeeks
            showOutsideDays={false}
            className="mx-auto rounded-lg [--cell-size:clamp(0px,calc(100vw/7.5),52px)]"
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
