import { Page, Locator, expect } from '@playwright/test';

/**
 * 占卜功能页面对象模型
 */
export class DivinationPage {
  readonly page: Page;
  readonly questionInput: Locator;
  readonly startButton: Locator;
  readonly resultArea: Locator;

  constructor(page: Page) {
    this.page = page;
    this.questionInput = page.locator('input[placeholder*="问题"], textarea[placeholder*="问题"], input[type="text"]').first();
    this.startButton = page.locator('button').filter({ 
      hasText: /起卦|占卜|开始|问卦/i 
    }).first();
    this.resultArea = page.locator('[data-testid="divination-result"], .divination-result, .result-container').first();
  }

  /**
   * 导航到占卜页面
   */
  async goto() {
    await this.page.goto('/divination');
    await this.waitForLoad();
  }

  /**
   * 等待页面加载
   */
  async waitForLoad() {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * 输入问题
   * @param question 要问的问题
   */
  async enterQuestion(question: string) {
    if (await this.questionInput.isVisible().catch(() => false)) {
      await this.questionInput.fill(question);
    }
  }

  /**
   * 点击开始占卜按钮
   */
  async clickStartButton() {
    if (await this.startButton.isVisible().catch(() => false)) {
      await this.startButton.click();
    }
  }

  /**
   * 执行完整占卜流程
   * @param question 要问的问题
   */
  async performDivination(question: string) {
    await this.enterQuestion(question);
    await this.clickStartButton();
    await this.waitForResult();
  }

  /**
   * 等待结果显示
   */
  async waitForResult() {
    await this.resultArea.waitFor({ state: 'visible', timeout: 10000 });
  }

  /**
   * 断言页面已加载
   */
  async expectPageLoaded() {
    const heading = this.page.locator('h1, h2').first();
    await expect(heading).toBeVisible();
  }

  /**
   * 断言结果显示
   */
  async expectResultVisible() {
    await expect(this.resultArea).toBeVisible();
  }

  /**
   * 获取结果文本
   */
  async getResultText(): Promise<string> {
    return this.resultArea.textContent() || '';
  }
}
