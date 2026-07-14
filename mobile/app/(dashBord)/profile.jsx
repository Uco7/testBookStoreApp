import { StyleSheet, View, Pressable, ActivityIndicator, ScrollView,Alert } from "react-native";
import React from "react";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";
import { Link } from "expo-router";
import { useUser } from "../../hook/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import ProtectedRoute from "../../utils/authCheck/ProtectedRoute";
import { BannerAdComponent } from "../../component/AdsManager";

const Profile = () => {
  const { user, authReady, logOut, deleteAccount } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.replace("/login");
  };
const handleDeleteAccount = () => {
    Alert.alert(
      "Delete Account",
      "This will permanently delete your account, uploaded books,  timetables, all files and records. This cannot be undone. Are you sure you want to continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteAccount();
              router.replace("/login");
            } catch (err) {
              Alert.alert("Error", err.message || "Failed to delete account.");
            }
          },
        },
      ]
    );
  };
  if (!authReady) {
    return (
      <ThemeView style={styles.centered}>
        <ActivityIndicator
          size={20}
          color="#4f46e5"
          style={{ flex: 1, alignItems: "center" }}
        />
      </ThemeView>
    );
  }

  if (!user) {
    return (
      <ThemeView style={styles.centered}>
        <Ionicons name="person-circle-outline" size={64} color="#999" />
        <Spacer />
        <ThemeText>No user logged in</ThemeText>
        <Spacer />
        <Link href="/login">
          <ThemeText style={styles.link}>Go to Login</ThemeText>
        </Link>
      </ThemeView>
    );
  }

  return (
    <ProtectedRoute>
      <ThemeView style={styles.container} safe={true}>
        {/*
          🔧 FIX: switched the outer content to a ScrollView and moved
          BannerAdComponent to sit in normal flow at the end of it,
          instead of position: "absolute" pinned to the screen bottom.

          The old absolute positioning floated the banner ON TOP of
          whatever was last on screen (the Logout button) rather than
          pushing content up to make room for it — so the banner visually
          covered Logout and likely blocked taps on it too. A ScrollView
          plus a normal-flow banner means the banner always renders after
          the last action, with no overlap, and the screen scrolls if the
          content + banner together don't fit the viewport.
        */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <Ionicons name="person-circle" size={90} color="#4f46e5" />
            <Spacer size={8} />
            <ThemeText style={styles.name}>{user.fullName || "Reader"}</ThemeText>
            <ThemeText style={styles.email}>{user.username}</ThemeText>
          </View>

          <Spacer />

          {/* Info Card */}
          <View style={styles.card}>
            <ProfileRow label="Email" value={user.email} />
            {user.fullName && <ProfileRow label="Name" value={user.fullName} />}
          </View>

          <Spacer />

          {/* Actions */}
          <View style={styles.actions}>
            <ProfileAction icon="receipt-outline" label="Transaction History" href="/transactionscreen" />
            <ProfileAction icon="add-circle-outline" label="Upload Book/File" href="/create" />
            <ProfileAction icon="library-outline" label="Book Shelf/Files" href="/book" />
            <ProfileAction icon="home-outline" label="Home" href="/" />
            <Pressable
              style={[styles.actionButton, styles.logout]}
              onPress={handleLogout}
            >
              <Ionicons name="log-out-outline" size={22} color="#ef4444" />
              <ThemeText style={[styles.actionText, { color: "#ef4444" }]}>
                Logout
              </ThemeText>
            </Pressable>
            <Pressable
  style={[styles.actionButton, styles.logout]}
  onPress={handleDeleteAccount}
>
  <Ionicons name="trash-outline" size={22} color="#ef4444" />
  <ThemeText style={[styles.actionText, { color: "#ef4444" }]}>
    Delete Account
  </ThemeText>
</Pressable>
            
          </View>

          {/* Banner now renders here, in normal flow, after Logout —
              never overlapping it. */}
          <View style={styles.bannerContainer}>
            <BannerAdComponent />
          </View>
        </ScrollView>
      </ThemeView>
    </ProtectedRoute>
  );
};

export default Profile;

const ProfileRow = ({ label, value }) => (
  <View style={styles.row}>
    <ThemeText style={styles.label}>{label}</ThemeText>
    <ThemeText style={styles.value}>{value}</ThemeText>
  </View>
);

const ProfileAction = ({ icon, label, href }) => (
  <Link href={href} asChild>
    <Pressable style={styles.actionButton}>
      <Ionicons name={icon} size={22} color="#4f46e5" />
      <ThemeText style={styles.actionText}>{label}</ThemeText>
    </Pressable>
  </Link>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  // 🔧 NEW: contentContainerStyle for the ScrollView. extra bottom
  // padding ensures the last item (banner) always has breathing room
  // above the device's bottom edge / home indicator, even on screens
  // where content is short enough not to need scrolling.
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 10,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
  },
  email: {
    fontSize: 14,
    color: "#777",
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e5e7eb",
  },
  row: {
    marginBottom: 10,
  },
  label: {
    fontSize: 12,
    color: "#6b7280",
  },
  value: {
    fontSize: 14,
    fontWeight: "500",
  },
  actions: {
    marginTop: 10,
  },
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    marginBottom: 10,
  },
  actionText: {
    marginLeft: 12,
    marginBottom: 7,
    fontSize: 16,
    fontWeight: "500",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "500",
  },
  // 🔧 FIX: removed position: "absolute" / bottom / left / right.
  // The banner now sits in normal document flow, after Logout, so it
  // can never render on top of (or block taps on) any action button.
  bannerContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 5,
    backgroundColor: "transparent",
  },
});