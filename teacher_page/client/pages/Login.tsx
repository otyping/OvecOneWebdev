import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BookOpen, Sparkles } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BRAND } from "@/config/brand";
import { useT } from "@/i18n/useT";
import { DURATION, EASE_OUT } from "@/lib/motion";

/**
 * variants สำหรับการ์ดล็อกอิน — fade + scale เนียนๆ
 * BG + ปุ่ม toggle ถูก render ที่ <AuthLayout> ส่วนตัวการ์ดสลับด้วยมอชั่นนี้
 */
const cardVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.98 },
};

export default function Login() {
  const navigate = useNavigate();
  const t = useT();
  const reduce = useReducedMotion();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showForgotModal, setShowForgotModal] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", email);
    }
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    navigate("/dashboard/home");
  };

  return (
    <motion.div
      className="w-full max-w-md"
      variants={reduce ? undefined : cardVariants}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "show"}
      exit={reduce ? undefined : "exit"}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      {/* ── การ์ดล็อกอินกระจกฝ้า (กลางจอ — center โดย AuthLayout) ── */}
      <Stagger onView={false}>
        <StaggerItem className="mb-6 flex flex-col items-center text-center text-white">
          <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
            <BookOpen className="h-7 w-7" />
          </span>
          <h1 className="text-2xl font-bold">{BRAND.appName}</h1>
          <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
            <Sparkles className="h-3.5 w-3.5" />
            {t("brand.tagline")}
          </span>
        </StaggerItem>

        <StaggerItem>
          <div className="glass rounded-3xl p-7 shadow-soft-lg sm:p-8">
            <h2 className="text-2xl font-bold text-foreground">{t("login.welcome")}</h2>
            <p className="mt-1 text-sm text-muted-foreground">{t("login.subtitle")}</p>

            <form onSubmit={handleLogin} className="mt-6 space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  {t("login.emailLabel")}
                </label>
                <Input
                  id="email"
                  type="text"
                  placeholder={t("login.emailPlaceholder")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 rounded-xl bg-background/70"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  {t("login.password")}
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="h-11 rounded-xl bg-background/70"
                  required
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember"
                    className="cursor-pointer text-sm text-muted-foreground"
                  >
                    {t("login.remember")}
                  </label>
                </div>
                <button
                  type="button"
                  onClick={() => setShowForgotModal(true)}
                  className="text-sm font-medium text-secondary transition-colors hover:text-secondary/80"
                >
                  {t("login.forgot")}
                </button>
              </div>

              <Button
                type="submit"
                className="h-11 w-full rounded-xl text-base font-semibold shadow-soft"
              >
                {t("login.submit")}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {t("login.noAccount")}{" "}
              <Link
                to="/register"
                className="font-medium text-secondary underline-offset-2 transition-colors hover:underline"
              >
                {t("login.registerHere")}
              </Link>
            </p>
          </div>
        </StaggerItem>
      </Stagger>

      {/* Forgot Password Modal */}
      <Dialog open={showForgotModal} onOpenChange={setShowForgotModal}>
        <DialogContent className="rounded-2xl">
          <DialogHeader>
            <DialogTitle>{t("login.forgot.title")}</DialogTitle>
            <DialogDescription>{t("login.forgot.desc")}</DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-foreground">
              {t("login.forgot.introBefore")}
              <span className="font-semibold">MMDD</span>
              {t("login.forgot.introAfter")}
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">
                {t("login.forgot.exampleLabel")}
              </p>
              <p className="text-foreground font-mono">
                {t("login.forgot.exampleValue")}
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              {t("login.forgot.outro")}
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowForgotModal(false)}
              className="rounded-full"
            >
              {t("action.close")}
            </Button>
            <Button onClick={() => setShowForgotModal(false)} className="rounded-full">
              {t("action.understood")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </motion.div>
  );
}
