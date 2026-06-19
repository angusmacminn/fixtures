const LIGHT_TEXT = "#FFFFFF";
const DARK_TEXT = "#0F1115";

function parseHex(hex) {
  if (!hex) return { r: 0, g: 0, b: 0 };
  const normalized = String(hex).replace("#", "").trim();
  if (normalized.length !== 6) return { r: 0, g: 0, b: 0 };

  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16),
  };
}

function relativeLuminance({ r, g, b }) {
  const [rs, gs, bs] = [r, g, b].map((channel) => {
    const c = channel / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });

  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

export function getContrastTextColor(hex) {
  return relativeLuminance(parseHex(hex)) > 0.4 ? DARK_TEXT : LIGHT_TEXT;
}

export function getMarkerStyles(fill) {
  const textColor = getContrastTextColor(fill);
  const isLightText = textColor === LIGHT_TEXT;

  return {
    textColor,
    circleStroke: isLightText
      ? "rgba(255,255,255,0.4)"
      : "rgba(0,0,0,0.22)",
    numberStroke: isLightText ? "rgba(0,0,0,0.5)" : "rgba(255,255,255,0.45)",
    numberStrokeWidth: 0.4,
  };
}
