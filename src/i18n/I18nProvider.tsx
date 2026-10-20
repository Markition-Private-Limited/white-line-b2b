"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo } from "react";
import Cookies from "js-cookie";
import { Lang, dirOf, LANG_COOKIE } from "./config";
import { translate, TranslateValues } from "./translate";
import apiClient from "@/lib/axios";

interface I18nValue {
  lang: Lang;
  dir: "rtl" | "ltr";
  isRtl: boolean;
  t: (text: string, values?: TranslateValues) => string;
  /** Switches language: remembers it for this browser, saves it on the account, then reloads so every screen re-renders in it. */
  setLang: (lang: Lang) => Promise<void>;
}

const I18nContext = createContext<I18nValue>({
  lang: "en",
  dir: "ltr",
  isRtl: false,
  t: (text, values) => translate("en", text, values),
  setLang: async () => {},
});

export function I18nProvider({ lang, children }: { lang: Lang; children: React.ReactNode }) {
  const t = useCallback(
    (text: string, values?: TranslateValues) => translate(lang, text, values),
    [lang]
  );

  const setLang = useCallback(async (next: Lang) => {
    Cookies.set(LANG_COOKIE, next, { expires: 365, sameSite: "lax" });
    // Saved on the account so the choice follows the admin to other browsers. A failure here
    // must not stop the switch: the cookie already carries it for this browser.
    try {
      if (Cookies.get("token")) {
        await apiClient.patch("/b2b/profile/language", { preferred_language: next });
      }
    } catch (error) {
      console.error("Failed to save the language preference", error);
    }
    window.location.reload();
  }, []);

  // Phone numbers and clock times are always read left-to-right, but the Unicode bidi rules
  // scramble them inside right-to-left text ("+966…" becomes "…966+", "02:30 PM" becomes
  // "PM 02:30"). Mark such leaf elements so CSS can isolate them as LTR.
  useEffect(() => {
    if (lang !== "ar") return;
    const LTR_ONLY = /^\+?\d[\d\s().:-]*(?:\s?[AaPp][Mm])?$/;
    const mark = (root: Node) => {
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      for (let node = walker.nextNode(); node; node = walker.nextNode()) {
        const el = node.parentElement;
        const text = node.nodeValue?.trim() ?? "";
        if (!el || el.childNodes.length !== 1 || el.hasAttribute("data-ltr") || text.length < 4) continue;
        const digits = text.replace(/\D/g, "").length;
        if (LTR_ONLY.test(text) && (text.includes("+") || text.includes(":") || /[AaPp][Mm]$/.test(text) || digits >= 7)) {
          el.setAttribute("data-ltr", "");
        }
      }
    };
    mark(document.body);
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData" && mutation.target.parentNode) mark(mutation.target.parentNode);
        mutation.addedNodes.forEach((added) => mark(added));
      }
    });
    observer.observe(document.body, { childList: true, subtree: true, characterData: true });
    return () => observer.disconnect();
  }, [lang]);

  const value = useMemo<I18nValue>(
    () => ({ lang, dir: dirOf(lang), isRtl: lang === "ar", t, setLang }),
    [lang, t, setLang]
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useT() {
  return useContext(I18nContext);
}

/**
 * Translates its text. Usable anywhere JSX is — including column definitions outside any
 * component — because it reads the language from context itself:
 *   <T>Pickup</T>      <T>{isActive ? "Active" : "Inactive"}</T>
 * Anything that is not a plain string (numbers, elements) is rendered untouched.
 */
export function T({ children }: { children?: React.ReactNode }) {
  const { t } = useT();
  if (typeof children === "string") return <>{t(children)}</>;
  return <>{children}</>;
}
