import { Children, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MarqueeProps {
  children: ReactNode;
  className?: string;
  /** ช่องไฟระหว่างชิ้น */
  gap?: string;
  /** หยุดเลื่อนตอนเอาเมาส์ชี้ */
  pauseOnHover?: boolean;
}

/**
 * แถบเลื่อนวนไม่รู้จบ (ticker) — ทำซ้ำเนื้อหา 2 ชุดเพื่อให้ลูปเนียน
 * ความเร็ว/ทิศทางคุมที่ animation `marquee` ใน tailwind.config.ts
 * หยุดอัตโนมัติเมื่อผู้ใช้ตั้ง prefers-reduced-motion
 */
export function Marquee({ children, className, gap = "3rem", pauseOnHover = true }: MarqueeProps) {
  const items = Children.toArray(children);
  return (
    <div className={cn("group relative flex overflow-hidden", className)}>
      {[0, 1].map((dup) => (
        <div
          key={dup}
          aria-hidden={dup === 1}
          className={cn(
            "flex shrink-0 items-center motion-reduce:animate-none animate-marquee",
            pauseOnHover && "group-hover:[animation-play-state:paused]",
          )}
          style={{ gap, paddingRight: gap }}
        >
          {items.map((item, i) => (
            <div key={i} className="shrink-0">
              {item}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
