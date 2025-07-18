import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Image, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import * as Animatable from 'react-native-animatable';
import Toast from 'react-native-toast-message';
import { useAuth } from '../context/AuthContext';
import client, { BASE_URL, testConnection } from '../api/client';

// Color Palette (matching home screen)
const COLORS = {
  primary: '#0A2463',  // Deep Blue
  accent: '#FF7F11',   // Vibrant Orange
  background: '#F5F7FA',
  white: '#FFFFFF',
  text: '#333333',
  lightText: '#888888',
};

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const { signIn } = useAuth();

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      username: '',
      password: '',
    };

    if (!username.trim()) {
      newErrors.username = 'Username is required';
      valid = false;
    }

    if (!password) {
      newErrors.password = 'Password is required';
      valid = false;
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;

    const isConnected = await testConnection();
    if (!isConnected) {
      Toast.show({
        type: 'error',
        text1: 'Connection Failed',
        text2: 'Cannot reach server. Check your network and server IP.',
        position: 'top',
        visibilityTime: 4000,
        topOffset: 60,
      });
      return;
    }

    setLoading(true);
    try {
      const response = await client.post(
        `/auth/login`,
        { username: username.trim(), password },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );

      if (response.data?.token) {
        let { token, user } = response.data;
        if (user.userId && !user.id) user = { ...user, id: user.userId };
        
        await signIn(token, user);
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('username', username.trim());
        
        Toast.show({
          type: 'success',
          text1: 'Login Successful',
          text2: 'Welcome back to MasChat!',
          position: 'top',
          visibilityTime: 3000,
          topOffset: 60,
        });
        router.replace('/(tabs)/home');
      }
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      Toast.show({
        type: 'error',
        text1: 'Login Error',
        text2: errorMessage,
        position: 'top',
        visibilityTime: 5000,
        topOffset: 60,
      });
    } finally {
      setLoading(false);
    }
  };

  const testConnection = async () => {
    try {
      await client.get(`/auth/test`, { timeout: 3000 });
      return true;
    } catch (error) {
      return false;
    }
  };

  useEffect(() => { testConnection(); }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />
      
      {/* Header matching home screen */}
      <LinearGradient
        colors={[COLORS.primary, '#1A4B8C']}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.logo}>
          Mas<Text style={{ color: COLORS.accent }}>Chat</Text>
        </Text>
      </LinearGradient>

      <Animatable.View animation="fadeInUp" duration={1000} style={styles.content}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Welcome Back!</Text>
          <Text style={styles.subtitle}>Connect, chat, and share with MasChat</Text>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Username"
              placeholderTextColor={COLORS.lightText}
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
            />
          </View>
          {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

          {/* Password Input */}
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color={COLORS.lightText} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={COLORS.lightText}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword((prev) => !prev)}>
              <Ionicons
                name={showPassword ? "eye-off-outline" : "eye-outline"}
                size={22}
                color={COLORS.lightText}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

          <TouchableOpacity
            style={[styles.button, loading && styles.disabledButton]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#ccc', '#ccc'] : [COLORS.primary, '#1A4B8C']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Logging in...' : 'Log In'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.forgot}>Forgot Password?</Text>
          </TouchableOpacity>
          
          <View style={styles.dividerContainer}>
            <View style={styles.divider} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.divider} />
          </View>
          
          <TouchableOpacity
            style={[styles.createButton, loading && styles.disabledButton]}
            onPress={() => router.push("/(auth)/signup")}
            disabled={loading}
          >
            <LinearGradient
              colors={loading ? ['#ccc', '#ccc'] : [COLORS.accent, '#FF9E40']}
              style={styles.createButtonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.createButtonText}>
                {loading ? 'Creating...' : 'Create New Account'}
              </Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </Animatable.View>
      <Toast />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    paddingTop: 50,
    paddingHorizontal: 16,
    paddingBottom: 20,
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  formContainer: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    color: COLORS.primary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    color: COLORS.lightText,
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: '#F0F2F5',
    borderRadius: 12,
    paddingHorizontal: 16,
    marginBottom: 8,
    height: 50,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: COLORS.text,
    fontSize: 16,
  },
  button: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 16,
    height: 50,
  },
  buttonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  forgot: {
    color: COLORS.primary,
    textAlign: "center",
    marginBottom: 16,
    fontSize: 14,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#e4e6eb",
  },
  or: {
    color: COLORS.lightText,
    marginHorizontal: 10,
    fontWeight: "bold",
    fontSize: 14,
  },
  createButton: {
    borderRadius: 12,
    overflow: 'hidden',
    height: 50,
  },
  createButtonGradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  createButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: "bold",
  },
  errorText: {
    color: "#f02849",
    fontSize: 13,
    marginBottom: 12,
    marginLeft: 12,
  },
});