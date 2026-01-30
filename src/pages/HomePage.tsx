import { useNavigate } from "react-router-dom";
import { Card, Button } from "react-vant";
import { useHistoryStore } from "../store/historyStore";
import { useBaziStore } from "../store/baziStore";
import type { HistoryItem } from "../types";
import lunisolar from "lunisolar";
import { 
  Sparkles, 
  Calendar, 
  Clock, 
  Sun, 
  History, 
  ChevronRight,
  User,
  Star,
  Compass,
  BookOpen,
  Scroll,
  CircleDot
} from "lucide-react";
import { Logo } from "../components/Logo";

// 中国传统色彩
const COLORS = {
  primary: "#C41E3A",     // 朱砂红
  primaryLight: "#E85A71",
  gold: "#D4AF37",        // 金色
  goldLight: "#F4D03F",
  ink: "#2C1810",         // 墨黑
  paper: "#FAF8F5",       // 宣纸色
  jade: "#00A86B",        // 翡翠绿
  amber: "#FFBF00",       // 琥珀
};

// 获取今日宜忌
function getTodayYiJi(): { yi: string[]; ji: string[] } {
  const today = new Date();
  const lsr = lunisolar(today);
  
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
    <div className="min-h-screen" style={{ backgroundColor: COLORS.paper }}>
      {/* 顶部装饰区域 */}
      <div 
        className="relative overflow-hidden"
        style={{ 
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          minHeight: "200px"
        }}
      >
        {/* 装饰图案 */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-4 w-32 h-32 rounded-full border-2 border-white" />
          <div className="absolute bottom-4 left-4 w-24 h-24 rounded-full border border-white" />
          <div className="absolute top-1/2 left-1/4 w-16 h-16 rounded-full border border-white" />
        </div>
        
        {/* Logo和标题 */}
        <div className="relative z-10 px-6 pt-8 pb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">八字命理</h1>
              <p className="text-sm text-white/80">传承中华传统智慧</p>
            </div>
          </div>
          
          {/* 今日信息卡片 */}
          <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-4 shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm text-gray-600">{todayGanZhi}</span>
              {currentJieQi && (
                <span 
                  className="px-2 py-1 rounded-full text-xs font-medium"
                  style={{ backgroundColor: `${COLORS.gold}20`, color: COLORS.gold }}
                >
                  {currentJieQi}
                </span>
              )}
            </div>
            
            {/* 宜忌 */}
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                  <CircleDot className="w-3 h-3" />
                  <span>宜</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {todayYiJi.yi.slice(0, 3).map((item, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1 text-xs text-red-600 font-medium">
                  <CircleDot className="w-3 h-3" />
                  <span>忌</span>
                </div>
                <div className="flex flex-wrap gap-1">
                  {todayYiJi.ji.slice(0, 3).map((item, i) => (
                    <span 
                      key={i}
                      className="text-xs px-2 py-0.5 rounded-full bg-red-50 text-red-700"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <main className="px-4 py-6 pb-24 -mt-2">
        {/* 快捷功能入口 */}
        <div className="mb-6">
          <h2 className="text-base font-bold mb-4 flex items-center gap-2" style={{ color: COLORS.ink }}>
            <Compass className="w-5 h-5" style={{ color: COLORS.primary }} />
            快捷功能
          </h2>
          
          <div className="grid grid-cols-4 gap-3">
            <button 
              onClick={() => navigate("/paipan")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.primary}15` }}
              >
                <Sparkles className="w-6 h-6" style={{ color: COLORS.primary }} />
              </div>
              <span className="text-xs font-medium text-gray-700">八字排盘</span>
            </button>
            
            <button 
              onClick={() => navigate("/calendar")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.gold}15` }}
              >
                <Calendar className="w-6 h-6" style={{ color: COLORS.gold }} />
              </div>
              <span className="text-xs font-medium text-gray-700">万年历</span>
            </button>
            
            <button 
              onClick={() => navigate("/solar-terms")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.jade}15` }}
              >
                <Sun className="w-6 h-6" style={{ color: COLORS.jade }} />
              </div>
              <span className="text-xs font-medium text-gray-700">节气</span>
            </button>
            
            <button 
              onClick={() => navigate("/history")}
              className="flex flex-col items-center gap-2 p-3 rounded-xl bg-white shadow-sm hover:shadow-md transition-all active:scale-95"
            >
              <div 
                className="w-12 h-12 rounded-full flex items-center justify-center"
                style={{ backgroundColor: `${COLORS.amber}15` }}
              >
                <History className="w-6 h-6" style={{ color: COLORS.amber }} />
              </div>
              <span className="text-xs font-medium text-gray-700">历史</span>
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
                className="text-xs flex items-center gap-1 text-gray-500 hover:text-gray-700"
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
                  className="cursor-pointer hover:shadow-md transition-shadow"
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
                          <span className="text-xs text-gray-400">
                            {formatDateTime(item.timestamp)}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium" style={{ color: COLORS.ink }}>
                            {item.result.year} · {item.result.month} · {item.result.day} · {item.result.hour}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {item.input.birthDate} {item.input.birthTime}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-400" />
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* 功能说明卡片 */}
        <Card style={{ backgroundColor: `${COLORS.primary}08` }}>
          <Card.Body className="p-4">
            <div className="flex items-start gap-3">
              <div 
                className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: `${COLORS.primary}15` }}
              >
                <Scroll className="w-5 h-5" style={{ color: COLORS.primary }} />
              </div>
              <div>
                <h3 className="font-bold text-sm mb-1" style={{ color: COLORS.ink }}>
                  关于八字排盘
                </h3>
                <p className="text-xs text-gray-600 leading-relaxed">
                  八字命理是中国传统命理学的重要组成部分，通过分析出生年月日时的天干地支，
                  推算个人命格、五行喜忌、大运流年等信息。本应用提供专业的八字排盘和命理分析功能。
                </p>
              </div>
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
