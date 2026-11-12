import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useSubscriptions } from "../../context/SubscriptionContext";

export default function RemindersScreen() {
  const { state, updateReminders } = useSubscriptions();

  const [earlyWarning, setEarlyWarning] = useState(
    state.reminders.earlyWarning72h
  );
  const [actionReminder, setActionReminder] = useState(
    state.reminders.actionReminder24h
  );
  const [emergencyStrike, setEmergencyStrike] = useState(
    state.reminders.emergencyStrike2h
  );
  const [savedBanner, setSavedBanner] = useState(false);

  useEffect(() => {
    setEarlyWarning(state.reminders.earlyWarning72h);
    setActionReminder(state.reminders.actionReminder24h);
    setEmergencyStrike(state.reminders.emergencyStrike2h);
  }, [state.reminders]);

  const handleSavePreferences = () => {
    updateReminders({
      earlyWarning72h: earlyWarning,
      actionReminder24h: actionReminder,
      emergencyStrike2h: emergencyStrike,
    });

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );
    }

    setSavedBanner(true);
    setTimeout(() => {
      setSavedBanner(false);
    }, 2500);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.navigate("/(tabs)")}>
          <Ionicons name="chevron-back" size={24} color={Colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Reminders</Text>
        <View style={{ width: 24 }} />
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

          {savedBanner ? (
            <View style={styles.savedBanner}>
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={Colors.primary}
              />
              <Text style={styles.savedBannerText}>
                Alert preferences saved!
              </Text>
            </View>
          ) : null}

          {/* Save Button */}
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSavePreferences}
          >
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
    borderBottomColor: "#2A302D",
  },
  lastSettingRow: {
    borderBottomWidth: 0,
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
  savedBanner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(35, 196, 129, 0.14)",
    borderRadius: 8,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 8,
  },
  savedBannerText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "bold",
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
