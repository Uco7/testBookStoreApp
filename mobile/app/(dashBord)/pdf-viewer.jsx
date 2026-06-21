



import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Pdf from "react-native-pdf";
import { BannerAdComponent } from "../../component/AdsManager";

export default function PdfViewer() {
  const { url, title } = useLocalSearchParams();

  if (!url) {
    return (
      <View style={styles.center}>
        <Text>No file provided</Text>
      </View>
    );
  }

  const source = {
    uri: url,
    cache: true,
  };

  return (
    <View style={styles.container}>
      <Pdf
        source={source}
        style={styles.pdf}
        onError={(err) => console.log("PDF ERROR:", err)}
      />
      <View style={styles.bannerContainer}>

      <BannerAdComponent  />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },
  pdf: {
    flex: 1,
    width: Dimensions.get("window").width,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bannerContainer: {
  position: "absolute",
  bottom: 0,
  left: 0,
  right: 0,
  alignItems: "center",
  justifyContent: "center",
  paddingBottom: 5,

  // optional styling
  backgroundColor: "transparent",
},
});