import React, { useState } from "react";

export default function StudentRegistrationForm() {
  const [formData, setFormData] = useState({
    name: "",
    age: "",
    email: "",
    nic: "",
    tp: "",
    status: true,
    package: "",
    registrationDate: new Date().toISOString(),
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Step 1: Check if student already exists
      const checkRes = await fetch(`/api/students?nic=${formData.nic}`);
      const existingStudent = checkRes.ok ? await checkRes.json() : null;

      if (existingStudent && existingStudent.nic) {
        alert(
          `⚠️ Student already registered!\n\nName: ${existingStudent.name}\nNIC: ${existingStudent.nic}\nPackage: ${existingStudent.package}`
        );
        return;
      }

      // ✅ Step 2: Register new student
      const res = await fetch("/api/students", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        alert("✅ Student registered successfully! WhatsApp message sent.");

        // ✅ Reset form
        setFormData({
          name: "",
          age: "",
          email: "",
          nic: "",
          tp: "",
          status: true,
          package: "",
          registrationDate: new Date().toISOString(),
        });
      } else {
        const data = await res.json();
        alert("❌ Registration failed: " + (data.error || ""));
      }
    } catch (err) {
      console.error(err);
      alert("⚠️ Something went wrong.");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={formStyle}>
      <h2>Student Registration</h2>

      <label style={labelStyle}>
        Name:
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <label style={labelStyle}>
        Age:
        <input
          type="number"
          name="age"
          value={formData.age}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <label style={labelStyle}>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <label style={labelStyle}>
        NIC:
        <input
          type="text"
          name="nic"
          value={formData.nic}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <label style={labelStyle}>
        Phone Number:
        <div style={{ display: "flex" }}>
          <span
            style={{
              padding: "10px",
              background: "#f0f0f0",
              border: "1px solid #ccc",
              borderRadius: "6px 0 0 6px",
            }}
          >
            94
          </span>
          <input
            type="tel"
            name="tp"
            value={formData.tp.replace(/^94/, "")}
            onChange={(e) => {
              const digits = e.target.value.replace(/\D/g, "").slice(0, 9);
              setFormData((prev) => ({ ...prev, tp: "94" + digits }));
            }}
            style={{ ...inputStyle, borderRadius: "0 6px 6px 0" }}
            maxLength={9}
            required
          />
        </div>
      </label>

      <label style={labelStyle}>
        Package:
        <select
          name="package"
          value={formData.package}
          onChange={handleChange}
          style={inputStyle}
          required
        >
          <option value="">-- Select Package --</option>
          <option value="Motor Bike (Rs. 6000)">Motor Bike (Rs. 6000)</option>
          <option value="Motor Bike + Threewheel (Rs. 10000)">
            Motor Bike + Threewheel (Rs. 10000)
          </option>
          <option value="Motor Bike + Light Weight Vehicle">
            Motor Bike + Light Weight Vehicle
          </option>
          <option value="Motor Bike + Light Weight Vehicle + Threewheel">
            Motor Bike + Light Weight Vehicle + Threewheel
          </option>
          <option value="Heavy Duty Vehicle">Heavy Duty Vehicle</option>
        </select>
      </label>

      <label style={labelStyle}>
        Registration Date:
        <input
          type="date"
          name="registrationDate"
          value={formData.registrationDate.split("T")[0]}
          onChange={handleChange}
          style={inputStyle}
          required
        />
      </label>

      <button type="submit" style={buttonStyle}>
        Register
      </button>
    </form>
  );
}

// Styles
const formStyle = {
  maxWidth: "500px",
  margin: "40px auto",
  padding: "30px",
  border: "1px solid #e0e0e0",
  borderRadius: "10px",
  boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
  backgroundColor: "#fff",
  display: "flex",
  flexDirection: "column",
  gap: "20px",
  fontFamily: "sans-serif",
};

const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "16px",
  width: "100%",
};

const labelStyle = {
  display: "flex",
  flexDirection: "column",
  fontWeight: "600",
  color: "#333",
};

const buttonStyle = {
  padding: "12px",
  fontSize: "16px",
  fontWeight: "bold",
  backgroundColor: "#0070f3",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  transition: "background 0.3s",
};
