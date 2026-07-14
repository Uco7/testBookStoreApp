



// // import { StyleSheet, View, Image, Pressable,Alert } from "react-native";
// // import ThemeView from "../component/ThemeView";
// // import ThemeText from "../component/ThemeText";
// // import Spacer from "../component/Spacer";
// // import { Link } from "expo-router";
// // import { Ionicons } from "@expo/vector-icons";
// // import * as Linking from "expo-linking";
// // import Logo from "../assets/logo.png";
// // import { colors } from "../constant/colors";
// // import CardTheme from "../component/CardTheme";
// // import RowItemsTheme from "../component/RowItemsTheme";
// // import PressableComponent from "../component/PressableComponent";
// // import { useAppUpdate } from "../hook/appUpdate.js";
// // import { useTheme } from "../context/ThemeContext";
// // import { useUser } from "../hook/useUser";
// // import { useRouter } from "expo-router";
// // import NetInfo from "@react-native-community/netinfo"; 
// // import { BannerAdComponent } from "../component/AdsManager.jsx";


// // // 🔥 REWARDED INTERSTITIAL SYSTEM IMPORT FIXED
// // import { useAdGate } from "../hook/useRewardAdsEnabled.js"; 


// // const HomeScreen = () => {
// //   const { updateChecked } = useAppUpdate();
// //   const { theme, toggleTheme } = useTheme();
// //   const { user } = useUser();
// //   const router = useRouter();

// //   // ✅ NOW THIS WORKS: useAdGate is successfully imported above
// //   // const { gate } = useAdGate();
// //   const {
// //   gate,
// //   adsEligible,
// //   isLoaded,
// // } = useAdGate();

// //   // ── Auth guard ─────────────────────────────────────
// //   const requireAuth = (route) => {
// //     router.push(user ? route : "/login");
// //   };

// //   // 🔥 NAV GATEWAY FOR THE REWARDED INTERSTITIAL SYSTEM
// //   // const handleGatedNavigation = async (route) => {
// //   //   try {
// //   //     const state = await NetInfo.fetch();

// //   //     // Offline user -> bypass ads safely to avoid layout freezes
// //   //     if (!state.isConnected || !state.isInternetReachable) {
// //   //       router.push(route);
// //   //       return;
// //   //     }

// //   //     // Online user -> display full screen video instantly!
// //   //     gate(() => router.push(route));
// //   //   } catch (error) {
// //   //     // Safety network or caching fallback
// //   //     router.push(route);
// //   //   }
// //   // };
// //   const handleGatedNavigation = async (route) => {
// //   try {
// //     const state = await NetInfo.fetch();

// //     // Offline
// //     if (!state.isConnected || !state.isInternetReachable) {
// //       router.push(route);
// //       return;
// //     }

// //     // User not eligible
// //     if (!adsEligible) {
// //       router.push(route);
// //       return;
// //     }

// //     // Ad not loaded
// //     if (!isLoaded) {
// //       router.push(route);
// //       return;
// //     }

// //     Alert.alert(
// //       "Watch Ad",
// //       "Watch a short ad to access this feature.",
// //       [
// //         {
// //           text: "Not Now",
// //           style: "cancel",
// //           onPress: () => router.push(route),
// //         },
// //         {
// //           text: "Watch Ad",
// //           onPress: () =>
// //             gate(() => router.push(route)),
// //         },
// //       ]
// //     );
// //   } catch (error) {
// //     router.push(route);
// //   }
// // };

// //   // ── Feedback mailer ────────────────────────────────
// //   const handleFeedback = () => {
// //     const email = "ucnodemailler@gmail.com";
// //     const subject = encodeURIComponent("App Feedback");
// //     const body = encodeURIComponent(
// //       "Hello, I would like to provide some feedback:\n"
// //     );

// //     const url = `mailto:${email}?subject=${subject}&body=${body}`;

// //     Linking.canOpenURL(url)
// //       .then((ok) => {
// //         if (ok) Linking.openURL(url);
// //         else alert("Cannot open email client");
// //       })
// //       .catch(console.error);
// //   };

