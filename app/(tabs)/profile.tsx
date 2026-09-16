import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";
import { Colors } from "../../constants/theme";

export default function ProfileScreen() {
  const handleLogout = () => {
    // Replace the entire navigation stack with the login screen
    router.replace("/(auth)/login");
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
          <Text style={styles.userName}>Bruce</Text>
          <Text style={styles.userDetails}>BSIT 3rd Year</Text>
          <Text style={styles.userDetails}>bruce-bilar@gmail.com</Text>
        </View>

        {/* Settings Menu List */}
        <View style={styles.menuContainer}>
          {/* Currency Preference */}
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Currency Preference</Text>
            <Text style={styles.currencyText}>▶ PHP</Text>
          </TouchableOpacity>

          {/* Data Export */}
          <TouchableOpacity style={styles.menuItem}>
            <Text style={styles.menuItemText}>Data Export</Text>
            <Ionicons
              name="download-outline"
              size={20}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>

          {/* About */}
          <TouchableOpacity style={[styles.menuItem, styles.lastMenuItem]}>
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
    borderBottomColor: "#181C1A", // A very subtle line
  },
  lastMenuItem: {
    borderBottomWidth: 0, // Removes the line from the final item
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
    backgroundColor: "#181C1A", // Subtle dark card background
    borderRadius: 50, // Pill shape
    height: 56,
    alignItems: "center",
    justifyContent: "center",
  },
  logoutIcon: {
    marginRight: 8,
  },
  logoutButtonText: {
    color: Colors.danger, // The red from our theme
    fontSize: 16,
    fontWeight: "bold",
  },
});
