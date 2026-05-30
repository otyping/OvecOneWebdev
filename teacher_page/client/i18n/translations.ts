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
  "nav.dashboard": { th: "สรุปรายงาน", en: "Dashboard" },
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
  "action.menu": { th: "เมนู", en: "Menu" },
  "action.close": { th: "ปิด", en: "Close" },
  "action.understood": { th: "เข้าใจแล้ว", en: "Understood" },

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
  "login.emailPlaceholder": { th: "your@email.com / รหัส", en: "your@email.com / ID" },
  "login.forgot.title": { th: "ตั้งค่ารหัสผ่านใหม่", en: "Reset password" },
  "login.forgot.desc": {
    th: "ส่งคำแนะนำในการตั้งค่ารหัสผ่านใหม่แล้ว",
    en: "Reset instructions have been sent",
  },
  "login.forgot.introBefore": {
    th: "รหัสผ่านของคุณได้รับการตั้งค่าใหม่เป็นวันเกิดของคุณในรูปแบบ ",
    en: "Your password has been reset to your birthday in ",
  },
  "login.forgot.introAfter": {
    th: " (ตัวอย่างเช่น: 0525 สำหรับ 25 พฤษภาคม)",
    en: " format (e.g., 0525 for May 25)",
  },
  "login.forgot.exampleLabel": { th: "ตัวอย่าง:", en: "Example:" },
  "login.forgot.exampleValue": {
    th: "วันเกิด: 25 พฤษภาคม → รหัสผ่าน: 0525",
    en: "Birthday: May 25 → Password: 0525",
  },
  "login.forgot.outro": {
    th: "คุณสามารถเปลี่ยนรหัสผ่านนี้หลังจากเข้าสู่ระบบ โปรดตรวจสอบอีเมลของคุณเพื่อดูรายละเอียดเพิ่มเติม",
    en: "You can change this password after logging in. Please check your email for more details.",
  },

  // ── หน้าลงทะเบียน ──
  "register.title": { th: "สร้างบัญชี", en: "Create account" },
  "register.subtitle": {
    th: "กรอกข้อมูลเพื่อเริ่มใช้งาน",
    en: "Fill in your details to get started",
  },
  "register.brand.tagline": {
    th: "เข้าร่วมเพื่อเริ่มสอนอย่างชาญฉลาด",
    en: "Join to teach smarter today",
  },
  "register.brand.feature1": {
    th: "สร้างแผนการสอนด้วย AI ภายในไม่กี่นาที",
    en: "Build AI lesson plans in minutes",
  },
  "register.brand.feature2": {
    th: "สื่อ วิดีโอ แบบทดสอบ พร้อมใช้",
    en: "Ready-to-use media, videos & quizzes",
  },
  "register.brand.feature3": {
    th: "ติดตามผลคะแนนนักเรียนเรียลไทม์",
    en: "Track student scores in real time",
  },
  "register.fullName": { th: "ชื่อเต็ม", en: "Full name" },
  "register.email": { th: "อีเมล", en: "Email" },
  "register.personalId": { th: "รหัสประจำตัว / ชื่อผู้ใช้", en: "ID / Username" },
  "register.password": { th: "รหัสผ่าน", en: "Password" },
  "register.confirmPassword": { th: "ยืนยันรหัสผ่าน", en: "Confirm password" },
  "register.grade.label": { th: "ชั้นปีที่สอน", en: "Grade levels you teach" },
  "register.grade.placeholder": {
    th: "เลือกชั้นปี (เลือกได้หลายชั้น)",
    en: "Select grades (multi-select)",
  },
  "register.grade.search": { th: "ค้นหาชั้นปี...", en: "Search grades..." },
  "register.grade.empty": { th: "ไม่พบชั้นปี", en: "No grades found" },
  "register.class.label": { th: "ห้องที่สอน", en: "Classrooms" },
  "register.subject.label": { th: "วิชาที่สอน", en: "Subjects" },
  "register.submit": { th: "สร้างบัญชี", en: "Create account" },
  "register.haveAccount": { th: "มีบัญชีอยู่แล้ว?", en: "Already have an account?" },
  "register.signIn": { th: "ลงชื่อเข้าใช้", en: "Sign in" },
  "register.error.passwordMismatch": {
    th: "รหัสผ่านไม่ตรงกัน",
    en: "Passwords do not match",
  },
  "register.error.passwordShort": {
    th: "รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร",
    en: "Password must be at least 6 characters",
  },

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
