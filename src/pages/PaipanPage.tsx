import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useBaziStore } from "../store/baziStore";
import {
  DatetimePicker,
  Radio,
  Card,
  Button,
  Picker,
  Toast,
} from "react-vant";
import { LOCATION_DATA, getCityList } from "../data/locations";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  User, 
  ChevronRight,
  RotateCcw,
  Sparkles
} from "lucide-react";

const COLORS = {
  primary: "#8B4513",
  accent: "#C41E3A",
  gold: "#DAA520",
  background: "#FAF8F5",
  cardBg: "#FFFEF9",
  cardBorder: "#E8DFD0",
  text: "#2C1810",
  textMuted: "#6B5344",
};

const STORAGE_KEY = 'paipan_form_v2';

export function PaipanPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // 默认选择今天日期，时间不默认选择
  const [birthDate, setBirthDate] = useState(() => {
    const today = new Date();
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
  });
  const [birthTime, setBirthTime] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<0 | 1>(1);
  const [activePicker, setActivePicker] = useState<'date' | 'time' | 'location' | null>(null);

  const { isLoading, calculateBazi } = useBaziStore();

  const cityList = getCityList();
  const pickerOptions = cityList.map((city) => ({ text: city, value: city }));

  // 从URL或本地存储恢复数据
  useEffect(() => {
    const urlDate = searchParams.get('date');
    const urlTime = searchParams.get('time');
    const urlLocation = searchParams.get('location');
    const urlGender = searchParams.get('gender');
    
    if (urlDate && urlTime && urlLocation) {
      setBirthDate(urlDate);
      setBirthTime(urlTime);
      setLocation(urlLocation);
      setGender(urlGender === '0' ? 0 : 1);
      return;
    }
    
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.timestamp && Date.now() - parsed.timestamp < 7 * 24 * 60 * 60 * 1000) {
          setBirthDate(parsed.birthDate || '');
          setBirthTime(parsed.birthTime || '12:00');
          setLocation(parsed.location || '');
          setGender(parsed.gender ?? 1);
        }
      }
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
  }, [searchParams]);

  // 保存数据
  useEffect(() => {
    const dataToSave = { birthDate, birthTime, location, gender, timestamp: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
  }, [birthDate, birthTime, location, gender]);

  // 表单完成度（地点非必填）
  const completionRate = [birthDate, birthTime].filter(Boolean).length / 2;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate) {
      Toast.info('请选择出生日期');
      return;
    }

    const longitude = location ? LOCATION_DATA[location] : 120.0;
    const input = { birthDate, birthTime, longitude, gender };

    try {
      await calculateBazi(input);
      navigate("/result");
    } catch (err) {
      Toast.info('计算失败，请重试');
    }
  };

  const handleClear = () => {
    const today = new Date();
    setBirthDate(`${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`);
    setBirthTime('');
    setLocation('');
    setGender(1);
    localStorage.removeItem(STORAGE_KEY);
    Toast.success('已重置');
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "选择日期";
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
    });
  };

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return "选择时间";
    const [hour] = timeStr.split(':');
    const h = parseInt(hour);
    const period = h < 6 ? '凌晨' : h < 12 ? '上午' : h < 14 ? '中午' : h < 18 ? '下午' : '晚上';
    return `${period} ${timeStr}`;
  };

  const dateDisplay = formatDateDisplay(birthDate);

  return (
    <div className="flex flex-col h-full min-h-screen" style={{ backgroundColor: COLORS.background }}>
      {/* SVG Banner Header - 固定定位，渐变透明 */}
      <div 
        className="fixed top-0 left-0 right-0 z-50 px-4 pt-safe-top pb-4 text-center"
        style={{
          background: 'transparent',
              pointerEvents: 'none',
              height: 120
        }}
      >
        {/* SVG 背景图案 - 从上到下渐变透明 */}
        <svg 
          className="absolute inset-0 w-full h-full" 
          preserveAspectRatio="xMidYMid slice"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* 从上到下的渐变透明 */}
            <linearGradient id="fadeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#C41E3A" stopOpacity="0.95"/>
              <stop offset="40%" stopColor="#C41E3A" stopOpacity="0.85"/>
              <stop offset="70%" stopColor="#C41E3A" stopOpacity="0.5"/>
              <stop offset="100%" stopColor="#C41E3A" stopOpacity="0"/>
            </linearGradient>
          </defs>
          
          {/* 渐变底色层 */}
          <rect width="100%" height="100%" fill="url(#fadeGradient)"/>
          
          {/* 祥云图案 - 随机位置 */}
          <g opacity="0.15">
            {/* 祥云1 */}
            <path 
              d="M15,25 Q25,15 40,22 Q55,12 75,20 Q90,15 100,25" 
              fill="none" 
              stroke="rgba(255,255,255,0.8)" 
              strokeWidth="1.5"
              transform="translate(0, 0)"
            />
            <path 
              d="M10,35 Q25,25 45,32 Q65,22 85,30 Q100,25 110,35" 
              fill="none" 
              stroke="rgba(255,255,255,0.6)" 
              strokeWidth="1.2"
              transform="translate(0, 0)"
            />
            
            {/* 祥云2 */}
            <path 
              d="M65,35 Q75,22 90,30 Q105,18 120,28 Q135,20 145,32" 
              fill="none" 
              stroke="rgba(255,255,255,0.7)" 
              strokeWidth="1.3"
              transform="scale(0.9)"
            />
            <path 
              d="M60,48 Q72,38 88,45 Q108,35 128,44 Q145,38 150,50" 
              fill="none" 
              stroke="rgba(255,255,255,0.5)" 
              strokeWidth="1.1"
              transform="scale(0.9)"
            />
            
            {/* 祥云3 */}
            <path 
              d="M120,18 Q135,8 155,16 Q175,6 195,15 Q210,8 220,20" 
              fill="none" 
              stroke="rgba(255,255,255,0.6)" 
              strokeWidth="1.4"
              transform="scale(1.1)"
            />
            <path 
              d="M115,32 Q130,22 150,30 Q170,20 190,28 Q205,22 215,34" 
              fill="none" 
              stroke="rgba(255,255,255,0.4)" 
              strokeWidth="1.0"
              transform="scale(1.1)"
            />
          </g>
          
          {/* 金色装饰圆圈 - 随机位置 */}
          <g opacity="0.12">
            <circle cx="8%" cy="65%" r="18" fill="none" stroke="#DAA520" strokeWidth="1"/>
            <circle cx="8%" cy="65%" r="10" fill="none" stroke="#DAA520" strokeWidth="0.6"/>
            
            <circle cx="92%" cy="70%" r="15" fill="none" stroke="#DAA520" strokeWidth="0.8"/>
            <circle cx="92%" cy="70%" r="8" fill="rgba(218,165,32,0.1)"/>
            
            <circle cx="25%" cy="75%" r="12" fill="none" stroke="#DAA520" strokeWidth="0.7"/>
            <circle cx="75%" cy="78%" r="10" fill="none" stroke="#DAA520" strokeWidth="0.6"/>
            
            <circle cx="50%" cy="82%" r="8" fill="none" stroke="#DAA520" strokeWidth="0.5"/>
          </g>
          
          {/* 装饰性太极 - 随机位置 */}
          <g transform="translate(45, 50)" opacity="0.18">
            <circle r="22" fill="none" stroke="#FFD700" strokeWidth="1"/>
            <path d="M0,-22 A11,11 0 0,1 0,0 A11,11 0 0,0 0,22 A22,22 0 0,1 0,-22" fill="#FFD700"/>
            <circle cx="0" cy="-11" r="3.5" fill="#C41E3A"/>
            <circle cx="0" cy="11" r="3.5" fill="#FFD700"/>
          </g>
          
          <g transform="translate(88%, 55)" opacity="0.14">
            <circle r="18" fill="none" stroke="#FFD700" strokeWidth="0.9"/>
            <path d="M0,-18 A9,9 0 0,1 0,0 A9,9 0 0,0 0,18 A18,18 0 0,1 0,-18" fill="#FFD700"/>
            <circle cx="0" cy="-9" r="3" fill="#C41E3A"/>
            <circle cx="0" cy="9" r="3" fill="#FFD700"/>
          </g>
          
          <g transform="translate(70%, 45)" opacity="0.12">
            <circle r="14" fill="none" stroke="#FFD700" strokeWidth="0.8"/>
            <path d="M0,-14 A7,7 0 0,1 0,0 A7,7 0 0,0 0,14 A14,14 0 0,1 0,-14" fill="#FFD700"/>
            <circle cx="0" cy="-7" r="2.5" fill="#C41E3A"/>
            <circle cx="0" cy="7" r="2.5" fill="#FFD700"/>
          </g>
          
        </svg>
        
        {/* 内容层 */}
        <div className="relative z-10">
          <h1 className="text-2xl font-bold text-white tracking-wider" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            八字排盘
          </h1>
          <p className="text-sm mt-1 text-white/90" style={{ textShadow: '0 1px 4px rgba(0,0,0,0.3)' }}>
            传承千年命理智慧 · 洞悉人生运势
          </p>
        </div>
      </div>

      {/* 主内容区域 - 添加顶部padding以补偿固定header */}
      <main className="flex-1 p-4 pb-6 overflow-y-auto" style={{ paddingTop: 'calc(100px + env(safe-area-inset-top))' }}>
        {/* 进度指示器 */}
        <div className="mb-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-500"
              style={{ 
                width: `${completionRate * 100}%`,
                backgroundColor: COLORS.accent
              }}
            />
          </div>
          <span className="text-xs text-gray-500">
            {Math.round(completionRate * 100)}%
          </span>
        </div>

        {/* 已选择信息预览 */}
        {(birthDate || location) && (
          <div 
            className="mb-4 p-3 rounded-xl border-2 flex items-center justify-between"
            style={{ 
              backgroundColor: 'rgba(196, 30, 58, 0.05)',
              borderColor: 'rgba(196, 30, 58, 0.2)'
            }}
          >
            <div className="flex items-center gap-2 text-sm">
              {birthDate && (
                <span className="text-gray-800 font-medium">{dateDisplay}</span>
              )}
              {birthTime && birthDate && (
                <span className="text-gray-600">· {formatTimeDisplay(birthTime)}</span>
              )}
              {location && (
                <span className="text-gray-600">· {location}</span>
              )}
            </div>
            <button 
              onClick={handleClear}
              className="p-1.5 rounded-full hover:bg-red-100 transition-colors"
            >
              <RotateCcw size={14} style={{ color: COLORS.accent }} />
            </button>
          </div>
        )}

        {/* 主表单卡片 */}
        <Card 
          style={{ 
            border: `1px solid ${COLORS.cardBorder}`,
            boxShadow: '0 4px 16px rgba(139, 69, 19, 0.12)',
            backgroundColor: COLORS.cardBg,
            borderRadius: "16px",
            marginBottom: 16,
            overflow: "hidden",
          }}
        >
          {/* 卡片头部 */}
          <div 
            className="text-center py-3"
            style={{ 
              background: COLORS.primary,
              borderBottom: `2px solid ${COLORS.gold}`,
            }}
          >
            <h2 className="text-lg font-bold text-white">
              出生信息
            </h2>
          </div>
          
          <Card.Body className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* 日期时间合并选择区 - 日期稍宽(60%)，时间稍窄(40%) */}
              <div className="grid gap-3" style={{ gridTemplateColumns: '60% 40%' }}>
                {/* 日期选择 */}
                <div 
                  className="p-3 rounded-xl border-2 cursor-pointer transition-all"
                  style={{
                    borderColor: birthDate ? COLORS.accent : '#e5e7eb',
                    backgroundColor: birthDate ? 'rgba(196, 30, 58, 0.05)' : 'white'
                  }}
                  onClick={() => setActivePicker('date')}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar size={16} style={{ color: birthDate ? COLORS.accent : '#9ca3af' }} />
                    <span className="text-xs text-gray-500">出生日期</span>
                  </div>
                  <div className={`text-sm font-medium ${birthDate ? 'text-gray-900' : 'text-gray-400'}`}>
                    {dateDisplay}
                  </div>
                </div>

                {/* 时间选择 */}
                <div 
                  className="p-3 rounded-xl border-2 cursor-pointer transition-all"
                  style={{
                    borderColor: birthTime ? COLORS.accent : '#e5e7eb',
                    backgroundColor: birthTime ? 'rgba(196, 30, 58, 0.05)' : 'white'
                  }}
                  onClick={() => setActivePicker('time')}
                >
                  <div className="flex items-center gap-2 mb-1">
                    <Clock size={16} style={{ color: birthTime ? COLORS.accent : '#9ca3af' }} />
                    <span className="text-xs text-gray-500">出生时间</span>
                  </div>
                  <div className={`text-sm font-medium ${birthTime ? 'text-gray-900' : 'text-gray-400'}`}>
                    {formatTimeDisplay(birthTime)}
                  </div>
                </div>
              </div>

              {/* 地点选择 - 非必填 */}
              <div 
                className="p-3 rounded-xl border-2 cursor-pointer transition-all"
                style={{
                  borderColor: location ? COLORS.accent : '#e5e7eb',
                  backgroundColor: location ? 'rgba(196, 30, 58, 0.05)' : 'white'
                }}
                onClick={() => setActivePicker('location')}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} style={{ color: location ? COLORS.accent : '#9ca3af' }} />
                    <div>
                      <div className="text-xs text-gray-500 flex items-center gap-1">
                        出生地点
                        <span className="text-[10px] px-1.5 py-0.5 bg-gray-100 text-gray-500 rounded">选填</span>
                      </div>
                      <div className={`text-sm font-medium ${location ? 'text-gray-900' : 'text-gray-400'}`}>
                        {location || "真太阳时校正（默认北京时间）"}
                      </div>
                    </div>
                  </div>
                  <ChevronRight size={16} className="text-gray-400" />
                </div>
              </div>

              {/* 性别选择 */}
              <div className="p-3 rounded-xl border border-gray-200">
                <div className="flex items-center gap-2 mb-2">
                  <User size={16} className="text-gray-400" />
                  <span className="text-xs text-gray-500">性别</span>
                </div>
                <Radio.Group
                  value={gender}
                  onChange={(val) => setGender(val as 0 | 1)}
                  direction="horizontal"
                  className="flex gap-6"
                >
                  <Radio name={1} style={{ '--radio-checked-color': COLORS.accent } as React.CSSProperties}>
                    <span className="ml-2">男</span>
                  </Radio>
                  <Radio name={0} style={{ '--radio-checked-color': COLORS.accent } as React.CSSProperties}>
                    <span className="ml-2">女</span>
                  </Radio>
                </Radio.Group>
              </div>

              {/* 操作按钮 - 样式统一 */}
              <div className="flex gap-3 pt-2">
                <Button
                  type="default"
                  className="flex-1"
                  size="large"
                  onClick={handleClear}
                  style={{ 
                    height: '44px',
                    borderRadius: '10px',
                    border: `1px solid ${COLORS.cardBorder}`,
                    color: COLORS.textMuted,
                    fontSize: '15px'
                  }}
                  disabled={!birthDate && !birthTime && !location}
                >
                  清空
                </Button>
                <Button
                  type="primary"
                  nativeType="submit"
                  className="flex-[2]"
                  size="large"
                  style={{ 
                    backgroundColor: COLORS.accent,
                    border: 'none',
                    height: '44px',
                    borderRadius: '10px',
                    fontSize: '15px'
                  }}
                  loading={isLoading}
                  disabled={isLoading || !birthDate || !birthTime}
                  icon={<Sparkles size={18} />}
                >
                  {isLoading ? '排盘计算中...' : '开始排盘'}
                </Button>
              </div>
            </form>
          </Card.Body>
        </Card>

        <div className="text-center text-xs" style={{ color: COLORS.textMuted }}>
          <p>八字命理 · 传统文化 · 仅供参考</p>
        </div>
      </main>

      {/* 日期选择器 */}
      <DatetimePicker
        popup={{ round: true }}
        type="date"
        title="选择出生日期"
        minDate={new Date(1900, 0, 1)}
        maxDate={new Date()}
        value={birthDate ? new Date(birthDate) : new Date()}
        visible={activePicker === 'date'}
        onClose={() => setActivePicker(null)}
        onConfirm={(date: Date) => {
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          setBirthDate(`${year}-${month}-${day}`);
          setActivePicker(null);
        }}
      />

      {/* 时间选择器 */}
      <DatetimePicker
        popup={{ round: true }}
        type="time"
        title="选择出生时间"
        value={birthTime || "12:00"}
        visible={activePicker === 'time'}
        onClose={() => setActivePicker(null)}
        onConfirm={(time: string) => {
          setBirthTime(time);
          setActivePicker(null);
        }}
      />

      {/* 地点选择器 */}
      <Picker
        popup={{ round: true }}
        visible={activePicker === 'location'}
        onClose={() => setActivePicker(null)}
        onConfirm={(val: (string | number)[]) => {
          setLocation(String(val[0]));
          setActivePicker(null);
        }}
        columns={[pickerOptions]}
        defaultValue={location ? [location] : undefined}
        title="选择出生城市"
      />
    </div>
  );
}
