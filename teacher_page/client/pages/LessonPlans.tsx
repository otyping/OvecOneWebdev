import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, BookOpen, Download, Plus } from "lucide-react";
import { downloadTextFile } from "@/lib/utils";

type GeneratedPlanEntry = {
  id: string;
  title: string;
  subject: string;
  grade: string;
  topic: string;
  createdAt: string;
  content: string;
};

const loadLessonPlans = () => {
  if (typeof window === "undefined") return [] as GeneratedPlanEntry[];

  try {
    const stored = localStorage.getItem("savedLessonPlans");
    return stored ? (JSON.parse(stored) as GeneratedPlanEntry[]) : [];
  } catch {
    return [] as GeneratedPlanEntry[];
  }
};

export default function LessonPlans() {
  const plans = loadLessonPlans();

  const handleDownload = (content: string, fileName: string) => {
    downloadTextFile(`${fileName}.txt`, content);
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard">
            <Button variant="outline" className="rounded-full h-10 w-10 p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-foreground">แผนการสอน</h1>
            <p className="text-muted-foreground">
              ตารางแผนการสอนที่สร้างไว้ พร้อมปุ่มสร้างแผนใหม่
            </p>
          </div>
          <Link to="/dashboard/create-lesson-plan">
            <Button className="rounded-full gap-2">
              <Plus className="w-4 h-4" />
              สร้างแผนใหม่
            </Button>
          </Link>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="bg-secondary/10 text-secondary p-3 rounded-xl">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-foreground">แผนการสอนที่สร้างแล้ว</h2>
              <p className="text-sm text-muted-foreground">
                รายการแผนการสอนทั้งหมดที่ผู้ใช้สร้างไว้
              </p>
            </div>
          </div>

          {plans.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ชื่อแผน</TableHead>
                  <TableHead>วิชา</TableHead>
                  <TableHead>ชั้นปี</TableHead>
                  <TableHead>หัวข้อ</TableHead>
                  <TableHead>วันที่สร้าง</TableHead>
                  <TableHead className="text-right">ดาวน์โหลด</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {plans.map((plan, index) => (
                  <TableRow key={plan.id}>
                    <TableCell className="font-medium text-foreground">{plan.title}</TableCell>
                    <TableCell>{plan.subject}</TableCell>
                    <TableCell>{plan.grade}</TableCell>
                    <TableCell>{plan.topic}</TableCell>
                    <TableCell>{plan.createdAt}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        className="rounded-full gap-2"
                        onClick={() => handleDownload(plan.content, `lesson-plan-${index + 1}`)}
                      >
                        <Download className="w-4 h-4" />
                        ดาวน์โหลด
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-muted/10 p-8 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">
                ยังไม่มีแผนการสอนที่สร้างไว้
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                กดสร้างแผนใหม่เพื่อเริ่มทำแผนการสอนและเก็บไว้ในตารางนี้
              </p>
              <Link to="/dashboard/create-lesson-plan">
                <Button className="rounded-full gap-2">
                  <Plus className="w-4 h-4" />
                  สร้างแผนใหม่
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
