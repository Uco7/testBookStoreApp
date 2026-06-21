/**
 * SubscribeScreen.jsx
 *
 * Clean subscription form — collects plan + card details and
 * sends everything to the backend. No Paystack SDK involved.
 *
 * Backend endpoint:
 *   POST /api/subscription/initiate
 *   Body: { plan, fullName, email, cardNumber, expiry, cvv }
 *   → backend initiates Paystack charge and returns { authorizationUrl } or { success }
 */

import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  TextInput,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";


import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import CardTheme from "../../component/CardTheme";
import Spacer from "../../component/Spacer";
import { colors } from "../../constant/colors";
import { useUser } from "../../hook/useUser";
import { useSubscription } from "../../hook/Usesubscription";
import { backendUrl_ngrok,backendDomainUrl } from "../../utils/config/appUrl";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIG
// ─────────────────────────────────────────────────────────────────────────────
const APP_URL  = backendUrl_ngrok
const USD_RATE = 1600;

const PLANS = {
  monthly: {
    id:          "monthly",
    label:       "Monthly",
    naira:       200,
    get dollar() { return (this.naira / USD_RATE).toFixed(2); },
    period:      "per month",
    badge:       null,
    color:       colors.primary || "#6366f1",
    icon:        "calendar-outline",
    description: "Billed every month · Cancel anytime",
  },
  yearly: {
    id:          "yearly",
    label:       "Yearly",
    naira:       15000,
    get dollar() { return (this.naira / USD_RATE).toFixed(2); },
    period:      "per year",
    badge:       "2 months FREE",
    color:       "#059669",
    icon:        "ribbon-outline",
    description: "Best value — save ₦3,000 vs monthly",
  },
};

const FEATURES = [
  { icon: "alarm-outline",         text: "Premium alarm alerts"           },
  { icon: "ban-outline",           text: "Ad-free experience"             },
  { icon: "diamond-outline",       text: "Unlimited premium timetables"   },
  { icon: "cloud-offline-outline", text: "Full offline access"            },
];

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const formatCardNumber = (val) =>
  val.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

const formatExpiry = (val) => {
  const digits = val.replace(/\D/g, "").slice(0, 4);
  if (digits.length >= 3) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return digits;
};

