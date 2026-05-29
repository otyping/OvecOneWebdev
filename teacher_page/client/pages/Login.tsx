import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

/** ภาพ hero โทน AI/เทคโนโลยีทันสมัย (เปลี่ยน URL ได้ที่นี่จุดเดียว) */
const HERO_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80";

const onLight = "border-white/40 text-white hover:bg-white/15";

export default function Login() {
  const navigate = useNavigate();
  const t = useT();
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
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      {/* ── พื้นหลัง: ภาพ AI + เคลือบโทนแดงตามธีม + กริด + แสงเรือง ── */}
      <img
        src={HERO_IMAGE}
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-red-600/85 to-primary/90" />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -left-20 -top-24 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -bottom-24 -right-16 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* ปุ่มภาษา/ธีม มุมขวาบน */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <LanguageToggle className={onLight} />
        <ThemeToggle className={onLight} />
      </div>

      {/* ── การ์ดล็อกอินกระจกฝ้า (กลางจอ) ── */}
      <Stagger onView={false} className="relative z-10 w-full max-w-md">
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
                  placeholder="your@email.com / รหัส"
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
            <DialogTitle>ตั้งค่ารหัสผ่านใหม่</DialogTitle>
            <DialogDescription>
              ส่งคำแนะนำในการตั้งค่ารหัสผ่านใหม่แล้ว
            </DialogDescription>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p className="text-foreground">
              รหัสผ่านของคุณได้รับการตั้งค่าใหม่เป็นวันเกิดของคุณในรูปแบบ{" "}
              <span className="font-semibold">MMDD</span> (ตัวอย่างเช่น: 0525
              สำหรับ 25 พฤษภาคม)
            </p>
            <div className="bg-muted p-4 rounded-lg border border-border">
              <p className="text-sm text-muted-foreground mb-2">ตัวอย่าง:</p>
              <p className="text-foreground font-mono">
                วันเกิด: 25 พฤษภาคม → รหัสผ่าน: 0525
              </p>
            </div>
            <p className="text-sm text-muted-foreground">
              คุณสามารถเปลี่ยนรหัสผ่านนี้หลังจากเข้าสู่ระบบ โปรดตรวจสอบอีเมลของคุณเพื่อดูรายละเอียดเพิ่มเติม
            </p>
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <Button
              variant="outline"
              onClick={() => setShowForgotModal(false)}
              className="rounded-full"
            >
              ปิด
            </Button>
            <Button onClick={() => setShowForgotModal(false)} className="rounded-full">
              เข้าใจแล้ว
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
