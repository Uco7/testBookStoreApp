import React, { useEffect } from "react";
import {
  Modal,
  View,
  StyleSheet,
  Pressable,
  BackHandler,
  Linking,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import ThemeText from "./ThemeText";
import Logo from "../assets/logo.png";
import { colors } from "../constant/colors";

export default function ForceUpdateModal({ visible, message, storeUrl }) {
  // Block the Android hardware back button entirely while shown —
  // there is no dismiss path except tapping Update.
  useEffect(() => {
    if (!visible) return;
    const sub = BackHandler.addEventListener("hardwareBackPress", () => true);
    return () => sub.remove();
  }, [visible]);

  const handleUpdatePress = () => {
    if (storeUrl) Linking.openURL(storeUrl).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={() => {}} // no-op: fully blocks Android back-dismiss
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <Image source={Logo} style={styles.logo} />
          <ThemeText style={styles.title}>Update required</ThemeText>
          <ThemeText style={styles.message}>{message}</ThemeText>

          <Pressable style={styles.button} onPress={handleUpdatePress}>
            <Ionicons name="download-outline" size={18} color="#fff" />
            <ThemeText style={styles.buttonText}>Update now</ThemeText>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.88)",
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
  },
  logo: { width: 56, height: 56, marginBottom: 16 },
  title: { fontSize: 19, fontWeight: "800", marginBottom: 8, textAlign: "center" },
  message: {
    fontSize: 14,
    opacity: 0.7,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    backgroundColor: colors.primary,
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 12,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 15 },
});