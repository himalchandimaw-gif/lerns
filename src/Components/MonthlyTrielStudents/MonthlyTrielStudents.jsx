"use client";
import { useEffect, useState } from "react";
import "./mts.css";

export default function MonthlyTrielStudents() {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrielStudents = async () => {
      try {
        const res = await fetch("/api/triel");
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        setStudents(data);
      } catch (err) {
        console.error("⚠️ Error fetching trial students:", err);
        setStudents([]);
      } finally {
        setLoading(false);
      }
    };
    fetchTrielStudents();
  }, []);

  if (loading) return <p>Loading this month’s trial students...</p>;

  return (
    <div className="monthly-triel-students">
      <h2>This Month’s Trial Students</h2>
      {students.length === 0 ? (
  <p>No trial students scheduled this month</p>
) : (
  <div className="students-grid">
    {students.map((student) => (
      <div key={student.nic} className="student-card">
        <p>
          <strong>{student.name}</strong> ({student.nic})
        </p>
        <p className="trial-date">
          Trial Date:{" "}
          {student.trielDate
            ? new Date(student.trielDate).toLocaleDateString()
            : "N/A"}
        </p>
      </div>
    ))}
  </div>
)}

    </div>
  );
}
