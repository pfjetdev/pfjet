'use client';

import * as React from 'react';
import { UserPlus, Minus, Plus } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface PassengerPickerProps {
  value: string;
  onChange: (value: string) => void;
  maxPassengers?: number;
  fullCard?: boolean;
}

export function PassengerPicker({ value, onChange, maxPassengers = 20, fullCard = false }: PassengerPickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);
  const passengers = parseInt(value) || 1;

  const handleIncrement = () => {
    if (passengers < maxPassengers) {
      onChange((passengers + 1).toString());
    }
  };

  const handleDecrement = () => {
    if (passengers > 1) {
      onChange((passengers - 1).toString());
    }
  };

  if (fullCard) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="w-full cursor-pointer">
            <p
              className="text-xs text-gray-500 mb-0.5"
              style={{ fontFamily: 'Montserrat, sans-serif' }}
            >
              Passengers
            </p>
            <p
              className="text-base font-bold text-gray-900 flex items-center gap-2"
              style={{ fontFamily: 'Clash Display, sans-serif' }}
            >
              <UserPlus className="w-4 h-4 text-gray-600" />
              <span>{passengers}</span>
            </p>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Number of passengers</span>
                <span className="text-xs text-muted-foreground">
                  Select from 1 to {maxPassengers} passengers
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={passengers <= 1}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center min-w-[60px]">
                <span className="text-2xl font-bold">{passengers}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={passengers >= maxPassengers}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick selection buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[2, 5, 10, 15].filter(num => num <= maxPassengers).map((num) => (
                <button
                  key={num}
                  onClick={() => onChange(num.toString())}
                  className={cn(
                    'py-2 rounded-md text-sm font-medium transition-all hover:bg-accent',
                    passengers === num
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted'
                  )}
                >
                  {num}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="w-full mt-4"
              size="sm"
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    );
  }

  return (
    <div className="flex items-center space-x-2 h-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2 h-full cursor-pointer px-2">
            <UserPlus
              className={`w-4 h-4 flex-shrink-0 ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
              }`}
            />
            <button
              className={cn(
                'text-left border-0 bg-transparent text-sm font-medium focus:outline-none cursor-pointer',
                theme === 'dark'
                  ? 'text-gray-100 placeholder-gray-400'
                  : 'text-gray-900 placeholder-gray-500'
              )}
            >
              {passengers}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex flex-col">
                <span className="text-sm font-medium">Number of passengers</span>
                <span className="text-xs text-muted-foreground">
                  Select from 1 to {maxPassengers} passengers
                </span>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                size="icon"
                onClick={handleDecrement}
                disabled={passengers <= 1}
                className="h-10 w-10 rounded-full"
              >
                <Minus className="h-4 w-4" />
              </Button>

              <div className="flex items-center justify-center min-w-[60px]">
                <span className="text-2xl font-bold">{passengers}</span>
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleIncrement}
                disabled={passengers >= maxPassengers}
                className="h-10 w-10 rounded-full"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            {/* Quick selection buttons */}
            <div className="grid grid-cols-4 gap-2 mt-4">
              {[2, 5, 10, 15].filter(num => num <= maxPassengers).map((num) => (
                <button
                  key={num}
                  onClick={() => onChange(num.toString())}
                  className={cn(
                    'py-2 rounded-md text-sm font-medium transition-all hover:bg-accent',
                    passengers === num
                      ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                      : 'bg-muted'
                  )}
                >
                  {num}
                </button>
              ))}
            </div>

            <Button
              onClick={() => setOpen(false)}
              className="w-full mt-4"
              size="sm"
            >
              Confirm
            </Button>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
