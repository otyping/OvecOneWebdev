# teacher_page — ระบบออกแบบแผนการจัดการเรียนรู้

ดู convention รวม + Customization Map ที่ [../CLAUDE.md](../CLAUDE.md)

## รันแอป
```bash
pnpm install && pnpm dev                 # http://localhost:8080
pnpm dev -- --port 8081                  # ถ้ารันพร้อม quiz_page
```

## โครงสร้าง
- `client/main.tsx` → `client/App.tsx` — entry + routing (`AnimatedRoutes` = page transition, `ProtectedRoute` เช็คล็อกอิน + ห่อ `<PageTransition>` ให้)
- `client/components/DashboardSidebar.tsx` + `DashboardLayout.tsx` — กรอบ dashboard
- `client/pages/` — หน้าแต่ละ route · `client/lib/motion.ts` + `components/motion/` — มอชั่นกลาง
- `client/config/brand.ts` — ชื่อแอป/โลโก้ · `client/global.css` + `tailwind.config.ts` — ธีม
- `client/utils/lessonStorage.ts` — อ่าน/เขียนแผนใน localStorage · `client/data/vocationalSubjects.ts` — หลักสูตรอาชีวะ (`getMajors/getSubjects/getUnits/getTopics`)

## Routes หลัก (ต้องล็อกอิน — auth เก็บใน localStorage)
| path | หน้า |
|---|---|
| `/login` `/register` | เข้าสู่ระบบ (login → ไป `/dashboard/lesson-plan`) |
| `/dashboard/lesson-plan` | `SavedLessonsPage` (รายการชุดกิจกรรม — landing หลังล็อกอิน) |
| `/dashboard/create-lesson-plan[/generation[/files]]` | สร้างแผน → หน้าเจน → ไฟล์ผลลัพธ์ |
| `/dashboard` · `/dashboard/school-director` · `/dashboard/area-director` | Dashboard รายงานคะแนน 3 ระดับ |
| `/dashboard/{video,slides,quiz,song,game,profile}` | สื่อ/กิจกรรม/โปรไฟล์ |

## ข้อมูล (localStorage)
- auth: `isAuthenticated`, `userEmail` · แผนที่บันทึก: ผ่าน `lessonStorage.ts` (`SavedLesson`)
- ดราฟต์ฟอร์ม: `sessionStorage` คีย์ `lessonPlanGenerationDraft`

## ทำงานดีไซน์
- Dashboard มี `SummaryCard` + การ์ดที่ animate เข้า (keyframe `dashboardFadeIn` + hover-lift) อยู่แล้ว — ใช้โทน `ease-smooth`/`shadow-soft-lg`
- การ์ดรายการ (เช่น `SavedLessonsPage`) ใช้ `<Stagger>/<StaggerItem>` + `.hover-lift`
- ⚠️ บางไฟล์มี type error เดิม (`Dashboard`, `CreateLessonPlan`, `SavedLessonsPage` บรรทัด `grade`, `SchoolDirectorDashboard`) — ไม่กระทบรันจริง อย่าทำเพิ่มเวลาแก้ดีไซน์
