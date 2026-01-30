import { Card, Button } from "react-vant";
import { useBaziStore } from "../store/baziStore";
import { baziCalculator } from "../utils/baziCalculator";
import {
  KNOWLEDGE_BASE,
  getShishen,
  getGeju,
} from "../data/knowledgeBase";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Share2, RotateCcw } from "lucide-react";
import { Header } from "@/components/Header";

// 传统中式配色
const COLORS = {
  primary: "#8B4513",
  primaryLight: "#A0522D",
  accent: "#C41E3A",
  accentLight: "#DC143C",
  gold: "#DAA520",
  background: "#FAF8F5",
  cardBg: "#FFFFFF",
  text: "#2C1810",
  textMuted: "#6B4423",
  border: "#D4C5B5",
};

export function BaziResultPage() {
  const navigate = useNavigate();
  const { currentBazi } = useBaziStore();
  console.log('currentBazi: ', currentBazi);

  if (!currentBazi) {
    return (
      <div className="flex flex-col h-full" style={{ backgroundColor: COLORS.background }}>
        <main className="flex-1 flex items-center justify-center p-4">
          <Card style={{ marginBottom: 12 }}>
            <Card.Body className="text-center py-12">
              <p className="text-gray-600 mb-4">暂无排盘结果</p>
              <Button onClick={() => navigate("/")}>返回排盘</Button>
            </Card.Body>
          </Card>
        </main>
      </div>
    );
  }

  const handleBack = () => {
    navigate("/");
  };

  const handleRecalculate = () => {
    navigate("/");
  };

  const dayMaster = currentBazi.day.charAt(0);
  const wuxingCount = baziCalculator.calculateWuxing(currentBazi);
  const dayMasterInfo = KNOWLEDGE_BASE.DAY_MASTER[dayMaster];
  const geju = getGeju(currentBazi);
  const gejuInfo = KNOWLEDGE_BASE.GEJU[geju];
  const daYun = baziCalculator.calculateDaYun(currentBazi, 1);
  const currentYear = new Date().getFullYear();
  const liuNian = baziCalculator.calculateLiuNian(currentBazi, currentYear - 2, 7);

  return (
    <div className="flex flex-col h-full" style={{ backgroundColor: COLORS.background }}>
      <Header title="八字排盘结果" subtitle="中华传统命理" showBack={true} />
      
      {/* 顶部操作栏 */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: COLORS.cardBg }}>
        <button 
          onClick={handleBack}
          className="flex items-center gap-1 text-sm"
          style={{ color: COLORS.primary }}
        >
          <ArrowLeft size={18} />
          返回
        </button>
        <div className="flex items-center gap-3">
          <button 
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: `${COLORS.primary}15`, color: COLORS.primary }}
          >
            <Share2 size={16} />
            分享
          </button>
          <button 
            onClick={handleRecalculate}
            className="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg"
            style={{ backgroundColor: `${COLORS.accent}15`, color: COLORS.accent }}
          >
            <RotateCcw size={16} />
            重新排盘
          </button>
        </div>
      </div>

      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* 基本信息卡片 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.primary,
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              基本信息
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <span className="text-xs block mb-1" style={{ color: COLORS.textMuted }}>公历</span>
                <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                  {currentBazi.solarDate} {currentBazi.time}
                </span>
              </div>
              <div>
                <span className="text-xs block mb-1" style={{ color: COLORS.textMuted }}>农历</span>
                <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                  {currentBazi.shiChen}时
                </span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 八字排盘表格 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.gold,
            padding: "16px"
          }}>
            <h3 style={{ color: COLORS.text, fontSize: "18px", fontWeight: 600 }}>
              八字排盘
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ backgroundColor: "#F5F0E8" }}>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.textMuted }}></th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>年柱</th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>月柱</th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>日柱</th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>时柱</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="p-3 font-medium" style={{ color: COLORS.textMuted, backgroundColor: "#FAFAF8" }}>天干</td>
                    {['year', 'month', 'day', 'hour'].map((pillar) => {
                      const ganZhi = currentBazi[pillar as keyof typeof currentBazi] as string;
                      const gan = ganZhi.charAt(0);
                      const isDayMaster = pillar === 'day';
                      return (
                        <td 
                          key={pillar} 
                          className="p-3 text-center text-lg font-bold"
                          style={{ 
                            color: isDayMaster ? COLORS.accent : COLORS.text,
                            backgroundColor: isDayMaster ? "#FFF5F5" : "transparent"
                          }}
                        >
                          {gan}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium" style={{ color: COLORS.textMuted, backgroundColor: "#FAFAF8" }}>地支</td>
                    {['year', 'month', 'day', 'hour'].map((pillar) => {
                      const ganZhi = currentBazi[pillar as keyof typeof currentBazi] as string;
                      const zhi = ganZhi.charAt(1);
                      return (
                        <td 
                          key={pillar} 
                          className="p-3 text-center text-lg font-bold"
                          style={{ color: COLORS.text }}
                        >
                          {zhi}
                        </td>
                      );
                    })}
                  </tr>
                </tbody>
              </table>
            </div>
          </Card.Body>
        </Card>

        {/* 日主分析 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: COLORS.accent,
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              日主分析
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="text-center py-4">
              <div 
                className="inline-block px-6 py-3 rounded-full mb-3"
                style={{ 
                  backgroundColor: `${COLORS.accent}15`,
                  border: `2px solid ${COLORS.accent}`
                }}
              >
                <span className="text-3xl font-bold" style={{ color: COLORS.accent }}>
                  {dayMaster}
                </span>
              </div>
              <p className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>
                {dayMasterInfo.element}{dayMasterInfo.nature}日主
              </p>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                {dayMasterInfo.desc}
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* 五行分析 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#2E7D32",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              五行分析
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="flex justify-around py-4">
              {Object.entries(wuxingCount).map(([element, count]) => {
                const colors: Record<string, string> = {
                  木: "#4CAF50",
                  火: "#F44336",
                  土: "#8B4513",
                  金: "#FFD700",
                  水: "#2196F3",
                };
                return (
                  <div key={element} className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ 
                        backgroundColor: colors[element],
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                      }}
                    >
                      <span className="text-white font-bold text-lg">{element}</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: COLORS.text }}>{count}个</span>
                  </div>
                );
              })}
            </div>
          </Card.Body>
        </Card>

        {/* 格局分析 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#5D4037",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              格局分析
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="text-center py-3">
              <span 
                className="inline-block px-4 py-2 rounded-lg text-lg font-bold mb-3"
                style={{ 
                  backgroundColor: COLORS.gold,
                  color: COLORS.text
                }}
              >
                {geju}
              </span>
              <p className="text-sm leading-relaxed" style={{ color: COLORS.textMuted }}>
                {gejuInfo?.detail}
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* 大运走势 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#1565C0",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              大运走势
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="space-y-2">
              {daYun.slice(0, 5).map((dy) => (
                <div 
                  key={dy.order}
                  className="flex items-center justify-between py-2 px-3 rounded-lg"
                  style={{ backgroundColor: "#F5F0E8" }}
                >
                  <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                    第{dy.order}运
                  </span>
                  <span className="text-sm" style={{ color: COLORS.textMuted }}>
                    {dy.startAge}-{dy.endAge}岁
                  </span>
                  <span className="text-sm font-bold" style={{ color: COLORS.accent }}>
                    {dy.ganZhi}
                  </span>
                </div>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* 流年运势 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#6A1B9A",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              流年运势
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="grid grid-cols-3 gap-2">
              {liuNian.map((ln) => {
                const isCurrent = ln.year === currentYear;
                return (
                  <div 
                    key={ln.year}
                    className="text-center py-3 px-2 rounded-lg"
                    style={{ 
                      backgroundColor: isCurrent ? "#FFF5F5" : "#F5F0E8",
                      border: isCurrent ? `1px solid ${COLORS.accent}` : "none"
                    }}
                  >
                    <div className="text-xs mb-1" style={{ color: COLORS.textMuted }}>
                      {ln.year}年
                      {isCurrent && <span style={{ color: COLORS.accent }}> (本年)</span>}
                    </div>
                    <div className="text-sm font-bold" style={{ color: COLORS.text }}>
                      {ln.ganZhi}
                    </div>
                    <div className="text-xs" style={{ color: COLORS.textMuted }}>
                      {getShishen(dayMaster, ln.ganZhi.charAt(0))}
                    </div>
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
