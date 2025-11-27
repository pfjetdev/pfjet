'use client';

import * as React from 'react';
import { Clock } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface TimePickerProps {
  value: string;
  onChange: (value: string) => void;
}

export function TimePicker({ value, onChange }: TimePickerProps) {
  const { theme } = useTheme();
  const [open, setOpen] = React.useState(false);

  // Parse current time and period
  const parseTime = (timeStr: string) => {
    if (!timeStr) return { hour: 12, minute: '00', period: 'AM' };
    const [h, m] = timeStr.split(':');
    const hour24 = parseInt(h);
    const period = hour24 >= 12 ? 'PM' : 'AM';
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return { hour: hour12, minute: m, period };
  };

  const { hour, minute, period } = parseTime(value);
  const [selectedPeriod, setSelectedPeriod] = React.useState(period);
  const [selectedHour, setSelectedHour] = React.useState(hour);
  const [selectedMinute, setSelectedMinute] = React.useState(minute);

  const convertTo24Hour = (hour12: number, period: string) => {
    if (period === 'AM') {
      return hour12 === 12 ? 0 : hour12;
    } else {
      return hour12 === 12 ? 12 : hour12 + 12;
    }
  };

  const handleHourClick = (hour: number) => {
    setSelectedHour(hour);
    const hour24 = convertTo24Hour(hour, selectedPeriod);
    onChange(`${hour24.toString().padStart(2, '0')}:${selectedMinute}`);
  };

  const handleMinuteClick = (minute: string) => {
    setSelectedMinute(minute);
    const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
    onChange(`${hour24.toString().padStart(2, '0')}:${minute}`);
  };

  const handlePeriodChange = (newPeriod: string) => {
    setSelectedPeriod(newPeriod);
    const hour24 = convertTo24Hour(selectedHour, newPeriod);
    onChange(`${hour24.toString().padStart(2, '0')}:${selectedMinute}`);
  };

  const formatTime = (time: string) => {
    if (!time) return '';
    const [h, m] = time.split(':');
    const hour24 = parseInt(h);
    const ampm = hour24 >= 12 ? 'PM' : 'AM';
    const displayHour = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    return `${displayHour}:${m} ${ampm}`;
  };

  // Generate hours (1-12 for 12-hour format)
  const hoursArray = Array.from({ length: 12 }, (_, i) => i + 1);

  // Generate minutes (00, 15, 30, 45)
  const minutesArray = ['00', '15', '30', '45'];

  return (
    <div className="flex items-center space-x-2 flex-1 h-full w-full">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <div className="flex items-center space-x-2 flex-1 h-full cursor-pointer w-full">
            <Clock
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
                !value && 'text-muted-foreground'
              )}
            >
              {value ? formatTime(value) : 'Select time'}
            </button>
          </div>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <div className="p-3 border-b flex justify-between items-center">
            <span className="text-sm font-medium">Select Time</span>
            <div className="flex gap-1 rounded-lg p-1 border">
              <button
                onClick={() => handlePeriodChange('AM')}
                className={cn(
                  'px-4 py-1.5 text-xs rounded-md transition-all font-medium',
                  selectedPeriod === 'AM'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent hover:bg-muted'
                )}
              >
                AM
              </button>
              <button
                onClick={() => handlePeriodChange('PM')}
                className={cn(
                  'px-4 py-1.5 text-xs rounded-md transition-all font-medium',
                  selectedPeriod === 'PM'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'bg-transparent hover:bg-muted'
                )}
              >
                PM
              </button>
            </div>
          </div>

          <div className="p-3">
            {/* Hours Grid */}
            <div className="mb-4">
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                Hour
              </span>
              <div className="grid grid-cols-6 gap-1">
                {hoursArray.map((h) => (
                  <button
                    key={h}
                    onClick={() => handleHourClick(h)}
                    className={cn(
                      'aspect-square rounded-md text-sm font-medium transition-all hover:bg-accent',
                      selectedHour === h
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted'
                    )}
                  >
                    {h}
                  </button>
                ))}
              </div>
            </div>

            {/* Minutes Grid */}
            <div>
              <span className="text-xs font-medium text-muted-foreground mb-2 block">
                Minute
              </span>
              <div className="grid grid-cols-4 gap-2">
                {minutesArray.map((m) => (
                  <button
                    key={m}
                    onClick={() => handleMinuteClick(m)}
                    className={cn(
                      'py-2 rounded-md text-sm font-medium transition-all hover:bg-accent',
                      selectedMinute === m
                        ? 'bg-primary text-primary-foreground hover:bg-primary/90'
                        : 'bg-muted'
                    )}
                  >
                    {m}
                  </button>
                ))}
              </div>
            </div>

            {/* Confirm Button */}
            <Button
              onClick={() => {
                const hour24 = convertTo24Hour(selectedHour, selectedPeriod);
                onChange(`${hour24.toString().padStart(2, '0')}:${selectedMinute}`);
                setOpen(false);
              }}
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
