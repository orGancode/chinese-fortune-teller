import type {
  TianGanInfo,
  DiZhiInfo,
  ShiShenRelation,
  ShiShenDesc,
  GeJuInfo,
  DayMasterInfo
} from '../types';

// 命理知识库
export const KNOWLEDGE_BASE = {
  // 天干五行属性
  TIANGAN: {
    '甲': { element: '木', yinYang: '阳', nature: '参天大树', desc: '甲木为参天大树，性格刚直、有领导力', characteristics: ['刚直', '有领导力', '正直'], season: '春', direction: '东' },
    '乙': { element: '木', yinYang: '阴', nature: '花草藤蔓', desc: '乙木为花草藤蔓，性格柔和、善于变通', characteristics: ['柔和', '善于变通', '适应力强'], season: '春', direction: '东' },
    '丙': { element: '火', yinYang: '阳', nature: '太阳之火', desc: '丙火为太阳之火，性格热情、光明磊落', characteristics: ['热情', '光明磊落', '有奉献精神'], season: '夏', direction: '南' },
    '丁': { element: '火', yinYang: '阴', nature: '灯烛之火', desc: '丁火为灯烛之火，性格温和、心思细腻', characteristics: ['温和', '心思细腻', '有耐心'], season: '夏', direction: '南' },
    '戊': { element: '土', yinYang: '阳', nature: '城墙之土', desc: '戊土为城墙之土，性格稳重、诚实守信', characteristics: ['稳重', '诚实守信', '有包容心'], season: '四季月', direction: '中' },
    '己': { element: '土', yinYang: '阴', nature: '田园之土', desc: '己土为田园之土，性格包容、养育万物', characteristics: ['温和', '包容', '善于照顾他人'], season: '四季月', direction: '中' },
    '庚': { element: '金', yinYang: '阳', nature: '刀剑之金', desc: '庚金为刀剑之金，性格刚毅、果断决绝', characteristics: ['刚毅', '果断', '有决断力'], season: '秋', direction: '西' },
    '辛': { element: '金', yinYang: '阴', nature: '首饰之金', desc: '辛金为首饰之金，性格精致、追求完美', characteristics: ['精致', '追求完美', '有艺术品味'], season: '秋', direction: '西' },
    '壬': { element: '水', yinYang: '阳', nature: '江河之水', desc: '壬水为江河之水，性格奔放、智慧深邃', characteristics: ['奔放', '智慧深邃', '善于思考'], season: '冬', direction: '北' },
    '癸': { element: '水', yinYang: '阴', nature: '雨露之水', desc: '癸水为雨露之水，性格含蓄、滋润万物', characteristics: ['含蓄', '善于思考', '有智慧'], season: '冬', direction: '北' }
  } as Record<string, TianGanInfo>,

  // 地支五行属性
  DIZHI: {
    '子': { element: '水', yinYang: '阳', hidden: ['癸'], hiddenDesc: ['癸水'], desc: '子水为阳水，藏癸水', characteristics: ['聪明', '机智', '灵活'], zodiac: '鼠', month: '十一月', direction: '北', time: '23:00-01:00' },
    '丑': { element: '土', yinYang: '阴', hidden: ['己', '癸', '辛'], hiddenDesc: ['己土', '癸水', '辛金'], desc: '丑土为湿土，藏己土、癸水、辛金', characteristics: ['稳重', '踏实', '保守'], zodiac: '牛', month: '十二月', direction: '东北', time: '01:00-03:00' },
    '寅': { element: '木', yinYang: '阳', hidden: ['甲', '丙', '戊'], hiddenDesc: ['甲木', '丙火', '戊土'], desc: '寅木为阳木，藏甲木、丙火、戊土', characteristics: ['刚直', '有活力', '有领导力'], zodiac: '虎', month: '正月', direction: '东北', time: '03:00-05:00' },
    '卯': { element: '木', yinYang: '阴', hidden: ['乙'], hiddenDesc: ['乙木'], desc: '卯木为阴木，藏乙木', characteristics: ['温和', '善良', '有同情心'], zodiac: '兔', month: '二月', direction: '东', time: '05:00-07:00' },
    '辰': { element: '土', yinYang: '阳', hidden: ['戊', '乙', '癸'], hiddenDesc: ['戊土', '乙木', '癸水'], desc: '辰土为湿土，藏戊土、乙木、癸水', characteristics: ['稳重', '务实', '有耐心'], zodiac: '龙', month: '三月', direction: '东南', time: '07:00-09:00' },
    '巳': { element: '火', yinYang: '阴', hidden: ['丙', '庚', '戊'], hiddenDesc: ['丙火', '庚金', '戊土'], desc: '巳火为阴火，藏丙火、庚金、戊土', characteristics: ['热情', '聪明', '有洞察力'], zodiac: '蛇', month: '四月', direction: '东南', time: '09:00-11:00' },
    '午': { element: '火', yinYang: '阳', hidden: ['丁', '己'], hiddenDesc: ['丁火', '己土'], desc: '午火为阳火，藏丁火、己土', characteristics: ['热情', '开朗', '有活力'], zodiac: '马', month: '五月', direction: '南', time: '11:00-13:00' },
    '未': { element: '土', yinYang: '阴', hidden: ['己', '丁', '乙'], hiddenDesc: ['己土', '丁火', '乙木'], desc: '未土为燥土，藏己土、丁火、乙木', characteristics: ['温和', '包容', '有耐心'], zodiac: '羊', month: '六月', direction: '南', time: '13:00-15:00' },
    '申': { element: '金', yinYang: '阳', hidden: ['庚', '壬', '戊'], hiddenDesc: ['庚金', '壬水', '戊土'], desc: '申金为阳金，藏庚金、壬水、戊土', characteristics: ['刚毅', '果断', '有决断力'], zodiac: '猴', month: '七月', direction: '西南', time: '15:00-17:00' },
    '酉': { element: '金', yinYang: '阴', hidden: ['辛'], hiddenDesc: ['辛金'], desc: '酉金为阴金，藏辛金', characteristics: ['精致', '优雅', '有品味'], zodiac: '鸡', month: '八月', direction: '西', time: '17:00-19:00' },
    '戌': { element: '土', yinYang: '阳', hidden: ['戊', '辛', '丁'], hiddenDesc: ['戊土', '辛金', '丁火'], desc: '戌土为燥土，藏戊土、辛金、丁火', characteristics: ['忠诚', '稳重', '有责任感'], zodiac: '狗', month: '九月', direction: '西北', time: '19:00-21:00' },
    '亥': { element: '水', yinYang: '阴', hidden: ['壬', '甲'], hiddenDesc: ['壬水', '甲木'], desc: '亥水为阴水，藏壬水、甲木', characteristics: ['智慧', '深沉', '有洞察力'], zodiac: '猪', month: '十月', direction: '西北', time: '21:00-23:00' }
  } as Record<string, DiZhiInfo>,

  // 纳音五行
  NAYIN: {
    '甲子': '海中金', '乙丑': '海中金',
    '丙寅': '炉中火', '丁卯': '炉中火',
    '戊辰': '大林木', '己巳': '大林木',
    '庚午': '路旁土', '辛未': '路旁土',
    '壬申': '剑锋金', '癸酉': '剑锋金',
    '甲戌': '山头火', '乙亥': '山头火',
    '丙子': '涧下水', '丁丑': '涧下水',
    '戊寅': '城头土', '己卯': '城头土',
    '庚辰': '白蜡金', '辛巳': '白蜡金',
    '壬午': '杨柳木', '癸未': '杨柳木',
    '甲申': '泉中水', '乙酉': '泉中水',
    '丙戌': '屋上土', '丁亥': '屋上土',
    '戊子': '霹雳火', '己丑': '霹雳火',
    '庚寅': '松柏木', '辛卯': '松柏木',
    '壬辰': '长流水', '癸巳': '长流水',
    '甲午': '沙中金', '乙未': '沙中金',
    '丙申': '山下火', '丁酉': '山下火',
    '戊戌': '平地木', '己亥': '平地木',
    '庚子': '壁上土', '辛丑': '壁上土',
    '壬寅': '金箔金', '癸卯': '金箔金',
    '甲辰': '覆灯火', '乙巳': '覆灯火',
    '丙午': '天河水', '丁未': '天河水',
    '戊申': '大驿土', '己酉': '大驿土',
    '庚戌': '钗钏金', '辛亥': '钗钏金',
    '壬子': '桑柘木', '癸丑': '桑柘木',
    '甲寅': '大溪水', '乙卯': '大溪水',
    '丙辰': '沙中土', '丁巳': '沙中土',
    '戊午': '天上火', '己未': '天上火',
    '庚申': '石榴木', '辛酉': '石榴木',
    '壬戌': '大海水', '癸亥': '大海水'
  } as Record<string, string>,

  // 十神关系（以日干为我）
  SHISHEN: {
    // 阳干日主
    yang: {
      '甲': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '偏财', restrained: '正财', generateBy: '偏印', generatedBy: '正印' },
      '丙': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '偏财', restrained: '正财', generateBy: '偏印', generatedBy: '正印' },
      '戊': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '偏财', restrained: '正财', generateBy: '偏印', generatedBy: '正印' },
      '庚': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '偏财', restrained: '正财', generateBy: '偏印', generatedBy: '正印' },
      '壬': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '偏财', restrained: '正财', generateBy: '偏印', generatedBy: '正印' }
    },
    // 阴干日主
    yin: {
      '乙': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '正财', restrained: '偏财', generateBy: '正印', generatedBy: '偏印' },
      '丁': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '正财', restrained: '偏财', generateBy: '正印', generatedBy: '偏印' },
      '己': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '正财', restrained: '偏财', generateBy: '正印', generatedBy: '偏印' },
      '辛': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '正财', restrained: '偏财', generateBy: '正印', generatedBy: '偏印' },
      '癸': { same: '比肩', opposite: '劫财', generate: '食神', generated: '伤官', restrain: '正财', restrained: '偏财', generateBy: '正印', generatedBy: '偏印' }
    }
  } as { yang: Record<string, ShiShenRelation>; yin: Record<string, ShiShenRelation> },

  // 十神含义
  SHISHEN_DESC: {
    '比肩': { desc: '兄弟姐妹、朋友、同事', nature: '独立、自主、固执', detail: '比肩代表与自己同类的力量，象征兄弟姐妹、朋友、同事等平辈关系。性格上表现为独立自主、有主见，但也可能过于固执己见。', strengths: ['独立自主', '有主见', '有领导力'], weaknesses: ['固执己见', '不易妥协', '缺乏灵活性'], career: ['管理', '创业', '自由职业'], relationships: '与平辈关系融洽，但可能因固执产生冲突', wealth: '财运平稳，适合稳健投资' },
    '劫财': { desc: '竞争、争夺、破财', nature: '豪爽、冒险、冲动', detail: '劫财代表与自己争夺的力量，象征竞争、争夺、破财等。性格上表现为豪爽大方、喜欢冒险，但也容易冲动行事。', strengths: ['豪爽大方', '敢于冒险', '有魄力'], weaknesses: ['冲动行事', '容易破财', '缺乏规划'], career: ['销售', '投资', '创业'], relationships: '人际关系广泛，但需注意竞争关系', wealth: '财运起伏大，需谨慎理财' },
    '食神': { desc: '才华、享受、子女', nature: '温和、艺术、口福', detail: '食神代表我生之物，象征才华、享受、子女、口福等。性格上表现为温和善良、有艺术天赋，懂得享受生活。', strengths: ['温和善良', '有艺术天赋', '懂得享受'], weaknesses: ['过于安逸', '缺乏进取心', '容易满足'], career: ['艺术', '餐饮', '娱乐'], relationships: '家庭关系和谐，子女缘分好', wealth: '财运稳定，适合稳健发展' },
    '伤官': { desc: '才华、叛逆、创新', nature: '聪明、叛逆、口才', detail: '伤官代表我生之物但过于极端，象征才华、叛逆、创新等。性格上表现为聪明机智、有创造力，但也可能叛逆不羁、口无遮拦。', strengths: ['聪明机智', '有创造力', '口才出众'], weaknesses: ['叛逆不羁', '口无遮拦', '容易得罪人'], career: ['创意', '演讲', '技术'], relationships: '需注意言辞，避免冲突', wealth: '财运波动，需把握机会' },
    '偏财': { desc: '横财、父亲、情人', nature: '慷慨、善交际、风流', detail: '偏财代表我克之物但不完全占有，象征横财、父亲、情人等。性格上表现为慷慨大方、善于交际，但也可能风流多情。', strengths: ['慷慨大方', '善于交际', '把握机会'], weaknesses: ['风流多情', '财运不稳', '容易破财'], career: ['投资', '贸易', '娱乐'], relationships: '异性缘好，但需注意感情稳定', wealth: '横财机会多，但需谨慎' },
    '正财': { desc: '妻子、正当收入、财产', nature: '节俭、务实、保守', detail: '正财代表我克之物且完全占有，象征妻子、正当收入、财产等。性格上表现为节俭务实、稳重保守，重视物质生活。', strengths: ['节俭务实', '稳重可靠', '善于理财'], weaknesses: ['过于保守', '缺乏冒险精神', '过于计较'], career: ['商业', '金融', '财务'], relationships: '家庭观念强，婚姻稳定', wealth: '财运稳定，适合长期投资' },
    '偏印': { desc: '继母、偏门学问、孤独', nature: '敏感、孤僻、多疑', detail: '偏印代表生我之物但不完全付出，象征继母、偏门学问、孤独等。性格上表现为敏感多疑、喜欢独处，有特殊的兴趣爱好。', strengths: ['敏感多疑', '思维独特', '有特殊才能'], weaknesses: ['孤僻多疑', '不合群', '过于敏感'], career: ['艺术', '玄学', '研究'], relationships: '人际关系较少，但知己情深', wealth: '财运一般，靠特殊才能赚钱' },
    '正印': { desc: '母亲、学业、贵人', nature: '仁慈、好学、依赖', detail: '正印代表生我之物且完全付出，象征母亲、学业、贵人等。性格上表现为仁慈善良、好学上进，但也可能过于依赖他人。', strengths: ['仁慈善良', '好学上进', '有贵人运'], weaknesses: ['过于依赖', '缺乏独立性', '优柔寡断'], career: ['教育', '研究', '文化'], relationships: '人际关系和谐，容易得到帮助', wealth: '财运平稳，贵人相助' },
    '七杀': { desc: '偏夫、压力、小人', nature: '威严、果决、暴躁', detail: '七杀代表克我之物且力量强大，象征偏夫、压力、小人等。性格上表现为威严果断、有魄力，但也容易暴躁易怒。', strengths: ['威严果断', '有魄力', '敢于挑战'], weaknesses: ['暴躁易怒', '压力大', '容易树敌'], career: ['军人', '警察', '创业'], relationships: '需控制脾气，避免冲突', wealth: '财运波动大，高风险高回报' },
    '正官': { desc: '丈夫、上司、官职', nature: '正直、守法、稳重', detail: '正官代表克我之物且有节制，象征丈夫、上司、官职等。性格上表现为正直守法、稳重可靠，重视规则和秩序。', strengths: ['正直守法', '稳重可靠', '有责任感'], weaknesses: ['过于保守', '缺乏灵活性', '循规蹈矩'], career: ['公务员', '企业管理', '法律'], relationships: '人际关系稳定，受人尊重', wealth: '财运稳定，适合正当职业' }
  } as Record<string, ShiShenDesc>,

  // 格局类型
  GEJU: {
    '正官格': {
      desc: '日主身旺，正官有力',
      detail: '正官格是最理想的格局之一，代表为人正直、遵守规则、有责任感。命主适合从事公职、管理工作，能够获得社会认可和地位。性格稳重可靠，做事有条理。',
      career: '公务员、企业管理、法律、教育',
      personality: '正直、守法、稳重、有责任感',
      strengths: ['正直守法', '稳重可靠', '有责任感', '有条理'],
      weaknesses: ['过于保守', '缺乏灵活性', '循规蹈矩'],
      requirements: ['日主身旺', '正官有力', '无冲破'],
      famousExamples: ['包拯', '海瑞', '曾国藩']
    },
    '七杀格': {
      desc: '日主身旺，七杀有力',
      detail: '七杀格代表有魄力、有威严、敢于冒险。命主适合从事武职、创业、高风险高回报的行业。性格果断决绝，有领导才能，但也需要注意控制脾气。',
      career: '军人、警察、创业、投资',
      personality: '威严、果断、有魄力、敢于冒险',
      strengths: ['威严果断', '有魄力', '敢于挑战', '领导力强'],
      weaknesses: ['暴躁易怒', '压力大', '容易树敌'],
      requirements: ['日主身旺', '七杀有力', '有食神制杀'],
      famousExamples: ['岳飞', '戚继光', '林则徐']
    },
    '正印格': {
      desc: '日主身弱，正印有力',
      detail: '正印格代表有学识、有修养、心地善良。命主适合从事学术研究、教育、文化工作。性格温和仁慈，喜欢帮助他人，容易得到贵人相助。',
      career: '教育、研究、文化、慈善',
      personality: '仁慈、好学、有修养、善良',
      strengths: ['仁慈善良', '好学上进', '有贵人运', '有学识'],
      weaknesses: ['过于依赖', '缺乏独立性', '优柔寡断'],
      requirements: ['日主身弱', '正印有力', '无财坏印'],
      famousExamples: ['孔子', '孟子', '朱熹']
    },
    '偏印格': {
      desc: '日主身弱，偏印有力',
      detail: '偏印格代表有特殊才能、喜欢独处、思维独特。命主适合从事特殊技艺、玄学、艺术等工作。性格敏感多疑，有独特的思维方式。',
      career: '艺术、玄学、特殊技艺、研究',
      personality: '敏感、独特、孤僻、有才华',
      strengths: ['敏感多疑', '思维独特', '有特殊才能', '创造力强'],
      weaknesses: ['孤僻多疑', '不合群', '过于敏感'],
      requirements: ['日主身弱', '偏印有力', '无财破印'],
      famousExamples: ['李白', '杜甫', '苏轼']
    },
    '正财格': {
      desc: '日主身旺，正财有力',
      detail: '正财格代表财运稳定、重视物质、勤俭持家。命主适合从事商业、财务、金融等工作。性格务实稳重，善于理财，重视家庭生活。',
      career: '商业、金融、财务、实业',
      personality: '务实、勤俭、稳重、重视物质',
      strengths: ['节俭务实', '稳重可靠', '善于理财', '重视家庭'],
      weaknesses: ['过于保守', '缺乏冒险精神', '过于计较'],
      requirements: ['日主身旺', '正财有力', '无比劫夺财'],
      famousExamples: ['范蠡', '胡雪岩', '乔致庸']
    },
    '偏财格': {
      desc: '日主身旺，偏财有力',
      detail: '偏财格代表财运亨通、慷慨大方、善于交际。命主适合从事投资、贸易、娱乐等行业。性格豪爽开朗，善于把握机会，财运起伏较大。',
      career: '投资、贸易、娱乐、销售',
      personality: '豪爽、慷慨、善交际、冒险',
      strengths: ['慷慨大方', '善于交际', '把握机会', '豪爽开朗'],
      weaknesses: ['风流多情', '财运不稳', '容易破财'],
      requirements: ['日主身旺', '偏财有力', '无比劫夺财'],
      famousExamples: ['沈万三', '吕不韦', '陶朱公']
    },
    '食神格': {
      desc: '日主身旺，食神有力',
      detail: '食神格代表有才华、懂享受、性格温和。命主适合从事艺术、餐饮、娱乐等工作。性格温和善良，有艺术天赋，懂得享受生活。',
      career: '艺术、餐饮、娱乐、文化',
      personality: '温和、才华、享受、善良',
      strengths: ['温和善良', '有艺术天赋', '懂得享受', '才华横溢'],
      weaknesses: ['过于安逸', '缺乏进取心', '容易满足'],
      requirements: ['日主身旺', '食神有力', '无偏印夺食'],
      famousExamples: ['唐伯虎', '郑板桥', '齐白石']
    },
    '伤官格': {
      desc: '日主身旺，伤官有力',
      detail: '伤官格代表才华横溢、叛逆创新、口才出众。命主适合从事创意、演讲、技术等工作。性格聪明机智，有创造力，但也容易叛逆不羁。',
      career: '创意、技术、演讲、艺术',
      personality: '聪明、叛逆、创新、口才好',
      strengths: ['聪明机智', '有创造力', '口才出众', '才华横溢'],
      weaknesses: ['叛逆不羁', '口无遮拦', '容易得罪人'],
      requirements: ['日主身旺', '伤官有力', '有印星制伤'],
      famousExamples: ['苏轼', '辛弃疾', '陆游']
    },
    '建禄格': {
      desc: '日主得月令之气',
      detail: '建禄格代表根基稳固、身体健康、自力更生。命主通常身体强健，能够自力更生，不依赖他人。性格独立坚强，有奋斗精神。',
      career: '适合各种实业、技术工作',
      personality: '独立、坚强、健康、奋斗',
      strengths: ['独立坚强', '身体健康', '自力更生', '有奋斗精神'],
      weaknesses: ['过于固执', '不易接受帮助', '缺乏灵活性'],
      requirements: ['日主得月令之气', '身旺', '无冲破'],
      famousExamples: ['朱元璋', '刘邦', '李世民']
    },
    '月刃格': {
      desc: '日主得月令之气但过旺',
      detail: '月刃格代表性格刚强、有魄力、但容易冲动。命主需要注意控制脾气，避免与人发生冲突。适合从事武职、创业等需要魄力的工作。',
      career: '武职、创业、体育、军警',
      personality: '刚强、冲动、有魄力、果断',
      strengths: ['刚强果断', '有魄力', '敢于冒险', '领导力强'],
      weaknesses: ['冲动易怒', '容易与人冲突', '缺乏耐心'],
      requirements: ['日主得月令之气', '身旺', '有食神制杀'],
      famousExamples: ['项羽', '吕布', '张飞']
    }
  } as Record<string, GeJuInfo>,

  // 日主特性
  DAY_MASTER: {
    '甲': { desc: '甲木为参天大树，生于春季则枝叶繁茂，生于秋季则易受金克。甲木之人性格刚直，有领导力，为人正直，但可能过于固执。', element: '木', nature: '阳', characteristics: ['刚直', '有领导力', '正直', '固执'], suitableCareers: ['管理', '公务员', '企业家'], favorableElements: ['水', '木'], unfavorableElements: ['金', '土'], famousPeople: ['朱元璋', '刘邦', '李世民'] },
    '乙': { desc: '乙木为花草藤蔓，柔韧性强，善于攀附。乙木之人性格柔和，善于变通，适应能力强，但可能缺乏主见。', element: '木', nature: '阴', characteristics: ['柔和', '善于变通', '适应力强', '缺乏主见'], suitableCareers: ['艺术', '设计', '咨询'], favorableElements: ['水', '木'], unfavorableElements: ['金', '火'], famousPeople: ['李白', '杜甫', '苏轼'] },
    '丙': { desc: '丙火为太阳之火，光芒万丈，照亮万物。丙火之人性格热情开朗，光明磊落，有奉献精神，但可能过于急躁。', element: '火', nature: '阳', characteristics: ['热情开朗', '光明磊落', '有奉献精神', '急躁'], suitableCareers: ['领导', '演讲', '教育'], favorableElements: ['木', '火'], unfavorableElements: ['水', '土'], famousPeople: ['毛泽东', '周恩来', '邓小平'] },
    '丁': { desc: '丁火为灯烛之火，虽然光芒有限但持久稳定。丁火之人性格温和，心思细腻，有耐心，但可能缺乏魄力。', element: '火', nature: '阴', characteristics: ['温和', '心思细腻', '有耐心', '缺乏魄力'], suitableCareers: ['艺术', '文化', '研究'], favorableElements: ['木', '火'], unfavorableElements: ['水', '金'], famousPeople: ['孔子', '孟子', '朱熹'] },
    '戊': { desc: '戊土为城墙之土，厚重稳固，能够承载万物。戊土之人性格稳重可靠，诚实守信，有包容心，但可能过于保守。', element: '土', nature: '阳', characteristics: ['稳重可靠', '诚实守信', '有包容心', '保守'], suitableCareers: ['建筑', '金融', '管理'], favorableElements: ['火', '土'], unfavorableElements: ['木', '水'], famousPeople: ['范蠡', '胡雪岩', '乔致庸'] },
    '己': { desc: '己土为田园之土，肥沃滋养，养育万物。己土之人性格温和包容，善于照顾他人，但可能过于软弱。', element: '土', nature: '阴', characteristics: ['温和包容', '善于照顾他人', '软弱'], suitableCareers: ['教育', '医疗', '服务'], favorableElements: ['火', '土'], unfavorableElements: ['木', '金'], famousPeople: ['武则天', '慈禧太后', '孝庄太后'] },
    '庚': { desc: '庚金为刀剑之金，锋利坚硬，能够切割万物。庚金之人性格刚毅果断，有决断力，但可能过于冷酷。', element: '金', nature: '阳', characteristics: ['刚毅果断', '有决断力', '冷酷'], suitableCareers: ['军警', '法律', '管理'], favorableElements: ['土', '金'], unfavorableElements: ['火', '木'], famousPeople: ['岳飞', '戚继光', '林则徐'] },
    '辛': { desc: '辛金为首饰之金，精致美丽，价值珍贵。辛金之人性格精致，追求完美，有艺术品味，但可能过于计较。', element: '金', nature: '阴', characteristics: ['精致', '追求完美', '有艺术品味', '计较'], suitableCareers: ['艺术', '设计', '珠宝'], favorableElements: ['土', '金'], unfavorableElements: ['火', '水'], famousPeople: ['唐伯虎', '郑板桥', '齐白石'] },
    '壬': { desc: '壬水为江河之水，奔流不息，浩瀚无垠。壬水之人性格奔放不羁，智慧深邃，善于思考，但可能过于随性。', element: '水', nature: '阳', characteristics: ['奔放不羁', '智慧深邃', '善于思考', '随性'], suitableCareers: ['投资', '贸易', '研究'], favorableElements: ['金', '水'], unfavorableElements: ['土', '木'], famousPeople: ['沈万三', '吕不韦', '陶朱公'] },
    '癸': { desc: '癸水为雨露之水，滋润万物，细水长流。癸水之人性格含蓄内敛，善于思考，有智慧，但可能过于消极。', element: '水', nature: '阴', characteristics: ['含蓄内敛', '善于思考', '有智慧', '消极'], suitableCareers: ['研究', '文化', '教育'], favorableElements: ['金', '水'], unfavorableElements: ['土', '火'], famousPeople: ['苏轼', '辛弃疾', '陆游'] }
  } as Record<string, DayMasterInfo>,

  // 生肖
  ZODIAC: ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'],

  // 节气
  SOLAR_TERMS: [
    '小寒', '大寒', '立春', '雨水', '惊蛰', '春分',
    '清明', '谷雨', '立夏', '小满', '芒种', '夏至',
    '小暑', '大暑', '立秋', '处暑', '白露', '秋分',
    '寒露', '霜降', '立冬', '小雪', '大雪', '冬至'
  ]
};

