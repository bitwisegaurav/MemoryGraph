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
import { MemoryItem } from '../../src/types';
import { SparklesIcon } from '@components/icons';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@contexts/ThemeContext';
import { useMemories, memoryStorage } from '../../src/utils/mmkv';
import { MemoryDetailModal } from '../../src/components/MemoryDetailModal';

export default function HomeScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const memories = useMemories();
  const [searchQuery, setSearchQuery] = useState('');
  const [quickInput, setQuickInput] = useState('');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const filteredMemories = searchQuery
    ? memories.filter(m =>
        m.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        m.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : memories;

  const handleQuickCapture = () => {
    if (quickInput.trim()) {
      const newMemory: MemoryItem = {
        id: Date.now().toString(),
        type: 'note',
        title: quickInput.slice(0, 40) + (quickInput.length > 40 ? '...' : ''),
        content: quickInput,
        tags: ['quick-capture'],
        timestamp: new Date().toISOString(),
      };
      
      memoryStorage.saveMemory(newMemory);
      setQuickInput('');
    }
  };

  const handleMemoryPress = (item: MemoryItem) => {
    setSelectedMemory(item);
    setModalVisible(true);
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

      <MemoryDetailModal
        visible={modalVisible}
        item={selectedMemory}
        onClose={() => {
          setModalVisible(false);
          setSelectedMemory(null);
        }}
      />
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
