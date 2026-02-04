import { Card, Button } from "react-vant";
import { useBaziStore } from "../store/baziStore";
import { baziCalculator } from "../utils/baziCalculator";
import {
  KNOWLEDGE_BASE,
  getShishen,
  getGeju,
  getNayin,
} from "../data/knowledgeBase";
import {
  NAYIN_DETAIL,
  SHISHEN_DETAIL,
  GEJU_DETAIL,
  DAYMASTER_DETAIL,
  CHANGSHENG,
  SHENSHA,
  getChangShengStatus,
  getShenShaList,
  analyzeXiYongShen,
} from "../data/knowledgeBaseExtended";
import { useNavigate } from "react-router-dom";
import { Share2, RotateCcw, Star, Sparkles, Crown, TrendingUp, Calendar, User, Zap } from "lucide-react";
import { Header } from "../components/Header";

// 传统中式配色
const COLORS = {
  primary: "var(--color-primary)",
  primaryLight: "var(--color-primary-light)",
  primaryDark: "var(--color-primary-dark)",
  accent: "var(--color-accent)",
  accentLight: "var(--color-accent-light)",
  gold: "var(--color-gold)",
  goldLight: "var(--color-gold-light)",
  background: "var(--color-bg)",
  cardBg: "var(--color-card)",
  bgElevated: "var(--color-bg-elevated)",
  text: "var(--color-text)",
  textMuted: "var(--color-text-muted)",
  border: "var(--color-border)",
  wood: "var(--color-wood)",
  fire: "var(--color-fire)",
  earth: "var(--color-earth)",
  metal: "var(--color-metal)",
  water: "var(--color-water)",
};

// 五行对应的颜色
const WUXING_COLORS: Record<string, string> = {
  木: COLORS.wood,
  火: COLORS.fire,
  土: COLORS.earth,
  金: COLORS.metal,
  水: COLORS.water,
};