// //   return (
// //     <ThemeView style={styles.container} safe={true}>
      
// //       {/* TOP NAV BAR */}
// //       <RowItemsTheme style={styles.nav}>
// //         <Link href="/questionsScreen" asChild>
// //           <Pressable>
// //             <ThemeText style={styles.navTitle}>
// //               Asked Questions{" "}
// //               <Ionicons
// //                 name="help-circle"
// //                 size={24}
// //                 color={theme.iconColorFocused}
// //               />
// //             </ThemeText>
// //           </Pressable>
// //         </Link>

// //         <Pressable onPress={handleFeedback} style={styles.feedbackBtn}>
// //           <ThemeText style={styles.navTitle}>
// //             FeedBack{" "}
// //             <Ionicons
// //               name="chatbubble-ellipses-outline"
// //               size={24}
// //               color={theme.iconColorFocused}
// //             />
// //           </ThemeText>
// //         </Pressable>

// //         <Pressable onPress={toggleTheme}>
// //           <ThemeText style={styles.buttonText}>
// //             <Ionicons
// //               name={theme === colors.dark ? "moon" : "sunny"}
// //               size={20}
// //               color={theme.iconColorFocused}
// //             />{" "}
// //             {theme === colors.dark ? "Light " : "Dark "}
// //           </ThemeText>
// //         </Pressable>
// //       </RowItemsTheme>

// //       {/* MAIN CONTENT CARD */}
// //       <CardTheme style={styles.card}>
// //         <Image source={Logo} style={styles.logo} />

// //         <ThemeText style={styles.title}>
// //           Welcome to your Library
// //         </ThemeText>

// //         <Spacer height={6} />

// //         <ThemeText style={styles.subtitle}>
// //           Manage your collection, track reading,{"\n"}
// //           and discover new books!
// //         </ThemeText>

// //         <Spacer height={30} />
        

// //         {/* ROW 1 */}
// //         <RowItemsTheme>
// //           <Link href="/register" asChild>
// //             <Pressable style={styles.button}>
// //               <ThemeText style={styles.buttonText}>Register</ThemeText>
// //             </Pressable>
// //           </Link>

// //           <Link href="/login" asChild>
// //             <Pressable style={styles.button}>
// //               <ThemeText style={styles.buttonText}>Log In</ThemeText>
// //             </Pressable>
// //           </Link>
// //         </RowItemsTheme>

// //         <Spacer height={12} />

// //         {/* ROW 2 */}
// //         <RowItemsTheme>
// //           <Pressable
// //             style={styles.button}
// //             onPress={() => requireAuth("/profile")}
// //           >
// //             <ThemeText style={styles.buttonText}>
// //               View Profile
// //             </ThemeText>
// //           </Pressable>

// //           <Pressable
// //             style={styles.button}
// //             onPress={() => requireAuth("/book")}
// //           >
// //             <ThemeText style={styles.buttonText}>
// //               My Library
// //             </ThemeText>
// //           </Pressable>
// //         </RowItemsTheme>

// //         <Spacer height={12} />

// //         {/* ROW 3 (GATED INTERSTITIAL) */}
// //         <RowItemsTheme>
// //           <Link href="/subscribeScreen" asChild>
// //             <Pressable style={styles.button}>
// //               <ThemeText style={styles.buttonText}>
// //                 Subscribe
// //               </ThemeText>
// //             </Pressable>
// //           </Link>

// //           <Pressable
// //             style={styles.button}
// //             onPress={() => handleGatedNavigation("/timetableScreen")}
// //           >
// //             <ThemeText style={styles.buttonText}>
// //               My TimeTable
// //             </ThemeText>
// //           </Pressable>
// //         </RowItemsTheme>

// //         <Spacer height={12} />

