import type { LocationData } from '../types';

// 省份/直辖市经纬度数据（用于真太阳时校正）
// 按人口/热度排序：一线 > 新一线 > 二线 > 其他
export const LOCATION_DATA: LocationData = {
  // 一线城市（默认北京时间，但保留供选择）
  '北京': 116.40,
  '上海': 121.47,
  '广东': 113.26,      // 广州经度代表
  '深圳': 114.05,
  
  // 新一线 & 热门省份
  '浙江': 120.15,      // 杭州
  '四川': 104.06,      // 成都
  '重庆': 106.55,
  '湖北': 114.30,      // 武汉
  '陕西': 108.93,      // 西安
  '江苏': 118.78,      // 南京
  '天津': 117.27,
  '湖南': 112.93,      // 长沙
  '河南': 113.63,      // 郑州
  
  // 其他省份（按热度排序）
  '山东': 116.98,      // 济南
  '福建': 119.30,      // 福州
  '安徽': 117.27,      // 合肥
  '河北': 114.48,      // 石家庄
  '辽宁': 123.43,      // 沈阳
  '山西': 112.55,      // 太原
  '江西': 115.88,      // 南昌
  '广西': 108.37,      // 南宁
  '云南': 102.72,      // 昆明
  '贵州': 106.63,      // 贵阳
  '黑龙江': 126.63,    // 哈尔滨
  '吉林': 125.32,      // 长春
  '内蒙古': 111.73,    // 呼和浩特
  '甘肃': 103.83,      // 兰州
  '海南': 110.35,      // 海口
  '新疆': 87.62,       // 乌鲁木齐
  '宁夏': 106.27,      // 银川
  '青海': 101.78,      // 西宁
  '西藏': 91.13,       // 拉萨
  
  // 港澳台
  '香港': 114.17,
  '澳门': 113.55,
  '台湾': 121.56       // 台北
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
