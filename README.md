# Chinese Fortune Teller - 八字排盘命理分析

一个现代化的八字排盘命理分析应用，使用 React + TypeScript + Vite + TailwindCSS 重构。

## ✨ 功能特性

- 🔮 **精准八字排盘**: 根据出生时间计算年、月、日、时四柱
- 🌅 **真太阳时校正**: 根据出生地经度自动校正时间
- 🎯 **五行分析**: 分析八字五行强弱、喜用神
- 📊 **十神分析**: 正官、七杀、正印、偏印、比肩、劫财、食神、伤官、正财、偏财
- 🏛️ **格局判断**: 分析八字格局类型（正官格、七杀格、正印格等）
- 📈 **大运流年**: 推算大运走势和近期流年
- 📅 **万年历**: 公历农历转换查询
- 🌸 **节气查询**: 二十四节气时间表及当前节气
- 📱 **移动端适配**: 完美适配手机浏览器
- 💾 **历史记录**: 本地保存最近10次排盘记录

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS
- **组件库**: React-Vant (移动端组件库)
- **状态管理**: Zustand + persist 中间件
- **路由**: React Router v6
- **农历库**: lunisolar
- **图标**: Lucide React

## 📱 页面结构

- **排盘页** (`/`) - 主要功能，输入出生信息查看八字分析
- **万年历** (`/calendar`) - 公历农历转换、黄历查询
- **节气** (`/solar-terms`) - 二十四节气时间表、当前节气
- **设置** (`/settings`) - 数据管理、关于应用

## 🚀 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/chinese-fortune-teller.git
cd chinese-fortune-teller

# 安装依赖（需要 Node.js 18+）
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产构建
npm run preview
```

## 📁 项目结构

```
src/
├── components/
│   ├── ui/               # React-Vant 基础组件封装
│   ├── Header.tsx        # 页面头部组件
│   └── BottomNav.tsx     # 底部导航栏
├── pages/
│   ├── PaipanPage.tsx    # 排盘页面
│   ├── CalendarPage.tsx  # 万年历页面
│   ├── SolarTermsPage.tsx # 节气页面
│   └── SettingsPage.tsx  # 设置页面
├── store/
│   ├── baziStore.ts      # 排盘状态管理
│   ├── historyStore.ts   # 历史记录管理
│   └── settingsStore.ts  # 设置管理
├── utils/
│   ├── baziCalculator.ts # 八字计算核心算法
│   └── shareUtils.ts     # 分享功能工具
├── data/
│   ├── locations.ts      # 城市经纬度数据
│   └── knowledgeBase.ts  # 命理知识库
├── types/
│   └── index.ts          # TypeScript 类型定义
├── App.tsx               # 应用主组件
└── main.tsx              # 应用入口
```

## 🎨 配色方案

- 主色: `#e74c3c` (中国红)
- 背景: `#f5f6fa`
- 卡片: `#ffffff`
- 文字: `#2c3e50`

## 📄 开源协议

MIT License

## ⚠️ 免责声明

本应用仅供娱乐参考，请理性看待命理分析。
