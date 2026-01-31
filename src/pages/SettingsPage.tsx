import { Card, Button, Dialog, Cell } from "react-vant";
import { useSettingsStore, type ThemeType } from "../store/settingsStore";
import { useHistoryStore } from "../store/historyStore";
import { 
  Trash2, Info, AlertTriangle, Shield, Database, History,
  Sun, Moon, Monitor 
} from "lucide-react";
import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ThemeCard, THEME_OPTIONS } from "../components/theme";

const themeIcons: Record<ThemeType, typeof Sun> = {
  light: Sun,
  dark: Moon,
  system: Monitor,
};

const themeColors: Record<ThemeType, string> = {
  light: "#DAA520",
  dark: "#6B8E9F",
  system: "#8B4513",
};

export function SettingsPage() {
  const { version, clearAllData, theme, setTheme } = useSettingsStore();
  const { history } = useHistoryStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  const handleClearCache = () => {
    clearAllData();
    setDialogVisible(false);
  };

  const currentThemeDesc = useMemo(() => {
    return THEME_OPTIONS.find(t => t.id === theme)?.description || "";
  }, [theme]);

  const ThemeIcon = themeIcons[theme];

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* 排盘记录 */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium text-[var(--color-text)]">
              <History className="w-5 h-5 text-[var(--color-primary)]" />
              排盘记录
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">查看八字排盘历史记录</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <div 
              className="flex items-center justify-between py-3 px-4 rounded-lg cursor-pointer transition-colors border border-[var(--color-border)]"
              onClick={() => navigate("/history")}
            >
              <div className="flex flex-col">
                <span className="text-[var(--color-text)] font-medium">八字排盘历史</span>
                <span className="text-sm text-[var(--color-text-muted)]">共 {history.length} 条记录</span>
              </div>
              <svg className="w-5 h-5 text-[var(--color-text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </Card.Body>
        </Card>

        {/* 主题设置 */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium">
              <ThemeIcon 
                className="w-5 h-5" 
                style={{ color: themeColors[theme] }}
              />
              主题设置
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">选择最契合心境的显示主题</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="grid grid-cols-3 gap-3">
              {THEME_OPTIONS.map(option => (
                <ThemeCard
                  key={option.id}
                  option={option}
                  isActive={theme === option.id}
                  onClick={() => setTheme(option.id)}
                />
              ))}
            </div>
            
            {/* 当前主题说明 */}
            <div className="mt-4 p-3 rounded-lg bg-[var(--color-bg-elevated)] border border-[var(--color-border)]">
              <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">
                {currentThemeDesc}
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* 数据管理 */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium text-[var(--color-text)]">
              <Database className="w-5 h-5 text-[var(--color-gold)]" />
              数据管理
            </h3>
            <p className="text-sm text-[var(--color-text-muted)] mt-1">管理本地存储的数据</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <Button 
              className="w-full !bg-[var(--color-error)] !border-[var(--color-error)]"
              onClick={() => setDialogVisible(true)}
              icon={<Trash2 className="w-4 h-4 mr-2" />}
            >
              清除所有缓存数据
            </Button>
            <p className="text-xs text-[var(--color-text-muted)] mt-3">
              清除缓存将删除所有历史记录和设置，应用将恢复到初始状态
            </p>
          </Card.Body>
        </Card>

        {/* 确认对话框 */}
        <Dialog
          visible={dialogVisible}
          title={
            <div className="flex items-center gap-2 justify-center text-[var(--color-text)]">
              <AlertTriangle className="w-4 h-4 text-[var(--color-error)]" />
              <span>确认清除数据</span>
            </div>
          }
          message="此操作将删除所有本地存储的数据，包括历史记录和应用设置。此操作不可撤销。"
          showCancelButton
          confirmButtonText="确认清除"
          cancelButtonText="取消"
          confirmButtonColor="var(--color-error)"
          onConfirm={handleClearCache}
          onCancel={() => setDialogVisible(false)}
          onClose={() => setDialogVisible(false)}
        />

        {/* 应用信息 */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium text-[var(--color-text)]">
              <Info className="w-5 h-5 text-[var(--color-gold)]" />
              应用信息
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[var(--color-border)]">
                <span className="text-[var(--color-text-muted)]">版本号</span>
                <span className="font-medium text-[var(--color-text)]">v{version}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-[var(--color-text-muted)]">应用名称</span>
                <span className="font-medium text-[var(--color-text)]">八字排盘命理分析</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* 免责声明 */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium text-[var(--color-warning)]">
              <Shield className="w-5 h-5" />
              免责声明
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="text-sm text-[var(--color-text-muted)] space-y-3">
              {[
                { label: "娱乐参考", text: "本应用提供的八字排盘和命理分析仅供娱乐和参考，不构成任何形式的专业建议。" },
                { label: "非科学依据", text: "命理学属于传统文化范畴，其分析结果不具有科学依据，请勿作为人生重大决策的唯一参考。" },
                { label: "个人责任", text: "用户基于本应用内容做出的任何决定，均由用户自行承担后果。" },
                { label: "隐私保护", text: "本应用所有数据均存储在本地，不会上传至任何服务器，请放心使用。" },
              ].map((item, index) => (
                <p key={index}>
                  <strong className="text-[var(--color-warning)]">{index + 1}. {item.label}：</strong>
                  {item.text}
                </p>
              ))}
            </div>
          </Card.Body>
        </Card>

        {/* 版权信息 */}
        <div className="text-center text-sm text-[var(--color-text-muted)] py-4">
          <p>© 2024 Chinese Fortune Teller</p>
          <p className="mt-1">传承中华传统文化</p>
        </div>
      </main>
    </div>
  );
}
