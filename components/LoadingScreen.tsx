import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import React, { useEffect } from "react";
import {
  ActivityIndicator,
  Image,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  Easing,
  FadeInDown,
  FadeOutDown,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Colors } from "../constants/theme";

interface LoadingScreenProps {
  onFinish?: () => void;
}

export default function LoadingScreen({ onFinish }: LoadingScreenProps) {
  // Stage 1: Shield Materialization
  const shieldScale = useSharedValue(0.84);
  const shieldOpacity = useSharedValue(0);

  // Stage 2: Diagonal Specular Shine Sweep + Ring Flare + Crest Sparkle
  const shineTranslateX = useSharedValue(-220);
  const ringScale = useSharedValue(0.95);
  const ringOpacity = useSharedValue(0.2);
  const sparkleScale = useSharedValue(0);
  const sparkleRotate = useSharedValue(0);

  // Stage 3: Brand Typography Lockup + Smooth Screen Exit
  const textOpacity = useSharedValue(0);
  const textTranslateY = useSharedValue(12);
  const screenOpacity = useSharedValue(1);

  useEffect(() => {
    // 1. Materialize enlarged shield emblem (0ms -> 360ms)
    shieldOpacity.value = withTiming(1, {
      duration: 320,
      easing: Easing.out(Easing.cubic),
    });
    shieldScale.value = withSequence(
      withTiming(1.05, {
        duration: 340,
        easing: Easing.out(Easing.back(1.4)),
      }),
      withTiming(1, {
        duration: 220,
        easing: Easing.inOut(Easing.quad),
      })
    );

    // 2. Diagonal metallic shine sweep across shield (260ms -> 960ms)
    shineTranslateX.value = withDelay(
      260,
      withTiming(220, {
        duration: 700,
        easing: Easing.inOut(Easing.cubic),
      })
    );

    // Outer neon ring flare as the shine crosses the shield center
    ringOpacity.value = withDelay(
      260,
      withSequence(
        withTiming(0.9, {
          duration: 340,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0.32, {
          duration: 420,
          easing: Easing.inOut(Easing.quad),
        })
      )
    );
    ringScale.value = withDelay(
      260,
      withSequence(
        withTiming(1.08, {
          duration: 360,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1.0, {
          duration: 400,
          easing: Easing.inOut(Easing.quad),
        })
      )
    );

    // Option A: 4-point specular star sparkle at the top-right shield crest (~480ms)
    sparkleScale.value = withDelay(
      480,
      withSequence(
        withTiming(1.3, {
          duration: 180,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(0, {
          duration: 240,
          easing: Easing.in(Easing.quad),
        })
      )
    );
    sparkleRotate.value = withDelay(
      480,
      withTiming(45, {
        duration: 420,
        easing: Easing.out(Easing.quad),
      })
    );

    // 3. Brand title & tagline glide-up reveal (520ms -> 900ms)
    textOpacity.value = withDelay(
      520,
      withTiming(1, {
        duration: 360,
        easing: Easing.out(Easing.cubic),
      })
    );
    textTranslateY.value = withDelay(
      520,
      withTiming(0, {
        duration: 360,
        easing: Easing.out(Easing.cubic),
      })
    );

    // Smooth exit cross-fade over the already-mounted screen underneath (1150ms -> 1420ms)
    screenOpacity.value = withDelay(
      1150,
      withTiming(0, {
        duration: 270,
        easing: Easing.inOut(Easing.quad),
      })
    );

    let hapticTimer: ReturnType<typeof setTimeout> | undefined;
    if (Platform.OS !== "web") {
      hapticTimer = setTimeout(() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
      }, 500);
    }

    const finishTimer = setTimeout(() => {
      onFinish?.();
    }, 1430);

    return () => {
      if (hapticTimer) clearTimeout(hapticTimer);
      clearTimeout(finishTimer);
    };
  }, [
    onFinish,
    ringOpacity,
    ringScale,
    screenOpacity,
    shieldOpacity,
    shieldScale,
    shineTranslateX,
    sparkleRotate,
    sparkleScale,
    textOpacity,
    textTranslateY,
  ]);

  const containerAnimatedStyle = useAnimatedStyle(() => ({
    opacity: screenOpacity.value,
  }));

  const shieldAnimatedStyle = useAnimatedStyle(() => ({
    opacity: shieldOpacity.value,
    transform: [{ scale: shieldScale.value }],
  }));

  const outerRingStyle = useAnimatedStyle(() => ({
    opacity: ringOpacity.value,
    transform: [{ scale: ringScale.value }],
  }));

  const shineSweepStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: shineTranslateX.value },
      { rotate: "-25deg" },
    ],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: sparkleScale.value },
      { rotate: `${sparkleRotate.value}deg` },
    ],
    opacity: sparkleScale.value > 0.05 ? 1 : 0,
  }));

  const textAnimatedStyle = useAnimatedStyle(() => ({
    opacity: textOpacity.value,
    transform: [{ translateY: textTranslateY.value }],
  }));

  return (
    <Animated.View
      pointerEvents="auto"
      style={[styles.splashOverlay, containerAnimatedStyle]}
    >
      <View style={styles.emblemWrapper}>
        {/* Single Clean Outer Neon Flare Ring */}
        <Animated.View style={[styles.pulseRing, outerRingStyle]} />

        {/* Enlarged Pure Shield Badge with Clipped Diagonal Metallic Shine */}
        <Animated.View style={[styles.iconBadge, shieldAnimatedStyle]}>
          <Image
            source={require("../assets/images/shield-emblem.png")}
            style={styles.shieldImage}
            resizeMode="contain"
          />

          {/* Multi-Band Specular Light Sweep */}
          <Animated.View
            pointerEvents="none"
            style={[styles.shineBeamContainer, shineSweepStyle]}
          >
            <View style={styles.shineEdgeBand} />
            <View style={styles.shineCoreBand} />
            <View style={styles.shineEdgeBand} />
          </Animated.View>
        </Animated.View>

        {/* Option A: 4-Point Specular Star Sparkle at the Shield Crest */}
        <Animated.View
          pointerEvents="none"
          style={[styles.sparkleContainer, sparkleAnimatedStyle]}
        >
          <View style={styles.sparkleRayHorizontal} />
          <View style={styles.sparkleRayVertical} />
          <View style={styles.sparkleCore} />
        </Animated.View>
      </View>

      {/* Brand Lockup */}
      <Animated.View style={[styles.textContainer, textAnimatedStyle]}>
        <Text style={styles.brandTitle}>STOPSCRIPTION</Text>
        <Text style={styles.tagline}>Take control of your trials.</Text>
      </Animated.View>
    </Animated.View>
  );
}

