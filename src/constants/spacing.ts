/**
 * Spacing and layout constants
 */

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  '4xl': 40,
  '5xl': 48,
  '6xl': 64,
};

export const borderRadius = {
  sm: 6, // calc(var(--radius) - 4px)
  md: 8, // calc(var(--radius) - 2px)
  lg: 10, // var(--radius)
  xl: 14, // calc(var(--radius) + 4px)
  full: 9999,
};

export const layout = {
  padding: spacing.lg,
  margin: spacing.lg,
  screenPadding: spacing.md,
  cardPadding: spacing.lg,
  buttonPadding: { vertical: spacing.md, horizontal: spacing.xl },
  inputPadding: { vertical: spacing.md, horizontal: spacing.lg },
};

export const iconSizes = {
  xs: 16,
  sm: 20,
  md: 24,
  lg: 28,
  xl: 32,
  '2xl': 40,
  '3xl': 48,
};
