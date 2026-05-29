import Layout from "@/components/Layout";
import { Link } from "react-router-dom";
import { Plus, Search } from "lucide-react";

export default function Index() {
  const recentQuizzes = [
    {
      id: 1,
      title: "Chapter 1: Basic Mathematics",
      date: "2025-01-10 13:20",
      questions: 15,
    },
    {
      id: 2,
      title: "Chapter 2: Advanced Mathematics",
      date: "2025-01-08 10:30",
      questions: 20,
    },
    {
      id: 3,
      title: "English Grammar Quiz",
      date: "2025-01-05 14:45",
      questions: 25,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl font-bold text-foreground">
            Quiz Management System
          </h1>
          <p className="text-muted-foreground">
            Create, manage, and track student quizzes efficiently
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link
            to="/quiz/create"
            className="bg-brand-red hover:bg-red-700 text-white rounded-lg p-6 transition-colors shadow-md"
          >
            <Plus className="w-6 h-6 mb-3" />
            <h3 className="font-semibold text-lg">Create New Quiz</h3>
            <p className="text-sm text-red-100 mt-2">
              Build a new quiz with multiple choice questions
            </p>
          </Link>

          <Link
            to="/quiz/student"
            className="bg-deep-gray hover:bg-gray-800 text-white rounded-lg p-6 transition-colors shadow-md"
          >
            <BookOpen className="w-6 h-6 mb-3" />
            <h3 className="font-semibold text-lg">Take Quiz</h3>
            <p className="text-sm text-gray-300 mt-2">
              Students can complete assigned quizzes
            </p>
          </Link>

          <Link
            to="/quiz/offline"
            className="bg-gray-800 hover:bg-gray-900 text-white rounded-lg p-6 transition-colors shadow-md"
          >
            <QRIcon className="w-6 h-6 mb-3" />
            <h3 className="font-semibold text-lg">Offline Quiz</h3>
            <p className="text-sm text-gray-300 mt-2">
              Generate QR codes and paper quizzes
            </p>
          </Link>

          <Link
            to="/check-score"
            className="bg-gray-700 hover:bg-gray-800 text-white rounded-lg p-6 transition-colors shadow-md"
          >
            <Check className="w-6 h-6 mb-3" />
            <h3 className="font-semibold text-lg">Check Scores</h3>
            <p className="text-sm text-gray-300 mt-2">
              Scan and grade paper quizzes automatically
            </p>
          </Link>
        </div>

        {/* Recent Quizzes */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-foreground">Recent Quizzes</h2>
            <div className="relative">
              <input
                type="text"
                placeholder="Search quizzes..."
                className="bg-muted text-foreground placeholder:text-muted-foreground rounded-lg pl-4 pr-10 py-2 focus:outline-none focus:ring-2 focus:ring-brand-red"
              />
              <Search className="absolute right-3 top-2.5 w-5 h-5 text-muted-foreground" />
            </div>
          </div>

          <div className="space-y-3">
            {recentQuizzes.map((quiz) => (
              <div
                key={quiz.id}
                className="bg-card border border-border rounded-lg p-4 flex items-center justify-between hover:shadow-md transition-shadow"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{quiz.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {quiz.questions} questions • {quiz.date}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button className="text-brand-red hover:text-red-700 transition-colors font-medium">
                    Edit
                  </button>
                  <button className="text-red-500 hover:text-red-700 transition-colors">
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium">Total Quizzes</p>
            <p className="text-3xl font-bold text-foreground mt-2">12</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium">Active Students</p>
            <p className="text-3xl font-bold text-foreground mt-2">48</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-6">
            <p className="text-muted-foreground text-sm font-medium">Avg. Score</p>
            <p className="text-3xl font-bold text-foreground mt-2">78%</p>
          </div>
        </div>
      </div>
    </Layout>
  );
}

// Icon components
function BookOpen(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

function QRIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <rect x="3" y="3" width="7" height="7" />
      <rect x="14" y="3" width="7" height="7" />
      <rect x="14" y="14" width="7" height="7" />
      <rect x="3" y="14" width="7" height="7" />
      <circle cx="8" cy="8" r="1" />
      <circle cx="19" cy="8" r="1" />
      <circle cx="19" cy="19" r="1" />
      <circle cx="8" cy="19" r="1" />
    </svg>
  );
}

function Check(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

function Trash(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
