---
name: preview
description: รัน Vite dev server ของแอปที่เลือก (quiz_page/teacher_page) แล้วเปิด live preview. ใช้เมื่อผู้ใช้อยากดู/รัน/พรีวิวหน้าเว็บ หรือเริ่ม dev server.
---

# Preview — รัน dev server + เปิดหน้าเว็บ

โปรเจคนี้เป็น React + Vite (ไม่ใช่ HTML static) ต้อง preview ผ่าน dev server เท่านั้น

## ขั้นตอน
1. ถามผู้ใช้ว่าจะ preview แอปไหน ถ้ายังไม่ระบุ: `quiz_page`, `teacher_page`, หรือทั้งคู่
2. ตรวจว่าติดตั้ง dependencies แล้วหรือยัง (มีโฟลเดอร์ `node_modules`); ถ้ายัง รัน `pnpm install` ในโฟลเดอร์แอปก่อน
   - ถ้าเครื่องไม่มี `pnpm` บน PATH ใช้ `corepack pnpm ...` แทน
3. รัน dev server แบบ **background** (long-running):
   - แอปเดียว: `pnpm dev` (พอร์ต 8080)
   - รัน 2 แอปพร้อมกัน: แอปแรก `pnpm dev` (8080), แอปที่สอง `pnpm dev -- --port 8081`
   - เลี่ยง `cd`: ใช้ `corepack pnpm -C "<path ของแอป>" run dev`
4. อ่านไฟล์ output ของ background task เพื่อยืนยันว่าขึ้น `VITE ready` และได้ URL
5. ยืนยันว่าเสิร์ฟได้จริง (เช่น `curl -s -o /dev/null -w "%{http_code}" http://localhost:8080/` ควรได้ 200)
6. บอกผู้ใช้ URL + วิธีเปิดใน VS Code: `Ctrl+Shift+P` → **"Simple Browser: Show"** → วาง URL

## หมายเหตุ
- hot-reload ทำงานอัตโนมัติ — แก้โค้ดแล้วหน้าเว็บอัปเดตเอง ไม่ต้องรีสตาร์ท
- อย่าใช้ Live Server/Live Preview extension (เสิร์ฟ static ใช้กับ Vite ไม่ได้)
