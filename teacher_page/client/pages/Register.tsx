import { type Dispatch, type SetStateAction, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { BookOpen } from "lucide-react";

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

const subjectOptions = [
  "ภาษาอังกฤษ",
  "วิทยาศาสตร์และเทคโนโลยี",
  "คณิตศาสตร์",
];

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
    setter: Dispatch<SetStateAction<string[]>>
  ) => {
    setter(
      currentValues.includes(value)
        ? currentValues.filter((item) => item !== value)
        : [...currentValues, value]
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
    navigate("/dashboard/lesson-plan");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted flex">
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-center items-start p-12 bg-gradient-to-br from-primary/5 to-accent/5">
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-primary text-primary-foreground p-3 rounded-full">
            <BookOpen className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">TeachAssist</h1>
        </div>
        <h2 className="text-4xl font-bold text-foreground mb-6">
          เข้าร่วม TeachAssist
        </h2>
        <p className="text-lg text-muted-foreground mb-8 max-w-md">
          สร้างแผนการสอน ออกแบบแบบทดสอบ จัดการสื่อการสอน และวิเคราะห์ผลการเรียนของนักเรียนด้วยความเข้าใจจาก AI
        </p>
        <div className="space-y-4 mt-8">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <p className="text-foreground font-medium">วางแผนการสอนอย่างชาญฉลาด</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <p className="text-foreground font-medium">การสร้างสื่อด้วย AI</p>
          </div>
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0 mt-1">
              <div className="w-3 h-3 rounded-full bg-primary" />
            </div>
            <p className="text-foreground font-medium">บันทึกชั้นและวิชาที่สอน</p>
          </div>
        </div>
      </div>

      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center px-6 py-12 sm:px-8 sm:py-16">
        <div className="w-full max-w-2xl">
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="bg-primary text-primary-foreground p-2 rounded-full">
              <BookOpen className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">TeachAssist</h1>
          </div>

          <h2 className="text-3xl font-bold text-foreground mb-2">สร้างบัญชี</h2>
          <p className="text-muted-foreground mb-8">
            เข้าร่วมเพื่อเริ่มการสอนอย่างชาญฉลาด
          </p>

          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 border border-destructive text-destructive p-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-foreground">
                  ชื่อเต็ม
                </label>
                <Input
                  id="fullName"
                  type="text"
                  placeholder="สมชาย สมหญิง"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="rounded-full h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-foreground">
                  อีเมล
                </label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-full h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="personalId" className="text-sm font-medium text-foreground">
                  รหัสประจำตัว / ชื่อผู้ใช้
                </label>
                <Input
                  id="personalId"
                  type="text"
                  placeholder="รหัสประจำตัวของคุณ"
                  value={personalId}
                  onChange={(e) => setPersonalId(e.target.value)}
                  className="rounded-full h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-foreground">
                  รหัสผ่าน
                </label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="rounded-full h-11"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="text-sm font-medium text-foreground">
                  ยืนยันรหัสผ่าน
                </label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="rounded-full h-11"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2">
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  ชั้นปีที่สอน
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-64 overflow-y-auto pr-1">
                  {gradeOptions.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2"
                    >
                      <Checkbox
                        checked={selectedGrades.includes(item)}
                        onCheckedChange={() =>
                          toggleValue(item, selectedGrades, setSelectedGrades)
                        }
                      />
                      <span className="text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  ห้องที่สอน
                </h3>
                <div className="space-y-2">
                  {classOptions.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2"
                    >
                      <Checkbox
                        checked={selectedClasses.includes(item)}
                        onCheckedChange={() =>
                          toggleValue(item, selectedClasses, setSelectedClasses)
                        }
                      />
                      <span className="text-sm text-foreground">ห้อง {item}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">
                  วิชาที่สอน
                </h3>
                <div className="space-y-2">
                  {subjectOptions.map((item) => (
                    <label
                      key={item}
                      className="flex items-center gap-3 rounded-xl border border-border bg-muted/20 px-3 py-2"
                    >
                      <Checkbox
                        checked={selectedSubjects.includes(item)}
                        onCheckedChange={() =>
                          toggleValue(item, selectedSubjects, setSelectedSubjects)
                        }
                      />
                      <span className="text-sm text-foreground">{item}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 rounded-full font-semibold text-base mt-6"
            >
              สร้างบัญชี
            </Button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              มีบัญชีอยู่แล้ว?{" "}
              <Link
                to="/login"
                className="text-secondary hover:text-secondary/80 font-medium transition-colors underline"
              >
                ลงชื่อเข้าใช้
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
