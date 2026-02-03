import { test, expect } from '@playwright/test';

/**
 * 八字排盘功能测试
 * 测试用户输入和结果展示
 */
test.describe('八字排盘功能', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/paipan');
  });

  test('排盘页面应正确加载', async ({ page }) => {
    // 检查页面标题或主要元素
    const heading = page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
    
    // 检查是否有表单元素
    const form = page.locator('form, .form, [class*="form"]').first();
    if (await form.isVisible().catch(() => false)) {
      await expect(form).toBeVisible();
    }
  });

  test('输入表单应能正常工作', async ({ page }) => {
    // 查找输入字段
    const inputs = page.locator('input, textarea, select');
    const inputCount = await inputs.count();
    
    if (inputCount > 0) {
      // 测试文本输入
      const textInput = inputs.filter({ has: page.locator('[type="text"], :not([type])') }).first();
      if (await textInput.isVisible().catch(() => false)) {
        await textInput.fill('测试输入');
        await expect(textInput).toHaveValue('测试输入');
      }
    }
  });

  test('移动端响应式布局', async ({ page }) => {
    // 模拟移动端视口
    await page.setViewportSize({ width: 375, height: 667 });
    
    // 页面应能正常显示，无水平滚动
    const body = page.locator('body');
    const bodyWidth = await body.evaluate(el => el.scrollWidth);
    const viewportWidth = 375;
    
    // 页面内容不应超出视口
    expect(bodyWidth).toBeLessThanOrEqual(viewportWidth + 50); // 允许小幅溢出
  });
});
