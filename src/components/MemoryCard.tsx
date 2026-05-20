import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Card, Badge } from './ui';
import { theme } from '../constants';
import { MemoryItem } from '../types';
import { FileTextIcon, LinkIcon, ImageIcon } from './icons';
import Feather from '@expo/vector-icons/Feather';
import { memoryStorage } from '../utils/mmkv';
import { useTheme } from '../contexts/ThemeContext';

interface MemoryCardProps {
  item: MemoryItem;
  onPress: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ item, onPress }) => {
  const { colors } = useTheme();

  const getTypeIcon = () => {
    switch (item.type) {
      case 'link':
        return <LinkIcon size={16} color={theme.colors.mutedForeground} />;
      case 'image':
        return <ImageIcon size={16} color={theme.colors.mutedForeground} />;
      case 'file':
        return <FileTextIcon size={16} color={theme.colors.mutedForeground} />;
      default:
        return <FileTextIcon size={16} color={theme.colors.mutedForeground} />;
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card onPress={onPress} padding={theme.spacing.md}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          {getTypeIcon()}
        </View>
        <View style={styles.content}>
          <View style={styles.titleContainer}>
            <Text style={[styles.title, { color: colors.foreground }]} numberOfLines={2}>
              {item.title}
            </Text>
          </View>
          <Text style={[styles.description, { color: colors.mutedForeground }]} numberOfLines={2}>
            {item.content}
          </Text>
          {item.preview && item.type === 'image' && (
            <Image
              source={{ uri: item.preview }}
              style={styles.previewImage}
              resizeMode="cover"
            />
          )}
          <View style={styles.tagsContainer}>
            {item.tags.map((tag) => (
              <Badge key={tag} variant="secondary" style={{ backgroundColor: colors.muted }}>
                {tag}
              </Badge>
            ))}
          </View>
          <Text style={styles.date}>
            {formatDate(new Date(item.timestamp))}
          </Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  iconContainer: {
    marginTop: 2,
  },
  content: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: theme.spacing.xs,
  },
  title: {
    flex: 1,
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
  },
  moreButton: {
    padding: theme.spacing.xs,
    marginRight: -theme.spacing.xs,
    marginTop: -theme.spacing.xs,
  },
  description: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.sm,
  },
  previewImage: {
    width: '100%',
    height: 128,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.sm,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
});
