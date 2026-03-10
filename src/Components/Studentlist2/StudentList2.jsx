"use client";

import { useState, useEffect } from "react";
import StatusToggle from "../StatusToggle/StatusToggle";
import StudentProgressToggle from "../StudentProgressToggle/StudentProgressToggle";
import PaymentTracker from "../PaymentTracker/PaymentTracker";
import NextDateUpdater from "../NextDateUpdater/NextDateUpdater";
import StudentPackageSelector from "../StudentPackageSelector/StudentPackageSelector";
import NextTraining from "../StudentSchedule/NextTraining";
import "./StudentList2.css";

export default function StudentList2() {
  const [students, setStudents] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expanded, setExpanded] = useState({}); // track expanded state per student

  const fetchStudents = async () => {
    try {
      const res = await fetch("/api/studentdr");
      if (!res.ok) throw new Error("Failed to fetch students");
      const data = await res.json();
      setStudents(data);
    } catch (err) {
      console.error("⚠️ Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = students
    .filter((student) => {
      const term = searchTerm.toLowerCase();
      return (
        student.name.toLowerCase().includes(term) ||
        student.nic.toLowerCase().includes(term)
      );
    })
    .sort((a, b) => (b.status === true) - (a.status === true));

  const toggleExpand = (nic) => {
    setExpanded((prev) => ({ ...prev, [nic]: !prev[nic] }));
  };

  return (
    <div className="student-list-container">
      <h2>Registered Students</h2>
      <input
        type="text"
        placeholder="Search by name or NIC..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-input"
      />

      {filteredStudents.length > 0 ? (
        filteredStudents.map((student) => (
          <div key={student.nic} className="student-card">
            <div className="student-summary">
              <div>
                <strong>Name:</strong> {student.name}
              </div>
              <div>
                <strong>NIC:</strong> {student.nic}
              </div>
              <div>
                <strong>Status:</strong>{" "}
                {student.status ? "Active" : "Inactive"}
              </div>
              <button
                className="toggle-btn"
                onClick={() => toggleExpand(student.nic)}
              >
                {expanded[student.nic] ? "Hide Details" : "Show Details"}
              </button>
            </div>

            {expanded[student.nic] && (
              <div className="student-details">
                <StatusToggle
                  key={`status-${student.nic}`}
                  student={student}
                  refresh={fetchStudents}
                />
                <StudentProgressToggle
                  key={`progress-${student.nic}`}
                  student={student}
                  refresh={fetchStudents}
                />
                <PaymentTracker
                  key={`payment-${student.nic}`}
                  student={student}
                  refresh={fetchStudents}
                />
               
                <StudentPackageSelector
                  key={`pkg-${student.nic}`}
                  student={student}
                  refresh={fetchStudents}
                />
                <NextTraining
                  key={`next-training-${student.nic}`}
                  student={student}
                  refresh={fetchStudents}
                />
              </div>
            )}
          </div>
        ))
      ) : (
        <p>No students found.</p>
      )}
    </div>
  );
}
