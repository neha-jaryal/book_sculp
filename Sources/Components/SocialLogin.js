import React, { useEffect, useState } from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome"; // or use react-native-vector-icons
import { Colors, Images } from "../Constants";
import auth from "@react-native-firebase/auth";
import appleAuth from "@invertase/react-native-apple-authentication";

import { routeName, showToast } from "../Utility";
import { Image } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";

import { db } from "../Utility/Firebase";

import {
  addFirebaseUid,
  checkEmailExist,
  registerToken,
  userLogin,
  userRegister,
} from "../Redux/Services/AuthServices";
import { useDispatch } from "react-redux";

import { doc, setDoc } from "firebase/firestore";
import { Platform } from "react-native";
import * as Url from "../API Services/Url";
import { getData, storageKey, storeData } from "../Utility/Storage";
import { navigatorStatus } from "../Redux/Actions/AuthActions";
import moment from "moment";
import { useNavigation } from "@react-navigation/native";
// import { LoginManager, AccessToken, Settings } from "react-native-fbsdk-next";

import { requestTrackingPermission } from "react-native-tracking-transparency";

const SocialLogin = (props) => {
  const {
    show,
    setShow,
    socialType,
    setSocialType,
    userData,
    route_from,
    tab,
    loading,
    setLoading,
    route,
  } = props;
  const currentDate = new Date();
  const pastDate = new Date(currentDate);
  const maxDate = pastDate.setFullYear(currentDate.getFullYear() - 14);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  // Settings.setAppID("2253540844932380");
  // Settings.initializeSDK();
  // LoginManager.logOut();
  const [userCreds, setUserCreds] = useState("");

  const requestPermission = async () => {
    if (Platform.OS === "ios") {
      try {
        const status = await requestTrackingPermission();
        console.log("Tracking Permission:", status);
        // Possible values: authorized | denied | restricted | not-determined
      } catch (error) {
        console.log("Tracking permission error:", error);
      }
    }
  };

  useEffect(() => {
    GoogleSignin.configure({
      webClientId:
        "646055473905-qos5st7u0a5knrnlahspdafvpv0a9076.apps.googleusercontent.com",
      iosClientId:
        "646055473905-qos5st7u0a5knrnlahspdafvpv0a9076.apps.googleusercontent.com",
      scopes: [
        "https://www.googleapis.com/auth/userinfo.email",
        "https://www.googleapis.com/auth/user.gender.read",
        "https://www.googleapis.com/auth/userinfo.profile",
        "https://www.googleapis.com/auth/user.birthday.read",
        "openid",
      ],
    });
  }, []);

  const handleFirebaseLogin = async (email) => {
    dispatch(navigatorStatus(routeName?.DRAWER, "", false));
  };
  const registerDevice = async () => {
    let userId = await getData(storageKey?.USER_ID);
    let fcmToken = await getData(storageKey?.FCM_TOKEN);
    var body = {
      user_id: userId,
      device_token: JSON.parse(fcmToken),
    };
    await dispatch(registerToken(body));
  };
  const handleUserLogin = async (res, data) => {
    const userRole = res?.results?.user_role;
    let modelType;
    if (userRole == 12) {
      modelType = "Client";
    } else if (userRole == 13) {
      modelType = "Photographer";
    } else if (res?.results?.model_type == "model") {
      modelType = "Model";
    } else if (res?.results?.model_type == "child" && userRole == 11) {
      modelType = "Model Kid";
    } else if (res?.results?.model_type == "photographer" || userRole == 13) {
      modelType = "Photographer";
    } else if (userRole == 15 && res?.results?.model_type == "actor") {
      modelType = "Actor";
    } else if (userRole == 15 && res?.results?.model_type == "child") {
      modelType = "Actor Kid";
    } else if (userRole == 14) {
      modelType = "Partners";
    }

    registerDevice();
    if (res?.results?.completed_step == 0) {
      navigation?.navigate(routeName?.REGISTERATION, {
        routeName: routeName?.SIGNUP,
        tab: tab,
        emailID: res?.results?.email,
        authentication_type: "Social",
      });
    } else if (userRole == 11 || userRole == 12 || userRole == 15) {
      if (res?.results?.completed_step == 1) {
        dispatch(navigatorStatus(routeName?.DRAWER, "", true));
      } else if (res?.results?.completed_step == 2) {
        navigation?.navigate(routeName?.PROFILE_GALLERY, {
          routeName: routeName?.REGISTERATION,
          userId: res?.results?.user_id,
          profileId: res?.results?.profile_id,
        });
      } else {
        handleFirebaseLogin();
      }
    } else if (userRole == 13) {
      if (
        res?.results?.completed_step == 1 ||
        res?.results?.completed_step == 2
      ) {
        navigation?.navigate(routeName?.PROFILE_GALLERY, {
          routeName: routeName?.REGISTERATION,
          userId: res?.results?.user_id,
          profileId: res?.results?.profile_id,
        });
      } else {
        handleFirebaseLogin();
      }
    } else {
      handleFirebaseLogin();
    }
    if (!res?.results?.firebase_udi) {
      handleFirebaseData(res?.results, data);
    }
  };

  const handleSocialData = async (result) => {
    setLoading(true);
    const isNewUser = result.additionalUserInfo.isNewUser;
    const userData = result?.user;
    const emailExists = await handleEmailVerify(userData?.email);
    if (result?.user?.uid) {
      const userMeta = {
        emailVerified: userData?.emailVerified,
        uid: userData?.uid,
        email: userData?.email,
        first_name:
          userData?.firstName ||
          userData.givenName ||
          userData?.displayName ||
          "",
        last_name: userData?.lastName || userData.familyName || "",
        display_name: userData?.displayName,
        gender: userData?.gender || "",
        birthDate: userData?.birthDate,
        profileImage: userData?.photoURL,
      };
      // setLoggedInData(userMeta);
      if (isNewUser && !emailExists) {
        userRegistration(userMeta, result);
        console.log("🎉 New user signed up!");
      } else if (!isNewUser && emailExists) {
        handleLogin(userMeta, result);
        console.log("🙌 Existing user logged in!");
      } else if (isNewUser && emailExists) {
        showToast("Email is already exist", "error");
      } else if (!isNewUser && !emailExists) {
        await auth().signOut();
        userRegistration(userMeta, result);
      } else {
        await auth().signOut();
      }
      setLoading(false);
    }
  };

  async function revokeSignInWithAppleToken() {
    // Get an authorizationCode from Apple
    try {
      await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGOUT,
      });
      console.log("✅ Apple session revoked successfully");
    } catch (err) {
      console.log("❌ Failed to revoke Apple session:", err);
    }
  }

  const handleLogin = async (data, firebaseData) => {
    var body = {
      email: data?.email,
      password: data?.uid,
      uid: data?.uid,
    };
    let res = await dispatch(userLogin(body, Url.SOCIAL_USER_LOGIN));
    console.log("handleLogin res------", res);
    if (res?.status == 200) {
      handleUserLogin(res, firebaseData);
      setShow(false);
      // if (setLoginModal) {
      //   setLoginModal(false);
      // }
    }
  };

  const userRegistration = async (user, userCreds) => {
    var body = {
      reffer: userData?.referal,
      user_type:
        userData?.user_type == "Model" ||
        userData?.user_type == "model" ||
        userData?.user_type == "Model Kid" ||
        userData?.user_type == "kid"
          ? "freelancer"
          : userData?.user_type === "Actor" ||
            userData?.user_type === "Actor Kid"
          ? "actor"
          : userData?.user_type === "Photographer" ||
            userData?.user_type === "photographer"
          ? "photographer"
          : "employer",
      model_type:
        userData?.user_type == "Model"
          ? "model"
          : userData?.user_type == "Model Kid"
          ? "child"
          : userData?.user_type == "Actor Kid"
          ? "child"
          : userData?.user_type == "Actor"
          ? "actor"
          : userData?.user_type === "Photographer" ||
            userData?.user_type === "photographer"
          ? "photographer"
          : "",
      email: user?.email,
      dob: user?.birthDate
        ? moment(new Date(user?.birthDate)).format("YYYY-MM-DD")
        : moment(new Date(maxDate)).format("YYYY-MM-DD"),
      first_name: user?.first_name,
      last_name: user?.last_name,
      display_name: user?.display_name,
      gender:
        user?.gender == "Male" || user?.gender == "male"
          ? "male"
          : user?.gender == "Female" || user?.gender == "female"
          ? "female"
          : user?.gender == "Non Binary" ||
            user?.gender == "non binary" ||
            user?.gender == "other"
          ? "other"
          : "",
      password: user?.uid,
      mobile: user?.mobileNumber || "",
      platform: `${Platform?.OS} (${Platform?.OS})` || "Mobile",
      uid: user?.uid,
    };
    let res = await dispatch(userRegister(body, Url.SOCIAL_USER_REGISTER));
    console.log("user register checking------", res);
    if (res?.status == 200) {
      let data = res?.results?.[0];
      handleFirebaseData(data, userCreds);
      const paramsData = {
        authentication_type: "Social",
      };
      storeData(storageKey.USER_ID, data?.user_id);
      navigation?.navigate(routeName?.REGISTERATION, {
        routeName: routeName?.SIGNUP,
        tab: tab,
        emailID: res?.results?.email,
        authentication_type: "Social",
      });
      setShow(false);
    }
  };

  const handleFirebaseData = async (userData, userCredential) => {
    registerDevice();
    const firebase_user = auth().currentUser;
    const user = userCredential.user;

    await user.updateProfile({
      displayName: userData?.displayName || userData?.display_name,
      photoURL: userData?.profile_image || "",
      user_type: userData?.user_role,
    });
    console.log("Profile updated successfully!");

    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      displayName: userData?.displayName || userData?.display_name,
      email: userData?.user_email || userData?.email,
      photoURL: userData?.profile_image || "",
      user_id: userData?.id || userData?.user_id,
      user_type: userData?.user_role,
    });

    await setDoc(doc(db, "userChats", user.uid), {});

    const body = {
      user_id: userData.id || userData?.user_id,
      chat_udi: user.uid,
    };

    const response = await dispatch(addFirebaseUid(body));
    // if (response?.status === 200) {
    //   dispatch(navigatorStatus(routeName?.DRAWER, "", false));
    //   setShow(false);
    // }
  };

  const handleEmailVerify = async (email) => {
    var body = {
      email: email,
    };
    let res = await dispatch(checkEmailExist(body));
    if (res?.status == 200) {
      return res?.results?.exist;
    }
  };

  const handleEmailSignIn = async (type) => {
    console.log("user type selected", type);
    setSocialType(type);
    setShow(false);
  };

  const handleGoogleSignIn = async (type) => {
    if (route == routeName?.SIGNUP) setSocialType(type);
    try {
      await GoogleSignin.hasPlayServices({
        showPlayServicesUpdateDialog: true,
      });
      const userInfo = await GoogleSignin.signIn();
      const { idToken, accessToken, user } = userInfo;
      if (!idToken) {
        throw new Error("No ID token returned from Google Sign-In");
      }
      const googleCredential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      const firebaseUserCredential = await auth().signInWithCredential(
        googleCredential,
      );
      setUserCreds(firebaseUserCredential);
      const firebaseUser = firebaseUserCredential.user;
      if (firebaseUser) {
        handleSocialData(firebaseUserCredential);
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      throw error;
    }
  };

  const handleAppleSignIn = async (type) => {
    if (route == routeName?.SIGNUP) setSocialType(type);
    const appleAuthRequestResponse = await appleAuth.performRequest({
      requestedOperation: appleAuth.Operation.LOGIN,
      requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
    });
    if (!appleAuthRequestResponse.identityToken) {
      showToast("Apple Sign-In failed - no identify token returned", "error");
    }
    const {
      identityToken,
      nonce,
      email,
      fullName,
      user,
    } = appleAuthRequestResponse;
    const appleCredential = auth.AppleAuthProvider.credential(
      identityToken,
      nonce,
    );
    const firebaseUserCredential = await auth().signInWithCredential(
      appleCredential,
    );
    const firebase_user = auth().currentUser;
    firebaseUserCredential.user.email = email;
    firebaseUserCredential.user.displayName =
      fullName?.givenName + " " + fullName?.familyName;
    firebaseUserCredential.user.firstName = fullName?.givenName;
    firebaseUserCredential.user.lastName = fullName?.familyName;
    setUserCreds(firebaseUserCredential);
    const firebaseUser = firebaseUserCredential.user;
    if (firebaseUser) {
      handleSocialData(firebaseUserCredential);
    }
  };

  // const revokeFacebookToken = async () => {
  //   const data = await AccessToken.getCurrentAccessToken();
  //   if (data?.accessToken) {
  //     await fetch(
  //       `https://graph.facebook.com/me/permissions?access_token=${data.accessToken}`,
  //       {
  //         method: "DELETE",
  //       }
  //     );
  //     console.log("Old Facebook token revoked");
  //   }
  // };

  const [initializing, setInitializing] = useState(true);
  const [user, setUser] = useState();

  // Handle user state changes
  // function handleAuthStateChanged(user) {
  //   console.log("useruseruser-----", user);
  //   setUser(user);
  //   if (initializing) setInitializing(false);
  // }

  // useEffect(() => {
  //   const subscriber = auth().onAuthStateChanged(handleAuthStateChanged);
  //   return subscriber; // unsubscribe on unmount
  // }, []);

  // const handleFacebookSignIn = async (type) => {
  //   if (route == routeName?.SIGNUP) setSocialType(type);
  //   console.log("gfgfffdfdvdv");

  //   try {
  //     LoginManager.setLoginBehavior({ ios: "web", android: "web_only" });

  //     LoginManager.logOut();
  //     if (auth().currentUser) {
  //       auth().signOut();
  //     }

  //     try {
  //       const result = await LoginManager.logInWithPermissions([
  //         "public_profile",
  //         "email",
  //       ]);
  //       console.log("FB Result →", result);

  //       if (result.isCancelled) {
  //         console.log("User cancelled login");
  //         return;
  //       }

  //       const data = await AccessToken.getCurrentAccessToken();
  //       console.log("FB AccessToken →", data);

  //       if (!data) {
  //         console.log("No access token found");
  //         return;
  //       }

  //       const facebookCredential = auth.FacebookAuthProvider.credential(
  //         data.accessToken
  //       );
  //       console.log("FB Credential →", facebookCredential);

  //       const firebaseUserCredential = await auth().signInWithCredential(
  //         facebookCredential
  //       );

  //       console.log("Firebase User →", firebaseUserCredential.user);
  //       //  handleSocialData(firebaseUserCredential);
  //     } catch (error) {
  //       console.log("Facebook login error:", error);
  //     }

  //     // 6️⃣ Extract user & isNewUser
  //     // const { user, additionalUserInfo } = firebaseUserCredential;
  //     // console.log("Firebase user:", user);
  //     // console.log("Is new user:", additionalUserInfo?.isNewUser);

  //     // 7️⃣ Handle your user data
  //     // handleSocialData(firebaseUserCredential);

  //     return true;
  //   } catch (error) {
  //     console.log("Facebook login error:", error.code, error.message);
  //     return false;
  //   }
  // };

  const socialIcons = [
    {
      key: 1,
      name: "Email",
      icon: Images?.emailLogo,
      onClick: handleEmailSignIn,
    },
    {
      key: 2,
      name: "Google",
      icon: Images?.googleLogo,
      onClick: handleGoogleSignIn,
    },
    // {
    //   key: 3,
    //   name: "Meta",
    //   icon: Images?.metaLogo,
    //   onClick: handleFacebookSignIn,
    // },
    {
      key: 4,
      name: "Apple",
      icon: Images?.appleLogo,
      onClick: handleAppleSignIn,
    },
  ];

  if (route == routeName?.SIGNIN) {
    return (
      <>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            width: "100%",
            alignContent: "center",
          }}
        >
          {socialIcons?.map((item, index) => {
            return (
              index != 0 && (
                <>
                  <TouchableOpacity
                    key={index.toString()}
                    style={{ ...styles.login_button, marginRight: 30 }}
                    onPress={() => item?.onClick()}
                  >
                    <Image
                      source={item?.icon}
                      style={{
                        width: 35,
                        height: 35,
                      }}
                    />
                  </TouchableOpacity>
                </>
              )
            );
          })}
        </View>
      </>
    );
  } else {
    return (
      <Modal
        visible={show}
        transparent
        animationType="fade"
        onRequestClose={() => setShow(false)}
      >
        <View style={styles.overlay}>
          <View style={styles.modalBox} key={Math.random()}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setShow(false)}
            >
              <FontAwesome name="close" size={24} color="#000" />
            </TouchableOpacity>

            <Text style={styles.heading}>Do You want to</Text>

            {socialIcons?.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
                    style={styles.button}
                    onPress={() => item?.onClick(item?.name)}
                  >
                    <Image
                      source={item?.icon}
                      style={{
                        width: 25,
                        height: 25,
                        marginRight: 15,
                      }}
                    />
                    <Text style={styles.buttonText}>
                      Sign up with {item?.name}
                    </Text>
                  </TouchableOpacity>
                  {index == 0 && <Text style={styles.orText}>OR</Text>}
                </>
              );
            })}
          </View>
        </View>
      </Modal>
    );
  }
};
export default SocialLogin;
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBox: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 30,
    alignItems: "center",
    position: "relative",
  },
  closeButton: {
    position: "absolute",
    right: 16,
    top: 16,
  },
  heading: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 24,
  },
  login_button: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 15,
    borderColor: Colors?.gredient,
    // backgroundColor: Colors?.gredient,
    alignItems: "center",
  },
  button: {
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 24,
    backgroundColor: "#f5f5f5",
    alignItems: "center",
    marginVertical: 6,
  },
  buttonText: {
    fontSize: 16,
    color: "#000",
    textAlign: "center",
  },
  orText: {
    marginVertical: 10,
    color: "#666",
    fontWeight: "500",
    textAlign: "center",
  },
});
