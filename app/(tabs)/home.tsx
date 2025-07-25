import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState, useRef } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform, Dimensions, TouchableWithoutFeedback, PanResponder, Animated, FlatList, ActivityIndicator, Share } from "react-native";
import { Video, ResizeMode } from 'expo-av';
import CommentDialog from "../components/CommentDialog";
import { useAuth } from '../context/AuthContext';
import { getPosts, deletePost, Post, likePost, unlikePost, addComment, sharePost, fetchPostComments, PostComment } from '../lib/services/postService';
import { fetchStories, Story, fetchStoriesByUser } from '../lib/services/storyService';

// Modern Color Palette
const COLORS = {
  primary: '#4361EE',    // Vibrant Blue
  secondary: '#3A0CA3',  // Deep Purple
  accent: '#FF7F11',     // Orange
  background: '#F8F9FA',  // Light Gray
  card: '#FFFFFF',       // White
  text: '#212529',       // Dark Gray
  lightText: '#6C757D',  // Medium Gray
  border: '#E9ECEF',     // Light Border
  success: '#4CC9F0',    // Teal
  dark: '#1A1A2E',       // Dark Blue
};

const DEFAULT_PROFILE_PHOTO = "https://i.imgur.com/6XbK6bE.jpg";
const DEVICE_WIDTH = Dimensions.get('window').width;
const DEVICE_HEIGHT = Dimensions.get('window').height;

