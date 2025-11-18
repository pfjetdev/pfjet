'use client';

import { useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react';

interface CalendarDay {
  dayOfWeek: string;
  date: number;
  isSelected: boolean;
  isCurrentMonth: boolean;
  isPast: boolean;
}

interface HorizontalCalendarProps {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
}

export default function HorizontalCalendar({
  selectedDate = new Date(),
  onDateSelect
}: HorizontalCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  const [selectedDay, setSelectedDay] = useState(selectedDate.getDate());
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Generate days for the calendar
  const generateDays = (): CalendarDay[] => {
    const days: CalendarDay[] = [];
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // Get days in current month
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add previous month's last few days
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const prevMonthDays = new Date(year, month, 0).getDate();
    const prevDaysToShow = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    for (let i = prevDaysToShow; i > 0; i--) {
      const dayDate = new Date(year, month - 1, prevMonthDays - i + 1);
      dayDate.setHours(0, 0, 0, 0);
      days.push({
        dayOfWeek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayDate.getDay()],
        date: prevMonthDays - i + 1,
        isSelected: false,
        isCurrentMonth: false,
        isPast: dayDate < today,
      });
    }

    // Add current month days
    for (let i = 1; i <= daysInMonth; i++) {
      const dayDate = new Date(year, month, i);
      dayDate.setHours(0, 0, 0, 0);
      days.push({
        dayOfWeek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayDate.getDay()],
        date: i,
        isSelected: i === selectedDay &&
                    month === selectedDate.getMonth() &&
                    year === selectedDate.getFullYear(),
        isCurrentMonth: true,
        isPast: dayDate < today,
      });
    }

    // Add next month's first few days
    const remainingSlots = 20 - days.length;
    for (let i = 1; i <= remainingSlots; i++) {
      const dayDate = new Date(year, month + 1, i);
      dayDate.setHours(0, 0, 0, 0);
      days.push({
        dayOfWeek: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'][dayDate.getDay()],
        date: i,
        isSelected: false,
        isCurrentMonth: false,
        isPast: dayDate < today,
      });
    }

    return days;
  };

  const days = generateDays();

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const handleDateClick = (day: CalendarDay) => {
    if (day.isCurrentMonth) {
      setSelectedDay(day.date);
      if (onDateSelect) {
        onDateSelect(new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day.date));
      }
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex gap-6 items-center w-full">
      {/* Month Selector */}
      <div className="bg-gradient-to-r from-[#0F142E] to-[#1a1f3a] dark:from-white dark:to-white flex items-center justify-center gap-4 h-[62px] px-6 rounded-xl shrink-0 shadow-lg hover:shadow-xl transition-all duration-300">
        <button
          onClick={handlePrevMonth}
          className="text-white dark:text-black hover:scale-110 active:scale-95 transition-transform p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10"
          aria-label="Previous month"
        >
          <ChevronLeft className="w-4 h-6" strokeWidth={2.5} />
        </button>
        <div className="flex items-center gap-2">
          <Calendar className="w-6 h-6 text-white dark:text-black" strokeWidth={2} />
          <span
            className="text-white dark:text-black text-[15px] font-medium tracking-[0.75px] uppercase min-w-[140px] text-center"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
          </span>
        </div>
        <button
          onClick={handleNextMonth}
          className="text-white dark:text-black hover:scale-110 active:scale-95 transition-transform p-1 rounded-lg hover:bg-white/10 dark:hover:bg-black/10"
          aria-label="Next month"
        >
          <ChevronRight className="w-4 h-6" strokeWidth={2.5} />
        </button>
      </div>

      {/* Calendar Days */}
      <div className="flex-1 bg-card rounded-xl p-3 overflow-hidden relative border border-border shadow-sm h-[62px]">
        <div className="flex items-center justify-between gap-3 h-full">
          <button
            onClick={scrollLeft}
            className="shrink-0 z-10 p-2 rounded-lg bg-background border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
            aria-label="Scroll left"
          >
            <ChevronLeft className="w-3.5 h-3.5 text-foreground group-hover:text-accent-foreground" strokeWidth={2.5} />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-2 overflow-x-auto scrollbar-hide flex-1 items-center"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {days.map((day, index) => (
              <button
                key={index}
                onClick={() => handleDateClick(day)}
                className={`
                  flex flex-col items-center justify-center px-3 py-1 rounded-lg min-w-[50px] h-[46px] shrink-0
                  transition-all duration-200 relative group
                  ${day.isSelected
                    ? 'bg-[#0F142E] dark:bg-white text-white dark:text-black shadow-lg scale-105 ring-2 ring-primary/20'
                    : day.isCurrentMonth
                      ? day.isPast
                        ? 'bg-muted/50 text-muted-foreground hover:bg-muted cursor-not-allowed'
                        : 'bg-card text-foreground hover:bg-accent hover:scale-105 hover:shadow-md active:scale-95'
                      : 'bg-card text-muted-foreground opacity-40'
                  }
                  ${!day.isCurrentMonth && 'cursor-not-allowed'}
                  ${day.isPast && day.isCurrentMonth && 'cursor-not-allowed'}
                `}
                disabled={!day.isCurrentMonth || day.isPast}
              >
                <span
                  className={`text-[10px] font-medium tracking-[0.5px] uppercase transition-colors ${
                    day.isSelected ? 'text-white/70 dark:text-black/70' : ''
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {day.dayOfWeek}
                </span>
                <span
                  className={`text-[18px] font-bold tracking-[0.9px] transition-colors ${
                    day.isSelected ? 'text-white dark:text-black' : ''
                  }`}
                  style={{ fontFamily: 'Montserrat, sans-serif' }}
                >
                  {day.date}
                </span>
                {/* Active indicator */}
                {day.isSelected && (
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full" />
                )}
              </button>
            ))}
          </div>

          <button
            onClick={scrollRight}
            className="shrink-0 z-10 p-2 rounded-lg bg-background border border-border hover:bg-accent hover:border-accent-foreground/20 transition-all duration-200 shadow-sm hover:shadow-md active:scale-95 group"
            aria-label="Scroll right"
          >
            <ChevronRight className="w-3.5 h-3.5 text-foreground group-hover:text-accent-foreground" strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </div>
  );
}
