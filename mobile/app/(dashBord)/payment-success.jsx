import React, { useEffect, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";

import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import { useUser } from "../../hook/useUser";
import { useSubscription } from "../../hook/Usesubscription";

export default function PaymentSuccessScreen() {
  const router = useRouter();
  const { fetchUser } = useUser();
  const { verifyPayment } = useSubscription();

  const { reference } = useLocalSearchParams();

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    handleVerify();
  }, []);

  const handleVerify = async () => {
    try {
      const data = await verifyPayment(reference);

      if (data?.success) {
        await fetchUser?.();

        Alert.alert(
          "Subscription Activated 🎉",
          "Your premium account is now active.",
          [
            {
              text: "Continue",
              onPress: () => router.replace("/(tabs)"),
            },
          ]
        );
      } else {
        Alert.alert("Verification Failed");
      }
    } catch (err) {
      Alert.alert(
        "Payment Verification Failed",
        err.message || "Please contact support."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <ThemeView
      safe
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {loading ? (
        <>
          <ActivityIndicator size="large" />
          <ThemeText style={{ marginTop: 15 }}>
            Verifying payment...
          </ThemeText>
        </>
      ) : (
        <ThemeText>Done</ThemeText>
      )}
    </ThemeView>
  );
}