/**
 * Color constants for the app
 * Supports light and dark mode themes
 */

// Light mode colors
export const lightColors = {
  background: '#ffffff',
  foreground: '#1a1a1a',
  card: '#ffffff',
  cardForeground: '#1a1a1a',
  popover: '#ffffff',
  popoverForeground: '#1a1a1a',
  primary: '#030213',
  primaryForeground: '#ffffff',
  secondary: '#f0f0f5',
  secondaryForeground: '#030213',
  muted: '#ececf0',
  mutedForeground: '#717182',
  accent: '#e9ebef',
  accentForeground: '#030213',
  destructive: '#d4183d',
  destructiveForeground: '#ffffff',
  border: 'rgba(0, 0, 0, 0.1)',
  input: 'transparent',
  inputBackground: '#f3f3f5',
  switchBackground: '#cbced4',
  ring: '#b4b4b4',
  chart1: '#e8a837',
  chart2: '#4a9c8a',
  chart3: '#3b5a8c',
  chart4: '#f4c96b',
  chart5: '#e8a547',
  sidebar: '#fbfbfb',
  sidebarForeground: '#1a1a1a',
  sidebarPrimary: '#030213',
  sidebarPrimaryForeground: '#fbfbfb',
  sidebarAccent: '#f7f7f7',
  sidebarAccentForeground: '#333333',
  sidebarBorder: '#ebebeb',
  sidebarRing: '#b4b4b4',
};

// Dark mode colors
export const darkColors = {
  background: '#1a1a1a',
  foreground: '#fbfbfb',
  card: '#1a1a1a',
  cardForeground: '#fbfbfb',
  popover: '#1a1a1a',
  popoverForeground: '#fbfbfb',
  primary: '#fbfbfb',
  primaryForeground: '#333333',
  secondary: '#444444',
  secondaryForeground: '#fbfbfb',
  muted: '#444444',
  mutedForeground: '#b4b4b4',
  accent: '#444444',
  accentForeground: '#fbfbfb',
  destructive: '#c94a3a',
  destructiveForeground: '#e8a847',
  border: '#444444',
  input: '#444444',
  inputBackground: '#2a2a2a',
  switchBackground: '#555555',
  ring: '#707070',
  chart1: '#6b5bb4',
  chart2: '#7ab89a',
  chart3: '#e8a547',
  chart4: '#9b6bc9',
  chart5: '#c97a3a',
  sidebar: '#333333',
  sidebarForeground: '#fbfbfb',
  sidebarPrimary: '#6b5bb4',
  sidebarPrimaryForeground: '#fbfbfb',
  sidebarAccent: '#444444',
  sidebarAccentForeground: '#fbfbfb',
  sidebarBorder: '#444444',
  sidebarRing: '#707070',
};

// Default to light mode
export const colors = lightColors;

// Type definitions
export type ColorScheme = 'light' | 'dark';
export type Colors = typeof lightColors;
