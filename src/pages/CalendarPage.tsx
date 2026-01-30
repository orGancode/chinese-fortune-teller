import { useState, useEffect } from "react";
import { Header } from "../components/Header";
import { Card, Tag } from "react-vant";
import lunisolar from "lunisolar";
import { Calendar, Sparkles, Sun, Moon, Clock, Compass, Star, Shield, Timer, ChevronLeft, ChevronRight } from "lucide-react";
import {
  JIANCHU,
  XIUS,
  PENGZU,
  getJianChu,
  getXiu,
  getPengZu,
  getYiJi,
  getShiChenHuangLi,
} from "../data/knowledgeBase";

// 星期映射
const WEEKDAYS = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];

// 日历星期标题
const CALENDAR_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

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

// 获取某月的天数
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// 获取某月第一天是星期几 (0 = 周日)
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

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

// 获取农历日期的简短显示（用于日历格子）
function getLunarDayShort(date: Date): string {
  const lsr = lunisolar(date);
  const lunar = lsr.lunar;
  const day = lunar.day;
  const month = lunar.month;
  const isLeap = lunar.isLeap;
  
  // 如果是初一，显示月份
  if (day === 1) {
    return (isLeap ? "闰" : "") + LUNAR_MONTHS[month - 1];
  }
  
  return LUNAR_DAYS[day - 1];
}

// 判断是否是同一天
function isSameDay(date1: Date, date2: Date): boolean {
  return date1.getFullYear() === date2.getFullYear() &&
         date1.getMonth() === date2.getMonth() &&
         date1.getDate() === date2.getDate();
}

// 判断是否是今天
function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
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

// 计算日干支（简化算法）
function getDayGanZhi(date: Date): string {
  const baseDate = new Date(1900, 0, 31); // 1900年1月31日是甲辰日
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const ganIndex = (diffDays % 10 + 10) % 10;
  const zhiIndex = (diffDays % 12 + 12) % 12;
  return TIANGAN[ganIndex] + DIZHI[zhiIndex];
}

