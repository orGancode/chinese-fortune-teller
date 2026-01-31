import { useNavigate } from "react-router-dom";
import { Card } from "react-vant";
import { useHistoryStore } from "../store/historyStore";
import { useBaziStore } from "../store/baziStore";
import type { HistoryItem } from "../types";
import lunisolar from "lunisolar";
import {
  Sparkles,
  Calendar,
  Sun,
  History,
  ChevronRight,
  Compass,
  BookOpen,
  Scroll,
  Star,
  Settings
} from "lucide-react";
import { ShiChenDialCanvas } from "../components/ShiChenDialCanvas";

// 中国传统色彩
const COLORS = {
  primary: "var(--color-primary)",     // 朱砂红
  primaryLight: "var(--color-primary-light)",
  gold: "var(--color-gold)",        // 金色
  goldLight: "var(--color-gold-light)",
  ink: "var(--color-ink)",         // 墨黑
  paper: "var(--color-paper)",       // 宣纸色
  jade: "var(--color-jade)",        // 翡翠绿
  amber: "var(--color-amber)",       // 琥珀
};

// 获取今日宜忌
function getTodayYiJi(): { yi: string[]; ji: string[] } {
  const today = new Date();

  // 基于农历日期生成宜忌（示例）
  const day = today.getDate();
  const yi = [];
  const ji = [];
  
  if (day % 2 === 0) {
    yi.push("嫁娶", "开市", "出行", "祭祀");
    ji.push("安葬", "动土", "破土");
  } else {
    yi.push("祭祀", "祈福", "求嗣", "开光");
    ji.push("嫁娶", "开市", "入宅");
  }
  
  return { yi, ji };
}

// 获取今日干支
function getTodayGanZhi(): string {
  const today = new Date();
  const lsr = lunisolar(today);
  return lsr.format("YYYY年MM月DD日");
}

// 获取当前节气
function getCurrentJieQi(): string | null {
  const today = new Date();
  const lsr = lunisolar(today);
  return lsr.solarTerm || null;
}

// 格式化日期时间
function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

// 性别文本
function getGenderText(gender: 0 | 1): string {
  return gender === 0 ? "女命" : "男命";
}

