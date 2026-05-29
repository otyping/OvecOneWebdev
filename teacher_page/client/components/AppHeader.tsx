import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  BookOpen,
  ChevronDown,
  LayoutGrid,
  LogOut,
  Menu,
  UserCircle2,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { useT } from "@/i18n/useT";
import type { TranslationKey } from "@/i18n/translations";
import { LanguageToggle } from "./LanguageToggle";
import { ThemeToggle } from "./ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

type NavItem = { labelKey: TranslationKey; to: string };
type NavEntry = NavItem | { labelKey: TranslationKey; items: NavItem[] };

/** เมนูหลัก (กลุ่มที่มีหลายรายการใช้ dropdown) */
const NAV: NavEntry[] = [
  { labelKey: "nav.home", to: "/dashboard/home" },
  { labelKey: "nav.lessonPlan", to: "/dashboard/lesson-plan" },
  { labelKey: "nav.create", to: "/dashboard/create-lesson-plan" },
  {
    labelKey: "nav.dashboard",
    items: [
      { labelKey: "nav.dashboard.teacher", to: "/dashboard" },
      { labelKey: "nav.dashboard.schoolDirector", to: "/dashboard/school-director" },
      { labelKey: "nav.dashboard.areaDirector", to: "/dashboard/area-director" },
    ],
  },
  {
    labelKey: "nav.media",
    items: [
      { labelKey: "nav.video", to: "/dashboard/video" },
      { labelKey: "nav.slides", to: "/dashboard/slides" },
      { labelKey: "nav.quiz", to: "/dashboard/quiz" },
      { labelKey: "nav.song", to: "/dashboard/song" },
      { labelKey: "nav.game", to: "/dashboard/game" },
    ],
  },
];

const linkBase = "rounded-full px-3 py-2 text-sm font-medium transition-colors ease-smooth";
// บนแถบสีแดง: ตัวอักษรขาว
const navInactive = "text-white/85 hover:bg-white/15 hover:text-white";
const navActive = "bg-white/20 text-white";
const onRed = "border-white/40 text-white hover:bg-white/15";

/**
 * Header รวมของเว็บ (top bar โทนแดง + glass) — ดีไซน์เดียวกันทั้ง 2 แอป
 * teacher = แอปหลัก: เมนูครบ + avatar/logout + ปุ่มเปิด OVEC Quiz (แท็บใหม่)
 */
export function AppHeader() {
  const t = useT();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const userEmail = localStorage.getItem("userEmail") || "teacher@example.com";
  const userName = localStorage.getItem("userName") || "Teacher";
  const initials =
    userName
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2) || "T";

  const isActive = (to: string) =>
    to === "/dashboard"
      ? location.pathname === "/dashboard"
      : location.pathname.startsWith(to);

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const flatItems = NAV.flatMap((e) => ("items" in e ? e.items : [e]));

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-gradient-to-r from-secondary/90 to-red-600/95 text-white shadow-soft backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-2 px-4 sm:px-6">
        {/* Logo */}
        <Link to="/dashboard/home" className="flex shrink-0 items-center gap-2">
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
          {NAV.map((entry) =>
            "items" in entry ? (
              <DropdownMenu key={entry.labelKey}>
                <DropdownMenuTrigger asChild>
                  <button className={cn(linkBase, "inline-flex items-center gap-1", navInactive)}>
                    {t(entry.labelKey)}
                    <ChevronDown className="h-4 w-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  {entry.items.map((it) => (
                    <DropdownMenuItem key={it.to} asChild>
                      <Link to={it.to} className="cursor-pointer">
                        {t(it.labelKey)}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                key={entry.to}
                to={entry.to}
                className={cn(linkBase, isActive(entry.to) ? navActive : navInactive)}
              >
                {t(entry.labelKey)}
              </Link>
            ),
          )}
        </nav>

        {/* Right cluster */}
        <div className="ml-auto flex items-center gap-2">
          <a
            href={BRAND.quizAppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={cn(linkBase, "hidden items-center gap-1.5 border sm:inline-flex", onRed)}
          >
            <LayoutGrid className="h-4 w-4" />
            {t("nav.openQuiz")}
          </a>
          <LanguageToggle className={onRed} />
          <ThemeToggle className={onRed} />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                aria-label={userName}
                className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white/20 text-sm font-semibold text-white ring-1 ring-white/30 transition-transform hover:scale-105 active:scale-95 motion-reduce:transform-none"
              >
                {initials}
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="font-semibold text-foreground">{userName}</div>
                <div className="text-xs font-normal text-muted-foreground">
                  {userEmail}
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link to="/dashboard/profile" className="cursor-pointer">
                  <UserCircle2 className="mr-2 h-4 w-4" />
                  {t("nav.profile")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={handleLogout}
                className="cursor-pointer text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                {t("action.logout")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

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
                {flatItems.map((it) => (
                  <SheetClose asChild key={it.to}>
                    <Link
                      to={it.to}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                        isActive(it.to)
                          ? "bg-secondary/10 text-secondary"
                          : "text-foreground hover:bg-muted",
                      )}
                    >
                      {t(it.labelKey)}
                    </Link>
                  </SheetClose>
                ))}
                <SheetClose asChild>
                  <a
                    href={BRAND.quizAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-2.5 text-sm font-medium text-foreground hover:bg-muted"
                  >
                    <LayoutGrid className="h-4 w-4" />
                    {t("nav.openQuiz")}
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
