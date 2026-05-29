import { type Dispatch, type SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen, Sparkles } from "lucide-react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BRAND } from "@/config/brand";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1600&q=80";
const onLight = "border-white/40 text-white hover:bg-white/15";

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

export default function Register() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [personalId, setPersonalId] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [error, setError] = useState("");

  const toggleValue = (
    value: string,
    currentValues: string[],
    setter: Dispatch<SetStateAction<string[]>>,
  ) => {
    setter(
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value],
    );
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("รหัสผ่านไม่ตรงกัน");
      return;
    }
    if (password.length < 6) {
      setError("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
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

  const inputClass = "h-11 rounded-xl bg-background/70";
  const optionClass =
    "flex items-center gap-3 rounded-xl border border-border bg-background/50 px-3 py-2";

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* ── พื้นหลัง: ภาพ AI + เคลือบโทนแดง + กริด + แสงเรือง (ล็อกกับจอ ไม่เลื่อนตาม) ── */}
      <img src={HERO_IMAGE} alt="" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-secondary/90 via-red-600/85 to-primary/90" />
      <div
        className="absolute inset-0 opacity-[0.10]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
      />
      <div className="absolute -left-20 top-10 h-80 w-80 rounded-full bg-white/20 blur-3xl" />
      <div className="absolute -right-16 bottom-10 h-80 w-80 rounded-full bg-cyan-300/20 blur-3xl" />

      {/* ปุ่มภาษา/ธีม */}
      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <LanguageToggle className={onLight} />
        <ThemeToggle className={onLight} />
      </div>

      {/* ── เนื้อหา/ฟอร์ม: เลื่อนภายในคอลัมน์นี้ (พื้นหลังด้านหลังจึงนิ่ง) ── */}
      <div className="relative z-10 h-full overflow-y-auto">
        <div className="flex min-h-full items-center justify-center px-4 py-12">
          <Stagger onView={false} className="w-full max-w-2xl">
          <StaggerItem className="mb-6 flex flex-col items-center text-center text-white">
            <span className="mb-3 grid h-14 w-14 place-items-center rounded-2xl bg-white/15 ring-1 ring-white/30 backdrop-blur">
              <BookOpen className="h-7 w-7" />
            </span>
            <h1 className="text-2xl font-bold">{BRAND.appName}</h1>
            <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 text-xs font-medium backdrop-blur">
              <Sparkles className="h-3.5 w-3.5" />
              เข้าร่วมเพื่อเริ่มสอนอย่างชาญฉลาด
            </span>
          </StaggerItem>

          <StaggerItem>
            <div className="glass rounded-3xl p-6 shadow-soft-lg sm:p-8">
              <h2 className="text-2xl font-bold text-foreground">สร้างบัญชี</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                กรอกข้อมูลเพื่อเริ่มใช้งาน {BRAND.appName}
              </p>

              <form onSubmit={handleRegister} className="mt-6 space-y-4">
                {error && (
                  <div className="rounded-lg border border-destructive bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                      ชื่อเต็ม
                    </label>
                    <Input id="fullName" type="text" placeholder="สมชาย สมหญิง" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-foreground">
                      อีเมล
                    </label>
                    <Input id="email" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="personalId" className="text-sm font-medium text-foreground">
                      รหัสประจำตัว / ชื่อผู้ใช้
                    </label>
                    <Input id="personalId" type="text" placeholder="รหัสประจำตัวของคุณ" value={personalId} onChange={(e) => setPersonalId(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium text-foreground">
                      รหัสผ่าน
                    </label>
                    <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className={inputClass} required />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                      ยืนยันรหัสผ่าน
                    </label>
                    <Input id="confirmPassword" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className={inputClass} required />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 pt-1 lg:grid-cols-3">
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">ชั้นปีที่สอน</h3>
                    <div className="grid max-h-56 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                      {gradeOptions.map((item) => (
                        <label key={item} className={optionClass}>
                          <Checkbox checked={selectedGrades.includes(item)} onCheckedChange={() => toggleValue(item, selectedGrades, setSelectedGrades)} />
                          <span className="text-sm text-foreground">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">ห้องที่สอน</h3>
                    <div className="space-y-2">
                      {classOptions.map((item) => (
                        <label key={item} className={optionClass}>
                          <Checkbox checked={selectedClasses.includes(item)} onCheckedChange={() => toggleValue(item, selectedClasses, setSelectedClasses)} />
                          <span className="text-sm text-foreground">ห้อง {item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-foreground">วิชาที่สอน</h3>
                    <div className="space-y-2">
                      {subjectOptions.map((item) => (
                        <label key={item} className={optionClass}>
                          <Checkbox checked={selectedSubjects.includes(item)} onCheckedChange={() => toggleValue(item, selectedSubjects, setSelectedSubjects)} />
                          <span className="text-sm text-foreground">{item}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>

                <Button type="submit" className="mt-2 h-11 w-full rounded-xl text-base font-semibold shadow-soft">
                  สร้างบัญชี
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-muted-foreground">
                มีบัญชีอยู่แล้ว?{" "}
                <Link to="/login" className="font-medium text-secondary underline-offset-2 transition-colors hover:underline">
                  ลงชื่อเข้าใช้
                </Link>
              </p>
            </div>
          </StaggerItem>
          </Stagger>
        </div>
      </div>
    </div>
  );
}
