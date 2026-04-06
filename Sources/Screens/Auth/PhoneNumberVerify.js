import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  AuthHeader,
  Lotties,
  TextComponent,
  InputBox,
} from "../../Components";
import { Sizes, Colors, JSONS } from "../../Constants";
import { Styles } from "../../Styles";
import * as Utility from "../../Utility/index";
import { routeName } from "../../Utility/routeName";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { useDispatch, useSelector } from "react-redux";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import {
  forgetPassword,
  getUserDetail,
  otpVerify,
  sendVerfication,
  sendVerficationEmail,
  verifyOtpApi,
} from "../../Redux/Services/AuthServices";
import { getData, storageKey } from "../../Utility/Storage";

export const PhoneNumberVerify = (props) => {
  const {
    show,
    setShow,
    navigation,
    userData,
    callingCode,
    setCallingCode,
    basicDetails,
    setBasicDetails,
    onApprove,
    mobileNumber,
    setMobileNumber,
  } = props;
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const [code, setCode] = useState("");
  const [resent, setResent] = useState(false);
  const [timer, setTimer] = useState(60);
  const [countDown, setCountDown] = useState(179);
  const [error, setError] = useState(false);
  const [changeSection, setChangeSection] = useState(false);

  // const [mobileNumber, setMobileNumber] = useState(basicDetails?.mobileNumber);
  // const [callingCode, setCallingCode] = useState(callingCode);
  const mobileNumberValid = Utility.isValidPhoneNumber(
    mobileNumber || basicDetails?.mobileNumber,
  );

  const handlePhoneVerify = async (val) => {
    if (
      (val === "verify" && code?.length < 6) ||
      (val === "otp_verify" && code?.length < 6)
    ) {
      Utility.showToast("Please enter a valid OTP", "error");
      return;
    }
    try {
      let userId = await getData(storageKey?.USER_ID);
      let body = {
        user_id: userId ? JSON.parse(userId) : "",
        action: val == "send" || val == "resend" ? "send" : "otp_verify",
        country_code: callingCode,
        phone: mobileNumber || basicDetails?.mobileNumber,
        verify_otp: val == "send" || val == "resend" ? "" : code,
      };
      console.log("body----", body);
      let res = await dispatch(verifyOtpApi(body));
      console.log("verifyOtpApiverifyOtpApi----", res);

      if (res?.status == 200) {
        if (val == "otp_verify") {
          if (onApprove) {
            onApprove();
          }
          setShow(false);
        }
        if (val == "send") {
          setChangeSection(false);
          setCountDown(179);
        }
      }
    } catch (err) {
      console.log("Verify mobile number error", err);
    }
  };

  useEffect(() => {
    if (countDown > 0 && show) {
      setTimeout(() => {
        setCountDown(countDown - 1);
      }, 1000);
    } else {
      setCountDown(0);
    }
  }, [countDown]);

  const secondsToTime = (e) => {
    const m = Math.floor((e % 3600) / 60)
        .toString()
        .padStart(2, "0"),
      s = Math.floor(e % 60)
        .toString()
        .padStart(2, "0");
    return m + ":" + s;
  };

  useEffect(() => {
    if (
      mobileNumber ||
      (basicDetails?.mobileNumber && show && !userData?.verified)
    ) {
      handlePhoneVerify("send");
    }
  }, []);

  const handleChangePhoneNumber = () => {
    setCode("");
    setChangeSection(true);
  };

  return (
    <View style={{ ...styling?.modalContainer }}>
      <KeyboardAvoidingView
        style={{ flex: 1, justifyContent: "center" }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1, justifyContent: "center" }}
          showsVerticalScrollIndicator={false}
        >
          <View style={Styles.container}>
            <Lotties
              source={JSONS?.emailJSON}
              style={{ width: "100%", marginTop: -15, height: 150 }}
            />
            {changeSection ? (
              <View style={{ marginTop: -60 }}>
                <TextComponent
                  text="Enter the phone number"
                  style={{ textAlign: "center", marginBottom: 20 }}
                />
                <InputBox
                  type="phone"
                  value={mobileNumber || basicDetails?.mobileNumber}
                  placeholder={"Phone Number *"}
                  callingCode={callingCode}
                  setCallingCode={setCallingCode}
                  onChangeText={(val) => {
                    if (setMobileNumber) {
                      setMobileNumber(val);
                    } else {
                      setBasicDetails({ ...basicDetails, mobileNumber: val });
                    }
                  }}
                  error={mobileNumberValid}
                  isEmpty={
                    error &&
                    Utility.isFieldEmpty(
                      mobileNumber || basicDetails?.mobileNumber,
                    )
                  }
                />
              </View>
            ) : (
              <>
                <View style={{ marginTop: -60 }}>
                  <TextComponent text="Enter the 6-digits code sent to you" />
                  <View style={Styles?.row}>
                    <TextComponent text="at  " />
                    <TextComponent
                      text={`+${callingCode} ${
                        mobileNumber || basicDetails?.mobileNumber
                      }`}
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
                    codeInputHighlightStyle={[
                      styling.underlineStyleHighLighted,
                    ]}
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
                      text={secondsToTime(countDown)}
                      color={Colors?.themeColor}
                      size={Sizes?.l}
                    />
                  </View>
                </View>
                <TouchableOpacity onPress={() => handleChangePhoneNumber()}>
                  <TextComponent
                    text="Change Phone Number"
                    size={Sizes?.s}
                    color={Colors?.blue}
                    style={{ paddingTop: 10, textAlign: "center" }}
                  />
                </TouchableOpacity>
              </>
            )}

            <View style={{ marginTop: 15 }}>
              <Button
                title="Verify"
                icon={true}
                background={true}
                onPress={() =>
                  changeSection
                    ? handlePhoneVerify("send")
                    : handlePhoneVerify("otp_verify")
                }
              />
              <Button
                title="Skip"
                onPress={() => {
                  setShow(false);
                  if (onApprove) {
                    onApprove();
                  }
                }}
              />

              {!changeSection && (
                <TouchableOpacity
                  style={Styles.bottomTextView}
                  onPress={() => handlePhoneVerify("resend")}
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
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    marginBottom: 20,
  },
});
