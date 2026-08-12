import { drawPhoto } from './drawPhoto';
import { canvasToBlob } from './exportImage';
import { getFunTitle } from '../data/builderTitles';

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

export function drawFormatB(canvas, { image, crop, name, role, builderTitle, templateImage, symbolImage }) {
  const ctx = canvas.getContext('2d');
  const width = 1600;
  const height = 900;
  canvas.width = width;
  canvas.height = height;

  const scaleX = width / 576;
  const scaleY = height / 305;

  // 1. Draw Template Image
  if (templateImage) {
    ctx.drawImage(templateImage, 0, 0, width, height);
  } else {
    // Fallback card background if template is loading
    ctx.fillStyle = "#07351D";
    ctx.fillRect(0, 0, width, height);
  }

  // 2. User Portrait Photo (Drawn inside the photo slot of the frame)
  const imgW = 182 * scaleX;
  const imgH = 226 * scaleY;
  const imgX = 27 * scaleX;
  const imgY = 29 * scaleY;

  if (image) {
    ctx.save();
    ctx.beginPath();
    drawRoundedRect(ctx, imgX, imgY, imgW, imgH, 16 * scaleX);
    ctx.closePath();
    ctx.clip();
    drawPhoto(ctx, image, crop, imgX, imgY, imgW, imgH, 16 * scaleX);
    ctx.restore();
  }

  // 3. User Details text overlay (using absolute template Y coordinates)
  
  // Name value (below pre-printed NAME label at 141 * scaleY)
  const titleX = 226 * scaleX;
  const nameY = 141 * scaleY;
  ctx.fillStyle = "#F1EBDD";
  ctx.textAlign = "left";
  ctx.font = `700 ${22 * scaleX}px 'Poppins', sans-serif`;
  ctx.fillText(name || "Arjun Sharma", titleX, nameY + 36 * scaleY); // Shifted down from + 22 * scaleY

  // Stack / Role value (below pre-printed STACK / ROLE label at 196 * scaleY)
  const stackY = 196 * scaleY;
  const pillX = titleX;
  const pillY = stackY + 24 * scaleY; // Shifted down from + 14 * scaleY
  const pillH = 26 * scaleY;

  ctx.font = `600 ${13 * scaleX}px 'Poppins', sans-serif`;
  const textWidth = ctx.measureText(role || "Frontend Engineer").width;
  const pillW = textWidth + 18 * scaleX;

  ctx.fillStyle = "rgba(0, 0, 0, 0.25)";
  ctx.strokeStyle = "#D91465";
  ctx.lineWidth = 1.2 * scaleX;
  drawRoundedRect(ctx, pillX, pillY, pillW, pillH, 4 * scaleX);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = "#F1EBDD";
  ctx.fillText(role || "Frontend Engineer", pillX + 9 * scaleX, pillY + pillH / 2 + 4.5 * scaleY);

  // Builder Title value (below pre-printed BUILDER TITLE label at 196 * scaleY)
  const bTitleX = 414 * scaleX;
  const displayTitle = builderTitle || getFunTitle(role || "Frontend Engineer");
  ctx.fillStyle = "#F1EBDD";
  ctx.font = `700 ${28 * scaleX}px 'Caveat', cursive, sans-serif`;
  ctx.fillText(displayTitle, bTitleX - 2 * scaleX, stackY + 39 * scaleY); // Shifted down to stackY + 39 * scaleY to align vertical center with pill text

  // Draw symbol image next to Builder Title
  const tWidth = ctx.measureText(displayTitle).width;
  const waveX = bTitleX - 2 * scaleX + tWidth + 8 * scaleX;
  const waveY = stackY + 22 * scaleY; // Shifted down to stackY + 22 * scaleY to remain centered with title text

  if (symbolImage) {
    ctx.drawImage(symbolImage, waveX, waveY, 24 * scaleX, 24 * scaleY);
  }
}

export async function generateFormatB({ image, name, role, builderTitle, crop, templateImage, symbolImage }) {
  const canvas = document.createElement('canvas');
  drawFormatB(canvas, { image, name, role, builderTitle, crop, templateImage, symbolImage });
  return canvasToBlob(canvas);
}
