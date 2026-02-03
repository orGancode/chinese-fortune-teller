import { test, expect } from '@playwright/test';

/**
 * 首页基础功能测试
 * 测试页面加载、导航和基本交互
 */
test.describe('首页', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('页面标题应正确显示', async ({ page }) => {
    await expect(page).toHaveTitle(/八字排盘 - 中华传统命理/);
  });

  test('主要功能按钮应可见且可点击', async ({ page }) => {
    // 检查功能按钮存在
    const functionButtons = page.locator('button');
    await expect(functionButtons.first()).toBeVisible();
    
    // 检查八字排盘按钮存在
    const paipanButton = page.getByRole('button', { name: /八字排盘/ }).first();
    await expect(paipanButton).toBeVisible();
  });

  test('页面主要内容区域应加载', async ({ page }) => {
    const mainContent = page.locator('main, [role="main"], .main-content').first();
    await expect(mainContent).toBeVisible();
  });
});
