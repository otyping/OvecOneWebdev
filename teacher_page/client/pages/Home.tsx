import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  LayoutDashboard,
  LayoutGrid,
  Plus,
} from "lucide-react";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Reveal } from "@/components/motion/Reveal";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CountUp } from "@/components/motion/CountUp";
import { useT } from "@/i18n/useT";
import { BRAND } from "@/config/brand";
import { getSavedLessons } from "@/utils/lessonStorage";
import { getMajors } from "@/data/vocationalSubjects";
import { cn } from "@/lib/utils";

export default function Home() {
  const t = useT();
  const navigate = useNavigate();
  const userName = localStorage.getItem("userName") || "คุณครู";
  const lessons = getSavedLessons();
  const recent = [...lessons].sort((a, b) => b.createdAt - a.createdAt).slice(0, 4);

  const actions = [
    {
      key: "create",
      to: "/dashboard/create-lesson-plan",
      icon: Plus,
      titleKey: "home.create" as const,
      descKey: "home.createDesc" as const,
      accent: "bg-primary text-primary-foreground",
    },
    {
      key: "lessons",
      to: "/dashboard/lesson-plan",
      icon: FileText,
      titleKey: "home.myLessons" as const,
      descKey: "home.myLessonsDesc" as const,
      accent: "bg-secondary text-secondary-foreground",
    },
    {
      key: "dashboard",
      to: "/dashboard",
      icon: LayoutDashboard,
      titleKey: "home.dashboard" as const,
      descKey: "home.dashboardDesc" as const,
      accent: "bg-muted text-foreground",
    },
    {
      key: "quiz",
      href: BRAND.quizAppUrl,
      icon: LayoutGrid,
      titleKey: "home.openQuiz" as const,
      descKey: "home.openQuizDesc" as const,
      accent: "bg-foreground text-background",
    },
  ];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Greeting */}
        <Reveal onView={false}>
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-primary">
            {BRAND.appName}
          </p>
          <h1 className="mt-1 text-3xl font-bold text-foreground md:text-4xl">
            {t("home.greeting")}, {userName} 👋
          </h1>
          <p className="mt-2 text-muted-foreground">{t("home.subtitle")}</p>
        </Reveal>

        {/* Stats */}
        <Stagger className="grid grid-cols-2 gap-4 sm:max-w-md" onView={false}>
          <StaggerItem>
            <Card variant="glass" className="p-5">
              <div className="text-3xl font-bold text-foreground">
                <CountUp to={lessons.length} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("home.statLessons")}
              </div>
            </Card>
          </StaggerItem>
          <StaggerItem>
            <Card variant="glass" className="p-5">
              <div className="text-3xl font-bold text-foreground">
                <CountUp to={getMajors().length} />
              </div>
              <div className="mt-1 text-sm text-muted-foreground">
                {t("home.statMajors")}
              </div>
            </Card>
          </StaggerItem>
        </Stagger>

        {/* Quick actions */}
        <Stagger className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {actions.map((a) => {
            const inner = (
              <Card
                variant="glass"
                className="group flex h-full cursor-pointer flex-col gap-4 p-6"
              >
                <span
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-2xl shadow-soft",
                    a.accent,
                  )}
                >
                  <a.icon className="h-6 w-6" />
                </span>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">
                    {t(a.titleKey)}
                  </h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {t(a.descKey)}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 text-sm font-medium text-primary">
                  {t("home.viewAll")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1 motion-reduce:transform-none" />
                </span>
              </Card>
            );
            return (
              <StaggerItem key={a.key}>
                {a.href ? (
                  <a href={a.href} className="block h-full">
                    {inner}
                  </a>
                ) : (
                  <Link to={a.to!} className="block h-full">
                    {inner}
                  </Link>
                )}
              </StaggerItem>
            );
          })}
        </Stagger>

        {/* Recent lessons */}
        <Reveal className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-foreground">{t("home.recent")}</h2>
            <Link
              to="/dashboard/lesson-plan"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
            >
              {t("home.viewAll")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {recent.length === 0 ? (
            <Card className="p-8 text-center text-muted-foreground">
              {t("home.recentEmpty")}
            </Card>
          ) : (
            <Stagger className="grid gap-3 sm:grid-cols-2">
              {recent.map((lesson) => (
                <StaggerItem key={lesson.id}>
                  <Card
                    variant="glass"
                    className="cursor-pointer p-4"
                    onClick={() =>
                      navigate(
                        `/dashboard/create-lesson-plan/saved/${lesson.id}`,
                      )
                    }
                  >
                    <h3 className="font-semibold text-foreground">
                      {lesson.planName}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {lesson.subject ? `${lesson.subject} • ` : ""}
                      {lesson.createdAtDisplay}
                    </p>
                  </Card>
                </StaggerItem>
              ))}
            </Stagger>
          )}
        </Reveal>
      </div>
    </DashboardLayout>
  );
}
