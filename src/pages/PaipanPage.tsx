import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBaziStore } from "../store/baziStore";
import { useHistoryStore } from "../store/historyStore";
import {
  DatetimePicker,
  Field,
  Radio,
  Card,
  Button,
  Picker,
} from "react-vant";
import { LOCATION_DATA, getCityList } from "../data/locations";
import { Loader2, Calendar, Clock, MapPin, User } from "lucide-react";

// Traditional Chinese Color Palette
const COLORS = {
  primary: "#8B4513",        // Saddle Brown - wood/paper texture
  primaryLight: "#A0522D",   // Sienna
  accent: "#C41E3A",         // Chinese Red
  accentLight: "#D4626A",    // Light Chinese Red
  gold: "#DAA520",           // Goldenrod
  goldLight: "#F4D03F",      // Light Gold
  background: "#FAF8F5",     // Warm rice paper
  cardBg: "#FFFEF9",         // Off-white card
  cardBorder: "#E8DFD0",     // Warm border
  text: "#2C1810",           // Dark brown
  textMuted: "#6B5344",      // Muted brown
  inputBg: "#FDFBF7",        // Input background
  shadow: "rgba(139, 69, 19, 0.12)", // Warm shadow
};

export function PaipanPage() {
  const navigate = useNavigate();
  const [birthDate, setBirthDate] = useState("");
  const [birthTime, setBirthTime] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<0 | 1>(1);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showLocationPicker, setShowLocationPicker] = useState(false);

  const { isLoading, error, calculateBazi } = useBaziStore();
  const { addToHistory } = useHistoryStore();

  const cityList = getCityList();

  const pickerOptions = cityList.map((city) => ({ text: city, value: city }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!birthDate || !birthTime || !location) return;

    const longitude = LOCATION_DATA[location] || 120.0;
    const input = {
      birthDate,
      birthTime,
      longitude,
      gender,
    };

    try {
      await calculateBazi(input);
      
      // Add to history after calculation
      setTimeout(() => {
        const result = useBaziStore.getState().currentBazi;
        if (result) {
          addToHistory(input, result);
        }
      }, 100);
      
      // Navigate to result page
      navigate("/result");
    } catch (err) {
      console.error("Calculation failed:", err);
    }
  };

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "请选择出生日期";
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  // Format time for display
  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return "请选择出生时间";
    return timeStr;
  };

  return (
    <div 
      className="flex flex-col h-full min-h-screen" 
      style={{ 
        backgroundColor: COLORS.background,
        backgroundImage: `linear-gradient(to bottom, ${COLORS.background} 0%, #F5F0E8 100%)`
      }}
    >
      <div 
        className="px-4 pt-6 pb-4 text-center"
        style={{
          background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
          borderBottom: `3px solid ${COLORS.gold}`,
          boxShadow: `0 2px 12px ${COLORS.shadow}`,
        }}
      >
        <h1 className="text-2xl font-bold text-white tracking-wider" style={{ textShadow: "1px 1px 2px rgba(0,0,0,0.3)" }}>
          八字排盘
        </h1>
        <p className="text-sm mt-1" style={{ color: "#F5DEB3" }}>
          传承千年命理智慧 · 洞悉人生运势
        </p>
      </div>

      <main className="flex-1 p-4 pb-6 overflow-y-auto">
        {/* Input Form */}
        <Card 
          style={{ 
            border: `1px solid ${COLORS.cardBorder}`,
            boxShadow: `0 4px 16px ${COLORS.shadow}`,
            backgroundColor: COLORS.cardBg,
            borderRadius: "16px",
            marginBottom: 12,
            overflow: "hidden",
          }}
        >
          <div 
            className="text-center py-4"
            style={{ 
              background: `linear-gradient(135deg, ${COLORS.primary} 0%, ${COLORS.primaryLight} 100%)`,
              borderBottom: `2px solid ${COLORS.gold}`,
            }}
          >
            <h2 className="text-xl font-bold text-white tracking-wide">
              出生信息
            </h2>
            <p className="text-sm mt-1" style={{ color: "#F5DEB3" }}>
              请准确填写您的出生信息
            </p>
          </div>
          
          <Card.Body className="p-4">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Date Picker */}
              <div className="space-y-1.5">
                <label 
                  className="text-sm font-semibold flex items-center gap-2" 
                  style={{ color: COLORS.text }}
                >
                  <Calendar size={16} style={{ color: COLORS.accent }} />
                  出生日期
                </label>
                <Field
                  isLink
                  label={formatDateDisplay(birthDate)}
                  labelWidth={150}
                  onClick={() => setShowDatePicker(true)}
                  style={{ 
                    borderRadius: "10px",
                    border: `1px solid ${birthDate ? COLORS.accent : COLORS.cardBorder}`,
                    backgroundColor: birthDate ? "rgba(196, 30, 58, 0.04)" : COLORS.inputBg,
                    fontSize: "14px",
                  }}
                />
                <DatetimePicker
                  popup={{
                    round: true,
                  }}
                  type="date"
                  title="选择出生日期"
                  minDate={new Date(1900, 0, 1)}
                  maxDate={new Date()}
                  value={birthDate ? new Date(birthDate) : new Date()}
                  visible={showDatePicker}
                  onClose={() => setShowDatePicker(false)}
                  onConfirm={(date: Date) => {
                    const formatted = date.toISOString().split('T')[0];
                    setBirthDate(formatted);
                    setShowDatePicker(false);
                  }}
                />
              </div>

              {/* Time Picker */}
              <div className="space-y-1.5">
                <label 
                  className="text-sm font-semibold flex items-center gap-2" 
                  style={{ color: COLORS.text }}
                >
                  <Clock size={16} style={{ color: COLORS.accent }} />
                  出生时间
                </label>
                <Field
                  isLink
                  labelWidth={150}
                  label={formatTimeDisplay(birthTime)}
                  onClick={() => setShowTimePicker(true)}
                  style={{ 
                    borderRadius: "10px",
                    border: `1px solid ${birthTime ? COLORS.accent : COLORS.cardBorder}`,
                    backgroundColor: birthTime ? "rgba(196, 30, 58, 0.04)" : COLORS.inputBg,
                    fontSize: "14px",
                  }}
                />
                <DatetimePicker
                  popup={{
                    round: true,
                  }}
                  type="time"
                  title="选择出生时间"
                  value={birthTime || "12:00"}
                  visible={showTimePicker}
                  onClose={() => setShowTimePicker(false)}
                  onConfirm={(time: string) => {
                    setBirthTime(time);
                    setShowTimePicker(false);
                  }}
                />
              </div>

              {/* Location Select */}
              <div className="space-y-1.5">
                <label 
                  className="text-sm font-semibold flex items-center gap-2" 
                  style={{ color: COLORS.text }}
                >
                  <MapPin size={16} style={{ color: COLORS.accent }} />
                  出生地点
                </label>
                <Field
                  isLink
                  labelWidth={150}
                  label={location || "请选择出生城市"}
                  onClick={() => setShowLocationPicker(true)}
                  style={{ 
                    borderRadius: "10px",
                    border: `1px solid ${location ? COLORS.accent : COLORS.cardBorder}`,
                    backgroundColor: location ? "rgba(196, 30, 58, 0.04)" : COLORS.inputBg,
                    fontSize: "14px",
                  }}
                />
                <Picker
                  popup={{
                    round: true,
                  }}
                  visible={showLocationPicker}
                  onClose={() => setShowLocationPicker(false)}
                  onConfirm={(val: (string | number)[]) => {
                    setLocation(String(val[0]));
                    setShowLocationPicker(false);
                  }}
                  columns={[pickerOptions]}
                  defaultValue={location ? [location] : undefined}
                />
                <p className="text-xs" style={{ color: COLORS.textMuted }}>
                  用于真太阳时校正，确保时辰准确
                </p>
              </div>

              {/* Gender Radio */}
              <div className="space-y-1.5">
                <label 
                  className="text-sm font-semibold flex items-center gap-2" 
                  style={{ color: COLORS.text }}
                >
                  <User size={16} style={{ color: COLORS.accent }} />
                  性别
                </label>
                <Radio.Group
                  value={gender}
                  onChange={(val) => setGender(val as 0 | 1)}
                  direction="horizontal"
                >
                  <Radio name="1" value={0}>男</Radio>
                  <Radio name="2" value={1}>女</Radio>
                </Radio.Group>
              </div>

              <Button
                nativeType="submit"
                className="w-full mt-2"
                size="large"
                loading={isLoading}
                disabled={isLoading || !birthDate || !birthTime || !location}
                style={{
                  backgroundColor: COLORS.accent,
                  border: `2px solid ${COLORS.accent}`,
                  borderRadius: "10px",
                  height: "48px",
                  fontSize: "16px",
                  fontWeight: 600,
                  boxShadow: `0 4px 12px rgba(196, 30, 58, 0.35)`,
                  letterSpacing: "0.05em",
                }}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    计算中...
                  </>
                ) : (
                  "开始排盘"
                )}
              </Button>

              {error && (
                <div 
                  className="p-3 rounded-lg text-sm text-center"
                  style={{ 
                    backgroundColor: "rgba(196, 30, 58, 0.1)",
                    color: COLORS.accent,
                    border: `1px solid ${COLORS.accentLight}`,
                  }}
                >
                  {error}
                </div>
              )}
            </form>
          </Card.Body>
        </Card>

        {/* Decorative footer */}
        <div className="text-center mt-6 text-xs" style={{ color: COLORS.textMuted }}>
          <p>八字命理 · 传统文化 · 仅供参考</p>
        </div>
      </main>
    </div>
  );
}
