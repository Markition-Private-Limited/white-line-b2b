const ARABIC_DATES = "ar-SA-u-ca-gregory-nu-latn";

function isArabic(): boolean {
  return typeof document !== "undefined" && /(?:^|;\s*)lang=ar(?:;|$)/.test(document.cookie);
}

/**
 * Locale for formatting dates and times. Arabic uses Arabic month and day names with the
 * Gregorian calendar and Western digits (the Saudi default would be the Hijri calendar);
 * English keeps the locale the call site always used (`en-US` unless told otherwise).
 *
 * Read from the language cookie at call time, so it works in plain helper functions that
 * cannot use the React context. Dates are formatted after data has loaded in the browser,
 * so there is no server-rendered text to disagree with.
 */
export function dateLocale(english: string = "en-US"): string {
  return isArabic() ? ARABIC_DATES : english;
}

/** For calls that passed no locale and so followed the browser: Arabic overrides it, English leaves it alone. */
export function dateLocaleOrBrowser(): string | undefined {
  return isArabic() ? ARABIC_DATES : undefined;
}
