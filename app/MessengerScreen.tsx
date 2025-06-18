import { FontAwesome, Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const stories = [
  { id: "1", label: "Create story", icon: "add-circle", isCreate: true },
  { id: "2", label: "Memories", image: "https://randomuser.me/api/portraits/men/1.jpg" },
  { id: "3", label: "Yussif", image: "https://randomuser.me/api/portraits/men/2.jpg", online: true },
  { id: "4", label: "Yvonne", image: "https://randomuser.me/api/portraits/women/3.jpg", online: true },
  { id: "5", label: "Dolla", image: "https://randomuser.me/api/portraits/men/4.jpg", online: true },
];

const chats = [
  {
    id: "1",
    name: "Albert Kusi",
    message: "Hi",
    date: "Jan 25",
    image: "https://randomuser.me/api/portraits/men/5.jpg",
    unread: true,
  },
  {
    id: "2",
    name: "Emmanuel Larbi",
    message: "👍",
    date: "Dec 22, 2024",
    image: "https://randomuser.me/api/portraits/men/6.jpg",
  },
  {
    id: "3",
    name: "Preety Shy",
    message: "Hello",
    date: "Dec 20, 2024",
    image: "https://randomuser.me/api/portraits/women/7.jpg",
  },
  {
    id: "4",
    name: "Sarfo Kelvin Senior",
    message: "You: Has it come?",
    date: "Dec 9, 2024",
    image: "https://randomuser.me/api/portraits/men/8.jpg",
    online: true,
    time: "43m",
  },
  {
    id: "5",
    name: "Augustine Awelima",
    message: "Messages and calls are se...",
    date: "Oct 9, 2024",
    image: "https://randomuser.me/api/portraits/men/9.jpg",
  },
];

export default function MessengerScreen() {
  const [search, setSearch] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>messenger</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.headerIconBtn}>
            <Ionicons name="create-outline" size={22} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.headerIconBtn}
            onPress={() => router.push("/(tabs)/home")}
          >
            <FontAwesome name="home" size={22} color="#1877f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <Ionicons name="search" size={20} color="#aaa" style={{ marginLeft: 8 }} />
        <TextInput
          style={styles.searchInput}
          placeholder="Ask Meta AI or Search"
          placeholderTextColor="#aaa"
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Stories and Chats */}
      <View style={{ flex: 1 }}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.storiesRow}
          contentContainerStyle={{ alignItems: "center" }}
        >
          {stories.map((story) =>
            story.isCreate ? (
              <View key={story.id} style={styles.storyItem}>
                <View style={styles.createStoryCircle}>
                  <Ionicons name={story.icon} size={38} color="#1877f2" />
                </View>
                <Text style={styles.storyLabel}>{story.label}</Text>
              </View>
            ) : (
              <View key={story.id} style={styles.storyItem}>
                <View>
                  <Image source={{ uri: story.image }} style={styles.storyImage} />
                  {story.online && <View style={styles.onlineDot} />}
                </View>
                <Text style={styles.storyLabel}>{story.label}</Text>
              </View>
            )
          )}
        </ScrollView>

        <FlatList
          data={chats}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.chatItem}>
              <View>
                <Image source={{ uri: item.image }} style={styles.chatImage} />
                {item.online && <View style={styles.onlineDotChat} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.chatName}>{item.name}</Text>
                <Text style={styles.chatMessage} numberOfLines={1}>
                  {item.message}
                </Text>
              </View>
              <View style={{ alignItems: "flex-end" }}>
                <Text style={styles.chatDate}>{item.date}</Text>
                {item.time && (
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeBadgeText}>{item.time}</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          )}
          ListFooterComponent={
            <View style={styles.marketplaceContainer}>
              <MaterialCommunityIcons name="storefront-outline" size={30} color="#fff" style={styles.marketIcon} />
              <Text style={styles.marketText}>Marketplace</Text>
            </View>
          }
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#18191a" },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 48,
    paddingBottom: 10,
    paddingHorizontal: 16,
    justifyContent: "space-between",
    backgroundColor: "#18191a",
  },
  headerTitle: { color: "#fff", fontSize: 28, fontWeight: "bold", textTransform: "lowercase" },
  headerIcons: { flexDirection: "row" },
  headerIconBtn: {
    backgroundColor: "#242526",
    borderRadius: 20,
    padding: 8,
    marginLeft: 10,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#242526",
    borderRadius: 20,
    marginHorizontal: 16,
    marginBottom: 10,
    height: 38,
  },
  searchInput: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    marginLeft: 8,
    paddingVertical: 0,
  },
  storiesRow: { paddingVertical: 8, paddingLeft: 10 },
  storyItem: { alignItems: "center", marginRight: 18, width: 68 },
  createStoryCircle: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: "#23272f",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  storyImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 4,
    borderWidth: 2,
    borderColor: "#1877f2",
  },
  storyLabel: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    marginTop: 2,
  },
  onlineDot: {
    position: "absolute",
    bottom: 6,
    right: 4,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#31a24c",
    borderWidth: 2,
    borderColor: "#18191a",
  },
  chatItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 13,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#23272f",
    backgroundColor: "#18191a",
  },
  chatImage: { width: 52, height: 52, borderRadius: 26 },
  chatName: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  chatMessage: { color: "#bbb", fontSize: 14, marginTop: 2 },
  chatDate: { color: "#bbb", fontSize: 12 },
  onlineDotChat: {
    position: "absolute",
    bottom: 6,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#31a24c",
    borderWidth: 2,
    borderColor: "#18191a",
  },
  timeBadge: {
    backgroundColor: "#242526",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginTop: 4,
  },
  timeBadgeText: { color: "#31a24c", fontSize: 11, fontWeight: "bold" },
  marketplaceContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#23272f",
    margin: 16,
    borderRadius: 12,
    padding: 14,
  },
  marketIcon: { marginRight: 12 },
  marketText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});