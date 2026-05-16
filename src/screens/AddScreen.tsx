import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Input, Textarea, Button, Card, Badge } from '../components/ui';
import { theme } from '../constants';
import { SparklesIcon, PlusIcon, XIcon, SaveIcon, LinkIcon } from '../components/icons';

export const AddScreen: React.FC = () => {
  const [captureInput, setCaptureInput] = useState('');
  const [captureTitle, setCaptureTitle] = useState('');
  const [captureDescription, setCaptureDescription] = useState('');
  const [captureTags, setCaptureTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  const analyzeWithAI = async () => {
    if (!captureInput.trim()) return;

    setIsAnalyzing(true);

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Check if input is a URL
    const isURL = captureInput.match(/^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/);

    if (isURL) {
      setCaptureTitle('Amazing Article About AI and Memory Systems');
      setCaptureDescription('Explore how artificial intelligence is revolutionizing personal knowledge management and memory augmentation through semantic search and auto-categorization.');
      setCaptureTags(['ai', 'knowledge-management', 'productivity', 'article']);
    } else {
      const input = captureInput.toLowerCase();
      const suggestedTags = [];

      if (input.includes('meeting') || input.includes('discussion')) suggestedTags.push('meeting');
      if (input.includes('idea') || input.includes('thought')) suggestedTags.push('idea');
      if (input.includes('code') || input.includes('programming')) suggestedTags.push('development');
      if (input.includes('design') || input.includes('ui')) suggestedTags.push('design');
      if (!suggestedTags.length) suggestedTags.push('note', 'personal');

      setCaptureTitle(captureInput.slice(0, 60) + (captureInput.length > 60 ? '...' : ''));
      setCaptureDescription(captureInput);
      setCaptureTags(suggestedTags);
    }

    setIsAnalyzing(false);
    setHasAnalyzed(true);
  };

  const removeCaptureTag = (tagToRemove: string) => {
    setCaptureTags(captureTags.filter(tag => tag !== tagToRemove));
  };

  const addCaptureTag = () => {
    const tag = newTagInput.trim().toLowerCase();
    if (tag && !captureTags.includes(tag)) {
      setCaptureTags([...captureTags, tag]);
      setNewTagInput('');
    }
  };

  const saveCapture = () => {
    if (!captureTitle.trim()) {
      console.log('Please add a title');
      return;
    }

    console.log(`Memory saved!\n\nTitle: ${captureTitle}\nTags: ${captureTags.join(', ')}`);

    // Reset form
    setCaptureInput('');
    setCaptureTitle('');
    setCaptureDescription('');
    setCaptureTags([]);
    setHasAnalyzed(false);
  };

  const resetCaptureForm = () => {
    setCaptureInput('');
    setCaptureTitle('');
    setCaptureDescription('');
    setCaptureTags([]);
    setHasAnalyzed(false);
    setNewTagInput('');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.title}>Save Memory</Text>
          {hasAnalyzed && (
            <TouchableOpacity onPress={resetCaptureForm}>
              <Text style={styles.resetButton}>Reset</Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.subtitle}>Paste a link or write a note</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* Input Field */}
          <View>
            <Text style={styles.label}>Link or Content</Text>
            <Textarea
              placeholder="Paste a URL or type your note here..."
              value={captureInput}
              onChangeText={setCaptureInput}
              minHeight={100}
              disabled={hasAnalyzed}
            />
            {!hasAnalyzed && (
              <Button
                onPress={analyzeWithAI}
                disabled={!captureInput.trim() || isAnalyzing}
                variant="primary"
                fullWidth
                style={styles.analyzeButton}
              >
                {isAnalyzing ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#fff" size="small" />
                    <Text style={styles.buttonText}>Analyzing with AI...</Text>
                  </View>
                ) : (
                  <View style={styles.buttonContent}>
                    <SparklesIcon size={16} color="#fff" />
                    <Text style={styles.buttonText}>Analyze & Auto-Fill</Text>
                  </View>
                )}
              </Button>
            )}
          </View>

          {/* AI Generated Fields */}
          {hasAnalyzed && (
            <>
              <View style={styles.aiBanner}>
                <View style={styles.aiBannerContent}>
                  <SparklesIcon size={16} color={theme.colors.primary} />
                  <Text style={styles.aiBannerTitle}>AI Auto-filled</Text>
                </View>
                <Text style={styles.aiBannerText}>
                  Review and edit the details below before saving
                </Text>
              </View>

              {/* Title */}
              <View>
                <Text style={styles.label}>Title *</Text>
                <Input
                  placeholder="Enter title..."
                  value={captureTitle}
                  onChangeText={setCaptureTitle}
                />
              </View>

              {/* Description */}
              <View>
                <Text style={styles.label}>Description</Text>
                <Textarea
                  placeholder="Add a description..."
                  value={captureDescription}
                  onChangeText={setCaptureDescription}
                  minHeight={80}
                />
              </View>

              {/* Tags */}
              <View>
                <Text style={styles.label}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {captureTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => removeCaptureTag(tag)}
                      style={styles.tagButton}
                    >
                      <Badge variant="secondary" style={styles.tagBadge}>
                        <Text style={styles.tagText}>{tag}</Text>
                        <XIcon size={12} color={theme.colors.foreground} />
                      </Badge>
                    </TouchableOpacity>
                  ))}
                </View>
                <View style={styles.addTagRow}>
                  <Input
                    placeholder="Add new tag..."
                    value={newTagInput}
                    onChangeText={setNewTagInput}
                    onSubmitEditing={addCaptureTag}
                    containerStyle={styles.tagInput}
                  />
                  <Button
                    onPress={addCaptureTag}
                    disabled={!newTagInput.trim()}
                    variant="outline"
                    icon={<PlusIcon size={16} color={theme.colors.foreground} />}
                  />
                </View>
              </View>

              {/* Preview for URLs */}
              {captureInput.match(/^(https?:\/\/)/) && (
                <View>
                  <Text style={styles.label}>Preview</Text>
                  <Card padding={theme.spacing.md}>
                    <View style={styles.previewCard}>
                      <View style={styles.previewIcon}>
                        <LinkIcon size={24} color={theme.colors.mutedForeground} />
                      </View>
                      <View style={styles.previewContent}>
                        <Text style={styles.previewTitle} numberOfLines={2}>
                          {captureTitle}
                        </Text>
                        <Text style={styles.previewUrl} numberOfLines={1}>
                          {captureInput}
                        </Text>
                      </View>
                    </View>
                  </Card>
                </View>
              )}

              {/* Save Button */}
              <Button
                onPress={saveCapture}
                variant="primary"
                fullWidth
                style={styles.saveButton}
              >
                <SaveIcon size={16} color="#fff" />
                <Text style={styles.buttonText}>Save Memory</Text>
              </Button>
            </>
          )}
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
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
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
    color: theme.colors.foreground,
  },
  resetButton: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium as any,
  },
  subtitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.mutedForeground,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: theme.spacing.xl,
    paddingTop: theme.spacing.lg,
    paddingBottom: theme.spacing.xl,
  },
  form: {
    gap: theme.spacing.xl,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.sm,
  },
  analyzeButton: {
    marginTop: theme.spacing.md,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  buttonText: {
    color: '#fff',
    fontSize: theme.fontSize.base,
    fontWeight: theme.fontWeight.medium as any,
  },
  aiBanner: {
    backgroundColor: theme.colors.accent,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
  },
  aiBannerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
    marginBottom: theme.spacing.xs,
  },
  aiBannerTitle: {
    fontSize: theme.fontSize.sm,
    color: theme.colors.primary,
    fontWeight: theme.fontWeight.medium as any,
  },
  aiBannerText: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.md,
  },
  tagButton: {
    flexDirection: 'row',
  },
  tagBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.xs,
  },
  tagText: {
    fontSize: theme.fontSize.sm,
  },
  addTagRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
  },
  tagInput: {
    flex: 1,
    marginBottom: 0,
  },
  previewCard: {
    flexDirection: 'row',
    gap: theme.spacing.md,
  },
  previewIcon: {
    width: 64,
    height: 64,
    backgroundColor: theme.colors.muted,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContent: {
    flex: 1,
  },
  previewTitle: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
    color: theme.colors.foreground,
    marginBottom: theme.spacing.xs,
  },
  previewUrl: {
    fontSize: theme.fontSize.xs,
    color: theme.colors.mutedForeground,
  },
  saveButton: {
    marginTop: theme.spacing.md,
    height: 48,
  },
});
