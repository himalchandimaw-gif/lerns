import React from 'react'
import styles from './Menulink.css';
import Link from 'next/link';


function Menulink({ linkname, rlink, isActive }) {
  return (
   
      <Link  href={rlink} className={`menu-link ${isActive ? 'active' : ''}`}> {linkname}</Link>
    
  )
}

export default Menulink
