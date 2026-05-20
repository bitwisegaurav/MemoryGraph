import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from 'react-native';
import { Modal, Input, Button, Badge } from './ui';
import { theme } from '../constants';
import { MemoryItem } from '../types';
import { EditIcon, SaveIcon, PlusIcon, XIcon, LinkIcon, TrashIcon } from './icons';
import { memoryStorage } from '../utils/mmkv';

interface MemoryDetailModalProps {
  visible: boolean;
  item: MemoryItem | null;
  onClose: () => void;
}

export const MemoryDetailModal: React.FC<MemoryDetailModalProps> = ({
  visible,
  item,
  onClose,
}) => {
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [editedTags, setEditedTags] = useState<string[]>([]);

  React.useEffect(() => {
    if (item) {
      setEditedTitle(item.title);
      setEditedContent(item.content);
      setEditedTags([...item.tags]);
      setEditMode(false);
    }
  }, [item]);

  const saveEdits = () => {
    if (item) {
      const updatedItem: MemoryItem = {
        ...item,
        title: editedTitle,
        content: editedContent,
        tags: editedTags,
      };
      memoryStorage.saveMemory(updatedItem);
      setEditMode(false);
    }
  };

  const handleDelete = () => {
    if (item) {
      memoryStorage.deleteMemory(item.id);
      onClose();
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const addTag = () => {
    const newTag = 'new-tag'; // In real app, use prompt or input
    if (!editedTags.includes(newTag.toLowerCase())) {
      setEditedTags([...editedTags, newTag.toLowerCase()]);
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} onClose={onClose} title="Memory Details">
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {editMode ? (
          <View style={styles.editSection}>
            <Text style={styles.label}>Title</Text>
            <Input
              value={editedTitle}
              onChangeText={setEditedTitle}
            />
          </View>
        ) : (
          <View style={styles.viewSection}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.contentText}>{item.content}</Text>
          </View>
        )}

        {item.preview && item.type === 'image' && (
          <Image
            source={{ uri: item.preview }}
            style={styles.previewImage}
            resizeMode="cover"
          />
        )}

        {item.url && (
          <TouchableOpacity style={styles.urlLink}>
            <LinkIcon size={12} color={theme.colors.primary} />
            <Text style={styles.urlText}>{item.url}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.tagsSection}>
          <View style={styles.tagsHeader}>
            <Text style={styles.label}>Tags</Text>
            {editMode && (
              <TouchableOpacity onPress={addTag}>
                <PlusIcon size={16} color={theme.colors.foreground} />
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.tagsContainer}>
            {editMode ? (
              editedTags.map((tag) => (
                <TouchableOpacity
                  key={tag}
                  onPress={() => removeTag(tag)}
                >
                  <Badge variant="secondary" style={styles.tagBadge}>
                    <Text style={styles.tagText}>{tag}</Text>
                    <XIcon size={12} color={theme.colors.foreground} />
                  </Badge>
                </TouchableOpacity>
              ))
            ) : (
              item.tags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            )}
          </View>
        </View>

        <Text style={styles.date}>
          Saved on {new Date(item.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.actions}>
          {!editMode ? (
            <>
              <Button
                onPress={() => setEditMode(true)}
                variant="outline"
                icon={<EditIcon size={16} color={theme.colors.foreground} />}
                style={{ flex: 1 }}
              />
              <Button
                onPress={handleDelete}
                variant="outline"
                icon={<TrashIcon size={16} color={theme.colors.destructive || '#ef4444'} />}
                style={{ flex: 1 }}
              />
            </>
          ) : (
            <Button
              onPress={saveEdits}
              variant="outline"
              icon={<SaveIcon size={16} color={theme.colors.foreground} />}
              fullWidth
            />
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  content: {
    maxHeight: 500,
  },
  editSection: {
    marginBottom: theme.spacing.lg,
  },
  viewSection: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
    lineHeight: theme.lineHeight.normal,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  previewImage: {
    width: '100%',
    height: 192,
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.lg,
  },
  urlLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.lg,
  },
  urlText: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
  },
  tagsSection: {
    marginBottom: theme.spacing.lg,
  },
  tagsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: theme.spacing.sm,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tagText: {
    fontSize: theme.fontSize.xs,
  },
  date: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
    marginBottom: theme.spacing.lg,
  },
  actions: {
    gap: theme.spacing.sm,
  },
});
