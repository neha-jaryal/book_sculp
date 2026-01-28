import React, { useEffect, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  InputBox,
  TextComponent,
  DropDownList,
  DashboardHeader,
  Loader,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
// import CountryPicker from "rn-country-dropdown-picker";
// import MultiSelect from "react-native-multiple-select";
import * as ImagePicker from "react-native-image-picker";
import {
  CountryNames,
  englishLevels,
  experienceLevel,
  genderTypes,
  kidGenderTypes,
  languages,
  talentTypes,
} from "../../Global";
import {
  isFieldEmpty,
  isValidEmail,
  isValidPhoneNumber,
  regName,
  showToast,
} from "../../Utility";
import { useDispatch, useSelector } from "react-redux";
import {
  getOptionsData,
  getUserDetail,
  profileSetup,
} from "../../Redux/Services/AuthServices";
import { getCountryList } from "../../Redux/Services/OtherServices";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { PhoneNumberVerify } from "./PhoneNumberVerify";

export const ProfileSetup = ({ navigation }) => {
  const dispatch = useDispatch();
  const countryRef = useRef(null);
  const auth = useSelector((state) => state?.authReducer);
  const fnameValid = regName(basicDetails?.fname);
  const lnameValid = regName(basicDetails?.lname);
  const mobileNumberValid = isValidPhoneNumber(basicDetails?.mobileNumber);
  const businessEmailValid = isValidEmail(clientDetails?.businessEmail);
  const registrationData = auth?.registrationData?.registrationData;
  // console.log("registrationData----", registrationData);
  const [error, setError] = useState("");
  const [userRole, setUserRole] = useState("");
  const [options, setOptions] = useState({
    femaleOptions: auth?.allOptionData?.femaleOptions,
    maleOptions: auth?.allOptionData?.maleOptions,
    childOptions: auth?.allOptionData?.childOptions,
    otherOptions: auth?.allOptionData?.otherOptions,
    socialMediaOptions: auth?.allOptionData?.socialMediaOptions,
    englishLevel: auth?.allOptionData?.englishLevel,
    languages: auth?.allOptionData?.languages,
  });
  const [gender, setGender] = useState("");
  const [talent, setTalent] = useState("");
  const [englishLevel, setEnglishLevel] = useState("");
  const [country, setCountry] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [language, setLanguage] = useState([]);
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [ethnicity, setEthnicity] = useState("");
  const [hairColor, setHairColor] = useState("");
  const [experience, setExperience] = useState("");
  const [twitterFollowers, setTwitterFollowers] = useState("");
  const [facebookFollowers, setFacebookFollowers] = useState("");
  const [youtubeFollowers, setYoutubeFollowers] = useState("");
  const [tiktokFollowers, setTiktokFollowers] = useState("");
  const [vimeoFollowers, setVimeoFollowers] = useState("");
  const [instagramFollowers, setInstagramFollowers] = useState("");
  const [pantSize, setPantSize] = useState("");
  const [pantSizeW, setPantSizeW] = useState("");
  const [pantSizeL, setPantSizeL] = useState("");
  const [shirtSize, setShirtSize] = useState("");
  const [shirtSizeF, setShirtSizeF] = useState("");
  const [dressShirt, setDressShirt] = useState("");
  const [shirtSleeve, setShirtSleeve] = useState("");
  const [neckSize, setNeckSize] = useState("");
  const [chestSize, setChestSize] = useState("");
  const [jacket, setJacket] = useState("");
  const [braCup, setBraCup] = useState("");
  const [braSize, setBraSize] = useState("");
  const [dressSize, setDressSize] = useState("");
  const [shoeSize, setShoeSize] = useState("");
  const [mySkill, setMySkill] = useState("");
  const [customSkills, setCustomSkills] = useState("");
  const [eyeColor, setEyeColor] = useState("");
  const [shirtSizeC, setShirtSizeC] = useState("");
  const [pantSizeWC, setPantSizeWC] = useState("");
  const [dressSizeC, setDressSizeC] = useState("");
  const [braCupC, setBraCupC] = useState("");
  const [braSizeC, setBraSizeC] = useState("");
  const [shoeSizeC, setShoeSizeC] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [callingCode, setCallingCode] = useState("1");
  const [show, setShow] = useState(false);
  const [userData, setUserData] = useState("");
  //Actor
  const [awards, setAwards] = useState("");
  const [tattooLoc, setTattoLoc] = useState("");
  const [memberOf, setMemberOf] = useState("");
  const [educationTraining, setEducationTraining] = useState("");
  const [theaterExp, setTheaterExp] = useState("");
  const [commercialExp, setCommercialExp] = useState("");
  const [childrenCount, setChildrenCount] = useState("");
  const [auditions, setAuditions] = useState({
    occupation: "",
    threeThings: "",
    showOn: "",
    realityShow: "",
  });

  const [basicDetails, setBasicDetails] = useState({
    fname: "",
    lname: "",
    mobileNumber: "",
    birthDate: new Date(),
    age: "",
    displayName: "",
    hourlyRate: "",
    tagLine: "",
    profilePhoto: "",
    guardianName: "",
    model_age: 0,
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
  const [clientDetails, setClientDetails] = useState({
    organization: "",
    title: "",
    businessEmail: "",
    businessWebsite: "",
    businessSince: "",
    description: "",
  });
  console.log("registrationDataregistrationData------", registrationData);
  useEffect(() => {
    getUserData();
    getAllCountryName("country", 1);
    // setTalent(registrationData?.model_type);
    if (registrationData?.user_role == 11) {
      if (
        registrationData?.model_type == "model" ||
        registrationData?.model_type == "Model"
      ) {
        setTalent("Model");
      } else if (
        registrationData?.model_type == "child" ||
        registrationData?.model_type == "kid"
      ) {
        setTalent("Model Kid");
      }
    } else if (registrationData?.user_role == 15) {
      if (
        registrationData?.model_type == "Actor" ||
        registrationData?.model_type == "actor"
      ) {
        setTalent("Actor");
      } else if (
        registrationData?.model_type == "Actor Kid" ||
        registrationData?.model_type == "actor Kid" ||
        registrationData?.model_type == "child" ||
        registrationData?.model_type == "kid"
      ) {
        setTalent("Actor Kid");
      }
    }

    setBasicDetails({
      ...basicDetails,
      fname: registrationData?.first_name,
      lname: registrationData?.last_name,
      displayName: registrationData?.display_name,

      age: registrationData?.age_months
        ? registrationData?.age_months
        : registrationData?.model_age,
      model_age: registrationData?.model_age,
      // age: 3,
      birthDate: registrationData?.dob
        ? new Date(registrationData?.dob)
        : new Date(),
      mobileNumber: registrationData?.mobile,

      guardianName: registrationData?.gardian_name,
      hourlyRate:
        registrationData?.model_type == "Kid" ||
        registrationData?.model_type == "child"
          ? "75"
          : "100",
    });
    setGender(registrationData?.gender);

    setClientDetails({
      ...clientDetails,
      organization: registrationData?.organization,
    });
  }, []);
  useEffect(() => {
    getAllOptionsData();
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
    setUserRole(userRole);
    let res = await dispatch(getOptionsData());
    // console.log("optionsoptionsoptions----", res);

    setOptions({
      ...options,
      femaleOptions: res?.results?.group_62749b609360c,
      maleOptions: res?.results?.group_62749a513bf1a,
      childOptions: res?.results?.group_63181d08b6357,
      otherOptions: res?.results?.group_627497cf304a6,
      socialMediaOptions: res?.results?.group_62849b4520284,
      englishLevel: res?.results?.english_level,
      languages: res?.results?.languages,
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
        // setState("");
        // setCity("");
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
            cityList: [],
          });
        } else {
          setLocation({
            ...location,
            stateList: [],
            cityList: [],
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
      // if (step == 1) {
      //   getStateList();
      // }
    }
  };
  const handleProfileValidation = () => {
    setError(true);
    if (userRole == 11 || userRole == 15) {
      if (!basicDetails?.fname) {
        showToast("Please enter your first name", "error");
      } else if (fnameValid) {
        showToast("Please enter valid first name", "error");
      } else if (!basicDetails?.lname) {
        showToast("Please enter your last name", "error");
      }
      // else if (lnameValid) {
      //   showToast("Please enter valid last name", "error");
      // }
      else if (!basicDetails?.displayName) {
        showToast("Please enter your display name", "error");
      } else if (!basicDetails?.hourlyRate) {
        showToast("Please enter hourly rate", "error");
      } else if (!gender) {
        showToast("Please select gender", "error");
      } else if (!basicDetails?.mobileNumber) {
        showToast("Please enter your Phone Number", "error");
      } else if (mobileNumberValid) {
        showToast("Please enter valid Phone Number", "error");
      } else if (!country) {
        showToast("Please select country", "error");
      } else if (!state) {
        showToast("Please select state", "error");
      } else if (!city) {
        showToast("Please Select the City", "error");
      } else if (!address?.addressLine) {
        showToast("Please enter address line", "error");
      } else if (!address?.postalCode) {
        showToast("Please enter postal code", "error");
      } else if (!bioDetails?.professionalBio) {
        showToast("Please Enter Professional Bio", "error");
      } else if (!bioDetails?.personalBio) {
        showToast("Please Enter Personal Bio", "error");
      } else if (!height) {
        showToast("Please choose your height", "error");
      } else if (!weight) {
        showToast("Please choose your weight", "error");
      } else if (!ethnicity) {
        showToast("Please choose your ethnicity", "error");
      } else if (!hairColor) {
        showToast("Please choose your hair color", "error");
      } else if (!experience) {
        showToast("Please choose your experience level", "error");
      } else if (
        talent == "Kid" ||
        talent == "child" ||
        talent == "Actor Kid"
      ) {
        handleKidValidation();
      } else if (talent == "Model" || talent == "model" || talent == "Actor") {
        if (gender == "Male" || gender == "male") {
          handleMaleValidation();
        } else if (gender == "Female" || gender == "female") {
          handleFemaleValidation();
        } else if (
          gender == "non binary" ||
          gender == "Non Binary" ||
          gender == "other" ||
          gender == "Other"
        ) {
          handleProfileSetup();
        }
      }
    } else if (userRole == 12) {
      handleClientValidation();
    }
  };
  const handleMaleValidation = () => {
    setError(true);
    if (!shirtSize) {
      showToast("Please Select Shirt Size", "error");
    } else if (!pantSizeW) {
      showToast("Please Select Pant Size (Waist)", "error");
    } else if (!pantSizeL) {
      showToast("Please Select Pant Size (Length)", "error");
    } else if (!shoeSize) {
      showToast("Please Select shoe Size", "error");
    } else {
      handleProfileSetup();
    }
  };

  const handleFemaleValidation = () => {
    setError(true);
    if (!shirtSizeF) {
      showToast("Please Select Shirt Size", "error");
    } else if (!braCup) {
      showToast("Please Select Bra Cup", "error");
    } else if (!braSize) {
      showToast("Please Select Bra Size", "error");
    } else if (!dressSize) {
      showToast("Please Select Dress Size", "error");
    } else if (!shoeSize) {
      showToast("Please Select shoe Size", "error");
    } else {
      handleProfileSetup();
    }
  };

  const handleClientValidation = () => {
    setError(true);
    if (!basicDetails?.fname) {
      showToast("Please enter your first name", "error");
    } else if (fnameValid) {
      showToast("Please enter valid first name", "error");
    } else if (!basicDetails?.lname) {
      showToast("Please enter your last name", "error");
    }
    // else if (lnameValid) {
    //   showToast("Please enter valid last name", "error");
    // }
    else if (!basicDetails?.displayName) {
      showToast("Please enter your display name", "error");
    } else if (!clientDetails?.businessEmail) {
      showToast("Please enter your Business Email Address", "error");
    } else if (!clientDetails?.businessWebsite) {
      showToast("Please enter Business website", "error");
    } else if (!country) {
      showToast("Please select country", "error");
    } else if (!state) {
      showToast("Please select state", "error");
    } else if (!address?.addressLine) {
      showToast("Please enter address line", "error");
    } else if (!address?.postalCode) {
      showToast("Please enter postal code", "error");
    } else {
      handleProfileSetup();
    }
  };
  const handleKidValidation = () => {
    setError(true);
    if (gender == "Male" || gender == "male") {
      if (!shirtSizeC) {
        showToast("Please Select Shirt Size", "error");
      } else if (!pantSizeWC) {
        showToast("Please Select Pant Size (Waist)", "error");
      } else if (!shoeSizeC) {
        showToast("Please Select shoe Size", "error");
      } else {
        handleProfileSetup();
      }
    } else if (gender == "Female" || gender == "female") {
      if (!shirtSizeC) {
        showToast("Please Select Shirt Size", "error");
      } else if (!pantSizeWC) {
        showToast("Please Select Pant Size", "error");
      } else if (!shoeSizeC) {
        showToast("Please Select shoe Size", "error");
      } else if (!dressSizeC) {
        showToast("Please Select Dress Size", "error");
      } else {
        handleProfileSetup();
      }
    } else {
      handleProfileSetup();
    }
  };

  const handleProfileSetup = async () => {
    setError(true);
    let body = {
      user_id: registrationData?.user_id
        ? registrationData?.user_id
        : registrationData?.id,
      profile_id: registrationData?.profile_id,
      phone_number: basicDetails?.mobileNumber,
      country_code: callingCode,
      hourly_rate: basicDetails?.hourlyRate,
      tageline: basicDetails?.tagLine,
      country: country,
      state: state,
      city: city,
      address_line1: address?.addressLine,
      address_line2: address?.addressLine2,
      postal_code: address?.postalCode,
      languages: language,
      english: englishLevel,
      talent_type: talent,
      professional_bio: bioDetails?.professionalBio,
      personal_bio: bioDetails?.personalBio,
      height_inch: height,
      weight_pound: weight,
      ethnicity: ethnicity,
      hair_color: hairColor,
      experience_level: experience,
      // following detail
      facebook_link: socialLinks?.facebook,
      instagram_link: socialLinks?.instagram,
      twitter_link: socialLinks?.twitter,
      youtube_link: socialLinks?.youtube,
      vimeo_link: socialLinks?.vimeo,
      tiktok_link: socialLinks?.tikTok,
      facebook_followers: facebookFollowers,
      instagram_followers: instagramFollowers,
      twitter_followers: twitterFollowers,
      youtube_followers: youtubeFollowers,
      vimeo_followers: vimeoFollowers,
      tiktok_followers: tiktokFollowers,
      // measurement
      shirt_size: shirtSize,
      pant_size_waist: pantSizeW,
      pant_size_length: pantSizeL,
      shoe_size: shoeSize,
      dress_shirt_size: dressShirt,
      dress_shirt_sleeve: shirtSleeve,
      neck_size: neckSize,
      chest_size: chestSize,
      jacket: jacket,
      shirt_size_f: shirtSizeF,
      pant_size_f: pantSize,
      bra_cup: braCup,
      bra_size: braSize,
      dress_size_f: dressSize,
      shoe_size_f: shoeSize,
      skills: mySkill,
      custom_skills: customSkills,
      // kid Registeration
      eye_color: eyeColor,
      guardian_name: basicDetails?.guardianName,
      gender:
        gender == "Male" || gender == "male"
          ? "male"
          : gender == "Female" || gender == "female"
          ? "female"
          : gender == "non binary" ||
            gender == "Non Binary" ||
            gender == "other" ||
            gender == "Other"
          ? "other"
          : "",
      children_shirt_size: shirtSizeC,
      children_pant_size: pantSizeWC,
      children_shoe_size: shoeSizeC,
      children_dress_size: dressSizeC,
      // children_bra_size: braSizeC,
      // children_bra_cup: braCupC,

      toddler_shirt_size: shirtSizeC,
      toddler_pant_size: pantSizeWC,
      toddler_shoe_size: shoeSizeC,
      toddler_dress_size: dressSizeC,

      infant_shirt_size: shirtSizeC,
      infant_dress_size: dressSizeC,
      infant_pant_size: pantSizeWC,
      infant_shoe_size: shoeSizeC,

      // Client
      title: clientDetails?.title,
      business_Email: clientDetails?.businessEmail,
      business_website: clientDetails?.businessWebsite,
      business_since: clientDetails?.businessSince,
      description: clientDetails?.description,
      tattoo_location: tattooLoc,
      member_of: memberOf,
      organization: clientDetails?.organization,
      theater_exp: theaterExp,
      edu_training: educationTraining,
      comm_exp: commercialExp,
    };

    if (talent == "Actor") {
      body.have_children = childrenCount || "";
      body.occupation = auditions?.occupation || "";
      body.about_you_nobody_knows = auditions?.threeThings || "";
      body.reality_show_yourself_why = auditions?.showOn || "";
      body.reality_show_what_when = auditions?.realityShow || "";
    }
    let res = await dispatch(profileSetup(body));
    if (res?.status == 200) {
      showToast("Saved !", "success");
      setError(false);
      navigation?.navigate(routeName?.PROFILE_GALLERY, {
        routeName: routeName?.REGISTERATION,
        userId: res?.results?.user_id,
        profileId: res?.results?.profile_id,
      });
    }
  };

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
        if (!res.results?.user_data?.phone_verified_status) {
          setShow(true);
        }
        setCallingCode(res.results?.user_data?.country_code);
      }
    }
  };
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
          userData={{
            countryCode: callingCode,
            phone_number: basicDetails?.mobileNumber,
            userID: registrationData?.id,
            verified: userData?.user_data?.phone_verified_status,
          }}
        />
      ) : (
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          enabled={true}
          behavior={Platform?.OS == "ios" ? "padding" : null}
        >
          <DashboardHeader navigation={navigation} />
          <Loader loading={auth?.isLoading} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={{ ...Styles?.container }}>
              {/* <View
            style={{
              ...Styles?.flexRow,
              ...styling?.emailView,
            }}
          >
            <TextComponent
              text="Email Verification : Your account is not verified. Please check your email for the verification"
              size={Sizes?.xs}
              fontWeight="400"
              style={{ width: "80%" }}
            />
            <TouchableOpacity style={Styles?.smallButton}>
              <TextComponent text="Resend" size={Sizes?.xs} fontWeight="400" />
            </TouchableOpacity>
          </View> */}
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Your Basic"
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>
              {userRole != 12 && (
                <DropDownList
                  placeholder={
                    userRole == 11 ? "Select Talent type" : "Select Actor Type"
                  }
                  value={talent}
                  setValue={setTalent}
                  options={talentTypes}
                  border={false}
                  editable={false}
                  disable={true}
                  fontIcon={"account-details"}
                />
              )}

              <InputBox
                type="text"
                value={basicDetails?.fname}
                placeholder="First Name *"
                onChangeText={(val) =>
                  setBasicDetails({ ...basicDetails, fname: val })
                }
                error={fnameValid}
                isEmpty={error && isFieldEmpty(basicDetails?.fname)}
                fontIcon={"account"}
                // toolTipText={"Add your first name"}
              />
              <InputBox
                type="text"
                value={basicDetails?.lname}
                placeholder="Last Name *"
                onChangeText={(val) =>
                  setBasicDetails({ ...basicDetails, lname: val })
                }
                // error={lnameValid}
                isEmpty={error && isFieldEmpty(basicDetails?.lname)}
                fontIcon={"account"}
                // toolTipText={"Add your last name"}
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
              {userRole == 11 || userRole == 15 ? (
                <>
                  <InputBox
                    type="numeric"
                    value={basicDetails?.hourlyRate}
                    placeholder="Hourly Rate *"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, hourlyRate: val })
                    }
                    fontIcon={"hours-24"}
                    keyboardType="numeric"
                    isEmpty={error && isFieldEmpty(basicDetails?.hourlyRate)}
                    toolTipText={"Add your per hour rate"}
                  />
                  {/* {paramsData?.authentication_type == "Social" && (
                <InputBox
                  type="datePicker"
                  placeholder="DD/MM/YYYY *"
                  date={basicDetails?.birthDate}
                  setDate={(date) => {
                    setBasicDetails({ ...basicDetails, birthDate: date });
                  }}
                  isEmpty={error && isFieldEmpty(basicDetails?.birthDate)}
                  disable={false}
                />
              )} */}

                  <InputBox
                    type="numeric"
                    value={basicDetails?.age}
                    placeholder="Age"
                    onChangeText={(val) =>
                      setBasicDetails({ ...basicDetails, age: val })
                    }
                    fontIcon={"calendar"}
                    keyboardType="numeric"
                    editable={false}
                    isEmpty={error && isFieldEmpty(basicDetails?.age)}
                    toolTipText={"This is your age you have selected."}
                  />
                  {talent == "Kid" || talent == "child" ? (
                    <InputBox
                      type="text"
                      value={basicDetails?.guardianName}
                      placeholder="Guardian Name *"
                      onChangeText={(val) =>
                        setBasicDetails({ ...basicDetails, guardianName: val })
                      }
                      isEmpty={
                        error && isFieldEmpty(basicDetails?.guardianName)
                      }
                    />
                  ) : null}
                  <DropDownList
                    placeholder={"Select Gender *"}
                    fontIcon={"gender-male-female-variant"}
                    value={gender}
                    setValue={setGender}
                    options={
                      gender == "kid" || gender == "Kid" || gender == "child"
                        ? kidGenderTypes
                        : genderTypes
                    }
                    border={false}
                    editable={false} // false
                    isEmpty={error && isFieldEmpty(gender)}
                    disable={true}
                  />
                </>
              ) : null}

              <InputBox
                type="phone"
                value={basicDetails?.mobileNumber}
                placeholder="Phone Number *"
                onChangeText={(val) =>
                  setBasicDetails({ ...basicDetails, mobileNumber: val })
                }
                callingCode={callingCode}
                setCallingCode={setCallingCode}
                error={mobileNumberValid}
                isEmpty={error && isFieldEmpty(basicDetails?.mobileNumber)}
                verified_status={userData?.user_data?.phone_verified_status}
                onVerify={() =>
                  !userData?.user_data?.phone_verified_status && setShow(true)
                }
                editable={
                  userData?.user_data?.phone_verified_status ? false : true
                }
                // fontIcon={"phone-dial"}
              />
              <InputBox
                type="text"
                value={basicDetails?.tagLine}
                placeholder="Tag Line"
                fontIcon="tag-text"
                onChangeText={(val) =>
                  setBasicDetails({ ...basicDetails, tagLine: val })
                }
                toolTipText={
                  "This is a quick line to help promote you. It will be shown on your profile page. Ex. Outgoing and Friendly"
                }
              />
            </View>
            <View style={{ ...Styles?.container }}>
              {userRole == 12 ? (
                <>
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Add brief description"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="description"
                    value={clientDetails?.description}
                    placeholder="Add brief description"
                    onChangeText={(val) =>
                      setClientDetails({ ...clientDetails, description: val })
                    }
                  />
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Company Info"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="text"
                    value={clientDetails?.organization}
                    placeholder="Organization *"
                    onChangeText={(val) =>
                      setClientDetails({ ...clientDetails, organization: val })
                    }
                    editable={false}
                    fontIcon={"office-building"}
                  />
                  <InputBox
                    type="text"
                    value={clientDetails?.title}
                    placeholder="Title"
                    onChangeText={(val) =>
                      setClientDetails({ ...clientDetails, title: val })
                    }
                    toolTipText={"Enter your title to the company"}
                  />
                  <InputBox
                    type="email"
                    value={clientDetails?.businessEmail}
                    placeholder="Business Email Address *"
                    onChangeText={(val) =>
                      setClientDetails({ ...clientDetails, businessEmail: val })
                    }
                    error={businessEmailValid}
                    isEmpty={
                      error && isFieldEmpty(clientDetails?.businessEmail)
                    }
                  />
                  <InputBox
                    type="text"
                    value={clientDetails?.businessWebsite}
                    placeholder="Business website *"
                    onChangeText={(val) =>
                      setClientDetails({
                        ...clientDetails,
                        businessWebsite: val,
                      })
                    }
                    isEmpty={
                      error && isFieldEmpty(clientDetails?.businessWebsite)
                    }
                  />
                  <InputBox
                    type="text"
                    value={clientDetails?.businessSince}
                    placeholder="We have been in business since"
                    onChangeText={(val) =>
                      setClientDetails({ ...clientDetails, businessSince: val })
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
                isEmpty={error && isFieldEmpty(city)}
                disable={
                  location?.stateList?.length == 0 ||
                  location?.cityList?.length == 0
                    ? true
                    : country && state
                    ? false
                    : true
                }
                search={true}
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
                    type="text"
                    icon={Images?.locationIcon}
                    value={address?.addressLine2}
                    placeholder="Address Line 2"
                    onChangeText={(val) =>
                      setAddress({ ...address, addressLine2: val })
                    }
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
                </>
              ) : (
                <>
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Your Address"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
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
                    type="text"
                    icon={Images?.locationIcon}
                    value={address?.addressLine2}
                    placeholder="Address Line 2"
                    onChangeText={(val) =>
                      setAddress({ ...address, addressLine2: val })
                    }
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
                </>
              )}
            </View>

            <View style={{ ...Styles?.container }}>
              {userRole != 12 && (
                <>
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Languages you can speak"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <InputBox
                    type="multiselect"
                    placeholder="Select Language"
                    options={options?.languages}
                    setOption={setLanguage}
                    value={language}
                    fontIcon={"earth"}
                  />
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text="Your Language Level"
                      size={Sizes?.s}
                      fontWeight="400"
                    />
                  </View>
                  <DropDownList
                    placeholder={"Select Language Level"}
                    fontIcon={"car-brake-fluid-level"}
                    value={englishLevel}
                    setValue={setEnglishLevel}
                    options={englishLevels}
                    border={false}
                  />
                </>
              )}
            </View>
            <View style={{ ...Styles?.container }}>
              {userRole != 12 && (
                <>
                  <View
                    style={{
                      ...Styles?.flexRow,
                      ...styling?.headingView,
                    }}
                  >
                    <TextComponent
                      text={
                        userRole == 11 ? "Bio Details" : "Bio & Experiences"
                      }
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

                  {userRole == 15 && (
                    <>
                      <InputBox
                        type="description"
                        placeholder="Education or Training"
                        value={educationTraining}
                        onChangeText={(e) => {
                          setEducationTraining(e?.target?.value);
                        }}
                      />

                      <InputBox
                        type="description"
                        placeholder="Theater experience"
                        value={theaterExp}
                        onChangeText={(e) => {
                          setTheaterExp(e?.target?.value);
                        }}
                        style={{ marginVertical: 10 }}
                      />

                      <InputBox
                        type="description"
                        placeholder="Awards"
                        value={awards}
                        onChangeText={(e) => {
                          setAwards(e?.target?.value);
                        }}
                      />

                      <InputBox
                        type="description"
                        placeholder="Commercial experience"
                        value={commercialExp}
                        onChangeText={(e) => {
                          setCommercialExp(e?.target?.value);
                        }}
                        style={{ marginVertical: 10 }}
                      />
                    </>
                  )}
                </>
              )}
            </View>

            <View style={{ ...Styles?.container }}>
              {options.femaleOptions ? (
                <>
                  {userRole == 11 || userRole == 15 ? (
                    <>
                      <View
                        style={{
                          ...Styles?.flexRow,
                          ...styling?.headingView,
                        }}
                      >
                        <TextComponent
                          text={
                            userRole == 11 ? "Model Details" : "Actor Details"
                          }
                          size={Sizes?.s}
                          fontWeight="400"
                        />
                      </View>
                      <DropDownList
                        placeholder={"Height (Inches) *"}
                        fontIcon={"human-male-height"}
                        value={height}
                        setValue={setHeight}
                        options={
                          options?.otherOptions?.height?.field_meta?.choices
                        }
                        border={false}
                        isEmpty={error && isFieldEmpty(height)}
                      />
                      <DropDownList
                        placeholder={"Weight (Pounds) *"}
                        fontIcon={"weight-pound"}
                        value={weight}
                        setValue={setWeight}
                        options={
                          options?.otherOptions?.weight?.field_meta?.choices
                        }
                        border={false}
                        isEmpty={error && isFieldEmpty(weight)}
                      />
                      <InputBox
                        type="multiselect"
                        placeholder={"Ethnicity *"}
                        options={
                          options?.otherOptions?.ethnicity?.field_meta?.choices
                        }
                        setOption={setEthnicity}
                        value={ethnicity}
                        fontIcon={"city"}
                        isEmpty={error && isFieldEmpty(ethnicity?.length)}
                      />
                      <DropDownList
                        placeholder={"Hair color *"}
                        fontIcon={"hair-dryer"}
                        value={hairColor}
                        setValue={setHairColor}
                        options={
                          options?.otherOptions?.hair_colour?.field_meta
                            ?.choices
                        }
                        border={false}
                        isEmpty={error && isFieldEmpty(hairColor)}
                      />
                      <DropDownList
                        placeholder={"Eye color *"}
                        fontIcon={"eye"}
                        value={eyeColor}
                        setValue={setEyeColor}
                        options={
                          options?.otherOptions?.eye_color?.field_meta?.choices
                        }
                        border={false}
                        isEmpty={error && isFieldEmpty(eyeColor)}
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
                      {talent == "Actor" ? (
                        <>
                          <InputBox
                            // required

                            type="text"
                            placeholder="Add Tattoo/Design/Location."
                            value={tattooLoc}
                            onChangeText={(e) => {
                              setTattoLoc(e?.target?.value);
                            }}
                            fontIcon={"city"}
                          />
                        </>
                      ) : undefined}

                      {talent == "Actor" || talent == "Actor Kid" ? (
                        <>
                          <InputBox
                            // required

                            type="text"
                            placeholder="Add Member of any union eg. SAG/AFTRA"
                            value={memberOf}
                            onChangeText={(e) => {
                              setMemberOf(e?.target?.value);
                            }}
                            fontIcon={"account"}
                          />
                        </>
                      ) : undefined}
                    </>
                  ) : null}
                </>
              ) : (
                <Loader loading={auth?.isLoading} />
              )}
            </View>
            <View style={{ ...Styles?.container }}>
              {options.femaleOptions ? (
                <>
                  {userRole == 11 || userRole == 15 ? (
                    <>
                      <View
                        style={{
                          ...Styles?.flexRow,
                          ...styling?.headingView,
                        }}
                      >
                        <TextComponent
                          text={
                            talent == "child" && basicDetails?.model_age <= 2
                              ? `Infant ${
                                  userRole == 11 ? "Model" : "Actor"
                                } Measurement`
                              : talent == "child" &&
                                basicDetails?.model_age > 2 &&
                                basicDetails?.model_age <= 5
                              ? `Toddler ${
                                  userRole == 11 ? "Model" : "Actor"
                                } Measurement`
                              : talent == "child" &&
                                basicDetails?.model_age > 5 &&
                                basicDetails?.model_age <= 13
                              ? `Children ${
                                  userRole == 11 ? "Model" : "Actor"
                                } Measurement`
                              : talent == "model"
                              ? gender == "Male" || gender == "male"
                                ? `Male ${
                                    userRole == 11 ? "Model" : "Actor"
                                  } Measurement`
                                : gender == "Female" || gender == "female"
                                ? `Female ${
                                    userRole == 11 ? "Model" : "Actor"
                                  } Measurement`
                                : `${
                                    userRole == 11 ? "Model" : "Actor"
                                  } Measurement For Non Binary`
                              : `${
                                  userRole == 11 ? "Model" : "Actor"
                                } Measurement`
                          }
                          size={Sizes?.s}
                          fontWeight="400"
                        />
                      </View>
                      {talent == "Kid" || talent == "child" ? (
                        gender == "Male" || gender == "male" ? (
                          <>
                            <InputBox
                              type="multiselect"
                              placeholder={"Shirt Size *"} //multiple
                              fontIcon={"tshirt-crew"}
                              value={shirtSizeC}
                              setOption={setShirtSizeC}
                              options={
                                options?.childOptions?.toddler_shirt_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={
                                error && isFieldEmpty(shirtSizeC?.length)
                              }
                            />
                            <InputBox
                              type="multiselect"
                              placeholder={"Pant Size *"} //multiple
                              icon={Images?.pantIcon}
                              value={pantSizeWC}
                              setOption={setPantSizeWC}
                              options={
                                options?.childOptions?.toddler_pant_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={
                                error && isFieldEmpty(pantSizeWC?.length)
                              }
                            />
                            <InputBox
                              type="multiselect"
                              placeholder={"Shoe Size *"} //multiple
                              icon={Images?.shoeIcon}
                              value={shoeSizeC}
                              setOption={setShoeSizeC}
                              options={
                                options?.childOptions?.toddler_shoe_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={error && isFieldEmpty(shoeSizeC?.length)}
                            />
                          </>
                        ) : (
                          <>
                            <InputBox
                              type="multiselect"
                              placeholder={"Shirt Size *"} //multiple
                              fontIcon={"tshirt-crew"}
                              value={shirtSizeC}
                              setOption={setShirtSizeC}
                              options={
                                options?.childOptions?.toddler_shirt_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={error && isFieldEmpty(shirtSizeC)}
                            />

                            <InputBox
                              type="multiselect"
                              placeholder={"Pant Size *"} //multiple
                              icon={Images?.pantIcon}
                              value={pantSizeWC}
                              setOption={setPantSizeWC}
                              options={
                                options?.childOptions?.toddler_pant_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={error && isFieldEmpty(pantSizeWC)}
                            />
                            <InputBox
                              type="multiselect"
                              placeholder={"Shoe Size *"} //multiple
                              icon={Images?.shoeIcon}
                              value={shoeSizeC}
                              setOption={setShoeSizeC}
                              options={
                                options?.childOptions?.toddler_shoe_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={error && isFieldEmpty(shoeSizeC)}
                            />
                            <InputBox
                              type="multiselect"
                              placeholder={"Dress Size *"} //multiple
                              icon={Images?.dressIcon}
                              value={dressSizeC}
                              setOption={setDressSizeC}
                              options={
                                options?.childOptions?.toddler_dress_size
                                  ?.field_meta?.choices
                              }
                              border={false}
                              isEmpty={error && isFieldEmpty(dressSizeC)}
                            />
                          </>
                        )
                      ) : gender == "Male" || gender == "male" ? (
                        <>
                          <InputBox
                            type="multiselect"
                            placeholder={"Shirt Size *"} //multiple
                            fontIcon={"tshirt-crew"}
                            value={shirtSize}
                            setOption={setShirtSize}
                            options={
                              options?.maleOptions?.shirt_size?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(shirtSize)}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Pant Size (Waist) *"} //multiple
                            icon={Images?.pantIcon}
                            value={pantSizeW}
                            setOption={setPantSizeW}
                            options={
                              options?.maleOptions?.pant_size_waist?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(pantSizeW?.length)}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Pant Size (Length) *"} //multiple
                            icon={Images?.pantIcon}
                            value={pantSizeL}
                            setOption={setPantSizeL}
                            options={
                              options?.maleOptions?.pant_size_length?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(pantSizeL?.length)}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Shoe Size *"} //multiple
                            icon={Images?.shoeIcon}
                            value={shoeSize}
                            setOption={setShoeSize}
                            options={
                              options?.maleOptions?.shoe_size?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(shoeSize)}
                          />

                          <DropDownList
                            placeholder={"Dress Shirt Size"}
                            icon={Images?.jacketIcon}
                            value={dressShirt}
                            setValue={setDressShirt}
                            options={
                              options?.maleOptions?.dress_shirt_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Dress Shirt Sleeve"}
                            fontIcon={"tshirt-crew"}
                            value={shirtSleeve}
                            setValue={setShirtSleeve}
                            options={
                              options?.maleOptions?.dress_shirt_sleeve
                                ?.field_meta?.choices
                            }
                            border={false}
                          />
                          <DropDownList
                            placeholder={"Neck Size"}
                            icon={Images?.shirtNeck}
                            value={neckSize}
                            setValue={setNeckSize}
                            options={
                              options?.maleOptions?.neck_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Chest Size"}
                            icon={Images?.maleChest}
                            value={chestSize}
                            setValue={setChestSize}
                            options={
                              options?.maleOptions?.chest_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Jacket"}
                            icon={Images?.jacketIcon}
                            value={jacket}
                            setValue={setJacket}
                            options={
                              options?.maleOptions?.jacket?.field_meta?.choices
                            }
                            border={false}
                          />
                        </>
                      ) : gender == "Female" || gender == "female" ? (
                        <>
                          <InputBox
                            type="multiselect"
                            placeholder={"Shirt Size *"} //multiple
                            fontIcon={"tshirt-crew"}
                            value={shirtSizeF}
                            setOption={setShirtSizeF}
                            options={
                              options?.femaleOptions?.shirt_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(shirtSizeF)}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Pant Size *"} //multiple
                            icon={Images?.pantIcon}
                            value={pantSize}
                            setOption={setPantSize}
                            options={
                              options?.femaleOptions?.pant_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(pantSize)}
                          />
                          <DropDownList
                            placeholder={"Bra Cup *"}
                            icon={Images?.braIcon}
                            value={braCup}
                            setValue={setBraCup}
                            options={
                              options?.femaleOptions?.bra_cup?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(braCup)}
                          />

                          <DropDownList
                            placeholder={"Bra Size *"}
                            icon={Images?.braIcon}
                            value={braSize}
                            setValue={setBraSize}
                            options={
                              options?.femaleOptions?.bra_size?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(braSize)}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Dress Size *"} //multiple
                            icon={Images?.dressIcon}
                            value={dressSize}
                            setOption={setDressSize}
                            options={
                              options?.femaleOptions?.dress_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(dressSize)}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Shoe Size *"} //multiple
                            icon={Images?.shoeIcon}
                            value={shoeSize}
                            setOption={setShoeSize}
                            options={
                              options?.femaleOptions?.shoe_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                            isEmpty={error && isFieldEmpty(shoeSize)}
                          />
                        </>
                      ) : (
                        <>
                          <InputBox
                            type="multiselect"
                            placeholder={"Shirt Size (M)"} //multiple
                            fontIcon={"tshirt-crew"}
                            value={shirtSize}
                            setOption={setShirtSize}
                            options={
                              options?.maleOptions?.shirt_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Pant Size (Waist)"} //multiple
                            icon={Images?.pantIcon}
                            value={pantSizeW}
                            setOption={setPantSizeW}
                            options={
                              options?.maleOptions?.pant_size_waist?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Pant Size (Length)"} //multiple
                            icon={Images?.pantIcon}
                            value={pantSizeL}
                            setOption={setPantSizeL}
                            options={
                              options?.maleOptions?.pant_size_length?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Shoe Size (M)"} //multiple
                            icon={Images?.shoeIcon}
                            value={shoeSize}
                            setOption={setShoeSize}
                            options={
                              options?.maleOptions?.shoe_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Dress Shirt Size (M)"}
                            icon={Images?.jacketIcon}
                            value={dressShirt}
                            setValue={setDressShirt}
                            options={
                              options?.maleOptions?.dress_shirt_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Dress Shirt Sleeve (M)"}
                            fontIcon={"tshirt-crew"}
                            value={shirtSleeve}
                            setValue={setShirtSleeve}
                            options={
                              options?.maleOptions?.dress_shirt_sleeve
                                ?.field_meta?.choices
                            }
                            border={false}
                          />
                          <DropDownList
                            placeholder={"Neck Size (M)"}
                            icon={Images?.shirtNeck}
                            value={neckSize}
                            setValue={setNeckSize}
                            options={
                              options?.maleOptions?.neck_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Chest Size (M)"}
                            icon={Images?.maleChest}
                            value={chestSize}
                            setValue={setChestSize}
                            options={
                              options?.maleOptions?.chest_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Jacket (M)"}
                            icon={Images?.jacketIcon}
                            value={jacket}
                            setValue={setJacket}
                            options={
                              options?.maleOptions?.jacket?.field_meta?.choices
                            }
                            border={false}
                          />
                          <InputBox
                            type="multiselect"
                            placeholder={"Shirt Size (F)"} //multiple
                            fontIcon={"tshirt-crew"}
                            value={shirtSizeF}
                            setOption={setShirtSizeF}
                            options={
                              options?.femaleOptions?.shirt_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Pant Size (F)"} //multiple
                            icon={Images?.pantIcon}
                            value={pantSize}
                            setOption={setPantSize}
                            options={
                              options?.femaleOptions?.pant_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                          />
                          <DropDownList
                            placeholder={"Bra Cup (F)"}
                            icon={Images?.braIcon}
                            value={braCup}
                            setValue={setBraCup}
                            options={
                              options?.femaleOptions?.bra_cup?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <DropDownList
                            placeholder={"Bra Size (F)"}
                            icon={Images?.braIcon}
                            value={braSize}
                            setValue={setBraSize}
                            options={
                              options?.femaleOptions?.bra_size?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Dress Size (F)"} //multiple
                            icon={Images?.dressIcon}
                            value={dressSize}
                            setOption={setDressSize}
                            options={
                              options?.femaleOptions?.dress_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                          />

                          <InputBox
                            type="multiselect"
                            placeholder={"Shoe Size (F)"} //multiple
                            icon={Images?.shoeIcon}
                            value={shoeSize}
                            setOption={setShoeSize}
                            options={
                              options?.femaleOptions?.shoe_size_f?.field_meta
                                ?.choices
                            }
                            border={false}
                          />
                        </>
                      )}
                    </>
                  ) : null}
                </>
              ) : (
                <Loader loading={auth?.isLoading} />
              )}
            </View>
            {talent == "Actor" && (
              <View style={{ ...Styles?.container }}>
                <View
                  style={{
                    ...Styles?.flexRow,
                    ...styling?.headingView,
                  }}
                >
                  <TextComponent
                    text="Reality TV Auditioning"
                    size={Sizes?.s}
                    fontWeight="400"
                  />
                </View>

                <InputBox
                  type="number"
                  placeholder="Enter no. of children"
                  value={childrenCount}
                  onChangeText={(e) => {
                    setChildrenCount(e?.target?.value);
                  }}
                />

                <InputBox
                  type="text"
                  placeholder="Enter Occupation"
                  value={auditions?.occupation}
                  onChangeText={(e) => {
                    setAuditions({
                      ...auditions,
                      occupation: e?.target?.value,
                    });
                  }}
                />

                <InputBox
                  type="description"
                  placeholder="Enter your answer"
                  value={auditions?.threeThings}
                  onChangeText={(e) => {
                    setAuditions({
                      ...auditions,
                      threeThings: e?.target?.value,
                    });
                  }}
                />

                <InputBox
                  type="description"
                  placeholder="Enter your answer"
                  value={auditions?.showOn}
                  onChangeText={(e) => {
                    setAuditions({
                      ...auditions,
                      showOn: e?.target?.value,
                    });
                  }}
                  style={{ marginVertical: 10 }}
                />

                <InputBox
                  type="description"
                  placeholder="Enter your answer"
                  value={auditions?.realityShow}
                  onChangeText={(e) => {
                    setAuditions({
                      ...auditions,
                      realityShow: e?.target?.value,
                    });
                  }}
                />
              </View>
            )}
            <View style={{ ...Styles?.container }}>
              {options.femaleOptions ? (
                <>
                  {userRole == 11 || userRole == 15 ? (
                    <>
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
                          options?.otherOptions?.add_new_skill?.field_meta
                            ?.choices
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
                    </>
                  ) : null}
                </>
              ) : (
                <Loader loading={auth?.isLoading} />
              )}
            </View>
            <View style={{ ...Styles?.container }}>
              {options.femaleOptions ? (
                <>
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
                  {userRole == 11 || userRole == 15 ? (
                    <DropDownList
                      placeholder={"Facebook Followers"}
                      fontIcon={"facebook"}
                      value={facebookFollowers}
                      setValue={setFacebookFollowers}
                      options={
                        options?.socialMediaOptions?.facebook_follower
                          ?.field_meta?.choices
                      }
                      border={false}
                    />
                  ) : null}

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
                  {userRole == 11 || userRole == 15 ? (
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
                  ) : null}
                  <InputBox
                    type="text"
                    icon={Images?.xIcon}
                    value={socialLinks?.twitter}
                    placeholder={"https://twitter.com/x-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, twitter: val })
                    }
                  />
                  {userRole == 11 || userRole == 15 ? (
                    <DropDownList
                      placeholder={"X Followers"}
                      icon={Images?.xIcon}
                      value={twitterFollowers}
                      setValue={setTwitterFollowers}
                      options={
                        options?.socialMediaOptions?.twitter_follower
                          ?.field_meta?.choices
                      }
                      border={false}
                    />
                  ) : null}

                  <InputBox
                    type="text"
                    fontIcon={"youtube"}
                    value={socialLinks?.youtube}
                    placeholder={"https://www.youtube.com/youtube-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, youtube: val })
                    }
                  />
                  {userRole == 11 || userRole == 15 ? (
                    <DropDownList
                      placeholder={"Youtube Followers"}
                      fontIcon={"youtube"}
                      value={youtubeFollowers}
                      setValue={setYoutubeFollowers}
                      options={
                        options?.socialMediaOptions?.youtube_follower
                          ?.field_meta?.choices
                      }
                      border={false}
                    />
                  ) : null}

                  <InputBox
                    type="text"
                    fontIcon={"vimeo"}
                    value={socialLinks?.vimeo}
                    placeholder={"https://vimeo.com/vimeo-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, vimeo: val })
                    }
                  />
                  {userRole == 11 || userRole == 15 ? (
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
                  ) : null}

                  <InputBox
                    type="text"
                    icon={Images?.tiktokIcon}
                    value={socialLinks?.tikTok}
                    placeholder={"http://www.tiktok.com//tiktok-profile-link"}
                    onChangeText={(val) =>
                      setSocialLinks({ ...socialLinks, tikTok: val })
                    }
                  />
                  {userRole == 11 || userRole == 15 ? (
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
                  ) : null}
                </>
              ) : (
                <Loader loading={auth?.isLoading} />
              )}

              <TextComponent
                text="Update all the latest changes made by you, by just clicking on “Save & Update button."
                size={Sizes?.s}
                fontWeight="400"
                style={{ width: "100%", padding: 10 }}
              />
              <Button
                title="Next"
                icon={true}
                background={true}
                onPress={() => handleProfileValidation()}
                // onPress={() => navigation.navigate(routeName.PROFILE_GALLERY)}
                style={{ paddingVertical: 5 }}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
    </>
  );
};

const styling = StyleSheet.create({
  emailView: {
    backgroundColor: Colors?.yellow,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: "space-around",
  },
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});

{
  /* <InputBox
      type="dropdown"
      value={country}
      placeholder="Select Gender"
      onChangeText={(val) => setCountry(val)}
      icon={Images?.genderType}
      editable={false}
      options={CountryNames}
      style={{backgroundColor: 'blue'}}
    /> */
}

{
  /* {country ? null : (
      <TouchableOpacity
        style={{
          ...Styles?.row,
          // position: "absolute",
          // marginLeft: 28,
          paddingTop: 15,
          // marginTop:100
        }}
        onPress={() => onChangeCountry()}
      >
        <Entypo
          name={"location"}
          size={15}
          color={Colors?.darkgrey}
          style={{ marginRight: 8 }}
        />
        <TextComponent
          text="Select Country"
          color={Colors?.darkgrey}
          size={Sizes?.s}
          fontWeight="400"
        />
      </TouchableOpacity>
    )} */
}
{
  /* <CountryPicker
      ref={countryRef}
      selectedItem={handleSelection}
      ContainerStyle={{
        marginBottom: 10,
        color: Colors?.darkgrey,
        position: "relative",
      }}
      placeholderTextColor={Colors?.darkgrey}
      countryNameStyle={{ fontSize: Sizes?.s, marginBottom: -8 }}
      DropdownCountryTextStyle={{
        fontSize: Sizes?.s,
        color: Colors?.darkgrey,
        padding: 10,
      }}
      color={Colors?.darkgrey}
      DropdownContainerStyle={{
        borderWidth: 0.5,
        borderColor: Colors?.grey,
        borderRadius: 10,
      }}
      InputFieldStyle={{
        borderBottomWidth: 0.5,
        borderColor: Colors?.inputBorder,
        // color:Colors?.darkgrey
      }}
      Placeholder="Select Country"
      style={{ placeholderTextColor: Colors?.darkgrey }}
    /> */
}
{
  /* <DropDownList
      placeholder={"Select Languages"}
      icon={Images?.userType}
      value={talent}
      setValue={setTalent}
      options={}
      border={false}
    /> */
}

// function handleSelection(e) {
//   setCountry(e?.country);
// }

// const onChangeCountry = () => {
//   countryRef.current.focus();
// };
// const onSelectedItemsChange = selectedItems => {
//   setLanguage({selectedItems});
// };
