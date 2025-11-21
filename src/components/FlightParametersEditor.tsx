'use client';

import { Calendar, Clock, Users } from 'lucide-react';
import { DatePickerSimple } from './DatePickerSimple';

interface FlightParametersEditorProps {
  date: string;
  time: string;
  passengers: number;
  onDateChange: (date: string) => void;
  onTimeChange: (time: string) => void;
  onPassengersChange: (passengers: number) => void;
}

export default function FlightParametersEditor({
  date,
  time,
  passengers,
  onDateChange,
  onTimeChange,
  onPassengersChange,
}: FlightParametersEditorProps) {
  const formatDate = (dateStr: string) => {
    const [year, month, day] = dateStr.split('-').map(Number);
    const dateObj = new Date(year, month - 1, day);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="bg-white dark:bg-card rounded-2xl p-6 border border-border space-y-4">
      <h3
        className="text-lg font-semibold text-foreground pb-2 border-b border-border"
        style={{ fontFamily: 'Clash Display, sans-serif' }}
      >
        Flight Parameters
      </h3>

      {/* Date */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-muted-foreground" />
          <label
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Date
          </label>
        </div>
        <DatePickerSimple
          date={date}
          onDateChange={onDateChange}
        />
      </div>

      {/* Time */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-muted-foreground" />
          <label
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Time
          </label>
        </div>
        <input
          type="time"
          value={time}
          onChange={(e) => onTimeChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl bg-background border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 hover:bg-accent transition-all"
          style={{ fontFamily: 'Montserrat, sans-serif' }}
        />
      </div>

      {/* Passengers */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Users className="w-4 h-4 text-muted-foreground" />
          <label
            className="text-sm font-medium text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Passengers
          </label>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => onPassengersChange(Math.max(1, passengers - 1))}
            className="w-10 h-10 rounded-full bg-background border border-border text-foreground hover:bg-accent transition-all flex items-center justify-center font-bold"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            -
          </button>
          <div
            className="flex-1 text-center text-lg font-semibold text-foreground"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {passengers}
          </div>
          <button
            onClick={() => onPassengersChange(passengers + 1)}
            className="w-10 h-10 rounded-full bg-background border border-border text-foreground hover:bg-accent transition-all flex items-center justify-center font-bold"
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            +
          </button>
        </div>
      </div>
    </div>
  );
}
