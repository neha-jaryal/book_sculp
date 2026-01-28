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
import { Sizes, Colors, JSONS } from "../../Constants";
import { forgetPassword } from "../../Redux/Services/AuthServices";
import { Styles } from "../../Styles";
import * as Utility from "../../Utility/index";
import { routeName } from "../../Utility/routeName";

export const ResetPassword = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const passwordValid = Utility.passwordPattern(password);
  const confirmPasswordValid = Utility.isValidComparedPassword(
    password,
    confirmPassword
  );

  const handleForgetPassword = async () => {
    setError(true);
    if (!password && !confirmPassword) {
      Utility.showToast("Please fill all the required fields");
    } else {
      var body = {
        user_email: route?.params?.data?.user_email,
        user_id: route?.params?.data?.user_id,
        otp_code: "",
        new_password: password,
        new_re_password: confirmPassword,
      };
      let res = await dispatch(forgetPassword(body));
      if (res?.status == 200) {
        setError(false);
        navigation.push(routeName.SIGNIN);
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
        <AuthHeader name="Reset Password" navigation={navigation} />
        <View style={{ ...Styles?.cardContainer }}>
          <Lotties
            source={JSONS?.passordJSON}
            style={{ width: "100%", marginTop: -15, marginLeft: 10 }}
          />
          <View style={{ marginTop: -60 }}>
            <InputBox
              type="password"
              value={password.trim()}
              placeholder="Password"
              onChangeText={(val) => setPassword(val)}
              error={passwordValid}
              fontIcon="lock"
              isEmpty={error && Utility.isFieldEmpty(password)}
            />
            <InputBox
              type="confirmPassword"
              value={confirmPassword.trim()}
              placeholder="Confirm Password"
              onChangeText={(val) => setConfirmPassword(val)}
              error={confirmPasswordValid}
              fontIcon="lock"
              isEmpty={error && Utility.isFieldEmpty(confirmPassword)}
            />
          </View>
          <View style={{ marginTop: 15 }}>
            <Button
              title="Done"
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
