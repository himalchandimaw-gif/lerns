
'use client';

import React from 'react'
import Hedder from "@/Components/Hedder/Hedder";
import styles from './st.css';
import Tabc from '@/Components/tab/Tabc' // adjust the path based on your file structure
import StudentRegistrationForm from '@/Components/Application/StudentRegistrationForm';
import StudentList from '@/Components/studentr/StudentList';
import StudentList2 from '@/Components/Studentlist2/StudentList2';





function page() {
  return (
    <>
    <div>
    <Hedder/>
      <div className='s1'>
      <Tabc
  tabs={[
    { name: 'Home', content: () => <div><StudentRegistrationForm /></div> },
    { name: 'Profile', content: () => <div><StudentList/></div> },
    { name: 'Settings', content:()=> <div><StudentList2/>
</div> }
  ]}
/>

      </div>
    </div>  </>
  )
}

export default page