// ─────────────────────────────────────────────────────────────────────────────
// PLAN SELECTOR
// ─────────────────────────────────────────────────────────────────────────────
const PlanCard = ({ plan, selected, onSelect }) => {
  const isSelected = selected === plan.id;
  return (
    <Pressable onPress={() => onSelect(plan.id)} style={{ flex: 1 }}>
      <View style={[
        styles.planCard,
        isSelected && { borderColor: plan.color, borderWidth: 2, backgroundColor: plan.color + "08" },
      ]}>
        {plan.badge && (
          <View style={[styles.planBadge, { backgroundColor: plan.color }]}>
            <ThemeText style={styles.planBadgeText}>{plan.badge}</ThemeText>
          </View>
        )}

        <Ionicons name={plan.icon} size={22} color={plan.color} style={{ marginBottom: 6 }} />

        <ThemeText style={[styles.planName, { color: plan.color }]}>{plan.label}</ThemeText>

        <View style={styles.planPriceRow}>
          <ThemeText style={styles.planNaira}>₦{plan.naira.toLocaleString()}</ThemeText>
        </View>
        <ThemeText style={styles.planDollar}>≈ ${plan.dollar}</ThemeText>
        <ThemeText style={styles.planPeriod}>{plan.period}</ThemeText>
        <ThemeText style={styles.planDesc}>{plan.description}</ThemeText>

        {/* Radio */}
        <View style={[styles.radio, isSelected && { borderColor: plan.color }]}>
          {isSelected && <View style={[styles.radioDot, { backgroundColor: plan.color }]} />}
        </View>
      </View>
    </Pressable>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// INPUT FIELD
// ─────────────────────────────────────────────────────────────────────────────
const Field = ({
  label, value, onChangeText, placeholder,
  keyboardType = "default", maxLength,
  secureTextEntry, icon, error, hint,
}) => (
  <View style={styles.fieldWrap}>
    <ThemeText style={styles.fieldLabel}>{label}</ThemeText>
    <View style={[styles.fieldRow, error && styles.fieldRowError]}>
      {icon && <Ionicons name={icon} size={18} color="#9ca3af" style={styles.fieldIcon} />}
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#9ca3af"
        keyboardType={keyboardType}
        maxLength={maxLength}
        secureTextEntry={secureTextEntry}
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
    {error  && <ThemeText style={styles.fieldError}>{error}</ThemeText>}
    {hint   && !error && <ThemeText style={styles.fieldHint}>{hint}</ThemeText>}
  </View>
);

// ─────────────────────────────────────────────────────────────────────────────
// ALREADY PREMIUM
// ─────────────────────────────────────────────────────────────────────────────
const AlreadyPremium = ({ user, onBack }) => {
  const expiry = user?.premium?.premiumPlan === "lifetime"
    ? "Lifetime"
    : user?.premium?.premiumExpiresAt
    ? new Date(user.premium.premiumExpiresAt).toLocaleDateString("en-GB", {
        day: "2-digit", month: "long", year: "numeric",
      })
    : null;

  return (
    <View style={styles.alreadyWrap}>
      <View style={styles.alreadyIcon}>
        <Ionicons name="diamond" size={52} color="#059669" />
      </View>
      <ThemeText style={styles.alreadyTitle}>You're Premium!</ThemeText>
      <ThemeText style={styles.alreadySub}>
        Your subscription is active{expiry ? ` until ${expiry}` : ""}.{"\n"}
        Enjoy unlimited access to all features.
      </ThemeText>
      <Pressable onPress={onBack} style={styles.alreadyBtn}>
        <ThemeText style={styles.alreadyBtnText}>Go back</ThemeText>
      </Pressable>
    </View>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
const SubscribeScreen = () => {
  const router              = useRouter();
  const { user, fetchUser } = useUser();
const {
  initiateSubscription,
  verifyPayment,
  fetchTransactions,
  subscribing,
} = useSubscription();
  // Plan
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  // Form fields
  const [fullName,    setFullName]    = useState(user?.fullName || "");
  const [email,       setEmail]       = useState(user?.email   || "");
  const [phone,       setPhone]       = useState("");

  // Submission
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState({});
  const [submitted, setSubmitted] = useState(false);

  // ── Premium check ──────────────────────────────────────────────────────────
  const isPremium = useMemo(() => {
    if (!user?.premium) return false;
    const now = new Date();
    const p   = user.premium;
    if (p.isPremium && p.premiumPlan === "lifetime") return true;
    if (p.isPremium && p.premiumExpiresAt && new Date(p.premiumExpiresAt) > now) return true;
    if (p.trialExpiresAt && new Date(p.trialExpiresAt) > now) return true;
    return false;
  }, [user]);

  const plan = PLANS[selectedPlan];

  // ── Validation ─────────────────────────────────────────────────────────────
  const validate = () => {
    const e = {};
    if (!fullName.trim())          e.fullName = "Full name is required";
    if (!email.trim())             e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = "Enter a valid email";
    if (!phone.trim())             e.phone    = "Phone number is required";
    else if (phone.replace(/\D/g,"").length < 10) e.phone = "Enter a valid phone number";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit ─────────────────────────────────────────────────────────────────


  // const handleSubmit = async () => {
  //   if (!user) {
  //     Alert.alert("Login required", "Please log in to subscribe.", [
  //       { text: "Log in", onPress: () => router.push("/login") },
  //       { text: "Cancel", style: "cancel" },
  //     ]);
  //     return;
  //   }

  //   if (!validate()) return;

  //   try {
  //     setLoading(true);
  //     const token = await AsyncStorage.getItem("token");

  //     const res = await axios.post(
  //       `${APP_URL}/api/subscription/initiate`,
  //       {
  //         plan:     selectedPlan,
  //         fullName: fullName.trim(),
  //         email:    email.trim(),
  //         phone:    phone.trim(),
  //         amount:   plan.naira,
  //       },
  //       { headers: { Authorization: `Bearer ${token}` } }
  //     );

  //     // Backend can return an authorization URL (Paystack redirect)
  //     // or a success flag if using server-to-server charging
  //     if (res.data?.authorizationUrl) {
  //       // If backend returns a Paystack checkout URL, open it in browser
  //       const { Linking } = require("react-native");
  //       await Linking.openURL(res.data.authorizationUrl);
  //     }

  //     setSubmitted(true);
  //     if (fetchUser) await fetchUser();

  //   } catch (err) {
  //     console.log("Subscribe error:", err?.response?.data || err.message);
  //     Alert.alert(
  //       "Something went wrong",
  //       err?.response?.data?.message || "Please try again or contact support."
  //     );
  //   } finally {
  //     setLoading(false);
  //   }
  // };


  const handleSubmit = async () => {
  if (!user) {
    Alert.alert("Login required", "Please log in to subscribe.", [
      {
        text: "Log in",
        onPress: () => router.push("/login"),
      },
      {
        text: "Cancel",
        style: "cancel",
      },
    ]);
    return;
  }

  if (!validate()) return;

  try {
    const data = await initiateSubscription({
      plan: selectedPlan,
      fullName: fullName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      amount: plan.naira,
    });

    if (data?.authorizationUrl) {
      const { Linking } = require("react-native");
      await Linking.openURL(data.authorizationUrl);
    }

    setSubmitted(true);

    if (fetchUser) {
      await fetchUser();
    }
  } catch (error) {
    Alert.alert(
      "Something went wrong",
      error.message || "Please try again."
    );
  }
};

  // ── Success state ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <ThemeView safe style={styles.screen}>
        <View style={styles.successWrap}>
          <View style={styles.successIcon}>
            <Ionicons name="checkmark-circle" size={64} color="#059669" />
          </View>
          <ThemeText style={styles.successTitle}>Request received!</ThemeText>
          <ThemeText style={styles.successSub}>
            Your subscription request has been sent.{"\n"}
            You'll receive a confirmation shortly.{"\n"}
            Check your email at{" "}
            <ThemeText style={{ fontWeight: "700" }}>{email}</ThemeText>.
          </ThemeText>
          <Pressable onPress={() => router.back()} style={styles.successBtn}>
            <ThemeText style={styles.successBtnText}>Back to home</ThemeText>
          </Pressable>
        </View>
      </ThemeView>
    );
  }

  // ── Main render ────────────────────────────────────────────────────────────
  return (
    <ThemeView safe style={styles.screen}>

      {/* HEADER */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={colors.primary || "#6366f1"} />
        </Pressable>
        <ThemeText style={styles.headerTitle}>Go Premium</ThemeText>
        <View style={{ width: 32 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >

          {/* ALREADY PREMIUM */}
          {isPremium ? (
            <AlreadyPremium user={user} onBack={() => router.back()} />
          ) : (
            <>
              {/* HERO */}
              <View style={styles.hero}>
                <View style={styles.heroIconWrap}>
                  <Ionicons name="diamond" size={40} color="#059669" />
                </View>
                <ThemeText style={styles.heroTitle}>Unlock everything</ThemeText>
                <ThemeText style={styles.heroSub}>
                  Ad-free · Premium alarms · Unlimited timetables · Full offline access
                </ThemeText>
              </View>

              {/* MINI FEATURES */}
              <View style={styles.featuresRow}>
                {FEATURES.map((f, i) => (
                  <View key={i} style={styles.featureChip}>
                    <Ionicons name={f.icon} size={14} color="#059669" />
                    <ThemeText style={styles.featureChipText}>{f.text}</ThemeText>
                  </View>
                ))}
              </View>

              <Spacer height={24} />

              {/* PLAN SELECTOR */}
              <ThemeText style={styles.sectionLabel}>Choose your plan</ThemeText>
              <Spacer height={10} />
              <View style={styles.planRow}>
                {Object.values(PLANS).map((p) => (
                  <PlanCard
                    key={p.id}
                    plan={p}
                    selected={selectedPlan}
                    onSelect={setSelectedPlan}
                  />
                ))}
              </View>

              <Spacer height={28} />

              {/* PERSONAL DETAILS FORM */}
              <CardTheme style={styles.formCard}>
                <View style={styles.formTitleRow}>
                  <Ionicons name="person-circle-outline" size={20} color={colors.primary || "#6366f1"} />
                  <ThemeText style={styles.formTitle}>Your Details</ThemeText>
                </View>

                <Spacer height={16} />

                <Field
                  label="Full Name"
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="John Doe"
                  icon="person-outline"
                  error={errors.fullName}
                />

                <Spacer height={14} />

                <Field
                  label="Email Address"
                  value={email}
                  onChangeText={setEmail}
                  placeholder="you@example.com"
                  keyboardType="email-address"
                  icon="mail-outline"
                  error={errors.email}
                  hint="Payment confirmation will be sent here"
                />

                <Spacer height={14} />

                <Field
                  label="Phone Number"
                  value={phone}
                  onChangeText={setPhone}
                  placeholder="+234 800 000 0000"
                  keyboardType="phone-pad"
                  icon="call-outline"
                  error={errors.phone}
                  hint="Used to verify your payment"
                />
              </CardTheme>

              <Spacer height={20} />

              {/* ORDER SUMMARY */}
              <CardTheme style={styles.summaryCard}>
                <ThemeText style={styles.sectionLabel}>Order Summary</ThemeText>
                <Spacer height={12} />

                <View style={styles.summaryRow}>
                  <ThemeText style={styles.summaryKey}>Plan</ThemeText>
                  <ThemeText style={styles.summaryVal}>{plan.label}</ThemeText>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <ThemeText style={styles.summaryKey}>Amount</ThemeText>
                  <View style={{ alignItems: "flex-end" }}>
                    <ThemeText style={styles.summaryAmount}>
                      ₦{plan.naira.toLocaleString()}
                    </ThemeText>
                    <ThemeText style={styles.summaryDollar}>≈ ${plan.dollar}</ThemeText>
                  </View>
                </View>
                <View style={styles.summaryDivider} />

                <View style={styles.summaryRow}>
                  <ThemeText style={styles.summaryKey}>Billing</ThemeText>
                  <ThemeText style={styles.summaryVal}>{plan.period}</ThemeText>
                </View>

                {selectedPlan === "yearly" && (
                  <>
                    <View style={styles.summaryDivider} />
                    <View style={styles.summaryRow}>
                      <ThemeText style={styles.summaryKey}>Savings</ThemeText>
                      <ThemeText style={[styles.summaryVal, { color: "#059669", fontWeight: "700" }]}>
                        ₦3,000 (2 months free)
                      </ThemeText>
                    </View>
                  </>
                )}
              </CardTheme>

              <Spacer height={24} />

              {/* SUBMIT BUTTON */}
              <Pressable
                style={[styles.submitBtn, { backgroundColor: plan.color }, loading && { opacity: 0.7 }]}
                onPress={handleSubmit}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <View style={styles.submitRow}>
                    <Ionicons name="lock-closed-outline" size={18} color="#fff" />
                    <ThemeText style={styles.submitText}>
                      Subscribe — ₦{plan.naira.toLocaleString()} {plan.period}
                    </ThemeText>
                  </View>
                )}
              </Pressable>

              <Spacer height={12} />

              {/* SECURE BADGE */}
              <View style={styles.secureBadge}>
                <Ionicons name="shield-checkmark-outline" size={14} color="#9ca3af" />
                <ThemeText style={styles.secureText}>
                  Secure · Powered by Paystack · Cancel anytime
                </ThemeText>
              </View>

              <Spacer height={40} />
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </ThemeView>
  );
};

export default SubscribeScreen;

// ─────────────────────────────────────────────────────────────────────────────
// STYLES
// ─────────────────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  screen: { flex: 1 },

  header: {
    flexDirection:     "row",
    alignItems:        "center",
    justifyContent:    "space-between",
    paddingHorizontal: 16,
    paddingVertical:   12,
  },
  backBtn:     { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: "700" },

  scroll: {
    paddingHorizontal: 16,
    paddingBottom:     40,
  },

  // Hero
  hero: { alignItems: "center", paddingTop: 8, paddingBottom: 4 },
  heroIconWrap: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: "#d1fae5",
    alignItems: "center", justifyContent: "center",
    marginBottom: 14,
  },
  heroTitle: {
    fontSize: 22, fontWeight: "800",
    textAlign: "center", letterSpacing: -0.3, marginBottom: 6,
  },
  heroSub: {
    fontSize: 13, opacity: 0.5,
    textAlign: "center", lineHeight: 20,
  },

  // Mini features
  featuresRow: {
    flexDirection: "row", flexWrap: "wrap",
    gap: 8, marginTop: 14,
  },
  featureChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    backgroundColor: "#d1fae518",
    borderWidth: 1, borderColor: "#059669",
    borderRadius: 20,
    paddingHorizontal: 10, paddingVertical: 5,
  },
  featureChipText: { fontSize: 11, color: "#059669", fontWeight: "600" },

  // Section label
  sectionLabel: {
    fontSize: 11, fontWeight: "700",
    letterSpacing: 0.8, textTransform: "uppercase", opacity: 0.4,
  },

  // Plan cards — side by side
  planRow: { flexDirection: "row", gap: 10 },
  planCard: {
    flex: 1, borderRadius: 16,
    borderWidth: 1.5, borderColor: "rgba(0,0,0,0.08)",
    padding: 14, alignItems: "center",
    overflow: "visible", position: "relative",
  },
  planBadge: {
    position: "absolute", top: -10, right: 8,
    paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 20,
  },
  planBadgeText: { fontSize: 9, fontWeight: "700", color: "#fff", letterSpacing: 0.3 },
  planName:      { fontSize: 15, fontWeight: "700", marginBottom: 4 },
  planPriceRow:  { flexDirection: "row", alignItems: "baseline" },
  planNaira:     { fontSize: 20, fontWeight: "800" },
  planDollar:    { fontSize: 11, opacity: 0.4, marginTop: 1 },
  planPeriod:    { fontSize: 11, opacity: 0.4, marginTop: 2 },
  planDesc:      { fontSize: 10, opacity: 0.35, textAlign: "center", marginTop: 4, lineHeight: 14 },
  radio: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: "#d1d5db",
    alignItems: "center", justifyContent: "center",
    marginTop: 10,
  },
  radioDot: { width: 10, height: 10, borderRadius: 5 },

  // Form card
  formCard: { padding: 16, borderRadius: 16 },
  formTitleRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  formTitle:    { fontSize: 15, fontWeight: "700" },

  // Fields
  fieldWrap:  { width: "100%" },
  fieldLabel: { fontSize: 12, fontWeight: "600", opacity: 0.6, marginBottom: 6 },
  fieldRow: {
    flexDirection: "row", alignItems: "center",
    borderWidth: 1.5, borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 12, paddingHorizontal: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
  },
  fieldRowError: { borderColor: "#dc2626" },
  fieldIcon:  { marginRight: 8 },
  fieldInput: {
    flex: 1, height: 48,
    fontSize: 14, color: "#111827",
  },
  fieldError: { fontSize: 11, color: "#dc2626", marginTop: 4 },
  fieldHint:  { fontSize: 11, opacity: 0.4, marginTop: 4 },

  // Summary
  summaryCard:    { padding: 16, borderRadius: 16 },
  summaryRow:     { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10 },
  summaryDivider: { height: 1, backgroundColor: "rgba(0,0,0,0.05)" },
  summaryKey:     { fontSize: 13, opacity: 0.5 },
  summaryVal:     { fontSize: 13, fontWeight: "600" },
  summaryAmount:  { fontSize: 18, fontWeight: "800", textAlign: "right" },
  summaryDollar:  { fontSize: 11, opacity: 0.4, textAlign: "right", marginTop: 1 },

  // Submit
  submitBtn: {
    width: "100%", paddingVertical: 16,
    borderRadius: 14, alignItems: "center",
  },
  submitRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  submitText: { color: "#fff", fontSize: 15, fontWeight: "700" },

  // Secure badge
  secureBadge: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 6,
  },
  secureText: { fontSize: 11, opacity: 0.35, textAlign: "center" },

  // Success
  successWrap: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingHorizontal: 32,
  },
  successIcon: {
    width: 100, height: 100, borderRadius: 50,
    backgroundColor: "#d1fae5",
    alignItems: "center", justifyContent: "center", marginBottom: 20,
  },
  successTitle: { fontSize: 24, fontWeight: "800", color: "#059669", marginBottom: 10 },
  successSub: {
    fontSize: 14, opacity: 0.6, textAlign: "center",
    lineHeight: 22, marginBottom: 28,
  },
  successBtn: {
    paddingVertical: 14, paddingHorizontal: 40,
    borderRadius: 14, backgroundColor: "#d1fae5",
  },
  successBtnText: { color: "#059669", fontWeight: "700", fontSize: 15 },

  // Already premium
  alreadyWrap: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingTop: 60, gap: 12,
  },
  alreadyIcon: {
    width: 96, height: 96, borderRadius: 48,
    backgroundColor: "#d1fae5",
    alignItems: "center", justifyContent: "center", marginBottom: 8,
  },
  alreadyTitle: { fontSize: 24, fontWeight: "800", color: "#059669" },
  alreadySub: { fontSize: 14, opacity: 0.55, textAlign: "center", lineHeight: 22 },
  alreadyBtn: {
    marginTop: 20, paddingVertical: 12, paddingHorizontal: 32,
    borderRadius: 12, backgroundColor: "#d1fae5",
  },
  alreadyBtnText: { color: "#059669", fontWeight: "700", fontSize: 14 },
});
