import { Sun, Moon, Monitor, type LucideIcon } from "lucide-react";
import type { ThemeOption } from "./themeConfig";

interface ThemeCardProps {
  option: ThemeOption;
  isActive: boolean;
  onClick: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Sun,
  Moon,
  Monitor,
};

export function ThemeCard({ option, isActive, onClick }: ThemeCardProps) {
  const Icon = iconMap[option.icon];
  const isSystem = option.id === "system";

  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden rounded-xl border-2 transition-all duration-500 ease-out ${
        isActive
          ? `shadow-lg scale-[1.02]`
          : ""
      }`}
      style={{
        borderColor: isActive ? option.accentColor : "var(--color-border)",
        boxShadow: isActive ? `0 10px 25px -5px ${option.accentColor}33` : undefined,
      }}
    >
      {/* 预览区域 */}
      <div className="relative h-28">
        {isSystem ? <SystemPreview /> : <StandardPreview option={option} Icon={Icon} />}
        

      </div>

      {/* 标签区域 */}
      <div 
        className="p-3 text-center transition-colors duration-300"
        style={{
          backgroundColor: isActive ? `${option.accentColor}0D` : "var(--color-card)"
        }}
      >
        <span 
          className="text-sm font-medium block transition-colors duration-300"
          style={{ color: isActive ? option.accentColor : "var(--color-text)" }}
        >
          {option.name}
        </span>
        <span className="text-xs mt-0.5 block" style={{ color: "var(--color-text-muted)" }}>
          {option.subtitle}
        </span>
      </div>
    </button>
  );
}

function StandardPreview({ option, Icon }: { option: ThemeOption; Icon: LucideIcon }) {
  const isLight = option.id === "light";
  
  return (
    <div className={`relative h-full ${option.previewBg}`}>
      {/* 纹理效果 */}
      {isLight && (
        <div 
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4A574' fill-opacity='0.15'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      )}
      
      {!isLight && (
        <div 
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 30%, rgba(107, 142, 159, 0.3) 0%, transparent 50%),
                              radial-gradient(circle at 80% 70%, rgba(107, 142, 159, 0.2) 0%, transparent 40%)`,
          }}
        />
      )}

      {/* 内容预览 */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div className="flex items-center gap-1.5">
          <div 
            className="w-8 h-6 rounded-full flex items-center justify-center"
            style={{ backgroundColor: option.accentColor }}
          >
            <Icon size={12} className="text-white" />
          </div>
          <div 
            className="h-2 w-12 rounded-full"
            style={{ backgroundColor: isLight ? "rgba(139, 69, 19, 0.3)" : "rgba(255, 255, 255, 0.2)" }}
          />
        </div>
        <div className="space-y-1.5">
          {[1, 0.8, 0.6].map((opacity, i) => (
            <div 
              key={i}
              className="h-1.5 rounded-full"
              style={{ 
                width: `${[100, 80, 60][i]}%`,
                backgroundColor: isLight ? `rgba(139, 69, 19, ${opacity * 0.2})` : `rgba(255, 255, 255, ${opacity * 0.15})`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function SystemPreview() {
  return (
    <div className="relative h-full overflow-hidden">
      {/* 左侧浅色 */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-[#FAF8F3] via-[#F0EBE3] to-[#E8E3DB]"
        style={{ clipPath: "polygon(0 0, 60% 0, 40% 100%, 0 100%)" }}
      />
      {/* 右侧深色 */}
      <div 
        className="absolute inset-0 bg-gradient-to-bl from-[#2D2D42] via-[#252538] to-[#1C1C2E]"
        style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 40% 100%)" }}
      />
      {/* 融合边界 */}
      <div 
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, transparent 38%, rgba(139, 69, 19, 0.3) 50%, transparent 62%)"
        }}
      />
      
      {/* 预览内容 */}
      <div className="absolute inset-0 p-3 flex flex-col justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-8 h-6 rounded-full bg-gradient-to-br from-[#DAA520] to-[#6B8E9F] flex items-center justify-center shadow-md">
            <Monitor size={12} className="text-white" />
          </div>
          <div className="h-2 w-12 rounded-full bg-[#8B4513]/20" />
        </div>
        <div className="flex gap-1">
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-full rounded-full bg-[#8B4513]/20" />
            <div className="h-1.5 w-3/4 rounded-full bg-[#8B4513]/15" />
          </div>
          <div className="flex-1 space-y-1">
            <div className="h-1.5 w-full rounded-full bg-white/15" />
            <div className="h-1.5 w-3/4 rounded-full bg-white/10" />
          </div>
        </div>
      </div>
    </div>
  );
}