const LIKE_ACTIVE_COLOR = '#FF3040'; // Red
const LIKE_INACTIVE_COLOR = COLORS.lightText;
const STORY_RING_COLORS = ['#FF9D00', '#FF7F11', '#FF6B35', '#FF8C42'] as const;

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [fullscreenMedia, setFullscreenMedia] = useState<{ type: 'image' | 'video', uri: string, id?: string } | null>(null);
  const [fullscreenIndex, setFullscreenIndex] = useState<number>(0);
  const [optimisticLikes, setOptimisticLikes] = useState<{ [postId: string]: string[] }>({});
  const [showIntroVideo, setShowIntroVideo] = useState(false);
  const [videoKey, setVideoKey] = useState(0);
  const [storyViewerVisible, setStoryViewerVisible] = useState(false);
  const [currentStoryUser, setCurrentStoryUser] = useState<{ userId: string, username: string, profilePicture?: string } | null>(null);
  const [currentUserStories, setCurrentUserStories] = useState<Story[]>([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [videoLoading, setVideoLoading] = useState<{ [key: string]: boolean }>({});
  const [doubleTapHeart, setDoubleTapHeart] = useState<{ postId: string; visible: boolean } | null>(null);
  const [fullscreenImage, setFullscreenImage] = useState<{ uri: string; visible: boolean } | null>(null);
  const heartAnimation = useRef(new Animated.Value(0)).current;
  const doubleTapTimer = useRef<number | null>(null);
  const lastTap = useRef<{ postId: string; time: number } | null>(null);

  // Group stories by user
  const storiesByUser = stories.reduce((acc, story) => {
    if (!acc[story.userId]) acc[story.userId] = [];
    acc[story.userId].push(story);
    return acc;
  }, {} as { [userId: string]: Story[] });
  const uniqueStoryUsers = Object.values(storiesByUser).map(stories => stories[0]);

  const openUserStories = async (userId: string, username: string, profilePicture?: string) => {
    const userStories = await fetchStoriesByUser(userId);
    setCurrentUserStories(userStories);
    setCurrentStoryUser({ userId, username, profilePicture });
    setCurrentStoryIndex(0);
    setStoryViewerVisible(true);
  };

  useEffect(() => {
    fetchPosts();
    fetchAllStories();
  }, []);
 
  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current);
      }
    };
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const data = await getPosts();
    setPosts(data.reverse());
    setLoadingPosts(false);
  };

  const fetchAllStories = async () => {
    setLoadingStories(true);
    try {
      const data = await fetchStories();
      setStories(data);
    } finally {
      setLoadingStories(false);
    }
  };

  const handleDeletePost = async (postId: string) => {
    if (!user?.id) return;
    Alert.alert('Delete Post', 'Are you sure you want to delete this post?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        await deletePost(postId, user.id);
        fetchPosts();
      }},
    ]);
  };

  const handleLikePost = async (post: Post) => {
    if (!user) return;
    const alreadyLiked = (optimisticLikes[post.id] || post.likedBy || []).includes(user.id);
    setOptimisticLikes(prev => ({
      ...prev,
      [post.id]: alreadyLiked
        ? (prev[post.id] || post.likedBy || []).filter(id => id !== user.id)
        : [...(prev[post.id] || post.likedBy || []), user.id]
    }));
    try {
      if (alreadyLiked) {
        await unlikePost(post.id, user.id);
      } else {
        await likePost(post.id, user.id);
      }
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleShareMedia = async (post: Post) => {
    try {
      const mediaUrl = post.videoUrl || post.imageUrl;
      if (mediaUrl) {
        await Share.share({
          message: `Check out this post: ${post.content}`,
          url: mediaUrl,
        });
      }
    } catch (error) {
      console.error('Error sharing media:', error);
    }
  };

  const handlePostTap = (post: Post) => {
    if (!user) return;
    
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 250; // 250ms for double tap (more responsive)
    
    if (lastTap.current && 
        lastTap.current.postId === post.id && 
        now - lastTap.current.time < DOUBLE_TAP_DELAY) {
      // Double tap detected
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current);
      }
      lastTap.current = null;
      
      // Set the heart animation for this post
      setDoubleTapHeart({ postId: post.id, visible: true });
      
      // Animate the heart
      heartAnimation.setValue(0);
      Animated.sequence([
        Animated.timing(heartAnimation, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(heartAnimation, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setDoubleTapHeart(null);
      });
      
      // Handle the like
      handleLikePost(post);
    } else {
      // First tap - wait for potential double tap
      lastTap.current = { postId: post.id, time: now };
      if (doubleTapTimer.current) {
        clearTimeout(doubleTapTimer.current);
      }
      doubleTapTimer.current = setTimeout(() => {
        lastTap.current = null;
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleVideoTap = (post: Post) => {
    // Handle double-tap first
    handlePostTap(post);
    
    // Then handle video play/pause
    setPlayingVideoId(playingVideoId === post.id ? null : post.id);
  };

  const handleImageFullScreen = (imageUrl: string) => {
    setFullscreenImage({ uri: imageUrl, visible: true });
  };

  const navigateToProfile = (userId: string) => {
    if (userId === user?.id) {
      router.push('/(tabs)/profile');
    } else {
      router.push({ pathname: '../screens/FriendsProfileScreen', params: { userId } });
    }
  };

  const handleOpenFullscreen = (type: 'image' | 'video', uri: string, id?: string, idx?: number) => {
    setFullscreenMedia({ type, uri, id });
    setFullscreenIndex(idx ?? 0);
  };

  if (!user) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  const userStory = stories.find(s => s.userId === user?.id);

  return (
    <View style={styles.container}>
      {/* Modern Header */}
      <LinearGradient
        colors={[COLORS.primary, COLORS.secondary]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <TouchableOpacity onPress={() => {
          setShowIntroVideo(true);
          setVideoKey(prev => prev + 1);
        }}>
          <Text style={styles.logo}>
            Mas<Text style={{ color: COLORS.accent }}>Chat</Text>
          </Text>
        </TouchableOpacity>
        
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowAddMenu(true)}
          >
            <Ionicons name="add" size={28} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('../screens/SearchScreen')}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('../screens/MessengerScreen')}>
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationText}>3</Text>
            </View>
            <Ionicons name="chatbubble-ellipses" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {/* Add Menu Modal */}
      <Modal
        visible={showAddMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowAddMenu(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPressOut={() => setShowAddMenu(false)}
        >
          <View style={styles.addMenuBox}>
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/newPost");
              }}
            >
              <LinearGradient
                colors={['#4361EE', '#3A0CA3']}
                style={styles.menuIconBg}
              >
                <Ionicons name="create-outline" size={22} color="white" />
              </LinearGradient>
              <Text style={styles.addMenuText}>Create Post</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/newStory");
              }}
            >
              <LinearGradient
                colors={['#FF7F11', '#FF6B35']}
                style={styles.menuIconBg}
              >
                <Ionicons name="camera-outline" size={22} color="white" />
              </LinearGradient>
              <Text style={styles.addMenuText}>Add Story</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/newReel");
              }}
            >
              <LinearGradient
                colors={['#7209B7', '#560BAD']}
                style={styles.menuIconBg}
              >
                <Ionicons name="film-outline" size={22} color="white" />
              </LinearGradient>
              <Text style={styles.addMenuText}>Create Reel</Text>
            </TouchableOpacity>
            
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/LiveScreen");
              }}
            >
              <LinearGradient
                colors={['#F94144', '#F3722C']}
                style={styles.menuIconBg}
              >
                <Ionicons name="radio-outline" size={22} color="white" />
              </LinearGradient>
              <Text style={styles.addMenuText}>Go Live</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* Intro Video Modal */}
      <Modal
        visible={showIntroVideo}
        transparent
        animationType="fade"
        onRequestClose={() => setShowIntroVideo(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowIntroVideo(false)}>
          <View style={styles.videoModalContainer}>
            <Video
              key={videoKey}
              source={require('../../assets/GROUP 88-MasChat.mp4')}
              style={styles.introVideo}
              resizeMode={ResizeMode.CONTAIN}
              shouldPlay
              useNativeControls={false}
              isLooping={false}
              onPlaybackStatusUpdate={status => {
                if (status.isLoaded && 'didJustFinish' in status && status.didJustFinish) {
                  setShowIntroVideo(false);
                }
              }}
            />
            <TouchableOpacity 
              style={styles.closeVideoButton} 
              onPress={() => setShowIntroVideo(false)}
            >
              <Ionicons name="close" size={28} color="white" />
            </TouchableOpacity>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Story Viewer Modal */}
      {storyViewerVisible && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setStoryViewerVisible(false)}>
          <View style={styles.storyViewerContainer}>
            {currentUserStories.length > 0 && (
              <FlatList
                data={currentUserStories}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                keyExtractor={item => item.id}
                initialScrollIndex={currentStoryIndex}
                renderItem={({ item }) => (
                  item.mediaUrl.endsWith('.mp4') || item.mediaUrl.endsWith('.mov') ? (
                    <Video
                      source={{ uri: item.mediaUrl }}
                      style={styles.storyVideo}
                      resizeMode={ResizeMode.COVER}
                      shouldPlay
                      isLooping
                      useNativeControls={false}
                    />
                  ) : (
                    <Image source={{ uri: item.mediaUrl }} style={styles.storyImageFull} />
                  )
                )}
              />
            )}
            <TouchableOpacity style={styles.closeStoryButton} onPress={() => setStoryViewerVisible(false)}>
              <Ionicons name="close" size={36} color="#fff" />
            </TouchableOpacity>
            <View style={styles.storyHeader}>
              <Image 
                source={{ uri: currentStoryUser?.profilePicture || DEFAULT_PROFILE_PHOTO }} 
                style={styles.storyUserAvatar} 
              />
              <Text style={styles.storyUsername}>{currentStoryUser?.username}</Text>
            </View>
          </View>
        </Modal>
      )}

      <ScrollView 
        style={styles.scroll} 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Update */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <LinearGradient
              colors={[COLORS.accent, '#FF6B35']}
              style={styles.profileRing}
            >
              <Image
                source={{ uri: user?.profilePicture ?? DEFAULT_PROFILE_PHOTO }}
                style={styles.profilePic}
              />
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.statusInput}
            onPress={() => router.push("/(create)/newPost")}
          >
            <Text style={styles.statusPlaceholder}>What's on your mind?</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.photoBtn} 
            onPress={() => router.push('/(create)/newPost')}
          >
            <Ionicons name="image" size={28} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          style={styles.storiesContainer}
          contentContainerStyle={styles.storiesContent}
        >
          {/* User's story */}
          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => {
              if (!userStory) {
                router.push('/(create)/newStory');
              } else {
                openUserStories(user?.id, user?.username, user?.profilePicture);
              }
            }}
          >
            <LinearGradient
              colors={STORY_RING_COLORS}
              style={styles.storyRing}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <View style={styles.storyImageContainer}>
                {userStory ? (
                  <Image source={{ uri: userStory.mediaUrl }} style={styles.storyImage} />
                ) : (
                  <Ionicons name="add" size={28} color="white" style={styles.addStoryIcon} />
                )}
              </View>
            </LinearGradient>
            <Text style={styles.storyLabel}>{userStory ? 'Your Story' : 'Add Story'}</Text>
          </TouchableOpacity>
          
          {/* Friends' stories */}
          {uniqueStoryUsers.filter(s => s.userId !== user?.id).map((story, index) => (
            <TouchableOpacity
              key={story.userId}
              style={styles.storyItem}
              onPress={() => openUserStories(story.userId, story.username, story.profilePicture)}
            >
              <LinearGradient
                colors={[
                  STORY_RING_COLORS[index % STORY_RING_COLORS.length],
                  STORY_RING_COLORS[(index + 1) % STORY_RING_COLORS.length]
                ]}
                style={styles.storyRing}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={styles.storyImageContainer}>
                  <Image source={{ uri: story.mediaUrl }} style={styles.storyImage} />
                </View>
              </LinearGradient>
              <Text style={styles.storyLabel}>{story.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        {loadingPosts ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={COLORS.primary} />
            <Text style={styles.loadingText}>Loading posts...</Text>
          </View>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="newspaper-outline" size={60} color={COLORS.lightText} />
            <Text style={styles.emptyText}>No posts yet</Text>
            <Text style={styles.emptySubtext}>Be the first to share something!</Text>
            <TouchableOpacity 
              style={styles.createBtn} 
              onPress={() => router.push('/(create)/newPost')}
            >
              <Text style={styles.createBtnText}>Create New Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          posts.map((post, idx) => (
            <View key={post.id} style={styles.postCard}>
              {/* Post Header */}
              <View style={styles.postHeader}>
                <TouchableOpacity 
                  style={styles.postUser} 
                  onPress={() => navigateToProfile(post.user.id)}
                >
                  <Image
                    source={{ uri: post.user.profilePicture || DEFAULT_PROFILE_PHOTO }}
                    style={styles.postAvatar}
                  />
                  <View style={styles.postUserInfo}>
                    <Text style={styles.postUserName}>{post.user.username}</Text>
                    <Text style={styles.postTime}>{formatPostTime(post.createdAt)}</Text>
                  </View>
                </TouchableOpacity>
                
                {user?.id === post.user.id && (
                  <TouchableOpacity 
                    style={styles.moreButton}
                    onPress={() => handleDeletePost(post.id)}
                  >
                    <Ionicons name="ellipsis-horizontal" size={24} color={COLORS.lightText} />
                  </TouchableOpacity>
                )}
              </View>
              
              {/* Post Content */}
              <Text style={styles.postText}>{post.content}</Text>
              
              {/* Media */}
              {(post.imageUrl || post.videoUrl) && (
                post.videoUrl ? (
                  <View style={styles.videoContainer}>
                    <TouchableOpacity
                      activeOpacity={0.9}
                      onPress={() => handleVideoTap(post)}
                      style={styles.videoTouchable}
                    >
                      {videoLoading[post.id] && (
                        <ActivityIndicator size="large" color="#fff" style={styles.videoLoader} />
                      )}
                      <Video
                        source={{ uri: post.videoUrl || '' }}
                        style={styles.postVideo}
                        resizeMode={ResizeMode.CONTAIN}
                        shouldPlay={playingVideoId === post.id}
                        isLooping
                        useNativeControls={false}
                        onLoadStart={() => setVideoLoading(v => ({ ...v, [post.id]: true }))}
                        onReadyForDisplay={() => setVideoLoading(v => ({ ...v, [post.id]: false }))}
                      />
                      <TouchableOpacity
                        style={styles.playButton}
                        onPress={() => setPlayingVideoId(playingVideoId === post.id ? null : post.id)}
                      >
                        <Ionicons 
                          name={playingVideoId === post.id ? 'pause-circle' : 'play-circle'} 
                          size={56} 
                          color="rgba(255,255,255,0.8)" 
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.expandButton}
                        onPress={() => handleOpenFullscreen('video', post.videoUrl || '', post.id, idx)}
                      >
                        <Ionicons name="expand" size={24} color="#fff" />
                      </TouchableOpacity>
                      
                      {/* Double-tap heart animation for videos */}
                      {doubleTapHeart?.postId === post.id && doubleTapHeart.visible && (
                        <Animated.View
                          style={[
                            styles.doubleTapHeart,
                            {
                              opacity: heartAnimation,
                              transform: [
                                {
                                  scale: heartAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [0.3, 1.5],
                                  }),
                                },
                              ],
                            },
                          ]}
                        >
                          <Ionicons name="heart" size={80} color="#FF3040" />
                        </Animated.View>
                      )}
                    </TouchableOpacity>
                  </View>
                ) : (
                  <View style={styles.imageContainer}>
                    <TouchableOpacity 
                      activeOpacity={0.9}
                      onPress={() => handleOpenFullscreen('image', post.imageUrl || '', post.id, idx)}
                    >
                      <Image 
                        source={{ uri: post.imageUrl || '' }} 
                        style={styles.postImage} 
                      />
                    </TouchableOpacity>
                    
                    {/* Double-tap overlay for like */}
                    <TouchableOpacity
                      style={styles.doubleTapOverlay}
                      onPress={() => handlePostTap(post)}
                      activeOpacity={1}
                    >
                      <View style={styles.doubleTapArea} />
                    </TouchableOpacity>
                    
                    {/* Full-screen button for images */}
                    <TouchableOpacity
                      style={styles.fullscreenImageButton}
                      onPress={() => handleImageFullScreen(post.imageUrl || '')}
                    >
                      <Ionicons name="expand" size={24} color="#fff" />
                    </TouchableOpacity>
                    
                    {/* Double-tap heart animation */}
                    {doubleTapHeart?.postId === post.id && doubleTapHeart.visible && (
                      <Animated.View
                        style={[
                          styles.doubleTapHeart,
                          {
                            opacity: heartAnimation,
                            transform: [
                              {
                                scale: heartAnimation.interpolate({
                                  inputRange: [0, 1],
                                  outputRange: [0.3, 1.5],
                                }),
                              },
                            ],
                          },
                        ]}
                      >
                        <Ionicons name="heart" size={80} color="#FF3040" />
                      </Animated.View>
                    )}
                  </View>
                )
              )}
              
              {/* Post Stats */}
              <View style={styles.postStats}>
                <View style={styles.likeCountContainer}>
                  <Ionicons name="heart" size={16} color={LIKE_ACTIVE_COLOR} />
                  <Text style={styles.likeCountText}>
                    {(optimisticLikes[post.id] || post.likedBy || []).length}
                  </Text>
                </View>
                <Text style={styles.commentCountText}>
                  {post.comments?.length || 0} comments • {post.shareCount || 0} shares
                </Text>
              </View>
              
              {/* Action Buttons */}
              <View style={styles.postActions}>
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => user && handleLikePost(post)}
                >
                  <Ionicons
                    name={(optimisticLikes[post.id] || post.likedBy || []).includes(user.id) ? 'heart' : 'heart-outline'}
                    size={24}
                    color={(optimisticLikes[post.id] || post.likedBy || []).includes(user.id) ? LIKE_ACTIVE_COLOR : COLORS.lightText}
                  />
                  <Text style={[
                    styles.actionText,
                    (optimisticLikes[post.id] || post.likedBy || []).includes(user.id) && 
                      { color: LIKE_ACTIVE_COLOR }
                  ]}>
                    Like
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => router.push({
                    pathname: '../screens/PostCommentsScreen',
                    params: { postId: post.id }
                  })}
                >
                  <Ionicons 
                    name="chatbubble-outline" 
                    size={22} 
                    color={COLORS.lightText} 
                  />
                  <Text style={styles.actionText}>Comment</Text>
                </TouchableOpacity>
                
                <TouchableOpacity 
                  style={styles.actionButton}
                  onPress={() => handleShareMedia(post)}
                >
                  <Ionicons 
                    name="arrow-redo-outline" 
                    size={24} 
                    color={COLORS.lightText} 
                  />
                  <Text style={styles.actionText}>Share</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Fullscreen Modal */}
      {fullscreenMedia && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setFullscreenMedia(null)}>
          <View style={styles.fullscreenContainer}>
            {fullscreenMedia.type === 'image' ? (
              <Image 
                source={{ uri: fullscreenMedia.uri || '' }} 
                style={styles.fullscreenImage} 
                resizeMode="contain"
              />
            ) : (
              <Video
                source={{ uri: fullscreenMedia.uri || '' }}
                style={styles.fullscreenVideo}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay
                isLooping
                useNativeControls
              />
            )}
            <TouchableOpacity 
              style={styles.closeFullscreenButton} 
              onPress={() => setFullscreenMedia(null)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
      
      {/* Full-screen Image Modal */}
      {fullscreenImage?.visible && (
        <Modal visible transparent animationType="fade" onRequestClose={() => setFullscreenImage(null)}>
          <View style={styles.fullscreenImageContainer}>
            <Image 
              source={{ uri: fullscreenImage.uri }} 
              style={styles.fullscreenImageModal} 
              resizeMode="contain"
            />
            <TouchableOpacity 
              style={styles.closeFullscreenButton} 
              onPress={() => setFullscreenImage(null)}
            >
              <Ionicons name="close" size={32} color="#fff" />
            </TouchableOpacity>
          </View>
        </Modal>
      )}
    </View>
  );
}

