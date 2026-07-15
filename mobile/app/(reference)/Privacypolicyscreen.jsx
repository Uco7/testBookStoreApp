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

        <Section title="3. Information We Collect">
          We may collect account information (such as your name and email
          address when you register or log in), content you add to your
          library or timetable, and usage data such as app interactions and
          crash reports that help us improve performance and reliability.
        </Section>

        <Section title="3. How We Use Your Information">
          We use your information to:

            Create and manage your account,
            Authenticate your identity,
            Sync your library and timetable,
            Process your subscriptions,
            Improve app performance,
            Fix bugs and technical issues,
            Respond to customer support requests,
            Display advertisements to free users,
            Protect the security of the app and its users,
        </Section>

        <Section title="4. Advertising">
          BookStoreApp uses Google AdMob to display banner advertisements and rewarded advertisements.

        Google and its partners may collect certain device 
        information, including advertising identifiers and diagnostic
        information, to deliver, measure, and improve advertisements.

        You can learn more about Google's privacy practices by visiting the Google Privacy Policy.
          
        </Section>

        <Section title="5. Payments">
          BookStoreApp offers premium subscriptions.

        Payments are securely processed through Paystack.

        We do not collect or store your debit card, credit card, or banking information. 
        Payment information is processed directly by Paystack 
        according to its own privacy and security policies
        </Section>
        <Section title="6. Data Sharing">
          We do not sell your personal information.

          We may share information only with trusted service providers that help operate the app, including:

          Google AdMob (advertising)
          Paystack (payment processing)
          MongoDB Atlas (database hosting)
          Render (backend hosting)

These providers receive only the information necessary to perform their services.
        </Section>

        <Section title="7. Data Storage & Security">
          Your data is stored securely using industry-standard practices.
          While we take reasonable steps to protect your information, no
          method of transmission or storage is 100% secure, and we cannot
          guarantee absolute security.
        </Section>

        <Section title="8.Data Retention">
          We retain your information only for as long as necessary to provide 
          the services, comply with legal obligations,
           resolve disputes, and enforce our agreements.

If you delete your account, we will remove or anonymise your personal information unless we are required by law to retain certain records.
        </Section>

        <Section title="9.Your Rights">
           

        Depending on applicable laws, you may have the right to:

        Access your personal information
        Correct inaccurate information
        Delete your account and personal data
        Contact us with privacy-related questions
        </Section>

        <Section title="10. Children's Privacy">
          This app is not directed at children under 13, and we do not
          knowingly collect personal information from children under 13.
          If you believe a child has provided us with personal
          information, please contact us so we can remove it.
        </Section>



        <Section title="11. Third-Party Services">
          This app uses third-party services that have their own privacy policies, including:

  Google AdMob, Paystack, MongoDB Atlas, Render
  
Your use of those services is also subject to their respective privacy policies.

           </Section>
          
        <Section title="12. Changes to This Policy">
         We may update this Privacy Policy from time to time.

Any changes will become effective immediately after the
 updated version is published within the app 
or on our website. The "Last updated" date will always indicate the latest revision.
        </Section>
        <Section title="13. Contact Us">
          If you have any questions about this Privacy Policy
           or our handling of personal information,
           please contact us at:

         Email:bookstore.feedback.email@gmail.com
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