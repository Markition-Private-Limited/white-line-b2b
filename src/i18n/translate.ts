import { Lang } from "./config";
import { ar } from "./ar";

export type TranslateValues = Record<string, string | number>;

const dictionaries: Record<Lang, Record<string, string>> = { en: {}, ar };

/** Lower-cased copy of each dictionary, so "BOOKING ID" finds "Booking ID". */
const lowerIndex: Record<Lang, Record<string, string>> = { en: {}, ar: {} };
for (const lang of Object.keys(dictionaries) as Lang[]) {
  for (const [key, value] of Object.entries(dictionaries[lang])) {
    const lower = key.replace(/\s+/g, " ").trim().toLowerCase();
    if (!(lower in lowerIndex[lang])) lowerIndex[lang][lower] = value;
  }
}

/** Collapses the whitespace JSX and template strings leave behind, so one phrase has one key. */
function normalise(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

function fill(text: string, values?: TranslateValues): string {
  if (!values) return text;
  return text.replace(/\{(\w+)\}/g, (match, name) =>
    name in values ? String(values[name]) : match
  );
}

function lookup(lang: Lang, key: string): string | undefined {
  return dictionaries[lang][key] ?? lowerIndex[lang][key.toLowerCase()];
}

/**
 * Translates an English UI string. English text is the key, so a string that has no
 * translation simply shows in English instead of breaking the screen.
 *
 * - Matching ignores case, so table headers written in capitals translate too.
 * - A trailing " *" (required field), ":" or "..." is set aside, translated, and put back.
 * - "Label: Value" pairs ("Status: All") are translated part by part.
 * - `{name}` placeholders are filled from `values`.
 */
export function translate(lang: Lang, text: string, values?: TranslateValues): string {
  if (lang === "en" || typeof text !== "string" || text === "") return fill(text, values);

  const key = normalise(text);
  const keepSpace = (translated: string) => {
    // Fragments that continue a sentence ("… has been approved") keep their leading space.
    const lead = /^\s/.test(text) ? " " : "";
    const trail = /\s$/.test(text) ? " " : "";
    return `${lead}${translated.trim()}${trail}`;
  };

  const direct = lookup(lang, key);
  if (direct !== undefined) return fill(keepSpace(direct), values);

  for (const suffix of [" *", ":", "...", "…"]) {
    if (key.endsWith(suffix) && key.length > suffix.length) {
      const base = lookup(lang, key.slice(0, -suffix.length).trim());
      if (base !== undefined) return fill(keepSpace(`${base}${suffix}`), values);
    }
  }

  // "booking, driver" — a list of known words — keeps its commas, in Arabic form.
  if (key.includes(", ")) {
    const parts = key.split(", ").map((part) => lookup(lang, part));
    if (parts.every((part) => part !== undefined)) return parts.join("، ");
  }

  const split = key.indexOf(": ");
  if (split > 0) {
    const head = lookup(lang, key.slice(0, split));
    const tail = lookup(lang, key.slice(split + 2));
    if (head !== undefined || tail !== undefined) {
      return `${head ?? key.slice(0, split)}: ${tail ?? key.slice(split + 2)}`;
    }
  }

  return fill(text, values);
}
