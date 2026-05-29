---
name: rebrand
description: เปลี่ยนธีมของเว็บ — สี ฟอนต์ โลโก้/ชื่อแอป ความโค้งขอบ หรือจังหวะแอนิเมชัน โดยแก้ที่จุดศูนย์กลาง. ใช้เมื่อผู้ใช้/ลูกค้าสั่งแก้ธีมสี เปลี่ยนฟอนต์ เปลี่ยนโลโก้หรือชื่อแบรนด์ ปรับความมน หรือปรับความเร็วมอชั่น.
---

# Rebrand — เปลี่ยนธีม/แบรนด์แบบแก้จุดเดียว

ทำทีละแอป (`quiz_page` หรือ `teacher_page`) — ทั้งคู่ใช้ structure เดียวกัน ถามผู้ใช้ก่อนว่าจะแก้แอปไหน (หรือทั้งคู่) และอยากได้ค่าใหม่อะไร

## จุดที่ต้องแก้ ตามสิ่งที่ลูกค้าสั่ง

### 1) สีธีม
แก้ที่ `client/global.css` เท่านั้น:
- โหมดสว่าง: บล็อก `:root` · โหมดมืด: บล็อก `.dark`
- ค่าเป็น **HSL ไม่มี `hsl()`** (เช่น `--primary: 220 13% 48%;`)
- ตัวที่ลูกค้ามักขอ: `--primary` (สีหลัก), `--secondary`/`--accent` (สีรอง/เน้น), `--background`, `--foreground`, กลุ่ม `--sidebar-*`, และ `--brand-red` (quiz_page)
- อย่าไปแก้สีใน `tailwind.config.ts` หรือ hardcode hex ในคอมโพเนนต์

### 2) ฟอนต์
แก้ 2 จุดใน `client/global.css`:
- บรรทัด `@import url("https://fonts.googleapis.com/...")` บนสุด → ใส่ฟอนต์ใหม่จาก Google Fonts
- ตัวแปร `--font-sans` ใน `:root` → ใส่ชื่อ family ใหม่ (เช่น `"Prompt", "Inter", sans-serif`)

### 3) โลโก้ / ชื่อแอป / สโลแกน
แก้ที่ `client/config/brand.ts` (`BRAND.appName`, `BRAND.logoUrl`, `BRAND.tagline`) ที่เดียว
- ถ้าจะเปลี่ยนชื่อแท็บ/favicon เบราว์เซอร์ด้วย: แก้ `<title>`/`<link rel="icon">` ใน `index.html` เพิ่ม

### 4) ความโค้งขอบ (radius)
- teacher_page: `--radius` ใน `client/global.css`
- quiz_page: ค่า `borderRadius` ใน `tailwind.config.ts`

### 5) จังหวะ/ความเร็วแอนิเมชัน
แก้ที่ `client/lib/motion.ts` → `DURATION` (เร็ว/ช้า) และ `EASE_OUT` (เส้นโค้ง easing) — มีผลกับมอชั่นทั้งเว็บ

## หลังแก้เสร็จ
- ดูผลผ่าน dev server (ใช้ skill `preview`) — hot-reload จะอัปเดตทันที
- เช็คทั้งโหมดสว่างและมืด, และทดสอบว่าคอนทราสต์อ่านง่าย
- รัน `pnpm typecheck` ถ้าแตะไฟล์ `.ts`/`.tsx`
