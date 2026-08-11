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

/**
 * Draw Format A: PFP Circular Frame
 */
export async function renderPFPFrame(canvas, imageElement, crop, zoom = 1) {
  const ctx = canvas.getContext('2d');
  const size = 1080;
  canvas.width = size;
  canvas.height = size;

  // 1. Draw solid dark background for outer bounds (just in case)
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, size, size);

  // 2. Draw user photo cropped & masked as a circle
  ctx.save();
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 20, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  if (imageElement && crop) {
    // Draw cropped image
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
      20,
      20,
      size - 40,
      size - 40
    );
  } else {
    // Placeholder background
    ctx.fillStyle = "#262626";
    ctx.fillRect(0, 0, size, size);
  }
  ctx.restore();

  // 3. Draw beautiful circular frame overlays (Vercel-like border with mesh colors)
  ctx.lineWidth = 24;
  
  // Mesh gradient for the outer ring border
  const borderGradient = ctx.createSweepGradient
    ? ctx.createSweepGradient(size / 2, size / 2, 0, Math.PI * 2)
    : ctx.createLinearGradient(0, 0, size, size);
    
  borderGradient.addColorStop(0, '#007cf0'); // Develop Blue
  borderGradient.addColorStop(0.3, '#00dfd8'); // Develop Teal
  borderGradient.addColorStop(0.5, '#7928ca'); // Preview Violet
  borderGradient.addColorStop(0.7, '#ff0080'); // Preview Pink
  borderGradient.addColorStop(0.85, '#ff4d4d'); // Ship Coral
  borderGradient.addColorStop(1, '#f9cb28'); // Ship Amber

  ctx.strokeStyle = borderGradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 12, 0, Math.PI * 2);
  ctx.stroke();

  // Draw inner thin white border ring
  ctx.lineWidth = 4;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2 - 24, 0, Math.PI * 2);
  ctx.stroke();

  // 4. Add "HH GOA 2026" & "#FrameInGoa" banners at the bottom of the circle
  // We draw a curved pill badge at the bottom
  ctx.save();
  ctx.translate(size / 2, size / 2);
  
  // Badge background at the bottom center
  ctx.fillStyle = "#171717";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 3;
  drawRoundedRect(ctx, -250, size / 2 - 140, 500, 70, 35);
  ctx.fill();
  ctx.stroke();

  // Text: "HH GOA 2026" and "#FrameInGoa"
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  
  // Custom styled brand text
  ctx.font = "bold 32px 'Geist', 'Inter', sans-serif";
  ctx.fillText("HH GOA 2026  •  #FrameInGoa", 0, size / 2 - 105);
  
  ctx.restore();
}

/**
 * Draw Format B: Builder ID Card
 */
