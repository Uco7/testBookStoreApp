import React from "react";
import { Modal, View, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemeText from "./ThemeText";
import ThemeView from "./ThemeView";
import Spacer from "./Spacer";
import { useTheme } from "../context/ThemeContext";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import { PRIVACY_ACK_KEY } from "../constant/keys";
// import { useEffect } from "react";

/**
 * PrivacyPolicyModal
 *
 * A compact "cookie banner" style card — floating near the bottom with
 * margin on all sides (not full-width, not touching screen edges),
 * rounded corners all around, a small close icon, body copy, a link to
 * the full policy, and two side-by-side action buttons. No dark backdrop:
 * the rest of the Home Screen stays fully visible around the card.
 *
 * Props:
 *  - visible: boolean            -> controls modal visibility
 *  - onAccept: () => void        -> called when the user accepts/dismisses
 */
const PrivacyPolicyModal = ({ visible, onAccept }) => {


  const router = useRouter();
  const { theme } = useTheme();


//   useEffect(() => {
//   const checkPrivacyAck = async () => {
//     try {
//       await AsyncStorage.removeItem("hasSeenPrivacyPolicy"); // 🧪 TEMP: force it to show again — delete this line after testing
//       const seen = await AsyncStorage.getItem(PRIVACY_ACK_KEY);
//       if (!seen) {
//         setShowPrivacyModal(true);
//       }
//     } catch (error) {
//       setShowPrivacyModal(false);
//     }
//   };

//   checkPrivacyAck();
// }, []);
  const handleReadFullPolicy = () => {
    // Close the popup first, then navigate to the full policy screen
    onAccept?.();
    router.push("/Privacypolicyscreen");
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      statusBarTranslucent
      onRequestClose={onAccept}
    >
      <View style={styles.overlay}>
        <ThemeView style={styles.card}>
          <View style={styles.headerRow}>
            <ThemeText style={styles.title}>Your Privacy Matters</ThemeText>

            <Pressable onPress={onAccept} hitSlop={10}>
              <Ionicons name="close" size={18} color={theme.iconColorFocused} />
            </Pressable>
          </View>

          <Spacer height={10} />

          <ThemeText style={styles.body}>
            Everybody wants your data - and so do we. That's why we
            collect a limited amount of information (account details and
            usage data) to give you a better experience in this app. We
            never sell your personal information.
          </ThemeText>

          <Spacer height={10} />

          <Pressable onPress={handleReadFullPolicy}>
            <ThemeText style={[styles.link, { color: theme.iconColorFocused }]}>
              Read our full Privacy Policy
            </ThemeText>
          </Pressable>

          <Spacer height={16} />

          {/* SIDE-BY-SIDE ACTION BUTTONS */}
          <View style={styles.buttonRow}>
            <Pressable style={styles.secondaryButton} onPress={onAccept}>
              <ThemeText style={styles.secondaryButtonText}>Not now</ThemeText>
            </Pressable>

            <Pressable style={styles.primaryButton} onPress={onAccept}>
              <ThemeText style={styles.primaryButtonText}>Got it</ThemeText>
            </Pressable>
          </View>
        </ThemeView>
      </View>
    </Modal>
  );
};

export default PrivacyPolicyModal;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignItems: "center",
  },
  card: {
    flex: 0,
    flexGrow: 0,
    flexShrink: 0,
    alignSelf: "center",
    width: "90%",
    marginBottom: 24,
    borderRadius: 16,
    padding: 20,
    // Floating card shadow — no dark backdrop, so the shadow does the
    // work of separating it from the screen behind it
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 14,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "bold",
    paddingRight: 12,
  },
  body: {
    fontSize: 13,
    lineHeight: 19,
    opacity: 0.8,
  },
  link: {
    fontSize: 13,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 10,
  },
  secondaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  secondaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
  },
  primaryButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "#111",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#fff",
  },
});