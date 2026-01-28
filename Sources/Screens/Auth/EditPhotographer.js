import moment from "moment";
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
  Header,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { expertises, genderTypes } from "../../Global";
import {
  getOptionsData,
  photographerRegister,
  getUserDetail,
  updatePhotographerProfile,
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
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { getCountryList } from "../../Redux/Services/OtherServices";
import { useFocusEffect } from "@react-navigation/native";
export const EditPhotographer = ({ navigation, route }) => {
  let currentDate = new Date();
  const auth = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();
  const [error, setError] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  // const [mobileNumber, setMobileNumber] = useState("");
  const [gender, setGender] = useState("");
  const [retouchConcent, setRetouchConcent] = useState(false);
  const [talent, setTalent] = useState("");

  const [userRole, setUserRole] = useState("");
  const [userData, setUserData] = useState("");
  const [userId, setUserId] = useState("");
  const [profileID, setProfileID] = useState("");
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

  const [options, setOptions] = useState({
    femaleOptions: auth?.allOptionData?.femaleOptions,
    maleOptions: auth?.allOptionData?.maleOptions,
    childOptions: auth?.allOptionData?.childOptions,
    otherOptions: auth?.allOptionData?.otherOptions,
    socialMediaOptions: auth?.allOptionData?.socialMediaOptions,
  });
  const [callingCode, setCallingCode] = useState("1");
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
  const fnameValid = regName(basicDetails?.fname);
  const mobileNumberValid = isValidPhoneNumber(basicDetails?.mobileNumber);
  const emailValid = isValidEmail(email);
  const passwordValid = passwordPattern(password);

  useEffect(() => {
    getAllOptionsData();
    getUserData();
    getAllCountryName("country");
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [route?.params])
  );

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let userRole = await getData(storageKey?.USER_ROLE);
    setUserRole(userRole);
    setUserId(userID);
    let body = {
      user_id: JSON?.parse(userID),
    };
    let res = await dispatch(getUserDetail(body));
    if (res.status == 200) {
      setUserData(res.results);
      let userData = res?.results?.user_data;
      let personalData = res?.results?.personal_details;
      let post_meta_details = res?.results?.post_meta_details;
      let social_followers = res?.results?.social_followers;
      setProfileID(userData?.profile_id);
      setCallingCode(userData?.country_code || "1"); // country_code: callingCode,
      setBasicDetails({
        ...basicDetails,
        fname: userData?.first_name,
        lname: userData?.last_name,
        mobileNumber: res?.results?.fw_option[0]?.user_phone_number,
        birthDate: personalData?.date_of_birth
          ? new Date(personalData?.date_of_birth)
          : new Date(),
        displayName: userData?.display_name,
        hourlyRate: personalData?.perhour_rate,
        tagLine: personalData?.tag_line,
        fullRate: personalData?.full_day_rate,
        halfRate: personalData?.half_day_rate,
        yearsExperience: personalData?.years_experience,
        customExpertise: personalData?.custom_expertise,
      });
      setExperience(personalData?.experience_level);
      setExpertise(personalData?.expertise);
      setEmail(userData?.user_email);
      setGender(personalData?.gender);
      setTalent(post_meta_details?.freelancer_type);
      setCountry(post_meta_details?.country);
      setState(post_meta_details?.state);
      setCity(post_meta_details?.city);

      setAddress({
        ...address,
        addressLine: post_meta_details?.address,
        postalCode: post_meta_details?.postal_code,
      });
      setBioDetails({
        ...bioDetails,
        personalBio: personalData?.personal_bio,
        professionalBio: personalData?.professional_bio,
      });
      setMySkill(post_meta_details?.skills_names);
      setCustomSkills(post_meta_details?.custom_skills);
      setSocialLinks({
        ...socialLinks,
        facebook: social_followers?.facebook_profile_link,
        instagram: social_followers?.instagram_profile_link,
        tikTok: social_followers?.tiktok_profile_link
          ? social_followers?.tiktok_profile_link
          : social_followers?.ticktok_profile_link,
        youtube: social_followers?.youtube_profile_link,
        twitter: social_followers?.twitter_profile_link,
        vimeo: social_followers?.vimeo_profile_link,
      });
      setFacebookFollowers(social_followers?.facebook_follower);
      setInstagramFollowers(social_followers?.instagram_follower);
      setYoutubeFollowers(social_followers?.youtube_follower);
      setTwitterFollowers(social_followers?.twitter_follower);
      setTiktokFollowers(social_followers?.tiktok_follower);
      setVimeoFollowers(social_followers?.vimeo_follower);
    }
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
    } else if (!basicDetails?.displayName) {
      showToast("Please enter your display name", "error");
    } else if (!basicDetails?.mobileNumber) {
      showToast("Please enter your mobile number", "error");
    } else if (mobileNumberValid) {
      showToast("Please enter valid mobile Number", "error");
    } else if (!gender) {
      showToast("Please choose your gender", "error");
    } else if (!basicDetails?.birthDate) {
      showToast("Please choose your birth date", "error");
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
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_type: "photographer",
      user_id: userId,
      profile_id: profileID,
      pre: "update",
      per_website: "",
      email: email,
      model_type:
        talent == "Model" || talent == "model"
          ? "model"
          : talent == "Kid" || talent == "child"
          ? "child"
          : "",
      password: password,
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

      mobile: basicDetails?.mobileNumber,
      country_code: callingCode,
      pack_status: "basic",

      personal_bio: bioDetails?.personalBio,
      professional_bio: bioDetails?.professionalBio,
      postal_code: address?.postalCode,
      years_experience: basicDetails?.yearsExperience,
      // camera_type: basicDetails?.cameraType,
      // retouch_concent: basicDetails?.retouchConcent,
      // listed_with_booksculp: basicDetails?.listedFor,

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
    };
    console.log("updatePhotographerProfile body-------", JSON?.stringify(body));
    let res = await dispatch(updatePhotographerProfile(body));
    if (res?.status == 200) {
      navigation?.goBack();
    }
  };

  // let abb = [
  //   { label: "Portrait", value: "Portrait" },
  //   { label: "Architecture", value: "Architecture" },
  // ];
  // let xc = { label: "Portrait", value: "Portrait" };
  // let ggg = abb?.Contains(xc);
  // console.log("gggggg------", ggg);
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header text="Edit Profile" navigation={navigation} />
      <Loader loading={auth?.isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={Styles?.container}>
          <InputBox
            type="text"
            value={basicDetails?.fname}
            placeholder="First Name"
            onChangeText={(val) =>
              setBasicDetails({ ...basicDetails, fname: val })
            }
            isEmpty={error && isFieldEmpty(basicDetails?.fname)}
            toolTipText={"Add your first name"}
          />
          <InputBox
            type="text"
            value={basicDetails?.lname}
            placeholder="Last Name"
            onChangeText={(val) =>
              setBasicDetails({ ...basicDetails, lname: val })
            }
            isEmpty={error && isFieldEmpty(basicDetails?.lname)}
            toolTipText={"Add your last name"}
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
          />
          <InputBox
            type="phone"
            value={basicDetails?.mobileNumber}
            placeholder={"Phone Number *"}
            callingCode={callingCode}
            setCallingCode={setCallingCode}
            onChangeText={(val) =>
              setBasicDetails({ ...basicDetails, mobileNumber: val })
            }
            isEmpty={error && isFieldEmpty(basicDetails?.mobileNumber)}
          />
          <DropDownList
            placeholder={"Select Gender"}
            icon={Images?.genderType}
            value={gender}
            setValue={setGender}
            options={genderTypes}
            border={false}
            isEmpty={error && isFieldEmpty(gender)}
            editable={false}
          />
          <InputBox
            type="datePicker"
            placeholder="DD/MM/YYYY *"
            date={basicDetails?.birthDate}
            setDate={(date) => {
              setBasicDetails({ ...basicDetails, birthDate: date });
            }}
            icon={Images?.calanderIcon}
            isEmpty={error && isFieldEmpty(basicDetails?.birthDate)}
            disable={false}
          />
          <InputBox
            type="email"
            value={email.trim()}
            placeholder={"Email ID"}
            onChangeText={(val) => setEmail(val)}
            error={emailValid}
            fontIcon="email"
            isEmpty={error && isFieldEmpty(email)}
            editable={false}
          />
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
            toolTipText={"Add your Full Day rate"}
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
            toolTipText={"Add your Half Day rate"}
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
            toolTipText={"Add Your Hourly Rate"}
          />
          <InputBox
            type="text"
            value={basicDetails?.tagLine}
            placeholder="Tag Line"
            onChangeText={(val) =>
              setBasicDetails({ ...basicDetails, tagLine: val })
            }
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
              location?.stateList?.length == 0 ? true : country ? false : true
            }
            onSelect={() => getAllCountryName("city")}
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
              location?.stateList?.length == 0 ||
              location?.cityList?.length == 0
                ? true
                : country && state
                ? false
                : true
            }
            search={true}
            isEmpty={error && isFieldEmpty(city)}
            onPress={() => getAllCountryName("city")}
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
            onChangeText={(val) => setAddress({ ...address, addressLine: val })}
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
            onChangeText={(val) => setAddress({ ...address, postalCode: val })}
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
              text="Photographer Bio Details"
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
              options?.otherOptions?.experience_level?.field_meta?.choices
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
            placeholder={"https://www.facebook.com/facebook-profile-link"}
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
            placeholder={"https://www.instagram.com/instagram-profile-link"}
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
              options?.socialMediaOptions?.instagram_follower?.field_meta
                ?.choices
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
              options?.socialMediaOptions?.twitter_follower?.field_meta?.choices
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
              options?.socialMediaOptions?.youtube_follower?.field_meta?.choices
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
              options?.socialMediaOptions?.vimeo_follower?.field_meta?.choices
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
              options?.socialMediaOptions?.tiktok_follower?.field_meta?.choices
            }
            border={false}
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent text="My Skills" size={Sizes?.s} fontWeight="400" />
          </View>
          <InputBox
            type="multiselect"
            placeholder={"Choose Your Skills"}
            options={options?.otherOptions?.add_new_skill?.field_meta?.choices}
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
        <Button
          title="Save"
          icon={true}
          background={true}
          onPress={() => handlePhotographerValidation()}
          style={{ paddingVertical: 5 }}
        />
        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
});
