import { test, expect } from './fixtures/test';
import { HomePage } from './pages/HomePage';
import { HexagramsPage, HexagramDetailPage } from './pages/HexagramsPage';
import { DivinationPage } from './pages/DivinationPage';

/**
 * 端到端集成测试示例
 * 使用 Page Object Model 模式
 */
test.describe('端到端集成测试', () => {
  test('用户完整旅程：浏览首页 -> 使用八字排盘功能', async ({ page }) => {
    // 1. 访问首页
    const homePage = new HomePage(page);
    await homePage.goto();
    await homePage.expectTitleToContain(/八字排盘/);
    
    // 2. 点击八字排盘按钮
    await homePage.clickNavLink(/八字排盘/);
    
    // 3. 等待页面加载
    await page.waitForLoadState('networkidle');
    
    // 4. 检查是否成功导航到排盘页面
    await expect(page).toHaveURL(/.*paipan/);
  });

  test('响应式测试：在不同设备上检查布局', async ({ page }) => {
    const devices = [
      { name: 'Mobile', width: 375, height: 667 },
      { name: 'Tablet', width: 768, height: 1024 },
      { name: 'Desktop', width: 1280, height: 720 },
    ];
    
    for (const device of devices) {
      await page.setViewportSize({ width: device.width, height: device.height });
      await page.goto('/');
      
      const homePage = new HomePage(page);
      await homePage.expectMainContentVisible();
      
      // 验证没有水平滚动条（内容适应屏幕）
      const scrollWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(scrollWidth).toBeLessThanOrEqual(device.width + 50);
    }
  });
});
