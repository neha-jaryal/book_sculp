import AsyncStorage from "@react-native-async-storage/async-storage";
import { showToast } from ".";

export const storageKey = {
  AUTH_TOKEN: "@AUTH_TOKEN",
  USER_DATA: "@USERDATA",
  USER_ID: "@USER_ID",
  USER_ROLE: "@USER_ROLE",
  TEMP_USER_ID: "@TEMP_USER_ID",
  TEMP_TOKEN: "@TEMP_TOKEN",
  ROOM_ID: "@ROOM_ID",
  CHANGE_NAVIGATOR: "@CHANGE_NAVIGATOR",
  COUNTRY_ID: "@COUNTRY_ID",
  STATE_ID: "@STATE_ID",
  CREDS: "@CREDS",
  FCM_TOKEN: "@FCM_TOKEN",
  APPROVAL_STATUS: "@APPROVAL_STATUS",
  USER_STATUS: "@USER_STATUS",
  PACKAGE_ID: "@PACKAGE_ID",
  CURRENT_ROUTE: "@CURRENT_ROUTE",
  SUBSCRIPTION_HIDE: "@SUBSCRIPTION_HIDE",
  APP_OPENED_KEY: "@APP_OPENED_KEY",
  PAYMENT_STATUS: "@PAYMENT_STATUS",
  GOOGLE_CALENDAR_DATA: "@GOOGLE_CALENDAR_DATA",
};

// export async function storeData(key, value) {
//   await AsyncStorage.setItem(key, value);
// }

export const storeData = async (key, value) => {
  // console.log("key and value stored--", key, value);
  try {
    await AsyncStorage.setItem(key, value);
    return {
      success: true,
    };
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
// export async function getData(key) {
//   return await AsyncStorage.getItem(key).then((value) => {
//     return value;
//   });
// }
export const getData = async (key) => {
  try {
    const value = await AsyncStorage.getItem(key);
    // console.log("key and value in get data--", key, value);
    return value;
  } catch (error) {
    return {
      success: false,
      error,
    };
  }
};
export async function clearData() {
  const keys = [
    // storageKey.USER_ID,
    // storageKey?.USER_ROLE,
    // storageKey?.COUNTRY_ID,
    // storageKey?.STATE_ID,
    // storageKey?.APPROVAL_STATUS,
    // storageKey?.USER_STATUS,
    storageKey?.AUTH_TOKEN,
    storageKey?.USER_DATA,
    storageKey?.USER_ID,
    storageKey?.USER_ROLE,
    storageKey?.TEMP_USER_ID,
    storageKey?.TEMP_TOKEN,
    storageKey?.ROOM_ID,
    storageKey?.COUNTRY_ID,
    storageKey?.STATE_ID,
    storageKey?.APPROVAL_STATUS,
    storageKey?.USER_STATUS,
    storageKey?.PACKAGE_ID,
    storageKey?.SUBSCRIPTION_HIDE,
    storageKey?.APP_OPENED_KEY,
    storageKey?.PAYMENT_STATUS,
    storageKey?.GOOGLE_CALENDAR_DATA,
  ];
  try {
    await AsyncStorage.multiRemove(keys);
  } catch (e) {
    // remove error
  }
  console.log("Cleared Data from AsyncStorage");
}

export async function removeData(keys) {
  //const keys = [storageKey.AUTH_TOKEN];
  try {
    await AsyncStorage.removeItem(keys);
  } catch (e) {
    showToast("Failed to remove the data to the storage", "error");
  }
  console.log("Cleared Data from AsyncStorage");
}
