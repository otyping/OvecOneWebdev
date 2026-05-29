import Layout from "@/components/Layout";
import { Plus, Trash2, ImageIcon } from "lucide-react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useT } from "@/i18n/useT";

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

export default function QuizCreate() {
  const navigate = useNavigate();
  const t = useT();
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
        const quizArray = Object.values(quizzesObj).sort((a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
        );
        setQuizzes(quizArray);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      }
    }
  };

  const handleDelete = (quizId: string) => {
    if (!window.confirm("คุณแน่ใจที่ต้องการลบแบบทดสอบนี้?")) {
      return;
    }
    const stored = localStorage.getItem("quizzes");
    if (stored) {
      const quizzesObj = JSON.parse(stored) as Record<string, QuizData>;
      delete quizzesObj[quizId];
      localStorage.setItem("quizzes", JSON.stringify(quizzesObj));
      loadQuizzes();
    }
  };

  const handleEdit = (quizId: string) => {
    navigate(`/quiz/create/form?id=${quizId}`);
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
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              {t("create.title")}
            </h1>
            <p className="text-muted-foreground mt-2">
              {t("create.subtitle")}
            </p>
          </div>
          <button
            onClick={() => navigate("/quiz/create/form")}
            className="bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-full flex items-center gap-2 font-medium shadow-soft transition-all duration-200 ease-smooth hover:-translate-y-0.5 hover:shadow-soft-lg active:scale-95 motion-reduce:transform-none"
          >
            <Plus className="w-5 h-5" />
            {t("create.new")}
          </button>
        </div>

        {/* Filters */}
        <div className="glass rounded-xl p-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-brand-red transition-colors"
          >
            <span>{t("create.filters")}</span>
            <span className={`transform transition-transform ${showFilters ? 'rotate-180' : ''}`}>▼</span>
          </button>

          {showFilters && (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2 mt-3 pt-3 border-t border-border">
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">ชื่อแบบทดสอบ</label>
                <input
                  type="text"
                  value={searchTitle}
                  onChange={(e) => setSearchTitle(e.target.value)}
                  placeholder={t("action.search")}
                  className="w-full px-2 py-1 border border-border bg-background text-foreground rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">สาขาวิชา</label>
                <select
                  value={filterBranch}
                  onChange={(e) => {
                    setFilterBranch(e.target.value);
                    setFilterSubject("");
                    setFilterUnit("");
                    setFilterTopic("");
                  }}
                  className="w-full px-2 py-1 border border-border bg-background text-foreground rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="">{t("action.all")}</option>
                  {getUniqueBranches().map(branch => (
                    <option key={branch} value={branch}>{branch === "electrical" ? "ช่างไฟฟ้า" : "อิเล็กทรอนิกส์"}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">วิชา</label>
                <select
                  value={filterSubject}
                  onChange={(e) => {
                    setFilterSubject(e.target.value);
                    setFilterUnit("");
                    setFilterTopic("");
                  }}
                  disabled={!filterBranch}
                  className="w-full px-2 py-1 border border-border bg-background text-foreground rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-muted"
                >
                  <option value="">{t("action.all")}</option>
                  {getUniqueSubjects().map(subject => (
                    <option key={subject} value={subject}>{subject}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">หน่วย</label>
                <select
                  value={filterUnit}
                  onChange={(e) => {
                    setFilterUnit(e.target.value);
                    setFilterTopic("");
                  }}
                  disabled={!filterSubject}
                  className="w-full px-2 py-1 border border-border bg-background text-foreground rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-muted"
                >
                  <option value="">{t("action.all")}</option>
                  {getUniqueUnits().map(unit => (
                    <option key={unit} value={unit}>{unit}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">เรื่อง</label>
                <select
                  value={filterTopic}
                  onChange={(e) => setFilterTopic(e.target.value)}
                  disabled={!filterUnit}
                  className="w-full px-2 py-1 border border-border bg-background text-foreground rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-muted"
                >
                  <option value="">{t("action.all")}</option>
                  {getUniqueTopics().map(topic => (
                    <option key={topic} value={topic}>{topic}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-muted-foreground mb-1">วันที่สร้าง</label>
                <input
                  type="date"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="w-full px-2 py-1 border border-border bg-background text-foreground rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quiz List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            {t("create.yourQuizzes")} ({filteredQuizzes.length})
          </h2>

          {filteredQuizzes.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">
                {t("create.empty")}
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                {t("create.emptyHint")}
              </p>
            </div>
          ) : (
            <Stagger className="space-y-3">
              {filteredQuizzes.map((quiz) => (
                <StaggerItem key={quiz.id}>
                  <div className="glass rounded-2xl p-4 hover-lift">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          {quiz.maxQuestions} {t("create.questions")} • {formatDate(quiz.updatedAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEdit(quiz.id)}
                          className="bg-card border border-border hover:border-foreground/40 text-foreground px-4 py-2 rounded-full font-medium transition-colors active:scale-95"
                        >
                          {t("action.edit")}
                        </button>

                        <button
                          onClick={() => handleDelete(quiz.id)}
                          className="text-red-500 hover:text-red-700 p-2 transition-colors active:scale-90"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </div>
      </div>
    </Layout>
  );
}
