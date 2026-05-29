import type { ReactNode } from "react";

import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
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

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/school-director"
              element={
                <ProtectedRoute>
                  <SchoolDirectorDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/area-director"
              element={
                <ProtectedRoute>
                  <DashboardRolePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/lesson-plan"
              element={
                <ProtectedRoute>
                  <SavedLessonsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/video"
              element={
                <ProtectedRoute>
                  <VideoPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/slides"
              element={
                <ProtectedRoute>
                  <SlidesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/quiz"
              element={
                <ProtectedRoute>
                  <QuizPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/song"
              element={
                <ProtectedRoute>
                  <SongPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/game"
              element={
                <ProtectedRoute>
                  <GamePage />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/scores" element={<Navigate to="/dashboard" replace />} />
            <Route
              path="/dashboard/profile"
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/dashboard/create-lesson-plan"
              element={
                <ProtectedRoute>
                  <CreateLessonPlan />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-lesson-plan/generation"
              element={
                <ProtectedRoute>
                  <LessonPlanGeneration />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-lesson-plan/generation/files"
              element={
                <ProtectedRoute>
                  <GeneratedFilesPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/dashboard/create-lesson-plan/saved/:lessonId"
              element={
                <ProtectedRoute>
                  <SavedLessonViewPage />
                </ProtectedRoute>
              }
            />
            <Route path="/dashboard/materials" element={<Navigate to="/dashboard/video" replace />} />
            <Route path="/dashboard/activities" element={<Navigate to="/dashboard/slides" replace />} />
            <Route path="/dashboard/create-activity" element={<Navigate to="/dashboard/song" replace />} />
            <Route path="/dashboard/settings" element={<Navigate to="/dashboard/profile" replace />} />
            <Route path="/dashboard/quiz-builder" element={<Navigate to="/dashboard/quiz" replace />} />

            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