// //         {/* ROW 4 (GATED INTERSTITIAL) */}
// //         <RowItemsTheme>
// //           <Pressable
// //             style={styles.button}
// //             onPress={() => handleGatedNavigation("/offlineBooks")}
// //           >
// //             <ThemeText style={styles.buttonText}>
// //               Offline Library
// //             </ThemeText>
// //           </Pressable>

// //           <Pressable
// //             style={styles.button}
// //             onPress={() => handleGatedNavigation("/offlineTimetable")}
// //           >
// //             <ThemeText style={styles.buttonText}>
// //               Offline TimeTable
// //             </ThemeText>
// //           </Pressable>
// //         </RowItemsTheme>
// //       </CardTheme>

// //       <Spacer />

// //       <ThemeText style={styles.topText}>
// //         Learn how to use this app{" "}
// //         <Link href="/appUsage" style={styles.link}>
// //           Click
// //         </Link>
// //       </ThemeText>
// //       <Spacer />
// //             <BannerAdComponent />
      

// //     </ThemeView>
// //   );
// // };

// // export default HomeScreen;

// // const styles = StyleSheet.create({
// //   container: {
// //     flex: 1,
// //     justifyContent: "flex-start",
// //     alignItems: "center",
// //     paddingHorizontal: 16,
// //     paddingTop: 40,
// //     paddingBottom: 60,
// //   },
// //   nav: {
// //     width: "95%",
// //     flexDirection: "row",
// //     justifyContent: "space-between",
// //     alignItems: "center",
// //     marginBottom: 20,
// //   },
// //   feedbackBtn: {
// //     backgroundColor: "transparent",
// //     padding: 8,
// //     borderRadius: 8,
// //   },
// //   navTitle: {
// //     fontSize: 12,
// //     fontWeight: "600",
// //     padding: 10,
// //   },
// //   card: {
// //     width: "100%",
// //     padding: 16,
// //     borderRadius: 12,
// //   },
// //   logo: {
// //     width: 60,
// //     height: 60,
// //     alignSelf: "center",
// //   },
// //   title: {
// //     fontSize: 22,
// //     fontWeight: "bold",
// //     textAlign: "center",
// //     marginTop: 10,
// //   },
// //   subtitle: {
// //     fontSize: 14,
// //     textAlign: "center",
// //     opacity: 0.7,
// //   },
// //   button: {
// //     flex: 1,
// //     padding: 12,
// //     marginHorizontal: 4,
// //     borderRadius: 8,
// //     alignItems: "center",
// //     backgroundColor: "rgba(0,0,0,0.05)",
// //   },
// //   buttonText: {
// //     fontSize: 14,
// //     fontWeight: "500",
// //   },
// //   topText: {
// //     fontSize: 14,
// //     textAlign: "center",
// //     marginTop: 20,
// //   },
// //   link: {
// //     color: "#007AFF",
// //     fontWeight: "bold",
// //   },
// // });









// import { StyleSheet, View, Image, Pressable ,Alert} from "react-native";
// import ThemeView from "../component/ThemeView";
// import ThemeText from "../component/ThemeText";
// import Spacer from "../component/Spacer";
// import { Link } from "expo-router";
// import { Ionicons } from "@expo/vector-icons";
// import * as Linking from "expo-linking";
// import Logo from "../assets/logo.png";
// import { colors } from "../constant/colors";
// import CardTheme from "../component/CardTheme";
// import RowItemsTheme from "../component/RowItemsTheme";
// import PressableComponent from "../component/PressableComponent";
// import { useAppUpdate } from "../hook/appUpdate.js";
// import { useTheme } from "../context/ThemeContext";
// import { useUser } from "../hook/useUser";
// import { useRouter } from "expo-router";
// import NetInfo from "@react-native-community/netinfo"; 
// import { BannerAdComponent } from "../component/AdsManager.jsx";


// // 🔥 REWARDED INTERSTITIAL SYSTEM IMPORT FIXED
// import { useAdGate } from "../hook/useRewardAdsEnabled.js"; 


