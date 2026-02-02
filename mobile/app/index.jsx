import { StyleSheet, View, Image,  } from 'react-native';
import ThemeView from '../component/ThemeView';
import ThemeText from '../component/ThemeText';
import Spacer from "../component/Spacer";
import { Link } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Linking from "expo-linking";
import { useColorScheme } from "react-native";
import Logo from "../assets/logo.jpeg";
import { colors } from '../constant/colors';
import CardTheme from '../component/CardTheme';
import RowItemsTheme from '../component/RowItemsTheme';
import PressableComponent from '../component/PressableComponent';
import { useAppUpdate } from '../hook/appUpdate.js'

const HomeScreen = () => {
    const { updateChecked } = useAppUpdate(); // 🔥 triggers update check

const scheme = useColorScheme();
const theme = colors[scheme] ?? colors.light;
 
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
    <ThemeView style={styles.container} safe={true}>
      
      {/* Top Navigation */}
      <RowItemsTheme style={styles.nav}>
        <Link href="/questionsScreen">
        <ThemeText style={styles.navTitle}>
          Asked Questions
          <Ionicons name="help-circle" size={24} color={theme.iconColorFocused
} />

        </ThemeText>
        </Link>
         
        <View onPress={handleFeedback}>
          <ThemeText style={styles.navTitle}>FeedBack
          <Ionicons name="chatbubble-ellipses-outline" size={24} color={theme.iconColorFocused
} />

          </ThemeText>
        </View>
      </RowItemsTheme>

      {/* Top guidance */}
      
      {/* Card container */}
      <CardTheme style={styles.card}>
        <Image source={Logo} style={styles.logo} />

        <Spacer height={12} />

        <ThemeText style={styles.title}>
          Welcome to your Library
        </ThemeText>

        <Spacer height={6} />

        <ThemeText style={styles.subtitle}>
          {/* <ThemeText></ThemeText> */}
          Manage your collection, track reading,{"\n"}and discover new books!
        </ThemeText>

        <Spacer height={30} />

        {/* First row of buttons */}
        <RowItemsTheme >
          <Link href="/register" asChild>
            <PressableComponent style={styles.button}>
              <ThemeText style={styles.buttonText}>Register</ThemeText>
            </PressableComponent>
          </Link>

          <Link href="/login" asChild>
            <PressableComponent style={styles.button}>
              <ThemeText style={styles.buttonText}>Log In</ThemeText>
            </PressableComponent>
          </Link>
        </RowItemsTheme>

        <Spacer height={12} />

        {/* Second row of buttons */}
        <RowItemsTheme >
          <Link href="/profile" asChild>
            <PressableComponent style={styles.button}>
              <ThemeText style={styles.buttonText}>View Profile</ThemeText>
            </PressableComponent>
          </Link>

          <Link href="/book" asChild>
            <PressableComponent style={styles.button}>
              <ThemeText style={styles.buttonText}>My Library</ThemeText>
            </PressableComponent>
          </Link>
        </RowItemsTheme>
      </CardTheme>
      <Spacer/>
      <ThemeText style={styles.topText}>Learn how to use this app <Link href="/appUsage" style={styles.link}>Cilck</Link></ThemeText>
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
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: "600",
   
    padding:20
  },
  topText: {
    fontSize: 12,
    fontWeight: "500",
    // marginBottom: 20,
    // color: "#fff",
    textAlign: "center",
  },
  card: {
    
    // paddingVertical: 30,
    // paddingHorizontal: 20,
    // borderRadius: 24,
    // // backgroundColor: "rgba(255,255,255,0.05)",
    // // backgroundColor: colors.background,
    // borderWidth: 1,
    // borderColor: "rgba(255,255,255,0.15)",
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
    // color: "#fff",
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
    // color: "#fff",
  },
  // row: {
  //   flexDirection: "row",
  //   gap: 12,
  //   width: "100%",
  // },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(65, 62, 62, 0.2)",
    // backgroundColor: "rgba(255,255,255,0.07)",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
    // color: "#fff",
  },
  link: {
    color: "#4f46e5",
    fontWeight: "500",
    fontSize: 20,
    textDecorationStyle: "underline",
  },
});