export function BaziResultPage() {
  const navigate = useNavigate();
  const { currentBazi } = useBaziStore();
  console.log('currentBazi: ', currentBazi);

  if (!currentBazi) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: COLORS.background }}>
        <main className="flex-1 flex items-center justify-center p-4">
          <Card style={{ marginBottom: 12 }} className="animate-scale-in">
            <Card.Body className="text-center py-12">
              <div className="mb-4">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS.primary}15` }}>
                  <Calendar size={32} style={{ color: COLORS.primary }} />
                </div>
              </div>
              <p className="text-[var(--color-text-secondary)] mb-4">暂无排盘结果</p>
              <Button onClick={() => navigate("/paipan")} className="paipan-submit-btn">返回排盘</Button>
            </Card.Body>
          </Card>
        </main>
      </div>
    );
  }

  const handleRecalculate = () => {
    navigate("/paipan");
  };

  const dayMaster = currentBazi.day.charAt(0);
  const dayMasterDetail = DAYMASTER_DETAIL[dayMaster];
  const wuxingCount = baziCalculator.calculateWuxing(currentBazi);
  const dayMasterInfo = KNOWLEDGE_BASE.DAY_MASTER[dayMaster];
  const geju = getGeju(currentBazi);
  const gejuDetail = GEJU_DETAIL[geju];
  const gejuInfo = KNOWLEDGE_BASE.GEJU[geju];
  const daYun = baziCalculator.calculateDaYun(currentBazi, 1);
  const currentYear = new Date().getFullYear();
  const liuNian = baziCalculator.calculateLiuNian(currentBazi, currentYear - 2, 7);
  
  // 获取新的分析数据
  const shenShaList = getShenShaList(currentBazi);
  const xiYongShen = analyzeXiYongShen(currentBazi);

  // 获取四柱纳音
  const pillars = ['year', 'month', 'day', 'hour'] as const;
  const pillarNames = { year: '年柱', month: '月柱', day: '日柱', hour: '时柱' };

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: COLORS.background }}>
      <Header title="八字排盘结果" subtitle="中华传统命理" showBack={true} />
      
      {/* 顶部操作栏 - 玻璃拟态效果 */}
      <div className="px-4 py-3 flex items-center justify-between glass sticky top-14 z-10 animate-slide-up" style={{ marginTop: 'calc(56px + env(safe-area-inset-top))' }}>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse-soft" style={{ backgroundColor: COLORS.primary }}></div>
          <span className="text-sm font-medium" style={{ color: COLORS.text }}>命理分析</span>
        </div>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
          >
            <Share2 size={16} />
            分享
          </button>
          <button 
            onClick={handleRecalculate}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-all duration-300 hover:scale-105 active:scale-95"
            style={{ backgroundColor: `${COLORS.accent}15`, color: COLORS.accent }}
          >
            <RotateCcw size={16} />
            重新排盘
          </button>
        </div>
      </div>

      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* 基本信息卡片 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-1"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.primary,
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  基本信息
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  命理分析基础数据
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <User size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS.primary}15` }}>
                    <Calendar size={16} style={{ color: COLORS.primary }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>公历</span>
                </div>
                <span className="text-sm font-medium block" style={{ color: COLORS.text }}>
                  {currentBazi.solarDate}
                </span>
                <span className="text-xs block mt-1" style={{ color: COLORS.textMuted }}>
                  {currentBazi.time}
                </span>
              </div>
              <div className="p-3 rounded-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${COLORS.gold}15` }}>
                    <Zap size={16} style={{ color: COLORS.gold }} />
                  </div>
                  <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>农历</span>
                </div>
                <span className="text-sm font-medium block" style={{ color: COLORS.text }}>
                  {currentBazi.lunarMonth}月{currentBazi.lunarDay}日
                </span>
                <span className="text-xs block mt-1" style={{ color: COLORS.textMuted }}>
                  {currentBazi.shiChen}时
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 八字排盘表格 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-2"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.gold,
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: COLORS.text, fontSize: "18px", fontWeight: 600 }}>
                  八字排盘
                </h3>
                <p style={{ color: "rgba(0,0,0,0.7)", fontSize: "13px" }}>
                  四柱八字命盘
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(0,0,0,0.15)"
              }}>
                <TrendingUp size={20} style={{ color: COLORS.text }} />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="overflow-x-auto">
              <div className="grid grid-cols-5 gap-2">
                <div className="text-center">
                  <div className="p-3 rounded-t-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                    <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>柱位</span>
                  </div>
                  <div className="p-3 rounded-b-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                    <span className="text-xs font-medium" style={{ color: COLORS.textMuted }}>天干</span>
                  </div>
                </div>
                {pillars.map((pillar, index) => {
                  const ganZhi = currentBazi[pillar];
                  const gan = ganZhi.charAt(0);
                  const zhi = ganZhi.charAt(1);
                  const isDayMaster = pillar === 'day';
                  const pillarColors = [
                    COLORS.wood, // 年柱 - 木
                    COLORS.fire, // 月柱 - 火
                    COLORS.gold, // 日柱 - 金
                    COLORS.water, // 时柱 - 水
                  ];
                  
                  return (
                    <div key={pillar} className="text-center animate-scale-in" style={{ animationDelay: `${0.1 * (index + 1)}s` }}>
                      <div 
                        className="p-3 rounded-t-lg font-bold text-lg"
                        style={{ 
                          backgroundColor: `${pillarColors[index]}15`,
                          color: pillarColors[index],
                          borderBottom: `2px solid ${pillarColors[index]}`
                        }}
                      >
                        {pillarNames[pillar]}
                      </div>
                      <div 
                        className={`p-4 font-bold text-2xl transition-all duration-300 hover:scale-110 ${isDayMaster ? 'animate-pulse-soft' : ''}`}
                        style={{ 
                          color: isDayMaster ? COLORS.accent : COLORS.text,
                          backgroundColor: isDayMaster ? "var(--color-primary-soft)" : "var(--color-bg-elevated)",
                          borderRadius: "0 0 12px 12px",
                          boxShadow: isDayMaster ? `0 4px 12px ${COLORS.accent}30` : "none"
                        }}
                      >
                        {gan}
                        <div className="text-lg mt-1" style={{ color: isDayMaster ? COLORS.accent : COLORS.textMuted }}>
                          {zhi}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              {/* 添加五行标识 */}
              <div className="mt-4 flex justify-center gap-2">
                {pillars.map((pillar) => {
                  const ganZhi = currentBazi[pillar];
                  const gan = ganZhi.charAt(0);
                  const zhi = ganZhi.charAt(1);
                  const ganWuxing = KNOWLEDGE_BASE.TIANGAN[gan]?.element || '';
                  const zhiWuxing = KNOWLEDGE_BASE.DIZHI[zhi]?.element || '';
                  
                  return (
                    <div key={pillar} className="text-center">
                      <div className="flex gap-1 justify-center">
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: WUXING_COLORS[ganWuxing] }}
                        >
                          {ganWuxing}
                        </div>
                        <div 
                          className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: WUXING_COLORS[zhiWuxing] }}
                        >
                          {zhiWuxing}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 日主分析 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-3"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.accent,
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  日主分析
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  命格核心特质
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Star size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="text-center">
              <div className="relative inline-block mb-4">
                <div 
                  className="w-24 h-24 rounded-full flex items-center justify-center animate-float"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.accent}15 0%, ${COLORS.primary}15 100%)`,
                    border: `3px solid ${COLORS.accent}`,
                    boxShadow: `0 8px 24px ${COLORS.accent}30`
                  }}
                >
                  <span className="text-4xl font-bold gradient-text" style={{ color: COLORS.accent }}>
                    {dayMaster}
                  </span>
                </div>
                <div 
                  className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                  style={{ backgroundColor: WUXING_COLORS[dayMasterInfo.element] }}
                >
                  {dayMasterInfo.element}
                </div>
              </div>
              
              <div className="mb-4">
                <span 
                  className="inline-block px-4 py-2 rounded-full text-sm font-medium mb-2"
                  style={{ 
                    backgroundColor: `${WUXING_COLORS[dayMasterInfo.element]}15`,
                    color: WUXING_COLORS[dayMasterInfo.element],
                    border: `1px solid ${WUXING_COLORS[dayMasterInfo.element]}30`
                  }}
                >
                  {dayMasterInfo.element}{dayMasterInfo.nature}日主
                </span>
              </div>
              
              <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                  {dayMasterInfo.desc}
                </p>
              </div>
              
              {/* 日主特性标签 */}
              <div className="mt-4 flex flex-wrap gap-2 justify-center">
                {dayMasterDetail?.characteristics?.slice(0, 4).map((char, index) => (
                  <span 
                    key={index}
                    className="px-3 py-1 rounded-full text-xs font-medium animate-scale-in"
                    style={{ 
                      backgroundColor: `${WUXING_COLORS[dayMasterDetail.element]}15`,
                      color: WUXING_COLORS[dayMasterDetail.element],
                      border: `1px solid ${WUXING_COLORS[dayMasterDetail.element]}30`,
                      animationDelay: `${0.1 * index}s`
                    }}
                  >
                    {char}
                  </span>
                ))}
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 日主详细特性 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#E65100",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              日主详细特性
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="space-y-4">
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                {dayMasterDetail?.desc}
              </p>
              
              {dayMasterDetail?.characteristics && (
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>性格特点</h4>
                  <div className="flex flex-wrap gap-2">
                    {dayMasterDetail.characteristics.map((char, index) => (
                      <span 
                        key={index}
                        className="px-2 py-1 rounded text-xs"
                        style={{ 
                          backgroundColor: `${WUXING_COLORS[dayMasterDetail.element]}20`,
                          color: WUXING_COLORS[dayMasterDetail.element]
                        }}
                      >
                        {char}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {dayMasterDetail?.suitableCareers && (
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>适合职业</h4>
                  <p className="text-xs" style={{ color: COLORS.textMuted }}>
                    {dayMasterDetail.suitableCareers.join('、')}
                  </p>
                </div>
              )}

              {dayMasterDetail?.favorableElements && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>喜用五行</h4>
                    <p className="text-xs" style={{ color: COLORS.wood }}>
                      {dayMasterDetail.favorableElements.join('、')}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>忌讳五行</h4>
                    <p className="text-xs" style={{ color: COLORS.accent }}>
                      {dayMasterDetail.unfavorableElements.join('、')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* 五行分析 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-4"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.wood,
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  五行分析
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  命局五行平衡
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Sparkles size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            {/* 五行环形图 */}
            <div className="mb-6">
              <div className="relative w-48 h-48 mx-auto">
                {/* 背景圆环 */}
                <div className="absolute inset-0 rounded-full" style={{ 
                  background: "conic-gradient(from 0deg, #4A7C59 0deg 72deg, #C75B39 72deg 144deg, #8B7355 144deg 216deg, #D4AF37 216deg 288deg, #3B6B8C 288deg 360deg)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)"
                }}></div>
                {/* 内圆 */}
                <div className="absolute inset-4 rounded-full flex items-center justify-center" style={{ backgroundColor: COLORS.cardBg }}>
                  <div className="text-center">
                    <div className="text-2xl font-bold gradient-text">五行</div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>平衡分析</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 五行统计卡片 */}
            <div className="grid grid-cols-5 gap-2 mb-6">
              {Object.entries(wuxingCount)
                .sort(([,a], [,b]) => b - a)
                .map(([element, count], index) => {
                  const totalCount = Object.values(wuxingCount).reduce((a, b) => a + b, 0);
                  const percentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <div 
                      key={element} 
                      className="text-center p-3 rounded-lg animate-scale-in"
                      style={{ 
                        backgroundColor: `${WUXING_COLORS[element]}15`,
                        border: `1px solid ${WUXING_COLORS[element]}30`,
                        animationDelay: `${0.1 * index}s`
                      }}
                    >
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-2"
                        style={{ 
                          backgroundColor: WUXING_COLORS[element],
                          boxShadow: `0 2px 8px ${WUXING_COLORS[element]}40`
                        }}
                      >
                        <span className="text-white font-bold">{element}</span>
                      </div>
                      <div className="text-xs font-bold" style={{ color: WUXING_COLORS[element] }}>
                        {count}个
                      </div>
                      <div className="text-xs" style={{ color: COLORS.textMuted }}>
                        {percentage}%
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {/* 五行相生相克图 */}
            <div className="p-4 rounded-lg" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
              <div className="text-center mb-3">
                <span className="text-sm font-medium" style={{ color: COLORS.text }}>五行相生相克</span>
              </div>
              <div className="flex justify-center items-center gap-1 flex-wrap">
                {[
                  { element: '木', color: COLORS.wood },
                  { element: '火', color: COLORS.fire },
                  { element: '土', color: COLORS.earth },
                  { element: '金', color: COLORS.gold },
                  { element: '水', color: COLORS.water }
                ].map((item, index) => (
                  <div key={item.element} className="flex items-center">
                    <div 
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: item.color }}
                    >
                      {item.element}
                    </div>
                    {index < 4 && (
                      <div className="w-4 h-0.5 mx-1" style={{ backgroundColor: COLORS.border }}></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-center gap-4 mt-3">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.wood }}></div>
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>相生</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS.fire }}></div>
                  <span className="text-xs" style={{ color: COLORS.textMuted }}>相克</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 纳音分析 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-5"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#6A4C93",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  纳音五行
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  四柱纳音属性
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Crown size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="grid grid-cols-2 gap-3">
              {pillars.map((pillar, index) => {
                const ganZhi = currentBazi[pillar];
                const nayin = getNayin(ganZhi);
                const nayinDetail = NAYIN_DETAIL[nayin];
                const pillarColors = [
                  COLORS.wood, // 年柱
                  COLORS.fire, // 月柱
                  COLORS.gold, // 日柱
                  COLORS.water, // 时柱
                ];
                
                return (
                  <div 
                    key={pillar}
                    className="p-4 rounded-lg animate-scale-in transition-all duration-300 hover:scale-105"
                    style={{ 
                      backgroundColor: "var(--color-bg-elevated)",
                      border: `1px solid ${pillarColors[index]}30`,
                      animationDelay: `${0.1 * index}s`
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                        {pillarNames[pillar]}
                      </span>
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                        style={{ backgroundColor: pillarColors[index] }}
                      >
                        {ganZhi}
                      </div>
                    </div>
                    <div className="mb-2">
                      <span 
                        className="inline-block px-3 py-1 rounded-full text-xs font-medium w-full text-center"
                        style={{ 
                          backgroundColor: `${WUXING_COLORS[nayinDetail?.element || '金']}15`,
                          color: WUXING_COLORS[nayinDetail?.element || '金'],
                          border: `1px solid ${WUXING_COLORS[nayinDetail?.element || '金']}30`
                        }}
                      >
                        {nayin}
                      </span>
                    </div>
                    {nayinDetail && (
                      <>
                        <p className="text-xs mb-2 line-clamp-2" style={{ color: COLORS.textMuted }}>
                          {nayinDetail.desc}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {nayinDetail.characteristics.slice(0, 2).map((char, idx) => (
                            <span 
                              key={idx}
                              className="px-2 py-0.5 rounded text-xs"
                              style={{ 
                                backgroundColor: `${WUXING_COLORS[nayinDetail.element]}15`,
                                color: WUXING_COLORS[nayinDetail.element]
                              }}
                            >
                              {char}
                            </span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* 神煞分析 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-6"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#F57C00",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  神煞分析
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  命局神煞吉凶
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Sparkles size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            {shenShaList.length > 0 ? (
              <div className="space-y-3">
                {shenShaList.map((shenShaName, index) => {
                  const shenShaInfo = SHENSHA[shenShaName];
                  const isGood = shenShaInfo?.type === '吉';
                  const isBad = shenShaInfo?.type === '凶';
                  const typeColor = isGood ? '#4CAF50' : isBad ? '#F44336' : '#FF9800';
                  const bgColor = isGood ? 'rgba(76, 175, 80, 0.1)' : isBad ? 'rgba(244, 67, 54, 0.1)' : 'rgba(255, 152, 0, 0.1)';
                  
                  return (
                    <div 
                      key={shenShaName}
                      className="p-4 rounded-lg animate-scale-in transition-all duration-300 hover:scale-102"
                      style={{ 
                        backgroundColor: bgColor,
                        border: `1px solid ${typeColor}30`,
                        borderLeft: `4px solid ${typeColor}`,
                        animationDelay: `${0.1 * index}s`
                      }}
                    >
                      <div className="flex items-center gap-3 mb-2">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: typeColor }}
                        >
                          {isGood ? <Star size={18} color="white" /> :
                           isBad ? <Sparkles size={18} color="white" /> :
                           <Crown size={18} color="white" />}
                        </div>
                        <div className="flex-1">
                          <span className="text-sm font-bold" style={{ color: typeColor }}>
                            {shenShaName}
                            <span className="ml-1 text-xs opacity-75">
                              {isGood ? '（吉）' : isBad ? '（凶）' : '（中）'}
                            </span>
                          </span>
                        </div>
                      </div>
                      <p className="text-xs mb-2 pl-13" style={{ color: COLORS.textMuted }}>
                        {shenShaInfo?.desc}
                      </p>
                      {shenShaInfo?.effect && (
                        <div className="pl-13">
                          <span 
                            className="inline-block px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: `${typeColor}15`,
                              color: typeColor
                            }}
                          >
                            {shenShaInfo.effect}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-3" style={{ 
                  backgroundColor: `${COLORS.gold}15`,
                  border: `2px dashed ${COLORS.gold}50`
                }}>
                  <Crown size={32} style={{ color: COLORS.gold }} />
                </div>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  本期命局无明显神煞
                </p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* 十二长生状态 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#00796B",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              十二长生状态
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="space-y-2">
              {pillars.map((pillar) => {
                const ganZhi = currentBazi[pillar];
                const zhi = ganZhi.charAt(1);
                const changSheng = getChangShengStatus(dayMaster, zhi);
                const changShengInfo = CHANGSHENG[changSheng];
                return (
                  <div 
                    key={pillar}
                    className="flex items-center justify-between py-2 px-3 rounded-lg"
                    style={{ backgroundColor: "var(--color-bg-elevated)" }}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                        {pillarNames[pillar]}
                      </span>
                      <span className="text-sm" style={{ color: COLORS.textMuted }}>
                        {zhi}
                      </span>
                    </div>
                    <div className="text-right">
                      <span 
                        className="text-sm font-bold"
                        style={{ 
                          color: ['长生', '临官', '帝旺'].includes(changSheng) ? '#4CAF50' :
                                 ['衰', '病', '死'].includes(changSheng) ? '#F44336' : COLORS.text
                        }}
                      >
                        {changSheng}
                      </span>
                      {changShengInfo && (
                        <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                          {changShengInfo.meaning}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* 格局分析 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-7"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#5D4037",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  格局分析
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  命局格局特点
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <TrendingUp size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="text-center mb-4">
              <div className="relative inline-block">
                <span 
                  className="inline-block px-6 py-3 rounded-2xl text-xl font-bold animate-float"
                  style={{ 
                    background: `linear-gradient(135deg, ${COLORS.gold} 0%, ${COLORS.goldLight} 100%)`,
                    color: COLORS.text,
                    boxShadow: `0 8px 24px ${COLORS.gold}40`
                  }}
                >
                  {geju}
                </span>
              </div>
            </div>
            
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                {gejuInfo?.detail}
              </p>
            </div>
            
            {gejuDetail && (
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: COLORS.text }}>
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.gold }}></div>
                    格局特点
                  </h4>
                  <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
                    {gejuDetail.detail}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  {gejuDetail.strengths && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#4CAF50' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#4CAF50' }}></div>
                        优势
                      </h4>
                      <div className="space-y-1">
                        {gejuDetail.strengths.slice(0, 3).map((strength, index) => (
                          <div 
                            key={index}
                            className="px-3 py-2 rounded-lg text-xs animate-scale-in"
                            style={{ 
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: '#4CAF50',
                              border: '1px solid rgba(76, 175, 80, 0.2)',
                              animationDelay: `${0.1 * index}s`
                            }}
                          >
                            {strength}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {gejuDetail.weaknesses && (
                    <div>
                      <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: '#F44336' }}>
                        <div className="w-2 h-2 rounded-full" style={{ backgroundColor: '#F44336' }}></div>
                        注意
                      </h4>
                      <div className="space-y-1">
                        {gejuDetail.weaknesses.slice(0, 3).map((weakness, index) => (
                          <div 
                            key={index}
                            className="px-3 py-2 rounded-lg text-xs animate-scale-in"
                            style={{ 
                              backgroundColor: 'rgba(244, 67, 54, 0.1)',
                              color: '#F44336',
                              border: '1px solid rgba(244, 67, 54, 0.2)',
                              animationDelay: `${0.1 * index}s`
                            }}
                          >
                            {weakness}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                
                {gejuDetail.career && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: COLORS.text }}>
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
                      适合职业
                    </h4>
                    <div className="p-3 rounded-lg" style={{ 
                      backgroundColor: `${COLORS.primary}10`,
                      border: `1px solid ${COLORS.primary}20`
                    }}>
                      <p className="text-xs" style={{ color: COLORS.primary }}>
                        {gejuDetail.career}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </Card.Body>
        </Card>

        {/* 喜用神分析 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-8"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#1565C0",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  喜用神分析
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  命局平衡关键
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Zap size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div 
                className="p-4 rounded-xl text-center animate-scale-in transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: `${WUXING_COLORS[xiYongShen.xiShen]}15`,
                  border: `2px solid ${WUXING_COLORS[xiYongShen.xiShen]}30`,
                  boxShadow: `0 4px 12px ${WUXING_COLORS[xiYongShen.xiShen]}20`
                }}
              >
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-soft"
                    style={{ 
                      backgroundColor: WUXING_COLORS[xiYongShen.xiShen],
                      boxShadow: `0 4px 12px ${WUXING_COLORS[xiYongShen.xiShen]}40`
                    }}
                  >
                    <span className="text-2xl font-bold text-white">{xiYongShen.xiShen}</span>
                  </div>
                  <div 
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                    style={{ backgroundColor: COLORS.gold }}
                  >
                    喜
                  </div>
                </div>
                <span className="text-xs block mb-1 font-medium" style={{ color: COLORS.textMuted }}>喜神</span>
                <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                  {xiYongShen.xiShenDesc}
                </p>
              </div>
              
              <div 
                className="p-4 rounded-xl text-center animate-scale-in transition-all duration-300 hover:scale-105"
                style={{ 
                  backgroundColor: `${WUXING_COLORS[xiYongShen.yongShen]}15`,
                  border: `2px solid ${WUXING_COLORS[xiYongShen.yongShen]}30`,
                  boxShadow: `0 4px 12px ${WUXING_COLORS[xiYongShen.yongShen]}20`,
                  animationDelay: "0.2s"
                }}
              >
                <div className="relative">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3 animate-pulse-soft"
                    style={{ 
                      backgroundColor: WUXING_COLORS[xiYongShen.yongShen],
                      boxShadow: `0 4px 12px ${WUXING_COLORS[xiYongShen.yongShen]}40`
                    }}
                  >
                    <span className="text-2xl font-bold text-white">{xiYongShen.yongShen}</span>
                  </div>
                  <div 
                    className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-xs text-white font-bold"
                    style={{ backgroundColor: COLORS.gold }}
                  >
                    用
                  </div>
                </div>
                <span className="text-xs block mb-1 font-medium" style={{ color: COLORS.textMuted }}>用神</span>
                <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                  {xiYongShen.yongShenDesc}
                </p>
              </div>
            </div>
            
            <div className="p-4 rounded-lg mb-4" style={{ backgroundColor: "var(--color-bg-elevated)" }}>
              <h4 className="text-sm font-medium mb-2 flex items-center gap-2" style={{ color: COLORS.text }}>
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.primary }}></div>
                分析依据
              </h4>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                {xiYongShen.reason}
              </p>
            </div>
            
            {xiYongShen.suggestions && (
              <div>
                <h4 className="text-sm font-medium mb-3 flex items-center gap-2" style={{ color: COLORS.text }}>
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS.gold }}></div>
                  生活建议
                </h4>
                <div className="space-y-2">
                  {xiYongShen.suggestions.slice(0, 3).map((suggestion, index) => (
                    <div 
                      key={index}
                      className="flex items-start gap-3 p-3 rounded-lg animate-scale-in"
                      style={{ 
                        backgroundColor: `${COLORS.gold}10`,
                        border: `1px solid ${COLORS.gold}20`,
                        animationDelay: `${0.1 * index}s`
                      }}
                    >
                      <div 
                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-bold text-white"
                        style={{ backgroundColor: COLORS.gold }}
                      >
                        {index + 1}
                      </div>
                      <p className="text-xs flex-1" style={{ color: COLORS.textMuted }}>
                        {suggestion}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* 十神详解 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-9"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#C62828",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  十神详解
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  十神关系分析
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Star size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="grid grid-cols-1 gap-3">
              {['year', 'month', 'hour'].map((pillar, index) => {
                const ganZhi = currentBazi[pillar as keyof typeof currentBazi];
                const gan = String(ganZhi).charAt(0);
                const shishen = getShishen(dayMaster, gan);
                const shishenDetail = SHISHEN_DETAIL[shishen];
                const pillarColors = [
                  COLORS.wood, // 年柱
                  COLORS.fire, // 月柱
                  COLORS.water, // 时柱
                ];
                
                if (!shishenDetail) return null;
                
                return (
                  <div 
                    key={pillar}
                    className="p-4 rounded-lg animate-scale-in transition-all duration-300 hover:scale-102"
                    style={{ 
                      backgroundColor: "var(--color-bg-elevated)",
                      border: `1px solid ${pillarColors[index]}30`,
                      animationDelay: `${0.1 * index}s`
                    }}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                          style={{ backgroundColor: pillarColors[index] }}
                        >
                          {gan}
                        </div>
                        <div>
                          <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                            {pillarNames[pillar as keyof typeof pillarNames]}
                          </span>
                          <div className="text-xs" style={{ color: COLORS.textMuted }}>
                            天干: {gan}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <span 
                          className="inline-block px-3 py-1 rounded-full text-xs font-medium"
                          style={{ 
                            backgroundColor: `${COLORS.primary}15`,
                            color: COLORS.primary,
                            border: `1px solid ${COLORS.primary}30`
                          }}
                        >
                          {shishen}
                        </span>
                      </div>
                    </div>
                    
                    <p className="text-xs mb-3 leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {shishenDetail.detail}
                    </p>
                    
                    {shishenDetail.strengths && (
                      <div className="flex flex-wrap gap-1">
                        {shishenDetail.strengths.slice(0, 3).map((strength, idx) => (
                          <span 
                            key={idx}
                            className="px-2 py-1 rounded text-xs animate-scale-in"
                            style={{ 
                              backgroundColor: 'rgba(76, 175, 80, 0.1)',
                              color: '#4CAF50',
                              border: '1px solid rgba(76, 175, 80, 0.2)',
                              animationDelay: `${0.1 * idx}s`
                            }}
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* 大运走势 - 重新设计 */}
        <Card 
          className="animate-slide-up stagger-10"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#1565C0",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  大运走势
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  人生阶段运势
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <TrendingUp size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="space-y-3">
              {daYun.slice(0, 5).map((dy, index) => {
                const isCurrent = currentYear >= dy.startAge && currentYear <= dy.endAge;
                const pillarColors = [
                  COLORS.wood, // 年柱
                  COLORS.fire, // 月柱
                  COLORS.gold, // 日柱
                  COLORS.water, // 时柱
                  COLORS.earth, // 第五运
                ];
                
                return (
                  <div 
                    key={dy.order}
                    className={`p-4 rounded-lg flex items-center justify-between animate-scale-in transition-all duration-300 ${isCurrent ? 'hover:scale-102' : 'hover:scale-102'}`}
                    style={{ 
                      backgroundColor: isCurrent ? `${COLORS.accent}15` : "var(--color-bg-elevated)",
                      border: isCurrent ? `2px solid ${COLORS.accent}` : `1px solid ${COLORS.border}`,
                      boxShadow: isCurrent ? `0 4px 12px ${COLORS.accent}30` : "none",
                      animationDelay: `${0.1 * index}s`
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ backgroundColor: pillarColors[index] }}
                      >
                        {dy.order}
                      </div>
                      <div>
                        <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                          第{dy.order}运
                        </span>
                        {isCurrent && (
                          <span 
                            className="ml-2 px-2 py-0.5 rounded-full text-xs"
                            style={{ 
                              backgroundColor: COLORS.accent,
                              color: 'white'
                            }}
                          >
                            当前
                          </span>
                        )}
                        <div className="text-xs" style={{ color: COLORS.textMuted }}>
                          {dy.startAge}-{dy.endAge}岁
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div 
                        className="text-lg font-bold px-3 py-1 rounded-lg"
                        style={{ 
                          color: pillarColors[index],
                          backgroundColor: `${pillarColors[index]}15`,
                          border: `1px solid ${pillarColors[index]}30`
                        }}
                      >
                        {dy.ganZhi}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* 流年运势 - 重新设计 */}
        <Card 
          className="animate-slide-up"
          style={{ 
            marginBottom: 16,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "var(--shadow-md)",
            overflow: "hidden",
            borderRadius: "12px",
            backgroundColor: COLORS.cardBg,
          }}
        >
          <div style={{ 
            backgroundColor: "#6A1B9A",
            padding: "16px"
          }}>
            <div className="flex items-center justify-between">
              <div>
                <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
                  流年运势
                </h3>
                <p style={{ color: "rgba(255,255,255,0.9)", fontSize: "13px" }}>
                  近期年份运势
                </p>
              </div>
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ 
                backgroundColor: "rgba(255,255,255,0.2)"
              }}>
                <Calendar size={20} color="white" />
              </div>
            </div>
          </div>
          <Card.Body className="p-5">
            <div className="grid grid-cols-3 gap-3">
              {liuNian.map((ln, index) => {
                const isCurrent = ln.year === currentYear;
                const isPast = ln.year < currentYear;
                
                return (
                  <div 
                    key={ln.year}
                    className={`text-center p-4 rounded-lg animate-scale-in transition-all duration-300 ${isCurrent ? 'hover:scale-105' : 'hover:scale-102'}`}
                    style={{ 
                      backgroundColor: isCurrent ? `${COLORS.accent}15` : isPast ? "var(--color-bg-elevated)" : `${COLORS.primary}10`,
                      border: isCurrent ? `2px solid ${COLORS.accent}` : isPast ? `1px solid ${COLORS.border}` : `1px solid ${COLORS.primary}30`,
                      boxShadow: isCurrent ? `0 4px 12px ${COLORS.accent}30` : "none",
                      opacity: isPast ? 0.7 : 1,
                      animationDelay: `${0.1 * index}s`
                    }}
                  >
                    <div className="text-xs mb-2 font-medium" style={{ color: COLORS.textMuted }}>
                      {ln.year}年
                    </div>
                    <div 
                      className="text-lg font-bold mb-2 px-2 py-1 rounded"
                      style={{ 
                        color: isCurrent ? COLORS.accent : COLORS.text,
                        backgroundColor: isCurrent ? `${COLORS.accent}15` : "transparent"
                      }}
                    >
                      {ln.ganZhi}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>
                      {getShishen(dayMaster, ln.ganZhi.charAt(0))}
                    </div>
                    {isCurrent && (
                      <div 
                        className="mt-2 text-xs px-2 py-1 rounded-full"
                        style={{ 
                          backgroundColor: COLORS.accent,
                          color: 'white'
                        }}
                      >
                        本年
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>
      </main>
    </div>
  );
}
