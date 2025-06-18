import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { FlatList, Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const RECENTS = [
  { id: "1", label: "akanakoji kyojiro", icon: "time-outline", color: "#888" },
  { id: "2", label: "Friends", icon: "people-circle", color: "#3b82f6" },
  { id: "3", label: "Birthdays", icon: "cake", color: "#10b981" },
];

export default function SearchScreen() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#666" />
        </TouchableOpacity>
        <View style={styles.inputWrapper}>
          <Image
            source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/8/8c/Meta_Platforms_Logo.svg" }}
            style={styles.metaIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Search with Meta AI"
            placeholderTextColor="#888"
            value={query}
            onChangeText={setQuery}
          />
        </View>
      </View>
      <View style={styles.recentsHeader}>
        <Text style={styles.recentsTitle}>Recent</Text>
        <TouchableOpacity>
          <Text style={styles.seeAll}>See all</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={RECENTS}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <View style={styles.recentItem}>
            <Ionicons name={item.icon} size={28} color={item.color} />
            <Text style={styles.recentLabel}>{item.label}</Text>
            <Ionicons name="ellipsis-horizontal" size={22} color="#888" style={{ marginLeft: "auto" }} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f2f5",
    paddingTop: 40,
    paddingBottom: 10,
    paddingHorizontal: 10,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    marginLeft: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  metaIcon: { width: 24, height: 24, marginRight: 6 },
  input: { flex: 1, fontSize: 16, color: "#000" },
  recentsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 18,
    marginBottom: 8,
    paddingHorizontal: 18,
  },
  recentsTitle: { fontSize: 18, fontWeight: "bold" },
  seeAll: { color: "#1877f2", fontSize: 15 },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 18,
  },
  recentLabel: { fontSize: 16, marginLeft: 14 },
});