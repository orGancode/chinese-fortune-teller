import { Page, Locator, expect } from '@playwright/test';

/**
 * 首页页面对象模型
 * 封装首页的所有操作和断言
 */
export class HomePage {
  readonly page: Page;
  readonly mainContent: Locator;
  readonly bottomNav: Locator;
  readonly functionButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.mainContent = page.locator('main');
    this.bottomNav = page.locator('.bottom-nav, [class*="bottom"], [class*="nav"]');
    this.functionButtons = page.locator('button');
  }

  /**
   * 导航到首页
   */
  async goto() {
    await this.page.goto('/');
    await this.waitForLoad();
  }

  /**
   * 等待页面加载完成
   */
  async waitForLoad() {
    // 等待主要内容区域加载
    await this.page.waitForSelector('main', { state: 'visible', timeout: 10000 });
  }

  /**
   * 点击导航链接
   * @param linkName 链接文本
   */
  async clickNavLink(linkName: string | RegExp) {
    // 在八字排盘应用中，导航是通过按钮实现的
    const button = this.page.getByRole('button', { name: linkName }).first();
    await button.click();
  }

  /**
   * 获取页面标题
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * 断言页面标题包含特定文本
   */
  async expectTitleToContain(text: string | RegExp) {
    await expect(this.page).toHaveTitle(text);
  }

  /**
   * 断言底部导航可见
   */
  async expectBottomNavVisible() {
    await expect(this.bottomNav).toBeVisible();
  }

  /**
   * 断言主要内容区域可见
   */
  async expectMainContentVisible() {
    await expect(this.mainContent).toBeVisible();
  }

  /**
   * 断言功能按钮可见
   */
  async expectFunctionButtonsVisible() {
    await expect(this.functionButtons.first()).toBeVisible();
  }
}
