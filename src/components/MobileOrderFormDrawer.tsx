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
}

export default function MobileOrderFormDrawer({
  jetName,
  price,
  open,
  onOpenChange,
}: MobileOrderFormDrawerProps) {
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="h-[95vh] pb-safe">
        {/* Header */}
        <DrawerHeader className="border-b px-4 py-4 flex flex-row items-center justify-between bg-background">
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
        <div className="flex-1 overflow-y-auto px-4 py-4" data-vaul-no-drag>
          <CreateOrderForm jetName={jetName} price={price} hideTitle={true} />
        </div>
      </DrawerContent>
    </Drawer>
  )
}
