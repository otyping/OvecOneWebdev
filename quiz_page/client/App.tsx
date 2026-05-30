import "./global.css";

import { useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AppHeader } from "@/components/AppHeader";
import { BRAND } from "@/config/brand";
import { consumeAuthHandoff } from "@/lib/consumeAuthHandoff";
import NotFound from "./pages/NotFound";
import QuizCreate from "./pages/QuizCreate";
import QuizCreateForm from "./pages/QuizCreateForm";
import QuizStudent from "./pages/QuizStudent";
import QuizTaker from "./pages/QuizTaker";
import QuizResult from "./pages/QuizResult";
import QuizOffline from "./pages/QuizOffline";
import QuizView from "./pages/QuizView";
import CheckScore from "./pages/CheckScore";
import ScoreCheck from "./pages/ScoreCheck";

const queryClient = new QueryClient();

// ตั้งชื่อแท็บเบราว์เซอร์จาก BRAND (override ค่าใน index.html)
document.title = BRAND.appName;

/**
 * Shell: AppHeader + พื้นหลัง "ค้างถาวร" (ไม่อยู่ใน AnimatePresence)
 * → เปลี่ยนหน้าแล้ว header ไม่ขยับ/ไม่ fade ตาม มีแต่เนื้อหา (PageTransition) ที่สลับ
 */
const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-brand-red/10">
      <AppHeader />
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><QuizCreate /></PageTransition>} />
        <Route path="/quiz/create/form" element={<PageTransition><QuizCreateForm /></PageTransition>} />
        <Route path="/quiz/student" element={<PageTransition><QuizStudent /></PageTransition>} />
        <Route path="/quiz/take" element={<PageTransition><QuizTaker /></PageTransition>} />
        <Route path="/quiz/result" element={<PageTransition><QuizResult /></PageTransition>} />
        <Route path="/quiz/offline" element={<PageTransition><QuizOffline /></PageTransition>} />
        <Route path="/quiz/view" element={<PageTransition><QuizView /></PageTransition>} />
        <Route path="/check-score" element={<PageTransition><CheckScore /></PageTransition>} />
        <Route path="/check-score/student" element={<PageTransition><ScoreCheck /></PageTransition>} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

const App = () => {
  /*
   * Cross-app auth handoff (POC dev-only)
   * รับ ?token=email&from=teacher จาก teacher_page → ตั้ง localStorage แล้ว clean URL
   * เรียก 1 ครั้งตอน mount เท่านั้น (ก่อน BrowserRouter parse path เสร็จก็ทันใช้)
   * ⚠️ ไม่ secure — ดู client/lib/consumeAuthHandoff.ts
   */
  useEffect(() => {
    consumeAuthHandoff();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <LanguageProvider>
        <QueryClientProvider client={queryClient}>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <ScrollProgress />
            <BrowserRouter>
              <AnimatedRoutes />
            </BrowserRouter>
          </TooltipProvider>
        </QueryClientProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

declare global {
  interface Window {
    __REACT_ROOT__?: any;
  }
}

const rootElement = document.getElementById("root");

if (rootElement) {
  if (!window.__REACT_ROOT__) {
    window.__REACT_ROOT__ = createRoot(rootElement);
  }
  window.__REACT_ROOT__.render(<App />);
}
