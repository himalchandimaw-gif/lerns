import { useState } from "react";
import "./StatusToggle.css";

export default function StatusToggle({ student, refresh }) {
  const [status, setStatus] = useState(student.status);
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/studentst", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nic: student.nic,
          status: !status,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setStatus(updated.status);
        if (refresh) refresh(); // ✅ now safe
      } else {
        console.error("❌ Failed to update status");
      }
    } catch (err) {
      console.error("⚠️ Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={toggleStatus}
      disabled={loading}
      className={`status-btn ${status ? "active" : "inactive"}`}
    >
      {loading ? "Updating..." : status ? "✅ Active" : "❌ Inactive"}
    </button>
  );
}
