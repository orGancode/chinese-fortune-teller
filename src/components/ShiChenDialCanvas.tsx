import { useEffect, useRef, useState } from "react";

// 天干地支数组
const TIANGAN = ["甲", "乙", "丙", "丁", "戊", "己", "庚", "辛", "壬", "癸"];
const DIZHI = ["子", "丑", "寅", "卯", "辰", "巳", "午", "未", "申", "酉", "戌", "亥"];

// 计算日柱
function getDayPillar(date: Date): string {
  const baseDate = new Date(1900, 0, 31); // 1900年1月31日是甲戌日
  const diffTime = date.getTime() - baseDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const ganIndex = (diffDays % 10 + 10) % 10;
  const zhiIndex = (diffDays % 12 + 12) % 12;
  return TIANGAN[ganIndex] + DIZHI[zhiIndex];
}

// 计算时柱
function getHourPillar(date: Date): string {
  const dayPillar = getDayPillar(date);
  const hour = date.getHours();
  
  // 计算时辰索引
  let zhiIndex: number;
  if (hour >= 23 || hour < 1) zhiIndex = 0;  // 子
  else if (hour >= 1 && hour < 3) zhiIndex = 1;  // 丑
  else if (hour >= 3 && hour < 5) zhiIndex = 2;  // 寅
  else if (hour >= 5 && hour < 7) zhiIndex = 3;  // 卯
  else if (hour >= 7 && hour < 9) zhiIndex = 4;  // 辰
  else if (hour >= 9 && hour < 11) zhiIndex = 5; // 巳
  else if (hour >= 11 && hour < 13) zhiIndex = 6; // 午
  else if (hour >= 13 && hour < 15) zhiIndex = 7; // 未
  else if (hour >= 15 && hour < 17) zhiIndex = 8; // 申
  else if (hour >= 17 && hour < 19) zhiIndex = 9; // 酉
  else if (hour >= 19 && hour < 21) zhiIndex = 10; // 戌
  else zhiIndex = 11; // 亥
  
  // 五鼠遁：根据日干推算时干
  const dayGan = dayPillar.charAt(0);
  const dayGanIndex = TIANGAN.indexOf(dayGan);
  
  let startGan: number;
  if (dayGanIndex === 0 || dayGanIndex === 5) startGan = 0; // 甲己->甲
  else if (dayGanIndex === 1 || dayGanIndex === 6) startGan = 2; // 乙庚->丙
  else if (dayGanIndex === 2 || dayGanIndex === 7) startGan = 4; // 丙辛->戊
  else if (dayGanIndex === 3 || dayGanIndex === 8) startGan = 6; // 丁壬->庚
  else startGan = 8; // 戊癸->壬
  
  const ganIndex = (startGan + zhiIndex) % 10;
  return TIANGAN[ganIndex] + DIZHI[zhiIndex];
}

// 十二时辰数据（传统划分）
const SHI_CHEN_DATA = [
  { name: "子", time: "23-1", zodiac: "鼠", startHour: 23 },
  { name: "丑", time: "1-3", zodiac: "牛", startHour: 1 },
  { name: "寅", time: "3-5", zodiac: "虎", startHour: 3 },
  { name: "卯", time: "5-7", zodiac: "兔", startHour: 5 },
  { name: "辰", time: "7-9", zodiac: "龙", startHour: 7 },
  { name: "巳", time: "9-11", zodiac: "蛇", startHour: 9 },
  { name: "午", time: "11-13", zodiac: "马", startHour: 11 },
  { name: "未", time: "13-15", zodiac: "羊", startHour: 13 },
  { name: "申", time: "15-17", zodiac: "猴", startHour: 15 },
  { name: "酉", time: "17-19", zodiac: "鸡", startHour: 17 },
  { name: "戌", time: "19-21", zodiac: "狗", startHour: 19 },
  { name: "亥", time: "21-23", zodiac: "猪", startHour: 21 },
];

