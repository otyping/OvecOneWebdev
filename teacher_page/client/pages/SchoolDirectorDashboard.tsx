import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Building2, GraduationCap, Mars, Search, TrendingUp, Users, Venus } from "lucide-react";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";
import * as XLSX from "xlsx";

import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/DashboardLayout";
import { getMajors, getSubjects, getUnits } from "@/data/vocationalSubjects";
import type { MajorKey, SubjectKey } from "@/data/vocationalSubjects";

const majorNames: Record<string, string> = {
  "ช่างไฟฟ้า": "ช่างไฟฟ้า",
  "อิเล็กทรอนิกส์": "อิเล็กทรอนิกส์",
  "การสื่อสารโทรคมนาคม": "การสื่อสารโทรคมนาคม",
  "เมคคาทรอนิกส์และหุ่นยนต์": "เมคคาทรอนิกส์และหุ่นยนต์",
};

const schoolComparisonWorkbookUrl =
  "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Fb406392b72cc4c0f83910b84f50c1efc?alt=media&token=7d43d8df-1d36-4242-8d40-62191dc62f8e&apiKey=a061ccedc21643e89c15d64ceb68a9d5";

const schoolName = "วิทยาลัยเทคนิคเชียงใหม่";

const gradeOptions = [
  "ประถมศึกษาปีที่ 1",
  "ประถมศึกษาปีที่ 2",
  "ประถมศึกษาปีที่ 3",
  "ประถมศึกษาปีที่ 4",
  "ประถมศึกษาปีที่ 5",
  "ประถมศึกษาปีที่ 6",
];

const subjectOptions = [
  "ทุกสาระการเรียนรู้",
  "คณิตศาสตร์",
  "วิทยาศาสตร์และเทคโนโลยี",
  "ภาษาอังกฤษ",
];

type SubjectKey = "math" | "foreign" | "thai" | "social" | "science";

type SubjectScore = {
  key: SubjectKey;
  label: string;
  value: number;
  colorClass: string;
  shadowClass: string;
};

type GroupSeries = {
  key: SubjectKey;
  label: string;
  colorClass: string;
  textColorClass: string;
};

type SchoolScore = {
  school: string;
  score: number;
  isCurrent: boolean;
};

