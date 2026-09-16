import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Switch,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";

export default function RemindersScreen() {
  // State to manage the toggles (matching the mockup's default states)
  const [earlyWarning, setEarlyWarning] = useState(true);
  const [actionReminder, setActionReminder] = useState(true);
  const [emergencyStrike, setEmergencyStrike] = useState(false);

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate("/(tabs)")}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <View style={{ width: 24 }} /> {/* Invisible spacer */}
      </View>

      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Titles */}
        <Text style={styles.sectionLabel}>SUBSCRIPTION ALERTS</Text>
        <Text style={styles.sectionDescription}>
          Customize when you get alerted before renewal dates.
        </Text>

        {/* Main Settings Card */}
        <View style={styles.card}>
          {/* Toggle 1: Early Warning */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Early Warning</Text>
              <Text style={styles.settingSubtitle}>72 hours before expiry</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.background, true: Colors.primary }}
              thumbColor={
                earlyWarning ? Colors.background : Colors.textSecondary
              }
              ios_backgroundColor={Colors.background}
              onValueChange={setEarlyWarning}
              value={earlyWarning}
            />
          </View>

          {/* Toggle 2: Action Reminder */}
          <View style={styles.settingRow}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Action Reminder</Text>
              <Text style={styles.settingSubtitle}>24 hours before expiry</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.background, true: Colors.primary }}
              thumbColor={
                actionReminder ? Colors.background : Colors.textSecondary
              }
              ios_backgroundColor={Colors.background}
              onValueChange={setActionReminder}
              value={actionReminder}
            />
          </View>

          {/* Toggle 3: Emergency Strike */}
          <View style={[styles.settingRow, styles.lastSettingRow]}>
            <View style={styles.settingTextContainer}>
              <Text style={styles.settingTitle}>Emergency Strike</Text>
              <Text style={styles.settingSubtitle}>2 hours before expiry</Text>
            </View>
            <Switch
              trackColor={{ false: Colors.background, true: Colors.primary }}
              thumbColor={
                emergencyStrike ? Colors.background : Colors.textSecondary
              }
              ios_backgroundColor={Colors.background}
              onValueChange={setEmergencyStrike}
              value={emergencyStrike}
            />
          </View>

          {/* Info Box */}
          <View style={styles.infoBox}>
            <Ionicons
              name="information-circle"
              size={20}
              color={Colors.primary}
              style={styles.infoIcon}
            />
            <Text style={styles.infoText}>
              Push alerts are sent directly to your device. Keep at least one
              alert active to prevent unexpected charges.
            </Text>
          </View>

          {/* Save Button */}
          <TouchableOpacity style={styles.saveButton}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
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
    paddingBottom: 24,
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
  sectionLabel: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 8,
  },
  sectionDescription: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 24,
  },
  card: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
  },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#2A302D", // Subtle dividing line
  },
  lastSettingRow: {
    borderBottomWidth: 0, // Removes the line for the last toggle
    marginBottom: 16,
  },
  settingTextContainer: {
    flex: 1,
    paddingRight: 16,
  },
  settingTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  settingSubtitle: {
    color: Colors.textSecondary,
    fontSize: 12,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: Colors.background,
    borderRadius: 8,
    padding: 16,
    marginBottom: 20,
  },
  infoIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  infoText: {
    color: Colors.textSecondary,
    fontSize: 12,
    flex: 1,
    lineHeight: 18,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 8,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 15,
  },
});
