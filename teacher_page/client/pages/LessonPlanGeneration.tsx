import { useEffect, useRef, useState } from "react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Loader,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { saveLessonToStorage, createLessonId, formatDate, type SavedLesson } from "@/utils/lessonStorage";
import { cn } from "@/lib/utils";

const draftStorageKey = "lessonPlanGenerationDraft";

type Draft = {
  planName: string;
  major: string;
  subject: string;
  unit: string;
  topic: string;
  notes: string;
  lessonContent?: string;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "system";
  content: string;
};

type StyleOption = {
  value: string;
  label: string;
  description: string;
};

const styleOptions: StyleOption[] = [
  {
    value: "academic",
    label: "แบบที่ 1 — เชิงวิชาการ",
    description: "เนื้อหาครบถ้วน พร้อมศัพท์วิชาการ เหมาะสำหรับครูที่ต้องการความละเอียด",
  },
  {
    value: "story",
    label: "แบบที่ 2 — เล่าเรื่อง",
    description: "ภาษาเป็นมิตร เชื่อมชีวิตจริง เหมาะสำหรับครูที่ต้องการสื่อสารใกล้ชิดเด็ก",
  },
];

const emptyDraft: Draft = {
  planName: "",
  major: "",
  subject: "",
  unit: "",
  topic: "",
  notes: "",
};

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remaining = seconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(remaining).padStart(2, "0")}`;
};

const buildIntroText = (draft: Draft) =>
  `กำลังสร้างเนื้อหาจากข้อมูลที่คุณระบุ มีข้อมูลดังนี้\nสาขาวิชา: ${draft.major || "-"}\nวิชา: ${draft.subject || "-"}\nหน่วย: ${draft.unit || "-"}\nเรื่อง: ${draft.topic || "-"}`;

const buildContentText = (styleValue: string, draft: Draft) => {
  const styleLabel = styleOptions.find((item) => item.value === styleValue)?.label || "แบบที่ 1 — เชิงวิชาการ";

  const contentBlocks: Record<string, string> = {
    academic: [
      `โครงสร้างเนื้อหา: ${draft.topic || "หัวข้อบทเรียน"}`,
      `- ความหมายและหลักการสำคัญของ ${draft.topic || "เนื้อหา"}`,
      `- ตัวอย่างการประยุกต์ใช้ในหน่วย ${draft.unit || "ที่เลือก"}`,
      "- แบบฝึกหัดสรุปความเข้าใจท้ายบท",
    ].join("\n"),
    story: [
      `เริ่มจากสถานการณ์ใกล้ตัวที่เชื่อมกับ ${draft.topic || "หัวข้อบทเรียน"}`,
      "เล่าเรื่องแบบค่อยเป็นค่อยไปให้ผู้เรียนเห็นภาพ",
      `ยกตัวอย่างจากวิชา ${draft.subject || "ที่เลือก"} เพื่อให้เข้าใจง่าย`,
      "ปิดท้ายด้วยคำถามชวนคิดและกิจกรรมสั้น ๆ",
    ].join("\n"),
  };

  return `กำลังเรียบเรียงเนื้อหา...\n\n${styleLabel}\n${contentBlocks[styleValue] || contentBlocks.academic}`;
};

const getDraftFromStorage = () => {
  if (typeof window === "undefined") return emptyDraft;

  try {
    const raw = window.sessionStorage.getItem(draftStorageKey);
    if (!raw) return emptyDraft;

    return { ...emptyDraft, ...(JSON.parse(raw) as Partial<Draft>) };
  } catch {
    return emptyDraft;
  }
};

const featuredLessonSelection = {
  subject: "คณิตศาสตร์",
  grade: "ประถมศึกษาปีที่ 2",
  unit: "เวลา",
  topic: "เวลาและการบอกเวลาเป็นนาฬิกา",
};


const GENERATION_STEPS = [
  "สร้างแผนการจัดการเรียนรู้",
  "จัดทำวีดีโอประกอบ",
  "จัดทำสไลด์นำเสนอ",
  "จัดทำแบบทดสอบ",
  "รวบรวมและจัดรูปแบบไฟล์",
];

/**
 * หน้าจอแสดงกระบวนการ AI ทำสื่อทีละขั้น:
 * ขั้นที่กำลังทำ = ไอคอนหมุน, ขั้นที่เสร็จ = ติ๊กถูก, ขั้นที่รอ = วงกลมจาง
 * เมื่อครบทุกขั้น เรียก onComplete() เพื่อไปหน้าผลลัพธ์
 */
function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [done, setDone] = useState(0);
  const allDone = done >= GENERATION_STEPS.length;

  useEffect(() => {
    if (allDone) {
      const timer = window.setTimeout(onComplete, 800);
      return () => window.clearTimeout(timer);
    }
    // แต่ละขั้นใช้เวลาราว 1.5–2.2 วินาที (หมุนอยู่) ก่อนติ๊กถูกแล้วไปขั้นถัดไป
    const timer = window.setTimeout(
      () => setDone((current) => current + 1),
      1500 + Math.random() * 700,
    );
    return () => window.clearTimeout(timer);
  }, [done, allDone, onComplete]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/95 p-6 backdrop-blur-sm">
      <div className="flex w-full max-w-md flex-col items-center gap-8 animate-in fade-in duration-500">
        <div className="flex flex-col items-center gap-4">
          {allDone ? (
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          ) : (
            <Loader className="h-16 w-16 animate-spin text-primary" />
          )}
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold text-foreground">
              {allDone ? "เตรียมสื่อการสอนเสร็จแล้ว!" : "กำลังเตรียมสื่อการสอน..."}
            </h2>
            <p className="text-sm text-muted-foreground">
              {allDone ? "กำลังพาไปยังหน้าผลลัพธ์..." : "AI กำลังจัดทำสื่อทีละขั้น"}
            </p>
          </div>
        </div>

        <div className="w-full space-y-3">
          {GENERATION_STEPS.map((label, index) => {
            const status = index < done ? "done" : index === done ? "active" : "pending";
            return (
              <div
                key={label}
                className={cn(
                  "flex items-center gap-3 rounded-xl border p-3 transition-colors duration-300",
                  status === "done" && "border-green-500/30 bg-green-500/5",
                  status === "active" && "border-primary/40 bg-primary/5",
                  status === "pending" && "border-border/50 bg-muted/20",
                )}
              >
                {status === "done" ? (
                  <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-green-500" />
                ) : status === "active" ? (
                  <Loader className="h-5 w-5 flex-shrink-0 animate-spin text-primary" />
                ) : (
                  <span className="h-5 w-5 flex-shrink-0 rounded-full border-2 border-muted-foreground/30" />
                )}
                <span
                  className={cn(
                    "text-sm font-medium",
                    status === "pending" ? "text-muted-foreground" : "text-foreground",
                  )}
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function LessonPlanGeneration() {
  const navigate = useNavigate();
  const [draft] = useState<Draft>(() => getDraftFromStorage());
  const [messages, setMessages] = useState<ChatMessage[]>([
    { id: "intro", role: "assistant", content: "" },
  ]);
  const [phase, setPhase] = useState<"intro" | "selectStyle" | "content" | "complete">("intro");
  const [selectedStyle, setSelectedStyle] = useState(styleOptions[0].value);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [contentMessageId, setContentMessageId] = useState<string | null>(null);
  const [isLoadingScreen, setIsLoadingScreen] = useState(false);

  const introTypingRef = useRef(0);
  const contentTypingRef = useRef(0);
  const elapsedRef = useRef(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const introText = buildIntroText(draft);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setElapsedSeconds((current) => {
        const next = current + 1;
        elapsedRef.current = next;
        return next;
      });
    }, 1000);

    if (phase === "selectStyle" || phase === "complete") {
      window.clearInterval(timer);
      return undefined;
    }

    return () => window.clearInterval(timer);
  }, [phase]);

  useEffect(() => {
    if (phase !== "intro") return undefined;

    const timer = window.setInterval(() => {
      introTypingRef.current += 1;
      const nextText = introText.slice(0, introTypingRef.current);

      setMessages((current) =>
        current.map((message) => (message.id === "intro" ? { ...message, content: nextText } : message)),
      );

      if (introTypingRef.current >= introText.length) {
        window.clearInterval(timer);
        setPhase("selectStyle");
      }
    }, 24);

    return () => window.clearInterval(timer);
  }, [phase, introText]);

  useEffect(() => {
    if (phase !== "content" || !contentMessageId) return undefined;

    const fullText = buildContentText(selectedStyle, draft);
    contentTypingRef.current = 0;

    const timer = window.setInterval(() => {
      contentTypingRef.current += 1;

      setMessages((current) =>
        current.map((message) =>
          message.id === contentMessageId ? { ...message, content: fullText.slice(0, contentTypingRef.current) } : message,
        ),
      );

      if (contentTypingRef.current >= fullText.length) {
        window.clearInterval(timer);
        setPhase("complete");
        setMessages((current) => [
          ...current,
          {
            id: `complete-${Date.now()}`,
            role: "system",
            content: `ประมวลผลเสร็จสิ้น ใช้เวลาไปทั้งหมด ${elapsedRef.current} วินาที`,
          },
        ]);
      }
    }, 18);

    return () => window.clearInterval(timer);
  }, [contentMessageId, draft, phase, selectedStyle]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, phase, selectedStyle, elapsedSeconds]);


  const handleConfirmStyle = () => {
    if (phase !== "selectStyle") return;

    // บันทึกเนื้อหาลง sessionStorage แล้วเปิดหน้าจอแสดงกระบวนการทีละขั้น
    // (การไปหน้าผลลัพธ์จัดการโดย LoadingScreen เมื่อทุกขั้นเสร็จ)
    const lessonContent = buildContentText(selectedStyle, draft);
    const updatedDraft = { ...draft, lessonContent };
    window.sessionStorage.setItem(draftStorageKey, JSON.stringify(updatedDraft));

    setIsLoadingScreen(true);
  };

  const handleSaveLesson = (goToDetail?: boolean) => {
    const lessonId = createLessonId();
    const lesson: SavedLesson = {
      id: lessonId,
      planName: draft.planName || "Untitled Lesson",
      major: draft.major || "",
      subject: draft.subject || "",
      createdAt: Date.now(),
      createdAtDisplay: formatDate(Date.now()),
      content: {
        video: "https://via.placeholder.com/640x360?text=Video",
        slidesLesson: "https://via.placeholder.com/640x360?text=Slides+Lesson",
        slidesActivity: "https://via.placeholder.com/640x360?text=Slides+Activity",
        lessonPlan: "https://via.placeholder.com/640x360?text=Lesson+Plan",
        quiz: "https://via.placeholder.com/640x360?text=Quiz",
        song: "https://via.placeholder.com/640x360?text=Song",
        game: "https://via.placeholder.com/640x360?text=Game",
      },
    };

    saveLessonToStorage(lesson);

    if (goToDetail) {
      navigate(`/dashboard/create-lesson-plan/saved/${lessonId}`);
    } else {
      navigate("/dashboard/lesson-plan");
    }
  };


  if (isLoadingScreen) {
    return (
      <LoadingScreen
        onComplete={() => navigate("/dashboard/create-lesson-plan/generation/files")}
      />
    );
  }


  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-foreground">กำลังสร้างเนื้อหา</h1>
            <p className="text-muted-foreground">ดูตัวอย่างการสร้างเนื้อหาแบบ AI และเลือกสื่อประกอบได้ในหน้าต่อไป</p>
          </div>
        </div>

        <div className="grid grid-cols-1 items-stretch gap-6">
          <section className="flex min-h-[720px] flex-col rounded-2xl border border-border bg-card p-6">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-xl bg-secondary/10 p-3 text-secondary">
                <Sparkles className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">AI Generation Panel</h2>
                <p className="text-sm text-muted-foreground">ระบบกำลังประมวลผลและโต้ตอบเหมือนแชท</p>
              </div>
            </div>

            <div className="flex-1 space-y-4 overflow-y-auto pr-1 pb-4">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={message.role === "system" ? "flex justify-center" : "flex justify-start"}
                >
                  {message.role === "system" ? (
                    <div className="rounded-full border border-border bg-muted/40 px-4 py-2 text-xs text-muted-foreground">
                      {message.content}
                    </div>
                  ) : (
                    <div className="max-w-[92%] rounded-2xl border border-border bg-muted/20 p-4 shadow-sm">
                      <div className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-primary">
                        <Sparkles className="h-4 w-4" />
                        AI
                      </div>
                      <pre className="whitespace-pre-wrap font-sans text-sm leading-6 text-foreground">
                        {message.content}
                      </pre>
                    </div>
                  )}
                </div>
              ))}

              {phase === "selectStyle" && (
                <div className="space-y-4">
                  <div className="rounded-2xl border border-border bg-background p-4">
                    <p className="mb-3 text-sm font-medium text-foreground">เลือกรูปแบบเนื้อหา</p>
                    <div className="grid gap-3">
                      {styleOptions.map((style) => {
                        const active = selectedStyle === style.value;
                        return (
                          <button
                            key={style.value}
                            type="button"
                            onClick={() => setSelectedStyle(style.value)}
                            className={[
                              "w-full rounded-2xl border p-4 text-left transition-all",
                              active
                                ? "border-primary bg-primary/5 shadow-sm"
                                : "border-border bg-card hover:border-primary/40 hover:bg-muted/30",
                            ].join(" ")}
                          >
                            <p className="font-semibold text-foreground">{style.label}</p>
                            <p className="mt-1 text-sm text-muted-foreground">{style.description}</p>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <Button onClick={handleConfirmStyle} className="w-full rounded-full">
                    ยืนยันรูปแบบเนื้อหา
                  </Button>
                </div>
              )}

              <div ref={scrollRef} />
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-background p-4">
              <p className="text-sm font-medium text-foreground">เวลาในการประมวลผล {formatTime(elapsedSeconds)}</p>
            </div>

            {phase === "complete" && (
              <Button
                onClick={() => {
                  const lessonContent = buildContentText(selectedStyle, draft);
                  const updatedDraft = { ...draft, lessonContent };
                  window.sessionStorage.setItem(draftStorageKey, JSON.stringify(updatedDraft));
                  setIsLoadingScreen(true);
                }}
                className="mt-4 w-full rounded-full bg-primary text-white hover:bg-primary/90"
              >
                เริ่ม
              </Button>
            )}
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}
