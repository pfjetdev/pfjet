"use client"

import * as React from "react"
import { Calendar as CalendarIcon, MoveUpRight } from "lucide-react"
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
import { parseDateString, formatDateString, isToday, isTomorrow } from "@/lib/dateUtils"
import { format } from "date-fns"

interface MobileDatePickerProps {
  date: string
  onDateChange: (date: string) => void
  theme?: string
  resolvedTheme?: string
  compact?: boolean
}

export function MobileDatePicker({
  date,
  onDateChange,
  theme,
  resolvedTheme,
  compact = false
}: MobileDatePickerProps) {
  // Use resolvedTheme if provided, otherwise fall back to theme, default to 'dark' to prevent flash
  const currentTheme = resolvedTheme || theme || 'dark'
  const [open, setOpen] = React.useState(false)

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? parseDateString(date) : undefined
  )
  const [month, setMonth] = React.useState<Date | undefined>(
    date ? parseDateString(date) : new Date()
  )

  // Touch swipe handling for month navigation
  const touchStartRef = React.useRef<{ x: number; y: number } | null>(null)
  const touchMoveRef = React.useRef<{ x: number; y: number } | null>(null)

  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }
    touchMoveRef.current = null
  }

  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return

    touchMoveRef.current = {
      x: e.targetTouches[0].clientX,
      y: e.targetTouches[0].clientY
    }

    // Calculate if this is a horizontal swipe
    const deltaX = Math.abs(touchMoveRef.current.x - touchStartRef.current.x)
    const deltaY = Math.abs(touchMoveRef.current.y - touchStartRef.current.y)

    // If horizontal movement is greater than vertical, prevent drawer drag
    if (deltaX > deltaY && deltaX > 10) {
      e.stopPropagation()
      e.preventDefault()
    }
  }

  const onTouchEnd = () => {
    if (!touchStartRef.current || !touchMoveRef.current) {
      touchStartRef.current = null
      touchMoveRef.current = null
      return
    }

    const deltaX = touchStartRef.current.x - touchMoveRef.current.x
    const deltaY = Math.abs(touchStartRef.current.y - touchMoveRef.current.y)

    // Only process horizontal swipes (deltaX > deltaY)
    if (Math.abs(deltaX) > deltaY) {
      const isLeftSwipe = deltaX > minSwipeDistance
      const isRightSwipe = deltaX < -minSwipeDistance

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

    touchStartRef.current = null
    touchMoveRef.current = null
  }

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
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <div className={cn(
          "rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col relative",
          compact ? "p-3 h-[72px]" : "p-4 h-28",
          currentTheme === 'dark'
            ? 'bg-gray-800/95 border-white/20 hover:bg-gray-800/80'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        )}>
          <div className="flex items-start justify-between">
            <CalendarIcon className={cn(
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900',
              compact ? "w-4 h-4" : "w-6 h-6"
            )} />
            {!compact && (
              <div className={cn(
                "p-1.5 rounded-full",
                currentTheme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
              )}>
                <MoveUpRight className={cn(
                  "w-3.5 h-3.5",
                  currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )} />
              </div>
            )}
          </div>
          <div className="mt-auto">
            <div className={cn(
              "font-semibold",
              compact ? "text-xs" : "text-sm",
              currentTheme === 'dark' ? 'text-white' : 'text-gray-900'
            )}>
              {compact ? (date ? formatDateLabel(date) : 'Date') : 'Departure'}
            </div>
            {!compact && date && (
              <div className={cn(
                "text-xs mt-0.5",
                currentTheme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {formatDateLabel(date)}
              </div>
            )}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className="overflow-hidden pb-safe">
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
          className="px-4 pb-6"
          style={{ touchAction: 'none' }}
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
