import { Redirect } from "expo-router";
import React from "react";
import { useSubscriptions } from "../context/SubscriptionContext";

export default function Index() {
  const { state } = useSubscriptions();

  if (state.user.isAuthenticated) {
    return <Redirect href="/(tabs)" />;
  }

  return <Redirect href="/(auth)/login" />;
}
