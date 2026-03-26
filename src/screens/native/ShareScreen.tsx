import { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { TextInput } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import Header from '../../components/atoms/Header';
import { RootStackParamList } from '../../navigation/types';
import { theme } from '../../theme';

type Props = NativeStackScreenProps<RootStackParamList, 'NativeShare'>;

type Tab = 'text' | 'url' | 'image';
type ImageStatus = 'idle' | 'loading' | 'loaded' | 'error';

const PAPER_THEME = {
  colors: {
    primary: theme.colors.primary,
    background: theme.colors.white,
    error: '#DC2626',
  },
};

// Use stable direct image URLs — no redirects
const SAMPLE_IMAGES = [
  {
    label: 'Nature',
    url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600&q=80',
  },
  {
    label: 'City',
    url: 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&q=80',
  },
  {
    label: 'Ocean',
    url: 'https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=600&q=80',
  },
];

// ---------------------------------------------------------------------------
// Tab Button
// ---------------------------------------------------------------------------

const TabButton = ({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.tab, active && styles.tabActive]}
    onPress={onPress}
    activeOpacity={0.7}
  >
    <Text style={[styles.tabLabel, active && styles.tabLabelActive]}>
      {label}
    </Text>
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Image Preview
// ---------------------------------------------------------------------------

const ImagePreview = ({
  uri,
  onLoaded,
}: {
  uri: string;
  onLoaded: (success: boolean) => void;
}) => {
  const [status, setStatus] = useState<ImageStatus>('loading');
  const [errorLog, setErrorLog] = useState<string[]>([]);

  return (
    <View style={styles.previewContainer}>
      {/* Loading state */}
      {status === 'loading' && (
        <View style={styles.previewOverlay}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
          <Text style={styles.previewHint}>Loading image...</Text>
          <Text style={styles.previewUri} numberOfLines={2}>
            {uri}
          </Text>
        </View>
      )}

      {/* Error state */}
      {status === 'error' && (
        <View style={styles.previewOverlay}>
          <Text style={styles.previewErrorIcon}>!</Text>
          <Text style={styles.previewError}>
            Could not load image.{'\n'}Check the URL and try again.
          </Text>

          {/* Error log */}
          <View style={styles.errorLogContainer}>
            <Text style={styles.errorLogTitle}>Error Log</Text>
            {errorLog.map((line, i) => (
              <Text key={i} style={styles.errorLogLine}>
                {line}
              </Text>
            ))}
          </View>
        </View>
      )}

      {/* Image — always rendered so onLoad / onError fire */}
      <Image
        source={{ uri }}
        style={[
          styles.previewImage,
          status !== 'loaded' && styles.previewImageHidden,
        ]}
        resizeMode="cover"
        onLoad={() => {
          setStatus('loaded');
          onLoaded(true);
        }}
        onError={e => {
          const nativeError = e.nativeEvent?.error ?? 'Unknown error';
          const timestamp = new Date().toLocaleTimeString();
          setErrorLog([`[${timestamp}] ${nativeError}`, `URL: ${uri}`]);
          setStatus('error');
          onLoaded(false);
        }}
      />

      {/* URL label shown below image when loaded */}
      {status === 'loaded' && (
        <View style={styles.previewMeta}>
          <Text style={styles.previewMetaText} numberOfLines={1}>
            {uri}
          </Text>
        </View>
      )}
    </View>
  );
};

// ---------------------------------------------------------------------------
// Screen
// ---------------------------------------------------------------------------

export default function ShareScreen(_props: Props) {
  const [activeTab, setActiveTab] = useState<Tab>('text');

  // Text tab
  const [message, setMessage] = useState('');

  // URL tab
  const [url, setUrl] = useState('');

  // Image tab
  const [imageUrl, setImageUrl] = useState('');
  const [previewUri, setPreviewUri] = useState('');
  const [imageReady, setImageReady] = useState(false);

  // ---------------------------------------------------------------------------
  // Handlers
  // ---------------------------------------------------------------------------

  const handleShareText = async () => {
    if (!message.trim()) return;
    try {
      await Share.share({ message: message.trim() });
    } catch (e: unknown) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'Something went wrong',
      );
    }
  };

  const handleShareUrl = async () => {
    if (!url.trim()) return;
    try {
      await Share.share({ message: url.trim(), url: url.trim() });
    } catch (e: unknown) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'Something went wrong',
      );
    }
  };

  const handleLoadImage = () => {
    const trimmed = imageUrl.trim();
    if (!trimmed) return;
    setImageReady(false);
    setPreviewUri(trimmed);
  };

  const handleSelectSample = (sampleUrl: string) => {
    setImageUrl(sampleUrl);
    setImageReady(false);
    setPreviewUri(sampleUrl);
  };

  const handleClearImage = () => {
    setImageUrl('');
    setPreviewUri('');
    setImageReady(false);
  };

  const handleShareImage = async () => {
    if (!previewUri || !imageReady) return;
    try {
      await Share.share({
        message: previewUri,
        url: previewUri,
        title: 'Check out this image',
      });
    } catch (e: unknown) {
      Alert.alert(
        'Error',
        e instanceof Error ? e.message : 'Something went wrong',
      );
    }
  };

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <SafeAreaView style={styles.root}>
      <Header title="Share" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Hero */}
        <View style={styles.heroContainer}>
          <View style={styles.heroCircle}>
            <Text style={styles.heroIcon}>{'⤴'}</Text>
          </View>
          <Text style={styles.heroTitle}>Share Content</Text>
          <Text style={styles.heroSubtitle}>
            Share text, links or images using the native share sheet
          </Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          <TabButton
            label="Text"
            active={activeTab === 'text'}
            onPress={() => setActiveTab('text')}
          />
          <TabButton
            label="URL"
            active={activeTab === 'url'}
            onPress={() => setActiveTab('url')}
          />
          <TabButton
            label="Image"
            active={activeTab === 'image'}
            onPress={() => setActiveTab('image')}
          />
        </View>

        {/* ---------------------------------------------------------------- */}
        {/* Text Tab                                                          */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'text' && (
          <View>
            <Text style={styles.sectionLabel}>Message</Text>
            <TextInput
              mode="outlined"
              label="Write something to share"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={4}
              left={<TextInput.Icon icon="text-box-outline" />}
              style={styles.input}
              theme={PAPER_THEME}
            />
            <TouchableOpacity
              style={[styles.button, !message.trim() && styles.buttonDisabled]}
              onPress={handleShareText}
              disabled={!message.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Share Text</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* URL Tab                                                           */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'url' && (
          <View>
            <Text style={styles.sectionLabel}>Link</Text>
            <TextInput
              mode="outlined"
              label="Enter a URL to share"
              value={url}
              onChangeText={setUrl}
              autoCapitalize="none"
              keyboardType="url"
              left={<TextInput.Icon icon="link-variant" />}
              right={
                url.length > 0 ? (
                  <TextInput.Icon
                    icon="close-circle-outline"
                    onPress={() => setUrl('')}
                  />
                ) : undefined
              }
              style={styles.input}
              theme={PAPER_THEME}
            />
            <TouchableOpacity
              style={[styles.button, !url.trim() && styles.buttonDisabled]}
              onPress={handleShareUrl}
              disabled={!url.trim()}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Share Link</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ---------------------------------------------------------------- */}
        {/* Image Tab                                                         */}
        {/* ---------------------------------------------------------------- */}
        {activeTab === 'image' && (
          <View>
            {/* Sample chips */}
            <Text style={styles.sectionLabel}>Sample Images</Text>
            <View style={styles.chipsRow}>
              {SAMPLE_IMAGES.map(s => (
                <TouchableOpacity
                  key={s.label}
                  style={[
                    styles.chip,
                    previewUri === s.url && styles.chipActive,
                  ]}
                  onPress={() => handleSelectSample(s.url)}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.chipLabel,
                      previewUri === s.url && styles.chipLabelActive,
                    ]}
                  >
                    {s.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* URL input + Load button */}
            <Text style={styles.sectionLabel}>Or enter image URL</Text>
            <View style={styles.inputRow}>
              <TextInput
                mode="outlined"
                label="Image URL"
                value={imageUrl}
                onChangeText={text => {
                  setImageUrl(text);
                  // Reset preview when user types a new URL
                  if (text !== previewUri) {
                    setPreviewUri('');
                    setImageReady(false);
                  }
                }}
                autoCapitalize="none"
                keyboardType="url"
                left={<TextInput.Icon icon="image-outline" />}
                right={
                  imageUrl.length > 0 ? (
                    <TextInput.Icon
                      icon="close-circle-outline"
                      onPress={handleClearImage}
                    />
                  ) : undefined
                }
                style={[styles.input, styles.inputFlex]}
                theme={PAPER_THEME}
              />
              <TouchableOpacity
                style={[
                  styles.loadButton,
                  !imageUrl.trim() && styles.buttonDisabled,
                ]}
                onPress={handleLoadImage}
                disabled={!imageUrl.trim()}
                activeOpacity={0.8}
              >
                <Text style={styles.loadButtonText}>Load</Text>
              </TouchableOpacity>
            </View>

            {/* Image preview — key forces full remount on URI change */}
            {previewUri !== '' && (
              <ImagePreview
                key={previewUri}
                uri={previewUri}
                onLoaded={success => setImageReady(success)}
              />
            )}

            {/* Share button */}
            <TouchableOpacity
              style={[styles.button, !imageReady && styles.buttonDisabled]}
              onPress={handleShareImage}
              disabled={!imageReady}
              activeOpacity={0.8}
            >
              <Text style={styles.buttonText}>Share Image</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    padding: theme.spacing.lg,
    paddingBottom: theme.spacing.xxl,
  },

  // Hero
  heroContainer: {
    alignItems: 'center',
    marginBottom: theme.spacing.xl,
    paddingTop: theme.spacing.md,
  },
  heroCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: theme.spacing.md,
  },
  heroIcon: { fontSize: 32 },
  heroTitle: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: '700',
    color: theme.colors.textPrimary,
    marginBottom: theme.spacing.xs,
  },
  heroSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: theme.colors.surface,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 4,
    marginBottom: theme.spacing.xl,
  },
  tab: {
    flex: 1,
    paddingVertical: theme.spacing.sm,
    alignItems: 'center',
    borderRadius: 6,
  },
  tabActive: { backgroundColor: theme.colors.primary },
  tabLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textSecondary,
  },
  tabLabelActive: { color: theme.colors.white },

  // Section label
  sectionLabel: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    marginBottom: theme.spacing.sm,
  },

  // Input
  input: {
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.white,
  },
  inputFlex: {
    flex: 1,
    marginBottom: 0,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
  },

  // Load button
  loadButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 8,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md + 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadButtonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.sm,
    fontWeight: '700',
  },

  // Sample chips
  chipsRow: {
    flexDirection: 'row',
    gap: theme.spacing.sm,
    marginBottom: theme.spacing.lg,
    flexWrap: 'wrap',
  },
  chip: {
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.colors.border,
    backgroundColor: theme.colors.surface,
  },
  chipActive: {
    borderColor: theme.colors.primary,
    backgroundColor: '#EFF6FF',
  },
  chipLabel: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: '600',
    color: theme.colors.textPrimary,
  },
  chipLabelActive: { color: theme.colors.primary },

  // Image preview
  previewContainer: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    overflow: 'hidden',
    minHeight: 220,
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  previewImageHidden: {
    height: 0,
  },
  previewOverlay: {
    height: 220,
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.spacing.sm,
  },
  previewHint: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textSecondary,
    marginTop: theme.spacing.sm,
  },
  previewUri: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textDisabled,
    marginTop: theme.spacing.xs,
    paddingHorizontal: theme.spacing.lg,
    textAlign: 'center',
  },
  previewErrorIcon: {
    fontSize: 36,
    fontWeight: '700',
    color: theme.colors.error,
  },
  previewError: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.error,
    textAlign: 'center',
    paddingHorizontal: theme.spacing.lg,
    lineHeight: 20,
  },
  errorLogContainer: {
    marginTop: theme.spacing.md,
    backgroundColor: '#1E1E1E',
    borderRadius: 6,
    padding: theme.spacing.sm,
    width: '90%',
    alignSelf: 'center',
  },
  errorLogTitle: {
    fontSize: theme.typography.sizes.xs,
    fontWeight: '700',
    color: '#F87171',
    marginBottom: theme.spacing.xs,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  errorLogLine: {
    fontFamily: 'Courier',
    fontSize: 11,
    color: '#FCA5A5',
    lineHeight: 18,
  },
  previewMeta: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  previewMetaText: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textSecondary,
  },

  // Primary button
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: theme.spacing.md + 2,
    alignItems: 'center',
    marginTop: theme.spacing.sm,
  },
  buttonDisabled: { opacity: 0.45 },
  buttonText: {
    color: theme.colors.white,
    fontSize: theme.typography.sizes.md,
    fontWeight: '700',
  },
});
