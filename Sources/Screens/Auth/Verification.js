import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, AuthHeader, Lotties, TextComponent } from "../../Components";
import { Sizes, Colors, JSONS } from "../../Constants";
import { Styles } from "../../Styles";
import * as Utility from "../../Utility/index";
import { routeName } from "../../Utility/routeName";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import {
  forgetPassword,
  otpVerify,
  sendVerfication,
  sendVerficationEmail,
} from "../../Redux/Services/AuthServices";

export const Verification = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [countDown, setCountDown] = useState({
    minutes: 4,
    seconds: 59,
  });
  const [error, setError] = useState(false);
  const registrationData = auth?.registrationData?.registrationData;
  const secondsView = JSON.stringify(countDown?.seconds);

  useEffect(() => {
    if (!timer) {
      setResent(false);
      return;
    }
    const intervalId = setInterval(() => {
      setTimer(timer - 1);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [timer]);

  useEffect(() => {
    let intervalId;
    intervalId = setInterval(() => {
      setCountDown({ ...countDown, seconds: countDown?.seconds - 1 });
    }, 1000);

    if (countDown?.seconds == 0) {
      clearInterval(intervalId);
      setCountDown({
        ...countDown,
        minutes: countDown?.minutes - 1,
        seconds: 59,
      });
      intervalId = setInterval(() => {
        setCountDown({ ...countDown, seconds: countDown?.seconds - 1 });
      }, 1000);
    }
    // if (countDown?.minutes == 0) {
    //   clearInterval(intervalId);
    //   setCountDown({
    //     ...countDown,
    //     minutes: 0,
    //     seconds: 0,
    //   });
    //   Utility.showToast(
    //     "Your OTP Code has been expired. Please resend again !"
    //   );
    // }
    if (resent) {
      clearInterval(intervalId);
      setCountDown({
        ...countDown,
        minutes: 0,
        seconds: 0,
      });
    }

    return () => clearInterval(intervalId);
  }, [countDown?.seconds, countDown?.minutes]);

  //   useEffect(() => {
  //     if (!resent) {
  //       Utility.showToast("OTP sent successfully!");
  //     }
  //   }, [resent]);

  const handleSubmitCode = async () => {
    if (!code) {
      Utility.showToast("Please enter the OTP field", "error");
    } else {
      var body = {
        user_id: registrationData?.user_id,
        profile_id: registrationData?.profile_id,
        otp_code: code,
      };
      let res = await dispatch(otpVerify(body));
      if (res?.status == 200) {
        dispatch(navigatorStatus(routeName?.DRAWER, "", true));
      }
    }
  };
  const handleVerifyCode = async () => {
    if (!code) {
      Utility.showToast("Please enter the OTP field", "error");
    } else {
      var body = {
        email: route?.params?.emailID,
        type: "verify_otp",
        otp: code,
      };
      let res = await dispatch(sendVerficationEmail(body));
      if (res?.status == 200) {
        navigation?.navigate(routeName?.REGISTERATION, {
          routeName: routeName?.SIGNUP,
          tab: route?.params?.tab,
          emailID: res?.results?.email,
          social : route?.params?.social
        });
        // dispatch(navigatorStatus(routeName?.DRAWER, "", true));
      }
    }
  };
  const handleForgetPassword = async () => {
    setError(true);
    if (!code) {
      Utility.showToast("Please Enter code");
    } else {
      var body = {
        user_email: route?.params?.data?.user_email,
        user_id: route?.params?.data?.user_id,
        otp_code: code,
        new_password: "",
        new_re_password: "",
      };
      let res = await dispatch(forgetPassword(body));
      if (res?.status == 200) {
        setError(false);
        navigation.push(routeName?.RESET_PASSWORD, {
          data: res?.results,
        });
      }
    }
  };

  const handleResendCode = async () => {
    setResent(true);
    if (!resent) {
      setTimer(60);
    }
    var body = {
      email: route?.params?.emailID,
      type: "send_otp",
    };
    let res = await dispatch(sendVerficationEmail(body));

    // var body = {
    //   user_id: registrationData?.user_id,
    //   profile_id: registrationData?.profile_id,
    //   action: "resend",
    // };
    // let res = await dispatch(sendVerfication(body));
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader name="Code Verification" navigation={navigation} />
        <View style={{ ...Styles?.cardContainer }}>
          <Lotties
            source={JSONS?.emailJSON}
            style={{ width: "100%", marginTop: -15, height: 150 }}
          />

          <View style={{ marginTop: -50 }}>
            <TextComponent text="Enter the 6-digits code sent to you" />
            <View style={Styles?.row}>
              <TextComponent text="at  " />
              <TextComponent
                text={registrationData?.user_email || route?.params?.emailID}
                color={Colors?.themeColor}
                fontWeight="bold"
              />
            </View>

            <OTPInputView
              style={{
                width: "95%",
                height: 150,
                alignSelf: "center",
              }}
              codeInputFieldStyle={[
                styling.underlineStyleBase,
                {
                  color: Colors?.black,
                  borderColor: Colors?.black,
                },
              ]}
              codeInputHighlightStyle={[styling.underlineStyleHighLighted]}
              pinCount={6}
              code={code}
              autoFocusOnLoad
              onCodeChanged={(val) => setCode(val)}
              placeholderCharacter={"•"}
              selectionColor={Colors?.black}
              //   onCodeFilled={(val) => submitOtp(val)}
            />
            <View
              style={{
                ...Styles?.row,
                justifyContent: "center",
              }}
            >
              <TextComponent
                text={`Your Verfication code will expire in `}
                fontWeight="400"
                size={Sizes?.s}
              />
              <TextComponent
                text={` 00 : 0${countDown?.minutes} : ${
                  secondsView.length == 2
                    ? countDown?.seconds
                    : "0" + countDown?.seconds
                } `}
                color={Colors?.themeColor}
                size={Sizes?.l}
              />
            </View>
          </View>

          <View style={{ marginTop: 15 }}>
            <Button
              title="Submit"
              icon={true}
              background={true}
              onPress={() =>
                route?.params?.routeName == routeName?.FORGOT_PASSWORD
                  ? handleForgetPassword()
                  : route?.params?.routeName == routeName?.SIGNUP
                  ? handleVerifyCode()
                  : handleSubmitCode()
              }
            />
            {/* {resent && (
            <View
              style={{
                ...Styles?.row,
                justifyContent: "center",
              }}
            >
              <TextComponent
                text={`Resend in  `}
                fontWeight="400"
                size={Sizes?.s}
                style={{ textAlign: "center" }}
              />
              <TextComponent
                text={`00 : ${timer < 10 ? "0" + timer : timer}`}
                color={Colors?.themeColor}
                size={Sizes?.l}
                style={{ textAlign: "center" }}
              />
            </View>
          )} */}
            <TouchableOpacity
              style={Styles.bottomTextView}
              onPress={() => handleResendCode()}
            >
              <TextComponent
                text="I haven't recieved a code."
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
              />
              <TextComponent
                text="Resend"
                size={Sizes?.l}
                color={Colors?.themeColor}
                style={{ marginHorizontal: 6 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};
const styling = StyleSheet.create({
  underlineStyleBase: {
    width: 40,
    height: 60,
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: Colors?.darkgrey,
    fontSize: 35,
  },

  underlineStyleHighLighted: {
    borderColor: Colors?.themeColor,
    borderBottomWidth: 1.5,
  },
});
