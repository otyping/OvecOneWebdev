import Layout from "@/components/Layout";
import { Plus, Download, Eye, ImageIcon } from "lucide-react";
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
}

export default function QuizOffline() {
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
          .filter(quiz => quiz.type === "offline")
          .sort((a, b) => 
            new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
          );
        setQuizzes(quizArray);
      } catch (err) {
        console.error("Failed to load quizzes:", err);
      }
    }
  };

  const handleView = (quizId: string) => {
    navigate(`/quiz/view?id=${quizId}`);
  };

  const generateQRCode = async (quizId: string): Promise<string> => {
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(quizId)}`;
    return qrUrl;
  };

  const downloadQuestionPaper = async (quiz: QuizData) => {
    try {
      const qrCodeUrl = await generateQRCode(quiz.id);

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${quiz.title}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .info { font-size: 14px; color: #666; }
            .qr-section { text-align: right; margin-top: 10px; }
            .qr-section img { width: 150px; height: 150px; }
            .instructions { background: #f5f5f5; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .instructions h3 { margin-bottom: 10px; }
            .questions { margin-top: 30px; }
            .question { margin-bottom: 25px; page-break-inside: avoid; }
            .question-number { font-weight: bold; margin-bottom: 5px; }
            .question-text { margin-left: 20px; margin-bottom: 10px; }
            .choices { margin-left: 40px; }
            .choice { margin-bottom: 8px; }
            .choice-label { display: inline-block; width: 30px; font-weight: bold; }
            .metadata { font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            @media print {
              body { padding: 0; }
              .question { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${quiz.title}</div>
            <div class="info">
              <p>จำนวนคำถาม: ${quiz.maxQuestions}</p>
              <p>ระยะเวลา: ${quiz.timeLimit} นาที</p>
            </div>
            <div class="qr-section">
              <img src="${qrCodeUrl}" alt="QR Code">
              <p style="font-size: 12px; margin-top: 5px;">สแกน QR Code เพื่อทำแบบทดสอบออนไลน์</p>
            </div>
          </div>

          <div class="instructions">
            <h3>คำแนะนำ</h3>
            <ul>
              <li>โปรดอ่านคำถามอย่างรอบคอบ</li>
              <li>เลือกคำตอบที่ถูกต้องจากตัวเลือกที่ให้มา</li>
              <li>ทำเครื่องหมาย (✓) ในช่องตรงกับคำตอบที่เลือก</li>
              <li>ใช้เวลาทั้งหมดไม่เกิน ${quiz.timeLimit} นาที</li>
            </ul>
          </div>

          <div class="questions">
            ${Object.entries(quiz.questions)
              .map(([num, q]: [string, any]) => `
                <div class="question">
                  <div class="question-number">คำถาม ${num}</div>
                  <div class="question-text">${q.text || ""}</div>
                  <div class="choices">
                    ${q.choices.map((choice: any, index: number) => `
                      <div class="choice">
                        <span class="choice-label">${String.fromCharCode(65 + index)}.</span>
                        <input type="checkbox"> ${choice.text || ""}
                      </div>
                    `).join("")}
                  </div>
                </div>
              `).join("")}
          </div>

          <div class="metadata">
            <p>สร้างเมื่อ: ${formatDate(quiz.createdAt)}</p>
            <p>สาขา: ${quiz.branch === "electrical" ? "ช่างไฟฟ้า" : "อิเล็กทรอนิกส์"} | วิชา: ${quiz.subject} | หน่วย: ${quiz.unit}</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${quiz.title}-คำถาม.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการสร้างไฟล์: " + (err as Error).message);
    }
  };

  const downloadAnswerPaper = async (quiz: QuizData) => {
    try {
      const qrCodeUrl = await generateQRCode(quiz.id);

      const htmlContent = `
        <!DOCTYPE html>
        <html lang="th">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${quiz.title} - เฉลย</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; line-height: 1.6; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 15px; }
            .title { font-size: 24px; font-weight: bold; margin-bottom: 10px; }
            .subtitle { font-size: 18px; color: #d32f2f; margin-bottom: 10px; }
            .info { font-size: 14px; color: #666; }
            .qr-section { text-align: right; margin-top: 10px; }
            .qr-section img { width: 150px; height: 150px; }
            .answers { margin-top: 30px; }
            .answer-item { margin-bottom: 15px; page-break-inside: avoid; }
            .answer-number { font-weight: bold; margin-bottom: 5px; }
            .answer-text { margin-left: 20px; margin-bottom: 5px; }
            .correct-answer { background: #e8f5e9; padding: 8px 12px; border-left: 4px solid #4caf50; margin-left: 20px; }
            .answer-label { color: #4caf50; font-weight: bold; }
            .metadata { font-size: 12px; color: #999; margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; }
            @media print {
              body { padding: 0; }
              .answer-item { page-break-inside: avoid; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">${quiz.title}</div>
            <div class="subtitle">เฉลยแบบทดสอบ</div>
            <div class="info">
              <p>จำนวนคำถาม: ${quiz.maxQuestions}</p>
            </div>
            <div class="qr-section">
              <img src="${qrCodeUrl}" alt="QR Code">
            </div>
          </div>

          <div class="answers">
            <h3>เฉลยคำตอบ</h3>
            ${Object.entries(quiz.questions)
              .map(([num, q]: [string, any]) => `
                <div class="answer-item">
                  <div class="answer-number">คำถาม ${num}</div>
                  <div class="answer-text"><strong>${q.text || ""}</strong></div>
                  <div class="correct-answer">
                    <span class="answer-label">คำตอบที่ถูกต้อง:</span>
                    <strong>ตัวเลือก A - ${q.choices[0]?.text || ""}</strong>
                  </div>
                </div>
              `).join("")}
          </div>

          <div class="metadata">
            <p>สร้างเมื่อ: ${formatDate(quiz.createdAt)}</p>
            <p>สาขา: ${quiz.branch === "electrical" ? "ช่างไฟฟ้า" : "อิเล็กทรอนิกส์"} | วิชา: ${quiz.subject}</p>
          </div>
        </body>
        </html>
      `;

      const blob = new Blob([htmlContent], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${quiz.title}-เฉลย.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (err) {
      alert("เกิดข้อผิดพลาดในการสร้างไฟล์: " + (err as Error).message);
    }
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
          <h1 className="text-3xl font-bold text-foreground">
            แบบทดสอบออฟไลน์
          </h1>
          <p className="text-muted-foreground mt-2">
            สร้าง QR code สำหรับการเข้าถึงแบบทดสอบและสร้างแบบทดสอบกระดาษที่สามารถพิมพ์ได้
          </p>
        </div>

        {/* Filters */}
        <div className="bg-card border border-border rounded-xl p-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="w-full flex items-center justify-between text-sm font-medium text-foreground hover:text-brand-red transition-colors"
          >
            <span>ตัวกรอง</span>
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
                  placeholder="ค้นหา..."
                  className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
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
                  className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                >
                  <option value="">ทั้งหมด</option>
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
                  className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-muted"
                >
                  <option value="">ทั้งหมด</option>
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
                  className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-muted"
                >
                  <option value="">ทั้งหมด</option>
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
                  className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red disabled:bg-muted"
                >
                  <option value="">ทั้งหมด</option>
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
                  className="w-full px-2 py-1 border border-border rounded text-xs focus:outline-none focus:ring-1 focus:ring-brand-red"
                />
              </div>
            </div>
          )}
        </div>

        {/* Quiz List */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-foreground">
            แบบทดสอบออฟไลน์ของคุณ ({filteredQuizzes.length})
          </h2>

          {filteredQuizzes.length === 0 ? (
            <div className="bg-card border border-dashed border-border rounded-2xl p-12 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-muted rounded-full mb-4">
                <ImageIcon className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground font-medium">
                ยังไม่มีแบบทดสอบออฟไลน์
              </p>
              <p className="text-muted-foreground text-sm mt-1">
                คลิกปุ่ม "สร้างแบบทดสอบใหม่" เพื่อเริ่มต้น
              </p>
            </div>
          ) : (
            filteredQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-card border border-border rounded-2xl p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground">
                      {quiz.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {quiz.maxQuestions} คำถาม • {formatDate(quiz.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleView(quiz.id)}
                      className="flex items-center gap-2 bg-card border border-border hover:border-foreground/40 text-foreground px-4 py-2 rounded-full font-medium transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      ดู
                    </button>
                    <button
                      onClick={() => downloadQuestionPaper(quiz)}
                      className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลดคำถาม
                    </button>
                    <button
                      onClick={() => downloadAnswerPaper(quiz)}
                      className="flex items-center gap-2 bg-brand-red hover:bg-red-700 text-white px-4 py-2 rounded-full font-medium transition-colors text-sm"
                    >
                      <Download className="w-4 h-4" />
                      ดาวน์โหลดเฉลย
                    </button>
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
