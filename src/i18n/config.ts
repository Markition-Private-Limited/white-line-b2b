export type Lang = "en" | "ar";

export const LANGS: Lang[] = ["en", "ar"];
export const DEFAULT_LANG: Lang = "en";

/** Cookie holding the chosen language. Read on the server so the first paint is already in the right language and direction. */
export const LANG_COOKIE = "lang";

export function resolveLang(value: string | null | undefined): Lang {
  return value === "ar" || value === "en" ? value : DEFAULT_LANG;
}

export function dirOf(lang: Lang): "rtl" | "ltr" {
  return lang === "ar" ? "rtl" : "ltr";
}
