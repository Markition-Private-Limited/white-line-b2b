import { arPart1 } from "./ar.part1";
import { arPart2 } from "./ar.part2";

/** Arabic translations, keyed by the English text shown in the UI. Later parts override earlier ones. */
export const ar: Record<string, string> = { ...arPart1, ...arPart2 };
