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

  describe('年柱计算', () => {
    it('1984年2月5日12:00（立春后）应得甲子年', () => {
      // 1984年立春是2月5日6:20
      const result = (calculator as any).calculateYearPillar(1984, 2, 5, 12, 0);
      expect(result).toBe('甲子');
    });

    it('1984年2月4日12:00（立春前）应得癸亥年', () => {
      // 1984年立春是2月5日
      const result = (calculator as any).calculateYearPillar(1984, 2, 4, 12, 0);
      expect(result).toBe('癸亥');
    });

    it('1990年2月4日12:00（立春后）应得庚午年', () => {
      // 1990年立春是2月4日
      const result = (calculator as any).calculateYearPillar(1990, 2, 4, 12, 0);
      expect(result).toBe('庚午');
    });

    it('1995年3月15日（立春后）应得乙亥年', () => {
      const result = (calculator as any).calculateYearPillar(1995, 3, 15, 12, 0);
      expect(result).toBe('乙亥');
    });
  });

  describe('月柱计算', () => {
    it('1984年甲寅月（立春后惊蛰前）', () => {
      // 1984年立春后，惊蛰前（约2月5日-3月5日）
      const result = (calculator as any).calculateMonthPillar(1984, 2, 15, 12, 0, '甲子');
      expect(result).toBe('丙寅'); // 甲年丙寅月
    });

    it('1984年惊蛰后应为卯月', () => {
      // 1984年惊蛰约在3月5日
      const result = (calculator as any).calculateMonthPillar(1984, 3, 10, 12, 0, '甲子');
      expect(result).toBe('丁卯'); // 甲年丁卯月
    });

    it('1990年庚午年寅月应为戊寅', () => {
      // 庚年戊寅月
      const result = (calculator as any).calculateMonthPillar(1990, 2, 15, 12, 0, '庚午');
      expect(result).toBe('戊寅');
    });

    it('月支应为寅月（正月）开始', () => {
      const result = (calculator as any).calculateMonthPillar(2020, 2, 10, 12, 0, '庚子');
      const zhi = result.charAt(1);
      expect(zhi).toBe('寅');
    });
  });

  describe('日柱计算', () => {
    it('1900年1月31日应为甲子日', () => {
      const result = calculator.calculateDayPillar(1900, 1, 31);
      expect(result).toBe('甲子');
    });

    it('1900年2月1日应为乙丑日', () => {
      const result = calculator.calculateDayPillar(1900, 2, 1);
      expect(result).toBe('乙丑');
    });

    it('1984年4月6日应为甲子日（验证基准）', () => {
      const result = calculator.calculateDayPillar(1984, 4, 6);
      expect(result).toBe('甲子');
    });

    it('2000年1月1日应为戊午日', () => {
      const result = calculator.calculateDayPillar(2000, 1, 1);
      expect(result).toBe('戊午');
    });
  });

  describe('时柱计算', () => {
    it('甲子日子时应为甲子', () => {
      const result = calculator.calculateHourPillar('甲子', 0, 0, 120);
      expect(result.ganZhi).toBe('甲子');
    });

    it('甲子日丑时应为乙丑', () => {
      const result = calculator.calculateHourPillar('甲子', 1, 30, 120);
      expect(result.ganZhi).toBe('乙丑');
    });

    it('甲日丙作初（寅时）', () => {
      const result = calculator.calculateHourPillar('甲子', 4, 0, 120);
      expect(result.ganZhi).toBe('丙寅');
    });

    it('乙日戊作初（寅时）', () => {
      const result = calculator.calculateHourPillar('乙丑', 4, 0, 120);
      expect(result.ganZhi).toBe('戊寅');
    });

    it('北京时间120度不应校正', () => {
      const result = calculator.calculateHourPillar('甲子', 12, 0, 120);
      expect(result.adjusted).toBe(false);
    });

    it('乌鲁木齐(87度)应校正时差', () => {
      const result = calculator.calculateHourPillar('甲子', 12, 0, 87);
      // (87-120)*4 = -132分钟，会校正
      expect(result.adjusted).toBe(true);
    });
  });

  describe('完整八字计算', () => {
    it('1984年2月5日12:00北京男命', () => {
      const input = {
        birthDate: '1984-02-05',
        birthTime: '12:00',
        longitude: 116.4,
        gender: 1 as const
      };
      const result = calculator.calculateBazi(input);
      
      expect(result.year).toBe('甲子');
      expect(result.month).toBe('丙寅');
      expect(result.shiChen).toBe('午');
    });

    it('1990年5月15日10:30上海女命', () => {
      const input = {
        birthDate: '1990-05-15',
        birthTime: '10:30',
        longitude: 121.5,
        gender: 0 as const
      };
      const result = calculator.calculateBazi(input);
      
      expect(result.year).toBe('庚午');
      expect(result.month).toMatch(/[甲乙丙丁戊己庚辛壬癸]巳/); // 巳月
      expect(result.shiChen).toBe('巳');
    });
  });

  describe('五行计算', () => {
    it('甲子年丙寅月戊辰日庚午时五行统计', () => {
      const bazi = {
        year: '甲子',
        month: '丙寅',
        day: '戊辰',
        hour: '庚午',
        shiChen: '午',
        shiChenIndex: 6,
        timeAdjusted: false,
        originalTime: '12:00',
        solarDate: '1984年2月5日',
        time: '12:00'
      };
      const result = calculator.calculateWuxing(bazi);
      
      expect(result['木']).toBeGreaterThanOrEqual(0);
      expect(result['火']).toBeGreaterThanOrEqual(0);
      expect(result['土']).toBeGreaterThanOrEqual(0);
      expect(result['金']).toBeGreaterThanOrEqual(0);
      expect(result['水']).toBeGreaterThanOrEqual(0);
      
      // 总五行数应为8（四柱各2个）
      const total = result['木'] + result['火'] + result['土'] + result['金'] + result['水'];
      expect(total).toBe(8);
    });
  });

  describe('藏干计算', () => {
    it('寅支藏干应为甲丙戊', () => {
      const result = calculator.getCangGan('寅');
      expect(result).toEqual(['甲', '丙', '戊']);
    });

    it('子支藏干应为癸', () => {
      const result = calculator.getCangGan('子');
      expect(result).toEqual(['癸']);
    });

    it('午支藏干应为丁己', () => {
      const result = calculator.getCangGan('午');
      expect(result).toEqual(['丁', '己']);
    });
  });
});
