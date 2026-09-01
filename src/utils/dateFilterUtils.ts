export interface DateFilterRange {
  startDate?: string; // YYYY-MM-DD
  endDate?: string;   // YYYY-MM-DD
  preset: string;
  label: string;
}

export type DatePickerValue = DateFilterRange;

export function formatDateToYMD(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function getRangeFromPreset(preset: string): { startDate?: string; endDate?: string } {
  const today = new Date();
  const todayStr = formatDateToYMD(today);

  switch (preset) {
    case "Today":
      return { startDate: todayStr, endDate: todayStr };
    case "Yesterday": {
      const y = new Date(today);
      y.setDate(y.getDate() - 1);
      const yStr = formatDateToYMD(y);
      return { startDate: yStr, endDate: yStr };
    }
    case "This Week": {
      const start = new Date(today);
      const day = start.getDay(); // 0 is Sunday
      const diff = start.getDate() - day + (day === 0 ? -6 : 1); // Monday as first day
      start.setDate(diff);
      return { startDate: formatDateToYMD(start), endDate: todayStr };
    }
    case "This Month": {
      const start = new Date(today.getFullYear(), today.getMonth(), 1);
      return { startDate: formatDateToYMD(start), endDate: todayStr };
    }
    case "Last 30 Days": {
      const start = new Date(today);
      start.setDate(start.getDate() - 30);
      return { startDate: formatDateToYMD(start), endDate: todayStr };
    }
    default:
      return {};
  }
}

export function isDateInRange(
  itemDateStr: string | Date | null | undefined,
  preset: string,
  customStart?: string,
  customEnd?: string
): boolean {
  if (!itemDateStr) return false;
  if (!preset || preset === "All" || preset === "Date" || preset === "Date Range" || preset.toLowerCase().includes("all")) return true;

  const itemDate = new Date(itemDateStr);
  if (isNaN(itemDate.getTime())) return false;

  const itemYMD = formatDateToYMD(itemDate);

  let start = customStart;
  let end = customEnd;

  if (preset !== "Custom" && (!start || !end)) {
    const range = getRangeFromPreset(preset);
    start = range.startDate;
    end = range.endDate;
  }

  if (start && itemYMD < start) return false;
  if (end && itemYMD > end) return false;

  return true;
}
