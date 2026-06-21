


import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from "react-native";
import InputTheme from "../../component/InputTheme";
import React, { useState, useRef, useEffect, useMemo, useContext } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";

import {
  RewardedAd,
  RewardedAdEventType,
  TestIds,
  BannerAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";

import KeyBordAvoidingComponent from "../../component/KeyBordAvoidingComponent";
import ThemeView from "../../component/ThemeView";
import ThemeText from "../../component/ThemeText";
import CardTheme from "../../component/CardTheme";
import ThemeButton from "../../component/ThemeButton";
import Spacer from "../../component/Spacer";
import DropDownTheme from "../../component/DropDownTheme";
import { useTimetable } from "../../hook/useTimeTable";
import { colors } from "../../constant/colors";
import { useUser } from "../../hook/useUser";
import { validateNotificationMessage } from "../../utils/bookValidator";



const REWARDED_AD_UNIT_ID = __DEV__
  ? TestIds.REWARDED
  : "ca-app-pub-8923799920726415/9518542183";

const BANNER_AD_UNIT_ID = __DEV__
  ? TestIds.BANNER
  : "ca-app-pub-8923799920726415/1058769092";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = {
  Mon: "Monday", Tue: "Tuesday",  Wed: "Wednesday",
  Thu: "Thursday", Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};

const DayToggle = ({ selected, onChange }) => (
  <View style={styles.dayRow}>
    {DAYS.map((d) => {
      const active = selected.includes(DAY_FULL[d]);
      return (
        <Pressable
          key={d}
          onPress={() => {
            const full = DAY_FULL[d];
            onChange(active ? selected.filter((x) => x !== full) : [...selected, full]);
          }}
          style={[styles.dayBtn, active && styles.dayBtnActive]}
        >
          <ThemeText style={[styles.dayText, active && styles.dayTextActive]}>
            {d}
          </ThemeText>
        </Pressable>
      );
    })}
  </View>
);

const PlanCard = ({ plan, selected, onSelect, isFreePhase }) => {
  const isPremium = plan.value === "premium";
  const accent    = isPremium ? "#059669" : colors.primary;
  const lightBg   = isPremium ? "#d1fae5" : "#ede9fe";

  return (
    <Pressable onPress={() => onSelect(plan.value)}>
      <CardTheme style={[styles.planCard, selected && { borderColor: accent, borderWidth: 2 }]}>
        <View style={styles.planRow}>
          <View style={[styles.planIconBlock, { backgroundColor: lightBg }]}>
            <Ionicons name={plan.icon} size={26} color={accent} />
          </View>

          <View style={styles.planTextBlock}>
            <View style={styles.planTitleRow}>
              <ThemeText style={[styles.planTitle, { color: accent }]}>
                {plan.label}
              </ThemeText>
              {isPremium && (
                <View style={styles.premiumBadge}>
                  <Ionicons name="diamond" size={10} color="#059669" />
                  <ThemeText style={styles.premiumBadgeText}>Premium</ThemeText>
                </View>
              )}
            </View>

            <ThemeText style={styles.planDesc}>{plan.description}</ThemeText>

            {isPremium && !isFreePhase && (
              <View style={styles.accessHintRow}>
                <Ionicons name="tv-outline" size={11} color="#d97706" />
                <ThemeText style={styles.accessHint}>
                  Watch a short ad or subscribe to unlock
                </ThemeText>
              </View>
            )}

            {isPremium && isFreePhase && (
              <View style={styles.accessHintRow}>
                <Ionicons name="gift-outline" size={11} color="#059669" />
                <ThemeText style={[styles.accessHint, { color: "#059669" }]}>
                  Free during your welcome period
                </ThemeText>
              </View>
            )}
          </View>

          <View style={[styles.radioOuter, selected && { borderColor: accent }]}>
            {selected && <View style={[styles.radioInner, { backgroundColor: accent }]} />}
          </View>
        </View>
      </CardTheme>
    </Pressable>
  );
};

const AccessBanner = ({ phase, daysRemaining, totalTimetables, graceMaxTables }) => {
  if (phase === "fresh" || phase === "bonus") return null;

  if (phase === "grace") {
    const remaining = graceMaxTables - totalTimetables;
    return (
      <View style={styles.graceBanner}>
        <Ionicons name="time-outline" size={16} color="#d97706" />
        <View style={{ flex: 1 }}>
          <ThemeText style={styles.graceBannerTitle}>
            Free period ended — {daysRemaining} day{daysRemaining !== 1 ? "s" : ""} grace remaining
          </ThemeText>
          <ThemeText style={styles.graceBannerSub}>
            You can create {remaining > 0 ? remaining : "no more"} timetable{remaining !== 1 ? "s" : ""} for free.
            After that, watch an ad or subscribe.
          </ThemeText>
        </View>
      </View>
    );
  }

  if (phase === "restricted") {
    return (
      <View style={[styles.graceBanner, styles.restrictedBanner]}>
        <Ionicons name="lock-closed-outline" size={16} color="#dc2626" />
        <View style={{ flex: 1 }}>
          <ThemeText style={[styles.graceBannerTitle, { color: "#dc2626" }]}>
            Free period ended
          </ThemeText>
          <ThemeText style={styles.graceBannerSub}>
            Watch a short ad for 24-hour access, or subscribe for unlimited timetables.
          </ThemeText>
        </View>
      </View>
    );
  }

  return null;
};

const CreateTimetable = () => {
  const router    = useRouter();
  const params    = useLocalSearchParams();
  const { createTimetable, accessStatus, saveAdUnlock } = useTimetable();
  const { user }  = useUser();
  const scrollRef = useRef(null);

  const [selectedPlan,   setSelectedPlan]   = useState("");
  const [loading,        setLoading]        = useState(false);
  const [formPositionY,  setFormPositionY]  = useState(0);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [adLoading,      setAdLoading]      = useState(false);

  // Form
  const [sessionsPerDay, setSessionsPerDay] = useState("1");

  // 🕒 Custom Time picker states replacing the dropdown item
  const [hour, setHour] = useState("12");
  const [minute, setMinute] = useState("00");
  const [ampm, setAmPm] = useState("AM");

  const [repeatType,     setRepeatType]     = useState("daily");
  const [studyDays,      setStudyDays]      = useState([]);
  const [description,    setDescription]    = useState("");

  // Guards against double-submits and against a stale alert firing after
  // the component unmounted (e.g. user backed out while request in-flight).
  const isMountedRef   = useRef(true);
  const submittingRef  = useRef(false);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const { phase, daysRemaining, totalTimetables, graceMaxTables } = accessStatus;
  const isFreePhase = phase === "fresh" || phase === "bonus";

  const canCreateFree = useMemo(() => {
    if (isFreePhase) return true;
    if (phase === "grace" && totalTimetables < graceMaxTables) return true;
    return false;
  }, [isFreePhase, phase, totalTimetables, graceMaxTables]);

  const isPremiumUser = useMemo(() => {
    if (!user?.premium) return false;
    const now = new Date();
    if (user.premium.isPremium && user.premium.premiumPlan === "lifetime") return true;
    if (user.premium.isPremium && user.premium.premiumExpiresAt &&
        new Date(user.premium.premiumExpiresAt) > now) return true;
    if (user.premium.trialExpiresAt && new Date(user.premium.trialExpiresAt) > now) return true;
    return false;
  }, [user]);

  // Dynamic 24h compiler mapping safely to original payload references
  const reminderTime = useMemo(() => {
    if (!hour || !minute) return "";
    let h = parseInt(hour, 10);
    const m = parseInt(minute, 10);
    if (isNaN(h) || isNaN(m) || h < 1 || h > 12 || m < 0 || m > 59) return "";
    if (ampm === "PM" && h < 12) h += 12;
    if (ampm === "AM" && h === 12) h = 0;
    return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
  }, [hour, minute, ampm]);

  const book = params?.book
    ? typeof params.book === "string" ? JSON.parse(params.book) : params.book
    : {};

  const title    = book?.title || "";
  const author   = book?.author || "";
  const date     = book?.createdAt
    ? new Date(book.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "";
  const fileType = book?.fileType === "file" ? "File" : "Link";

  const plans = [
    {
      value: "regular",
      label: "Regular Plan",
      icon:  "notifications-outline",
      description: "Standard reminder notifications at your chosen time.",
    },
    {
      value: "premium",
      label: "Premium Plan",
      icon:  "diamond-outline",
      description: "Louder alarm alerts with priority delivery.",
    },
  ];

  const sessionItems = useMemo(
    () => ["1","2","3","4","5"].map((n) => ({ label: `${n} ${n === "1" ? "Session" : "Sessions"}`, value: n })),
    []
  );

  const repeatItems = useMemo(() => [
    { label: "Daily",                  value: "daily"  },
    { label: "Weekly (choose days)",   value: "weekly" },
  ], []);

  useEffect(() => {
    if (!selectedPlan || formPositionY <= 0) return;
    const t = setTimeout(() => {
      scrollRef.current?.scrollTo({ y: formPositionY - 80, animated: true });
    }, 300);
    return () => clearTimeout(t);
  }, [selectedPlan, formPositionY]);

  const loadAndShowRewardedAd = () =>
    new Promise((resolve, reject) => {
      const rewarded = RewardedAd.createForAdRequest(REWARDED_AD_UNIT_ID, {
        requestNonPersonalizedAdsOnly: true,
      });
      const unsubLoaded  = rewarded.addAdEventListener(RewardedAdEventType.LOADED, () => {
        rewarded.show();
      });
      const unsubEarned  = rewarded.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => {
        unsubLoaded();
        unsubEarned();
        resolve(true);
      });
      rewarded.addAdEventListener("error", (error) => {
        unsubLoaded();
        unsubEarned();
        reject(error);
      });
      rewarded.load();
    });

  const showRewardedAdAndUnlock = async (onSuccess) => {
    try {
      setAdLoading(true);
      await loadAndShowRewardedAd();
      await saveAdUnlock();
      Alert.alert(
        "Access unlocked!",
        "You can now create timetables for the next 24 hours.",
        [{ text: "Great!", onPress: onSuccess }]
      );
    } catch {
      Alert.alert(
        "Ad not available",
        "Could not load the ad. Please try again or subscribe.",
        [
          { text: "Try again",  onPress: () => showRewardedAdAndUnlock(onSuccess) },
          { text: "Subscribe",  onPress: () => router.push("/subscribeScreen") },
          { text: "Cancel",     style: "cancel" },
        ]
      );
    } finally {
      setAdLoading(false);
    }
  };

  // const handlePlanSelect = (plan) => {
  //   if (isFreePhase || isPremiumUser) {
  //     setSelectedPlan(plan);
  //     return;
  //   }
  //   if (phase === "grace" && totalTimetables < graceMaxTables) {
  //     setSelectedPlan(plan);
  //     return;
  //   }
  //   showUnlockPrompt(() => setSelectedPlan(plan));
  // };


const handlePlanSelect = (plan) => {
  // Regular plan is always free
  if (plan === "regular") {
    setSelectedPlan(plan);
    return;
  }

  // Premium plan access check
  if (isFreePhase || isPremiumUser) {
    setSelectedPlan(plan);
    return;
  }

  if (phase === "grace" && totalTimetables < graceMaxTables) {
    setSelectedPlan(plan);
    return;
  }

  showUnlockPrompt(() => setSelectedPlan(plan));
};

  const showUnlockPrompt = (onUnlocked) => {
    const title   = phase === "grace" ? "Free timetable limit reached" : "Free period ended";
    const message = phase === "grace"
      ? `You've used all ${graceMaxTables} free timetables in your grace period. Watch a short ad or subscribe to keep going.`
      : "Your 30-day free period has ended. Watch a short ad for 24-hour access, or subscribe for unlimited timetables.";

    Alert.alert(title, message, [
      { text: "Cancel", style: "cancel" },
      { text: "Watch ad (free)", onPress: () => showRewardedAdAndUnlock(onUnlocked) },
      { text: "Subscribe",  onPress: () => router.push("/subscribeScreen") },
    ]);
  };

  // ── SUBMIT ─────────────────────────────────────────────────────────────────
  // KEY FIX: createTimetable() in the context now resolves as soon as the
  // server confirms creation — it no longer waits on local notification
  // scheduling or on refetching the timetable list/access status (those run
  // in the background). That's what was making this screen feel stuck even
  // though the backend itself responded quickly.
  const handleCreate = async () => {
    if (loading || submittingRef.current) return;

    if (!selectedPlan) return Alert.alert("Plan required", "Please choose a study plan.");
    if (!reminderTime) return Alert.alert("Time structure error", "Please input a valid hour (1-12) and minute (0-59).");
    // if (repeatType === "weekly" && studyDays.length === 0)
    //   return Alert.alert("Study days required", "Select at least one day for a weekly schedule.");

    const notificationError =
  validateNotificationMessage(description);

if (notificationError) {
  return Alert.alert(
    "Invalid notification message",
    notificationError
  );
}

    // if (!canCreateFree && !isPremiumUser) {
    //   showUnlockPrompt(handleCreate);
    //   return;
    // }
    // Only premium timetable creation requires unlock
if (
  selectedPlan === "premium" &&
  !canCreateFree &&
  !isPremiumUser
) {
  showUnlockPrompt(handleCreate);
  return;
}

    submittingRef.current = true;
    setLoading(true);

    try {
      await createTimetable({
        timetableType: selectedPlan,
        noticeCount: Number(sessionsPerDay),
        reminderTime,
        reminderType: repeatType,
        studyDays,
        bookId: book?._id,
        bookTitle: title,
        notificationMessage: description,
      });

      if (!isMountedRef.current) return;

      Alert.alert("Timetable created ✅", "Your study reminders are all set.", [
        { text: "Done", onPress: () => router.push("/book")},
      ]);
    } catch (error) {
      if (!isMountedRef.current) return;

      const status   = error?.response?.status;
      const msg      = error?.response?.data?.message;
      const errPhase = error?.response?.data?.phase;
      const isTimeout = error?.code === "ECONNABORTED";

      if (status === 403) {
        if (errPhase === "grace_limit" || errPhase === "restricted" || errPhase === "ad_limit") {
          showUnlockPrompt(() => handleCreate());
        } else {
          Alert.alert("Access required", msg || "Please watch an ad or subscribe.");
        }
      } else if (isTimeout) {
        Alert.alert(
          "Taking too long",
          "The request timed out. Check your connection and try again."
        );
      } else if (!status) {
        Alert.alert(
          "Connection error",
          "Could not reach the server. Please check your internet connection and try again."
        );
      } else {
        Alert.alert("Error", msg || "Failed to create timetable. Please try again.");
      }
    } finally {
      submittingRef.current = false;
      if (isMountedRef.current) setLoading(false);
    }
  };

  const BonusChip = () => {
    if (!isFreePhase || phase === "fresh" || !daysRemaining) return null;
    return (
      <View style={styles.bonusChip}>
        <Ionicons name="gift-outline" size={13} color="#059669" />
        <ThemeText style={styles.bonusChipText}>
          {daysRemaining} free day{daysRemaining !== 1 ? "s" : ""} remaining
        </ThemeText>
      </View>
    );
  };

  return (
    <KeyBordAvoidingComponent>
      <ThemeView safe style={styles.screen}>
        <ScrollView
          ref={scrollRef}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.container}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <Pressable onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={colors.primary} />
            </Pressable>
            <View style={styles.headerText}>
              <ThemeText style={styles.headerTitle}>Create Reminder</ThemeText>
              <ThemeText style={styles.headerSub}>Set up your study schedule</ThemeText>
            </View>
          </View>

          <BonusChip />
          <AccessBanner
            phase={phase}
            daysRemaining={daysRemaining}
            totalTimetables={totalTimetables}
            graceMaxTables={graceMaxTables}
          />

          <Spacer height={20} />

          {/* BOOK CARD */}
          <CardTheme style={styles.bookCard}>
            <View style={styles.bookRow}>
              <View style={styles.bookCover}>
                <Ionicons name="book" size={30} color={colors.primary} />
              </View>
              <View style={styles.bookInfo}>
                <ThemeText style={styles.bookTitle} numberOfLines={2}>
                  {title || "Untitled"}
                </ThemeText>
                {!!author && (
                  <View style={styles.bookMeta}>
                    <Ionicons name="person-outline" size={13} color="#9ca3af" />
                    <ThemeText style={styles.bookMetaText}>{author}</ThemeText>
                  </View>
                )}
                <View style={styles.bookMeta}>
                  <Ionicons name="calendar-outline" size={13} color="#9ca3af" />
                  <ThemeText style={styles.bookMetaText}>{date}</ThemeText>
                </View>
                <View style={styles.bookMeta}>
                  <Ionicons name="document-outline" size={13} color="#9ca3af" />
                  <ThemeText style={styles.bookMetaText}>{fileType}</ThemeText>
                </View>
              </View>
            </View>
          </CardTheme>

          <Spacer height={28} />

          <ThemeText style={styles.sectionLabel}>Choose a plan</ThemeText>
          <Spacer height={12} />

          {plans.map((plan) => (
            <View key={plan.value} style={{ marginBottom: 10 }}>
              <PlanCard
                plan={plan}
                selected={selectedPlan === plan.value}
                onSelect={handlePlanSelect}
                isFreePhase={isFreePhase || isPremiumUser}
              />
            </View>
          ))}

          {adLoading && (
            <View style={styles.adLoadingRow}>
              <ActivityIndicator size="small" color={colors.primary} />
              <ThemeText style={styles.adLoadingText}>Loading ad, please wait…</ThemeText>
            </View>
          )}

          {/* FORM */}
          {!!selectedPlan && (
            <View
              collapsable={false}
              onLayout={(e) => {
                const y = e.nativeEvent.layout.y;
                if (formPositionY !== y) setFormPositionY(y);
              }}
            >
              <Spacer height={28} />
              <ThemeText style={styles.sectionLabel}>Schedule details</ThemeText>
              <Spacer height={12} />

              <CardTheme style={styles.formCard}>
                {/* Sessions */}
                <ThemeText style={styles.fieldLabel}>Sessions per day</ThemeText>
                <View style={{ zIndex: 4 }}>
                  <DropDownTheme
                    open={activeDropdown === "sessions"}
                    setOpen={(o) => setActiveDropdown(o ? "sessions" : null)}
                    value={sessionsPerDay}
                    setValue={setSessionsPerDay}
                    placeholder="Select sessions"
                    items={sessionItems}
                  />
                </View>

                <Spacer height={18} />

                {/* 🕒 Custom Split-Time Inputs */}
                <ThemeText style={styles.fieldLabel}>Reminder time</ThemeText>
                <View style={styles.timePickerContainer}>

                  {/* Hours Field */}
                  <View style={styles.timeInputBox}>
                    <InputTheme
                      placeholder="12"
                      value={hour}
                      maxLength={2}
                      keyboardType="number-pad"
                      onChangeText={(val) => {
                        const num = parseInt(val, 10);
                        if (!val || (!isNaN(num) && num >= 1 && num <= 12)) {
                          setHour(val);
                        }
                      }}
                      style={styles.timeInput}
                    />
                    <ThemeText style={styles.timeInputSubtext}>Hrs</ThemeText>
                  </View>

                  <ThemeText style={styles.timeDivider}>:</ThemeText>

                  {/* Minutes Field */}
                  <View style={styles.timeInputBox}>
                    <InputTheme
                      placeholder="00"
                      value={minute}
                      maxLength={2}
                      keyboardType="number-pad"
                      onChangeText={(val) => {
                        const num = parseInt(val, 10);
                        if (!val || (!isNaN(num) && num >= 0 && num <= 59)) {
                          setMinute(val);
                        }
                      }}
                      style={styles.timeInput}
                    />
                    <ThemeText style={styles.timeInputSubtext}>Min</ThemeText>
                  </View>

                  {/* AM/PM Toggles */}
                  <View style={styles.ampmContainer}>
                    <Pressable
                      onPress={() => setAmPm("AM")}
                      style={[styles.ampmBtn, ampm === "AM" && styles.ampmBtnActive]}
                    >
                      <ThemeText style={[styles.ampmText, ampm === "AM" && styles.ampmTextActive]}>AM</ThemeText>
                    </Pressable>
                    <Pressable
                      onPress={() => setAmPm("PM")}
                      style={[styles.ampmBtn, ampm === "PM" && styles.ampmBtnActive]}
                    >
                      <ThemeText style={[styles.ampmText, ampm === "PM" && styles.ampmTextActive]}>PM</ThemeText>
                    </Pressable>
                  </View>
                </View>

                <Spacer height={18} />

                {/* Repeat */}
                <ThemeText style={styles.fieldLabel}>Repeat</ThemeText>
                <View style={{ zIndex: 2 }}>
                  <DropDownTheme
                    open={activeDropdown === "repeat"}
                    setOpen={(o) => setActiveDropdown(o ? "repeat" : null)}
                    value={repeatType}
                    setValue={(val) => { setRepeatType(val); if (val === "daily") setStudyDays([]); }}
                    placeholder="How often?"
                    items={repeatItems}
                  />
                </View>

                {/* Study days */}
                {repeatType === "weekly" && (
                  <>
                    <Spacer height={18} />
                    <ThemeText style={styles.fieldLabel}>Study days</ThemeText>
                    <Spacer height={8} />
                    <DayToggle selected={studyDays} onChange={setStudyDays} />
                    {studyDays.length === 0 && (
                      <ThemeText style={styles.fieldHint}>Tap days to select</ThemeText>
                    )}
                  </>
                )}

                <Spacer height={18} />

                {/* Description */}
                <ThemeText style={styles.fieldLabel}>
                  Notification message{" "}
                  <ThemeText style={styles.optional}>(optional)</ThemeText>
                </ThemeText>
                <Spacer height={6} />
                <InputTheme
                  placeholder="e.g. Time to read Chapter 4!"
                  value={description}
                  onChangeText={setDescription}
                  multiline
                    maxLength={250}

                  style={styles.descInput}
                />

                <Spacer height={24} />

                {/* Submit */}
                <ThemeButton onPress={handleCreate} disabled={loading} style={styles.submitBtn}>
                  <View style={styles.submitRow}>
                    {loading ? (
                      <>
                        <ActivityIndicator color="#fff" size="small" />
                        <ThemeText style={styles.submitText}>Creating…</ThemeText>
                      </>
                    ) : (
                      <>
                        <Ionicons name="calendar-outline" size={20} color="#fff" />
                        <ThemeText style={styles.submitText}>Create timetable</ThemeText>
                      </>
                    )}
                  </View>
                </ThemeButton>
              </CardTheme>
            </View>
          )}

          <Spacer height={100} />
        </ScrollView>

        {true && (
          <View style={styles.bannerWrapper}>
            <BannerAd
              unitId={BANNER_AD_UNIT_ID}
              size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
              requestOptions={{ requestNonPersonalizedAdsOnly: true }}
              onAdLoaded={() => console.log("✅ Banner ad loaded")}
              onAdFailedToLoad={(error) => console.log("❌ Banner ad failed:", error)}
            />
          </View>
        )}
      </ThemeView>
    </KeyBordAvoidingComponent>
  );
};

