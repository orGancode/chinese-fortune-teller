import { useState } from "react";
import { Header } from "../components/Header";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { useBaziStore } from "../store/baziStore";
import { useHistoryStore } from "../store/historyStore";
import { baziCalculator } from "../utils/baziCalculator";
import {
  KNOWLEDGE_BASE,
  getNayin,
  getShishen,
  getGeju,
} from "../data/knowledgeBase";
import { LOCATION_DATA, getCityList } from "../data/locations";
import { Loader2 } from "lucide-react";

export function PaipanPage() {
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<0 | 1>(1);

  const { currentBazi, isLoading, error, calculateBazi } = useBaziStore();
  const { addToHistory } = useHistoryStore();

  const cityList = getCityList();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !birthTime || !location) return;

    const longitude = LOCATION_DATA[location] || 120.0;
    const input = {
      birthDate,
      birthTime,
      longitude,
      gender,
    };

    calculateBazi(input);

    // Add to history after a short delay to ensure calculation is complete
    setTimeout(() => {
      const result = useBaziStore.getState().currentBazi;
      if (result) {
        addToHistory(input, result);
      }
    }, 100);
  };

  const getElementColor = (element: string) => {
    const colors: Record<string, string> = {
      木: "bg-green-500",
      火: "bg-red-500",
      土: "bg-yellow-600",
      金: "bg-yellow-500",
      水: "bg-blue-500",
    };
    return colors[element] || "bg-gray-500";
  };

  const renderBaziTable = () => {
    if (!currentBazi) return null;

    const pillars = [
      { key: "year", label: "年柱" },
      { key: "month", label: "月柱" },
      { key: "day", label: "日柱" },
      { key: "hour", label: "时柱" },
    ];

    const dayMaster = currentBazi.day.charAt(0);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left font-medium text-gray-700">柱</th>
              <th className="p-2 text-center font-medium text-gray-700">天干</th>
              <th className="p-2 text-center font-medium text-gray-700">地支</th>
              <th className="p-2 text-center font-medium text-gray-700">藏干</th>
              <th className="p-2 text-center font-medium text-gray-700">十神</th>
            </tr>
          </thead>
          <tbody>
            {pillars.map((pillar) => {
              const ganZhi = currentBazi[pillar.key as keyof typeof currentBazi] as string;
              const gan = ganZhi.charAt(0);
              const zhi = ganZhi.charAt(1);
              const cangGan = baziCalculator.getCangGan(zhi);
              const ganElement = KNOWLEDGE_BASE.TIANGAN[gan]?.element || "";
              const zhiElement = KNOWLEDGE_BASE.DIZHI[zhi]?.element || "";
              const shishen = getShishen(dayMaster, gan);

              return (
                <tr key={pillar.key} className="border-b border-gray-100">
                  <td className="p-2 font-medium">{pillar.label}</td>
                  <td className="p-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${getElementColor(ganElement)}`}
                    >
                      {gan}
                    </span>
                  </td>
                  <td className="p-2 text-center">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-white font-bold ${getElementColor(zhiElement)}`}
                    >
                      {zhi}
                    </span>
                  </td>
                  <td className="p-2 text-center text-xs">
                    {cangGan.map((cg, idx) => (
                      <span key={idx} className="mr-1">
                        {cg}
                      </span>
                    ))}
                  </td>
                  <td className="p-2 text-center">
                    <span className="text-xs font-medium text-gray-600">
                      {shishen}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  const renderWuxingAnalysis = () => {
    if (!currentBazi) return null;

    const wuxingCount = baziCalculator.calculateWuxing(currentBazi);
    const elements = ["木", "火", "土", "金", "水"];

    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {elements.map((element) => {
            const count = wuxingCount[element as keyof typeof wuxingCount];
            return (
              <div
                key={element}
                className={`px-3 py-2 rounded-lg text-white font-medium text-sm ${getElementColor(element)}`}
              >
                {element}: {count}个
              </div>
            );
          })}
        </div>
        <p className="text-sm text-gray-600">
          五行分析：根据八字中五行分布情况，了解命局五行强弱。
        </p>
      </div>
    );
  };

  const renderShishenAnalysis = () => {
    if (!currentBazi) return null;

    const dayMaster = currentBazi.day.charAt(0);
    const allStems = [
      currentBazi.year.charAt(0),
      currentBazi.month.charAt(0),
      currentBazi.day.charAt(0),
      currentBazi.hour.charAt(0),
    ];

    const shishenCount: Record<string, number> = {};
    allStems.forEach((stem) => {
      const shishen = getShishen(dayMaster, stem);
      shishenCount[shishen] = (shishenCount[shishen] || 0) + 1;
    });

    return (
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(shishenCount).map(([shishen, count]) => {
            const desc = KNOWLEDGE_BASE.SHISHEN_DESC[shishen];
            return (
              <div key={shishen} className="p-2 bg-gray-50 rounded-lg">
                <div className="font-medium text-[#e74c3c]">{shishen}</div>
                <div className="text-xs text-gray-500">
                  出现 {count} 次
                  {desc && ` · ${desc.desc}`}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderGejuAnalysis = () => {
    if (!currentBazi) return null;

    const geju = getGeju(currentBazi);
    const gejuInfo = KNOWLEDGE_BASE.GEJU[geju];

    return (
      <div className="space-y-3">
        <div className="text-xl font-bold text-[#e74c3c]">{geju}</div>
        {gejuInfo && (
          <>
            <p className="text-sm text-gray-700">{gejuInfo.desc}</p>
            <p className="text-sm text-gray-600">{gejuInfo.detail}</p>
            <div className="mt-3 space-y-2">
              <div>
                <span className="text-sm font-medium text-gray-700">
                  适合职业：
                </span>
                <span className="text-sm text-gray-600">{gejuInfo.career}</span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-700">
                  性格特点：
                </span>
                <span className="text-sm text-gray-600">
                  {gejuInfo.personality}
                </span>
              </div>
            </div>
          </>
        )}
      </div>
    );
  };

  const renderDayMasterAnalysis = () => {
    if (!currentBazi) return null;

    const dayMaster = currentBazi.day.charAt(0);
    const dayMasterInfo = KNOWLEDGE_BASE.DAY_MASTER[dayMaster];

    return (
      <div className="space-y-3">
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center justify-center w-12 h-12 rounded-full text-white text-xl font-bold ${getElementColor(
              dayMasterInfo?.element || ""
            )}`}
          >
            {dayMaster}
          </span>
          <div>
            <div className="font-bold text-lg">
              {dayMaster}日主
              {dayMasterInfo && (
                <span className="text-sm font-normal text-gray-500 ml-2">
                  ({dayMasterInfo.element} · {dayMasterInfo.nature})
                </span>
              )}
            </div>
          </div>
        </div>
        {dayMasterInfo && (
          <p className="text-sm text-gray-600">{dayMasterInfo.desc}</p>
        )}
      </div>
    );
  };

  const renderNayin = () => {
    if (!currentBazi) return null;

    const nayin = {
      year: getNayin(currentBazi.year),
      month: getNayin(currentBazi.month),
      day: getNayin(currentBazi.day),
      hour: getNayin(currentBazi.hour),
    };

    return (
      <div className="grid grid-cols-2 gap-3">
        {Object.entries(nayin).map(([key, value]) => (
          <div key={key} className="p-2 bg-gray-50 rounded-lg text-center">
            <div className="text-xs text-gray-500 mb-1">
              {key === "year" && "年柱"}
              {key === "month" && "月柱"}
              {key === "day" && "日柱"}
              {key === "hour" && "时柱"}
            </div>
            <div className="font-medium text-gray-800">{value}</div>
          </div>
        ))}
      </div>
    );
  };

  const renderDayun = () => {
    if (!currentBazi) return null;

    const dayun = baziCalculator.calculateDaYun(currentBazi, gender);

    return (
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50">
              <th className="p-2 text-left font-medium text-gray-700">序号</th>
              <th className="p-2 text-center font-medium text-gray-700">
                大运干支
              </th>
              <th className="p-2 text-center font-medium text-gray-700">
                起始年龄
              </th>
              <th className="p-2 text-center font-medium text-gray-700">
                结束年龄
              </th>
            </tr>
          </thead>
          <tbody>
            {dayun.map((item) => (
              <tr key={item.order} className="border-b border-gray-100">
                <td className="p-2">第{item.order}运</td>
                <td className="p-2 text-center font-medium">
                  {item.ganZhi}
                </td>
                <td className="p-2 text-center">{item.startAge}岁</td>
                <td className="p-2 text-center">{item.endAge}岁</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderLiunian = () => {
    if (!currentBazi) return null;

    const currentYear = new Date().getFullYear();
    const liunian = baziCalculator.calculateLiuNian(currentBazi, currentYear, 10);

    return (
      <div className="grid grid-cols-5 gap-2">
        {liunian.map((item) => (
          <div key={item.year} className="p-2 bg-gray-50 rounded-lg text-center">
            <div className="text-xs text-gray-500">{item.year}年</div>
            <div className="font-medium text-gray-800 mt-1">{item.ganZhi}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="八字排盘" subtitle="输入生辰八字进行测算" />
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Input Form */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>出生信息</CardTitle>
            <CardDescription>请填写您的出生信息以进行八字排盘</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  出生日期
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  出生时间
                </label>
                <input
                  type="time"
                  value={birthTime}
                  onChange={(e) => setBirthTime(e.target.value)}
                  className="w-full h-10 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#e74c3c] focus:border-transparent"
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  出生地点
                </label>
                <Select value={location} onValueChange={setLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="请选择出生城市" />
                  </SelectTrigger>
                  <SelectContent className="max-h-64">
                    {cityList.map((city) => (
                      <SelectItem key={city} value={city}>
                        {city}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500">
                  用于真太阳时校正，确保时辰准确
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">性别</label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={1}
                      checked={gender === 1}
                      onChange={() => setGender(1)}
                      className="w-4 h-4 text-[#e74c3c] focus:ring-[#e74c3c]"
                    />
                    <span>男</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      name="gender"
                      value={0}
                      checked={gender === 0}
                      onChange={() => setGender(0)}
                      className="w-4 h-4 text-[#e74c3c] focus:ring-[#e74c3c]"
                    />
                    <span>女</span>
                  </label>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                disabled={isLoading || !birthDate || !birthTime || !location}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    计算中...
                  </>
                ) : (
                  "开始排盘"
                )}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg">
                  {error}
                </div>
              )}
            </form>
          </CardContent>
        </Card>

        {/* Results Section */}
        {currentBazi && (
          <div className="space-y-6">
            {/* Basic Info Card */}
            <Card>
              <CardHeader>
                <CardTitle>基本信息</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-500">公历</span>
                    <p className="font-medium">{currentBazi.solarDate}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">农历</span>
                    <p className="font-medium">-</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">生肖</span>
                    <p className="font-medium">
                      {KNOWLEDGE_BASE.ZODIAC[
                        (parseInt(currentBazi.year.slice(1)) - 4) % 12
                      ] || "-"}
                    </p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-500">时辰</span>
                    <p className="font-medium">{currentBazi.shiChen}时</p>
                  </div>
                </div>
                {currentBazi.timeAdjusted && (
                  <div className="mt-4 p-3 bg-yellow-50 rounded-lg">
                    <p className="text-sm text-yellow-700">
                      <strong>真太阳时校正：</strong>
                      已根据经度进行真太阳时校正，确保时辰准确。
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Bazi Table */}
            <Card>
              <CardHeader>
                <CardTitle>八字排盘</CardTitle>
              </CardHeader>
              <CardContent>{renderBaziTable()}</CardContent>
            </Card>

            {/* Day Master Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>日主分析</CardTitle>
              </CardHeader>
              <CardContent>{renderDayMasterAnalysis()}</CardContent>
            </Card>

            {/* WuXing Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>五行分析</CardTitle>
              </CardHeader>
              <CardContent>{renderWuxingAnalysis()}</CardContent>
            </Card>

            {/* ShiShen Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>十神分析</CardTitle>
              </CardHeader>
              <CardContent>{renderShishenAnalysis()}</CardContent>
            </Card>

            {/* GeJu Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>格局分析</CardTitle>
              </CardHeader>
              <CardContent>{renderGejuAnalysis()}</CardContent>
            </Card>

            {/* NaYin */}
            <Card>
              <CardHeader>
                <CardTitle>纳音五行</CardTitle>
              </CardHeader>
              <CardContent>{renderNayin()}</CardContent>
            </Card>

            {/* DaYun */}
            <Card>
              <CardHeader>
                <CardTitle>大运走势</CardTitle>
              </CardHeader>
              <CardContent>{renderDayun()}</CardContent>
            </Card>

            {/* LiuNian */}
            <Card>
              <CardHeader>
                <CardTitle>近期流年</CardTitle>
              </CardHeader>
              <CardContent>{renderLiunian()}</CardContent>
            </Card>
          </div>
        )}
      </main>
    </div>
  );
}
