import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { BookOpen, CheckCircle2, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MultiSelect } from "@/components/ui/multi-select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BRAND } from "@/config/brand";
import { useT } from "@/i18n/useT";
import { DURATION, EASE_OUT } from "@/lib/motion";

const gradeOptions = [
  "อนุบาล 1",
  "อนุบาล 2",
  "อนุบาล 3",
  "ประถมศึกษาปีที่ 1",
  "ประถมศึกษาปีที่ 2",
  "ประถมศึกษาปีที่ 3",
  "ประถมศึกษาปีที่ 4",
  "ประถมศึกษาปีที่ 5",
  "ประถมศึกษาปีที่ 6",
  "มัธยมศึกษาปีที่ 1",
  "มัธยมศึกษาปีที่ 2",
  "มัธยมศึกษาปีที่ 3",
  "มัธยมศึกษาปีที่ 4",
  "มัธยมศึกษาปีที่ 5",
  "มัธยมศึกษาปีที่ 6",
];

const classOptions = ["A", "B", "C", "D", "E"];

const subjectOptions = ["ภาษาอังกฤษ", "วิทยาศาสตร์และเทคโนโลยี", "คณิตศาสตร์"];

/**
 * variants สำหรับการ์ดสมัคร — ตรงกับ Login (scale strategy) เพื่อ crossfade เนียน
 * การ์ดนี้กว้างกว่า Login (max-w-5xl vs md) → ใช้ scale 0.99 เพื่อให้ขอบไม่ขยับแรง
 * BG + ปุ่ม toggle ถูก render ที่ <AuthLayout>
 */
const cardVariants = {
  hidden: { opacity: 0, scale: 0.99 },
  show: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.99 },
};

