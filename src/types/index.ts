export interface BaziInput {
  birthDate: string;
  birthTime: string;
  longitude: number;
  gender: 0 | 1; // 0: 女, 1: 男
}

export interface BaziResult {
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
}

export interface DiZhiInfo {
  element: string;
  yinYang: string;
  hidden: string[];
  desc: string;
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
}

export interface GeJuInfo {
  desc: string;
  detail: string;
  career: string;
  personality: string;
}

export interface DayMasterInfo {
  desc: string;
  element: string;
  nature: string;
}
