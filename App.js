// App.js
import "react-native-gesture-handler";
import "react-native-reanimated";

import { Provider } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { store } from "./Sources/Redux/Store/configureStore";
import MainNavigator from "./Sources/Navigations/MainNavigator";
import { AppState } from "react-native";
import { navigationRef } from "./Sources/Navigations/RootNavigation";
import { ToastContainer } from "./Sources/Components/ToastContainer";
import PushNotificationScreen from "./Sources/Components/PushNotification";
import { AuthContextProvider } from "./Sources/Context/AuthContext";
import { ChatContextProvider } from "./Sources/Context/ChatContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";

// Native Firebase SDK imports
import auth from "@react-native-firebase/auth";
import messaging from "@react-native-firebase/messaging";
import firestore from "@react-native-firebase/firestore";

import { useState, useEffect, useRef } from "react";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [appState, setAppState] = useState(AppState.currentState);
  const userIdRef = useRef(null);
  const statusIntervalRef = useRef(null);

  const updateUserStatus = async (status) => {
    if (userIdRef.current) {
      try {
        await firestore()
          .collection("userStatus")
          .doc(userIdRef.current)
          .set({ status }, { merge: true });
      } catch (error) {
        console.error("Error updating status:", error.message);
      }
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState) => {
      if (nextAppState === "active") {
        updateUserStatus("online");
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = setInterval(() => {
          updateUserStatus("online");
        }, 10000); // Keep alive every 10 seconds
      } else if (nextAppState.match(/inactive|background/)) {
        updateUserStatus("away");
        clearInterval(statusIntervalRef.current);
      }
      setAppState(nextAppState);
    };

    // Listen to Firebase Auth state changes
    const unsubscribeAuth = auth().onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
        userIdRef.current = user.uid;
        updateUserStatus("online");

        // Start keep-alive interval
        clearInterval(statusIntervalRef.current);
        statusIntervalRef.current = setInterval(() => {
          updateUserStatus("online");
        }, 10000);
      } else {
        setIsLoggedIn(false);
        updateUserStatus("offline");
        userIdRef.current = null;
        clearInterval(statusIntervalRef.current);
      }
    });

    // Listen to AppState changes
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );

    // Background message handler (required for FCM on Android)
    messaging().setBackgroundMessageHandler(async (remoteMessage) => {
      console.log("Message handled in the background!", remoteMessage);
    });

    // Cleanup on unmount
    return () => {
      unsubscribeAuth();
      subscription.remove();
      clearInterval(statusIntervalRef.current);
      if (userIdRef.current) {
        updateUserStatus("offline");
      }
    };
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AuthContextProvider>
          <ChatContextProvider>
            <NavigationContainer ref={navigationRef}>
              <MainNavigator />
              <PushNotificationScreen />
            </NavigationContainer>
            <ToastContainer />
          </ChatContextProvider>
        </AuthContextProvider>
      </Provider>
    </GestureHandlerRootView>
  );
};

export default App;
// import "react-native-gesture-handler";
// import "react-native-reanimated";
// import { Provider } from "react-redux";
// import { NavigationContainer } from "@react-navigation/native";
// import { store } from "./Sources/Redux/Store/configureStore";
// import MainNavigator from "./Sources/Navigations/MainNavigator";
// import { AppState } from "react-native";
// import { navigationRef } from "./Sources/Navigations/RootNavigation";
// import { ToastContainer } from "./Sources/Components/ToastContainer";
// import PushNotificationScreen from "./Sources/Components/PushNotification";
// import { AuthContextProvider } from "./Sources/Context/AuthContext";
// import { ChatContextProvider } from "./Sources/Context/ChatContext";
// import auth from "@react-native-firebase/auth";
// import messaging from "@react-native-firebase/messaging";
// import { db } from "./Sources/Utility/Firebase";
// import { doc, setDoc } from "firebase/firestore";
// import { useState, useEffect } from "react";
// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [appState, setAppState] = useState(AppState.currentState);
//   let userId = null;
//   let statusInterval = null;

//   const updateUserStatus = async (status) => {
//     if (userId) {
//       try {
//         await setDoc(
//           doc(db, "userStatus", userId),
//           { status },
//           { merge: true }
//         );
//       } catch (error) {
//         console.error("Error updating status:", error.message);
//       }
//     }
//   };

//   useEffect(() => {
//     const handleAppStateChange = (nextAppState) => {
//       if (nextAppState === "active") {
//         updateUserStatus("online");
//         clearInterval(statusInterval);
//         statusInterval = setInterval(() => {
//           updateUserStatus("online");
//         }, 10000);
//       } else if (nextAppState === "background" || nextAppState === "inactive") {
//         updateUserStatus("away");
//         clearInterval(statusInterval);
//       }
//       setAppState(nextAppState);
//     };

//     const unsubscribeAuth = auth().onAuthStateChanged((user) => {
//       if (user) {
//         setIsLoggedIn(true);
//         userId = user.uid;
//         updateUserStatus("online");
//         statusInterval = setInterval(() => {
//           updateUserStatus("online");
//         }, 10000);
//       } else {
//         setIsLoggedIn(false);
//         updateUserStatus("offline");
//         userId = null;
//       }
//     });

//     const subscription = AppState.addEventListener(
//       "change",
//       handleAppStateChange
//     );

//     return () => {
//       unsubscribeAuth();
//       subscription.remove();
//       clearInterval(statusInterval);
//       updateUserStatus("offline");
//     };
//   }, []);

//   messaging().setBackgroundMessageHandler(async (remoteMessage) => {
//     console.log("Message handled in the background!", remoteMessage);
//   });

//   return (
//     <Provider store={store}>
//       <AuthContextProvider>
//         <ChatContextProvider>
//           <NavigationContainer ref={navigationRef}>
//             <MainNavigator />
//             <PushNotificationScreen />
//           </NavigationContainer>
//           <ToastContainer />
//         </ChatContextProvider>
//       </AuthContextProvider>
//     </Provider>
//   );
// };
// export default App;
