import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { routeName } from "./routeName";
import { adminAuth, db, firebaseAuth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { useDispatch } from "react-redux";
import { signOut } from "firebase/auth";
import { FIREBASE_KEY } from ".";
import { useNavigation } from "@react-navigation/native";
import {
  addFirebaseUid,
  getFirebaseUser,
} from "../Redux/Services/AuthServices";
import { getData, storageKey } from "./Storage";

export const handleFirebaseLogin = async (email) => {
  try {
    let res = await signInWithEmailAndPassword(
      firebaseAuth,
      email,
      FIREBASE_KEY
    );
    console.log("handleFirebaseLogin resresresres-----", res);
  } catch (err) {
    console.log("handleFirebaseLogin error", err);
  }
};

export const doubleEncodedData = (body) => {
  let data = JSON.stringify(body);
  let encodeData = btoa(data);
  let encoded = btoa(`sculp_${encodeData}`);
  return encoded;
};

// Custom hook to handle the message logic
export const useHandleMessage = () => {
  const { currentUser } = useContext(AuthContext);
  const navigation = useNavigation();
  const dispatch = useDispatch();

  const updateUserStatus = async (userId, status) => {
    if (userId) {
      try {
        await setDoc(
          doc(db, "userStatus", userId),
          { status },
          { merge: true }
        );
      } catch (error) {
        console.error("Error updating status:", error.message);
      }
    }
  };

  const handleFirebaseLogin = async (
    password,
    email,
    uid,
    displayName,
    setLoading,
    photoURL,
    id
  ) => {
    try {
      setLoading(true);
      try {
        await signInWithEmailAndPassword(
          firebaseAuth,
          currentUser?.email,
          password
        );
      } catch (error) {
        console.log("erroro---", error);
      }

      await createChatCollection(
        email,
        uid,
        displayName,
        setLoading,
        photoURL,
        id
      );
    } catch (err) {
      setLoading(false);
    }
  };

  const getUserByEmail = async (email) => {
    const userData = await getFirebaseUser(email);
    if (userData) return userData;
  };

  const handleFirebaseRegister = async (
    password,
    email,
    displayName,
    setLoading,
    photoURL,
    id,
    user_type,
    user_email
  ) => {
    setLoading(true);
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userDetails = await getUserByEmail(cleanEmail);
      const providerIds = userDetails?.user?.providerData.map(
        (p) => p?.providerId
      );

      const hasGoogle = providerIds.includes("google.com");
      const hasApple = providerIds.includes("apple.com");
      const hasPassword = providerIds.includes("password");
      let nextUser;

      if (hasGoogle || hasApple) {
        const userCredential = await signInWithCustomToken(
          adminAuth,
          userDetails?.user?.customToken
        );
        nextUser = userCredential.user;
      } else if (hasPassword) {
        try {
          const res = await createUserWithEmailAndPassword(
            firebaseAuth,
            cleanEmail,
            password
          );
          nextUser = res.user;
          console.log("✅ Firebase User Created:", nextUser.uid);
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            console.log("⚠️ Email already exists, logging in instead...");
            const userCredential = await signInWithEmailAndPassword(
              adminAuth,
              cleanEmail,
              password
            );
            nextUser = userCredential?.user;
          } else {
            console.error("❌ Firebase Error:", err.code, err.message);
            setLoading(false);
            return;
          }
        }
      } else {
        console.log(
          "User already registered via provider:",
          userDetails.providerUserInfo[0]?.providerId
        );
        return null;
      }

      const userData = {
        user_email: email,
        displayName: displayName || userData?.display_name,
        profile_image: photoURL,
        user_id: id,
        user_role: user_type,
      };
      handleFirebaseTable(nextUser, userData, setLoading);
    } catch (err) {
      setLoading(false);
    }
  };

  const handleFirebaseTable = async (nextUser, userData, setLoading) => {
    setLoading(true);
    await updateProfile(nextUser, {
      displayName: userData?.displayName,
      photoURL: userData?.profile_image || "",
      user_id: userData?.user_id,
      user_type: userData?.user_role,
    });
    console.log("✅ Updated Profile successfully !");
    await setDoc(doc(db, "users", nextUser.uid), {
      uid: nextUser.uid,
      displayName: userData?.displayName,
      email: userData?.user_email,
      photoURL: userData?.profile_image,
      user_id: userData?.user_id,
    });
    await setDoc(doc(db, "userChats", nextUser.uid), {});
    const body = {
      user_id: userData.id || userData?.user_id,
      chat_udi: nextUser.uid,
    };
    const response = await dispatch(addFirebaseUid(body));
    if (response?.status === 200) {
      await updateUserStatus(nextUser.uid, "offline");
      await signOut(adminAuth);
      // await createChatCollection(email, res.user.uid, displayName, setLoading, photoURL);
      await handleFirebaseLogin(
        FIREBASE_KEY,
        userData?.user_email,
        nextUser.uid,
        userData?.displayName,
        setLoading,
        userData?.profile_image,
        userData?.user_id
      );
    }
    setLoading(false);
  };

  const createChatCollection = async (
    email,
    uid,
    displayName,
    setLoading,
    photoURL,
    id
  ) => {
    setLoading(true);
    const combinedId =
      currentUser.uid > uid ? currentUser.uid + uid : uid + currentUser.uid;
    const user_id = await getData(storageKey?.USER_ID);
    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create a chat in the chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Create user chats
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: uid,
            displayName: displayName,
            email: email,
            photoURL: photoURL,
            user_id: id,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            user_id: user_id,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
        setLoading(false);
        navigation?.navigate(routeName?.CHAT, {
          displayName: displayName,
          uid: uid,
          photoURL: photoURL,
          chatId: combinedId,
        });
      } else {
        setLoading(false);
        await updateDoc(doc(db, "userChats", currentUser?.uid), {
          [combinedId + ".userInfo"]: {
            uid: uid,
            displayName: displayName,
            email: email,
            photoURL: photoURL,
            user_id: id,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            user_id: user_id,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        navigation?.navigate(routeName?.CHAT, {
          displayName: displayName,
          uid: uid,
          photoURL: photoURL,
          chatId: combinedId,
        });
      }
    } catch (err) {
      setLoading(false);
      console.error("Error handling message:", err);
    }
    setLoading(false);
  };

  const checkUIDInFirestore = async (uid) => {
    if (!uid) {
      return false;
    }
    const ref = doc(db, "users", uid.trim());
    const snapshot = await getDoc(ref);
    return snapshot.exists();
  };

  const handleMessage = async (
    email,
    uid,
    displayName,
    setLoading,
    photoURL,
    id,
    user_type
  ) => {
    setLoading(true);
    console.log(
      " handleMessage------",
      email,
      uid,
      displayName,
      setLoading,
      photoURL,
      id,
      user_type
    );
    const existingUID = await checkUIDInFirestore(uid);
    if (email) {
      if ((!uid && !existingUID) || (uid && !existingUID)) {
        await handleFirebaseRegister(
          FIREBASE_KEY,
          email,
          displayName,
          setLoading,
          photoURL,
          id,
          user_type
        );
      } else if (uid && existingUID) {
        // await signOut(auth);
        await createChatCollection(
          email,
          uid,
          displayName,
          setLoading,
          photoURL,
          id,
          user_type
        );
      }
    }
  };

  return handleMessage;
};

//   const handleMessage = async (
//     email,
//     uid,
//     displayName,
//     setLoading,
//     photoURL,
//     id
//   ) => {
//     if (email) {
//       if (!uid) {
//         // await signOut(firebaseAuth);
//         await handleFirebaseRegister(
//           FIREBASE_KEY,
//           email,
//           displayName,
//           setLoading,
//           photoURL,
//           id
//         );
//       } else {
//         await createChatCollection(
//           email,
//           uid,
//           displayName,
//           setLoading,
//           photoURL,
//           id
//         );
//       }
//     }
//   };
//   return handleMessage;
// };
