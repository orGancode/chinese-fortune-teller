import { ReactNode } from "react";

export interface BaziInput {
  birthDate: string;
  birthTime: string;
  longitude: number;
  gender: 0 | 1; // 0: 女, 1: 男
}

export interface BaziResult {
  lunarMonth?: ReactNode;
  lunarDay?: ReactNode;
  year: string;
  month: string;
  day: string;
  hour: string;
  shiChen: string;
  shiChenIndex: number;
  timeAdjusted: boolean;
  originalTime: string;
  solarDate: string;
  time: string;
}

export interface DayunItem {
  order: number;
  ganZhi: string;
  startAge: number;
  endAge: number;
}

export interface LiunianItem {
  year: number;
  ganZhi: string;
}

export interface WuXingCount {
  '木': number;
  '火': number;
  '土': number;
  '金': number;
  '水': number;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  input: BaziInput;
  result: BaziResult;
}

export type Gender = 0 | 1;

export interface LocationData {
  [key: string]: number;
}

export interface TianGanInfo {
  element: string;
  yinYang: string;
  nature: string;
  desc: string;
  characteristics: string[];
  season: string;
  direction: string;
}

export interface DiZhiInfo {
  element: string;
  yinYang: string;
  hidden: string[];
  hiddenDesc: string[];
  desc: string;
  characteristics: string[];
  zodiac: string;
  month: string;
  direction: string;
  time: string;
}

export interface ShiShenRelation {
  same: string;
  opposite: string;
  generate: string;
  generated: string;
  restrain: string;
  restrained: string;
  generateBy: string;
  generatedBy: string;
}

export interface ShiShenDesc {
  desc: string;
  nature: string;
  detail: string;
  strengths: string[];
  weaknesses: string[];
  career: string[];
  relationships: string;
  wealth: string;
}

export interface GeJuInfo {
  desc: string;
  detail: string;
  career: string;
  personality: string;
  strengths: string[];
  weaknesses: string[];
  requirements: string[];
  famousExamples: string[];
}

export interface DayMasterInfo {
  desc: string;
  element: string;
  nature: string;
  characteristics: string[];
  suitableCareers: string[];
  favorableElements: string[];
  unfavorableElements: string[];
  famousPeople: string[];
}

// 十二长生
export interface ChangShengInfo {
  name: string;
  meaning: string;
  desc: string;
  characteristics: string;
}

// 神煞
export interface ShenShaInfo {
  name: string;
  type: '吉' | '凶' | '中';
  desc: string;
  effect: string;
  position?: string;
}

// 纳音详细
export interface NaYinInfo {
  name: string;
  element: string;
  desc: string;
  characteristics: string[];
  fortune: string;
}

// 五行分析
export interface WuXingAnalysis {
  element: string;
  count: number;
  strength: '旺' | '相' | '休' | '囚' | '死';
  seasonStrength: string;
  score: number;
}

// 喜用神
export interface XiYongShen {
  xiShen: string;
  yongShen: string;
  xiShenDesc: string;
  yongShenDesc: string;
  reason: string;
  suggestions: string[];
}

// 大运分析
export interface DaYunAnalysis {
  order: number;
  ganZhi: string;
  startAge: number;
  endAge: number;
  element: string;
  shishen: string;
  nature: '好运' | '平运' | '差运';
  desc: string;
  career: string;
  wealth: string;
  health: string;
  relationships: string;
}

// 流年分析
export interface LiuNianAnalysis {
  year: number;
  ganZhi: string;
  element: string;
  shishen: string;
  nature: '吉' | '凶' | '平';
  desc: string;
  highlights: string[];
  cautions: string[];
}

// 万年历黄历
export interface HuangLiInfo {
  yi: string[];
  ji: string[];
  jishen: string[];
  xiongsha: string[];
  chong: string;
  sha: string;
  wuxing: string;
  pengZu: string;
  jianChu: string;
  xiu: string;
  
  shiChen: ShiChenInfo[];
}

// 时辰信息
export interface ShiChenInfo {
  name: string;
  start: string;
  end: string;
  ganZhi: string;
  animal: string;
  yi: string[];
  ji: string[];
}

// 建除十二神
export interface JianChuInfo {
  name: string;
  meaning: string;
  nature: '吉' | '凶' | '平';
  yi: string[];
  ji: string[];
  desc: string;
}

// 二十八宿
export interface XiuInfo {
  name: string;
  animal: string;
  direction: string;
  nature: '吉' | '凶' | '平';
  fortune: string;
  desc: string;
}

// 彭祖百忌
export interface PengZuInfo {
  dayStem: string;
  dayBranch: string;
  content: string[];
}
