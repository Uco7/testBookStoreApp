// import axios from "axios";
// import AsyncStorage from "@react-native-async-storage/async-storage";
// import {backendUrl_ngrok,backendDomainUrl} from "../utils/config/appUrl"

// const APPURL=backendUrl_ngrok

// export async function syncPushToken(pushToken) {
//   try {
//     if (!pushToken) return;

//     const authToken = await AsyncStorage.getItem("token");

//     if (!authToken) return;

//     await axios.post(
//       `${APPURL}/api/v1/auth/save-push-token`,
//       { token: pushToken },
//       {
//         headers: {
//           Authorization: `Bearer ${authToken}`,
//         },
//       }
//     );
//   } catch (err) {
//     console.log("Push sync failed:", err.message);
//   }
// }




import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { appUrl} from "./config/appUrl";

const APPURL =appUrl

export async function syncPushToken(pushToken) {
  try {
    if (!pushToken) return;

    const authToken = await AsyncStorage.getItem("token");
    if (!authToken) return;

    await axios.post(
      `${APPURL}/api/v1/auth/save-push-token`,
      { token: pushToken },
      {
        headers: {
          Authorization: `Bearer ${authToken}`,
        },
      }
    );
  } catch (err) {
    console.log("Push sync failed:", err.message);
  }
}