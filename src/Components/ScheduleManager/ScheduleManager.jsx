"use client";

import { useEffect, useState } from "react";
import "./StudentScheduler.css";

export default function ScheduleManager() {
  const [activeStudents, setActiveStudents] = useState([]);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState({});
  const [schedule, setSchedule] = useState([]);

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
    fetch("/api/active-students")
      .then((res) => res.json())
      .then(setActiveStudents)
      .catch(console.error);

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

  const handleSelectChange = (slot, e) => {
    const options = Array.from(e.target.selectedOptions, (option) => {
      const [nic, name] = option.value.split("|");
      return { nic, name };
    });
    setSelectedStudents((prev) => ({ ...prev, [slot]: options }));
  };

  const removeStudentFromSlot = async (slot, nic) => {
    try {
      await fetch("/api/schedule", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slot, nic }),
      });
      fetchSchedule();
    } catch (err) {
      console.error("Failed to remove student", err);
    }
  };

  const saveSlot = async (slot) => {
    if (!selectedStudents[slot] || selectedStudents[slot].length === 0) return;

    for (const stu of selectedStudents[slot]) {
      await fetch("/api/schedule/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, slot, nic: stu.nic }),
      });
    }

    fetchSchedule();
    setSelectedStudents((prev) => ({ ...prev, [slot]: [] }));
  };

  return (
    <div className="scheduler-container">
      <h2>Student Scheduler</h2>

      <div className="scheduler-date">
        <label>
          Select Date:
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
        </label>
      </div>

      <input
        type="text"
        placeholder="Search active students by name or NIC..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {slots.map((slotTime, index) => {
        const slotNumber = index + 1;

        const scheduled = schedule
          .filter((sch) => sch.slot === slotNumber)
          .map((sch) => sch.student);

        const availableStudents = activeStudents
          .filter(
            (stu) =>
              !scheduled.find((s) => s.nic === stu.nic) &&
              (stu.name.toLowerCase().includes(searchTerm.toLowerCase()) || stu.nic.includes(searchTerm))
          )
          .slice(0, 20);

        return (
          <div key={slotNumber} className="slot-card">
            <h3>
              Slot {slotNumber}: {slotTime}
            </h3>

            <p>Scheduled Students:</p>
            <ul>
              {scheduled.map((stu) => (
                <li key={stu.nic}>
                  {stu.name}{" "}
                  <button className="remove-btn" onClick={() => removeStudentFromSlot(slotNumber, stu.nic)}>
                    Remove
                  </button>
                </li>
              ))}
            </ul>

            <p>Select Students to Add:</p>
            <select
              multiple
              value={(selectedStudents[slotNumber] || []).map((stu) => `${stu.nic}|${stu.name}`)}
              onChange={(e) => handleSelectChange(slotNumber, e)}
              className="student-dropdown"
            >
              {availableStudents.map((stu) => (
                <option key={stu.nic} value={`${stu.nic}|${stu.name}`}>
                  {stu.name} ({stu.nic})
                </option>
              ))}
            </select>

            <button className="save-btn" onClick={() => saveSlot(slotNumber)}>
              Save Slot
            </button>
          </div>
        );
      })}
    </div>
  );
}
