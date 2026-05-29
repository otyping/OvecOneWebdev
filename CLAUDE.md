# OVEC One — Webdev Monorepo

โปรเจคเว็บการศึกษาอาชีวะ (OVEC) ประกอบด้วย **2 เว็บแอปอิสระ** ในโฟลเดอร์เดียว:

| โฟลเดอร์ | คือ | dev port |
|---|---|---|
| [quiz_page/](quiz_page/) | ระบบสร้าง/ทำแบบทดสอบ (quiz) | 8080 |
| [teacher_page/](teacher_page/) | ระบบให้ครูออกแบบแผนการจัดการเรียนรู้ | 8080 (รันคู่กับ quiz ใช้ 8081) |

> สองแอปแยกขาดจากกัน (มี `package.json` / `node_modules` ของตัวเอง) แต่ **ใช้ convention เดียวกัน** ตามเอกสารนี้ — ดูรายละเอียดเฉพาะแอปได้ที่ [quiz_page/CLAUDE.md](quiz_page/CLAUDE.md) และ [teacher_page/CLAUDE.md](teacher_page/CLAUDE.md)

## Tech Stack (เหมือนกันทั้ง 2 แอป)
React 18 + TypeScript · **Vite** (dev/build) · **TailwindCSS 3** · **shadcn/ui** (Radix) · React Router 6 · **Framer Motion** (มอชั่น) · Express (เซิร์ฟเวอร์บางๆ) · ข้อมูลเก็บใน `localStorage` (ยังไม่มี backend จริง)

## คำสั่ง (รันในโฟลเดอร์ของแต่ละแอป)
```bash
pnpm install      # ติดตั้ง dependencies (ครั้งแรก)
pnpm dev          # dev server + hot-reload ที่ http://localhost:8080
pnpm typecheck    # ตรวจชนิดข้อมูล (tsc)
pnpm build        # build โปรดักชัน
pnpm test         # รัน Vitest
```
- ใช้ **pnpm** (ล็อก `pnpm@10.14.0`). ถ้าเครื่องไม่มี pnpm ใช้ `corepack pnpm <cmd>` แทนได้
- **รัน 2 แอปพร้อมกัน** ต้องแยกพอร์ต: แอปที่สองรัน `pnpm dev -- --port 8081`

## Preview หน้าเว็บ (สำคัญ)
แอปนี้ **ไม่ใช่ HTML static** — ดูผ่าน Vite dev server เท่านั้น (Live Server ใช้ไม่ได้):
1. `pnpm dev` ในโฟลเดอร์แอป → เปิด `http://localhost:8080`
2. ดูใน VS Code: `Ctrl+Shift+P` → **"Simple Browser: Show"** → วาง URL
3. Extensions แนะนำอยู่ใน [.vscode/extensions.json](.vscode/extensions.json) (Tailwind IntelliSense, Prettier, Edge Tools)

## 🎨 Customization Map — "ลูกค้าสั่งแก้ ⇒ แก้ที่ไฟล์ไหน" (ต่อแอป)
| ลูกค้าสั่งแก้ | แก้ที่ | จำนวนจุด |
|---|---|---|
| **สีธีม** (หลัก/รอง/พื้นหลัง/sidebar, light+dark) | `client/global.css` → `:root` และ `.dark` (HSL variables) | 1 |
| **ฟอนต์** | `client/global.css` → `@import url(...)` (โหลดฟอนต์) + `--font-sans` | 2 |
| **โลโก้ / ชื่อแอป / สโลแกน** | `client/config/brand.ts` (`BRAND`) | 1 |
| **ความโค้งขอบ** (radius) | `client/global.css` → `--radius` *(quiz ใช้ค่าใน `tailwind.config.ts`)* | 1 |
| **จังหวะ/ความเร็วแอนิเมชัน** ทั้งเว็บ | `client/lib/motion.ts` (`DURATION`, `EASE_OUT`) | 1 |
| **ชื่อแท็บ/favicon เบราว์เซอร์** | `index.html` (+ quiz ตั้ง `document.title` จาก BRAND ให้แล้ว) | 1 |

> หลักการ: สี = semantic tokens (`bg-primary`, `text-secondary`, `bg-brand-red`) เท่านั้น **อย่า hardcode hex ในคอมโพเนนต์**

