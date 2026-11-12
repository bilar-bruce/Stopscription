import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import {
  BillingCycle,
  CurrencyCode,
  PersistedAppState,
  ReminderPreferences,
  SubscriptionItem,
} from "../types/subscription";

const STORAGE_KEY = "@stopscription_state_v1";

function addDaysToNow(days: number): string {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

const INITIAL_ITEMS: SubscriptionItem[] = [
  {
    id: "trial-spotify-1",
    serviceName: "Spotify",
    planName: "Premium Individual",
    cost: 149,
    billingCycle: "mo",
    expirationDate: addDaysToNow(1),
    cancellationUrl: "https://www.spotify.com/account/subscription/",
    iconName: "spotify",
    iconFamily: "MaterialCommunityIcons",
    iconColor: "#1DB954",
    status: "trial",
    createdAt: new Date().toISOString(),
  },
  {
    id: "trial-netflix-2",
    serviceName: "Netflix",
    planName: "Standard HD Plan",
    cost: 549,
    billingCycle: "mo",
    expirationDate: addDaysToNow(4),
    cancellationUrl: "https://www.netflix.com/youraccount",
    iconName: "netflix",
    iconFamily: "MaterialCommunityIcons",
    iconColor: "#E50914",
    status: "trial",
    createdAt: new Date().toISOString(),
  },
  {
    id: "sub-youtube-3",
    serviceName: "YouTube Premium",
    planName: "Student Plan",
    cost: 115,
    billingCycle: "mo",
    expirationDate: addDaysToNow(18),
    cancellationUrl: "https://www.youtube.com/paid_memberships",
    iconName: "youtube",
    iconFamily: "MaterialCommunityIcons",
    iconColor: "#FF0000",
    status: "active",
    createdAt: new Date().toISOString(),
  },
  {
    id: "hist-canva-4",
    serviceName: "Canva Pro",
    planName: "Pro Individual",
    cost: 300,
    billingCycle: "mo",
    expirationDate: addDaysToNow(-5),
    cancellationUrl: "https://www.canva.com/settings/billing-and-teams",
    iconName: "color-palette",
    iconFamily: "Ionicons",
    iconColor: "#00C4CC",
    status: "cancelled",
    createdAt: new Date().toISOString(),
    cancelledAt: addDaysToNow(-6),
  },
];

const DEFAULT_STATE: PersistedAppState = {
  user: {
    name: "Bruce",
    title: "BSIT 3rd Year",
    email: "bruce-bilar@gmail.com",
    currency: "PHP",
    isAuthenticated: false,
  },
  items: INITIAL_ITEMS,
  reminders: {
    earlyWarning72h: true,
    actionReminder24h: true,
    emergencyStrike2h: false,
  },
  baseHistoricalSavings: 1150,
  basePreventedCount: 3,
};

type Action =
  | { type: "HYDRATE"; payload: PersistedAppState }
  | { type: "ADD_ITEM"; payload: SubscriptionItem }
  | { type: "CANCEL_ITEM"; payload: { id: string; cancelledAt: string } }
  | { type: "RESTORE_TRIAL"; payload: { id: string } }
  | { type: "KEEP_SUBSCRIPTION"; payload: { id: string } }
  | { type: "DELETE_ITEM"; payload: { id: string } }
  | { type: "UPDATE_REMINDERS"; payload: ReminderPreferences }
  | { type: "TOGGLE_CURRENCY" }
  | { type: "LOGIN"; payload: { email: string; name?: string } }
  | { type: "LOGOUT" }
  | { type: "RESET_DEMO_DATA" };

function subscriptionReducer(
  state: PersistedAppState,
  action: Action
): PersistedAppState {
  switch (action.type) {
    case "HYDRATE":
      return action.payload;
    case "ADD_ITEM":
      return {
        ...state,
        items: [action.payload, ...state.items],
      };
    case "CANCEL_ITEM":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                status: "cancelled",
                cancelledAt: action.payload.cancelledAt,
              }
            : item
        ),
      };
    case "RESTORE_TRIAL":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? {
                ...item,
                status: "trial",
                cancelledAt: undefined,
              }
            : item
        ),
      };
    case "KEEP_SUBSCRIPTION":
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, status: "active" } : item
        ),
      };
    case "DELETE_ITEM":
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload.id),
      };
    case "UPDATE_REMINDERS":
      return {
        ...state,
        reminders: action.payload,
      };
    case "TOGGLE_CURRENCY": {
      const nextCurrency: CurrencyCode =
        state.user.currency === "PHP" ? "USD" : "PHP";
      return {
        ...state,
        user: {
          ...state.user,
          currency: nextCurrency,
        },
      };
    }
    case "LOGIN": {
      const derivedName =
        action.payload.name?.trim() ||
        state.user.name ||
        action.payload.email.split("@")[0] ||
        "Bruce";
      return {
        ...state,
        user: {
          ...state.user,
          email: action.payload.email.trim(),
          name: derivedName,
          isAuthenticated: true,
        },
      };
    }
    case "LOGOUT":
      return {
        ...state,
        user: {
          ...state.user,
          isAuthenticated: false,
        },
      };
    case "RESET_DEMO_DATA":
      return {
        ...DEFAULT_STATE,
        user: {
          ...DEFAULT_STATE.user,
          isAuthenticated: state.user.isAuthenticated,
        },
      };
    default:
      return state;
  }
}

