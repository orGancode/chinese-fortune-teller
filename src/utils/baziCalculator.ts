import type { BaziInput, BaziResult, DayunItem, LiunianItem, WuXingCount } from '../types';

// 八字计算核心模块
export class BaziCalculator {
  private tianGan: string[];
  private diZhi: string[];
  private shiChen: string[];
  private baseDate: Date;
  private baseDayGanZhi: number;

  constructor() {
    // 天干
    this.tianGan = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
    // 地支
    this.diZhi = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    // 时辰对应（子时为0）
    this.shiChen = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
    
    // 1900年1月31日是农历1900年正月初一，干支为甲戌日
    this.baseDate = new Date(1900, 0, 31);
    this.baseDayGanZhi = 10; // 甲戌在60甲子中的索引（0-59）
  }

  // 计算年柱（立春为分界）
  calculateYearPillar(year: number, month: number, day: number): string {
    // 简化的立春判断：大约在2月4日左右
    const liChunMonth = 2;
    const liChunDay = 4;
    
    let nian: number;
    if (month < liChunMonth || (month === liChunMonth && day < liChunDay)) {
      nian = year - 1;
    } else {
      nian = year;
    }
    
    // 年干：(年份 - 3) % 10
    const ganIndex = (nian - 4) % 10;
    const gan = this.tianGan[ganIndex >= 0 ? ganIndex : ganIndex + 10];
    
    // 年支：(年份 - 3) % 12
    const zhiIndex = (nian - 4) % 12;
    const zhi = this.diZhi[zhiIndex >= 0 ? zhiIndex : zhiIndex + 12];
    
    return gan + zhi;
  }

  // 计算月柱
  calculateMonthPillar(_year: number, month: number, day: number, yearGanZhi: string): string {
    // 简化的节气月柱计算
    // 寅月从立春开始（大约2月4日）
    const jieQiMap = [
      { month: 2, day: 4, diZhi: '寅' },   // 立春
      { month: 3, day: 6, diZhi: '卯' },   // 惊蛰
      { month: 4, day: 5, diZhi: '辰' },   // 清明
      { month: 5, day: 6, diZhi: '巳' },   // 立夏
      { month: 6, day: 6, diZhi: '午' },   // 芒种
      { month: 7, day: 7, diZhi: '未' },   // 小暑
      { month: 8, day: 8, diZhi: '申' },   // 立秋
      { month: 9, day: 8, diZhi: '酉' },   // 白露
      { month: 10, day: 8, diZhi: '戌' },  // 寒露
      { month: 11, day: 7, diZhi: '亥' },  // 立冬
      { month: 12, day: 7, diZhi: '子' },  // 大雪
      { month: 1, day: 6, diZhi: '丑' }    // 小寒
    ];
    
    let zhi = '寅';
    for (const jieQi of jieQiMap) {
      if (month > jieQi.month || (month === jieQi.month && day >= jieQi.day)) {
        zhi = jieQi.diZhi;
      }
    }
    // 如果是1月且小于小寒，属于丑月
    if (month === 1 && day < 6) {
      zhi = '丑';
    }
    
    // 月干根据年干推算（五虎遁）
    // 甲己之年丙作首，乙庚之岁戊为头
    // 丙辛之年寻庚起，丁壬壬位顺行流
    // 戊癸之年何方发，甲寅之上好追求
    const yearGan = yearGanZhi.charAt(0);
    const yearGanIndex = this.tianGan.indexOf(yearGan);
    
    let startGan: number;
    if (yearGanIndex === 0 || yearGanIndex === 5) startGan = 2; // 甲己->丙
    else if (yearGanIndex === 1 || yearGanIndex === 6) startGan = 4; // 乙庚->戊
    else if (yearGanIndex === 2 || yearGanIndex === 7) startGan = 6; // 丙辛->庚
    else if (yearGanIndex === 3 || yearGanIndex === 8) startGan = 8; // 丁壬->壬
    else startGan = 0; // 戊癸->甲
    
    const zhiIndex = this.diZhi.indexOf(zhi);
    // 寅对应索引2，所以月干索引 = startGan + (zhiIndex - 2)
    let ganIndex = startGan + (zhiIndex - 2);
    ganIndex = ganIndex % 10;
    if (ganIndex < 0) ganIndex += 10;
    
    return this.tianGan[ganIndex] + zhi;
  }

