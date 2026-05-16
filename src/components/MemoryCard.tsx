import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Card, Badge } from './ui';
import { theme } from '../constants';
import { MemoryItem } from '../types';
import { FileTextIcon, LinkIcon, ImageIcon } from './icons';

interface MemoryCardProps {
  item: MemoryItem;
  onPress: () => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ item, onPress }) => {
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
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.description} numberOfLines={2}>
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
              <Badge key={tag} variant="secondary">
                {tag}
              </Badge>
            ))}
          </View>
          <Text style={styles.date}>
            {formatDate(item.timestamp)}
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
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
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
