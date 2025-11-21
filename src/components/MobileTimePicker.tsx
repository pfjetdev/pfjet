"use client"

import "@ncdai/react-wheel-picker/style.css"
import * as React from "react"
import { Clock, MoveUpRight } from "lucide-react"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { WheelPicker, WheelPickerWrapper } from "@/components/wheel-picker"
import type { WheelPickerOption } from "@/components/wheel-picker"
import { cn } from "@/lib/utils"

interface MobileTimePickerProps {
  time: string
  onTimeChange: (time: string) => void
  theme?: string
}

export function MobileTimePicker({
  time,
  onTimeChange,
  theme
}: MobileTimePickerProps) {
  const [open, setOpen] = React.useState(false)

  // Convert 24h format to 12h format for initial state
  const getInitialHour12 = () => {
    if (!time) return 10
    const h24 = parseInt(time.split(':')[0])
    return h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
  }

  const getInitialMinutes = () => {
    if (!time) return 0
    const m = parseInt(time.split(':')[1])
    // Round to nearest 5 minutes
    return Math.round(m / 5) * 5
  }

  const getInitialPeriod = () => {
    if (!time) return 'AM'
    const h24 = parseInt(time.split(':')[0])
    return h24 >= 12 ? 'PM' : 'AM'
  }

  const [hour12, setHour12] = React.useState(getInitialHour12())
  const [minutes, setMinutes] = React.useState(getInitialMinutes())
  const [period, setPeriod] = React.useState<'AM' | 'PM'>(getInitialPeriod())

  // Sync state with time prop when drawer opens or time changes
  React.useEffect(() => {
    if (time) {
      const [h, m] = time.split(':')
      const h24 = parseInt(h)
      const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
      const roundedMinutes = Math.round(parseInt(m) / 5) * 5
      const newPeriod = h24 >= 12 ? 'PM' : 'AM'

      setHour12(h12)
      setMinutes(roundedMinutes)
      setPeriod(newPeriod)
    }
  }, [time])

  // Generate options for hours (1-12)
  const hourOptions: WheelPickerOption[] = Array.from({ length: 12 }, (_, i) => ({
    value: (i + 1).toString(),
    label: (i + 1).toString().padStart(2, '0'),
  }))

  // Generate options for minutes (0, 5, 10, 15, ..., 55)
  const minuteOptions: WheelPickerOption[] = Array.from({ length: 12 }, (_, i) => ({
    value: (i * 5).toString(),
    label: (i * 5).toString().padStart(2, '0'),
  }))

  // Period options
  const periodOptions: WheelPickerOption[] = [
    { value: 'AM', label: 'AM' },
    { value: 'PM', label: 'PM' },
  ]

  const formatTime = (timeStr: string) => {
    if (!timeStr) return 'Select time'
    const [h, m] = timeStr.split(':')
    const hour = parseInt(h)
    const minute = parseInt(m)
    const period = hour >= 12 ? 'PM' : 'AM'
    const displayHour = hour % 12 || 12
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`
  }

  const handleConfirm = () => {
    // Convert 12h format to 24h format
    let hour24 = hour12
    if (period === 'AM' && hour12 === 12) {
      hour24 = 0
    } else if (period === 'PM' && hour12 !== 12) {
      hour24 = hour12 + 12
    }

    const formattedTime = `${hour24.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
    onTimeChange(formattedTime)
    setOpen(false)
  }

  const timePresets = [
    { label: 'Morning', time: '09:00' },
    { label: 'Afternoon', time: '14:00' },
    { label: 'Evening', time: '18:00' },
    { label: 'Night', time: '21:00' },
  ]

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
            <Clock className={cn(
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
              Departure time
            </div>
            {time && (
              <div className={cn(
                "text-xs mt-0.5",
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )}>
                {formatTime(time)}
              </div>
            )}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center pb-2">
          <DrawerTitle className="text-xl font-semibold">Select departure time</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-1">
            Choose your preferred departure time
          </DrawerDescription>
          {/* Live Time Preview */}
          <div className="mt-4 pt-4 border-t">
            <div className="text-5xl font-bold tabular-nums">
              {hour12.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')}
              <span className="text-3xl ml-2">{period}</span>
            </div>
          </div>
        </DrawerHeader>
        <div className="px-6 pb-6 space-y-6">
          {/* Quick Presets */}
          <div className="space-y-2">
            <div className="text-xs font-medium text-muted-foreground text-center">
              Quick select
            </div>
            <div className="grid grid-cols-4 gap-2">
              {timePresets.map((preset) => (
                <Button
                  key={preset.label}
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const [h, m] = preset.time.split(':')
                    const h24 = parseInt(h)
                    const h12 = h24 === 0 ? 12 : h24 > 12 ? h24 - 12 : h24
                    const period = h24 >= 12 ? 'PM' : 'AM'

                    setHour12(h12)
                    setMinutes(parseInt(m))
                    setPeriod(period)
                    onTimeChange(preset.time)
                    setOpen(false)
                  }}
                  className="flex flex-col h-auto py-3 transition-all hover:scale-105"
                >
                  <span className="text-xs text-muted-foreground mb-1">{preset.label}</span>
                  <span className="font-semibold text-sm">{formatTime(preset.time)}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Wheel Picker */}
          <div data-vaul-no-drag>
            {/* Wheels */}
            <div className="flex items-end justify-center gap-4 py-4">
              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                  Hour
                </div>
                <WheelPickerWrapper className="!w-20">
                  <WheelPicker
                    value={hour12.toString()}
                    options={hourOptions}
                    onValueChange={(value) => {
                      setHour12(parseInt(value as string))
                    }}
                    infinite
                  />
                </WheelPickerWrapper>
              </div>

              <span className="text-2xl font-bold mb-[90px] flex-shrink-0">:</span>

              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                  Minutes
                </div>
                <WheelPickerWrapper className="!w-20">
                  <WheelPicker
                    value={minutes.toString()}
                    options={minuteOptions}
                    onValueChange={(value) => {
                      setMinutes(parseInt(value as string))
                    }}
                    infinite
                  />
                </WheelPickerWrapper>
              </div>

              <div className="flex flex-col items-center gap-2 flex-shrink-0">
                <div className="text-xs font-medium text-muted-foreground px-2 py-1 bg-secondary rounded-md">
                  Period
                </div>
                <WheelPickerWrapper className="!w-20">
                  <WheelPicker
                    value={period}
                    options={periodOptions}
                    onValueChange={(value) => setPeriod(value as 'AM' | 'PM')}
                  />
                </WheelPickerWrapper>
              </div>
            </div>
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            className="w-full h-12 text-base font-semibold"
            size="lg"
          >
            Confirm Time - {hour12.toString().padStart(2, '0')}:{minutes.toString().padStart(2, '0')} {period}
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