// const HomeScreen = () => {
//   const { updateChecked } = useAppUpdate();
//   const { theme, toggleTheme } = useTheme();
//   const { user } = useUser();
//   const router = useRouter();

//   // ✅ NOW THIS WORKS: useAdGate is successfully imported above
//   const { gate } = useAdGate();

//   // ── Auth guard ─────────────────────────────────────
//   const requireAuth = (route) => {
//     router.push(user ? route : "/login");
//   };

//   // 🔥 NAV GATEWAY FOR THE REWARDED INTERSTITIAL SYSTEM
//   const handleGatedNavigation = async (route) => {
//     try {
//       const state = await NetInfo.fetch();

//       // Offline user -> bypass ads safely to avoid layout freezes
//       if (!state.isConnected || !state.isInternetReachable) {
//         router.push(route);
//         return;
//       }

//       // Online user -> display full screen video instantly!
//       gate(() => router.push(route));
//     } catch (error) {
//       // Safety network or caching fallback
//       router.push(route);
//     }
//   };

//   // ── Feedback mailer ────────────────────────────────
//   const handleFeedback = () => {
//     const email = "ucnodemailler@gmail.com";
//     const subject = encodeURIComponent("App Feedback");
//     const body = encodeURIComponent(
//       "Hello, I would like to provide some feedback:\n"
//     );

//     const url = `mailto:${email}?subject=${subject}&body=${body}`;

//     Linking.canOpenURL(url)
//       .then((ok) => {
//         if (ok) Linking.openURL(url);
//         else alert("Cannot open email client");
//       })
//       .catch(console.error);
//   };

//   return (
//     <ThemeView style={styles.container} safe={true}>
      
//       {/* TOP NAV BAR */}
//       <RowItemsTheme style={styles.nav}>
//         <Link href="/questionsScreen" asChild>
//           <Pressable>
//             <ThemeText style={styles.navTitle}>
//               Asked Questions{" "}
//               <Ionicons
//                 name="help-circle"
//                 size={24}
//                 color={theme.iconColorFocused}
//               />
//             </ThemeText>
//           </Pressable>
//         </Link>

//         <Pressable onPress={handleFeedback} style={styles.feedbackBtn}>
//           <ThemeText style={styles.navTitle}>
//             FeedBack{" "}
//             <Ionicons
//               name="chatbubble-ellipses-outline"
//               size={24}
//               color={theme.iconColorFocused}
//             />
//           </ThemeText>
//         </Pressable>

//         <Pressable onPress={toggleTheme}>
//           <ThemeText style={styles.buttonText}>
//             <Ionicons
//               name={theme === colors.dark ? "moon" : "sunny"}
//               size={20}
//               color={theme.iconColorFocused}
//             />{" "}
//             {theme === colors.dark ? "Light " : "Dark "}
//           </ThemeText>
//         </Pressable>
//       </RowItemsTheme>

//       {/* MAIN CONTENT CARD */}
//       <CardTheme style={styles.card}>
//         <Image source={Logo} style={styles.logo} />

//         <ThemeText style={styles.title}>
//           Welcome to your Library
//         </ThemeText>

//         <Spacer height={6} />

//         <ThemeText style={styles.subtitle}>
//           Manage your collection, track reading,{"\n"}
//           and discover new books!
//         </ThemeText>

//         <Spacer height={30} />

//         {/* ROW 1 */}
//         <RowItemsTheme>
//           <Link href="/register" asChild>
//             <Pressable style={styles.button}>
//               <ThemeText style={styles.buttonText}>Register</ThemeText>
//             </Pressable>
//           </Link>

//           <Link href="/login" asChild>
//             <Pressable style={styles.button}>
//               <ThemeText style={styles.buttonText}>Log In</ThemeText>
//             </Pressable>
//           </Link>
//         </RowItemsTheme>

//         <Spacer height={12} />

//         {/* ROW 2 */}
//         <RowItemsTheme>
//           <Pressable
//             style={styles.button}
//             onPress={() => requireAuth("/profile")}
//           >
//             <ThemeText style={styles.buttonText}>
//               View Profile
//             </ThemeText>
//           </Pressable>

