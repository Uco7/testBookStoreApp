// component/RewardedAdIntroModal.jsx
//
// AdMob policy requires that BEFORE a rewarded interstitial plays, the
// user sees an intro screen with:
//   1. Clear reward messaging (what they get for watching)
//   2. An unobstructed, functional option to decline ("Skip" / "No thanks")
//   3. Enough time to actually read and choose.

import React from "react";
import { Modal, View, Pressable, StyleSheet } from "react-native";
import ThemeText from "./ThemeText";
import { useTheme } from "../context/ThemeContext";

const RewardedAdIntroModal = ({ visible, rewardLabel, onWatch, onSkip }) => {
  const { theme } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onSkip}>
      <View style={styles.overlay}>
        <View style={[styles.card, { backgroundColor: theme.background }]}>
          <ThemeText style={styles.title}>Watch a short ad?</ThemeText>

          <ThemeText style={styles.body}>
            {rewardLabel || "Watch a short ad to continue."}
          </ThemeText>

          <View style={styles.actions}>
            <Pressable
              style={[styles.button, styles.skipButton]}
              onPress={onSkip}
              accessibilityRole="button"
              accessibilityLabel="Skip ad and continue"
            >
              <ThemeText style={styles.skipButtonText}>No thanks</ThemeText>
            </Pressable>

            <Pressable
              style={[styles.button, styles.watchButton]}
              onPress={onWatch}
              accessibilityRole="button"
              accessibilityLabel="Watch ad to continue"
            >
              <ThemeText style={styles.watchButtonText}>Watch ad</ThemeText>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default RewardedAdIntroModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 380,
    borderRadius: 16,
    padding: 24,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 8,
  },
  body: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.8,
    marginBottom: 24,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 6,
  },
  skipButton: {
    backgroundColor: "rgba(0,0,0,0.08)",
  },
  skipButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  watchButton: {
    backgroundColor: "#007AFF",
  },
  watchButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});