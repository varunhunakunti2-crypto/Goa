/**
 * Canvas Image Export Helpers
 */

export function canvasToBlob(canvas, mimeType = 'image/png', quality = 1.0) {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error('Canvas export failed'));
    }, mimeType, quality);
  });
}
