/** Business dates and times are displayed in Riyadh regardless of viewer location. */
export const RIYADH_TIME_ZONE = "Asia/Riyadh";

function toDate(value?: string | Date | null): Date | null {
  if (!value) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatRiyadhDate(value?: string | Date | null): string {
  const date = toDate(value);
  return date ? date.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric", timeZone: RIYADH_TIME_ZONE }) : "—";
}

export function formatRiyadhTime(value?: string | Date | null): string {
  const date = toDate(value);
  return date ? date.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: RIYADH_TIME_ZONE }) : "—";
}

export function formatRiyadhDateLong(value?: string | Date | null): string {
  const date = toDate(value);
  return date ? date.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric", timeZone: RIYADH_TIME_ZONE }) : "—";
}
