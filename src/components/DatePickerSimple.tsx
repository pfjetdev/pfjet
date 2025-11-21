'use client';

import * as React from 'react';
import { CalendarDays } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface DatePickerSimpleProps {
  date: string;
  onDateChange: (date: string) => void;
  placeholder?: string;
}

export function DatePickerSimple({
  date,
  onDateChange,
  placeholder = 'Select date',
}: DatePickerSimpleProps) {
  // Parse date string correctly to avoid timezone issues
  const parseDate = (dateStr: string): Date | undefined => {
    if (!dateStr) return undefined;
    const [year, month, day] = dateStr.split('-').map(Number);
    return new Date(year, month - 1, day);
  };

  const [open, setOpen] = React.useState(false);
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
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <div className="flex items-center space-x-2 h-full px-2 cursor-pointer">
          <CalendarDays className="w-4 h-4 flex-shrink-0 text-muted-foreground" />
          <button
            className={cn(
              'w-full text-left border-0 bg-transparent text-sm font-medium focus:outline-none cursor-pointer',
              !date && 'text-muted-foreground'
            )}
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {date ? formatDate(date) : placeholder}
          </button>
        </div>
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
          className="p-3"
        />
      </PopoverContent>
    </Popover>
  );
}