export default CreateTimetable;

const styles = StyleSheet.create({
  screen:     { flex: 1 },
  container: { padding: 16, paddingBottom: 120, overflow: "visible" },

  header:     { flexDirection: "row", alignItems: "center", gap: 12, paddingTop: 6 },
  backBtn:    { padding: 4 },
  headerText: { flex: 1 },
  headerTitle:{ fontSize: 22, fontWeight: "700", letterSpacing: -0.3 },
  headerSub:  { fontSize: 13, opacity: 0.45, marginTop: 2 },

  bonusChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    marginTop: 10, alignSelf: "flex-start",
    backgroundColor: "#d1fae5", paddingHorizontal: 10,
    paddingVertical: 5, borderRadius: 20,
  },
  bonusChipText: { fontSize: 12, fontWeight: "600", color: "#059669" },

  graceBanner: {
    flexDirection: "row", alignItems: "flex-start", gap: 10,
    marginTop: 12, backgroundColor: "#fef3c7",
    borderRadius: 12, padding: 12, borderWidth: 1, borderColor: "#fbbf24",
  },
  restrictedBanner: { backgroundColor: "#fee2e2", borderColor: "#fca5a5" },
  graceBannerTitle: { fontSize: 13, fontWeight: "700", color: "#92400e", marginBottom: 2 },
  graceBannerSub:   { fontSize: 12, color: "#78350f", lineHeight: 17 },

  bookCard: { padding: 14, borderRadius: 14 },
  bookRow:  { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  bookCover:{
    width: 54, height: 54, borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  bookInfo:     { flex: 1, gap: 4 },
  bookTitle:    { fontSize: 15, fontWeight: "700", lineHeight: 21 },
  bookMeta:     { flexDirection: "row", alignItems: "center", gap: 5 },
  bookMetaText: { fontSize: 12, opacity: 0.5 },

  sectionLabel: {
    fontSize: 13, fontWeight: "700", letterSpacing: 0.6,
    textTransform: "uppercase", opacity: 0.4,
  },

  planCard: { padding: 14, borderRadius: 14, borderWidth: 1.5, borderColor: "transparent" },
  planRow:  { flexDirection: "row", alignItems: "center", gap: 12 },
  planIconBlock: {
    width: 48, height: 48, borderRadius: 12,
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  planTextBlock: { flex: 1, gap: 3 },
  planTitleRow:  { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  planTitle:     { fontSize: 15, fontWeight: "700" },
  premiumBadge:  {
    flexDirection: "row", alignItems: "center", gap: 3,
    backgroundColor: "#d1fae5", paddingHorizontal: 7,
    paddingVertical: 2, borderRadius: 20,
  },
  premiumBadgeText: { fontSize: 10, fontWeight: "700", color: "#059669" },
  planDesc:         { fontSize: 12, opacity: 0.5, lineHeight: 17 },
  accessHintRow:    { flexDirection: "row", alignItems: "center", gap: 4, marginTop: 4 },
  accessHint:       { fontSize: 11, color: "#d97706", fontWeight: "500" },

  radioOuter: {
    width: 20, height: 20, borderRadius: 10,
    borderWidth: 2, borderColor: "#d1d5db",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  },
  radioInner: { width: 10, height: 10, borderRadius: 5 },

  adLoadingRow: {
    flexDirection: "row", alignItems: "center", gap: 8,
    justifyContent: "center", paddingVertical: 12,
    backgroundColor: "rgba(0,0,0,0.04)", borderRadius: 10, marginTop: 6,
  },
  adLoadingText: { fontSize: 13, opacity: 0.6 },

  formCard: { padding: 16, borderRadius: 14, overflow: "visible" },
  fieldLabel: { fontSize: 13, fontWeight: "600", marginBottom: 6, opacity: 0.65 },
  optional:   { fontWeight: "400", opacity: 0.4 },
  fieldHint:  { fontSize: 12, opacity: 0.35, marginTop: 6, textAlign: "center" },

  // Custom Horizontal Time Picker Layout
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 4,
  },
  timeInputBox: {
    flex: 1,
    alignItems: "center",
  },
  timeInput: {
    width: "100%",
    textAlign: "center",
    fontSize: 18,
    fontWeight: "600",
  },
  timeInputSubtext: {
    fontSize: 11,
    opacity: 0.4,
    marginTop: 4,
  },
  timeDivider: {
    fontSize: 22,
    fontWeight: "bold",
    marginHorizontal: 12,
    paddingBottom: 16, // aligns colon layout cleanly next to input baselines
    opacity: 0.5,
  },
  ampmContainer: {
    flexDirection: "row",
    borderWidth: 1.5,
    borderColor: "rgba(0,0,0,0.1)",
    borderRadius: 10,
    overflow: "hidden",
    marginLeft: 14,
    height: 44,
  },
  ampmBtn: {
    paddingHorizontal: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.03)",
  },
  ampmBtnActive: {
    backgroundColor: colors.primary,
  },
  ampmText: {
    fontSize: 13,
    fontWeight: "700",
    opacity: 0.6,
  },
  ampmTextActive: {
    color: "#fff",
    opacity: 1,
  },

  dayRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  dayBtn: {
    paddingVertical: 8, paddingHorizontal: 11,
    borderRadius: 10, backgroundColor: "rgba(0,0,0,0.05)",
    borderWidth: 1.5, borderColor: "transparent",
  },
  dayBtnActive:  { backgroundColor: colors.primary + "18", borderColor: colors.primary },
  dayText:       { fontSize: 13, fontWeight: "600", opacity: 0.45 },
  dayTextActive: { color: colors.primary, opacity: 1 },

  descInput:  { minHeight: 72, textAlignVertical: "top" },

  submitBtn:  { borderRadius: 12, paddingVertical: 14,width:"100%" },
  submitRow:  { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8 },
  submitText: { color: "#fff", fontWeight: "700", fontSize: 15 },

  bannerWrapper: {
    position: "absolute", bottom: 0, left: 0, right: 0,
    alignItems: "center", backgroundColor: "transparent",
  },
});
