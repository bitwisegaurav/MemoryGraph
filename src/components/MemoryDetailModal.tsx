import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
  Linking,
} from 'react-native';
import { Modal, Input, Button, Badge, Textarea } from './ui';
import { theme } from '../constants';
import { MemoryItem } from '../types';
import Feather from '@expo/vector-icons/Feather';
import { memoryStorage } from '../utils/mmkv';
import { useTheme } from '../contexts/ThemeContext';

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
  const { colors } = useTheme();
  const [editMode, setEditMode] = useState(false);
  const [editedTitle, setEditedTitle] = useState(item?.title || '');
  const [editedContent, setEditedContent] = useState(item?.content || '');
  const [editedTags, setEditedTags] = useState<string[]>(item?.tags || []);
  const [newTagInput, setNewTagInput] = useState('');

  React.useEffect(() => {
    if (item) {
      setEditedTitle(item.title);
      setEditedContent(item.content);
      setEditedTags([...item.tags]);
      setEditMode(false);
      setNewTagInput('');
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
      Alert.alert(
        'Delete Memory',
        'Are you sure you want to delete this memory?',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            onPress: () => {
              memoryStorage.deleteMemory(item.id);
              onClose();
            },
            style: 'destructive',
          },
        ]
      );
    }
  };

  const removeTag = (tagToRemove: string) => {
    setEditedTags(editedTags.filter(tag => tag !== tagToRemove));
  };

  const addTag = () => {
    const tag = newTagInput.trim().toLowerCase();
    if (tag && !editedTags.includes(tag)) {
      setEditedTags([...editedTags, tag]);
      setNewTagInput('');
    }
  };

  const handleUrlPress = async () => {
    if (item?.url) {
      const canOpen = await Linking.canOpenURL(item.url);
      if (canOpen) {
        await Linking.openURL(item.url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    }
  };

  if (!item) return null;

  return (
    <Modal visible={visible} onClose={onClose} title={editMode ? 'Edit Memory' : 'Memory Details'}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {editMode ? (
          <View style={styles.editSection}>
            <Text style={[styles.label, { color: colors.foreground }]}>Title</Text>
            <Input
              value={editedTitle}
              onChangeText={setEditedTitle}
              placeholder="Enter title..."
            />
            <Text style={[styles.label, { color: colors.foreground, marginTop: theme.spacing.md }]}>Description</Text>
            <Textarea
              value={editedContent}
              onChangeText={setEditedContent}
              placeholder="Add a description..."
              minHeight={120}
              multiline
              numberOfLines={7}
            />
          </View>
        ) : (
          <View style={styles.viewSection}>
            <Text style={[styles.title, { color: colors.foreground }]}>{editedTitle}</Text>
            <Text style={[styles.contentText, { color: colors.mutedForeground }]}>{editedContent}</Text>
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
          <TouchableOpacity style={styles.urlLink} onPress={handleUrlPress}>
            <Feather name="link" size={14} color={colors.primary} />
            <Text style={[styles.urlText, { color: colors.primary }]}>{item.url}</Text>
          </TouchableOpacity>
        )}

        <View style={styles.tagsSection}>
          <Text style={[styles.label, { color: colors.foreground }]}>Tags</Text>
          <View style={styles.tagsContainer}>
            {editMode ? (
              <>
                {editedTags.map((tag) => (
                  <TouchableOpacity
                    key={tag}
                    onPress={() => removeTag(tag)}
                  >
                    <Badge variant="secondary" style={styles.tagBadge} childrenType="children">
                      <Text style={[styles.tagText, { color: colors.foreground }]}>{tag}</Text>
                      <Feather name="x" size={12} color={colors.foreground} />
                    </Badge>
                  </TouchableOpacity>
                ))}
              </>
            ) : (
              editedTags.map((tag) => (
                <Badge key={tag} variant="secondary">
                  {tag}
                </Badge>
              ))
            )}
          </View>

          {editMode && (
            <View style={styles.addTagRow}>
              <Input
                placeholder="Add new tag..."
                value={newTagInput}
                onChangeText={setNewTagInput}
                onSubmitEditing={addTag}
                containerStyle={styles.tagInput}
              />
              <Button
                onPress={addTag}
                disabled={!newTagInput.trim()}
                variant="outline"
                icon={<Feather name="plus" size={16} color={colors.foreground} />}
              />
            </View>
          )}
        </View>

        <Text style={[styles.date, { color: colors.mutedForeground }]}>
          Saved on {new Date(item.timestamp).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </Text>

        <View style={styles.actions}>
          {!editMode ? (
            <View style={styles.actionRow}>
              <Button
                onPress={() => setEditMode(true)}
                variant="outline"
                icon={<Feather name="edit-2" size={16} color={colors.foreground} />}
                style={{ flex: 1 }}
              >
                <Text style={{ color: colors.foreground, marginLeft: theme.spacing.xs }}>Edit</Text>
              </Button>
              <Button
                onPress={handleDelete}
                variant="outline"
                icon={<Feather name="trash-2" size={16} color={theme.colors.destructive || '#ef4444'} />}
                style={{ flex: 1 }}
              >
                <Text style={{ color: theme.colors.destructive || '#ef4444', marginLeft: theme.spacing.xs }}>Delete</Text>
              </Button>
            </View>
          ) : (
            <View style={styles.actionRow}>
              <Button
                onPress={() => setEditMode(false)}
                variant="outline"
                style={{ flex: 1 }}
              >
                <Text style={{ color: colors.foreground }}>Cancel</Text>
              </Button>
              <Button
                onPress={saveEdits}
                variant="primary"
                icon={<Feather name="save" size={16} color="#FFFFFF" />}
                style={{ flex: 1, backgroundColor: colors.primary }}
              >
                <Text style={{ color: '#FFFFFF', marginLeft: theme.spacing.xs }}>Save</Text>
              </Button>
            </View>
          )}
        </View>
      </ScrollView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    maxHeight: '95%'
  },
  scrollContent: {
    paddingBottom: theme.spacing.xl,
  },
  editSection: {
    marginBottom: theme.spacing.lg,
  },
  viewSection: {
    marginBottom: theme.spacing.lg,
  },
  title: {
    fontSize: theme.fontSize.lg,
    fontWeight: theme.fontWeight.bold as any,
    marginBottom: theme.spacing.sm,
  },
  contentText: {
    fontSize: theme.fontSize.base,
    lineHeight: theme.lineHeight.normal * theme.fontSize.base,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
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
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.accent,
    borderRadius: theme.borderRadius.sm,
  },
  urlText: {
    fontSize: theme.fontSize.sm,
    flex: 1,
  },
  tagsSection: {
    marginBottom: theme.spacing.lg,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.md,
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    paddingVertical: 4,
  },
  tagText: {
    fontSize: theme.fontSize.xs,
  },
  addTagRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    alignItems: 'center',
  },
  tagInput: {
    flex: 1,
    marginBottom: 0,
  },
  date: {
    fontSize: theme.fontSize.xs,
    marginBottom: theme.spacing.xl,
  },
  actions: {
    marginTop: theme.spacing.md,
  },
  actionRow: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
});
