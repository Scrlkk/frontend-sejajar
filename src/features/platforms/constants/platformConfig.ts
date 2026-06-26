export const PLATFORM_CONFIG: Record<string, { bg: string, calendarBorder: string, chartColor: string }> = {
  Instagram: { bg: 'bg-pink-50 text-pink-600 hover:bg-pink-50', calendarBorder: 'border-pink-500', chartColor: '#ec4899' },
  TikTok:    { bg: 'bg-gray-100 text-gray-800 hover:bg-gray-100', calendarBorder: 'border-gray-800', chartColor: '#1f2937' },
  YouTube:   { bg: 'bg-red-50 text-red-700 hover:bg-red-50', calendarBorder: 'border-red-500', chartColor: '#dc2626' },
  Twitter:   { bg: 'bg-sky-50 text-sky-600 hover:bg-sky-50', calendarBorder: 'border-sky-500', chartColor: '#0ea5e9' },
};

export const getPlatformConfig = (name: string) => PLATFORM_CONFIG[name] ?? PLATFORM_CONFIG['Instagram'];
