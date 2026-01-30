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
import { Loader2, Calendar, Clock, MapPin, User, Sparkles, ArrowRight } from "lucide-react";
import { Logo } from "../components/Logo";

const COLORS = {
  primary: "#C41E3A",
  primaryLight: "#E85A71",
  accent: "#C41E3A",
  accentLight: "#E85A71",
  gold: "#D4AF37",
  goldLight: "#F4D03F",
  background: "var(--color-bg)",
  cardBg: "var(--color-card)",
  cardBorder: "var(--color-border)",
  text: "var(--color-text)",
  textMuted: "var(--color-text-muted)",
  inputBg: "var(--color-bg)",
  shadow: "var(--color-shadow)",
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
      
      setTimeout(() => {
        const result = useBaziStore.getState().currentBazi;
        if (result) {
          addToHistory(input, result);
        }
      }, 100);
      
      navigate("/result");
    } catch (err) {
      console.error("Calculation failed:", err);
    }
  };

  const formatDateDisplay = (dateStr: string) => {
    if (!dateStr) return "请选择出生日期";
    const date = new Date(dateStr);
    return date.toLocaleDateString("zh-CN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTimeDisplay = (timeStr: string) => {
    if (!timeStr) return "请选择出生时间";
    return timeStr;
  };

  return (
    <div 
      className="flex flex-col h-full min-h-screen"
      style={{ 
        backgroundColor: COLORS.background,
      }}
    >
      <div 
        className="px-4 pt-6 pb-6 text-center relative overflow-hidden"
        style={{
          background: 'linear-gradient(135deg, var(--color-accent) 0%, #8B0000 100%)',
        }}
      >
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-4 right-8 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse-soft" />
          <div className="absolute bottom-0 left-4 w-24 h-24 bg-[var(--color-gold)] rounded-full blur-2xl animate-float" />
        </div>
        
        <div className="relative animate-fade-in">
          <Logo size="lg" showSlogan={false} />
          <h1 className="text-2xl font-bold text-white mt-3 tracking-wider" style={{ textShadow: "0 2px 4px rgba(0,0,0,0.2)" }}>
            八字排盘
          </h1>
          <p className="text-sm mt-1.5 text-white/80">
            传承千年命理智慧 · 洞悉人生运势
          </p>
        </div>
      </div>

      <main className="flex-1 p-4 pb-6 overflow-y-auto -mt-2 relative z-10">
        <Card 
          style={{ 
            border: `1px solid ${COLORS.cardBorder}`,
            boxShadow: '0 8px 32px var(--color-shadow)',
            backgroundColor: COLORS.cardBg,
            borderRadius: "20px",
            marginBottom: 16,
            overflow: "hidden",
          }}
          className="animate-slide-up stagger-1"
        >
          <div 
            className="text-center py-5 relative overflow-hidden"
            style={{ 
              background: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-light) 100%)',
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent shimmer" />
            <Sparkles className="mx-auto mb-2 text-white/80 animate-pulse-soft" size={24} />
            <h2 className="text-xl font-bold text-white tracking-wide">
              出生信息
            </h2>
            <p className="text-sm mt-1 text-white/70">
              请准确填写您的出生信息
            </p>
          </div>
          
          <Card.Body className="p-5">
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-1.5 animate-slide-up stagger-2">
                <label 
                  className="text-sm font-semibold flex items-center gap-2.5" 
                  style={{ color: COLORS.text }}
                >
                  <div className="p-1.5 rounded-lg bg-[var(--color-accent)]/10">
                    <Calendar size={16} style={{ color: COLORS.accent }} />
                  </div>
                  出生日期
                </label>
                <Field
                  isLink
                  label={formatDateDisplay(birthDate)}
                  labelWidth={150}
                  onClick={() => setShowDatePicker(true)}
                  style={{ 
                    borderRadius: "12px",
                    border: `1px solid ${birthDate ? COLORS.accent : COLORS.cardBorder}`,
                    backgroundColor: birthDate ? "rgba(196, 30, 58, 0.04)" : COLORS.inputBg,
                    fontSize: "14px",
                    padding: "12px 16px",
                    transition: 'all 0.3s ease',
                  }}
                  className="hover:border-[var(--color-accent)] transition-colors"
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

              <div className="space-y-1.5 animate-slide-up stagger-3">
                <label 
                  className="text-sm font-semibold flex items-center gap-2.5" 
                  style={{ color: COLORS.text }}
                >
                  <div className="p-1.5 rounded-lg bg-[var(--color-accent)]/10">
                    <Clock size={16} style={{ color: COLORS.accent }} />
                  </div>
                  出生时间
                </label>
                <Field
                  isLink
                  labelWidth={150}
                  label={formatTimeDisplay(birthTime)}
                  onClick={() => setShowTimePicker(true)}
                  style={{ 
                    borderRadius: "12px",
                    border: `1px solid ${birthTime ? COLORS.accent : COLORS.cardBorder}`,
                    backgroundColor: birthTime ? "rgba(196, 30, 58, 0.04)" : COLORS.inputBg,
                    fontSize: "14px",
                    padding: "12px 16px",
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

              <div className="space-y-1.5 animate-slide-up stagger-4">
                <label 
                  className="text-sm font-semibold flex items-center gap-2.5" 
                  style={{ color: COLORS.text }}
                >
                  <div className="p-1.5 rounded-lg bg-[var(--color-accent)]/10">
                    <MapPin size={16} style={{ color: COLORS.accent }} />
                  </div>
                  出生地点
                </label>
                <Field
                  isLink
                  labelWidth={150}
                  label={location || "请选择出生城市"}
                  onClick={() => setShowLocationPicker(true)}
                  style={{ 
                    borderRadius: "12px",
                    border: `1px solid ${location ? COLORS.accent : COLORS.cardBorder}`,
                    backgroundColor: location ? "rgba(196, 30, 58, 0.04)" : COLORS.inputBg,
                    fontSize: "14px",
                    padding: "12px 16px",
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
                <p className="text-xs pl-1" style={{ color: COLORS.textMuted }}>
                  用于真太阳时校正，确保时辰准确
                </p>
              </div>

              <div className="space-y-1.5 animate-slide-up stagger-4">
                <label 
                  className="text-sm font-semibold flex items-center gap-2.5" 
                  style={{ color: COLORS.text }}
                >
                  <div className="p-1.5 rounded-lg bg-[var(--color-accent)]/10">
                    <User size={16} style={{ color: COLORS.accent }} />
                  </div>
                  性别
                </label>
                <Radio.Group
                  value={gender}
                  onChange={(val) => setGender(val as 0 | 1)}
                  direction="horizontal"
                  className="flex gap-6"
                >
                  <Radio 
                    name={1}
                    style={{ 
                      '--radio-size': '20px',
                      '--radio-checked-color': COLORS.accent,
                    } as React.CSSProperties}
                  >
                    <span className="ml-2 font-medium">男</span>
                  </Radio>
                  <Radio 
                    name={0}
                    style={{ 
                      '--radio-size': '20px',
                      '--radio-checked-color': COLORS.accent,
                    } as React.CSSProperties}
                  >
                    <span className="ml-2 font-medium">女</span>
                  </Radio>
                </Radio.Group>
              </div>

              <Button
                nativeType="submit"
                className="w-full mt-4"
                size="large"
                icon={<ArrowRight className="mr-2 h-5 w-5" />}
                loading={isLoading}
                disabled={isLoading || !birthDate || !birthTime || !location}
                style={{
                  backgroundColor: COLORS.accent,
                  border: `2px solid ${COLORS.accent}`,
                  borderRadius: "14px",
                  height: "52px",
                  fontSize: "16px",
                  fontWeight: 600,
                  color: 'white',
                  boxShadow: `0 6px 20px rgba(196, 30, 58, 0.35)`,
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
                  className="p-3 rounded-lg text-sm text-center animate-fade-in"
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

        <div className="text-center mt-6 text-xs animate-fade-in" style={{ color: COLORS.textMuted }}>
          <p>八字命理 · 传统文化 · 仅供参考</p>
        </div>
      </main>
    </div>
  );
}
