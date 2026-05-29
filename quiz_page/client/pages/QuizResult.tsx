import Layout from "@/components/Layout";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";

interface QuizScore {
  quizId: string;
  quizTitle: string;
  score: number;
  totalQuestions: number;
  timeSpent: number;
  completedAt: string;
}

export default function QuizResult() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [scoreData, setScoreData] = useState<QuizScore | null>(null);

  useEffect(() => {
    const quizId = searchParams.get("quizId");
    if (quizId) {
      const stored = localStorage.getItem(`quiz-score-${quizId}`);
      if (stored) {
        setScoreData(JSON.parse(stored));
      }
    }
  }, [searchParams]);

  if (!scoreData) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-gray-500">ไม่พบข้อมูลคะแนน</p>
        </div>
      </Layout>
    );
  }

  const percentage = Math.round((scoreData.score / scoreData.totalQuestions) * 100);
  const minutes = Math.floor(scoreData.timeSpent / 60);
  const seconds = scoreData.timeSpent % 60;

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="bg-white border border-gray-200 rounded-2xl p-8 text-center space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">ส่งแบบทดสอบแล้ว</h1>
            <p className="text-gray-600">แบบทดสอบ: {scoreData.quizTitle}</p>
          </div>

          {/* Score Card */}
          <div className="bg-gray-50 border border-gray-200 rounded-xl p-8 space-y-4">
            <p className="text-sm font-medium text-gray-700">คะแนนของคุณ</p>
            <div className="text-5xl font-bold text-gray-900">
              {scoreData.score}/{scoreData.totalQuestions}
            </div>
            <p className="text-2xl font-semibold text-gray-900">{percentage}%</p>
          </div>

          {/* Stats */}
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
            <p className="text-sm text-gray-600 mb-2">เวลาที่ใช้</p>
            <p className="text-2xl font-bold text-gray-900">
              {minutes}:{seconds.toString().padStart(2, '0')}
            </p>
          </div>

          {/* Completion Info */}
          <div className="text-sm text-gray-500">
            <p>เสร็จสิ้นเมื่อ: {new Date(scoreData.completedAt).toLocaleString("th-TH")}</p>
          </div>

          {/* Action Button */}
          <button
            onClick={() => navigate("/quiz/student")}
            className="w-full bg-brand-red hover:bg-red-700 text-white px-8 py-3 rounded-full font-medium transition-colors text-lg"
          >
            เสร็จสิ้น
          </button>
        </div>
      </div>
    </Layout>
  );
}
