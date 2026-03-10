"use client";

import { useEffect, useState } from "react";
import "./NextTraining.css";

export default function NextTraining({ student, refresh }) {
  const [nextTraining, setNextTraining] = useState(null);
  const [loading, setLoading] = useState(true);

  const slots = [
    { id: 1, label: "7:30-8:30" },
    { id: 2, label: "8:30-9:30" },
    { id: 3, label: "9:30-10:30" },
    { id: 4, label: "10:30-11:30" },
    { id: 5, label: "11:30-12:30" },
    { id: 6, label: "1:30-2:30" },
    { id: 7, label: "2:30-3:30" },
    { id: 8, label: "3:30-4:30" },
    { id: 9, label: "4:30-5:30" },
  ];

  useEffect(() => {
    fetchNextTraining();
  }, [student.nic]);

  const fetchNextTraining = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/schedule/student?nic=${student.nic}`);
      if (!res.ok) throw new Error("Failed to fetch schedule");
      const data = await res.json();

      // Find the closest future date
      const now = new Date();
      const futureSchedules = data
        .map(item => ({ ...item, dateObj: new Date(item.date) }))
        .filter(item => item.dateObj >= now)
        .sort((a, b) => a.dateObj - b.dateObj);

      setNextTraining(futureSchedules[0] || null);
    } catch (err) {
      console.error("Error fetching next training:", err);
      setNextTraining(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading next training...</p>;
  if (!nextTraining) return <p>No upcoming training scheduled.</p>;

  const slotLabel = slots.find((s) => s.id === nextTraining.slot)?.label || "Unknown slot";

  return (
    <div className="next-training">
      <h4>Next Training</h4>
      <p>
        Date: {new Date(nextTraining.date).toLocaleDateString()} <br />
        Time: {slotLabel}
      </p>
    </div>
  );
}
