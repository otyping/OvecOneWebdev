import { useLanguage } from "@/i18n/LanguageProvider";
import { cn } from "@/lib/utils";

/** ปุ่มสลับภาษา ไทย/อังกฤษ (โชว์ภาษาปัจจุบัน) */
export function LanguageToggle({ className }: { className?: string }) {
  const { lang, toggle } = useLanguage();
  return (
    <button
      type="button"
      onClick={toggle}
      aria-label="สลับภาษา ไทย/อังกฤษ"
      title={lang === "th" ? "Switch to English" : "เปลี่ยนเป็นภาษาไทย"}
      className={cn(
        "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-full border border-border/60 px-3 text-xs font-semibold transition-colors hover:bg-muted active:scale-95 motion-reduce:transform-none",
        className,
      )}
    >
      {lang === "th" ? "TH" : "EN"}
    </button>
  );
}
