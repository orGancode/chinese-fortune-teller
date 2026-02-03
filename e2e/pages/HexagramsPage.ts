import { Page, Locator, expect } from '@playwright/test';

/**
 * 六十四卦列表页面对象模型
 */
export class HexagramsPage {
  readonly page: Page;
  readonly listContainer: Locator;
  readonly hexagramItems: Locator;

  constructor(page: Page) {
    this.page = page;
    this.listContainer = page.locator('[data-testid="hexagram-list"], .hexagram-list, .hexagram-grid').first();
    this.hexagramItems = page.locator('[data-testid="hexagram-item"], .hexagram-card, .hexagram-item');
  }

  /**
   * 导航到六十四卦列表页
   */
  async goto() {
    await this.page.goto('/hexagrams');
    await this.waitForLoad();
  }

  /**
   * 等待列表加载
   */
  async waitForLoad() {
    await this.listContainer.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * 获取卦象数量
   */
  async getHexagramCount(): Promise<number> {
    return this.hexagramItems.count();
  }

  /**
   * 点击特定索引的卦象
   * @param index 卦象索引（从0开始）
   */
  async clickHexagramAt(index: number) {
    const item = this.hexagramItems.nth(index);
    await item.click();
  }

  /**
   * 断言列表中有卦象
   */
  async expectHexagramsToExist() {
    const count = await this.getHexagramCount();
    expect(count).toBeGreaterThan(0);
  }

  /**
   * 断言列表容器可见
   */
  async expectListVisible() {
    await expect(this.listContainer).toBeVisible();
  }
}

/**
 * 单个卦象详情页面对象模型
 */
export class HexagramDetailPage {
  readonly page: Page;
  readonly title: Locator;
  readonly symbol: Locator;
  readonly content: Locator;

  constructor(page: Page) {
    this.page = page;
    this.title = page.locator('h1').first();
    this.symbol = page.locator('.trigram-symbol, [data-testid="hexagram-symbol"]').first();
    this.content = page.locator('article, .hexagram-content, .hexagram-detail').first();
  }

  /**
   * 导航到特定卦象详情页
   * @param id 卦象ID（1-64）
   */
  async goto(id: number) {
    await this.page.goto(`/hexagram/${id}`);
    await this.waitForLoad();
  }

  /**
   * 等待页面加载
   */
  async waitForLoad() {
    await this.title.waitFor({ state: 'visible', timeout: 5000 });
  }

  /**
   * 获取卦象名称
   */
  async getHexagramName(): Promise<string> {
    return this.title.textContent() || '';
  }

  /**
   * 断言页面标题可见
   */
  async expectTitleVisible() {
    await expect(this.title).toBeVisible();
  }

  /**
   * 断言卦象符号可见
   */
  async expectSymbolVisible() {
    await expect(this.symbol).toBeVisible();
  }

  /**
   * 断言内容区域可见
   */
  async expectContentVisible() {
    await expect(this.content).toBeVisible();
  }
}
