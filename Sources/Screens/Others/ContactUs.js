import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { AuthHeader, TextComponent, Lotties, InputBox } from "../../Components";
import { Sizes, JSONS, Colors } from "../../Constants";
import { submitContactForm } from "../../Redux/Services/OtherServices";
import { Styles } from "../../Styles";
import {
  isFieldEmpty,
  isValidEmail,
  regName,
  routeName,
  showToast,
} from "../../Utility";

export const ContactUs = ({ navigation }) => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [error, setError] = useState(false);
  const fnameValid = regName(userDetails?.name);
  const emailValid = isValidEmail(userDetails?.email);

  const submitForm = async () => {
    setError(true);
    if (
      !userDetails?.name &&
      !userDetails?.email &&
      !userDetails?.subject &&
      !userDetails?.message
    ) {
      showToast("Please fill the required fields!", "error");
    } else if (!userDetails?.name) {
      showToast("Please enter your name!", "error");
    } else if (!userDetails?.email) {
      showToast("Please enter your email!", "error");
    } else if (!userDetails?.subject) {
      showToast("Please enter your subject!", "error");
    } else if (!userDetails?.message) {
      showToast("Please enter your message!", "error");
    } else {
      var body = {
        name: userDetails?.name,
        email: userDetails?.email,
        subject: userDetails?.subject,
        message: userDetails?.message,
      };
      let res = await dispatch(submitContactForm(body));
      if (res?.status == 200) {
        setError(false);
        setUserDetails({
          ...userDetails,
          name: "",
          email: "",
          subject: "",
          message: "",
        });
      }
    }
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader name="Contact Us" navigation={navigation} />
        <View style={Styles?.cardContainer}>
          <Lotties
            source={JSONS?.contactUsJSON}
            style={{
              width: "70%",
              marginTop: -10,
              marginBottom: 20,
              alignSelf: "center",
              height : 150,
            }}
          />
          <View style={{ alignItems: "center" }}>
            <TextComponent
              text={`Need Help ?`}
              size={Sizes?.xl}
              style={{ letterSpacing: 0.5 }}
            />
            <TextComponent
              text={`Feel Free to Get in Touch with Us`}
              size={Sizes?.l}
              color={Colors?.darkgrey}
              fontWeight="400"
              style={{ letterSpacing: 0.5 }}
            />
          </View>
          {/* <View
          style={{
            ...Styles?.container,
            // backgroundColor: Colors?.grey,
            marginHorizontal: 0,
            width: '100%',
          }}>
          <TextComponent
            text={`Email`}
            size={Sizes?.l}
            style={{letterSpacing: 0.5}}
          />
          <TextComponent
            text={`help@gmail.com`}
            size={Sizes?.s}
            fontWeight="400"
            style={{letterSpacing: 0.5}}
            color={Colors?.themeColor}
          />
        </View>
        <View
          style={{
            ...Styles?.container,
            // backgroundColor: Colors?.grey,
            marginHorizontal: 0,
            width: '100%',
          }}>
          <TextComponent
            text={`Call`}
            size={Sizes?.l}
            style={{letterSpacing: 0.5}}
          />
          <TextComponent
            text={` +91 (82-198-88474)`}
            size={Sizes?.s}
            color={Colors?.themeColor}
            fontWeight="400"
            style={{letterSpacing: 0.5}}
          />
        </View>  */}
          <View style={{ marginVertical: 15 }}>
            <TextComponent
              text={`Have a Question?`}
              size={Sizes?.l}
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
            <TextComponent
              text={`Check out our support page, where you will find answers to common questions about using booksculp.com`}
              size={Sizes?.s}
              color={Colors?.darkgrey}
              fontWeight="400"
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
          </View>
          <View style={{ marginVertical: 15 }}>
            <TextComponent
              text={`Clients, Need help booking a model?`}
              size={Sizes?.l}
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
            <TextComponent
              text={`Too busy with other things or just need help? Contact info@booksculp.com and we’ll take care of the rest. Additional fees may apply`}
              size={Sizes?.s}
              color={Colors?.darkgrey}
              fontWeight="400"
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
          </View>
          <View style={{ marginVertical: 15 }}>
            <TextComponent
              text={`I’m new, now what?`}
              size={Sizes?.l}
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
            <TouchableOpacity
              onPress={() => Linking.openURL("https://booksculp.com/insight")}
            >
              <TextComponent
                text={`Check out https://booksculp.com/insight where you will find answers to common questions about what to do next`}
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
                style={{ letterSpacing: 0.5, lineHeight: 24 }}
              />
            </TouchableOpacity>
          </View>
          <View style={{ marginVertical: 15 }}>
            <TextComponent
              text={`Tap Center`}
              size={Sizes?.l}
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
            <TextComponent
              text={`Check out our facebook and instagram page to see what others are saying about Sculp.`}
              size={Sizes?.s}
              color={Colors?.darkgrey}
              fontWeight="400"
              style={{ letterSpacing: 0.5, lineHeight: 24 }}
            />
          </View>
          <View
            style={{ ...Styles?.container, marginHorizontal: 0, width: "100%" }}
          >
            <InputBox
              type="text"
              value={userDetails?.name}
              placeholder="Your Name*"
              onChangeText={(val) =>
                setUserDetails({ ...userDetails, name: val })
              }
              error={fnameValid}
              isEmpty={error && isFieldEmpty(userDetails?.name)}
            />

            <InputBox
              type="email"
              value={userDetails?.email.trim()}
              placeholder={"Your Email*"}
              onChangeText={(val) =>
                setUserDetails({ ...userDetails, email: val })
              }
              error={emailValid}
              fontIcon="email"
              isEmpty={error && isFieldEmpty(userDetails?.email)}
            />
            <InputBox
              type="text"
              value={userDetails?.subject}
              placeholder="Subject*"
              onChangeText={(val) =>
                setUserDetails({ ...userDetails, subject: val })
              }
              isEmpty={error && isFieldEmpty(userDetails?.subject)}
            />
            <InputBox
              type="description"
              value={userDetails?.message}
              // placeholder="Your Message (Optional)"
              placeholder="Your Message"
              onChangeText={(val) =>
                setUserDetails({ ...userDetails, message: val })
              }
              style={{ marginVertical: 10, width: "100%" }}
              isEmpty={error && isFieldEmpty(userDetails?.message)}
            />
            <TouchableOpacity
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                width: "40%",
                marginVertical: 10,
              }}
              onPress={() => submitForm()}
            >
              <TextComponent
                text="Submit"
                color={Colors?.white}
                size={Sizes?.l}
                style={{ paddingVertical: 4, paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styling = StyleSheet.create({
  forgotView: {
    flexDirection: "row",
    justifyContent: "space-between",
    // paddingVertical: 6,
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 60,
  },
});
