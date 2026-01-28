import React, { useEffect, useState } from "react";
import {
  FlatList,
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
  Header,
  Loader,
} from "../../Components";
import { Sizes, Colors, Images, Fonts } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
// import * as ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";

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
  jobTalentTypes,
  kidAges,
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
import {
  getCountryList,
  postJob,
  updatePostedJob,
} from "../../Redux/Services/OtherServices";
import Entypo from "react-native-vector-icons/Entypo";
import { Image } from "react-native";
import moment from "moment";
import { getOptionsData } from "../../Redux/Services/AuthServices";
import { useFocusEffect } from "@react-navigation/native";
export const EditCastingCalls = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { jobData } = route?.params;
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);
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
  const newDate = new Date();
  const newDateString = newDate.toISOString();
  const dateNow = new Date().toISOString();

  const newTime = newDate.getTime();
  const [callingCode, setCallingCode] = useState("91");
  const [clientCallingCode, setClientCallingCode] = useState("91");
  const [jobDetails, setJobDetails] = useState({
    title: "",
    modelCount: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    startTime: new Date().getTime(),
    endTime: new Date().getTime(),
    arrivalTime: new Date().getTime(),
    casting_termination_date: dateNow,
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
    model_age: "",
    miniPrice: "",
    estimatedHrs: "",
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
  const [dateRange, setDateRange] = useState([]);
  const [showRange, setShowRange] = useState(false);

  useEffect(() => {
    getAllOptionsData();
    getAllCountryName("country");
  }, []);
  console.log("jobDatajobData------", JSON?.stringify(jobData));
  useFocusEffect(
    React.useCallback(() => {
      setLocationUsage(jobData?.post_meta_details?.location_usage);
      setGender(jobData?.post_meta_details?.required_gender);
      setProjectLevel(jobData?.fw_option[0]?.project_level);
      setClientProvide(jobData?.post_meta_details?.client_provide);
      if (jobData?.post_meta_details?.duration_usage?.length != 0) {
        setDuration(jobData?.post_meta_details?.duration_usage);
      } else {
        setDuration("");
      }
      setPayType(jobData?.post_meta_details?._project_type);
      setInfluencer(jobData?.post_meta_details?.influencer_req);
      setWorkType(jobData?.post_meta_details?.type_of_work);
      setTimeZone(jobData?.post_meta_details?.time_zone);
      setTalentArrival(jobData?.post_meta_details?.talent_requirements);
      setJobDuration(jobData?.post_meta_details?._project_duration);
      setProjectLocation(jobData?.post_meta_details?._job_option);
      setTalent(jobData?.post_meta_details?.model_type_req);
      setEnglishLevel(jobData?.post_meta_details?._english_level);
      setCountry(jobData?.post_meta_details?.country);
      setState(jobData?.post_meta_details?.state);
      setCity(jobData?.post_meta_details?.city);
      setLanguage(jobData?.post_meta_details?.languages);
      setHeight(jobData?.post_meta_details?.height_req);
      setWeight(jobData?.post_meta_details?.weight_req);
      setEthnicity(jobData?.post_meta_details?.ethnicity_req);
      setHairColor(jobData?.post_meta_details?.hair_color_req);
      setMediaType(jobData?.post_meta_details?.media_type_usage);
      setMySkill(jobData?.post_meta_details?.skills_names);
      setCustomSkills(jobData?.post_meta_details?.add_custom_skills);
      setAge(jobData?.post_meta_details?.age_req);

      setJobDetails({
        ...jobData,
        title: jobData?.profile?.post_title,
        modelCount: jobData?.post_meta_details?.number_of_model,
        startDate: new Date(jobData?.post_meta_details?.starting_date),
        endDate: new Date(jobData?.post_meta_details?.end_date),
        startTime: jobData?.post_meta_details?.starting_time,
        endTime: jobData?.post_meta_details?.end_time,
        arrivalTime: jobData?.post_meta_details?.reached_time,
        clientContact: jobData?.post_meta_details?.primary_client_contact,
        clientPhoneNumber:
          jobData?.post_meta_details?.primary_contact_emergency,
        locationContact: jobData?.post_meta_details?.location_contact,
        locationPhoneNumber:
          jobData?.post_meta_details?.location_contact_phone_number,
        projectRate: jobData?.post_meta_details?._hourly_rate
          ? ""
          : jobData?.post_meta_details?._project_cost,
        diemProvided: jobData?.post_meta_details?.amount_of_per_diem_provided,
        usageFee: jobData?.post_meta_details?.usage_fee,
        talentReq: jobData?.post_meta_details?.additional_information,
        description: jobData?.profile?.post_content,
        estimatedHrs: jobData?.post_meta_details?._project_cost
          ? ""
          : jobData?.post_meta_details?._estimated_hours,
        miniPrice: jobData?.post_meta_details?._project_cost
          ? ""
          : jobData?.post_meta_details?._hourly_rate,
      });
      setDateRange(jobData?.post_meta_details?.set_custom_time);
      setShowRange(false);
      setAddress({
        ...address,
        jobLocation: jobData?.post_meta_details?.project_location_description,
        addressLine: jobData?.post_meta_details?.address_line,
        addressLine2: jobData?.post_meta_details?.address_line_2,
        postalCode: jobData?.post_meta_details?.zipcode,
      });
    }, [])
  );
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

  const payTypes = [
    { label: "Hourly Rate", value: "Hourly Rate" },
    { label: "Half Day Rate", value: "Half Day Rate" },
    { label: "Full Day Rate", value: "Full Day Rate" },
    { label: "Flat Rate", value: "Flat Rate" },
  ];

  const handleValidation = async () => {
    setError(true);
    if (!jobDetails?.title) {
      showToast("Please Enter the Project title", "error");
    } else if (
      moment(jobDetails?.casting_termination_date).format("DD-MM-YYYY") ==
      moment(dateNow).format("DD-MM-YYYY")
    ) {
      showToast("Please Select the casting termination date", "error");
    } else if (!jobDetails?.description) {
      showToast("Please enter the description", "error");
    }
    // if (!jobDetails?.title) {
    //   showToast("Please Enter the Project title", "error");
    // }
    // else if (!talent) {
    //   showToast("Please Select the Talent type", "error");
    // }
    // else if (!projectLevel) {
    //   showToast("Please Select the Project Level", "error");
    // } else if (!duration) {
    //   showToast("Please Select the duration", "error");
    // } else if (!jobDuration) {
    //   showToast("Please Select the Job duration", "error");
    // } else if (!englishLevel) {
    //   showToast("Please Select the Language Level", "error");
    // } else if (!projectLocation) {
    //   showToast("Please Select the Project Location type", "error");
    // } else if (!timeZone) {
    //   showToast("Please Select the Time Zone", "error");
    // } else if (jobDetails?.startDate === newDateString) {
    //   showToast("Please Select the start Date", "error");
    // } else if (jobDetails?.endDate === newDateString) {
    //   showToast("Please Select the End Date", "error");
    // } else if (jobDetails?.startTime === newTime) {
    //   showToast("Please Select the start Time", "error");
    // } else if (jobDetails?.endTime === newTime) {
    //   showToast("Please Select the End Time", "error");
    // } else if (!address?.jobLocation) {
    //   showToast("Please Enter the Job Location", "error");
    // } else if (!country) {
    //   showToast("Please Select the Country", "error");
    // } else if (!state) {
    //   showToast("Please Select the state", "error");
    // } else if (!city) {
    //   showToast("Please Select the City", "error");
    // } else if (!address?.addressLine) {
    //   showToast("Please enter the address line", "error");
    // } else if (!address?.postalCode) {
    //   showToast("Please enter the postal code", "error");
    // } else if (!address?.postalCode) {
    //   showToast("Please choose the arrival time", "error");
    // } else if (!workType) {
    //   showToast("Please choose some types of work", "error");
    // } else if (!talentArrival) {
    //   showToast("Please choose the Talent Arrival Requirement", "error");
    // } else if (clientProvide?.length == 0) {
    //   showToast("Please Select Client Provides", "error");
    // } else if (!payType) {
    //   showToast("Please choose the pay type", "error");
    // } else if (payType == "Hourly Rate" && !jobDetails?.estimatedHrs) {
    //   showToast("Please enter the estimated hours", "error");
    // } else if (payType == "Hourly Rate" && !jobDetails?.miniPrice) {
    //   showToast("Please enter the minimum price", "error");
    // } else if (payType != "Hourly Rate" && !jobDetails?.projectRate) {
    //   showToast("Please enter the Project rate", "error");
    // }
    else {
      setError(false);
      handleUpdateJob();
    }
  };
  useEffect(() => {
    if (showRange && jobDetails?.startDate < jobDetails?.endDate) {
      handleDateRange(jobDetails?.startDate, jobDetails?.endDate);
    }
  }, [
    jobDetails?.startDate,
    jobDetails?.endDate,
    jobDetails?.startTime,
    jobDetails?.endTime,
  ]);
  const handleUpdateJob = async () => {
    let userID = await getData(storageKey?.USER_ID);
    const updatedDateRange = dateRange.map((obj) => {
      const start_time = moment(new Date(obj?.value?.start_time)).format(
        "hh:mm a"
      );
      const end_time = moment(new Date(obj?.value?.end_time)).format("hh:mm a");

      return {
        ...obj,
        value: {
          start_time: start_time,
          end_time: end_time,
        },
      };
    });
    var body = {
      user_id: userID,
      project_id: jobData?.profile?.ID,
      project_title: jobDetails?.title,
      freelancer_level: "Casting calls",
      model_type_req: "casting calls",
      number_of_model: jobDetails?.modelCount,
      project_level: projectLevel,
      project_duration: jobDuration,
      english_level: englishLevel,
      job_option: projectLocation,
      time_zone: timeZone,

      starting_date: moment(jobDetails?.startDate).format("YYYY-MM-DD"),
      end_date: moment(jobDetails?.endDate).format("YYYY-MM-DD"),
      starting_time: moment(jobDetails?.startTime).format("hh:mm a"),
      end_time: moment(jobDetails?.endTime).format("hh:mm a"),
      starting_time: jobDetails?.startTime,
      end_time: jobDetails?.endTime,
      set_custom_time: dateRange,
      casting_termination_date : jobDetails?.casting_termination_date,


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

      project_type: payType,
      hourly_rate: jobDetails?.projectRate ? "" : jobDetails?.miniPrice,
      estimated_hours: jobDetails?.projectRate ? "" : jobDetails?.estimatedHrs,
      project_cost: jobDetails?.miniPrice ? "" : jobDetails?.projectRate,
      amount_of_per_diem_provided: jobDetails?.diemProvided,

      duration_usage: duration,
      location_usage: locationUsage,
      media_type_usage: mediaType,
      usage_fee: jobDetails?.usageFee,

      languages: language,
      description: jobDetails?.description,

      skills_names: mySkill,
      add_custom_skills: customSkills,
    };
    console.log("bodybodybodybody------", JSON.stringify(body));
    let res = await dispatch(updatePostedJob(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.MANAGE_JOBS);
    }
  };
  const handleDateRange = (startDate, endDate, steps = 1) => {
    let dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      // dateArray?.push({
      //   date: moment(currentDate).format("DD/MM/YYYY"),
      //   startTime: jobDetails?.startTime,
      //   endTime: jobDetails?.endTime,
      // });
      dateArray?.push({
        label: moment(currentDate).format("DD/MM/YYYY"),
        value: {
          start_time: new Date(jobDetails?.startTime),
          end_time: new Date(jobDetails?.endTime),
          format_start_time: moment(jobDetails?.startTime).format("hh:mm a"),
          format_end_time: moment(jobDetails?.endTime).format("hh:mm a"),
          // start_time: moment(jobDetails?.startTime).format("hh:mm a"),
          // end_time: moment(jobDetails?.endTime).format("hh:mm a"),
        },
      });
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    if (
      jobDetails?.startDate < jobDetails?.endDate &&
      jobDetails?.startTime < jobDetails?.endTime
    ) {
      setDateRange(dateArray);
      return dateArray;
    }
  };

  const [selectedItemId, setSelectedItemId] = useState(null);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickedType, setPickedType] = useState("start");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());

  const updateDataItem = (index, newTime) => {
    if (index >= 0 && index < dateRange.length) {
      const updatedItem = { ...dateRange[index] };
      if (pickedType == "start") {
        updatedItem.value.start_time = newTime;
        updatedItem.value.format_start_time = moment(newTime).format("hh:mm a");
      } else {
        updatedItem.value.end_time = newTime;
        updatedItem.value.format_end_time = moment(newTime).format("hh:mm a");
      }
      const updatedDataArray = [...dateRange];
      updatedDataArray[index] = updatedItem;
      setDateRange(updatedDataArray);
    }
  };
  const handleTimeChange = (event, selectedTime) => {
    setShowTimePicker(false);
    if (selectedTime) {
      const formattedTime = selectedTime;
      if (selectedItemId !== null) {
        updateDataItem(selectedItemId, formattedTime);
        setSelectedItemId(null);
      }
    }
  };
  const showTimePickerForItem = (itemId) => {
    setSelectedItemId(itemId);
    setShowTimePicker(true);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header
        navigation={navigation}
        text={"Edit Casting Call"}
        filter={false}
      />
      <Loader loading={other?.isLoading ? other?.isLoading : auth?.isLoading} />

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
          <InputBox
            type="description"
            value={jobDetails?.description}
            placeholder="Job Description"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, description: val })
            }
            style={{ marginTop: 8, marginHorizontal: 0 }}
          />
          <InputBox
            type="numeric"
            value={jobDetails?.modelCount}
            placeholder="Numbers of Models *"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, modelCount: val })
            }
            keyboardType={"numeric"}
            fontIcon={"format-list-numbered-rtl"}
            isEmpty={error && isFieldEmpty(jobDetails?.modelCount)}
          />
          <InputBox
            type="text"
            value={"Casting Calls"}
            placeholder="Casting Calls *"
            onChangeText={(val) => console.log("Casting Calls")}
            icon={Images?.userType}
            editable={false}
          />
          {/* <DropDownList
            placeholder={"Select Talent Type *"}
            icon={Images?.userType}
            value={talent}
            setValue={setTalent}
            options={jobTalentTypes}
            border={false}
            isEmpty={error && isFieldEmpty(talent)}
          /> */}
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
            fontIcon={"clock-outline"}
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
            date={new Date(jobDetails?.startDate)}
            setDate={(date) => {
              setJobDetails({ ...jobDetails, startDate: date });
            }}
            icon={Images?.calanderIcon}
            isEmpty={
              error && isFieldEmpty(jobDetails?.startDate === newDateString)
            }
            dateType="startDate"
            showDate={true}
          />

          <InputBox
            type="datePicker"
            placeholder="End Date *"
            date={new Date(jobDetails?.endDate)}
            setDate={(date) => {
              setJobDetails({ ...jobDetails, endDate: date });
            }}
            icon={Images?.calanderIcon}
            isEmpty={
              error && isFieldEmpty(jobDetails?.endDate === newDateString)
            }
            dateType="endDate"
            startDate={jobDetails?.startDate}
            showDate={true}
          />
          {/* <InputBox
          type="datePicker"
          placeholder={"Start Date *"}
          date={jobDetails?.startDate}
          setDate={(date) => {
            setJobDetails({ ...jobDetails, startDate: date });
          }}
          icon={Images?.calanderIcon}
          isEmpty={error && isFieldEmpty(jobDetails?.startDate)}
          currentDateDisable={true}
        />
        <InputBox
          type="datePicker"
          placeholder={"End Date *"}
          date={jobDetails?.endDate}
          setDate={(date) => {
            setJobDetails({ ...jobDetails, endDate: date });
          }}
          icon={Images?.calanderIcon}
          isEmpty={error && isFieldEmpty(jobDetails?.endDate)}
          currentDateDisable={true}
        /> */}
          <InputBox
            type="timePicker"
            placeholder="Start Time *"
            time={new Date(jobDetails?.startTime)}
            setTime={(date) => {
              setShowRange(true);
              setJobDetails({ ...jobDetails, startTime: date });
            }}
            fontIcon={"clock-outline"}
            isEmpty={
              error && isFieldEmpty(new Date(jobDetails?.startTime) === newTime)
            }
            showDate={true}
          />
          <InputBox
            type="timePicker"
            placeholder="End Time *"
            time={new Date(jobDetails?.endTime)}
            setTime={(date) => {
              setShowRange(true);
              setJobDetails({ ...jobDetails, endTime: date });
            }}
            fontIcon={"clock-outline"}
            isEmpty={
              error && isFieldEmpty(new Date(jobDetails?.endTime) === newTime)
            }
            showDate={true}
          />
          {dateRange?.length != 0 ? (
            <View
              style={{
                ...Styles?.container,
                marginHorizontal: 0,
                width: "100%",
                marginTop: 5,
              }}
            >
              <View
                style={{
                  ...Styles?.flexRow,
                  marginVertical: 5,
                  alignSelf: "flex-end",
                }}
              >
                <TextComponent text={"Date"} size={Sizes.l} fontWeight="400" />
                <TextComponent
                  text={"Start Time"}
                  size={Sizes.l}
                  fontWeight="400"
                  style={{ marginLeft: 20 }}
                />
                <TextComponent
                  text={"End Time"}
                  size={Sizes.l}
                  fontWeight="400"
                />
              </View>
              <View style={{ ...Styles?.separator }} />
              {dateRange?.map((item, index) => (
                <>
                  <View
                    style={{
                      ...Styles?.flexRow,
                      alignItems: "center",
                      paddingVertical: 6,
                      alignContent: "center",
                      // paddingHorizontal: 10,
                    }}
                  >
                    <View style={{ ...Styles?.row, width: 100 }}>
                      <MaterialCommunityIcons
                        name="calendar-clock"
                        size={15}
                        color={Colors?.darkgrey}
                      />
                      <TextComponent
                        text={item?.label}
                        size={Sizes.s}
                        fontWeight="400"
                        color={Colors?.darkgrey}
                        style={{ textAlign: "center", paddingLeft: 5 }}
                      />
                    </View>
                    {item?.value?.start_time && (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setStartTime(item?.value?.start_time);
                          showTimePickerForItem(index);
                          setPickedType("start");
                        }}
                        style={{
                          ...Styles?.row,
                          width: 90,
                          borderWidth: 1,
                          borderColor: Colors?.darkgrey,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 6,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="clock-edit-outline"
                          size={15}
                          color={Colors?.darkgrey}
                        />
                        <TextComponent
                          text={item?.value?.format_start_time}
                          size={Sizes.s}
                          fontWeight="400"
                          color={Colors?.darkgrey}
                          style={{ textAlign: "center", paddingLeft: 3 }}
                        />
                      </TouchableOpacity>
                    )}
                    {item?.value?.end_time && (
                      <TouchableOpacity
                        key={index}
                        onPress={() => {
                          setEndTime(item?.value?.end_time);
                          showTimePickerForItem(index);
                          setPickedType("end");
                        }}
                        style={{
                          ...Styles?.row,
                          width: 90,
                          borderWidth: 1,
                          borderColor: Colors?.darkgrey,
                          paddingHorizontal: 6,
                          paddingVertical: 2,
                          borderRadius: 6,
                          marginRight: -8,
                        }}
                      >
                        <MaterialCommunityIcons
                          name="clock-edit-outline"
                          size={15}
                          color={Colors?.darkgrey}
                        />
                        <TextComponent
                          text={item?.value?.format_end_time}
                          size={Sizes.s}
                          fontWeight="400"
                          color={Colors?.darkgrey}
                          style={{ textAlign: "center", paddingLeft: 3 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                  <View style={{ ...Styles?.separator }} />
                </>
              ))}
              {showTimePicker && (
                <>
                  <View
                    style={
                      Platform.OS === "ios"
                        ? {
                            ...Styles.container,
                            marginHorizontal: 0,
                            width: "100%",
                            marginTop: 0,
                            padding: 5,
                          }
                        : null
                    }
                  >
                    <DateTimePicker
                      value={
                        Platform?.OS == "ios"
                          ? jobDetails?.startTime
                          : new Date()
                      }
                      mode="time"
                      is24Hour={false}
                      display="spinner"
                      onChange={handleTimeChange}
                    />

                    {Platform.OS === "ios" && (
                      <TouchableOpacity
                        onPress={() => {
                          setShowTimePicker(false);
                        }}
                        style={{
                          ...Styles?.smallButton,
                          backgroundColor: Colors?.themeColor,
                          marginVertical: 0,
                          alignSelf: "flex-end",
                          margin: 10,
                        }}
                      >
                        <TextComponent
                          text="Done"
                          color={Colors?.white}
                          size={Sizes?.s}
                          style={{ paddingHorizontal: 5 }}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          ) : null}
          <InputBox
            type="datePicker"
            placeholder="Casting Termination Date *"
            date={new Date(jobDetails?.casting_termination_date)}
            setDate={(date) => {
              setJobDetails({ ...jobDetails, casting_termination_date: date });
            }}
            icon={Images?.calanderIcon}
            isEmpty={
              error &&
              moment(jobDetails?.casting_termination_date).format(
                "DD-MM-YYYY"
              ) == moment(dateNow).format("DD-MM-YYYY")
            }
            dateType="startDate"
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={address?.jobLocation}
            placeholder={"Job location"}
            onChangeText={(val) => setAddress({ ...address, jobLocation: val })}
            isEmpty={error && isFieldEmpty(address?.jobLocation)}
            toolTipText="Please describe the job location"
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
            disable={false}
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
            disable={false}
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
            fontIcon={"clock-outline"}
            isEmpty={error && isFieldEmpty(jobDetails?.arrivalTime === newTime)}
            showDate={true}
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
            isEmpty={error && isFieldEmpty(clientProvide?.length)}
          />
          <InputBox
            type="text"
            value={jobDetails?.clientContact}
            placeholder="Primary Client contact"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, clientContact: val })
            }
          />
          <InputBox
            type="phone"
            value={jobDetails?.clientPhoneNumber}
            placeholder="Primary Client Phone Number"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, clientPhoneNumber: val })
            }
            //  callingCode={clientCallingCode}
            // setCallingCode={setClientCallingCode}
          />
          <InputBox
            type="text"
            value={jobDetails?.locationContact}
            placeholder="Location Contact"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, locationContact: val })
            }
            toolTipText="This is the person who your talent will contact at the location."
          />
          <InputBox
            type="phone"
            value={jobDetails?.locationPhoneNumber}
            placeholder="Location contact phone number"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, locationPhoneNumber: val })
            }
            //  callingCode={callingCode}
            // setCallingCode={setCallingCode}
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
          {payType == "Hourly Rate" ? (
            <>
              <InputBox
                type="numeric"
                value={jobDetails?.miniPrice}
                placeholder="Hourly Rate *"
                onChangeText={(val) =>
                  setJobDetails({
                    ...jobDetails,
                    miniPrice: val,
                    projectRate: "",
                  })
                }
                icon={Images?.dollarIcon}
                keyboardType="numeric"
                isEmpty={error && isFieldEmpty(jobDetails?.miniPrice)}
                toolTipText={"Enter Hourly Rate"}
              />
              <InputBox
                type="numeric"
                value={jobDetails?.estimatedHrs}
                placeholder="Estimated hours *"
                onChangeText={(val) =>
                  setJobDetails({
                    ...jobDetails,
                    estimatedHrs: val,
                    projectRate: "",
                  })
                }
                fontIcon="timer-sand"
                keyboardType="numeric"
                isEmpty={error && isFieldEmpty(jobDetails?.estimatedHrs)}
                toolTipText={"Enter Estimated hours"}
              />
            </>
          ) : (
            <InputBox
              type="numeric"
              value={jobDetails?.projectRate}
              placeholder="Project Rate *"
              onChangeText={(val) =>
                setJobDetails({
                  ...jobDetails,
                  projectRate: val,
                  miniPrice: "",
                  estimatedHrs: "",
                })
              }
              fontIcon={"hours-24"}
              keyboardType="numeric"
              isEmpty={error && isFieldEmpty(jobDetails?.projectRate)}
              toolTipText={"Add your project rate"}
            />
          )}
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
            placeholder={"Location"}
            icon={Images?.locationIcon}
            value={locationUsage}
            setValue={setLocationUsage}
            options={locationsUsage}
            border={false}
            isEmpty={error && isFieldEmpty(locationUsage)}
          />

          <InputBox
            type="multiselect"
            placeholder="Media Type"
            options={
              options?.postJobOptions?.media_type_usage?.field_meta?.choices
            }
            setOption={setMediaType}
            value={mediaType}
            fontIcon={"printer-search"}
          />
          <InputBox
            type="numeric"
            value={jobDetails?.usageFee}
            placeholder="Usage Fee"
            onChangeText={(val) =>
              setJobDetails({ ...jobDetails, usageFee: val })
            }
            icon={Images?.dollarIcon}
            keyboardType="numeric"
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
            options={options?.languages}
            setOption={setLanguage}
            value={language}
            fontIcon={"earth"}
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
            options={skills}
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
            style={{ marginBottom: 5 }}
          />
          {/*  <View
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
          </View> */}
          <TextComponent
            text="Update all the latest changes made by you, by just clicking on “Post“ button."
            size={Sizes?.s}
            fontWeight="400"
            style={{ width: "100%", padding: 8 }}
          />
        </View>
        <Button
          title="Post"
          icon={true}
          background={true}
          onPress={() => handleValidation()}
          // onPress={() => handlePostJob()}
          style={{ paddingVertical: 5 }}
        />
        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
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
