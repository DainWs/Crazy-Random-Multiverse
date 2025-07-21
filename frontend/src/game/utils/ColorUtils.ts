type Color = HexColor | RGBColor;
type HexColor = `#${string}`;
type RGBColor = { r: number; g: number; b: number; a?: number };

const HEX_REGEX = /^#([0-9A-F]{3}|[0-9A-F]{6}|[0-9A-F]{8})$/i;

function isHexColor(color: Color): boolean {
  return typeof color === 'string' && HEX_REGEX.test(color);
}

function toRGBColor(color: Color): RGBColor {
  if (isHexColor(color)) {
    return hexToRGBColor(color as HexColor);
  }

  return color as RGBColor;
}

function hexToRGBColor(hexColor: HexColor): RGBColor {
  const hexNumber = hexColor.replace('#', '');
  const bigint = parseInt(hexNumber, 16);

  const isRGBA = hexNumber.length === 8;
  if (isRGBA) {
    return {
      r: (bigint >> 24) & 255,
      g: (bigint >> 16) & 255,
      b: (bigint >> 8) & 255,
      a: bigint & 255
    };
  }

  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255
  };
}

export type { Color, HexColor, RGBColor };
export { isHexColor, toRGBColor };