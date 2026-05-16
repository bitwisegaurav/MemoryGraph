import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { theme } from '../constants';
import { TabName } from '../types';
import { HomeIcon, PlusIcon, UserIcon } from './icons';

interface BottomNavigationProps {
  activeTab: TabName;
  onTabChange: (tab: TabName) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs: { key: TabName; label: string; icon: React.ReactNode }[] = [
    { key: 'home', label: 'Home', icon: <HomeIcon /> },
    { key: 'add', label: 'Add', icon: <PlusIcon /> },
    { key: 'profile', label: 'Profile', icon: <UserIcon /> },
  ];

  return (
    <View style={styles.container}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          onPress={() => onTabChange(tab.key)}
          style={styles.tab}
          activeOpacity={0.7}
        >
          <View style={[
            styles.iconContainer,
            activeTab === tab.key && styles.iconActive
          ]}>
            {React.cloneElement(tab.icon as React.ReactElement, {
              size: 20,
              color: activeTab === tab.key ? theme.colors.primary : theme.colors.mutedForeground,
            })}
          </View>
          <Text style={[
            styles.label,
            activeTab === tab.key && styles.labelActive
          ]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    backgroundColor: theme.colors.background,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    height: 64,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.xs,
  },
  iconContainer: {
    padding: theme.spacing.xs,
  },
  iconActive: {
    // Additional active state styling if needed
  },
  label: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  labelActive: {
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium as any,
  },
});
