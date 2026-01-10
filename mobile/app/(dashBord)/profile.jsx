

import { StyleSheet, View, Pressable, ActivityIndicator } from "react-native";
import React from "react";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";
import { Link } from "expo-router";
import { useUser } from "../../hook/useUser";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";



const Profile = () => {
const { user, authReady, logOut } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await logOut();
    router.replace("/login");
  }
  if (!authReady) {
    return (
      <ThemeView style={styles.centered}>
        {/* <ThemeText>Loading...</ThemeText> */}
        <ActivityIndicator
        size={20}
        color="#4f46e5"
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
    <ThemeView style={styles.container} safe={true}>
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
        {/* <ProfileRow label="User ID" value={user._id} /> */}
        <ProfileRow label="Email" value={user.email} />
        {user.fullName && <ProfileRow label="Name" value={user.fullName} />}
      </View>

      <Spacer />

      {/* Actions */}
      <View style={styles.actions}>
        <ProfileAction icon="add-circle-outline" label="Upload Book/File" href="/create" />
        <ProfileAction icon="library-outline" label="Book Shelf/Files" href="/book" />
        <ProfileAction icon="home-outline" label="Home" href="/" />
        <Pressable style={[styles.actionButton, styles.logout]} onPress={handleLogout}>
    <Ionicons name="log-out-outline" size={22} color="#ef4444" />
    <ThemeText style={[styles.actionText, { color: "#ef4444" }]}>Logout</ThemeText>
  </Pressable>
      </View>
    </ThemeView>
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
    fontSize: 16,
    fontWeight: "500",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "500",
  },
});
