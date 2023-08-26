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
