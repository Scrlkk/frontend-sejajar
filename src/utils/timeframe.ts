export function matchTimeframe(dateInput: Date | string | null | undefined, timeframe: string): boolean {
  if (!dateInput) return false;
  if (timeframe === "all") return true;

  const compareDate = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  if (isNaN(compareDate.getTime())) return false;

  const now = new Date();
  
  if (timeframe === "today") {
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    return compareDate >= startOfDay;
  }
  
  if (timeframe === "week") {
    const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
    return compareDate >= startOfWeek;
  }
  
  if (timeframe === "month") {
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    return compareDate >= startOfMonth;
  }
  
  if (timeframe === "year") {
    const startOfYear = new Date(now.getFullYear(), 0, 1);
    return compareDate >= startOfYear;
  }
  
  return true;
}
