import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Card, DatetimePicker, Field } from "react-vant";
import lunisolar from "lunisolar";
import { Calendar, Sparkles, Sun, Moon, Clock } from "lucide-react";

// 星期映射
const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

// 生肖映射
const ZODIAC_ANIMALS = ["鼠", "牛", "虎", "兔", "龙", "蛇", "马", "羊", "猴", "鸡", "狗", "猪"];

// 天干
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];

// 地支
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 农历月份名称
const LUNAR_MONTHS = [
  "正月", "二月", "三月", "四月", "五月", "六月",
  "七月", "八月", "九月", "十月", "冬月", "腊月"
];

// 农历日期名称
const LUNAR_DAYS = [
  "初一", "初二", "初三", "初四", "初五", "初六", "初七", "初八", "初九", "初十",
  "十一", "十二", "十三", "十四", "十五", "十六", "十七", "十八", "十九", "二十",
  "廿一", "廿二", "廿三", "廿四", "廿五", "廿六", "廿七", "廿八", "廿九", "三十"
];

// 计算农历年月日
function getLunarDate(date: Date) {
  const lsr = lunisolar(date);
  const lunar = lsr.lunar;
  
  const year = lunar.year;
  const month = lunar.month;
  const day = lunar.day;
  const isLeap = lunar.isLeap;
  
  return {
    year,
    month,
    day,
    isLeap,
    yearStr: `${year}年`,
    monthStr: (isLeap ? "闰" : "") + LUNAR_MONTHS[month - 1],
    dayStr: LUNAR_DAYS[day - 1],
    fullStr: `${year}年 ${(isLeap ? "闰" : "") + LUNAR_MONTHS[month - 1]}${LUNAR_DAYS[day - 1]}`,
  };
}

// 获取生肖
function getZodiac(year: number): string {
  // 农历年份对应生肖 (1900年是鼠年)
  const index = (year - 4) % 12;
  const adjustedIndex = index >= 0 ? index : index + 12;
  return ZODIAC_ANIMALS[adjustedIndex];
}

// 计算年干支
function getYearGanZhi(year: number): string {
  const ganIndex = (year - 4) % 10;
  const zhiIndex = (year - 4) % 12;
  const adjustedGan = ganIndex >= 0 ? ganIndex : ganIndex + 10;
  const adjustedZhi = zhiIndex >= 0 ? zhiIndex : zhiIndex + 12;
  return TIANGAN[adjustedGan] + DIZHI[adjustedZhi];
}

// 获取节气
function getSolarTerm(date: Date): string | null {
  const lsr = lunisolar(date);
  const term = lsr.solarTerm;
  return term || null;
}

// 计算周数
function getWeekNumber(date: Date): number {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil((((d.getTime() - yearStart.getTime()) / 86400000) + 1) / 7);
}

// 格式化公历日期
function formatGregorianDate(date: Date): string {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [lunarInfo, setLunarInfo] = useState<ReturnType<typeof getLunarDate> | null>(null);
  const [zodiac, setZodiac] = useState<string>("");
  const [yearGanZhi, setYearGanZhi] = useState<string>("");
  const [solarTerm, setSolarTerm] = useState<string | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [weekNumber, setWeekNumber] = useState<number>(0);

  useEffect(() => {
    const lunar = getLunarDate(selectedDate);
    setLunarInfo(lunar);
    setZodiac(getZodiac(lunar.year));
    setYearGanZhi(getYearGanZhi(lunar.year));
    setSolarTerm(getSolarTerm(selectedDate));
    setWeekday(WEEKDAYS[selectedDate.getDay()]);
    setWeekNumber(getWeekNumber(selectedDate));
  }, [selectedDate]);


  // 格式化日期为input需要的格式
  const formatDateForInput = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="万年历" subtitle="公历农历转换查询" />
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Date Picker Card */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Calendar className="w-5 h-5 text-[#C41E3A]" />
              选择日期
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="space-y-2">
              <DatetimePicker
                popup={{
                  round: true,
                }}
                title='选择年月日'
                type='date'
                minDate={new Date(2020, 0, 1)}
                maxDate={new Date(2025, 10, 1)}
                value={selectedDate}
                onChange={setSelectedDate}
              >
                {(val: Date, _: any, actions: any) => {
                  return (
                    <Field
                      readOnly
                      clickable
                      label='选择年月日'
                      value={val.toLocaleDateString()}
                      placeholder='点击选择要查询的日期'
                      onClick={() => actions.open()}
                    />
                  )
                }}
              </DatetimePicker>
            </div>
          </Card.Body>
        </Card>

        {/* Gregorian Date Display */}
        <Card style={{ marginBottom: 16, borderLeft: "4px solid #C41E3A" }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Sun className="w-5 h-5 text-[#C41E3A]" />
              公历日期
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="space-y-3">
              <div className="text-2xl font-bold text-gray-800">
                {formatGregorianDate(selectedDate)}
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {weekday}
                </span>
                <span>第 {weekNumber} 周</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Lunar Date Display */}
        <Card style={{ marginBottom: 16, borderLeft: "4px solid #DAA520" }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Moon className="w-5 h-5 text-[#DAA520]" />
              农历日期
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            {lunarInfo && (
              <div className="space-y-3">
                <div className="text-2xl font-bold text-gray-800">
                  {lunarInfo.fullStr}
                </div>
                <div className="flex items-center gap-4 text-sm text-gray-600">
                  <span>干支：{yearGanZhi}年</span>
                  {lunarInfo.isLeap && (
                    <span className="px-2 py-1 bg-[#DAA520]/10 text-[#8B4513] rounded-full text-xs">
                      闰月
                    </span>
                  )}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Additional Info Grid */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          {/* Zodiac */}
          <Card>
            <div className="p-4 pb-2">
              <h3 className="text-base flex items-center gap-2 font-medium">
                <Sparkles className="w-4 h-4 text-[#DAA520]" />
                生肖
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="text-3xl font-bold text-[#C41E3A]">
                {zodiac}年
              </div>
            </Card.Body>
          </Card>

          {/* Week Number */}
          <Card>
            <div className="p-4 pb-2">
              <h3 className="text-base flex items-center gap-2 font-medium">
                <Clock className="w-4 h-4 text-[#8B4513]" />
                周数
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="text-3xl font-bold text-[#8B4513]">
                第 {weekNumber} 周
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Solar Term */}
        {solarTerm && (
          <Card style={{ marginBottom: 16, borderLeft: "4px solid #8B4513" }}>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Sun className="w-5 h-5 text-[#8B4513]" />
                今日节气
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="text-2xl font-bold text-[#8B4513]">
                {solarTerm}
              </div>
              <p className="text-sm text-gray-500 mt-2">
                二十四节气之一，是传统农耕文化的重要组成部分
              </p>
            </Card.Body>
          </Card>
        )}

        {/* Summary Card */}
        <Card style={{ background: "linear-gradient(to bottom right, rgba(196, 30, 58, 0.05), rgba(218, 165, 32, 0.1))" }}>
          <div className="p-4 pb-2">
            <h3 className="font-medium">日期概览</h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">公历</span>
                <span className="font-medium">{formatGregorianDate(selectedDate)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">农历</span>
                <span className="font-medium">{lunarInfo?.fullStr}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">星期</span>
                <span className="font-medium">{weekday}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">生肖</span>
                <span className="font-medium">{zodiac}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">干支</span>
                <span className="font-medium">{yearGanZhi}年</span>
              </div>
              {solarTerm && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-500">节气</span>
                  <span className="font-medium text-[#C41E3A]">{solarTerm}</span>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
