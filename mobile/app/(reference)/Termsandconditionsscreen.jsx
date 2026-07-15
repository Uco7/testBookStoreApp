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

const TermsAndConditionsScreen = () => {
  const router = useRouter();
  const { theme } = useTheme();

  return (
    <ThemeView style={styles.container} safe={true}>
      <RowItemsTheme style={styles.nav}>
        <ThemeText style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color={theme.iconColorFocused} />
          {"  "}Back
        </ThemeText>
      </RowItemsTheme>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ThemeText style={styles.title}>Terms & Conditions</ThemeText>
        <ThemeText style={styles.updated}>Last updated: {LAST_UPDATED}</ThemeText>

        <Spacer height={20} />

        <Section title="1. Acceptance of Terms">
          By creating an account or using this app, you agree to be bound
          by these Terms & Conditions. If you do not agree, please do not
          register for or use the app.
        </Section>

        <Section title="2. Eligibility">
          You must be able to form a binding contract to use this app. If
          you are using the app on behalf of a minor, you confirm you have
          the authority and consent required to do so.
        </Section>

        <Section title="3. Your Account">
          You are responsible for maintaining the confidentiality of your
          username and password, and for all activity that occurs under
          your account. Notify us immediately if you suspect unauthorized
          access to your account.
        </Section>

        <Section title="4. Acceptable Use">
          You agree not to misuse the app, including attempting to
          disrupt its functionality, uploading unlawful or infringing
          content, or using the app to harass, defraud, or harm others.
        </Section>

        <Section title="5. Content & Library">
          BookStoreApp provides access to educational resources and allows users to save books, 
          create timetables, and manage personal study content.
           Users are responsible for any content they upload, save, or share through the app.
        </Section>

        <Section title="6. Subscriptions & Ads">
          Premium features are available through paid subscriptions processed securely by Paystack. 
          Free users may be required to view rewarded advertisements to access certain features.
           Subscription pricing, billing terms, and renewal information are displayed before purchase.
        </Section>

        <Section title="7. Intellectual Property">
          The BookStoreApp software, source code, user interface, and original content
           created for the app are protected by applicable intellectual property laws. Except
            where otherwise stated, you may not copy, modify, distribute, or
           reverse engineer any part of the app without prior permission.
        </Section>

        <Section title="8. Termination">
          We may suspend or terminate your access to the app if you
          violate these Terms & Conditions or engage in behavior that
          harms the app, other users, or us.
        </Section>

        <Section title="9. Disclaimer & Limitation of Liability">
          The app is provided "as is" without warranties of any kind. To
          the fullest extent permitted by law, we are not liable for any
          indirect, incidental, or consequential damages arising from
          your use of the app.
        </Section>

        <Section title="10. Changes to These Terms">
          We may update these Terms & Conditions from time to time.
          Continued use of the app after changes take effect means you
          accept the revised terms. Material changes will be reflected by
          an updated "Last updated" date above.
        </Section>
        <Section title="11. Governing Law">
          These Terms & Conditions shall be governed and interpreted in
           accordance with the laws applicable in Nigeria, without regard to conflict of law principles.
        </Section>

        <Section title="12. Contact Us">
          If you have questions about these Terms & Conditions, please
          contact us at ucnodemailler@gmail.com.
        </Section>

        <Spacer height={40} />
      </ScrollView>
    </ThemeView>
  );
};

export default TermsAndConditionsScreen;

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