//           <Pressable
//             style={styles.button}
//             onPress={() => requireAuth("/book")}
//           >
//             <ThemeText style={styles.buttonText}>
//               My Library
//             </ThemeText>
//           </Pressable>
//         </RowItemsTheme>

//         <Spacer height={12} />

//         {/* ROW 3 (GATED INTERSTITIAL) */}
//         <RowItemsTheme>
//           <Link href="/subscribeScreen" asChild>
//             <Pressable style={styles.button}>
//               <ThemeText style={styles.buttonText}>
//                 Subscribe
//               </ThemeText>
//             </Pressable>
//           </Link>

//           <Pressable
//             style={styles.button}
//             onPress={() => handleGatedNavigation("/timetableScreen")}
//           >
//             <ThemeText style={styles.buttonText}>
//               My TimeTable
//             </ThemeText>
//           </Pressable>
//         </RowItemsTheme>

//         <Spacer height={12} />

//         {/* ROW 4 (GATED INTERSTITIAL) */}
//         <RowItemsTheme>
//           <Pressable
//             style={styles.button}
//             onPress={() => handleGatedNavigation("/offlineBooks")}
//           >
//             <ThemeText style={styles.buttonText}>
//               Offline Library
//             </ThemeText>
//           </Pressable>

//           <Pressable
//             style={styles.button}
//             onPress={() => handleGatedNavigation("/offlineTimetable")}
//           >
//             <ThemeText style={styles.buttonText}>
//               Offline TimeTable
//             </ThemeText>
//           </Pressable>
//         </RowItemsTheme>
//       </CardTheme>

//       <Spacer />

//       <ThemeText style={styles.topText}>
//         Learn how to use this app{" "}
//         <Link href="/appUsage" style={styles.link}>
//           Click
//         </Link>
//       </ThemeText>
//       <Spacer />
//             <BannerAdComponent />
      

//     </ThemeView>
//   );
// };

// export default HomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: "flex-start",
//     alignItems: "center",
//     paddingHorizontal: 16,
//     paddingTop: 40,
//     paddingBottom: 60,
//   },
//   nav: {
//     width: "95%",
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 20,
//   },
//   feedbackBtn: {
//     backgroundColor: "transparent",
//     padding: 8,
//     borderRadius: 8,
//   },
//   navTitle: {
//     fontSize: 12,
//     fontWeight: "600",
//     padding: 10,
//   },
//   card: {
//     width: "100%",
//     padding: 16,
//     borderRadius: 12,
//   },
//   logo: {
//     width: 60,
//     height: 60,
//     alignSelf: "center",
//   },
//   title: {
//     fontSize: 22,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginTop: 10,
//   },
//   subtitle: {
//     fontSize: 14,
//     textAlign: "center",
//     opacity: 0.7,
//   },
//   button: {
//     flex: 1,
//     padding: 12,
//     marginHorizontal: 4,
//     borderRadius: 8,
//     alignItems: "center",
//     backgroundColor: "rgba(0,0,0,0.05)",
//   },
//   buttonText: {
//     fontSize: 14,
//     fontWeight: "500",
//   },
//   topText: {
//     fontSize: 14,
//     textAlign: "center",
//     marginTop: 20,
//   },
//   link: {
//     color: "#007AFF",
//     fontWeight: "bold",
//   },
// });






import { StyleSheet, View, Image, Pressable,Alert } from "react-native";
import ThemeView from "../component/ThemeView";
import ThemeText from "../component/ThemeText";
import Spacer from "../component/Spacer";
import { Link } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Linking from "expo-linking";
import Logo from "../assets/logo.png";
import { colors } from "../constant/colors";
import CardTheme from "../component/CardTheme";
import RowItemsTheme from "../component/RowItemsTheme";
import PressableComponent from "../component/PressableComponent";
import { useAppUpdate } from "../hook/appUpdate.js";
import { useTheme } from "../hook/useTheme.js";
import { useUser } from "../hook/useUser";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";
import NetInfo from "@react-native-community/netinfo"; 
import { BannerAdComponent } from "../component/AdsManager.jsx";


