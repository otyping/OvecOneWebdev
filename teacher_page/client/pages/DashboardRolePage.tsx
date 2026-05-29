import { useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import * as XLSX from "xlsx";
import {
  Building2,
  ChevronDown,
  GraduationCap,
  MapPin,
  PieChart,
  Search,
  School2,
  TrendingUp,
  Users,
} from "lucide-react";

import { DashboardLayout } from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { getMajors, getSubjects } from "@/data/vocationalSubjects";
import type { MajorKey } from "@/data/vocationalSubjects";

const majorNames: Record<string, string> = {
  "ช่างไฟฟ้า": "ช่างไฟฟ้า",
  "อิเล็กทรอนิกส์": "อิเล็กทรอนิกส์",
  "การสื่อสารโทรคมนาคม": "การสื่อสารโทรคมนาคม",
  "เมคคาทรอนิกส์และหุ่นยนต์": "เมคคาทรอนิกส์และหุ่นยนต์",
};

const districtWorkbookUrl =
  "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Feb5df48e7c8c4627871c1b9973610b2b?alt=media&token=92dbe0fe-c67f-4b12-a1d6-748646260a3c&apiKey=a061ccedc21643e89c15d64ceb68a9d5";

const schoolComparisonWorkbookUrl =
  "https://cdn.builder.io/o/assets%2Fa061ccedc21643e89c15d64ceb68a9d5%2Fb406392b72cc4c0f83910b84f50c1efc?alt=media&token=7d43d8df-1d36-4242-8d40-62191dc62f8e&apiKey=a061ccedc21643e89c15d64ceb68a9d5";

const provinceOptions = [
  "เชียงใหม่",
  "เชียงราย",
  "เพชรบุรี",
  "เพชรบูรณ์",
  "เลย",
  "แพร่",
  "แม่ฮ่องสอน",
  "กระบี่",
  "กรุงเทพมหานคร",
  "กาญจนบุรี",
  "กาฬสินธุ์",
  "กำแพงเพชร",
  "ขอนแก่น",
  "จันทบุรี",
  "ฉะเชิงเทรา",
  "ชลบุรี",
  "ชัยนาท",
  "ชัยภูมิ",
  "ชุมพร",
  "ตรัง",
  "ตราด",
  "ตาก",
  "นครนายก",
  "นครปฐม",
  "นครพนม",
  "นครราชสีมา",
  "นครศรีธรรมราช",
  "นครสวรรค์",
  "นนทบุรี",
  "นราธิวาส",
  "น่าน",
  "บึงกาฬ",
  "บุรีรัมย์",
  "ปทุมธานี",
  "ประจวบคีรีขันธ์",
  "ปราจีนบุรี",
  "ปัตตานี",
  "พระนครศรีอยุธยา",
  "พะเยา",
  "พังงา",
  "พัทลุง",
  "พิจิตร",
  "พิษณุโลก",
  "ภูเก็ต",
  "มหาสารคาม",
  "มุกดาหาร",
  "ยโสธร",
  "ยะลา",
  "ร้อยเอ็ด",
  "ระนอง",
  "ระยอง",
  "ราชบุรี",
  "ลพบุรี",
  "ลำปาง",
  "ลำพูน",
  "ศรีสะเกษ",
  "สกลนคร",
  "สงขลา",
  "สตูล",
  "สมุทรปราการ",
  "สมุทรสงคราม",
  "สมุทรสาคร",
  "สระแก้ว",
  "สระบุรี",
  "สิงห์บุรี",
  "สุโขทัย",
  "สุพรรณบุรี",
  "สุราษฎร์ธานี",
  "สุรินทร์",
  "หนองคาย",
  "หนองบัวลำภู",
  "อ่างทอง",
  "อำนาจเจริญ",
  "อุดรธานี",
  "อุตรดิตถ์",
  "อุทัยธานี",
  "อุบลราชธานี",
];

const branchOptions = [
  "ทุกสาขาวิชา",
  "สาขาวิชาช่างไฟฟ้า",
  "สาขาวิชาอิเล็กทรอนิกส์",
  "สาขาวิชาการสื่อสารโทรคมนาคม",
  "สาขาวิชาเมคคาทรอนิกส์และหุ่นยนต์",
];

const subjectOptions = [
  "ทุกวิชา",
  "คณิตศาสตร์",
  "วิทยาศาสตร์และเทคโนโลยี",
  "ภาษาต่างประเทศ",
];

type SubjectKey = "math" | "science" | "thai" | "foreign" | "social";

type ScoreBySubject = {
  overall: number;
  math: number;
  science: number;
  thai: number;
  foreign: number;
  social: number;
};

type SchoolRow = {
  name: string;
} & ScoreBySubject;

type AreaRow = {
  name: string;
} & ScoreBySubject;

type SizeBucket = {
  label: string;
  count: number;
  color: string;
};

type StageBucket = {
  label: string;
  count: number;
  color: string;
};

type TooltipState = {
  title: string;
  detail: string;
  x: number;
  y: number;
} | null;

type DonutSegment = {
  label: string;
  value: number;
  color: string;
};

type FilterOption = {
  label: string;
  value: string;
};

const numberFormatter = new Intl.NumberFormat("th-TH", {
  maximumFractionDigits: 1,
  minimumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat("th-TH", {
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
});

const chartTicks = Array.from({ length: 11 }, (_, index) => 10 - index);

const schoolRows: SchoolRow[] = [
  { name: "วิทยาลัยอาชีวศึกษาเชียงใหม่", overall: 7.8, math: 7.8, science: 7.8, thai: 7.8, foreign: 7.8, social: 7.8 },
  { name: "วิทยาลัยเทคนิคเชียงใหม่", overall: 7.5, math: 7.5, science: 7.5, thai: 7.5, foreign: 7.5, social: 7.5 },
  { name: "วิทยาลัยเทคนิคสันกำแพง", overall: 7.2, math: 7.2, science: 7.2, thai: 7.2, foreign: 7.2, social: 7.2 },
  { name: "วิทยาลัยเทคนิคสารภี", overall: 7.0, math: 7.0, science: 7.0, thai: 7.0, foreign: 7.0, social: 7.0 },
  { name: "วิทยาลัยสารพัดช่างเชียงใหม่", overall: 6.9, math: 6.9, science: 6.9, thai: 6.9, foreign: 6.9, social: 6.9 },
  { name: "วิทยาลัยเกษตรและเทคโนโลยีเชียงใหม่", overall: 6.8, math: 6.8, science: 6.8, thai: 6.8, foreign: 6.8, social: 6.8 },
  { name: "วิทยาลัยการอาชีพจอมทอง", overall: 6.6, math: 6.6, science: 6.6, thai: 6.6, foreign: 6.6, social: 6.6 },
  { name: "วิทยาลัยการอาชีพฝาง", overall: 6.4, math: 6.4, science: 6.4, thai: 6.4, foreign: 6.4, social: 6.4 },
];

const areaRows: AreaRow[] = [
  { name: "ภาคกลาง", overall: 7.8, math: 7.8, science: 7.8, thai: 7.8, foreign: 7.8, social: 7.8 },
  { name: "ภาคตะวันออก", overall: 7.5, math: 7.5, science: 7.5, thai: 7.5, foreign: 7.5, social: 7.5 },
  { name: "ภาคเหนือ", overall: 7.4, math: 7.4, science: 7.4, thai: 7.4, foreign: 7.4, social: 7.4 },
  { name: "กรุงเทพมหานคร", overall: 7.3, math: 7.3, science: 7.3, thai: 7.3, foreign: 7.3, social: 7.3 },
  { name: "ภาคใต้", overall: 7.1, math: 7.1, science: 7.1, thai: 7.1, foreign: 7.1, social: 7.1 },
  { name: "ภาคตะวันออกเฉียงเหนือ", overall: 6.9, math: 6.9, science: 6.9, thai: 6.9, foreign: 6.9, social: 6.9 },
  { name: "ภาคตะวันตก", overall: 6.8, math: 6.8, science: 6.8, thai: 6.8, foreign: 6.8, social: 6.8 },
];

const sizeBuckets: SizeBucket[] = [
  { label: "ขนาดเล็ก (<119 คน)", count: 62, color: "#15803D" },
  { label: "ขนาดกลาง (<719 คน)", count: 71, color: "#22C55E" },
  { label: "ขนาดใหญ่ (<1,679 คน)", count: 5, color: "#F59E0B" },
  { label: "ขนาดใหญ่พิเศษ (1,680 คนขึ้นไป)", count: 4, color: "#8B5CF6" },
];

const stageBuckets: StageBucket[] = [
  { label: "อนุบาล - ประถมศึกษา", count: 95, color: "#DC2626" },
  { label: "ประถมศึกษา", count: 7, color: "#F97316" },
  { label: "อนุบาล - มัธยมศึกษาตอนต้น", count: 40, color: "#FACC15" },
  { label: "อนุบาล - มัธยมศึกษาตอนปลาย", count: 0, color: "#EC4899" },
];

const subjectShortLabels: Record<SubjectKey, string> = {
  math: "คณิต",
  science: "วิทย์",
  thai: "ไทย",
  foreign: "ต่างประเทศ",
  social: "สังคม",
};

const subjectKeyMap: Record<string, SubjectKey> = {
  "คณิตศาสตร์": "math",
  "วิทยาศาสตร์และเทคโนโลยี": "science",
  "ภาษาไทย": "thai",
  "ภาษาต่างประเทศ": "foreign",
  "ภาษาอังกฤษ": "foreign",
  "สังคมศึกษา ศาสนาและวัฒนธรรม": "social",
};

const subjectColorMap: Record<SubjectKey, string> = {
  math: "#78716C",
  science: "#A9A29E",
  thai: "#DC2626",
  foreign: "#6B7280",
  social: "#2ECC71",
};

const schoolSizeLabel = (label: string) => label;
const stageLabel = (label: string) => label;

const getSubjectKey = (value: string): SubjectKey | null => subjectKeyMap[value] ?? null;

const getSheetNames = async () => {
  const response = await fetch(districtWorkbookUrl);
  if (!response.ok) throw new Error("Workbook not available");

  const buffer = await response.arrayBuffer();
  const workbook = XLSX.read(buffer, { type: "array" });
  const districts = new Set<string>();

  workbook.SheetNames.forEach((sheetName) => {
    const sheet = workbook.Sheets[sheetName];
    if (!sheet) return;

    const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, {
      defval: "",
      raw: false,
    });

    rows.forEach((row) => {
      const districtName = String(row["ชื่อ"] ?? "").trim();
      if (districtName) {
        districts.add(districtName);
      }
    });
  });

  return Array.from(districts);
};

type SchoolData = {
  name: string;
  overall: number;
  math: number;
  science: number;
  thai: number;
  foreign: number;
  social: number;
};

const loadSchoolComparisonData = async (): Promise<SchoolData[]> => {
  try {
    const response = await fetch(schoolComparisonWorkbookUrl);
    if (!response.ok) {
      console.error("Failed to load school comparison workbook");
      return [];
    }

    const buffer = await response.arrayBuffer();
    const workbook = XLSX.read(buffer, { type: "array" });
    const schools: SchoolData[] = [];

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
            name: schoolName,
            overall: score,
            math: score,
            science: score,
            thai: score,
            foreign: score,
            social: score,
          });
        }
      });
    });

    const sorted = schools.sort((a, b) => b.overall - a.overall);
    console.log(`✓ Loaded ${sorted.length} schools from Excel file for area director`);
    return sorted;
  } catch (error) {
    console.error("✗ Error loading school comparison data:", error);
    return [];
  }
};

