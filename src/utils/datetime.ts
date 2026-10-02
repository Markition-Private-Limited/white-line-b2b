/** Business dates and times are displayed in Riyadh regardless of viewer location. */
export const RIYADH_TIME_ZONE = "Asia/Riyadh";

export function getRiyadhISODate(value: Date = new Date()): string {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: RIYADH_TIME_ZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(value);
  const get = (type: Intl.DateTimeFormatPartTypes) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

export function dateOnly(value?: string | Date | null): string | null {
  if (!value) return null;
  if (typeof value === "string") {
    const match = value.match(/^\d{4}-\d{2}-\d{2}/);
    if (match) return match[0];
  }
  const parsed = toDate(value);
  return parsed ? getRiyadhISODate(parsed) : null;
}

export function isPastRiyadhDate(value?: string | Date | null): boolean {
  const day = dateOnly(value);
  return Boolean(day && day < getRiyadhISODate());
}

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
