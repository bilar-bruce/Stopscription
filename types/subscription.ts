export type SubscriptionStatus = "trial" | "active" | "cancelled";

export type BillingCycle = "mo" | "yr";

export type CurrencyCode = "PHP" | "USD";

export interface SubscriptionItem {
  id: string;
  serviceName: string;
  planName: string;
  cost: number;
  billingCycle: BillingCycle;
  expirationDate: string; // ISO 8601 string (YYYY-MM-DD or full ISO)
  cancellationUrl?: string;
  iconName: string;
  iconFamily: "MaterialCommunityIcons" | "Ionicons";
  iconColor: string;
  status: SubscriptionStatus;
  createdAt: string;
  cancelledAt?: string;
}

export interface ReminderPreferences {
  earlyWarning72h: boolean;
  actionReminder24h: boolean;
  emergencyStrike2h: boolean;
}

export interface UserProfile {
  name: string;
  title: string;
  email: string;
  currency: CurrencyCode;
  isAuthenticated: boolean;
}

export interface PersistedAppState {
  user: UserProfile;
  items: SubscriptionItem[];
  reminders: ReminderPreferences;
  baseHistoricalSavings: number;
  basePreventedCount: number;
}
