import React, { useEffect, useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Checkbox,
  ChooseOption,
  DropDownList,
  Header,
  InputBox,
  TextComponent,
} from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { List } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { getOptionsData } from "../../Redux/Services/AuthServices";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { getCountryList } from "../../Redux/Services/OtherServices";

import {
  ages,
  ethnicities,
  genderTypes,
  hairColors,
  heightInches,
  followers,
  hourlyRate,
  skills,
  englishLevels,
  languages,
  shirtSizes,
  kidAges,
  heightFilterInches,
  weightInches,
  kidGenderTypes,
  payTypes,
  projectLevels,
  jobDurations,
  projectLocations,
  categories,
} from "../../Global";
import { CheckBox } from "react-native-elements";
import { appliedFilter } from "../../Redux/Actions/OtherActions";

export const Filter = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);
  let data = other?.filterData;
  const talentTypes = [
    { label: "Model", value: "Model" },
    { label: "Model Kid", value: "Model Kid" },
    { label: "Actor", value: "Actor" },
    { label: "Actor Kid", value: "Actor Kid" },
    { label: "Photographer", value: "Photographer" },
  ];

  const [expanded, setExpanded] = useState(false);
  const [country, setCountry] = useState(data?.country ? data?.country : "");
  const [state, setState] = useState(data?.state ? data?.state : "");
  const [city, setCity] = useState(data?.city ? data?.city : "");
  const [selectedRow, setSelectedRow] = useState({});
  const [projectCost, setProjectCost] = useState({
    miniPrice: 0,
    maxPrice: 5000,
  });
  const [location, setLocation] = useState({
    countryID: "",
    countryList: "",
    stateList: "",
    cityList: "",
  });
  const [options, setOptions] = useState({
    femaleOptions: auth?.allOptionData?.femaleOptions,
    maleOptions: auth?.allOptionData?.maleOptions,
    childOptions: auth?.allOptionData?.childOptions,
    otherOptions: auth?.allOptionData?.otherOptions,
    socialMediaOptions: auth?.allOptionData?.socialMediaOptions,
    filterOption: auth?.allOptionData?.filterOption,
  });

  const [gender, setGender] = useState(
    data?.gender
      ? data?.gender == "Other" || data?.gender == "other"
        ? "Non Binary"
        : data?.gender
      : ""
  );
  const [uncheck, setUncheck] = useState(true);

  const [talent, setTalent] = useState(
    data?.talent_type == "model" && data?.user_type == "freelancer"
      ? "Model"
      : data?.talent_type == "child" && data?.user_type == "freelancer"
      ? "Model Kid"
      : data?.talent_type == "child" && data?.user_type == "actor"
      ? "Actor Kid"
      : data?.talent_type == "actor"
      ? "Actor"
      : data?.talent_type == "photographer"
      ? "Photographer"
      : ""
  );

  const [category, setCategory] = useState(
    data?.talent_category ? data?.talent_category : ""
  );
  const [englishLevel, setEnglishLevel] = useState({
    title: "Language Level",
    option: englishLevels,
    value: data?.english_level ? data?.english_level : [],
    unCheck: false,
  });
  const [influencer, setInfluencer] = useState({
    title: "Influencer",
    option: followers,
    value: data?.influencer ? data?.influencer : [],
    unCheck: false,
  });
  const [language, setLanguage] = useState({
    title: "Languages",
    option: [],
    value: data?.language ? data?.language : [],
    unCheck: false,
  });
  const [height, setHeight] = useState({
    title: "Height",
    // option: heightFilterInches,
    option: heightInches,
    value: data?.height ? data?.height : [],
    unCheck: false,
  });
  const [weight, setWeight] = useState({
    title: "Weight",
    option: weightInches,
    value: data?.weight ? data?.weight : [],
    unCheck: false,
  });

  const [age, setAge] = useState(data?.age ? data?.age : "");
  const [ethnicity, setEthnicity] = useState({
    title: "Ethnicity",
    option: options?.otherOptions?.ethnicity?.field_meta?.choices,
    value: data?.ethnicity ? data?.ethnicity : [],
    unCheck: false,
  });
  const [hourly_rate, setHourly_rate] = useState({
    title: "Hourly Rate",
    option: hourlyRate,
    value: data?.hourly_rate ? data?.hourly_rate : [],
    unCheck: false,
  });
  const [hairColor, setHairColor] = useState({
    title: "Hair Color",
    option: hairColors,
    value: data?.hair_color ? data?.hair_color : [],
    unCheck: false,
  });
  const [pantSize, setPantSize] = useState({
    title: "Pant Size",
    option: options?.femaleOptions?.pant_size_f?.field_meta?.choices,
    value: data?.pant_size_female ? data?.pant_size_female : [],
    unCheck: false,
  });
  const [pantSizeW, setPantSizeW] = useState({
    title: "Pant Size (Waist)",
    option: options?.maleOptions?.pant_size_waist?.field_meta?.choices,
    value: data?.pant_size_waist ? data?.pant_size_waist : [],
    unCheck: false,
  });
  const [pantSizeL, setPantSizeL] = useState({
    title: "Pant Size (Length)",
    option: options?.maleOptions?.pant_size_length?.field_meta?.choices,
    value: data?.pant_size_length ? data?.pant_size_length : [],
    unCheck: false,
  });
  const [shirtSize, setShirtSize] = useState({
    title: "Shirt Size (M)",
    option: options?.maleOptions?.shirt_size?.field_meta?.choices,
    value:
      talent == "model" || data?.talent_type == "Model"
        ? data?.shirt_size
          ? data?.shirt_size
          : []
        : [],
    unCheck: false,
  });
  const [shirtSizeC, setShirtSizeC] = useState({
    title: "Shirt Size",
    option: options?.childOptions?.toddler_shirt_size?.field_meta?.choices,
    value:
      talent == "Model Kid" || data?.talent_type == "Model Kid"
        ? data?.shirt_size
          ? data?.shirt_size
          : []
        : [],
    unCheck: false,
  });
  const [pantSizeWC, setPantSizeWC] = useState({
    title: "Pant Size",
    option: options?.childOptions?.toddler_pant_size?.field_meta?.choices,
    value:
      talent == "Model Kid" || data?.talent_type == "Model Kid"
        ? data?.pant_size
          ? data?.pant_size
          : []
        : [],
    unCheck: false,
  });
  const [dressSizeC, setDressSizeC] = useState({
    title: "Dress Shirt Size",
    option: options?.childOptions?.toddler_dress_size?.field_meta?.choices,
    value:
      talent == "Model Kid" || data?.talent_type == "Model Kid"
        ? data?.dress_size
          ? data?.dress_size
          : []
        : [],
    unCheck: false,
  });
  const [shoeSizeC, setShoeSizeC] = useState({
    title: "Shoe Size",
    option: options?.childOptions?.toddler_shoe_size?.field_meta?.choices,
    value:
      talent == "Model Kid" || data?.talent_type == "Model Kid"
        ? data?.shoe_size
          ? data?.shoe_size
          : []
        : [],
    unCheck: false,
  });

  const [shirtSizeF, setShirtSizeF] = useState({
    title: "Shirt Size (F)",
    option: options?.femaleOptions?.shirt_size_f?.field_meta?.choices,
    value: data?.shirt_size_female ? data?.shirt_size_female : [],
    unCheck: false,
  });
  const [dressShirt, setDressShirt] = useState({
    title: "Dress Shirt Size",
    option: options?.maleOptions?.dress_shirt_size?.field_meta?.choices,
    value:
      talent == "model" || data?.talent_type == "Model"
        ? data?.dress_shirt_size
          ? data?.dress_shirt_size
          : []
        : [],
    unCheck: false,
  });
  const [shirtSleeve, setShirtSleeve] = useState({
    title: "Dress Shirt Sleeve",
    option: options?.maleOptions?.dress_shirt_sleeve?.field_meta?.choices,
    value: data?.dress_shirt_sleeve ? data?.dress_shirt_sleeve : [],
    unCheck: false,
  });
  const [neckSize, setNeckSize] = useState({
    title: "Neck Size",
    option: options?.maleOptions?.neck_size?.field_meta?.choices,
    value: data?.neck_size ? data?.neck_size : [],
    unCheck: false,
  });
  const [chestSize, setChestSize] = useState({
    title: "Chest Size",
    option: options?.maleOptions?.chest_size?.field_meta?.choices,
    value: data?.chest_size ? data?.chest_size : [],
    unCheck: false,
  });
  const [jacket, setJacket] = useState({
    title: "Jacket",
    option: options?.maleOptions?.jacket?.field_meta?.choices,
    value: data?.jacket ? data?.jacket : [],
    unCheck: false,
  });
  const [braCup, setBraCup] = useState({
    title: "Bra Cup",
    option: options?.femaleOptions?.bra_cup?.field_meta?.choices,
    value: data?.bra_cup ? data?.bra_cup : [],
    unCheck: false,
  });
  const [braSize, setBraSize] = useState({
    title: "Bra Size",
    option: options?.femaleOptions?.bra_size?.field_meta?.choices,
    value: data?.bra_size ? data?.bra_size : [],
    unCheck: false,
  });
  const [dressSize, setDressSize] = useState({
    title: "Dress Size",
    option: options?.femaleOptions?.dress_size_f?.field_meta?.choices,
    value:
      talent == "model" || data?.talent_type == "Model"
        ? data?.dress_size
          ? data?.dress_size
          : []
        : [],
    unCheck: false,
  });
  const [shoeSize, setShoeSize] = useState({
    title: "Shoe Size",
    option: options?.femaleOptions?.shoe_size_f?.field_meta?.choices,
    value:
      talent == "model" || data?.talent_type == "Model"
        ? data?.shoe_size
          ? data?.shoe_size
          : []
        : [],
    unCheck: false,
  });
  const [mySkill, setMySkill] = useState({
    title: "Skills",
    option: options?.otherOptions?.add_new_skill?.field_meta?.choices,
    value: data?.skill ? data?.skill : [],
    unCheck: false,
  });
  const [experienceLevel, setExperienceLevel] = useState({
    title: "Experience Level",
    option: options?.otherOptions?.experience_level?.field_meta?.choices,
    value: data?.experience_level ? data?.experience_level : [],
    unCheck: false,
  });

  const [projectLocation, setProjectLocation] = useState({
    title: "Project Location Type",
    option: projectLocations,
    value: data?.job_option ? data?.job_option : [],
    unCheck: false,
  });
  const [projectType, setProjectType] = useState(
    data?.project_type ? data?.project_type : ""
  );
  const [projectLength, setProjectLength] = useState({
    title: "Project Length",
    option: jobDurations,
    value: data?.project_duration ? data?.project_duration : [],
    unCheck: false,
  });
  const [miniPrice, setMiniPrice] = useState(
    data?.min_price ? data?.min_price : 0
  );
  const [maxPrice, setMaxPrice] = useState(
    data?.max_price ? data?.max_price : 10000
  );

  useEffect(() => {
    getAllOptionsData();
  }, []);

  useEffect(() => {
    getAllCountryName("country");
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
    }
  };

  const getAllOptionsData = async () => {
    let res = await dispatch(getOptionsData());
    setOptions({
      ...options,
      femaleOptions: res?.results?.group_62749b609360c,
      maleOptions: res?.results?.group_62749a513bf1a,
      childOptions: res?.results?.group_63181d08b6357,
      otherOptions: res?.results?.group_627497cf304a6,
      socialMediaOptions: res?.results?.group_62849b4520284,
      filterOption: res?.results?.group_62e2bb6565f61,
    });
    let femaleOptions = res?.results?.group_62749b609360c;
    let maleOptions = res?.results?.group_62749a513bf1a;
    let childOptions = res?.results?.group_63181d08b6357;
    let otherOptions = res?.results?.group_627497cf304a6;
    let socialMediaOptions = res?.results?.group_62849b4520284;
    let languages = res?.results?.languages;
    let englishLevel = res?.results?.english_level;
    setEthnicity({
      ...ethnicity,
      title: "Ethnicity",
      option: otherOptions?.ethnicity?.field_meta?.choices,
      value: data?.ethnicity ? data?.ethnicity : [],
      unCheck: false,
    });
    setEnglishLevel({
      ...englishLevel,
      title: "Language Level",
      option: englishLevel,
      value: data?.english_level ? data?.english_level : [],
      unCheck: false,
    });
    setExperienceLevel({
      ...experienceLevel,
      title: "Experience Level",
      option: otherOptions?.experience_level?.field_meta?.choices,
      value: data?.experience_level ? data?.experience_level : [],
      unCheck: false,
    });
    setLanguage({
      ...language,
      title: "Languages",
      option: languages,
      value: data?.language ? data?.language : [],
      unCheck: false,
    });
    setPantSize({
      ...pantSize,
      title: "Pant Size",
      option: femaleOptions?.pant_size_f?.field_meta?.choices,
      value: data?.pant_size_female ? data?.pant_size_female : [],
      unCheck: false,
    });
    setMySkill({
      ...mySkill,
      title: "Skills",
      option: otherOptions?.add_new_skill?.field_meta?.choices,
      value: data?.skill ? data?.skill : [],
      unCheck: false,
    });
  };
  const handleCheckBox = (ele, value, state, setState) => {
    let arr = [];
    if (value?.includes(ele?.value)) {
      arr = value?.filter((item) => item != ele?.value);
      setState({ ...state, value: arr });
    } else if (value?.includes(ele?.name)) {
      arr = value?.filter((item) => item != ele?.name);
      setState({ ...state, value: arr });
    } else {
      if (ele?.name) {
        value?.push(ele?.name);
      } else {
        value?.push(ele?.value);
      }
      setState({ ...state, value: value });
    }
  };
  const normalizeGender = (gender) => {
    if (!gender) return "";
    const g = gender.toLowerCase();
    if (g === "male") return "male";
    if (g === "female") return "female";
    if (["non binary", "other"].includes(g)) return "other";
    return "";
  };

  const getValue = (field, fallbackField) => {
    if (field?.value?.length) return field.value;
    if (fallbackField?.value?.length) return fallbackField.value;
    return "";
  };

  const handleFiltring = async () => {
    const isJobs = route?.params?.prevRoute === routeName?.JOBS;
    const talentType =
      talent == "Model"
        ? "model"
        : talent == "Model Kid"
        ? "child"
        : talent == "Actor Kid"
        ? "child"
        : talent == "Actor"
        ? "actor"
        : talent == "Photographer" || talent == "photographer"
        ? "photographer"
        : "";
    const user_type =
      talent == "Model" || talent == "Model Kid"
        ? "freelancer"
        : talent === "Actor" || talent === "Actor Kid"
        ? "actor"
        : talent === "Photographer"
        ? "photographer"
        : "employer";

    let body = {
      keyword: "",
      user_type: user_type || "",
      talent_type: talentType,
      talent_category: category || "",
      country: country || "",
      state: state || "",
      city: city || "",
      gender: normalizeGender(gender),
      age: age || "",
      english_level: getValue(englishLevel),
      experience_level: getValue(experienceLevel),
      skill: getValue(mySkill),

      language: getValue(language),
      shirt_size: getValue(shirtSize, shirtSizeC),
      pant_size: getValue(pantSizeWC),
      pant_size_waist: getValue(pantSizeW),
      pant_size_length: getValue(pantSizeL),
      shoe_size:
        normalizeGender(gender) === "male" ? getValue(shoeSize, shoeSizeC) : "",
      dress_size: getValue(dressSize, dressSizeC),
      neck_size: getValue(neckSize),
      chest_size: getValue(chestSize),
      dress_shirt_size: getValue(dressShirt),
      jacket: getValue(jacket),
      dress_shirt_sleeve: getValue(shirtSleeve),
      shirt_size_female: getValue(shirtSizeF),
      pant_size_female: getValue(pantSize),
      shoe_size_female:
        normalizeGender(gender) === "female" ? getValue(shoeSize) : "",
      bra_cup: getValue(braCup),
      bra_size: getValue(braSize),
      dress_size_female: getValue(dressSize),
    };
    if (isJobs) {
      body = {
        ...body,
        job_option: getValue(projectLocation),
        project_duration: getValue(projectLength),
        project_type: projectType,
        min_price: miniPrice,
        max_price: maxPrice,
      };
    } else {
      body = {
        ...body,
        ethnicity: getValue(ethnicity),
        weight: getValue(weight),
        hair_color: getValue(hairColor),
        height: getValue(height),
        influencer: getValue(influencer),
        hourly_rate: getValue(hourly_rate),
      };
    }

    // dispatch and navigate
    dispatch(appliedFilter(body));
    navigation?.navigate(isJobs ? routeName?.JOBS : routeName?.SEARCH, {
      routeName: routeName?.FILTER,
      filterBody: body,
    });

    console.log("body for filter------", body);
  };

  const handleResetFilter = () => {
    dispatch(appliedFilter({}));
    setUncheck(false);

    // Simple string/state resets
    setTalent("");
    setCategory("");
    setAge("");
    setGender("");
    setCountry("");
    setState("");
    setCity("");
    setProjectType("");
    setMiniPrice(0);
    setMaxPrice(10000);

    // Array-based states to reset
    const arrayStates = [
      englishLevel,
      influencer,
      language,
      height,
      weight,
      ethnicity,
      hourly_rate,
      hairColor,
      pantSize,
      pantSizeW,
      pantSizeL,
      pantSizeWC,
      shirtSize,
      shirtSizeF,
      shirtSizeC,
      dressShirt,
      dressSizeC,
      dressSize,
      shirtSleeve,
      jacket,
      braCup,
      braSize,
      shoeSize,
      shoeSizeC,
      mySkill,
      projectLength,
      projectLocation,
    ];

    const setters = [
      setEnglishLevel,
      setExperienceLevel,
      setInfluencer,
      setLanguage,
      setHeight,
      setWeight,
      setEthnicity,
      setHourly_rate,
      setHairColor,
      setPantSize,
      setPantSizeW,
      setPantSizeL,
      setPantSizeWC,
      setShirtSize,
      setShirtSizeF,
      setShirtSizeC,
      setDressShirt,
      setDressSizeC,
      setDressSize,
      setShirtSleeve,
      setJacket,
      setBraCup,
      setBraSize,
      setShoeSize,
      setShoeSizeC,
      setMySkill,
      setProjectLength,
      setProjectLocation,
    ];

    setters.forEach((setter, index) => {
      setter({ ...arrayStates[index], value: [] });
    });
  };
  const handleRemoveFilter = (ele, value, state, setState) => {
    let arr = [];
    if (value?.includes(ele)) {
      arr = value?.filter((item) => item != ele);
      setState({ ...state, value: arr });
    } else {
      value?.push(ele?.value);
      setState({ ...state, value: value });
    }
  };

  const hasValue = (field) => field?.value?.length > 0;
  const hasRawValue = (val) => val !== undefined && val !== null && val !== "";

  const activeFilters = [
    hasRawValue(talent),
    hasRawValue(gender),
    hasRawValue(country),
    hasRawValue(state),
    hasRawValue(city),
    hasValue(age),
    hasValue(ethnicity),
    hasValue(height),
    hasValue(hairColor),
    hasValue(weight),
    hasValue(influencer),
    hasValue(hourly_rate),
    hasValue(englishLevel),
    hasValue(language),
    hasValue(shirtSize),
    hasValue(shirtSizeC),
    hasValue(pantSizeW),
    hasValue(pantSizeL),
    hasValue(shoeSize),
    hasValue(dressShirt),
    hasValue(shirtSleeve),
    hasValue(jacket),
    hasValue(shirtSizeF),
    hasValue(pantSize),
    hasValue(braCup),
    hasValue(braSize),
    hasValue(projectLength),
    hasValue(projectLocation),
    hasRawValue(projectType),
    miniPrice !== 0,
    maxPrice !== 10000,
  ];

  const hasFilters = activeFilters.some(Boolean);

  const FilterChips = ({ value, setValue, field, isRange, resetRange }) => {
    if (!value || (Array.isArray(value) && !value.length)) return null;

    if (isRange) {
      const [min, max] = value;
      return <FilterChip label={`$${min} - $${max}`} onClear={resetRange} />;
    }
    if (Array.isArray(value)) {
      return value.map((item, idx) => (
        <FilterChip
          key={`${item}-${idx}`}
          label={item}
          onClear={() => handleRemoveFilter(item, value, field, setValue)}
        />
      ));
    }
    return <FilterChip label={value} onClear={() => setValue("")} />;
  };

  // 🔹 Base chip
  const FilterChip = ({ label, onClear }) => (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: Colors?.themeColor,
        borderRadius: 15,
        margin: 5,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <TextComponent text={label} size={Sizes?.xs} color={Colors?.white} />
      <TouchableOpacity onPress={onClear}>
        <FontAwesome
          name="times-circle"
          size={15}
          color={Colors?.white}
          style={{ marginLeft: 5 }}
        />
      </TouchableOpacity>
    </View>
  );

  const AccordionWithCheckboxes = ({ data, setData }) => {
    return (
      <List.Accordion
        isExpanded={expanded}
        onPress={() => setExpanded(!expanded)}
        title={data?.title}
        titleStyle={{ color: Colors?.black }}
        style={{ backgroundColor: Colors?.white, padding: 0 }}
        descriptionNumberOfLines={4}
      >
        {data?.option?.map((element, index) => (
          <View key={index} style={{ marginLeft: 20, width: "100%" }}>
            <Checkbox
              text={element?.value}
              fontWeight="400"
              multiple={true}
              isChecked={data?.value?.includes(element?.value)}
              onPress={() =>
                handleCheckBox(element, data?.value, data, setData)
              }
            />
          </View>
        ))}
      </List.Accordion>
    );
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header
        text={
          route?.params?.prevRoute == routeName?.JOBS
            ? "Filter Jobs By..."
            : "Filter Models By..."
        }
        button={true}
        buttonText="Apply"
        navigation={navigation}
        onRightClick={() => handleFiltring()}
      />
      {hasFilters ? (
        <View
          style={{
            ...styling?.emailView,
          }}
        >
          <TextComponent
            text={
              route?.params?.prevRoute == routeName?.JOBS
                ? "Filter Jobs By..."
                : `${
                    talent == "Model Kid"
                      ? "Filter Model Kids By..."
                      : route?.params?.prevRoute == routeName?.SEARCH
                      ? "Filter Models By..."
                      : talent == "Actor Kid"
                      ? "Filter Actor Kids By..."
                      : talent == "Actor"
                      ? "Filter Actors By..."
                      : talent == "Photographer"
                      ? "Filter Photographers By..."
                      : "Filter Models By..."
                  }`
            }
            size={Sizes?.l}
            fontWeight="400"
            style={{ padding: 8 }}
          />
          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              // marginVertical: 5,
            }}
          >
            <FilterChips value={talent} setValue={setTalent} />
            <FilterChips value={category} setValue={setCategory} />
            <FilterChips value={country} setValue={setCountry} />
            <FilterChips value={state} setValue={setState} />
            <FilterChips value={city} setValue={setCity} />
            <FilterChips value={gender} setValue={setGender} />
            <FilterChips value={age} setValue={setAge} />

            <FilterChips
              value={englishLevel?.value}
              field={englishLevel}
              setValue={setEnglishLevel}
            />
            <FilterChips
              value={experienceLevel?.value}
              field={experienceLevel}
              setValue={setExperienceLevel}
            />
            <FilterChips
              value={language?.value}
              field={language}
              setValue={setLanguage}
            />
            <FilterChips
              value={mySkill?.value}
              field={mySkill}
              setValue={setMySkill}
            />

            {route?.params?.prevRoute == routeName?.JOBS ? (
              <>
                <FilterChips
                  value={projectLength?.value}
                  field={projectLength}
                  setValue={setProjectLength}
                />
                <FilterChips
                  value={projectLocation?.value}
                  field={projectLocation}
                  setValue={setProjectLocation}
                />
                <FilterChips value={projectType} setValue={setProjectType} />

                <FilterChips
                  value={[miniPrice, maxPrice]}
                  isRange
                  resetRange={() => {
                    setMiniPrice(0);
                    setMaxPrice(10000);
                  }}
                />
              </>
            ) : (
              <>
                <FilterChips
                  value={ethnicity?.value}
                  field={ethnicity}
                  setValue={setEthnicity}
                />
                {talent != "Photographer" && (
                  <>
                    <FilterChips
                      value={height?.value}
                      field={height}
                      setValue={setHeight}
                    />
                    <FilterChips
                      value={hairColor?.value}
                      field={hairColor}
                      setValue={setHairColor}
                    />
                    <FilterChips
                      value={weight?.value}
                      field={weight}
                      setValue={setWeight}
                    />
                    <FilterChips
                      value={influencer?.value}
                      field={influencer}
                      setValue={setInfluencer}
                    />
                  </>
                )}
                <FilterChips
                  value={hourly_rate?.value}
                  field={hourly_rate}
                  setValue={setHourly_rate}
                />
              </>
            )}
            {talent != "Photographer" && (
              <>
                <FilterChips
                  value={shirtSize?.value}
                  field={shirtSize}
                  setValue={setShirtSize}
                />
                <FilterChips
                  value={shirtSizeF?.value}
                  field={shirtSizeF}
                  setValue={setShirtSizeF}
                />
                <FilterChips
                  value={shirtSizeC?.value}
                  field={shirtSizeC}
                  setValue={setShirtSizeC}
                />
                <FilterChips
                  value={pantSize?.value}
                  field={pantSize}
                  setValue={setPantSize}
                />
                <FilterChips
                  value={pantSizeWC?.value}
                  field={pantSizeWC}
                  setValue={setPantSizeWC}
                />
                <FilterChips
                  value={pantSizeW?.value}
                  field={pantSizeW}
                  setValue={setPantSizeW}
                />
                <FilterChips
                  value={pantSizeL?.value}
                  field={pantSizeL}
                  setValue={setPantSizeL}
                />
                <FilterChips
                  value={shoeSize?.value}
                  field={shoeSize}
                  setValue={setShoeSize}
                />
                <FilterChips
                  value={shoeSizeC?.value}
                  field={shoeSizeC}
                  setValue={setShoeSizeC}
                />

                <FilterChips
                  value={dressSizeC?.value}
                  field={dressSizeC}
                  setValue={setDressSizeC}
                />
                <FilterChips
                  value={dressShirt?.value}
                  field={dressShirt}
                  setValue={setDressShirt}
                />
                <FilterChips
                  value={shirtSleeve?.value}
                  field={shirtSleeve}
                  setValue={setShirtSleeve}
                />
                <FilterChips
                  value={neckSize?.value}
                  field={neckSize}
                  setValue={setNeckSize}
                />
                <FilterChips
                  value={chestSize?.value}
                  field={chestSize}
                  setValue={setChestSize}
                />
                <FilterChips
                  value={jacket?.value}
                  field={jacket}
                  setValue={setJacket}
                />

                <FilterChips
                  value={braCup?.value}
                  field={braCup}
                  setValue={setBraCup}
                />
                <FilterChips
                  value={braSize?.value}
                  field={braSize}
                  setValue={setBraSize}
                />
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={() => handleResetFilter()}
            style={{
              ...Styles?.smallButton,
              ...Styles?.row,
              backgroundColor: Colors?.pink,
              alignSelf: "flex-end",
              width: "30%",
            }}
          >
            <FontAwesome name="times-circle" size={20} color={Colors?.white} />
            <TextComponent
              text={"Clear All"}
              color={Colors?.white}
              size={Sizes?.s}
              style={{ paddingHorizontal: 8 }}
            />
          </TouchableOpacity>
        </View>
      ) : null}

      <ScrollView>
        <View style={{ ...Styles?.container, paddingBottom: 100 }}>
          <List.Section style={{ backgroundColor: Colors?.white }}>
            <List.Accordion
              isExpanded={expanded}
              onPress={() => {
                setExpanded(!expanded);
              }}
              title={"Talent Type"}
              titleStyle={{ color: Colors?.black }}
              style={{ backgroundColor: Colors?.white, padding: 0 }}
              descriptionNumberOfLines={4}
            >
              <DropDownList
                options={talentTypes}
                placeholder={"Select Talent Type *"}
                value={talent}
                setValue={setTalent}
                border={false}
              />
            </List.Accordion>
            {talent == "Model" && (
              <List.Accordion
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                }}
                title={"Talent Category"}
                titleStyle={{ color: Colors?.black }}
                style={{ backgroundColor: Colors?.white, padding: 0 }}
                descriptionNumberOfLines={4}
              >
                <DropDownList
                  options={categories}
                  placeholder={"Select Talent Category *"}
                  value={category}
                  setValue={setCategory}
                  border={false}
                />
              </List.Accordion>
            )}

            <List.Accordion
              isExpanded={expanded}
              onPress={() => {
                setExpanded(!expanded);
              }}
              title={"Search By Geo Location"}
              titleStyle={{ color: Colors?.black }}
              style={{ backgroundColor: Colors?.white, padding: 0 }}
              descriptionNumberOfLines={4}
            >
              <DropDownList
                options={location?.countryList}
                placeholder={"Select Country *"}
                icon={Images?.locationIcon}
                value={country}
                setValue={setCountry}
                border={false}
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
                disable={country ? false : true}
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
                disable={country && state ? false : true}
                search={true}
                onPress={() => getAllCountryName("city")}
              />
            </List.Accordion>
            <List.Accordion
              isExpanded={expanded}
              onPress={() => {
                setExpanded(!expanded);
              }}
              title={"Gender"}
              titleStyle={{ color: Colors?.black }}
              style={{ backgroundColor: Colors?.white, padding: 0 }}
              descriptionNumberOfLines={4}
            >
              <DropDownList
                placeholder={"Select Gender"}
                value={gender}
                setValue={setGender}
                options={
                  gender == "kid" ||
                  gender == "Kid" ||
                  gender == "Model Kid" ||
                  gender == "Model Kid"
                    ? kidGenderTypes
                    : genderTypes
                }
                border={false}
              />
            </List.Accordion>
            {route?.params?.prevRoute == routeName?.JOBS ? (
              <>
                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={"Project Type"}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <DropDownList
                    options={payTypes}
                    placeholder={"Project Type"}
                    icon={Images?.dollarIcon}
                    value={projectType}
                    setValue={setProjectType}
                    border={false}
                  />
                </List.Accordion>
                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={"Project Cost"}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <View
                    style={{
                      ...Styles?.flexRow,
                      width: "90%",
                      alignSelf: "center",
                      alignContent: "center",
                      marginTop: -10,
                    }}
                  >
                    <InputBox
                      type="numeric"
                      value={miniPrice}
                      placeholder="Mini Price"
                      onChangeText={(val) => setMiniPrice(val)}
                      icon={Images?.dollarIcon}
                      keyboardType="numeric"
                      style={{ width: "40%" }}
                    />

                    <InputBox
                      type="numeric"
                      value={maxPrice}
                      placeholder="Max Price"
                      onChangeText={(val) => setMaxPrice(val)}
                      icon={Images?.dollarIcon}
                      keyboardType="numeric"
                      style={{ width: "40%" }}
                    />
                  </View>
                </List.Accordion>

                <AccordionWithCheckboxes
                  data={projectLength}
                  setData={setProjectLength}
                />
                <AccordionWithCheckboxes
                  data={projectLocation}
                  setData={setProjectLocation}
                />
              </>
            ) : (
              <>
                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={"Age"}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <DropDownList
                    placeholder={"Select Age"}
                    // icon={Images?.genderType}
                    value={age}
                    setValue={setAge}
                    options={
                      talent == "Model Kid" || talent == "Model Kid"
                        ? options?.filterOption?.child_age_req?.field_meta
                            ?.choices
                        : options?.filterOption?.age_req?.field_meta?.choices
                    }
                    border={false}
                  />
                </List.Accordion>

                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={ethnicity?.title}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <InputBox
                    type="multiselect"
                    placeholder="Select Ethnicity"
                    options={ethnicity?.option}
                    setOption={setEthnicity}
                    value={ethnicity?.value}
                    // fontIcon={"earth"}
                    filter={true}
                    state={ethnicity}
                    setState={setEthnicity}
                    onRemove={() => {
                      handleRemoveFilter(
                        item,
                        ethnicity?.value,
                        ethnicity,
                        setEthnicity
                      );
                    }}
                  />
                </List.Accordion>
                {talent != "Photographer" ? (
                  <>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={height?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Height"
                        options={
                          options?.childOptions?.toddler_pant_size?.field_meta
                            ?.choices
                        }
                        setOption={setHeight}
                        value={height?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={height}
                        setState={setHeight}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            height?.value,
                            height,
                            setHeight
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={hairColor?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Hair Color"
                        options={hairColor?.option}
                        setOption={setHairColor}
                        value={hairColor?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={hairColor}
                        setState={setHairColor}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            hairColor?.value,
                            hairColor,
                            setHairColor
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={weight?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Weight"
                        options={weight?.option}
                        setOption={setWeight}
                        value={weight?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={weight}
                        setState={setWeight}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            weight?.value,
                            weight,
                            setWeight
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={influencer?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Influencer"
                        options={influencer?.option}
                        setOption={setInfluencer}
                        value={influencer?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={influencer}
                        setState={setInfluencer}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            influencer?.value,
                            influencer,
                            setInfluencer
                          );
                        }}
                      />
                    </List.Accordion>
                  </>
                ) : null}

                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={hourly_rate?.title}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <InputBox
                    type="multiselect"
                    placeholder="Select Hourly Rate"
                    options={hourly_rate?.option}
                    setOption={setHourly_rate}
                    value={hourly_rate?.value}
                    // fontIcon={"earth"}
                    filter={true}
                    state={hourly_rate}
                    setState={setHourly_rate}
                    onRemove={() => {
                      handleRemoveFilter(
                        item,
                        hourly_rate?.value,
                        hourly_rate,
                        setHourly_rate
                      );
                    }}
                  />
                </List.Accordion>
              </>
            )}

            {talent != "Photographer" && (
              <List.Accordion
                isExpanded={expanded}
                onPress={() => {
                  setExpanded(!expanded);
                }}
                title={mySkill?.title}
                titleStyle={{ color: Colors?.black }}
                style={{ backgroundColor: Colors?.white, padding: 0 }}
                descriptionNumberOfLines={4}
              >
                <InputBox
                  type="multiselect"
                  placeholder="Select Skills"
                  options={mySkill?.option}
                  setOption={setMySkill}
                  value={mySkill?.value}
                  filter={true}
                  state={mySkill}
                  setState={setMySkill}
                  onRemove={() => {
                    handleRemoveFilter(
                      item,
                      mySkill?.value,
                      mySkill,
                      setMySkill
                    );
                  }}
                />
              </List.Accordion>
            )}

            <List.Accordion
              isExpanded={expanded}
              onPress={() => {
                setExpanded(!expanded);
              }}
              title={experienceLevel?.title}
              titleStyle={{ color: Colors?.black }}
              style={{ backgroundColor: Colors?.white, padding: 0 }}
              descriptionNumberOfLines={4}
            >
              <InputBox
                type="multiselect"
                placeholder="Select Experience Level"
                options={experienceLevel?.option}
                setOption={setExperienceLevel}
                value={experienceLevel?.value}
                filter={true}
                state={experienceLevel}
                setState={setExperienceLevel}
                onRemove={() => {
                  handleRemoveFilter(
                    item,
                    experienceLevel?.value,
                    experienceLevel,
                    setExperienceLevel
                  );
                }}
              />
            </List.Accordion>
            {talent != "Photographer" && (
              <>
                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={englishLevel?.title}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <InputBox
                    type="multiselect"
                    placeholder="Select Language Level"
                    options={englishLevel?.option}
                    setOption={setEnglishLevel}
                    value={englishLevel?.value}
                    // fontIcon={"earth"}
                    filter={true}
                    state={englishLevel}
                    setState={setEnglishLevel}
                    onRemove={() => {
                      handleRemoveFilter(
                        item,
                        englishLevel?.value,
                        englishLevel,
                        setEnglishLevel
                      );
                    }}
                  />
                </List.Accordion>

                <List.Accordion
                  isExpanded={expanded}
                  onPress={() => {
                    setExpanded(!expanded);
                  }}
                  title={language?.title}
                  titleStyle={{ color: Colors?.black }}
                  style={{ backgroundColor: Colors?.white, padding: 0 }}
                  descriptionNumberOfLines={4}
                >
                  <InputBox
                    type="multiselect"
                    placeholder="Select Language"
                    options={language?.option}
                    setOption={setLanguage}
                    value={language?.value}
                    // fontIcon={"earth"}
                    filter={true}
                    state={language}
                    setState={setLanguage}
                    onRemove={() => {
                      handleRemoveFilter(
                        item,
                        language?.value,
                        language,
                        setLanguage
                      );
                    }}
                  />
                </List.Accordion>
              </>
            )}
            {talent && gender ? (
              <>
                {talent == "Kid" ||
                talent == "Model Kid" ||
                talent == "Model Kid" ? (
                  <>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSizeC?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Shirt Size"
                        options={
                          options?.childOptions?.toddler_shirt_size?.field_meta
                            ?.choices
                        }
                        setOption={setShirtSizeC}
                        value={shirtSizeC?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSizeC}
                        setState={setShirtSizeC}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSizeC?.value,
                            shirtSizeC,
                            setShirtSizeC
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSizeWC?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Pant Size"
                        options={
                          options?.childOptions?.toddler_pant_size?.field_meta
                            ?.choices
                        }
                        setOption={setPantSizeWC}
                        value={pantSizeWC?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSizeWC}
                        setState={setPantSizeWC}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSizeWC?.value,
                            pantSizeWC,
                            setPantSizeWC
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shoeSizeC?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Shoe Size"
                        options={
                          options?.childOptions?.toddler_shoe_size?.field_meta
                            ?.choices
                        }
                        setOption={setShoeSizeC}
                        value={shoeSizeC?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shoeSizeC}
                        setState={setShoeSizeC}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shoeSizeC?.value,
                            shoeSizeC,
                            setShoeSizeC
                          );
                        }}
                      />
                    </List.Accordion>
                    {gender == "Female" || gender == "female" ? (
                      <List.Accordion
                        isExpanded={expanded}
                        onPress={() => {
                          setExpanded(!expanded);
                        }}
                        title={dressSizeC?.title}
                        titleStyle={{ color: Colors?.black }}
                        style={{ backgroundColor: Colors?.white, padding: 0 }}
                        descriptionNumberOfLines={4}
                      >
                        <InputBox
                          type="multiselect"
                          placeholder={dressSizeC?.title}
                          options={
                            options?.childOptions?.toddler_shoe_size?.field_meta
                              ?.choices
                          }
                          setOption={setDressSizeC}
                          value={dressSizeC?.value}
                          // fontIcon={"earth"}
                          filter={true}
                          state={dressSizeC}
                          setState={setDressSizeC}
                          onRemove={() => {
                            handleRemoveFilter(
                              item,
                              dressSizeC?.value,
                              dressSizeC,
                              setDressSizeC
                            );
                          }}
                        />
                      </List.Accordion>
                    ) : null}
                  </>
                ) : gender == "Male" || gender == "male" ? (
                  <>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder="Select Shirt Size"
                        options={
                          options?.maleOptions?.shirt_size?.field_meta?.choices
                        }
                        setOption={setShirtSize}
                        value={shirtSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSize}
                        setState={setShirtSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSize?.value,
                            shirtSize,
                            setShirtSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={dressSizeC?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={dressSizeC?.title}
                        options={
                          options?.childOptions?.toddler_dress_size?.field_meta
                            ?.choices
                        }
                        setOption={setDressSizeC}
                        value={dressSizeC?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={dressSizeC}
                        setState={setDressSizeC}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            dressSizeC?.value,
                            dressSizeC,
                            setDressSizeC
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSizeL?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={pantSizeL?.title}
                        options={
                          options?.maleOptions?.pant_size_length?.field_meta
                            ?.choices
                        }
                        setOption={setPantSizeL}
                        value={pantSizeL?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSizeL}
                        setState={setPantSizeL}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSizeL?.value,
                            pantSizeL,
                            setPantSizeL
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSizeW?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={pantSizeW?.title}
                        options={
                          options?.maleOptions?.pant_size_waist?.field_meta
                            ?.choices
                        }
                        setOption={setPantSizeW}
                        value={pantSizeW?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSizeW}
                        setState={setPantSizeW}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSizeW?.value,
                            pantSizeW,
                            setPantSizeW
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shoeSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shoeSize?.title}
                        options={
                          options?.maleOptions?.shoe_size?.field_meta?.choices
                        }
                        setOption={setShoeSize}
                        value={shoeSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shoeSize}
                        setState={setShoeSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shoeSize?.value,
                            shoeSize,
                            setShoeSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={dressShirt?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={dressShirt?.title}
                        options={
                          options?.maleOptions?.dress_shirt_size?.field_meta
                            ?.choices
                        }
                        setOption={setDressShirt}
                        value={dressShirt?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={dressShirt}
                        setState={setDressShirt}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            dressShirt?.value,
                            dressShirt,
                            setDressShirt
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSleeve?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shirtSleeve?.title}
                        options={
                          options?.maleOptions?.dress_shirt_sleeve?.field_meta
                            ?.choices
                        }
                        setOption={setShirtSleeve}
                        value={shirtSleeve?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSleeve}
                        setState={setShirtSleeve}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSleeve?.value,
                            shirtSleeve,
                            setShirtSleeve
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={neckSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={neckSize?.title}
                        options={
                          options?.maleOptions?.dress_shirt_sleeve?.field_meta
                            ?.choices
                        }
                        setOption={setNeckSize}
                        value={neckSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={neckSize}
                        setState={setNeckSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            neckSize?.value,
                            neckSize,
                            setNeckSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={chestSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={chestSize?.title}
                        options={
                          options?.maleOptions?.chest_size?.field_meta?.choices
                        }
                        setOption={setChestSize}
                        value={chestSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={chestSize}
                        setState={setChestSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            chestSize?.value,
                            chestSize,
                            setChestSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={jacket?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={jacket?.title}
                        options={
                          options?.maleOptions?.jacket?.field_meta?.choices
                        }
                        setOption={setJacket}
                        value={jacket?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={jacket}
                        setState={setJacket}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            jacket?.value,
                            jacket,
                            setJacket
                          );
                        }}
                      />
                    </List.Accordion>
                  </>
                ) : gender == "Female" || gender == "female" ? (
                  <>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSizeF?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shirtSizeF?.title}
                        options={
                          options?.femaleOptions?.shirt_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setShirtSizeF}
                        value={shirtSizeF?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSizeF}
                        setState={setShirtSizeF}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSizeF?.value,
                            shirtSizeF,
                            setShirtSizeF
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={pantSize?.title}
                        options={
                          options?.femaleOptions?.pant_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setPantSize}
                        value={pantSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSize}
                        setState={setPantSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSize?.value,
                            pantSize,
                            setPantSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={braCup?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={braCup?.title}
                        options={
                          options?.femaleOptions?.bra_cup?.field_meta?.choices
                        }
                        setOption={setBraCup}
                        value={braCup?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={braCup}
                        setState={setBraCup}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            braCup?.value,
                            braCup,
                            setBraCup
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={braSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={braSize?.title}
                        options={
                          options?.femaleOptions?.bra_size?.field_meta?.choices
                        }
                        setOption={setBraSize}
                        value={braSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={braSize}
                        setState={setBraSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            braSize?.value,
                            braSize,
                            setBraSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shoeSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shoeSize?.title}
                        options={
                          options?.femaleOptions?.shoe_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setShoeSize}
                        value={shoeSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shoeSize}
                        setState={setShoeSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shoeSize?.value,
                            shoeSize,
                            setShoeSize
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={dressSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={dressSize?.title}
                        options={
                          options?.femaleOptions?.shoe_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setDressSize}
                        value={dressSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={dressSize}
                        setState={setDressSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            dressSize?.value,
                            dressSize,
                            setDressSize
                          );
                        }}
                      />
                    </List.Accordion>
                  </>
                ) : (
                  <>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shirtSize?.title}
                        options={
                          options?.maleOptions?.shirt_size?.field_meta?.choices
                        }
                        setOption={setShirtSize}
                        value={shirtSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSize}
                        setState={setShirtSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSize?.value,
                            shirtSize,
                            setShirtSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSizeL?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={pantSizeL?.title}
                        options={
                          options?.maleOptions?.pant_size_length?.field_meta
                            ?.choices
                        }
                        setOption={setPantSizeL}
                        value={pantSizeL?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSizeL}
                        setState={setPantSizeL}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSizeL?.value,
                            pantSizeL,
                            setPantSizeL
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSizeW?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={pantSizeW?.title}
                        options={
                          options?.maleOptions?.pant_size_waist?.field_meta
                            ?.choices
                        }
                        setOption={setPantSizeW}
                        value={pantSizeW?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSizeW}
                        setState={setPantSizeW}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSizeW?.value,
                            pantSizeW,
                            setPantSizeW
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shoeSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shoeSize?.title}
                        options={
                          options?.maleOptions?.shoe_size?.field_meta?.choices
                        }
                        setOption={setShoeSize}
                        value={shoeSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shoeSize}
                        setState={setShoeSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shoeSize?.value,
                            shoeSize,
                            setShoeSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={dressShirt?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={dressShirt?.title}
                        options={
                          options?.maleOptions?.dress_shirt_size?.field_meta
                            ?.choices
                        }
                        setOption={setdressShirt}
                        value={dressShirt?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={dressShirt}
                        setState={setdressShirt}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            dressShirt?.value,
                            dressShirt,
                            setdressShirt
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSleeve?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shirtSleeve?.title}
                        options={
                          options?.maleOptions?.dress_shirt_sleeve?.field_meta
                            ?.choices
                        }
                        setOption={setShirtSleeve}
                        value={shirtSleeve?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSleeve}
                        setState={setShirtSleeve}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSleeve?.value,
                            shirtSleeve,
                            setShirtSleeve
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={neckSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={neckSize?.title}
                        options={
                          options?.maleOptions?.neck_size?.field_meta?.choices
                        }
                        setOption={setNeckSize}
                        value={neckSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={neckSize}
                        setState={setNeckSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            neckSize?.value,
                            neckSize,
                            setNeckSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={chestSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={chestSize?.title}
                        options={
                          options?.maleOptions?.chest_size?.field_meta?.choices
                        }
                        setOption={setChestSize}
                        value={chestSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={chestSize}
                        setState={setChestSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            chestSize?.value,
                            chestSize,
                            setChestSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={jacket?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={jacket?.title}
                        options={
                          options?.maleOptions?.jacket?.field_meta?.choices
                        }
                        setOption={setJacket}
                        value={jacket?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={jacket}
                        setState={setJacket}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            jacket?.value,
                            jacket,
                            setJacket
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shirtSizeF?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shirtSizeF?.title}
                        options={
                          options?.femaleOptions?.shirt_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setShirtSizeF}
                        value={shirtSizeF?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shirtSizeF}
                        setState={setShirtSizeF}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shirtSizeF?.value,
                            shirtSizeF,
                            setShirtSizeF
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={pantSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={pantSize?.title}
                        options={
                          options?.femaleOptions?.pant_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setPantSize}
                        value={pantSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={pantSize}
                        setState={setPantSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            pantSize?.value,
                            pantSize,
                            setPantSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={braCup?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={braCup?.title}
                        options={
                          options?.femaleOptions?.bra_cup?.field_meta?.choices
                        }
                        setOption={setBraCup}
                        value={braCup?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={braCup}
                        setState={setBraCup}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            braCup?.value,
                            braCup,
                            setBraCup
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={braSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={braSize?.title}
                        options={
                          options?.femaleOptions?.bra_size?.field_meta?.choices
                        }
                        setOption={setBraSize}
                        value={braSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={braSize}
                        setState={setBraSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            braSize?.value,
                            braSize,
                            setBraSize
                          );
                        }}
                      />
                    </List.Accordion>

                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={shoeSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={shoeSize?.title}
                        options={
                          options?.femaleOptions?.shoe_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setShoeSize}
                        value={shoeSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={shoeSize}
                        setState={setShoeSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            shoeSize?.value,
                            shoeSize,
                            setShoeSize
                          );
                        }}
                      />
                    </List.Accordion>
                    <List.Accordion
                      isExpanded={expanded}
                      onPress={() => {
                        setExpanded(!expanded);
                      }}
                      title={dressSize?.title}
                      titleStyle={{ color: Colors?.black }}
                      style={{ backgroundColor: Colors?.white, padding: 0 }}
                      descriptionNumberOfLines={4}
                    >
                      <InputBox
                        type="multiselect"
                        placeholder={dressSize?.title}
                        options={
                          options?.femaleOptions?.shoe_size_f?.field_meta
                            ?.choices
                        }
                        setOption={setDressSize}
                        value={dressSize?.value}
                        // fontIcon={"earth"}
                        filter={true}
                        state={dressSize}
                        setState={setDressSize}
                        onRemove={() => {
                          handleRemoveFilter(
                            item,
                            dressSize?.value,
                            dressSize,
                            setDressSize
                          );
                        }}
                      />
                    </List.Accordion>
                  </>
                )}
              </>
            ) : null}
          </List.Section>
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styling = StyleSheet.create({
  emailView: {
    backgroundColor: Colors?.lightYellow,
    padding: 10,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 20,
    width: "90%",
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
