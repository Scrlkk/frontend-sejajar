const CATEGORY_BG_MAP: Record<string, string> = {
  'Product Review': 'bg-amber-50 text-amber-700 border-amber-100',
  'Education':      'bg-indigo-50 text-indigo-700 border-indigo-100',
  'Entertainment':  'bg-rose-50 text-rose-700 border-rose-100',
  'Lifestyle':      'bg-emerald-50 text-emerald-700 border-emerald-100',
};

export const getCategoryBg = (name: string): string => {
  return CATEGORY_BG_MAP[name] ?? 'bg-gray-50 text-gray-700 border-gray-100';
};
