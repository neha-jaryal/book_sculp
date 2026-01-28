import moment from "moment";
import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Modal,
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
  Tabs,
  TextComponent,
  DropDownList,
  Loader,
  TermsCondition,
  Lotties,
  // SocialLogin,
} from "../../Components";
import { Sizes, Colors, Images, JSONS } from "../../Constants";
import { genderTypes, talentTypes } from "../../Global";
import {
  sendVerficationEmail,
  userRegister,
} from "../../Redux/Services/AuthServices";
import { Styles } from "../../Styles";
import {
  isFieldEmpty,
  isValidEmail,
  isValidPhoneNumber,
  passwordPattern,
  regName,
  showToast,
} from "../../Utility";
import { routeName } from "../../Utility/routeName";
import { storageKey, storeData } from "../../Utility/Storage";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import * as Url from "../../API Services/Url";
import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import SocialLogin from "../../Components/SocialLogin";

// import SvgIcon from "../../Components/SvgIcon";

export const Signup = ({ navigation }) => {
  let currentDate = new Date();
  const auth = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [legal, setLegal] = useState(false);
  const [agree, setAgree] = useState(false);
  const [termsModal, setTermsModal] = useState(true);
  const [conditionModal, setConditionModal] = useState(false);

  const [talent, setTalent] = useState("");
  const [loading, setLoading] = useState("");

  const [tab, setTab] = useState(0);
  const [date, setDate] = useState(currentDate);
  const [organization, setOrganization] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [datePicker, setDatePicker] = useState(false);
  const [socialModal, setSocialModal] = useState(false);
  const [socialType, setSocialType] = useState("");
  const fnameValid = regName(fname);
  const lnameValid = regName(lname);
  const guardianNameValid = regName(guardianName);
  const mobileNumberValid = isValidPhoneNumber(mobileNumber);
  const emailValid = isValidEmail(email);
  const passwordValid = passwordPattern(password);

  const handleSignup = () => {
    if (tab == 1) {
      if (!talent) {
        showToast("Please select talent type");
      } else if (date == currentDate) {
        showToast("Please choose your date of birth");
      } else if (!fname) {
        showToast("Please enter your first name");
      } else if (fnameValid) {
        showToast("Please enter valid first name");
      } else if (!lname) {
        showToast("Please enter your last name");
      } else if (lnameValid) {
        showToast("Please enter valid last name");
      } else if (!gender) {
        showToast("Please select gender");
      } else if (talent == "Model") {
        handleModelValidation();
      } else if (talent == "Kid") {
        handleKidValidation();
      }
    } else if (tab == 2) {
      if (!fname) {
        showToast("Please enter your first name");
      } else if (fnameValid) {
        showToast("Please enter valid first name");
      } else if (!lname) {
        showToast("Please enter your last name");
      } else if (lnameValid) {
        showToast("Please enter valid last name");
      } else if (!organization) {
        showToast("Please enter organization");
      } else if (!mobileNumber) {
        showToast("Please enter your Phone Number");
      } else if (mobileNumberValid) {
        showToast("Please enter valid Phone Number");
      } else if (!email) {
        showToast("Enter your Email ID");
      } else if (emailValid) {
        showToast("Enter your valid Email ID");
      } else if (!password) {
        showToast("Please enter your password");
      } else if (passwordValid) {
        showToast("Please enter valid password");
      } else if (!agree) {
        showToast("Please accept terms and condition");
      } else {
        setError(false);
        userRegistration();
      }
    }
  };

  const handleModelValidation = () => {
    if (!mobileNumber) {
      showToast("Please enter your Phone Number");
    } else if (mobileNumberValid) {
      showToast("Please enter valid Phone Number");
    } else if (!email) {
      showToast("Enter your Email ID");
    } else if (emailValid) {
      showToast("Enter your valid Email ID");
    } else if (!password) {
      showToast("Please enter your password");
    } else if (passwordValid) {
      showToast("Please enter valid password");
    } else if (!agree) {
      showToast("Please accept terms and condition");
    } else {
      setError(false);
      userRegistration();
    }
  };

  const handleKidValidation = () => {
    if (!guardianName) {
      showToast("Please enter guardian name");
    } else if (guardianNameValid) {
      showToast("Please enter valid guardian name");
    } else if (!mobileNumber) {
      showToast("Please enter guardian Phone Number");
    } else if (mobileNumberValid) {
      showToast("Please enter valid guardian Phone Number");
    } else if (!email) {
      showToast("Please enter guardian Email ID");
    } else if (emailValid) {
      showToast("Please enter guardian valid Email ID");
    } else if (!legal) {
      showToast("Please accept you are legal guardian");
    } else if (!password) {
      showToast("Please enter your password");
    } else if (passwordValid) {
      showToast("Please enter valid password");
    } else {
      setError(false);
      userRegistration();
    }
  };

  const userRegistration = async () => {
    var body = {
      user_type: tab == 1 ? "freelancer" : "employer",
      model_type: talent == "Model" ? "model" : talent == "Kid" ? "child" : "",
      email: email,
      dob: date,
      first_name: fname,
      last_name: lname,
      gender:
        gender == "Male" || gender == "male"
          ? "male"
          : gender == "Female" || gender == "female"
          ? "female"
          : gender == "Non Binary" ||
            gender == "non binary" ||
            gender == "other"
          ? "other"
          : "",
      password: password,
      organization: organization,
      gardian_name: guardianName,
      gardian_concent: legal,
      mobile: mobileNumber,
      terms: agree,
    };
    let res = await dispatch(userRegister(body, Url.USER_REGISTER));
    if (res?.status == 200) {
      // dispatch(navigatorStatus(routeName?.DRAWER, "", true));
      navigation?.push(routeName?.VERIFICATION);
    }
  };

  const handleTalentTab = (type) => {
    setTalent("");
    setGuardianName("");
    setOrganization("");
    setTab(type);
  };
  const handleClientTab = (type) => {
    setTalent("");
    setDate(currentDate);
    setTab(type);
  };

  const onDateSelected = (event, value) => {
    // setDate(value);
    // setDatePicker(false);
  };

  const options = [
    {
      name: "a Model",
      icon: Images?.modelIcon,
      type: 1, 
    },
    // {
    //   name: "Client",
    //   icon : Images?.anup,
    //   type: 2,
    //   onPress: (type) => handleClientTab(type),
    // },
    {
      name: "a Photographer",
      icon: Images?.photographerIcon,
      type: 3, 
    },
    {
      name: "an Actor",
      icon: Images?.actorIcon,
      type: 4, 
    },
  ];
  const handleVerify = async () => {
    if (tab == 0) {
      showToast("Please choose user type", "error");
    } else if (!agree) {
      showToast(
        "To continue, Please agree to our terms and conditions",
        "error"
      );
    } else if (!email) {
      showToast("Please enter Email ID", "error");
    } else if (emailValid) {
      showToast("Please enter valid Email ID", "error");
    } else {
      var body = {
        email: email,
        type: "send_otp",
      };
      let res = await dispatch(sendVerficationEmail(body));
      if (res?.status == 200) {
        navigation?.navigate(routeName?.VERIFICATION, {
          routeName: routeName?.SIGNUP,
          tab: tab,
          emailID: email,
          social: "email",
        });
      }
    }
  };

  const handleTab = (item) => {
    setTab(item?.type);
    if (item?.type == 1) {
      setTalent("Model");
    } else if (item?.type == 4) {
      setTalent("Actor");
    } else if (item?.type == 3) {
      setTalent("Photographer");
    }
    setDate(currentDate);
    setSocialModal(true);
    // setSocialType(0);
  };
  console.log("onPressonPressdddd-----", tab, talent, socialType);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <AuthHeader name="Sign Up" navigation={navigation} />
        <Loader loading={auth?.isLoading || loading} />
        {socialModal ? (
          <SocialLogin
            show={socialModal}
            setShow={setSocialModal}
            socialType={socialType}
            setSocialType={setSocialType}
            route={routeName?.SIGNUP}
            tab={tab}
            loading={loading}
            setLoading={setLoading}
            userData={{
              user_type: talent,
            }}
          />
        ) : null}
        <View style={Styles?.cardContainer}>
          {agree ? (
            <>
              <View style={{ paddingVertical: 10 }}>
                <TextComponent
                  text="Join us and Find work"
                  size={Sizes?.xxl}
                  style={{ paddingBottom: 20, textAlign: "center" }}
                />

                <ScrollView showsHorizontalScrollIndicator={false}>
                  {options?.map((item, index) => {
                    return (
                      <View key={index}>
                        <TouchableOpacity
                          style={styling.card}
                          onPress={() => handleTab(item)}
                        >
                          <Image
                            source={item?.icon}
                            style={{
                              width: 50,
                              height: 80,
                            }}
                          />
                          <Text style={styling.label}>I’m {item?.name}</Text>
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </ScrollView>
              </View>

              {socialType == "Email" && (
                <View
                  style={{
                    ...Styles?.container,
                    width: "100%",
                    backgroundColor: Colors?.lightGray,
                    marginHorizontal: 0,
                    justifyContent: "center",
                    marginTop: 10,
                  }}
                >
                  <TextComponent
                    text={"It's Free to Sign Up and Get Started."}
                    size={Sizes?.l}
                    style={{ paddingVertical: 10 }}
                    color={Colors?.blue}
                  />

                  <TextComponent
                    text={"Verify your email"}
                    size={Sizes?.l}
                    fontWeight="400"
                    style={{ paddingTop: 20 }}
                  />
                  <InputBox
                    type="email"
                    value={email.trim()}
                    placeholder={"Email ID *"}
                    onChangeText={(val) => setEmail(val)}
                    error={emailValid}
                    fontIcon="email"
                    isEmpty={error && isFieldEmpty(email)}
                  />

                  <Button
                    title="Verify"
                    icon={true}
                    background={true}
                    backgroundColor={Colors?.blue}
                    onPress={() => handleVerify()}
                  />
                </View>
              )}
            </>
          ) : (
            <>
              <TextComponent
                text={`To continue, Please agree to our terms and conditions:`}
                size={Sizes?.l}
                style={{ textAlign: "center", paddingVertical: 10 }}
              />
              <Checkbox
                onPress={() => setTermsModal(true)}
                checked={agree}
                setChecked={setAgree}
                text={"Agree Our "}
                span="Terms and Conditions"
              />
              <Modal
                transparent={true}
                visible={termsModal}
                animationType="slide"
                useNativeDriver={true}
                onRequestClose={() => setTermsModal(false)}
              >
                <View style={styling.termsModal}>
                  <View style={styling?.termsView}>
                    <TextComponent
                      text={`To continue, Please agree to our terms and conditions:`}
                      size={Sizes?.xl}
                      style={{ textAlign: "center", paddingVertical: 10 }}
                    />
                    <ScrollView showsVerticalScrollIndicator={false}>
                      <Lotties
                        source={JSONS?.termsOfServiceJSON}
                        style={{
                          width: "100%",
                          height: 200,
                          alignSelf: "center",
                        }}
                      />

                      <TextComponent
                        text={`◉  No profanity`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />
                      <TextComponent
                        text={`◉  No explicit content/nudity`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />
                      <TextComponent
                        text={`◉  Do not post abusive content`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />
                      <TextComponent
                        text={`◉  Scams are prohibited`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />
                      <TextComponent
                        text={`◉  No bullying `}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />
                      <TextComponent
                        text={`◉  No negative comments`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />

                      <TextComponent
                        text={`For more information on our terms and conditions, Tap here...`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.gray}
                        style={{ ...styling?.text, marginVertical: 10 }}
                      />
                      <TouchableOpacity
                        onPress={() => {
                          setConditionModal(true);
                          setTermsModal(false);
                        }}
                      >
                        <TextComponent
                          text={`View Terms & Condiotions`}
                          size={Sizes?.s}
                          color={Colors?.blue}
                          style={{ ...styling?.text }}
                        />
                      </TouchableOpacity>
                    </ScrollView>

                    <View
                      style={{
                        ...Styles?.flexRow,
                        width: "45%",
                        alignSelf: "flex-end",
                      }}
                    >
                      <TouchableOpacity
                        onPress={() => {
                          setAgree(false);
                          setTermsModal(false);
                        }}
                        style={{
                          ...Styles?.smallButton,
                          backgroundColor: Colors?.red,
                          borderRadius: 10,
                        }}
                      >
                        <TextComponent
                          text={"Disagree"}
                          size={Sizes?.l}
                          color={Colors?.white}
                          style={{ ...styling?.text }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => {
                          setAgree(true);
                          setTermsModal(false);
                        }}
                        style={{
                          ...Styles?.smallButton,
                          backgroundColor: Colors?.themeColor,
                          borderRadius: 10,
                          marginHorizontal: 10,
                        }}
                      >
                        <TextComponent
                          text={"I agree"}
                          size={Sizes?.l}
                          color={Colors?.white}
                          style={{ ...styling?.text }}
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </Modal>
              <Modal
                transparent={true}
                visible={conditionModal}
                animationType="slide"
                useNativeDriver={true}
                onRequestClose={() => setConditionModal(false)}
              >
                <View style={styling.termsModal}>
                  <View style={styling?.termsView}>
                    <TermsCondition
                      termsModal={conditionModal}
                      setTermsModal={setConditionModal}
                      agree={true}
                      setAgree={setAgree}
                    />
                  </View>
                </View>
              </Modal>
            </>
          )}
        </View>
        <View>
          <TouchableOpacity
            style={styling.bottomView}
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
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styling = StyleSheet.create({
  container: {
    // flexDirection: "row",
    // justifyContent: "space-around",
    paddingVertical: 20,
  },
  card: {
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 15,
    marginVertical: 10,
    // borderColor: Colors?.darkgrey,
    // width: "90%",
  },
  label: {
    // marginTop: 10,
    fontSize: 15,
    fontWeight: "600",
  },
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  termsModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    width: "100%",
  },
  termsView: {
    // position: "absolute",
    maxHeight: 700,
    marginHorizontal: 15,
    // borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
{
  /* <Button title="Join as Photographer" icon={true} />
          <TextComponent
            text="Or"
            size={Sizes?.l}
            color={Colors?.darkgrey}
            style={{
              paddingVertical: 10,
              textAlign: "center",
              marginBottom: 10,
            }}
          /> */
}
{
  /* <Tabs
            leftTitle="Talent"
            rightTitle="Client"
            onLeftTab={() => handleTalentTab()}
            onRightTab={() => handleClientTab()}
            tab={tab}
          /> */
}
{
  /* <InputBox
                type="dropdown"
                value={talent}
                placeholder="Select talent Type"
                onChangeText={(val) => setTalent(val)}
                icon={Images?.userType}
                editable={false}
                options={talentTypes}
              /> */
}
