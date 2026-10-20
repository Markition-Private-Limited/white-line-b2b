const config = {
  plugins: {
    "@tailwindcss/postcss": {},
    // Mirrors every directional rule (margins, padding, left/right, text-align, borders,
    // rounded corners…) for dir="rtl", emitted as `[dir="rtl"] .class { … }` next to the
    // original, so one set of utility classes serves both English (LTR) and Arabic (RTL).
    "postcss-rtlcss": { mode: "combined" },
  },
};

export default config;
