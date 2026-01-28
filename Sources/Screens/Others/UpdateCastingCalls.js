import React, { useEffect, useState } from "react";
import {
  FlatList,
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
  Header,
} from "../../Components";
import { Sizes, Colors, Images, Fonts } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
// import * as ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import {
  ages,
  CountryNames,
  englishLevels,
  ethnicities,
  experienceLevel,
  followers,
  genderTypes,
  hairColors,
  heightInches,
  jobDurations,
  kidGenderTypes,
  languages,
  locationsUsage,
  mediaTypes,
  projectLevels,
  projectLocations,
  skills,
  talentTypes,
  timeZones,
  weightInches,
} from "../../Global";
import { useDispatch, useSelector } from "react-redux";
import { getData, storageKey } from "../../Utility/Storage";
import { isFieldEmpty, showToast } from "../../Utility";
import { getCountryList, postJob } from "../../Redux/Services/OtherServices";
import Entypo from "react-native-vector-icons/Entypo";
import { Image } from "react-native";
import moment from "moment";
import { getOptionsData } from "../../Redux/Services/AuthServices";
export const CastingCalls = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const [options, setOptions] = useState({
    femaleOptions: auth?.allOptionData?.femaleOptions,
    maleOptions: auth?.allOptionData?.maleOptions,
    childOptions: auth?.allOptionData?.childOptions,
    otherOptions: auth?.allOptionData?.otherOptions,
    socialMediaOptions: auth?.allOptionData?.socialMediaOptions,
    postJobOptions: auth?.allOptionData?.postJobOptions,
    languages: auth?.allOptionData?.languages,
    englishLevel: auth?.allOptionData?.englishLevel,
  });
  const [accountSwitches, setAccountSwitches] = useState({
    disableAccount: false,
  });
  const [error, setError] = useState("");
  const [locationUsage, setLocationUsage] = useState("");
  const [gender, setGender] = useState("");
  const [projectLevel, setProjectLevel] = useState("");
  const [clientProvide, setClientProvide] = useState("");
  const [duration, setDuration] = useState("");
  const [payType, setPayType] = useState("");
  const [influencer, setInfluencer] = useState("");
  const [age, setAge] = useState("");
  const [workType, setWorkType] = useState("");
  const [timeZone, setTimeZone] = useState("");
  const [talentArrival, setTalentArrival] = useState("");
  const [jobDuration, setJobDuration] = useState("");
  const [projectLocation, setProjectLocation] = useState("");
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
  const [mediaType, setMediaType] = useState("");
  const [mySkill, setMySkill] = useState("");
  const [customSkills, setCustomSkills] = useState("");
  const [selectedRow, setSelectedRow] = useState({});
  const [callingCode, setCallingCode] = useState("91");
  const [clientCallingCode, setClientCallingCode] = useState("91");
  const [jobDetails, setJobDetails] = useState({
    title: "",
    modelCount: "",
    startDate: new Date(),
    endDate: new Date(),
    startTime: new Date(),
    endTime: new Date(),
    arrivalTime: new Date(),
    clientContact: "",
    clientPhoneNumber: "",
    locationContact: "",
    locationPhoneNumber: "",
    description: "",
    projectRate: "",
    diemProvided: "",
    usageFee: "",
    talentReq: "",
    projectFiles: [],
  });
  const [address, setAddress] = useState({
    jobLocation: "",
    addressLine: "",
    addressLine2: "",
    postalCode: "",
  });
  const [location, setLocation] = useState({
    countryID: "",
    countryList: "",
    stateList: "",
    cityList: "",
  });

  useEffect(() => {
    getAllOptionsData();
    getAllCountryName("country");
  }, []);

  const getAllOptionsData = async () => {
    let res = await dispatch(getOptionsData());
    setOptions({
      ...options,
      femaleOptions: res?.results?.group_62749b609360c,
      maleOptions: res?.results?.group_62749a513bf1a,
      childOptions: res?.results?.group_63181d08b6357,
      otherOptions: res?.results?.group_627497cf304a6,
      socialMediaOptions: res?.results?.group_62849b4520284,
      postJobOptions: res?.results?.group_628774e8ce197,
      languages: res?.results?.languages,
      englishLevel: res?.results?.english_level,
    });
  };
  const getAllCountryName = async (type) => {
    let countryID = await getData(storageKey?.COUNTRY_ID);
    let stateID = await getData(storageKey?.STATE_ID);
    var body = {
      country: type == "country" ? "" : JSON?.parse(countryID),
      state: type == "city" ? JSON?.parse(stateID) : "",
      city: "",
    };
    let res = await dispatch(getCountryList(body));
    if (res?.status == 200) {
      let data = JSON?.parse(res?.results);
      if (type == "country") {
        setLocation({ ...location, countryList: data });
      } else if (type == "state") {
        setLocation({ ...location, stateList: data });
      } else if (type == "city") {
        setLocation({ ...location, cityList: data });
      }
    }
  };

  const selectProjectFiles = async () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      multiple: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
    }).then(async (response) => {
      if (response) {
        const result = [];
        for await (const image of response) {
          let fileIndex = image?.path?.lastIndexOf("/") + 1;
          let fileName = image?.path?.slice(fileIndex, image?.path?.length);
          const img = await ImagePicker.openCropper({
            mediaType: "photo",
            path: image.path,
            name: fileName,
            type: image?.mime,
            width: 1000,
            height: 1000,
            compressImageMaxWidth: 300,
            compressImageMaxHeight: 300,
            compressImageQuality: 0.5,
          });
          let img_obj = {
            name: fileName,
            uri: img?.path,
            type: img?.mime,
          };
          result.push(img_obj);
        }
        let arrr = [...jobDetails?.projectFiles];
        let newArr = arrr.concat(...result);
        await setJobDetails({ ...jobDetails, projectFiles: newArr });
      }
    });
  };

  const removeImage = (eachImage) => {
    let imageArr = [];
    imageArr = jobDetails?.projectFiles?.filter(
      (item) => item.uri != eachImage.uri
    );
    setJobDetails({ ...jobDetails, projectFiles: imageArr });
  };

  const clientProvides = [
    { label: "A car for pickup", value: "A car for pickup" },
    { label: "Flight Arrangements", value: "Flight Arrangements" },
    { label: "Hair stylist", value: "Hair stylist" },
    { label: "Lodging", value: "Lodging" },
    { label: "Makeup Artist", value: "Makeup Artist" },
    { label: "Meals", value: "Meals" },
    { label: "Milage reimbursement", value: "Milage reimbursement" },
    { label: "Wardrobe", value: "Wardrobe" },
  ];
  const workTypes = [
    { label: "Broadcast", value: "Broadcast" },
    { label: "Commercial shoot", value: "Commercial shoot" },
    { label: "E-commerce", value: "E-commerce" },
    { label: "Internet", value: "Internet" },
    { label: "Non-Broadcast", value: "Non-Broadcast" },
    { label: "Personal Project", value: "Personal Project" },
    { label: "Print", value: "Print" },
    { label: "Social Media", value: "Social Media" },
    { label: "TV", value: "TV" },
    { label: "Web only", value: "Web only" },
    { label: "Other", value: "Other" },
  ];
  const talentArrivalRequire = [
    { label: "Clothing", value: "Clothing" },
    { label: "Hair", value: "Hair" },
    { label: "Makeup", value: "Makeup" },
    { label: "Nails", value: "Nails" },
    { label: "Undergarments", value: "Undergarments" },
    { label: "Wardrode", value: "Wardrode" },
  ];
  const payTypes = [
    { label: "Hourly Rate", value: "Hourly Rate" },
    { label: "Half Day Rate", value: "Half Day Rate" },
    { label: "Full Day Rate", value: "Full Day Rate" },
    { label: "Flat Rate", value: "Flat Rate" },
  ];
  const durations = [
    { label: "1 year", value: "1 year" },
    { label: "2 year", value: "2 year" },
    { label: "3 year", value: "3 year" },
    { label: "4 year", value: "4 year" },
    { label: "5 year", value: "5 year" },
    { label: "Unlimited", value: "Unlimited" },
  ];

  const handleValidation = async () => {
    setError(true);
    if (!jobDetails?.title) {
      showToast("Please Enter the Project title");
    }
    // else if (!talent) {
    //   showToast("Please Select the Talent type");
    // }
    else if (!projectLevel) {
      showToast("Please Select the Project Level");
    } else if (!duration) {
      showToast("Please Select the duration");
    } else if (!englishLevel) {
      showToast("Please Select the Language Level");
    } else if (!projectLocation) {
      showToast("Please Select the Project Location type");
    } else if (!timeZone) {
      showToast("Please Select the Time Zone");
    } else if (!jobDetails?.startDate) {
      showToast("Please Select the start Date");
    } else if (!jobDetails?.endDate) {
      showToast("Please Select the End Date");
    } else if (!address?.jobLocation) {
      showToast("Please Enter the Job Location");
    } else if (!country) {
      showToast("Please Select the Country");
    } else if (!state) {
      showToast("Please Select the state");
    } else if (!city) {
      showToast("Please Select the City");
    } else if (!address?.addressLine) {
      showToast("Please enter the address line");
    } else if (!address?.postalCode) {
      showToast("Please enter the postal code");
    } else if (!address?.postalCode) {
      showToast("Please choose the arrival time");
    } else if (!workType) {
      showToast("Please choose some types of work");
    } else if (!talentArrival) {
      showToast("Please choose the Talent Arrival Requirement");
    } else if (!gender) {
      showToast("Please choose the gender");
    } else if (!age) {
      showToast("Please choose some ages");
    } else if (!height) {
      showToast("Please choose the height");
    } else if (!weight) {
      showToast("Please choose the weight");
    } else if (!ethnicity) {
      showToast("Please choose some ethnicity");
    } else if (!hairColor) {
      showToast("Please choose the hair color");
    } else if (!influencer) {
      showToast("Please choose the Influencer");
    } else if (!payType) {
      showToast("Please choose the pay type");
    } else if (!jobDetails?.projectRate) {
      showToast("Please enter the Project rate");
    } else {
      setError(false);
      handlePostJob();
    }
  };

  const handlePostJob = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userID,
      project_title: jobDetails?.title,
      freelancer_level: "Casting calls",
      model_type_req: "casting calls",
      number_of_model: jobDetails?.modelCount,
      project_level: projectLevel,
      project_duration: jobDuration,
      english_level: englishLevel,
      job_option: projectLocation,
      time_zone: timeZone,

      starting_date: moment(jobDetails?.startDate),
      end_date: moment(jobDetails?.endDate),
      starting_time: jobDetails?.startTime,
      end_time: jobDetails?.endTime,
      location_description: address?.jobLocation,
      country: country,
      state: state,
      city: city,
      address_line: address?.addressLine,
      address_line_2: address?.addressLine2,
      zipcode: address?.postalCode,
      reached_time: jobDetails?.arrivalTime,
      client_provide: clientProvide,

      primary_client_contact: jobDetails?.clientContact,
      primary_contact_emergency: jobDetails?.clientPhoneNumber,
      location_contact: jobDetails?.locationContact,
      location_contact_phone_number: jobDetails?.locationPhoneNumber,
      other_contact: "",
      type_of_work: workType,
      talent_requirements: talentArrival,
      additional_information: jobDetails?.talentReq,

      required_gender:
        gender == "Male" || gender == "male"
          ? "male"
          : gender == "Female" || gender == "female"
          ? "female"
          : gender == "Non Binary" ||
            gender == "non binary" ||
            gender == "other"
          ? "other"
          : "",
      model_age: age,
      height_req: "3'",
      weight_req: weight,
      ethnicity_req: ethnicity,
      hair_color_req: hairColor,
      influencer_req: influencer,

      project_type: payType,
      estimated_hours: 12,
      project_cost: jobDetails?.projectRate,
      amount_of_per_diem_provided: jobDetails?.diemProvided,

      duration_usage: duration,
      location_usage: locationUsage,
      media_type_usage: mediaType,
      usage_fee: jobDetails?.usageFee,

      languages: language,
      description: jobDetails?.description,

      skills_names: mySkill,
      add_custom_skills: customSkills,

      // set_custom_time: [
      //   {
      //     label: "10-01-2023",
      //     value: {
      //       start_time: "01:05",
      //       end_time: "06:05",
      //     },
      //   },
      //   {
      //     label: "11-01-2023",
      //     value: {
      //       start_time: "20:16",
      //       end_time: "23:16",
      //     },
      //   },
      //   {
      //     label: "12-01-2023",
      //     value: {
      //       start_time: "20:16",
      //       end_time: "23:16",
      //     },
      //   },
      //   {
      //     label: "13-01-2023",
      //     value: {
      //       start_time: "20:16",
      //       end_time: "23:16",
      //     },
      //   },
      //   {
      //     label: "14-01-2023",
      //     value: {
      //       start_time: "20:16",
      //       end_time: "23:16",
      //     },
      //   },
      //   {
      //     label: "15-01-2023",
      //     value: {
      //       start_time: "20:16",
      //       end_time: "23:16",
      //     },
      //   },
      // ],
    };
    let res = await dispatch(postJob(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.HOME_STACKS);
    }
  };

  return (
    <>
      <Header
        navigation={navigation}
        text={"Post Casting Call"}
        filter={false}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...Styles?.container, marginBottom: 30 }}>
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Job description"
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>

          <InputBox
            type="text"
            value={jobDetails?.title}
            placeholder="Project title *"
            onChangeText={(val) => setJobDetails({ ...jobDetails, title: val })}
            icon={Images?.jobTypeIcon}
            isEmpty={error && isFieldEmpty(jobDetails?.title)}
          />
          {/* <DropDownList
            placeholder={"Select Talent Type *"}
            icon={Images?.userType}
            value={talent}
            setValue={setTalent}
            options={talentTypes}
            border={false}
            isEmpty={error && isFieldEmpty(talent)}
          /> */}
          <InputBox
            type="numeric"
            value={jobDetails?.modelCount}
            placeholder="Numbers of Models *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, modelCount: val })
            }
            fontIcon={"format-list-numbered-rtl"}
            isEmpty={error && isFieldEmpty(jobDetails?.modelCount)}
          />
          <DropDownList
            placeholder="Select Project Level *"
            fontIcon={"car-brake-fluid-level"}
            value={projectLevel}
            setValue={setProjectLevel}
            options={projectLevels}
            border={false}
            isEmpty={error && isFieldEmpty(projectLevel)}
          />
          <DropDownList
            placeholder="Select Job Duration *"
            icon={Images?.timer_sand}
            value={jobDuration}
            setValue={setJobDuration}
            options={jobDurations}
            border={false}
            isEmpty={error && isFieldEmpty(jobDuration)}
          />
          <DropDownList
            placeholder={"Select Language Level *"}
            fontIcon={"car-brake-fluid-level"}
            value={englishLevel}
            setValue={setEnglishLevel}
            options={options?.englishLevel}
            border={false}
            isEmpty={error && isFieldEmpty(englishLevel)}
          />
          <DropDownList
            placeholder={"Project location type *"}
            icon={Images?.locationIcon}
            value={projectLocation}
            setValue={setProjectLocation}
            options={projectLocations}
            border={false}
            isEmpty={error && isFieldEmpty(projectLocation)}
          />
          <InputBox
            type="multiselect"
            placeholder="Time zone *"
            options={timeZones}
            fontIcon={"clock-outline"}
            value={timeZone}
            setOption={setTimeZone}
            border={false}
            isEmpty={error && isFieldEmpty(timeZone)}
          />
          {/* <DropDownList
            placeholder={"Time zone *"}
            icon={Images?.watchIcon}
            value={timeZone}
            setValue={setTimeZone}
            options={timeZones}
            border={false}
            isEmpty={error && isFieldEmpty(timeZone)}
          /> */}

          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Job Details"
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          <InputBox
            type="datePicker"
            placeholder="Start Date *"
            date={jobDetails?.startDate}
            setDate={(date) => {
              setJobDetails({ ...jobDetails, startDate: date });
            }}
            icon={Images?.calanderIcon}
            isEmpty={error && isFieldEmpty(jobDetails?.startDate)}
          />
          <InputBox
            type="datePicker"
            placeholder="End Date *"
            date={jobDetails?.endDate}
            setDate={(date) => {
              setJobDetails({ ...jobDetails, endDate: date });
            }}
            icon={Images?.calanderIcon}
            isEmpty={error && isFieldEmpty(jobDetails?.endDate)}
          />
          <InputBox
            type="timePicker"
            placeholder="Start Time *"
            time={jobDetails?.startTime}
            setTime={(date) => {
              setJobDetails({ ...jobDetails, startTime: date });
            }}
            icon={Images?.watchIcon}
            isEmpty={error && isFieldEmpty(jobDetails?.startTime)}
          />
          <InputBox
            type="timePicker"
            placeholder="End Time *"
            time={jobDetails?.endTime}
            setTime={(date) => {
              setJobDetails({ ...jobDetails, endTime: date });
            }}
            icon={Images?.watchIcon}
            isEmpty={error && isFieldEmpty(jobDetails?.endTime)}
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={address?.jobLocation}
            placeholder={"Job location"}
            onChangeText={(val) => setAddress({ ...address, jobLocation: val })}
            toolTipText="Please describe the job location"
          />
          <DropDownList
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
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={address?.addressLine}
            placeholder="Address Line *"
            onChangeText={(val) => setAddress({ ...address, addressLine: val })}
            isEmpty={error && isFieldEmpty(address?.addressLine)}
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={address?.addressLine2}
            placeholder="Address Line 2 (optional)"
            onChangeText={(val) =>
              setAddress({ ...address, addressLine2: val })
            }
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={address?.postalCode}
            placeholder="Postal Code *"
            onChangeText={(val) => setAddress({ ...address, postalCode: val })}
            isEmpty={error && isFieldEmpty(address?.postalCode)}
          />
          <InputBox
            type="timePicker"
            placeholder="Arrival Time *"
            time={jobDetails?.arrivalTime}
            setTime={(date) => {
              setJobDetails({ ...jobDetails, arrivalTime: date });
            }}
            icon={Images?.watchIcon}
            isEmpty={error && isFieldEmpty(jobDetails?.arrivalTime)}
          />
          <InputBox
            type="multiselect"
            placeholder="Select Client Provides"
            // options={clientProvides}
            options={
              options?.postJobOptions?.client_provide?.field_meta?.choices
            }
            setOption={setClientProvide}
            value={clientProvide}
            icon={Images?.userIcon}
            isEmpty={error && isFieldEmpty(clientProvide)}
          />
          <InputBox
            type="text"
            value={jobDetails?.clientContact}
            placeholder="Primary Client contact *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, clientContact: val })
            }
            isEmpty={error && isFieldEmpty(jobDetails?.clientContact)}
          />
          <InputBox
            type="phone"
            value={jobDetails?.clientPhoneNumber}
            placeholder="Primary Client Phone Number *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, clientPhoneNumber: val })
            }
            // callingCode={clientCallingCode}
            // setCallingCode={setClientCallingCode}
            isEmpty={error && isFieldEmpty(jobDetails?.clientPhoneNumber)}
          />
          <InputBox
            type="text"
            value={jobDetails?.locationContact}
            placeholder="Location Contact *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, locationContact: val })
            }
            isEmpty={error && isFieldEmpty(jobDetails?.locationContact)}
            toolTipText="This is the person who your talent will contact at the location."
          />
          <InputBox
            type="phone"
            value={jobDetails?.locationPhoneNumber}
            placeholder="Location contact phone number *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, locationPhoneNumber: val })
            }
            // callingCode={callingCode}
            // setCallingCode={setCallingCode}
            isEmpty={error && isFieldEmpty(jobDetails?.locationPhoneNumber)}
            span="This contact information will not go public. It will be viewed by the talent who is booked."
          />
          <InputBox
            type="multiselect"
            placeholder="Type of works *"
            // options={workTypes}
            options={options?.postJobOptions?.type_of_work?.field_meta?.choices}
            setOption={setWorkType}
            value={workType}
            fontIcon={"electron-framework"}
            isEmpty={error && isFieldEmpty(workType)}
          />
          <InputBox
            type="multiselect"
            placeholder="Talent Arrival Requirement *"
            // options={talentArrivalRequire}
            options={
              options?.postJobOptions?.talent_requirements?.field_meta?.choices
            }
            setOption={setTalentArrival}
            value={talentArrival}
            icon={Images?.userType}
            isEmpty={error && isFieldEmpty(talentArrival)}
          />
          <InputBox
            type="text"
            value={jobDetails?.talentReq}
            placeholder="Talent requirement notes"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, talentReq: val })
            }
            icon={Images?.userType}
          />
          <InputBox
            type="description"
            value={jobDetails?.description}
            placeholder="Job Description *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, description: val })
            }
            style={{ marginTop: 8, marginHorizontal: 0 }}
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent text="Details" size={Sizes?.s} fontWeight="400" />
          </View>
          <DropDownList
            placeholder={"Select Gender"}
            icon={Images?.genderType}
            value={gender}
            setValue={setGender}
            options={
              gender == "kid" || gender == "Kid" || gender == "child"
                ? kidGenderTypes
                : genderTypes
            }
            border={false}
          />
          <InputBox
            type="multiselect"
            placeholder="Select Age *"
            options={ages}
            setOption={setAge}
            value={age}
            icon={Images?.calanderIcon}
            isEmpty={error && isFieldEmpty(age)}
          />
          <DropDownList
            placeholder={"Height (Inch)"}
            fontIcon={"human-male-height"}
            value={height}
            setValue={setHeight}
            options={heightInches}
            border={false}
          />
          <DropDownList
            placeholder={"Weight (Pound)"}
            fontIcon={"weight-pound"}
            value={weight}
            setValue={setWeight}
            options={weightInches}
            border={false}
          />
          <InputBox
            type="multiselect"
            placeholder={"Ethnicity"}
            fontIcon={"city"}
            value={ethnicity}
            setOption={setEthnicity}
            options={ethnicities}
            border={false}
          />
          <DropDownList
            placeholder={"Hair color"}
            fontIcon={"hair-dryer"}
            value={hairColor}
            setValue={setHairColor}
            options={hairColors}
            border={false}
          />
          <DropDownList
            placeholder={"Influencer"}
            fontIcon={"access-point-network"}
            value={influencer}
            setValue={setInfluencer}
            options={followers}
            border={false}
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent text="Prices" size={Sizes?.s} fontWeight="400" />
          </View>
          <DropDownList
            placeholder={"Pay type *"}
            icon={Images?.dollarCash}
            value={payType}
            setValue={setPayType}
            options={payTypes}
            border={false}
            isEmpty={error && isFieldEmpty(payType)}
          />
          <InputBox
            type="numeric"
            value={jobDetails?.projectRate}
            placeholder="Project Rate *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, projectRate: val })
            }
            fontIcon={"hours-24"}
            keyboardType="numeric"
            isEmpty={error && isFieldEmpty(jobDetails?.projectRate)}
            toolTipText={"Add your project rate"}
          />
          <InputBox
            type="numeric"
            value={jobDetails?.diemProvided}
            placeholder="Amount of per diem provided"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, diemProvided: val })
            }
            icon={Images?.dollarIcon}
            keyboardType="numeric"
            toolTipText={
              "This is an allowance for lodging, meals, and incidental expenses per day."
            }
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent text="Usage" size={Sizes?.s} fontWeight="400" />
          </View>
          <TextComponent
            text="Usage is how the project will be used. This includes duration, location and media type"
            size={Sizes?.xs}
            fontWeight="400"
            color={Colors?.darkgrey}
            fontStyle={Fonts?.Italic}
            style={{ width: "100%" }}
          />
          <DropDownList
            placeholder={"Duration"}
            fontIcon={"hours-24"}
            value={duration}
            setValue={setDuration}
            options={
              options?.postJobOptions?.duration_usage?.field_meta?.choices
            }
            border={false}
          />
          <DropDownList
            placeholder={"Location *"}
            icon={Images?.locationIcon}
            value={locationUsage}
            setValue={setLocationUsage}
            options={locationsUsage}
            border={false}
          />

          <InputBox
            type="multiselect"
            placeholder="Media Type *"
            options={
              options?.postJobOptions?.media_type_usage?.field_meta?.choices
            }
            setOption={setMediaType}
            value={mediaType}
            // fontIcon={"language"}
          />
          <InputBox
            type="text"
            value={jobDetails?.usageFee}
            placeholder="Usage Fee"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, usageFee: val })
            }
            toolTipText={
              "This is the fee associated with the cost of “duration, location, and media type"
            }
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent text="Languages" size={Sizes?.s} fontWeight="400" />
          </View>
          <InputBox
            type="multiselect"
            placeholder="Select Language"
            options={languages}
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
              text="Skills Required"
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          <InputBox
            type="multiselect"
            placeholder={"Choose Your Skills"}
            icon={Images?.skillIcon}
            value={mySkill}
            setValue={setMySkill}
            options={skills}
            border={false}
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
            style={{ marginBottom: 5 }}
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Upload Relevant Project Files"
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>

          <TouchableOpacity
            onPress={() => selectProjectFiles()}
            style={{
              ...Styles?.flexRow,
              borderWidth: 1,
              borderColor: Colors?.themeColor,
              borderStyle: "dotted",
              borderRadius: 25,
              marginVertical: 20,
            }}
          >
            <View
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                paddingHorizontal: 20,
                marginVertical: 0,
                paddingVertical: 8,
              }}
            >
              <TextComponent
                text="Select Files"
                size={Sizes?.xs}
                fontWeight="400"
                color={Colors?.white}
              />
            </View>
          </TouchableOpacity>
          {jobDetails?.projectFiles?.length != 0 ? (
            <FlatList
              data={jobDetails?.projectFiles}
              contentContainerStyle={{ width: "100%", marginVertical: 20 }}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) => (
                <View
                  style={{
                    position: "relative",
                    width: 90,
                    margin: 6,
                  }}
                >
                  <Image
                    source={{ uri: item?.uri }}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 10,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeImage(item)}
                    style={{ right: -2, position: "absolute", top: -2 }}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={15}
                      color={Colors?.pink}
                      style={{
                        backgroundColor: Colors?.white,
                        borderRadius: 100,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              )}
              numColumns={3}
            />
          ) : null}
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Attachments"
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          <View
            style={{ ...Styles?.flexRow, width: "95%", marginHorizontal: 8 }}
          >
            <TextComponent
              text="Show “attachments” on job detail page"
              size={Sizes?.s}
              fontWeight="400"
              color={Colors?.darkgrey}
              fontStyle={Fonts?.Italic}
            />
            <TouchableOpacity
              onPress={() =>
                setAccountSwitches({
                  ...accountSwitches,
                  disableAccount: !accountSwitches?.disableAccount,
                })
              }
            >
              <MaterialCommunityIcons
                size={45}
                name={
                  accountSwitches?.disableAccount
                    ? "toggle-switch"
                    : "toggle-switch-off"
                }
                color={
                  accountSwitches?.disableAccount
                    ? Colors?.themeColor
                    : Colors?.darkgrey
                }
              />
            </TouchableOpacity>
          </View>
          <TextComponent
            text="Update all the latest changes made by you, by just clicking on “Submit Application“ button."
            size={Sizes?.s}
            fontWeight="400"
            style={{ width: "100%", padding: 8 }}
          />
        </View>
        <Button
          title="Submit Application"
          icon={true}
          background={true}
          onPress={() => handleValidation()}
          style={{ paddingVertical: 5 }}
        />
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});
