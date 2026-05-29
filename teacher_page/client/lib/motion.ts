/**
 * ระบบมอชั่นส่วนกลาง (Framer Motion)
 * ──────────────────────────────────────────────────────────────
 * แก้ "จังหวะ/ความเร็ว/ความรู้สึก" ของแอนิเมชันทั้งเว็บได้ที่ไฟล์นี้ที่เดียว
 * คอมโพเนนต์ใน client/components/motion/* ดึง variants เหล่านี้ไปใช้
 * (ตัว component จะเคารพ prefers-reduced-motion ให้อัตโนมัติ)
 */
import type { Variants, Transition } from "framer-motion";

/** ระยะเวลา (วินาที) — ปรับที่นี่เพื่อเร่ง/หน่วงมอชั่นทั้งเว็บ */
export const DURATION = { fast: 0.18, base: 0.32, slow: 0.5 } as const;

/** easing แบบ ease-out-expo ให้ความรู้สึกลื่นแบบพรีเมียม */
export const EASE_OUT: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const transition: Transition = { duration: DURATION.base, ease: EASE_OUT };
export const fastTransition: Transition = { duration: DURATION.fast, ease: EASE_OUT };

/** โผล่ขึ้นจากด้านล่างเล็กน้อย + จางเข้า (ใช้บ่อยสุด) */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

/** จางเข้าอย่างเดียว */
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  show: { opacity: 1 },
};

/** ย่อ-ขยายเข้า เหมาะกับการ์ด/โมดัล */
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.96 },
  show: { opacity: 1, scale: 1 },
};

/** container ที่สั่งให้ลูกๆ โผล่ไล่กัน (ใช้คู่กับ <Stagger>/<StaggerItem>) */
export const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
};

/** สำหรับสลับหน้า (route) แบบ fade + เลื่อนเบาๆ */
export const pageVariants: Variants = {
  hidden: { opacity: 0, y: 8 },
  show: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
};

/** เผยรูปจากบนลงล่างด้วย clip-path + ซูมออกเล็กน้อย (ใช้ใน <ImageReveal>) */
export const clipReveal: Variants = {
  hidden: { clipPath: "inset(0 0 100% 0)", scale: 1.08 },
  show: { clipPath: "inset(0 0 0% 0)", scale: 1 },
};