const numberFormatter = new Intl.NumberFormat("th-TH", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const subjectScores: SubjectScore[] = [
  { key: "math", label: "วงจรไฟฟ้ากระแสตรง", value: 7.4, colorClass: "from-[#FF8C42] to-[#ffb26b]", shadowClass: "shadow-[#FF8C42]/25" },
  { key: "foreign", label: "วงจรไฟฟ้ากระแสสลับ", value: 7.1, colorClass: "from-[#5478FF] to-[#94adff]", shadowClass: "shadow-[#5478FF]/25" },
  { key: "science", label: "เครื่องวัดไฟฟ้า", value: 8.0, colorClass: "from-[#2ECC71] to-[#86e2a9]", shadowClass: "shadow-[#2ECC71]/25" },
  { key: "social", label: "การติดตั้งไฟฟ้าในอาคาร", value: 7.8, colorClass: "from-[#EC4899] to-[#f97bb4]", shadowClass: "shadow-[#EC4899]/25" },
  { key: "thai", label: "เครื่องกลไฟฟ้ากระแสตรง", value: 6.9, colorClass: "from-[#F59E0B] to-[#fbbf24]", shadowClass: "shadow-[#F59E0B]/25" },
] as SubjectScore[];

const electricalSubjects = [
  { label: "วงจรไฟฟ้ากระแสตรง", value: 7.4, colorClass: "from-[#FF8C42] to-[#ffb26b]", shadowClass: "shadow-[#FF8C42]/25" },
  { label: "วงจรไฟฟ้ากระแสสลับ", value: 7.1, colorClass: "from-[#5478FF] to-[#94adff]", shadowClass: "shadow-[#5478FF]/25" },
  { label: "เครื่องวัดไฟฟ้า", value: 8.0, colorClass: "from-[#2ECC71] to-[#86e2a9]", shadowClass: "shadow-[#2ECC71]/25" },
  { label: "การติดตั้งไฟฟ้าในอาคาร", value: 7.8, colorClass: "from-[#EC4899] to-[#f97bb4]", shadowClass: "shadow-[#EC4899]/25" },
  { label: "เครื่องกลไฟฟ้ากระแสตรง", value: 6.9, colorClass: "from-[#F59E0B] to-[#fbbf24]", shadowClass: "shadow-[#F59E0B]/25" },
  { label: "เครื่องทําความเย็น", value: 6.5, colorClass: "from-[#8B5CF6] to-[#d8b4fe]", shadowClass: "shadow-[#8B5CF6]/25" },
  { label: "มอเตอร์ไฟฟ้ากระแสสลับ", value: 7.3, colorClass: "from-[#06B6D4] to-[#67e8f9]", shadowClass: "shadow-[#06B6D4]/25" },
  { label: "การควบคุมมอเตอร์ไฟฟ้า", value: 7.0, colorClass: "from-[#EF4444] to-[#f87171]", shadowClass: "shadow-[#EF4444]/25" },
  { label: "การประมาณการติดตั้งไฟฟ้า", value: 8.2, colorClass: "from-[#14B8A6] to-[#5eead4]", shadowClass: "shadow-[#14B8A6]/25" },
  { label: "การโปรแกรมและควบคุมไฟฟ้า", value: 3.0, colorClass: "from-[#F97316] to-[#fdba74]", shadowClass: "shadow-[#F97316]/25" },
  { label: "การติดตั้งไฟฟ้านอกอาคาร", value: 6.8, colorClass: "from-[#6366F1] to-[#a5b4fc]", shadowClass: "shadow-[#6366F1]/25" },
  { label: "หม้อแปลงไฟฟ้า", value: 7.6, colorClass: "from-[#D946EF] to-[#f0abfc]", shadowClass: "shadow-[#D946EF]/25" },
  { label: "เครื่องกําเนิดไฟฟ้ากระแสสลับ", value: 6.7, colorClass: "from-[#0EA5E9] to-[#7dd3fc]", shadowClass: "shadow-[#0EA5E9]/25" },
  { label: "เครื่องปรับอากาศ", value: 7.5, colorClass: "from-[#10B981] to-[#6ee7b7]", shadowClass: "shadow-[#10B981]/25" },
];

const groupSeries: GroupSeries[] = [
  { key: "math", label: "คณิตศาสตร์", colorClass: "bg-[#FF8C42]", textColorClass: "text-foreground" },
  { key: "foreign", label: "ภาษาต่างประเทศ", colorClass: "bg-[#5478FF]", textColorClass: "text-foreground" },
  { key: "science", label: "วิทยาศาสตร์และเทคโนโลยี", colorClass: "bg-[#2ECC71]", textColorClass: "text-foreground" },
];

const majorScores = [
  { label: "ช่างไฟฟ้า", value: 7.1, color: "#FF8C42" },
  { label: "อิเล็กทรอนิกส์", value: 7.6, color: "#5478FF" },
  { label: "เมคคาทรอนิกส์และหุ่นยนต์", value: 7.9, color: "#EC4899" },
];

const provinceColleges = [
  { school: "วิทยาลัยอาชีวศึกษาเชียงใหม่", score: 7.8, isCurrent: false },
  { school: "วิทยาลัยเทคนิคเชียงใหม่", score: 7.5, isCurrent: true },
  { school: "วิทยาลัยเทคนิคสันกำแพง", score: 7.2, isCurrent: false },
  { school: "วิทยาลัยเทคนิคสารภี", score: 7.0, isCurrent: false },
  { school: "วิทยาลัยสารพัดช่างเชียงใหม่", score: 6.9, isCurrent: false },
  { school: "วิทยาลัยเกษตรและเทคโนโลยีเชียงใหม่", score: 6.8, isCurrent: false },
  { school: "วิทยาลัยการอาชีพจอมทอง", score: 6.6, isCurrent: false },
  { school: "วิทยาลัยการอาชีพฝาง", score: 6.4, isCurrent: false },
];

const loadSchoolComparisonData = async (): Promise<SchoolScore[]> => {
  try {
    const response = await fetch(schoolComparisonWorkbookUrl);
    if (!response.ok) {
      console.error("Failed to load workbook");
      return [];
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const schools: SchoolScore[] = [];

    // Get the first sheet
    workbook.SheetNames.forEach((sheetName) => {
      const sheet = workbook.Sheets[sheetName];
      if (!sheet) return;

      const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
        defval: "",
        raw: false,
      });

      rows.forEach((row) => {
        // Try different possible column names for school name
        let schoolName = String(row["ชื่อวิทยาลัย"] ?? "").trim();
        if (!schoolName) {
          schoolName = String(row["ชื่อ"] ?? "").trim();
        }

        // Try different possible column names for score
        let scoreValue = String(row["คะแนน"] ?? "").trim();
        if (!scoreValue) {
          scoreValue = String(row["score"] ?? "").trim();
        }
        if (!scoreValue) {
          scoreValue = String(row["Score"] ?? "").trim();
        }

        const score = parseFloat(scoreValue);

        if (schoolName && !isNaN(score)) {
          schools.push({
            school: schoolName,
            score: score,
            isCurrent: schoolName === "วิทยาลัยเสนานุเคราะห์",
          });
        }
      });
    });

    // Override scores for specific schools
    const processedSchools = schools.map((school) => {
      if (school.school === "วิทยาลัยเสนานุเคราะห์") {
        return { ...school, score: 7.6 };
      }
      if (school.school === "วิทยาลัยบ้านบึงทับช้าง") {
        return { ...school, score: 4.6 };
      }
      return school;
    });

    const sorted = processedSchools.sort((a, b) => b.score - a.score);
    console.log(`✓ Loaded ${sorted.length} schools from Excel file`);
    if (sorted.length > 0) {
      console.log("Schools loaded:", sorted);
    } else {
      console.warn("⚠ No schools found in Excel file. Check column names: 'ชื่อโรงเรียน' and 'คะแนน'");
    }
    return sorted;
  } catch (error) {
    console.error("✗ Error loading school comparison data:", error);
    return [];
  }
};

