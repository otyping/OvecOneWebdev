import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, FileQuestion, RefreshCw, Wand2 } from "lucide-react";
import { downloadTextFile } from "@/lib/utils";

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

const subjectOptions = [
  "ภาษาอังกฤษ",
  "วิทยาศาสตร์และเทคโนโลยี",
  "คณิตศาสตร์",
];

const difficultyOptions = ["ง่าย", "ปานกลาง", "ยาก"];

export default function QuizPage() {
  const [quizName, setQuizName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [objective, setObjective] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [multipleChoiceCount, setMultipleChoiceCount] = useState("");
  const [essayCount, setEssayCount] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [generatedQuiz, setGeneratedQuiz] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const objectiveOptions = useMemo(() => {
    const topicLabel = topic.trim() || "หัวข้อบทเรียนนี้";

    return [
      `ตรวจสอบความเข้าใจเรื่อง ${topicLabel}`,
      `ประยุกต์ใช้ความรู้เรื่อง ${topicLabel}`,
      `สรุปและวิเคราะห์เรื่อง ${topicLabel}`,
    ];
  }, [topic]);

  const canGenerate =
    quizName && subject && grade && topic && difficulty && multipleChoiceCount && essayCount;

  const buildQuiz = (commentText = notes) => {
    const selectedObjective = objective || objectiveOptions[0];

    return [
      `ชื่อแบบทดสอบ: ${quizName}`,
      `วิชาที่สอน: ${subject}`,
      `ชั้นปีที่สอน: ${grade}`,
      `หัวข้อบทเรียน: ${topic}`,
      `วัตถุประสงค์: ${selectedObjective}`,
      `ระดับความยาก: ${difficulty}`,
      `จำนวนข้อปรนัย: ${multipleChoiceCount}`,
      `จำนวนข้ออัตนัย: ${essayCount}`,
      "",
      "โครงร่างแบบทดสอบ",
      `1. ข้อปรนัยเน้นความเข้าใจพื้นฐานของ ${topic}`,
      `2. ข้อปรนัยประยุกต์สถานการณ์จริงจาก ${topic}`,
      `3. ข้ออัตนัยให้ผู้เรียนอธิบายเหตุผลและยกตัวอย่าง`,
      "",
      "ตัวอย่างแนวคำถาม",
      `- เลือกคำตอบที่ถูกต้องเกี่ยวกับ ${topic}`,
      `- อธิบายความสัมพันธ์ของ ${topic} กับชีวิตประจำวัน`,
      "",
      commentText ? `หมายเหตุเพิ่มเติม: ${commentText}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setGeneratedQuiz(buildQuiz());
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setGeneratedQuiz(buildQuiz(feedback || notes));
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedQuiz) return;
    downloadTextFile(`${quizName || "quiz"}.txt`, generatedQuiz);
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
          <div>
            <h1 className="text-3xl font-bold text-foreground">แบบทดสอบ</h1>
            <p className="text-muted-foreground">
              สร้างแบบทดสอบด้วย AI พร้อมดาวน์โหลดไฟล์
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">ข้อมูลแบบทดสอบ</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                ชื่อแบบทดสอบ
              </label>
              <Input
                type="text"
                placeholder="เช่น แบบทดสอบบทที่ 3"
                value={quizName}
                onChange={(e) => setQuizName(e.target.value)}
                className="rounded-full h-11"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  วิชาที่สอน
                </label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm"
                >
                  <option value="">เลือกวิชา</option>
                  {subjectOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ชั้นปีที่สอน
                </label>
                <select
                  value={grade}
                  onChange={(e) => setGrade(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm"
                >
                  <option value="">เลือกชั้นปี</option>
                  {gradeOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                หัวข้อบทเรียน
              </label>
              <Input
                type="text"
                placeholder="เช่น การคูณเศษส่วน"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="rounded-full h-11"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                วัตถุประสงค์
              </label>
              <select
                value={objective}
                onChange={(e) => setObjective(e.target.value)}
                className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm"
              >
                <option value="">เลือกวัตถุประสงค์</option>
                {objectiveOptions.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  ระดับความยาก
                </label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm"
                >
                  <option value="">เลือกความยาก</option>
                  {difficultyOptions.map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  จำนวนข้อปรนัย
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="10"
                  value={multipleChoiceCount}
                  onChange={(e) => setMultipleChoiceCount(e.target.value)}
                  className="rounded-full h-11"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                  จำนวนข้ออัตนัย
                </label>
                <Input
                  type="number"
                  min="0"
                  placeholder="2"
                  value={essayCount}
                  onChange={(e) => setEssayCount(e.target.value)}
                  className="rounded-full h-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                หมายเหตุเพิ่มเติม
              </label>
              <Textarea
                placeholder="เช่น ขอคำถามเน้นการคิดวิเคราะห์"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="rounded-2xl min-h-28"
              />
            </div>

            <Button
              onClick={handleGenerate}
              disabled={!canGenerate || isGenerating}
              className="w-full rounded-full gap-2"
            >
              <Wand2 className="w-4 h-4" />
              {isGenerating ? "กำลังสร้าง..." : "สร้างด้วย AI"}
            </Button>
          </div>

          <div className="space-y-4">
            {!generatedQuiz ? (
              <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 min-h-[520px] flex flex-col items-center justify-center text-center">
                <FileQuestion className="w-16 h-16 text-primary/30 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  ผลลัพธ์แบบทดสอบจะขึ้นที่นี่
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  กรอกข้อมูลให้ครบแล้วสร้างแบบทดสอบด้วย AI เพื่อดาวน์โหลดไฟล์ได้ทันที
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      ผลลัพธ์แบบทดสอบ
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      พร้อมดาวน์โหลดและปรับปรุงใหม่
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    className="rounded-full gap-2"
                    onClick={handleDownload}
                  >
                    <Download className="w-4 h-4" />
                    ดาวน์โหลด
                  </Button>
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  {[
                    `${multipleChoiceCount || "0"} ข้อปรนัย`,
                    `${essayCount || "0"} ข้ออัตนัย`,
                    difficulty || "ระดับความยาก",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-border bg-primary/5 p-4 text-center"
                    >
                      <p className="text-sm font-medium text-foreground">{item}</p>
                    </div>
                  ))}
                </div>

                <div className="bg-muted/20 border border-border rounded-2xl p-4 max-h-[220px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
                    {generatedQuiz}
                  </pre>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    หมายเหตุเพื่อให้ AI สร้างใหม่
                  </label>
                  <Textarea
                    placeholder="เช่น เพิ่มคำถามแบบสถานการณ์มากขึ้น"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    className="rounded-2xl min-h-24"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    variant="outline"
                    onClick={handleRegenerate}
                    disabled={isGenerating}
                    className="rounded-full gap-2 flex-1"
                  >
                    <RefreshCw className="w-4 h-4" />
                    ส่งความคิดเห็นและสร้างใหม่
                  </Button>
                  <Button onClick={handleDownload} className="rounded-full gap-2 flex-1">
                    <Download className="w-4 h-4" />
                    ดาวน์โหลดไฟล์
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
