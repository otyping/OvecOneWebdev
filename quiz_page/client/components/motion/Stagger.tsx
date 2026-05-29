import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { staggerContainer, fadeUp, transition } from "@/lib/motion";

interface StaggerProps {
  children: ReactNode;
  className?: string;
  /** true = เริ่มเล่นตอนเลื่อนมาเห็น · false = เล่นทันทีตอน mount */
  onView?: boolean;
}

/**
 * ครอบกลุ่ม element (เช่น ลิสต์การ์ด) ให้ลูกๆ โผล่ "ไล่กันทีละชิ้น"
 * ลูกแต่ละชิ้นต้องห่อด้วย <StaggerItem>
 */
export function Stagger({ children, className, onView = true }: StaggerProps) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={staggerContainer}
      initial="hidden"
      {...(onView
        ? { whileInView: "show", viewport: { once: true, amount: 0.15 } }
        : { animate: "show" })}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div className={className} variants={fadeUp} transition={transition}>
      {children}
    </motion.div>
  );
}
