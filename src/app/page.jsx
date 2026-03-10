import Image from "next/image";
import styles from "./page.module.css";
import Hedder from "@/Components/Hedder/Hedder";
import MyCalendar from "@/Components/Mycalender/MyCalendar";
import TodayTrainingStudents from "@/Components/TodayTrainingStudents/TodayTrainingStudents";
import MonthlyTrielStudents from "@/Components/MonthlyTrielStudents/MonthlyTrielStudents";
import ScheduleList from "@/Components/ScheduleList/ScheduleList";


export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <Hedder />
      <div className={styles.gridContainer}>
        
       
        <div className={styles.studentsWrapper}>
          <MonthlyTrielStudents />
        </div>
        <div className={styles.studentsWrapper}>
        
        </div>
         <div className={styles.studentsWrapper}>
           <ScheduleList />
        </div>
        <div className={styles.calendarWrapper}>
          <MyCalendar />
        </div>
      </div>
    </div>
  );
}
