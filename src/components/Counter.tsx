'use client'

import { useStore, useCount } from '@/store/useStore'

export default function Counter() {
  const count = useCount()
  const { increment, decrement, reset } = useStore()

  return (
    <div className="max-w-sm mx-auto p-6 bg-card rounded-lg border border-border shadow-sm">
      <div className="text-center">
        <div className="text-6xl font-bold text-primary mb-4">
          {count}
        </div>
        
        <div className="flex justify-center space-x-2 mb-4">
          <button
            onClick={decrement}
            className="px-4 py-2 bg-destructive text-destructive-foreground rounded-md hover:bg-destructive/90 transition-colors font-medium"
          >
            -1
          </button>
          <button
            onClick={increment}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
          >
            +1
          </button>
        </div>
        
        <button
          onClick={reset}
          className="px-4 py-2 bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/80 transition-colors text-sm"
        >
          Reset
        </button>
        
        <div className="mt-4 text-sm text-muted-foreground">
          State managed with Zustand
        </div>
      </div>
    </div>
  )
}