import { Link, useLocation } from "react-router-dom";
import {
  BookOpen,
  FileText,
  QrCode,
  LogOut,
  Monitor,
  Menu,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed lg:static w-64 h-screen bg-sidebar text-sidebar-foreground flex flex-col transition-transform duration-300 z-50",
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border bg-sidebar-header">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-brand-red rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-white">QuizMaster</h1>
          </div>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 p-4 space-y-2 flex flex-col">
          <div className="space-y-2">
            <Link
              to="/"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive("/") || isActive("/quiz/create")
                  ? "bg-sidebar-primary text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-white"
              )}
            >
              <BookOpen className="w-5 h-5" />
              <span className="text-sm font-medium">สร้าง/แก้ไขแบบทดสอบ</span>
            </Link>

            <Link
              to="/quiz/offline"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive("/quiz/offline")
                  ? "bg-sidebar-primary text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-white"
              )}
            >
              <FileText className="w-5 h-5" />
              <span className="text-sm font-medium">แบบทดสอบออฟไลน์</span>
            </Link>

            <Link
              to="/check-score"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive("/check-score")
                  ? "bg-sidebar-primary text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-white"
              )}
            >
              <QrCode className="w-5 h-5" />
              <span className="text-sm font-medium">ตรวจสอบคะแนน</span>
            </Link>
          </div>

          <div className="border-t border-sidebar-border pt-2">
            <Link
              to="/quiz/student"
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors",
                isActive("/quiz/student")
                  ? "bg-sidebar-primary text-white"
                  : "text-sidebar-foreground hover:bg-sidebar-primary hover:text-white"
              )}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-sm font-medium">แบบทดสอบออนไลน์</span>
            </Link>
          </div>
        </nav>

        {/* Bottom Section */}
        <div className="p-4 border-t border-sidebar-border">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-white transition-colors">
            <LogOut className="w-5 h-5" />
            <span className="text-sm font-medium">ออกจากระบบ</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-auto">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 p-4 flex items-center justify-between sticky top-0 z-30">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            {sidebarOpen ? (
              <X className="w-6 h-6 text-gray-900" />
            ) : (
              <Menu className="w-6 h-6 text-gray-900" />
            )}
          </button>
          <h1 className="text-lg font-bold text-gray-900">QuizMaster</h1>
          <div className="w-10" />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
