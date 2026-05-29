# quiz_page — ระบบสร้าง/ทำแบบทดสอบ

ดู convention รวม + Customization Map ที่ [../CLAUDE.md](../CLAUDE.md)

## รันแอป
```bash
pnpm install && pnpm dev      # http://localhost:8080
```

## โครงสร้าง
- `client/App.tsx` — entry + routing (`AnimatedRoutes` = page transition). เพิ่มหน้าใหม่ที่นี่ เหนือ `*`
- `client/components/Layout.tsx` — sidebar + กรอบหน้า (ทุกหน้า render `<Layout>` ครอบเอง)
- `client/pages/` — หน้าแต่ละ route
- `client/lib/motion.ts` + `client/components/motion/` — ระบบมอชั่นกลาง
- `client/config/brand.ts` — ชื่อแอป/โลโก้
- `client/global.css` + `tailwind.config.ts` — ธีม สี ฟอนต์ เงา radius

## Routes หลัก
| path | หน้า |
|---|---|
| `/` | `QuizCreate` (รายการ/สร้างแบบทดสอบ — landing) |
| `/quiz/create/form` | `QuizCreateForm` (ฟอร์มสร้าง quiz, ไฟล์ใหญ่ ~1,400 บรรทัด) |
| `/quiz/student` · `/quiz/take` · `/quiz/result` | ฝั่งนักเรียนทำข้อสอบ + ผลคะแนน |
| `/quiz/offline` · `/check-score` | แบบทดสอบออฟไลน์ / ตรวจคะแนน |

## ข้อมูล (localStorage)
- คีย์ `"quizzes"` = อ็อบเจกต์ `{ [id]: QuizData }` (มี title, type online/offline, branch, subject, unit, topic, questions, ...)
- สื่อ (รูป/เสียง) คีย์ `quiz-media-{quizId}-{mediaId}`, คะแนน `quiz-score-{quizId}`
- โครงสร้างหลักสูตร (สาขา→วิชา→หน่วย→เรื่อง) hardcode อยู่ใน `QuizCreateForm.tsx`

## ทำงานดีไซน์
- การ์ดรายการ: `<Stagger>/<StaggerItem>` + class `.hover-lift` (ดูตัวอย่างใน `QuizCreate.tsx`)
- ปุ่มหลักใช้สี `bg-brand-red`; ปุ่ม shadcn `<Button>` มี micro-interaction (active:scale) ในตัว
- อย่าแตะ logic โหลด/บันทึก quiz เวลาปรับ visual
