import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import axios from "axios";

import {backendUrl_ngrok,backendDomainUrl} from "../utils/config/appUrl"

const APPURL=backendUrl_ngrok
export const registerForPushNotificationsAsync = async (token) => {
  if (!Device.isDevice) return;

  const { status } = await Notifications.requestPermissionsAsync();
  if (status !== "granted") return;

  const pushToken = (await Notifications.getExpoPushTokenAsync()).data;

  await axios.post(`${APPURL}/api/v1/user/save-push-token`, {
    pushToken,
  });

  return pushToken;
};