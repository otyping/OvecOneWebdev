import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { BarChart3, Download } from "lucide-react";

export default function StudentScores() {
  return (
    <DashboardLayout>
      <div className="space-y-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="bg-secondary/10 text-secondary p-3 rounded-lg">
              <BarChart3 className="w-6 h-6" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">
              คะแนนนักเรียน
            </h1>
          </div>
          <p className="text-muted-foreground">
            ดูภาพรวมคะแนนและดาวน์โหลดรายงานผลการเรียนของนักเรียน
          </p>
        </div>

        <div className="flex gap-4">
          <select className="px-4 py-2 rounded-full border border-border bg-background text-foreground">
            <option>ทุกชั้นเรียน</option>
            <option>ชั้น A</option>
            <option>ชั้น B</option>
          </select>
          <Button variant="outline" className="rounded-full gap-2">
            <Download className="w-4 h-4" />
            ส่งออกรายงาน
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-primary/10 to-accent/10 border border-primary/20 rounded-2xl p-6">
            <p className="text-muted-foreground text-sm mb-2">คะแนนเฉลี่ย</p>
            <p className="text-3xl font-bold text-foreground">--</p>
          </div>
          <div className="bg-gradient-to-br from-secondary/10 to-primary/10 border border-secondary/20 rounded-2xl p-6">
            <p className="text-muted-foreground text-sm mb-2">คะแนนสูงสุด</p>
            <p className="text-3xl font-bold text-foreground">--</p>
          </div>
          <div className="bg-gradient-to-br from-accent/10 to-secondary/10 border border-accent/20 rounded-2xl p-6">
            <p className="text-muted-foreground text-sm mb-2">
              นักเรียนที่ได้รับการประเมิน
            </p>
            <p className="text-3xl font-bold text-foreground">0</p>
          </div>
        </div>

        <div className="bg-muted/30 border border-border rounded-2xl p-8 text-center">
          <p className="text-muted-foreground mb-4">
            ยังไม่มีข้อมูลคะแนนในระบบ เมื่อสร้างแบบทดสอบและให้นักเรียนทำแบบทดสอบแล้ว
            ข้อมูลจะปรากฏที่นี่
          </p>
          <Button className="rounded-full">สร้างแบบทดสอบแรก</Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
