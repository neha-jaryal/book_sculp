import {
  Platform,
  Alert,
  Modal,
  View,
  StyleSheet,
  AppState,
  Image,
} from "react-native";
// import Toast from "react-native-simple-toast";
import { routeName } from "./routeName";
import Toast from "react-native-toast-message";
import NetInfo from "@react-native-community/netinfo";
import moment from "moment";
// import { io } from "socket.io-client";
import { getData, storageKey, storeData } from "./Storage";
import { Colors } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "../Components";
import { AccountApproval } from "../Components/AccountApproval";
import { firebaseAuth } from "./Firebase";
import auth from "@react-native-firebase/auth";
import { signOut } from "firebase/auth";
// import Intl from "intl";

export { routeName };
export const WEB_CLIENT_ID =
  // "646055473905-tkg04i8i66kb9kb4uvm82qerup595e73.apps.googleusercontent.com";
  "646055473905-rbd61pjt18rk6mtb17sc47o84vfkr43a.apps.googleusercontent.com";
// export const Socket = async (key) => {
//   const socket = io("http://18.208.153.124:5001/", {
//     transports: ["websocket", "polling"],
//     upgrade: false,
//   });
//   return socket;
// };

export const getPageLimit = () => {
  return 10;
};

export const isFieldEmpty = (text) => {
  if (!text) {
    return true;
  }
  return false;
};

export const regName = (text) => {
  const reg = /^[A-Za-z]{0,25}$/;
  if (reg.test(text) != true) {
    return true;
  }
  return false;
};

export const passwordPattern = (password) => {
  // const reg = /(?=^.{8,}$)(?=.*\d)(?=.*[!@#$%^&*]+)(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/;
  const reg = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{}[\]|;:'",.<>/?]).{8,}$/;
  if (reg.test(password) !== true) {
    return true;
  }
  return false;
};

export const isValidEmail = (email) => {
  var reg = /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (reg.test(email) != true) {
    // console.log('true validation');
    return true;
  }
  // console.log('false validation');
  return false;
};

export let isValidOtp = (otp) => {
  if (otp.length < 4) {
    return false;
  }
  return true;
};

// export const isValidPhoneNumber = phoneNo => {
//   if (phoneNo) {
//     if (phoneNo.length > 6 && phoneNo.length < 14) {
//       return false;
//     }
//     return true;
//   }
// };
export const isValidPhoneNumber = (phoneNo) => {
  if (phoneNo) {
    if (phoneNo.length > 7 && phoneNo.length < 15) {
      return false;
    }
    return true;
  } else {
    null;
  }
};
export const isValidCardNumber = (num) => {
  if (num) {
    if (num.length < 19) {
      return true;
    } else {
      return false;
    }
  } else {
    null;
  }
};
export const isValidCardExpiry = (num) => {
  if (num) {
    if (num.length < 5) {
      return true;
    } else {
      return false;
    }
  } else {
    null;
  }
};

export const isValidComparedPassword = (newpassword, confirmPassword) => {
  if (newpassword != confirmPassword) {
    return true;
  }
  return false;
};
export const getOS = () => {
  if (Platform.OS === "ios") {
    return "ios";
  }
  return "android";
};

export const showAlertWithCallBack = (msg, onOkClick) => {
  Alert.alert(
    "",
    msg,
    [
      {
        text: "OK",
        onPress: () => {
          console.log(" CLICK CALLED ");
          onOkClick();
        },
      },
    ],
    {
      cancelable: false,
    }
  );
};

export const isNetworkAvailable = async () => {
  const response = await NetInfo.fetch();
  console.log("Is Network Available---", response?.isConnected);
  return response.isConnected;
};

export const firebaseLogout = async () => {
  if (firebaseAuth) {
    await signOut(firebaseAuth);
  } else if (auth().currentUser) {
    await auth().signOut();
  }
};

// export const storeData = async (key, token) => {
//   try {
//     const res = await AsyncStorage.setItem(key, JSON.stringify(token));
//     console.log('setInLocalStorge', res);
//   } catch (err) {
//     console.log('setInLocalStorge Error', err);
//   }
// };

