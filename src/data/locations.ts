import type { LocationData } from '../types';

// 城市经纬度数据（用于真太阳时校正）
export const LOCATION_DATA: LocationData = {
  // 直辖市
  '北京': 116.40,
  '天津': 117.27,
  '上海': 121.47,
  '重庆': 106.55,
  
  // 省份主要城市
  '石家庄': 114.48,
  '太原': 112.55,
  '呼和浩特': 111.73,
  '沈阳': 123.43,
  '大连': 121.62,
  '长春': 125.32,
  '哈尔滨': 126.63,
  '南京': 118.78,
  '苏州': 120.58,
  '杭州': 120.15,
  '宁波': 121.55,
  '温州': 120.65,
  '合肥': 117.27,
  '福州': 119.30,
  '厦门': 118.08,
  '南昌': 115.88,
  '济南': 116.98,
  '青岛': 120.38,
  '郑州': 113.63,
  '武汉': 114.30,
  '长沙': 112.93,
  '广州': 113.26,
  '深圳': 114.05,
  '珠海': 113.58,
  '佛山': 113.12,
  '南宁': 108.37,
  '海口': 110.35,
  '成都': 104.06,
  '贵阳': 106.63,
  '昆明': 102.72,
  '西安': 108.93,
  '兰州': 103.83,
  '西宁': 101.78,
  '银川': 106.27,
  '乌鲁木齐': 87.62,
  '拉萨': 91.13,
  
  // 港澳台
  '香港': 114.17,
  '澳门': 113.55,
  '台北': 121.56,
  '高雄': 120.31
};

// 获取城市经度
export function getCityLongitude(cityName: string): number {
  return LOCATION_DATA[cityName] || 120.00; // 默认北京时间
}

// 获取所有城市列表
export function getCityList(): string[] {
  return Object.keys(LOCATION_DATA).sort();
}

// 真太阳时校正计算
// 经度每差1度，时间差4分钟
// 东经为正，西经为负
export function calculateTrueSolarTime(
  date: string, 
  time: string, 
  longitude: number
): { date: string; time: string; diffMinutes: number; adjusted: boolean } {
  const standardLongitude = 120.00; // 北京标准时间经度
  const diffMinutes = (longitude - standardLongitude) * 4;
  
  const dateTime = new Date(`${date}T${time}`);
  const trueSolarTime = new Date(dateTime.getTime() + diffMinutes * 60000);
  
  return {
    date: trueSolarTime.toISOString().split('T')[0],
    time: trueSolarTime.toTimeString().slice(0, 5),
    diffMinutes: diffMinutes,
    adjusted: Math.abs(diffMinutes) > 1
  };
}

// 根据真太阳时判断时辰
export function getTrueShiChen(hour: number, minute: number, longitude: number): number {
  const standardLongitude = 120.00;
  const diffMinutes = (longitude - standardLongitude) * 4;
  
  // 计算调整后的小时数（加上时差）
  const totalMinutes = hour * 60 + minute + diffMinutes;
  const adjustedHour = Math.floor(totalMinutes / 60) % 24;
  
  // 时辰边界（真太阳时）
  // 子时：23:00-01:00（特殊处理）
  if (adjustedHour >= 23 || adjustedHour < 1) return 0; // 子时
  if (adjustedHour >= 1 && adjustedHour < 3) return 1;  // 丑时
  if (adjustedHour >= 3 && adjustedHour < 5) return 2;  // 寅时
  if (adjustedHour >= 5 && adjustedHour < 7) return 3;  // 卯时
  if (adjustedHour >= 7 && adjustedHour < 9) return 4;  // 辰时
  if (adjustedHour >= 9 && adjustedHour < 11) return 5; // 巳时
  if (adjustedHour >= 11 && adjustedHour < 13) return 6; // 午时
  if (adjustedHour >= 13 && adjustedHour < 15) return 7; // 未时
  if (adjustedHour >= 15 && adjustedHour < 17) return 8; // 申时
  if (adjustedHour >= 17 && adjustedHour < 19) return 9; // 酉时
  if (adjustedHour >= 19 && adjustedHour < 21) return 10; // 戌时
  if (adjustedHour >= 21 && adjustedHour < 23) return 11; // 亥时
  
  return 0;
}
