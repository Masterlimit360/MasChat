import { FontAwesome, Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const notifications = [
  {
    id: 1,
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    name: "Prophetic Coomson",
    message: "sent you a friend request.",
    mutual: "Wesley Oduro and 6 other mutual friends",
    actions: ["Confirm", "Delete"],
    isNew: true,
  },
  {
    id: 2,
    avatar: "https://randomuser.me/api/portraits/men/21.jpg",
    name: "Prophetic Coomson",
    message: "sent you a friend request that you haven't responded to yet.",
    time: "1w",
    isNew: true,
  },
  {
    id: 3,
    name: "Akanakoji Kyojiro",
    message: "We have an update about your report of Akanakoji Kyojiro.",
    time: "5d",
    isNew: true,
    isReport: true,
  },
  {
    id: 4,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "",
    message: "Blast to the past with your post from December 2023.",
    time: "9h",
    isNew: true,
    isBlast: true,
  },
  {
    id: 5,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "",
    message:
      "Blast to the past with your post from December 2023 with Dnaiel Yeboah, Cecilia Hodey and 12 others: '😲😲'...",
    time: "2d",
    isNew: true,
    isBlast: true,
  },
  {
    id: 6,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "",
    message: "Blast to the past with your post from August 2020.",
    time: "1d",
    isNew: true,
    isBlast: true,
  },
  {
    id: 7,
    avatar: "https://randomuser.me/api/portraits/men/22.jpg",
    name: "",
    message: "Remember what you were up to in April 2024.",
    time: "5d",
    actions: ["Remix", "Dismiss"],
    isNew: true,
    isBlast: true,
  },
];

export default function Notifications() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Notifications</Text>
        <TouchableOpacity
          onPress={() => router.push("/SearchScreen")}
          style={styles.iconBtn}
        >
          <Ionicons name="search" size={24} color="#1877f2" />
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <Text style={styles.sectionLabel}>New</Text>
        {notifications.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.row}>
              {item.isReport ? (
                <View style={styles.reportIconWrap}>
                  <FontAwesome name="flag" size={24} color="#1877f2" />
                </View>
              ) : (
                <Image
                  source={
                    typeof item.avatar === "string"
                      ? { uri: item.avatar }
                      : item.avatar
                  }
                  style={styles.avatar}
                />
              )}
              <View style={{ flex: 1 }}>
                <Text style={styles.messageText}>
                  {item.name ? (
                    <Text style={styles.bold}>{item.name} </Text>
                  ) : null}
                  {item.message}
                </Text>
                {item.mutual && (
                  <Text style={styles.mutual}>{item.mutual}</Text>
                )}
                {item.time && <Text style={styles.time}>{item.time}</Text>}
              </View>
              <TouchableOpacity>
                <Ionicons name="ellipsis-horizontal" size={22} color="#888" />
              </TouchableOpacity>
            </View>
            {item.actions && (
              <View style={styles.actionsRow}>
                {item.actions.map((action) => (
                  <TouchableOpacity
                    key={action}
                    style={[
                      styles.actionBtn,
                      action === "Confirm" || action === "Remix"
                        ? styles.primaryBtn
                        : styles.secondaryBtn,
                    ]}
                  >
                    <Text
                      style={[
                        styles.actionText,
                        action === "Confirm" || action === "Remix"
                          ? styles.primaryText
                          : styles.secondaryText,
                      ]}
                    >
                      {action}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
        ))}
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
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
  },
  iconBtn: {
    backgroundColor: "#e4e6eb",
    borderRadius: 20,
    padding: 6,
    marginLeft: 10,
  },
  scroll: {
    flex: 1,
    backgroundColor: "#f0f2f5",
  },
  sectionLabel: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    marginTop: 16,
    marginBottom: 8,
    marginLeft: 16,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    padding: 12,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  reportIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#e7f0fd",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  messageText: {
    fontSize: 15,
    color: "#222",
    marginBottom: 2,
  },
  bold: {
    fontWeight: "bold",
    color: "#222",
  },
  mutual: {
    fontSize: 13,
    color: "#888",
    marginBottom: 2,
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  actionsRow: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
  },
  actionBtn: {
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 18,
    marginLeft: 8,
  },
  primaryBtn: {
    backgroundColor: "#1877f2",
  },
  secondaryBtn: {
    backgroundColor: "#e4e6eb",
  },
  actionText: {
    fontSize: 15,
    fontWeight: "bold",
  },
  primaryText: {
    color: "#fff",
  },
  secondaryText: {
    color: "#222",
  },
});