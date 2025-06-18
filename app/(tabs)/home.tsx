import { Feather, FontAwesome, Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from "react";
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.logo}>MasChat</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="add" size={24} color="#050505" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/SearchScreen')}>
            <Ionicons name="search" size={24} color="#1877f2" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push("/MessengerScreen")}>
            <Ionicons name="chatbubble-ellipses" size={28} color="#050505" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* What's on your mind */}
        <View style={styles.statusContainer}>
          <TouchableOpacity onPress={() => router.push("/(tabs)/profile")}>
          <Image
            source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }} // Replace with user's profile image URI
            style={styles.avatar}
          />
        </TouchableOpacity>
          <TextInput
            style={styles.statusInput}
            placeholder="What's on your mind?"
            placeholderTextColor="#888"
          />
          <MaterialIcons name="photo-library" size={28} color="#1877f2" />
        </View>

        {/* Stories */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.storiesRow}>
          <View style={styles.story}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={styles.storyAvatar}
            />
            <View style={styles.addStoryBtn}>
              <Ionicons name="add" size={18} color="#fff" />
            </View>
            <Text style={styles.storyLabel}>Create story</Text>
          </View>
          {[2, 3, 4, 5].map((n) => (
            <View style={styles.story} key={n}>
              <Image
                source={{ uri: `https://randomuser.me/api/portraits/men/${n}.jpg` }}
                style={styles.storyAvatar}
              />
              <View style={styles.storyRing} />
              <Text style={styles.storyLabel}>Friend {n}</Text>
            </View>
          ))}
        </ScrollView>

        {/* Feed */}
        <View style={styles.feed}>
          <View style={styles.feedHeader}>
            <Image
              source={{ uri: "https://randomuser.me/api/portraits/men/1.jpg" }}
              style={styles.feedAvatar}
            />
            <View>
              <Text style={styles.feedName}>SikaCash Empiregh</Text>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.feedTime}>1d</Text>
                <Feather name="globe" size={12} color="#888" style={{ marginLeft: 4 }} />
              </View>
            </View>
            <Feather name="more-horizontal" size={20} color="#888" style={{ marginLeft: "auto" }} />
          </View>
          <Text style={styles.feedText}>Check out this awesome place!</Text>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
            }}
            style={styles.feedImage}
          />
          <View style={styles.feedActions}>
            <TouchableOpacity style={styles.actionBtn}>
              <FontAwesome name="thumbs-o-up" size={20} color="#1877f2" />
              <Text style={styles.actionText}>Like</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="chatbubble-outline" size={20} color="#1877f2" />
              <Text style={styles.actionText}>Comment</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn}>
              <Ionicons name="arrow-redo-outline" size={20} color="#1877f2" />
              <Text style={styles.actionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Add more feed items here as needed */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  header: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#e4e6eb",
  },
  logo: {
    color: "#1877f2",
    fontSize: 32,
    fontWeight: "bold",
    fontFamily: "sans-serif",
    letterSpacing: 1,
    flex: 1,
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconBtn: {
    backgroundColor: "#e4e6eb",
    borderRadius: 20,
    padding: 6,
    marginLeft: 10,
  },
  scroll: {
    flex: 1,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    marginTop: 8,
    marginHorizontal: 0,
    padding: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 10,
  },
  statusInput: {
    flex: 1,
    backgroundColor: "#f0f2f5",
    borderRadius: 20,
    paddingHorizontal: 16,
    fontSize: 16,
    marginRight: 10,
    color: "#222",
    height: 40,
  },
  storiesRow: {
    flexDirection: "row",
    paddingVertical: 10,
    paddingLeft: 8,
    backgroundColor: "#fff",
    marginBottom: 8,
  },
  story: {
    width: 80,
    alignItems: "center",
    marginRight: 10,
    position: "relative",
  },
  storyAvatar: {
    width: 60,
    height: 60,
    borderRadius: 18,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "#1877f2",
  },
  addStoryBtn: {
    position: "absolute",
    bottom: 24,
    left: 28,
    backgroundColor: "#1877f2",
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: "#fff",
  },
  storyRing: {
    position: "absolute",
    top: 0,
    left: 0,
    width: 60,
    height: 60,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "#1877f2",
  },
  storyLabel: {
    fontSize: 12,
    color: "#222",
    textAlign: "center",
    marginTop: 2,
  },
  feed: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 0,
    marginVertical: 8,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  feedHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  feedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  feedName: {
    fontWeight: "bold",
    fontSize: 15,
    color: "#222",
  },
  feedTime: {
    color: "#888",
    fontSize: 12,
  },
  feedText: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
  },
  feedImage: {
    width: "100%",
    height: 200,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
  },
  feedActions: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderTopWidth: 1,
    borderTopColor: "#e4e6eb",
    paddingTop: 8,
    marginTop: 4,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  actionText: {
    color: "#1877f2",
    fontWeight: "bold",
    marginLeft: 6,
    fontSize: 15,
  },
});