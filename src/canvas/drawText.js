/**
 * Reusable Typography Helpers
 */

// Draw text along a circular arc
export function drawTextAlongArc(ctx, str, centerX, centerY, radius, angle, above = true) {
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

// Draw text scaled vertically (e.g. scaleY(1.35))
export function drawScaledText(ctx, text, x, y, font, color, scaleY = 1.0, align = 'left') {
  ctx.save();
  ctx.fillStyle = color;
  ctx.textAlign = align;
  ctx.font = font;
  
  if (scaleY !== 1.0) {
    ctx.scale(1, scaleY);
    ctx.fillText(text, x, y / scaleY);
  } else {
    ctx.fillText(text, x, y);
  }
  
  ctx.restore();
}
