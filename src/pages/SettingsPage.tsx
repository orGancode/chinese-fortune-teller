import { Card, Button, Dialog, Cell } from "react-vant";
import { useSettingsStore } from "../store/settingsStore";
import { useHistoryStore } from "../store/historyStore";
import { Trash2, Info, AlertTriangle, Shield, Database, History, Sun, Moon, Monitor } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function SettingsPage() {
  const { version, clearAllData, theme, setTheme } = useSettingsStore();
  const { history } = useHistoryStore();
  const [dialogVisible, setDialogVisible] = useState(false);
  const navigate = useNavigate();

  const handleClearCache = () => {
    clearAllData();
    setDialogVisible(false);
  };

  return (
    <div className="flex flex-col h-full">
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* History Management */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium">
              <History className="w-5 h-5 text-[#C41E3A]" />
              排盘记录
            </h3>
            <p className="text-sm text-gray-500 mt-1">查看八字排盘历史记录</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <Cell
              title="八字排盘历史"
              label={`共 ${history.length} 条记录`}
              onClick={() => navigate("/history")}
              isLink
            />
          </Card.Body>
        </Card>

        {/* Theme Settings */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium">
              {theme === 'dark' ? (
                <Moon className="w-5 h-5 text-[#6B8E9F]" />
              ) : theme === 'light' ? (
                <Sun className="w-5 h-5 text-[#DAA520]" />
              ) : (
                <Monitor className="w-5 h-5 text-[#8B4513]" />
              )}
              主题设置
            </h3>
            <p className="text-sm text-gray-500 mt-1">切换应用的显示主题</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="flex gap-2">
              <button
                onClick={() => setTheme('light')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                  theme === 'light'
                    ? 'bg-[#C41E3A] text-white border-[#C41E3A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#C41E3A]'
                }`}
              >
                <Sun size={18} />
                <span className="text-sm font-medium">浅色</span>
              </button>
              <button
                onClick={() => setTheme('dark')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                  theme === 'dark'
                    ? 'bg-[#C41E3A] text-white border-[#C41E3A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#C41E3A]'
                }`}
              >
                <Moon size={18} />
                <span className="text-sm font-medium">深色</span>
              </button>
              <button
                onClick={() => setTheme('system')}
                className={`flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg border transition-all ${
                  theme === 'system'
                    ? 'bg-[#C41E3A] text-white border-[#C41E3A]'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-[#C41E3A]'
                }`}
              >
                <Monitor size={18} />
                <span className="text-sm font-medium">跟随系统</span>
              </button>
            </div>
          </Card.Body>
        </Card>

        {/* Cache Management */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium">
              <Database className="w-5 h-5 text-[#8B4513]" />
              数据管理
            </h3>
            <p className="text-sm text-gray-500 mt-1">管理本地存储的数据</p>
          </div>
          <Card.Body className="px-4 pb-4">
            <Button 
              style={{ width: "100%", backgroundColor: "#ff4d4f", borderColor: "#ff4d4f" }}
              onClick={() => setDialogVisible(true)}
              icon={<Trash2 className="w-4 h-4 mr-2" />}
            >
              清除所有缓存数据
            </Button>
            <p className="text-xs text-gray-500 mt-3">
              清除缓存将删除所有历史记录和设置，应用将恢复到初始状态
            </p>
          </Card.Body>
        </Card>

        {/* Confirmation Dialog */}
        <Dialog
          visible={dialogVisible}
          title={
            <div className="flex items-center gap-2 justify-center">
              <AlertTriangle className="w-4 h-4 text-[#C41E3A]" />
              <span>确认清除数据</span>
            </div>
          }
          message="此操作将删除所有本地存储的数据，包括历史记录和应用设置。此操作不可撤销。"
          showCancelButton
          confirmButtonText="确认清除"
          cancelButtonText="取消"
          confirmButtonColor="#ff4d4f"
          onConfirm={handleClearCache}
          onCancel={() => setDialogVisible(false)}
          onClose={() => setDialogVisible(false)}
        />

        {/* App Information */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium">
              <Info className="w-5 h-5 text-[#DAA520]" />
              应用信息
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-[#D4C5B5]/50">
                <span className="text-gray-600">版本号</span>
                <span className="font-medium text-gray-800">v{version}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">应用名称</span>
                <span className="font-medium text-gray-800">八字排盘命理分析</span>
              </div>
            </div>
          </Card.Body>
        </Card>

        {/* Disclaimer */}
        <Card style={{ marginBottom: 24 }}>
          <div className="p-4 pb-2">
            <h3 className="flex items-center gap-2 font-medium text-amber-700">
              <Shield className="w-5 h-5" />
              免责声明
            </h3>
          </div>
          <Card.Body className="px-4 pb-4">
            <div className="text-sm text-gray-600 space-y-3">
              <p>
                <strong className="text-amber-700">1. 娱乐参考：</strong>
                本应用提供的八字排盘和命理分析仅供娱乐和参考，不构成任何形式的专业建议。
              </p>
              <p>
                <strong className="text-amber-700">2. 非科学依据：</strong>
                命理学属于传统文化范畴，其分析结果不具有科学依据，请勿作为人生重大决策的唯一参考。
              </p>
              <p>
                <strong className="text-amber-700">3. 个人责任：</strong>
                用户基于本应用内容做出的任何决定，均由用户自行承担后果。
              </p>
              <p>
                <strong className="text-amber-700">4. 隐私保护：</strong>
                本应用所有数据均存储在本地，不会上传至任何服务器，请放心使用。
              </p>
            </div>
          </Card.Body>
        </Card>

        {/* Copyright */}
        <div className="text-center text-sm text-gray-400 py-4">
          <p>© 2024 Chinese Fortune Teller</p>
          <p className="mt-1">传承中华传统文化</p>
        </div>
      </main>
    </div>
  );
}