export default function Register() {
  const navigate = useNavigate();
  const t = useT();
  const reduce = useReducedMotion();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError(t("register.error.passwordMismatch"));
      return;
    }
    if (password.length < 6) {
      setError(t("register.error.passwordShort"));
      return;
    }
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("userEmail", email);
    localStorage.setItem("userName", fullName);
    localStorage.setItem("teacherGrades", JSON.stringify(selectedGrades));
    localStorage.setItem("teacherClasses", JSON.stringify(selectedClasses));
    localStorage.setItem("teacherSubjects", JSON.stringify(selectedSubjects));
    navigate("/dashboard/home");
  };

  const inputClass = "h-10 rounded-xl bg-background/70";
  const labelClass = "text-xs font-medium text-foreground";
  const toggleItemClass =
    "rounded-lg border border-input bg-background/60 px-3 text-sm font-medium text-foreground transition-colors data-[state=on]:border-secondary data-[state=on]:bg-secondary/15 data-[state=on]:text-secondary hover:bg-background/90";

  return (
    <motion.div
      className="w-full max-w-5xl"
      variants={reduce ? undefined : cardVariants}
      initial={reduce ? false : "hidden"}
      animate={reduce ? undefined : "show"}
      exit={reduce ? undefined : "exit"}
      transition={{ duration: DURATION.base, ease: EASE_OUT }}
    >
      {/* ── glass card สองคอลัมน์ (center โดย AuthLayout) ── */}
      <Stagger onView={false}>
        <StaggerItem>
          <div className="glass grid w-full overflow-hidden rounded-3xl shadow-soft-lg lg:grid-cols-[5fr_7fr]">
            {/* ── pane ซ้าย: brand pane ── */}
            <aside className="relative hidden flex-col justify-between gap-6 overflow-hidden bg-gradient-to-br from-secondary/15 via-primary/10 to-transparent p-8 lg:flex">
              {/* glow ในกล่อง */}
              <div className="pointer-events-none absolute -left-10 -top-10 h-48 w-48 rounded-full bg-secondary/25 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-12 -right-8 h-48 w-48 rounded-full bg-primary/20 blur-3xl" />

              <div className="relative space-y-5">
                <div className="flex items-center gap-3">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-secondary/15 ring-1 ring-secondary/30">
                    <BookOpen className="h-6 w-6 text-secondary" />
                  </span>
                  <div>
                    <h1 className="text-xl font-bold text-foreground">
                      {BRAND.appName}
                    </h1>
                    <p className="text-xs text-muted-foreground">
                      {BRAND.tagline}
                    </p>
                  </div>
                </div>

                <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-xs font-medium text-secondary">
                  <Sparkles className="h-3.5 w-3.5" />
                  {t("register.brand.tagline")}
                </span>

                <ul className="space-y-3 pt-2">
                  {[
                    t("register.brand.feature1"),
                    t("register.brand.feature2"),
                    t("register.brand.feature3"),
                  ].map((line) => (
                    <li
                      key={line}
                      className="flex items-start gap-2.5 text-sm text-foreground/90"
                    >
                      <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-secondary" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* hero illustration mini */}
              <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-background/40 p-4 backdrop-blur">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Welcome to
                    </p>
                    <p className="text-lg font-bold text-foreground">
                      {BRAND.appName}
                    </p>
                  </div>
                  <div className="flex -space-x-2">
                    {["bg-secondary/30", "bg-primary/30", "bg-cyan-400/30"].map(
                      (cls, i) => (
                        <span
                          key={i}
                          className={`h-8 w-8 rounded-full border-2 border-card ${cls}`}
                        />
                      ),
                    )}
                  </div>
                </div>
              </div>
            </aside>

            {/* ── pane ขวา: form pane ── */}
            <div className="p-6 sm:p-8">
              <header className="mb-5">
                <h2 className="text-2xl font-bold text-foreground">
                  {t("register.title")}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  {t("register.subtitle")} {BRAND.appName}
                </p>
              </header>

              <form onSubmit={handleRegister} className="space-y-4">
                {error && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-2.5 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label htmlFor="fullName" className={labelClass}>
                      {t("register.fullName")}
                    </label>
                    <Input
                      id="fullName"
                      type="text"
                      placeholder="สมชาย สมหญิง"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="email" className={labelClass}>
                      {t("register.email")}
                    </label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label htmlFor="personalId" className={labelClass}>
                      {t("register.personalId")}
                    </label>
                    <Input
                      id="personalId"
                      type="text"
                      placeholder="รหัสประจำตัวของคุณ"
                      value={personalId}
                      onChange={(e) => setPersonalId(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="password" className={labelClass}>
                      {t("register.password")}
                    </label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label htmlFor="confirmPassword" className={labelClass}>
                      {t("register.confirmPassword")}
                    </label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className={inputClass}
                      required
                    />
                  </div>
                </div>

                {/* ชั้นปีที่สอน — MultiSelect Combobox */}
                <div className="space-y-1.5">
                  <label htmlFor="grades" className={labelClass}>
                    {t("register.grade.label")}
                  </label>
                  <MultiSelect
                    id="grades"
                    options={gradeOptions}
                    value={selectedGrades}
                    onChange={setSelectedGrades}
                    placeholder={t("register.grade.placeholder")}
                    searchPlaceholder={t("register.grade.search")}
                    emptyText={t("register.grade.empty")}
                  />
                </div>

                {/* ห้อง + วิชา — ToggleGroup multiple แบบกะทัดรัด */}
                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      {t("register.class.label")}
                    </label>
                    <ToggleGroup
                      type="multiple"
                      value={selectedClasses}
                      onValueChange={setSelectedClasses}
                      className="flex flex-wrap justify-start gap-1.5"
                    >
                      {classOptions.map((item) => (
                        <ToggleGroupItem
                          key={item}
                          value={item}
                          aria-label={`ห้อง ${item}`}
                          className={`${toggleItemClass} h-10 min-w-[44px]`}
                        >
                          {item}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                  <div className="space-y-1.5">
                    <label className={labelClass}>
                      {t("register.subject.label")}
                    </label>
                    <ToggleGroup
                      type="multiple"
                      value={selectedSubjects}
                      onValueChange={setSelectedSubjects}
                      className="flex flex-wrap justify-start gap-1.5"
                    >
                      {subjectOptions.map((item) => (
                        <ToggleGroupItem
                          key={item}
                          value={item}
                          aria-label={item}
                          className={`${toggleItemClass} h-10`}
                        >
                          {item}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="mt-1 h-11 w-full rounded-xl text-base font-semibold shadow-soft"
                >
                  {t("register.submit")}
                </Button>
              </form>

              <p className="mt-4 text-center text-sm text-muted-foreground">
                {t("register.haveAccount")}{" "}
                <Link
                  to="/login"
                  className="font-medium text-secondary underline-offset-2 transition-colors hover:underline"
                >
                  {t("register.signIn")}
                </Link>
              </p>
            </div>
          </div>
        </StaggerItem>
      </Stagger>
    </motion.div>
  );
}
