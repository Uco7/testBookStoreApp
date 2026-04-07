import React from "react";
import { View, StyleSheet, Image, Dimensions, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";
import Pdf from "react-native-pdf";

export default function ViewFile() {
  const { url, title } = useLocalSearchParams();

  const isPdf = url?.toLowerCase().endsWith(".pdf");

  return (
    <View style={styles.container}>
      {isPdf ? (
        <Pdf
          source={{ uri: url, cache: true }}
          style={styles.content}
          onError={(err) => console.log("PDF error:", err)}
        />
      ) : url?.match(/\.(jpg|jpeg|png|gif)$/i) ? (
        <Image
          source={{ uri: url }}
          style={styles.content}
          resizeMode="contain"
        />
      ) : (
        <View style={styles.fallback}>
          <Text style={{ color: "white" }}>Preview not supported</Text>
          <Text style={{ color: "gray" }}>{url}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#000" },

  content: {
    flex: 1,
    width: Dimensions.get("window").width,
  },

  fallback: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});