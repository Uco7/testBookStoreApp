// routes/versionRoute.js

// Simulate a version store — ideally, fetch from DB or environment variables
const latestAppInfo = {
  android: {
    version: "1.1.0", // semantic version
    build: 2,         // internal build number
    otaEnabled: true, // allow OTA updates
    downloadUrl: "https://github.com/Uco7/testBookStoreApp/releases/download/v1.0.0/application-c93dcff6-ed2f-4166-a293-5c50b55786c0.apk",
    mandatory: false, // whether update is forced
  },
  ios: {
    version: "1.1.0",
    build: 2,
    otaEnabled: true,
    downloadUrl: "", // App Store link
    mandatory: false,
  },
};



export default appVersion
