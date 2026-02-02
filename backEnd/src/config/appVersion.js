// routes/versionRoute.js

// Simulate a version store — ideally, fetch from DB or environment variables
const latestAppInfo = {
  android: {
    version: "1.1.0", // semantic version
    build: 2,         // internal build number
    otaEnabled: true, // allow OTA updates
    downloadUrl: "https://github.com/Uco7/testBookStoreApp/releases/download/v1.1.0/application-new.apk",
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
