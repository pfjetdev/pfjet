'use client'

import { useState } from 'react'
import { X } from 'lucide-react'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerClose,
} from '@/components/ui/drawer'
import CreateOrderForm from '@/components/CreateOrderForm'

interface MobileOrderFormDrawerProps {
  jetName: string
  price: string
  open: boolean
  onOpenChange: (open: boolean) => void
  isJetSharing?: boolean
  availableSeats?: number
  selectedPassengers?: number
}

export default function MobileOrderFormDrawer({
  jetName,
  price,
  open,
  onOpenChange,
  isJetSharing = false,
  availableSeats = 1,
  selectedPassengers = 1,
}: MobileOrderFormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange} repositionInputs={true}>
      <DrawerContent className="pb-safe flex flex-col">
        {/* Header */}
        <DrawerHeader className="border-b px-4 py-4 flex flex-row items-center justify-between bg-background shrink-0">
          <DrawerTitle
            className="text-xl font-medium text-foreground"
            style={{ fontFamily: 'Clash Display, sans-serif' }}
          >
            Create Order
          </DrawerTitle>
          <DrawerClose asChild>
            <button className="p-2 rounded-full hover:bg-accent transition-colors">
              <X className="w-5 h-5" />
            </button>
          </DrawerClose>
        </DrawerHeader>

        {/* Form Content - Scrollable */}
        <div className="flex-1 overflow-y-auto px-4 py-4 min-h-0" data-vaul-no-drag>
          <CreateOrderForm
            jetName={jetName}
            price={price}
            hideTitle={true}
            isJetSharing={isJetSharing}
            availableSeats={availableSeats}
            selectedPassengers={selectedPassengers}
          />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
