import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Input, Card } from '../components/ui';
import { MemoryCard } from '../components/MemoryCard';
import { theme } from '../constants';
import { MemoryItem, TabName } from '../types';
import { SparklesIcon } from '../components/icons';

interface HomeScreenProps {
  onTabChange: (tab: TabName) => void;
  onMemoryPress: (item: MemoryItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onTabChange,
  onMemoryPress,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');

  // Mock memory items
  const [memories] = useState<MemoryItem[]>([
    {
      id: '1',
      type: 'note',
      title: 'React Native Performance Tips',
      content: 'Use FlatList instead of ScrollView for long lists. Implement shouldComponentUpdate or React.memo to prevent unnecessary re-renders.',
      tags: ['development', 'react-native', 'performance'],
      timestamp: new Date('2026-05-15'),
    },
    {
      id: '2',
      type: 'link',
      title: 'AI Design Patterns 2026',
      content: 'Comprehensive guide to modern AI design patterns',
      tags: ['ai', 'design', 'learning'],
      timestamp: new Date('2026-05-14'),
      url: 'https://example.com/ai-patterns',
      preview: 'Learn the latest AI integration patterns for modern applications...',
    },
    {
      id: '3',
      type: 'image',
      title: 'UI Inspiration - Dashboard',
      content: 'Beautiful dashboard design with data visualization',
      tags: ['design', 'ui', 'inspiration'],
      timestamp: new Date('2026-05-13'),
      preview: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400',
    },
    {
      id: '4',
      type: 'note',
      title: 'Meeting Notes - Product Review',
      content: 'Discussed new features for Q3: semantic search, auto-categorization, and improved mobile UX. Priority on search performance.',
      tags: ['meeting', 'product', 'notes'],
      timestamp: new Date('2026-05-12'),
    },
    {
      id: '5',
      type: 'link',
      title: 'Tailwind CSS v4 Updates',
      content: 'New features and breaking changes in Tailwind v4',
      tags: ['css', 'tailwind', 'web-development'],
      timestamp: new Date('2026-05-11'),
      url: 'https://tailwindcss.com/blog/v4',
    },
  ]);

  const filteredMemories = searchQuery
    ? memories.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : memories;

  const handleQuickCapture = () => {
    if (quickInput.trim()) {
      // Simulate AI processing with auto-generated tags
      console.log(`Captured: "${quickInput}"`);
      setQuickInput('');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>MemoryGraph</Text>
        <Text style={styles.subtitle}>Your intelligent memory space</Text>
      </View>

      {/* Quick Capture */}
      <View style={styles.quickCaptureSection}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Save a thought, link, or idea..."
            placeholderTextColor={theme.colors.mutedForeground}
            value={quickInput}
            onChangeText={setQuickInput}
            onSubmitEditing={handleQuickCapture}
          />
          <TouchableOpacity
            onPress={handleQuickCapture}
            style={styles.sparkleButton}
          >
            <SparklesIcon size={20} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>
        <View style={styles.aiHint}>
          <SparklesIcon size={12} color={theme.colors.mutedForeground} />
          <Text style={styles.aiHintText}>AI auto-categorization enabled</Text>
        </View>
      </View>

      {/* Memory Feed */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.memoriesList}>
          {filteredMemories.map((item) => (
            <MemoryCard
              key={item.id}
              item={item}
              onPress={() => onMemoryPress(item)}
            />
          ))}
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
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  quickCaptureSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.inputBackground,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.border,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
    color: theme.colors.foreground,
  },
  sparkleButton: {
    padding: theme.spacing.sm,
  },
  aiHint: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginTop: theme.spacing.sm,
  },
  aiHintText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.xl,
  },
  memoriesList: {
    gap: theme.spacing.md,
  },
});
