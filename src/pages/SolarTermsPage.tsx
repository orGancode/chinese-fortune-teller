import { useState, useEffect } from "react";
import { Card } from "react-vant";
import { CalendarGrid } from "../components/CalendarGrid";
import lunisolar from "lunisolar";
import { Sun, ArrowRight, Clock, Leaf, Snowflake, Flame, type LucideIcon } from "lucide-react";

// 二十四节气数据（公历日期）
const SOLAR_TERMS_DATA = [
  { name: "立春", month: 2, day: 4, season: "spring", description: "春季开始，万物复苏" },
  { name: "雨水", month: 2, day: 19, season: "spring", description: "降雨开始，雨量渐增" },
  { name: "惊蛰", month: 3, day: 5, season: "spring", description: "春雷乍动，惊醒蛰虫" },
  { name: "春分", month: 3, day: 20, season: "spring", description: "昼夜平分，春季中点" },
  { name: "清明", month: 4, day: 4, season: "spring", description: "天气清朗，草木繁茂" },
  { name: "谷雨", month: 4, day: 20, season: "spring", description: "雨生百谷，雨量充足" },
  { name: "立夏", month: 5, day: 5, season: "summer", description: "夏季开始，作物生长" },
  { name: "小满", month: 5, day: 21, season: "summer", description: "麦类饱满，尚未成熟" },
  { name: "芒种", month: 6, day: 5, season: "summer", description: "麦类成熟，夏种开始" },
  { name: "夏至", month: 6, day: 21, season: "summer", description: "白昼最长，炎热将至" },
  { name: "小暑", month: 7, day: 7, season: "summer", description: "气候开始炎热" },
  { name: "大暑", month: 7, day: 22, season: "summer", description: "一年中最热的时候" },
  { name: "立秋", month: 8, day: 7, season: "autumn", description: "秋季开始，暑去凉来" },
  { name: "处暑", month: 8, day: 23, season: "autumn", description: "暑气结束，天气转凉" },
  { name: "白露", month: 9, day: 7, season: "autumn", description: "天气转凉，露凝而白" },
  { name: "秋分", month: 9, day: 23, season: "autumn", description: "昼夜平分，秋季中点" },
  { name: "寒露", month: 10, day: 8, season: "autumn", description: "气温下降，露水更凉" },
  { name: "霜降", month: 10, day: 23, season: "autumn", description: "天气渐冷，初霜出现" },
  { name: "立冬", month: 11, day: 7, season: "winter", description: "冬季开始，万物收藏" },
  { name: "小雪", month: 11, day: 22, season: "winter", description: "开始降雪，雪量较小" },
  { name: "大雪", month: 12, day: 7, season: "winter", description: "雪量增大，地面积雪" },
  { name: "冬至", month: 12, day: 21, season: "winter", description: "白昼最短，寒冷开始" },
  { name: "小寒", month: 1, day: 5, season: "winter", description: "气候开始寒冷" },
  { name: "大寒", month: 1, day: 20, season: "winter", description: "一年中最冷的时候" },
];

