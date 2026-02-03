import { test as base, expect } from '@playwright/test';

/**
 * 自定义测试夹具
 * 提供常用的测试辅助功能
 */

export type TestOptions = {
  /** 是否跳过视觉回归测试 */
  skipVisualTest: boolean;
};

export const test = base.extend<TestOptions>({
  skipVisualTest: [false, { option: true }],
  
  // 添加页面初始化辅助
  page: async ({ page }, use) => {
    // 设置默认视口
    await page.setViewportSize({ width: 1280, height: 720 });
    
    // 监听控制台错误
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.error(`Page error: ${msg.text()}`);
      }
    });
    
    // 监听页面错误
    page.on('pageerror', error => {
      console.error(`Page error: ${error.message}`);
    });
    
    await use(page);
  }
});

export { expect };
