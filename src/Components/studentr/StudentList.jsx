import React, { useEffect, useState } from 'react'
import './str.css'



export default function StudentList() {
  const [students, setStudents] = useState([])
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const fetchStudents = async () => {
      const res = await fetch('/api/studentdr')
      const data = await res.json()
      setStudents(data)
    }
    fetchStudents()
  }, [])

  // Filter based on name or NIC
  const filteredStudents = students
  .filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.nic.toLowerCase().includes(searchTerm.toLowerCase())
  )
  .sort((a, b) => {
    // true = 1, false = 0 → so we reverse to put active first
    return (b.status === true) - (a.status === true)
  })


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
        filteredStudents.map((student, index) => (
          <div key={index} className="student-card">
            <div><strong>Name:</strong> {student.name}</div>
            <div><strong>NIC:</strong> {student.nic}</div>
            <div><strong>Status:</strong> {student.status ? 'Active' : 'Inactive'}</div>
            
          </div>
        ))
      ) : (
        <p>No students found.</p>
      )}
    </div>
  )
}