const SEASON_CONFIG: Record<string, { color: string; bgColor: string; borderColor: string; icon: LucideIcon; label: string; }> = {
  spring: { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200", icon: Leaf, label: "春" },
  summer: { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200", icon: Flame, label: "夏" },
  autumn: { color: "text-amber-600", bgColor: "bg-amber-50", borderColor: "border-amber-200", icon: Sun, label: "秋" },
  winter: { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200", icon: Snowflake, label: "冬" },
};

// 获取当前节气
function getCurrentSolarTerm(date: Date): string | null {
  try {
    const lsr = lunisolar(date);
    const term = lsr.solarTerm;
    if (term) {
      return typeof term === "string" ? term : String(term);
    }
    return null;
  } catch (error) {
    console.error("Error getting current solar term:", error);
    return null;
  }
}

// 获取下一个节气信息
function getNextSolarTerm(date: Date): { term: typeof SOLAR_TERMS_DATA[0]; daysUntil: number } | null {
  const currentYear = date.getFullYear();
  
  for (let i = 0; i < 24; i++) {
    const termData = SOLAR_TERMS_DATA[i];
    const termDate = new Date(currentYear, termData.month - 1, termData.day);
    
    if (termDate > date) {
      const daysUntil = Math.ceil((termDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
      return { term: termData, daysUntil };
    }
  }
  
  // 如果今年已经没有更多节气，返回明年的立春
  const nextYearFirstTerm = SOLAR_TERMS_DATA[0];
  const nextTermDate = new Date(currentYear + 1, nextYearFirstTerm.month - 1, nextYearFirstTerm.day);
  const daysUntil = Math.ceil((nextTermDate.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  return { term: nextYearFirstTerm, daysUntil };
}

// 获取当前季节
function getCurrentSeason(date: Date): keyof typeof SEASON_CONFIG {
  const month = date.getMonth() + 1;
  if (month >= 3 && month <= 5) return "spring";
  if (month >= 6 && month <= 8) return "summer";
  if (month >= 9 && month <= 11) return "autumn";
  return "winter";
}

// 获取日期的节气标签（用于日历显示）
function getSolarTermLabel(date: Date): string | null {
  try {
    const lsr = lunisolar(date);
    const term = lsr.solarTerm;
    // solarTerm 可能是对象，需要转换为字符串
    if (term) {
      return typeof term === "string" ? term : String(term);
    }
    return null;
  } catch (error) {
    console.error("Error getting solar term:", error);
    return null;
  }
}

// 格式化日期
function formatDate(month: number, day: number): string {
  return `${month}月${day}日`;
}

export function SolarTermsPage() {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [currentTerm, setCurrentTerm] = useState<string | null>(null);
  const [nextTerm, setNextTerm] = useState<{ term: typeof SOLAR_TERMS_DATA[0]; daysUntil: number } | null>(null);
  const [currentSeason, setCurrentSeason] = useState<keyof typeof SEASON_CONFIG>("spring");

  useEffect(() => {
    const term = getCurrentSolarTerm(currentDate);
    setCurrentTerm(term);
    setNextTerm(getNextSolarTerm(currentDate));
    setCurrentSeason(getCurrentSeason(currentDate));
  }, [currentDate]);

  const handleDateSelect = (date: Date) => {
    setCurrentDate(date);
  };

  const handleGoToToday = () => {
    const today = new Date();
    setCurrentDate(today);
  };

  const seasonConfig = SEASON_CONFIG[currentSeason];
  const SeasonIcon = seasonConfig.icon;

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Calendar Grid */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="font-medium">选择日期</h3>
            <p className="text-sm text-gray-500 mt-1">点击日历查看任意日期的节气信息</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <CalendarGrid
              selectedDate={currentDate}
              onDateSelect={handleDateSelect}
              getDayLabel={getSolarTermLabel}
              showTodayButton={true}
              onGoToToday={handleGoToToday}
              showTodayIndicator={false}
            />
          </Card.Body>
        </Card>

        {/* Current Solar Term */}
        {currentTerm ? (
          <Card style={{ marginBottom: 24, backgroundColor: "#f0fdf4", border: "2px solid #bbf7d0" }}>
            <div className="p-4 pb-2">
              <h3 className={`flex items-center gap-2 font-medium ${seasonConfig.color}`}>
                <Sun className="w-6 h-6" />
                当前节气
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="text-center py-4">
                <div className={`text-5xl font-bold ${seasonConfig.color} mb-2`}>
                  {currentTerm}
                </div>
                <p className="text-gray-600">
                  {SOLAR_TERMS_DATA.find(t => t.name === currentTerm)?.description}
                </p>
              </div>
            </Card.Body>
          </Card>
        ) : (
          <Card style={{ marginBottom: 24, backgroundColor: "#f9fafb", border: "2px solid #e5e7eb" }}>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 font-medium text-gray-600">
                <Clock className="w-6 h-6" />
                当前非节气日
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <p className="text-gray-500 text-center">
                今天不是二十四节气之一，距离下一个节气还有一段时间
              </p>
            </Card.Body>
          </Card>
        )}

        {/* Next Solar Term */}
        {nextTerm && (
          <Card style={{ marginBottom: 24, borderLeft: "4px solid #C41E3A" }}>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <ArrowRight className="w-5 h-5 text-[#C41E3A]" />
                下一个节气
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-800">
                    {nextTerm.term.name}
                  </div>
                  <p className="text-sm text-gray-500 mt-1">
                    {formatDate(nextTerm.term.month, nextTerm.term.day)}
                  </p>
                  <p className="text-sm text-gray-600 mt-2">
                    {nextTerm.term.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-3xl font-bold text-[#C41E3A]">
                    {nextTerm.daysUntil}
                  </div>
                  <p className="text-sm text-gray-500">天后</p>
                </div>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* Current Season Info */}
        <Card style={{ marginBottom: 24, backgroundColor: seasonConfig.bgColor.replace('bg-', '').replace('50', '100') === 'green' ? '#f0fdf4' : seasonConfig.bgColor.replace('bg-', '').replace('50', '100') === 'red' ? '#fef2f2' : seasonConfig.bgColor.replace('bg-', '').replace('50', '100') === 'amber' ? '#fffbeb' : '#eff6ff' }}>
          <div className="p-4 pb-2">
            <h3 className={`flex items-center gap-2 font-medium ${seasonConfig.color}`}>
              <SeasonIcon className="w-5 h-5" />
              当前季节：{seasonConfig.label}季
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <p className="text-gray-600">
              {currentSeason === "spring" && "春季是万物复苏的季节，五行属木，主生发。"}
              {currentSeason === "summer" && "夏季是万物生长的季节，五行属火，主繁茂。"}
              {currentSeason === "autumn" && "秋季是收获的季节，五行属金，主收敛。"}
              {currentSeason === "winter" && "冬季是收藏的季节，五行属水，主闭藏。"}
            </p>
          </Card.Body>
        </Card>

        {/* All Solar Terms - Compact Layout */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <div className="flex items-center justify-between">
              <h3 className="font-medium">二十四节气一览</h3>
              <div className="flex items-center gap-3 text-xs">
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>春
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-red-500"></span>夏
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-amber-500"></span>秋
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>冬
                </span>
              </div>
            </div>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="grid grid-cols-6 gap-2">
              {SOLAR_TERMS_DATA.map((term) => {
                const isCurrent = term.name === currentTerm;
                const termSeason = SEASON_CONFIG[term.season];
                
                return (
                  <div
                    key={term.name}
                    className={`flex flex-col items-center justify-center py-2 px-1 rounded-lg border transition-all ${
                      isCurrent
                        ? `${termSeason.bgColor} ${termSeason.borderColor} border-2 shadow-sm`
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    <span className={`text-xs font-medium ${isCurrent ? termSeason.color : "text-gray-700"}`}>
                      {term.name}
                    </span>
                    <span className="text-[10px] text-gray-400 mt-0.5">
                      {term.month}/{term.day}
                    </span>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
