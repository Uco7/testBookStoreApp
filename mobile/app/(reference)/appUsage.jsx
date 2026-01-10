import { StyleSheet, View, ScrollView } from "react-native";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";
import CardTheme from "../../component/CardTheme";

export default function AppUsage() {
  return (
    <ThemeView style={styles.container} safe={true}>
      <ThemeText style={styles.title}>How to Use This App</ThemeText>
      <ThemeText style={styles.subtitle}>
        A quick guide to get you started
      </ThemeText>

      <Spacer height={20} />

      <ScrollView contentContainerStyle={styles.list}>
        <CardTheme style={styles.card}>
          <ThemeText style={styles.stepTitle}>1. Create an Account</ThemeText>
          <ThemeText style={styles.stepText}>
            Register or log in so your library is saved to your account.
          </ThemeText>
        </CardTheme>

        <CardTheme style={styles.card}>
          <ThemeText style={styles.stepTitle}>2. Add Books</ThemeText>
          <ThemeText style={styles.stepText}>
            Go to "Create Book", choose the type (reading, doc, or link), then
            fill in the details and save.
          </ThemeText>
        </CardTheme>

        <CardTheme style={styles.card}>
          <ThemeText style={styles.stepTitle}>3. Manage Your Library</ThemeText>
          <ThemeText style={styles.stepText}>
            Open "My Library" to CardTheme, update, delete, or open your books.
          </ThemeText>
        </CardTheme>

        <CardTheme style={styles.card}>
          <ThemeText style={styles.stepTitle}>4. Upload or Link Files</ThemeText>
          <ThemeText style={styles.stepText}>
            Upload PDFs, docs, or paste file links depending on your needs.
          </ThemeText>
        </CardTheme>

        <CardTheme style={styles.card}>
          <ThemeText style={styles.stepTitle}>5. Edit or Delete Books</ThemeText>
          <ThemeText style={styles.stepText}>
            Use the edit and delete icons on each book card to manage your
            collection.
          </ThemeText>
        </CardTheme>

        <CardTheme style={styles.card}>
          <ThemeText style={styles.stepTitle}>6. Get Help or Send Feedback</ThemeText>
          <ThemeText style={styles.stepText}>
            Use the Help or Feedback options in the navigation if you need
            assistance or want to contact support.
          </ThemeText>
        </CardTheme>
      </ScrollView>
    </ThemeView>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    marginTop: 10,
  },
  subtitle: {
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
  list: {
    width: "100%",
    paddingBottom: 40,
  },
  card: {
    width: "100%",
    padding: 16,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.15)",
    marginBottom: 12,
  },
  stepTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  stepText: {
    fontSize: 13,
    opacity: 0.8,
  },
});
