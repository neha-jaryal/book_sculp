import React, { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import {
  Button,
  AuthHeader,
  InputBox,
  Lotties,
  TextComponent,
} from "../../Components";
import { Sizes, Colors, Images, JSONS } from "../../Constants";
import { forgetPassword } from "../../Redux/Services/AuthServices";
import { Styles } from "../../Styles";
import * as Utility from "../../Utility/index";
import { routeName } from "../../Utility/routeName";
import { getData, storageKey } from "../../Utility/Storage";

export const ForgotPassword = ({ navigation }) => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const emailValid = Utility.isValidEmail(email);

  const handleForgetPassword = async () => {
    setError(true);
    if (!email) {
      Utility.showToast("Please Enter Email");
    } else {
      var body = {
        user_email: email.trim(),
        user_id: "",
        otp_code: "",
        new_password: "",
        new_re_password: "",
      };
      let res = await dispatch(forgetPassword(body));
      if (res?.status == 200) {
        setError(false);
        navigation.push(routeName?.VERIFICATION, {
          routeName: routeName?.FORGOT_PASSWORD,
          data: res?.results,
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
        <AuthHeader name="Forgot Password" navigation={navigation} />
        <View style={Styles?.cardContainer}>
          <Lotties
            source={JSONS?.emailJSON}
            style={{ width: "100%", marginTop: -15 }}
          />
          <View style={{ marginTop: -50 }}>
            <InputBox
              type="email"
              value={email.trim()}
              placeholder="Email ID"
              onChangeText={(val) => setEmail(val)}
              error={emailValid}
              fontIcon="email"
              isEmpty={error && Utility.isFieldEmpty(email)}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Button
              title="Next"
              icon={true}
              background={true}
              onPress={() => handleForgetPassword()}
            />
            <TouchableOpacity
              style={Styles.bottomTextView}
              onPress={() => navigation.push(routeName.SIGNIN)}
            >
              <Text>Already have an Account ?</Text>
              <TextComponent
                text="Sign In"
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