const hashText = (value: string) => {
  let hash = 0;
  for (let index = 0; index < value.length; index += 1) {
    hash = (hash * 31 + value.charCodeAt(index)) % 997;
  }
  return hash;
};

const getSelectionShift = (district: string, branch: string, subject: string) => {
  // For สพป.นครราชสีมา เขต 1 with all branches and subjects, return 0
  if (district === "สพป.นครราชสีมา เขต 1" && branch === "ทุกสาขาวิชา" && subject === "ทุกวิชา") {
    return 0;
  }
  const seed = hashText(`${district}|${branch}|${subject}`);
  return ((seed % 7) - 3) * 0.03;
};

const getMetricShift = (district: string, branch: string, subject: string) => {
  // For สพป.นครราชสีมา เขต 1 with all branches and subjects, return 0
  if (district === "สพป.นครราชสีมา เขต 1" && branch === "ทุกสาขาวิชา" && subject === "ทุกวิชา") {
    return 0;
  }
  const seed = hashText(`${subject}|${branch}|${district}`);
  return ((seed % 5) - 2) * 0.02;
};

function SectionCard({
  title,
  subtitle,
  icon,
  children,
}: {
  title: string;
  subtitle: string;
  icon: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded-3xl border bg-card p-6 shadow-sm animate-[dashboardFadeIn_0.45s_ease-out_both]">
      <div className="mb-5 flex items-center justify-start gap-4">
        <div className="rounded-2xl bg-accent/20 p-3 text-secondary shadow-sm">{icon}</div>
        <div>
          <h2 className="text-xl font-bold text-foreground">{title}</h2>
          <div className="mt-1 text-sm text-muted-foreground">{subtitle}</div>
        </div>
      </div>
      {children}
    </section>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  disabled?: boolean;
}) {
  return (
    <label className="space-y-2">
      <span className="text-sm font-medium text-foreground">{label}</span>
      <select
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
      >
        <option value="">{placeholder}</option>
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

function SummaryCard({
  title,
  value,
  description,
  icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: ReactNode;
}) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start gap-4">
        <div className="rounded-2xl bg-primary/10 p-3 text-primary shadow-sm">{icon}</div>
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-medium text-muted-foreground">{title}</div>
          <div className="mt-2 text-[50px] font-bold leading-[50px] text-foreground">{value}</div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}

function CombinedMetricCard({
  title,
  firstLabel,
  firstValue,
  secondLabel,
  secondValue,
  description,
}: {
  title: string;
  firstLabel: string;
  firstValue: string;
  secondLabel: string;
  secondValue: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border bg-card p-6 shadow-sm transition-transform duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="mb-4 flex items-start gap-4">
        <div className="rounded-2xl bg-accent/20 p-3 text-secondary shadow-sm">
          <Users className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="text-[18px] font-medium text-muted-foreground">{title}</div>
          <div className="mt-2 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-primary/10 px-4 py-3">
              <div className="text-sm font-medium text-primary">{firstLabel}</div>
              <div className="mt-2 text-2xl font-bold leading-8 text-foreground">{firstValue}</div>
            </div>
            <div className="rounded-2xl bg-secondary/10 px-4 py-3">
              <div className="text-sm font-medium text-foreground">{secondLabel}</div>
              <div className="mt-2 text-2xl font-bold leading-8 text-foreground">{secondValue}</div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">{description}</div>
    </div>
  );
}

function HorizontalBarChart({
  title,
  subtitle,
  data,
  barColor,
  valueColorClass = "text-foreground",
  highlightLabel,
  highlightColor = "#DC2626",
  labelWidthClass = "md:w-[240px]",
}: {
  title: string;
  subtitle: string;
  data: Array<{ label: string; value: number; color?: string }>;
  barColor: string;
  valueColorClass?: string;
  highlightLabel?: string;
  highlightColor?: string;
  labelWidthClass?: string;
}) {
  return (
    <SectionCard title={title} subtitle={subtitle} icon={<TrendingUp className="h-5 w-5" />}>
      <div className="space-y-3">
        {data.map((item, index) => {
          const width = `${(item.value / 10) * 100}%`;
          const color = item.color ?? barColor;
          const isHighlight = highlightLabel === item.label;

          return (
            <div
              key={item.label}
              className="grid grid-cols-[minmax(0,1.25fr)_minmax(0,3fr)_56px] items-center gap-4"
              style={{ animationDelay: `${index * 40}ms` }}
            >
              <div className={`min-w-0 ${labelWidthClass}`}>
                <div className="truncate text-sm font-medium text-foreground">{item.label}</div>
              </div>
              <div className="h-4 rounded-full bg-muted/60 overflow-hidden">
                <div
                  className="h-4 rounded-full transition-all duration-700 ease-out"
                  style={{ width, backgroundColor: isHighlight ? highlightColor : color }}
                />
              </div>
              <div className={`text-right text-sm font-semibold ${valueColorClass}`}>{numberFormatter.format(item.value)}</div>
            </div>
          );
        })}
      </div>
    </SectionCard>
  );
}

function DonutChart({
  title,
  subtitle,
  data,
  hoverPrefix,
  formatHoverLabel,
}: {
  title: string;
  subtitle: string;
  data: Array<DonutSegment>;
  hoverPrefix: string;
  formatHoverLabel: (label: string) => string;
}) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  const radius = 72;
  const circumference = 2 * Math.PI * radius;
  let runningOffset = 0;
  const [tooltip, setTooltip] = useState<TooltipState>(null);

  return (
    <SectionCard title={title} subtitle={subtitle} icon={<PieChart className="h-5 w-5" />}>
      <div className="flex flex-col gap-4">
        <div className="relative mx-auto flex h-72 w-72 items-center justify-center">
          <svg viewBox="0 0 200 200" className="h-full w-full -rotate-90">
            {data.map((segment, index) => {
              const dashArray = (segment.value / total) * circumference;
              const dashOffset = runningOffset;
              runningOffset += dashArray;

              return (
                <circle
                  key={segment.label}
                  cx="100"
                  cy="100"
                  r={radius}
                  fill="none"
                  stroke={segment.color}
                  strokeWidth="24"
                  strokeDasharray={`${dashArray} ${circumference - dashArray}`}
                  strokeDashoffset={-dashOffset}
                  strokeLinecap="butt"
                  className="cursor-pointer transition-all duration-300"
                  onMouseEnter={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setTooltip({
                      title: `${hoverPrefix}${formatHoverLabel(segment.label)}`,
                      detail: `จำนวน ${integerFormatter.format(segment.value)} วิทยาลัย`,
                      x: rect.width / 2,
                      y: 0,
                    });
                  }}
                  onMouseMove={(event) => {
                    const rect = event.currentTarget.getBoundingClientRect();
                    setTooltip({
                      title: `${hoverPrefix}${formatHoverLabel(segment.label)}`,
                      detail: `จำนวน ${integerFormatter.format(segment.value)} วิทยาลัย`,
                      x: rect.width / 2,
                      y: 0,
                    });
                  }}
                  onMouseLeave={() => setTooltip(null)}
                  style={{ animationDelay: `${index * 80}ms`, opacity: 1, strokeOpacity: 1 }}
                />
              );
            })}
          </svg>
          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center rounded-full bg-transparent text-center">
            <div className="text-sm font-medium text-muted-foreground">{title}</div>
            <div className="mt-1 text-2xl font-bold text-foreground">{integerFormatter.format(total)}</div>
            <div className="text-xs text-muted-foreground">วิทยาลัย</div>
          </div>
          {tooltip ? (
            <div className="pointer-events-none absolute bottom-2 left-1/2 z-20 -translate-x-1/2 rounded-2xl bg-black px-3 py-2 text-sm font-medium text-white shadow-xl">
              <div>{tooltip.title}</div>
              <div>{tooltip.detail}</div>
            </div>
          ) : null}
        </div>
        <div className="flex flex-wrap items-center gap-4 rounded-2xl border bg-background/80 px-4 py-3 text-xs font-medium text-foreground">
          {data.map((segment) => (
            <div key={segment.label} className="flex items-center gap-2 whitespace-nowrap">
              <span className="h-3 w-3 rounded-full ring-2 ring-white/40" style={{ backgroundColor: segment.color }} />
              <span style={{ color: segment.color }}>{segment.label}</span>
            </div>
          ))}
        </div>
      </div>
    </SectionCard>
  );
}

