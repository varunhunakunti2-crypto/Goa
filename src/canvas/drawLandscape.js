import { drawPalmTree } from './drawDecorations';

// Helper to draw a rounded rectangle
function drawRoundedRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}

// Format A: Goa badge landscape (waves, sun, shack)
export function drawGoaLandscapeFormatA(ctx, x, y, width, height) {
  ctx.save();
  ctx.fillStyle = "#062E22"; // Deep Green
  ctx.strokeStyle = "#F4C400"; // Golden Yellow
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, x, y, width, height, 16);
  ctx.fill();
  ctx.stroke();

  // Clip content inside the landscape box
  ctx.beginPath();
  drawRoundedRect(ctx, x + 3, y + 3, width - 6, height - 6, 13);
  ctx.closePath();
  ctx.clip();

  // 1. Draw Golden Sun
  ctx.fillStyle = "#F4C400";
  ctx.beginPath();
  ctx.arc(x + width / 2 - 25, y + height - 20, 30, 0, Math.PI * 2);
  ctx.fill();

  // 2. Draw Ocean Waves
  ctx.strokeStyle = "#E51E69"; // Pink
  ctx.lineWidth = 4;
  ctx.beginPath();
  for (let i = 0; i < width - 10; i++) {
    const waveY = y + height - 15 + Math.sin(i * 0.05) * 5;
    if (i === 0) ctx.moveTo(x + 5 + i, waveY);
    else ctx.lineTo(x + 5 + i, waveY);
  }
  ctx.stroke();

  // 3. Draw mini house/shack
  ctx.fillStyle = "#FFFFFF";
  ctx.strokeStyle = "#073F2B";
  ctx.lineWidth = 2;
  
  // Base
  ctx.beginPath();
  ctx.rect(x + width - 65, y + height - 40, 35, 25);
  ctx.fill();
  ctx.stroke();
  
  // Roof
  ctx.fillStyle = "#E51E69";
  ctx.beginPath();
  ctx.moveTo(x + width - 70, y + height - 40);
  ctx.lineTo(x + width - 47, y + height - 60);
  ctx.lineTo(x + width - 25, y + height - 40);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  // 4. Mini Palm tree next to house
  drawPalmTree(ctx, x + 35, y + height - 90, 0.45, "#F4C400");

  ctx.restore();
}

// Format B: Scaled SVG Scenery Illustration (166x145 viewBox)
export function drawLandscapeSVGFormatB(ctx, sx, sy, sw, sh, scaleX, scaleY) {
  ctx.save();

  // Map coordinates from SVG viewBox (0 0 450 380) to destination (sx, sy, sw, sh)
  const mapX = (vx) => sx + vx * (sw / 450);
  const mapY = (vy) => sy + vy * (sh / 380);
  const scale = sw / 450;

  // 1. Sun Glow (radial gradient)
  const glowGrad = ctx.createRadialGradient(mapX(360), mapY(80), 0, mapX(360), mapY(80), 140 * scale);
  glowGrad.addColorStop(0, "#fff8a6");
  glowGrad.addColorStop(0.35, "#f0b80e");
  glowGrad.addColorStop(1, "rgba(7, 53, 29, 0)");
  ctx.fillStyle = glowGrad;
  ctx.beginPath();
  ctx.arc(mapX(360), mapY(80), 140 * scale, 0, Math.PI * 2);
  ctx.fill();

  // 2. Sun Rays burst (premium multi-ray burst)
  ctx.save();
  ctx.strokeStyle = "#f0b80e";
  ctx.lineWidth = 1 * scale;
  ctx.globalAlpha = 0.35;
  const rayCount = 32;
  for (let i = 0; i < rayCount; i++) {
    const angle = (i * 2 * Math.PI) / rayCount;
    const rayLen = 220 * scale;
    ctx.beginPath();
    ctx.moveTo(mapX(360), mapY(80));
    ctx.lineTo(mapX(360) + Math.cos(angle) * rayLen, mapY(80) + Math.sin(angle) * rayLen);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Solid Sun Disk
  ctx.fillStyle = "#f0b80e";
  ctx.beginPath();
  ctx.arc(mapX(360), mapY(80), 42 * scale, 0, Math.PI * 2);
  ctx.fill();

  // 4. Mountains
  // Mountain 1 (Left)
  ctx.fillStyle = "#2d523b";
  ctx.beginPath();
  ctx.moveTo(mapX(120), mapY(200));
  ctx.lineTo(mapX(190), mapY(100));
  ctx.lineTo(mapX(260), mapY(200));
  ctx.closePath();
  ctx.fill();

  // Mountain 2 (Right)
  ctx.fillStyle = "#1b4029";
  ctx.beginPath();
  ctx.moveTo(mapX(190), mapY(200));
  ctx.lineTo(mapX(270), mapY(75));
  ctx.lineTo(mapX(350), mapY(200));
  ctx.closePath();
  ctx.fill();

  // 5. Snow Peaks
  ctx.save();
  ctx.fillStyle = "#e2f3e8";
  ctx.globalAlpha = 0.8;

  ctx.beginPath();
  ctx.moveTo(mapX(190), mapY(100));
  ctx.lineTo(mapX(205), mapY(125));
  ctx.lineTo(mapX(175), mapY(125));
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(mapX(270), mapY(75));
  ctx.lineTo(mapX(288), mapY(105));
  ctx.lineTo(mapX(252), mapY(105));
  ctx.closePath();
  ctx.fill();
  ctx.restore();

  // 6. Winding River
  ctx.save();
  ctx.fillStyle = "#2185a6";
  ctx.globalAlpha = 0.85;
  ctx.beginPath();
  ctx.moveTo(mapX(270), mapY(200));
  ctx.quadraticCurveTo(mapX(250), mapY(240), mapX(290), mapY(270));
  ctx.quadraticCurveTo(mapX(330), mapY(300), mapX(360), mapY(360));
  ctx.lineTo(mapX(450), mapY(380));
  ctx.lineTo(mapX(450), mapY(200));
  ctx.closePath();
  ctx.fill();

  // River Highlight
  ctx.strokeStyle = "#7ad0eb";
  ctx.lineWidth = 6 * scale;
  ctx.globalAlpha = 1.0;
  ctx.beginPath();
  ctx.moveTo(mapX(270), mapY(200));
  ctx.quadraticCurveTo(mapX(250), mapY(240), mapX(290), mapY(270));
  ctx.quadraticCurveTo(mapX(330), mapY(300), mapX(360), mapY(360));
  ctx.stroke();
  ctx.restore();

  // 7. Tropical Trees / Forest Canopy
  const foliage = [
    { cx: 210, cy: 270, r: 28, fill: "#e19d14" },
    { cx: 240, cy: 260, r: 32, fill: "#2ecc71" },
    { cx: 270, cy: 275, r: 25, fill: "#e74c3c" },
    { cx: 300, cy: 265, r: 30, fill: "#3498db" }
  ];
  foliage.forEach(f => {
    ctx.fillStyle = f.fill;
    ctx.beginPath();
    ctx.arc(mapX(f.cx), mapY(f.cy), f.r * scale, 0, Math.PI * 2);
    ctx.fill();
  });

  // 8. Goan Beach House / Shack
  ctx.fillStyle = "#f39c12";
  drawRoundedRect(ctx, mapX(260), mapY(270), 85 * scale, 45 * scale, 4 * scale);
  ctx.fill();

  ctx.fillStyle = "#c0392b";
  ctx.beginPath();
  ctx.moveTo(mapX(250), mapY(270));
  ctx.lineTo(mapX(302), mapY(235));
  ctx.lineTo(mapX(355), mapY(270));
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = "#5d4037";
  ctx.fillRect(mapX(285), mapY(285), 18 * scale, 30 * scale);

  // 9. Palm Trees (Right Side)
  ctx.save();
  // Trunk
  ctx.strokeStyle = "#5d4037";
  ctx.lineWidth = 10 * scale;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(mapX(400), mapY(340));
  ctx.quadraticCurveTo(mapX(380), mapY(240), mapX(410), mapY(160));
  ctx.stroke();

  // Leaves
  ctx.strokeStyle = "#1b5e20";
  ctx.lineWidth = 6 * scale;
  ctx.lineCap = "round";

  // Leaf 1
  ctx.beginPath();
  ctx.moveTo(mapX(410), mapY(160));
  ctx.quadraticCurveTo(mapX(350), mapY(130), mapX(330), mapY(160));
  ctx.stroke();

  // Leaf 2
  ctx.beginPath();
  ctx.moveTo(mapX(410), mapY(160));
  ctx.quadraticCurveTo(mapX(370), mapY(110), mapX(360), mapY(80));
  ctx.stroke();

  // Leaf 3
  ctx.beginPath();
  ctx.moveTo(mapX(410), mapY(160));
  ctx.quadraticCurveTo(mapX(430), mapY(100), mapX(450), mapY(120));
  ctx.stroke();

  // Leaf 4
  ctx.beginPath();
  ctx.moveTo(mapX(410), mapY(160));
  ctx.quadraticCurveTo(mapX(450), mapY(150), mapX(460), mapY(190));
  ctx.stroke();

  ctx.restore();

  ctx.restore();
}
