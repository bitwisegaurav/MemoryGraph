import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
  ActivityIndicator,
  View,
} from 'react-native';
import { theme } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  title?: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  icon?: React.ReactNode;
  fullWidth?: boolean;
  children?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  textStyle,
  icon,
  fullWidth = false,
  children,
}) => {
  const { colors } = useTheme();

  const getButtonStyle = (): ViewStyle => {
    const variantStyles: Record<ButtonVariant, ViewStyle> = {
      primary: { backgroundColor: colors.primary },
      secondary: { backgroundColor: colors.secondary },
      outline: { ...styles.outline, borderColor: colors.border },
      ghost: styles.ghost,
      destructive: { backgroundColor: colors.destructive },
    };

    const baseStyle: ViewStyle = {
      ...styles.button,
      ...variantStyles[variant],
      ...styles[size],
      ...(fullWidth && styles.fullWidth),
      ...(disabled && styles.disabled),
    };

    return baseStyle;
  };

  const getTextStyle = (): TextStyle => {
    const variantTextStyles: Record<ButtonVariant, TextStyle> = {
      primary: { color: colors.primaryForeground },
      secondary: { color: colors.secondaryForeground },
      outline: { color: colors.foreground },
      ghost: { color: colors.foreground },
      destructive: { color: colors.destructiveForeground },
    };

    const baseStyle: TextStyle = {
      ...styles.text,
      ...variantTextStyles[variant],
    };

    return baseStyle;
  };

  const getActivityColor = () => {
    return variant === 'primary' ? colors.primaryForeground : colors.primary;
  };

  return (
    <TouchableOpacity
      style={[getButtonStyle(), style]}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.7}
    >
      {loading ? (
        <ActivityIndicator color={getActivityColor()} />
      ) : children ? (
        <View style={styles.content}>{children}</View>
      ) : (
        <View style={styles.content}>
          {icon && <View>{icon}</View>}
          {title && <Text style={[getTextStyle(), textStyle]}>{title}</Text>}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  text: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
  },
  // Variants
  primary: {},
  primaryText: {},
  secondary: {},
  secondaryText: {},
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
  },
  outlineText: {},
  ghost: {
    backgroundColor: 'transparent',
  },
  ghostText: {},
  destructive: {},
  destructiveText: {},
  // Sizes
  sm: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    minHeight: 32,
  },
  md: {
    paddingHorizontal: theme.spacing.xl,
    paddingVertical: theme.spacing.md,
    minHeight: 40,
  },
  lg: {
    paddingHorizontal: theme.spacing['2xl'],
    paddingVertical: theme.spacing.lg,
    minHeight: 48,
  },
  fullWidth: {
    width: '100%',
  },
  disabled: {
    opacity: 0.5,
  },
});
