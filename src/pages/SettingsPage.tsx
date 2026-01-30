import { Header } from "../components/Header";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useSettingsStore } from "../store/settingsStore";
import { Trash2, Github, Info, AlertTriangle, Shield, ExternalLink, Database, Code } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../components/ui/dialog";

export function SettingsPage() {
  const { version, clearAllData } = useSettingsStore();

  const handleClearCache = () => {
    clearAllData();
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="设置" subtitle="应用设置" />
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {/* Cache Management */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5 text-[#e74c3c]" />
              数据管理
            </CardTitle>
            <CardDescription>管理本地存储的数据</CardDescription>
          </CardHeader>
          <CardContent>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="destructive" className="w-full">
                  <Trash2 className="w-4 h-4 mr-2" />
                  清除所有缓存数据
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-500" />
                    确认清除数据
                  </DialogTitle>
                  <DialogDescription>
                    此操作将删除所有本地存储的数据，包括历史记录和应用设置。此操作不可撤销。
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-3">
                  <Button variant="outline">取消</Button>
                  <Button variant="destructive" onClick={handleClearCache}>
                    确认清除
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
            <p className="text-xs text-gray-500 mt-3">
              清除缓存将删除所有历史记录和设置，应用将恢复到初始状态
            </p>
          </CardContent>
        </Card>

        {/* App Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5 text-blue-500" />
              应用信息
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">版本号</span>
                <span className="font-medium text-gray-800">v{version}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">应用名称</span>
                <span className="font-medium text-gray-800">八字排盘命理分析</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-gray-600">技术栈</span>
                <span className="font-medium text-gray-800">React + TypeScript + Tailwind</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Source Code */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Code className="w-5 h-5 text-purple-500" />
              开源项目
            </CardTitle>
            <CardDescription>查看源代码或提交问题</CardDescription>
          </CardHeader>
          <CardContent>
            <a
              href="https://github.com/yourusername/chinese-fortune-teller"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <Github className="w-6 h-6 text-gray-700" />
                <div>
                  <div className="font-medium text-gray-800">GitHub 仓库</div>
                  <div className="text-sm text-gray-500">查看源代码和文档</div>
                </div>
              </div>
              <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
            </a>
          </CardContent>
        </Card>

        {/* Disclaimer */}
        <Card className="mb-6 border-amber-200 bg-amber-50/50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-amber-700">
              <Shield className="w-5 h-5" />
              免责声明
            </CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
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
