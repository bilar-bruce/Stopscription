import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import React, { useState } from "react";
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
import { useSubscriptions } from "../../context/SubscriptionContext";

function formatIsoAfterDays(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

interface ServicePreset {
  name: string;
  plan: string;
  costPhp: number;
  trialDays: number;
  url: string;
  iconName: string;
  iconFamily: "MaterialCommunityIcons" | "Ionicons";
  color: string;
}

const POPULAR_SERVICES: ServicePreset[] = [
  {
    name: "Spotify",
    plan: "Premium Individual",
    costPhp: 149,
    trialDays: 30,
    url: "https://www.spotify.com/account/subscription/",
    iconName: "spotify",
    iconFamily: "MaterialCommunityIcons",
    color: "#1DB954",
  },
  {
    name: "Netflix",
    plan: "Standard HD Plan",
    costPhp: 549,
    trialDays: 7,
    url: "https://www.netflix.com/youraccount",
    iconName: "netflix",
    iconFamily: "MaterialCommunityIcons",
    color: "#E50914",
  },
  {
    name: "Canva Pro",
    plan: "Pro Individual",
    costPhp: 300,
    trialDays: 30,
    url: "https://www.canva.com/settings/billing-and-teams",
    iconName: "color-palette",
    iconFamily: "Ionicons",
    color: "#00C4CC",
  },
  {
    name: "ChatGPT Plus",
    plan: "Plus Monthly",
    costPhp: 1120,
    trialDays: 14,
    url: "https://chatgpt.com/#settings/Subscription",
    iconName: "sparkles",
    iconFamily: "Ionicons",
    color: "#23C481",
  },
  {
    name: "YouTube",
    plan: "Premium Individual",
    costPhp: 189,
    trialDays: 30,
    url: "https://www.youtube.com/paid_memberships",
    iconName: "youtube",
    iconFamily: "MaterialCommunityIcons",
    color: "#FF0000",
  },
  {
    name: "Disney+",
    plan: "Premium Monthly",
    costPhp: 369,
    trialDays: 7,
    url: "https://www.disneyplus.com/account/subscription",
    iconName: "film-outline",
    iconFamily: "Ionicons",
    color: "#0063E5",
  },
  {
    name: "Apple One",
    plan: "Individual Bundle",
    costPhp: 395,
    trialDays: 30,
    url: "https://support.apple.com/en-ph/HT202039",
    iconName: "apple",
    iconFamily: "MaterialCommunityIcons",
    color: "#FFFFFF",
  },
];

export default function AddTrialScreen() {
  const {
    state,
    addTrial,
    currencySymbol,
    showToast,
    runWithActionLoader,
  } = useSubscriptions();

  const [serviceName, setServiceName] = useState("");
  const [planName, setPlanName] = useState("");
  const [expirationDate, setExpirationDate] = useState(formatIsoAfterDays(7));
  const [costInput, setCostInput] = useState("");
  const [cancellationUrl, setCancellationUrl] = useState("");
  const [selectedDaysPreset, setSelectedDaysPreset] = useState<number | null>(
    7
  );
  const [errorMessage, setErrorMessage] = useState("");

  const handleSelectPopularService = (preset: ServicePreset) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    setServiceName(preset.name);
    setPlanName(preset.plan);
    setExpirationDate(formatIsoAfterDays(preset.trialDays));
    setSelectedDaysPreset(preset.trialDays);
    const displayCost =
      state.user.currency === "PHP"
        ? String(preset.costPhp)
        : (preset.costPhp / 56).toFixed(2);
    setCostInput(displayCost);
    setCancellationUrl(preset.url);
    setErrorMessage("");
  };

  const applyPresetDays = (days: number) => {
    if (Platform.OS !== "web") {
      Haptics.selectionAsync().catch(() => {});
    }
    setSelectedDaysPreset(days);
    setExpirationDate(formatIsoAfterDays(days));
    if (errorMessage) setErrorMessage("");
  };

  const handleSave = () => {
    setErrorMessage("");

    if (!serviceName.trim()) {
      setErrorMessage("Please select a popular service or enter a name.");
      return;
    }

    const numericCost = parseFloat(costInput.replace(/[^0-9.]/g, ""));
    if (Number.isNaN(numericCost) || numericCost <= 0) {
      setErrorMessage("Please enter a valid post-trial cost greater than 0.");
      return;
    }

    const parsedDate = new Date(expirationDate);
    if (!expirationDate.trim() || Number.isNaN(parsedDate.getTime())) {
      setErrorMessage(
        "Please enter a valid expiration date (YYYY-MM-DD, e.g., 2026-11-20)."
      );
      return;
    }

    // Store internal cost in PHP base so currency toggling stays consistent
    const normalizedPhpCost =
      state.user.currency === "PHP"
        ? numericCost
        : Math.round(numericCost * 56);

    const savedName = serviceName.trim();

    runWithActionLoader(
      `Arming alerts for ${savedName}...`,
      () => {
        addTrial({
          serviceName: savedName,
          planName: planName.trim() || "Free Trial Plan",
          cost: normalizedPhpCost,
          expirationDate: parsedDate.toISOString().split("T")[0],
          cancellationUrl: cancellationUrl.trim() || undefined,
        });

        if (Platform.OS !== "web") {
          Haptics.notificationAsync(
            Haptics.NotificationFeedbackType.Success
          ).catch(() => {});
        }

        setServiceName("");
        setPlanName("");
        setExpirationDate(formatIsoAfterDays(7));
        setSelectedDaysPreset(7);
        setCostInput("");
        setCancellationUrl("");

        router.navigate("/(tabs)");
        showToast(`${savedName} trial added! Expiry alerts armed.`);
      },
      320
    );
  };

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
          <View style={{ width: 24 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.container}
          showsVerticalScrollIndicator={false}
        >
          {/* 1-Tap Popular Services Quick-Picker */}
          <Text style={styles.quickPickerTitle}>
            1-TAP AUTO-FILL POPULAR SERVICES
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.quickPickerScroll}
          >
            {POPULAR_SERVICES.map((preset) => {
              const isSelected =
                serviceName.toLowerCase() === preset.name.toLowerCase();
              return (
                <TouchableOpacity
                  key={preset.name}
                  style={[
                    styles.serviceChip,
                    isSelected && styles.serviceChipActive,
                  ]}
                  onPress={() => handleSelectPopularService(preset)}
                >
                  {preset.iconFamily === "MaterialCommunityIcons" ? (
                    <MaterialCommunityIcons
                      name={
                        preset.iconName as keyof typeof MaterialCommunityIcons.glyphMap
                      }
                      size={18}
                      color={preset.color}
                    />
                  ) : (
                    <Ionicons
                      name={preset.iconName as keyof typeof Ionicons.glyphMap}
                      size={18}
                      color={preset.color}
                    />
                  )}
                  <Text
                    style={[
                      styles.serviceChipText,
                      isSelected && styles.serviceChipTextActive,
                    ]}
                  >
                    {preset.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Main Form Card */}
          <View style={styles.formCard}>
            {errorMessage ? (
              <View style={styles.errorBanner}>
                <Ionicons
                  name="alert-circle"
                  size={18}
                  color={Colors.danger}
                />
                <Text style={styles.errorBannerText}>{errorMessage}</Text>
              </View>
            ) : null}

            {/* Service Name Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>SERVICE NAME</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Canva Pro, ChatGPT Plus"
                  placeholderTextColor={Colors.textSecondary}
                  value={serviceName}
                  onChangeText={(text) => {
                    setServiceName(text);
                    if (errorMessage) setErrorMessage("");
                  }}
                />
              </View>
            </View>

            {/* Plan Tier Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>PLAN TIER (OPTIONAL)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="e.g., Pro Individual"
                  placeholderTextColor={Colors.textSecondary}
                  value={planName}
                  onChangeText={setPlanName}
                />
              </View>
            </View>

            {/* Expiration Date Input + Quick Presets */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>TRIAL EXPIRATION DATE</Text>
              <View style={styles.presetRow}>
                {[
                  { label: "3 Days", days: 3 },
                  { label: "7 Days", days: 7 },
                  { label: "14 Days", days: 14 },
                  { label: "30 Days", days: 30 },
                ].map((preset) => {
                  const active = selectedDaysPreset === preset.days;
                  return (
                    <TouchableOpacity
                      key={preset.days}
                      style={[
                        styles.presetChip,
                        active && styles.presetChipActive,
                      ]}
                      onPress={() => applyPresetDays(preset.days)}
                    >
                      <Text
                        style={[
                          styles.presetChipText,
                          active && styles.presetChipTextActive,
                        ]}
                      >
                        {preset.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="YYYY-MM-DD"
                  placeholderTextColor={Colors.textSecondary}
                  value={expirationDate}
                  onChangeText={(text) => {
                    setExpirationDate(text);
                    setSelectedDaysPreset(null);
                    if (errorMessage) setErrorMessage("");
                  }}
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
              <Text style={styles.label}>
                POST-TRIAL MONTHLY COST ({currencySymbol})
              </Text>
              <View style={styles.inputContainer}>
                <Text style={styles.currencyPrefix}>{currencySymbol}</Text>
                <TextInput
                  style={styles.input}
                  placeholder="299.00"
                  placeholderTextColor={Colors.textSecondary}
                  keyboardType="numeric"
                  value={costInput}
                  onChangeText={(text) => {
                    setCostInput(text);
                    if (errorMessage) setErrorMessage("");
                  }}
                />
                <Text style={styles.cycleSuffix}>/mo</Text>
              </View>
            </View>

            {/* Cancellation URL Input */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>CANCELLATION URL (AUTO-FILLED)</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="https://..."
                  placeholderTextColor={Colors.textSecondary}
                  autoCapitalize="none"
                  keyboardType="url"
                  value={cancellationUrl}
                  onChangeText={setCancellationUrl}
                />
                <Ionicons
                  name="link-outline"
                  size={20}
                  color={Colors.textSecondary}
                />
              </View>
            </View>

            {/* Submit Button */}
            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
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
  quickPickerTitle: {
    color: Colors.primary,
    fontSize: 10,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 10,
  },
  quickPickerScroll: {
    gap: 10,
    paddingBottom: 6,
  },
  serviceChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: "#262E2A",
    borderRadius: 50,
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 8,
  },
  serviceChipActive: {
    borderColor: Colors.primary,
    backgroundColor: "rgba(35, 196, 129, 0.14)",
  },
  serviceChipText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  serviceChipTextActive: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  formCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginTop: 14,
  },
  errorBanner: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 76, 76, 0.12)",
    borderWidth: 1,
    borderColor: Colors.danger,
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    gap: 8,
  },
  errorBannerText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: "600",
    flex: 1,
  },
  inputGroup: {
    marginBottom: 18,
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
    backgroundColor: Colors.background,
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 50,
  },
  currencyPrefix: {
    color: Colors.primary,
    fontSize: 15,
    fontWeight: "bold",
    marginRight: 8,
  },
  cycleSuffix: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
    marginLeft: 6,
  },
  input: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "500",
  },
  presetRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
  },
  presetChip: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: "#2A302D",
    borderRadius: 8,
    paddingVertical: 8,
    alignItems: "center",
  },
  presetChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  presetChipText: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
  },
  presetChipTextActive: {
    color: Colors.background,
  },
  saveButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  saveButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 15,
  },
});
