import { useEffect } from "react";
import { useRouter } from "expo-router";
import { useUser } from "../../hook/useUser";
import { ActivityIndicator, View } from "react-native";

export default function ProtectedRoute({ children }) {
  const { user, authReady } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!authReady) return;

    if (!user) {
      router.replace("/login");
    }
  }, [user, authReady]);

  if (!authReady) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4f46e5" />
      </View>
    );
  }

  if (!user) return null;

  return children;

}


// import { useEffect, useState } from "react";
// import NetInfo from "@react-native-community/netinfo";
// import { useRouter } from "expo-router";
// import { useUser } from "../../hook/useUser";
// import { ActivityIndicator, View } from "react-native";

// export default function ProtectedRoute({ children }) {
//   const { user, authReady } = useUser();
//   const router = useRouter();
//   const [isOffline, setIsOffline] = useState(false);

//   useEffect(() => {
//     const unsub = NetInfo.addEventListener(state => {
//       setIsOffline(!state.isConnected);
//     });

//     return () => unsub();
//   }, []);

//   useEffect(() => {
//     if (!authReady) return;

//     // ONLY redirect when:
//     // - NO user AND ONLINE
//     if (!user && !isOffline) {
//       router.replace("/login");
//     }
//   }, [user, authReady, isOffline]);

//   if (!authReady) {
//     return (
//       <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
//         <ActivityIndicator size="large" color="#4f46e5" />
//       </View>
//     );
//   }

//   // OFFLINE MODE → allow cached usage
//   if (isOffline) {
//     return children;
//   }

//   if (!user) return null;

//   return children;
// }