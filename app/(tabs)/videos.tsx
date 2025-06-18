import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React, { useState } from "react";
import {
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const TABS = ["For you", "Live", "Reels", "Following"];

const videoFeed = [
  {
    id: 1,
    user: "RM002",
    date: "Nov 28, 2024",
    desc: "Part63",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
    videoThumb:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=800&q=80",
    likes: "444K",
    comments: "2.6K",
    shares: "1.7K",
    views: "51.4M",
  },
  {
    id: 2,
    user: "Sølø Bøíí",
    date: "Dec 4, 2024",
    desc: "Every child's favorite scene 😂",
    avatar: "https://randomuser.me/api/portraits/men/12.jpg",
    videoThumb:
      "https://images.unsplash.com/photo-1464983953574-0892a716854b?auto=format&fit=crop&w=800&q=80",
    likes: "120K",
    comments: "1.2K",
    shares: "800",
    views: "10.2M",
  },
];

export default function Videos() {
  const [activeTab, setActiveTab] = useState("For you");
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Video</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="person" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn} onPress={() => router.push('/SearchScreen')}>
            <Ionicons name="search" size={22} color="#222" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsRow}>
        {TABS.map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              styles.tabBtn,
              activeTab === tab && styles.tabBtnActive,
            ]}
            onPress={() => setActiveTab(tab)}
          >
            <Text
              style={[
                styles.tabText,
                activeTab === tab && styles.tabTextActive,
              ]}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Video Feed */}
      <ScrollView style={styles.feedScroll} showsVerticalScrollIndicator={false}>
        {videoFeed.map((item) => (
          <View style={styles.feed} key={item.id}>
            <View style={styles.feedHeader}>
              <Image source={{ uri: item.avatar }} style={styles.feedAvatar} />
              <View style={{ flex: 1 }}>
                <Text style={styles.feedName}>{item.user} <Text style={styles.follow}>· Follow</Text></Text>
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <Text style={styles.feedTime}>{item.date}</Text>
                  <Feather name="globe" size={12} color="#888" style={{ marginLeft: 4 }} />
                </View>
              </View>
              <Feather name="more-horizontal" size={20} color="#888" style={{ marginRight: 8 }} />
              <Ionicons name="close" size={20} color="#888" />
            </View>
            <Text style={styles.feedDesc}>{item.desc}</Text>
            <Image source={{ uri: item.videoThumb }} style={styles.feedVideo} />
            <View style={styles.statsRow}>
              <View style={styles.statsLeft}>
                <FontAwesome name="thumbs-o-up" size={16} color="#1877f2" />
                <Text style={styles.statsText}>{item.likes}</Text>
              </View>
              <Text style={styles.statsText}>{item.comments} comments</Text>
              <Text style={styles.statsText}>{item.shares} shares</Text>
              <Text style={styles.statsText}>{item.views} views</Text>
            </View>
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
                <Ionicons name="send-outline" size={20} color="#1877f2" />
                <Text style={styles.actionText}>Send</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn}>
                <Ionicons name="arrow-redo-outline" size={20} color="#1877f2" />
                <Text style={styles.actionText}>Share</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const { width } = Dimensions.get("window");

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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
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
  tabsRow: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e4e6eb",
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  tabBtn: {
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 20,
    marginRight: 8,
    backgroundColor: "transparent",
  },
  tabBtnActive: {
    backgroundColor: "#e7f0fd",
  },
  tabText: {
    fontSize: 16,
    color: "#222",
    fontWeight: "500",
  },
  tabTextActive: {
    color: "#1877f2",
    fontWeight: "bold",
  },
  feedScroll: {
    flex: 1,
    backgroundColor: "#f0f2f5",
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
  follow: {
    color: "#1877f2",
    fontWeight: "bold",
    fontSize: 14,
  },
  feedTime: {
    color: "#888",
    fontSize: 12,
  },
  feedDesc: {
    fontSize: 15,
    color: "#222",
    marginBottom: 8,
  },
  feedVideo: {
    width: width - 24,
    height: 220,
    borderRadius: 10,
    marginBottom: 8,
    backgroundColor: "#eee",
    alignSelf: "center",
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
    flexWrap: "wrap",
    gap: 8,
  },
  statsLeft: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 12,
  },
  statsText: {
    color: "#888",
    fontSize: 13,
    marginLeft: 4,
    marginRight: 8,
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