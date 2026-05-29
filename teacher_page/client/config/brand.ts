/**
 * ข้อมูลแบรนด์/ตัวตนของแอป — แก้ "ชื่อแอป / โลโก้ / สโลแกน" ได้ที่ไฟล์นี้ที่เดียว
 * (คอมโพเนนต์ต่างๆ เช่น DashboardSidebar / Login import ค่าจากที่นี่ ไม่ hardcode)
 *
 * หมายเหตุ: <title> และ favicon ใน index.html เป็น HTML ล้วน
 * ถ้าจะเปลี่ยนชื่อแท็บ/ไอคอนเบราว์เซอร์ ให้แก้ที่ index.html เพิ่มอีก 1 จุด
 */
export const BRAND = {
  /** ชื่อแอปที่โชว์บน sidebar / หัวเว็บ */
  appName: "OVEC One",
  /** URL โลโก้ (โชว์บน sidebar) */
  logoUrl:
    "https://cdn.builder.io/api/v1/image/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Fd6cf903c88954016a06c1dbcdc8ff7c4",
  /** คำโปรย */
  tagline: "AI Buddy for Teachers",
  /** URL ของแต่ละแอป (สำหรับปุ่มสลับแอป) — แก้ตอน deploy ผ่าน .env */
  quizAppUrl: import.meta.env.VITE_QUIZ_APP_URL || "http://localhost:8080",
  teacherAppUrl: import.meta.env.VITE_TEACHER_APP_URL || "http://localhost:8081",
} as const;