// 获取纳音
export function getNayin(ganZhi: string): string {
  return KNOWLEDGE_BASE.NAYIN[ganZhi] || '未知';
}

// 获取十神
export function getShishen(dayMaster: string, targetStem: string): string {
  const dayInfo = KNOWLEDGE_BASE.TIANGAN[dayMaster];
  if (!dayInfo) return '未知';
  
  const type = dayInfo.yinYang === '阳' ? 'yang' : 'yin';
  const relations = KNOWLEDGE_BASE.SHISHEN[type][dayMaster];
  
  if (!relations) return '未知';
  
  const targetInfo = KNOWLEDGE_BASE.TIANGAN[targetStem];
  if (!targetInfo) return '未知';
  
  // 确定关系
  const dayElement = dayInfo.element;
  const targetElement = targetInfo.element;
  const dayYY = dayInfo.yinYang;
  const targetYY = targetInfo.yinYang;
  
  // 同我
  if (dayElement === targetElement) {
    if (dayYY === targetYY) return relations.same; // 比肩
    return relations.opposite; // 劫财
  }
  
  // 我生
  const generateMap: Record<string, string> = { '木': '火', '火': '土', '土': '金', '金': '水', '水': '木' };
  if (generateMap[dayElement] === targetElement) {
    if (dayYY === targetYY) return relations.generated; // 伤官
    return relations.generate; // 食神
  }
  
  // 生我
  const generatedByMap: Record<string, string> = { '木': '水', '火': '木', '土': '火', '金': '土', '水': '金' };
  if (generatedByMap[dayElement] === targetElement) {
    if (dayYY === targetYY) return relations.generatedBy; // 正印
    return relations.generateBy; // 偏印
  }
  
  // 我克
  const restrainMap: Record<string, string> = { '木': '土', '火': '金', '土': '水', '金': '木', '水': '火' };
  if (restrainMap[dayElement] === targetElement) {
    if (dayYY === targetYY) return relations.restrained; // 正财
    return relations.restrain; // 偏财
  }
  
  // 克我
  const restrainedByMap: Record<string, string> = { '木': '金', '火': '水', '土': '木', '金': '火', '水': '土' };
  if (restrainedByMap[dayElement] === targetElement) {
    if (dayYY === targetYY) return '正官';
    return '七杀';
  }
  
  return '未知';
}

// 获取格局
export function getGeju(bazi: { year: string; month: string; day: string; hour: string }): string {
  const { month, day } = bazi;
  const dayStem = day.charAt(0);
  const monthBranch = month.charAt(1);
  
  // 根据月支藏干判断
  const monthHidden = KNOWLEDGE_BASE.DIZHI[monthBranch].hidden;
  const monthQi = monthHidden[0]; // 中气
  
  // 根据月支藏干判断
  const shishen = getShishen(dayStem, monthQi);
  
  if (shishen === '正官') return '正官格';
  if (shishen === '七杀') return '七杀格';
  if (shishen === '正印') return '正印格';
  if (shishen === '偏印') return '偏印格';
  if (shishen === '正财') return '正财格';
  if (shishen === '偏财') return '偏财格';
  if (shishen === '食神') return '食神格';
  if (shishen === '伤官') return '伤官格';
  
  // 检查建禄格
  const dayElement = KNOWLEDGE_BASE.TIANGAN[dayStem].element;
  const monthElement = KNOWLEDGE_BASE.DIZHI[monthBranch].element;
  if (dayElement === monthElement) {
    return '建禄格';
  }
  
  return '普通格';
}

// 导出扩展知识库
export * from './knowledgeBaseExtended';
