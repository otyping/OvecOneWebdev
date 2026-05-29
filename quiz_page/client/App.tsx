import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<QuizCreate />} />
          <Route path="/quiz/create/form" element={<QuizCreateForm />} />
          <Route path="/quiz/student" element={<QuizStudent />} />
          <Route path="/quiz/take" element={<QuizTaker />} />
          <Route path="/quiz/result" element={<QuizResult />} />
          <Route path="/quiz/offline" element={<QuizOffline />} />
          <Route path="/quiz/view" element={<QuizView />} />
          <Route path="/check-score" element={<CheckScore />} />
          <Route path="/check-score/student" element={<ScoreCheck />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

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