## ระบบดีไซน์ & มอชั่น (ใช้ซ้ำ อย่าเขียนใหม่)
- **โทนดีไซน์:** Clean & Minimal + มอชั่นลื่น (อ้างอิงสไตล์เว็บเอเจนซี) — โปร่ง เงานุ่ม + image reveal/scroll reveal
- **มอชั่น** (`client/components/motion/`): `<Reveal>` (โผล่ตอนเลื่อนเห็น), `<Stagger>`/`<StaggerItem>` (ลิสต์ไล่กัน), `<PageTransition>` (สลับหน้า — ต่อสายใน `App.tsx` แล้ว), `<CountUp>` (ตัวเลขวิ่ง), `<ImageReveal>` (รูปเผยตัว clip-path + hover zoom), `<Parallax>`, `<Marquee>` (แถบเลื่อนวน), `<ScrollProgress>` (แถบคืบหน้าบนสุด — ใส่ใน `App.tsx` แล้ว). variants กลางอยู่ที่ `client/lib/motion.ts`
- **hover-lift:** การ์ดใช้ `<Card variant="interactive">`; element อื่นใช้ class `.hover-lift`
- **เงานุ่ม:** `shadow-soft`, `shadow-soft-lg` · **easing:** `ease-smooth` · **marquee:** `animate-marquee` (มีใน tailwind config)
- ทุกตัว **เคารพ `prefers-reduced-motion`** อัตโนมัติ — เพิ่มมอชั่นใหม่ให้คงหลักนี้ (แอนิเมตเฉพาะ `transform`/`opacity`/`clip-path`)
- **หมายเหตุ scroll:** Layout ทั้ง 2 แอปเลื่อนที่ระดับ **window** (sidebar `sticky`) เพื่อให้ `Parallax`/`ScrollProgress` ทำงาน — อย่าใส่ `overflow-auto` ครอบเนื้อหาหลักจนบล็อก window scroll

## โหมดมืด (Dark mode) & สลับภาษา (i18n)
- **Dark mode:** ใช้ `next-themes` — `<ThemeProvider>` ครอบใน `App.tsx`, ปุ่ม `<ThemeToggle>` (อยู่ใน sidebar/header). สีโหมดมืดอยู่ใน `.dark {}` ของ `client/global.css`. **ให้ใช้ semantic tokens** (`bg-background`, `bg-card`, `text-foreground`, `text-muted-foreground`, `border-border`) — อย่าใช้ `bg-white`/`text-gray-900`/`bg-gray-50` ตรงๆ ไม่งั้นโหมดมืดจะเพี้ยน
- **สลับภาษา ไทย/อังกฤษ:** ระบบเบาๆ เองที่ `client/i18n/` — `<LanguageProvider>` (จำค่าใน localStorage คีย์ `lang`), hook `useT()`, คลังคำที่ `translations.ts`, ปุ่ม `<LanguageToggle>`
  - ใช้: `const t = useT();` แล้ว `{t("create.title")}` · เพิ่มคำแปลใหม่ที่ `client/i18n/translations.ts` (คีย์เดียว มี `th`/`en`)
  - เนื้อหาไดนามิก (ชื่อหลักสูตร/ข้อมูลผู้ใช้) ยังเป็นไทย — แปลเพิ่มได้ตาม pattern เดิม

## กติกาเขียนโค้ด
- คอมโพเนนต์ให้เล็ก แตกไฟล์ย่อยเมื่อ JSX ซ้อนลึก (ช่วยให้แก้/รีแฟคเตอร์ง่าย)
- เพิ่มหน้าใหม่: สร้างไฟล์ใน `client/pages/` แล้วลงทะเบียน route ใน `client/App.tsx` (เหนือ catch-all `*`) ห่อด้วย `<PageTransition>`
- alias: `@/*` → `client/*`, `@shared/*` → `shared/*`
- ไม่มี backend จริง — ข้อมูลอยู่ใน `localStorage` (อย่าเผลอแก้ logic ส่วนนี้เวลาทำงานดีไซน์)

## หมายเหตุ
- `teacher_page` มี type error เดิมอยู่บางไฟล์ (`Dashboard`, `CreateLessonPlan`, `SavedLessonsPage`, `SchoolDirectorDashboard` — เรื่อง `symbol`/`grade`/`SubjectKey`) ไม่กระทบรันจริงเพราะ Vite ใช้ esbuild/SWC ไม่ typecheck ตอน build; ระวังอย่าทำเพิ่ม
