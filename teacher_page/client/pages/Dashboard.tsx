import { useState, useMemo, useRef, useEffect, type ReactNode } from "react";
import { ArrowUpDown, BarChart3, HelpCircle, Mars, Search, TrendingUp, Users, Venus, X } from "lucide-react";
import * as XLSX from "xlsx";
import Chart from "react-apexcharts";
import type { ApexOptions } from "apexcharts";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getMajors, getSubjects, getUnits, getTopics } from "@/data/vocationalSubjects";
import type { MajorKey, SubjectKey, UnitKey } from "@/data/vocationalSubjects";

const majorNames: Record<string, string> = {
  "ช่างไฟฟ้า": "ช่างไฟฟ้า",
  "อิเล็กทรอนิกส์": "อิเล็กทรอนิกส์",
  "การสื่อสารโทรคมนาคม": "การสื่อสารโทรคมนาคม",
  "เมคคาทรอนิกส์และหุ่นยนต์": "เมคคาทรอนิกส์และหุ่นยนต์",
};

const workbookAssetUrl =
  "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2F4c5d03de7e8a46c983fa5cb4c9b2eedf?alt=media&token=a5ac4bc0-2aad-4e93-a5d5-75fd5b74dd94&apiKey=a061ccedc21643e89c15d64ceb68a9d5";

const subjectOptions = [
  { label: "คณิตศาสตร์", code: "MAT" },
  { label: "วิทยาศาสตร์และเทคโนโลยี", code: "SCI" },
  { label: "ภาษาอังกฤษ", code: "ENG" },
];

const gradeOptions = [
  { label: "ประถมศึกษาปีที่ 1", code: "P1" },
  { label: "ประถมศึกษาปีที่ 2", code: "P2" },
  { label: "ประถมศึกษาปีที่ 3", code: "P3" },
  { label: "ประถมศึกษาปีที่ 4", code: "P4" },
  { label: "ประถมศึกษาปีที่ 5", code: "P5" },
  { label: "ประถมศึกษาปีที่ 6", code: "P6" },
];

const DEFAULT_GRADE_LABEL = "ประถมศึกษาปีที่ 4";

const removeStudentPrefix = (name: string) => {
  return name.replace(/^(ด\.ช\.|ด\.ญ\.)\s*/, "");
};

const classRoomRankingData = [
  { name: "ธีรภัทร์ แก้วงาม", score: 10 },
  { name: "วีรภัทร คำดี", score: 9 },
  { name: "ปวริศ ศรีทอง", score: 9 },
  { name: "กฤษฎา เพ็งปอพาน", score: 8 },
  { name: "พิมพ์ชนก ศรีสุข", score: 8 },
  { name: "ศศิธร อินทร์ทอง", score: 8 },
  { name: "อริสรา แก้วดี", score: 8 },
  { name: "ลลิตา บุญช่วย", score: 8 },
  { name: "พัชราภา สุขใจ", score: 8 },
  { name: "ญาณิศา วงศ์ดี", score: 8 },
  { name: "พรนภา คำแก้ว", score: 8 },
  { name: "อมลวรรณ ทองสุข", score: 8 },
  { name: "สุชาดา ศรีวงศ์", score: 8 },
  { name: "ธัญญารัตน์ บุญมี", score: 7 },
  { name: "ศุภลักษณ์ คงดี", score: 7 },
  { name: "ชลธิชา แสงทอง", score: 7 },
  { name: "ณัฐชา อินทร์แก้ว", score: 7 },
  { name: "มณีรัตน์ ใจดี", score: 7 },
  { name: "นรินทร์ บุญรอด", score: 6 },
  { name: "ชัยวัฒน์ อินทรา", score: 5 },
  { name: "กรวิชญ์ โชคกำเนิด", score: 3 },
].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "th"));

