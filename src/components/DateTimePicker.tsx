'use client';

import * as React from 'react';
import { CalendarDays } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { TimePicker } from '@/components/TimePicker';
import { cn } from '@/lib/utils';

interface DateTimePickerProps {
  date: string;
  time: string;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  autoFocus?: boolean;
  openTrigger?: number;
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  autoFocus = false,
  openTrigger = 0,
}: DateTimePickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  // Auto-open when autoFocus changes
  React.useEffect(() => {
    if (autoFocus) {
      setOpen(true);
    }
  }, [autoFocus]);

  // Open when trigger changes (for programmatic opening)
  React.useEffect(() => {
    if (openTrigger > 0) {
      setOpen(true);
    }
  }, [openTrigger]);
  // Parse date string correctly to avoid timezone issues
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? parseDate(date) : undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(
    date ? parseDate(date) : new Date()
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    if (newDate) {
      // Fix timezone issue by using local midnight
      const localDate = new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
      setSelectedDate(localDate);

      // Format date to string without timezone conversion
      const year = localDate.getFullYear();
      const month = String(localDate.getMonth() + 1).padStart(2, '0');
      const day = String(localDate.getDate()).padStart(2, '0');
      onDateChange(`${year}-${month}-${day}`);
      setOpen(false);
    }
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const [year, month, day] = dateStr.split('-').map(Number);
    const d = new Date(year, month - 1, day);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex items-center gap-2 h-full w-full">
      {/* Date Picker */}
      <div className="flex items-center space-x-2 flex-1 h-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <button
              type="button"
              className="flex items-center space-x-2 flex-1 h-full cursor-pointer w-full text-left"
            >
              <CalendarDays
                className={`w-4 h-4 flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              />
              <span
                className={cn(
                  'text-sm font-medium',
                  theme === 'dark'
                    ? 'text-gray-100'
                    : 'text-gray-900',
                  !date && 'text-muted-foreground'
                )}
              >
                {date ? formatDate(date) : 'Select date'}
              </span>
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate}
              onSelect={handleDateSelect}
              disabled={(date) => {
                // Disable past dates
                const today = new Date();
                today.setHours(0, 0, 0, 0);
                return date < today;
              }}
              showOutsideDays={false}
              fromDate={new Date()}
              fromMonth={new Date()}
              className="p-3"
            />
          </PopoverContent>
        </Popover>
      </div>

      {/* Divider */}
      <div
        className={`w-px h-8 ${theme === 'dark' ? 'bg-gray-600' : 'bg-gray-200'}`}
      />

      {/* Time Picker */}
      <TimePicker value={time} onChange={onTimeChange} />
    </div>
  );
}
