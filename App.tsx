import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { HomeScreen, AddScreen, ProfileScreen } from './src/screens';
import { BottomNavigation, MemoryDetailModal } from './src/components';
import { MemoryItem, TabName } from './src/types';
import { theme } from './src/constants';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabName>('home');
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [memories, setMemories] = useState<MemoryItem[]>([
    {
      id: '1',
      title: 'AI-Powered Memory Management',
      content: 'Exploring how artificial intelligence can revolutionize personal knowledge management through semantic search and auto-categorization.',
      tags: ['ai', 'knowledge-management', 'productivity'],
      type: 'note',
      timestamp: new Date(),
    },
    {
      id: '2',
      title: 'React Native Best Practices',
      content: 'Key principles for building scalable and maintainable React Native applications with proper component architecture.',
      tags: ['development', 'react-native', 'best-practices'],
      type: 'note',
      timestamp: new Date(Date.now() - 86400000),
    },
    {
      id: '3',
      title: 'Design Systems in Mobile Apps',
      content: 'Creating consistent and reusable design tokens for cross-platform mobile applications.',
      tags: ['design', 'mobile', 'design-systems'],
      type: 'note',
      timestamp: new Date(Date.now() - 172800000),
    },
  ]);

  const handleTabChange = (tab: TabName) => {
    setActiveTab(tab);
  };

  const handleMemoryPress = (item: MemoryItem) => {
    setSelectedMemory(item);
  };

  const handleModalClose = () => {
    setSelectedMemory(null);
  };


  const renderScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <HomeScreen
            onTabChange={handleTabChange}
            onMemoryPress={handleMemoryPress}
          />
        );
      case 'add':
        return <AddScreen />;
      case 'profile':
        return <ProfileScreen />;
      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {renderScreen()}
      </View>
      <BottomNavigation activeTab={activeTab} onTabChange={handleTabChange} />
      <MemoryDetailModal
        visible={!!selectedMemory}
        item={selectedMemory}
        onClose={handleModalClose}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});