const subjectsRankingData = [
  { name: "ภัทรพล แสงชัย", score: 9 },
  { name: "สิรภพ อินทรวงศ์", score: 8.5 },
  { name: "ก้องภพ วงศ์ทอง", score: 8 },
  { name: "ธนภัทร ใจกล้า", score: 8 },
  { name: "รัชพล บุญเกิด", score: 7.5 },
  { name: "ชยพล ศรีคำ", score: 7 },
  { name: "ณภัทร แก้วใส", score: 7 },
  { name: "พีรวิชญ์ ทองดี", score: 7 },
  { name: "อิทธิพล แซ่ตั้ง", score: 6.5 },
  { name: "เมธัส คงสุข", score: 6.5 },
  { name: "กิตติศักดิ์ แสงทอง", score: 6 },
  { name: "ธีรพงศ์ อินทร์ดี", score: 6 },
  { name: "วชิรวิทย์ คำแก้ว", score: 6 },
  { name: "ภานุวัฒน์ บุญช่วย", score: 5.5 },
  { name: "อดิศักดิ์ ศรีสุข", score: 5.5 },
  { name: "ปฏิภาณ ใจดี", score: 5 },
  { name: "จักรกฤษณ์ อินทรา", score: 5 },
  { name: "เอกภพ ทองใบ", score: 4.5 },
  { name: "นพรัตน์ แก้วคำ", score: 4 },
  { name: "สุพิชญา แสงทอง", score: 8 },
  { name: "พิชชาภา อินทร์ดี", score: 7.5 },
  { name: "ณัฐกานต์ วงศ์คำ", score: 7 },
  { name: "ชญานิศ บุญมี", score: 7 },
  { name: "พรชนก คำดี", score: 6.5 },
  { name: "วริศรา ใจกล้า", score: 6.5 },
  { name: "ลักษิกา ศรีวงศ์", score: 6 },
  { name: "ธิดารัตน์ บุญรอด", score: 6 },
  { name: "กนกวรรณ อินทร์ทอง", score: 6 },
  { name: "นันทิชา แก้วดี", score: 5.5 },
  { name: "จิรัชยา สุขใจ", score: 5.5 },
  { name: "เบญจพร คงดี", score: 5 },
  { name: "อชิรญา ทองสุข", score: 4.5 },
  { name: "ปุณยนุช ศรีทอง", score: 4 },
].sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, "th"));

type WorkbookRow = {
  unit: string;
  topic: string;
  objective: string;
};

type WorkbookMap = Record<string, WorkbookRow[]>;

type ComparisonBar = {
  label: string;
  value: number;
  colorClass: string;
  shadowClass: string;
};


const numberFormatter = new Intl.NumberFormat("th-TH", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 0,
});

const getComparisonBars = (activeTab: "classroom" | "subjects"): ComparisonBar[] => {
  const barData = [
    { label: "ป.2/1", value: 5 },
    { label: "ป.2/2", value: 7.5 },
    { label: "ป.2/3", value: 5.2 },
    { label: "ป.2/4", value: 6.3 },
    { label: "ป.2/5", value: 3.8 },
  ];

  const highlightedLabel = activeTab === "classroom" ? "ป.2/2" : "ป.2/4";

  return barData.map((bar) => ({
    ...bar,
    colorClass:
      bar.label === highlightedLabel
        ? "from-yellow-300 to-yellow-500"
        : "from-blue-400 to-blue-600",
    shadowClass:
      bar.label === highlightedLabel
        ? "shadow-yellow-400/25"
        : "shadow-blue-400/25",
  }));
};

const chartTicks = Array.from({ length: 11 }, (_, index) => 10 - index);

const normalizeText = (value: string) => value.replace(/\s+/g, "").trim();

const cleanUnitName = (unit: string): string => {
  // Remove number prefixes like "1. ", "2. ", etc.
  return unit.replace(/^\d+\.\s*/, "").trim();
};

const fillDownMergedCells = (rows: WorkbookRow[]): WorkbookRow[] => {
  let lastUnit = "";

  return rows.map((row) => {
    // If unit is empty but we have a previous non-empty unit, use it
    if (!row.unit && lastUnit) {
      return { ...row, unit: lastUnit };
    }

    // Update lastUnit if current row has a non-empty unit
    if (row.unit) {
      lastUnit = row.unit;
    }

    return row;
  });
};

const fixGrade1ScienceData = (rows: WorkbookRow[]): WorkbookRow[] => {
  // For Grade 1 science, unit "ตัวเรา", keep only 2 specific topics
  const requiredTopics = [
    {
      topic: "ร่างกายของฉัน",
      objective: "เข้าใจโครงสร้างร่างกายของตนเอง",
    },
    {
      topic: "หน้าที่และการดูผิวหนังกับเส้นผม และการใช้ประสาทสัมผัส",
      objective: "เข้าใจหน้าที่ของร่างกายและการดูแลผิวหนังและเส้นผม",
    },
  ];

  const filtered = rows.filter((row) => {
    if (row.unit === "ตัวเรา") {
      return requiredTopics.some((rt) => rt.topic === row.topic);
    }
    return true;
  });

  // Ensure both required topics exist
  requiredTopics.forEach((required) => {
    const exists = filtered.some(
      (row) => row.unit === "ตัวเรา" && row.topic === required.topic,
    );
    if (!exists) {
      filtered.push({
        unit: "ตัวเรา",
        topic: required.topic,
        objective: required.objective,
      });
    }
  });

  return filtered;
};

