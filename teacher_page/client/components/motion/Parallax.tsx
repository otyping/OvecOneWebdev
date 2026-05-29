import { useRef, type ReactNode } from "react";
import { motion, useScroll, useTransform, useReducedMotion } from "framer-motion";

interface ParallaxProps {
  children: ReactNode;
  className?: string;
  /** ระยะเลื่อน (px): มาก = ขยับเยอะ. ค่าบวก = เลื่อนขึ้นช้ากว่าหน้า */
  offset?: number;
}

/**
 * เลื่อนเนื้อหาตามการ scroll แบบ parallax เบาๆ (ใช้กับรูป/พื้นหลัง)
 * ทำงานเมื่อหน้าเลื่อนที่ระดับ window. เคารพ prefers-reduced-motion
 */
export function Parallax({ children, className, offset = 60 }: ParallaxProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [offset, -offset]);

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <div ref={ref} className={className}>
      <motion.div style={{ y }}>{children}</motion.div>
    </div>
  );
}
