import Layout from "@/components/Layout";
import { ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

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
  completed?: boolean;
  score?: number;
  totalQuestions?: number;
}

export default function QuizStudent() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState<QuizData[]>([]);
  const [filteredQuizzes, setFilteredQuizzes] = useState<QuizData[]>([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [filterBranch, setFilterBranch] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [filterUnit, setFilterUnit] = useState("");
  const [filterTopic, setFilterTopic] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    loadQuizzes();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [quizzes, searchTitle, filterBranch, filterSubject, filterUnit, filterTopic, filterDate]);

  const loadQuizzes = () => {
    const stored = localStorage.getItem("quizzes");
    if (stored) {
      try {
        const quizzesObj = JSON.parse(stored) as Record<string, QuizData>;
        const quizArray = Object.values(quizzesObj)
          .filter(quiz => quiz.type === "online")
          .sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        setQuizzes(quizArray);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      }
    }
  };

  const handleTakeQuiz = (quizId: string) => {
    navigate(`/quiz/take?id=${quizId}`);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("th-TH", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const applyFilters = () => {
    let filtered = quizzes;

    if (searchTitle.trim()) {
      filtered = filtered.filter(q => q.title.toLowerCase().includes(searchTitle.toLowerCase()));
    }

    if (filterBranch) {
      filtered = filtered.filter(q => q.branch === filterBranch);
    }

    if (filterSubject) {
      filtered = filtered.filter(q => q.subject === filterSubject);
    }

    if (filterUnit) {
      filtered = filtered.filter(q => q.unit === filterUnit);
    }

    if (filterTopic) {
      filtered = filtered.filter(q => q.topic === filterTopic);
    }

    if (filterDate) {
      filtered = filtered.filter(q => {
        const quizDate = new Date(q.createdAt).toLocaleDateString("th-TH", { year: "numeric", month: "2-digit", day: "2-digit" });
        const selectedDate = new Date(filterDate).toLocaleDateString("th-TH", { year: "numeric", month: "2-digit", day: "2-digit" });
        return quizDate === selectedDate;
      });
    }

    setFilteredQuizzes(filtered);
  };

  const getUniqueBranches = () => {
    return Array.from(new Set(quizzes.map(q => q.branch).filter(Boolean)));
  };

  const getUniqueSubjects = () => {
    const subjects = filterBranch ? quizzes.filter(q => q.branch === filterBranch).map(q => q.subject) : quizzes.map(q => q.subject);
    return Array.from(new Set(subjects.filter(Boolean)));
  };

  const getUniqueUnits = () => {
    let units = quizzes.map(q => q.unit);
    if (filterBranch) units = units.filter((_, i) => quizzes[i].branch === filterBranch);
    if (filterSubject) units = units.filter((_, i) => quizzes[i].subject === filterSubject);
    return Array.from(new Set(units.filter(Boolean)));
  };

  const getUniqueTopics = () => {
    let topics = quizzes.map(q => q.topic);
    if (filterBranch) topics = topics.filter((_, i) => quizzes[i].branch === filterBranch);
    if (filterSubject) topics = topics.filter((_, i) => quizzes[i].subject === filterSubject);
    if (filterUnit) topics = topics.filter((_, i) => quizzes[i].unit === filterUnit);
    return Array.from(new Set(topics.filter(Boolean)));
  };

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            แบบทดสอบออนไลน์
          </h1>
          <p className="text-gray-600 mt-2">
            นักเรียนสามารถทำแบบทดสอบออนไลน์ ตอบคำถามปรนัย และส่งคำตอบเพื่อรับความเห็นอย่างทันที
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white border border-gray-200 rounded-xl p-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between text-sm font-medium text-gray-900 hover:text-brand-red transition-colors"
          >
            <span>ตัวกรอง</span>
            <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-gray-200">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">ชื่อแบบทดสอบ</label>
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder="ค้นหา..."
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">สาขาวิชา</label>
                <select
                  value={filterBranch}
                  onChange={(e) => {
                    setFilterBranch(e.target.value);
                    setFilterSubject("");
                    setFilterUnit("");
                    setFilterTopic("");
                  }}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="">ทั้งหมด</option>
                  {getUniqueBranches().map(branch => (
                    <option key={branch} value={branch}>{branch === "electrical" ? "ช่างไฟฟ้า" : "อิเล็กทรอนิกส์"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">วิชา</label>
                <select
                  value={filterSubject}
                  onChange={(e) => {
                    setFilterSubject(e.target.value);
                    setFilterUnit("");
                    setFilterTopic("");
                  }}
                  disabled={!filterBranch}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-100"
                >
                  <option value="">ทั้งหมด</option>
                  {getUniqueSubjects().map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">หน่วย</label>
                <select
                  value={filterUnit}
                  onChange={(e) => {
                    setFilterUnit(e.target.value);
                    setFilterTopic("");
                  }}
                  disabled={!filterSubject}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-100"
                >
                  <option value="">ทั้งหมด</option>
                  {getUniqueUnits().map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">เรื่อง</label>
                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  disabled={!filterUnit}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-gray-100"
                >
                  <option value="">ทั้งหมด</option>
                  {getUniqueTopics().map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">วันที่สร้าง</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-2 py-1 border border-gray-300 rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quiz List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gray-900">
            รายการแบบทดสอบ ({filteredQuizzes.length})
          </h2>

          {filteredQuizzes.length === 0 ? (
            <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
                <ImageIcon className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-600 font-medium">
                ยังไม่มีแบบทดสอบออนไลน์
              </p>
              <p className="text-gray-500 text-sm mt-1">
                กรุณารอให้ครูอาจารย์สร้างแบบทดสอบ
              </p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-white border border-gray-200 rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-1">
                      {quiz.maxQuestions} คำถาม • เวลา {quiz.timeLimit} นาที • {formatDate(quiz.updatedAt)}
                    </p>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    {quiz.completed ? (
                      <div className="bg-green-50 px-4 py-2 rounded-full border border-green-200">
                        <p className="text-sm font-medium text-green-800">
                          คะแนน: {quiz.score}/{quiz.totalQuestions}
                        </p>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleTakeQuiz(quiz.id)}
                        className="bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
                      >
                        ทำแบบทดสอบ
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </Layout>
  );
}
