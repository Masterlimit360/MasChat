import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { useAuth } from '../context/AuthContext';
import { createStory } from '../lib/services/storyService';

const COLORS = {
  primary: '#3A8EFF',
  accent: '#FF7F11',
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#333333',
  lightText: '#888888',
};

export default function NewStory() {
  const router = useRouter();
  const { user } = useAuth();
  const [media, setMedia] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video' | 'audio' | null>(null);
  const [aiLoading, setAiLoading] = useState(false);

  const pickMedia = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setMedia(asset.uri);
      setMediaType(asset.type);
    }
  };

  const handleSubmit = async () => {
    if (!user) {
      Alert.alert("Error", "User not found");
      return;
    }
    if (!media) {
      Alert.alert("Error", "Please select an image or video for your story.");
      return;
    }
    setIsLoading(true);
    try {
      // For demo, assume media is already uploaded. In production, upload to server/cloud first.
      await createStory({ mediaUrl: media, caption }, user.id);
      router.replace('/(tabs)/home');
    } catch (error) {
      Alert.alert("Error", "Failed to create story. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // AI image generation
  const generateAIImage = async () => {
    if (!caption.trim()) {
      Alert.alert('Error', 'Please enter a caption to generate an image.');
      return;
    }
    setAiLoading(true);
    try {
      const url = 'https://open-ai21.p.rapidapi.com/texttoimage2';
      const options = {
        method: 'POST',
        headers: {
          'x-rapidapi-key': '355060685fmsh742abd58eb438d7p1f4d66jsn22cd506769c9',
          'x-rapidapi-host': 'open-ai21.p.rapidapi.com',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: caption }),
      };
      const response = await fetch(url, options);
      const result = await response.json();
      if (result && result.generated_image) {
        setMedia(result.generated_image);
        setMediaType('image');
      } else {
        Alert.alert('Error', 'Failed to generate image.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to generate image.');
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, '#2B6CD9']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => {
          if (router.canGoBack?.()) {
            router.back();
          } else {
            router.replace('/(tabs)/home');
          }
        }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Create Story</Text>
        <TouchableOpacity onPress={handleSubmit} disabled={isLoading} style={styles.postButton}>
          <Text style={[styles.postButtonText, isLoading && styles.disabledBtn]}>
            {isLoading ? "Posting..." : "Post"}
          </Text>
        </TouchableOpacity>
      </LinearGradient>

      {/* Media Picker */}
      <TouchableOpacity style={styles.mediaPicker} onPress={pickMedia}>
        {media ? (
          mediaType === 'image' ? <Image source={{ uri: media }} style={styles.mediaPreview} /> :
          mediaType === 'video' ? <Text style={styles.mediaPlaceholderText}>Video selected</Text> :
          mediaType === 'audio' ? <Text style={styles.mediaPlaceholderText}>Audio selected</Text> :
          null
        ) : (
          <View style={styles.mediaPlaceholder}>
            <Ionicons name="image-outline" size={48} color={COLORS.lightText} />
            <Text style={styles.mediaPlaceholderText}>Tap to select image, video, or audio</Text>
          </View>
        )}
      </TouchableOpacity>
      <TouchableOpacity onPress={generateAIImage} style={[styles.mediaPicker, { marginTop: 0, height: 60, justifyContent: 'center', alignItems: 'center', flexDirection: 'row' }]} disabled={aiLoading}>
        <Ionicons name="sparkles" size={24} color={COLORS.primary} />
        <Text style={{ color: COLORS.primary, fontWeight: 'bold', marginLeft: 8 }}>{aiLoading ? 'Generating...' : 'AI Image'}</Text>
      </TouchableOpacity>

      {/* Caption Input */}
      <TextInput
        style={styles.captionInput}
        placeholder="Add a caption..."
        placeholderTextColor={COLORS.lightText}
        value={caption}
        onChangeText={setCaption}
        multiline
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  postButton: {
    minWidth: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  postButtonText: {
    color: COLORS.accent,
    fontWeight: 'bold',
    fontSize: 16,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  mediaPicker: {
    margin: 24,
    borderRadius: 16,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    height: 260,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  mediaPreview: {
    width: '100%',
    height: 260,
    borderRadius: 16,
    resizeMode: 'cover',
  },
  mediaPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    height: 260,
  },
  mediaPlaceholderText: {
    color: COLORS.lightText,
    fontSize: 16,
    marginTop: 12,
  },
  captionInput: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginBottom: 12,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 60,
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
});