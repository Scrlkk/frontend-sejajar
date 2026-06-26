export const PILLAR_COLOR_PRESETS = [
  '#2563eb', // Blue
  '#ec4899', // Pink
  '#10b981', // Emerald
  '#f97316', // Orange
  '#8b5cf6', // Purple
  '#dc2626', // Red
  '#06b6d4', // Cyan
  '#d946ef'  // Magenta
];

export const getPillarColor = (index: number): string => {
  return PILLAR_COLOR_PRESETS[index % PILLAR_COLOR_PRESETS.length];
};
