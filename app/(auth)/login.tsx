// import { styles } from "@/styles/auth.style};
import { Ionicons } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import React, { useState } from "react";
import { StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);

  const handleLogin = () => {
    // Add authentication logic here if needed
    setLoggedIn(true);
  };

  if (loggedIn) {
    return <Redirect href="/(tabs)/home" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#000" />
      <View style={styles.header}>
        <Ionicons name="chatbubbles" size={40} color="#1877f2" />
        <Text style={styles.title}>MasChat</Text>
      </View>
      <View style={styles.form}>
        <TextInput
          style={styles.input}
          placeholder="Email or Phone"
          placeholderTextColor="#aaa"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="#aaa"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.forgot}>Forgot Password?</Text>
        </TouchableOpacity>
        <View style={styles.dividerContainer}>
          <View style={styles.divider} />
          <Text style={styles.or}>OR</Text>
          <View style={styles.divider} />
        </View>
        <TouchableOpacity style={styles.createButton}>
          <Text style={styles.createButtonText}>Create New Account</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  title: {
    color: "#1877f2",
    fontSize: 36,
    fontWeight: "bold",
    marginTop: 8,
    letterSpacing: 1,
  },
  form: {
    backgroundColor: "#111",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#1877f2",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  input: {
    backgroundColor: "#222",
    color: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#1877f2",
  },
  button: {
    backgroundColor: "#1877f2",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  forgot: {
    color: "#1877f2",
    textAlign: "center",
    marginBottom: 16,
    textDecorationLine: "underline",
    fontSize: 15,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 16,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#222",
  },
  or: {
    color: "#aaa",
    marginHorizontal: 10,
    fontWeight: "bold",
  },
  createButton: {
    backgroundColor: "#222",
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#1877f2",
  },
  createButtonText: {
    color: "#1877f2",
    fontSize: 18,
    fontWeight: "bold",
  },
});

