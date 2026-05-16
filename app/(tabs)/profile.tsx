import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Card, Button } from '@components/ui';
import { theme } from '@constants/index';

export default function ProfileScreen() {
  const totalMemories = 5;
  const tagsCreated = 12;
  const thisWeek = 3;

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Profile</Text>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>MG</Text>
          </View>
          <Text style={styles.name}>Memory User</Text>
          <Text style={styles.email}>memory@graph.app</Text>
        </View>

        {/* Stats */}
        <View style={styles.statsSection}>
          <Card padding={theme.spacing.md}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Total Memories</Text>
              <Text style={styles.statValue}>{totalMemories}</Text>
            </View>
          </Card>
          <Card padding={theme.spacing.md}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>Tags Created</Text>
              <Text style={styles.statValue}>{tagsCreated}</Text>
            </View>
          </Card>
          <Card padding={theme.spacing.md}>
            <View style={styles.statRow}>
              <Text style={styles.statLabel}>This Week</Text>
              <Text style={styles.statValue}>{thisWeek} new</Text>
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
    backgroundColor: theme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xl,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: theme.colors.primary,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  avatarText: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.primaryForeground,
  },
  name: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  email: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
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
    color: theme.colors.foreground,
  },
  statValue: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.primary,
  },
  actionsSection: {
    gap: theme.spacing.sm,
  },
  actionButton: {
    justifyContent: 'flex-start',
  },
});
