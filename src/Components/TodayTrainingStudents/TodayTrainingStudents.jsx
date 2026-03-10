"use client";

import { useEffect, useState } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "./TodayTrainingStudents.css";

dayjs.extend(utc);
dayjs.extend(timezone);

export default function TodayTrainingStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTodayStudents = async () => {
      try {
        const res = await fetch("/api/today");
        if (!res.ok) throw new Error("Failed to load students");

        const data = await res.json();

        // Define today's training window in Colombo timezone
        const now = dayjs().tz("Asia/Colombo");
        const trainingStart = now.startOf("day").add(7, "hour"); // 7 AM
        const trainingEnd = now.startOf("day").add(18, "hour"); // 6 PM

        // Filter students whose training time falls within the window
        const todayStudents = data.filter((item) => {
          if (!item.next) return false;
          const nextDate = dayjs(item.next).tz("Asia/Colombo");
          return nextDate.isAfter(trainingStart) && nextDate.isBefore(trainingEnd);
        });

        setStudents(todayStudents);
      } catch (err) {
        console.error("Error loading today's students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayStudents();
  }, []);

  if (loading) return <p>Loading today's students...</p>;

  return (
    <div className="today-students-grid">
      <h2>Today's Training Students</h2>
      {students.length === 0 ? (
        <p>No students scheduled for today</p>
      ) : (
        <div className="students-grid">
          {students.map((item) => (
            <div key={item.id} className="student-card">
              <p>
                <strong>{item.student.name}</strong> ({item.student.nic})
              </p>
              <p>
                Next Training:{" "}
                {item.next
                  ? dayjs(item.next).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm")
                  : "N/A"}
              </p>
              <p>
                Last Training:{" "}
                {item.last
                  ? dayjs(item.last).tz("Asia/Colombo").format("YYYY-MM-DD HH:mm")
                  : "N/A"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
