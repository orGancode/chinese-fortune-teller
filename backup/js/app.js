// 主应用逻辑
document.addEventListener('DOMContentLoaded', function() {
    // 初始化计算器
    const calculator = new BaziCalculator();
    
    // 获取DOM元素
    const calculateBtn = document.getElementById('calculateBtn');
    const loadingDiv = document.getElementById('loading');
    const resultSection = document.getElementById('resultSection');
    
    // 基本信息元素
    const solarDateEl = document.getElementById('solarDate');
    const lunarDateEl = document.getElementById('lunarDate');
    const zodiacEl = document.getElementById('zodiac');
    const solarTermEl = document.getElementById('solarTerm');
    
    // 八字排盘元素
    const yearStemEl = document.getElementById('yearStem');
    const monthStemEl = document.getElementById('monthStem');
    const dayStemEl = document.getElementById('dayStem');
    const hourStemEl = document.getElementById('hourStem');
    const yearBranchEl = document.getElementById('yearBranch');
    const monthBranchEl = document.getElementById('monthBranch');
    const dayBranchEl = document.getElementById('dayBranch');
    const hourBranchEl = document.getElementById('hourBranch');
    const yearHiddenEl = document.getElementById('yearHidden');
    const monthHiddenEl = document.getElementById('monthHidden');
    const dayHiddenEl = document.getElementById('dayHidden');
    const hourHiddenEl = document.getElementById('hourHidden');
    const yearShishenEl = document.getElementById('yearShishen');
    const monthShishenEl = document.getElementById('monthShishen');
    const hourShishenEl = document.getElementById('hourShishen');
    
    // 日主信息元素
    const dayMasterNameEl = document.getElementById('dayMasterName');
    const dayMasterElementEl = document.getElementById('dayMasterElement');
    const dayMasterDescEl = document.getElementById('dayMasterDesc');
    
    // 分析结果元素
    const wuxingChartEl = document.getElementById('wuxingChart');
    const wuxingSummaryEl = document.getElementById('wuxingSummary');
    const shishenAnalysisEl = document.getElementById('shishenAnalysis');
    const gejuTypeEl = document.getElementById('gejuType');
    const gejuDescEl = document.getElementById('gejuDesc');
    const nayinListEl = document.getElementById('nayinList');
    const dayunBodyEl = document.getElementById('dayunBody');
    const liunianListEl = document.getElementById('liunianList');
    
    // 开始排盘按钮点击事件
    calculateBtn.addEventListener('click', function() {
        const birthDate = document.getElementById('birthDate').value;
        const birthTime = document.getElementById('birthTime').value;
        const longitude = parseFloat(document.getElementById('birthLocation').value);
        const gender = parseInt(document.querySelector('input[name="gender"]:checked').value);
        
        if (!birthDate || !birthTime) {
            alert('请输入完整的出生日期和时间');
            return;
        }
        
        // 显示加载状态
        loadingDiv.classList.remove('hidden');
        resultSection.classList.add('hidden');
        
        // 使用setTimeout让UI有时间更新
        setTimeout(() => {
            try {
                performBaziCalculation(birthDate, birthTime, longitude, gender);
                loadingDiv.classList.add('hidden');
                resultSection.classList.remove('hidden');
                
                // 滚动到结果区域
                resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
            } catch (error) {
                console.error('计算错误:', error);
                alert('计算过程中出现错误，请检查输入数据');
                loadingDiv.classList.add('hidden');
            }
        }, 500);
    });
    
    // 执行八字计算
    function performBaziCalculation(birthDate, birthTime, longitude, gender) {
        // 1. 计算八字
        const bazi = calculator.calculateBazi(birthDate, birthTime, longitude);
        const dayMaster = bazi.day.charAt(0);
        
        // 2. 获取农历信息（使用lunisolar库）
        const [year, month, day] = birthDate.split('-').map(Number);
        const l = lunisolar(new Date(year, month - 1, day));
        
        // 3. 更新基本信息
        solarDateEl.textContent = bazi.solarDate + ' ' + bazi.time;
        lunarDateEl.textContent = l.format('lY年 lM lD');
        zodiacEl.textContent = l.zodiac;
        solarTermEl.textContent = l.solarTerm || '无';
        
        // 4. 更新八字排盘
        updatePaipan(bazi, dayMaster);
        
        // 5. 更新日主信息
        updateDayMaster(dayMaster);
        
        // 6. 更新五行分析
        updateWuxingAnalysis(bazi, dayMaster);
        
        // 7. 更新十神分析
        updateShishenAnalysis(bazi, dayMaster);
        
        // 8. 更新格局分析
        updateGejuAnalysis(bazi, dayMaster);
        
        // 9. 更新纳音
        updateNayin(bazi);
        
        // 10. 更新大运
        updateDaYun(bazi, gender, dayMaster);
        
        // 11. 更新流年
        updateLiuNian(bazi, dayMaster);
    }
    
    // 更新排盘显示
    function updatePaipan(bazi, dayMaster) {
        yearStemEl.textContent = bazi.year.charAt(0);
        monthStemEl.textContent = bazi.month.charAt(0);
        dayStemEl.textContent = bazi.day.charAt(0);
        hourStemEl.textContent = bazi.hour.charAt(0);
        
        yearBranchEl.textContent = bazi.year.charAt(1);
        monthBranchEl.textContent = bazi.month.charAt(1);
        dayBranchEl.textContent = bazi.day.charAt(1);
        hourBranchEl.textContent = bazi.hour.charAt(1);
        
        // 藏干
        yearHiddenEl.textContent = calculator.getCangGan(bazi.year.charAt(1)).join('<br>');
        monthHiddenEl.textContent = calculator.getCangGan(bazi.month.charAt(1)).join('<br>');
        dayHiddenEl.textContent = calculator.getCangGan(bazi.day.charAt(1)).join('<br>');
        hourHiddenEl.textContent = calculator.getCangGan(bazi.hour.charAt(1)).join('<br>');
        
        // 十神
        yearShishenEl.textContent = getShishen(dayMaster, bazi.year.charAt(0));
        monthShishenEl.textContent = getShishen(dayMaster, bazi.month.charAt(0));
        hourShishenEl.textContent = getShishen(dayMaster, bazi.hour.charAt(0));
        
        // 应用五行颜色
        applyElementColors();
    }
    
    // 应用五行颜色
    function applyElementColors() {
        const elementClasses = {
            '甲': 'stem-jia', '乙': 'stem-yi',
            '丙': 'stem-bing', '丁': 'stem-ding',
            '戊': 'stem-wu', '己': 'stem-ji',
            '庚': 'stem-geng', '辛': 'stem-xin',
            '壬': 'stem-ren', '癸': 'stem-gui',
            '子': 'branch-zi', '丑': 'branch-chou',
            '寅': 'branch-yin', '卯': 'branch-mao',
            '辰': 'branch-chen', '巳': 'branch-si',
            '午': 'branch-wu', '未': 'branch-wei',
            '申': 'branch-shen', '酉': 'branch-you',
            '戌': 'branch-xu', '亥': 'branch-hai'
        };
        
        document.querySelectorAll('.tiangan-row td:not(.row-label), .dizhi-row td:not(.row-label)').forEach(cell => {
            const text = cell.textContent.trim();
            if (elementClasses[text]) {
                cell.className = elementClasses[text];
            }
        });
    }
    
    // 更新日主信息
    function updateDayMaster(dayMaster) {
        const dayMasterInfo = KNOWLEDGE_BASE.DAY_MASTER[dayMaster];
        dayMasterNameEl.textContent = dayMaster;
        dayMasterElementEl.textContent = dayMasterInfo.element + dayMasterInfo.nature + '日主';
        dayMasterDescEl.textContent = dayMasterInfo.desc;
    }
    
    // 更新五行分析
    function updateWuxingAnalysis(bazi, dayMaster) {
        const wuxingCount = calculator.calculateWuxing(bazi);
        const dayElement = KNOWLEDGE_BASE.TIANGAN[dayMaster].element;
        
        // 五行图表
        wuxingChartEl.innerHTML = '';
        const wuxingElements = ['木', '火', '土', '金', '水'];
        const wuxingColors = {
            '木': 'wuxing-wood',
            '火': 'wuxing-fire',
            '土': 'wuxing-earth',
            '金': 'wuxing-metal',
            '水': 'wuxing-water'
        };
        
        wuxingElements.forEach(element => {
            const item = document.createElement('div');
            item.className = 'wuxing-item';
            item.innerHTML = `
                <div class="wuxing-icon ${wuxingColors[element]}">${element}</div>
                <div class="wuxing-name">${element}</div>
                <div class="wuxing-count">${wuxingCount[element]}个</div>
            `;
            wuxingChartEl.appendChild(item);
        });
        
        // 分析强弱
        let summary = `日主为${dayElement}，`;
        const dayCount = wuxingCount[dayElement];
        
        if (dayCount >= 3) {
            summary += '五行中' + dayElement + '较旺，属于身旺之命。';
        } else if (dayCount <= 1) {
            summary += '五行中' + dayElement + '较弱，属于身弱之命。';
        } else {
            summary += '五行中' + dayElement + '适中，属于中和之命。';
        }
        
        // 找喜用神
        const supportElements = getSupportElements(dayElement);
        summary += `喜用神为${supportElements.join('、')}，对运势有助益。`;
        
        wuxingSummaryEl.textContent = summary;
    }
    
    // 获取喜用神
    function getSupportElements(element) {
        const relations = {
            '木': ['水', '木'],
            '火': ['木', '火'],
            '土': ['火', '土'],
            '金': ['土', '金'],
            '水': ['金', '水']
        };
        return relations[element] || [element];
    }
    
    // 更新十神分析
    function updateShishenAnalysis(bazi, dayMaster) {
        const shishenList = [];
        
        // 四柱十神
        ['year', 'month', 'hour'].forEach(pillar => {
            const gan = bazi[pillar].charAt(0);
            const zhi = bazi[pillar].charAt(1);
            const cangGan = calculator.getCangGan(zhi);
            
            const shishenGan = getShishen(dayMaster, gan);
            shishenList.push({
                name: shishenGan,
                source: `${pillar === 'year' ? '年' : pillar === 'month' ? '月' : '时'}干`
            });
            
            cangGan.forEach(cg => {
                const shishenCang = getShishen(dayMaster, cg);
                shishenList.push({
                    name: shishenCang,
                    source: `${pillar === 'year' ? '年' : pillar === 'month' ? '月' : '时'}支藏${cg}`
                });
            });
        });
        
        // 统计十神数量
        const shishenCount = {};
        shishenList.forEach(item => {
            shishenCount[item.name] = (shishenCount[item.name] || 0) + 1;
        });
        
        // 显示主要十神
        shishenAnalysisEl.innerHTML = '';
        const importantShishen = Object.keys(shishenCount).sort((a, b) => shishenCount[b] - shishenCount[a]).slice(0, 6);
        
        importantShishen.forEach(shishen => {
            const desc = KNOWLEDGE_BASE.SHISHEN_DESC[shishen];
            const item = document.createElement('div');
            item.className = 'shishen-item';
            item.innerHTML = `
                <div class="shishen-name">${shishen}（${shishenCount[shishen]}个）</div>
                <div class="shishen-desc">${desc ? desc.desc : ''}</div>
            `;
            shishenAnalysisEl.appendChild(item);
        });
    }
    
    // 更新格局分析
    function updateGejuAnalysis(bazi, dayMaster) {
        const gejuType = getGeju(bazi);
        const gejuInfo = KNOWLEDGE_BASE.GEJU[gejuType];
        
        gejuTypeEl.textContent = gejuType;
        gejuDescEl.textContent = gejuInfo ? gejuInfo.detail : '';
    }
    
    // 更新纳音
    function updateNayin(bazi) {
        nayinListEl.innerHTML = '';
        
        const pillars = [
            { name: '年柱', value: bazi.year },
            { name: '月柱', value: bazi.month },
            { name: '日柱', value: bazi.day },
            { name: '时柱', value: bazi.hour }
        ];
        
        pillars.forEach(pillar => {
            const nayin = getNayin(pillar.value);
            const item = document.createElement('div');
            item.className = 'nayin-item';
            item.innerHTML = `
                <div class="nayin-pillar">${pillar.name}</div>
                <div class="nayin-value">${nayin}</div>
            `;
            nayinListEl.appendChild(item);
        });
    }
    
    // 更新大运
    function updateDaYun(bazi, gender, dayMaster) {
        const daYun = calculator.calculateDaYun(bazi, gender);
        dayunBodyEl.innerHTML = '';
        
        daYun.forEach((dy, index) => {
            const row = document.createElement('tr');
            if (index === 0) row.className = 'dayun-current';
            
            const shishen = getShishen(dayMaster, dy.ganZhi.charAt(0));
            const nayin = getNayin(dy.ganZhi);
            
            row.innerHTML = `
                <td>第${dy.order}步</td>
                <td>${dy.startAge}-${dy.endAge}岁</td>
                <td>${dy.ganZhi.charAt(0)}</td>
                <td>${dy.ganZhi.charAt(1)}</td>
                <td>${shishen}</td>
                <td>${nayin}</td>
            `;
            dayunBodyEl.appendChild(row);
        });
    }
    
    // 更新流年
    function updateLiuNian(bazi, dayMaster) {
        const currentYear = new Date().getFullYear();
        const liuNian = calculator.calculateLiuNian(bazi, currentYear - 2, 7);
        liunianListEl.innerHTML = '';
        
        liuNian.forEach(ln => {
            const shishen = getShishen(dayMaster, ln.ganZhi.charAt(0));
            const isCurrent = ln.year === currentYear;
            
            const item = document.createElement('div');
            item.className = 'liunian-item';
            if (isCurrent) item.style.backgroundColor = 'rgba(231, 76, 60, 0.1)';
            
            item.innerHTML = `
                <div class="liunian-year">${ln.year}年${isCurrent ? '（本年）' : ''}</div>
                <div class="liunian-bazi">${ln.ganZhi}</div>
                <div class="liunian-shishen">${shishen}</div>
            `;
            liunianListEl.appendChild(item);
        });
    }
});