const getSheetKey = (subjectLabel: string, gradeLabel: string) => {
  const subjectCode = subjectOptions.find((item) => item.label === subjectLabel)?.code;
  const gradeCode = gradeOptions.find((item) => item.label === gradeLabel)?.code;

  return subjectCode && gradeCode ? `${subjectCode}_${gradeCode}` : "";
};

const parseWorkbook = (buffer: ArrayBuffer) => {
  const workbook = XLSX.read(buffer, { type: "array" });
  const parsed: WorkbookMap = {};

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });

    const processedRows = rows
      .map((row) => {
        const normalizedRow = Object.entries(row).reduce<Record<string, string>>(
          (acc, [key, value]) => {
            acc[normalizeText(key)] = String(value ?? "").trim();
            return acc;
          },
          {},
        );

        return {
          unit: cleanUnitName(normalizedRow["หน่วย"] ?? ""),
          topic: normalizedRow["ชื่อเรื่อง"] ?? "",
          objective: normalizedRow["จุดประสงค์"] ?? "",
        };
      })
      .filter((row) => row.unit || row.topic || row.objective);

    // Fill down merged cells in the unit column
    let finalRows = fillDownMergedCells(processedRows);

    // Fix Grade 1 science data
    if (sheetName.trim() === "SCI_P1") {
      finalRows = fixGrade1ScienceData(finalRows);
    }

    parsed[sheetName.trim()] = finalRows;
  });

  return parsed;
};

