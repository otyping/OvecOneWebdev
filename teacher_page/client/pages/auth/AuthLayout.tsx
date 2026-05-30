import { AnimatePresence } from "framer-motion";
import { Outlet, useLocation } from "react-router-dom";

import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

/** ภาพ hero โทน AI/เทคโนโลยีทันสมัย (เปลี่ยน URL ได้ที่นี่จุดเดียว) */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80";

/** สีปุ่ม toggle บนพื้นมืด (โทนแดง) */
const onLight = "border-white/40 text-white hover:bg-white/15";

/**
 * AuthLayout
 * ──────────────────────────────────────────────────────────────
 * Parent route สำหรับหน้า /login + /register
 * - Render พื้นหลัง (ภาพ AI + กรองโทนแดง + กริด + แสงเรือง) ครั้งเดียว
 *   → BG ไม่ unmount เมื่อสลับระหว่าง /login ↔ /register จึงไม่กระพริบ
 * - Render ปุ่ม Language/Theme มุมขวาบนครั้งเดียว
 * - ภายในกลางจอ ใช้ <AnimatePresence mode="wait"> ห่อ <Outlet/>
 *   key ด้วย pathname → การ์ดทำ crossfade + scale เนียนๆ
 *   (ตัวมอชั่นจริงอยู่ใน Login.tsx / Register.tsx เพราะ Outlet เปลี่ยน child)
 */
export default function AuthLayout() {
  const location = useLocation();

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* ── พื้นหลัง: ภาพ + เคลือบโทนแดง + กริด + แสงเรือง (นิ่ง ไม่ unmount) ── */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-red-600/85 to-primary/90" />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* ปุ่มภาษา/ธีม มุมขวาบน (ห่างจาก scrollbar) */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <LanguageToggle className={onLight} />
        <ThemeToggle className={onLight} />
      </div>

      {/* ── พื้นที่กลางจอสำหรับการ์ด (Outlet) ── */}
      <div className="relative z-10 flex h-full w-full items-center justify-center overflow-y-auto px-4 py-6">
        <AnimatePresence mode="wait" initial={false}>
          {/* key = pathname → ทำให้ Login/Register fade-out → fade-in ได้
              (Login/Register เป็น motion.div เอง — เคารพ prefers-reduced-motion ภายในตัว) */}
          <Outlet key={location.pathname} />
        </AnimatePresence>
      </div>
    </div>
  );
}
