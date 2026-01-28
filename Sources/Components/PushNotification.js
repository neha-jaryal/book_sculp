import React, { useContext, useEffect } from "react";
import messaging from "@react-native-firebase/messaging";
import notifee from "@notifee/react-native";
import * as RootNavigation from "../Navigations/RootNavigation";
import { getData, storageKey, storeData } from "../Utility/Storage";
import { routeName } from "../Utility";
import { navigatorStatus } from "../Redux/Actions/AuthActions";
import { useDispatch } from "react-redux";
import { ChatContext } from "../Context/ChatContext";
import { Platform } from "react-native";

const PushNotificationScreen = () => {
  const dispatch = useDispatch();
  const { data } = useContext(ChatContext);

  let reciverID = null;

  useEffect(() => {
    async function bootstrap() {
      // Create Android notification channel (required)
      await notifee.createChannel({
        id: "default-channel-id",
        name: "Default Channel",
        description: "A channel to categorise your notifications",
        importance: 4, // High
        badge: true,   // Enables badge/dot on Android
        vibration: true,
        sound: "default",
      });

      // Request permissions (iOS)
      if (Platform.OS === "ios") {
        await notifee.requestPermission();
      }

      // Get and store FCM token
      await messaging().registerDeviceForRemoteMessages();
      const token = await messaging().getToken();
      await storeData(storageKey?.FCM_TOKEN, JSON.stringify(token));

      // Foreground message handler (display notification + optional badge increment)
      const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
        reciverID = remoteMessage?.data?.sender_id;

        await notifee.displayNotification({
          title: remoteMessage.notification?.title,
          body: remoteMessage.notification?.body,
          data: remoteMessage.data,
          ios: {
            badge: await notifee.getBadgeCount() + 1, // Optional: auto-increment badge
          },
          android: {
            channelId: "default-channel-id",
            pressAction: { id: "default" },
          },
        });
      });

      // Background/quit tap handler
      notifee.onForegroundEvent(async ({ type, detail }) => {
        if (type === "press" && detail.notification) {
          handleNotificationTap(detail.notification);
        }
      });

      notifee.onBackgroundEvent(async ({ type, detail }) => {
        if (type === "press" && detail.notification) {
          await handleNotificationTap(detail.notification);
        }
      });

      // Initial notification (app opened from quit via tap)
      const initial = await notifee.getInitialNotification();
      if (initial) {
        await handleNotificationTap(initial.notification);
      }

      return unsubscribeForeground;
    }

    bootstrap();
  }, []);

  const handleNotificationTap = async (notification) => {
    const notificationData = notification?.data;
    if (!notificationData) return;

    reciverID = notificationData?.sender_id;

    if (data?.user?.user_id == reciverID) return;

    await storeData(storageKey?.SUBSCRIPTION_HIDE, "true");

    const senderData = notificationData?.reciverData ? JSON.parse(notificationData.reciverData) : null;
    const receiverData = notificationData?.senderData ? JSON.parse(notificationData.senderData) : null;

    let postData = {};
    if (notificationData?.postdata) {
      try {
        postData = JSON.parse(notificationData.postdata);
      } catch (e) {}
    }

    const chatData = {
      receiverId: receiverData?.sender_id,
      senderId: senderData?.reciver_id,
      senderData: { user_data: { full_name: senderData?.reciver_firstname + " " + senderData?.reciver_lastname } },
      receiverData: {
        first_name: receiverData?.sender_firstname,
        last_name: receiverData?.sender_lastname,
        profile_image: [{ guid: receiverData?.sender_profile_img }],
      },
    };

    const navigateWithDelay = (screen, params = {}) => {
      dispatch(navigatorStatus(routeName.DRAWER, "", false));
      setTimeout(() => RootNavigation.navigate(screen, params), 200);
    };

    switch (notificationData?.type) {
      case "1":
        RootNavigation.navigate(routeName.CHAT, chatData);
        break;
      case "2":
        navigateWithDelay(routeName.FOLLOW_DETAILS);
        break;
      case "3":
      case "4":
        if (postData?.post_id) {
          navigateWithDelay(routeName.VIEW_POST_DETAILS, {
            portId: postData.post_id,
            socialId: postData.post_id,
            postType: postData.post_type === "social_post" ? "social" : "portfolio",
            routeName: notificationData.type === "4" ? routeName.NOTIFICATIONS : undefined,
          });
        }
        break;
      case "5":
        if (postData?.post_id) {
          navigateWithDelay(routeName.MANAGE_PROPOSAL, {
            project_id: postData.post_id,
            routeName: routeName.NOTIFICATIONS,
          });
        }
        break;
      case "6":
        navigateWithDelay(routeName.MANAGE_PROJECTS, { prevRoute: routeName.CHECKOUT, tab: "ongoing" });
        break;
      default:
        navigateWithDelay(routeName.NOTIFICATIONS);
        break;
    }
  };

  return null;
};

