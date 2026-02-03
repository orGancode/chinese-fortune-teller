import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright 配置文件
 * 用于 E2E 自动化测试
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './e2e',
  
  /* 并发运行测试文件 */
  fullyParallel: true,
  
  /* 禁止在CI中并发测试 */
  workers: process.env.CI ? 1 : undefined,
  
  /* 失败时重试次数 */
  retries: process.env.CI ? 2 : 0,
  
  /* 报告器配置 */
  reporter: [
    ['html', { open: 'never' }],
    ['list']
  ],
  
  /* 全局超时设置 */
  timeout: 30 * 1000,
  expect: {
    timeout: 5000
  },
  
  /* 项目共享配置 */
  use: {
    /* 基础URL */
    baseURL: 'http://localhost:3000',
    
    /* 收集trace信息，失败时用于调试 */
    trace: 'on-first-retry',
    
    /* 截图策略 */
    screenshot: 'only-on-failure',
    
    /* 视频录制策略 */
    video: 'on-first-retry',
  },

  /* 不同浏览器/设备的测试项目 */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    /* 移动端测试 */
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],

  /* 本地开发服务器配置 */
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: !process.env.CI,
    timeout: 120 * 1000,
  },
});
