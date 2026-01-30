# Chinese Fortune Teller - 八字排盘命理分析

一个基于HTML5的八字排盘命理分析应用，纯前端实现，不依赖网络请求。

## 功能特性

- 精准八字排盘: 根据出生时间计算年、月、日、时四柱
- 真太阳时校正: 根据出生地经度自动校正时间
- 五行分析: 分析八字五行强弱、喜用神
- 十神分析: 正官、七杀、正印、偏印、比肩、劫财、食神、伤官、正财、偏财
- 格局判断: 分析八字格局类型
- 大运流年: 推算大运走势和流年吉凶
- 移动端适配: 完美适配手机浏览器

## 技术栈

- 核心算法: lunisolar - 专业农历/八字计算库
- 前端: 原生HTML5 + CSS3 + JavaScript (ES6+)
- 部署: Vercel

## 使用方式

1. 访问应用
2. 输入出生年月日时
3. 选择出生地点（用于真太阳时校正）
4. 点击"开始排盘"
5. 查看详细的八字分析结果

## 本地开发

```bash
# 克隆仓库
git clone https://github.com/yourusername/chinese-fortune-teller.git
cd chinese-fortune-teller

# 启动本地服务器
npm run dev
```

## 在线访问

部署在 Vercel

## 开源协议

MIT License
