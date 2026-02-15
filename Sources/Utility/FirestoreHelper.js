import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";
import {
  doc,
  getDoc,
  serverTimestamp,
  setDoc,
  updateDoc,
} from "@react-native-firebase/firestore"; // ← modular import
import { routeName } from "./routeName";
import { adminAuth, db, firebaseAuth } from "./Firebase";
import {
  createUserWithEmailAndPassword,
  signInWithCustomToken,
  signInWithEmailAndPassword,
  updateProfile,
  signOut,
  getAuth,
} from "@react-native-firebase/auth"; // ← modular import
import { useDispatch } from "react-redux";
import { FIREBASE_KEY } from ".";
import { useNavigation } from "@react-navigation/native";
import {
  addFirebaseUid,
  getFirebaseUser,
} from "../Redux/Services/AuthServices";
import { getData, storageKey } from "./Storage";

export const handleFirebaseLogin = async (email) => {
  try {
    const authInstance = getAuth();
    let res = await signInWithEmailAndPassword(authInstance, email, FIREBASE_KEY);
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

  const authInstance = getAuth();     // modular auth
  const firestore = db;               // already modular from your import

  const updateUserStatus = async (userId, status) => {
    if (userId) {
      try {
        await setDoc(
          doc(firestore, "userStatus", userId),
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
        await signInWithEmailAndPassword(authInstance, currentUser?.email, password);
      } catch (error) {
        console.log("Sign-in error:", error);
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
      console.error("Login handling error:", err);
      setLoading(false);
    }
  };

  const getUserByEmail = async (email) => {
    const userData = await getFirebaseUser(email);
    if (userData) return userData;
    return null;
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
      const providerIds = userDetails?.user?.providerData?.map(
        (p) => p?.providerId
      ) || [];

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
            authInstance,
            cleanEmail,
            password
          );
          nextUser = res.user;
          console.log("✅ Firebase User Created:", nextUser.uid);
        } catch (err) {
          if (err.code === "auth/email-already-in-use") {
            console.log("⚠️ Email already exists, logging in instead...");
            const userCredential = await signInWithEmailAndPassword(
              authInstance,
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
          userDetails?.providerUserInfo?.[0]?.providerId
        );
        return null;
      }

      const userData = {
        user_email: email,
        displayName: displayName || userDetails?.display_name,
        profile_image: photoURL,
        user_id: id,
        user_role: user_type,
      };

      await handleFirebaseTable(nextUser, userData, setLoading);
    } catch (err) {
      console.error("Register error:", err);
      setLoading(false);
    }
  };

  const handleFirebaseTable = async (nextUser, userData, setLoading) => {
    setLoading(true);
    try {
      await updateProfile(nextUser, {
        displayName: userData?.displayName,
        photoURL: userData?.profile_image || "",
      });

      console.log("✅ Updated Profile successfully !");

      await setDoc(doc(firestore, "users", nextUser.uid), {
        uid: nextUser.uid,
        displayName: userData?.displayName,
        email: userData?.user_email,
        photoURL: userData?.profile_image,
        user_id: userData?.user_id,
      });

      await setDoc(doc(firestore, "userChats", nextUser.uid), {});

      const body = {
        user_id: userData.id || userData?.user_id,
        chat_udi: nextUser.uid,
      };

      const response = await dispatch(addFirebaseUid(body));
      if (response?.status === 200) {
        await updateUserStatus(nextUser.uid, "offline");
        await signOut(adminAuth);

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
    } catch (err) {
      console.error("Firebase table error:", err);
    } finally {
      setLoading(false);
    }
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
      const chatRef = doc(firestore, "chats", combinedId);
      const chatSnap = await getDoc(chatRef);

      if (!chatSnap.exists()) {
        // Create chat
        await setDoc(chatRef, { messages: [] });

        // Update both users' chat lists
        await updateDoc(doc(firestore, "userChats", currentUser.uid), {
          [`${combinedId}.userInfo`]: {
            uid,
            displayName,
            email,
            photoURL,
            user_id: id,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, "userChats", uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            user_id,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      } else {
        // Chat exists → just update timestamps/user info
        await updateDoc(doc(firestore, "userChats", currentUser?.uid), {
          [`${combinedId}.userInfo`]: {
            uid,
            displayName,
            email,
            photoURL,
            user_id: id,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });

        await updateDoc(doc(firestore, "userChats", uid), {
          [`${combinedId}.userInfo`]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName,
            email: currentUser.email,
            photoURL: currentUser.photoURL,
            user_id,
          },
          [`${combinedId}.date`]: serverTimestamp(),
        });
      }

      navigation?.navigate(routeName?.CHAT, {
        displayName,
        uid,
        photoURL,
        chatId: combinedId,
      });
    } catch (err) {
      console.error("Error handling message:", err);
    } finally {
      setLoading(false);
    }
  };

  const checkUIDInFirestore = async (uid) => {
    if (!uid) return false;
    const ref = doc(firestore, "users", uid.trim());
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
      "handleMessage------",
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
        await createChatCollection(
          email,
          uid,
          displayName,
          setLoading,
          photoURL,
          id
        );
      }
    }

    setLoading(false);
  };

  return handleMessage;
};