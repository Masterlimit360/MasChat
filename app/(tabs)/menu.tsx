import { Entypo, FontAwesome5, Ionicons, MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from 'expo-router';
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const user = {
  name: "Kelvin Junior Sarfo",
  avatar: "https://randomuser.me/api/portraits/men/1.jpg",
  badge: 9,
};

const shortcuts = [
  {
    name: "Preety Shy",
    avatar: "https://randomuser.me/api/portraits/men/31.jpg",
  },
  {
    name: "Sarfo Kelvin Senior",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
];

const menuOptions = [
  {
    label: "Friends",
    icon: <MaterialIcons name="people" size={24} color="#1877f2" />,
  },
  {
    label: "Professional dashboard",
    icon: <MaterialCommunityIcons name="view-dashboard" size={24} color="#1877f2" />,
  },
  {
    label: "Memories",
    icon: <MaterialIcons name="history" size={24} color="#1877f2" />,
  },
  {
    label: "Feeds",
    icon: <MaterialCommunityIcons name="rss" size={24} color="#1877f2" />,
  },
  {
    label: "Groups",
    icon: <FontAwesome5 name="users" size={24} color="#1877f2" />,
  },
  {
    label: "Marketplace",
    icon: <FontAwesome5 name="store" size={24} color="#1877f2" />,
  },
  {
    label: "Reels",
    icon: <Entypo name="video" size={24} color="#1877f2" />,
  },
  {
    label: "Saved",
    icon: <MaterialIcons name="bookmark" size={24} color="#a259e6" />,
  },
];

export default function Menu() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity style={styles.iconBtn}>
            <Ionicons name="settings-sharp" size={22} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push('/SearchScreen')} style={styles.iconBtn}>
            <Ionicons name="search" size={22} color="#222" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <TouchableOpacity
        onPress={() => router.push("/(tabs)/profile")}
        style={styles.profileCard}
      >
        <Image source={{ uri: user.avatar }} style={styles.profileAvatar} />
        <Text style={styles.profileName}>{user.name}</Text>
        <View style={styles.profileBadgeWrap}>
            <Image source={{ uri: shortcuts[1].avatar }} style={styles.profileBadgeAvatar} />
            <View style={styles.badgeCircle}>
              <Text style={styles.badgeText}>{user.badge}+</Text>
            </View>
        </View>
        </TouchableOpacity>
        
        {/* Shortcuts */}
        <Text style={styles.sectionLabel}>Your shortcuts</Text>
        <View style={styles.shortcutsRow}>
          {shortcuts.map((item, idx) => (
            <View key={item.name} style={styles.shortcutItem}>
              <Image source={{ uri: item.avatar }} style={styles.shortcutAvatar} />
              <Text style={styles.shortcutName}>{item.name}</Text>
            </View>
          ))}
        </View>
        {/* Meta AI Promo */}
        <View style={styles.metaCard}>
          <View style={styles.metaRow}>
            <View style={styles.metaIconWrap}>
              <Ionicons name="aperture-outline" size={28} color="#a259e6" />
            </View>
            <TouchableOpacity>
              <Ionicons name="close" size={22} color="#888" />
            </TouchableOpacity>
          </View>
          <Text style={styles.metaTitle}>See what others are doing on the Meta AI app</Text>
          <Text style={styles.metaDesc}>Get inspired by how others are editing images and getting creative.</Text>
          <TouchableOpacity style={styles.metaBtn}>
            <Text style={styles.metaBtnText}>Download</Text>
          </TouchableOpacity>
        </View>
        {/* Menu Options Grid */}
        <View style={styles.menuGrid}>
          {menuOptions.map((item) => (
            <TouchableOpacity key={item.label} style={styles.menuOption}>
              {item.icon}
              <Text style={styles.menuLabel}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6f7fa",
  },
  header: {
    backgroundColor: "#f6f7fa",
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 18,
    paddingHorizontal: 16,
    paddingBottom: 8,
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
  scroll: {
    flex: 1,
  },
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 8,
    marginBottom: 10,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
    flex: 1,
  },
  profileBadgeWrap: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  profileBadgeAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#fff",
    marginRight: -10,
    zIndex: 2,
  },
  badgeCircle: {
    backgroundColor: "#f02849",
    borderRadius: 12,
    width: 28,
    height: 24,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 2,
    zIndex: 1,
  },
  badgeText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 13,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginLeft: 16,
    marginTop: 10,
    marginBottom: 6,
  },
  shortcutsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 12,
    marginBottom: 10,
  },
  shortcutItem: {
    alignItems: "center",
    marginRight: 18,
  },
  shortcutAvatar: {
    width: 54,
    height: 54,
    borderRadius: 27,
    marginBottom: 4,
  },
  shortcutName: {
    fontSize: 13,
    color: "#222",
    maxWidth: 70,
    textAlign: "center",
  },
  metaCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  metaRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  metaIconWrap: {
    backgroundColor: "#f3e9fd",
    borderRadius: 12,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  metaTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#222",
    marginBottom: 2,
  },
  metaDesc: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  metaBtn: {
    backgroundColor: "#1877f2",
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: "center",
  },
  metaBtnText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginHorizontal: 12,
    marginTop: 8,
  },
  menuOption: {
    backgroundColor: "#fff",
    borderRadius: 14,
    width: "48%",
    marginBottom: 12,
    paddingVertical: 18,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.03,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 1,
  },
  menuLabel: {
    fontSize: 15,
    color: "#222",
    marginTop: 8,
    fontWeight: "500",
  },
});