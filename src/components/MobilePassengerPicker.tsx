"use client"

import * as React from "react"
import { Users, Minus, Plus, MoveUpRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { cn } from "@/lib/utils"

interface MobilePassengerPickerProps {
  value: string
  onChange: (value: string) => void
  compact?: boolean
}

export function MobilePassengerPicker({
  value,
  onChange,
  compact = false
}: MobilePassengerPickerProps) {
  const [open, setOpen] = React.useState(false)
  const passengers = parseInt(value) || 1

  const handleIncrement = () => {
    if (passengers < 20) {
      onChange((passengers + 1).toString())
    }
  }

  const handleDecrement = () => {
    if (passengers > 1) {
      onChange((passengers - 1).toString())
    }
  }

  const handleConfirm = () => {
    setOpen(false)
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} shouldScaleBackground={false}>
      <DrawerTrigger asChild>
        <div className={cn(
          "rounded-2xl border cursor-pointer transition-all hover:shadow-md flex flex-col relative",
          compact ? "p-3 h-[72px]" : "p-4 h-28",
          // Using Tailwind dark: classes instead of JS conditions - prevents hydration flash
          "bg-white border-gray-200 hover:bg-gray-50",
          "dark:bg-gray-800/95 dark:border-white/20 dark:hover:bg-gray-800/80"
        )}>
          <div className="flex items-start justify-between">
            <Users className={cn(
              "text-gray-900 dark:text-white",
              compact ? "w-4 h-4" : "w-6 h-6"
            )} />
            {!compact && (
              <div className="p-1.5 rounded-full bg-gray-100 dark:bg-gray-700/50">
                <MoveUpRight className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
              </div>
            )}
          </div>
          <div className="mt-auto">
            <div className={cn(
              "font-semibold text-gray-900 dark:text-white",
              compact ? "text-xs" : "text-sm"
            )}>
              {compact ? `${passengers} pax` : 'Passengers'}
            </div>
            {!compact && (
              <div className="text-xs mt-0.5 text-gray-500 dark:text-gray-400">
                {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
              </div>
            )}
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-center pt-6 pb-4">
          <DrawerTitle className="text-xl font-semibold">Select passengers</DrawerTitle>
          <DrawerDescription className="text-sm text-muted-foreground mt-1">
            How many people are flying?
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-6 pb-6 space-y-6">
          {/* Passenger Counter */}
          <div className="flex items-center justify-center gap-6 py-8">
            <Button
              variant="outline"
              size="icon"
              onClick={handleDecrement}
              disabled={passengers <= 1}
              className="h-12 w-12 rounded-full"
            >
              <Minus className="h-5 w-5" />
            </Button>
            <div className="flex flex-col items-center gap-2">
              <span className="text-5xl font-bold">
                {passengers}
              </span>
              <span className="text-sm text-muted-foreground">
                {passengers === 1 ? 'passenger' : 'passengers'}
              </span>
            </div>
            <Button
              variant="outline"
              size="icon"
              onClick={handleIncrement}
              disabled={passengers >= 20}
              className="h-12 w-12 rounded-full"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Quick Selection Presets */}
          <div className="grid grid-cols-4 gap-2">
            {[1, 2, 4, 8].map((count) => (
              <Button
                key={count}
                variant={passengers === count ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  onChange(count.toString())
                }}
                className="h-10"
              >
                {count}
              </Button>
            ))}
          </div>

          {/* Confirm Button */}
          <Button
            onClick={handleConfirm}
            className="w-full"
            size="lg"
          >
            Confirm
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
