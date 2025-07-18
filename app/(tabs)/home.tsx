import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from "react";
import { Alert, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, Platform } from "react-native";
import CommentDialog from "../components/CommentDialog";
import { useAuth } from '../context/AuthContext';
import { getPosts, deletePost, Post, likePost, unlikePost, addComment, sharePost, fetchPostComments, PostComment } from '../lib/services/postService';
import { fetchStories, Story } from '../lib/services/storyService';

// Color Palette
const COLORS = {
  primary: '#0A2463',  // Deep Blue
  accent: '#FF7F11',   // Vibrant Orange
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#333333',
  lightText: '#888888',
};

const DEFAULT_PROFILE_PHOTO = "https://i.imgur.com/6XbK6bE.jpg";

export default function HomeScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [showAddMenu, setShowAddMenu] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [commentPostId, setCommentPostId] = useState<string | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [loadingStories, setLoadingStories] = useState(true);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [commentModalPost, setCommentModalPost] = useState<Post | null>(null);
  const [commentText, setCommentText] = useState('');
  const [commentLoading, setCommentLoading] = useState(false);
  const [comments, setComments] = useState<PostComment[]>([]);

  useEffect(() => {
    fetchPosts();
    fetchAllStories();
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
    if (post.likedBy?.includes(user.id)) {
      await unlikePost(post.id, user.id);
    } else {
      await likePost(post.id, user.id);
    }
    fetchPosts();
  };

  const handleSharePost = async (postId: string) => {
    await sharePost(postId);
    fetchPosts();
  };

  const handleAddPostComment = async () => {
    if (!commentModalPost || !user || !commentText.trim()) return;
    setCommentLoading(true);
    await addComment(commentModalPost.id, user.id, commentText.trim());
    setCommentText('');
    setCommentLoading(false);
    setCommentModalPost(null);
    fetchPosts();
  };

  const openCommentModal = async (post: Post) => {
    setCommentModalPost(post);
    const data = await fetchPostComments(post.id);
    setComments(data);
  };

  // Helper function to navigate to appropriate profile screen
  const navigateToProfile = (userId: string) => {
    if (userId === user?.id) {
      router.push('/(tabs)/profile');
    } else {
      router.push({ pathname: '../screens/FriendsProfileScreen', params: { userId } });
    }
  };

  if (!user) {
    return <View style={styles.loadingContainer}><Text>User not found</Text></View>;
  }

  // Stories logic
  const userStory = stories.find(s => s.userId === user?.id);
  const friendsStories = stories.filter(s => s.userId !== user?.id);

  const getLikeColor = (liked: boolean) => liked ? '#22c55e' : COLORS.lightText;

  return (
    <View style={styles.container}>
      {/* Header */}
      <LinearGradient
        colors={[COLORS.primary, '#1A4B8C']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.logo}>
          Mas<Text style={{ color: COLORS.accent }}>Chat</Text>
        </Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={styles.iconBtn}
            onPress={() => setShowAddMenu(true)}
          >
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('../screens/SearchScreen')}>
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('../screens/MessengerScreen')}>
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
              <View style={[styles.menuIconBg, { backgroundColor: COLORS.primary }]}> 
                <Ionicons name="create-outline" size={22} color="white" />
              </View>
              <Text style={styles.addMenuText}>Post</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/newStory");
              }}
            >
              <View style={[styles.menuIconBg, { backgroundColor: COLORS.accent }]}> 
                <Ionicons name="images-outline" size={22} color="white" />
              </View>
              <Text style={styles.addMenuText}>Story</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/newReel");
              }}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#A259E6' }]}> 
                <Ionicons name="film-outline" size={22} color="white" />
              </View>
              <Text style={styles.addMenuText}>Reels</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.addMenuItem}
              onPress={() => {
                setShowAddMenu(false);
                router.push("/(create)/LiveScreen");
              }}
            >
              <View style={[styles.menuIconBg, { backgroundColor: '#0A2463' }]}> 
                <Ionicons name="radio-outline" size={22} color="white" />
              </View>
              <Text style={styles.addMenuText}>Live</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Status Update */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => router.push('/profile')}>
            <Image
              source={{ uri: user?.profilePicture ?? DEFAULT_PROFILE_PHOTO }}
              style={styles.avatar}
            />
          </TouchableOpacity>
          <TextInput
            style={styles.statusInput}
            placeholder="What's on your mind?"
            placeholderTextColor={COLORS.lightText}
          />
          <TouchableOpacity style={styles.photoBtn} onPress={() => router.push('/(create)/newPost')}>
            <Ionicons name="image" size={24} color={COLORS.accent} />
          </TouchableOpacity>
        </View>

        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesContainer}>
          {/* User's story first */}
          <TouchableOpacity
            style={styles.storyItem}
            onPress={() => router.push({ pathname: '/screens/MyStoryScreen' })}
          >
            <View style={styles.storyImageContainer}>
              {userStory ? (
                <Image source={{ uri: userStory.mediaUrl }} style={styles.storyImage} />
              ) : (
                <Ionicons name="add-circle" size={28} color={COLORS.primary} />
              )}
            </View>
            <Text style={styles.storyLabel}>{userStory ? 'Your Story' : 'Create Story'}</Text>
          </TouchableOpacity>
          {/* Friends' stories */}
          {friendsStories.map(story => (
            <TouchableOpacity
              key={story.id}
              style={styles.storyItem}
              onPress={() => router.push({ pathname: '/screens/StoryViewerScreen', params: { storyId: story.id } })}
            >
              <View style={styles.storyImageContainer}>
                <Image source={{ uri: story.mediaUrl }} style={styles.storyImage} />
              </View>
              <Text style={styles.storyLabel}>{story.username}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Posts */}
        {loadingPosts ? (
          <Text style={styles.loadingText}>Loading posts...</Text>
        ) : posts.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="image-outline" size={60} color={COLORS.lightText} />
            <Text style={styles.emptyText}>No posts yet.</Text>
            <TouchableOpacity style={styles.createBtn} onPress={() => router.push('/(create)/newPost')}>
              <Text style={styles.createBtnText}>Create New Post</Text>
            </TouchableOpacity>
          </View>
        ) : (
          posts.map(post => (
            <View key={post.id} style={[styles.postCard, { marginHorizontal: 0, borderRadius: 0 }]}>
              <View style={styles.postHeader}>
                <TouchableOpacity onPress={() => navigateToProfile(post.user.id)}>
                  <Image
                    source={{ uri: post.user.profilePicture || DEFAULT_PROFILE_PHOTO }}
                    style={styles.postAvatar}
                  />
                </TouchableOpacity>
                <View style={styles.postUserInfo}>
                  <Text style={styles.postUserName}>{post.user.username}</Text>
                  <Text style={styles.postTime}>{formatPostTime(post.createdAt)}</Text>
                </View>
                {user?.id === post.user.id && (
                  <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDeletePost(post.id)}>
                    <Ionicons name="trash" size={22} color={COLORS.accent} />
                  </TouchableOpacity>
                )}
              </View>
              <Text style={styles.postText}>{post.content}</Text>
              {(post.imageUrl || post.videoUrl) && (
                <TouchableOpacity onPress={() => router.push({ pathname: '/screens/PostViewerScreen', params: { postId: post.id } })}>
                  {post.imageUrl ? (
                    <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
                  ) : (
                    <Ionicons name="videocam" size={60} color={COLORS.accent} style={styles.postImagePlaceholder} />
                  )}
                </TouchableOpacity>
              )}
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => user && handleLikePost(post)} style={styles.actionBtn}>
                  <View style={styles.actionIcon}>
                    <FontAwesome name="thumbs-up" size={16} color={getLikeColor(!!post.likedBy && post.likedBy.includes(user?.id || ''))} />
                  </View>
                  <Text style={[styles.actionText, { color: getLikeColor(!!post.likedBy && post.likedBy.includes(user?.id || '')) }]}>Like</Text>
                  <Text style={styles.actionCount}>{post.likedBy?.length || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => openCommentModal(post)} style={styles.actionBtn}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="chatbubble" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.actionText}>Comment</Text>
                  <Text style={styles.actionCount}>{post.comments?.length || 0}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="send" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.actionText}>Send</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleSharePost(post.id)} style={styles.actionBtn}>
                  <View style={styles.actionIcon}>
                    <Ionicons name="arrow-redo" size={16} color={COLORS.primary} />
                  </View>
                  <Text style={styles.actionText}>Share</Text>
                  <Text style={styles.actionCount}>{post.shareCount || 0}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      {/* Comment Dialog */}
      {commentPostId && user?.id && (
        <CommentDialog
          postId={commentPostId}
          userId={user.id}
          onClose={() => setCommentPostId(null)}
          onComment={fetchPosts}
        />
      )}

      {/* Comment Modal */}
      {commentModalPost && (
        <Modal
          visible={!!commentModalPost}
          transparent
          animationType="slide"
          onRequestClose={() => setCommentModalPost(null)}
        >
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.3)' }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 24}
          >
            <View style={{
              backgroundColor: COLORS.white,
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 24,
              minHeight: 320,
              maxHeight: '60%',
              width: '100%',
              alignSelf: 'flex-end',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 8,
            }}>
              <View style={{ alignItems: 'center', marginBottom: 12 }}>
                <View style={{ width: 40, height: 5, borderRadius: 3, backgroundColor: '#eee', marginBottom: 8 }} />
                <Text style={styles.commentModalTitle}>Comments</Text>
              </View>
              <ScrollView style={{ maxHeight: 180, width: '100%' }}>
                {comments.length === 0 ? (
                  <Text style={{ color: COLORS.lightText, textAlign: 'center', marginVertical: 12 }}>No comments yet.</Text>
                ) : (
                  comments.map(c => (
                    <View key={c.id} style={{ marginBottom: 10 }}>
                      <Text style={{ fontWeight: 'bold' }}>{c.username}</Text>
                      <Text style={{ color: COLORS.text }}>{c.text}</Text>
                      <Text style={{ color: COLORS.lightText, fontSize: 12 }}>{new Date(c.createdAt).toLocaleString()}</Text>
                    </View>
                  ))
                )}
              </ScrollView>
              <TextInput
                style={styles.commentInput}
                placeholder="Write a comment..."
                value={commentText}
                onChangeText={setCommentText}
                multiline
              />
              <TouchableOpacity style={styles.commentSendBtn} onPress={handleAddPostComment} disabled={commentLoading}>
                <Text style={styles.commentSendText}>{commentLoading ? 'Posting...' : 'Send'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.commentCancelBtn} onPress={() => setCommentModalPost(null)}>
                <Text style={styles.commentCancelText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
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
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  logo: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  headerIcons: {
    flexDirection: 'row',
    gap: 12,
  },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scroll: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    padding: 12,
    marginBottom: 8,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
    borderWidth: 2,
    borderColor: COLORS.accent,
  },
  statusInput: {
    flex: 1,
    backgroundColor: '#F0F2F5',
    borderRadius: 20,
    paddingHorizontal: 16,
    height: 40,
    fontSize: 15,
    color: COLORS.text,
  },
  photoBtn: {
    marginLeft: 10,
  },
  storiesContainer: {
    paddingVertical: 12,
    paddingLeft: 12,
    backgroundColor: COLORS.white,
    marginBottom: 8,
  },
  storyItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 80,
  },
  storyImageContainer: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 2,
    borderColor: COLORS.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 6,
    overflow: 'hidden',
  },
  storyImage: {
    width: '100%',
    height: '100%',
  },
  storyLabel: {
    fontSize: 12,
    color: COLORS.text,
  },
  onlineDot: {
    position: 'absolute',
    bottom: 6,
    right: 6,
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#4CD137',
    borderWidth: 2,
    borderColor: COLORS.white,
  },
  post: {
    backgroundColor: COLORS.white,
    marginBottom: 8,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  postCard: {
    backgroundColor: COLORS.white,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  postUserInfo: {
    flex: 1,
  },
  postUserName: {
    fontWeight: 'bold',
    color: COLORS.text,
    fontSize: 16,
  },
  postTime: {
    color: COLORS.lightText,
    fontSize: 13,
  },
  postText: {
    fontSize: 15,
    color: COLORS.text,
    lineHeight: 20,
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1, // Square format
    marginBottom: 12,
  },
  postActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#eee',
    marginHorizontal: 16,
  },
  postAction: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    paddingHorizontal: 12,
  },
  postActionText: {
    marginLeft: 6,
    color: COLORS.lightText,
    fontSize: 14,
  },
  deleteBtn: {
    marginLeft: 12,
    padding: 6,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  addMenuBox: {
    marginTop: 60,
    marginRight: 18,
    borderRadius: 12,
    backgroundColor: COLORS.white,
    paddingVertical: 8,
    width: 200,
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
  },
  addMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  menuIconBg: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  addMenuText: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  loadingText: {
    textAlign: 'center',
    marginTop: 20,
    color: COLORS.lightText,
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
  postImagePlaceholder: {
    alignSelf: 'center',
    marginVertical: 12,
  },
  actionBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
  },
  actionCount: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.lightText,
  },
  commentModalBox: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 20,
    width: '90%',
    alignSelf: 'flex-end',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  commentModalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.text,
    marginBottom: 10,
    textAlign: 'center',
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    minHeight: 80,
    marginBottom: 15,
    textAlignVertical: 'top',
  },
  commentSendBtn: {
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginBottom: 10,
  },
  commentSendText: {
    color: COLORS.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  commentCancelBtn: {
    backgroundColor: '#F0F2F5',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  commentCancelText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '500',
  },
  actionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 6,
    backgroundColor: '#f0f2f5',
  },
  actionText: {
    color: COLORS.lightText,
    fontWeight: "500",
    fontSize: 14,
    marginRight: 4,
  },
});