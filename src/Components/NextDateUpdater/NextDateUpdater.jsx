"use client";
import { useState, useEffect } from "react";
import "./NextDateUpdater.css";


export default function NextDateUpdater({ student }) {
  const [nextDate, setNextDate] = useState("");
  const [lastDate, setLastDate] = useState("");

  useEffect(() => {
    // Load current dates for this student
    const fetchDates = async () => {
      const res = await fetch(`/api/nextdate?nic=${student.nic}`);
      if (res.ok) {
        const data = await res.json();
        setNextDate(data.next ? new Date(data.next).toISOString().split("T")[0] : "");
        setLastDate(data.last ? new Date(data.last).toISOString().split("T")[0] : "");
      }
    };
    fetchDates();
  }, [student.nic]);

  const handleUpdate = async () => {
    if (!nextDate) return alert("Please select a next date");

    const res = await fetch("/api/nextdate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nic: student.nic, nextDate }),
    });

    if (res.ok) {
      const data = await res.json();
      setNextDate(new Date(data.next).toISOString().split("T")[0]);
      setLastDate(new Date(data.last).toISOString().split("T")[0]);
    } else {
      alert("Failed to update date");
    }
  };

  return (
    <div className="nextdate-card">
      <h4>{student.name} ({student.nic})</h4>
      <p><strong>Last Training:</strong> {lastDate || "N/A"}</p>
      <p><strong>Next Training:</strong> {nextDate || "Not set"}</p>

      <input
        type="date"
        value={nextDate}
        onChange={(e) => setNextDate(e.target.value)}
      />
      <button onClick={handleUpdate}>Update Next Date</button>
    </div>
  );
  
}