export function DashboardRolePage() {
  const [districts, setDistricts] = useState<string[]>([]);
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedGrade, setSelectedGrade] = useState<MajorKey | "">("");
  const [selectedSubject, setSelectedSubject] = useState("");
  const [appliedFilters, setAppliedFilters] = useState({ district: "", grade: "", subject: "" });
  const [schoolTooltip, setSchoolTooltip] = useState<TooltipState>(null);
  const [areaTooltip, setAreaTooltip] = useState<TooltipState>(null);
  const [loadedSchools, setLoadedSchools] = useState<SchoolData[]>([]);
  const schoolChartRef = useRef<HTMLDivElement | null>(null);
  const areaChartRef = useRef<HTMLDivElement | null>(null);

  const majorOptions = useMemo(() => getMajors(), []);

  const subjectOptions = useMemo(() => {
    if (!selectedGrade) return [];
    return getSubjects(selectedGrade);
  }, [selectedGrade]);

  useEffect(() => {
    // Use the predefined province options instead of loading from workbook
    setDistricts(provinceOptions);
    setSelectedDistrict(provinceOptions[0] || "");
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      const data = await loadSchoolComparisonData();
      if (!cancelled) {
        setLoadedSchools(data);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const isSearchApplied = !!(appliedFilters.district || appliedFilters.grade || appliedFilters.subject);

  const activeDistrict = isSearchApplied ? appliedFilters.district : selectedDistrict;
  const activeGrade = isSearchApplied ? appliedFilters.grade : selectedGrade;
  const activeSubject = isSearchApplied ? appliedFilters.subject : selectedSubject;
  const activeSubjectKey = !activeSubject || activeSubject === "ทุกวิชา" ? null : getSubjectKey(activeSubject);
  // Always use the data from สพป.นครราชสีมา เขต 1 with all branches and subjects
  const displayGrade = activeGrade || "ทุกสาขาวิชา";
  const displaySubject = activeSubject || "ทุกวิชา";
  const selectionShift = getSelectionShift("สพป.นครราชสีมา เขต 1", displayGrade, displaySubject);
  const metricShift = getMetricShift("สพป.นครราชสีมา เขต 1", displayGrade, displaySubject);

  const schoolData = useMemo(() => {
    const dataToUse = loadedSchools.length > 0 ? loadedSchools : schoolRows;
    return dataToUse
      .map((row) => {
        const base = activeSubjectKey ? row[activeSubjectKey] : row.overall;
        return {
          label: row.name,
          value: Number((base + selectionShift).toFixed(1)),
        };
      })
      .sort((a, b) => b.value - a.value);
  }, [activeSubjectKey, selectionShift, loadedSchools]);

  const areaData = useMemo(() => {
    return areaRows.map((row) => {
      const base = activeSubjectKey ? row[activeSubjectKey] : row.overall;
      return {
        label: row.name,
        value: Number((base + metricShift).toFixed(1)),
      };
    });
  }, [activeSubjectKey, metricShift]);

  const sizeData = useMemo(() => {
    return sizeBuckets.map((item) => ({
      label: item.label,
      value: item.count,
      color: item.color,
    }));
  }, []);

  const stageData = useMemo(() => {
    return stageBuckets.map((item) => ({
      label: item.label,
      value: item.count,
      color: item.color,
    }));
  }, []);

  const summarySchoolTotal = 142;
  const summaryStudentTotal = 16860;
  const summaryTeacherTotal = 2091;
  const summaryAverage = 5.5;

  const handleSearch = () => {
    setAppliedFilters({
      district: selectedDistrict,
      grade: selectedGrade || "ทุกสาขาวิชา",
      subject: selectedSubject || "ทุกวิชา"
    });
  };

  const chartTitleSuffix = activeSubjectKey ? ` - วิชา${subjectShortLabels[activeSubjectKey]}` : "";
  const districtPlaceholder = "เลือกจังหวัด";

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-8">
        <section className="space-y-3">
          <div className="space-y-2">
            <div className="text-sm font-semibold uppercase tracking-[0.22em] text-primary">Dashboard</div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground md:text-4xl">ส่วนกลาง</h1>
            <div className="text-sm leading-7 text-muted-foreground md:text-base">
              ภาพรวมการติดตามวิทยาลัยในพื้นที่และรายงานสรุป
            </div>
          </div>

          <div className="rounded-3xl border bg-card/95 p-5 shadow-sm backdrop-blur">
            <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_minmax(0,1fr)_auto]">
              <FilterSelect
                label="จังหวัด"
                value={selectedDistrict}
                onChange={setSelectedDistrict}
                options={districts}
                placeholder={districtPlaceholder}
              />
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">สาขาวิชา</label>
                <select
                  value={selectedGrade}
                  onChange={(e) => {
                    setSelectedGrade(e.target.value as MajorKey | "");
                    setSelectedSubject("");
                  }}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">ทุกสาขาวิชา</option>
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
                  value={selectedSubject}
                  onChange={(e) => setSelectedSubject(e.target.value)}
                  disabled={!selectedGrade}
                  className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:bg-muted"
                >
                  <option value="">ทุกวิชา</option>
                  {!selectedGrade ? null : subjectOptions.length > 0 ? (
                    subjectOptions.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))
                  ) : null}
                </select>
              </div>
              <Button
                onClick={handleSearch}
                className="h-11 self-end rounded-full bg-secondary px-6 font-semibold text-secondary-foreground hover:bg-secondary/80"
              >
                <Search className="h-4 w-4" />
                ค้นหา
              </Button>
            </div>
          </div>
        </section>

        <section className="grid gap-5 lg:grid-cols-3">
          <SummaryCard
            title="วิทยาลัยทั้งหมด"
            value={isSearchApplied ? "8" : "—"}
            description=""
            icon={<School2 className="h-5 w-5" />}
          />
          <CombinedMetricCard
            title="นักเรียนทั้งหมด และ ครูทั้งหมด"
            firstLabel="นักเรียนทั้งหมด"
            firstValue={isSearchApplied ? "15,747 คน" : "—"}
            secondLabel="ครูทั้งหมด"
            secondValue={isSearchApplied ? "1,237 คน" : "—"}
            description=""
          />
          <SummaryCard
            title="คะแนนเฉลี่ยรวม"
            value={isSearchApplied ? "7.0" : "—"}
            description=""
            icon={<TrendingUp className="h-5 w-5" />}
          />
        </section>

        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)]">
          <SectionCard
            title={`คะแนนเฉลี่ยแต่ละวิทยาลัย${chartTitleSuffix}`}
            subtitle="เรียงจากคะแนนสูงสุดไปต่ำสุด"
            icon={<Building2 className="h-5 w-5" />}
          >
            <div ref={schoolChartRef} className="relative space-y-3 max-h-96 overflow-y-auto pr-2">
              {schoolData.map((item, index) => {
                const barColor = item.value >= 5 ? "#A9A29E" : "#F87171";
                const width = isSearchApplied ? `${(item.value / 10) * 100}%` : "0%";
                return (
                  <div key={item.label} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,3fr)_56px] items-center gap-4">
                    <div className="truncate text-sm font-medium text-foreground">
                      {isSearchApplied ? item.label : ""}
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-4 rounded-full transition-all duration-700 ease-out"
                        style={{ width, backgroundColor: barColor, animationDelay: isSearchApplied ? `${index * 40}ms` : "0ms" }}
                        onMouseEnter={(event) => {
                          if (!isSearchApplied) return;
                          const rect = schoolChartRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          setSchoolTooltip({
                            title: item.label,
                            detail: `มีคะแนนเฉลี่ย ${numberFormatter.format(item.value)} คะแนน`,
                            x: event.clientX - rect.left,
                            y: event.clientY - rect.top,
                          });
                        }}
                        onMouseMove={(event) => {
                          if (!isSearchApplied) return;
                          const rect = schoolChartRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          setSchoolTooltip({
                            title: item.label,
                            detail: `มีคะแนนเฉลี่ย ${numberFormatter.format(item.value)} คะแนน`,
                            x: event.clientX - rect.left,
                            y: event.clientY - rect.top,
                          });
                        }}
                        onMouseLeave={() => setSchoolTooltip(null)}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold text-foreground">
                      {isSearchApplied ? numberFormatter.format(item.value) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
            {schoolTooltip ? (
              <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-2xl bg-black px-3 py-2 text-sm font-medium text-white shadow-xl">
                <div>{schoolTooltip.title}</div>
                <div>{schoolTooltip.detail}</div>
              </div>
            ) : null}
          </SectionCard>

          <SectionCard
            title="คะแนนเฉลี่ยเทียบกับภูมิภาคอื่น"
            subtitle="เปรียบเทียบผลเฉลี่ยของแต่ละภูมิภาค"
            icon={<MapPin className="h-5 w-5" />}
          >
            <div ref={areaChartRef} className="relative space-y-3">
              {areaData.map((item, index) => {
                const isCurrent = item.label === "ภาคเหนือ";
                const barColor = isCurrent ? "#FFDE42" : item.value >= 5 ? "#A9A29E" : "#F87171";
                const width = isSearchApplied ? `${(item.value / 10) * 100}%` : "0%";

                return (
                  <div key={item.label} className="grid grid-cols-[minmax(0,1.4fr)_minmax(0,3fr)_56px] items-center gap-4">
                    <div className="truncate text-sm font-medium text-foreground">
                      {isSearchApplied ? item.label : ""}
                    </div>
                    <div className="h-4 overflow-hidden rounded-full bg-muted/60">
                      <div
                        className="h-4 rounded-full transition-all duration-700 ease-out"
                        style={{ width, backgroundColor: barColor, animationDelay: isSearchApplied ? `${index * 40}ms` : "0ms" }}
                        onMouseEnter={(event) => {
                          if (!isSearchApplied) return;
                          const rect = areaChartRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          setAreaTooltip({
                            title: item.label,
                            detail: `มีคะแนนเฉลี่ย ${numberFormatter.format(item.value)} คะแนน`,
                            x: event.clientX - rect.left,
                            y: event.clientY - rect.top,
                          });
                        }}
                        onMouseMove={(event) => {
                          if (!isSearchApplied) return;
                          const rect = areaChartRef.current?.getBoundingClientRect();
                          if (!rect) return;
                          setAreaTooltip({
                            title: item.label,
                            detail: `มีคะแนนเฉลี่ย ${numberFormatter.format(item.value)} คะแนน`,
                            x: event.clientX - rect.left,
                            y: event.clientY - rect.top,
                          });
                        }}
                        onMouseLeave={() => setAreaTooltip(null)}
                      />
                    </div>
                    <div className="text-right text-sm font-semibold text-foreground">
                      {isSearchApplied ? numberFormatter.format(item.value) : "—"}
                    </div>
                  </div>
                );
              })}
            </div>
            {areaTooltip ? (
              <div className="pointer-events-none absolute right-4 top-4 z-20 rounded-2xl bg-black px-3 py-2 text-sm font-medium text-white shadow-xl">
                <div>{areaTooltip.title}</div>
                <div>{areaTooltip.detail}</div>
              </div>
            ) : null}
          </SectionCard>
        </section>

        <section className="hidden grid gap-6 xl:grid-cols-2">
          <DonutChart
            title="ขนาดสถานศึกษา"
            subtitle="จำนวนวิทยาลัยตามขนาดสถานศึกษา"
            data={isSearchApplied ? sizeData : []}
            hoverPrefix=""
            formatHoverLabel={(label) => schoolSizeLabel(label)}
          />

          <DonutChart
            title="ช่วงชั้นที่เปิดสอน"
            subtitle="จำนวนวิทยาลัยตามช่วงชั้นที่เปิดสอน"
            data={isSearchApplied ? stageData : []}
            hoverPrefix=""
            formatHoverLabel={(label) => stageLabel(label)}
          />
        </section>
      </div>
    </DashboardLayout>
  );
}