const classRows = [
  { className: "ป.2/1", math: 8, foreign: 8.6, thai: 7.5, social: 6.4, science: 8.8 },
  { className: "ป.2/2", math: 9.5, foreign: 9, thai: 7, social: 8, science: 8.1 },
  { className: "ป.2/3", math: 7, foreign: 9.8, thai: 9, social: 4, science: 3.5 },
  { className: "ป.2/4", math: 8, foreign: 8.7, thai: 6.2, social: 7.1, science: 9.3 },
  { className: "ป.2/5", math: 2, foreign: 9.2, thai: 8.4, social: 8.3, science: 8.6 },
];

const getSubjectKey = (subjectLabel: string): SubjectKey | null => {
  switch (subjectLabel) {
    case "คณิตศาสตร์":
      return "math";
    case "ภาษาอังกฤษ":
    case "ภาษาต่างประเทศ":
      return "foreign";
    case "ภาษาไทย":
      return "thai";
    case "สังคมศึกษา ศาสนาและวัฒนธรรม":
      return "social";
    case "วิทยาศาสตร์และเทคโนโลยี":
      return "science";
    default:
      return null;
  }
};

const getShortSubjectLabel = (subjectLabel: string) => {
  switch (subjectLabel) {
    case "คณิตศาสตร์":
      return "คณิตศาสตร์";
    case "ภาษาอังกฤษ":
    case "ภาษาต่างประเทศ":
      return "ภาษาต่างประเทศ";
    case "ภาษาไทย":
      return "ภาษาไทย";
    case "สังคมศึกษา ศาสนาและวัฒนธรรม":
      return "สังคมศึกษา ศาสนาและวัฒนธรรม";
    case "วิทยาศาสตร์และเทคโนโลยี":
      return "วิทยาศาสตร์และเทคโนโลยี";
    default:
      return subjectLabel;
  }
};

