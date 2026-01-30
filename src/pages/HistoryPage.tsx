import { Header } from "../components/Header";
import { Card, Button, Empty, Dialog } from "react-vant";
import { useHistoryStore } from "../store/historyStore";
import { useBaziStore } from "../store/baziStore";
import type { HistoryItem } from "../types";
import { useNavigate } from "react-router-dom";
import { History, Trash2, ChevronRight, Clock, User } from "lucide-react";

// 格式化日期时间
function formatDateTime(timestamp: number): string {
  const date = new Date(timestamp);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
}

// 性别文本
function getGenderText(gender: 0 | 1): string {
  return gender === 0 ? "女" : "男";
}

export function HistoryPage() {
  const navigate = useNavigate();
  const { history, deleteHistoryItem, clearHistory } = useHistoryStore();
  const { setCurrentBazi } = useBaziStore();

  // 点击历史记录，跳转到结果页
  const handleItemClick = (item: HistoryItem) => {
    setCurrentBazi(item.result);
    navigate("/result");
  };

  // 删除单条记录
  const handleDelete = (id: string) => {
    Dialog.confirm({
      title: "确认删除",
      message: "确定要删除这条排盘记录吗？",
      confirmButtonText: "删除",
      cancelButtonText: "取消",
      confirmButtonColor: "#ff4d4f",
    }).then(() => {
      deleteHistoryItem(id);
    }).catch(() => {
      // 用户取消
    });
  };

  // 清空所有历史
  const handleClearAll = () => {
    Dialog.confirm({
      title: "确认清空",
      message: "确定要清空所有排盘历史记录吗？此操作不可恢复。",
      confirmButtonText: "清空",
      cancelButtonText: "取消",
      confirmButtonColor: "#ff4d4f",
    }).then(() => {
      clearHistory();
    }).catch(() => {
      // 用户取消
    });
  };

  return (
    <div className="flex flex-col h-full">
      <Header title="排盘历史" subtitle="八字排盘记录" showBack />
      <main className="flex-1 p-4 pb-24 overflow-y-auto">
        {history.length === 0 ? (
          <Card>
            <Card.Body className="py-12">
              <Empty description="暂无排盘记录">
                <Button 
                  style={{ marginTop: 16 }} 
                  onClick={() => navigate("/")}
                >
                  去排盘
                </Button>
              </Empty>
            </Card.Body>
          </Card>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <History className="w-4 h-4" />
                <span>共 {history.length} 条记录</span>
              </div>
              <Button 
                size="small" 
                style={{ color: "#ff4d4f" }}
                onClick={handleClearAll}
              >
                清空记录
              </Button>
            </div>

            <div className="space-y-3">
              {history.map((item) => (
                <Card 
                  key={item.id}
                  style={{ marginBottom: 0 }}
                >
                  <Card.Body className="p-4">
                    <div 
                      className="flex items-center justify-between cursor-pointer"
                      onClick={() => handleItemClick(item)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="flex items-center gap-1 text-sm">
                            <User className="w-4 h-4 text-[#C41E3A]" />
                            <span className="font-medium">
                              {getGenderText(item.input.gender)}命
                            </span>
                          </div>
                          <div className="text-xs text-gray-400">
                            {item.input.birthDate} {item.input.birthTime}
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <span className="font-medium text-[#8B4513]">
                            {item.result.year} {item.result.month} {item.result.day} {item.result.hour}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 text-xs text-gray-400 mt-2">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(item.timestamp)}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="small"
                          style={{ color: "#ff4d4f" }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item.id);
                          }}
                        >
                          删除
                        </Button>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
}