function SummaryCard({
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
        <div className="rounded-2xl bg-background/80 p-3 text-secondary shadow-sm">{icon}</div>
        <div className="min-w-0 flex-1">
          <p className="text-[18px] font-medium text-muted-foreground">{title}</p>
          <p className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">{value}</p>
        </div>
      </div>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function ComparisonChart({ activeTab }: { activeTab: "classroom" | "subjects" }) {
  const comparisonBars = getComparisonBars(activeTab);

  // Create color array for bars
  const colors = comparisonBars.map((bar) => {
    if (bar.label === "ป.2/2" && activeTab === "classroom") {
      return "#DC2626"; // Red for highlighted bar in classroom tab
    } else if (bar.label === "ป.2/4" && activeTab === "subjects") {
      return "#DC2626"; // Red for highlighted bar in subjects tab
    }
    return "#78716C"; // Grey for normal bars
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
        columnWidth: "55%",
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
        fontFamily: "Inter, sans-serif",
      },
      custom: function ({ series, seriesIndex, dataPointIndex, w }: any) {
        const label = comparisonBars[dataPointIndex]?.label || "";
        const value = series[seriesIndex][dataPointIndex];
        return (
          '<div class="rounded-2xl bg-[#111FA2] px-3 py-2 text-sm font-medium text-white shadow-xl">' +
          `<div>ห้อง ${label}</div>` +
          `<div>มีคะแนนเฉลี่ย ${numberFormatter.format(value)}</div>` +
          "</div>"
        );
      },
    },
    xaxis: {
      categories: comparisonBars.map((bar) => bar.label),
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
    legend: {
      show: false,
    },
  };

  const chartSeries = [
    {
      name: "คะแนนเฉลี่ย",
      data: comparisonBars.map((bar) => bar.value),
    },
  ];

  return (
    <div className="rounded-2xl border border-border/70 bg-gradient-to-b from-primary/[0.05] to-transparent p-4">
      <Chart
        options={chartOptions}
        series={chartSeries}
        type="bar"
        height={280}
        width="100%"
      />
    </div>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
  highlightedOptions,
  addNumbering,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
  highlightedOptions?: string[];
  addNumbering?: boolean;
}) {
  const isValueHighlighted = highlightedOptions?.includes(value);

  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
      >
        <option value="">{placeholder}</option>
        {options.map((option, index) => {
          const isHighlighted = highlightedOptions?.includes(option);
          const displayText = addNumbering ? `${index + 1}. ${option}` : option;
          return (
            <option
              key={option}
              value={option}
              style={
                isHighlighted
                  ? { backgroundColor: "#fee2e2", color: "#dc2626", fontWeight: "600" }
                  : undefined
              }
            >
              {displayText}
            </option>
          );
        })}
      </select>
    </label>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<"classroom" | "subjects">("classroom");
  const [filtersByTab, setFiltersByTab] = useState({
    classroom: { major: "", subject: "", unit: "", topic: "" },
    subjects: { major: "", subject: "", unit: "", topic: "" },
  });
  const [appliedFiltersByTab, setAppliedFiltersByTab] = useState({
    classroom: { major: "", subject: "", unit: "", topic: "" },
    subjects: { major: "", subject: "", unit: "", topic: "" },
  });
  const [sortOrderByTab, setSortOrderByTab] = useState({
    classroom: "desc" as const,
    subjects: "desc" as const,
  });
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);

  // Current tab filters
  const major = filtersByTab[activeTab].major as MajorKey | "";
  const subject = filtersByTab[activeTab].subject;
  const unit = filtersByTab[activeTab].unit;
  const topic = filtersByTab[activeTab].topic;

  const setMajor = (value: string) => {
    setFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], major: value, subject: "", unit: "", topic: "" },
    }));
  };

  const setSubject = (value: string) => {
    setFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], subject: value, unit: "", topic: "" },
    }));
  };

  const setUnit = (value: string) => {
    setFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], unit: value, topic: "" },
    }));
  };

  const setTopic = (value: string) => {
    setFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: { ...prev[activeTab], topic: value },
    }));
  };

  const majorOptions = useMemo(() => getMajors(), []);

  const subjectOptions = useMemo(() => {
    if (!major) return [];
    return getSubjects(major);
  }, [major]);

  const unitOptions = useMemo(() => {
    if (!major || !subject) return [];
    return getUnits(major, subject);
  }, [major, subject]);

  const topicOptions = useMemo(() => {
    if (!major || !subject || !unit) return [];
    return getTopics(major, subject, unit);
  }, [major, subject, unit]);

  const canSearch = Boolean(major && subject && unit && topic);
  const appliedFilters = appliedFiltersByTab[activeTab];
  const hasResults = Boolean(
    appliedFilters.major && appliedFilters.subject && appliedFilters.unit && appliedFilters.topic,
  );

  const rankingDataByTab = activeTab === "classroom" ? classRoomRankingData : subjectsRankingData;

  const sortedRankingData = useMemo(() => {
    const sortOrder = sortOrderByTab[activeTab];
    return [...rankingDataByTab].sort((a, b) => {
      if (sortOrder === "desc") {
        return b.score - a.score || a.name.localeCompare(b.name, "th");
      }

      return a.score - b.score || a.name.localeCompare(b.name, "th");
    });
  }, [sortOrderByTab[activeTab], rankingDataByTab]);

  const handleSearch = () => {
    if (!canSearch) return;

    setAppliedFiltersByTab((prev) => ({
      ...prev,
      [activeTab]: { major, subject, unit, topic },
    }));
  };

  const handleScoreSortToggle = () => {
    setSortOrderByTab((prev) => ({
      ...prev,
      [activeTab]: prev[activeTab] === "desc" ? "asc" : "desc",
    }));
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Tab Navigation */}
        <div className="rounded-2xl bg-slate-50 p-6" style={{ backgroundColor: '#f8f8fb' }}>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid h-auto w-full grid-cols-2 gap-2 bg-transparent p-0">
              <TabsTrigger
                value="classroom"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                นักเรียนประจำชั้น
              </TabsTrigger>
              <TabsTrigger
                value="subjects"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-border bg-muted px-4 py-3 text-sm font-medium text-foreground data-[state=active]:border-primary data-[state=active]:bg-primary data-[state=active]:text-white"
              >
                วิชาที่สอน
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <section className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
          <div className="max-w-2xl space-y-3">
            <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">
              Teacher Dashboard
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">
              รายงานผลคะแนนของนักเรียนที่ทำแบบฝึกหัด
            </h1>
            <p className="text-sm leading-7 text-muted-foreground md:text-base">
              ดูภาพรวมผลคะแนนของห้องเรียน พร้อมกรองข้อมูลตามสาขาวิชา วิชา หน่วย และเรื่องที่ต้องการ
            </p>
          </div>

          <div className="w-full rounded-3xl border bg-card/95 p-5 shadow-sm backdrop-blur xl:max-w-3xl">
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1.1fr)_minmax(0,1fr)_minmax(0,1fr)]">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">สาขาวิชา</label>
                <select
                  value={major}
                  onChange={(e) => setMajor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm"
                >
                  <option value="">เลือกสาขาวิชา</option>
                  {majorOptions.map((item) => (
                    <option key={item} value={item}>
                      {majorNames[item]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">วิชา</label>
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={!major}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm disabled:cursor-not-allowed disabled:bg-muted"
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">หน่วย</label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  disabled={!subject}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm disabled:cursor-not-allowed disabled:bg-muted"
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
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">เรื่อง</label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  disabled={!unit}
                  className="w-full px-4 py-2.5 rounded-full border border-border bg-background text-foreground text-sm disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">เลือกเรื่อง</option>
                  {topicOptions.length > 0 ? (
                    topicOptions.map((item, index) => (
                      <option key={item} value={item}>
                        {index + 1}. {item}
                      </option>
                    ))
                  ) : (
                    <option value="">ยังไม่มีข้อมูล</option>
                  )}
                </select>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <Button
                onClick={handleSearch}
                disabled={!canSearch}
                className="h-11 rounded-full px-6 gap-2 self-start sm:self-auto"
              >
                <Search className="h-4 w-4" />
                ค้นหา
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 md:grid-cols-3">
          {activeTab === "subjects" ? (
            <>
              <SummaryCard
                title="นักเรียน"
                value={hasResults ? "33 คน" : "-"}
                description={""}
                icon={<Users className="h-5 w-5" />}
                className="bg-gradient-to-br from-primary/10 to-white border-[rgba(200,212,229,1)]"
                delay={0}
              />

              <div
                className="rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
                style={{ animationDelay: "90ms" }}
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-medium text-muted-foreground">เพศของนักเรียน</p>
                    <p className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">{hasResults ? "19 : 14" : "-"}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl bg-primary/10 px-4 py-3 text-primary">
                    <span className="flex items-center gap-2 font-medium">
                      <Mars className="h-4 w-4" />
                      ผู้ชาย
                    </span>
                    <span className="font-semibold">{hasResults ? "19 คน" : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-secondary/10 px-4 py-3 text-foreground">
                    <span className="flex items-center gap-2 font-medium">
                      <Venus className="h-4 w-4" />
                      ผู้หญิง
                    </span>
                    <span className="font-semibold">{hasResults ? "14 คน" : "-"}</span>
                  </div>
                </div>
              </div>

              <SummaryCard
                title="คะแนนเฉลี่ยของนักเรียนทั้งห้อง"
                value={hasResults ? "6.3" : "-"}
                description={""}
                icon={<TrendingUp className="h-5 w-5" />}
                className="bg-gradient-to-br from-secondary/10 to-white border-[rgba(200,212,229,1)]"
                delay={180}
              />
            </>
          ) : (
            <>
              <SummaryCard
                title="นักเรียน"
                value={hasResults ? "21 คน" : "-"}
                description={""}
                icon={<Users className="h-5 w-5" />}
                className="bg-gradient-to-br from-primary/10 to-white border-[rgba(200,212,229,1)]"
                delay={0}
              />

              <div
                className="rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
                style={{ animationDelay: "90ms" }}
              >
                <div className="mb-4 flex items-start gap-4">
                  <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-sm">
                    <Users className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[18px] font-medium text-muted-foreground">เพศของนักเรียน</p>
                    <p className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">{hasResults ? "7 : 14" : "-"}</p>
                  </div>
                </div>

                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between rounded-2xl bg-primary/10 px-4 py-3 text-primary">
                    <span className="flex items-center gap-2 font-medium">
                      <Mars className="h-4 w-4" />
                      ผู้ชาย
                    </span>
                    <span className="font-semibold">{hasResults ? "7 คน" : "-"}</span>
                  </div>
                  <div className="flex items-center justify-between rounded-2xl bg-secondary/10 px-4 py-3 text-foreground">
                    <span className="flex items-center gap-2 font-medium">
                      <Venus className="h-4 w-4" />
                      ผู้หญิง
                    </span>
                    <span className="font-semibold">{hasResults ? "14 คน" : "-"}</span>
                  </div>
                </div>
              </div>

              <SummaryCard
                title="คะแนนเฉลี่ยของนักเรียนทั้งห้อง"
                value={hasResults ? "7.5" : "-"}
                description={""}
                icon={<TrendingUp className="h-5 w-5" />}
                className="bg-gradient-to-br from-secondary/10 to-white border-[rgba(200,212,229,1)]"
                delay={180}
              />
            </>
          )}
        </section>

        {hasResults && (
          <p className="text-2xl tracking-tight text-foreground md:text-3xl">
            วันที่สอน : {new Date().toLocaleDateString("th-TH", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        )}

        <section className="grid gap-6 xl:grid-cols-1">
          <div
            className="rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
            style={{ animationDelay: "240ms" }}
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-2xl bg-secondary/10 p-3 text-secondary">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">
                  {activeTab === "classroom"
                    ? "คะแนนที่ดีที่สุดของนักเรียนแต่ละคนในห้อง"
                    : "คะแนนที่ดีที่สุดของนักเรียนแต่ละคนในห้อง"}
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">จัดเรียงจากคะแนนสูงสุด</p>
              </div>
            </div>

            <div className="overflow-hidden rounded-2xl border flex flex-col">
              <table className="w-full text-left">
                <thead className="bg-muted/60 text-sm text-muted-foreground">
                  <tr>
                    <th className="px-5 py-4 font-medium">ชื่อ</th>
                    <th className="px-5 py-4 text-right font-medium">
                      <button
                        type="button"
                        onClick={handleScoreSortToggle}
                        className="ml-auto inline-flex items-center gap-2 rounded-full px-2 py-1 transition-colors hover:bg-background/70"
                      >
                        <span>คะแนน</span>
                        <ArrowUpDown className="h-4 w-4" />
                      </button>
                    </th>
                  </tr>
                </thead>
              </table>
              <div className="overflow-y-auto max-h-96 flex-1">
                <table className="w-full text-left">
                  <tbody>
                    {hasResults
                      ? sortedRankingData.map((student, index) => (
                          <tr
                            key={`${student.name}-${index}`}
                            className="border-t border-border/70 transition-colors hover:bg-primary/5"
                          >
                            <td className="px-5 py-4 text-sm font-medium text-foreground">{student.name}</td>
                            <td className="px-5 py-4 text-right text-sm font-semibold text-primary flex items-center justify-end gap-2">
                              {student.score}
                              {activeTab === "classroom" && (student.name === "กฤษฎา เพ็งปอพาน" || student.name === "กรวิชญ์ โชคกำเนิด") && (
                                <button
                                  type="button"
                                  onClick={() => setSelectedStudent(student.name)}
                                  className="hover:text-foreground transition-colors outline-none cursor-pointer"
                                >
                                  <HelpCircle className="h-4 w-4 text-muted-foreground" />
                                </button>
                              )}
                              {activeTab === "classroom" && student.name !== "กฤษฎา เพ็งปอพาน" && student.name !== "กรวิชญ์ โชคกำเนิด" && (
                                <HelpCircle className="h-4 w-4 text-muted-foreground" />
                              )}
                              {activeTab === "subjects" && (
                                <HelpCircle className="h-4 w-4 text-muted-foreground/50" />
                              )}
                            </td>
                          </tr>
                        ))
                      : Array.from({ length: 8 }).map((_, index) => (
                          <tr key={index} className="border-t border-border/70">
                            <td className="px-5 py-4 text-sm font-medium text-muted-foreground">—</td>
                            <td className="px-5 py-4 text-right text-sm font-semibold text-muted-foreground">
                              -
                            </td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div
            className="hidden rounded-3xl border bg-card p-6 shadow-sm transition-all duration-300 hover:shadow-lg animate-[dashboardFadeIn_0.45s_ease-out_both]"
            style={{ animationDelay: "320ms" }}
          >
            <div className="mb-5 flex items-start gap-4">
              <div className="rounded-2xl bg-accent/20 p-3 text-secondary">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-foreground">เปรียบเทียบคะแนนกับห้องอื่น</h2>
                <p className="mt-1 text-sm text-muted-foreground">ดูแนวโน้มคะแนนของแต่ละห้องเรียน</p>
              </div>
            </div>

            {hasResults ? (
              <ComparisonChart activeTab={activeTab} />
            ) : activeTab === "classroom" && !hasResults ? (
              <div className="h-72 rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-primary/5 to-transparent flex items-center justify-center">
                <p className="text-sm text-muted-foreground">กรุณาเลือกตัวกรองแล้วกดค้นหาเพื่อแสดงข้อมูล</p>
              </div>
            ) : (
              <div className="h-72 rounded-2xl border border-dashed border-border/70 bg-gradient-to-b from-primary/5 to-transparent" />
            )}
          </div>
        </section>

        {/* Quiz Details Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-card rounded-3xl border max-w-2xl w-full max-h-[80vh] overflow-y-auto p-6 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">รายละเอียดการทำข้อสอบ</h2>
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-muted-foreground">นักเรียน:</p>
                <p className="text-lg font-semibold text-foreground">{selectedStudent}</p>
              </div>

              <div className="space-y-4">
                <h3 className="font-semibold text-foreground">ข้อสอบและคำตอบ</h3>

                {selectedStudent === "กฤษฎา เพ็งปอพาน" ? (
                  <>
                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 1:</p>
                        <p className="text-sm text-foreground">คำถาม: ไฟฟ้ากระแสสลับ (AC) หมายถึงอะไร</p>
                        <p className="text-sm text-green-600 font-medium">✓ กระแสไฟฟ้าที่มีทิศทางและขนาดเปลี่ยนแปลงสลับกันไปเป็นคาบเวลาที่แน่นอน</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 2:</p>
                        <p className="text-sm text-foreground">คำถาม: ไฟฟ้ากระแสตรง (DC) แตกต่างจากไฟฟ้ากระแสสลับ (AC) อย่างไร</p>
                        <p className="text-sm text-green-600 font-medium">✓ DC กระแสไหลทิศทางเดียวคงที่ ส่วน AC กระแสสลับทิศทางไปมา</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 3:</p>
                        <p className="text-sm text-foreground">คำถาม: รูปแบบสัญญาณของไฟฟ้ากระแสสลับในระบบจ่ายไฟฟ้าทั่วไปเป็นรูปแบบใด</p>
                        <p className="text-sm text-green-600 font-medium">✓ คลื่นไซน์ (Sinusoidal Wave)</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 4:</p>
                        <p className="text-sm text-foreground">คำถาม: กฎการเหนี่ยวนำแม่เหล็กไฟฟ้าของฟาราเดย์กล่าวว่าอะไร</p>
                        <p className="text-sm text-green-600 font-medium">✓ เมื่อฟลักซ์แม่เหล็กที่พาดผ่านขดลวดเปลี่ยนแปลงตามเวลา จะเกิดแรงดันไฟฟ้าเหนี่ยวนำในขดลวด</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 5:</p>
                        <p className="text-sm text-foreground">คำถาม: ส่วนประกอบสำคัญ 2 ส่วนหลักของเครื่องกำเนิดไฟฟ้ากระแสสลับคืออะไร</p>
                        <p className="text-sm text-green-600 font-medium">✓ ส่วนที่หมุน (Rotor) และส่วนที่อยู่นิ่ง (Stator)</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 6:</p>
                        <p className="text-sm text-foreground">คำถาม: ค่า RMS ของแรงดันไฟฟ้ากระแสสลับคืออะไร</p>
                        <p className="text-sm text-green-600 font-medium">✓ ค่ากำลังงานสมมูล คือค่าที่ใช้บอกความแรงของไฟฟ้ากระแสสลับในทางปฏิบัติ</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 7:</p>
                        <p className="text-sm text-foreground">คำถาม: ความถี่มาตรฐานของระบบไฟฟ้าสาธารณูปโภคในประเทศไทยมีค่าเท่าใด</p>
                        <p className="text-sm text-green-600 font-medium">✓ 50 Hz</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 8:</p>
                        <p className="text-sm text-foreground">คำถาม: ไฟฟ้า 220 โวลต์ที่ใช้ในบ้านหมายถึงค่าใด</p>
                        <p className="text-sm text-green-600 font-medium">✓ ค่า RMS</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 9:</p>
                        <p className="text-sm text-foreground">คำถาม: ไดชาร์จ (Alternator) ในรถยนต์ทำหน้าที่อะไร</p>
                        <p className="text-sm text-red-600 font-medium">✘ ควบคุมแรงดันน้ำมันในเครื่องยนต์</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 10:</p>
                        <p className="text-sm text-foreground">คำถาม: อุปกรณ์ใดต่อไปนี้ใช้มอเตอร์ไฟฟ้ากระแสสลับ (AC Motor)</p>
                        <p className="text-sm text-red-600 font-medium">✘ รีโมตคอนโทรล</p>
                      </div>
                    </div>
                  </>
                ) : selectedStudent === "กรวิชญ์ โชคกำเนิด" ? (
                  <>
                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 1:</p>
                        <p className="text-sm text-foreground">คำถาม: ไฟฟ้ากระแสสลับ (AC) หมายถึงอะไร</p>
                        <p className="text-sm text-red-600 font-medium">✘ กระแสไฟฟ้าที่ผลิตได้จากแบตเตอรี่</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 2:</p>
                        <p className="text-sm text-foreground">คำถาม: ไฟฟ้ากระแสตรง (DC) แตกต่างจากไฟฟ้ากระแสสลับ (AC) อย่างไร</p>
                        <p className="text-sm text-green-600 font-medium">✓ DC กระแสไหลทิศทางเดียวคงที่ ส่วน AC กระแสสลับทิศทางไปมา</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 3:</p>
                        <p className="text-sm text-foreground">คำถาม: รูปแบบสัญญาณของไฟฟ้ากระแสสลับในระบบจ่ายไฟฟ้าทั่วไปเป็นรูปแบบใด</p>
                        <p className="text-sm text-green-600 font-medium">✓ คลื่นไซน์ (Sinusoidal Wave)</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 4:</p>
                        <p className="text-sm text-foreground">คำถาม: กฎการเหนี่ยวนำแม่เหล็กไฟฟ้าของฟาราเดย์กล่าวว่าอะไร</p>
                        <p className="text-sm text-red-600 font-medium">✘ กระแสไฟฟ้าจะไหลได้ก็ต่อเมื่อวงจรครบ</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 5:</p>
                        <p className="text-sm text-foreground">คำถาม: ส่วนประกอบสำคัญ 2 ส่วนหลักของเครื่องกำเนิดไฟฟ้ากระแสสลับคืออะไร</p>
                        <p className="text-sm text-red-600 font-medium">✘ ตัวเก็บประจุและตัวต้านทาน</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 6:</p>
                        <p className="text-sm text-foreground">คำถาม: ค่า RMS ของแรงดันไฟฟ้ากระแสสลับคืออะไร</p>
                        <p className="text-sm text-red-600 font-medium">✘ ค่าเฉลี่ยทางคณิตศาสตร์ของแรงดันทุกจุด</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 7:</p>
                        <p className="text-sm text-foreground">คำถาม: ความถี่มาตรฐานของระบบไฟฟ้าสาธารณูปโภคในประเทศไทยมีค่าเท่าใด</p>
                        <p className="text-sm text-red-600 font-medium">✘ 60 Hz</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 8:</p>
                        <p className="text-sm text-foreground">คำถาม: ไฟฟ้า 220 โวลต์ที่ใช้ในบ้านหมายถึงค่าใด</p>
                        <p className="text-sm text-green-600 font-medium">✓ ค่า RMS</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 9:</p>
                        <p className="text-sm text-foreground">คำถาม: ไดชาร์จ (Alternator) ในรถยนต์ทำหน้าที่อะไร</p>
                        <p className="text-sm text-red-600 font-medium">✘ ควบคุมแรงดันน้ำมันในเครื่องยนต์</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 10:</p>
                        <p className="text-sm text-foreground">คำถาม: อุปกรณ์ใดต่อไปนี้ใช้มอเตอร์ไฟฟ้ากระแสสลับ (AC Motor)</p>
                        <p className="text-sm text-red-600 font-medium">✘ โทรศัพท์มือถือ</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 1:</p>
                        <p className="text-sm text-foreground">คำถาม: เข็มสั้นบนนาฬิกาทำหน้าที่บอกอะไร?</p>
                        <p className="text-sm text-green-600 font-medium">✓ บอกชั่วโมง</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 2:</p>
                        <p className="text-sm text-foreground">คำถาม: เข็มยาวบนนาฬิกาทำหน้าที่บอกอะไร?</p>
                        <p className="text-sm text-green-600 font-medium">✓ บอกนาที</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 3:</p>
                        <p className="text-sm text-foreground">คำถาม: 1 ชั่วโมง มีกี่นาที?</p>
                        <p className="text-sm text-green-600 font-medium">✓ 60 นาที</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 4:</p>
                        <p className="text-sm text-foreground">คำถาม: เวลาอ่านนาฬิกา ควรมองเข็มใดก่อน?</p>
                        <p className="text-sm text-green-600 font-medium">✓ เข็มสั้น</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 5:</p>
                        <p className="text-sm text-foreground">คำถาม: ถ้าเข็มสั้นชี้ที่ 7 และเข็มยาวชี้ที่ 12 ขณะนี้กี่โมง?</p>
                        <p className="text-sm text-green-600 font-medium">✓ 7 นาฬิกาตรง</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 6:</p>
                        <p className="text-sm text-foreground">คำถาม: ตัวเลขบนหน้าปัดนาฬิกามีกี่ตัว?</p>
                        <p className="text-sm text-green-600 font-medium">✓ 12 ตัว</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 7:</p>
                        <p className="text-sm text-foreground">คำถาม: แต่ละช่องระหว่างตัวเลขสองตัวที่อยู่ติดกันบนหน้าปัดนาฬิกาแทนค่ากี่นาที?</p>
                        <p className="text-sm text-green-600 font-medium">✓ 5 นาที</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 8:</p>
                        <p className="text-sm text-foreground">คำถาม: เข็มสั้นชี้ที่ 3 และเข็มยาวชี้ที่ 12 ขณะนี้กี่โมง?</p>
                        <p className="text-sm text-green-600 font-medium">✓ 3 นาฬิกาตรง</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 9:</p>
                        <p className="text-sm text-foreground">คำถาม: ถ้าเข็มยาวชี้ที่เลข 6 แสดงว่าผ่านมาแล้วกี่นาที?</p>
                        <p className="text-sm text-red-600 font-medium">✘ 20 นาที</p>
                      </div>
                    </div>

                    <div className="space-y-3 bg-muted/30 rounded-2xl p-4">
                      <div>
                        <p className="text-sm font-medium text-muted-foreground">ข้อ 10:</p>
                        <p className="text-sm text-foreground">คำถาม: ถ้าเข็มยาวชี้ที่เลข 3 แสดงว่าผ่านมาแล้วกี่นาที?</p>
                        <p className="text-sm text-red-600 font-medium">✘ 10 นาที</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-muted-foreground">คะแนนรวม:</span>
                  <span className="text-xl font-bold text-primary">
                    {sortedRankingData.find((s) => s.name === selectedStudent)?.score}/10
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
