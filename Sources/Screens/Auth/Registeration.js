import moment from "moment";
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
} from "../../Components";
import { Sizes, Colors, Images, dimensionheight } from "../../Constants";
import {
  actorTypes,
  expertises,
  genderTypes,
  kidGenderTypes,
  talentTypes,
} from "../../Global";
import {
  getOptionsData,
  getUserDetail,
  photographerRegister,
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
import DateTimePicker from "@react-native-community/datetimepicker";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import * as Url from "../../API Services/Url";
import axios from "axios";
import { getCountryList } from "../../Redux/Services/OtherServices";
import { PhoneNumberVerify } from "./PhoneNumberVerify";
export const Registeration = ({ navigation, route }) => {
  const { tab, emailID, authentication_type } = route?.params;
  let currentDate = new Date();
  const auth = useSelector((state) => state?.authReducer);
  const registrationData = auth?.registrationData?.registrationData;
  const optionsType = useSelector((state) => state.authReducer.allOptionData);
  // console.log("optionsTypeoptionsType-----", optionsType);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fname, setFname] = useState("");
  const [lname, setLname] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [callingCode, setCallingCode] = useState("1");
  const [gender, setGender] = useState("");
  const [legal, setLegal] = useState(false);
  const [termsModal, setTermsModal] = useState(false);
  const [retouchConcent, setRetouchConcent] = useState(false);
  const [agree, setAgree] = useState("");
  const [talent, setTalent] = useState("");
  // const [tab, setTab] = useState(0);
  const [date, setDate] = useState(currentDate);
  const [organization, setOrganization] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [datePicker, setDatePicker] = useState(false);

  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [expertise, setExpertise] = useState("");
  const [experience, setExperience] = useState("");
  const [twitterFollowers, setTwitterFollowers] = useState("");
  const [facebookFollowers, setFacebookFollowers] = useState("");
  const [youtubeFollowers, setYoutubeFollowers] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState("");
  const [vimeoFollowers, setVimeoFollowers] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");

  const [mySkill, setMySkill] = useState("");
  const [customSkills, setCustomSkills] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [show, setShow] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [userData, setUserData] = useState("");

  // actor fields
  const [relationStatus, setRelationStatus] = useState("");

  const [options, setOptions] = useState({
    femaleOptions: auth?.allOptionData?.femaleOptions,
    maleOptions: auth?.allOptionData?.maleOptions,
    childOptions: auth?.allOptionData?.childOptions,
    otherOptions: auth?.allOptionData?.otherOptions,
    socialMediaOptions: auth?.allOptionData?.socialMediaOptions,
  });
  const [basicDetails, setBasicDetails] = useState({
    fname: "",
    lname: "",
    mobileNumber: "",
    birthDate: new Date(),
    age: "",
    displayName: "",
    hourlyRate: "",
    fullRate: "",
    halfRate: "",
    tagLine: "",
    profilePhoto: "",
    guardianName: "",
    yearsExperience: "",
    cameraType: "",
    retouchConcent: "",
    listedFor: "",
    customExpertise: "",
  });
  const [address, setAddress] = useState({
    addressLine: "",
    addressLine2: "",
    postalCode: "",
  });
  const [socialLinks, setSocialLinks] = useState({
    facebook: "",
    instagram: "",
    twitter: "",
    youtube: "",
    vimeo: "",
    tikTok: "",
  });
  const [bioDetails, setBioDetails] = useState({
    professionalBio: "",
    personalBio: "",
  });
  const [location, setLocation] = useState({
    countryID: "",
    countryList: "",
    stateList: "",
    cityList: "",
  });
  const fnameValid = fname ? regName(fname) : regName(basicDetails?.fname);
  const lnameValid = lname ? regName(lname) : regName(basicDetails?.lname);
  const guardianNameValid = regName(guardianName);
  const mobileNumberValid = isValidPhoneNumber(mobileNumber);
  const emailValid = isValidEmail(email);
  const passwordValid = passwordPattern(password);
  const handleSignup = () => {
    setError(true);
    if (tab == 1 || tab == 4) {
      if (!talent) {
        showToast("Please select talent type", "error");
      } else if (date == currentDate) {
        showToast("Please choose your date of birth", "error");
      } else if (!fname) {
        showToast("Please enter your first name", "error");
      }
      //  else if (fnameValid) {
      //   showToast("Please enter valid first name", "error");
      // }
      else if (!lname) {
        showToast("Please enter your last name", "error");
      }
      // else if (lnameValid) {
      //   showToast("Please enter valid last name", "error");
      // }
      else if (!gender) {
        showToast("Please select gender", "error");
      } else if (talent == "Model" || talent == "Actor" || talent == "actor") {
        handleModelValidation();
      } else if (
        talent == "Model kid" ||
        talent == "Model Kid" ||
        talent == "Actor kid" ||
        talent == "Actor Kid"
      ) {
        handleKidValidation();
      }
      console.log("talenttalenttalenttalent-------", talent);
    } else if (tab == 2) {
      setError(true);

      if (!fname) {
        showToast("Please enter your first name", "error");
      } else if (fnameValid) {
        showToast("Please enter valid first name", "error");
      } else if (!lname) {
        showToast("Please enter your last name", "error");
      } else if (lnameValid) {
        showToast("Please enter valid last name", "error");
      } else if (!organization) {
        showToast("Please enter organization", "error");
      } else if (!mobileNumber) {
        showToast("Please enter your Phone Number", "error");
      } else if (mobileNumberValid) {
        showToast("Please enter valid Phone Number", "error");
      } else if (!email) {
        showToast("Enter your Email ID", "error");
      } else if (emailValid) {
        showToast("Enter your valid Email ID", "error");
      } else if (!password) {
        showToast("Please enter your password", "error");
      } else if (authentication_type != "Social" && passwordValid) {
        showToast("Please enter valid password", "error");
      } else if (!agree) {
        showToast("Please accept terms and condition", "error");
      } else {
        setError(false);
        userRegistration();
      }
    }
  };

  const handleModelValidation = () => {
    console.log("mobileNumbermobileNumbermobileNumber");
    setError(true);
    if (!mobileNumber) {
      showToast("Please enter your Phone Number", "error");
    } else if (mobileNumberValid) {
      showToast("Please enter valid Phone Number", "error");
    } else if (!email) {
      showToast("Enter your Email ID", "error");
    } else if (emailValid) {
      showToast("Enter your valid Email ID", "error");
    } else if (authentication_type != "Social" && !password) {
      showToast("Please enter your password", "error");
    } else if (authentication_type != "Social" && passwordValid) {
      showToast("Please enter valid password", "error");
    } else if (!agree) {
      showToast("Please accept terms and condition", "error");
    } else {
      setError(false);
      userRegistration();
    }
  };

  const handleKidValidation = () => {
    setError(true);
    if (!guardianName) {
      showToast("Please enter guardian name", "error");
    } else if (guardianNameValid) {
      showToast("Please enter valid guardian name", "error");
    } else if (!mobileNumber) {
      showToast("Please enter guardian Phone Number", "error");
    } else if (mobileNumberValid) {
      showToast("Please enter valid guardian Phone Number", "error");
    } else if (!email) {
      showToast("Please enter guardian Email ID", "error");
    } else if (emailValid) {
      showToast("Please enter guardian valid Email ID", "error");
    } else if (!legal) {
      showToast("Please accept you are legal guardian", "error");
    } else if (authentication_type != "Social" && !password) {
      showToast("Please enter your password", "error");
    } else if (authentication_type != "Social" && passwordValid) {
      showToast("Please enter valid password", "error");
    } else {
      setError(false);
      userRegistration();
    }
  };
  const userRegistration = async () => {
    setError(true);
    var body = {
      // user_type: tab == 1 ? "freelancer" : "employer",
      // model_type: talent == "Model" ? "model" : talent == "Kid" ? "child" : "",
      user_type:
        talent == "Model" ||
        talent == "model" ||
        talent == "Model Kid" ||
        talent == "Model kid"
          ? "freelancer"
          : talent === "Actor" || talent === "Actor Kid"
          ? "actor"
          : "employer",
      model_type:
        talent == "Model"
          ? "model"
          : talent == "Model Kid"
          ? "child"
          : talent === "Actor Kid"
          ? "child"
          : talent === "Actor"
          ? "actor"
          : "",
      email: email,
      dob: moment(basicDetails?.birthDate).format("YYYY-MM-DD"),
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
      password:
        authentication_type == "Social" ? registrationData?.uid : password,
      organization: organization,
      // gardian_name: guardianName,
      // gardian_concent: legal,
      mobile: mobileNumber,
      terms: agree,
      platform: Platform?.OS,

      country_code: callingCode,
    };
    if (registrationData?.uid && authentication_type == "Social") {
      body.uid = registrationData?.uid;
    }
    if (talent == "Actor Kid" || talent == "Model Kid") {
      body.gardian_name = guardianName;
      body.gardian_concent = legal;
    }

    if (talent == "Actor") {
      body.relationship_status = relationStatus;
    }
    console.log("userRegister body-----", body);
    let res = await dispatch(
      userRegister(
        body,
        registrationData?.uid && authentication_type == "Social"
          ? Url?.SOCIAL_USER_REGISTER
          : Url.USER_REGISTER
      )
    );
    console.log("userRegister res-----", res);

    if (res?.status == 200) {
      setError(false);
      dispatch(navigatorStatus(routeName?.DRAWER, "", true));
      // navigation?.push(routeName?.VERIFICATION);
    }
  };
  useEffect(() => {
    getAllOptionsData();
    getAllCountryName("country", 1);
    setEmail(emailID);
  }, []);
  useEffect(() => {
    if (location?.countryList?.length != 0) {
      getStateList("country", 1);
    }
  }, [location?.countryList]);

  const getStateList = async (type) => {
    setCountry("United States");
    storeData(storageKey?.COUNTRY_ID, "233");
    getAllCountryName("state", 1);
    // var body = {
    //   country: "233",
    //   state: "",
    //   city: "",
    // };
    // let res = await dispatch(getCountryList(body));
    // if (res?.status == 200) {
    //   let data;
    //   data = JSON?.parse(res?.results);
    //   setLocation({ ...location, stateList: data });
    // }
  };

  const getAllOptionsData = async () => {
    let userRole = await getData(storageKey?.USER_ROLE);
    // setUserRole(userRole);
    let res = await dispatch(getOptionsData());
    setOptions({
      ...options,
      femaleOptions: res?.results?.group_62749b609360c,
      maleOptions: res?.results?.group_62749a513bf1a,
      childOptions: res?.results?.group_63181d08b6357,
      otherOptions: res?.results?.group_627497cf304a6,
      socialMediaOptions: res?.results?.group_62849b4520284,
    });
  };

  const getAllCountryName = async (type, step) => {
    let countryID = await getData(storageKey?.COUNTRY_ID);
    let stateID = await getData(storageKey?.STATE_ID);
    var body = {
      country: type == "country" ? "" : JSON?.parse(countryID),
      state: type == "city" ? JSON?.parse(stateID) : "",
      city: "",
    };
    let res = await dispatch(getCountryList(body));
    if (res?.status == 200) {
      let data;
      if (type == "country") {
        data = res?.results;
        setLocation({
          ...location,
          countryList: data,
        });
      } else if (type == "state") {
        // setState("");
        // setCity("");
        if (res?.results?.length != 0) {
          data = JSON?.parse(res?.results);
          setLocation({
            ...location,
            stateList: data,
          });
        } else {
          setLocation({
            ...location,
            stateList: [],
          });
        }
      } else if (type == "city") {
        if (res?.results?.length != 0) {
          data = JSON?.parse(res?.results);
          setLocation({
            ...location,
            cityList: data,
          });
        } else {
          setLocation({
            ...location,
            cityList: [],
          });
        }
      }
    }
  };

  const handlePhotographerValidation = async () => {
    setError(true);
    if (!basicDetails?.fname) {
      showToast("Please enter your first name", "error");
    } else if (fnameValid) {
      showToast("Please enter valid first name", "error");
    } else if (!basicDetails?.lname) {
      showToast("Please enter your last name", "error");
    } else if (lnameValid) {
      showToast("Please enter valid last name", "error");
    } else if (!basicDetails?.displayName) {
      showToast("Please enter your display name", "error");
    } else if (!mobileNumber) {
      showToast("Please enter your mobile number", "error");
    } else if (mobileNumberValid) {
      showToast("Please enter valid mobile Number", "error");
    } else if (!gender) {
      showToast("Please choose your gender", "error");
    } else if (!basicDetails?.birthDate) {
      showToast("Please choose your birth date", "error");
    } else if (!email) {
      showToast("Please enter your Email ID", "error");
    } else if (emailValid) {
      showToast("Please enter valid Email ID", "error");
    } else if (!password) {
      showToast("Please enter your password", "error");
    } else if (authentication_type != "Social" && passwordValid) {
      showToast("Please enter valid password", "error");
    } else if (!basicDetails?.fullRate) {
      showToast("Please enter full rate", "error");
    } else if (!basicDetails?.halfRate) {
      showToast("Please enter half rate", "error");
    } else if (!basicDetails?.hourlyRate) {
      showToast("Please enter hourly rate", "error");
    } else if (!country) {
      showToast("Please select your country", "error");
    } else if (!state) {
      showToast("Please select your state", "error");
    } else if (!city) {
      showToast("Please select your city", "error");
    } else if (!address?.addressLine) {
      showToast("Please enter your address Line", "error");
    } else if (!address?.postalCode) {
      showToast("Please enter your postal code", "error");
    } else if (!bioDetails?.professionalBio) {
      showToast("Please enter your professional bio", "error");
    } else if (!bioDetails?.personalBio) {
      showToast("Please enter your personal bio", "error");
    } else if (!bioDetails?.professionalBio) {
      showToast("Please enter your professional bio", "error");
    } else if (!expertise) {
      showToast("Please choose your expertise", "error");
    } else if (!experience) {
      showToast("Please choose your experience level", "error");
    } else if (!basicDetails?.yearsExperience) {
      showToast("Please enter your years of experience ", "error");
    } else {
      setError(false);
      handlePhotographerRegisteration();
    }
  };
  const handlePhotographerRegisteration = async () => {
    var body = {
      user_type: "photographer",
      pre: "new",
      per_website: "",
      email: email,
      // model_type: talent == "Model" ? "model" : talent == "Kid" ? "child" : "",
      model_type: "photographer",
      password:
        authentication_type == "Social" ? registrationData?.uid : password,

      address_line1: address?.addressLine,
      avatar:
        "https://booksculp.com/dev/wp-content/uploads/workreap-temp/00002-2.jpg",

      first_name: basicDetails?.fname,
      last_name: basicDetails?.lname,
      display_name: basicDetails?.displayName,

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
      country: country,
      state: state,
      city: city,

      skills: mySkill,
      custom_skills: customSkills,
      dob: moment(basicDetails?.birthDate).format("YYYY-MM-DD"),
      tageline: basicDetails?.tagLine,

      expertise: expertise,
      custom_expertise: basicDetails?.customExpertise,
      experiences_level: experience,

      full_day_rate: basicDetails?.fullRate,
      half_day_rate: basicDetails?.halfRate,
      hourly_rate: basicDetails?.hourlyRate,

      mobile: mobileNumber,
      country_code: callingCode,
      pack_status: "basic",

      personal_bio: bioDetails?.personalBio,
      professional_bio: bioDetails?.professionalBio,
      postal_code: address?.postalCode,
      years_experience: basicDetails?.yearsExperience,
      camera_type: "dxsdxcsc",
      retouch_concent: "cdscdsc",
      listed_with_booksculp: "cdscsc",

      facebook_followers: facebookFollowers,
      facebook_link: socialLinks?.facebook,

      instagram_followers: instagramFollowers,
      instagram_link: socialLinks?.instagram,

      youtube_followers: youtubeFollowers,
      youtube_link: socialLinks?.youtube,

      twitter_followers: twitterFollowers,
      twitter_link: socialLinks?.twitter,

      vimeo_followers: vimeoFollowers,
      vimeo_link: socialLinks?.vimeo,

      tiktok_followers: tiktokFollowers,
      tiktok_link: socialLinks?.tikTok,
      platform: Platform?.OS,
    };
    if (registrationData?.uid && authentication_type == "Social") {
      body.uid = registrationData?.uid;
      body.user_id = registrationData?.user_id || registrationData?.id;
      body.profile_id = registrationData?.profile_id;
    }
    let res = await dispatch(photographerRegister(body));
    console.log("resresresresres-----", res);
    if (res?.status == 200) {
      setUserResponse(res?.results);
      setShow(true);
    }
  };

  const navigateToGallery = async () => {
    navigation?.navigate(routeName?.PROFILE_GALLERY, {
      routeName: routeName?.REGISTERATION,
      userId: userResponse?.user_id,
      profileId: userResponse?.profile_id,
    });
  };
  useEffect(() => {
    getUserData();
    setTalent(tab == 1 ? "Model" : "Actor");
    if (registrationData?.user_id) {
      setTalent(
        registrationData?.model_type == "model"
          ? "Model"
          : registrationData?.model_type == "kid" ||
            registrationData?.model_type == "Kid" ||
            registrationData?.model_type == "child"
          ? "Kid"
          : "Model"
      );
      setBasicDetails({
        ...basicDetails,
        fname: registrationData?.first_name,
        lname: registrationData?.last_name,
        displayName: registrationData?.display_name,

        age:
          authentication_type == "Social"
            ? ""
            : registrationData?.age_months
            ? registrationData?.age_months
            : registrationData?.model_age,
        model_age: registrationData?.model_age,

        birthDate:
          authentication_type == "Social"
            ? new Date()
            : registrationData?.dob
            ? new Date(registrationData?.dob)
            : new Date(),
        mobileNumber: registrationData?.mobile || "",
        guardianName: registrationData?.gardian_name,
        hourlyRate:
          registrationData?.model_type == "Kid" ||
          registrationData?.model_type == "child"
            ? "75"
            : "100",
      });
      setGender(registrationData?.gender);
      setFname(registrationData?.first_name);
      setLname(registrationData?.last_name);
      setEmail(registrationData?.user_email || registrationData?.email);
      setMobileNumber(registrationData?.mobile || "");
      setPassword(authentication_type == "Social" ? registrationData?.uid : "");
    }
    // setClientDetails({
    //   ...clientDetails,
    //   organization: registrationData?.organization,
    // });
  }, []);

  // console.log("registrationDataregistrationData----", registrationData);
  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
      }
    }
  };
  // console.log("onPressonPress denknekdnek-----", tab, talent);

  return (
    <>
      {show ? (
        <PhoneNumberVerify
          show={show}
          setShow={setShow}
          navigation={navigation}
          callingCode={callingCode}
          setCallingCode={setCallingCode}
          basicDetails={basicDetails}
          setBasicDetails={setBasicDetails}
          mobileNumber={mobileNumber}
          setMobileNumber={setMobileNumber}
          userData={{
            countryCode: callingCode,
            phone_number: mobileNumber || basicDetails?.mobileNumber,
            userID: registrationData?.id,
            verified: userData?.user_data?.phone_verified_status,
          }}
          onApprove={navigateToGallery}
        />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled={true}
          behavior={Platform?.OS == "ios" ? "padding" : null}
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <AuthHeader name="Registeration" navigation={navigation} />
            <Loader loading={auth?.isLoading} />
            <View style={Styles?.cardContainer}>
              {tab == 1 || tab == 2 || tab == 4 ? (
                <View>
                  {tab != 2 && (
                    <>
                      <DropDownList
                        placeholder={
                          tab == 1
                            ? "Select Talent Type *"
                            : "Select Actor Type *"
                        }
                        fontIcon={"account-details"}
                        value={talent}
                        setValue={setTalent}
                        options={tab == 1 ? talentTypes : actorTypes}
                        border={false}
                        isEmpty={error && isFieldEmpty(talent)}
                      />
                      {/* <InputBox
                  type="datePicker"
                  placeholder="DD/MM/YYYY *"
                  date={new Date(basicDetails?.birthDate)}
                  setDate={(date) => {
                    setBasicDetails({ ...basicDetails, birthDate: date });
                  }}
                  isEmpty={error && isFieldEmpty(basicDetails?.birthDate)}
                  disable={false}
                  maximum={
                    gender == "kid" || gender == "Kid" || gender == "child"
                      ? true
                      : false
                  }
                  minimum={maximum}
                /> */}
                      <InputBox
                        type="datePicker"
                        placeholder="DD/MM/YYYY *"
                        date={new Date(basicDetails?.birthDate)}
                        setDate={(date) => {
                          setBasicDetails({ ...basicDetails, birthDate: date });
                        }}
                        isEmpty={error && isFieldEmpty(basicDetails?.birthDate)}
                        minimum={
                          talent == "Model kid" ||
                          talent == "Model Kid" ||
                          talent == "Actor kid" ||
                          talent == "Actor Kid" ||
                          talent == "child"
                            ? true
                            : false
                        }
                        maximum={
                          talent == "Model" ||
                          talent == "model" ||
                          talent == "Actor" ||
                          talent == "actor"
                            ? false
                            : true
                        }
                      />
                    </>
                  )}
                  <InputBox
                    type="text"
                    value={fname}
                    placeholder="First Name *"
                    onChangeText={(val) => setFname(val)}
                    error={fnameValid}
                    isEmpty={error && isFieldEmpty(fname)}
                    toolTipText={"Add your first name"}
                    fontIcon={"account"}
                  />
                  <InputBox
                    type="text"
                    value={lname}
                    placeholder="Last Name *"
                    onChangeText={(val) => setLname(val)}
                    // error={lnameValid}
                    isEmpty={error && isFieldEmpty(lname)}
                    toolTipText={"Add your last name"}
                    fontIcon={"account"}
                  />
                  {tab == 1 || tab == 4 ? (
                    <DropDownList
                      placeholder={"Select Gender *"}
                      fontIcon={"gender-male-female-variant"}
                      value={gender}
                      setValue={setGender}
                      options={
                        talent == "Model kid" ||
                        talent == "Model Kid" ||
                        talent == "Actor kid" ||
                        talent == "Actor Kid" ||
                        talent == "child"
                          ? kidGenderTypes
                          : genderTypes
                      }
                      border={false}
                      isEmpty={error && isFieldEmpty(gender)}
                    />
                  ) : tab == 2 ? (
                    <InputBox
                      type="text"
                      value={organization}
                      placeholder="Organization *"
                      onChangeText={(val) => setOrganization(val)}
                      isEmpty={error && isFieldEmpty(organization)}
                      fontIcon={"office-building"}
                    />
                  ) : null}
                  {talent == "Model kid" ||
                  talent == "Model Kid" ||
                  talent == "Actor kid" ||
                  talent == "Actor Kid" ? (
                    <InputBox
                      type="text"
                      value={guardianName}
                      placeholder="Guardian Name *"
                      onChangeText={(val) => setGuardianName(val)}
                      error={guardianNameValid}
                      isEmpty={error && isFieldEmpty(guardianName)}
                      fontIcon={"human-male-female-child"}
                    />
                  ) : null}
                  <InputBox
                    type="phone"
                    value={mobileNumber}
                    placeholder={
                      talent == "Model kid" ||
                      talent == "Model Kid" ||
                      talent == "Actor kid" ||
                      talent == "Actor Kid"
                        ? "Guardian Phone Number *"
                        : "Phone Number *"
                    }
                    callingCode={callingCode}
                    setCallingCode={setCallingCode}
                    onChangeText={(val) => setMobileNumber(val)}
                    error={mobileNumberValid}
                    isEmpty={error && isFieldEmpty(mobileNumber)}
                    hideVerify={true}
                    // fontIcon={"phone-dial"}
                  />
                  {talent === "Actor" ? (
                    <DropDownList
                      title="Relationship Status"
                      placeholder="Select Status"
                      options={
                        optionsType?.actorRelation?.relationship_status
                          ?.field_meta?.choices
                      }
                      value={relationStatus}
                      setValue={setRelationStatus}
                      fontIcon={"gender-male-female-variant"}
                    />
                  ) : undefined}
                  <InputBox
                    type="email"
                    value={email}
                    placeholder={
                      talent == "Model kid" ||
                      talent == "Model Kid" ||
                      talent == "Actor kid" ||
                      talent == "Actor Kid"
                        ? "Guardian Email ID *"
                        : "Email ID *"
                    }
                    onChangeText={(val) => setEmail(val)}
                    error={emailValid}
                    fontIcon="email"
                    isEmpty={error && isFieldEmpty(email)}
                    editable={authentication_type != "Social"}
                  />
                  {authentication_type != "Social" && (
                    <InputBox
                      type="password"
                      value={password}
                      placeholder="Password *"
                      onChangeText={(val) => setPassword(val)}
                      error={passwordValid}
                      fontIcon="lock"
                      isEmpty={error && isFieldEmpty(password)}
                    />
                  )}
                  {talent == "Model kid" ||
                  talent == "Model Kid" ||
                  talent == "Actor kid" ||
                  talent == "Actor Kid" ? (
                    <View
                      style={{
                        backgroundColor: Colors?.lightGray,
                        paddingVertical: 10,
                        paddingHorizontal: 20,
                        borderRadius: 10,
                        marginVertical: 5,
                      }}
                    >
                      <TextComponent
                        text="You need to provide the gardian information for kids registeration eg. Email, Phone"
                        color={Colors?.gray}
                        size={Sizes?.s}
                        fontWeight="400"
                        style={{ marginBottom: 5 }}
                      />
                      <Checkbox
                        checked={legal}
                        setChecked={setLegal}
                        text={" I am the legal guardian"}
                      />
                    </View>
                  ) : null}
                  <Checkbox
                    onPress={() => setTermsModal(true)}
                    checked={agree}
                    setChecked={setAgree}
                    text={"Agree Our "}
                    span="Terms and Conditions"
                  />
                </View>
              ) : (
                <View>
                  <InputBox
                    type="text"
                    value={basicDetails?.fname}
                    placeholder="First Name *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, fname: val })
                    }
                    isEmpty={error && isFieldEmpty(basicDetails?.fname)}
                    toolTipText={"Add your first name"}
                    fontIcon={"account"}
                  />
                  <InputBox
                    type="text"
                    value={basicDetails?.lname}
                    placeholder="Last Name *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, lname: val })
                    }
                    isEmpty={error && isFieldEmpty(basicDetails?.lname)}
                    toolTipText={"Add your last name"}
                    fontIcon={"account"}
                  />
                  <InputBox
                    type="text"
                    value={basicDetails?.displayName}
                    placeholder="Display Name *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, displayName: val })
                    }
                    isEmpty={error && isFieldEmpty(basicDetails?.displayName)}
                    toolTipText={"This will be your display name on this app"}
                    fontIcon={"account"}
                  />
                  <InputBox
                    type="phone"
                    value={mobileNumber}
                    placeholder={"Phone Number *"}
                    onChangeText={(val) => setMobileNumber(val)}
                    error={mobileNumberValid}
                    isEmpty={error && isFieldEmpty(mobileNumber)}
                    callingCode={callingCode}
                    setCallingCode={setCallingCode}
                    hideVerify={true}
                    // fontIcon={"phone-dial"}
                  />
                  <DropDownList
                    placeholder={"Select Gender *"}
                    value={gender}
                    setValue={setGender}
                    options={
                      gender == "kid" || gender == "Kid" || gender == "child"
                        ? kidGenderTypes
                        : genderTypes
                    }
                    border={false}
                    isEmpty={error && isFieldEmpty(gender)}
                    fontIcon={"gender-male-female-variant"}
                  />
                  <InputBox
                    type="datePicker"
                    placeholder="DD/MM/YYYY *"
                    date={new Date(basicDetails?.birthDate)}
                    setDate={(date) => {
                      setBasicDetails({ ...basicDetails, birthDate: date });
                    }}
                    isEmpty={error && isFieldEmpty(basicDetails?.birthDate)}
                    disable={false}
                  />

                  <InputBox
                    type="email"
                    value={email}
                    placeholder={"Email ID *"}
                    onChangeText={(val) => setEmail(val)}
                    error={emailValid}
                    fontIcon="email"
                    isEmpty={error && isFieldEmpty(email)}
                    editable={false}
                  />
                  {authentication_type != "Social" && (
                    <InputBox
                      type="password"
                      value={password}
                      placeholder="Password *"
                      onChangeText={(val) => setPassword(val)}
                      error={passwordValid}
                      fontIcon="lock"
                      isEmpty={error && isFieldEmpty(password)}
                    />
                  )}
                  <InputBox
                    type="numeric"
                    value={basicDetails?.fullRate}
                    placeholder="Full Day rate *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, fullRate: val })
                    }
                    fontIcon={"hours-24"}
                    keyboardType="numeric"
                    isEmpty={error && isFieldEmpty(basicDetails?.fullRate)}
                    toolTipText={"Add your full day rate"}
                  />
                  <InputBox
                    type="numeric"
                    value={basicDetails?.halfRate}
                    placeholder="Half Day Rate *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, halfRate: val })
                    }
                    fontIcon={"fraction-one-half"}
                    keyboardType="numeric"
                    isEmpty={error && isFieldEmpty(basicDetails?.halfRate)}
                    toolTipText={"Add your half day rate"}
                  />
                  <InputBox
                    type="numeric"
                    value={basicDetails?.hourlyRate}
                    placeholder="Hourly Rate *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, hourlyRate: val })
                    }
                    fontIcon={"timer-sand"}
                    keyboardType="numeric"
                    isEmpty={error && isFieldEmpty(basicDetails?.hourlyRate)}
                    toolTipText={"Add your per hour rate"}
                  />
                  <InputBox
                    type="text"
                    value={basicDetails?.tagLine}
                    placeholder="Tag Line"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, tagLine: val })
                    }
                    fontIcon="tag-text"
                    toolTipText={
                      "This is a quick line to help promote you. It will be shown on your profile page. Ex. Outgoing and Friendly"
                    }
                  />

                  {/* <DropDownList
                options={location?.countryList}
                placeholder={"Select Country *"}
                icon={Images?.locationIcon}
                value={country}
                setValue={setCountry}
                border={false}
                isEmpty={error && isFieldEmpty(country)}
                onSelect={() => getAllCountryName("state")}
                setSelectedRow={setSelectedRow}
                type="country"
                search={true}
              />
              <DropDownList
                options={location?.stateList}
                placeholder={
                  location?.stateList?.length != 0
                    ? "Select State *"
                    : "State not found !"
                }
                fontIcon={"sign-real-estate"}
                value={state}
                setValue={setState}
                border={false}
                isEmpty={error && isFieldEmpty(state)}
                disable={
                  location?.stateList?.length == 0
                    ? true
                    : country
                    ? false
                    : true
                }
                onSelect={() => getAllCountryName("city")}
                setSelectedRow={setSelectedRow}
                type="state"
                search={true}
              />
              <DropDownList
                options={location?.cityList}
                placeholder={
                  location?.stateList?.length != 0 ||
                  location?.cityList?.length != 0
                    ? "Select City *"
                    : "City not found !"
                }
                fontIcon={"city"}
                value={city}
                setValue={setCity}
                border={false}
                disable={
                  location?.stateList?.length == 0 ||
                  location?.cityList?.length == 0
                    ? true
                    : country && state
                    ? false
                    : true
                }
                search={true}
                isEmpty={error && isFieldEmpty(city)}
              /> */}
                  <DropDownList
                    options={location?.countryList}
                    placeholder={"Select Country *"}
                    icon={Images?.locationIcon}
                    value={country}
                    setValue={setCountry}
                    border={false}
                    isEmpty={error && isFieldEmpty(country)}
                    onSelect={() => {
                      getAllCountryName("state");
                      setState("");
                      setCity("");
                    }}
                    setSelectedRow={setSelectedRow}
                    type="country"
                    search={true}
                  />
                  <DropDownList
                    options={location?.stateList}
                    placeholder={
                      location?.stateList?.length != 0
                        ? "Select State *"
                        : "State not found !"
                    }
                    fontIcon={"sign-real-estate"}
                    value={state}
                    setValue={setState}
                    border={false}
                    isEmpty={error && isFieldEmpty(state)}
                    disable={
                      // location?.stateList?.length == 0
                      //   ? true
                      //   :
                      country ? false : true
                    }
                    onSelect={() => {
                      getAllCountryName("city");
                      setCity("");
                    }}
                    setSelectedRow={setSelectedRow}
                    type="state"
                    search={true}
                    onPress={() => getAllCountryName("state")}
                  />
                  <DropDownList
                    options={location?.cityList}
                    placeholder={
                      location?.stateList?.length != 0 ||
                      location?.cityList?.length != 0
                        ? "Select City *"
                        : "City not found !"
                    }
                    fontIcon={"city"}
                    value={city}
                    setValue={setCity}
                    border={false}
                    disable={
                      // location?.stateList?.length == 0 ||
                      // location?.cityList?.length == 0
                      //   ? true
                      //   :
                      country && state ? false : true
                    }
                    search={true}
                    isEmpty={error && isFieldEmpty(city)}
                    onPress={() => getAllCountryName("city")}
                  />
                  <InputBox
                    type="text"
                    icon={Images?.locationIcon}
                    value={address?.addressLine}
                    placeholder="Address Line *"
                    onChangeText={(val) =>
                      setAddress({ ...address, addressLine: val })
                    }
                    isEmpty={error && isFieldEmpty(address?.addressLine)}
                    toolTipText={
                      "For Payout purposes, P.O. Boxes are not accepted. A physical address is required"
                    }
                  />
                  <InputBox
                    type="numeric"
                    icon={Images?.locationIcon}
                    value={address?.postalCode}
                    placeholder="Postal Code *"
                    onChangeText={(val) =>
                      setAddress({ ...address, postalCode: val })
                    }
                    isEmpty={error && isFieldEmpty(address?.postalCode)}
                    toolTipText={"Fill Postal code here"}
                  />

                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Photographer Details"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="description"
                    value={bioDetails?.professionalBio}
                    placeholder="Professional Bio *"
                    onChangeText={(val) =>
                      setBioDetails({ ...bioDetails, professionalBio: val })
                    }
                    isEmpty={error && isFieldEmpty(bioDetails?.professionalBio)}
                  />
                  <InputBox
                    type="description"
                    value={bioDetails?.personalBio}
                    placeholder="Personal Bio *"
                    onChangeText={(val) =>
                      setBioDetails({ ...bioDetails, personalBio: val })
                    }
                    isEmpty={error && isFieldEmpty(bioDetails?.personalBio)}
                    style={{ marginVertical: 10 }}
                  />

                  <InputBox
                    type="multiselect"
                    placeholder={"Select Expertise *"}
                    fontIcon={"account-star"}
                    options={expertises}
                    setOption={setExpertise}
                    value={expertise}
                    border={false}
                    isEmpty={error && isFieldEmpty(gender)}
                  />
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Add custom expertise"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="description"
                    value={basicDetails?.customExpertise}
                    placeholder="Add custom expertise"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, customExpertise: val })
                    }
                    style={{ marginBottom: 10 }}
                  />

                  <DropDownList
                    placeholder={"Experience level *"}
                    fontIcon={"powershell"}
                    value={experience}
                    setValue={setExperience}
                    options={
                      options?.otherOptions?.experience_level?.field_meta
                        ?.choices
                    }
                    border={false}
                    isEmpty={error && isFieldEmpty(experience)}
                  />
                  <InputBox
                    type="text"
                    fontIcon={"powershell"}
                    value={basicDetails?.yearsExperience}
                    placeholder={"Years of experience *"}
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, yearsExperience: val })
                    }
                    isEmpty={
                      error && isFieldEmpty(basicDetails?.yearsExperience)
                    }
                  />
                  {/* <InputBox
              type="text"
              fontIcon={"camera"}
              value={basicDetails?.cameraType}
              placeholder={"What camera systems do you use ? *"}
              onChangeText={(val) =>
                setBasicDetails({ ...basicDetails, cameraType: val })
              }
            />
            <InputBox
              type="text"
              fontIcon={"link-plus"}
              value={basicDetails?.listedFor}
              placeholder={"Why do you want to be listed with Book Sculp ? *"}
              onChangeText={(val) =>
                setBasicDetails({ ...basicDetails, listedFor: val })
              }
            />
            <View
              style={{
                backgroundColor: Colors?.lightGray,
                paddingVertical: 10,
                paddingHorizontal: 20,
                borderRadius: 10,
                marginVertical: 5,
              }}
            >
              <Checkbox
                checked={retouchConcent}
                setChecked={setRetouchConcent}
                text={"  Do you Edit and Retouch your own images?"}
              />
            </View> */}
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Social Media"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="text"
                    fontIcon={"facebook"}
                    value={socialLinks?.facebook}
                    placeholder={
                      "https://www.facebook.com/facebook-profile-link"
                    }
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, facebook: val })
                    }
                  />
                  <DropDownList
                    placeholder={"Facebook Followers"}
                    fontIcon={"facebook"}
                    value={facebookFollowers}
                    setValue={setFacebookFollowers}
                    options={
                      options?.socialMediaOptions?.facebook_follower?.field_meta
                        ?.choices
                    }
                    border={false}
                  />
                  <InputBox
                    type="text"
                    fontIcon={"instagram"}
                    value={socialLinks?.instagram}
                    placeholder={
                      "https://www.instagram.com/instagram-profile-link"
                    }
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, instagram: val })
                    }
                  />
                  <DropDownList
                    placeholder={"Instagram Followers"}
                    fontIcon={"instagram"}
                    value={instagramFollowers}
                    setValue={setInstagramFollowers}
                    options={
                      options?.socialMediaOptions?.instagram_follower
                        ?.field_meta?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="text"
                    icon={Images?.xIcon}
                    value={socialLinks?.twitter}
                    placeholder={"https://twitter.com/x-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, twitter: val })
                    }
                  />

                  <DropDownList
                    placeholder={"X Followers"}
                    icon={Images?.xIcon}
                    value={twitterFollowers}
                    setValue={setTwitterFollowers}
                    options={
                      options?.socialMediaOptions?.twitter_follower?.field_meta
                        ?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="text"
                    fontIcon={"youtube"}
                    value={socialLinks?.youtube}
                    placeholder={"https://www.youtube.com/youtube-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, youtube: val })
                    }
                  />

                  <DropDownList
                    placeholder={"Youtube Followers"}
                    fontIcon={"youtube"}
                    value={youtubeFollowers}
                    setValue={setYoutubeFollowers}
                    options={
                      options?.socialMediaOptions?.youtube_follower?.field_meta
                        ?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="text"
                    fontIcon={"vimeo"}
                    value={socialLinks?.vimeo}
                    placeholder={"https://vimeo.com/vimeo-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, vimeo: val })
                    }
                  />

                  <DropDownList
                    placeholder={"Vimeo Followers"}
                    fontIcon={"vimeo"}
                    value={vimeoFollowers}
                    setValue={setVimeoFollowers}
                    options={
                      options?.socialMediaOptions?.vimeo_follower?.field_meta
                        ?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="text"
                    icon={Images?.tiktokIcon}
                    value={socialLinks?.tikTok}
                    placeholder={"http://www.tiktok.com//tiktok-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, tikTok: val })
                    }
                  />
                  <DropDownList
                    placeholder={"TikTok Followers"}
                    icon={Images?.tiktokIcon}
                    value={tiktokFollowers}
                    setValue={setTiktokFollowers}
                    options={
                      options?.socialMediaOptions?.tiktok_follower?.field_meta
                        ?.choices
                    }
                    border={false}
                  />
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="My Skills"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="multiselect"
                    placeholder={"Choose Your Skills"}
                    options={
                      options?.otherOptions?.add_new_skill?.field_meta?.choices
                    }
                    setOption={setMySkill}
                    value={mySkill}
                    icon={Images?.skillIcon}
                  />
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Add custom skills"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>

                  <InputBox
                    type="description"
                    value={customSkills}
                    placeholder="Add custom skills"
                    onChangeText={(val) => setCustomSkills(val)}
                    style={{ marginBottom: 10 }}
                  />
                </View>
              )}
            </View>
            <TextComponent
              text="To continue your application, click on the “Next” button below."
              size={Sizes?.s}
              fontWeight="400"
              style={{
                alignSelf: "center",
                width: "80%",
                textAlign: "center",
                paddingBottom: 15,
              }}
            />
            <Button
              title="Next"
              icon={true}
              background={true}
              onPress={() =>
                tab == 1 || tab == 2 || tab == 4
                  ? handleSignup()
                  : handlePhotographerValidation()
              }
              // onPress={() => navigation.navigate(routeName.PROFILE_ALLERY)}
              // style={{ paddingVertical: 5 }}
            />
            <View style={{ height: 25 }} />
            <Modal
              transparent={true}
              visible={termsModal}
              animationType="slide"
              useNativeDriver={true}
              onRequestClose={() => setTermsModal(false)}
            >
              <View style={styling.termsModal}>
                <View style={styling?.termsView}>
                  <TermsCondition
                    termsModal={termsModal}
                    setTermsModal={setTermsModal}
                    agree={agree}
                    setAgree={setAgree}
                  />
                </View>
              </View>
            </Modal>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

const styling = StyleSheet.create({
  bottomView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
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
    height: 700,
    marginHorizontal: 15,
    // borderWidth: 1,
    borderRadius: 10,
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 20,
  },
});
