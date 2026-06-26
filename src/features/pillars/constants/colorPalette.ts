/**
 * Dynamic Color Palette for Pillars & Categories
 *
 * Uses a deterministic hash of the item's name/id so that:
 * - The same name always maps to the same color (consistent).
 * - New items automatically receive a unique color from the palette.
 * - No manual mapping required.
 */

export type ColorToken = {
  badge: string;
  dot: string;
  hover: string;
  selected: string;
  hex: string;
};

const PALETTE: ColorToken[] = [
  {
    badge: "bg-indigo-50 text-indigo-700 border-indigo-100",
    dot: "bg-indigo-500",
    hover: "hover:border-indigo-500 hover:bg-indigo-50/30 hover:text-indigo-600",
    selected: "border-indigo-500 bg-white text-indigo-700 shadow-sm ring-1 ring-indigo-500/30",
    hex: "#6366f1",
  },
  {
    badge: "bg-pink-50 text-pink-700 border-pink-100",
    dot: "bg-pink-500",
    hover: "hover:border-pink-500 hover:bg-pink-50/30 hover:text-pink-600",
    selected: "border-pink-500 bg-white text-pink-700 shadow-sm ring-1 ring-pink-500/30",
    hex: "#ec4899",
  },
  {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-100",
    dot: "bg-emerald-500",
    hover: "hover:border-emerald-500 hover:bg-emerald-50/30 hover:text-emerald-600",
    selected: "border-emerald-500 bg-white text-emerald-700 shadow-sm ring-1 ring-emerald-500/30",
    hex: "#10b981",
  },
  {
    badge: "bg-amber-50 text-amber-700 border-amber-100",
    dot: "bg-amber-500",
    hover: "hover:border-amber-500 hover:bg-amber-50/30 hover:text-amber-600",
    selected: "border-amber-500 bg-white text-amber-700 shadow-sm ring-1 ring-amber-500/30",
    hex: "#f59e0b",
  },
  {
    badge: "bg-purple-50 text-purple-700 border-purple-100",
    dot: "bg-purple-500",
    hover: "hover:border-purple-500 hover:bg-purple-50/30 hover:text-purple-600",
    selected: "border-purple-500 bg-white text-purple-700 shadow-sm ring-1 ring-purple-500/30",
    hex: "#8b5cf6",
  },
  {
    badge: "bg-red-50 text-red-700 border-red-100",
    dot: "bg-red-500",
    hover: "hover:border-red-500 hover:bg-red-50/30 hover:text-red-600",
    selected: "border-red-500 bg-white text-red-700 shadow-sm ring-1 ring-red-500/30",
    hex: "#ef4444",
  },
  {
    badge: "bg-violet-50 text-violet-700 border-violet-100",
    dot: "bg-violet-500",
    hover: "hover:border-violet-500 hover:bg-violet-50/30 hover:text-violet-600",
    selected: "border-violet-500 bg-white text-violet-700 shadow-sm ring-1 ring-violet-500/30",
    hex: "#7c3aed",
  },
  {
    badge: "bg-green-50 text-green-700 border-green-100",
    dot: "bg-green-500",
    hover: "hover:border-green-500 hover:bg-green-50/30 hover:text-green-600",
    selected: "border-green-500 bg-white text-green-700 shadow-sm ring-1 ring-green-500/30",
    hex: "#22c55e",
  },
  {
    badge: "bg-sky-50 text-sky-700 border-sky-100",
    dot: "bg-sky-500",
    hover: "hover:border-sky-500 hover:bg-sky-50/30 hover:text-sky-600",
    selected: "border-sky-500 bg-white text-sky-700 shadow-sm ring-1 ring-sky-500/30",
    hex: "#0ea5e9",
  },
  {
    badge: "bg-orange-50 text-orange-700 border-orange-100",
    dot: "bg-orange-500",
    hover: "hover:border-orange-500 hover:bg-orange-50/30 hover:text-orange-600",
    selected: "border-orange-500 bg-white text-orange-700 shadow-sm ring-1 ring-orange-500/30",
    hex: "#f97316",
  },
  {
    badge: "bg-teal-50 text-teal-700 border-teal-100",
    dot: "bg-teal-500",
    hover: "hover:border-teal-500 hover:bg-teal-50/30 hover:text-teal-600",
    selected: "border-teal-500 bg-white text-teal-700 shadow-sm ring-1 ring-teal-500/30",
    hex: "#14b8a6",
  },
  {
    badge: "bg-rose-50 text-rose-700 border-rose-100",
    dot: "bg-rose-500",
    hover: "hover:border-rose-500 hover:bg-rose-50/30 hover:text-rose-600",
    selected: "border-rose-500 bg-white text-rose-700 shadow-sm ring-1 ring-rose-500/30",
    hex: "#f43f5e",
  },
];

export const PALETTE_MAP: Record<string, ColorToken> = {
  indigo: PALETTE[0],
  pink: PALETTE[1],
  emerald: PALETTE[2],
  amber: PALETTE[3],
  purple: PALETTE[4],
  red: PALETTE[5],
  violet: PALETTE[6],
  green: PALETTE[7],
  sky: PALETTE[8],
  orange: PALETTE[9],
  teal: PALETTE[10],
  rose: PALETTE[11],
};

export const PALETTE_KEYS = Object.keys(PALETTE_MAP);

/**
 * Deterministic hash — maps a string to an index in PALETTE.
 * Uses the numeric `id` if provided (most stable), otherwise hashes the name.
 */
function hashToIndex(key: string | number): number {
  if (typeof key === "number") {
    return key % PALETTE.length;
  }
  let hash = 0;
  for (let i = 0; i < key.length; i++) {
    hash = (hash * 31 + key.charCodeAt(i)) >>> 0; // keep unsigned 32-bit
  }
  return hash % PALETTE.length;
}

/**
 * Returns a `ColorToken` for the given identifier.
 *
 * @param key  - Use the database `id` (number) for maximum stability,
 *               or the item name (string) as a fallback.
 * @param colorKey - Optional user-defined color key (e.g. "indigo", "pink").
 *                   If provided, overrides the deterministic hash.
 */
export function getColorToken(key: string | number, colorKey?: string | null): ColorToken {
  if (colorKey && PALETTE_MAP[colorKey]) {
    return PALETTE_MAP[colorKey];
  }
  return PALETTE[hashToIndex(key)];
}
