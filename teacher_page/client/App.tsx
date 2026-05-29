import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { ThemeProvider } from "next-themes";
import { PageTransition } from "@/components/motion/PageTransition";
import { ScrollProgress } from "@/components/motion/ScrollProgress";
import { LanguageProvider } from "@/i18n/LanguageProvider";
import { AppHeader } from "@/components/AppHeader";
import { Hero3DBackground } from "@/components/three/Hero3DBackground";
import { cn } from "@/lib/utils";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import LessonPlans from "./pages/LessonPlans";
import CreateLessonPlan from "./pages/CreateLessonPlan";
import LessonPlanGeneration from "./pages/LessonPlanGeneration";
import GeneratedFilesPage from "./pages/GeneratedFilesPage";
import SavedLessonsPage from "./pages/SavedLessonsPage";
import SavedLessonViewPage from "./pages/SavedLessonViewPage";
import VideoPage from "./pages/Materials";
import SlidesPage from "./pages/Activities";
import QuizPage from "./pages/CreateQuiz";
import SongPage from "./pages/CreateActivity";
import GamePage from "./pages/Game";
import ProfilePage from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { DashboardRolePage } from "./pages/DashboardRolePage";
import SchoolDirectorDashboard from "./pages/SchoolDirectorDashboard";

const queryClient = new QueryClient();

/**
 * ตรวจสิทธิ์ + ห่อหน้าด้วย <PageTransition> ให้อัตโนมัติ
 * (ถ้ายังไม่ล็อกอินจะ redirect ไป /login โดยไม่มีทรานสิชัน)
 */
const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <PageTransition>{children}</PageTransition>;
};

/**
 * สลับหน้าแบบมีทรานสิชัน: ห่อ <Routes> ด้วย <AnimatePresence>
 * key ด้วย location.pathname → หน้าเก่า fade-out ก่อนหน้าใหม่ fade-in
 */
const AnimatedRoutes = () => {
  const location = useLocation();
  // หน้า dashboard มี header ค้างถาวร; หน้า login/register ไม่มี header
  const showHeader = location.pathname.startsWith("/dashboard");
  // พื้นหลัง 3D อินเทอร์แอกทีฟ เฉพาะหน้า Home hub
  const isHome = location.pathname === "/dashboard/home";
  return (
    <div
      className={cn(
        "min-h-screen",
        showHeader && "bg-gradient-to-br from-background via-background to-secondary/10",
      )}
    >
      {showHeader && <AppHeader />}
      {isHome && <Hero3DBackground />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />

        <Route path="/dashboard/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/school-director" element={<ProtectedRoute><SchoolDirectorDashboard /></ProtectedRoute>} />
        <Route path="/dashboard/area-director" element={<ProtectedRoute><DashboardRolePage /></ProtectedRoute>} />
        <Route path="/dashboard/lesson-plan" element={<ProtectedRoute><SavedLessonsPage /></ProtectedRoute>} />
        <Route path="/dashboard/video" element={<ProtectedRoute><VideoPage /></ProtectedRoute>} />
        <Route path="/dashboard/slides" element={<ProtectedRoute><SlidesPage /></ProtectedRoute>} />
        <Route path="/dashboard/quiz" element={<ProtectedRoute><QuizPage /></ProtectedRoute>} />
        <Route path="/dashboard/song" element={<ProtectedRoute><SongPage /></ProtectedRoute>} />
        <Route path="/dashboard/game" element={<ProtectedRoute><GamePage /></ProtectedRoute>} />
        <Route path="/dashboard/scores" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />

        <Route path="/dashboard/create-lesson-plan" element={<ProtectedRoute><CreateLessonPlan /></ProtectedRoute>} />
        <Route path="/dashboard/create-lesson-plan/generation" element={<ProtectedRoute><LessonPlanGeneration /></ProtectedRoute>} />
        <Route path="/dashboard/create-lesson-plan/generation/files" element={<ProtectedRoute><GeneratedFilesPage /></ProtectedRoute>} />
        <Route path="/dashboard/create-lesson-plan/saved/:lessonId" element={<ProtectedRoute><SavedLessonViewPage /></ProtectedRoute>} />

        <Route path="/dashboard/materials" element={<Navigate to="/dashboard/video" replace />} />
        <Route path="/dashboard/activities" element={<Navigate to="/dashboard/slides" replace />} />
        <Route path="/dashboard/create-activity" element={<Navigate to="/dashboard/song" replace />} />
        <Route path="/dashboard/settings" element={<Navigate to="/dashboard/profile" replace />} />
        <Route path="/dashboard/quiz-builder" element={<Navigate to="/dashboard/quiz" replace />} />

        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="*" element={<PageTransition><NotFound /></PageTransition>} />
        </Routes>
      </AnimatePresence>
    </div>
  );
};

export default function App() {
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
}
