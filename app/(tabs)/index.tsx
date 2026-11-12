import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { router } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInDown,
  LinearTransition,
} from "react-native-reanimated";
import { Colors } from "../../constants/theme";
import {
  getDaysRemaining,
  useSubscriptions,
} from "../../context/SubscriptionContext";
import { SubscriptionItem } from "../../types/subscription";

type DashboardTab = "trials" | "subscriptions" | "history";

function formatShortDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) return isoDate;
  return parsed.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

export default function DashboardScreen() {
  const {
    state,
    trials,
    subscriptions,
    history,
    moneySaved,
    preventedTrialsCount,
    endingSoonCount,
    formatCurrency,
    cancelItem,
    restoreTrial,
    keepSubscription,
    deleteItem,
    showToast,
  } = useSubscriptions();

  const [activeTab, setActiveTab] = useState<DashboardTab>("trials");
  const [selectedForCancel, setSelectedForCancel] =
    useState<SubscriptionItem | null>(null);

  const getBadgeConfig = (item: SubscriptionItem) => {
    if (item.status === "cancelled") {
      return {
        label: "CANCELLED",
        style: styles.badgeNeutral,
        textStyle: styles.badgeTextMint,
        barColor: Colors.primary,
        progress: 1,
      };
    }

    const days = getDaysRemaining(item.expirationDate);
    // Compute urgency progress (closer to 0 days = fuller urgency bar)
    const clampedProgress = Math.max(
      0.12,
      Math.min(1, (14 - Math.max(0, days)) / 14)
    );

    if (days <= 0) {
      return {
        label: days === 0 ? "EXPIRES TODAY" : "EXPIRED",
        style: styles.badgeDanger,
        textStyle: styles.badgeTextWhite,
        barColor: Colors.danger,
        progress: 1,
      };
    }
    if (days === 1) {
      return {
        label: "EXPIRES TOMORROW",
        style: styles.badgeDanger,
        textStyle: styles.badgeTextWhite,
        barColor: Colors.danger,
        progress: 0.92,
      };
    }
    if (days <= 3) {
      return {
        label: `${days} DAYS LEFT`,
        style: styles.badgeDanger,
        textStyle: styles.badgeTextWhite,
        barColor: Colors.danger,
        progress: 0.78,
      };
    }
    if (days <= 7) {
      return {
        label:
          item.status === "active"
            ? `RENEWS IN ${days}D`
            : `${days} DAYS LEFT`,
        style: styles.badgeWarning,
        textStyle: styles.badgeTextAmber,
        barColor: "#F5A623",
        progress: clampedProgress,
      };
    }
    return {
      label:
        item.status === "active" ? `RENEWS IN ${days}D` : `${days} DAYS LEFT`,
      style: styles.badgeWarning,
      textStyle: styles.badgeTextGray,
      barColor: Colors.primary,
      progress: clampedProgress,
    };
  };

  const confirmCancel = async (
    item: SubscriptionItem,
    openBrowserUrl: boolean
  ) => {
    setSelectedForCancel(null);

    if (Platform.OS !== "web") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {}
      );
    }

    if (openBrowserUrl && item.cancellationUrl) {
      try {
        await WebBrowser.openBrowserAsync(item.cancellationUrl);
      } catch {
        // Proceed with local state mutation if browser fails or closes
      }
    }

    cancelItem(item.id);
    showToast(
      `${item.serviceName} cancelled! +${formatCurrency(item.cost)} saved`,
      {
        undoLabel: "UNDO",
        onUndo: () => restoreTrial(item.id),
      }
    );
  };

  const handleKeepSubscription = (item: SubscriptionItem) => {
    keepSubscription(item.id);
    showToast(`${item.serviceName} moved to Subscriptions`);
  };

  const renderBrandIcon = (item: SubscriptionItem, size = 24) => {
    if (item.iconFamily === "MaterialCommunityIcons") {
      return (
        <MaterialCommunityIcons
          name={item.iconName as keyof typeof MaterialCommunityIcons.glyphMap}
          size={size}
          color={item.iconColor}
        />
      );
    }
    return (
      <Ionicons
        name={item.iconName as keyof typeof Ionicons.glyphMap}
        size={size}
        color={item.iconColor}
      />
    );
  };

  const displayedItems =
    activeTab === "trials"
      ? trials
      : activeTab === "subscriptions"
        ? subscriptions
        : history;

  const sectionHeaderText =
    activeTab === "trials"
      ? "ACTIVE TRIALS"
      : activeTab === "subscriptions"
        ? "RECURRING SUBSCRIPTIONS"
        : "CANCELLATION HISTORY";

  const sectionRightText =
    activeTab === "trials"
      ? `${endingSoonCount} Ending Soon`
      : activeTab === "subscriptions"
        ? `${subscriptions.length} Active`
        : `${history.length} Prevented`;

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
            <Text style={styles.greeting}>Hi, {state.user.name}</Text>
          </View>
          <TouchableOpacity
            style={styles.profileAvatar}
            onPress={() => router.navigate("/(tabs)/profile")}
            accessibilityRole="button"
            accessibilityLabel="Go to Profile"
          >
            <Ionicons name="person" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>

        {/* 2. Sub-Navigation (Segmented Tabs) */}
        <View style={styles.topTabsContainer}>
          <TouchableOpacity
            style={[
              styles.topTab,
              activeTab === "trials" && styles.topTabActive,
            ]}
            onPress={() => setActiveTab("trials")}
          >
            <Text
              style={
                activeTab === "trials"
                  ? styles.topTabActiveText
                  : styles.topTabInactiveText
              }
            >
              My Trials ({trials.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topTab,
              activeTab === "subscriptions" && styles.topTabActive,
            ]}
            onPress={() => setActiveTab("subscriptions")}
          >
            <Text
              style={
                activeTab === "subscriptions"
                  ? styles.topTabActiveText
                  : styles.topTabInactiveText
              }
            >
              Subscriptions ({subscriptions.length})
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.topTab,
              activeTab === "history" && styles.topTabActive,
            ]}
            onPress={() => setActiveTab("history")}
          >
            <Text
              style={
                activeTab === "history"
                  ? styles.topTabActiveText
                  : styles.topTabInactiveText
              }
            >
              History ({history.length})
            </Text>
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
          <Text style={styles.savingsAmount}>
            {formatCurrency(moneySaved, true)}
          </Text>

          <View style={styles.savingsFooter}>
            <Text style={styles.savingsFooterText}>
              {preventedTrialsCount} trials prevented from auto-billing
            </Text>
            <Ionicons
              name="checkmark-circle"
              size={20}
              color={Colors.primary}
            />
          </View>
        </View>

        {/* 4. Active Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{sectionHeaderText}</Text>
          <Text style={styles.sectionSubtitle}>{sectionRightText}</Text>
        </View>

        {/* 5. Cards Grid or Empty State */}
        {displayedItems.length === 0 ? (
          <Animated.View
            entering={FadeInDown.duration(240)}
            style={styles.emptyCard}
          >
            <Ionicons
              name={
                activeTab === "trials"
                  ? "shield-checkmark-outline"
                  : activeTab === "subscriptions"
                    ? "repeat-outline"
                    : "time-outline"
              }
              size={40}
              color={Colors.primary}
            />
            <Text style={styles.emptyTitle}>
              {activeTab === "trials"
                ? "No active trials right now"
                : activeTab === "subscriptions"
                  ? "No active recurring subscriptions"
                  : "No cancelled trials yet"}
            </Text>
            <Text style={styles.emptySubtitle}>
              {activeTab === "trials"
                ? "Add a free trial to get alerted before it auto-charges your card."
                : activeTab === "subscriptions"
                  ? "Trials you choose to keep will appear here."
                  : "Trials you cancel before expiry will be logged here."}
            </Text>
            {activeTab === "trials" && (
              <TouchableOpacity
                style={styles.emptyAddButton}
                onPress={() => router.navigate("/(tabs)/add")}
              >
                <Ionicons name="add" size={18} color={Colors.background} />
                <Text style={styles.emptyAddButtonText}>Add a Free Trial</Text>
              </TouchableOpacity>
            )}
          </Animated.View>
        ) : (
          <View style={styles.trialsGrid}>
            {displayedItems.map((item, idx) => {
              const badge = getBadgeConfig(item);
              return (
                <Animated.View
                  key={item.id}
                  entering={FadeInDown.delay(idx * 55).duration(260)}
                  layout={LinearTransition.springify()}
                  style={styles.trialCard}
                >
                  <View style={styles.trialCardHeader}>
                    <View style={styles.iconCircle}>
                      {renderBrandIcon(item, 22)}
                    </View>
                    <View style={[styles.badge, badge.style]}>
                      <Text style={badge.textStyle}>{badge.label}</Text>
                    </View>
                  </View>

                  <Text style={styles.trialName} numberOfLines={1}>
                    {item.serviceName}
                  </Text>
                  <Text style={styles.trialPlan} numberOfLines={1}>
                    {item.planName}
                  </Text>

                  {/* Visual Urgency Bar + Formatted Date */}
                  <View style={styles.urgencyContainer}>
                    <View style={styles.urgencyTrack}>
                      <View
                        style={[
                          styles.urgencyFill,
                          {
                            width: `${Math.round(badge.progress * 100)}%`,
                            backgroundColor: badge.barColor,
                          },
                        ]}
                      />
                    </View>
                    <Text style={styles.expiryDateSubtext}>
                      {item.status === "cancelled"
                        ? `Cancelled ${formatShortDate(item.cancelledAt || item.expirationDate)}`
                        : `Bills ${formatShortDate(item.expirationDate)}`}
                    </Text>
                  </View>

                  <Text style={styles.trialPrice}>
                    {formatCurrency(item.cost)}
                    <Text style={styles.trialPriceSub}>
                      /{item.billingCycle}
                    </Text>
                  </Text>

                  {item.status !== "cancelled" ? (
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        style={styles.cancelButton}
                        onPress={() => setSelectedForCancel(item)}
                      >
                        <Text style={styles.cancelButtonText}>Cancel Now</Text>
                      </TouchableOpacity>

                      {item.status === "trial" && (
                        <TouchableOpacity
                          style={styles.keepButton}
                          onPress={() => handleKeepSubscription(item)}
                        >
                          <Text style={styles.keepButtonText}>
                            Keep Subscription
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>
                  ) : (
                    <View style={styles.cardActions}>
                      <Text style={styles.savedNote}>
                        Saved {formatCurrency(item.cost)}/mo
                      </Text>
                      <View style={styles.historyBtnRow}>
                        <TouchableOpacity
                          style={styles.restoreHistoryButton}
                          onPress={() => {
                            restoreTrial(item.id);
                            showToast(`${item.serviceName} restored to Trials`);
                          }}
                        >
                          <Text style={styles.restoreHistoryText}>Restore</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.removeHistoryButton}
                          onPress={() => deleteItem(item.id)}
                        >
                          <Ionicons
                            name="trash-outline"
                            size={14}
                            color={Colors.textSecondary}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}
                </Animated.View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Custom In-App Cancel Confirmation Modal */}
      <Modal
        visible={Boolean(selectedForCancel)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedForCancel(null)}
      >
        <View style={styles.modalBackdrop}>
          {selectedForCancel ? (
            <View style={styles.modalCard}>
              <View style={styles.modalIconBadge}>
                {renderBrandIcon(selectedForCancel, 32)}
              </View>

              <Text style={styles.modalTitle}>
                Stop {selectedForCancel.serviceName}?
              </Text>
              <Text style={styles.modalSubtitle}>
                Cancelling before{" "}
                <Text style={styles.modalHighlight}>
                  {formatShortDate(selectedForCancel.expirationDate)}
                </Text>{" "}
                prevents auto-billing and adds{" "}
                <Text style={styles.modalHighlightMint}>
                  +{formatCurrency(selectedForCancel.cost)}
                </Text>{" "}
                to your Money Saved.
              </Text>

              {selectedForCancel.cancellationUrl ? (
                <TouchableOpacity
                  style={styles.modalPrimaryBtn}
                  onPress={() => confirmCancel(selectedForCancel, true)}
                >
                  <Ionicons
                    name="open-outline"
                    size={18}
                    color={Colors.background}
                  />
                  <Text style={styles.modalPrimaryBtnText}>
                    Open Cancel Page & Mark Stopped
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                style={
                  selectedForCancel.cancellationUrl
                    ? styles.modalSecondaryBtn
                    : styles.modalPrimaryBtn
                }
                onPress={() => confirmCancel(selectedForCancel, false)}
              >
                <Text
                  style={
                    selectedForCancel.cancellationUrl
                      ? styles.modalSecondaryBtnText
                      : styles.modalPrimaryBtnText
                  }
                >
                  {selectedForCancel.cancellationUrl
                    ? "I Already Cancelled — Just Log Savings"
                    : "Confirm Cancellation"}
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.modalDismissBtn}
                onPress={() => setSelectedForCancel(null)}
              >
                <Text style={styles.modalDismissText}>Keep Trial Active</Text>
              </TouchableOpacity>
            </View>
          ) : null}
        </View>
      </Modal>
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
    paddingBottom: 48,
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
    marginBottom: 28,
  },
  topTab: {
    flex: 1,
    paddingVertical: 11,
    alignItems: "center",
    borderRadius: 50,
  },
  topTabActive: {
    backgroundColor: Colors.primary,
  },
  topTabActiveText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 12,
  },
  topTabInactiveText: {
    color: Colors.textSecondary,
    fontWeight: "600",
    fontSize: 12,
  },

  /* Savings Card Styles */
  savingsCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 20,
    marginBottom: 28,
    borderWidth: 1,
    borderColor: "rgba(35, 196, 129, 0.16)",
  },
  savingsHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
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
    marginBottom: 20,
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
    fontSize: 15,
    fontWeight: "bold",
    letterSpacing: 0.5,
  },
  sectionSubtitle: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: "600",
  },
  trialsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 14,
  },
  trialCard: {
    width: "47.5%",
    minWidth: 155,
    flexGrow: 1,
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#222825",
  },
  trialCardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
    gap: 6,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
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
  badgeNeutral: {
    backgroundColor: "rgba(35, 196, 129, 0.14)",
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
  badgeTextAmber: {
    color: "#F5A623",
    fontSize: 9,
    fontWeight: "bold",
  },
  badgeTextMint: {
    color: Colors.primary,
    fontSize: 9,
    fontWeight: "bold",
  },
  trialName: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "bold",
    marginBottom: 2,
  },
  trialPlan: {
    color: Colors.textSecondary,
    fontSize: 12,
    marginBottom: 12,
  },
  urgencyContainer: {
    marginBottom: 12,
  },
  urgencyTrack: {
    height: 4,
    backgroundColor: Colors.background,
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 5,
  },
  urgencyFill: {
    height: "100%",
    borderRadius: 2,
  },
  expiryDateSubtext: {
    color: Colors.textSecondary,
    fontSize: 10,
    fontWeight: "600",
  },
  trialPrice: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 14,
  },
  trialPriceSub: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "normal",
  },
  cardActions: {
    gap: 8,
  },
  cancelButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingVertical: 11,
    alignItems: "center",
  },
  cancelButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 13,
  },
  keepButton: {
    paddingVertical: 6,
    alignItems: "center",
  },
  keepButtonText: {
    color: Colors.textSecondary,
    fontSize: 11,
    fontWeight: "600",
  },
  savedNote: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  historyBtnRow: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  restoreHistoryButton: {
    flex: 1,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: "#2A302D",
    paddingVertical: 7,
    alignItems: "center",
  },
  restoreHistoryText: {
    color: Colors.textPrimary,
    fontSize: 11,
    fontWeight: "600",
  },
  removeHistoryButton: {
    width: 32,
    height: 30,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2A302D",
    alignItems: "center",
    justifyContent: "center",
  },

  /* Empty State */
  emptyCard: {
    backgroundColor: Colors.card,
    borderRadius: 16,
    padding: 28,
    alignItems: "center",
  },
  emptyTitle: {
    color: Colors.textPrimary,
    fontSize: 17,
    fontWeight: "bold",
    marginTop: 12,
    marginBottom: 6,
  },
  emptySubtitle: {
    color: Colors.textSecondary,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 19,
    marginBottom: 20,
  },
  emptyAddButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 12,
    gap: 6,
  },
  emptyAddButtonText: {
    color: Colors.background,
    fontWeight: "bold",
    fontSize: 14,
  },

  /* Custom In-App Cancel Confirmation Modal */
  modalBackdrop: {
    flex: 1,
    backgroundColor: "rgba(5, 8, 6, 0.82)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  modalCard: {
    width: "100%",
    maxWidth: 380,
    backgroundColor: Colors.card,
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(35, 196, 129, 0.25)",
  },
  modalIconBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    color: Colors.textPrimary,
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 8,
  },
  modalSubtitle: {
    color: Colors.textSecondary,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 24,
  },
  modalHighlight: {
    color: Colors.textPrimary,
    fontWeight: "bold",
  },
  modalHighlightMint: {
    color: Colors.primary,
    fontWeight: "bold",
  },
  modalPrimaryBtn: {
    flexDirection: "row",
    width: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 50,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 10,
  },
  modalPrimaryBtnText: {
    color: Colors.background,
    fontSize: 14,
    fontWeight: "bold",
  },
  modalSecondaryBtn: {
    width: "100%",
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: "#2A302D",
    borderRadius: 50,
    height: 46,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  modalSecondaryBtnText: {
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  modalDismissBtn: {
    paddingVertical: 8,
  },
  modalDismissText: {
    color: Colors.textSecondary,
    fontSize: 13,
    fontWeight: "600",
  },
});