// 🔥 REWARDED INTERSTITIAL SYSTEM IMPORT FIXED
import { useAdGate } from "../hook/useRewardAdsEnabled.js"; 

// 🔒 PRIVACY POLICY POPUP
import PrivacyPolicyModal from "../component/Privacypolicymodal.jsx";

const PRIVACY_ACK_KEY = "hasSeenPrivacyPolicy";

const HomeScreen = () => {
  const { updateChecked } = useAppUpdate();
  const { theme, toggleTheme } = useTheme();
  const { user } = useUser();
  const router = useRouter();

  const { gate } = useAdGate();

  // ── Privacy policy popup state ──────────────────────
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);

  useEffect(() => {
    const checkPrivacyAck = async () => {
      try {
        const seen = await AsyncStorage.getItem(PRIVACY_ACK_KEY);
        if (!seen) {
          setShowPrivacyModal(true);
        }
      } catch (error) {
        // If storage fails, fail safe by not blocking the user
        setShowPrivacyModal(false);
      }
    };

    checkPrivacyAck();
  }, []);

  const handleAcceptPrivacy = async () => {
    setShowPrivacyModal(false);
    try {
      await AsyncStorage.setItem(PRIVACY_ACK_KEY, "true");
    } catch (error) {
      // Non-fatal: user just may see the popup again next launch
    }
  };

  // ── Auth guard ─────────────────────────────────────
  const requireAuth = (route) => {
    router.push(user ? route : "/login");
  };

  // 🔥 NAV GATEWAY FOR THE REWARDED INTERSTITIAL SYSTEM
  const handleGatedNavigation = async (route) => {
    try {
      const state = await NetInfo.fetch();

      // Offline user -> bypass ads safely to avoid layout freezes
      if (!state.isConnected || !state.isInternetReachable) {
        router.push(route);
        return;
      }

      // Online user -> display full screen video instantly!
      gate(() => router.push(route));
    } catch (error) {
      // Safety network or caching fallback
      router.push(route);
    }
  };

  // ── Feedback mailer ────────────────────────────────
  const handleFeedback = () => {
    const email = "ucnodemailler@gmail.com";
    const subject = encodeURIComponent("App Feedback");
    const body = encodeURIComponent(
      "Hello, I would like to provide some feedback:\n"
    );

    const url = `mailto:${email}?subject=${subject}&body=${body}`;

    Linking.canOpenURL(url)
      .then((ok) => {
        if (ok) Linking.openURL(url);
        else alert("Cannot open email client");
      })
      .catch(console.error);
  };

  return (
    <ThemeView style={styles.container} safe={true}>
      {/* 🔒 PRIVACY POLICY POPUP (first-launch) */}
      <PrivacyPolicyModal
        visible={showPrivacyModal}
        onAccept={handleAcceptPrivacy}
      />

      {/* TOP NAV BAR */}
      <RowItemsTheme style={styles.nav}>
        <Link href="/questionsScreen" asChild>
          <Pressable>
            <ThemeText style={styles.navTitle}>
              Asked Questions{" "}
              <Ionicons
                name="help-circle"
                size={24}
                color={theme.iconColorFocused}
              />
            </ThemeText>
          </Pressable>
        </Link>

        <Pressable onPress={handleFeedback} style={styles.feedbackBtn}>
          <ThemeText style={styles.navTitle}>
            FeedBack{" "}
            <Ionicons
              name="chatbubble-ellipses-outline"
              size={24}
              color={theme.iconColorFocused}
            />
          </ThemeText>
        </Pressable>

        <Pressable onPress={toggleTheme}>
          <ThemeText style={styles.buttonText}>
            <Ionicons
              name={theme === colors.dark ? "moon" : "sunny"}
              size={20}
              color={theme.iconColorFocused}
            />{" "}
            {theme === colors.dark ? "Light " : "Dark "}
          </ThemeText>
        </Pressable>
      </RowItemsTheme>

      {/* MAIN CONTENT CARD */}
      <CardTheme style={styles.card}>
        <Image source={Logo} style={styles.logo} />

        <ThemeText style={styles.title}>
          Welcome to your Library
        </ThemeText>

        <Spacer height={6} />

        <ThemeText style={styles.subtitle}>
          Manage your collection, track reading,{"\n"}
          and discover new books!
        </ThemeText>

        <Spacer height={30} />

        {/* ROW 1 */}
        <RowItemsTheme>
          <Link href="/register" asChild>
            <Pressable style={styles.button}>
              <ThemeText style={styles.buttonText}>Register</ThemeText>
            </Pressable>
          </Link>

          <Link href="/login" asChild>
            <Pressable style={styles.button}>
              <ThemeText style={styles.buttonText}>Log In</ThemeText>
            </Pressable>
          </Link>
        </RowItemsTheme>

        <Spacer height={12} />

        {/* ROW 2 */}
        <RowItemsTheme>
          <Pressable
            style={styles.button}
            onPress={() => requireAuth("/profile")}
          >
            <ThemeText style={styles.buttonText}>
              View Profile
            </ThemeText>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => requireAuth("/book")}
          >
            <ThemeText style={styles.buttonText}>
              My Library
            </ThemeText>
          </Pressable>
        </RowItemsTheme>

        <Spacer height={12} />

        {/* ROW 3 (GATED INTERSTITIAL) */}
        <RowItemsTheme>
          <Link href="/subscribeScreen" asChild>
            <Pressable style={styles.button}>
              <ThemeText style={styles.buttonText}>
                Subscribe
              </ThemeText>
            </Pressable>
          </Link>

          <Pressable
            style={styles.button}
            onPress={() => handleGatedNavigation("/timetableScreen")}
          >
            <ThemeText style={styles.buttonText}>
              My TimeTable
            </ThemeText>
          </Pressable>
        </RowItemsTheme>

        <Spacer height={12} />

        {/* ROW 4 (GATED INTERSTITIAL) */}
        <RowItemsTheme>
          <Pressable
            style={styles.button}
            onPress={() => handleGatedNavigation("/offlineBooks")}
          >
            <ThemeText style={styles.buttonText}>
              Offline Library
            </ThemeText>
          </Pressable>

          <Pressable
            style={styles.button}
            onPress={() => handleGatedNavigation("/offlineTimetable")}
          >
            <ThemeText style={styles.buttonText}>
              Offline TimeTable
            </ThemeText>
          </Pressable>
        </RowItemsTheme>
      </CardTheme>

      <Spacer />

      <ThemeText style={styles.topText}>
        Learn how to use this app{" "}
        <Link href="/appUsage" style={styles.link}>
          Click
        </Link>
        {"  |  "}
        <Link href="/Privacypolicyscreen" style={styles.link}>
          Privacy Policy
        </Link>
      </ThemeText>
      <Spacer />
      <BannerAdComponent />
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
    paddingTop: 40,
    paddingBottom: 60,
  },
  nav: {
    width: "95%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  feedbackBtn: {
    backgroundColor: "transparent",
    padding: 8,
    borderRadius: 8,
  },
  navTitle: {
    fontSize: 12,
    fontWeight: "600",
    padding: 10,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 12,
  },
  logo: {
    width: 60,
    height: 60,
    alignSelf: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    opacity: 0.7,
  },
  button: {
    flex: 1,
    padding: 12,
    marginHorizontal: 4,
    borderRadius: 8,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.05)",
  },
  buttonText: {
    fontSize: 14,
    fontWeight: "500",
  },
  topText: {
    fontSize: 14,
    textAlign: "center",
    marginTop: 20,
  },
  link: {
    color: "#007AFF",
    fontWeight: "bold",
  },
});