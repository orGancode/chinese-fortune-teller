import { useEffect, useRef, useState } from "react";

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
// 每个卦由三爻组成，1表示阳爻（长线），0表示阴爻（断线）
const BA_GUA_DATA = [
  { name: "乾", yao: [1, 1, 1] }, // ☰ 三阳
  { name: "兑", yao: [0, 1, 1] }, // ☱ 上阴
  { name: "离", yao: [1, 0, 1] }, // ☲ 中阴
  { name: "震", yao: [0, 0, 1] }, // ☳ 下两阴
  { name: "巽", yao: [1, 1, 0] }, // ☴ 上两阳
  { name: "坎", yao: [0, 1, 0] }, // ☵ 上下阴
  { name: "艮", yao: [1, 0, 0] }, // ☶ 上阳下两阴
  { name: "坤", yao: [0, 0, 0] }, // ☷ 三阴
];

interface ShiChenDialCanvasProps {
  size?: number;
}

export function ShiChenDialCanvas({ size = 220 }: ShiChenDialCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentShiChen, setCurrentShiChen] = useState(SHI_CHEN_DATA[0]);
  const animationRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // 设置canvas实际尺寸（高清屏适配）
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2;
    const outerRadius = size * 0.46;
    const innerRadius = size * 0.20;

    const draw = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const milliseconds = now.getMilliseconds();

      // 计算当前时辰索引（传统时辰划分）
      const currentIndex = Math.floor(((hours + 1) % 24) / 2);
      setCurrentShiChen(SHI_CHEN_DATA[currentIndex]);

      // 计算当前时辰开始的小时
      const currentShiChenStartHour = SHI_CHEN_DATA[currentIndex].startHour;
      
      // 计算进入当前时辰的分钟数（取整，阶梯式）
      let minutesIntoShiChen;
      
      if (currentIndex === 0) {
        // 子时特殊处理：23:00-01:00跨越两天
        if (hours >= 23) {
          minutesIntoShiChen = Math.floor((hours - 23) * 60 + minutes);
        } else {
          minutesIntoShiChen = Math.floor(60 + minutes);
        }
      } else {
        minutesIntoShiChen = Math.floor((hours - currentShiChenStartHour) * 60 + minutes);
      }
      
      // 阶梯式旋转：每4分钟转1度（整数倍）
      const degreesInShiChen = Math.floor(minutesIntoShiChen / 4);
      
      // 表盘旋转角度（让当前时辰转到0度）
      // 文字在刻度之间（15度偏移），再加15度修正
      const textAngle = currentIndex * 30 + 15;
      const rotationDegrees = -(textAngle + degreesInShiChen) + 15;

      // 秒盘旋转（60秒一圈，连续旋转）
      const totalSeconds = seconds + milliseconds / 1000;
      const secondsRotation = (totalSeconds / 60) * 360;

      // 清空画布
      ctx.clearRect(0, 0, size, size);

      // ========== 绘制外圈装饰环 ==========
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 3, 0, Math.PI * 2);
      const outerGradient = ctx.createLinearGradient(centerX - outerRadius, centerY - outerRadius, centerX + outerRadius, centerY + outerRadius);
      outerGradient.addColorStop(0, "#8B4513");
      outerGradient.addColorStop(0.5, "#A0522D");
      outerGradient.addColorStop(1, "#8B4513");
      ctx.fillStyle = outerGradient;
      ctx.fill();

      // ========== 绘制旋转的时辰盘 ==========
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
      
      // ========== 绘制八卦图形（在时辰与小表盘之间的区域，靠近小表盘）==========
      // 八卦位置：更靠近小表盘
      const baGuaRadius = innerRadius + 15; // 靠近内圈
      const yaoLength = 20; // 爻线长度（切线方向，更长）
      const yaoThickness = 2; // 爻线粗细
      const yaoGap = 3; // 爻之间间隙
      
      for (let i = 0; i < 8; i++) {
        const baGua = BA_GUA_DATA[i];
        // 每个卦的位置角度（从顶部开始，顺时针）
        const angle = (i * 45 - 90) * (Math.PI / 180);
        
        // 计算卦象中心位置（在圆周上）
        const gx = centerX + Math.cos(angle) * baGuaRadius;
        const gy = centerY + Math.sin(angle) * baGuaRadius;
        
        // 切线方向（垂直于半径）
        const tangentAngle = angle + Math.PI / 2;
        
        // 绘制三爻（沿切线方向排列）
        for (let j = 0; j < 3; j++) {
          const isYang = baGua.yao[j] === 1; // 1为阳爻（长线），0为阴爻（断线）
          // 沿半径方向偏移，三个爻并排
          const rOffset = (j - 1) * (yaoThickness + yaoGap);
          
          // 计算爻线中心点（沿半径方向偏移）
          const cx = gx + Math.cos(angle) * rOffset;
          const cy = gy + Math.sin(angle) * rOffset;
          
          if (isYang) {
            // 阳爻：一条长线（沿切线方向）
            ctx.beginPath();
            ctx.moveTo(
              cx - Math.cos(tangentAngle) * yaoLength/2, 
              cy - Math.sin(tangentAngle) * yaoLength/2
            );
            ctx.lineTo(
              cx + Math.cos(tangentAngle) * yaoLength/2, 
              cy + Math.sin(tangentAngle) * yaoLength/2
            );
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = yaoThickness;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = "round";
            ctx.stroke();
          } else {
            // 阴爻：两条短线（断开，沿切线方向）
            const gap = 4; // 中间断开距离
            const halfLength = (yaoLength - gap) / 2;
            
            // 左短线（沿切线方向）
            ctx.beginPath();
            ctx.moveTo(
              cx - Math.cos(tangentAngle) * (yaoLength/2), 
              cy - Math.sin(tangentAngle) * (yaoLength/2)
            );
            ctx.lineTo(
              cx - Math.cos(tangentAngle) * (gap/2), 
              cy - Math.sin(tangentAngle) * (gap/2)
            );
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = yaoThickness;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = "round";
            ctx.stroke();
            
            // 右短线（沿切线方向）
            ctx.beginPath();
            ctx.moveTo(
              cx + Math.cos(tangentAngle) * (gap/2), 
              cy + Math.sin(tangentAngle) * (gap/2)
            );
            ctx.lineTo(
              cx + Math.cos(tangentAngle) * (yaoLength/2), 
              cy + Math.sin(tangentAngle) * (yaoLength/2)
            );
            ctx.strokeStyle = "#8B4513";
            ctx.lineWidth = yaoThickness;
            ctx.globalAlpha = 0.4;
            ctx.lineCap = "round";
            ctx.stroke();
          }
        }
      }
      ctx.globalAlpha = 1;

      // 绘制12条主刻度线（在时辰边界处）- 从外边框向内
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

      // 绘制12条中间短刻度线（在两个主刻度之间）
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

      // 绘制时辰文字（放射状排列，指向圆心）
      ctx.font = "bold 15px system-ui, -apple-system, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      for (let i = 0; i < 12; i++) {
        const shi = SHI_CHEN_DATA[i];
        // 文字在两个刻度之间（偏移15度），与短刻度保持一定距离
        const angle = (i * 30 + 15 - 90) * (Math.PI / 180);
        const textRadius = outerRadius - 18;
        const x = centerX + Math.cos(angle) * textRadius;
        const y = centerY + Math.sin(angle) * textRadius;

        ctx.save();
        ctx.translate(x, y);
        // 文字旋转角度 = 其在表盘上的角度位置（放射状指向圆心）
        const textRotation = (i * 30 + 15);
        ctx.rotate((textRotation * Math.PI) / 180);
        
        // 当前时辰高亮
        const isCurrent = i === currentIndex;
        ctx.fillStyle = isCurrent ? "#C41E3A" : "#5D4037";
        ctx.fillText(shi.name, 0, 0);
        ctx.restore();
      }

      ctx.restore(); // 结束时辰盘旋转

      // 外圈边框
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius + 3, 0, Math.PI * 2);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 2;
      ctx.stroke();

      // ========== 绘制旋转的小表盘（太极图）==========
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate((secondsRotation * Math.PI) / 180);

      // 绘制铺满的太极图背景（填满整个内圈）
      const r = innerRadius;

      // 步骤1：绘制白色右半圆（阳鱼）
      ctx.beginPath();
      ctx.arc(0, 0, r, -Math.PI/2, Math.PI/2);
      ctx.fillStyle = "#FAF8F5";
      ctx.fill();

      // 步骤2：绘制黑色左半圆（阴鱼）
      ctx.beginPath();
      ctx.arc(0, 0, r, Math.PI/2, -Math.PI/2);
      ctx.fillStyle = "#2C1810";
      ctx.fill();

      // 步骤3：在右侧（阳鱼位置）下方绘制黑色小圆（黑眼）
      ctx.beginPath();
      ctx.arc(0, r/2, r/2, 0, Math.PI*2);
      ctx.fillStyle = "#2C1810";
      ctx.fill();

      // 步骤4：在左侧（阴鱼位置）上方绘制白色小圆（白眼）
      ctx.beginPath();
      ctx.arc(0, -r/2, r/2, 0, Math.PI*2);
      ctx.fillStyle = "#FAF8F5";
      ctx.fill();

      // 步骤5：在黑色小圆中心绘制白色鱼眼（阴中之阳）
      ctx.beginPath();
      ctx.arc(0, r/2, r/6, 0, Math.PI*2);
      ctx.fillStyle = "#FAF8F5";
      ctx.fill();

      // 步骤6：在白色小圆中心绘制黑色鱼眼（阳中之阴）
      ctx.beginPath();
      ctx.arc(0, -r/2, r/6, 0, Math.PI*2);
      ctx.fillStyle = "#2C1810";
      ctx.fill();
      
      ctx.restore();
      
      // 外圈边框
      ctx.beginPath();
      ctx.arc(centerX, centerY, innerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#D4AF37";
      ctx.lineWidth = 1;
      ctx.stroke();

      // ========== 绘制固定的时辰指针（在小秒盘上方）==========
      const circleRadius = 4; // 空心圆半径（4px）
      const gapToText = 6; // 距离文字的间隙（减小，让末端直线更长）
      const totalLength = outerRadius - 30; // 总长度（到接近文字的位置）
      const circleCenterY = centerY - totalLength * 0.75; // 空心圆位置（75%处，更远离圆心）
      const endY = centerY - totalLength + gapToText; // 终点位置（留间隙）
      
      // 第一段直线：圆心到空心圆底部切点
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(centerX, circleCenterY + circleRadius);
      const pointerGrad = ctx.createLinearGradient(centerX, centerY, centerX, circleCenterY);
      pointerGrad.addColorStop(0, "#D4AF37");
      pointerGrad.addColorStop(1, "#C41E3A");
      ctx.strokeStyle = pointerGrad;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();
      
      // 绘制空心圆（小一点）
      ctx.beginPath();
      ctx.arc(centerX, circleCenterY, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#C41E3A";
      ctx.lineWidth = 2;
      ctx.stroke();
      
      // 第二段直线：空心圆顶部切点到终点
      ctx.beginPath();
      ctx.moveTo(centerX, circleCenterY - circleRadius);
      ctx.lineTo(centerX, endY);
      const endGrad = ctx.createLinearGradient(centerX, circleCenterY - circleRadius, centerX, endY);
      endGrad.addColorStop(0, "#C41E3A");
      endGrad.addColorStop(1, "#8B0000");
      ctx.strokeStyle = endGrad;
      ctx.lineWidth = 3;
      ctx.lineCap = "round";
      ctx.stroke();

      // ========== 中心圆点（最顶层）==========
      ctx.beginPath();
      ctx.arc(centerX, centerY, 5, 0, Math.PI * 2);
      const centerGrad = ctx.createRadialGradient(centerX - 2, centerY - 2, 0, centerX, centerY, 5);
      centerGrad.addColorStop(0, "#F4D03F");
      centerGrad.addColorStop(1, "#D4AF37");
      ctx.fillStyle = centerGrad;
      ctx.fill();
      ctx.strokeStyle = "#B8960C";
      ctx.lineWidth = 1;
      ctx.stroke();

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [size]);

  return (
    <div className="flex flex-col items-center">
      <canvas
        ref={canvasRef}
        style={{
          filter: "drop-shadow(0 4px 16px rgba(139, 69, 19, 0.25))",
        }}
      />
      <div className="mt-2 text-center">
        <div className="text-base font-bold" style={{ color: "#C41E3A" }}>
          {currentShiChen.name}时
        </div>
        <div className="text-xs text-gray-500">
          {currentShiChen.zodiac} · {currentShiChen.time}
        </div>
      </div>
    </div>
  );
}
