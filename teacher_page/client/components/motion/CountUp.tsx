import { useEffect, useRef } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_OUT } from "@/lib/motion";

interface CountUpProps {
  /** ค่าปลายทาง */
  to: number;
  /** ค่าเริ่มต้น (ดีฟอลต์ 0) */
  from?: number;
  /** ระยะเวลานับ (วินาที) */
  duration?: number;
  /** จำนวนทศนิยม */
  decimals?: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}

/**
 * ตัวเลข "วิ่งขึ้น" เมื่อเลื่อนมาเห็น (เช่น สถิติบน Dashboard)
 * เคารพ prefers-reduced-motion (ถ้าลดการเคลื่อนไหว จะโชว์ค่าปลายทางทันที)
 */
export function CountUp({
  to,
  from = 0,
  duration = 1.2,
  decimals = 0,
  prefix = "",
  suffix = "",
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const format = (v: number) =>
      `${prefix}${v.toLocaleString("th-TH", {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
      })}${suffix}`;

    if (reduce) {
      node.textContent = format(to);
      return;
    }
    if (!inView) return;

    const controls = animate(from, to, {
      duration,
      ease: EASE_OUT,
      onUpdate: (v) => {
        node.textContent = format(v);
      },
    });
    return () => controls.stop();
  }, [inView, reduce, to, from, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className}>
      {`${prefix}${from}${suffix}`}
    </span>
  );
}