export function HomePage() {
  const navigate = useNavigate();
  const { history } = useHistoryStore();
  const { setCurrentBazi } = useBaziStore();
  
  const todayYiJi = getTodayYiJi();
  const todayGanZhi = getTodayGanZhi();
  const currentJieQi = getCurrentJieQi();
  const recentHistory = history.slice(0, 3);

  // 点击历史记录
  const handleHistoryClick = (item: HistoryItem) => {
    setCurrentBazi(item.result);
    navigate("/result");
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      {/* 顶部横幅区域 - 渐变背景 */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(160deg, ${COLORS.primary} 0%, #8B0000 50%, ${COLORS.primary} 100%)`,
          paddingBottom: "20px"
        }}
      >
        {/* 装饰云纹图案 */}
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
            <path d="M0,100 Q100,50 200,100 T400,100" fill="none" stroke="white" strokeWidth="2"/>
            <path d="M0,120 Q100,70 200,120 T400,120" fill="none" stroke="white" strokeWidth="1.5"/>
            <path d="M0,80 Q100,30 200,80 T400,80" fill="none" stroke="white" strokeWidth="1"/>
          </svg>
        </div>

        {/* 头部信息栏 */}
        <div className="relative z-10 px-4 pt-3 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm">
              <Star className="w-4 h-4 text-white" />
            </div>
            <span className="text-white/90 text-sm font-medium">八字命理</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-white/80 text-xs">{todayGanZhi}</span>
            <button 
              onClick={() => navigate("/settings")}
              className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center transition-colors"
            >
              <Settings className="w-4 h-4 text-white" />
            </button>
          </div>
        </div>

        {/* 中央时辰表盘区域 */}
        <div className="relative z-10 flex flex-col items-center pt-2 pb-4">
          {/* 表盘容器 */}
          <div 
            className="relative"
            style={{
              filter: "drop-shadow(0 8px 24px rgba(0,0,0,0.3))",
            }}
          >
            <ShiChenDialCanvas size={220} />
          </div>
          
          {/* 当前节气标签 */}
          <div className="mt-3 flex items-center gap-2">
            {currentJieQi && (
              <div 
                className="px-4 py-1.5 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${COLORS.gold}25`, 
                  color: COLORS.goldLight,
                  border: `1px solid ${COLORS.gold}40`,
                  backdropFilter: "blur(4px)"
                }}
              >
                节气 · {currentJieQi}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 宜忌卡片 - 悬浮在横幅下方 */}
      <div className="relative z-20 px-4 -mt-6">
        <Card 
          style={{ 
            marginBottom: 16,
            boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
            borderRadius: "16px",
          }}
        >
          <Card.Body className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-yi)] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-yi)]" />
                  <span>今日宜</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {todayYiJi.yi.slice(0, 3).map((item, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 rounded-md bg-[var(--color-yi-soft)] text-[var(--color-yi)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-sm text-[var(--color-ji)] font-medium">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-ji)]" />
                  <span>今日忌</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {todayYiJi.ji.slice(0, 3).map((item, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-1 rounded-md bg-[var(--color-ji-soft)] text-[var(--color-ji)]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>
      </div>

      {/* 主要内容区域 */}
      <main className="px-4 py-4 pb-24">
        {/* 快捷功能入口 */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.ink }}>
            <Compass className="w-5 h-5" style={{ color: COLORS.primary }} />
            功能服务
          </h2>
          
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={() => navigate("/paipan")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-card)] shadow-sm transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.primary}15` }}
              >
                <Sparkles className="w-6 h-6" style={{ color: COLORS.primary }} />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)]">八字排盘</span>
            </button>
            
            <button 
              onClick={() => navigate("/calendar")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-card)] shadow-sm transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.gold}15` }}
              >
                <Calendar className="w-6 h-6" style={{ color: COLORS.gold }} />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)]">万年历</span>
            </button>
            
            <button 
              onClick={() => navigate("/solar-terms")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-card)] shadow-sm transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.jade}15` }}
              >
                <Sun className="w-6 h-6" style={{ color: COLORS.jade }} />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)]">节气</span>
            </button>
            
            <button 
              onClick={() => navigate("/history")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-[var(--color-card)] shadow-sm transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.amber}15` }}
              >
                <History className="w-6 h-6" style={{ color: COLORS.amber }} />
              </div>
              <span className="text-xs font-medium text-[var(--color-text)]">历史</span>
            </button>
          </div>
        </div>

        {/* 最近排盘记录 */}
        {recentHistory.length > 0 && (
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold flex items-center gap-2" style={{ color: COLORS.ink }}>
                <BookOpen className="w-5 h-5" style={{ color: COLORS.primary }} />
                最近记录
              </h2>
              <button 
                onClick={() => navigate("/history")}
                className="text-xs flex items-center gap-1 text-[var(--color-text-muted)]"
              >
                查看全部
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="space-y-3">
              {recentHistory.map((item) => (
                <Card 
                  key={item.id}
                  style={{ marginBottom: 0 }}
                  className="cursor-pointer transition-shadow"
                  onClick={() => handleHistoryClick(item)}
                >
                  <Card.Body className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span 
                            className="text-xs px-2 py-0.5 rounded-full font-medium"
                            style={{ 
                              backgroundColor: item.input.gender === 0 ? `${COLORS.primary}15` : `${COLORS.gold}15`,
                              color: item.input.gender === 0 ? COLORS.primary : COLORS.gold
                            }}
                          >
                            {getGenderText(item.input.gender)}
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">
                            {formatDateTime(item.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[var(--color-text)]">
                            {item.result.year} · {item.result.month} · {item.result.day} · {item.result.hour}
                          </span>
                        </div>
                        <div className="text-xs text-[var(--color-text-muted)] mt-1">
                          {item.input.birthDate} {item.input.birthTime}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-[var(--color-text-muted)]" />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 功能说明卡片 */}
        <Card className="bg-[var(--color-card)] border border-[var(--color-border)]">
          <Card.Body className="p-4">
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${COLORS.primary}12` }}
              >
                <Scroll className="w-5 h-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1 text-[var(--color-text)]">
                  关于八字命理
                </h3>
                <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                  八字命理是中国传统命理学的重要组成部分，通过分析出生年月日时的天干地支，
                  推算个人命格、五行喜忌、大运流年等信息。
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