  // 计算日柱
  calculateDayPillar(year: number, month: number, day: number): string {
    const targetDate = new Date(year, month - 1, day);
    const diffTime = targetDate.getTime() - this.baseDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    
    // 从甲戌日开始计算
    const ganZhiIndex = (this.baseDayGanZhi + diffDays) % 60;
    const adjustedIndex = ganZhiIndex >= 0 ? ganZhiIndex : ganZhiIndex + 60;
    
    const ganIndex = adjustedIndex % 10;
    const zhiIndex = adjustedIndex % 12;
    
    return this.tianGan[ganIndex] + this.diZhi[zhiIndex];
  }

  // 计算时柱（考虑真太阳时）
  calculateHourPillar(
    dayGanZhi: string, 
    hour: number, 
    minute: number, 
    longitude: number
  ): { ganZhi: string; shiChen: string; zhiIndex: number; adjusted: boolean } {
    // 真太阳时校正
    const standardLongitude = 120.0; // 北京时间经度
    const diffMinutes = (longitude - standardLongitude) * 4;
    const totalMinutes = hour * 60 + minute + diffMinutes;
    const adjustedHour = Math.floor(totalMinutes / 60) % 24;
    
    // 时辰对应（真太阳时）
    // 子时：23:00-01:00
    let zhiIndex: number;
    if (adjustedHour >= 23 || adjustedHour < 1) zhiIndex = 0;  // 子
    else if (adjustedHour >= 1 && adjustedHour < 3) zhiIndex = 1;  // 丑
    else if (adjustedHour >= 3 && adjustedHour < 5) zhiIndex = 2;  // 寅
    else if (adjustedHour >= 5 && adjustedHour < 7) zhiIndex = 3;  // 卯
    else if (adjustedHour >= 7 && adjustedHour < 9) zhiIndex = 4;  // 辰
    else if (adjustedHour >= 9 && adjustedHour < 11) zhiIndex = 5; // 巳
    else if (adjustedHour >= 11 && adjustedHour < 13) zhiIndex = 6; // 午
    else if (adjustedHour >= 13 && adjustedHour < 15) zhiIndex = 7; // 未
    else if (adjustedHour >= 15 && adjustedHour < 17) zhiIndex = 8; // 申
    else if (adjustedHour >= 17 && adjustedHour < 19) zhiIndex = 9; // 酉
    else if (adjustedHour >= 19 && adjustedHour < 21) zhiIndex = 10; // 戌
    else zhiIndex = 11; // 亥
    
    // 时干根据日干推算（五鼠遁）
    // 甲己还加甲，乙庚丙作初
    // 丙辛从戊起，丁壬庚子居
    // 戊癸何方发，壬子是真途
    const dayGan = dayGanZhi.charAt(0);
    const dayGanIndex = this.tianGan.indexOf(dayGan);
    
    let startGan: number;
    if (dayGanIndex === 0 || dayGanIndex === 5) startGan = 0; // 甲己->甲
    else if (dayGanIndex === 1 || dayGanIndex === 6) startGan = 2; // 乙庚->丙
    else if (dayGanIndex === 2 || dayGanIndex === 7) startGan = 4; // 丙辛->戊
    else if (dayGanIndex === 3 || dayGanIndex === 8) startGan = 6; // 丁壬->庚
    else startGan = 8; // 戊癸->壬
    
    // 子对应索引0，所以时干索引 = startGan + zhiIndex
    let ganIndex = (startGan + zhiIndex) % 10;
    
    return {
      ganZhi: this.tianGan[ganIndex] + this.diZhi[zhiIndex],
      shiChen: this.shiChen[zhiIndex],
      zhiIndex: zhiIndex,
      adjusted: Math.abs(diffMinutes) > 1
    };
  }

  // 计算完整八字
  calculateBazi(input: BaziInput): BaziResult {
    const [year, month, day] = input.birthDate.split('-').map(Number);
    const [hour, minute] = input.birthTime.split(':').map(Number);
    
    // 计算四柱
    const yearPillar = this.calculateYearPillar(year, month, day);
    const monthPillar = this.calculateMonthPillar(year, month, day, yearPillar);
    const dayPillar = this.calculateDayPillar(year, month, day);
    const hourResult = this.calculateHourPillar(dayPillar, hour, minute, input.longitude);
    
    return {
      year: yearPillar,
      month: monthPillar,
      day: dayPillar,
      hour: hourResult.ganZhi,
      shiChen: hourResult.shiChen,
      shiChenIndex: hourResult.zhiIndex,
      timeAdjusted: hourResult.adjusted,
      originalTime: input.birthTime,
      solarDate: `${year}年${month}月${day}日`,
      time: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
    };
  }

