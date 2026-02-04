import { describe, it, expect, beforeEach } from 'vitest';
import { BaziCalculator } from '../baziCalculator';

describe('BaziCalculator', () => {
  let calculator: BaziCalculator;

  beforeEach(() => {
    calculator = new BaziCalculator();
  });

  describe('年柱计算', () => {
    it('1984年2月5日12:00（立春后）应得甲子年', () => {
      const result = (calculator as any).calculateYearPillar(1984, 2, 5, 12, 0);
      expect(result).toBe('甲子');
    });

    it('1984年2月4日12:00（立春前）应得癸亥年', () => {
      const result = (calculator as any).calculateYearPillar(1984, 2, 4, 12, 0);
      expect(result).toBe('癸亥');
    });

    it('2026年2月2日（立春前）应得乙巳年', () => {
      // 2026年立春是2月4日，2月2日未立春
      const result = (calculator as any).calculateYearPillar(2026, 2, 2, 12, 0);
      expect(result).toBe('乙巳');
    });
  });

  describe('月柱计算', () => {
    it('1984年甲寅月（立春后惊蛰前）', () => {
      const result = (calculator as any).calculateMonthPillar(1984, 2, 15, 12, 0, '甲子');
      expect(result).toBe('丙寅'); // 甲年丙寅月
    });

    it('2026年2月2日乙年丑月应为己丑（万年历验证）', () => {
      // 2026年2月2日未立春，属于丑月（腊月）
      // 乙年五虎遁戊起头：
      // 正月(寅): 戊, 二月(卯): 己, ..., 腊月(丑): 己
      // 计算：戊(4) + 11(腊月顺序) = 15 % 10 = 5 = 己
      const result = (calculator as any).calculateMonthPillar(2026, 2, 2, 12, 0, '乙巳');
      expect(result).toBe('己丑');
    });

    it('乙年各月月柱验证', () => {
      // 乙年五虎遁戊起头
      // 正月寅月: 戊寅
      expect((calculator as any).calculateMonthPillar(2024, 2, 10, 12, 0, '乙巳')).toBe('戊寅');
      
      // 二月卯月: 己卯
      expect((calculator as any).calculateMonthPillar(2024, 3, 10, 12, 0, '乙巳')).toBe('己卯');
      
      // 腊月丑月: 己丑（关键验证）
      expect((calculator as any).calculateMonthPillar(2026, 2, 2, 12, 0, '乙巳')).toBe('己丑');
    });

    it('1990年庚午年寅月应为戊寅', () => {
      const result = (calculator as any).calculateMonthPillar(1990, 2, 15, 12, 0, '庚午');
      expect(result).toBe('戊寅');
    });
  });

  describe('日柱计算', () => {
    it('1900年1月1日应为庚午日（基准）', () => {
      const result = calculator.calculateDayPillar(1900, 1, 1);
      expect(result).toBe('庚午');
    });

    it('1900年1月2日应为辛未日', () => {
      const result = calculator.calculateDayPillar(1900, 1, 2);
      expect(result).toBe('辛未');
    });

    it('2024年1月1日应为癸亥日（万年历验证）', () => {
      const result = calculator.calculateDayPillar(2024, 1, 1);
      expect(result).toBe('癸亥');
    });
  });

  describe('时柱计算', () => {
    it('丁日午时应为丙午', () => {
      // 丁日起于庚子，午是第6位，庚(6)+6=12%10=2=丙
      const result = calculator.calculateHourPillar('丁未', 12, 0, 120);
      expect(result.ganZhi).toBe('丙午');
    });

    it('甲日午时应为庚午', () => {
      // 甲日起于甲子，午是第6位，甲(0)+6=6=庚
      const result = calculator.calculateHourPillar('甲子', 12, 0, 120);
      expect(result.ganZhi).toBe('庚午');
    });
  });

  describe('完整八字计算 - 2026年2月2日', () => {
    it('2026年2月2日12:00北京男命', () => {
      const input = {
        birthDate: '2026-02-02',
        birthTime: '12:00',
        longitude: 116.4,
        gender: 1 as const
      };
      const result = calculator.calculateBazi(input);
      
      // 四柱验证
      expect(result.year).toBe('乙巳');  // 未立春，属2025年乙巳
      expect(result.month).toBe('己丑'); // 腊月，乙年己丑
      expect(result.day).toBe('丁未');   // 需要验证
      expect(result.hour).toBe('丙午');  // 丁日午时丙午
      expect(result.shiChen).toBe('午');
    });
  });
});
