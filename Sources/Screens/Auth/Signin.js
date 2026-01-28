import React, { useEffect, useState } from "react";
import {
  Alert,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  Checkbox,
  AuthHeader,
  InputBox,
  TextComponent,
  Loader,
  DropDownList,
} from "../../Components";
import { Sizes, Colors } from "../../Constants";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import {
  addFirebaseUid,
  registerToken,
  userLogin,
} from "../../Redux/Services/AuthServices";
import { Styles } from "../../Styles";
import {
  FIREBASE_KEY,
  isFieldEmpty,
  isValidEmail,
  passwordPattern,
  routeName,
  showToast,
} from "../../Utility";
import {
  getData,
  removeData,
  storageKey,
  storeData,
} from "../../Utility/Storage";
import { englishLevels } from "../../Global";
import { handleFirebaseLogin } from "../../Utility/FirestoreHelper";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, firebaseAuth, storeUserToken } from "../../Utility/Firebase";
import { USER_LOGIN } from "../../API Services/Url";
import SocialLogin from "../../Components/SocialLogin";
export const Signin = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [checked, setChecked] = useState(false);
  const [error, setError] = useState(false);
  const [socialModal, setSocialModal] = useState(false);
  const emailValid = isValidEmail(email);
  const [englishLevel, setEnglishLevel] = useState("");
  const [loading, setLoading] = useState("");
  const passwordValid = passwordPattern(password);
  useEffect(() => {
    getRememberCreds();
  }, []);

  //  for model userRole = 1 , for employer userRole = 2
  const firebaseLogin = async (res) => {
    const userID = res?.results?.firebase_udi;
    if (res?.results?.firebase_udi) {
      handleFirebaseLogin(email);
      // await storeUserToken(userID);
    } else {
      handleUserFirebaseRegister(res?.results);
      // await storeUserToken(userID);
    }
    dispatch(navigatorStatus(routeName?.DRAWER, "", false));
  };

  const handleUserLogin = async () => {
    setError(true);

    if (!email && !password)
      return showToast("Please Enter Email and Password", "error");
    if (!email) return showToast("Please Enter Email", "error");
    if (emailValid) return showToast("Please Enter Valid Email", "error");
    if (!password) return showToast("Please Enter Password", "error");

    setError(false);

    const body = {
      email: email.trim(),
      password,
    };

    const res = await dispatch(userLogin(body, USER_LOGIN));

    if (res?.status !== 200) {
      return showToast(res?.message || "Login failed", "error");
    }
    registerDevice();
    const [userId, userRole, userStatus] = await Promise.all([
      getData(storageKey?.USER_ID),
      getData(storageKey?.USER_ROLE),
      getData(storageKey?.USER_STATUS),
    ]);

    console.log("Firebase UID:", res?.results?.firebase_udi);

    const completedStep = res?.results?.completed_step;
    const userIdRes = res?.results?.user_id;
    const profileIdRes = res?.results?.profile_id;

    if ([11, 12, 15].includes(userRole)) {
      if (completedStep === 1) {
        dispatch(navigatorStatus(routeName?.DRAWER, "", true));
      } else if (completedStep === 2) {
        navigation?.navigate(routeName?.PROFILE_GALLERY, {
          routeName: routeName?.REGISTERATION,
          userId: userIdRes,
          profileId: profileIdRes,
        });
      } else {
        firebaseLogin(res);
      }
    } else if (userRole === 13) {
      if (completedStep === 1) {
        navigation?.navigate(routeName?.PROFILE_GALLERY, {
          routeName: routeName?.REGISTERATION,
          userId: userIdRes,
          profileId: profileIdRes,
        });
      } else {
        firebaseLogin(res);
      }
    } else {
      firebaseLogin(res);
    }
  };

  const handleUserFirebaseRegister = async (user) => {
    console.log("handleUserFirebaseRegister input:", user);

    try {
      const { full_name, email, profile_image, id } = user;

      const res = await createUserWithEmailAndPassword(
        firebaseAuth,
        email,
        FIREBASE_KEY,
      );
      const { uid } = res.user;

      console.log("Firebase register result:", res);

      await updateProfile(res.user, {
        displayName: full_name,
        photoURL: profile_image,
      });

      await setDoc(doc(db, "users", uid), {
        uid,
        displayName: full_name,
        email,
        photoURL: profile_image,
        user_id: id,
      });

      await setDoc(doc(db, "userChats", uid), {});

      const response = await dispatch(
        addFirebaseUid({ user_id: id, chat_udi: uid }),
      );
      console.log("Firebase UID update response:", response);

      if (response?.status === 200) {
        dispatch(navigatorStatus(routeName?.DRAWER, "", false));
      }
    } catch (error) {
      console.error("Firebase register error:", error);
      showToast("Something went wrong during registration", "error");
    }
  };

  const handleSubscriptionAlert = async (data) => {
    // showToast("Logged in successfully !", "success");
    dispatch(navigatorStatus(routeName?.DRAWER, "", false));
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setTimeout(() => {
      if (accountApproval && data?.packages_id == 107) {
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
              onPress: () => {
                dispatch(navigatorStatus(routeName?.DRAWER, "", false));
                navigation?.navigate(routeName?.PACKAGES);
              },
            },
          ],
        );
      }
    }, 3000);
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
  const handleGuestLogin = async () => {
    dispatch(navigatorStatus(routeName?.GUEST_STACKS));
    navigation.navigate(routeName.BOTTOM_TAB, {
      guest: true,
    });
  };

  const handleRememberMe = () => {
    if (!email || !password) {
      showToast("Please Enter Email and Password!", "error");
    } else if (email && password) {
      setChecked(!checked);
    }
    if (email && password && !checked) {
      var rememberCreds = {
        password: password,
        email: email,
      };
      storeData(storageKey.CREDS, JSON.stringify(rememberCreds));
    } else if (checked && email && password) {
      removeData(storageKey.CREDS, JSON.stringify(rememberCreds));
    }
  };

  const getRememberCreds = async () => {
    let rememberCreds = await getData(storageKey.CREDS);
    let data = JSON.parse(rememberCreds);
    if (data) {
      setChecked(true);
      setEmail(data?.email);
      setPassword(data?.password);
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader name="Sign In" navigation={navigation} />
        <Loader loading={auth?.isLoading || loading} />
        <View style={Styles?.cardContainer}>
          <View>
            {/* <DropDownList
              placeholder={"Select Language Level"}
              fontIcon={"car-brake-fluid-level"}
              value={englishLevel}
              setValue={setEnglishLevel}
              options={englishLevels}
              border={false}
            /> */}
            <InputBox
              type="email"
              value={email.trim()}
              placeholder="Email ID"
              onChangeText={(val) => setEmail(val)}
              error={emailValid}
              fontIcon="email"
              isEmpty={error && isFieldEmpty(email)}
            />
            <InputBox
              type="password"
              value={password}
              placeholder="Password"
              onChangeText={(val) => setPassword(val)}
              // error={passwordValid}
              fontIcon="lock"
              isEmpty={error && isFieldEmpty(password)}
            />
            <View
              style={{
                flexDirection: "row",
                // justifyContent: "space-between",

                // marginHorizontal: 20,
                alignItems: "center",
              }}
            >
              <Checkbox
                checked={checked}
                setChecked={setChecked}
                text={"Remember me"}
                onPress={() => handleRememberMe()}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate(routeName.FORGOT_PASSWORD)}
                style={styling.forgotView}
              >
                <TextComponent
                  text="Forgot Password ?"
                  color={Colors?.themeColor}
                  size={Sizes?.s}
                />
              </TouchableOpacity>
            </View>
            <View style={{ marginVertical: 25 }}>
              <Button
                title="Sign In"
                icon={true}
                background={true}
                onPress={() => handleUserLogin()}
              />
              <Button
                title="Sign Up"
                icon={true}
                background={true}
                backgroundColor={Colors?.blue}
                onPress={() => navigation.navigate(routeName?.SIGNUP)}
                // onPress={() => showToast("Please enter your last name", "error")}
              />
              <Button
                icon={true}
                title="Login As Guest"
                onPress={() => handleGuestLogin()}
              />
            </View>
            <SocialLogin
              show={socialModal}
              setShow={setSocialModal}
              route={routeName?.SIGNIN}
              loading={loading}
              setLoading={setLoading}
            />
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styling = StyleSheet.create({
  forgotView: {
    position: "absolute",
    right: 0,
    // flexDirection: "row",
    // justifyContent: "space-between",
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: Platform?.OS == "android" ? 60 : 10,
  },
  container: {
    backgroundColor: "#F5FCFF",
  },
  card: {
    flex: 1,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "white",
  },
  text: {
    textAlign: "center",
    fontSize: 50,
    backgroundColor: "transparent",
  },
  cardContainer: {
    flex: 1,
    height: Dimensions.get("screen").height,
  },
});
