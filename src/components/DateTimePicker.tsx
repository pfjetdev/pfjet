'use client';

import * as React from 'react';
import { CalendarDays } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
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
}

export function DateTimePicker({
  date,
  time,
  onDateChange,
  onTimeChange,
  autoFocus = false,
}: DateTimePickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  // Auto-open when autoFocus changes
  React.useEffect(() => {
    if (autoFocus) {
      setOpen(true);
    }
  }, [autoFocus]);
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    date ? new Date(date) : undefined
  );
  const [month, setMonth] = React.useState<Date | undefined>(
    date ? new Date(date) : new Date()
  );

  const handleDateSelect = (newDate: Date | undefined) => {
    setSelectedDate(newDate);
    if (newDate) {
      onDateChange(newDate.toISOString().split('T')[0]);
      setOpen(false);
    }
  };

  const handleTodayClick = () => {
    const today = new Date();
    setMonth(today);
    setSelectedDate(today);
    onDateChange(today.toISOString().split('T')[0]);
    setOpen(false);
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex items-center gap-2 h-full">
      {/* Date Picker */}
      <div className="flex items-center space-x-2 flex-1 h-full">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <div className="flex items-center space-x-2 flex-1 h-full cursor-pointer">
              <CalendarDays
                className={`w-4 h-4 flex-shrink-0 ${
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                }`}
              />
              <button
                className={cn(
                  'w-full text-left border-0 bg-transparent text-sm font-medium focus:outline-none cursor-pointer',
                  theme === 'dark'
                    ? 'text-gray-100 placeholder-gray-400'
                    : 'text-gray-900 placeholder-gray-500',
                  !date && 'text-muted-foreground'
                )}
              >
                {date ? formatDate(date) : 'Select date'}
              </button>
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto overflow-hidden p-0" align="start">
            <div className="p-3 border-b flex justify-between items-center">
              <span className="text-sm font-medium">Select Date</span>
              <Button
                size="sm"
                variant="outline"
                onClick={handleTodayClick}
                className="h-7 text-xs"
              >
                Today
              </Button>
            </div>
            <Calendar
              mode="single"
              month={month}
              onMonthChange={setMonth}
              selected={selectedDate}
              onSelect={handleDateSelect}
              fromDate={new Date()}
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
