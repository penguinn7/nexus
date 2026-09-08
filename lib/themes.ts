export type NexusThemeKey =
  | "y2k"
  | "midnight"
  | "moss"
  | "candy"
  | "frost"
  | "noir"
  | "pearl"
  | "daylight";

export interface NexusTheme {
  key: NexusThemeKey;
  name: string;
  description: string;
  /** CSS variables (as raw values) that map into our design tokens */
  vars: Record<string, string>;
}

/**
 * Theme architecture is data/config-driven.
 *
 * Each theme defines CSS custom-property values that are applied on
 * the theme root. Components read from these tokens instead of
 * hardcoding Y2K colors everywhere, so adding a new theme is just
 * adding an entry here.
 */
export const THEMES: Record<NexusThemeKey, NexusTheme> = {
  y2k: {
    key: "y2k",
    name: "Y2K",
    description: "Chrome, glass & deep space",
    vars: {
      "--background": "240 30% 4%",
      "--foreground": "260 20% 96%",
      "--primary": "280 80% 70%",
      "--secondary": "200 90% 60%",
      "--accent": "320 90% 70%",
      "--muted": "250 15% 14%",
      "--muted-foreground": "250 12% 62%",
      "--card": "250 22% 8%",
      "--border": "250 18% 18%",
      "--glow-pink": "320 95% 70%",
      "--glow-violet": "280 90% 68%",
      "--glow-blue": "205 95% 65%",
      "--glow-cyan": "190 95% 60%",
    },
  },
  midnight: {
    key: "midnight",
    name: "Midnight",
    description: "Calm, deep indigo focus",
    vars: {
      "--background": "230 35% 3%",
      "--foreground": "220 25% 96%",
      "--primary": "230 70% 72%",
      "--secondary": "200 60% 60%",
      "--accent": "260 70% 75%",
      "--muted": "230 20% 12%",
      "--muted-foreground": "225 15% 60%",
      "--card": "232 28% 7%",
      "--border": "230 22% 16%",
      "--glow-pink": "250 80% 70%",
      "--glow-violet": "230 85% 70%",
      "--glow-blue": "210 90% 65%",
      "--glow-cyan": "195 85% 62%",
    },
  },
  moss: {
    key: "moss",
    name: "Moss",
    description: "Deep forest calm",
    vars: {
      "--background": "150 25% 5%",
      "--foreground": "140 20% 95%",
      "--primary": "130 45% 60%",
      "--secondary": "165 55% 55%",
      "--accent": "90 50% 55%",
      "--muted": "150 16% 13%",
      "--muted-foreground": "145 12% 60%",
      "--card": "150 18% 8%",
      "--border": "150 18% 18%",
      "--glow-pink": "350 50% 60%",
      "--glow-violet": "130 40% 62%",
      "--glow-blue": "170 70% 60%",
      "--glow-cyan": "160 75% 55%",
    },
  },
  candy: {
    key: "candy",
    name: "Candy",
    description: "Playful, bright pastels",
    vars: {
      "--background": "330 35% 10%",
      "--foreground": "330 25% 96%",
      "--primary": "320 85% 80%",
      "--secondary": "280 85% 75%",
      "--accent": "15 90% 75%",
      "--muted": "330 22% 16%",
      "--muted-foreground": "330 15% 66%",
      "--card": "330 26% 12%",
      "--border": "330 24% 22%",
      "--glow-pink": "330 90% 75%",
      "--glow-violet": "280 85% 75%",
      "--glow-blue": "220 85% 75%",
      "--glow-cyan": "185 80% 70%",
    },
  },
  frost: {
    key: "frost",
    name: "Frost",
    description: "Crisp arctic minimalism",
    vars: {
      "--background": "205 30% 5%",
      "--foreground": "200 25% 96%",
      "--primary": "195 80% 65%",
      "--secondary": "210 60% 60%",
      "--accent": "175 75% 60%",
      "--muted": "205 18% 13%",
      "--muted-foreground": "200 15% 60%",
      "--card": "205 22% 8%",
      "--border": "205 20% 18%",
      "--glow-pink": "280 60% 70%",
      "--glow-violet": "230 65% 70%",
      "--glow-blue": "200 90% 68%",
      "--glow-cyan": "185 95% 62%",
    },
  },
  noir: {
    key: "noir",
    name: "Noir",
    description: "Monochrome, moody",
    vars: {
      "--background": "0 0% 4%",
      "--foreground": "0 0% 96%",
      "--primary": "0 0% 80%",
      "--secondary": "0 0% 60%",
      "--accent": "260 40% 80%",
      "--muted": "0 0% 12%",
      "--muted-foreground": "0 0% 58%",
      "--card": "0 0% 7%",
      "--border": "0 0% 18%",
      "--glow-pink": "0 0% 85%",
      "--glow-violet": "250 25% 70%",
      "--glow-blue": "200 30% 60%",
      "--glow-cyan": "0 0% 70%",
    },
  },
  pearl: {
    key: "pearl",
    name: "Pearl",
    description: "Luminous, off-white calm",
    vars: {
      "--background": "40 12% 92%",
      "--foreground": "250 18% 16%",
      "--primary": "300 40% 55%",
      "--secondary": "200 45% 50%",
      "--accent": "330 50% 60%",
      "--muted": "45 8% 84%",
      "--muted-foreground": "250 12% 40%",
      "--card": "40 15% 96%",
      "--border": "250 12% 82%",
      "--glow-pink": "330 55% 68%",
      "--glow-violet": "280 40% 65%",
      "--glow-blue": "205 50% 60%",
      "--glow-cyan": "190 45% 55%",
    },
  },
  daylight: {
    key: "daylight",
    name: "Daylight",
    description: "Bright, airy, productive",
    vars: {
      "--background": "220 30% 96%",
      "--foreground": "230 25% 14%",
      "--primary": "250 60% 55%",
      "--secondary": "200 70% 55%",
      "--accent": "320 60% 55%",
      "--muted": "220 16% 88%",
      "--muted-foreground": "230 12% 40%",
      "--card": "220 25% 98%",
      "--border": "230 12% 84%",
      "--glow-pink": "330 70% 70%",
      "--glow-violet": "250 60% 68%",
      "--glow-blue": "200 75% 62%",
      "--glow-cyan": "190 70% 55%",
    },
  },
};

export const THEME_LIST: NexusTheme[] = Object.values(THEMES);

export function getTheme(key: string): NexusTheme {
  return THEMES[key as NexusThemeKey] ?? THEMES.y2k;
}

/** Runtime application of themed CSS vars on an element */
export function themeVars(theme: NexusTheme): Record<string, string> {
  return theme.vars;
}
