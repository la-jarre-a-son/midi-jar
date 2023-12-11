/* eslint-disable no-bitwise */
interface RGBColor {
  r: number;
  g: number;
  b: number;
}

export function colorHexToRGB(color: string): RGBColor {
  if (typeof color !== 'string') return colorHexToRGB('000000');
  if (color.startsWith('#')) {
    return colorHexToRGB(color.substring(1));
  }
  if (color.length === 3) {
    return colorHexToRGB(
      `${color.substring(0, 1).repeat(2)}${color.substring(1, 2).repeat(2)}${color
        .substring(2, 3)
        .repeat(2)}`
    );
  }
  if (color.length === 6) {
    return {
      r: Math.min(255, parseInt(color.substring(0, 2), 16)) / 255,
      g: Math.min(255, parseInt(color.substring(2, 4), 16)) / 255,
      b: Math.min(255, parseInt(color.substring(4, 6), 16)) / 255,
    };
  }
  return colorHexToRGB('000000');
}

export function colorRGBToHex(rgb: RGBColor): string {
  return `#${((1 << 24) | ((rgb.r * 255) << 16) | ((rgb.g * 255) << 8) | (rgb.b * 255))
    .toString(16)
    .slice(1)}`;
}

function getLuminance(color: string) {
  function normalize(value: number) {
    return value <= 0.03928
      ? value / 12.92
      : // eslint-disable-next-line no-restricted-properties
        ((value + 0.055) / 1.055) ** 2.4;
  }
  const { r, g, b } = colorHexToRGB(color);

  return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b);
}

export function getContrastColor(color: string, darkColor = '#000000', lightColor = '#ffffff') {
  return getLuminance(color) < getLuminance('808080') ? lightColor : darkColor;
}

export function mixColor(colorA: string, colorB: string, factor = 0.5) {
  const a = colorHexToRGB(colorA);
  const b = colorHexToRGB(colorB);

  if (factor <= 0) {
    return colorA;
  }
  if (factor >= 1) {
    return colorB;
  }

  const c = {
    r: a.r * (1 - factor) + b.r * factor,
    g: a.g * (1 - factor) + b.g * factor,
    b: a.b * (1 - factor) + b.b * factor,
  };

  return colorRGBToHex(c);
}
