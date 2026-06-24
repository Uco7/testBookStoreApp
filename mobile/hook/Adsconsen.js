// adsConsent.js  (PROJECT ROOT — same level as your app/, hook/, component/ folders)
//
// Wraps Google's UMP SDK via react-native-google-mobile-ads' AdsConsent
// helper. This is the ONLY place mobileAds().initialize() should be
// called — remove the duplicate call that currently lives in
// app/_layout.jsx's App() component, since calling initialize() before
// consent is gathered risks requesting ads pre-consent.


/**
 * Gathers consent (showing Google's consent form if required) and then
 * initializes the Mobile Ads SDK. Call this ONCE, early — see
 * app/_layout.jsx for where it's wired in.
 */
import { AdsConsent, AdsConsentStatus } from "react-native-google-mobile-ads";
import mobileAds from "react-native-google-mobile-ads";

const DEBUG_FORCE_EEA = false;
const DEBUG_TEST_DEVICE_IDS = [];

let cachedCanRequestAds = false;

export async function initializeAdsConsent() {
  try {
    const debugOptions = DEBUG_FORCE_EEA
      ? {
          debugGeography: 1,
          testDeviceIdentifiers: DEBUG_TEST_DEVICE_IDS,
        }
      : undefined;

    const consentInfo = await AdsConsent.requestInfoUpdate(debugOptions);

    let finalStatus = consentInfo.status;

    if (
      consentInfo.isConsentFormAvailable &&
      (finalStatus === AdsConsentStatus.UNKNOWN ||
        finalStatus === AdsConsentStatus.REQUIRED)
    ) {
      const formResult = await AdsConsent.showForm();
      finalStatus = formResult.status;
    }

    await mobileAds().initialize();

    cachedCanRequestAds =
      finalStatus === AdsConsentStatus.OBTAINED ||
      finalStatus === AdsConsentStatus.NOTREQUIRED;

    console.log("✅ Ads SDK initialized");
    console.log("Consent status:", finalStatus);
    console.log("Can request ads:", cachedCanRequestAds);

    return {
      canRequestAds: cachedCanRequestAds,
      status: finalStatus,
      privacyOptionsRequired:
        consentInfo.privacyOptionsRequirementStatus === "REQUIRED",
    };
  } catch (error) {
    console.log("AdsConsent initialization error:", error);

    // DEV FALLBACK
    await mobileAds().initialize();

    cachedCanRequestAds = true;

    console.log("⚠️ Consent unavailable, allowing ads in development");

    return {
      canRequestAds: true,
      status: AdsConsentStatus.NOTREQUIRED,
      privacyOptionsRequired: false,
    };
  }
}

export async function getCanRequestAds() {
  return cachedCanRequestAds;
}

export async function showPrivacyOptionsForm() {
  try {
    const result = await AdsConsent.showPrivacyOptionsForm();

    return (
      result.status === AdsConsentStatus.OBTAINED ||
      result.status === AdsConsentStatus.NOTREQUIRED
    );
  } catch (error) {
    console.log("Privacy options form error:", error);
    return false;
  }
}