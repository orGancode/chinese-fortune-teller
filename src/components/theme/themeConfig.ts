import type { LucideIcon } from "lucide-react";
import type { ThemeType } from "../store/settingsStore";

export interface ThemeOption {
  id: ThemeType;
  name: string;
  subtitle: string;
  icon: LucideIcon;
  accentColor: string;
  previewBg: string;
  hoverBorderColor: string;
  description: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: "light",
    name: "宣纸雅白",
    subtitle: "明净温润",
    icon: "Sun",
    accentColor: "#C41E3A",
    previewBg: "bg-gradient-to-br from-[#FAF8F3] via-[#F5F0E8] to-[#EDE8E0]",
    hoverBorderColor: "#D4A574",
    description: "浅色主题如宣纸般温润，适合日间使用，阅读舒适，展现传统文化的典雅气质。",
  },
  {
    id: "dark",
    name: "墨韵玄青",
    subtitle: "深邃静谧",
    icon: "Moon",
    accentColor: "#6B8E9F",
    previewBg: "bg-gradient-to-br from-[#1C1C2E] via-[#252538] to-[#2D2D42]",
    hoverBorderColor: "#6B8E9F",
    description: "深色主题如墨色般深邃，适合夜间使用，减轻视觉疲劳，营造静心思考的氛围。",
  },
  {
    id: "system",
    name: "天地随转",
    subtitle: "顺应自然",
    icon: "Monitor",
    accentColor: "#8B4513",
    previewBg: "",
    hoverBorderColor: "#8B4513",
    description: "跟随系统设置，自动适应环境光暗变化，日出而作，日落而息，天人合一。",
  },
];
