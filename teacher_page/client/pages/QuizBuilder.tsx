import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  FileQuestion,
  ArrowLeft,
  Plus,
  Trash2,
  Save,
  ChevronDown,
} from "lucide-react";

export default function QuizBuilder() {
  const navigate = useNavigate();
  const [quizInfo, setQuizInfo] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    const storedInfo = sessionStorage.getItem("quizInfo");
    if (storedInfo) {
      setQuizInfo(JSON.parse(storedInfo));
    }
  }, []);

  const questionTypes = [
    { value: "multiple", label: "เลือกข้อที่ถูกต้อง (Multiple Choice)" },
    { value: "true-false", label: "จริง-เท็จ (True/False)" },
    { value: "short-answer", label: "คำตอบสั้น (Short Answer)" },
    { value: "matching", label: "จับคู่ (Matching)" },
    { value: "essay", label: "บรรยาย (Essay)" },
    { value: "record", label: "บันทึกเสียง (Voice Record)" },
  ];

  const addQuestion = (type: string) => {
    const newQuestion = {
      id: Date.now(),
      type,
      question: "",
      options: type === "multiple" ? ["", "", "", ""] : [],
      correctAnswer: type === "true-false" ? "true" : "",
      explanation: "",
    };
    setQuestions([...questions, newQuestion]);
    setExpandedQuestion(newQuestion.id);
  };

  const deleteQuestion = (id: number) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const updateQuestion = (id: number, field: string, value: any) => {
    setQuestions(
      questions.map((q) => (q.id === id ? { ...q, [field]: value } : q))
    );
  };

  const updateOption = (id: number, index: number, value: string) => {
    setQuestions(
      questions.map((q) =>
        q.id === id
          ? {
              ...q,
              options: q.options.map((opt: string, i: number) =>
                i === index ? value : opt
              ),
            }
          : q
      )
    );
  };

  const handleSaveQuiz = () => {
    if (questions.length === 0) {
      alert("โปรดเพิ่มคำถามอย่างน้อย 1 ข้อ");
      return;
    }
    alert("บันทึกแบบทดสอบสำเร็จ!");
    sessionStorage.removeItem("quizInfo");
    navigate("/dashboard/quiz");
  };

  if (!quizInfo) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center gap-4">
          <Link to="/dashboard/quiz">
            <Button variant="outline" className="rounded-full h-10 w-10 p-0">
              <ArrowLeft className="w-5 h-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {quizInfo.title}
            </h1>
            <p className="text-muted-foreground text-sm">
              ชั้นที่ {quizInfo.grade} ห้อง {quizInfo.class} • {quizInfo.subject}
            </p>
          </div>
        </div>

        {/* Add Question Buttons */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-3">
          <h3 className="font-semibold text-foreground mb-4">
            เพิ่มคำถาม (เลือกประเภท)
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {questionTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => addQuestion(type.value)}
                className="flex items-center gap-2 px-4 py-3 rounded-xl border border-primary text-primary hover:bg-primary/10 transition-colors text-sm font-medium"
              >
                <Plus className="w-4 h-4" />
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Questions List */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">
              คำถามทั้งหมด ({questions.length})
            </h2>
          </div>

          {questions.length === 0 ? (
            <div className="bg-muted/30 border border-border rounded-2xl p-12 text-center">
              <FileQuestion className="w-12 h-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground">
                เพิ่มคำถามเพื่อเริ่มสร้างแบบทดสอบ
              </p>
            </div>
          ) : (
            questions.map((question, index) => (
              <div
                key={question.id}
                className="bg-card border border-border rounded-2xl overflow-hidden"
              >
                {/* Question Header */}
                <button
                  onClick={() =>
                    setExpandedQuestion(
                      expandedQuestion === question.id ? null : question.id
                    )
                  }
                  className="w-full p-6 flex items-center justify-between hover:bg-muted/30 transition-colors"
                >
                  <div className="flex items-start gap-4 flex-1">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 text-primary flex items-center justify-center text-sm font-semibold">
                      {index + 1}
                    </div>
                    <div className="text-left flex-1">
                      <p className="font-medium text-foreground text-sm">
                        {questionTypes.find((t) => t.value === question.type)
                          ?.label}
                      </p>
                      <p className="text-sm text-muted-foreground truncate">
                        {question.question || "กรุณากรอกคำถาม"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteQuestion(question.id);
                      }}
                      className="rounded-full h-8 w-8 p-0"
                    >
                      <Trash2 className="w-4 h-4 text-destructive" />
                    </Button>
                    <ChevronDown
                      className={`w-5 h-5 text-muted-foreground transition-transform ${
                        expandedQuestion === question.id ? "rotate-180" : ""
                      }`}
                    />
                  </div>
                </button>

                {/* Question Content */}
                {expandedQuestion === question.id && (
                  <div className="border-t border-border p-6 space-y-4 bg-muted/10">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-foreground">
                        คำถาม *
                      </label>
                      <Textarea
                        placeholder="กรอกคำถาม..."
                        value={question.question}
                        onChange={(e) =>
                          updateQuestion(
                            question.id,
                            "question",
                            e.target.value
                          )
                        }
                        className="rounded-lg text-sm"
                      />
                    </div>

                    {/* Multiple Choice Options */}
                    {question.type === "multiple" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          ตัวเลือก
                        </label>
                        {question.options.map((option: string, i: number) => (
                          <Input
                            key={i}
                            placeholder={`ตัวเลือก ${String.fromCharCode(65 + i)}`}
                            value={option}
                            onChange={(e) =>
                              updateOption(question.id, i, e.target.value)
                            }
                            className="rounded-full h-10 text-sm"
                          />
                        ))}
                      </div>
                    )}

                    {/* True/False */}
                    {question.type === "true-false" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          คำตอบที่ถูกต้อง
                        </label>
                        <select
                          value={question.correctAnswer}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "correctAnswer",
                              e.target.value
                            )
                          }
                          className="w-full px-4 py-2 rounded-full border border-border bg-background text-foreground text-sm"
                        >
                          <option value="true">จริง (True)</option>
                          <option value="false">เท็จ (False)</option>
                        </select>
                      </div>
                    )}

                    {/* Matching */}
                    {question.type === "matching" && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          ข้อมูลจับคู่
                        </label>
                        <Textarea
                          placeholder="กรอกข้อมูลจับคู่ (แต่ละแถวหนึ่งข้อ)"
                          value={question.options[0] || ""}
                          onChange={(e) =>
                            updateOption(question.id, 0, e.target.value)
                          }
                          className="rounded-lg text-sm min-h-24"
                        />
                      </div>
                    )}

                    {/* Explanation */}
                    {(question.type === "multiple" ||
                      question.type === "true-false") && (
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                          คำอธิบายเพิ่มเติม (ทางเลือก)
                        </label>
                        <Textarea
                          placeholder="อธิบายเหตุผลของคำตอบ..."
                          value={question.explanation}
                          onChange={(e) =>
                            updateQuestion(
                              question.id,
                              "explanation",
                              e.target.value
                            )
                          }
                          className="rounded-lg text-sm min-h-16"
                        />
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 sticky bottom-6">
          <Link to="/dashboard/quiz" className="flex-1">
            <Button variant="outline" className="w-full rounded-full">
              ยกเลิก
            </Button>
          </Link>
          <Button
            onClick={handleSaveQuiz}
            className="flex-1 rounded-full gap-2"
          >
            <Save className="w-4 h-4" />
            บันทึกแบบทดสอบ
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