// export const getData = async key => {
//   try {
//     const token = await AsyncStorage.getItem(key);
//     return token ? JSON.parse(token) : null;
//   } catch (err) {
//     console.log('getFromLocalStorge Error', err);
//   }
// };

// export const clearData = async key => {
//   try {
//     let res = await AsyncStorage.removeItem(key);
//   } catch (err) {
//     console.log('removeToken Error', err);
//   }
// };

// export const AuthToken = async key => {
//   try {
//     const token = await AsyncStorage.getItem(key);
//     return token ? JSON.parse(token) : null;
//   } catch (err) {
//     console.log('authToken Error', err);
//   }
// };
export const showToast = (message, type) => {
  // Toast?.showWithGravity(message, Toast?.SHORT, Toast?.TOP);
  if (type && message) {
    Toast.show({
      type: type,
      text1:
        type == "success"
          ? "Success !"
          : type == "error"
          ? "Failed !"
          : message,
      text2: message,
    });
  }

  // return (
  //   <Toast
  //     ref={(ref) => {
  //       Toast.setRef(ref);
  //     }}
  //   />
  // );

  // if (Platform.OS === 'android') {
  //   ToastAndroid.showWithGravityAndOffset(
  //     message,
  //     ToastAndroid.LONG,
  //     ToastAndroid.TOP,
  //     0,
  //     200,
  //   );
  // } else {
  //   Toast.show(message, Toast.LONG, Toast.TOP);
  // }
};

export const timeFormatter = (time) => {
  return parseInt(time?.from.slice(0, 2)) == 12
    ? time?.from.slice(0, 5) + " PM"
    : parseInt(time?.from.slice(0, 2)) < 12
    ? time?.from.slice(0, 5) + " AM"
    : parseInt(time?.from.slice(0, 2) - 12) < 12
    ? "0" +
      parseInt(time?.from.slice(0, 2) - 12) +
      time?.from.slice(2, 5) +
      " PM"
    : parseInt(time?.from.slice(0, 2) - 12) + time?.from.slice(2, 5) + " PM";
};

