import type { Lang } from "./LanguageProvider";

type Entry = Record<Lang, string>;

/**
 * คลังคำแปล ไทย/อังกฤษ — เพิ่มคีย์ใหม่ที่นี่ที่เดียว
 * ใช้ผ่าน hook: const t = useT(); t("nav.create")
 */
export const translations = {
  // ── เมนู / นำทาง ──
  "nav.create": { th: "สร้าง/แก้ไขแบบทดสอบ", en: "Create / Edit Quiz" },
  "nav.offline": { th: "แบบทดสอบออฟไลน์", en: "Offline Quizzes" },
  "nav.checkScore": { th: "ตรวจสอบคะแนน", en: "Check Scores" },
  "nav.online": { th: "แบบทดสอบออนไลน์", en: "Online Quizzes" },
  "nav.openTeacher": { th: "OVEC One", en: "OVEC One" },

  // ── ปุ่ม / การกระทำร่วม ──
  "action.logout": { th: "ออกจากระบบ", en: "Log out" },
  "action.edit": { th: "แก้ไข", en: "Edit" },
  "action.delete": { th: "ลบ", en: "Delete" },
  "action.search": { th: "ค้นหา...", en: "Search..." },
  "action.all": { th: "ทั้งหมด", en: "All" },

  // ── หน้า สร้าง/แก้ไขแบบทดสอบ ──
  "create.title": { th: "สร้าง/แก้ไขแบบทดสอบ", en: "Create / Edit Quiz" },
  "create.subtitle": {
    th: "สร้างแบบทดสอบปรนัยพร้อมสื่อภาพ เสียง และตัวเลือกคำตอบ",
    en: "Build multiple-choice quizzes with images, audio, and answer options",
  },
  "create.new": { th: "สร้างแบบทดสอบใหม่", en: "New Quiz" },
  "create.filters": { th: "ตัวกรอง", en: "Filters" },
  "create.yourQuizzes": { th: "แบบทดสอบของคุณ", en: "Your Quizzes" },
  "create.empty": { th: "ยังไม่มีแบบทดสอบ", en: "No quizzes yet" },
  "create.emptyHint": {
    th: 'คลิกปุ่ม "สร้างแบบทดสอบใหม่" เพื่อเริ่มต้น',
    en: 'Click "New Quiz" to get started',
  },
  "create.questions": { th: "คำถาม", en: "questions" },

  // ── ฟิลเตอร์ ──
  "filter.title": { th: "ชื่อแบบทดสอบ", en: "Quiz title" },
  "filter.branch": { th: "สาขาวิชา", en: "Branch" },
  "filter.subject": { th: "วิชา", en: "Subject" },
  "filter.unit": { th: "หน่วย", en: "Unit" },
  "filter.topic": { th: "เรื่อง", en: "Topic" },
  "filter.date": { th: "วันที่สร้าง", en: "Created date" },
} satisfies Record<string, Entry>;

export type TranslationKey = keyof typeof translations;