export function ActionLoaderOverlay({
  visible,
  label = "Processing...",
}: {
  visible: boolean;
  label?: string;
}) {
  if (!visible) return null;

  return (
    <View style={styles.actionLoaderBackdrop}>
      <View style={styles.actionLoaderCard}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.actionLoaderText}>{label}</Text>
      </View>
    </View>
  );
}

export function ToastBanner({
  message,
  undoLabel,
  onUndo,
  onDismiss,
}: {
  message: string;
  undoLabel?: string;
  onUndo?: () => void;
  onDismiss: () => void;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      style={styles.toastWrapper}
    >
      <View style={styles.toastCard}>
        <Ionicons name="checkmark-circle" size={20} color={Colors.primary} />
        <Text style={styles.toastMessage} numberOfLines={2}>
          {message}
        </Text>
        {onUndo ? (
          <TouchableOpacity
            style={styles.toastUndoBtn}
            onPress={() => {
              onUndo();
              onDismiss();
            }}
          >
            <Text style={styles.toastUndoText}>{undoLabel || "UNDO"}</Text>
          </TouchableOpacity>
        ) : null}
        <TouchableOpacity onPress={onDismiss} style={styles.toastCloseBtn}>
          <Ionicons name="close" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  splashOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    backgroundColor: Colors.background,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  emblemWrapper: {
    width: 220,
    height: 220,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 28,
  },
  pulseRing: {
    position: "absolute",
    width: 206,
    height: 206,
    borderRadius: 103,
    borderWidth: 2,
    borderColor: Colors.primary,
    backgroundColor: "rgba(35, 196, 129, 0.06)",
  },
  iconBadge: {
    width: 184,
    height: 184,
    borderRadius: 92,
    backgroundColor: Colors.card,
    borderWidth: 1.5,
    borderColor: "rgba(35, 196, 129, 0.35)",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  shieldImage: {
    width: 152,
    height: 152,
  },
  shineBeamContainer: {
    position: "absolute",
    top: -60,
    bottom: -60,
    width: 78,
    flexDirection: "row",
    alignItems: "stretch",
    justifyContent: "center",
  },
  shineEdgeBand: {
    width: 18,
    backgroundColor: "rgba(35, 196, 129, 0.22)",
  },
  shineCoreBand: {
    width: 28,
    backgroundColor: "rgba(255, 255, 255, 0.65)",
  },
  sparkleContainer: {
    position: "absolute",
    top: 38,
    right: 40,
    width: 28,
    height: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  sparkleRayHorizontal: {
    position: "absolute",
    width: 26,
    height: 3,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  sparkleRayVertical: {
    position: "absolute",
    width: 3,
    height: 26,
    borderRadius: 2,
    backgroundColor: "#FFFFFF",
  },
  sparkleCore: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  textContainer: {
    alignItems: "center",
  },
  brandTitle: {
    color: Colors.textPrimary,
    fontSize: 26,
    fontWeight: "800",
    letterSpacing: 3.5,
    marginBottom: 8,
  },
  tagline: {
    color: Colors.textSecondary,
    fontSize: 15,
    fontWeight: "500",
  },

  /* Action Loader Overlay */
  actionLoaderBackdrop: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9000,
    backgroundColor: "rgba(11, 17, 13, 0.78)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionLoaderCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: "rgba(35, 196, 129, 0.35)",
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 32,
    alignItems: "center",
    gap: 14,
  },
  actionLoaderText: {
    color: Colors.textPrimary,
    fontSize: 14,
    fontWeight: "600",
  },

  /* Floating Toast Banner */
  toastWrapper: {
    position: "absolute",
    bottom: 76,
    left: 16,
    right: 16,
    zIndex: 8500,
  },
  toastCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#142019",
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 10,
  },
  toastMessage: {
    flex: 1,
    color: Colors.textPrimary,
    fontSize: 13,
    fontWeight: "600",
  },
  toastUndoBtn: {
    backgroundColor: "rgba(35, 196, 129, 0.18)",
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  toastUndoText: {
    color: Colors.primary,
    fontSize: 12,
    fontWeight: "bold",
  },
  toastCloseBtn: {
    padding: 2,
  },
});
