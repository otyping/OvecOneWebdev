import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import {
  BookOpen,
  ChevronDown,
  LayoutDashboard,
  Menu,
  UserCircle2,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BRAND } from "@/config/brand";
import { useT } from "@/i18n/useT";
import type { TranslationKey } from "@/i18n/translations";

interface DashboardSidebarProps {
  onLogout: () => void;
}

const dashboardItems: { labelKey: TranslationKey; path: string }[] = [
  { labelKey: "nav.dashboard.teacher", path: "/dashboard" },
  { labelKey: "nav.dashboard.schoolDirector", path: "/dashboard/school-director" },
  { labelKey: "nav.dashboard.areaDirector", path: "/dashboard/area-director" },
];

const mainMenuItems: { labelKey: TranslationKey; icon: typeof BookOpen; path: string }[] = [
  { labelKey: "nav.lessonPlan", icon: BookOpen, path: "/dashboard/lesson-plan" },
];

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  const location = useLocation();
  const t = useT();
  const [isOpen, setIsOpen] = useState(false);
  const [isDashboardOpen, setIsDashboardOpen] = useState(true);

  const isDashboardActive = dashboardItems.some((item) =>
    item.path === "/dashboard" ? location.pathname === "/dashboard" : location.pathname.startsWith(item.path),
  );

  useEffect(() => {
    if (isDashboardActive) {
      setIsDashboardOpen(true);
    }
  }, [isDashboardActive]);

  const isActive = (path: string) => {
    if (path === "/dashboard") {
      return location.pathname === "/dashboard";
    }

    return location.pathname.startsWith(path);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 bg-secondary text-white p-2 rounded-full shadow-md"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 w-64 bg-[#31363F] text-white flex flex-col transition-transform shadow-2xl shadow-primary/20 lg:sticky lg:top-0 lg:h-screen lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-white/10 bg-white/10 backdrop-blur-sm">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src={BRAND.logoUrl} alt={`${BRAND.appName} Logo`} className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg text-white">{BRAND.appName}</span>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={cn(
                  "block w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-smooth hover:translate-x-0.5 text-left motion-reduce:transform-none",
                  active ? "bg-[#4A5267] text-white shadow-lg shadow-primary/20" : "text-white hover:bg-[#4A5267]",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{t(item.labelKey)}</span>
              </Link>
            );
          })}

          <Collapsible open={isDashboardOpen} onOpenChange={setIsDashboardOpen} className="space-y-2">
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-all duration-200 ease-smooth hover:translate-x-0.5 text-left motion-reduce:transform-none",
                  isDashboardActive
                    ? "bg-[#4A5267] text-white shadow-lg shadow-primary/20"
                    : "text-white hover:bg-[#4A5267]",
                )}
              >
                <span className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  <span>{t("nav.dashboard")}</span>
                </span>
                <ChevronDown
                  className={cn("w-4 h-4 transition-transform", isDashboardOpen && "rotate-180")}
                />
              </button>
            </CollapsibleTrigger>

            <CollapsibleContent className="pl-4 space-y-2">
              {dashboardItems.map((item) => {
                const active = isActive(item.path);
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "block rounded-lg px-4 py-2.5 text-sm font-medium transition-all duration-200 ease-smooth hover:translate-x-0.5 motion-reduce:transform-none",
                      active
                        ? "bg-[#4A5267] text-white shadow-sm"
                        : "text-white/90 hover:bg-[#4A5267] hover:text-white",
                    )}
                  >
                    {t(item.labelKey)}
                  </Link>
                );
              })}
            </CollapsibleContent>
          </Collapsible>
        </nav>

        <div className="p-4 border-t border-white/10">
          <Button
            variant="ghost"
            onClick={onLogout}
            className="w-full rounded-full border border-white text-white hover:bg-white/10 hover:text-white"
          >
            {t("action.logout")}
          </Button>
        </div>
      </aside>
    </>
  );
}
