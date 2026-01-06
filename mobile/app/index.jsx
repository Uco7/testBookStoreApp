import { StyleSheet, View, Image, TouchableOpacity, Alert } from 'react-native';
import React from 'react';
import ThemeView from '../component/ThemeView';
import ThemeText from '../component/ThemeText';
import Spacer from "../component/Spacer";
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from "expo-linking";

import Logo from "../assets/logo.jpeg";

const HomeScreen = () => {

 
const handleFeedback = () => {
  const email = "ucnodemailler@gmail.com";
  const subject = encodeURIComponent("App Feedback");
  const body = encodeURIComponent("Hello, I would like to provide some feedback on the app:\n");

  const mailtoUrl = `mailto:${email}?subject=${subject}&body=${body}`;

  Linking.canOpenURL(mailtoUrl)
    .then((supported) => {
      if (!supported) {
        alert("Unable to open email client");
      } else {
        return Linking.openURL(mailtoUrl);
      }
    })
    .catch((err) => console.error("Error opening email client:", err));
};
  return (
    <ThemeView style={styles.container}>
      
      {/* Top Navigation */}
      <View style={styles.nav}>
        <Link href="/questionsScreen">
        <ThemeText style={styles.navTitle}>
          Asked Questions
          <Ionicons name="help-circle" size={24} color="#fff" />

        </ThemeText>
        </Link>
         
        <TouchableOpacity onPress={handleFeedback}>
          <ThemeText style={styles.navTitle}>FeedBack
          <Ionicons name="chatbubble-ellipses-outline" size={24} color="#fff" />

          </ThemeText>
        </TouchableOpacity>
      </View>

      {/* Top guidance */}
      
      {/* Card container */}
      <View style={styles.card}>
        <Image source={Logo} style={styles.logo} />

        <Spacer height={12} />

        <ThemeText style={styles.title}>
          Welcome to your Library
        </ThemeText>

        <Spacer height={6} />

        <ThemeText style={styles.subtitle}>
          Manage your collection, track reading,{"\n"}and discover new books!
        </ThemeText>

        <Spacer height={30} />

        {/* First row of buttons */}
        <View style={styles.row}>
          <Link href="/register" asChild>
            <TouchableOpacity style={styles.button}>
              <ThemeText style={styles.buttonText}>Register</ThemeText>
            </TouchableOpacity>
          </Link>

          <Link href="/login" asChild>
            <TouchableOpacity style={styles.button}>
              <ThemeText style={styles.buttonText}>Log In</ThemeText>
            </TouchableOpacity>
          </Link>
        </View>

        <Spacer height={12} />

        {/* Second row of buttons */}
        <View style={styles.row}>
          <Link href="/profile" asChild>
            <TouchableOpacity style={styles.button}>
              <ThemeText style={styles.buttonText}>View Profile</ThemeText>
            </TouchableOpacity>
          </Link>

          <Link href="/library" asChild>
            <TouchableOpacity style={styles.button}>
              <ThemeText style={styles.buttonText}>My Library</ThemeText>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
      <Spacer/>
      <ThemeText style={styles.topText}>Learn how to use this app{""} <Link href="/appUsage" style={styles.link}>Cilck</Link></ThemeText>
    </ThemeView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 40, // space for status bar
  },
  nav: {
    width: "90%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    padding:20
  },
  topText: {
    fontSize: 18,
    fontWeight: "500",
    // marginBottom: 20,
    color: "#fff",
    textAlign: "center",
  },
  card: {
    width: "90%",
    paddingVertical: 30,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
  },
  logo: {
    width: "40%",
    height: 100,
    resizeMode: "contain",
    borderRadius: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
    color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
    color: "#fff",
  },
  row: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
    backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    color: "#fff",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "500",
    fontSize: 20,
    textDecorationStyle: "underline",
  },
});