// 计算月干支（简化算法，以节气为界）
function getMonthGanZhi(year: number, month: number): string {
  const lsr = lunisolar(new Date(year, month - 1, 15));
  const lunar = lsr.lunar;
  const lunarMonth = lunar.month;
  
  // 年干决定月干起始
  const yearGan = getYearGanZhi(year);
  const yearGanIndex = TIANGAN.indexOf(yearGan.charAt(0));
  
  // 甲己之年丙作首，乙庚之岁戊为头，丙辛之岁寻庚起，丁壬壬位顺行流，戊癸之年何方发，甲寅之上好追求
  const monthGanStart = [2, 4, 6, 8, 0][yearGanIndex % 5];
  const monthGanIndex = (monthGanStart + lunarMonth - 1) % 10;
  const monthZhiIndex = (lunarMonth + 1) % 12; // 正月建寅
  
  return TIANGAN[monthGanIndex] + DIZHI[monthZhiIndex];
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

// 格式化年月显示
function formatYearMonth(year: number, month: number): string {
  return `${year}年${month + 1}月`;
}

// 获取冲煞信息
function getChongSha(dayZhi: string): { chong: string; sha: string; direction: string } {
  const zhiOrder = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
  const chongMap: Record<string, string> = {
    '子': '午', '丑': '未', '寅': '申', '卯': '酉',
    '辰': '戌', '巳': '亥', '午': '子', '未': '丑',
    '申': '寅', '酉': '卯', '戌': '辰', '亥': '巳'
  };
  const shaMap: Record<string, string> = {
    '子': '南', '丑': '东', '寅': '北', '卯': '西',
    '辰': '南', '巳': '东', '午': '北', '未': '西',
    '申': '南', '酉': '东', '戌': '北', '亥': '西'
  };
  const directionMap: Record<string, string> = {
    '子': '北方', '丑': '东北', '寅': '东北', '卯': '东方',
    '辰': '东南', '巳': '东南', '午': '南方', '未': '西南',
    '申': '西南', '酉': '西方', '戌': '西北', '亥': '西北'
  };
  
  return {
    chong: chongMap[dayZhi] || '午',
    sha: shaMap[dayZhi] || '南',
    direction: directionMap[dayZhi] || '中'
  };
}

export function CalendarPage() {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [lunarInfo, setLunarInfo] = useState<ReturnType<typeof getLunarDate> | null>(null);
  const [zodiac, setZodiac] = useState<string>("");
  const [yearGanZhi, setYearGanZhi] = useState<string>("");
  const [dayGanZhi, setDayGanZhi] = useState<string>("");
  const [monthGanZhi, setMonthGanZhi] = useState<string>("");
  const [solarTerm, setSolarTerm] = useState<string | null>(null);
  const [weekday, setWeekday] = useState<string>("");
  const [weekNumber, setWeekNumber] = useState<number>(0);

  // 黄历相关状态
  const [jianChu, setJianChu] = useState<string>("");
  const [xiu, setXiu] = useState<string>("");
  const [pengZu, setPengZu] = useState<string[]>([]);
  const [yiJi, setYiJi] = useState<{ yi: string[]; ji: string[] }>({ yi: [], ji: [] });
  const [shiChenList, setShiChenList] = useState<ReturnType<typeof getShiChenHuangLi>>([]);
  const [chongSha, setChongSha] = useState<{ chong: string; sha: string; direction: string }>({ chong: '', sha: '', direction: '' });

  useEffect(() => {
    const lunar = getLunarDate(selectedDate);
    setLunarInfo(lunar);
    setZodiac(getZodiac(lunar.year));
    setYearGanZhi(getYearGanZhi(lunar.year));
    setDayGanZhi(getDayGanZhi(selectedDate));
    setMonthGanZhi(getMonthGanZhi(selectedDate.getFullYear(), selectedDate.getMonth() + 1));
    setSolarTerm(getSolarTerm(selectedDate));
    setWeekday(WEEKDAYS[selectedDate.getDay()]);
    setWeekNumber(getWeekNumber(selectedDate));

    // 计算黄历信息
    const dayGan = getDayGanZhi(selectedDate).charAt(0);
    const dayZhi = getDayGanZhi(selectedDate).charAt(1);
    const monthZhi = getMonthGanZhi(selectedDate.getFullYear(), selectedDate.getMonth() + 1).charAt(1);
    
    const jc = getJianChu(dayZhi, monthZhi);
    const x = getXiu(dayZhi, dayGan);
    const pz = getPengZu(dayGan, dayZhi);
    const yj = getYiJi(dayGan, dayZhi, jc, x);
    const sc = getShiChenHuangLi(dayGan, dayZhi);
    const cs = getChongSha(dayZhi);
    
    setJianChu(jc);
    setXiu(x);
    setPengZu(pz);
    setYiJi(yj);
    setShiChenList(sc);
    setChongSha(cs);
  }, [selectedDate]);

  // 月份导航
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  // 生成日历格子数据
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    const daysInMonth = getDaysInMonth(year, month);
    const firstDayOfMonth = getFirstDayOfMonth(year, month);
    
    const days: {
      date: Date;
      dayOfMonth: number;
      isCurrentMonth: boolean;
      isToday: boolean;
      isSelected: boolean;
      lunarDay: string;
    }[] = [];
    
    // 上个月的日期
    const prevMonthDays = getDaysInMonth(year, month - 1);
    for (let i = firstDayOfMonth - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthDays - i);
      days.push({
        date,
        dayOfMonth: prevMonthDays - i,
        isCurrentMonth: false,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
        lunarDay: getLunarDayShort(date),
      });
    }
    
    // 当前月的日期
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        dayOfMonth: i,
        isCurrentMonth: true,
        isToday: isToday(date),
        isSelected: isSameDay(date, selectedDate),
        lunarDay: getLunarDayShort(date),
      });
    }
    
    // 下个月的日期（填充到 7 的倍数）
    const remainingCells = 7 - (days.length % 7);
    if (remainingCells < 7) {
      for (let i = 1; i <= remainingCells; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date,
          dayOfMonth: i,
          isCurrentMonth: false,
          isToday: isToday(date),
          isSelected: isSameDay(date, selectedDate),
          lunarDay: getLunarDayShort(date),
        });
      }
    }
    
    return days;
  };

  // 点击日期
  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
  };

  // 获取吉凶颜色
  const getNatureColor = (nature: string) => {
    switch (nature) {
      case '吉': return '#C41E3A';
      case '凶': return '#333333';
      default: return '#8B4513';
    }
  };

  // 获取吉凶背景色
  const getNatureBgColor = (nature: string) => {
    switch (nature) {
      case '吉': return 'bg-[#C41E3A]/10';
      case '凶': return 'bg-gray-200';
      default: return 'bg-[#DAA520]/10';
    }
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="flex flex-col h-full">
      <Header title="万年历" subtitle="公历农历转换查询" />
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Monthly Calendar Grid Card */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Calendar className="w-5 h-5 text-[#C41E3A]" />
              选择日期
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            {/* Month Navigation Header */}
            <div className="flex items-center justify-between mb-4">
              <button
                onClick={goToPreviousMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              </button>
              <div className="text-center">
                <div className="text-lg font-bold text-gray-800">
                  {formatYearMonth(currentMonth.getFullYear(), currentMonth.getMonth())}
                </div>
                <div className="text-xs text-gray-500">
                  {getLunarDate(currentMonth).yearStr} {getLunarDate(currentMonth).monthStr}
                </div>
              </div>
              <button
                onClick={goToNextMonth}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-gray-600" />
              </button>
            </div>

            {/* Today Button */}
            <div className="flex justify-center mb-3">
              <button
                onClick={goToToday}
                className="px-4 py-1.5 text-sm bg-[#C41E3A]/10 text-[#C41E3A] rounded-full hover:bg-[#C41E3A]/20 transition-colors"
              >
                回到今天
              </button>
            </div>

            {/* Weekday Headers */}
            <div className="grid grid-cols-7 gap-1 mb-2">
              {CALENDAR_WEEKDAYS.map((day, index) => (
                <div
                  key={index}
                  className={`text-center py-2 text-sm font-medium ${
                    index === 0 || index === 6 ? 'text-[#C41E3A]' : 'text-gray-600'
                  }`}
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar Grid */}
            <div className="grid grid-cols-7 gap-1">
              {calendarDays.map((day, index) => (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  className={`
                    relative aspect-square p-1 rounded-lg transition-all
                    flex flex-col items-center justify-center
                    ${day.isCurrentMonth ? 'opacity-100' : 'opacity-40'}
                    ${day.isSelected 
                      ? 'bg-[#C41E3A] text-white shadow-md' 
                      : day.isToday 
                        ? 'bg-[#DAA520]/20 border-2 border-[#DAA520]'
                        : 'hover:bg-gray-100'
                    }
                  `}
                >
                  <span className={`text-sm font-medium ${
                    day.isSelected ? 'text-white' : day.isToday ? 'text-[#DAA520]' : 'text-gray-800'
                  }`}>
                    {day.dayOfMonth}
                  </span>
                  <span className={`text-[10px] mt-0.5 ${
                    day.isSelected ? 'text-white/80' : 'text-gray-500'
                  }`}>
                    {day.lunarDay}
                  </span>
                  {day.isToday && !day.isSelected && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-[#DAA520] rounded-full" />
                  )}
                </button>
              ))}
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
                  <span>年柱：{yearGanZhi}</span>
                  <span>月柱：{monthGanZhi}</span>
                  <span>日柱：{dayGanZhi}</span>
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

        {/* ==================== 黄历区域 ==================== */}
        
        {/* 每日宜忌 */}
        <Card style={{ marginBottom: 16, borderLeft: "4px solid #C41E3A" }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Star className="w-5 h-5 text-[#C41E3A]" />
              每日宜忌
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="space-y-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-[#C41E3A] font-bold">宜</span>
                  <div className="flex-1 h-px bg-[#C41E3A]/20"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {yiJi.yi.length > 0 ? (
                    yiJi.yi.map((item, index) => (
                      <Tag key={index} color="#C41E3A" plain>
                        {item}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">暂无宜事</span>
                  )}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-gray-700 font-bold">忌</span>
                  <div className="flex-1 h-px bg-gray-300"></div>
                </div>
                <div className="flex flex-wrap gap-2">
                  {yiJi.ji.length > 0 ? (
                    yiJi.ji.map((item, index) => (
                      <Tag key={index} color="#333333" plain>
                        {item}
                      </Tag>
                    ))
                  ) : (
                    <span className="text-gray-400 text-sm">暂无忌事</span>
                  )}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 建除十二神 */}
        {jianChu && JIANCHU[jianChu] && (
          <Card style={{ marginBottom: 16, borderLeft: `4px solid ${getNatureColor(JIANCHU[jianChu].nature)}` }}>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Shield className="w-5 h-5" style={{ color: getNatureColor(JIANCHU[jianChu].nature) }} />
                建除十二神
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold ${getNatureBgColor(JIANCHU[jianChu].nature)}`}
                  style={{ color: getNatureColor(JIANCHU[jianChu].nature) }}
                >
                  {jianChu}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-800">
                    {jianChu}日 - {JIANCHU[jianChu].meaning}
                  </div>
                  <Tag 
                    color={getNatureColor(JIANCHU[jianChu].nature)} 
                    style={{ marginTop: 4 }}
                  >
                    {JIANCHU[jianChu].nature}
                  </Tag>
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">
                {JIANCHU[jianChu].desc}
              </p>
            </Card.Body>
          </Card>
        )}

        {/* 二十八宿 */}
        {xiu && XIUS[xiu] && (
          <Card style={{ marginBottom: 16, borderLeft: `4px solid ${getNatureColor(XIUS[xiu].nature)}` }}>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Compass className="w-5 h-5" style={{ color: getNatureColor(XIUS[xiu].nature) }} />
                二十八宿
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="flex items-center gap-4 mb-3">
                <div 
                  className={`w-16 h-16 rounded-full flex items-center justify-center text-xl font-bold ${getNatureBgColor(XIUS[xiu].nature)}`}
                  style={{ color: getNatureColor(XIUS[xiu].nature) }}
                >
                  {xiu}
                </div>
                <div className="flex-1">
                  <div className="text-lg font-bold text-gray-800">
                    {xiu}宿 ({XIUS[xiu].animal})
                  </div>
                  <div className="text-sm text-gray-600">
                    {XIUS[xiu].direction}
                  </div>
                  <Tag 
                    color={getNatureColor(XIUS[xiu].nature)} 
                    style={{ marginTop: 4 }}
                  >
                    {XIUS[xiu].nature}
                  </Tag>
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-[#C41E3A] font-medium">
                  {XIUS[xiu].fortune}
                </p>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {XIUS[xiu].desc}
                </p>
              </div>
            </Card.Body>
          </Card>
        )}

        {/* 彭祖百忌 */}
        {pengZu.length > 0 && (
          <Card style={{ marginBottom: 16, borderLeft: "4px solid #8B4513" }}>
            <div className="p-4 pb-2">
              <h3 className="flex items-center gap-2 text-lg font-medium">
                <Timer className="w-5 h-5 text-[#8B4513]" />
                彭祖百忌
              </h3>
            </div>
            <Card.Body className="px-4 pb-4">
              <div className="space-y-3">
                {pengZu.map((item, index) => {
                  const [title, desc] = item.split('，');
                  return (
                    <div key={index} className="p-3 bg-[#8B4513]/5 rounded-lg">
                      <div className="text-sm font-bold text-[#8B4513] mb-1">
                        {title}
                      </div>
                      <div className="text-sm text-gray-600">
                        {desc}
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card.Body>
          </Card>
        )}

        {/* 冲煞方位 */}
        <Card style={{ marginBottom: 16, borderLeft: "4px solid #666666" }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Compass className="w-5 h-5 text-gray-600" />
              冲煞方位
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-3 bg-red-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">冲</div>
                <div className="text-xl font-bold text-[#C41E3A]">
                  {chongSha.chong}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  煞{zodiac && ZODIAC_ANIMALS[DIZHI.indexOf(chongSha.chong) || 0]}
                </div>
              </div>
              <div className="text-center p-3 bg-gray-100 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">煞方</div>
                <div className="text-xl font-bold text-gray-700">
                  {chongSha.sha}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  忌向此
                </div>
              </div>
              <div className="text-center p-3 bg-yellow-50 rounded-lg">
                <div className="text-sm text-gray-600 mb-1">财神方</div>
                <div className="text-xl font-bold text-[#DAA520]">
                  {chongSha.direction}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  吉方
                </div>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-3">
              今日与{chongSha.chong}相冲，{chongSha.chong}年出生的人需谨慎行事
            </p>
          </Card.Body>
        </Card>

        {/* 时辰吉凶 */}
        <Card style={{ marginBottom: 16, borderLeft: "4px solid #C41E3A" }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 text-lg font-medium">
              <Clock className="w-5 h-5 text-[#C41E3A]" />
              时辰吉凶
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="grid grid-cols-2 gap-2">
              {shiChenList.map((shiChen, index) => (
                <div 
                  key={index} 
                  className={`p-3 rounded-lg border ${
                    shiChen.yi.length > shiChen.ji.length 
                      ? 'border-[#C41E3A]/30 bg-[#C41E3A]/5' 
                      : shiChen.ji.length > shiChen.yi.length 
                        ? 'border-gray-300 bg-gray-50' 
                        : 'border-[#DAA520]/30 bg-[#DAA520]/5'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-gray-800">{shiChen.name}</span>
                    <span className="text-xs text-gray-500">{shiChen.start}-{shiChen.end}</span>
                  </div>
                  <div className="text-sm text-[#8B4513] mb-1">{shiChen.ganZhi}</div>
                  <div className="text-xs text-gray-500 mb-2">{shiChen.animal}</div>
                  {shiChen.yi.length > 0 && (
                    <div className="text-xs text-[#C41E3A] mb-1">
                      宜: {shiChen.yi.slice(0, 2).join('、')}
                    </div>
                  )}
                  {shiChen.ji.length > 0 && (
                    <div className="text-xs text-gray-600">
                      忌: {shiChen.ji.slice(0, 2).join('、')}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

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
                <span className="text-gray-500">年柱</span>
                <span className="font-medium">{yearGanZhi}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">月柱</span>
                <span className="font-medium">{monthGanZhi}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-500">日柱</span>
                <span className="font-medium">{dayGanZhi}</span>
              </div>
              {jianChu && (
                <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                  <span className="text-gray-500">建除</span>
                  <span className="font-medium text-[#C41E3A]">{jianChu}日</span>
                </div>
              )}
              {xiu && (
                <div className="flex justify-between py-2 border-b border-[#D4C5B5]/50">
                  <span className="text-gray-500">星宿</span>
                  <span className="font-medium text-[#DAA520]">{xiu}宿</span>
                </div>
              )}
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
