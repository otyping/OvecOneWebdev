import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Wand2 } from "lucide-react";
import { getMajors, getSubjects, getUnits, getTopics } from "@/data/vocationalSubjects";
import type { MajorKey, SubjectKey, UnitKey } from "@/data/vocationalSubjects";

const majorNames: Record<string, string> = {
  "ช่างไฟฟ้า": "ช่างไฟฟ้า",
  "อิเล็กทรอนิกส์": "อิเล็กทรอนิกส์",
  "การสื่อสารโทรคมนาคม": "การสื่อสารโทรคมนาคม",
  "เมคคาทรอนิกส์และหุ่นยนต์": "เมคคาทรอนิกส์และหุ่นยนต์",
};

export default function CreateLessonPlan() {
  const navigate = useNavigate();
  const [planName, setPlanName] = useState("");
  const [major, setMajor] = useState<MajorKey | "">("");
  const [subject, setSubject] = useState<SubjectKey<MajorKey> | "">("");
  const [unit, setUnit] = useState<UnitKey<MajorKey, SubjectKey<MajorKey>> | "">("");
  const [topic, setTopic] = useState("");
  const [notes, setNotes] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const majorOptions = useMemo(() => getMajors(), []);

  const subjectOptions = useMemo(() => {
    if (!major) return [];
    return getSubjects(major);
  }, [major]);

  const unitOptions = useMemo(() => {
    if (!major || !subject) return [];
    return getUnits(major, subject);
  }, [major, subject]);

  const topicOptions = useMemo(() => {
    if (!major || !subject || !unit) return [];
    return getTopics(major, subject, unit);
  }, [major, subject, unit]);

  const canGenerate = Boolean(planName && major && subject && unit && topic);

  // Reset child selections when parent changes
  useEffect(() => {
    setSubject("");
    setUnit("");
    setTopic("");
  }, [major]);

  useEffect(() => {
    setUnit("");
    setTopic("");
  }, [subject]);

  useEffect(() => {
    setTopic("");
  }, [unit]);

  const handleGeneratePlan = async () => {
    if (!canGenerate) return;

    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));

    const draft = {
      planName,
      subject,
      major,
      unit,
      topic,
      notes,
    };

    sessionStorage.setItem("lessonPlanGenerationDraft", JSON.stringify(draft));
    setIsGenerating(false);
    navigate("/dashboard/create-lesson-plan/generation");
  };

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/lesson-plan">
            <Button variant="outline" className="rounded-full h-10 w-10 p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ชุดกิจกรรม</h1>
            <p className="text-muted-foreground">กรอกข้อมูลเพื่อสร้างเนื้อหาและกิจกรรม</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">ข้อมูลชุดกิจกรรม</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">ชื่อ *</label>
              <Input
                type="text"
                placeholder="ตั้งชื่อเอกสารกิจกรรมของตัวเอง"
                value={planName}
                onChange={(e) => setPlanName(e.target.value)}
                className="rounded-full h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">สาขาวิชา *</label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value as MajorKey | "")}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm"
                >
                  <option value="">เลือกสาขาวิชา</option>
                  {majorOptions.map((item) => (
                    <option key={item} value={item}>
                      {majorNames[item]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">วิชา *</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value as SubjectKey<MajorKey> | "")}
                  disabled={!major}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">เลือกวิชา</option>
                  {subjectOptions.length > 0 ? (
                    subjectOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="">ยังไม่มีข้อมูล</option>
                  )}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">หน่วย *</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value as UnitKey<MajorKey, SubjectKey<MajorKey>> | "")}
                  disabled={!subject}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">เลือกหน่วย</option>
                  {unitOptions.length > 0 ? (
                    unitOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="">ยังไม่มีข้อมูล</option>
                  )}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">เรื่อง *</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={!unit}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">เลือกเรื่อง</option>
                  {topicOptions.length > 0 ? (
                    topicOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="">ยังไม่มีข้อมูล</option>
                  )}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">หมายเหตุเพิ่มเติม</label>
              <Textarea
                placeholder="ระบุสิ่งที่ต้องการให้ AI เน้นเป็นพิเศษ"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl min-h-28"
              />
            </div>

            <Button
              onClick={handleGeneratePlan}
              disabled={!canGenerate || isGenerating}
              className="w-full rounded-full gap-2"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? "กำลังสร้าง..." : "สร้างด้วย OVEC One"}
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
