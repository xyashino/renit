import { DarkTheme, DefaultTheme, type Theme } from '@react-navigation/native';
import type { ViewStyle } from 'react-native';

const BASE_THEME = {
  light: {
    background: 'hsl(204 12.1951% 91.9608%)',
    foreground: 'hsl(0 0% 20%)',
    card: 'hsl(0 0% 100%)',
    cardForeground: 'hsl(0 0% 20%)',
    popover: 'hsl(0 0% 100%)',
    popoverForeground: 'hsl(0 0% 20%)',
    primary: 'hsl(15.1765 72.6496% 54.1176%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(217.2973 44.0476% 32.9412%)',
    secondaryForeground: 'hsl(0 0% 100%)',
    muted: 'hsl(210 20% 98.0392%)',
    mutedForeground: 'hsl(220 8.9362% 46.0784%)',
    accent: 'hsl(207.6923 46.4286% 89.0196%)',
    accentForeground: 'hsl(224.4444 64.2857% 32.9412%)',
    destructive: 'hsl(0 84.2365% 60.1961%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 80%)',
    input: 'hsl(220 15.7895% 96.2745%)',
    ring: 'hsl(13.2143 73.0435% 54.902%)',
  },
  dark: {
    background: 'hsl(0 0% 10.1961%)',
    foreground: 'hsl(0 0% 89.8039%)',
    card: 'hsl(0 0% 12.549%)',
    cardForeground: 'hsl(0 0% 89.8039%)',
    popover: 'hsl(0 0% 12.549%)',
    popoverForeground: 'hsl(0 0% 89.8039%)',
    primary: 'hsl(15.1765 72.6496% 54.1176%)',
    primaryForeground: 'hsl(0 0% 100%)',
    secondary: 'hsl(216.1905 44.0559% 28.0392%)',
    secondaryForeground: 'hsl(0 0% 89.8039%)',
    muted: 'hsl(0 0% 16.4706%)',
    mutedForeground: 'hsl(0 0% 50.1961%)',
    accent: 'hsl(223.6364 34.375% 25.098%)',
    accentForeground: 'hsl(213.3333 96.9231% 87.2549%)',
    destructive: 'hsl(0 84.2365% 60.1961%)',
    destructiveForeground: 'hsl(0 0% 100%)',
    border: 'hsl(0 0% 20.7843%)',
    input: 'hsl(0 0% 18.8235%)',
    ring: 'hsl(13.2143 73.0435% 54.902%)',
  },
};

const THEME = {
  light: {
    background: BASE_THEME.light.background,
    foreground: BASE_THEME.light.foreground,
    card: BASE_THEME.light.card,
    'card-foreground': BASE_THEME.light.cardForeground,
    popover: BASE_THEME.light.popover,
    'popover-foreground': BASE_THEME.light.popoverForeground,
    primary: BASE_THEME.light.primary,
    'primary-foreground': BASE_THEME.light.primaryForeground,
    secondary: BASE_THEME.light.secondary,
    'secondary-foreground': BASE_THEME.light.secondaryForeground,
    tertiary: 'hsl(210 37.2549% 60%)',
    'tertiary-foreground': 'hsl(0 0% 100%)',
    muted: BASE_THEME.light.muted,
    'muted-foreground': BASE_THEME.light.mutedForeground,
    accent: BASE_THEME.light.accent,
    'accent-foreground': BASE_THEME.light.accentForeground,
    destructive: BASE_THEME.light.destructive,
    'destructive-foreground': BASE_THEME.light.destructiveForeground,
    border: BASE_THEME.light.border,
    input: BASE_THEME.light.input,
    ring: BASE_THEME.light.ring,
  },
  dark: {
    background: BASE_THEME.dark.background,
    foreground: BASE_THEME.dark.foreground,
    card: BASE_THEME.dark.card,
    'card-foreground': BASE_THEME.dark.cardForeground,
    popover: BASE_THEME.dark.popover,
    'popover-foreground': BASE_THEME.dark.popoverForeground,
    primary: BASE_THEME.dark.primary,
    'primary-foreground': BASE_THEME.dark.primaryForeground,
    secondary: BASE_THEME.dark.secondary,
    'secondary-foreground': BASE_THEME.dark.secondaryForeground,
    tertiary: 'hsl(210 37.0787% 65.098%)',
    'tertiary-foreground': 'hsl(0 0% 10.1961%)',
    muted: BASE_THEME.dark.muted,
    'muted-foreground': BASE_THEME.dark.mutedForeground,
    accent: BASE_THEME.dark.accent,
    'accent-foreground': BASE_THEME.dark.accentForeground,
    destructive: BASE_THEME.dark.destructive,
    'destructive-foreground': BASE_THEME.dark.destructiveForeground,
    border: BASE_THEME.dark.border,
    input: BASE_THEME.dark.input,
    ring: BASE_THEME.dark.ring,
  },
} as const;

type ShadowScale = {
  '2xs': ViewStyle;
  xs: ViewStyle;
  sm: ViewStyle;
  DEFAULT: ViewStyle;
  md: ViewStyle;
  lg: ViewStyle;
  xl: ViewStyle;
  '2xl': ViewStyle;
};

const createShadow = (
  color: string,
  opacity: number,
  elevation: number,
  height = 2,
  radius = 4
): ViewStyle => ({
  shadowColor: color,
  shadowOffset: { width: 0, height },
  shadowOpacity: opacity,
  shadowRadius: radius,
  elevation,
});

const SHADOWS = {
  light: {
    '2xs': createShadow('#1a1a1a', 0.05, 1, 1, 3),
    xs: createShadow('#1a1a1a', 0.05, 1, 1, 3),
    sm: createShadow('#1a1a1a', 0.1, 2, 1, 3),
    DEFAULT: createShadow('#1a1a1a', 0.1, 2, 1, 3),
    md: createShadow('#1a1a1a', 0.1, 3, 2, 4),
    lg: createShadow('#1a1a1a', 0.1, 4, 4, 6),
    xl: createShadow('#1a1a1a', 0.1, 8, 8, 10),
    '2xl': createShadow('#1a1a1a', 0.25, 12, 1, 3),
  },
  dark: {
    '2xs': createShadow('#1a1a1a', 0.05, 1, 1, 3),
    xs: createShadow('#1a1a1a', 0.05, 1, 1, 3),
    sm: createShadow('#1a1a1a', 0.1, 2, 1, 3),
    DEFAULT: createShadow('#1a1a1a', 0.1, 2, 1, 3),
    md: createShadow('#1a1a1a', 0.1, 3, 2, 4),
    lg: createShadow('#1a1a1a', 0.1, 4, 4, 6),
    xl: createShadow('#1a1a1a', 0.1, 8, 8, 10),
    '2xl': createShadow('#1a1a1a', 0.25, 12, 1, 3),
  },
} as const satisfies Record<'light' | 'dark', ShadowScale>;

const NAV_THEME: Record<'light' | 'dark', Theme> = {
  light: {
    ...DefaultTheme,
    colors: {
      background: THEME.light.background,
      border: THEME.light.border,
      card: THEME.light.card,
      notification: THEME.light.destructive,
      primary: THEME.light.primary,
      text: THEME.light.foreground,
    },
  },
  dark: {
    ...DarkTheme,
    colors: {
      background: THEME.dark.background,
      border: THEME.dark.border,
      card: THEME.dark.card,
      notification: THEME.dark.destructive,
      primary: THEME.dark.primary,
      text: THEME.dark.foreground,
    },
  },
};

export { THEME, NAV_THEME, SHADOWS };
