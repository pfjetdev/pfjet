'use client';

import HorizontalCalendar from './HorizontalCalendar';

interface SearchHeaderProps {
  from: string;
  to: string;
  fromCode: string;
  toCode: string;
  onDateSelect?: (date: Date) => void;
}

export default function SearchHeader({
  from,
  to,
  fromCode,
  toCode,
  onDateSelect
}: SearchHeaderProps) {
  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Route Title */}
      <div className="flex items-center gap-1.5">
        <h1
          className="text-foreground text-5xl font-medium tracking-[2.4px]"
          style={{ fontFamily: 'Clash Display, sans-serif' }}
        >
          {from}, {fromCode} - {to}, {toCode}
        </h1>
      </div>

      {/* Calendar */}
      <HorizontalCalendar onDateSelect={onDateSelect} />
    </div>
  );
}
