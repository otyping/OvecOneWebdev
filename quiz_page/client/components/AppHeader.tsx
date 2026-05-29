import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BookOpen, LayoutGrid, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { useT } from "@/i18n/useT";
import type { TranslationKey } from "@/i18n/translations";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = { labelKey: TranslationKey; to: string };

const NAV: NavItem[] = [
  { labelKey: "nav.create", to: "/" },
  { labelKey: "nav.online", to: "/quiz/student" },
  { labelKey: "nav.offline", to: "/quiz/offline" },
  { labelKey: "nav.checkScore", to: "/check-score" },
];

const linkBase = "rounded-full px-3 py-2 text-sm font-medium transition-colors ease-smooth";
const navInactive = "text-white/85 hover:bg-white/15 hover:text-white";
const navActive = "bg-white/20 text-white";
const onRed = "border-white/40 text-white hover:bg-white/15";

/**
 * Header รวมของเว็บ (top bar โทนแดง + glass) — ดีไซน์เดียวกับ teacher_page
 * quiz = แอปลูก: เมนู quiz + ปุ่มเปิด OVEC One (แท็บใหม่)
 */
export function AppHeader() {
  const t = useT();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const isActive = (to: string) =>
    to === "/" ? location.pathname === "/" : location.pathname.startsWith(to);

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-brand-red/90 to-red-600/95 text-white shadow-soft backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/" className="flex shrink-0 items-center gap-2">
          {BRAND.logoUrl ? (
            <img src={BRAND.logoUrl} alt="" className="h-8 w-8 rounded-full ring-2 ring-white/30" />
          ) : (
            <span className="grid h-8 w-8 place-items-center rounded-xl bg-white/15">
              <BookOpen className="h-5 w-5" />
            </span>
          )}
          <span className="text-lg font-bold">{BRAND.appName}</span>
        </Link>

        {/* Desktop nav */}
        <nav className="ml-4 hidden items-center gap-1 lg:flex">
          {NAV.map((entry) => (
            <Link
              key={entry.to}
              to={entry.to}
              className={cn(linkBase, isActive(entry.to) ? navActive : navInactive)}
            >
              {t(entry.labelKey)}
            </Link>
          ))}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={BRAND.teacherAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(linkBase, "hidden items-center gap-1.5 border sm:inline-flex", onRed)}
          >
            <LayoutGrid className="h-4 w-4" />
            {t("nav.openTeacher")}
          </a>
          <LanguageToggle className={onRed} />
          <ThemeToggle className={onRed} />

          {/* Mobile menu */}
          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                aria-label="เมนู"
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/40 text-white lg:hidden"
              >
                <Menu className="h-5 w-5" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <SheetTitle className="sr-only">เมนู</SheetTitle>
              <nav className="mt-8 flex flex-col gap-1">
                {NAV.map((it) => (
                  <SheetClose asChild key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(it.to)
                          ? "bg-brand-red/10 text-brand-red"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {t(it.labelKey)}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href={BRAND.teacherAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    {t("nav.openTeacher")}
                  </a>
                </SheetClose>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
