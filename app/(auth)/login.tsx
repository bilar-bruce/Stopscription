import { Ionicons } from "@expo/vector-icons";
import { Link, router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubscriptions } from "../../context/SubscriptionContext";

export default function LoginScreen() {
  const { login, runWithActionLoader, showToast } = useSubscriptions();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 1. Error States & UI States
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // 2. Validation Logic
  const validateForm = () => {
    let isValid = true;

    setEmailError("");
    setPasswordError("");

    if (!email.trim()) {
      setEmailError("Email is required");
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    }

    if (!password) {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  // 3. Submission Handler
  const handleLogin = () => {
    if (validateForm()) {
      runWithActionLoader(
        "Signing in...",
        () => {
          login(email);
          router.replace("/(tabs)");
          showToast("Welcome back!");
        },
        320
      );
    }
  };

  const handleQuickDemoLogin = () => {
    runWithActionLoader(
      "Loading Bruce's Trial Vault...",
      () => {
        login("bruce-bilar@gmail.com", "Bruce");
        router.replace("/(tabs)");
        showToast("Signed in as Bruce");
      },
      300
    );
  };

  const handleRegister = () => {
    router.push("/(auth)/register");
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <View style={styles.content}>
        <View style={styles.header}>
          <Ionicons
            name="shield-checkmark"
            size={48}
            color="#23C481"
            style={styles.logoIcon}
          />
          <Text style={styles.title}>Stopscription</Text>
          <Text style={styles.subtitle}>Take control of your trials.</Text>
        </View>

        <View style={styles.form}>
          <View>
            <View
              style={[
                styles.inputContainer,
                emailError ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="mail-outline"
                size={20}
                color={emailError ? "#FF4B4B" : "#A0AAB2"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Email"
                placeholderTextColor="#A0AAB2"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={(text) => {
                  setEmail(text);
                  if (emailError) setEmailError("");
                }}
              />
            </View>
            {emailError ? (
              <Text style={styles.errorText}>{emailError}</Text>
            ) : null}
          </View>

          <View>
            <View
              style={[
                styles.inputContainer,
                passwordError ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={passwordError ? "#FF4B4B" : "#A0AAB2"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#A0AAB2"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={(text) => {
                  setPassword(text);
                  if (passwordError) setPasswordError("");
                }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#A0AAB2"
                />
              </TouchableOpacity>
            </View>
            {passwordError ? (
              <Text style={styles.errorText}>{passwordError}</Text>
            ) : null}
          </View>

          {/* Forgot Password Link */}
          <View style={styles.forgotPasswordContainer}>
            <Link
              href="/(auth)/forgot-password"
              style={styles.forgotPasswordText}
            >
              Forgot password?
            </Link>
          </View>

          <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
            <Text style={styles.loginButtonText}>Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.demoLoginButton}
            onPress={handleQuickDemoLogin}
          >
            <Ionicons name="flash-outline" size={16} color="#23C481" />
            <Text style={styles.demoLoginText}>Quick Demo Login as Bruce</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don&apos;t have an account? </Text>
          <TouchableOpacity onPress={handleRegister}>
            <Text style={styles.registerText}>Sign Up</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B110D" },
  content: { flex: 1, justifyContent: "center", paddingHorizontal: 32 },
  header: { alignItems: "center", marginBottom: 40 },
  logoIcon: { marginBottom: 16 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: { fontSize: 16, color: "#A0AAB2", fontWeight: "500" },
  form: { gap: 16, marginBottom: 28 },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#181C1A",
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: "transparent",
  },
  inputError: { borderColor: "#FF4B4B" },
  errorText: { color: "#FF4B4B", fontSize: 12, marginTop: 4, marginLeft: 4 },
  inputIcon: { marginRight: 12 },
  eyeIcon: { paddingLeft: 8 },
  input: { flex: 1, color: "#FFFFFF", fontSize: 16, fontWeight: "500" },

  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginTop: -8,
  },
  forgotPasswordText: {
    color: "#23C481",
    fontSize: 14,
    fontWeight: "500",
  },

  loginButton: {
    backgroundColor: "#23C481",
    borderRadius: 500,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 4,
  },
  loginButtonText: { color: "#0B110D", fontSize: 16, fontWeight: "bold" },
  demoLoginButton: {
    flexDirection: "row",
    backgroundColor: "#181C1A",
    borderWidth: 1,
    borderColor: "rgba(35, 196, 129, 0.35)",
    borderRadius: 500,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  demoLoginText: {
    color: "#23C481",
    fontSize: 14,
    fontWeight: "bold",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#A0AAB2", fontSize: 14 },
  registerText: { color: "#23C481", fontSize: 14, fontWeight: "bold" },
});
