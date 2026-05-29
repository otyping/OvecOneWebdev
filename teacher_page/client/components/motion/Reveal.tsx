import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { fadeUp, transition } from "@/lib/motion";

interface RevealProps {
  children: ReactNode;
  className?: string;
  /** หน่วงเวลาเริ่ม (วินาที) */
  delay?: number;
  /** true = เล่นตอนเลื่อนมาเห็น (scroll reveal) · false = เล่นทันทีตอน mount */
  onView?: boolean;
}

/**
 * ห่อ element ใดก็ได้ให้ "ค่อยๆ โผล่ขึ้น" ตอนเลื่อนมาเห็นหรือตอนโหลด
 * เคารพ prefers-reduced-motion (ถ้าผู้ใช้ตั้งลดการเคลื่อนไหว จะ render ปกติไม่มีมอชั่น)
 */
export function Reveal({ children, className, delay = 0, onView = true }: RevealProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={fadeUp}
      initial="hidden"
      transition={{ ...transition, delay }}
      {...(onView
        ? { whileInView: "show", viewport: { once: true, amount: 0.2 } }
        : { animate: "show" })}
    >
      {children}
    </motion.div>
  );
}
