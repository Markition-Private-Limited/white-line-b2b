import type { Metadata } from "next";
import { Inter, Poppins, Noto_Sans_Arabic } from "next/font/google";
import { cookies } from "next/headers";
import "react-phone-number-input/style.css";
import "./globals.css";
import PageLoader from "@/components/PageLoader";
import { I18nProvider } from "@/i18n/I18nProvider";
import { LANG_COOKIE, dirOf, resolveLang } from "@/i18n/config";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

// Latin faces have no Arabic glyphs; this one takes over when the portal is in Arabic.
const notoArabic = Noto_Sans_Arabic({
  subsets: ["arabic"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-arabic",
});

export const metadata: Metadata = {
  title: "WhiteLine — B2B Client Portal",
  description: "Corporate & B2B Booking and Fleet Portal built with Next.js",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // The language is chosen per user (see I18nProvider.setLang) and read here so the very
  // first paint already has the right language and direction.
  const lang = resolveLang((await cookies()).get(LANG_COOKIE)?.value);

  return (
    <html
      lang={lang}
      dir={dirOf(lang)}
      className={`${inter.variable} ${poppins.variable} ${notoArabic.variable} h-full antialiased overflow-hidden`}
    >
      <body className="h-full flex flex-col bg-background text-foreground font-sans overflow-hidden" style={{ backgroundColor: '#f8fafc' }}>
        <I18nProvider lang={lang}>
          <PageLoader />
          {children}
        </I18nProvider>
      </body>
    </html>
  );
}
