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
  payTypes,
  projectLevels,
  projectLocations,
  skills,
  talentTypes,
  timeZones,
  weightInches,
} from "../../Global";
import { useDispatch, useSelector } from "react-redux";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { convertUTCToLocalTime, isFieldEmpty, showToast } from "../../Utility";
import {
  getCountryList,
  postJob,
  updatePostedJob,
} from "../../Redux/Services/OtherServices";
import Entypo from "react-native-vector-icons/Entypo";
import { Image } from "react-native";
import moment from "moment";
import { getOptionsData } from "../../Redux/Services/AuthServices";
import { Text } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import DateTimePicker from "@react-native-community/datetimepicker";
export const EditPostJob = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const newDate = new Date();

  const newDateString = newDate.toISOString();
  const newTime = newDate.getTime();
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
  const [dateRange, setDateRange] = useState([]);
  const [locationUsage, setLocationUsage] = useState("");
  const [gender, setGender] = useState("");
  const [projectLevel, setProjectLevel] = useState("");
  const [clientProvide, setClientProvide] = useState("");
  const [duration, setDuration] = useState("");
  const [payType, setPayType] = useState("");
  const [influencer, setInfluencer] = useState("");
  const [age, setAge] = useState([]);
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
  const [eyeColor, setEyeColor] = useState("");
  const [shirtSizeC, setShirtSizeC] = useState("");
  const [pantSizeWC, setPantSizeWC] = useState("");
  const [dressSizeC, setDressSizeC] = useState("");
  const [shoeSizeC, setShoeSizeC] = useState("");
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [pickedType, setPickedType] = useState("start");
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [selectedItemId, setSelectedItemId] = useState(null);
  const [callingCode, setCallingCode] = useState("91");
  const [clientCallingCode, setClientCallingCode] = useState("91");
  const [jobDetails, setJobDetails] = useState({
    title: "",
    startDate: new Date().toISOString(),
    endDate: new Date().toISOString(),
    startTime: new Date().getTime(),
    endTime: new Date().getTime(),
    arrivalTime: new Date().getTime(),
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
  const [showRange, setShowRange] = useState(false);

  useEffect(() => {
    getAllOptionsData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getAllCountryName("country");
      storeData(storageKey?.COUNTRY_ID, jobData?.post_meta_details?.country_id);
      storeData(storageKey?.STATE_ID, jobData?.post_meta_details?.state_id);
      setLocationUsage(jobData?.post_meta_details?.location_usage);
      setGender(jobData?.post_meta_details?.required_gender);
      setProjectLevel(jobData?.fw_option[0]?.project_level);
      setClientProvide(jobData?.post_meta_details?.client_provide);
      setDuration(jobData?.post_meta_details?.duration_usage);
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
      setDateRange(jobData?.post_meta_details?.set_custom_time);
      setShowRange(false);
      setAge(jobData?.post_meta_details?.age_req);
      console.log(
        "jobData?.post_meta_details?.starting_time------",
        jobData?.post_meta_details?.starting_time
      );
      setJobDetails({
        ...jobData,
        title: jobData?.profile?.post_title,
        startDate: jobData?.post_meta_details?.starting_date,
        endDate: jobData?.post_meta_details?.end_date,
        startTime: jobData?.post_meta_details?.starting_time.slice(0, -1),
        endTime: jobData?.post_meta_details?.end_time.slice(0, -1),
        arrivalTime: jobData?.post_meta_details?.reached_time.slice(0, -1),
        clientContact: jobData?.post_meta_details?.primary_client_contact,
        clientPhoneNumber:
          jobData?.post_meta_details?.primary_contact_emergency,
        locationContact: jobData?.post_meta_details?.location_contact,
        locationPhoneNumber:
          jobData?.post_meta_details?.location_contact_phone_number,
        description: jobData?.profile?.post_content,
        projectRate: jobData?.post_meta_details?._hourly_rate
          ? ""
          : jobData?.post_meta_details?._project_cost,
        diemProvided: jobData?.post_meta_details?.amount_of_per_diem_provided,
        usageFee: jobData?.post_meta_details?.usage_fee,
        talentReq: jobData?.post_meta_details?.additional_information,
        estimatedHrs: jobData?.post_meta_details?._project_cost
          ? ""
          : jobData?.post_meta_details?._estimated_hours,
        miniPrice: jobData?.post_meta_details?._project_cost
          ? ""
          : jobData?.post_meta_details?._hourly_rate,
      });
      setAddress({
        ...address,
        jobLocation: jobData?.post_meta_details?.project_location_description,
        addressLine: jobData?.post_meta_details?.address_line,
        addressLine2: jobData?.post_meta_details?.address_line_2,
        postalCode: jobData?.post_meta_details?.zipcode,
      });

      if (
        talent == "child" ||
        talent == "Kid" ||
        talent == "kid" ||
        talent == "Child" ||
        jobData?.post_meta_details?.model_type_req == "child"
      ) {
        // setGender(userData?.gender);
        if (jobData?.measurement_details) {
          setShirtSizeC(jobData?.measurement_details?.shirt_size);
          setPantSizeWC(
            jobData?.measurement_details?.pant_size
              ? jobData?.measurement_details?.pant_size
              : jobData?.measurement_details?.pant_size_waist
              ? jobData?.measurement_details?.pant_size_waist
              : jobData?.measurement_details?.pant_size_length
          );
          setDressSizeC(jobData?.measurement_details?.dress_size);
          setShoeSizeC(
            jobData?.measurement_details?.shoe_sizes
              ? jobData?.measurement_details?.shoe_sizes
              : jobData?.measurement_details?.shoe_size
              ? jobData?.measurement_details?.shoe_size
              : []
          );
          // setPantSize(
          //   jobData?.measurement_details?.pant_size
          //     ? jobData?.measurement_details?.pant_size
          //     : jobData?.measurement_details?.pant_size_waist
          //     ? jobData?.measurement_details?.pant_size_waist
          //     : jobData?.measurement_details?.pant_size_length
          // );
        }
      } else {
        setNeckSize(
          jobData?.measurement_details?.neck_size
            ? jobData?.measurement_details?.neck_size
            : []
        );
        setShirtSize(
          jobData?.measurement_details?.shirt_size
            ? jobData?.measurement_details?.shirt_size
            : jobData?.measurement_details?.shirt_size_m
        );
        setPantSizeW(jobData?.measurement_details?.pant_size_waist);
        setPantSizeL(jobData?.measurement_details?.pant_size_length);
        setJacket(jobData?.measurement_details?.jacket);
        setChestSize(jobData?.measurement_details?.chest_size);
        setDressShirt(jobData?.measurement_details?.dress_shirt_size);
        setShirtSleeve(jobData?.measurement_details?.dress_shirt_sleeve);
        setShoeSize(
          jobData?.measurement_details?.shoe_sizes
            ? jobData?.measurement_details?.shoe_sizes
            : jobData?.measurement_details?.shoe_size
            ? jobData?.measurement_details?.shoe_size
            : jobData?.measurement_details?.shoe_size_f
            ? jobData?.measurement_details?.shoe_size_f
            : jobData?.measurement_details?.shoe_size_m
        );
        setShirtSizeF(
          jobData?.measurement_details?.shirt_size
            ? jobData?.measurement_details?.shirt_size
            : jobData?.measurement_details?.shirt_size_f
        );
        setBraCup(jobData?.measurement_details?.bra_cup);
        setBraSize(jobData?.measurement_details?.bra_size);
        setDressSize(jobData?.measurement_details?.dress_size);
        setPantSize(
          jobData?.measurement_details?.pant_size
            ? jobData?.measurement_details?.pant_size
            : jobData?.measurement_details?.pant_size_f
        );
      }
    }, [route?.params])
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
      mediaType: "photo",
      // width: 1000,
      // height: 1000,
      cropping: true,
      multiple: true,
      // compressImageMaxWidth: 300,
      // compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
    }).then(async (response) => {
      if (response) {
        const result = [];
        for await (const image of response) {
          let fileIndex = image?.path?.lastIndexOf("/") + 1;
          let fileName = image?.path?.slice(fileIndex, image?.path?.length);
          const img = await ImagePicker.openCropper({
            path: image.path,
            width: "100%",
            height: "100%",
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
  console.log("jobDatajobDatajobDatajobDatajobData------", jobData);
  const removeImage = (eachImage) => {
    let imageArr = [];
    imageArr = jobDetails?.projectFiles?.filter(
      (item) => item.uri != eachImage.uri
    );
    setJobDetails({ ...jobDetails, projectFiles: imageArr });
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
  const handleDateRange = (startDate, endDate, steps = 1) => {
    let dateArray = [];
    let currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
      dateArray?.push({
        label: moment(currentDate).format("DD/MM/YYYY"),
        value: {
          // start_time: moment(jobDetails?.startTime).format("hh:mm a"),
          // end_time: moment(jobDetails?.endTime).format("hh:mm a"),
          start_time: new Date(jobDetails?.startTime),
          end_time: new Date(jobDetails?.endTime),
          format_start_time: moment(jobDetails?.startTime).format("hh:mm a"),
          format_end_time: moment(jobDetails?.endTime).format("hh:mm a"),
        },
      });
      currentDate.setUTCDate(currentDate.getUTCDate() + steps);
    }
    if (
      jobDetails?.startDate < jobDetails?.endDate &&
      jobDetails?.startTime &&
      jobDetails?.endTime
    ) {
      setDateRange(dateArray);
      return dateArray;
    }
  };

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
    setShowTimePicker(Platform?.OS == "ios");

    if (selectedTime) {
      // const formattedTime = moment(selectedTime).format("hh:mm a");
      const formattedTime = new Date(selectedTime);
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
  const handleValidation = async () => {
    setError(true);
    if (!jobDetails?.title) {
      showToast("Please Enter the Project title", "error");
    } else if (!talent) {
      showToast("Please Select the Talent type", "error");
    } else if (!projectLevel) {
      showToast("Please Select the Project Level", "error");
    } else if (!jobDuration) {
      showToast("Please Select the Job duration", "error");
    } else if (language?.length == 0) {
      showToast("Please Select the Languages", "error");
    } else if (!englishLevel) {
      showToast("Please Select the Language Level", "error");
    } else if (!projectLocation) {
      showToast("Please Select the Project Location type", "error");
    } else if (!timeZone) {
      showToast("Please Select the Time Zone", "error");
    } else if (!jobDetails?.description) {
      showToast("Please Select the job description", "error");
    } else if (jobDetails?.startDate === newDateString) {
      showToast("Please Select the start Date", "error");
    } else if (jobDetails?.endDate === newDateString) {
      showToast("Please Select the End Date", "error");
    } else if (jobDetails?.startTime === newTime) {
      showToast("Please Select the start Time", "error");
    } else if (jobDetails?.endTime === newTime) {
      showToast("Please Select the End Time", "error");
    } else if (!country) {
      showToast("Please Select the Country", "error");
    } else if (!state) {
      showToast("Please Select the state", "error");
    } else if (jobDetails?.arrivalTime === newTime) {
      showToast("Please choose the arrival time", "error");
    } else if (!workType) {
      showToast("Please choose some types of work", "error");
    } else if (clientProvide?.length == 0) {
      showToast("Please Select Client Provides", "error");
    } else if (!payType) {
      showToast("Please choose the pay type", "error");
    } else if (payType == "Hourly Rate" && !jobDetails?.estimatedHrs) {
      showToast("Please enter the estimated hours", "error");
    } else if (payType == "Hourly Rate" && !jobDetails?.miniPrice) {
      showToast("Please enter the minimum price", "error");
    } else if (payType != "Hourly Rate" && !jobDetails?.projectRate) {
      showToast("Please enter the Project rate", "error");
    } else {
      setError(false);
      handleUpdateJob();
    }
  };
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
    console.log("updatedDateRange000000=-------", updatedDateRange);
    var body = {
      project_id: jobData?.profile?.ID,
      user_id: userID,
      project_title: jobDetails?.title,
      freelancer_level: talent == "Kid" || talent == "child" ? "child" : talent,
      model_type_req:
        talent == "Model" || talent == "model"
          ? "model"
          : talent == "Kid" || talent == "child"
          ? "child"
          : talent,
      project_level: projectLevel,
      project_duration: jobDuration,
      english_level: englishLevel,
      job_option: projectLocation,
      time_zone: timeZone,

      starting_date: moment(jobDetails?.startDate).format("YYYY-MM-DD"),
      end_date: moment(jobDetails?.endDate).format("YYYY-MM-DD"),
      starting_time: moment(jobDetails?.startTime).format("hh:mm a"),
      end_time: moment(jobDetails?.endTime).format("hh:mm a"),
      set_custom_time: updatedDateRange,

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
      height_req: height,
      weight_req: weight,
      ethnicity_req: ethnicity,
      hair_color_req: hairColor,
      influencer_req: influencer,

      pant_size: pantSize,
      bra_cup_size: braCup,
      bra_size: braSize,
      dress_size: dressSize,

      shirt_size_m_req:
        gender == "male" || gender == "Male" ? shirtSize : shirtSizeF,
      shirt_size: gender == "male" || gender == "Male" ? shirtSize : shirtSizeF,
      pant_size_waist_req: pantSizeW,
      pant_size_length_req: pantSizeL,
      shoe_size: shoeSize ? shoeSize : shoeSizeC,
      shoe_size_f: shoeSize,
      dress_shirt_size_req: dressShirt,
      dress_shirt_sleeve_req: shirtSleeve,
      neck_size_req: neckSize,
      chest_size_req: chestSize,
      jacket_req: jacket,

      children_shirt_size: shirtSizeC,
      children_pant_size: pantSizeWC,
      children_shoe_size: shoeSizeC,
      children_dress_size: dressSizeC,

      toddler_shirt_size: shirtSizeC,
      toddler_pant_size: pantSizeWC,
      toddler_shoe_size: shoeSizeC,
      toddler_dress_size: dressSizeC,

      infant_shirt_size: shirtSizeC,
      infant_dress_size: dressSizeC,
      infant_pant_size: pantSizeWC,
      infant_shoe_size: shoeSizeC,

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
      post_content: jobDetails?.description,

      skills_names: mySkill,
      add_custom_skills: customSkills,
    };
    console.log("edit post job body-------", JSON.stringify(body));
    let res = await dispatch(updatePostedJob(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.MANAGE_JOBS);
    }
  };
  console.log("jobDatajobDatajobData-------", JSON.stringify(jobData));
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header navigation={navigation} text={"Edit Posted Job"} filter={false} />
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
            isEmpty={error && isFieldEmpty(jobDetails?.description)}
          />
          <DropDownList
            placeholder={"Select Talent Type *"}
            icon={Images?.userType}
            value={talent}
            setValue={setTalent}
            options={jobTalentTypes}
            border={false}
            isEmpty={error && isFieldEmpty(talent)}
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
            customTime={jobData?.post_meta_details?.format_start_time}
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
            customTime={jobData?.post_meta_details?.format_end_time}
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
            disable={
              // location?.stateList?.length == 0 ? true :
              country ? false : true
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
              // location?.stateList?.length == 0 ||
              // location?.cityList?.length == 0
              //   ? true
              //   :
              country && state ? false : true
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
            placeholder="Address Line"
            onChangeText={(val) => setAddress({ ...address, addressLine: val })}
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
            placeholder="Postal Code"
            onChangeText={(val) => setAddress({ ...address, postalCode: val })}
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
            placeholder="Select Client Provides *"
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
            // callingCode={clientCallingCode}
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
            // callingCode={callingCode}
            // setCallingCode={setCallingCode}
            span="This contact information will not go public. It will be viewed by the talent who is booked."
          />
          <InputBox
            type="multiselect"
            placeholder="Type of works *"
            options={options?.postJobOptions?.type_of_work?.field_meta?.choices}
            setOption={setWorkType}
            value={workType}
            fontIcon={"electron-framework"}
            isEmpty={error && isFieldEmpty(workType)}
          />
          <InputBox
            type="multiselect"
            placeholder="Talent Arrival Requirement"
            options={
              options?.postJobOptions?.talent_requirements?.field_meta?.choices
            }
            setOption={setTalentArrival}
            value={talentArrival}
            icon={Images?.userType}
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
          {talent == "Model" ||
          talent == "Kid" ||
          talent == "model" ||
          talent == "kid" ||
          talent == "child" ? (
            <>
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Details"
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>
              <DropDownList
                placeholder={"Select Gender"}
                icon={Images?.genderType}
                value={gender}
                setValue={setGender}
                options={
                  talent == "kid" || talent == "Kid" || talent == "child"
                    ? kidGenderTypes
                    : genderTypes
                }
                border={false}
              />

              <InputBox
                type="multiselect"
                placeholder="Select Age"
                options={
                  talent == "kid" || talent == "Kid" || talent == "child"
                    ? kidAges
                    : ages
                }
                setOption={setAge}
                value={age}
                icon={Images?.calanderIcon}
                isEmpty={error && isFieldEmpty(age)}
              />
              {/* <DropDownList
                placeholder="Select Age"
                icon={Images?.calanderIcon}
                value={age}
                setValue={setAge}
                options={
                  talent == "kid" || talent == "Kid" || talent == "child"
                    ? kidAges
                    : ages
                }
              /> */}
              <DropDownList
                placeholder={"Height (Inch) *"}
                fontIcon={"human-male-height"}
                value={height}
                setValue={setHeight}
                options={options?.otherOptions?.height?.field_meta?.choices}
                border={false}
                isEmpty={error && isFieldEmpty(height)}
              />
              <DropDownList
                placeholder={"Weight (Pound) *"}
                fontIcon={"weight-pound"}
                value={weight}
                setValue={setWeight}
                options={options?.otherOptions?.weight?.field_meta?.choices}
                border={false}
                isEmpty={error && isFieldEmpty(weight)}
              />
              <InputBox
                type="multiselect"
                placeholder={"Ethnicity *"}
                options={options?.otherOptions?.ethnicity?.field_meta?.choices}
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
                  options?.otherOptions?.hair_colour?.field_meta?.choices
                }
                border={false}
                isEmpty={error && isFieldEmpty(hairColor)}
              />
              <DropDownList
                placeholder={"Influencer"}
                fontIcon={"access-point-network"}
                value={influencer}
                setValue={setInfluencer}
                options={followers}
                border={false}
              />
            </>
          ) : null}
          {(talent == "model" && gender) ||
          (talent == "Model" && gender) ||
          (talent == "Kid" && gender) ||
          (talent == "kid" && gender) ||
          (talent == "child" && gender) ? (
            <>
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text={
                    (talent == "Kid" && age <= 2) ||
                    (talent == "child" && age <= 2) ||
                    (talent == "Child" && age <= 2)
                      ? "Infant Model Measurement"
                      : (talent == "Kid" && age > 2 && age <= 5) ||
                        (talent == "Child" && age > 2 && age <= 5) ||
                        (talent == "child" && age > 2 && age <= 5)
                      ? "Toddler Model Measurement"
                      : (talent == "Kid" && age > 5 && age <= 13) ||
                        (talent == "Child" && age > 5 && age <= 13) ||
                        (talent == "child" && age > 5 && age <= 13)
                      ? "Children Model Measurement"
                      : (talent == "Kid" && gender == "Male") ||
                        (talent == "Child" && gender == "Male") ||
                        (talent == "child" && gender == "Male") ||
                        gender == "male"
                      ? "Child Male Measurement"
                      : gender == "Female" || gender == "female"
                      ? "Child Female Measurement"
                      : talent == "Model"
                      ? gender == "Male" || gender == "male"
                        ? "Male Model Measurement"
                        : gender == "Female" || gender == "female"
                        ? "Female Model Measurement"
                        : "Model Measurement For Non Binary"
                      : "Model Measurement"
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
                      placeholder={"Shirt Size"} //multiple
                      fontIcon={"tshirt-crew"}
                      value={shirtSizeC}
                      setOption={setShirtSizeC}
                      options={
                        options?.childOptions?.toddler_shirt_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />
                    <InputBox
                      type="multiselect"
                      placeholder={"Pant Size"} //multiple
                      icon={Images?.pantIcon}
                      value={pantSizeWC}
                      setOption={setPantSizeWC}
                      options={
                        options?.childOptions?.toddler_pant_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />
                    <InputBox
                      type="multiselect"
                      placeholder={"Shoe Size"} //multiple
                      icon={Images?.shoeIcon}
                      value={shoeSizeC}
                      setOption={setShoeSizeC}
                      options={
                        options?.childOptions?.toddler_shoe_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />
                  </>
                ) : (
                  <>
                    <InputBox
                      type="multiselect"
                      placeholder={"Shirt Size"} //multiple
                      fontIcon={"tshirt-crew"}
                      value={shirtSizeC}
                      setOption={setShirtSizeC}
                      options={
                        options?.childOptions?.toddler_shirt_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />

                    <InputBox
                      type="multiselect"
                      placeholder={"Pant Size"} //multiple
                      icon={Images?.pantIcon}
                      value={pantSizeWC}
                      setOption={setPantSizeWC}
                      options={
                        options?.childOptions?.toddler_pant_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />
                    <InputBox
                      type="multiselect"
                      placeholder={"Shoe Size"} //multiple
                      icon={Images?.shoeIcon}
                      value={shoeSizeC}
                      setOption={setShoeSizeC}
                      options={
                        options?.childOptions?.toddler_shoe_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />
                    <InputBox
                      type="multiselect"
                      placeholder={"Dress Size"} //multiple
                      icon={Images?.dressIcon}
                      value={dressSizeC}
                      setOption={setDressSizeC}
                      options={
                        options?.childOptions?.toddler_dress_size?.field_meta
                          ?.choices
                      }
                      border={false}
                    />
                  </>
                )
              ) : gender == "Male" || gender == "male" ? (
                <>
                  <InputBox
                    type="multiselect"
                    placeholder={"Shirt Size"} //multiple
                    fontIcon={"tshirt-crew"}
                    value={shirtSize}
                    setOption={setShirtSize}
                    options={
                      options?.maleOptions?.shirt_size?.field_meta?.choices
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
                      options?.maleOptions?.pant_size_waist?.field_meta?.choices
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
                    placeholder={"Shoe Size"} //multiple
                    icon={Images?.shoeIcon}
                    value={shoeSize}
                    setOption={setShoeSize}
                    options={
                      options?.maleOptions?.shoe_size?.field_meta?.choices
                    }
                    border={false}
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
                      options?.maleOptions?.dress_shirt_sleeve?.field_meta
                        ?.choices
                    }
                    border={false}
                  />
                  <DropDownList
                    placeholder={"Neck Size"}
                    icon={Images?.shirtNeck}
                    value={neckSize}
                    setValue={setNeckSize}
                    options={
                      options?.maleOptions?.neck_size?.field_meta?.choices
                    }
                    border={false}
                  />

                  <DropDownList
                    placeholder={"Chest Size"}
                    icon={Images?.maleChest}
                    value={chestSize}
                    setValue={setChestSize}
                    options={
                      options?.maleOptions?.chest_size?.field_meta?.choices
                    }
                    border={false}
                  />

                  <DropDownList
                    placeholder={"Jacket"}
                    icon={Images?.jacketIcon}
                    value={jacket}
                    setValue={setJacket}
                    options={options?.maleOptions?.jacket?.field_meta?.choices}
                    border={false}
                  />
                </>
              ) : gender == "Female" || gender == "female" ? (
                <>
                  <InputBox
                    type="multiselect"
                    placeholder={"Shirt Size"} //multiple
                    fontIcon={"tshirt-crew"}
                    value={shirtSizeF}
                    setOption={setShirtSizeF}
                    options={
                      options?.femaleOptions?.shirt_size_f?.field_meta?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="multiselect"
                    placeholder={"Pant Size"} //multiple
                    icon={Images?.pantIcon}
                    value={pantSize}
                    setOption={setPantSize}
                    options={
                      options?.femaleOptions?.pant_size_f?.field_meta?.choices
                    }
                    border={false}
                  />
                  <DropDownList
                    placeholder={"Bra Cup"}
                    icon={Images?.braIcon}
                    value={braCup}
                    setValue={setBraCup}
                    options={
                      options?.femaleOptions?.bra_cup?.field_meta?.choices
                    }
                    border={false}
                  />

                  <DropDownList
                    placeholder={"Bra Size"}
                    icon={Images?.braIcon}
                    value={braSize}
                    setValue={setBraSize}
                    options={
                      options?.femaleOptions?.bra_size?.field_meta?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="multiselect"
                    placeholder={"Dress Size"} //multiple
                    icon={Images?.dressIcon}
                    value={dressSize}
                    setOption={setDressSize}
                    options={
                      options?.femaleOptions?.dress_size_f?.field_meta?.choices
                    }
                    border={false}
                  />

                  <InputBox
                    type="multiselect"
                    placeholder={"Shoe Size"} //multiple
                    icon={Images?.shoeIcon}
                    value={shoeSize}
                    setOption={setShoeSize}
                    options={
                      options?.femaleOptions?.shoe_size_f?.field_meta?.choices
                    }
                    border={false}
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
                      options?.maleOptions?.shirt_size?.field_meta?.choices
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
                      options?.maleOptions?.pant_size_waist?.field_meta?.choices
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
                      options?.maleOptions?.shoe_size?.field_meta?.choices
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
                      options?.maleOptions?.dress_shirt_sleeve?.field_meta
                        ?.choices
                    }
                    border={false}
                  />

                  <DropDownList
                    placeholder={"Jacket (M)"}
                    icon={Images?.jacketIcon}
                    value={jacket}
                    setValue={setJacket}
                    options={options?.maleOptions?.jacket?.field_meta?.choices}
                    border={false}
                  />
                  <InputBox
                    type="multiselect"
                    placeholder={"Shirt Size (F)"} //multiple
                    fontIcon={"tshirt-crew"}
                    value={shirtSizeF}
                    setOption={setShirtSizeF}
                    options={
                      options?.femaleOptions?.shirt_size_f?.field_meta?.choices
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
                      options?.femaleOptions?.pant_size_f?.field_meta?.choices
                    }
                    border={false}
                  />
                  <DropDownList
                    placeholder={"Bra Cup (F)"}
                    icon={Images?.braIcon}
                    value={braCup}
                    setValue={setBraCup}
                    options={
                      options?.femaleOptions?.bra_cup?.field_meta?.choices
                    }
                    border={false}
                  />

                  <DropDownList
                    placeholder={"Bra Size (F)"}
                    icon={Images?.braIcon}
                    value={braSize}
                    setValue={setBraSize}
                    options={
                      options?.femaleOptions?.bra_size?.field_meta?.choices
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
                      options?.femaleOptions?.dress_size_f?.field_meta?.choices
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
                      options?.femaleOptions?.shoe_size_f?.field_meta?.choices
                    }
                    border={false}
                  />
                </>
              )}
            </>
          ) : null}
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
            placeholder={"Usage Duration"}
            fontIcon={"hours-24"}
            value={duration}
            setValue={setDuration}
            options={
              options?.postJobOptions?.duration_usage?.field_meta?.choices
            }
            border={false}
          />
          <DropDownList
            placeholder={"Usage Location"}
            icon={Images?.locationIcon}
            value={locationUsage}
            setValue={setLocationUsage}
            options={locationsUsage}
            border={false}
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
          {/* <View
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
          ) : null} */}
          {/* <View
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
            text="Update all the latest changes made by you, by just clicking on “Save & Update button."
            size={Sizes?.s}
            fontWeight="400"
            style={{ width: "100%", padding: 8 }}
          />
        </View>
        <Button
          title="Update"
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