function StatCard({
  title,
  value,
  description,
  icon,
  className,
  delay,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
  className: string;
  delay: number;
}) {
  return (
    <div
      className={`rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both] ${className}`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-4 flex items-start gap-4">
        <div className="rounded-2xl bg-background/80 p-3 text-primary shadow-sm">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">{value}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
      >
        {options.map((option) => {
          return (
            <option key={option} value={option}>
              {option}
            </option>
          );
        })}
      </select>
    </label>
  );
}

function SectionCard({
  title,
  subtitle,
  icon,
  children,
  delay,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
  delay: number;
}) {
  return (
    <div
      className="rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="mb-5 flex items-center justify-start gap-4">
        <div className="rounded-2xl bg-accent/20 p-3 text-secondary shadow-sm">{icon}</div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
        </div>
      </div>
      {children}
    </div>
  );
}

function SubjectChart({
  visibleSubjectBars,
  isAllSubjects,
}: {
  visibleSubjectBars: SubjectScore[];
  isAllSubjects: boolean;
}) {
  // Convert bar data to colors for distributed bars
  const colors = visibleSubjectBars.map((bar) => {
    const hexColor = bar.colorClass.match(/from-\[([#\w]+)\]/)?.[1] || "#78716C";
    return hexColor;
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Kanit, sans-serif",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: isAllSubjects ? "60%" : "40%",
        borderRadius: 6,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Kanit, sans-serif",
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const bar = visibleSubjectBars[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return (
          '<div class="rounded-2xl bg-[#111FA2] px-3 py-2 text-sm font-medium text-white shadow-xl">' +
          `<div>วิชา${bar?.label}</div>` +
          `<div>มีผลคะแนนเฉลี่ย ${numberFormatter.format(value)} คะแนน</div>` +
          "</div>"
        );
      },
    },
    xaxis: {
      categories: visibleSubjectBars.map((bar) => bar.label),
      axisBorder: {
        show: true,
        color: "#E5E7EB",
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: isAllSubjects ? "12px" : "13px",
          fontFamily: "Kanit, sans-serif",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      min: 0,
      max: 10,
      tickAmount: 10,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
          fontFamily: "Kanit, sans-serif",
        },
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
  };

  const chartSeries = [
    {
      name: "คะแนนเฉลี่ย",
      data: visibleSubjectBars.map((bar) => bar.value),
    },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-primary/[0.05] to-transparent p-4">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={500}
        width="100%"
      />
    </div>
  );
}

function MajorChart() {
  const colors = majorScores.map((score) => score.color);

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Kanit, sans-serif",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "60%",
        borderRadius: 6,
        distributed: true,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Kanit, sans-serif",
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const major = majorScores[dataPointIndex];
        const value = series[seriesIndex][dataPointIndex];
        return (
          '<div class="rounded-2xl bg-[#111FA2] px-3 py-2 text-sm font-medium text-white shadow-xl">' +
          `<div>${major?.label}</div>` +
          `<div>คะแนนเฉลี่ย ${numberFormatter.format(value)} คะแนน</div>` +
          "</div>"
        );
      },
    },
    xaxis: {
      categories: majorScores.map((score) => score.label),
      axisBorder: {
        show: true,
        color: "#E5E7EB",
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
          fontFamily: "Kanit, sans-serif",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      min: 0,
      max: 10,
      tickAmount: 10,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
          fontFamily: "Kanit, sans-serif",
        },
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
  };

  const chartSeries = [
    {
      name: "คะแนนเฉลี่ย",
      data: majorScores.map((score) => score.value),
    },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-primary/[0.05] to-transparent p-4">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={400}
        width="100%"
      />
    </div>
  );
}

function ClassroomChart({
  visibleGroupedData,
  visibleSeriesLegend,
}: {
  visibleGroupedData: { className: string; values: { key: SubjectKey; label: string; value: number }[] }[];
  visibleSeriesLegend: GroupSeries[];
}) {
  // Build series data for grouped bars
  const chartSeries = visibleSeriesLegend.map((legend) => ({
    name: legend.label,
    data: visibleGroupedData.map((group) => {
      const value = group.values.find((v) => v.key === legend.key);
      return value ? value.value : 0;
    }),
  }));

  // Get colors for series - extract hex color from bg-[#HEX] format
  const colors = visibleSeriesLegend.map((legend) => {
    const match = legend.colorClass.match(/#[0-9A-Fa-f]{6}/);
    return match ? match[0] : "#78716C";
  });

  const chartOptions: ApexOptions = {
    chart: {
      type: "bar",
      fontFamily: "Kanit, sans-serif",
      toolbar: {
        show: false,
      },
      sparkline: {
        enabled: false,
      },
      animations: {
        enabled: true,
        speed: 800,
        animateGradually: {
          enabled: true,
          delay: 150,
        },
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: visibleSeriesLegend.length === 1 ? "40%" : "70%",
        borderRadius: 6,
        dataLabels: {
          position: "top",
        },
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    tooltip: {
      enabled: true,
      theme: "dark",
      style: {
        fontSize: "12px",
        fontFamily: "Kanit, sans-serif",
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const classValue = visibleGroupedData[dataPointIndex];
        const seriesLabel = visibleSeriesLegend[seriesIndex]?.label || "";
        const value = series[seriesIndex][dataPointIndex];
        return (
          '<div class="rounded-2xl bg-[#111FA2] px-3 py-2 text-sm font-medium text-white shadow-xl">' +
          `<div>วิชา${seriesLabel}</div>` +
          `<div>ชั้น${classValue?.className} มีผลคะแนนเฉลี่ย ${numberFormatter.format(value)} คะแนน</div>` +
          "</div>"
        );
      },
    },
    xaxis: {
      categories: visibleGroupedData.map((group) => group.className),
      axisBorder: {
        show: true,
        color: "#E5E7EB",
      },
      axisTicks: {
        show: false,
      },
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "12px",
          fontFamily: "Kanit, sans-serif",
          fontWeight: 500,
        },
      },
    },
    yaxis: {
      title: {
        text: undefined,
      },
      min: 0,
      max: 10,
      tickAmount: 10,
      labels: {
        style: {
          colors: "#6B7280",
          fontSize: "13px",
          fontFamily: "Kanit, sans-serif",
        },
        formatter: function (val) {
          return val.toFixed(0);
        },
      },
    },
    fill: {
      opacity: 1,
      colors: colors,
    },
    grid: {
      show: true,
      borderColor: "#E5E7EB",
      strokeDashArray: 4,
      position: "back",
      xaxis: {
        lines: {
          show: false,
        },
      },
      yaxis: {
        lines: {
          show: true,
        },
      },
      padding: {
        top: 0,
        right: 10,
        bottom: 0,
        left: 10,
      },
    },
    legend: {
      show: false,
    },
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-primary/[0.05] to-transparent p-4">
        <Chart
          options={chartOptions}
          series={chartSeries}
          type="bar"
          height={380}
          width="100%"
        />
      </div>

      <div className="rounded-2xl border border-border/70 bg-background/90 px-4 py-3 shadow-sm backdrop-blur">
        <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-foreground">
          {visibleSeriesLegend.map((series) => (
            <div key={series.key} className="flex items-center gap-2 whitespace-nowrap">
              <span className={`h-3 w-3 rounded-full ${series.colorClass}`} />
              <span className={series.textColorClass}>{series.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function SchoolDirectorDashboard() {
  const [major, setMajor] = useState<MajorKey | "">("");
  const [subject, setSubject] = useState("");
  const [unit, setUnit] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ major: "", subject: "", unit: "" });
  const [schoolComparison, setSchoolComparison] = useState<SchoolScore[]>([]);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const data = await loadSchoolComparisonData();
      if (!cancelled) {
        setSchoolComparison(data);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const majorOptions = useMemo(() => getMajors(), []);

  const subjectOptions = useMemo(() => {
    if (!major) return [];
    return getSubjects(major);
  }, [major]);

  const unitOptions = useMemo(() => {
    if (!major || !subject) return [];
    return getUnits(major, subject);
  }, [major, subject]);

  const hasResults = Boolean(appliedFilters.major);
  const currentSchool = schoolComparison.find((item) => item.isCurrent) ?? schoolComparison[0];
  const selectedSubjectLabel = hasResults ? appliedFilters.subject : subject;
  const selectedSubjectKey = hasResults && selectedSubjectLabel ? getSubjectKey(selectedSubjectLabel) : null;
  const isAllSubjects = !selectedSubjectKey;
  const selectedSubjectDisplayLabel = selectedSubjectLabel;

  const groupedData = useMemo(
    () =>
      classRows.map((row) => ({
        className: row.className,
        values: [
          { key: "math", label: "คณิตศาสตร์", value: row.math },
          { key: "foreign", label: "ภาษาต่างประเทศ", value: row.foreign },
          { key: "thai", label: "ภาษาไทย", value: row.thai },
          { key: "social", label: "สังคมศึกษา ศาสนาและวัฒนธรรม", value: row.social },
          { key: "science", label: "วิทยาศาสตร์และเทคโนโลยี", value: row.science },
        ],
      })),
    [],
  );

  const visibleSubjectBars = useMemo(() => {
    if (isAllSubjects) {
      return electricalSubjects.map((subject, index) => ({
        key: `electrical_${index}` as SubjectKey,
        label: subject.label,
        value: subject.value,
        colorClass: subject.colorClass,
        shadowClass: subject.shadowClass,
      }));
    }

    const selectedBar = subjectScores.find((item) => item.key === selectedSubjectKey);
    return selectedBar ? [{ ...selectedBar, label: selectedSubjectDisplayLabel }] : [];
  }, [isAllSubjects, selectedSubjectDisplayLabel, selectedSubjectKey]);

  const visibleGroupedData = useMemo(() => {
    if (isAllSubjects) return groupedData;
    if (!selectedSubjectKey) return [];

    return groupedData
      .map((group) => {
        const selectedValue = group.values.find((series) => series.key === selectedSubjectKey);
        return selectedValue ? { className: group.className, values: [selectedValue] } : null;
      })
      .filter((group): group is { className: string; values: { key: SubjectKey; label: string; value: number }[] } => Boolean(group));
  }, [groupedData, isAllSubjects, selectedSubjectKey]);

  const visibleSeriesLegend = useMemo(() => {
    if (isAllSubjects) {
      return groupSeries.map((item) => ({ ...item, label: getShortSubjectLabel(item.label) }));
    }

    const legendItem = groupSeries.find((item) => item.key === selectedSubjectKey);
    return legendItem ? [{ ...legendItem, label: getShortSubjectLabel(selectedSubjectDisplayLabel) }] : [];
  }, [isAllSubjects, selectedSubjectDisplayLabel, selectedSubjectKey]);

  const subjectChartTitle = isAllSubjects
    ? "คะแนนเฉลี่ยของแต่ละวิชา"
    : `คะแนนเฉลี่ยของวิทยาลัยในวิชา${selectedSubjectDisplayLabel}`;

  const subjectChartSubtitle = isAllSubjects
    ? "เปรียบเทียบผลเฉลี่ยในแต่ละสาระ"
    : `เปรียบเทียบผลเฉลี่ยของวิชา${selectedSubjectDisplayLabel}`;

  const handleSearch = () => {
    setAppliedFilters({ major, subject, unit });
  };

  const renderEmptyChart = (heightClass = "h-72") => (
    <div className={`rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-primary/[0.05] to-transparent ${heightClass}`} />
  );

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Dashboard</p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              ผู้อำนวยการ<br />{schoolName}
            </h1>
            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              ภาพรวมงานบริหารวิทยาลัยและติดตามความคืบหน้าสำคัญ
            </p>
          </div>

          <div className="w-full rounded-3xl border bg-card/95 p-5 shadow-sm backdrop-blur xl:max-w-3xl">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">สาขาวิชา</label>
                <select
                  value={major}
                  onChange={(e) => {
                    setMajor(e.target.value as MajorKey | "");
                    setSubject("");
                    setUnit("");
                  }}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">เลือกสาขาวิชา</option>
                  {majorOptions.map((item) => (
                    <option key={item} value={item}>
                      {majorNames[item]}
                    </option>
                  ))}
                </select>
              </div>

              <div className="hidden space-y-2">
                <label className="text-sm font-medium text-foreground">วิชา</label>
                <select
                  value={subject}
                  onChange={(e) => {
                    setSubject(e.target.value);
                    setUnit("");
                  }}
                  disabled={!major}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">เลือกวิชา</option>
                  {subjectOptions.length > 0 ? (
                    subjectOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="">ยังไม่มีข้อมูล</option>
                  )}
                </select>
              </div>

              <div className="hidden space-y-2">
                <label className="text-sm font-medium text-foreground">หน่วย</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  disabled={!subject}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">เลือกหน่วย</option>
                  {unitOptions.length > 0 ? (
                    unitOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : (
                    <option value="">ยังไม่มีข้อมูล</option>
                  )}
                </select>
              </div>

              <Button
                onClick={handleSearch}
                disabled={!major}
                className="h-11 self-end rounded-full bg-secondary px-6 font-semibold text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Search className="h-4 w-4" />
                ค้นหา
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-2">
          <div
            className="rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
            style={{ animationDelay: "0ms" }}
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-sm">
                <Users className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-medium text-muted-foreground">นักเรียน</p>
                <p className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">
                  {hasResults ? "1,842 คน" : "-"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-primary/10 px-4 py-3 text-primary">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Mars className="h-4 w-4" />
                  นักเรียนผู้ชาย
                </span>
                <p className="mt-2 text-2xl font-bold leading-8 text-foreground">
                  {hasResults ? "1,486 คน" : "-"}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary/10 px-4 py-3 text-foreground">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Venus className="h-4 w-4" />
                  นักเรียนผู้หญิง
                </span>
                <p className="mt-2 text-2xl font-bold leading-8 text-foreground">
                  {hasResults ? "356 คน" : "-"}
                </p>
              </div>
            </div>

          </div>

          <div
            className="rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
            style={{ animationDelay: "90ms" }}
          >
            <div className="mb-4 flex items-start gap-4">
              <div className="rounded-2xl bg-accent/20 p-3 text-secondary shadow-sm">
                <GraduationCap className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[18px] font-medium text-muted-foreground">ครู</p>
                <p className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">
                  {hasResults ? "118 คน" : "-"}
                </p>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-primary/10 px-4 py-3 text-primary">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Mars className="h-4 w-4" />
                  ครูผู้ชาย
                </span>
                <p className="mt-2 text-2xl font-bold leading-8 text-foreground">
                  {hasResults ? "74 คน" : "-"}
                </p>
              </div>
              <div className="rounded-2xl bg-secondary/10 px-4 py-3 text-foreground">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Venus className="h-4 w-4" />
                  ครูผู้หญิง
                </span>
                <p className="mt-2 text-2xl font-bold leading-8 text-foreground">
                  {hasResults ? "44 คน" : "-"}
                </p>
              </div>
            </div>

          </div>
        </section>

        <SectionCard
          title={subjectChartTitle}
          subtitle={subjectChartSubtitle}
          icon={<TrendingUp className="h-5 w-5" />}
          delay={180}
        >
          {hasResults ? (
            <SubjectChart visibleSubjectBars={visibleSubjectBars} isAllSubjects={isAllSubjects} />
          ) : (
            renderEmptyChart("h-72")
          )}
        </SectionCard>

        <SectionCard
          title="คะแนนเฉลี่ยแต่ละสาขาวิชา"
          subtitle="เปรียบเทียบผลการเรียนในแต่ละสาขาวิชา"
          icon={<Building2 className="h-5 w-5" />}
          delay={260}
        >
          {hasResults ? (
            <MajorChart />
          ) : (
            renderEmptyChart("h-[26rem]")
          )}
        </SectionCard>

        <SectionCard
          title="คะแนนเฉลี่ยเทียบกับวิทยาลัยในจังหวัดเดียวกัน"
          subtitle="วิทยาลัยของท่านถูกเน้นด้วยสี Accent เพื่อให้แยกจากวิทยาลัยอื่นได้ชัดเจน"
          icon={<Building2 className="h-5 w-5" />}
          delay={340}
        >
          {hasResults ? (
            <div className="space-y-3 max-h-[24rem] overflow-y-auto pr-2">
              {provinceColleges.map((item) => {
                const width = `${(item.score / 10) * 100}%`;
                return (
                  <div key={item.school} className="grid grid-cols-[minmax(0,1.8fr)_minmax(0,3fr)_56px] items-center gap-3">
                    <span className="text-sm font-medium text-foreground truncate">
                      {item.school}
                    </span>
                    <div className="h-3 rounded-full bg-muted/60">
                      <div
                        className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                          item.isCurrent
                            ? "bg-[#FACC15] shadow-[0_0_8px_rgba(250,204,21,0.6)]"
                            : "bg-[#A9A29E]"
                        }`}
                        style={{ width }}
                      />
                    </div>
                    <span className="text-right text-sm font-semibold text-foreground">{numberFormatter.format(item.score)}</span>
                  </div>
                );
              })}
            </div>
          ) : (
            renderEmptyChart("h-[20rem]")
          )}
        </SectionCard>
      </div>
    </DashboardLayout>
  );
}
