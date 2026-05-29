/**
 * ข้อมูลแบรนด์/ตัวตนของแอป — แก้ "ชื่อแอป / โลโก้ / สโลแกน" ได้ที่ไฟล์นี้ที่เดียว
 * (คอมโพเนนต์ต่างๆ เช่น Layout/sidebar import ค่าจากที่นี่ ไม่ hardcode)
 *
 * หมายเหตุ: <title> ใน index.html เป็น HTML ล้วน แก้ไม่ได้จากที่นี่
 * แต่เราตั้ง document.title = BRAND.appName ให้อัตโนมัติใน App.tsx แล้ว
 */
export const BRAND = {
  /** ชื่อแอปที่โชว์บน sidebar / หัวเว็บ / แท็บเบราว์เซอร์ */
  appName: "QuizMaster",
  /** URL โลโก้ (เว้นว่าง "" = ใช้ไอคอนเริ่มต้น BookOpen) */
  logoUrl: "",
  /** คำโปรย */
  tagline: "สร้างและทำแบบทดสอบออนไลน์",
  /** URL ของแต่ละแอป (สำหรับปุ่มสลับแอป) — แก้ตอน deploy ผ่าน .env */
  quizAppUrl: import.meta.env.VITE_QUIZ_APP_URL || "http://localhost:8080",
  teacherAppUrl: import.meta.env.VITE_TEACHER_APP_URL || "http://localhost:8081",
} as const;
