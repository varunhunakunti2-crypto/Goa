/**
 * Reusable Ornaments and Visual Accents
 */

// Draw a stylized palm tree vector
export function drawPalmTree(ctx, x, y, scale = 1, color = "#F4C400") {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  
  // Trunk
  ctx.strokeStyle = "#F4C400";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.quadraticCurveTo(-20, 45, -5, 0);
  ctx.stroke();

  // Leaves/Fronds
  ctx.fillStyle = color;
  const frondPaths = [
    [-5, 0, -45, -25, -65, -15, -5, 0],
    [-5, 0, 35, -30, 60, -25, -5, 0],
    [-5, 0, -55, 5, -75, 25, -5, 0],
    [-5, 0, 45, 10, 65, 35, -5, 0],
    [-5, 0, -15, -45, 0, -65, -5, 0]
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
export function drawFlower(ctx, x, y, size = 20, petalandCenterColor = "#E51E69", leafColor = "#F4C400") {
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

// Draw a screw/rivet ornament
export function drawRivet(ctx, cx, cy, radius, scaleX) {
  ctx.save();
  ctx.fillStyle = "#032b18";
  ctx.strokeStyle = "#f0b80e";
  ctx.lineWidth = 2 * scaleX;
  ctx.beginPath();
  ctx.arc(cx, cy, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
