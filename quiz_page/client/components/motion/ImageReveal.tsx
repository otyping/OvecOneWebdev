import { useRef, type ReactNode } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { clipReveal, EASE_OUT } from "@/lib/motion";
import { cn } from "@/lib/utils";

interface ImageRevealProps {
  src: string;
  alt?: string;
  /** กรอบนอก: กำหนดขนาด/อัตราส่วน เช่น "aspect-video w-full" */
  className?: string;
  imgClassName?: string;
  /** ซูมรูปตอนเอาเมาส์ชี้ (ในกรอบ) */
  hoverZoom?: boolean;
  rounded?: boolean;
  /** เนื้อหาทับบนรูป เช่น ชื่อ/ป้าย/gradient overlay */
  overlay?: ReactNode;
  delay?: number;
}

/**
 * รูป "เผยตัว" ด้วย clip-path + ซูมออกเล็กน้อยเมื่อเลื่อนมาเห็น (สไตล์เว็บเอเจนซี)
 * + ออปชัน hover zoom ในกรอบ. เคารพ prefers-reduced-motion
 */
export function ImageReveal({
  src,
  alt = "",
  className,
  imgClassName,
  hoverZoom = false,
  rounded = true,
  overlay,
  delay = 0,
}: ImageRevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.3 });
  const reduce = useReducedMotion();

  return (
    <div
      ref={ref}
      className={cn("group relative overflow-hidden", rounded && "rounded-2xl", className)}
    >
      <motion.div
        className="h-full w-full"
        variants={reduce ? undefined : clipReveal}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : inView ? "show" : "hidden"}
        transition={{ duration: 0.7, ease: EASE_OUT, delay }}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          className={cn(
            "h-full w-full object-cover",
            hoverZoom &&
              "transition-transform duration-500 ease-smooth group-hover:scale-105 motion-reduce:transform-none",
            imgClassName,
          )}
        />
      </motion.div>
      {overlay != null && <div className="absolute inset-0">{overlay}</div>}
    </div>
  );
}
