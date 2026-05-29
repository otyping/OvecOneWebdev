import type { Lang } from "./LanguageProvider";

type Entry = Record<Lang, string>;

/**
 * คลังคำแปล ไทย/อังกฤษ — เพิ่มคีย์ใหม่ที่นี่ที่เดียว
 * ใช้ผ่าน hook: const t = useT(); t("login.welcome")
 */
export const translations = {
  // ── เมนู / นำทาง ──
  "nav.home": { th: "หน้าหลัก", en: "Home" },
  "nav.lessonPlan": { th: "ชุดกิจกรรม", en: "Activity Sets" },
  "nav.create": { th: "สร้างชุดกิจกรรม", en: "Create Set" },
  "nav.media": { th: "สื่อ/เครื่องมือ", en: "Media & Tools" },
  "nav.video": { th: "วิดีโอ", en: "Videos" },
  "nav.slides": { th: "สไลด์", en: "Slides" },
  "nav.quiz": { th: "แบบทดสอบ", en: "Quiz" },
  "nav.song": { th: "เพลง/กิจกรรม", en: "Songs" },
  "nav.game": { th: "เกม", en: "Games" },
  "nav.profile": { th: "โปรไฟล์", en: "Profile" },
  "nav.apps": { th: "แอป", en: "Apps" },
  "nav.openQuiz": { th: "OVEC Quiz", en: "OVEC Quiz" },
  "nav.dashboard": { th: "Dashboard", en: "Dashboard" },
  "nav.dashboard.teacher": { th: "Dashboard ครู", en: "Teacher Dashboard" },
  "nav.dashboard.schoolDirector": {
    th: "Dashboard ผู้อำนวยการวิทยาลัย",
    en: "College Director Dashboard",
  },
  "nav.dashboard.areaDirector": {
    th: "Dashboard ส่วนกลาง",
    en: "Central Dashboard",
  },

  // ── หน้า Home hub ──
  "home.greeting": { th: "สวัสดี", en: "Hello" },
  "home.subtitle": {
    th: "เลือกเครื่องมือที่ต้องการเริ่มใช้งานวันนี้",
    en: "Pick a tool to get started today",
  },
  "home.create": { th: "สร้างชุดกิจกรรม", en: "Create activity set" },
  "home.createDesc": {
    th: "ออกแบบแผนการสอน + สื่อด้วย AI",
    en: "Design lesson plans & media with AI",
  },
  "home.myLessons": { th: "ชุดกิจกรรมของฉัน", en: "My activity sets" },
  "home.myLessonsDesc": { th: "ดู/จัดการที่บันทึกไว้", en: "View & manage saved sets" },
  "home.dashboard": { th: "Dashboard คะแนน", en: "Score dashboard" },
  "home.dashboardDesc": { th: "ภาพรวมผลคะแนนนักเรียน", en: "Student score overview" },
  "home.openQuiz": { th: "OVEC Quiz", en: "OVEC Quiz" },
  "home.openQuizDesc": { th: "สร้าง/ทำแบบทดสอบออนไลน์", en: "Build & take online quizzes" },
  "home.statLessons": { th: "ชุดกิจกรรมที่บันทึก", en: "Saved sets" },
  "home.statMajors": { th: "สาขาวิชา", en: "Majors" },
  "home.recent": { th: "ชุดกิจกรรมล่าสุด", en: "Recent activity sets" },
  "home.recentEmpty": { th: "ยังไม่มีชุดกิจกรรม เริ่มสร้างได้เลย", en: "No activity sets yet — create one" },
  "home.viewAll": { th: "ดูทั้งหมด", en: "View all" },

  // ── ปุ่ม / การกระทำร่วม ──
  "action.logout": { th: "ออกจากระบบ", en: "Log out" },
  "action.view": { th: "ดูข้อมูล", en: "View" },
  "action.search": { th: "ค้นหา...", en: "Search..." },

  // ── หน้าเข้าสู่ระบบ ──
  "brand.tagline": { th: "AI Buddy for Teachers.", en: "AI Buddy for Teachers." },
  "login.heroDesc": {
    th: "ช่วยสร้างสรรค์แผนการสอน สร้างกิจกรรม สื่อการสอนวิดีโอและเพลง แบบฝึกหัด ครบ จบ พร้อมใช้งานได้ทันที",
    en: "Craft lesson plans, activities, video & song media, and exercises — all ready to use instantly.",
  },
  "login.welcome": { th: "ยินดีต้อนรับ", en: "Welcome" },
  "login.subtitle": {
    th: "ลงชื่อเข้าใช้บัญชีของคุณเพื่อดำเนินการต่อ",
    en: "Sign in to your account to continue",
  },
  "login.emailLabel": { th: "อีเมลหรือรหัสประจำตัว", en: "Email or ID" },
  "login.password": { th: "รหัสผ่าน", en: "Password" },
  "login.remember": { th: "จำฉันไว้", en: "Remember me" },
  "login.forgot": { th: "ลืมรหัสผ่าน?", en: "Forgot password?" },
  "login.submit": { th: "ลงชื่อเข้าใช้", en: "Sign in" },
  "login.noAccount": { th: "ยังไม่มีบัญชี?", en: "No account yet?" },
  "login.registerHere": { th: "ลงทะเบียนที่นี่", en: "Register here" },

  // ── หน้าชุดกิจกรรมที่บันทึก ──
  "saved.title": { th: "ชุดกิจกรรมที่บันทึก", en: "Saved Activity Sets" },
  "saved.subtitle": {
    th: "ดูและจัดการชุดกิจกรรมที่คุณสร้างไว้",
    en: "View and manage the activity sets you created",
  },
  "saved.searchPlaceholder": { th: "ค้นหาชุดกิจกรรม...", en: "Search activity sets..." },
  "saved.allSubjects": { th: "ทุกวิชา", en: "All subjects" },
  "saved.sortNewest": { th: "เรียงจากวันที่สร้างล่าสุด", en: "Newest first" },
  "saved.sortOldest": { th: "เรียงจากวันที่สร้างเก่าที่สุด", en: "Oldest first" },
  "saved.create": { th: "สร้างชุดกิจกรรมใหม่", en: "New activity set" },
  "saved.empty": { th: "ยังไม่มีแผนการสอนที่บันทึกไว้", en: "No saved lesson plans yet" },
  "saved.emptyHint": { th: "เริ่มต้นโดยสร้างแผนการสอนใหม่", en: "Start by creating a new lesson plan" },
  "saved.subjectLabel": { th: "วิชา", en: "Subject" },
  "saved.createdLabel": { th: "สร้าง", en: "Created" },
} satisfies Record<string, Entry>;

export type TranslationKey = keyof typeof translations;
