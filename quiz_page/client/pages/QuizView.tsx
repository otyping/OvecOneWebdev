import Layout from "@/components/Layout";
import { ArrowLeft } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface QuizData {
  id: string;
  title: string;
  type: string;
  timeLimit: string;
  branch: string;
  subject: string;
  unit: string;
  topic: string;
  maxQuestions: number;
  questions: any;
  createdAt: string;
  updatedAt: string;
}

export default function QuizView() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const quizId = searchParams.get("id");
    if (quizId) {
      const stored = localStorage.getItem("quizzes");
      if (stored) {
        try {
          const quizzesObj = JSON.parse(stored) as Record<string, QuizData>;
          const foundQuiz = quizzesObj[quizId];
          if (foundQuiz) {
            // Restore media for all questions
            const restoredQuiz = { ...foundQuiz };
            Object.keys(restoredQuiz.questions || {}).forEach((qIdx: any) => {
              const question = restoredQuiz.questions[qIdx];
              if (question.imageId) {
                const media = localStorage.getItem(`quiz-media-${quizId}-${question.imageId}`);
                if (media) question.image = media;
              }
              if (question.audioId) {
                const media = localStorage.getItem(`quiz-media-${quizId}-${question.audioId}`);
                if (media) question.audio = media;
              }
              (question.choices || []).forEach((choice: any, cIdx: number) => {
                if (choice.imageId) {
                  const media = localStorage.getItem(`quiz-media-${quizId}-${choice.imageId}`);
                  if (media) choice.image = media;
                }
                if (choice.audioId) {
                  const media = localStorage.getItem(`quiz-media-${quizId}-${choice.audioId}`);
                  if (media) choice.audio = media;
                }
              });
            });
            setQuiz(restoredQuiz);
          }
        } catch (err) {
          console.error("Failed to load quiz:", err);
        }
      }
    }
    setLoading(false);
  }, [searchParams]);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-screen">
          <p className="text-gray-600">กำลังโหลด...</p>
        </div>
      </Layout>
    );
  }

  if (!quiz) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-gray-600">ไม่พบแบบทดสอบ</p>
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-brand-red hover:text-red-700"
          >
            <ArrowLeft className="w-4 h-4" />
            กลับไปหน้าแรก
          </button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header with Back Button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-brand-red hover:text-red-700 transition-colors p-2 hover:bg-gray-100 rounded-full"
            title="กลับ"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-3xl font-bold text-gray-900">{quiz.title}</h1>
        </div>

        {/* Quiz Metadata */}
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">ข้อมูลแบบทดสอบ</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ชื่อแบบทดสอบ</label>
              <p className="text-gray-900">{quiz.title}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ประเภท</label>
              <p className="text-gray-900">{quiz.type === "online" ? "ออนไลน์" : "ออฟไลน์"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ระยะเวลา (นาที)</label>
              <p className="text-gray-900">{quiz.timeLimit}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">จำนวนคำถาม</label>
              <p className="text-gray-900">{quiz.maxQuestions}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">สาขาวิชา</label>
              <p className="text-gray-900">{quiz.branch === "electrical" ? "ช่างไฟฟ้า" : "อิเล็กทรอนิกส์"}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">วิชา</label>
              <p className="text-gray-900">{quiz.subject}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">หน่วย</label>
              <p className="text-gray-900">{quiz.unit}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">เรื่อง</label>
              <p className="text-gray-900">{quiz.topic}</p>
            </div>
          </div>
        </div>

        {/* Questions */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">คำถาม</h2>
          <div className="space-y-6">
            {Object.entries(quiz.questions || {}).map(([num, q]: [string, any]) => (
              <div key={num} className="bg-white border border-gray-200 rounded-2xl p-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">คำถาม {num}</label>
                  <p className="text-gray-900 text-base">{q.text || "-"}</p>
                </div>

                {q.image && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">รูปภาพคำถาม</label>
                    <img
                      src={q.image}
                      alt="Question"
                      className="max-w-xs max-h-48 rounded border border-gray-200"
                    />
                  </div>
                )}

                {q.audio && (
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">เสียงคำถาม</label>
                    <audio controls className="w-full">
                      <source src={q.audio} />
                    </audio>
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-3">ตัวเลือกคำตอบ</label>
                  <div className="space-y-3">
                    {(q.choices || []).map((choice: any, idx: number) => (
                      <div key={idx} className="border border-gray-200 rounded-lg p-4">
                        <div className="flex items-start gap-3">
                          <span
                            className={`flex-shrink-0 px-3 py-1 rounded-full text-sm font-bold ${
                              idx === 0
                                ? "bg-green-100 text-green-800"
                                : "bg-gray-100 text-gray-700"
                            }`}
                          >
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <div className="flex-1">
                            <p className="text-gray-900">{choice.text || "-"}</p>
                            {choice.image && (
                              <img
                                src={choice.image}
                                alt={`Choice ${String.fromCharCode(65 + idx)}`}
                                className="max-w-xs max-h-32 rounded border border-gray-200 mt-3"
                              />
                            )}
                            {choice.audio && (
                              <audio controls className="w-full mt-3">
                                <source src={choice.audio} />
                              </audio>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
