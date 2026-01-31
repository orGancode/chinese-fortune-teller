# Chinese Fortune Teller - 八字排盘命理分析

一个现代化的八字排盘命理分析应用，采用 React + TypeScript + Vite + TailwindCSS 技术栈，结合中国传统命理学与现代UI设计。

## ✨ 功能特性

- 🔮 **精准八字排盘**: 根据出生时间计算年、月、日、时四柱
- 🌅 **真太阳时校正**: 根据出生地经度自动校正时间
- 🎯 **五行分析**: 分析八字五行强弱、喜用神，可视化条形图展示
- 📊 **十神分析**: 正官、七杀、正印、偏印、比肩、劫财、食神、伤官、正财、偏财
- 🏛️ **格局判断**: 分析八字格局类型（正官格、七杀格、正印格等）
- 📈 **大运流年**: 推算大运走势和近期流年
- 🎨 **时辰表盘**: 精美的Canvas时辰八卦图展示
- 📅 **万年历**: 公历农历转换查询，月历平铺展示
- 🌸 **节气查询**: 二十四节气时间表及当前节气高亮
- 📱 **移动端适配**: 完美适配手机浏览器，支持暗黑模式
- 💾 **历史记录**: 本地保存排盘记录，支持查看和管理
- 🏠 **首页概览**: 快速入口、今日运势、最近记录

## 🛠️ 技术栈

- **框架**: React 18 + TypeScript
- **构建工具**: Vite
- **样式**: TailwindCSS + 自定义CSS变量
- **组件库**: React-Vant (移动端组件库) + Radix UI
- **状态管理**: Zustand + persist 中间件
- **路由**: React Router v6
- **农历库**: lunisolar
- **图标**: Lucide React

## 📱 页面结构

### 主页面（带底部导航）

- **首页** (`/`) - 应用入口，快捷功能入口、今日运势概览
- **排盘页** (`/paipan`) - 主要功能，输入出生信息进行八字排盘
- **万年历** (`/calendar`) - 公历农历转换、黄历查询
- **节气** (`/solar-terms`) - 二十四节气时间表、当前节气高亮
- **设置** (`/settings`) - 数据管理、关于应用

### 二级页面（不带底部导航）

- **结果页** (`/result`) - 八字排盘详细分析结果
- **历史记录** (`/history`) - 查看和管理历史排盘记录

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

# 代码检查
npm run lint
```

## 📁 项目结构

```
src/
├── components/
│   ├── BottomNav.tsx          # 底部导航栏（现代风格设计）
│   ├── CalendarGrid.tsx       # 日历网格组件
│   ├── Header.tsx             # 页面头部导航（渐变配色）
│   ├── Logo.tsx               # Logo组件
│   ├── ShiChenDialCanvas.tsx  # 时辰八卦表盘（Canvas绘制）
│   └── ui.tsx                 # 基础UI组件封装
├── pages/
│   ├── HomePage.tsx           # 首页
│   ├── PaipanPage.tsx         # 排盘页面
│   ├── BaziResultPage.tsx     # 八字结果页
│   ├── CalendarPage.tsx       # 万年历页面
│   ├── SolarTermsPage.tsx     # 节气页面
│   ├── HistoryPage.tsx        # 历史记录页
│   └── SettingsPage.tsx       # 设置页面
├── store/
│   ├── baziStore.ts           # 排盘状态管理
│   ├── historyStore.ts        # 历史记录管理
│   └── settingsStore.ts       # 设置管理
├── utils/
│   ├── baziCalculator.ts      # 八字计算核心算法
│   └── shareUtils.ts          # 分享功能工具
├── data/
│   ├── locations.ts           # 城市经纬度数据
│   ├── knowledgeBase.ts       # 命理知识库
│   └── knowledgeBaseExtended.ts # 扩展命理知识
├── types/
│   └── index.ts               # TypeScript 类型定义
├── lib/
│   └── utils.ts               # 工具函数
├── App.tsx                    # 应用主组件（路由配置）
├── main.tsx                   # 应用入口
└── index.css                  # 全局样式（含主题变量）
```

## 🎨 设计系统

### 配色方案

| 用途 | 颜色值 | 说明 |
|------|--------|------|
| 主色（朱砂红） | `#C41E3A` | 品牌主色、按钮、激活态 |
| 主色浅 | `#E85A71` | 悬停、渐变 |
| 金色 | `#D4AF37` | 装饰、高亮 |
| 金色浅 | `#F4D03F` | 悬停效果 |
| 背景色 | `#FAF8F5` | 宣纸质感背景 |
| 卡片色 | `#FFFFFF` | 卡片背景 |
| 主文字 | `#1a1a1a` | 正文 |
| 次要文字 | `#666666` | 说明文字 |
| 边框 | `#E8E8E8` | 分割线 |

### 导航设计

- **顶部导航**: 渐变背景（朱砂红 → 棕褐），毛玻璃效果，精致返回按钮
- **底部导航**: 毛玻璃背景，中间凸起按钮设计，现代动画交互

### 主题支持

- ☀️ **浅色模式**: 宣纸质感背景，暖色调
- 🌙 **暗黑模式**: 深色背景，自动适配

## 📦 核心功能说明

### 八字计算

基于传统子平八字算法，支持：
- 四柱推算（年柱、月柱、日柱、时柱）
- 天干地支、藏干、纳音五行
- 十神关系分析
- 日主强弱判断
- 格局分析

### 真太阳时校正

根据用户选择的出生地经度，自动计算真太阳时进行校正。

### 时辰表盘

使用Canvas绘制精美的时辰八卦图：
- 24节气方位
- 12时辰对应
- 标准八卦图形
- 太极图背景

## 📄 开源协议

MIT License

## ⚠️ 免责声明

本应用仅供娱乐参考，请理性看待命理分析。命运掌握在自己手中，努力奋斗才是成功的关键。

## 🙏 致谢

- [lunisolar](https://github.com/6tail/lunar-javascript) - 农历计算库
- [React-Vant](https://github.com/3lang3/react-vant) - 移动端组件库
- [Lucide](https://lucide.dev/) - 图标库
