import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AdCenterScreen() {
  const router = useRouter();
  return (
    <LinearGradient colors={['#f5f7fa', '#e4e8f0']} style={styles.container}>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.push('/(tabs)/menu')}>
        <Ionicons name="arrow-back" size={24} color="#3A8EFF" />
      </TouchableOpacity>
      <Text style={styles.title}>Ad Center</Text>
      <Text style={styles.subtitle}>Ad Center features will appear here soon.</Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: { position: 'absolute', top: 50, left: 20, zIndex: 10, backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 20, padding: 6 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#3A8EFF', marginBottom: 12 },
  subtitle: { fontSize: 16, color: '#888' },
}); 