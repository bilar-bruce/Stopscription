import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Platform,
  SafeAreaView,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors } from "../../constants/theme";
import { useSubscriptions } from "../../context/SubscriptionContext";

export default function ProfileScreen() {
  const {
    state,
    trials,
    subscriptions,
    moneySaved,
    preventedTrialsCount,
    formatCurrency,
    toggleCurrency,
    logout,
    resetDemoData,
  } = useSubscriptions();

  const handleLogout = () => {
    logout();
    router.replace("/(auth)/login");
  };

  const handleExport = async () => {
    const summary = [
      `Stopscription Export (${new Date().toISOString().split("T")[0]})`,
      `User: ${state.user.name} (${state.user.email})`,
      `Money Saved: ${formatCurrency(moneySaved, true)} (${preventedTrialsCount} trials prevented)`,
      `Active Trials: ${trials.length}`,
      `Recurring Subscriptions: ${subscriptions.length}`,
    ].join("\n");

    try {
      if (Platform.OS === "web") {
        window.alert(summary);
      } else {
        await Share.share({
          title: "Stopscription Summary",
          message: summary,
        });
      }
    } catch {
      // Share cancelled
    }
  };

  const handleAbout = () => {
    const msg =
      "Stopscription v1.0.0\nTrack free trials, receive multi-stage expiry alerts, and stop unwanted auto-billing before it happens.";
    if (Platform.OS === "web") {
      window.alert(msg);
    } else {
      Alert.alert("About Stopscription", msg);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {/* User Info Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <Ionicons name="person" size={48} color={Colors.background} />
          </View>
          <Text style={styles.userName}>{state.user.name}</Text>
          <Text style={styles.userDetails}>{state.user.title}</Text>
          <Text style={styles.userDetails}>{state.user.email}</Text>
        </View>

        {/* Settings Menu List */}
        <View style={styles.menuContainer}>
          {/* Currency Preference */}
          <TouchableOpacity style={styles.menuItem} onPress={toggleCurrency}>
            <Text style={styles.menuItemText}>Currency Preference</Text>
            <Text style={styles.currencyText}>
              ▶ {state.user.currency} ({state.user.currency === "PHP" ? "₱" : "$"})
            </Text>
          </TouchableOpacity>

          {/* Data Export */}
          <TouchableOpacity style={styles.menuItem} onPress={handleExport}>
            <Text style={styles.menuItemText}>Data Export</Text>
            <Ionicons
              name="download-outline"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* Reset Demo Data */}
          <TouchableOpacity style={styles.menuItem} onPress={resetDemoData}>
            <Text style={styles.menuItemText}>Restore Sample Trials</Text>
            <Ionicons
              name="refresh-outline"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity
            style={[styles.menuItem, styles.lastMenuItem]}
            onPress={handleAbout}
          >
            <Text style={styles.menuItemText}>About Stopscription</Text>
            <Ionicons
              name="chevron-forward"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {/* Log Out Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons
            name="log-out-outline"
            size={20}
            color={Colors.danger}
            style={styles.logoutIcon}
          />
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    color: Colors.textPrimary,
    fontSize: 32,
    fontWeight: "bold",
  },

  /* Profile Card Styles */
  profileCard: {
    backgroundColor: Colors.card,
    borderRadius: 24,
    padding: 32,
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  userName: {
    color: Colors.textPrimary,
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  userDetails: {
    color: Colors.textSecondary,
    fontSize: 14,
    marginBottom: 4,
  },

  /* Menu List Styles */
  menuContainer: {
    marginBottom: 24,
  },
  menuItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#181C1A",
  },
  lastMenuItem: {
    borderBottomWidth: 0,
  },
  menuItemText: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "600",
  },
  currencyText: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "bold",
  },

  /* Logout Button Styles */
  logoutButton: {
    flexDirection: "row",
    backgroundColor: "#181C1A",
    borderRadius: 50,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: Colors.danger,
    fontSize: 16,
    fontWeight: "bold",
  },
});