// 八卦数据（从顶部开始顺时针）：乾、兑、离、震、巽、坎、艮、坤
const BA_GUA_DATA = [
  { name: "乾", yao: [1, 1, 1] },
  { name: "兑", yao: [0, 1, 1] },
  { name: "离", yao: [1, 0, 1] },
  { name: "震", yao: [0, 0, 1] },
  { name: "巽", yao: [1, 1, 0] },
  { name: "坎", yao: [0, 1, 0] },
  { name: "艮", yao: [1, 0, 0] },
  { name: "坤", yao: [0, 0, 0] },
];



interface ShiChenDialCanvasProps {
  size?: number;
}

export function ShiChenDialCanvas({ size = 220 }: ShiChenDialCanvasProps) {
  const outerCanvasRef = useRef<HTMLCanvasElement>(null);
  const innerCanvasRef = useRef<HTMLCanvasElement>(null);
  const pointerCanvasRef = useRef<HTMLCanvasElement>(null);
  const [currentShiChen, setCurrentShiChen] = useState(SHI_CHEN_DATA[0]);
  const [hourPillar, setHourPillar] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const lastShiChenIndexRef = useRef<number>(-1);
  const outerIntervalRef = useRef<number | null>(null);

  useEffect(() => {
    const outerCanvas = outerCanvasRef.current;
    const innerCanvas = innerCanvasRef.current;
    const pointerCanvas = pointerCanvasRef.current;
    if (!outerCanvas || !innerCanvas || !pointerCanvas) return;

    const ctx = outerCanvas.getContext("2d", { alpha: true });
    const innerCtx = innerCanvas.getContext("2d", { alpha: true });
    const pointerCtx = pointerCanvas.getContext("2d", { alpha: true });
    if (!ctx || !innerCtx || !pointerCtx) return;

    // 设置canvas实际尺寸（高清屏适配）
    const dpr = window.devicePixelRatio || 1;
    const effectiveDpr = dpr;
    
    outerCanvas.width = size * effectiveDpr;
    outerCanvas.height = size * effectiveDpr;
    outerCanvas.style.width = `${size}px`;
    outerCanvas.style.height = `${size}px`;
    ctx.scale(effectiveDpr, effectiveDpr);

    innerCanvas.width = size * effectiveDpr;
    innerCanvas.height = size * effectiveDpr;
    innerCanvas.style.width = `${size}px`;
    innerCanvas.style.height = `${size}px`;
    innerCtx.scale(effectiveDpr, effectiveDpr);

    pointerCanvas.width = size * effectiveDpr;
    pointerCanvas.height = size * effectiveDpr;
    pointerCanvas.style.width = `${size}px`;
    pointerCanvas.style.height = `${size}px`;
    pointerCtx.scale(effectiveDpr, effectiveDpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.46;
    const innerRadius = size * 0.20;

    // 绘制大表盘（时辰盘）- 静态版本
    const drawOuterDialStatic = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();

      // 计算当前时辰索引
      const currentIndex = Math.floor(((hours + 1) % 24) / 2);
      
      // 更新状态
      lastShiChenIndexRef.current = currentIndex;
      setCurrentShiChen(SHI_CHEN_DATA[currentIndex]);
      setHourPillar(getHourPillar(now));

      // 计算进入当前时辰的分钟数
      const currentShiChenStartHour = SHI_CHEN_DATA[currentIndex].startHour;
      let minutesIntoShiChen;
      
      if (currentIndex === 0) {
        if (hours >= 23) {
          minutesIntoShiChen = Math.floor((hours - 23) * 60 + minutes);
        } else {
          minutesIntoShiChen = Math.floor(60 + minutes);
        }
      } else {
        minutesIntoShiChen = Math.floor((hours - currentShiChenStartHour) * 60 + minutes);
      }
      
      // 阶梯式旋转：每4分钟转1度
      const degreesInShiChen = Math.floor(minutesIntoShiChen / 4);
      const textAngle = currentIndex * 30 + 15;
      const rotationDegrees = -(textAngle + degreesInShiChen) + 15;

      // 清空画布
      ctx.clearRect(0, 0, size, size);

      // 绘制外圈装饰环
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 3, 0, Math.PI * 2);
      const outerGradient = ctx.createLinearGradient(centerX - outerRadius, centerY - outerRadius, centerX + outerRadius, centerY + outerRadius);
      outerGradient.addColorStop(0, "#8B4513");
      outerGradient.addColorStop(0.5, "#A0522D");
      outerGradient.addColorStop(1, "#8B4513");
      ctx.fillStyle = outerGradient;
      ctx.fill();

      // 绘制旋转的时辰盘
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((rotationDegrees * Math.PI) / 180);
      ctx.translate(-centerX, -centerY);

      // 表盘底色
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, 0, Math.PI * 2);
      const dialBgGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, outerRadius);
      dialBgGradient.addColorStop(0, "#FFFEF9");
      dialBgGradient.addColorStop(1, "#FAF8F5");
      ctx.fillStyle = dialBgGradient;
      ctx.fill();
      
      // 绘制八卦图形
      const baGuaRadius = innerRadius + 15;
      const yaoLength = 20;
      const yaoThickness = 2;
      const yaoGap = 3;
      
      for (let i = 0; i < 8; i++) {
        const baGua = BA_GUA_DATA[i];
        const angle = (i * 45 - 90) * (Math.PI / 180);
        const gx = centerX + Math.cos(angle) * baGuaRadius;
        const gy = centerY + Math.sin(angle) * baGuaRadius;
        const tangentAngle = angle + Math.PI / 2;
        
        for (let j = 0; j < 3; j++) {
          const isYang = baGua.yao[j] === 1;
          const rOffset = (j - 1) * (yaoThickness + yaoGap);
          const cx = gx + Math.cos(angle) * rOffset;
          const cy = gy + Math.sin(angle) * rOffset;
          
          if (isYang) {
            ctx.beginPath();
            ctx.moveTo(cx - Math.cos(tangentAngle) * yaoLength/2, cy - Math.sin(tangentAngle) * yaoLength/2);
            ctx.lineTo(cx + Math.cos(tangentAngle) * yaoLength/2, cy + Math.sin(tangentAngle) * yaoLength/2);
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = yaoThickness;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = "round";
            ctx.stroke();
          } else {
            const gap = 4;
            ctx.beginPath();
            ctx.moveTo(cx - Math.cos(tangentAngle) * (yaoLength/2), cy - Math.sin(tangentAngle) * (yaoLength/2));
            ctx.lineTo(cx - Math.cos(tangentAngle) * (gap/2), cy - Math.sin(tangentAngle) * (gap/2));
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = yaoThickness;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = "round";
            ctx.stroke();
            
            ctx.beginPath();
            ctx.moveTo(cx + Math.cos(tangentAngle) * (gap/2), cy + Math.sin(tangentAngle) * (gap/2));
            ctx.lineTo(cx + Math.cos(tangentAngle) * (yaoLength/2), cy + Math.sin(tangentAngle) * (yaoLength/2));
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = yaoThickness;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // 绘制12条主刻度线
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 - 90) * (Math.PI / 180);
        const x1 = centerX + Math.cos(angle) * outerRadius;
        const y1 = centerY + Math.sin(angle) * outerRadius;
        const x2 = centerX + Math.cos(angle) * (outerRadius - 10);
        const y2 = centerY + Math.sin(angle) * (outerRadius - 10);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 1.5;
        ctx.stroke();
      }

      // 绘制12条中间短刻度线
      for (let i = 0; i < 12; i++) {
        const angle = (i * 30 + 15 - 90) * (Math.PI / 180);
        const x1 = centerX + Math.cos(angle) * outerRadius;
        const y1 = centerY + Math.sin(angle) * outerRadius;
        const x2 = centerX + Math.cos(angle) * (outerRadius - 6);
        const y2 = centerY + Math.sin(angle) * (outerRadius - 6);
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = "#8B4513";
        ctx.lineWidth = 2;
        ctx.globalAlpha = 0.6;
        ctx.stroke();
      }
      ctx.globalAlpha = 1;

      // 绘制时辰文字
      // ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
      ctx.font = "normal 15px PingFang SC, Microsoft YaHei, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < 12; i++) {
        const shi = SHI_CHEN_DATA[i];
        const angle = (i * 30 + 15 - 90) * (Math.PI / 180);
        const textRadius = outerRadius - 18;
        const x = centerX + Math.cos(angle) * textRadius;
        const y = centerY + Math.sin(angle) * textRadius;

        ctx.save();
        ctx.translate(x, y);
        const textRotation = (i * 30 + 15);
        ctx.rotate((textRotation * Math.PI) / 180);
        const isCurrent = i === currentIndex;
        ctx.fillStyle = isCurrent ? "#C41E3A" : "#5D4037";
        ctx.fillText(shi.name, 0, 0);
        ctx.restore();
      }

      ctx.restore();

      // 外圈边框
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 2;
      ctx.stroke();
    };

    // 绘制小表盘（秒盘）- 静态版本（CSS动画控制旋转）
    const drawInnerDialStatic = () => {
      // 清空画布
      innerCtx.clearRect(0, 0, size, size);

      // 绘制旋转的小表盘（太极图）
      innerCtx.save();
      innerCtx.translate(centerX, centerY);
      // 去掉 JS 旋转逻辑，由 CSS 动画控制
      // const totalSeconds = seconds + milliseconds / 1000;
      // const secondsRotation = (totalSeconds / 60) * 360;
      // innerCtx.rotate((secondsRotation * Math.PI) / 180);

      const r = innerRadius;

      // 白色右半圆（阳鱼）
      innerCtx.beginPath();
      innerCtx.arc(0, 0, r, 0, Math.PI, true);
      innerCtx.fillStyle = "#FAF8F5";
      innerCtx.fill();

      // 黑色左半圆（阴鱼）
      innerCtx.beginPath();
      innerCtx.arc(0, 0, r, 0, Math.PI, false);
      innerCtx.fillStyle = "#2C1810";
      innerCtx.fill();

      // 黑色小圆（黑眼）
      innerCtx.beginPath();
      innerCtx.arc(r/2, 0, r/2, 0, Math.PI*2);
      innerCtx.fillStyle = "#FAF8F5";
      innerCtx.fill();

      // 白色小圆（白眼）
      innerCtx.beginPath();
      innerCtx.arc(-r/2, 0, r/2, 0, Math.PI*2);
      innerCtx.fillStyle = "#2C1810";
      innerCtx.fill();
      
      // 白色鱼眼（阴中之阳）
      innerCtx.beginPath();
      innerCtx.arc(r/2, 0, r/6, 0, Math.PI*2);
      innerCtx.fillStyle = "#2C1810";
      innerCtx.fill();

      // 黑色鱼眼（阳中之阴）
      innerCtx.beginPath();
      innerCtx.arc(-r/2, 0, r/6, 0, Math.PI*2);
      innerCtx.fillStyle = "#FAF8F5";
      innerCtx.fill();
      
      innerCtx.restore();
      
      // 外圈边框
      innerCtx.beginPath();
      innerCtx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      innerCtx.strokeStyle = "#D4AF37";
      innerCtx.lineWidth = 1;
      innerCtx.stroke();
    };

    // 绘制时辰指针（独立canvas，保持不动）
    const drawPointerStatic = () => {
      pointerCtx.clearRect(0, 0, size, size);

      const circleRadius = 4;
      const gapToText = 6;
      const totalLength = size * 0.46 - 25;
      const circleCenterY = centerY - totalLength * 0.75;
      const endY = centerY - totalLength + gapToText;
      
      // 第一段直线
      pointerCtx.beginPath();
      pointerCtx.moveTo(centerX, centerY);
      pointerCtx.lineTo(centerX, circleCenterY + circleRadius);
      const pointerGrad = pointerCtx.createLinearGradient(centerX, centerY, centerX, circleCenterY);
      pointerGrad.addColorStop(0, "#D4AF37");
      pointerGrad.addColorStop(1, "#C41E3A");
      pointerCtx.strokeStyle = pointerGrad;
      pointerCtx.lineWidth = 3;
      pointerCtx.lineCap = "round";
      pointerCtx.stroke();
      
      // 空心圆
      pointerCtx.beginPath();
      pointerCtx.arc(centerX, circleCenterY, circleRadius, 0, Math.PI * 2);
      pointerCtx.strokeStyle = "#C41E3A";
      pointerCtx.lineWidth = 2;
      pointerCtx.stroke();
      
      // 第二段直线
      pointerCtx.beginPath();
      pointerCtx.moveTo(centerX, circleCenterY - circleRadius);
      pointerCtx.lineTo(centerX, endY);
      const endGrad = pointerCtx.createLinearGradient(centerX, circleCenterY - circleRadius, centerX, endY);
      endGrad.addColorStop(0, "#C41E3A");
      endGrad.addColorStop(1, "#8B0000");
      pointerCtx.strokeStyle = endGrad;
      pointerCtx.lineWidth = 3;
      pointerCtx.lineCap = "round";
      pointerCtx.stroke();

      // 中心圆点
      pointerCtx.beginPath();
      pointerCtx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      const centerGrad = pointerCtx.createRadialGradient(centerX - 2, centerY - 2, 0, centerX, centerY, 5);
      centerGrad.addColorStop(0, "#F4D03F");
      centerGrad.addColorStop(1, "#D4AF37");
      pointerCtx.fillStyle = centerGrad;
      pointerCtx.fill();
      pointerCtx.strokeStyle = "#B8960C";
      pointerCtx.lineWidth = 1;
      pointerCtx.stroke();
    };

    outerIntervalRef.current = window.setInterval(() => {
      drawOuterDialStatic();
    }, 4 * 60 * 1000); // 每4分钟更新一次大表盘

    // 大表盘立即绘制一次
    drawOuterDialStatic();
    
    // 小表盘使用 CSS3 动画，这里只需绘制静态内容
    drawInnerDialStatic();
    
    // 绘制指针（独立canvas，保持不动）
    drawPointerStatic();
    
    setIsLoading(false);

    return () => {
      if (outerIntervalRef.current) {
        clearInterval(outerIntervalRef.current);
      }
    };
  }, [size]);

  return (
    <div className="flex flex-col items-center relative" style={{ width: size }}>
      {/* 大表盘（时辰盘）- 底层 */}
      <canvas
        ref={outerCanvasRef}
        className="absolute inset-0"
        style={{
          filter: "drop-shadow(0 4px 16px rgba(139, 69, 19, 0.25))",
          touchAction: "none",
          willChange: "transform",
          backgroundColor: "transparent",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      {/* 小表盘（秒盘）- 顶层 */}
      <canvas
        ref={innerCanvasRef}
        className="absolute inset-0"
        style={{
          touchAction: "none",
          willChange: "transform",
          backgroundColor: "transparent",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
          animation: "spin 60s linear infinite",
        }}
      />
      {/* 时辰指针 - 独立层，保持不动 */}
      <canvas
        ref={pointerCanvasRef}
        className="absolute inset-0"
        style={{
          touchAction: "none",
          pointerEvents: "none",
          backgroundColor: "transparent",
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.3s ease-in-out",
        }}
      />
      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
      <div className="mt-2 text-center space-y-1" style={{ marginTop: size + 8 }}>
        <div className="text-base font-bold" style={{ color: "#f7bec7" }}>
          {currentShiChen.name}时 · {currentShiChen.zodiac} · {currentShiChen.time} · <span style={{ color: '#D4AF37' }}>{hourPillar}</span>
        </div>
      </div>
    </div>
  );
}
