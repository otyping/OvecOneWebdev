import { type Dispatch, type SetStateAction, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { UserCircle2 } from "lucide-react";

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

export default function ProfilePage() {
  const [userName, setUserName] = useState(
    localStorage.getItem("userName") || "Teacher"
  );
  const [userEmail, setUserEmail] = useState(
    localStorage.getItem("userEmail") || "teacher@example.com"
  );
  const [personalId, setPersonalId] = useState("");
  const [selectedGrades, setSelectedGrades] = useState<string[]>([
    "ประถมศึกษาปีที่ 1",
  ]);
  const [selectedClasses, setSelectedClasses] = useState<string[]>(["A"]);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([
    "ภาษาไทย",
  ]);

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

  const handleSaveProfile = () => {
    localStorage.setItem("userName", userName);
    localStorage.setItem("userEmail", userEmail);
    localStorage.setItem("teacherGrades", JSON.stringify(selectedGrades));
    localStorage.setItem("teacherClasses", JSON.stringify(selectedClasses));
    localStorage.setItem("teacherSubjects", JSON.stringify(selectedSubjects));
    alert("บันทึกประวัติส่วนตัวเรียบร้อยแล้ว");
  };

  return (
    <DashboardLayout>
      <div className="space-y-8 max-w-5xl">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
              <UserCircle2 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">ประวัติส่วนตัว</h1>
          </div>
          <p className="text-muted-foreground">
            อัปเดตข้อมูลครูและเลือกระดับชั้น ห้อง และวิชาที่สอน
          </p>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">ข้อมูลส่วนตัว</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  ชื่อเต็ม
                </label>
                <Input
                  type="text"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="rounded-full h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  อีเมล
                </label>
                <Input
                  type="email"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="rounded-full h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground block">
                  รหัสประจำตัว / ชื่อผู้ใช้
                </label>
                <Input
                  type="text"
                  placeholder="กรอกรหัสประจำตัว"
                  value={personalId}
                  onChange={(e) => setPersonalId(e.target.value)}
                  className="rounded-full h-11"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-3">
                ชั้นปีที่สอน
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
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
              <h3 className="text-lg font-semibold text-foreground mb-3">
                ห้องที่สอน
              </h3>
              <div className="space-y-3">
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
              <h3 className="text-lg font-semibold text-foreground mb-3">
                วิชาที่สอน
              </h3>
              <div className="space-y-3">
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

          <div className="flex flex-col sm:flex-row gap-3">
            <Button onClick={handleSaveProfile} className="rounded-full gap-2">
              บันทึกประวัติส่วนตัว
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
