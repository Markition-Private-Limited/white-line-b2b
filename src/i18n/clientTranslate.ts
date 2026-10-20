import { Lang, resolveLang } from "./config";
import { translate, TranslateValues } from "./translate";

/** The language chosen in this browser. Only meaningful in client code (it reads the cookie). */
export function clientLang(): Lang {
  if (typeof document === "undefined") return "en";
  const match = document.cookie.match(/(?:^|;\s*)lang=([^;]*)/);
  return resolveLang(match ? decodeURIComponent(match[1]) : null);
}

/** Translation for plain helper functions that cannot use the React context. */
export function tClient(text: string, values?: TranslateValues): string {
  return translate(clientLang(), text, values);
}
