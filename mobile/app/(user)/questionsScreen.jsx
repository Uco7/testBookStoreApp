import { StyleSheet, View, ScrollView } from "react-native";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";

const QUESTIONS = [
  {
    q: "How do I add a new book?",
    a: "Go to 'Create Book', choose the type, fill the details and save.",
  },
  {
    q: "Can I upload PDF or documents?",
    a: "Yes. Choose 'Doc' or 'Reading Book' and upload your file.",
  },
  {
    q: "Can I add a link instead of a file?",
    a: "Yes. Choose 'File/Doc Link' and paste the URL.",
  },
  {
    q: "How do I edit a book?",
    a: "Open your Library, tap the edit icon on the book you want to change.",
  },
  {
    q: "How do I delete a book?",
    a: "Tap the trash icon on the book card to delete it.",
  },
];

export default function QuestionsScreen() {
  return (
    <ThemeView style={styles.container} safe>
      <ThemeText style={styles.title}>Help & Questions</ThemeText>
      <ThemeText style={styles.subtitle}>
        Common questions about using the app
      </ThemeText>

      <Spacer height={20} />

      <ScrollView contentContainerStyle={styles.list}>
        {QUESTIONS.map((item, index) => (
          <View key={index} style={styles.card}>
            <ThemeText style={styles.question}>{item.q}</ThemeText>
            <Spacer height={6} />
            <ThemeText style={styles.answer}>{item.a}</ThemeText>
          </View>
        ))}
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
  question: {
    fontSize: 15,
    fontWeight: "600",
  },
  answer: {
    fontSize: 13,
    opacity: 0.8,
  },
});
