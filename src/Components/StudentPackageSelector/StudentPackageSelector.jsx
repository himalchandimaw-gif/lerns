"use client";
import { useState } from "react";
import "./StudentPackageSelector.css";

export default function StudentPackageSelector({ student, refresh }) {
  const [pkg, setPkg] = useState(student.package || "");
  const [loading, setLoading] = useState(false);

  const packageOptions = [
    "Motor Bike - Rs.6000",
    "Motor Bike + Threewheel - Rs.10000",
    "Motor Bike + Light Weight Vehicle",
    "Motor Bike + Light Weight Vehicle + Threewheel",
    "Heavy Duty Vehicle",
  ];

  const handleChange = async (e) => {
    const newPkg = e.target.value;
    setPkg(newPkg);
    setLoading(true);

    try {
      const res = await fetch("/api/pkg", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nic: student.nic, pkg: newPkg }),
      });

      if (!res.ok) throw new Error("Failed to update package");

      if (refresh) refresh(); // 🔄 refresh student list
    } catch (err) {
      console.error(err);
      alert("Error updating package");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="package-selector">
      <label>
        <strong>Package:</strong>
        <select value={pkg} onChange={handleChange} disabled={loading}>
          <option value="">-- Select Package --</option>
          {packageOptions.map((option, idx) => (
            <option key={idx} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>
      {loading && <p>Updating...</p>}
    </div>
  );
}
