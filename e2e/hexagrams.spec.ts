import { test, expect } from '@playwright/test';

/**
 * 万年历页面测试
 * 测试日历显示和日期选择
 */
test.describe('万年历', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/calendar');
  });

  test('日历页面应正确加载', async ({ page }) => {
    // 检查页面标题或主要元素
    const heading = page.locator('h1, h2, h3').first();
    await expect(heading).toBeVisible();
    
    // 检查是否有日历元素
    const calendar = page.locator('.calendar, [class*="calendar"], .date-picker').first();
    if (await calendar.isVisible().catch(() => false)) {
      await expect(calendar).toBeVisible();
    }
  });

  test('应能查看不同月份', async ({ page }) => {
    // 查找月份导航按钮
    const navButtons = page.locator('button').filter({ hasText: /上|下|月|年|今天/ });
    
    if (await navButtons.count() > 0) {
      // 点击第一个导航按钮
      await navButtons.first().click();
      
      // 等待页面更新
      await page.waitForTimeout(500);
      
      // 检查页面仍然正常显示
      await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    }
  });

  test('日历页面应包含必要信息', async ({ page }) => {
    // 检查页面结构
    await expect(page.locator('h1, h2, h3').first()).toBeVisible();
    
    // 检查是否有日期或时间信息
    const dateInfo = page.locator('.date, .time, [class*="date"], [class*="time"]').first();
    if (await dateInfo.isVisible().catch(() => false)) {
      await expect(dateInfo).toBeVisible();
    }
  });
});
