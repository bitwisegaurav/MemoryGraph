import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Switch,
  Linking,
  Alert,
} from 'react-native';
import { Input, Textarea, Button, Card, Badge } from '@components/ui';
import { theme, URL_REGEX } from '@constants/index';
import { SparklesIcon, PlusIcon, XIcon, SaveIcon, LinkIcon } from '@components/icons';
import AntDesign from '@expo/vector-icons/AntDesign';
import Feather from '@expo/vector-icons/Feather';
import { useTheme } from '@contexts/ThemeContext';
import { memoryStorage } from '../../src/utils/mmkv';
import { MemoryItem } from '../../src/types';
import { useRouter } from 'expo-router';
import ai from '@/src/services/ai/ai';
import { fetchPartialHtml } from '@/src/utils/helpers';
import { Type } from '@google/genai';

export default function AddScreen() {
  const router = useRouter();
  const { colors, isDark, toggleTheme } = useTheme();
  const [captureInput, setCaptureInput] = useState('');
  const [captureTitle, setCaptureTitle] = useState('');
  const [captureDescription, setCaptureDescription] = useState('');
  const [captureTags, setCaptureTags] = useState<string[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);
  const [shouldUseAI, setShouldUseAI] = useState(true);
  const [newTagInput, setNewTagInput] = useState('');
  const scrollViewRef = useRef<ScrollView>(null);

  const toggleAISwitch = () => {
    const newValue = !shouldUseAI;
    setShouldUseAI(newValue);
    if (!newValue) {
      setHasAnalyzed(true);
    } else {
      setHasAnalyzed(false);
    }
  };

  async function getAIResponse(prompt: string) {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            success: { type: Type.BOOLEAN },
            error: { type: Type.STRING }
          },
          required: ["title", "description", "tags"],
        }
      }
    });
    if (!response.text?.trim() || response.text.length < 2) return { properties: { success: false, error: 'No response from AI' } };
    return JSON.parse(response.text || '{}');
  }

  const analyzeWithAI = async () => {
    if (!captureInput.trim()) return;

    setIsAnalyzing(true);
    try {
      const isURL = captureInput.match(URL_REGEX) !== null;
      let contentToAnalyze = captureInput;

      if (isURL) {
        try {
          const fetchedContent = await fetchPartialHtml(captureInput.trim());
          contentToAnalyze = fetchedContent || captureInput;
        } catch (error) {
          console.error('Failed to fetch HTML, falling back to raw input:', error);
        }
      }

      const prompt = `
        Analyze the following content and provide a title, a short description, and 3-5 relevant tags.
        Content: ${contentToAnalyze}
        
        If it's a URL, use the context of the website content.
        Respond in JSON format with title, description, and tags.
      `;

      const aiResponse = await getAIResponse(prompt);

      if (aiResponse && aiResponse.title) {
        setCaptureTitle(aiResponse.title);
        setCaptureDescription(aiResponse.description || '');
        setCaptureTags(aiResponse.tags || []);
        scrollViewRef.current?.scrollTo(0);
      } else {
        throw new Error('Invalid AI response');
      }
    } catch (error) {
      console.error('Error analyzing with AI:', error);
      // On error, set hasAnalyzed to true so user can fill manually
      setCaptureTitle(captureInput.slice(0, 40) + (captureInput.length > 40 ? '...' : ''));
      setCaptureDescription(captureInput);
    } finally {
      setIsAnalyzing(false);
      setHasAnalyzed(true);
    }
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

    const isURL = captureInput.match(/^(https?:\/\/)/);

    const newMemory: MemoryItem = {
      id: Date.now().toString(),
      type: isURL ? 'link' : 'note',
      title: captureTitle,
      content: captureDescription || captureInput,
      tags: captureTags,
      timestamp: new Date().toISOString(),
      url: isURL ? captureInput : undefined,
    };

    memoryStorage.saveMemory(newMemory);

    // Reset form
    setCaptureInput('');
    setCaptureTitle('');
    setCaptureDescription('');
    setCaptureTags([]);
    setHasAnalyzed(false);

    // Navigate back to home
    router.replace('/');
  };

  const resetCaptureForm = () => {
    setCaptureInput('');
    setCaptureTitle('');
    setCaptureDescription('');
    setCaptureTags([]);
    setHasAnalyzed(false);
    setNewTagInput('');
  };

  const handlePreviewPress = async () => {
    const isURL = captureInput.match(URL_REGEX) !== null;
    if (isURL) {
      const url = captureInput.trim();
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', 'Cannot open this URL');
      }
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.foreground }]}>Save Memory</Text>
          <View style={styles.headerActions}>
            <TouchableOpacity onPress={toggleTheme} style={styles.themeToggle}>
              <Feather name={isDark ? 'sun' : 'moon'} size={20} color={colors.foreground} />
            </TouchableOpacity>
            {hasAnalyzed && (
              <TouchableOpacity onPress={resetCaptureForm}>
                <Text style={[styles.resetButton, { color: colors.primary }]}>Reset</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Paste a link or write a note</Text>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.form}>
          {/* AI Toggle */}
          <View style={[styles.toggleContainer, { backgroundColor: colors.inputBackground, borderColor: colors.border }]}>
            <View style={styles.toggleTextContainer}>
              <Text style={[styles.toggleLabel, { color: colors.foreground }]}>Should search with ai?</Text>
              <Text style={[styles.toggleSublabel, { color: colors.mutedForeground }]}>Auto-fill details using AI analysis</Text>
            </View>
            <Switch
              value={shouldUseAI}
              onValueChange={toggleAISwitch}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          {/* Input Field */}
          <View>
            <Text style={[styles.label, { color: colors.foreground }]}>Link or Content</Text>
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
                    <AntDesign name="open-ai" size={20} color="white" />
                    <Text style={styles.buttonText}>Analyze & Auto-Fill</Text>
                  </View>
                )}
              </Button>
            )}
          </View>

          {/* AI Generated Fields */}
          {hasAnalyzed && (
            <>
              {shouldUseAI && (
                <View style={styles.aiBanner}>
                  <View style={styles.aiBannerContent}>
                    <SparklesIcon size={16} color={theme.colors.primary} />
                    <Text style={styles.aiBannerTitle}>AI Auto-filled</Text>
                  </View>
                  <Text style={styles.aiBannerText}>
                    Review and edit the details below before saving
                  </Text>
                </View>
              )}

              {/* Title */}
              <View>
                <Text style={[styles.label, { color: colors.foreground }]}>Title *</Text>
                <Input
                  placeholder="Enter title..."
                  value={captureTitle}
                  onChangeText={setCaptureTitle}
                />
              </View>

              {/* Description */}
              <View>
                <Text style={[styles.label, { color: colors.foreground }]}>Description</Text>
                <Textarea
                  placeholder="Add a description..."
                  value={captureDescription}
                  onChangeText={setCaptureDescription}
                  minHeight={80}
                />
              </View>

              {/* Tags */}
              <View>
                <Text style={[styles.label, { color: colors.foreground }]}>Tags</Text>
                <View style={styles.tagsContainer}>
                  {captureTags.map((tag) => (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => removeCaptureTag(tag)}
                      style={styles.tagButton}
                    >
                      <Badge variant="secondary" style={styles.tagBadge} childrenType="children">
                        <Text style={styles.tagText}>{tag}</Text>
                        <View>
                          <Feather name="x" size={12} color={theme.colors.foreground} />
                        </View>
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
                    icon={<Feather name='plus' size={16} color={theme.colors.foreground} />}
                  />
                </View>

                {/* Preview for URLs */}
                {captureInput.match(URL_REGEX) && (
                  <View>
                    <Text style={[styles.label, { color: colors.foreground }]}>Preview</Text>
                    <Card padding={theme.spacing.md} onPress={handlePreviewPress}>
                      <View style={styles.previewCard}>
                        <View style={styles.previewIcon}>
                          <Feather name="link" size={24} color={colors.mutedForeground} />
                        </View>
                        <View style={styles.previewContent}>
                          <Text style={[styles.previewTitle, { color: colors.foreground }]} numberOfLines={2}>
                            {captureTitle || captureInput}
                          </Text>
                          <Text style={[styles.previewUrl, { color: colors.mutedForeground }]} numberOfLines={1}>
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
                  <Text style={styles.buttonText}>Save</Text>
                </Button>
              </View>
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
  },
  title: {
    fontSize: theme.fontSize['2xl'],
    fontWeight: theme.fontWeight.bold as any,
  },
  themeToggle: {
    padding: theme.spacing.sm,
  },
  resetButton: {
    fontSize: theme.fontSize.sm,
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
  toggleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
  },
  toggleTextContainer: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  toggleLabel: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
    marginBottom: 2,
  },
  toggleSublabel: {
    fontSize: theme.fontSize.xs,
  },
  label: {
    fontSize: theme.fontSize.sm,
    fontWeight: theme.fontWeight.medium as any,
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
    gap: theme.spacing.sm,
  },
  tagText: {
    fontSize: theme.fontSize.sm,
    paddingBottom: theme.spacing.xs,
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
    marginBottom: theme.spacing.xs,
  },
  previewUrl: {
    fontSize: theme.fontSize.xs,
  },
  saveButton: {
    marginTop: theme.spacing.md,
    height: 48,
  },
});