export default PushNotificationScreen;
// import React, { useContext, useEffect } from "react";
// import messaging from "@react-native-firebase/messaging";
// import PushNotification from "react-native-push-notification";
// import PushNotificationIOS from "@react-native-community/push-notification-ios";
// import * as RootNavigation from "../Navigations/RootNavigation";
// import { getData, storageKey, storeData } from "../Utility/Storage";
// import { routeName } from "../Utility";
// import { navigatorStatus } from "../Redux/Actions/AuthActions";
// import { useDispatch } from "react-redux";
// import { ChatContext } from "../Context/ChatContext";
// const PushNotificationScreen = (route) => {
//   const dispatch = useDispatch();
//   const { data } = useContext(ChatContext);
//   var reciverID;
//   useEffect(() => {
//     PushNotification.configure({
//       onRegister: async function (token) {
//         PushNotification.getDeliveredNotifications((callback) => {});
//         const device_token = await messaging().getToken();
//         storeData(storageKey?.FCM_TOKEN, JSON.stringify(device_token));
//         PushNotification.createChannel({
//           channelId: "default-channel-id",
//           channelName: "default channel",
//           channelDescription: "A channel to categorise your notifications",
//           soundName: "default",
//           importance: 4,
//           vibrate: true,
//           badge: true,
//         });

//         messaging().onMessage(async (remoteMessage) => {
//           reciverID = remoteMessage?.data?.sender_id;
//         });
//       },

//       onNotification: async function (notification) {
//         var notificationdetail = JSON.stringify(notification);
//         reciverID = notification?.data?.sender_id;
//         if (data?.user?.user_id == reciverID) return;
//         if (notification?.foreground) {
//           PushNotification.localNotification({
//             channelId: "default-channel-id",
//             title: notification.title,
//             message: notification.message,
//             picture: "",
//             data: notification.data,
//             userInfo: {},
//             playSound: true,
//             icon: "image",
//             soundName: "default",
//             // number: 10,
//             priority: "high",
//             visibility: "private",
//             channelName: "defaultChannel",
//             channelDescription: "A channel to categorise your notifications",
//             // importance: 4,
//             vibrate: true,
//             badge: true,
//           });
//         }
//         if (notification?.userInteraction) {
//           storeData(storageKey?.SUBSCRIPTION_HIDE, "true");
//           const senderData = JSON?.parse(notification?.data?.reciverData);
//           const receiverData = JSON?.parse(notification?.data?.senderData);
//           var postData = {};
//           if (notification?.data?.postdata) {
//             postData = JSON?.parse(notification?.data?.postdata);
//           }
//           const chatData = {
//             receiverId: receiverData?.sender_id,
//             senderId: senderData?.reciver_id,
//             senderData: {
//               user_data: {
//                 full_name:
//                   senderData?.reciver_firstname +
//                   " " +
//                   senderData?.reciver_lastname,
//               },
//             },
//             receiverData: {
//               first_name: receiverData?.sender_firstname,
//               last_name: receiverData?.sender_lastname,
//               profile_image: [{ guid: receiverData?.sender_profile_img }],
//             },
//           };
//           if (notification?.data?.type == 1) {
//             if (notification?.foreground && chatData) {
//               RootNavigation.navigate(routeName.CHAT, chatData);
//             } else {
//               dispatch(navigatorStatus(routeName.DRAWER, "", false));

