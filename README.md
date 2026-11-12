# Stopscription 🛡️

**Take control of your free trials and recurring subscriptions.**

Stopscription is a cross-platform mobile and web application built with **Expo (React Native)** and **TypeScript** that tracks free trial expiration dates, alerts users before auto-billing occurs, and calculates total money saved from prevented charges.

---

## ✨ Key Features

* **Shining Shield Animated Intro:** Custom branded splash & loading overlay powered by `react-native-reanimated`.
* **Interactive Trial & Subscription Dashboard:**
  * Track **My Trials**, **Recurring Subscriptions**, and **Cancellation History** in real time.
  * Color-coded visual urgency progress bars and dynamic countdown badges (*Expires Tomorrow*, *X Days Left*).
  * Live **Money Saved** counter that increments automatically when trials are stopped before renewal.
* **1-Tap Popular Services Quick-Picker:** Instant auto-fill for *Spotify*, *Netflix*, *Canva Pro*, *ChatGPT Plus*, *YouTube Premium*, *Disney+*, and *Apple One* (including pricing, trial duration, and official cancellation URLs).
* **Custom Cancellation Workflow & Undo Toast:** Open service cancellation pages directly in-app and undo accidental cancellations with a single tap.
* **Multi-Stage Alert Preferences:** Configure *Early Warning (72h)*, *Action Reminder (24h)*, and *Emergency Strike (2h)* notifications.
* **Hybrid State Management & Local Persistence:** Powered by React Context + `useReducer` + `@react-native-async-storage/async-storage` with multi-currency support (`PHP ₱` / `USD $`).

---

## 🚀 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npx expo start
   ```
   * Press **`w`** to launch in your web browser (`http://localhost:8081`).
   * Scan the QR code with **Expo Go** on Android or iOS.
   * Press **`a`** for Android Emulator or **`i`** for iOS Simulator.
