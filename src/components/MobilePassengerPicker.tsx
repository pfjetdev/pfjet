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
  theme?: string
}

export function MobilePassengerPicker({
  value,
  onChange,
  theme
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
          "rounded-2xl p-4 border cursor-pointer transition-all hover:shadow-md h-28 flex flex-col relative",
          theme === 'dark'
            ? 'bg-gray-800/95 border-white/20 hover:bg-gray-800/80'
            : 'bg-white border-gray-200 hover:bg-gray-50'
        )}>
          <div className="flex items-start justify-between">
            <Users className={cn(
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
              Passengers
            </div>
            <div className={cn(
              "text-xs mt-0.5",
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              {passengers} {passengers === 1 ? 'passenger' : 'passengers'}
            </div>
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
