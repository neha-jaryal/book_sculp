import React, { createContext, useEffect, useState } from "react";

// Native Firebase SDK only
import auth from "@react-native-firebase/auth";
import firestore from "@react-native-firebase/firestore";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  const updateUserStatus = async (status) => {
    const userId = currentUser?.uid || auth().currentUser?.uid;
    if (!userId) return;

    try {
      await firestore()
        .collection("userStatus")
        .doc(userId)
        .set({ status }, { merge: true });
    } catch (error) {
      console.error("Error updating user status:", error.message);
    }
  };

  const handleFirebaseLogout = async () => {
    try {
      await updateUserStatus("offline");

      // Only use native auth for signOut
      if (auth().currentUser) {
        await auth().signOut();
      }

      setCurrentUser(null);
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  useEffect(() => {
    // Only listen to native Firebase Auth
    const unsubscribe = auth().onAuthStateChanged((user) => {
      console.log('useruseruser0000', user)
      if (user) {
        console.log("User logged in:", user.email);
        setCurrentUser(user);
        updateUserStatus("online");
      } else {
        console.log("User logged out");
        setCurrentUser(null);
        updateUserStatus("offline");
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, handleFirebaseLogout }}>
      {children}
    </AuthContext.Provider>
  );
};

// import { createContext, useEffect, useState } from "react";
// import { db, firebaseAuth } from "../Utility/Firebase";
// import { onAuthStateChanged, signOut as signOutJS } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import auth from "@react-native-firebase/auth";

// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);

//   const updateUserStatus = async (status) => {
//     try {
//       const userId = currentUser?.uid || auth().currentUser?.uid;
//       if (!userId) return;

//       await setDoc(doc(db, "userStatus", userId), { status }, { merge: true });
//     } catch (error) {
//       console.error("Error updating user status:", error.message);
//     }
//   };

//   const handleFirebaseLogout = async () => {
//     try {
//       await updateUserStatus("offline");

//       if (auth().currentUser) {
//         await auth().signOut();
//       }

//       if (firebaseAuth.currentUser) {
//         await signOutJS(firebaseAuth);
//       }

//       setCurrentUser(null);
//     } catch (error) {
//       console.error("Error during logout:", error.message);
//     }
//   };

//   useEffect(() => {
//     const unsubscribeJS = onAuthStateChanged(firebaseAuth, (user) => {
//       if (user) {
//         console.log("JS Firebase user detected:", user.email);
//         setCurrentUser(user);
//         updateUserStatus("online");
//       } else if (auth().currentUser) {
//         console.log(
//           "Native Firebase user detected:",
//           auth().currentUser?.email
//         );
//         setCurrentUser(auth().currentUser);
//         updateUserStatus("online");
//       } else {
//         setCurrentUser(null);
//       }
//     });

//     const unsubscribeNative = auth().onAuthStateChanged((nativeUser) => {
//       if (nativeUser) {
//         console.log("Native Auth changed:", nativeUser.email);
//         setCurrentUser(nativeUser);
//         updateUserStatus("online");
//       } else if (!firebaseAuth.currentUser) {
//         setCurrentUser(null);
//       }
//     });
//     return () => {
//       unsubscribeJS();
//       unsubscribeNative();
//     };
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, handleFirebaseLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// import { createContext, useEffect, useState } from "react";
// import { db, firebaseAuth } from "../Utility/Firebase";
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { doc, setDoc } from "firebase/firestore";
// import auth from "@react-native-firebase/auth";
// export const AuthContext = createContext();

// export const AuthContextProvider = ({ children }) => {
//   const [currentUser, setCurrentUser] = useState(null);
//   const updateUserStatus = async (status) => {
//     if (currentUser) {
//       const userId = currentUser.uid;
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

//   const handleFirebaseLogout = async () => {
//     await updateUserStatus("offline");
//     await signOut(firebaseAuth || auth);
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(firebaseAuth, (user) => {
//       console.log("firebaseAuth----", auth().currentUser);

//       if (user) {
//         setCurrentUser(user);
//         updateUserStatus("online");
//       } else {
//         setCurrentUser(null);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   return (
//     <AuthContext.Provider value={{ currentUser, handleFirebaseLogout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };
