/**
 * Canvas Engine for HH Goa Frame Generator
 */

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

// Generate a fun builder title based on role/stack
export function getFunTitle(role) {
  const titles = {
    frontend: [
      "Pixel Perfectionist",
      "CSS Whisperer",
      "DOM Dominator",
      "Tailwind Wizard",
      "State Optimizer",
    ],
    backend: [
      "API Alchemist",
      "Database Deity",
      "Serverless Sorcerer",
      "Query Commander",
      "Json Juggler",
    ],
    ai: [
      "LLM Whisperer",
      "Neural Navigator",
      "Model Manipulator",
      "Prompt Priest",
      "Weights Optimizer",
    ],
    design: [
      "Figma Fanatic",
      "UX Architect",
      "Vector Virtuoso",
      "Kerning King",
      "Color Alchemist",
    ],
    smart_contracts: [
      "Gas Optimizer",
      "Solidity Sorcerer",
      "EVM Explorer",
      "Block Builder",
      "Bytecode Bard",
    ],
    other: [
      "Chaotic Creator",
      "Bug Breeder",
      "Keyboard Warrior",
      "Stack Overflow Scholar",
      "Coffee Converter",
    ]
  };

  const normalized = (role || "").toLowerCase().trim();
  let category = "other";
  
  if (normalized.includes("front") || normalized.includes("react") || normalized.includes("ui") || normalized.includes("next")) {
    category = "frontend";
  } else if (normalized.includes("back") || normalized.includes("api") || normalized.includes("node") || normalized.includes("db") || normalized.includes("sql")) {
    category = "backend";
  } else if (normalized.includes("ai") || normalized.includes("gpt") || normalized.includes("model") || normalized.includes("prompt")) {
    category = "ai";
  } else if (normalized.includes("design") || normalized.includes("figma") || normalized.includes("ux") || normalized.includes("ui")) {
    category = "design";
  } else if (normalized.includes("contract") || normalized.includes("solidity") || normalized.includes("web3") || normalized.includes("crypto") || normalized.includes("eth")) {
    category = "smart_contracts";
  }

  const list = titles[category];
  const hash = Array.from(role || "Goa").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return list[hash % list.length];
}

