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
import { Share2, RotateCcw, Star, Sparkles, Crown } from "lucide-react";
import { Header } from "../components/Header";

// 传统中式配色
const COLORS = {
  primary: "var(--color-primary)",
  primaryLight: "var(--color-primary-light)",
  accent: "var(--color-accent)",
  accentLight: "var(--color-accent-light)",
  gold: "var(--color-gold)",
  background: "var(--color-bg)",
  cardBg: "var(--color-card)",
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
          <Card style={{ marginBottom: 12 }}>
            <Card.Body className="text-center py-12">
              <p className="text-[var(--color-text-secondary)] mb-4">暂无排盘结果</p>
              <Button onClick={() => navigate("/paipan")}>返回排盘</Button>
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
      
      {/* 顶部操作栏 */}
      <div className="px-4 py-3 flex items-center justify-between" style={{ backgroundColor: COLORS.cardBg }}>
        <div></div>
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
                  <tr style={{ backgroundColor: "var(--color-bg-elevated)" }}>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.textMuted }}></th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>年柱</th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>月柱</th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>日柱</th>
                    <th className="p-3 text-center font-medium" style={{ color: COLORS.text }}>时柱</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: `1px solid ${COLORS.border}` }}>
                    <td className="p-3 font-medium" style={{ color: COLORS.textMuted, backgroundColor: "var(--color-bg)" }}>天干</td>
                    {pillars.map((pillar) => {
                      const ganZhi = currentBazi[pillar];
                      const gan = ganZhi.charAt(0);
                      const isDayMaster = pillar === 'day';
                      return (
                        <td 
                          key={pillar} 
                          className="p-3 text-center text-lg font-bold"
                          style={{ 
                            color: isDayMaster ? COLORS.accent : COLORS.text,
                            backgroundColor: isDayMaster ? "var(--color-primary-soft)" : "transparent"
                          }}
                        >
                          {gan}
                        </td>
                      );
                    })}
                  </tr>
                  <tr>
                    <td className="p-3 font-medium" style={{ color: COLORS.textMuted, backgroundColor: "var(--color-bg)" }}>地支</td>
                    {pillars.map((pillar) => {
                      const ganZhi = currentBazi[pillar];
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
            {/* 可视化条形图 */}
            <div className="space-y-4 mb-6">
              {Object.entries(wuxingCount)
                .sort(([,a], [,b]) => b - a)
                .map(([element, count]) => {
                  const maxCount = Math.max(...Object.values(wuxingCount));
                  const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
                  const totalCount = Object.values(wuxingCount).reduce((a, b) => a + b, 0);
                  const actualPercentage = totalCount > 0 ? ((count / totalCount) * 100).toFixed(1) : '0.0';
                  
                  return (
                    <div key={element} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white font-bold text-xs"
                            style={{ backgroundColor: WUXING_COLORS[element] }}
                          >
                            {element}
                          </div>
                          <span style={{ color: COLORS.text }} className="font-medium">{element}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold" style={{ color: WUXING_COLORS[element] }}>
                            {count}个
                          </span>
                          <span className="text-xs text-[var(--color-text-muted)]">({actualPercentage}%)</span>
                        </div>
                      </div>
                      <div className="h-3 bg-[var(--color-border)] rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500 ease-out"
                          style={{ 
                            width: `${percentage}%`,
                            backgroundColor: WUXING_COLORS[element],
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
            </div>
            
            {/* 圆形统计 */}
            <div className="border-t border-gray-100 pt-4">
              <div className="flex justify-around py-2">
                {Object.entries(wuxingCount).map(([element, count]) => (
                  <div key={element} className="text-center">
                    <div 
                      className="w-12 h-12 rounded-full flex items-center justify-center mb-2"
                      style={{ 
                        backgroundColor: WUXING_COLORS[element],
                        boxShadow: "0 2px 8px rgba(0,0,0,0.15)"
                      }}
                    >
                      <span className="text-white font-bold text-lg">{element}</span>
                    </div>
                    <span className="text-sm font-medium" style={{ color: COLORS.text }}>{count}个</span>
                  </div>
                ))}
              </div>
            </div>
            
            {/* 五行相生相克提示 */}
            <div className="mt-4 p-3 bg-[var(--color-bg-elevated)] rounded-lg">
              <div className="text-xs text-[var(--color-text-secondary)] space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[#4CAF50]">● 木</span>
                  <span>→</span>
                  <span className="text-[#F44336]">● 火</span>
                  <span>→</span>
                  <span className="text-[#8B4513]">● 土</span>
                  <span>→</span>
                  <span className="text-[#FFD700]">● 金</span>
                  <span>→</span>
                  <span className="text-[#2196F3]">● 水</span>
                  <span className="ml-2 text-[var(--color-text-muted)]">(相生)</span>
                </div>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 纳音分析 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#6A4C93",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              纳音五行
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="space-y-3">
              {pillars.map((pillar) => {
                const ganZhi = currentBazi[pillar];
                const nayin = getNayin(ganZhi);
                const nayinDetail = NAYIN_DETAIL[nayin];
                return (
                  <div 
                    key={pillar}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "var(--color-bg-elevated)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                        {pillarNames[pillar]}（{ganZhi}）
                      </span>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: WUXING_COLORS[nayinDetail?.element || '金'],
                          color: 'white'
                        }}
                      >
                        {nayin}
                      </span>
                    </div>
                    {nayinDetail && (
                      <>
                        <p className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                          {nayinDetail.desc}
                        </p>
                        <div className="flex flex-wrap gap-1">
                          {nayinDetail.characteristics.slice(0, 4).map((char, index) => (
                            <span 
                              key={index}
                              className="px-1.5 py-0.5 rounded text-xs"
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

        {/* 神煞分析 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#F57C00",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              神煞分析
            </h3>
          </div>
          <Card.Body className="p-4">
            {shenShaList.length > 0 ? (
              <div className="space-y-3">
                {shenShaList.map((shenShaName) => {
                  const shenShaInfo = SHENSHA[shenShaName];
                  return (
                    <div 
                      key={shenShaName}
                      className="p-3 rounded-lg"
                      style={{ 
                        backgroundColor: shenShaInfo?.type === '吉' ? 'var(--color-success)/10' : 
                                        shenShaInfo?.type === '凶' ? 'var(--color-error)/10' : 'var(--color-warning)/10',
                        borderLeft: `3px solid ${shenShaInfo?.type === '吉' ? '#4CAF50' : 
                                                 shenShaInfo?.type === '凶' ? '#F44336' : '#FF9800'}`
                      }}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {shenShaInfo?.type === '吉' ? <Star size={16} style={{ color: '#4CAF50' }} /> :
                         shenShaInfo?.type === '凶' ? <Sparkles size={16} style={{ color: '#F44336' }} /> :
                         <Crown size={16} style={{ color: '#FF9800' }} />}
                        <span className="text-sm font-bold" style={{ 
                          color: shenShaInfo?.type === '吉' ? '#4CAF50' : 
                                 shenShaInfo?.type === '凶' ? '#F44336' : '#FF9800'
                        }}>
                          {shenShaName}
                          {shenShaInfo?.type === '吉' ? '（吉）' : 
                           shenShaInfo?.type === '凶' ? '（凶）' : '（中）'}
                        </span>
                      </div>
                      <p className="text-xs" style={{ color: COLORS.textMuted }}>
                        {shenShaInfo?.desc}
                      </p>
                      {shenShaInfo?.effect && (
                        <p className="text-xs mt-1" style={{ color: COLORS.text }}>
                          {shenShaInfo.effect}
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-center text-sm" style={{ color: COLORS.textMuted }}>
                本期命局无明显神煞
              </p>
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
              <p className="text-sm leading-relaxed mb-4" style={{ color: COLORS.textMuted }}>
                {gejuInfo?.detail}
              </p>
              
              {gejuDetail && (
                <div className="text-left space-y-4">
                  <div>
                    <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>格局特点</h4>
                    <p className="text-xs leading-relaxed" style={{ color: COLORS.textMuted }}>
                      {gejuDetail.detail}
                    </p>
                  </div>
                  
                  {gejuDetail.strengths && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: '#4CAF50' }}>优势</h4>
                      <div className="flex flex-wrap gap-1">
                        {gejuDetail.strengths.map((strength, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: 'var(--color-success)/10',
                              color: '#4CAF50'
                            }}
                          >
                            {strength}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {gejuDetail.weaknesses && (
                    <div>
                      <h4 className="text-sm font-medium mb-2" style={{ color: '#F44336' }}>注意</h4>
                      <div className="flex flex-wrap gap-1">
                        {gejuDetail.weaknesses.map((weakness, index) => (
                          <span 
                            key={index}
                            className="px-2 py-1 rounded text-xs"
                            style={{ 
                              backgroundColor: 'var(--color-error)/10',
                              color: '#F44336'
                            }}
                          >
                            {weakness}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {gejuDetail.career && (
                    <div>
                      <h4 className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>适合职业</h4>
                      <p className="text-xs" style={{ color: COLORS.textMuted }}>
                        {gejuDetail.career}
                      </p>
                    </div>
                  )}
                  
                  {gejuDetail.famousExamples && (
                    <div>
                      <h4 className="text-sm font-medium mb-1" style={{ color: COLORS.text }}>代表人物</h4>
                      <p className="text-xs" style={{ color: COLORS.textMuted }}>
                        {gejuDetail.famousExamples.join('、')}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* 喜用神分析 */}
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
              喜用神分析
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div 
                  className="p-3 rounded-lg text-center"
                  style={{ backgroundColor: `${WUXING_COLORS[xiYongShen.xiShen]}15` }}
                >
                  <span className="text-xs block mb-1" style={{ color: COLORS.textMuted }}>喜神</span>
                  <span className="text-xl font-bold" style={{ color: WUXING_COLORS[xiYongShen.xiShen] || COLORS.text }}>
                    {xiYongShen.xiShen}
                  </span>
                  <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                    {xiYongShen.xiShenDesc}
                  </p>
                </div>
                <div 
                  className="p-3 rounded-lg text-center"
                  style={{ backgroundColor: `${WUXING_COLORS[xiYongShen.yongShen]}15` }}
                >
                  <span className="text-xs block mb-1" style={{ color: COLORS.textMuted }}>用神</span>
                  <span className="text-xl font-bold" style={{ color: WUXING_COLORS[xiYongShen.yongShen] || COLORS.text }}>
                    {xiYongShen.yongShen}
                  </span>
                  <p className="text-xs mt-1" style={{ color: COLORS.textMuted }}>
                    {xiYongShen.yongShenDesc}
                  </p>
                </div>
              </div>
              
              <div>
                <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>分析依据</h4>
                <p className="text-sm" style={{ color: COLORS.textMuted }}>
                  {xiYongShen.reason}
                </p>
              </div>
              
              {xiYongShen.suggestions && (
                <div>
                  <h4 className="text-sm font-medium mb-2" style={{ color: COLORS.text }}>生活建议</h4>
                  <ul className="space-y-1">
                    {xiYongShen.suggestions.map((suggestion, index) => (
                      <li 
                        key={index}
                        className="text-xs flex items-start gap-2"
                        style={{ color: COLORS.textMuted }}
                      >
                        <span style={{ color: COLORS.gold }}>•</span>
                        {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        {/* 十神详解 */}
        <Card 
          style={{ 
            marginBottom: 12,
            border: `1px solid ${COLORS.border}`,
            boxShadow: "0 2px 12px rgba(139, 69, 19, 0.08)",
            overflow: "hidden",
          }}
        >
          <div style={{ 
            backgroundColor: "#C62828",
            padding: "16px"
          }}>
            <h3 style={{ color: "white", fontSize: "18px", fontWeight: 600 }}>
              十神详解
            </h3>
          </div>
          <Card.Body className="p-4">
            <div className="space-y-4">
              {['year', 'month', 'hour'].map((pillar) => {
                const ganZhi = currentBazi[pillar as keyof typeof currentBazi];
                const gan = String(ganZhi).charAt(0);
                const shishen = getShishen(dayMaster, gan);
                const shishenDetail = SHISHEN_DETAIL[shishen];
                
                if (!shishenDetail) return null;
                
                return (
                  <div 
                    key={pillar}
                    className="p-3 rounded-lg"
                    style={{ backgroundColor: "var(--color-bg-elevated)" }}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium" style={{ color: COLORS.text }}>
                        {pillarNames[pillar as keyof typeof pillarNames]}（{gan}）
                      </span>
                      <span 
                        className="px-2 py-1 rounded text-xs font-medium"
                        style={{ 
                          backgroundColor: COLORS.primary,
                          color: 'white'
                        }}
                      >
                        {shishen}
                      </span>
                    </div>
                    <p className="text-xs mb-2" style={{ color: COLORS.textMuted }}>
                      {shishenDetail.detail}
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {shishenDetail.strengths?.slice(0, 3).map((strength, index) => (
                        <span 
                          key={index}
                          className="px-1.5 py-0.5 rounded text-xs"
                          style={{ 
                            backgroundColor: 'var(--color-success)/10',
                            color: '#4CAF50'
                          }}
                        >
                          {strength}
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })}
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
                  style={{ backgroundColor: "var(--color-bg-elevated)" }}
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
                      backgroundColor: isCurrent ? "var(--color-primary-soft)" : "var(--color-bg-elevated)",
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
