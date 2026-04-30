import ClamScan from "clamscan";

const initializeClamAV = async () => {
  const clamscan = await new ClamScan().init({
    removeInfected: false,
    quarantineInfected: false,
    scanLog: null,
    debugMode: false,
    fileList: null,
    scanRecursively: true,
    clamdscan: {
      socket: false,
      host: "127.0.0.1",
      port: 3310,
      timeout: 60000,
      localFallback: true
    },
    preference: "clamdscan"
  });

  return clamscan;
};

export default initializeClamAV;