// Draw text along an arc
function drawTextAlongArc(ctx, str, centerX, centerY, radius, angle, above = true) {
  ctx.save();
  ctx.translate(centerX, centerY);
  const chars = str.split('');
  const totalSpread = 1.3; // radians
  const startAngle = angle - totalSpread / 2;
  const angleStep = totalSpread / (chars.length - 1);
  
  for (let i = 0; i < chars.length; i++) {
    const charAngle = startAngle + i * angleStep;
    ctx.save();
    ctx.rotate(charAngle);
    ctx.translate(0, above ? -radius : radius);
    if (!above) {
      ctx.rotate(Math.PI);
    }
    ctx.fillText(chars[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

// Draw a stylized palm tree on canvas
function drawPalmTree(ctx, x, y, scale = 1, color = "#F4C400") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Trunk
  ctx.strokeStyle = color;
  ctx.lineWidth = 6;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.quadraticCurveTo(-15, 40, -5, 0);
  ctx.stroke();

  // Leaves/Fronds
  ctx.fillStyle = color;
  const frondPaths = [
    // Top-left frond
    [-5, 0, -40, -20, -60, -10, -5, 0],
    // Top-right frond
    [-5, 0, 30, -25, 55, -20, -5, 0],
    // Mid-left frond
    [-5, 0, -50, 0, -70, 20, -5, 0],
    // Mid-right frond
    [-5, 0, 40, 5, 60, 30, -5, 0],
    // Top frond
    [-5, 0, -10, -40, 0, -60, -5, 0]
  ];

  frondPaths.forEach(p => {
    ctx.beginPath();
    ctx.moveTo(p[0], p[1]);
    ctx.quadraticCurveTo(p[2], p[3], p[4], p[5]);
    ctx.quadraticCurveTo(p[2] + 5, p[3] + 5, p[6], p[7]);
    ctx.fill();
  });

  ctx.restore();
}

// Draw a stylized hibiscus flower
function drawFlower(ctx, x, y, size = 20, petalandCenterColor = "#E51E69", leafColor = "#F4C400") {
  ctx.save();
  ctx.translate(x, y);
  
  // Petals
  ctx.fillStyle = petalandCenterColor;
  for (let i = 0; i < 5; i++) {
    ctx.rotate((Math.PI * 2) / 5);
    ctx.beginPath();
    ctx.ellipse(0, -size / 1.5, size / 1.8, size / 1.2, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  // Center core
  ctx.fillStyle = leafColor;
  ctx.beginPath();
  ctx.arc(0, 0, size / 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Pistil
  ctx.strokeStyle = leafColor;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.lineTo(size, -size);
  ctx.stroke();
  
  ctx.restore();
}

// Draw the Goa Landscape (Waves, sun, house/shack, palm tree)
function drawGoaLandscape(ctx, x, y, width, height) {
  ctx.save();
  // Draw card/badge background
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

/**
 * Draw Format A: PFP Circular Frame (1080x1080)
 */
export async function renderPFPFrame(canvas, imageElement, crop) {
  const ctx = canvas.getContext('2d');
  const size = 1080;
  canvas.width = size;
  canvas.height = size;

  // Clear background
  ctx.fillStyle = "#062E22"; // Deep Green outer base
  ctx.fillRect(0, 0, size, size);

  // Draw user photo in circular mask
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 430, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (imageElement && crop) {
    const sourceX = imageElement.naturalWidth * (crop.x / 100);
    const sourceY = imageElement.naturalHeight * (crop.y / 100);
    const sourceWidth = imageElement.naturalWidth * (crop.width / 100);
    const sourceHeight = imageElement.naturalHeight * (crop.height / 100);

    ctx.drawImage(
      imageElement,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      size / 2 - 430,
      size / 2 - 430,
      860,
      860
    );
  } else {
    ctx.fillStyle = "#073F2B";
    ctx.fillRect(0, 0, size, size);
    
    ctx.fillStyle = "rgba(244, 196, 0, 0.1)";
    ctx.beginPath();
    ctx.arc(size / 2, size / 2, 200, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();

  // 1. Draw outer Green Ring (Forest Green border)
  ctx.lineWidth = 55;
  ctx.strokeStyle = "#073F2B"; // Forest Green
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 510, 0, Math.PI * 2);
  ctx.stroke();

  // 2. Draw thin inner Gold Ring
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#F4C400"; // Golden Yellow
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, 478, 0, Math.PI * 2);
  ctx.stroke();

  // 3. Top curved text: "HACKER HOUSE GOA 2026"
  ctx.fillStyle = "#F4C400"; // Golden Yellow
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "bold 38px 'Geist', 'Inter', sans-serif";
  drawTextAlongArc(ctx, "HACKER HOUSE GOA 2026", size / 2, size / 2, 508, -Math.PI / 2, true);

  // 4. Bottom curved text: "BUILD • SHIP • REPEAT"
  ctx.fillStyle = "#FFFFFF"; // White text
  ctx.font = "bold 36px 'Geist Mono', monospace";
  drawTextAlongArc(ctx, "BUILD • SHIP • REPEAT", size / 2, size / 2, 508, Math.PI / 2, false);

  // 5. Draw Palm trees on the sides (mid-left & mid-right)
  drawPalmTree(ctx, 110, 480, 0.7, "#F4C400"); // Left Palm
  drawPalmTree(ctx, 970, 480, 0.7, "#F4C400"); // Right Palm

  // 6. Draw decorative flowers at lower transitions
  drawFlower(ctx, 175, 780, 24, "#E51E69", "#F4C400"); // Lower-left flower
  drawFlower(ctx, 905, 780, 24, "#E51E69", "#F4C400"); // Lower-right flower

  // 7. Draw small pink accent stars/sparkles on the rings
  const drawSparkle = (cx, cy) => {
    ctx.fillStyle = "#E51E69"; // Pink
    ctx.beginPath();
    ctx.arc(cx, cy, 8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#FFFFFF";
    ctx.beginPath();
    ctx.arc(cx, cy, 3, 0, Math.PI * 2);
    ctx.fill();
  };
  drawSparkle(260, 260); // Top-left sparkle
  drawSparkle(820, 260); // Top-right sparkle

  // 8. Bottom Center Goa Landscape Badge (sun, shack, wave, palm)
  drawGoaLandscape(ctx, size / 2 - 130, size - 170, 260, 110);
}

/**
 * Draw Format B: Builder ID Card (1600x900)
 */
export async function renderIDCard(canvas, imageElement, crop, name = "Verified Builder", role = "Hacker", title = "") {
  const ctx = canvas.getContext('2d');
  const width = 1600;
  const height = 900;
  canvas.width = width;
  canvas.height = height;

  // 1. Clear background & Draw Deep Green base
  ctx.fillStyle = "#062E22"; // Deep Green
  ctx.fillRect(0, 0, width, height);

  // 2. Draw dual-glow mesh background
  const meshGlow1 = ctx.createRadialGradient(width, 0, 100, width, 0, 800);
  meshGlow1.addColorStop(0, "rgba(229, 30, 105, 0.15)"); // Pink
  meshGlow1.addColorStop(1, "transparent");
  ctx.fillStyle = meshGlow1;
  ctx.fillRect(0, 0, width, height);

  const meshGlow2 = ctx.createRadialGradient(0, height, 100, 0, height, 800);
  meshGlow2.addColorStop(0, "rgba(244, 196, 0, 0.12)"); // Yellow
  meshGlow2.addColorStop(1, "transparent");
  ctx.fillStyle = meshGlow2;
  ctx.fillRect(0, 0, width, height);

  // 3. Draw Gold Outer Border & Pink Hairline Border
  ctx.lineWidth = 12;
  ctx.strokeStyle = "#F4C400"; // Golden Yellow
  ctx.strokeRect(6, 6, width - 12, height - 12);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#E51E69"; // Pink Hairline
  ctx.strokeRect(20, 20, width - 40, height - 40);

  // 4. Draw User Photo on the Left Side
  const imgSize = 540;
  const imgX = 100;
  const imgY = (height - imgSize) / 2 - 20;

  ctx.save();
  // Draw photo background/shadow frame
  ctx.fillStyle = "#073F2B";
  drawRoundedRect(ctx, imgX - 10, imgY - 10, imgSize + 20, imgSize + 20, 24);
  ctx.fill();

  // Photo Mask
  ctx.beginPath();
  drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 16);
  ctx.closePath();
  ctx.clip();

  if (imageElement && crop) {
    const sourceX = imageElement.naturalWidth * (crop.x / 100);
    const sourceY = imageElement.naturalHeight * (crop.y / 100);
    const sourceWidth = imageElement.naturalWidth * (crop.width / 100);
    const sourceHeight = imageElement.naturalHeight * (crop.height / 100);

    ctx.drawImage(imageElement, sourceX, sourceY, sourceWidth, sourceHeight, imgX, imgY, imgSize, imgSize);
  } else {
    // Dark Placeholder inside photo card
    ctx.fillStyle = "#062E22";
    ctx.fillRect(imgX, imgY, imgSize, imgSize);
    ctx.fillStyle = "rgba(244, 196, 0, 0.05)";
    ctx.beginPath();
    ctx.arc(imgX + imgSize/2, imgY + imgSize/2, 100, 0, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // Photo Frame Border
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#F4C400";
  ctx.beginPath();
  drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 16);
  ctx.stroke();

  // 5. Top-Right Header: "HACKER HOUSE GOA 2026"
  ctx.fillStyle = "#FFFFFF";
  ctx.textAlign = "left";
  ctx.font = "bold 65px 'Geist', sans-serif";
  ctx.fillText("HACKER HOUSE GOA 2026", 720, 130);

  // Goa illustration next to the header
  drawGoaLandscape(ctx, 1260, 45, 200, 110);

  // Divider Line
  const divGrad = ctx.createLinearGradient(720, 175, width - 100, 175);
  divGrad.addColorStop(0, "#F4C400");
  divGrad.addColorStop(0.5, "#E51E69");
  divGrad.addColorStop(1, "transparent");
  ctx.fillStyle = divGrad;
  ctx.fillRect(720, 175, width - 820, 3);

  // 6. Meta Fields: Name, Stack/Role, and Builder Title
  
  // A. Name Field
  ctx.fillStyle = "#F4C400";
  ctx.font = "bold 14px 'Geist Mono', monospace";
  ctx.fillText("BUILDER NAME //", 720, 240);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 55px 'Geist', sans-serif";
  ctx.fillText(name || "Verified Builder", 720, 305);

  // B. Stack/Role Field
  ctx.fillStyle = "#F4C400";
  ctx.font = "bold 14px 'Geist Mono', monospace";
  ctx.fillText("PRIMARY STACK //", 720, 390);

  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 38px 'Geist', sans-serif";
  ctx.fillText(role.toUpperCase(), 720, 445);

  // C. Dynamic Fun Title Field
  ctx.fillStyle = "#E51E69";
  ctx.font = "bold 14px 'Geist Mono', monospace";
  ctx.fillText("DYNAMIC BUILDER TITLE //", 720, 530);

  const displayTitle = title || getFunTitle(role);
  ctx.fillStyle = "#E51E69"; // Pink accent
  ctx.font = "italic bold 44px 'Geist', sans-serif";
  ctx.fillText(`"${displayTitle}"`, 720, 595);

  // 7. Bottom Bar slogan and branding
  const barY = 720;
  const barHeight = 80;
  const barWidth = width - 200;
  const barX = 100;

  // Background band
  ctx.fillStyle = "#073F2B"; // Forest Green
  ctx.strokeStyle = "rgba(244, 196, 0, 0.2)";
  ctx.lineWidth = 2;
  drawRoundedRect(ctx, barX, barY, barWidth, barHeight, 12);
  ctx.fill();
  ctx.stroke();

  // Left text: "BUILD • SHIP • REPEAT"
  ctx.fillStyle = "#FFFFFF";
  ctx.font = "bold 26px 'Geist Mono', monospace";
  ctx.textAlign = "left";
  ctx.fillText("BUILD • SHIP • REPEAT", barX + 35, barY + barHeight / 2 + 8);

  // Right text: "#FrameInGoa"
  ctx.fillStyle = "#F4C400";
  ctx.font = "bold 28px 'Geist', sans-serif";
  ctx.textAlign = "right";
  ctx.fillText("#FrameInGoa", barX + barWidth - 35, barY + barHeight / 2 + 8);
}
