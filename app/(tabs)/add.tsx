import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";

export default function AddTrialScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.navigate("/(tabs)")}>
            <Ionicons
              name="chevron-back"
              size={24}
              color={Colors.textPrimary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Add Trial</Text>
          <View style={{ width: 24 }} />{" "}
          {/* Invisible spacer to perfectly center the title */}
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* Main Form Card */}
          <View style={styles.formCard}>
            {/* Service Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SERVICE NAME</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Canva Pro"
                  placeholderTextColor={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Expiration Date Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TRIAL EXPIRATION DATE</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Select expiration date (e.g. Oct 24, 2024)"
                  placeholderTextColor={Colors.textSecondary}
                />
                <Ionicons
                  name="calendar-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Post-Trial Cost Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>POST-TRIAL COST</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="₱0.00/mo"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                />
              </View>
            </View>

            {/* Cancellation URL Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CANCELLATION URL</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="Paste link here"
                  placeholderTextColor={Colors.textSecondary}
                  autoCapitalize="none"
                />
                <Ionicons
                  name="link-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save & Set Reminders</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
  },
  container: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 16,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.background, // Darker background for the inputs to pop against the card
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 52,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 15,
  },
});
