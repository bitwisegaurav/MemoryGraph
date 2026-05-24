import React from 'react';
import {
  TextInput,
  View,
  Text,
  StyleSheet,
  TextInputProps,
  ViewStyle,
} from 'react-native';
import { theme } from '../../constants';
import { useTheme } from '../../contexts/ThemeContext';

interface TextareaProps extends TextInputProps {
  label?: string;
  error?: string;
  containerStyle?: ViewStyle;
  minHeight?: number;
  disabled?: boolean;
}

export const Textarea: React.FC<TextareaProps> = ({
  label,
  error,
  containerStyle,
  minHeight = 100,
  disabled = false,
  style,
  ...props
}) => {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <Text style={[styles.label, { color: colors.foreground }]}>
          {label}
        </Text>
      )}
      <TextInput
        style={[
          styles.textarea,
          {
            minHeight,
            backgroundColor: colors.inputBackground,
            borderColor: error ? colors.destructive : colors.border,
            color: colors.foreground,
          },
          disabled && styles.textareaDisabled,
          style,
        ]}
        placeholderTextColor={colors.mutedForeground}
        multiline
        textAlignVertical="top"
        editable={!disabled}
        {...props}
      />
      {error && (
        <Text style={[styles.errorText, { color: colors.destructive }]}>
          {error}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: theme.spacing.md,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
    marginBottom: theme.spacing.sm,
  },
  textarea: {
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    fontSize: theme.fontSize.base,
  },
  textareaDisabled: {
    opacity: 0.5,
  },
  errorText: {
    fontSize: theme.fontSize.xs,
    marginTop: theme.spacing.xs,
  },
});
