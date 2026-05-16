import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Card, Button } from '@components/ui';
import { theme } from '@constants/index';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@contexts/ThemeContext';

export default function ProfileScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const totalMemories = 5;
  const tagsCreated = 12;
  const thisWeek = 3;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={[styles.title, { color: colors.foreground }]}>Profile</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Feather name={isDark ? 'sun' : 'moon'} size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>MG</Text>
          </View>
          <Text style={[styles.name, { color: colors.foreground }]}>Memory User</Text>
          <Text style={[styles.email, { color: colors.mutedForeground }]}>memory@graph.app</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Card padding={theme.spacing.md}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.foreground }]}>Total Memories</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{totalMemories}</Text>
            </View>
          </Card>
          <Card padding={theme.spacing.md}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.foreground }]}>Tags Created</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{tagsCreated}</Text>
            </View>
          </Card>
          <Card padding={theme.spacing.md}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.foreground }]}>This Week</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>{thisWeek} new</Text>
            </View>
          </Card>
        </View>

        {/* Actions */}
        <View style={styles.actionsSection}>
          <Button
            title="Settings"
            onPress={() => console.log('Settings')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Export Data"
            onPress={() => console.log('Export Data')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
          <Button
            title="Help & Support"
            onPress={() => console.log('Help & Support')}
            variant="outline"
            fullWidth
            style={styles.actionButton}
          />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
  },
  themeToggle: {
    padding: theme.spacing.sm,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
  },
  name: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fontSize.sm,
  },
  statsSection: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.xl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: theme.fontSize.sm,
  },
  statValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold as any,
  },
  actionsSection: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    justifyContent: 'flex-start',
  },
});
