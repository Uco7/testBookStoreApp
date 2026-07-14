import React from "react";
import { StyleSheet, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import Spacer from "../../component/Spacer";
import RowItemsTheme from "../../component/RowItemsTheme";
import { useTheme } from "../../hook/useTheme.js";

const LAST_UPDATED = "July 13, 2026";

const Section = ({ title, children }) => (
  <>
    <ThemeText style={styles.sectionTitle}>{title}</ThemeText>
    <Spacer height={6} />
    <ThemeText style={styles.paragraph}>{children}</ThemeText>
    <Spacer height={18} />
  </>
);

const PrivacyPolicyScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <ThemeView style={styles.container} safe={true}>
      <RowItemsTheme style={styles.nav}>
        <ThemeText
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={22} color={theme.iconColorFocused} />
          {"  "}Back
        </ThemeText>
      </RowItemsTheme>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemeText style={styles.title}>Privacy Policy</ThemeText>
        <ThemeText style={styles.updated}>Last updated: {LAST_UPDATED}</ThemeText>

        <Spacer height={20} />

        <Section title="1. Introduction">
          This Privacy Policy explains how we collect, use, and protect
          your information when you use this app. By using the app, you
          agree to the practices described below.
        </Section>

        <Section title="2. Information We Collect">
          We may collect account information (such as your name and email
          address when you register or log in), content you add to your
          library or timetable, and usage data such as app interactions and
          crash reports that help us improve performance and reliability.
        </Section>

        <Section title="3. How We Use Your Information">
          We use the information we collect to provide core app features
          (such as your library, timetable, and profile), to maintain and
          improve the app, to communicate with you about updates or
          support, and to display relevant, non-personalized ads through
          our advertising partners.
        </Section>

        <Section title="4. Advertising">
          This app displays banner and rewarded video ads through
          third-party ad networks. These networks may collect device
          identifiers and usage data to serve and measure ads. You can
          typically manage ad personalization through your device
          settings.
        </Section>

        <Section title="5. Data Sharing">
          We do not sell your personal information. We may share limited
          data with service providers (such as hosting, analytics, and
          advertising partners) solely to operate and improve the app, and
          only to the extent necessary for them to perform their services.
        </Section>

        <Section title="6. Data Storage & Security">
          Your data is stored securely using industry-standard practices.
          While we take reasonable steps to protect your information, no
          method of transmission or storage is 100% secure, and we cannot
          guarantee absolute security.
        </Section>

        <Section title="7. Your Choices">
          You can review, update, or delete your account information at
          any time from your profile. You may also use offline features of
          the app without an account, in which case less data is
          collected.
        </Section>

        <Section title="8. Children's Privacy">
          This app is not directed at children under 13, and we do not
          knowingly collect personal information from children under 13.
          If you believe a child has provided us with personal
          information, please contact us so we can remove it.
        </Section>

        <Section title="9. Changes to This Policy">
          We may update this Privacy Policy from time to time. Changes
          will be reflected by an updated "Last updated" date at the top
          of this page. Continued use of the app after changes means you
          accept the revised policy.
        </Section>

        <Section title="10. Contact Us">
          If you have questions about this Privacy Policy or how your data
          is handled, please reach out to us at
          ucnodemailler@gmail.com.
        </Section>

        <Spacer height={40} />
      </ScrollView>
    </ThemeView>
  );
};

export default PrivacyPolicyScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  nav: {
    marginBottom: 10,
  },
  backButton: {
    fontSize: 15,
    fontWeight: "600",
    paddingVertical: 6,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  updated: {
    fontSize: 13,
    opacity: 0.6,
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
  },
  paragraph: {
    fontSize: 14,
    lineHeight: 21,
    opacity: 0.85,
  },
});