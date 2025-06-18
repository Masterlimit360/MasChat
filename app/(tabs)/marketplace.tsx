import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React from "react";
import {
  FlatList,
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const products = [
  {
    id: "1",
    title: "PS 4",
    price: "GHS350",
    image:
      "https://i.imgur.com/6XbK6bE.jpg", // Replace with your own image URLs
  },
  {
    id: "2",
    title: "Nike Dunks",
    price: "GHS420",
    image:
      "https://i.imgur.com/2nCt3Sbl.jpg",
  },
  {
    id: "3",
    title: "Quality wig",
    price: "GHS200",
    image:
      "https://i.imgur.com/8Km9tLL.jpg",
  },
  {
    id: "4",
    title: "Men sneakers",
    price: "GHS350",
    image:
      "https://i.imgur.com/5tj6S7Ol.jpg",
  },
  {
    id: "5",
    title: "Car",
    price: "GHS??",
    image:
      "https://i.imgur.com/1A5QH0W.jpg",
  },
  {
    id: "6",
    title: "Bike",
    price: "GHS??",
    image:
      "https://i.imgur.com/2nCt3Sbl.jpg",
  },
];

export default function Marketplace() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Marketplace</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Ionicons name="person-outline" size={26} color="#222" />
          </TouchableOpacity>
          <TouchableOpacity
            style={{ marginLeft: 16 }}
            onPress={() => router.push("/SearchScreen")}
          >
            <Ionicons name="search" size={24} color="#1877f2" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity>
          <Text style={styles.tabText}>Sell</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.activeTab}>
          <Text style={styles.activeTabText}>For you</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.tabText}>Categories</Text>
        </TouchableOpacity>
      </View>

      {/* Location */}
      <View style={styles.locationRow}>
        <Text style={styles.sectionTitle}> Todays picks</Text>
        <View style={styles.locationInfo}>
          <MaterialIcons name="location-pin" size={18} color="#1877f2" />
          <Text style={styles.locationText}>Accra, Ghana · 5 km</Text>
        </View>
      </View>

      {/* Product Grid */}
      <FlatList
        data={products}
        keyExtractor={(item) => item.id}
        numColumns={2}
        contentContainerStyle={{ paddingBottom: 80 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Image source={{ uri: item.image }} style={styles.cardImage} />
            <Text style={styles.cardTitle}>
              {item.price} · {item.title}
            </Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    paddingTop: 12,
    paddingBottom: 8,
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  headerIcons: {
    flexDirection: "row",
    alignItems: "center",
  },
  tabs: {
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 18,
    marginBottom: 8,
    marginTop: 4,
  },
  tabText: {
    fontSize: 16,
    color: "#222",
    marginRight: 18,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 16,
  },
  activeTab: {
    backgroundColor: "#e7f0fd",
    borderRadius: 16,
    marginRight: 18,
  },
  activeTabText: {
    fontSize: 16,
    color: "#1877f2",
    fontWeight: "bold",
    paddingVertical: 6,
    paddingHorizontal: 10,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 18,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#222",
  },
  locationInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    color: "#1877f2",
    fontSize: 14,
    marginLeft: 2,
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  cardImage: {
    width: "100%",
    height: 120,
    resizeMode: "cover",
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "500",
    color: "#222",
    padding: 8,
    paddingBottom: 12,
  },
});