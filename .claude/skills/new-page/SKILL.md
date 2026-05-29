---
name: new-page
description: สร้างหน้า/route ใหม่ในแอป quiz_page หรือ teacher_page ตาม convention ของโปรเจค (พร้อม page transition + layout). ใช้เมื่อผู้ใช้อยากเพิ่มหน้าใหม่ เพิ่มเมนู หรือเพิ่ม route.
---

# New Page — เพิ่มหน้า/route ใหม่ตาม convention

ถามก่อน: แอปไหน (`quiz_page`/`teacher_page`), ชื่อหน้า, path ที่ต้องการ, ต้องล็อกอินก่อนไหม (teacher_page)

## ขั้นตอน
1. **สร้างไฟล์หน้า** `client/pages/< ชื่อ >.tsx`
   - quiz_page: ห่อเนื้อหาด้วย `<Layout> ... </Layout>` (import `@/components/Layout`)
   - teacher_page: ห่อด้วย `<DashboardLayout> ... </DashboardLayout>`
   - ใช้ดีไซน์โทน Clean & Minimal: การ์ดใช้ `<Card variant="interactive">` หรือ class `.hover-lift`, ลิสต์ใช้ `<Stagger>/<StaggerItem>`, ส่วนที่ควรโผล่ตอนเลื่อนใช้ `<Reveal>`
2. **ลงทะเบียน route** ใน `client/App.tsx` ภายใน `AnimatedRoutes` — เพิ่ม `<Route>` **เหนือ** catch-all `path="*"`
   - quiz_page: `element={<PageTransition><MyPage /></PageTransition>}`
   - teacher_page (ต้องล็อกอิน): `element={<ProtectedRoute><MyPage /></ProtectedRoute>}` (ProtectedRoute ห่อ PageTransition ให้แล้ว); หน้าสาธารณะห่อ `<PageTransition>` เอง
3. **เพิ่มเมนู** (ถ้าต้องมีลิงก์): quiz → `client/components/Layout.tsx`; teacher → `client/components/DashboardSidebar.tsx` (เพิ่มใน `mainMenuItems`/`dashboardItems`) — ใช้คลาส nav เดิมที่มี hover-slide
4. ดูผลผ่าน dev server (skill `preview`) + รัน `pnpm typecheck`

## หลักการ
- ใช้ semantic color tokens (`bg-primary`, `text-muted-foreground`) ไม่ hardcode สี
- คอมโพเนนต์เล็ก แตกไฟล์ย่อยถ้า JSX ยาว
- ไม่ต้องเขียน animation เอง — ใช้ของจาก `client/components/motion/`
