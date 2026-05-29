import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { pageVariants, transition } from "@/lib/motion";

/**
 * ห่อเนื้อหาของแต่ละหน้า ให้ fade + เลื่อนเบาๆ ตอนสลับ route
 * ใช้คู่กับ <AnimatePresence mode="wait"> ใน App.tsx (key = location.pathname)
 */
export function PageTransition({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      variants={pageVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      transition={transition}
    >
      {children}
    </motion.div>
  );
}
