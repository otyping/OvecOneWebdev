import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { getSavedLessons, deleteLessonFromStorage, type SavedLesson } from "@/utils/lessonStorage";

export default function SavedLessonsPage() {
  const navigate = useNavigate();
  const [lessons, setLessons] = useState<SavedLesson[]>(getSavedLessons());
  const [searchQuery, setSearchQuery] = useState("");
  const [filterSubject, setFilterSubject] = useState("");
  const [sortBy, setSortBy] = useState<"date-desc" | "date-asc" | "name">("date-desc");

  const subjects = useMemo(() => {
    return Array.from(new Set(lessons.map((l) => l.subject).filter(Boolean)));
  }, [lessons]);

  const filteredAndSortedLessons = useMemo(() => {
    let filtered = lessons;

    if (searchQuery) {
      filtered = filtered.filter((lesson) =>
        lesson.planName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (filterSubject) {
      filtered = filtered.filter((lesson) => lesson.subject === filterSubject);
    }

    filtered.sort((a, b) => {
      if (sortBy === "date-desc") return b.createdAt - a.createdAt;
      if (sortBy === "date-asc") return a.createdAt - b.createdAt;
      return a.planName.localeCompare(b.planName, "th-TH");
    });

    return filtered;
  }, [lessons, searchQuery, filterSubject, sortBy]);

  const handleDelete = (lessonId: string) => {
    if (confirm("ต้องการลบชุดกิจกรรมนี้หรือไม่?")) {
      deleteLessonFromStorage(lessonId);
      setLessons(getSavedLessons());
    }
  };

  const handleView = (lessonId: string) => {
    navigate(`/dashboard/create-lesson-plan/saved/${lessonId}`);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold text-foreground">ชุดกิจกรรมที่บันทึก</h1>
          <p className="text-muted-foreground">ดูและจัดการชุดกิจกรรมที่คุณสร้างไว้</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="ค้นหาชุดกิจกรรม..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-full border border-border bg-background pl-10 pr-4 py-2.5 text-sm placeholder-muted-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <select
              value={filterSubject}
              onChange={(e) => setFilterSubject(e.target.value)}
              className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="">ทุกวิชา</option>
              {subjects.map((subject) => (
                <option key={subject} value={subject}>
                  {subject}
                </option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
            >
              <option value="date-desc">เรียงจากวันที่สร้างล่าสุด</option>
              <option value="date-asc">เรียงจากวันที่สร้างเก่าที่สุด</option>
            </select>

            <Button
              onClick={() => navigate("/dashboard/create-lesson-plan")}
              className="rounded-full"
            >
              สร้างชุดกิจกรรมใหม่
            </Button>
          </div>
        </div>

        {filteredAndSortedLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/10 py-16 text-center">
            <p className="text-lg font-medium text-foreground">ยังไม่มีแผนการสอนที่บันทึกไว้</p>
            <p className="mt-2 text-sm text-muted-foreground">เริ่มต้นโดยสร้างแผนการสอนใหม่</p>
            <Button
              onClick={() => navigate("/dashboard/create-lesson-plan")}
              className="mt-4 rounded-full"
            >
              สร้างชุดกิจกรรมใหม่
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredAndSortedLessons.map((lesson) => (
              <div
                key={lesson.id}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-1 cursor-pointer" onClick={() => handleView(lesson.id)}>
                  <h3 className="font-semibold text-foreground">{lesson.planName}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {lesson.subject && <span>วิชา: {lesson.subject}</span>}
                    {lesson.grade && <span>ชั้น: {lesson.grade}</span>}
                    <span>สร้าง: {lesson.createdAtDisplay}</span>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-shrink-0">
                  <Button
                    onClick={() => handleView(lesson.id)}
                    variant="outline"
                    className="rounded-full"
                  >
                    ดูข้อมูล
                  </Button>
                  <Button
                    onClick={() => handleDelete(lesson.id)}
                    variant="outline"
                    className="rounded-full border-red-500/30 text-red-600 hover:bg-red-50 hover:border-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
