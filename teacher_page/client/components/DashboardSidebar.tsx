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

interface DashboardSidebarProps {
  onLogout: () => void;
}

const dashboardItems = [
  { label: "Dashboard ครู", path: "/dashboard" },
  { label: "Dashboard ผู้อำนวยการวิทยาลัย", path: "/dashboard/school-director" },
  { label: "Dashboard ส่วนกลาง", path: "/dashboard/area-director" },
];

const mainMenuItems = [
  { label: "ชุดกิจกรรม", icon: BookOpen, path: "/dashboard/lesson-plan" },
];

export function DashboardSidebar({ onLogout }: DashboardSidebarProps) {
  const location = useLocation();
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
          "fixed lg:static inset-y-0 left-0 w-64 bg-[#31363F] text-white z-40 flex flex-col transition-transform lg:translate-x-0 shadow-2xl shadow-primary/20",
          isOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="p-6 border-b border-white/10 bg-white/10 backdrop-blur-sm">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="https://cdn.builder.io/api/v1/image/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Fd6cf903c88954016a06c1dbcdc8ff7c4" alt="OVEC Logo" className="w-8 h-8 rounded-full" />
            <span className="font-bold text-lg text-white">OVEC One</span>
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
                  "block w-full flex items-center gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left",
                  active ? "bg-[#4A5267] text-white shadow-lg shadow-primary/20" : "text-white hover:bg-[#4A5267]",
                )}
              >
                <Icon className="w-5 h-5 flex-shrink-0" />
                <span>{item.label}</span>
              </Link>
            );
          })}

          <Collapsible open={isDashboardOpen} onOpenChange={setIsDashboardOpen} className="space-y-2">
            <CollapsibleTrigger asChild>
              <button
                className={cn(
                  "w-full flex items-center justify-between gap-3 px-4 py-3 rounded-lg font-medium transition-colors text-left",
                  isDashboardActive
                    ? "bg-[#4A5267] text-white shadow-lg shadow-primary/20"
                    : "text-white hover:bg-[#4A5267]",
                )}
              >
                <span className="flex items-center gap-3">
                  <LayoutDashboard className="w-5 h-5 flex-shrink-0" />
                  <span>Dashboard</span>
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
                      "block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#4A5267] text-white shadow-sm"
                        : "text-white/90 hover:bg-[#4A5267] hover:text-white",
                    )}
                  >
                    {item.label}
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
            ออกจากระบบ
          </Button>
        </div>
      </aside>
    </>
  );
}
