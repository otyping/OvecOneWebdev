import Layout from "@/components/Layout";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  questions: Record<number, any>;
  createdAt: string;
  updatedAt: string;
}

export default function QuizTaker() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const quizId = searchParams.get("id");

  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [timeRemaining, setTimeRemaining] = useState<number>(0);
  const [initialTime, setInitialTime] = useState<number>(0);
  const [isTimeUp, setIsTimeUp] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [selectedQuestions, setSelectedQuestions] = useState<Record<number, any>>({});
  const [choiceMapping, setChoiceMapping] = useState<Record<number, Record<number, number>>>({});

  const shuffleChoices = (choices: any[]): { shuffled: any[], mapping: Record<number, number> } => {
    const indices = choices.map((_, i) => i);
    const mapping: Record<number, number> = {};
    const shuffled = [];

    for (let i = indices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [indices[i], indices[j]] = [indices[j], indices[i]];
    }

    indices.forEach((originalIndex, newIndex) => {
      mapping[newIndex] = originalIndex;
      shuffled.push(choices[originalIndex]);
    });

    return { shuffled, mapping };
  };

  const selectRandomQuestions = (allQuestions: Record<number, any>): { selected: Record<number, any>, mapping: Record<number, Record<number, number>> } => {
    const questionArray = Object.entries(allQuestions).map(([num, q]) => ({ num: parseInt(num), ...q }));
    let selectedQs: typeof questionArray;

    if (questionArray.length > 10) {
      const shuffled = [...questionArray].sort(() => Math.random() - 0.5);
      selectedQs = shuffled.slice(0, 10);
    } else {
      selectedQs = questionArray;
    }

    const selected: Record<number, any> = {};
    const choicesMap: Record<number, Record<number, number>> = {};

    selectedQs.forEach((q, index) => {
      const { shuffled, mapping } = shuffleChoices(q.choices);
      const { num, ...questionWithoutNum } = q;
      selected[index + 1] = { ...questionWithoutNum, choices: shuffled };
      choicesMap[index + 1] = mapping;
    });

    return { selected, mapping: choicesMap };
  };

  useEffect(() => {
    if (!quizId) return;

    const stored = localStorage.getItem("quizzes");
    if (stored) {
      const quizzesObj = JSON.parse(stored) as Record<string, QuizData>;
      const quizData = quizzesObj[quizId];
      if (quizData) {
        const { selected, mapping } = selectRandomQuestions(quizData.questions);
        setSelectedQuestions(selected);
        setChoiceMapping(mapping);
        setQuiz(quizData);
        const timeInSeconds = (parseInt(quizData.timeLimit) || 60) * 60;
        setTimeRemaining(timeInSeconds);
        setInitialTime(timeInSeconds);
      }
    }
  }, [quizId]);

  useEffect(() => {
    if (!quiz || isSubmitted) return;

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          setIsTimeUp(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [quiz, isSubmitted]);

  const loadMediaFile = (quizId: string, mediaId: string): string | undefined => {
    try {
      const mediaKey = `quiz-media-${quizId}-${mediaId}`;
      return localStorage.getItem(mediaKey) || undefined;
    } catch (err) {
      return undefined;
    }
  };

  if (!quiz || Object.keys(selectedQuestions).length === 0) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <p className="text-muted-foreground">กำลังโหลด...</p>
        </div>
      </Layout>
    );
  }

  const questions = Object.entries(selectedQuestions)
    .map(([num, q]) => ({ num: parseInt(num), ...q }))
    .sort((a, b) => a.num - b.num);

  const currentQ = questions.find(q => q.num === currentQuestion);
  const totalQuestions = questions.length;

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSelectAnswer = (choiceIndex: number) => {
    if (!isSubmitted) {
      setAnswers(prev => ({ ...prev, [currentQuestion]: choiceIndex }));
    }
  };

  const calculateScore = () => {
    let correct = 0;
    for (const [qNum, answerIndex] of Object.entries(answers)) {
      const qNumInt = parseInt(qNum);
      const mapping = choiceMapping[qNumInt];
      if (mapping) {
        const originalAnswerIndex = mapping[answerIndex];
        if (originalAnswerIndex === 0) {
          correct++;
        }
      }
    }
    return correct;
  };

  const handleSubmit = () => {
    if (!window.confirm("คุณแน่ใจที่ต้องการส่งแบบทดสอบ? ไม่สามารถแก้ไขได้หลังจากส่ง")) {
      return;
    }

    const score = calculateScore();
    const timeSpent = initialTime - timeRemaining;

    const scoreData = {
      quizId: quizId,
      quizTitle: quiz!.title,
      score: score,
      totalQuestions: totalQuestions,
      timeSpent: timeSpent,
      completedAt: new Date().toISOString(),
    };

    localStorage.setItem(`quiz-score-${quizId}`, JSON.stringify(scoreData));

    // Add completion status to quizzes
    const stored = localStorage.getItem("quizzes");
    if (stored) {
      const quizzesObj = JSON.parse(stored) as Record<string, any>;
      if (quizzesObj[quizId!]) {
        quizzesObj[quizId!].completed = true;
        quizzesObj[quizId!].score = score;
        quizzesObj[quizId!].totalQuestions = totalQuestions;
        localStorage.setItem("quizzes", JSON.stringify(quizzesObj));
      }
    }

    navigate(`/quiz/result?quizId=${quizId}`);
  };


  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{quiz.title}</h1>
              <p className="text-muted-foreground mt-1">คำถาม {currentQuestion}/{totalQuestions}</p>
            </div>
            <div className={`text-right ${isTimeUp ? "text-red-600" : timeRemaining < 300 ? "text-orange-600" : "text-foreground"}`}>
              <p className="text-sm text-muted-foreground">เวลาคงเหลือ</p>
              <p className="text-3xl font-bold font-mono">{formatTime(timeRemaining)}</p>
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setCurrentQuestion(Math.max(1, currentQuestion - 1))}
              disabled={currentQuestion === 1}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
              ก่อนหน้า
            </button>

            <div className="flex-1 flex flex-wrap gap-2">
              {questions.map(q => (
                <button
                  key={q.num}
                  onClick={() => setCurrentQuestion(q.num)}
                  className={`w-10 h-10 rounded-full font-semibold text-sm transition-colors ${
                    currentQuestion === q.num
                      ? "bg-brand-red text-white"
                      : answers[q.num] !== undefined
                      ? "bg-green-100 text-green-700"
                      : "bg-muted text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {q.num}
                </button>
              ))}
            </div>

            <button
              onClick={() => setCurrentQuestion(Math.min(totalQuestions, currentQuestion + 1))}
              disabled={currentQuestion === totalQuestions}
              className="flex items-center gap-2 px-4 py-2 border border-border rounded-full text-muted-foreground hover:bg-muted disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              ถัดไป
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Question */}
        {currentQ && (
          <div className="bg-card border border-border rounded-2xl p-6 space-y-6">
            {/* Question Text */}
            <div>
              <h2 className="text-lg font-semibold text-foreground">คำถาม</h2>
              <p className="text-muted-foreground mt-3">{currentQ.text}</p>
            </div>

            {/* Question Image */}
            {currentQ.imageId && (
              <div>
                <img
                  src={loadMediaFile(quiz.id, currentQ.imageId)}
                  alt="Question"
                  className="max-h-64 rounded-lg object-contain"
                />
              </div>
            )}

            {/* Question Audio */}
            {currentQ.audioId && (
              <div>
                <audio controls className="w-full max-w-xs">
                  <source src={loadMediaFile(quiz.id, currentQ.audioId)} />
                </audio>
              </div>
            )}

            {/* Choices */}
            <div className="space-y-3">
              <p className="text-sm font-medium text-foreground">ตัวเลือกคำตอบ</p>
              {currentQ.choices.map((choice: any, index: number) => {
                const label = String.fromCharCode(65 + index);
                const isSelected = answers[currentQuestion] === index;

                return (
                  <button
                    key={index}
                    onClick={() => handleSelectAnswer(index)}
                    className={`w-full text-left p-4 border rounded-lg transition-all ${
                      isSelected
                        ? "border-brand-red bg-red-50"
                        : "border-border hover:border-foreground/40"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold text-sm ${
                          isSelected ? "bg-brand-red text-white" : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {label}
                      </div>
                      <div className="flex-1">
                        <p className="text-foreground">{choice.text}</p>
                        {choice.imageId && (
                          <img
                            src={loadMediaFile(quiz.id, choice.imageId)}
                            alt={label}
                            className="max-h-32 mt-2 rounded-lg object-contain"
                          />
                        )}
                        {choice.audioId && (
                          <audio controls className="mt-2 max-w-xs">
                            <source src={loadMediaFile(quiz.id, choice.audioId)} />
                          </audio>
                        )}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Bottom Actions */}
        <div className="bg-card border border-border rounded-2xl p-6">
          <div className="flex gap-3">
            <button
              onClick={() => navigate("/quiz/student")}
              className="px-6 py-3 border border-border rounded-full text-muted-foreground hover:bg-muted font-medium transition-colors"
            >
              ออก
            </button>
            <button
              onClick={handleSubmit}
              className="flex-1 bg-brand-red hover:bg-red-700 text-white px-6 py-3 rounded-full font-medium transition-colors"
            >
              ส่งแบบทดสอบ
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
