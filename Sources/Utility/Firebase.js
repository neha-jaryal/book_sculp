// firebase.js
import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import storage from '@react-native-firebase/storage';
import firestore from '@react-native-firebase/firestore';

// Optional: if you need AsyncStorage for something else
// import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyC7DgkbTD-uT_KenPEeQvkJmxLMxJhsZdY",
  authDomain: "booksculp-572d3.firebaseapp.com",
  projectId: "booksculp-572d3",
  storageBucket: "booksculp-572d3.firebasestorage.app",
  messagingSenderId: "646055473905",
  appId: "1:646055473905:web:d1bce769bdfc3bcc77ef50",
  measurementId: "G-1M5GFCJQ8Y",
  databaseURL: "https://booksculp-572d3-default-rtdb.firebaseio.com",
};

// Default app is auto-initialized natively (via plist/json + FirebaseApp.configure())
// Use it directly — no manual initializeApp needed for default
export const firebaseAuth = auth();           // default auth
export const storageRef   = storage();
export const db           = firestore();
export const firebaseDB   = firestore();      // alias — remove if not needed

export const firebaseAnalytics = analytics();

// Secondary app: 'adminApp' (JS-config only, since no separate native files)
let adminApp;
let adminAuthInstance;

(async () => {
  try {
    // Check if already exists (safe on hot reload / re-import)
    adminApp = firebase.apps.find(app => app.name === 'adminApp');

    if (!adminApp) {
      // initializeApp returns Promise<FirebaseApp> — await it!
      adminApp = await firebase.initializeApp(firebaseConfig, { name: 'adminApp' });
      console.log('Secondary adminApp initialized:', adminApp.name);
    } else {
      console.log('Secondary adminApp already exists:', adminApp.name);
    }

    // Now safe to create auth instance for secondary app
    adminAuthInstance = auth(adminApp);

    // Persistence is LOCAL by default on RN — only set if needed (and async!)
    // await adminAuthInstance.setPersistence(auth.Auth.Persistence.LOCAL);
    // console.log('adminAuth persistence set to LOCAL');

  } catch (error) {
    console.error('Failed to initialize secondary adminApp / auth:', error);
  }
})();

// Export the secondary auth — it will be set once the promise resolves
// Usage: await adminAuth.currentUser or in useEffect/onAuthStateChanged
export const adminAuth = {
  // Proxy to the instance (or undefined until ready)
  get instance() {
    return adminAuthInstance;
  },
  // Or just export the promise if you prefer to await everywhere
  ready: new Promise(resolve => {
    const check = setInterval(() => {
      if (adminAuthInstance) {
        clearInterval(check);
        resolve(adminAuthInstance);
      }
    }, 100);
  }),
};

export default firebaseAnalytics;

// set -e

// WITH_ENVIRONMENT="../node_modules/react-native/scripts/xcode/with-environment.sh"
// REACT_NATIVE_XCODE="../node_modules/react-native/scripts/react-native-xcode.sh"
 
// ../node_modules/react-native/scripts/react-native-xcode.sh"

// /bin/sh -c "$WITH_ENVIRONMENT $REACT_NATIVE_XCODE"

// import { getApp, initializeApp } from "firebase/app";
// import { getAnalytics, isSupported } from "firebase/analytics";
// import { getStorage } from "firebase/storage";
// import { getFirestore } from "firebase/firestore";
// import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
// import {
//   initializeAuth,
//   getReactNativePersistence,
//   getAuth,
// } from "firebase/auth";
// import AsyncStorage from "@react-native-async-storage/async-storage";

// const firebaseConfig = {
//   apiKey: "AIzaSyC7DgkbTD-uT_KenPEeQvkJmxLMxJhsZdY",
//   authDomain: "booksculp-572d3.firebaseapp.com",
//   projectId: "booksculp-572d3",
//   storageBucket: "booksculp-572d3.firebasestorage.app",
//   messagingSenderId: "646055473905",
//   appId: "1:646055473905:web:d1bce769bdfc3bcc77ef50",
//   measurementId: "G-1M5GFCJQ8Y",
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);
// export const firebaseAuth = initializeAuth(app, {
//   persistence: getReactNativePersistence(ReactNativeAsyncStorage),
//   experimentalForceLongPolling: true,
// });
// // Admin auth
// let adminApp;
// try {
//   adminApp = getApp("adminApp");
// } catch (err) {
//   adminApp = initializeApp(firebaseConfig, "adminApp");
// }
// export const adminAuth = getAuth(adminApp, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

// const analytics = "";
// async function setupAnalytics() {
//   const isAnalyticsSupported = await isSupported();
//   if (isAnalyticsSupported) {
//     analytics = getAnalytics(app);
//     // Additional analytics setup can be done here
//   }
// }

// // Call the function to set up analytics
// setupAnalytics();

// // export const auth = getAuth();
// export const storage = getStorage();
// export const db = getFirestore();
// export const firebaseDB = getFirestore(app);
// export default analytics;

// const firebaseConfig = {
//   apiKey: "AIzaSyARu_QhNIlexdBMIL-IxFn0ghR8sqOawII",
//   authDomain: "chatsculp-e61df.firebaseapp.com",
//   projectId: "chatsculp-e61df",
//   storageBucket: "chatsculp-e61df.appspot.com",
//   messagingSenderId: "117769981907",
//   appId: "1:117769981907:web:63d0d784ae2b8f25436926",
//   measurementId: "G-JZQ01M15E1"
// };

// const firebaseConfig = {
//   apiKey: "AIzaSyBIsJ_xuyftAv2c3rEnhaWYrNhxZTQWpx4",
//   authDomain: "booksculp-47a10.firebaseapp.com", // https://console.firebase.google.com/project/booksculp-47a10/firestore/databases/-default-/rules
//   projectId: "booksculp-47a10",
//   storageBucket: "booksculp-47a10.appspot.com",
//   messagingSenderId: "712112377807",
//   appId: "1:712112377807:web:afd8224f61733611628cba",
//   measurementId: "G-FJLJJR3DY1",
// };

// export const storeUserToken = async (userId) => {
//   try {
//     const token = await messaging().getToken();
//     console.log("FCM Token:", token);
//     await storeData(storageKey?.FCM_TOKEN, JSON?.stringify(token));
//     await setDoc(
//       doc(db, "users", userId),
//       { fcmToken: token },
//       { merge: true }
//     );
//   } catch (error) {
//     console.error("Error storing user token:", error);
//   }
// };

// export const getRecipientToken = async (recipientId) => {
//   try {
//     const recipientDoc = await getDoc(doc(db, "users", recipientId));
//     if (recipientDoc.exists) {
//       const recipientData = recipientDoc.data();
//       return recipientData.fcmToken; // Return the stored FCM token
//     } else {
//       console.log("Recipient not found");
//       return null;
//     }
//   } catch (error) {
//     console.error("Error fetching recipient token:", error);
//     return null;
//   }
// };