export const get_extension = (url) => {
  const url_ext = url.split(/[#?]/)[0].split(".").pop().trim();
  if (url_ext == "png") {
    return images.PNG_IMG;
  } else if (url_ext == "jpeg") {
    return images.JPEG_IMG;
  } else if (url_ext == "jpg") {
    return images.JPG_IMG;
  } else if (url_ext == "pdf") {
    return images.PDF_IMG;
  } else if (url_ext == "doc") {
    return images.DOC_IMG;
  } else {
    null;
  }
};

export const GetDurationFormat = (duration) => {
  let time = duration / 1000;
  let minutes = Math.floor(time / 60);
  let timeForSeconds = time - minutes * 60;
  let seconds = Math.floor(timeForSeconds);
  let secondsReadable = seconds > 9 ? seconds : `0${seconds}`;
  return `${minutes}:${secondsReadable}`;
};
export const FIREBASE_KEY = "AIzaSyC7DgkbTD-uT_KenPEeQvkJmxLMxJhsZdY";

export const FIREBASE_SERVER_KEY =
  "AAAArDHO_7o:APA91bFsQEUfg7M88b0IqAAejz9DhkYnuhYPpkGays-xb0rw3QCnR3gg6WAvfVV3-Kzvq-lsysHaAP0xwRIYCRZjIDqDGJrdtEW1yAN66azYjEefy3cMUKSZ5G8WPLdRBxv7k7AUD4O9";
// "BCZkRCLADGv48tcDbI_b2uuoE1PgQDVoEkPiWNfEvSBUJur4KEX2W2yvC2VBxwKJQ_7JcdctkSyENnaBaXpfvRo";

// export const FIREBASE_KEY='AIzaSyARu_QhNIlexdBMIL-IxFn0ghR8sqOawII'

// export var timeSince = function (date) {
//   if (typeof date !== "object") {
//     date = new Date(date);
//   }
//   var seconds = Math.floor(moment(new Date() - date) / 1000);
//   var intervalType;
//   var interval = Math.floor(seconds / 31536000);
//   if (interval >= 1) {
//     intervalType = "year";
//   } else {
//     interval = Math.floor(seconds / 2592000);
//     if (interval >= 1) {
//       intervalType = "month";
//     } else {
//       interval = Math.floor(seconds / 86400);
//       if (interval >= 1) {
//         intervalType = "day";
//       } else {
//         interval = Math.floor(seconds / 3600);
//         if (interval >= 1) {
//           intervalType = "hour";
//         } else {
//           interval = Math.floor(seconds / 60);
//           if (interval >= 1) {
//             intervalType = "min";
//           } else {
//             interval = seconds;
//             intervalType = "sec";
//           }
//         }
//       }
//     }
//   }
//   if (interval > 1 || interval === 0) {
//     intervalType += "s";
//   }
//   return interval + " " + intervalType;
// };
export var timeSince = function (date) {
  const currentDate = new Date();
  const targetTime = new Date(date);
  const timeDifference = currentDate - targetTime;
  // console.log("targetTime-------", targetTime);
  // console.log("timeDifference-------", timeDifference);
  const seconds = Math.floor(timeDifference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const weeks = Math.floor(days / 7);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (years > 0) {
    return years === 1 ? `${years} year ago` : `${years} years ago`;
  } else if (months > 0) {
    return months === 1 ? `${months} month ago` : `${months} months ago`;
  } else if (weeks > 0) {
    return weeks === 1 ? `${weeks} week ago` : `${weeks} weeks ago`;
  } else if (days > 0) {
    return days === 1 ? `${days} day ago` : `${days} days ago`;
  } else if (hours > 0) {
    return hours === 1 ? `${hours} hour ago` : `${hours} hours ago`;
  } else if (minutes > 0) {
    return minutes === 1 ? `${minutes} min ago` : `${minutes} mins ago`;
  } else {
    return seconds === 1 ? `${seconds} sec ago` : `${seconds} secs ago`;
  }
};
export const convertUTCToLocalTime = (date) => {
  const convertedTime = date.replace(" ", "T") + ".000Z";
  const localTime = new Date(convertedTime);
  return localTime;
};

export const convertTime = (givenTime) => {
  const currentTime = new Date(); // Get the current date and time

  const [hour, minute] = givenTime.split(":");
  const [meridian] = givenTime.split(" ")[1];

  let hours = parseInt(hour, 10);
  if (meridian.toLowerCase() === "pm" && hours !== 12) {
    hours += 12;
  } else if (meridian.toLowerCase() === "am" && hours === 12) {
    hours = 0;
  }

  currentTime.setHours(hours);
  currentTime.setMinutes(parseInt(minute, 10));
  console.log("currentTimecurrentTime-----", currentTime);
  return currentTime;
};

export const convertTimeToMinutes = (time) => {
  const [hours, minutes] = time.split(":");
  const [rawMinutes, meridiem] = minutes.split(" ");

  let totalMinutes = parseInt(hours, 10) * 60 + parseInt(rawMinutes, 10);

  if (meridiem === "pm" && hours !== "12") {
    totalMinutes += 12 * 60;
  }

  return totalMinutes;
};
// export const numericFormatted = (number) => {
//   if (number) {
//     const formattedNumber = new Intl.NumberFormat("en-US").format(number);
//     return formattedNumber;
//   }
// };
export const getTimeOfDayGreeting = () => {
  const currentHour = new Date().getHours();
  if (currentHour >= 5 && currentHour < 12) {
    return "Good morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    return "Good afternoon";
  } else {
    return "Good night";
  }
};
export const getTimePeriod = () => {
  var today = new Date();
  var curHr = today.getHours();
  if (curHr < 12) {
    return "Good Morning";
  } else if (curHr < 16) {
    return "Good Afternoon";
  } else if (curHr < 20) {
    return "Good Evening";
  } else {
    return "Good Night";
  }
};

export const getAccountApproval = async (show, navigation, auth) => {
  let userId = await getData(storageKey?.USER_ID);
  let userRole = await getData(storageKey?.USER_ROLE);
  let status = await getData(storageKey?.APPROVAL_STATUS);
  let accountApproval = JSON?.parse(status);
  if (show && auth?.navigator == routeName?.GUEST_STACKS && !userId) {
    Alert.alert("Notice", "You need to login to perform this action !", [
      {
        text: "Ok",
        style: "cancel",
      },
      {
        text: "Login",
        onPress: () => {
          navigation?.navigate(routeName?.SIGNIN);
          // dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
        },
      },
    ]);
  } else if (show && !accountApproval) {
    Alert.alert(
      "Application Verification in progress",
      "Thank you for submitting an application to Book Sculp. Our team will review your application within two weeks. If we think you are a good fit then we'll be in touch.",
      [
        {
          text: "Ok",
          style: "cancel",
        },
        {
          text: "Edit Application",
          onPress: () =>
            userRole == 11 || userRole == 12 || userRole == 15
              ? navigation?.navigate(routeName?.EDIT_PROFILE)
              : navigation?.navigate(routeName?.EDIT_PHOTOGRAPHER),
        },
      ]
    );
  }

  // return (
  //   <Modal
  //     transparent={true}
  //     visible={true}
  //     animationType="slide"
  //     // useNativeDriver={true}
  //     // onRequestClose={false}
  //   >
  //     <View style={styles.approvalModal}>
  //       <AccountApproval />
  //     </View>
  //   <View style={{marginLeft: wp('2%'), alignSelf: 'center'}}>
  //   <Text
  //     style={{color: headingcolor, fontSize: 17, fontWeight: 'bold'}}>
  //     Hi, {userInfo?.first_name} 👋
  //   </Text>
  //   <Text style={{color: headingcolor, fontSize: 12}}>
  //     {currenttime}
  //   </Text>
  // </View>
  //   </Modal>
  // );
};

export const getImageDimensions = (source) => {
  const { height } = Image.resolveAssetSource(source);
  return height;
};
const incrementAppOpenedCount = async () => {
  try {
    const count = await getData(storageKey?.APP_OPENED_KEY);
    const newCount = (parseInt(count) || 0) + 1;
    storeData(storageKey?.APP_OPENED_KEY, newCount.toString());
  } catch (error) {
    console.error("Error incrementing app opened count:", error);
  }
};

const getAppOpenedCount = async () => {
  try {
    const count = await getData(storageKey?.APP_OPENED_KEY);
    return parseInt(count) || 0;
  } catch (error) {
    console.error("Error getting app opened count:", error);
    return 0;
  }
};

const startAppOpenedTracking = (onAppStateChange) => {
  AppState.addEventListener("change", onAppStateChange);
};

const stopAppOpenedTracking = (onAppStateChange) => {
  AppState.removeEventListener("change", onAppStateChange);
};

export {
  incrementAppOpenedCount,
  getAppOpenedCount,
  startAppOpenedTracking,
  stopAppOpenedTracking,
};

export const handleSubscriptionAlert = async (navigation) => {
  let status = await getData(storageKey?.APPROVAL_STATUS);
  let hideStatus = await getData(storageKey?.SUBSCRIPTION_HIDE);
  let userRole = await getData(storageKey?.USER_ROLE);
  let packageId = await getData(storageKey?.PACKAGE_ID);
  let accountApproval = JSON?.parse(status);
  let id = JSON?.parse(packageId);
  let hide = JSON.parse(hideStatus);
  if (userRole == 11 || userRole == 13 || userRole == 15) {
    setTimeout(() => {
      if (!hide && accountApproval && id == 107) {
        Alert.alert(
          "Upgrade Subscription?",
          "You currently have a hobby plan. Upgrade to unlock more benefits.",
          [
            {
              text: "No",
              style: "cancel",
            },
            {
              text: "Yes",
              onPress: () => navigation?.navigate(routeName?.PACKAGES),
            },
          ]
        );
      }
    }, 3000);
  }
};
export const getUserRole = async () => {
  var userRole = await getData(storageKey?.USER_ROLE);
  console.log("getUserRolerolerolerole----", userRole);
  return userRole;
};

const styles = StyleSheet.create({
  approvalModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // bottom: "10%",
    // height: dimensionheight("100%"),
    // top: "10%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: "100%",
    elevation: 3,
    // paddingVertical: 20,
  },
});
