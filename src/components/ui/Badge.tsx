import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TextStyle,
} from 'react-native';
import { theme } from '../../constants';

type BadgeVariant = 'default' | 'secondary' | 'outline' | 'destructive';

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  style?: ViewStyle;
  textStyle?: TextStyle;
  onPress?: () => void;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'default',
  style,
  textStyle,
  onPress,
}) => {
  const badgeStyle = StyleSheet.flatten([
    styles.badge,
    styles[variant],
    style,
  ]);

  const textStyleFlattened = StyleSheet.flatten([
    styles.text,
    styles[`${variant}Text`],
    textStyle,
  ]);

  return (
    <View style={badgeStyle}>
      <Text style={textStyleFlattened}>{children}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: theme.fontSize.xs,
    fontWeight: theme.fontWeight.medium as any,
  },
  default: {
    backgroundColor: theme.colors.primary,
  },
  defaultText: {
    color: theme.colors.primaryForeground,
  },
  secondary: {
    backgroundColor: theme.colors.secondary,
  },
  secondaryText: {
    color: theme.colors.secondaryForeground,
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  outlineText: {
    color: theme.colors.foreground,
  },
  destructive: {
    backgroundColor: theme.colors.destructive,
  },
  destructiveText: {
    color: theme.colors.destructiveForeground,
  },
});
