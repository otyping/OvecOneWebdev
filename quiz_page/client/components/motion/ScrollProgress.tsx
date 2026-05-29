import { motion, useScroll, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";

/**
 * แถบบอกความคืบหน้าการเลื่อนหน้า (อยู่บนสุด) — อิง window scroll
 * ใส่ครั้งเดียวที่ระดับ layout/แอป
 */
export function ScrollProgress({ className }: { className?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      style={{ scaleX }}
      className={cn(
        "fixed inset-x-0 top-0 z-[60] h-1 origin-left bg-brand-red motion-reduce:hidden",
        className,
      )}
    />
  );
}
