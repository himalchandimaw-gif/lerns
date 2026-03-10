'use client';

import React from 'react'
import { usePathname } from 'next/navigation';
import Link from "next/link";
import { FaHome, FaUserGraduate, FaCalendarAlt, FaChartLine } from "react-icons/fa";
import "./hedder.css";

function Hedder() {
  const pathname = usePathname();

  const links = [
    { name: "Today", path: "/", icon: <FaHome /> },
    { name: "Students", path: "/Students", icon: <FaUserGraduate /> },
    { name: "Schedule", path: "/Schedule", icon: <FaCalendarAlt /> },
    { name: "Reports", path: "/Reports", icon: <FaChartLine /> },
  ];

  return (
    <div className="sidebar">
      <h2 className="title">Driving School</h2>

      <div className="menu">
        {links.map((link) => (
          <Link 
            key={link.path} 
            href={link.path} 
            className={`menu-item ${pathname === link.path ? "active" : ""}`}>
              <span className="icon">{link.icon}</span>
              {link.name}
          </Link>
        ))}
      </div>
    </div>
  );
}

export default Hedder;
