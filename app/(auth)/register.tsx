import { Ionicons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSubscriptions } from "../../context/SubscriptionContext";

export default function RegisterScreen() {
  const { login } = useSubscriptions();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // 1. Error & UI States
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // 2. Validation Logic
  const validateForm = () => {
    let isValid = true;

    setNameError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");

    if (!name.trim()) {
      setNameError("Full Name is required");
      isValid = false;
    }

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
    } else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      isValid = false;
    }

    if (!confirmPassword) {
      setConfirmPasswordError("Please confirm your password");
      isValid = false;
    } else if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      isValid = false;
    }

    return isValid;
  };

  // 3. Submission Handler
  const handleSignUp = () => {
    if (validateForm()) {
      login(email, name);
      router.replace("/(tabs)");
    }
  };

  const handleGoToLogin = () => {
    router.back();
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Ionicons
            name="shield-checkmark"
            size={48}
            color="#23C481"
            style={styles.logoIcon}
          />
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>
            Start tracking your subscriptions.
          </Text>
        </View>

        <View style={styles.form}>
          {/* Name Input */}
          <View>
            <View
              style={[
                styles.inputContainer,
                nameError ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="person-outline"
                size={20}
                color={nameError ? "#FF4B4B" : "#A0AAB2"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#A0AAB2"
                value={name}
                onChangeText={(text) => {
                  setName(text);
                  if (nameError) setNameError("");
                }}
              />
            </View>
            {nameError ? (
              <Text style={styles.errorText}>{nameError}</Text>
            ) : null}
          </View>

          {/* Email Input */}
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

          {/* Password Input */}
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
                  if (confirmPasswordError && text === confirmPassword) {
                    setConfirmPasswordError("");
                  }
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

          {/* Confirm Password Input */}
          <View>
            <View
              style={[
                styles.inputContainer,
                confirmPasswordError ? styles.inputError : null,
              ]}
            >
              <Ionicons
                name="lock-closed-outline"
                size={20}
                color={confirmPasswordError ? "#FF4B4B" : "#A0AAB2"}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Confirm Password"
                placeholderTextColor="#A0AAB2"
                secureTextEntry={!showConfirmPassword}
                value={confirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (confirmPasswordError) setConfirmPasswordError("");
                }}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                style={styles.eyeIcon}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={20}
                  color="#A0AAB2"
                />
              </TouchableOpacity>
            </View>
            {confirmPasswordError ? (
              <Text style={styles.errorText}>{confirmPasswordError}</Text>
            ) : null}
          </View>

          <TouchableOpacity
            style={styles.registerButton}
            onPress={handleSignUp}
          >
            <Text style={styles.registerButtonText}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={handleGoToLogin}>
            <Text style={styles.loginText}>Log In</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0B110D" },
  scrollContent: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 32,
    paddingVertical: 48,
  },
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
  form: { gap: 16, marginBottom: 32 },
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
  registerButton: {
    backgroundColor: "#23C481",
    borderRadius: 500,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  registerButtonText: { color: "#0B110D", fontSize: 16, fontWeight: "bold" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: { color: "#A0AAB2", fontSize: 14 },
  loginText: { color: "#23C481", fontSize: 14, fontWeight: "bold" },
});