//               setTimeout(() => {
//                 RootNavigation.navigate(routeName.CHAT, chatData);
//               }, 200);
//             }
//           } else if (notification?.data?.type == 2) {
//             if (notification?.foreground) {
//               RootNavigation.navigate(routeName.FOLLOW_DETAILS);
//             } else {
//               dispatch(navigatorStatus(routeName.DRAWER, "", false));
//               setTimeout(() => {
//                 RootNavigation.navigate(routeName.FOLLOW_DETAILS);
//               }, 200);
//             }
//           } else if (notification?.data?.type == 3 && postData) {
//             if (notification?.foreground) {
//               RootNavigation.navigate(routeName.VIEW_POST_DETAILS, {
//                 portId: postData?.post_id,
//                 socialId: postData?.post_id,
//                 postType:
//                   postData.post_type == "social_post" ? "social" : "portfolio",
//               });
//             } else {
//               dispatch(navigatorStatus(routeName.DRAWER, "", false));
//               setTimeout(() => {
//                 RootNavigation.navigate(routeName.VIEW_POST_DETAILS, {
//                   portId: postData?.post_id,
//                   socialId: postData?.post_id,
//                   postType:
//                     postData.post_type == "social_post"
//                       ? "social"
//                       : "portfolio",
//                 });
//               }, 200);
//             }
//           } else if (notification?.data?.type == 4 && postData) {
//             if (notification?.foreground) {
//               RootNavigation.navigate(routeName.VIEW_POST_DETAILS, {
//                 portId: postData?.post_id,
//                 socialId: postData?.post_id,
//                 postType:
//                   postData.post_type == "social_post" ? "social" : "portfolio",
//                 routeName: routeName?.NOTIFICATIONS,
//               });
//             } else {
//               dispatch(navigatorStatus(routeName.DRAWER, "", false));
//               setTimeout(() => {
//                 RootNavigation.navigate(routeName.VIEW_POST_DETAILS, {
//                   portId: postData?.post_id,
//                   socialId: postData?.post_id,
//                   postType:
//                     postData.post_type == "social_post"
//                       ? "social"
//                       : "portfolio",
//                   routeName: routeName?.NOTIFICATIONS,
//                 });
//               }, 200);
//             }
//           } else if (notification?.data?.type == 5 && postData) {
//             if (notification?.foreground) {
//               RootNavigation.navigate(routeName.MANAGE_PROPOSAL, {
//                 project_id: postData?.post_id,
//                 routeName: routeName?.NOTIFICATIONS,
//               });
//             } else {
//               dispatch(navigatorStatus(routeName.DRAWER, "", false));
//               setTimeout(() => {
//                 RootNavigation.navigate(routeName.MANAGE_PROPOSAL, {
//                   project_id: postData?.post_id,
//                   routeName: routeName?.NOTIFICATIONS,
//                 });
//               }, 200);
//             }
//           } else if (notification?.data?.type == 6) {
//             if (notification?.foreground) {
//               RootNavigation.navigate(routeName?.MANAGE_PROJECTS, {
//                 prevRoute: routeName?.CHECKOUT,
//                 tab: "ongoing",
//               });
//             } else {
//               dispatch(navigatorStatus(routeName.DRAWER, "", false));
//               setTimeout(() => {
//                 RootNavigation.navigate(routeName?.MANAGE_PROJECTS, {
//                   prevRoute: routeName?.CHECKOUT,
//                   tab: "ongoing",
//                 });
//               }, 200);
//             }
//           } else {
//             dispatch(navigatorStatus(routeName.DRAWER, "", false));
//             setTimeout(() => {
//               RootNavigation?.navigate(routeName.NOTIFICATIONS);
//             }, 200);
//           }
//         }

//         PushNotification.getDeliveredNotifications((callback) => {});
//         notification.finish(PushNotificationIOS.FetchResult.NoData);
//       },
//       permissions: {
//         alert: true,
//         badge: true,
//         sound: true,
//         playSound: true,
//         vibrate: true,
//       },
//       popInitialNotification: true,
//       requestPermissions: true,
//     });
//   }, []);
//   return null;
// };
// export default PushNotificationScreen;
