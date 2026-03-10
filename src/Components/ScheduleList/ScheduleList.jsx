"use client";

import { useEffect, useState } from "react";
import "./ScheduleList.css";

export default function ScheduleList() {
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [schedule, setSchedule] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  const slots = [
    "7:30-8:30",
    "8:30-9:30",
    "9:30-10:30",
    "10:30-11:30",
    "11:30-12:30",
    "1:30-2:30",
    "2:30-3:30",
    "3:30-4:30",
    "4:30-5:30",
  ];

  useEffect(() => {
    fetchSchedule();
  }, [date]);

  const fetchSchedule = async () => {
    try {
      const res = await fetch(`/api/schedule?date=${date}`);
      const data = await res.json();
      setSchedule(data);
    } catch (err) {
      console.error("Failed to fetch schedule", err);
      setSchedule([]);
    }
  };

  // Filter students based on search term
  const filterStudents = (students) => {
    if (!searchTerm) return students;
    return students.filter(
      (stu) =>
        stu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stu.nic.includes(searchTerm)
    );
  };

  return (
    <div className="schedule-list-container">
      <h2>Student Schedule</h2>

      {/* Date Picker */}
      <div className="schedule-date-picker">
        <label>
          Select Date:{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </label>
      </div>

      {/* Search Bar */}
      <div className="schedule-search">
        <input
          type="text"
          placeholder="Search by student name or NIC..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Schedule Table */}
      <div className="schedule-table">
        <div className="schedule-header">
          <div>Time Slot</div>
          <div>Scheduled Students</div>
        </div>

        {slots.map((slot, index) => {
          const slotNumber = index + 1;
          const students = filterStudents(
            schedule
              .filter((sch) => sch.slot === slotNumber)
              .map((sch) => sch.student)
          );

          return (
            <div key={slotNumber} className="schedule-row">
              <div className="slot-time">{slot}</div>
              <div className="slot-students">
                {students.length > 0 ? (
                  <ul>
                    {students.map((stu) => (
                      <li key={stu.nic}>
                        {stu.name} ({stu.nic})
                      </li>
                    ))}
                  </ul>
                ) : (
                  <span className="empty-slot">No students</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