function formatPostTime(isoString: string) {
  if (!isoString) return '';
  const date = new Date(isoString);
  const now = new Date();
  if (
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear()
  ) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }
  return date.toLocaleDateString();
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: COLORS.lightText,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    overflow: 'hidden',
  },
  logo: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    letterSpacing: 0.5,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 16,
    marginLeft: 'auto',
  },
  iconBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notificationBadge: {
    position: 'absolute',
    top: -5,
    right: -5,
    backgroundColor: COLORS.accent,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  notificationText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 30,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.card,
    padding: 16,
    margin: 16,
    marginBottom: 8,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  profileRing: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profilePic: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 2,
    borderColor: COLORS.card,
  },
  statusInput: {
    flex: 1,
    backgroundColor: COLORS.background,
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 12,
  },
  statusPlaceholder: {
    color: COLORS.lightText,
    fontSize: 16,
  },
  photoBtn: {
    backgroundColor: COLORS.background,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storiesContainer: {
    marginVertical: 8,
    paddingLeft: 16,
  },
  storiesContent: {
    paddingRight: 16,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  storyRing: {
    width: 70,
    height: 70,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  storyImageContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: COLORS.card,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  addStoryIcon: {
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: 4,
  },
  storyLabel: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: '500',
    maxWidth: 70,
    textAlign: 'center',
  },
  postCard: {
    backgroundColor: COLORS.card,
    borderRadius: 0,
    margin: 0,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingBottom: 12,
    justifyContent: 'space-between',
  },
  postUser: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postAvatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  postUserInfo: {
    justifyContent: 'center',
  },
  postUserName: {
    fontWeight: '700',
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 2,
  },
  postTime: {
    color: COLORS.lightText,
    fontSize: 13,
  },
  moreButton: {
    padding: 8,
  },
  postText: {
    fontSize: 16,
    color: COLORS.text,
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  postImage: {
    width: '100%',
    height: DEVICE_WIDTH * 1.5,
  },
  videoContainer: {
    position: 'relative',
    width: '100%',
    height: DEVICE_WIDTH * 1.5,
    backgroundColor: '#000',
  },
  videoTouchable: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  postVideo: {
    width: '100%',
    height: '100%',
  },
  videoLoader: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -18,
    marginLeft: -18,
    zIndex: 10,
  },
  playButton: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -28,
    marginLeft: -28,
    zIndex: 10,
  },
  expandButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  likeCountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  likeCountText: {
    marginLeft: 6,
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  commentCountText: {
    color: COLORS.lightText,
    fontSize: 14,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 8,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  actionText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.lightText,
    fontWeight: '500',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  addMenuBox: {
    marginTop: 60,
    marginRight: 16,
    borderRadius: 20,
    backgroundColor: COLORS.card,
    paddingVertical: 8,
    width: 220,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
  },
  menuIconBg: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  addMenuText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
    padding: 20,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 16,
    color: COLORS.lightText,
    marginBottom: 24,
    textAlign: 'center',
  },
  createBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 14,
    paddingVertical: 14,
    paddingHorizontal: 32,
  },
  createBtnText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 16,
  },
  videoModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  introVideo: {
    width: '100%',
    height: '100%',
  },
  closeVideoButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  storyViewerContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.95)',
  },
  storyVideo: {
    width: '100%',
    height: '100%',
  },
  storyImageFull: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  closeStoryButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
  },
  storyHeader: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  storyUserAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
  storyUsername: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 12,
  },
  fullscreenContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImage: {
    width: '100%',
    height: '100%',
  },
  fullscreenVideo: {
    width: '100%',
    height: '100%',
  },
  closeFullscreenButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: DEVICE_WIDTH * 1.5,
    backgroundColor: '#000',
  },
  fullscreenImageButton: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    backgroundColor: 'rgba(0,0,0,0.5)',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  doubleTapHeart: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -40,
    marginLeft: -40,
    zIndex: 10,
  },
  doubleTapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 5,
  },
  doubleTapArea: {
    flex: 1,
  },
  fullscreenImageContainer: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullscreenImageModal: {
    width: '100%',
    height: '100%',
  },
});