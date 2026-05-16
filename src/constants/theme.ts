/**
 * Theme configuration
 * Combines all design tokens into a cohesive theme
 */

import { lightColors, darkColors, type ColorScheme, type Colors } from './colors';
import { spacing, borderRadius, layout, iconSizes } from './spacing';
import { fontSize, fontWeight, lineHeight, letterSpacing, typography } from './typography';
import { shadows } from './shadows';

export interface Theme {
  colors: Colors;
  spacing: typeof spacing;
  borderRadius: typeof borderRadius;
  layout: typeof layout;
  iconSizes: typeof iconSizes;
  fontSize: typeof fontSize;
  fontWeight: typeof fontWeight;
  lineHeight: typeof lineHeight;
  letterSpacing: typeof letterSpacing;
  typography: typeof typography;
  shadows: typeof shadows;
  colorScheme: ColorScheme;
}

export const createTheme = (colorScheme: ColorScheme = 'light'): Theme => ({
  colors: colorScheme === 'dark' ? darkColors : lightColors,
  spacing,
  borderRadius,
  layout,
  iconSizes,
  fontSize,
  fontWeight,
  lineHeight,
  letterSpacing,
  typography,
  shadows,
  colorScheme,
});

// Default theme (light mode)
export const theme = createTheme('light');
