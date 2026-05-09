import type { ViewStyle } from 'react-native';
import { NAV_THEME as BASE_NAV_THEME, THEME as BASE_THEME } from '@/lib/theme';

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

const NAV_THEME = BASE_NAV_THEME;

export { THEME, NAV_THEME, SHADOWS };
