import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Alert, ScrollView, Dimensions, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { fetchStories, deleteStory, Story } from '../lib/services/storyService';

const COLORS = {
  primary: '#3A8EFF',
  accent: '#FF7F11',
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#333333',
  lightText: '#888888',
};

export default function MyStoryScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [myStories, setMyStories] = useState<Story[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList<any>>(null);

  useEffect(() => {
    fetchMyStories();
  }, []);

  const fetchMyStories = async () => {
    setLoading(true);
    try {
      const allStories = await fetchStories();
      setMyStories(allStories.filter(s => s.userId === user?.id));
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (storyId: string) => {
    Alert.alert('Delete Story', 'Are you sure you want to delete this story?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deleteStory(storyId);
        fetchMyStories();
      }},
    ]);
  };

  const handleScroll = (event: any) => {
    const index = Math.round(event.nativeEvent.contentOffset.x / Dimensions.get('window').width);
    setCurrentIndex(index);
  };

  return (
    <View style={styles.container}>
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
            router.replace('/(tabs)/videos');
          }
        }} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Story</Text>
        <TouchableOpacity onPress={() => router.push('/(create)/newStory')} style={styles.addButton}>
          <Ionicons name="add-circle" size={28} color={COLORS.accent} />
        </TouchableOpacity>
      </LinearGradient>
      {/* Dashes at the top */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 16, marginBottom: 8 }}>
        {myStories.map((_, idx) => (
          <View
            key={idx}
            style={{
              width: 32,
              height: 4,
              borderRadius: 2,
              marginHorizontal: 4,
              backgroundColor: idx === currentIndex ? COLORS.accent : '#fff',
              opacity: idx === currentIndex ? 1 : 0.5,
            }}
          />
        ))}
      </View>
      {loading ? (
        <Text style={styles.loadingText}>Loading...</Text>
      ) : myStories.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="image-outline" size={60} color={COLORS.lightText} />
          <Text style={styles.emptyText}>You have no stories yet.</Text>
          <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/(create)/newStory')}>
            <Text style={styles.createBtnText}>Create New Story</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          ref={flatListRef}
          data={myStories}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={16}
          keyExtractor={item => item.id}
          renderItem={({ item, index }) => (
            <View style={{ width: Dimensions.get('window').width, flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <Image source={{ uri: item.mediaUrl }} style={{ width: '100%', height: 500, borderRadius: 16, backgroundColor: '#eee' }} resizeMode="cover" />
              <View style={{ position: 'absolute', bottom: 80, left: 24, right: 24, backgroundColor: 'rgba(0,0,0,0.3)', borderRadius: 10, padding: 16 }}>
                <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 }}>{item.caption}</Text>
                <Text style={{ color: '#fff', fontSize: 13 }}>{new Date(item.createdAt).toLocaleString()}</Text>
              </View>
              <TouchableOpacity style={{ position: 'absolute', top: 40, right: 24, zIndex: 2 }} onPress={() => handleDelete(item.id)}>
                <Ionicons name="trash" size={28} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
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
  addButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
  },
  loadingText: {
    textAlign: 'center',
    color: COLORS.lightText,
    marginTop: 40,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: COLORS.lightText,
    fontSize: 16,
    marginTop: 16,
    marginBottom: 24,
  },
  createBtn: {
    backgroundColor: COLORS.accent,
    borderRadius: 8,
    paddingHorizontal: 24,
    paddingVertical: 12,
  },
  createBtnText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  storyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderRadius: 12,
    marginBottom: 16,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  storyImage: {
    width: 80,
    height: 120,
    borderRadius: 10,
    marginRight: 16,
    backgroundColor: '#eee',
  },
  storyInfo: {
    flex: 1,
  },
  storyCaption: {
    fontSize: 15,
    color: COLORS.text,
    marginBottom: 6,
  },
  storyTime: {
    fontSize: 12,
    color: COLORS.lightText,
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 6,
  },
}); 