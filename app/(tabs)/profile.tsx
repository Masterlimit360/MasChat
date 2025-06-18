import { Feather, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const COVER_PHOTO = "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80";
const PROFILE_PHOTO = "https://i.imgur.com/6XbK6bE.jpg"; // Replace with your own
const STORY_IMAGES = [
  "https://i.imgur.com/6XbK6bE.jpg",
  "https://i.imgur.com/2nCt3Sbl.jpg",
  "https://i.imgur.com/8Km9tLL.jpg"
];

export default function Profile() {
  const router = useRouter();

  return (
    <ScrollView style={styles.container}>
      {/* Cover Photo */}
      <View style={styles.coverContainer}>
        <Image source={{ uri: COVER_PHOTO }} style={styles.coverPhoto} />
        {/* Profile Picture */}
        <View style={styles.profilePicWrapper}>
          <Image source={{ uri: PROFILE_PHOTO }} style={styles.profilePic} />
          <TouchableOpacity style={styles.cameraBtn}>
            <Ionicons name="camera" size={20} color="#222" />
          </TouchableOpacity>
        </View>
        {/* Top right icons */}
        <View style={styles.topIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Feather name="edit-2" size={20} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="share-outline" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/SearchScreen')}>
            <Ionicons name="search" size={24} color="#1877f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Name & Stats */}
      <View style={styles.infoSection}>
        <Text style={styles.name}>Kelvin Junior Sarfo <Ionicons name="checkmark-circle" size={18} color="#1877f2" /></Text>
        <Text style={styles.stats}>645 followers · 11 following</Text>
        {/* Story Highlights */}
        <View style={styles.storiesRow}>
          {STORY_IMAGES.map((img, idx) => (
            <Image key={idx} source={{ uri: img }} style={styles.storyImg} />
          ))}
          <View style={styles.storyAdd}>
            <Ionicons name="add" size={22} color="#1877f2" />
          </View>
        </View>
        {/* Bio */}
        <Text style={styles.bio}>Progressing is an action not a caption <Ionicons name="help-circle" size={14} color="#222" /></Text>
      </View>

      {/* Action Buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={styles.actionBtnBlue}>
          <Text style={styles.actionBtnBlueText}>Professional dashboard</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Text style={styles.actionBtnText}>Create reel</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.advertiseBtn}>
        <MaterialIcons name="campaign" size={18} color="#222" />
        <Text style={styles.advertiseText}>Advertise</Text>
      </TouchableOpacity>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>Posts</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>About</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Videos</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Photos</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Events</Text>
        </TouchableOpacity>
      </View>

      {/* Details */}
      <View style={styles.detailsSection}>
        <Text style={styles.detailsTitle}>Details</Text>
        <View style={styles.detailRow}>
          <Ionicons name="information-circle-outline" size={18} color="#222" />
          <Text style={styles.detailText}><Text style={{ fontWeight: 'bold' }}>Profile</Text> · Just for fun</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.aboutLink}>See your About info</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.editBtn}>
          <Text style={styles.editBtnText}>Edit public details</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  coverContainer: { position: "relative", height: 180, backgroundColor: "#eee" },
  coverPhoto: { width: "100%", height: "100%" },
  profilePicWrapper: {
    position: "absolute",
    left: 18,
    bottom: -48,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: "#fff",
    backgroundColor: "#fff",
    zIndex: 2,
  },
  profilePic: { width: 96, height: 96, borderRadius: 48 },
  cameraBtn: {
    position: "absolute",
    right: -8,
    bottom: 8,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 4,
    elevation: 2,
  },
  topIcons: {
    position: "absolute",
    right: 12,
    top: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 2,
  },
  iconBtn: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 6,
    marginLeft: 8,
    elevation: 2,
  },
  infoSection: {
    marginTop: 56,
    alignItems: "flex-start",
    paddingHorizontal: 18,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  name: { fontSize: 24, fontWeight: "bold", color: "#222", marginBottom: 2 },
  stats: { color: "#444", fontSize: 15, marginBottom: 8 },
  storiesRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  storyImg: {
    width: 38,
    height: 38,
    borderRadius: 19,
    marginRight: 6,
    borderWidth: 2,
    borderColor: "#fff",
    backgroundColor: "#eee",
  },
  storyAdd: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#e7f0fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
    borderWidth: 2,
    borderColor: "#fff",
  },
  bio: { fontSize: 15, color: "#222", marginBottom: 8 },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginTop: 10,
  },
  actionBtnBlue: {
    backgroundColor: "#1877f2",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    marginRight: 8,
    alignItems: "center",
  },
  actionBtnBlueText: { color: "#fff", fontWeight: "bold", fontSize: 15 },
  actionBtn: {
    backgroundColor: "#e7f0fd",
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    flex: 1,
    alignItems: "center",
  },
  actionBtnText: { color: "#1877f2", fontWeight: "bold", fontSize: 15 },
  advertiseBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f2f2f2",
    marginHorizontal: 18,
    marginTop: 10,
    borderRadius: 8,
    paddingVertical: 10,
    justifyContent: "center",
  },
  advertiseText: { marginLeft: 8, color: "#222", fontWeight: "bold" },
  tabsRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    marginTop: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  activeTab: {
    backgroundColor: "#e7f0fd",
    borderRadius: 16,
    marginRight: 8,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  activeTabText: { color: "#1877f2", fontWeight: "bold", fontSize: 15 },
  tabText: {
    color: "#222",
    fontSize: 15,
    marginRight: 12,
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  detailsSection: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 32,
  },
  detailsTitle: { fontWeight: "bold", fontSize: 17, marginBottom: 8 },
  detailRow: { flexDirection: "row", alignItems: "center", marginBottom: 6 },
  detailText: { marginLeft: 8, fontSize: 15, color: "#222" },
  aboutLink: { color: "#1877f2", marginTop: 4, marginBottom: 14, fontSize: 15 },
  editBtn: {
    backgroundColor: "#e7f0fd",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
    marginTop: 4,
  },
  editBtnText: { color: "#1877f2", fontWeight: "bold", fontSize: 15 },
});