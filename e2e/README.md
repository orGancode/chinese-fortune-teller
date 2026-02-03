# Playwright E2E 测试指南

## 快速开始

### 安装依赖
```bash
npm install
```

### 安装 Playwright 浏览器
```bash
npx playwright install
```

## 运行测试

### 运行所有 E2E 测试
```bash
npm run test:e2e
```

### 运行特定测试文件
```bash
npx playwright test e2e/home.spec.ts
```

### 使用 UI 模式（可视化调试）
```bash
npm run test:e2e:ui
```

### 调试模式
```bash
npm run test:e2e:debug
```

### 查看测试报告
```bash
npm run test:e2e:report
```

## 测试结构

```
e2e/
├── fixtures/
│   └── test.ts          # 自定义测试夹具
├── pages/
│   ├── HomePage.ts      # 首页页面对象
│   ├── HexagramsPage.ts # 六十四卦页面对象
│   └── DivinationPage.ts # 占卜页面对象
├── home.spec.ts         # 首页测试
├── hexagrams.spec.ts    # 六十四卦测试
└── divination.spec.ts   # 占卜功能测试
```

## 页面对象模式 (Page Object Model)

我们使用页面对象模式组织测试代码，提高可维护性：

```typescript
import { HomePage } from './pages/HomePage';

test('首页应正确加载', async ({ page }) => {
  const homePage = new HomePage(page);
  await homePage.goto();
  await homePage.expectTitleToContain('易经');
  await homePage.expectNavVisible();
});
```

## 最佳实践

### 1. 使用数据属性定位元素
在组件中添加 `data-testid` 便于测试定位：
```tsx
<div data-testid="hexagram-list">
  <div data-testid="hexagram-item">...</div>
</div>
```

### 2. 等待策略
```typescript
// 优先使用自动等待
await page.getByRole('button', { name: '起卦' }).click();

// 显式等待特定状态
await page.waitForSelector('[data-testid="result"]', { state: 'visible' });
```

### 3. 响应式测试
```typescript
// 测试移动端布局
await page.setViewportSize({ width: 375, height: 667 });
```

## 浏览器支持

测试会自动在以下环境运行：
- Chrome (Chromium)
- Firefox
- Safari (WebKit)
- Mobile Chrome (Pixel 5)
- Mobile Safari (iPhone 12)

## 配置

查看 `playwright.config.ts` 了解详细配置：
- 并行测试设置
- 重试策略
- 报告器配置
- 本地开发服务器集成

## 调试技巧

1. **使用 UI 模式**: `npm run test:e2e:ui` - 可视化运行和调试
2. **查看 Trace**: 测试失败时会自动保存 trace，可以用 `npx playwright show-trace` 查看
3. **截图和视频**: 失败测试会自动保存截图和视频到 `test-results/`
4. **浏览器 DevTools**: 在 debug 模式下自动打开 DevTools

## 持续集成

在 CI 环境中：
- 使用 `--workers=1` 串行运行
- 失败时重试 2 次
- 自动生成 HTML 报告
