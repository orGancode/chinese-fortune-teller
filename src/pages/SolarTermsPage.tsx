import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import lunisolar from "lunisolar";
import { Sun, Calendar, ArrowRight, Clock, Leaf, Snowflake, Flame, type LucideIcon } from "lucide-react";

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
  const lsr = lunisolar(date);
  return lsr.solarTerm || null;
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const date = new Date(e.target.value);
    if (!isNaN(date.getTime())) {
      setCurrentDate(date);
    }
  };

  const seasonConfig = SEASON_CONFIG[currentSeason];
  const SeasonIcon = seasonConfig.icon;

  return (
    <div className="flex flex-col h-full">
      <Header title="节气" subtitle="二十四节气时间表" />
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Date Selector */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#e74c3c]" />
              选择日期
            </CardTitle>
            <CardDescription>查看任意日期的节气信息</CardDescription>
          </CardHeader>
          <CardContent>
            <input
              type="date"
              value={currentDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
              className="w-full h-12 px-4 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent text-lg"
            />
          </CardContent>
        </Card>

        {/* Current Solar Term */}
        {currentTerm ? (
          <Card className={`mb-6 ${seasonConfig.bgColor} ${seasonConfig.borderColor} border-2`}>
            <CardHeader>
              <CardTitle className={`flex items-center gap-2 ${seasonConfig.color}`}>
                <Sun className="w-6 h-6" />
                当前节气
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-4">
                <div className={`text-5xl font-bold ${seasonConfig.color} mb-2`}>
                  {currentTerm}
                </div>
                <p className="text-gray-600">
                  {SOLAR_TERMS_DATA.find(t => t.name === currentTerm)?.description}
                </p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="mb-6 bg-gray-50 border-gray-200 border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-600">
                <Clock className="w-6 h-6" />
                当前非节气日
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center">
                今天不是二十四节气之一，距离下一个节气还有一段时间
              </p>
            </CardContent>
          </Card>
        )}

        {/* Next Solar Term */}
        {nextTerm && (
          <Card className="mb-6 border-l-4 border-l-[#e74c3c]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <ArrowRight className="w-5 h-5 text-[#e74c3c]" />
                下一个节气
              </CardTitle>
            </CardHeader>
            <CardContent>
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
                  <div className="text-3xl font-bold text-[#e74c3c]">
                    {nextTerm.daysUntil}
                  </div>
                  <p className="text-sm text-gray-500">天后</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Current Season Info */}
        <Card className={`mb-6 ${seasonConfig.bgColor}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${seasonConfig.color}`}>
              <SeasonIcon className="w-5 h-5" />
              当前季节：{seasonConfig.label}季
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              {currentSeason === "spring" && "春季是万物复苏的季节，五行属木，主生发。"}
              {currentSeason === "summer" && "夏季是万物生长的季节，五行属火，主繁茂。"}
              {currentSeason === "autumn" && "秋季是收获的季节，五行属金，主收敛。"}
              {currentSeason === "winter" && "冬季是收藏的季节，五行属水，主闭藏。"}
            </p>
          </CardContent>
        </Card>

        {/* All Solar Terms */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>二十四节气一览</CardTitle>
            <CardDescription>全年节气时间表</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {SOLAR_TERMS_DATA.map((term) => {
                const isCurrent = term.name === currentTerm;
                const termSeason = SEASON_CONFIG[term.season];
                
                return (
                  <div
                    key={term.name}
                    className={`p-3 rounded-lg border transition-all ${
                      isCurrent
                        ? `${termSeason.bgColor} ${termSeason.borderColor} border-2 shadow-md`
                        : "bg-white border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${isCurrent ? termSeason.color : "text-gray-700"}`}>
                        {term.name}
                      </span>
                      <span className="text-xs text-gray-400">
                        {formatDate(term.month, term.day)}
                      </span>
                    </div>
                    {isCurrent && (
                      <div className={`text-xs mt-1 ${termSeason.color}`}>
                        当前节气
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Season Legend */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">季节图例</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-green-100 border border-green-200"></div>
                <span className="text-sm text-gray-600">春季（立春-谷雨）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-red-100 border border-red-200"></div>
                <span className="text-sm text-gray-600">夏季（立夏-大暑）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-amber-100 border border-amber-200"></div>
                <span className="text-sm text-gray-600">秋季（立秋-霜降）</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded bg-blue-100 border border-blue-200"></div>
                <span className="text-sm text-gray-600">冬季（立冬-大寒）</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
