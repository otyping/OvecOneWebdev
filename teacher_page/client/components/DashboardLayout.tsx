import type { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

/**
 * กรอบเนื้อหาของหน้า dashboard (เฉพาะ <main>) — AppHeader + พื้นหลัง อยู่ที่ shell ใน App.tsx
 * แยกออกมาเพื่อให้ header "ค้าง" ไม่ขยับตามตอนเปลี่ยนหน้า
 */
export function DashboardLayout({ children }: DashboardLayoutProps) {
  return <main className="relative z-10 mx-auto max-w-7xl p-6 sm:p-8">{children}</main>;
}