export function inferBrandVisuals(serviceName: string): {
  iconName: string;
  iconFamily: "MaterialCommunityIcons" | "Ionicons";
  iconColor: string;
} {
  const lower = serviceName.toLowerCase();
  if (lower.includes("spotify")) {
    return {
      iconName: "spotify",
      iconFamily: "MaterialCommunityIcons",
      iconColor: "#1DB954",
    };
  }
  if (lower.includes("netflix")) {
    return {
      iconName: "netflix",
      iconFamily: "MaterialCommunityIcons",
      iconColor: "#E50914",
    };
  }
  if (lower.includes("youtube")) {
    return {
      iconName: "youtube",
      iconFamily: "MaterialCommunityIcons",
      iconColor: "#FF0000",
    };
  }
  if (lower.includes("apple") || lower.includes("icloud")) {
    return {
      iconName: "apple",
      iconFamily: "MaterialCommunityIcons",
      iconColor: "#FFFFFF",
    };
  }
  if (lower.includes("disney")) {
    return {
      iconName: "film-outline",
      iconFamily: "Ionicons",
      iconColor: "#0063E5",
    };
  }
  if (
    lower.includes("canva") ||
    lower.includes("adobe") ||
    lower.includes("figma")
  ) {
    return {
      iconName: "color-palette",
      iconFamily: "Ionicons",
      iconColor: "#00C4CC",
    };
  }
  if (
    lower.includes("chat") ||
    lower.includes("openai") ||
    lower.includes("claude")
  ) {
    return {
      iconName: "sparkles",
      iconFamily: "Ionicons",
      iconColor: "#23C481",
    };
  }
  if (
    lower.includes("xbox") ||
    lower.includes("playstation") ||
    lower.includes("game")
  ) {
    return {
      iconName: "game-controller",
      iconFamily: "Ionicons",
      iconColor: "#107C10",
    };
  }
  return {
    iconName: "card-outline",
    iconFamily: "Ionicons",
    iconColor: "#23C481",
  };
}

export function getDaysRemaining(expirationDate: string): number {
  const now = new Date();
  const todayMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  ).getTime();
  const parsed = new Date(expirationDate);
  if (Number.isNaN(parsed.getTime())) {
    return 7;
  }
  const targetMidnight = new Date(
    parsed.getFullYear(),
    parsed.getMonth(),
    parsed.getDate()
  ).getTime();
  return Math.round((targetMidnight - todayMidnight) / (1000 * 60 * 60 * 24));
}

interface AddTrialInput {
  serviceName: string;
  planName?: string;
  cost: number;
  billingCycle?: BillingCycle;
  expirationDate: string;
  cancellationUrl?: string;
}

export interface ToastMessage {
  id: string;
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
}

