import type { BaziResult } from '../types';
import { KNOWLEDGE_BASE, getNayin, getGeju } from '../data/knowledgeBase';

// 生成分享文本
export function generateShareText(bazi: BaziResult): string {
  const dayMaster = bazi.day.charAt(0);
  const dayMasterInfo = KNOWLEDGE_BASE.DAY_MASTER[dayMaster];
  const geju = getGeju(bazi);
  const gejuInfo = KNOWLEDGE_BASE.GEJU[geju];

  let text = `八字排盘结果\n`;
  text += `━━━━━━━━━━━━━━\n`;
  text += `公历：${bazi.solarDate} ${bazi.time}\n`;
  text += `真太阳时校正：${bazi.timeAdjusted ? '已校正' : '无需校正'}\n\n`;
  
  text += `【八字排盘】\n`;
  text += `年柱：${bazi.year}（${getNayin(bazi.year)}）\n`;
  text += `月柱：${bazi.month}（${getNayin(bazi.month)}）\n`;
  text += `日柱：${bazi.day}（${getNayin(bazi.day)}）- 日主${dayMaster}\n`;
  text += `时柱：${bazi.hour}（${getNayin(bazi.hour)}）\n\n`;
  
  text += `【日主分析】\n`;
  text += `日主：${dayMaster}（${dayMasterInfo.element}${dayMasterInfo.nature}）\n`;
  text += `${dayMasterInfo.desc}\n\n`;
  
  text += `【格局】${geju}\n`;
  text += `${gejuInfo ? gejuInfo.detail : ''}\n\n`;
  
  text += `━━━━━━━━━━━━━━\n`;
  text += `本结果仅供参考娱乐`;
  
  return text;
}

// 复制到剪贴板
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // 降级方案
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
}

// 获取喜用神
export function getXiYongShen(element: string): string[] {
  const relations: Record<string, string[]> = {
    '木': ['水', '木'],
    '火': ['木', '火'],
    '土': ['火', '土'],
    '金': ['土', '金'],
    '水': ['金', '水']
  };
  return relations[element] || [element];
}
