'use client';
import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './calendar.css';

export default function MyCalendar() {
  const [value, setValue] = useState(new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0); // Normalize time

  return (
    <div className="calendar-container">
      <Calendar
        onChange={setValue}
        value={value}
        tileClassName={({ date, view }) => {
          date.setHours(0, 0, 0, 0); // Normalize time for comparison
          if (view === 'month' && date.getTime() === today.getTime()) {
            return 'today-highlight';
          }
          return null;
        }}
      />
    </div>
  );
}
