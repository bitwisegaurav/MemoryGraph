import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import { Input, Card } from '@components/ui';
import { MemoryCard } from '@components/MemoryCard';
import { theme } from '@constants/index';
import { MemoryItem } from '@types/index';
import { SparklesIcon } from '@components/icons';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@contexts/ThemeContext';

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
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

  const handleMemoryPress = (item: MemoryItem) => {
    console.log('Memory pressed:', item.id);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.foreground }]}>MemoryGraph</Text>
          <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
            <Feather name={isDark ? 'sun' : 'moon'} size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Your intelligent memory space</Text>
      </View>

      {/* Quick Capture */}
      <View style={styles.quickCaptureSection}>
        <View style={[styles.inputContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
          <TextInput
            style={[styles.searchInput, { color: colors.foreground }]}
            placeholder="Save a thought, link, or idea..."
            placeholderTextColor={colors.mutedForeground}
            value={quickInput}
            onChangeText={setQuickInput}
            onSubmitEditing={handleQuickCapture}
          />
          <TouchableOpacity
            onPress={handleQuickCapture}
            style={styles.sparkleButton}
          >
            <Feather name="search" size={20} color={colors.foreground} />
          </TouchableOpacity>
        </View>
        <View style={styles.aiHint}>
          <SparklesIcon size={12} color={colors.mutedForeground} />
          <Text style={[styles.aiHintText, { color: colors.mutedForeground }]}>AI auto-categorization enabled</Text>
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
              onPress={() => handleMemoryPress(item)}
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
  },
  header: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.xs,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
    marginBottom: theme.spacing.xs,
  },
  themeToggle: {
    padding: theme.spacing.sm,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
  },
  quickCaptureSection: {
    paddingHorizontal: theme.spacing.xl,
    paddingBottom: theme.spacing.md,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    paddingHorizontal: theme.spacing.md,
    height: 48,
  },
  searchInput: {
    flex: 1,
    fontSize: theme.fontSize.base,
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
