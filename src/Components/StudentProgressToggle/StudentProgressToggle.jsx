"use client";
import { useState } from "react";
import "./StudentProgressToggle.css";

export default function StudentProgressToggle({ student }) {
  const [data, setData] = useState(student);
  const [loading, setLoading] = useState(null);

  const toggleField = async (field) => {
    setLoading(field);
    try {
      const res = await fetch("/api/progress", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nic: data.nic,
          field,
          value: !data[field],
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setData(updated); // ✅ Update state instead of calling undefined refresh
      } else {
        console.error("❌ Failed to update:", field);
      }
    } catch (err) {
      console.error("⚠️ Error:", err);
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="progress-container">
      <h2>
        Progress for {data.name} ({data.nic})
      </h2>

      <div className="progress-grid">
        {["doc", "exam_lec", "exam", "triel"].map((field) => (
          <button
            key={field}
            onClick={() => toggleField(field)}
            disabled={loading === field}
            className={`progress-btn ${data[field] ? "active" : "inactive"}`}
          >
            {loading === field
              ? "Updating..."
              : `${field}: ${data[field] ? "✅" : "❌"}`}
          </button>
        ))}
      </div>

      {/* Show Trial Date if available */}
      {data.trielDate && (
        <p>
          <strong>Trial Date:</strong>{" "}
          {new Date(data.trielDate).toLocaleDateString()}
        </p>
      )}
    </div>
  );
}
