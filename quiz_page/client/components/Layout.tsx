import type { ReactNode } from "react";

interface LayoutProps {
  children: ReactNode;
}

/**
 * กรอบเนื้อหาของหน้า (เฉพาะ <main>) — AppHeader + พื้นหลัง อยู่ที่ shell ใน App.tsx
 * แยกออกมาเพื่อให้ header "ค้าง" ไม่ขยับตามตอนเปลี่ยนหน้า
 */
export default function Layout({ children }: LayoutProps) {
  return <main className="mx-auto max-w-7xl p-4 md:p-8">{children}</main>;
}
