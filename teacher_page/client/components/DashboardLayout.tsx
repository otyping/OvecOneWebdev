import { type ReactNode } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardSidebar } from "./DashboardSidebar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BookOpen, LogOut, UserCircle2 } from "lucide-react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const navigate = useNavigate();
  const userEmail = localStorage.getItem("userEmail") || "teacher@example.com";
  const userName = localStorage.getItem("userName") || "Teacher";

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userName");
    navigate("/login");
  };

  const userInitials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex h-screen bg-background">
      <DashboardSidebar onLogout={handleLogout} />

      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        <header className="h-16 flex items-center justify-between px-6 shadow-sm sticky top-0 z-30 border-b border-white/15 bg-gradient-to-r from-primary via-primary to-secondary text-white">
          <div className="lg:hidden">
            <Link to="/dashboard" className="flex items-center gap-2">
              <div className="bg-primary text-primary-foreground p-1.5 rounded-full">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-white hidden sm:inline">
                TeachAssist
              </span>
            </Link>
          </div>

          <div className="flex-1" />

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                className="rounded-full h-10 w-10 p-0 flex items-center justify-center ml-2"
              >
                <div className="w-9 h-9 rounded-full bg-[#F87171] text-white flex items-center justify-center font-semibold text-sm shadow-sm">
                  {userInitials}
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 border-border/70 shadow-xl">
              <div className="px-4 py-3 border-b border-border">
                <p className="font-semibold text-foreground text-sm">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground">{userEmail}</p>
              </div>
              <DropdownMenuItem asChild>
                <Link
                  to="/dashboard/profile"
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <UserCircle2 className="w-4 h-4" />
                  ประวัติส่วนตัว
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-2 text-destructive cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  ออกจากระบบ
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </header>

        <main className="flex-1 overflow-auto">
          <div className="p-6 sm:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