export async function renderIDCard(canvas, imageElement, crop, name = "Verified Builder", role = "Hacker", title = "") {
  const ctx = canvas.getContext('2d');
  const width = 800;
  const height = 1200;
  canvas.width = width;
  canvas.height = height;

  // 1. Dark background
  ctx.fillStyle = "#171717";
  ctx.fillRect(0, 0, width, height);

  // 2. Draw mesh gradient decorative accents (background glow)
  const glow1 = ctx.createRadialGradient(0, 0, 10, 0, 0, 500);
  glow1.addColorStop(0, 'rgba(0, 112, 243, 0.15)'); // Blue
  glow1.addColorStop(1, 'transparent');
  ctx.fillStyle = glow1;
  ctx.fillRect(0, 0, width, height);

  const glow2 = ctx.createRadialGradient(width, 300, 10, width, 300, 600);
  glow2.addColorStop(0, 'rgba(121, 40, 202, 0.12)'); // Violet
  glow2.addColorStop(1, 'transparent');
  ctx.fillStyle = glow2;
  ctx.fillRect(0, 0, width, height);

  const glow3 = ctx.createRadialGradient(width / 2, height, 10, width / 2, height, 600);
  glow3.addColorStop(0, 'rgba(80, 227, 194, 0.15)'); // Cyan
  glow3.addColorStop(1, 'transparent');
  ctx.fillStyle = glow3;
  ctx.fillRect(0, 0, width, height);

  // 3. Draw a premium card hairline border
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // Corner tech ticks/crosshairs
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#0070f3";
  // Top-left corner tick
  ctx.beginPath();
  ctx.moveTo(25, 45); ctx.lineTo(45, 45); ctx.lineTo(45, 25);
  ctx.stroke();
  // Bottom-right corner tick
  ctx.beginPath();
  ctx.moveTo(width - 25, height - 45); ctx.lineTo(width - 45, height - 45); ctx.lineTo(width - 45, height - 25);
  ctx.stroke();

  // 4. Header: "HH GOA 2026"
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "14px 'Geist Mono', monospace";
  ctx.fillText("BUILDER IDENTITY ACCESS CARD", 50, 70);

  // Brand Logo Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 32px 'Geist', sans-serif";
  ctx.fillText("HACKHIND GOA", 50, 115);

  // Top header gradient accent line
  const gradLine = ctx.createLinearGradient(50, 135, width - 50, 135);
  gradLine.addColorStop(0, '#007cf0');
  gradLine.addColorStop(0.5, '#7928ca');
  gradLine.addColorStop(1, '#ff0080');
  ctx.fillStyle = gradLine;
  ctx.fillRect(50, 135, width - 100, 3);

  // 5. User Photo with double border
  const imgSize = 320;
  const imgX = (width - imgSize) / 2;
  const imgY = 190;

  // Background card shadow glow
  ctx.save();
  ctx.fillStyle = "#262626";
  drawRoundedRect(ctx, imgX - 10, imgY - 10, imgSize + 20, imgSize + 20, 16);
  ctx.fill();

  // Mask & Draw Photo
  ctx.beginPath();
  drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 12);
  ctx.closePath();
  ctx.clip();

  if (imageElement && crop) {
    const sourceX = imageElement.naturalWidth * (crop.x / 100);
    const sourceY = imageElement.naturalHeight * (crop.y / 100);
    const sourceWidth = imageElement.naturalWidth * (crop.width / 100);
    const sourceHeight = imageElement.naturalHeight * (crop.height / 100);

    ctx.drawImage(imageElement, sourceX, sourceY, sourceWidth, sourceHeight, imgX, imgY, imgSize, imgSize);
  } else {
    // Dark avatar placeholder
    ctx.fillStyle = "#1e1e1e";
    ctx.fillRect(imgX, imgY, imgSize, imgSize);
    
    // Draw generic avatar icon
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.beginPath();
    ctx.arc(imgX + imgSize/2, imgY + imgSize/2 - 20, 60, 0, Math.PI*2);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(imgX + imgSize/2, imgY + imgSize/2 + 130, 110, Math.PI, Math.PI*2);
    ctx.fill();
  }
  ctx.restore();

  // Photo frame border
  ctx.lineWidth = 2;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
  ctx.beginPath();
  drawRoundedRect(ctx, imgX, imgY, imgSize, imgSize, 12);
  ctx.stroke();

  // 6. User Name
  ctx.fillStyle = "#ffffff";
  ctx.textAlign = "center";
  ctx.font = "bold 44px 'Geist', sans-serif";
  ctx.fillText(name, width / 2, 570);

  // 7. Stack/Role Pill Badge
  ctx.save();
  ctx.font = "500 18px 'Geist', sans-serif";
  const badgeText = (role || "BUILDER").toUpperCase();
  const textWidth = ctx.measureText(badgeText).width;
  const paddingX = 24;
  const paddingY = 10;
  const badgeW = textWidth + paddingX * 2;
  const badgeH = 18 + paddingY * 2;
  const badgeX = (width - badgeW) / 2;
  const badgeY = 605;

  // Draw pill background
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";
  ctx.strokeStyle = "rgba(255, 255, 255, 0.15)";
  ctx.lineWidth = 1;
  drawRoundedRect(ctx, badgeX, badgeY, badgeW, badgeH, badgeH / 2);
  ctx.fill();
  ctx.stroke();

  // Draw text
  ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
  ctx.fillText(badgeText, width / 2, badgeY + badgeH / 2 + 6);
  ctx.restore();

  // 8. Fun Title Section
  const displayTitle = title || getFunTitle(role);
  ctx.fillStyle = "#50e3c2"; // Mint cyan accent
  ctx.font = "italic bold 30px 'Geist', sans-serif";
  ctx.fillText(`"${displayTitle}"`, width / 2, 695);

  // 9. Stats Grid in the bottom section
  const statsY = 750;
  ctx.lineWidth = 1;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
  
  // Horizontal grid dividers
  ctx.beginPath();
  ctx.moveTo(80, statsY); ctx.lineTo(width - 80, statsY);
  ctx.moveTo(80, statsY + 100); ctx.lineTo(width - 80, statsY + 100);
  ctx.moveTo(80, statsY + 200); ctx.lineTo(width - 80, statsY + 200);
  ctx.stroke();

  // Vertical grid dividers
  ctx.beginPath();
  ctx.moveTo(width / 2, statsY); ctx.lineTo(width / 2, statsY + 200);
  ctx.stroke();

  ctx.textAlign = "left";
  ctx.font = "12px 'Geist Mono', monospace";

  // Stat Cell 1
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText("LOCATION", 100, statsY + 30);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Geist', sans-serif";
  ctx.fillText("Goa, India", 100, statsY + 65);

  // Stat Cell 2
  ctx.textAlign = "left";
  ctx.font = "12px 'Geist Mono', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText("ACCESS LEVEL", width / 2 + 40, statsY + 30);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 20px 'Geist', sans-serif";
  ctx.fillText("All-Access Hacker", width / 2 + 40, statsY + 65);

  // Stat Cell 3
  ctx.font = "12px 'Geist Mono', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText("STATUS", 100, statsY + 130);
  ctx.fillStyle = "#00dfd8"; // Cyan success
  ctx.font = "bold 20px 'Geist', sans-serif";
  ctx.fillText("VERIFIED BUILDER", 100, statsY + 165);

  // Stat Cell 4
  ctx.font = "12px 'Geist Mono', monospace";
  ctx.fillStyle = "rgba(255, 255, 255, 0.35)";
  ctx.fillText("POWER LEVEL", width / 2 + 40, statsY + 130);
  ctx.fillStyle = "#ff0080"; // Pink power
  ctx.font = "bold 20px 'Geist', sans-serif";
  ctx.fillText("9000+", width / 2 + 40, statsY + 165);

  // 10. Card Footer: Tech Details & Barcode & Hashtag
  const footerY = 1040;
  
  // Barcode decoration
  ctx.fillStyle = "#ffffff";
  const barcodeX = 80;
  const barcodeY = footerY;
  const barcodeHeight = 60;
  
  // Pseudo random barcode widths for visual realism
  const barcodePattern = [2, 6, 2, 4, 1, 8, 3, 2, 6, 2, 4, 1, 8, 3, 1, 4, 2, 6, 3, 10, 2, 1, 6, 4];
  let curX = barcodeX;
  ctx.fillStyle = "rgba(255, 255, 255, 0.6)";
  for (let w of barcodePattern) {
    ctx.fillRect(curX, barcodeY, w, barcodeHeight);
    curX += w + 3;
  }

  // Right side details
  ctx.textAlign = "right";
  ctx.fillStyle = "rgba(255, 255, 255, 0.4)";
  ctx.font = "12px 'Geist Mono', monospace";
  ctx.fillText("SYS.REF // HH-GOA-2026", width - 80, footerY + 15);
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 22px 'Geist', sans-serif";
  ctx.fillText("#FrameInGoa", width - 80, footerY + 50);
}
