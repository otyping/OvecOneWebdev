import Layout from "@/components/Layout";
import { ArrowLeft, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

interface Student {
  id: string;
  name: string;
  branch: string;
  year: string;
  classroom: string;
  score?: number;
}

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

export default function ScoreCheck() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);

  useEffect(() => {
    const quizId = searchParams.get("id");
    if (quizId) {
      const stored = localStorage.getItem("quizzes");
      if (stored) {
        try {
          const quizzesObj = JSON.parse(stored) as Record<string, QuizData>;
          const foundQuiz = quizzesObj[quizId];
          if (foundQuiz) {
            setQuiz(foundQuiz);
            loadStudents(quizId);
          }
        } catch (err) {
          console.error("Failed to load quiz:", err);
        }
      }
    }
  }, [searchParams]);

  const loadStudents = (quizId: string) => {
    const stored = localStorage.getItem(`quiz-students-${quizId}`);
    if (stored) {
      try {
        setStudents(JSON.parse(stored));
      } catch (err) {
        console.error("Failed to load students:", err);
        initializeMockStudents();
      }
    } else {
      initializeMockStudents();
    }
  };

  const initializeMockStudents = () => {
    const mockStudents: Student[] = [
      {
        id: "1",
        name: "สมชาย ใจดี",
        branch: "electrical",
        year: "1",
        classroom: "1",
        score: 8,
      },
      {
        id: "2",
        name: "สมหญิง สวยงาม",
        branch: "electrical",
        year: "1",
        classroom: "1",
        score: 9,
      },
      {
        id: "3",
        name: "สมปอง เก่ง",
        branch: "electronics",
        year: "1",
        classroom: "1",
        score: undefined,
      },
      {
        id: "4",
        name: "กิตติ มุ่งหน้า",
        branch: "electrical",
        year: "1",
        classroom: "1",
        score: 7,
      },
      {
        id: "5",
        name: "นิดา ใจงาม",
        branch: "electronics",
        year: "1",
        classroom: "1",
        score: 10,
      },
    ];
    setStudents(mockStudents);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadedFile(file);
      console.log("File uploaded:", file.name);
    }
  };

  if (!quiz) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <p className="text-muted-foreground">ไม่พบแบบทดสอบ</p>
          <button
            onClick={() => navigate("/check-score")}
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
            onClick={() => navigate("/check-score")}
            className="flex items-center gap-2 text-brand-red hover:text-red-700 transition-colors p-2 hover:bg-muted rounded-full"
            title="กลับ"
          >
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">ตรวจสอบคะแนน</h1>
            <p className="text-muted-foreground mt-1">{quiz.title}</p>
          </div>
        </div>

        {/* File Upload Section */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            อัปโหลดภาพถ่ายกระดาษคำตอบ
          </h2>
          <div className="flex items-center gap-4">
            <label className="flex items-center justify-center w-full">
              <div className="flex flex-col items-center justify-center border-2 border-dashed border-border rounded-lg p-6 cursor-pointer hover:border-brand-red transition-colors w-full">
                <Upload className="w-8 h-8 text-muted-foreground mb-2" />
                <p className="text-sm font-medium text-foreground">เลือกหรือลากไฟล์มาที่นี่</p>
                <p className="text-xs text-muted-foreground mt-1">PNG, JPG, PDF</p>
              </div>
              <input
                type="file"
                onChange={handleFileUpload}
                accept="image/*,.pdf"
                className="hidden"
              />
            </label>
          </div>
          {uploadedFile && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                ✓ ไฟล์ที่เลือก: <span className="font-medium">{uploadedFile.name}</span>
              </p>
            </div>
          )}
        </div>

        {/* Students Table */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            รายชื่อนักเรียน ({students.length})
          </h2>

          {students.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-background border-b border-border">
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-32">ชื่อนักเรียน</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-28">สาขาวิชา</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-24">ชั้นปี</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-24">ห้องเรียน</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-foreground w-20">คะแนน</th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student) => (
                    <tr key={student.id} className="border-b border-border hover:bg-muted transition-colors">
                      <td className="px-4 py-3 text-foreground">{student.name}</td>
                      <td className="px-4 py-3 text-foreground">
                        {student.branch === "electrical" ? "ช่างไฟฟ้า" : "อิเล็กทรอนิกส์"}
                      </td>
                      <td className="px-4 py-3 text-foreground">ปวช.{student.year}</td>
                      <td className="px-4 py-3 text-foreground">{student.classroom}</td>
                      <td className="px-4 py-3 text-foreground">
                        {student.score !== undefined ? student.score : "ยังไม่ได้ตรวจคะแนน"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
}
