import { useState, useEffect } from "react";
import lunisolar from "lunisolar";
import { ChevronLeft, ChevronRight } from "lucide-react";

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

// 日历星期标题
const CALENDAR_WEEKDAYS = ["日", "一", "二", "三", "四", "五", "六"];

// 获取某月的天数
function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

// 获取某月第一天是星期几 (0 = 周日)
function getFirstDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 1).getDay();
}

// 获取农历日期的简短显示
function getLunarDayShort(date: Date): string {
  try {
    const lsr = lunisolar(date);
    const lunar = lsr.lunar;
    const day = lunar.day;
    const month = lunar.month;
    const isLeap = lunar.isLeap;
    
    if (day === 1) {
      return (isLeap ? "闰" : "") + LUNAR_MONTHS[month - 1];
    }
    
    return LUNAR_DAYS[day - 1];
  } catch (error) {
    console.error("Error getting lunar day:", error);
    return "";
  }
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

interface CalendarGridProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  getDayLabel?: (date: Date) => string | null; // 自定义日期标签（如节日、节气）
  showTodayButton?: boolean;
  onGoToToday?: () => void;
  showTodayIndicator?: boolean; // 是否显示今日红点标记
}

export function CalendarGrid({ 
  selectedDate, 
  onDateSelect, 
  getDayLabel,
  showTodayButton = true,
  onGoToToday,
  showTodayIndicator = true
}: CalendarGridProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate);

  // 安全地获取日期标签
  const safeGetDayLabel = (date: Date): string | null => {
    if (!getDayLabel) return null;
    try {
      return getDayLabel(date);
    } catch (error) {
      console.error("Error getting day label:", error);
      return null;
    }
  };

  // 当外部selectedDate变化时，更新currentMonth
  useEffect(() => {
    setCurrentMonth(selectedDate);
  }, [selectedDate]);

  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    onDateSelect(today);
    onGoToToday?.();
  };

  const formatYearMonth = (year: number, month: number) => {
    return `${year}年${month + 1}月`;
  };

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
      customLabel: string | null;
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
        customLabel: safeGetDayLabel(date),
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
        customLabel: safeGetDayLabel(date),
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
          customLabel: safeGetDayLabel(date),
        });
      }
    }
    
    return days;
  };

  const handleDateClick = (date: Date) => {
    onDateSelect(date);
  };

  const calendarDays = generateCalendarDays();
  

  return (
    <div className="w-full">
      {/* Month Navigation Header */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={goToPreviousMonth}
          className="p-2 rounded-full transition-colors"
        >
          <ChevronLeft className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>
        <div className="flex items-center gap-2">
          <div className="text-lg font-bold text-[var(--color-text)]">
            {formatYearMonth(currentMonth.getFullYear(), currentMonth.getMonth())}
          </div>
          {showTodayButton && (
            <button
              onClick={goToToday}
              className="px-2 py-0.5 text-xs bg-[var(--color-primary-soft)] text-[var(--color-primary)] rounded transition-colors"
            >
              今天
            </button>
          )}
        </div>
        <button
          onClick={goToNextMonth}
          className="p-2 rounded-full transition-colors"
        >
          <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
        </button>
      </div>

      {/* Weekday Headers */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {CALENDAR_WEEKDAYS.map((day, index) => (
          <div
            key={index}
            className={`text-center py-2 text-sm font-medium ${
              index === 0 || index === 6 ? 'text-[var(--color-primary)]' : 'text-[var(--color-text-secondary)]'
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
                ? 'bg-[var(--color-primary)] text-white shadow-md' 
                : day.isToday 
                  ? 'bg-[var(--color-gold)]/20 border border-[var(--color-gold)]'
                  : day.customLabel 
                    ? 'bg-[var(--color-primary-soft)]'
                    : ''
              }
            `}
          >
            <span className={`text-sm font-medium ${
              day.isSelected 
                ? 'text-white' 
                : day.isToday 
                  ? 'text-[var(--color-gold)]' 
                  : day.customLabel 
                    ? 'text-[var(--color-primary)]' 
                    : 'text-[var(--color-text)]'
            }`}>
              {day.dayOfMonth}
            </span>
            <span className={`text-[10px] mt-0.5 truncate w-full text-center ${
              day.isSelected 
                ? 'text-white/80' 
                : day.customLabel 
                  ? 'text-[var(--color-primary)] font-medium' 
                  : 'text-[var(--color-text-muted)]'
            }`}>
              {day.customLabel || day.lunarDay}
            </span>
            {showTodayIndicator && day.isToday && !day.isSelected && (
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-[var(--color-gold)] rounded-full" />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
