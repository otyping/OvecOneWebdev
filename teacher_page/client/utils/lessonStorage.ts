export type SavedLesson = {
  id: string;
  planName: string;
  major: string;
  subject: string;
  unit?: string;
  topic?: string;
  createdAt: number;
  createdAtDisplay: string;
  content: {
    video?: string;
    slidesLesson?: string;
    slidesActivity?: string;
    lessonPlan?: string;
    quiz?: string;
    song?: string;
    game?: string;
    lessonContent?: string;
  };
};

const LESSONS_STORAGE_KEY = "saved_lessons";

export function getSavedLessons(): SavedLesson[] {
  try {
    const stored = localStorage.getItem(LESSONS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function saveLessonToStorage(lesson: SavedLesson): void {
  try {
    const lessons = getSavedLessons();
    const existingIndex = lessons.findIndex((l) => l.id === lesson.id);

    if (existingIndex >= 0) {
      lessons[existingIndex] = lesson;
    } else {
      lessons.push(lesson);
    }

    localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(lessons));
  } catch (error) {
    console.error("Failed to save lesson:", error);
  }
}

export function deleteLessonFromStorage(lessonId: string): void {
  try {
    const lessons = getSavedLessons();
    const filtered = lessons.filter((l) => l.id !== lessonId);
    localStorage.setItem(LESSONS_STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Failed to delete lesson:", error);
  }
}

export function getLessonById(lessonId: string): SavedLesson | null {
  try {
    const lessons = getSavedLessons();
    return lessons.find((l) => l.id === lessonId) || null;
  } catch {
    return null;
  }
}

export function createLessonId(): string {
  return `lesson_${Date.now()}`;
}

export function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("th-TH", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
