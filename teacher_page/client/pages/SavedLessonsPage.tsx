import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Trash2 } from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { getSavedLessons, deleteLessonFromStorage, type SavedLesson } from "@/utils/lessonStorage";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { Marquee } from "@/components/motion/Marquee";
import { useT } from "@/i18n/useT";
import { getMajors } from "@/data/vocationalSubjects";

export default function SavedLessonsPage() {
  const navigate = useNavigate();
  const t = useT();
  const majors = getMajors();
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
          <h1 className="text-3xl font-bold text-foreground">{t("saved.title")}</h1>
          <p className="text-muted-foreground">{t("saved.subtitle")}</p>
        </div>

        {/* แถบวิชา (marquee showcase) */}
        <Marquee className="rounded-2xl border border-border bg-card/60 py-3" pauseOnHover>
          {majors.map((m) => (
            <span
              key={m}
              className="inline-flex items-center gap-2 px-1 text-sm font-medium text-muted-foreground"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-secondary" />
              {m}
            </span>
          ))}
        </Marquee>

        <div className="glass rounded-2xl p-6 space-y-4">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder={t("saved.searchPlaceholder")}
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
              <option value="">{t("saved.allSubjects")}</option>
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
              <option value="date-desc">{t("saved.sortNewest")}</option>
              <option value="date-asc">{t("saved.sortOldest")}</option>
            </select>

            <Button
              onClick={() => navigate("/dashboard/create-lesson-plan")}
              className="rounded-full"
            >
              {t("saved.create")}
            </Button>
          </div>
        </div>

        {filteredAndSortedLessons.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-border bg-muted/10 py-16 text-center">
            <p className="text-lg font-medium text-foreground">{t("saved.empty")}</p>
            <p className="mt-2 text-sm text-muted-foreground">{t("saved.emptyHint")}</p>
            <Button
              onClick={() => navigate("/dashboard/create-lesson-plan")}
              className="mt-4 rounded-full"
            >
              {t("saved.create")}
            </Button>
          </div>
        ) : (
          <Stagger className="space-y-3">
            {filteredAndSortedLessons.map((lesson) => (
              <StaggerItem
                key={lesson.id}
                className="glass flex flex-col gap-3 rounded-2xl p-4 hover-lift sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex-1 space-y-1 cursor-pointer" onClick={() => handleView(lesson.id)}>
                  <h3 className="font-semibold text-foreground">{lesson.planName}</h3>
                  <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
                    {lesson.subject && <span>{t("saved.subjectLabel")}: {lesson.subject}</span>}
                    {lesson.grade && <span>ชั้น: {lesson.grade}</span>}
                    <span>{t("saved.createdLabel")}: {lesson.createdAtDisplay}</span>
                  </div>
                </div>

                <div className="flex gap-2 sm:flex-shrink-0">
                  <Button
                    onClick={() => handleView(lesson.id)}
                    variant="outline"
                    className="rounded-full"
                  >
                    {t("action.view")}
                  </Button>
                  <Button
                    onClick={() => handleDelete(lesson.id)}
                    variant="outline"
                    className="rounded-full border-red-500/30 text-red-600 hover:bg-red-50 hover:border-red-500"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        )}
      </div>
    </DashboardLayout>
  );
}