interface SubscriptionContextValue {
  state: PersistedAppState;
  isHydrating: boolean;
  actionLoadingLabel: string | null;
  toast: ToastMessage | null;
  trials: SubscriptionItem[];
  subscriptions: SubscriptionItem[];
  history: SubscriptionItem[];
  moneySaved: number;
  preventedTrialsCount: number;
  endingSoonCount: number;
  currencySymbol: string;
  formatCurrency: (amountPhp: number, showDecimals?: boolean) => string;
  addTrial: (input: AddTrialInput) => SubscriptionItem;
  cancelItem: (id: string) => void;
  restoreTrial: (id: string) => void;
  keepSubscription: (id: string) => void;
  deleteItem: (id: string) => void;
  updateReminders: (prefs: ReminderPreferences) => void;
  toggleCurrency: () => void;
  login: (email: string, name?: string) => void;
  logout: () => void;
  resetDemoData: () => void;
  showToast: (
    message: string,
    options?: { undoLabel?: string; onUndo?: () => void }
  ) => void;
  dismissToast: () => void;
  runWithActionLoader: (
    label: string,
    callback: () => void,
    durationMs?: number
  ) => void;
}

const SubscriptionContext = createContext<SubscriptionContextValue | undefined>(
  undefined
);

export function SubscriptionProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, dispatch] = useReducer(subscriptionReducer, DEFAULT_STATE);
  const [isHydrating, setIsHydrating] = useState(true);
  const [actionLoadingLabel, setActionLoadingLabel] = useState<string | null>(
    null
  );
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let isMounted = true;
    const hydrate = async () => {
      try {
        // Hydrate storage & preload icon fonts immediately so underlying route mounts without delay
        const [raw] = await Promise.all([
          AsyncStorage.getItem(STORAGE_KEY),
          Ionicons.loadFont().catch(() => {}),
          MaterialCommunityIcons.loadFont().catch(() => {}),
        ]);

        if (raw && isMounted) {
          const parsed = JSON.parse(raw) as Partial<PersistedAppState>;
          dispatch({
            type: "HYDRATE",
            payload: {
              ...DEFAULT_STATE,
              ...parsed,
              user: { ...DEFAULT_STATE.user, ...parsed.user },
              reminders: { ...DEFAULT_STATE.reminders, ...parsed.reminders },
              items: Array.isArray(parsed.items)
                ? parsed.items
                : DEFAULT_STATE.items,
            },
          });
        }
      } catch {
        // Fallback to DEFAULT_STATE
      } finally {
        if (isMounted) {
          setIsHydrating(false);
        }
      }
    };

    hydrate();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (isHydrating) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch(() => {});
  }, [state, isHydrating]);

  const dismissToast = useCallback(() => {
    if (toastTimerRef.current) {
      clearTimeout(toastTimerRef.current);
      toastTimerRef.current = null;
    }
    setToast(null);
  }, []);

  const showToast = useCallback(
    (
      message: string,
      options?: { undoLabel?: string; onUndo?: () => void }
    ) => {
      if (toastTimerRef.current) {
        clearTimeout(toastTimerRef.current);
      }
      setToast({
        id: String(Date.now()),
        message,
        undoLabel: options?.undoLabel,
        onUndo: options?.onUndo,
      });
      toastTimerRef.current = setTimeout(() => {
        setToast(null);
      }, 4200);
    },
    []
  );

  const runWithActionLoader = useCallback(
    (label: string, callback: () => void, durationMs = 360) => {
      setActionLoadingLabel(label);
      setTimeout(() => {
        callback();
        setActionLoadingLabel(null);
      }, durationMs);
    },
    []
  );

  const trials = useMemo(
    () =>
      state.items
        .filter((i) => i.status === "trial")
        .sort(
          (a, b) =>
            getDaysRemaining(a.expirationDate) -
            getDaysRemaining(b.expirationDate)
        ),
    [state.items]
  );

  const subscriptions = useMemo(
    () => state.items.filter((i) => i.status === "active"),
    [state.items]
  );

  const history = useMemo(
    () => state.items.filter((i) => i.status === "cancelled"),
    [state.items]
  );

  const moneySaved = useMemo(() => {
    const cancelledSum = history.reduce((acc, item) => acc + item.cost, 0);
    return state.baseHistoricalSavings + cancelledSum;
  }, [history, state.baseHistoricalSavings]);

  const preventedTrialsCount = useMemo(
    () => state.basePreventedCount + history.length,
    [history.length, state.basePreventedCount]
  );

  const endingSoonCount = useMemo(
    () =>
      trials.filter((t) => getDaysRemaining(t.expirationDate) <= 7).length,
    [trials]
  );

  const currencySymbol = state.user.currency === "PHP" ? "₱" : "$";

  const formatCurrency = useCallback(
    (amountPhp: number, showDecimals = false) => {
      const converted =
        state.user.currency === "PHP" ? amountPhp : amountPhp / 56;
      const formatted = converted.toLocaleString("en-US", {
        minimumFractionDigits: showDecimals ? 2 : 0,
        maximumFractionDigits: showDecimals ? 2 : 0,
      });
      return `${currencySymbol}${formatted}`;
    },
    [currencySymbol, state.user.currency]
  );

  const addTrial = useCallback((input: AddTrialInput): SubscriptionItem => {
    const visuals = inferBrandVisuals(input.serviceName);
    const newItem: SubscriptionItem = {
      id: `item-${Date.now()}`,
      serviceName: input.serviceName.trim(),
      planName: input.planName?.trim() || "Free Trial Plan",
      cost: input.cost,
      billingCycle: input.billingCycle || "mo",
      expirationDate: input.expirationDate.trim(),
      cancellationUrl: input.cancellationUrl?.trim() || undefined,
      iconName: visuals.iconName,
      iconFamily: visuals.iconFamily,
      iconColor: visuals.iconColor,
      status: "trial",
      createdAt: new Date().toISOString(),
    };
    dispatch({ type: "ADD_ITEM", payload: newItem });
    return newItem;
  }, []);

  const cancelItem = useCallback((id: string) => {
    dispatch({
      type: "CANCEL_ITEM",
      payload: {
        id,
        cancelledAt: new Date().toISOString().split("T")[0],
      },
    });
  }, []);

  const restoreTrial = useCallback((id: string) => {
    dispatch({ type: "RESTORE_TRIAL", payload: { id } });
  }, []);

  const keepSubscription = useCallback((id: string) => {
    dispatch({ type: "KEEP_SUBSCRIPTION", payload: { id } });
  }, []);

  const deleteItem = useCallback((id: string) => {
    dispatch({ type: "DELETE_ITEM", payload: { id } });
  }, []);

  const updateReminders = useCallback((prefs: ReminderPreferences) => {
    dispatch({ type: "UPDATE_REMINDERS", payload: prefs });
  }, []);

  const toggleCurrency = useCallback(() => {
    dispatch({ type: "TOGGLE_CURRENCY" });
  }, []);

  const login = useCallback((email: string, name?: string) => {
    dispatch({ type: "LOGIN", payload: { email, name } });
  }, []);

  const logout = useCallback(() => {
    dispatch({ type: "LOGOUT" });
  }, []);

  const resetDemoData = useCallback(() => {
    dispatch({ type: "RESET_DEMO_DATA" });
  }, []);

  const value = useMemo(
    () => ({
      state,
      isHydrating,
      actionLoadingLabel,
      toast,
      trials,
      subscriptions,
      history,
      moneySaved,
      preventedTrialsCount,
      endingSoonCount,
      currencySymbol,
      formatCurrency,
      addTrial,
      cancelItem,
      restoreTrial,
      keepSubscription,
      deleteItem,
      updateReminders,
      toggleCurrency,
      login,
      logout,
      resetDemoData,
      showToast,
      dismissToast,
      runWithActionLoader,
    }),
    [
      state,
      isHydrating,
      actionLoadingLabel,
      toast,
      trials,
      subscriptions,
      history,
      moneySaved,
      preventedTrialsCount,
      endingSoonCount,
      currencySymbol,
      formatCurrency,
      addTrial,
      cancelItem,
      restoreTrial,
      keepSubscription,
      deleteItem,
      updateReminders,
      toggleCurrency,
      login,
      logout,
      resetDemoData,
      showToast,
      dismissToast,
      runWithActionLoader,
    ]
  );

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscriptions() {
  const ctx = useContext(SubscriptionContext);
  if (!ctx) {
    throw new Error(
      "useSubscriptions must be used within a SubscriptionProvider"
    );
  }
  return ctx;
}
