import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Download, Music2, Play, RefreshCw, Wand2 } from "lucide-react";
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

export default function SongPage() {
  const [songName, setSongName] = useState("");
  const [subject, setSubject] = useState("");
  const [grade, setGrade] = useState("");
  const [topic, setTopic] = useState("");
  const [objective, setObjective] = useState("");
  const [notes, setNotes] = useState("");
  const [feedback, setFeedback] = useState("");
  const [generatedSong, setGeneratedSong] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const objectiveOptions = useMemo(() => {
    const topicLabel = topic.trim() || "หัวข้อบทเรียนนี้";

    return [
      `ช่วยจำเนื้อหาของ ${topicLabel}`,
      `สรุปใจความสำคัญของ ${topicLabel} ผ่านบทเพลง`,
      `สร้างความสนุกและทบทวนเรื่อง ${topicLabel}`,
    ];
  }, [topic]);

  const canGenerate = songName && subject && grade && topic;

  const buildSong = (commentText = notes) => {
    const selectedObjective = objective || objectiveOptions[0];

    return [
      `ชื่อเพลง: ${songName}`,
      `วิชาที่สอน: ${subject}`,
      `ชั้นปีที่สอน: ${grade}`,
      `หัวข้อบทเรียน: ${topic}`,
      `วัตถุประสงค์: ${selectedObjective}`,
      "",
      "เนื้อเพลงตัวอย่าง",
      `ท่อน A: เราจะเรียนรู้เรื่อง ${topic} ไปด้วยกัน`,
      `ท่อน B: ฟังเข้าใจง่าย จำได้ไว สนุกทุกครั้ง`,
      `ฮุก: ${topic} ${topic} จำไว้ให้แม่น`,
      "",
      "แนวทางดนตรี",
      "- จังหวะสดใส เหมาะกับการทบทวน",
      "- ใช้คำสั้น จำง่าย ร้องตามได้",
      "- ปิดท้ายด้วยท่อนสรุปเนื้อหา",
      "",
      commentText ? `หมายเหตุเพิ่มเติม: ${commentText}` : "",
    ]
      .filter(Boolean)
      .join("\n");
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setGeneratedSong(buildSong());
    setIsGenerating(false);
  };

  const handleRegenerate = async () => {
    setIsGenerating(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    setGeneratedSong(buildSong(feedback || notes));
    setIsGenerating(false);
  };

  const handleDownload = () => {
    if (!generatedSong) return;
    downloadTextFile(`${songName || "song"}.txt`, generatedSong);
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
            <h1 className="text-3xl font-bold text-foreground">เพลง</h1>
            <p className="text-muted-foreground">
              ให้ AI สร้างเพลงการเรียนรู้พร้อมพรีวิวเพลง
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h2 className="text-xl font-bold text-foreground">ข้อมูลเพลง</h2>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                ชื่อเพลง
              </label>
              <Input
                type="text"
                placeholder="เช่น เพลงสรุปเรื่องร่างกายของเรา"
                value={songName}
                onChange={(e) => setSongName(e.target.value)}
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
                placeholder="เช่น ระบบสุริยะ"
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

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                หมายเหตุเพิ่มเติม
              </label>
              <Textarea
                placeholder="เช่น ให้เป็นเพลงสนุก ร้องตามได้ง่าย"
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
            {!generatedSong ? (
              <div className="bg-card border-2 border-dashed border-border rounded-2xl p-8 min-h-[520px] flex flex-col items-center justify-center text-center">
                <Music2 className="w-16 h-16 text-primary/30 mb-4" />
                <h2 className="text-xl font-semibold text-foreground mb-2">
                  พรีวิวเพลงจะปรากฏที่นี่
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  สร้างเพลงเพื่อดูพรีวิวเพลง เนื้อร้อง และปุ่มดาวน์โหลด
                </p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-foreground">
                      ผลลัพธ์เพลง
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      พร้อมพรีวิวเพลงและดาวน์โหลด
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

                <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/90 to-cyan-600 dark:from-primary dark:to-cyan-500 text-white p-5">
                  <div className="flex items-center justify-between text-sm text-white/80 mb-4">
                    <span>พรีวิวเพลง</span>
                    <span>พร้อมร้องตาม</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center flex-shrink-0">
                      <Play className="w-8 h-8 ml-1" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <p className="font-semibold text-lg">
                        {songName || "ชื่อเพลง"}
                      </p>
                      <div className="h-2 rounded-full bg-white/20 overflow-hidden">
                        <div className="h-full w-2/3 bg-white rounded-full" />
                      </div>
                      <p className="text-sm text-white/80">
                        {subject || "วิชา"} • {grade || "ชั้นปี"} • {topic || "หัวข้อ"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-muted/20 border border-border rounded-2xl p-4 max-h-[220px] overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans text-foreground">
                    {generatedSong}
                  </pre>
                </div>

                <div className="space-y-3">
                  <label className="text-sm font-medium text-foreground">
                    หมายเหตุเพื่อให้ AI สร้างใหม่
                  </label>
                  <Textarea
                    placeholder="เช่น เพิ่มท่อนฮุกที่จำง่ายขึ้น"
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