  // 计算五行数量
  calculateWuxing(bazi: BaziResult): WuXingCount {
    const wuxingCount: WuXingCount = { '木': 0, '火': 0, '土': 0, '金': 0, '水': 0 };
    const wuxingMap: Record<string, string> = {
      '甲': '木', '乙': '木', '丙': '火', '丁': '火', '戊': '土',
      '己': '土', '庚': '金', '辛': '金', '壬': '水', '癸': '水',
      '寅': '木', '卯': '木', '巳': '火', '午': '火',
      '辰': '土', '戌': '土', '丑': '土', '未': '土',
      '申': '金', '酉': '金', '亥': '水', '子': '水'
    };
    
    // 统计四柱干支
    (['year', 'month', 'day', 'hour'] as const).forEach(pillar => {
      const gan = bazi[pillar].charAt(0);
      const zhi = bazi[pillar].charAt(1);
      
      if (wuxingMap[gan]) wuxingCount[wuxingMap[gan] as keyof WuXingCount]++;
      if (wuxingMap[zhi]) wuxingCount[wuxingMap[zhi] as keyof WuXingCount]++;
    });
    
    return wuxingCount;
  }

  // 获取藏干
  getCangGan(diZhi: string): string[] {
    const cangGanMap: Record<string, string[]> = {
      '子': ['癸'],
      '丑': ['己', '癸', '辛'],
      '寅': ['甲', '丙', '戊'],
      '卯': ['乙'],
      '辰': ['戊', '乙', '癸'],
      '巳': ['丙', '庚', '戊'],
      '午': ['丁', '己'],
      '未': ['己', '丁', '乙'],
      '申': ['庚', '壬', '戊'],
      '酉': ['辛'],
      '戌': ['戊', '辛', '丁'],
      '亥': ['壬', '甲']
    };
    return cangGanMap[diZhi] || [];
  }

  // 计算大运
  calculateDaYun(bazi: BaziResult, gender: 0 | 1): DayunItem[] {
    const yearGan = bazi.year.charAt(0);
    const yearGanIndex = this.tianGan.indexOf(yearGan);
    
    // 判断顺排还是逆排
    // 阳年阳男顺排，阳年阴女逆排
    // 阴年阴男顺排，阴年阳女逆排
    const isYangYear = yearGanIndex % 2 === 0;
    const isMale = gender === 1;
    const isForward = (isYangYear && isMale) || (!isYangYear && !isMale);
    
    const daYun: DayunItem[] = [];
    let currentMonthGanIndex = this.tianGan.indexOf(bazi.month.charAt(0));
    let currentMonthZhiIndex = this.diZhi.indexOf(bazi.month.charAt(1));
    
    // 生成10步大运
    for (let i = 0; i < 10; i++) {
      if (isForward) {
        // 顺排
        currentMonthGanIndex = (currentMonthGanIndex + 1) % 10;
        currentMonthZhiIndex = (currentMonthZhiIndex + 1) % 12;
      } else {
        // 逆排
        currentMonthGanIndex = (currentMonthGanIndex - 1 + 10) % 10;
        currentMonthZhiIndex = (currentMonthZhiIndex - 1 + 12) % 12;
      }
      
      const ganZhi = this.tianGan[currentMonthGanIndex] + this.diZhi[currentMonthZhiIndex];
      const startAge = 3 + i * 10; // 简化的起运年龄
      
      daYun.push({
        order: i + 1,
        ganZhi: ganZhi,
        startAge: startAge,
        endAge: startAge + 9
      });
    }
    
    return daYun;
  }

  // 计算流年
  calculateLiuNian(_bazi: BaziResult, startYear: number, count: number): LiunianItem[] {
    const liuNian: LiunianItem[] = [];
    
    for (let i = 0; i < count; i++) {
      const year = startYear + i;
      const yearPillar = this.calculateYearPillar(year, 6, 1); // 6月1日肯定过了立春
      
      liuNian.push({
        year: year,
        ganZhi: yearPillar
      });
    }
    
    return liuNian;
  }
}

// 创建单例实例
export const baziCalculator = new BaziCalculator();
