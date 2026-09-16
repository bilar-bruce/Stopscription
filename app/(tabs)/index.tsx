import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
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

export default function DashboardScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.container}
        showsVerticalScrollIndicator={false}
      >
        {/* 1. Header Section */}
        <View style={styles.header}>
          <View>
            <Text style={styles.brandText}>STOPSCRIPTION</Text>
            <Text style={styles.greeting}>Hi, Bruce</Text>
          </View>
          <TouchableOpacity style={styles.profileAvatar}>
            <Ionicons name="person" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 2. Sub-Navigation (Segmented Tabs) */}
        <View style={styles.topTabsContainer}>
          <TouchableOpacity style={[styles.topTab, styles.topTabActive]}>
            <Text style={styles.topTabActiveText}>My Trials</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topTab}>
            <Text style={styles.topTabInactiveText}>Subscriptions</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.topTab}>
            <Text style={styles.topTabInactiveText}>History</Text>
          </TouchableOpacity>
        </View>

        {/* 3. Money Saved Overview Card */}
        <View style={styles.savingsCard}>
          <View style={styles.savingsHeader}>
            <Text style={styles.savingsLabel}>MONEY SAVED</Text>
            <View style={styles.monthBadge}>
              <Text style={styles.monthBadgeText}>This Month</Text>
            </View>
          </View>
          <Text style={styles.savingsAmount}>₱1,450.00</Text>

          <View style={styles.savingsFooter}>
            <Text style={styles.savingsFooterText}>
              4 trials prevented from auto-billing
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.primary}
            />
          </View>
        </View>

        {/* 4. Active Trials Section */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>ACTIVE TRIALS</Text>
          <Text style={styles.sectionSubtitle}>2 Ending Soon</Text>
        </View>

        <View style={styles.trialsGrid}>
          {/* Spotify Card */}
          <View style={styles.trialCard}>
            <View style={styles.trialCardHeader}>
              <MaterialCommunityIcons
                name="spotify"
                size={24}
                color="#1DB954"
              />
              <View style={[styles.badge, styles.badgeDanger]}>
                <Text style={styles.badgeTextWhite}>EXPIRES TOMORROW</Text>
              </View>
            </View>
            <Text style={styles.trialName}>Spotify</Text>
            <Text style={styles.trialPlan}>Premium Individual</Text>
            <Text style={styles.trialPrice}>
              ₱149<Text style={styles.trialPriceSub}>/mo</Text>
            </Text>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Now</Text>
            </TouchableOpacity>
          </View>

          {/* Netflix Card */}
          <View style={styles.trialCard}>
            <View style={styles.trialCardHeader}>
              <MaterialCommunityIcons
                name="netflix"
                size={24}
                color="#E50914"
              />
              <View style={[styles.badge, styles.badgeWarning]}>
                <Text style={styles.badgeTextGray}>4 DAYS LEFT</Text>
              </View>
            </View>
            <Text style={styles.trialName}>Netflix</Text>
            <Text style={styles.trialPlan}>Standard HD Plan</Text>
            <Text style={styles.trialPrice}>
              ₱549<Text style={styles.trialPriceSub}>/mo</Text>
            </Text>
            <TouchableOpacity style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel Now</Text>
            </TouchableOpacity>
          </View>
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
  container: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  /* Header Styles */
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  brandText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
    marginBottom: 4,
  },
  greeting: {
    color: Colors.textPrimary,
    fontSize: 28,
    fontWeight: "bold",
  },
  profileAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: Colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Sub-Navigation Styles */
  topTabsContainer: {
    flexDirection: "row",
    backgroundColor: Colors.card,
    borderRadius: 50,
    padding: 4,
    marginBottom: 32,
  },
  topTab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 50,
  },
  topTabActive: {
    backgroundColor: Colors.primary,
  },
  topTabActiveText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 14,
  },
  topTabInactiveText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },

  /* Savings Card Styles */
  savingsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  savingsLabel: {
    color: Colors.textSecondary,
    fontSize: 12,
    fontWeight: "bold",
    letterSpacing: 1,
  },
  monthBadge: {
    borderColor: Colors.primary,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  monthBadgeText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
  },
  savingsAmount: {
    color: Colors.textPrimary,
    fontSize: 36,
    fontWeight: "bold",
    marginBottom: 24,
  },
  savingsFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  savingsFooterText: {
    color: Colors.textPrimary,
    fontSize: 14,
  },

  /* Active Trials Styles */
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    color: Colors.textPrimary,
    fontSize: 16,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    color: Colors.primary,
    fontSize: 14,
    fontWeight: "600",
  },
  trialsGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 16,
  },
  trialCard: {
    flex: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
  },
  trialCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  badgeDanger: {
    backgroundColor: Colors.danger,
  },
  badgeWarning: {
    backgroundColor: "#2A302D",
  },
  badgeTextWhite: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
  },
  badgeTextGray: {
    color: Colors.textSecondary,
    fontSize: 9,
    fontWeight: "bold",
  },
  trialName: {
    color: Colors.textPrimary,
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  trialPlan: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 16,
  },
  trialPrice: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 16,
  },
  trialPriceSub: {
    color: Colors.textSecondary,
    fontSize: 14,
    fontWeight: "normal",
  },
  cancelButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 14,
  },
});
