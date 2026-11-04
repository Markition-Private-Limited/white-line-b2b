/** The service types customers can book; keys match the API. */
export const SERVICE_TYPE_OPTIONS = [
  { key: "city_trip", label: "City Trip" },
  { key: "airport", label: "Airport Transfer" },
  { key: "hourly", label: "Hourly" },
  { key: "half_day", label: "Half Day" },
  { key: "full_day", label: "Full Day" },
  { key: "day_service", label: "Day Service" },
  { key: "city_to_city", label: "City to City" },
];

/** Readable summary of a service-type list ("All services" when every type is selected or none are set). */
export function summarizeServiceTypes(keys: string[] | null | undefined, t: (text: string) => string): string {
  if (!keys || keys.length === 0 || keys.length >= SERVICE_TYPE_OPTIONS.length) return t("All services");
  return keys.map((k) => t(SERVICE_TYPE_OPTIONS.find((s) => s.key === k)?.label ?? k)).join(", ");
}
