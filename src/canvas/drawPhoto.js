/**
 * Reusable Photo Drawing and Cropping Logic
 *
 * `crop` is the croppedAreaPixels object from react-easy-crop:
 *   { x, y, width, height } — all in natural image pixel coordinates.
 *
 * When crop is null (image just loaded, before user has adjusted anything),
 * we fall back to a cover-fit of the full image into the destination rect.
 */

export function drawPhoto(ctx, imageElement, crop, x, y, width, height, radius = 0, isCircle = false) {
  ctx.save();

  // ─── Clipping mask ───────────────────────────────────────────────────────
  ctx.beginPath();
  if (isCircle) {
    ctx.arc(x + width / 2, y + height / 2, width / 2, 0, Math.PI * 2);
  } else if (radius > 0) {
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
  } else {
    ctx.rect(x, y, width, height);
  }
  ctx.closePath();
  ctx.clip();

  // ─── Draw image ──────────────────────────────────────────────────────────
  if (imageElement) {
    if (crop && crop.width > 0 && crop.height > 0) {
      // react-easy-crop gives us pixel coordinates into the natural image
      ctx.drawImage(
        imageElement,
        crop.x,      // source x (pixels)
        crop.y,      // source y (pixels)
        crop.width,  // source width (pixels)
        crop.height, // source height (pixels)
        x,           // dest x
        y,           // dest y
        width,       // dest width
        height       // dest height
      );
    } else {
      // No crop selected yet — cover-fit the full image
      const imgAspect  = imageElement.naturalWidth  / imageElement.naturalHeight;
      const destAspect = width / height;
      let sx = 0, sy = 0, sw = imageElement.naturalWidth, sh = imageElement.naturalHeight;

      if (imgAspect > destAspect) {
        // image is wider than dest → crop left/right
        sw = imageElement.naturalHeight * destAspect;
        sx = (imageElement.naturalWidth - sw) / 2;
      } else {
        // image is taller than dest → crop top/bottom
        sh = imageElement.naturalWidth / destAspect;
        sy = (imageElement.naturalHeight - sh) / 2;
      }
      ctx.drawImage(imageElement, sx, sy, sw, sh, x, y, width, height);
    }
  } else {
    // No image yet — dark green placeholder
    ctx.fillStyle = "#0a4025";
    ctx.fillRect(x, y, width, height);
  }

  ctx.restore();
}
