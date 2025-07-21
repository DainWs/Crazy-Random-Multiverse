import { Color, RGBColor, toRGBColor } from "@/game/utils/ColorUtils";

type File = `${string}.${string}`;

const GREEN_CHROMA: RGBColor = toRGBColor('#00b140');

async function loadTemplateImage(templateName: File, color: Color) {
  const image = await loadTemplateImageResource(templateName);
  return replaceColorInImage(image, toRGBColor(color));
}

function loadTemplateImageResource(templateName: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error(`Error loading image: ${templateName}`));
    image.src = `assets/templates/${templateName}`;
    return image;
  });
}

function replaceColorInImage(image: HTMLImageElement, newColor: RGBColor) {
  const canvas = document.createElement('canvas');
  canvas.width = image.width;
  canvas.height = image.height;

  const ctx = canvas.getContext('2d') as CanvasRenderingContext2D;
  ctx.drawImage(image, 0, 0);

  const imageData = ctx.getImageData(0, 0, image.width, image.height);
  const data = imageData.data;

  for (let i = 0; i < data.length; i += 4) {
    const [r, g, b] = [data[i], data[i + 1], data[i + 2], data[i + 3]];
    if (isChromaColor(r, g, b)) {
      data[i] = newColor.r;
      data[i + 1] = newColor.g;
      data[i + 2] = newColor.b;
      data[i + 3] = newColor.a ?? 255;
    }
  }

  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

function isChromaColor(red: number, green: number, blue: number): boolean {
  return (
    GREEN_CHROMA.r === red &&
    GREEN_CHROMA.g === green &&
    GREEN_CHROMA.b === blue
  );
}

export { loadTemplateImage };