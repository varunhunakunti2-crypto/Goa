import { drawPhoto } from './drawPhoto';
import { canvasToBlob } from './exportImage';

export function drawFormatA(canvas, { image, crop, templateImage }) {
  const ctx = canvas.getContext('2d');
  const size = 1080;
  canvas.width = size;
  canvas.height = size;

  // Clear background to support transparency on the corners
  ctx.clearRect(0, 0, size, size);

  // Clip the entire canvas context to a perfect circle to force transparent corners
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.closePath();
  ctx.clip();

  // Draw user photo in circular mask (inset to fit transparent inner window)
  if (image) {
    drawPhoto(ctx, image, crop, 115, 115, 850, 850, 0, true);
  }

  // Draw the preloaded frame overlay on top
  if (templateImage) {
    ctx.drawImage(templateImage, 0, 0, size, size);
  }
}

export async function generateFormatA({ image, crop, templateImage }) {
  const canvas = document.createElement('canvas');
  drawFormatA(canvas, { image, crop, templateImage });
  return canvasToBlob(canvas);
}
