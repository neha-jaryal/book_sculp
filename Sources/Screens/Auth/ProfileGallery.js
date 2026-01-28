import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
} from "react-native";
import {
  Button,
  TextComponent,
  DashboardHeader,
  Loader,
} from "../../Components";
import { Sizes, Colors, Images, dimensionheight } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
// import * as ImagePicker from "react-native-image-picker";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetail,
  removeImage,
  uploadGalleryProfile,
} from "../../Redux/Services/AuthServices";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import ImagePicker from "react-native-image-crop-picker";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import { showToast } from "../../Utility";
import { useFocusEffect } from "@react-navigation/native";
export const ProfileGallery = ({ navigation, route }) => {
  const dispatch = useDispatch();

  const countryRef = useRef(null);
  const auth = useSelector((state) => state?.authReducer);
  const [galleryImages, setGalleryImages] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [waistImageData, setWaistImageData] = useState(null);
  const [shoulderUpImageData, setShoulderUpImageData] = useState("");
  const [happyData, setHappyData] = useState("");
  const [sadData, setSadData] = useState("");
  const [AngryData, setAngryData] = useState("");
  const [shoulderDownImageData, setShoulderDownImageData] = useState("");
  const [userRole, setUserRole] = useState("");
  const registrationData = auth?.registrationData?.registrationData;
  const [userData, setUserData] = useState("");
  const [picker, setPicker] = useState(false);

  useEffect(() => {
    getUserRole();
  }, []);
  const getUserRole = async () => {
    let userRole = await getData(storageKey?.USER_ROLE);
    setUserRole(userRole);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    // setUserId(userID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
        // res?.results?.user_data?.user_role==13
        console.log(
          "res?.results?.fw_option?.[0]?.waist_up------",
          res?.results?.fw_option?.[0]?.waist_up
        );
        let data =
          res?.results?.images_gallery &&
          res?.results?.images_gallery?.length != 0
            ? res?.results?.images_gallery
            : [];
        res?.results?.profile_image && res?.results?.profile_image?.length != 0
          ? setProfilePhoto(res?.results?.profile_image[0]?.guid)
          : setProfilePhoto("");
        data?.length != 0 ? setGalleryImages(data) : setGalleryImages([]);

        setShoulderUpImageData(
          res?.results?.fw_option?.[0]?.shoulders_up_straight || ""
        );
        setAngryData(res?.results?.fw_option?.[0]?.angry || "");
        setHappyData(res?.results?.fw_option?.[0]?.happy || "");
        setSadData(res?.results?.fw_option?.[0]?.sad || "");
        setWaistImageData(res?.results?.fw_option?.[0]?.waist_up || "");
        setShoulderDownImageData(
          res?.results?.fw_option?.[0]?.shoulders_up_turn || ""
        );

        // res?.results?.profile_image?.length != 0
        //   ? setProfilePhoto(res?.results?.profile_image[0]?.guid)
        //   : setProfilePhoto("");
        // res?.results?.fw_option?.length != 0 &&
        // res?.results?.fw_option[0]?.images_gallery?.length != 0
        //   ? setGalleryImages(res?.results?.fw_option[0]?.images_gallery)
        //   : setGalleryImages([]);
      }
    }
  };

  // const selectProfilePhoto = () => {
  //   ImagePicker.openPicker({
  //     mediaType: "photo",
  //     width: 1000,
  //     height: 1000,
  //     cropping: true,
  //     compressImageMaxWidth: 300,
  //     compressImageMaxHeight: 300,
  //     compressImageQuality: 0.8,
  //   }).then((response) => {
  //     if (response) {
  //       let fileIndex = response?.path?.lastIndexOf("/") + 1;
  //       let fileName = response?.path?.slice(fileIndex, response?.path?.length);
  //       let img_obj = {
  //         name: fileName,
  //         uri: response?.path,
  //         type: response?.mime,
  //       };
  //       // uploadProfilePhoto(img_obj, "profile");
  //     }
  //   });
  // };
  const selectProfilePhoto = () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
      freeStyleCropEnabled: true,
    }).then((response) => {
      if (response) {
        let fileIndex = response?.path?.lastIndexOf("/") + 1;
        let fileName = response?.path?.slice(fileIndex, response?.path?.length);
        let img_obj = {
          name: fileName,
          uri: response?.path,
          type: response?.mime,
        };
        uploadProfilePhoto(img_obj, "profile");
      }
    });
  };

  const selectGalleryImages = async () => {
    if (galleryImages?.length == 10) {
      alert("You cannot upload another Image. You reached your limit");
    } else {
      ImagePicker.openPicker({
        mediaType: "photo",
        // width: 1000,
        // height: 1000,
        cropping: true,
        showCropGuidelines: true,
        // compressImageMaxWidth: 500,
        // compressImageMaxHeight: 500,
        // compressImageQuality: 0.8,
        // minFiles: 10,
        multiple: true,
        // minFiles: 3,
      }).then(async (response) => {
        if (response) {
          let result = [];
          let arr = [...galleryImages];
          let data;
          for await (const image of response) {
            let fileIndex = image?.path?.lastIndexOf("/") + 1;
            let fileName = image?.path?.slice(fileIndex, image?.path?.length);
            const img = await ImagePicker.openCropper({
              // mediaType: "photo",
              path: image.path,
              freeStyleCropEnabled: true,
              // name: fileName,
              // type: image?.mime,
              // width: 1000,
              // height: 1000,
              // compressImageMaxWidth: 500,
              // compressImageMaxHeight: 500,
              // compressImageQuality: 0.5,
            });
            let img_obj = {
              name: fileName,
              uri: img?.path,
              type: img?.mime,
            };
            result.push(img_obj);
            data = arr.concat(...result);
          }
          if (data?.length > 10) {
            alert("Please Choose Maximum 10 Images.");
          } else {
            let uploadData = new FormData();
            let userId =
              route?.params?.routeName == routeName?.REGISTERATION
                ? route?.params?.userId
                  ? route?.params?.userId
                  : registrationData?.id
                  ? registrationData?.id
                  : registrationData?.user_id
                : registrationData?.id;
            let profileId =
              route?.params?.routeName == routeName?.REGISTERATION
                ? route?.params?.profileId
                : registrationData?.profile_id;
            uploadData.append("upload_type", "gallery");
            uploadData.append("user_id", userId);
            uploadData.append("profile_id", profileId);
            result?.map(async (item, index) => {
              let img_obj = {
                name: result?.[index]?.name,
                uri: result?.[index]?.uri,
                type: result?.[index]?.type,
              };
              uploadData.append("file_type" + "[" + [index] + "]", img_obj);
            });
            let res = await dispatch(uploadGalleryProfile(uploadData));
            if (res?.status == 200) {
              let arrr = [...galleryImages];
              let newArr = arrr.concat(res.results);
              console.log("newArrnewArr----", newArr);
              if (newArr?.length == 10) {
                alert("Please Choose Minimum 3 Images or Maximum 10 Images.");
              } else {
                await setGalleryImages(res.results);
                getUserData();
              }
            }
          }
        }
      });
    }
  };
  const removeSelectedImage = async (eachImage, type) => {
    // let imageArr = [];
    // imageArr = galleryImages?.filter((item) => item.uri != eachImage.uri);
    // setGalleryImages(imageArr);
    let userId =
      route?.params?.routeName == routeName?.REGISTERATION
        ? route?.params?.userId
          ? route?.params?.userId
          : registrationData?.id
          ? registrationData?.id
          : registrationData?.user_id
        : registrationData?.id;
    let profileId =
      route?.params?.routeName == routeName?.REGISTERATION
        ? route?.params?.profileId
        : registrationData?.profile_id;
    var body = {
      user_id: userId,
      profile_id: profileId,
      image_type: type,
      image_id:
        type == "gallery"
          ? eachImage?.attachment_id
          : type === "waist_up"
          ? waistImageData?.attachment_id
          : type === "shoulders_up_straight"
          ? shoulderUpImageData?.attachment_id
          : type === "shoulders_up_turn"
          ? shoulderDownImageData?.attachment_id
          : type === "happy"
          ? happyData?.attachment_id
          : type === "sad"
          ? sadData?.attachment_id
          : type === "angry"
          ? AngryData?.attachment_id
          : userData?.profile_image[0]?.ID,
      action: "remove",
    };
    console.log("galleryImages----------", body);

    let res = await dispatch(removeImage(body));
    if (res?.status == 200) {
      getUserData();
    }

    if (type == "profile") {
      setProfilePhoto("");
    } else if (type === "waist_up") {
      setWaistImageData("");
    } else if (type === "shoulders_up_straight") {
      setShoulderUpImageData("");
    } else if (type === "shoulders_up_turn") {
      setShoulderDownImageData("");
    } else if (type === "happy") {
      setHappyData("");
    } else if (type === "sad") {
      setSadData("");
    } else if (type === "angry") {
      setAngryData("");
    }
  };
  // const removeSelectedImage = async (eachImage, type) => {
  //   // let imageArr = [];
  //   // imageArr = galleryImages?.filter((item) => item.uri != eachImage.uri);
  //   // setGalleryImages(imageArr);
  //   let userId =
  //     route?.params?.routeName == routeName?.REGISTERATION
  //       ? route?.params?.userId
  //         ? route?.params?.userId
  //         : registrationData?.id
  //         ? registrationData?.id
  //         : registrationData?.user_id
  //       : registrationData?.id;
  //   let profileId =
  //     route?.params?.routeName == routeName?.REGISTERATION
  //       ? route?.params?.profileId
  //       : registrationData?.profile_id;
  //   var body = {
  //     user_id: userId,
  //     profile_id: profileId,
  //     image_type: type == "gallery" ? "gallery" : "profile",
  //     image_id:
  //       type == "gallery"
  //         ? eachImage?.attachment_id
  //         : userData?.profile_image[0]?.ID,
  //     action: "remove",
  //   };
  //   let res = await dispatch(removeImage(body));
  //   getUserData();
  //   if (type == "profile") {
  //     setProfilePhoto("");
  //   }
  // };

  const uploadProfilePhoto = async (data, type) => {
    let uploadData = new FormData();
    let userId =
      route?.params?.routeName == routeName?.REGISTERATION
        ? route?.params?.userId
          ? route?.params?.userId
          : registrationData?.id
          ? registrationData?.id
          : registrationData?.user_id
        : registrationData?.id;
    let profileId =
      route?.params?.routeName == routeName?.REGISTERATION
        ? route?.params?.profileId
        : registrationData?.profile_id;
    uploadData.append("upload_type", "profile");
    uploadData.append("user_id", userId);
    uploadData.append("profile_id", profileId);
    uploadData.append("file_type", data);

    let res = await dispatch(uploadGalleryProfile(uploadData));
    if (res?.status == 200) {
      setProfilePhoto(res?.results?.uri);
      getUserData();
    }
  };

  const selectDigitalsPhoto = (type) => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
      freeStyleCropEnabled: true,
    }).then((response) => {
      if (response) {
        let fileIndex = response?.path?.lastIndexOf("/") + 1;
        let fileName = response?.path?.slice(fileIndex, response?.path?.length);
        let img_obj = {
          name: fileName,
          uri: response?.path,
          type: response?.mime,
        };
        uploadDigitalphotos(img_obj, type);
      }
    });
  };

  const uploadDigitalphotos = async (data, type) => {
    let userId = await getData(storageKey?.USER_ID);

    let profileId =
      route?.params?.routeName == routeName?.REGISTERATION
        ? route?.params?.profileId
        : registrationData?.profile_id;
    let uploadData = new FormData();
    uploadData.append("upload_type", type);
    uploadData.append("user_id", JSON.parse(userId));
    uploadData.append("profile_id", JSON?.parse(profileId));
    uploadData.append("file_type", data);
    let res = await dispatch(uploadGalleryProfile(uploadData));
    console.log("uploadDatauploadDatauploadData----", res);

    if (res?.status == 200) {
      if (type === "waist_up") {
        setWaistImageData({
          ...waistImageData,
          uri: res?.results?.uri,
          name: res?.results.name,
          size: res?.results.size,
          type: res?.results?.type,
        });
      } else if (type === "shoulders_up_straight") {
        setShoulderUpImageData({
          ...shoulderUpImageData,
          uri: res?.results?.uri,
          name: res?.results.name,
          size: res?.results.size,
          type: res?.results?.type,
        });
      } else if (type === "shoulders_up_turn") {
        setShoulderDownImageData({
          ...shoulderDownImageData,
          uri: res?.results?.uri,
          name: res?.results.name,
          size: res?.results.size,
          type: res?.results?.type,
        });
      } else if (type === "happy") {
        setHappyData({
          ...happyData,
          uri: res?.results?.uri,
          name: res?.results.name,
          size: res?.results.size,
          type: res?.results?.type,
        });
      } else if (type === "sad") {
        setSadData({
          ...sadData,
          uri: res?.results?.uri,
          name: res?.results.name,
          size: res?.results.size,
          type: res?.results?.type,
        });
      } else if (type === "angry") {
        setAngryData({
          ...AngryData,
          uri: res?.results?.uri,
          name: res?.results.name,
          size: res?.results.size,
          type: res?.results?.type,
        });
      }
    }
  };

  const handleNext = async () => {
    if (!profilePhoto) {
      showToast("Please upload your profile photo", "error");
    } else if (
      galleryImages?.length == 0 ||
      (galleryImages?.length > 0 && galleryImages?.length < 3)
    ) {
      alert(
        "You have to upload Minimum 3 Images or Maximum 10 Images in Gallery Section ."
      );
    } else {
      let uploadData = new FormData();
      let userId =
        route?.params?.routeName == routeName?.REGISTERATION
          ? route?.params?.userId
            ? route?.params?.userId
            : registrationData?.id
            ? registrationData?.id
            : registrationData?.user_id
          : registrationData?.id;
      let profileId =
        route?.params?.routeName == routeName?.REGISTERATION
          ? route?.params?.profileId
          : registrationData?.profile_id;
      uploadData.append("upload_type", "next");

      uploadData.append("user_id", userId);
      uploadData.append("profile_id", profileId);

      let res = await dispatch(uploadGalleryProfile(uploadData));
      if (res?.status == 200) {
        showToast("Application Submitted Successfully !", "success");
        navigation?.navigate(routeName?.BOTTOM_TAB);
        dispatch(navigatorStatus(routeName?.DRAWER, "", false));
        storeData(
          storageKey?.USER_ID,
          JSON?.stringify(registrationData?.user_id)
        );
      }
    }
    // else {
    //   navigation?.navigate(routeName?.PACKAGES);
    // }
    // }
  };

  console.log('happyDatahappyData----', happyData)

  return (
    <>
      <DashboardHeader navigation={navigation} />
      <Loader loading={auth?.isLoading} />

      <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled>
        <View style={{ ...Styles?.container }}>
          <TextComponent
            text="Add Profile & Gallery Photos"
            size={Sizes?.l}
            fontWeight="400"
            style={{ textAlign: "center", marginVertical: 15 }}
          />

          {profilePhoto ? (
            <View
              style={{
                position: "relative",
                // width: 80,
                alignSelf: "center",
                marginVertical: 20,
              }}
            >
              <Image
                source={{ uri: profilePhoto }}
                style={{
                  width: dimensionheight(12),
                  height: dimensionheight(12),
                  borderRadius: dimensionheight(100),
                  borderWidth: 5,
                  borderColor: Colors?.lightThemeColor,
                }}
              />
              <TouchableOpacity
                onPress={() => removeSelectedImage("", "profile")}
              >
                <Entypo
                  name="circle-with-cross"
                  size={25}
                  style={{
                    ...styling.cameraIcon,
                  }}
                />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => selectProfilePhoto()}
              style={{
                width: dimensionheight(12),
                height: dimensionheight(12),
                borderRadius: dimensionheight(100),
                borderWidth: 1,
                alignSelf: "center",
                position: "relative",
                marginVertical: 20,
                borderColor: Colors?.darkgrey,
              }}
            >
              <Entypo
                name="camera"
                size={25}
                style={{
                  ...styling.cameraIcon,
                }}
              />
              <TextComponent
                text="Tap to upload Profile Photo"
                size={Sizes?.xs}
                style={{ textAlign: "center", top: 35 }}
                color={Colors?.darkgrey}
                fontWeight="400"
              />
            </TouchableOpacity>
          )}
          {userRole == 11 || userRole == 13 || userRole == 15 ? (
            <>
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Gallery Photos"
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>

              {/* <TouchableOpacity
              onPress={() => selectGalleryImages()}
              style={{
                position: "relative",
                width: 65,
                height: 65,
                borderRadius: 8,
                margin: 6,
                borderWidth: 1,
                borderStyle: "dashed",
              }}
            >
              <Entypo
                name="plus"
                size={20}
                color={Colors?.black}
                style={{ right: 22, position: "absolute", top: 22 }}
              />
            </TouchableOpacity> */}

              <TouchableOpacity
                onPress={() => selectGalleryImages()}
                style={{
                  ...Styles?.row,
                  borderWidth: 1,
                  borderColor: Colors?.themeColor,
                  borderStyle: "dotted",
                  borderRadius: 25,
                  marginVertical: 10,
                }}
              >
                <View
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.themeColor,
                    paddingHorizontal: 20,
                    marginVertical: 0,
                    paddingVertical: 8,
                    marginRight: 15,
                  }}
                >
                  <TextComponent
                    text="Choose Images"
                    size={Sizes?.xs}
                    fontWeight="400"
                    color={Colors?.white}
                  />
                </View>
                <TextComponent
                  text="Tap to upload Images From Gallery"
                  size={Sizes?.xxs}
                  fontWeight="400"
                  color={Colors?.darkgrey}
                />
              </TouchableOpacity>
              <TextComponent
                text="Note - : Add Minimum 3 Images or 10 Maximum Images"
                size={Sizes?.xs}
                fontWeight="400"
                color={Colors?.darkgrey}
                style={{ textAlign: "center" }}
              />
              {galleryImages?.length == 0 ? (
                <View style={{ marginVertical: 30, alignItems: "center" }}>
                  <MaterialIcons
                    name="image-not-supported"
                    size={50}
                    color={Colors?.grey}
                  />
                  <TextComponent
                    text="No Images Added"
                    size={Sizes?.s}
                    fontWeight="400"
                    color={Colors?.darkgrey}
                    style={{ marginVertical: 10 }}
                  />
                </View>
              ) : (
                <FlatList
                  data={galleryImages}
                  contentContainerStyle={{
                    width: "100%",
                    marginVertical: 20,
                  }}
                  keyExtractor={(item, index) => index}
                  renderItem={({ item }) => (
                    <View
                      style={{
                        position: "relative",
                        width: 90,
                        margin: 6,
                        borderWidth: 2,
                        borderColor: Colors?.lightThemeColor,
                        borderRadius: 10,
                      }}
                    >
                      <Image
                        source={{ uri: item?.uri ? item?.uri : item?.url }}
                        style={{
                          width: 90,
                          height: 90,
                          borderRadius: 10,
                        }}
                      />
                      <TouchableOpacity
                        onPress={() => removeSelectedImage(item, "gallery")}
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
              )}
            </>
          ) : null}
        </View>

        <View style={{ ...Styles?.container, paddingTop: 40 }}>
          {userRole == 15 && (
            <>
              <TextComponent text="Digitals" style={{ textAlign: "center" }} />
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Waist Up Photo"
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>

              {waistImageData?.uri ? (
                <View
                  style={{
                    position: "relative",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={{ uri: waistImageData?.uri }}
                    style={{
                      width: dimensionheight(12),
                      height: dimensionheight(12),
                      borderRadius: dimensionheight(2),
                      borderWidth: 5,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeSelectedImage("", "waist_up")}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={25}
                      style={{
                        ...styling.cameraIcon,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => selectDigitalsPhoto("waist_up")}
                  style={{
                    ...styling?.digitalView,
                  }}
                >
                  <Entypo
                    name="camera"
                    size={25}
                    style={{
                      ...styling.cameraIcon,
                    }}
                  />
                  <TextComponent
                    text="Tap to upload Profile Photo"
                    size={Sizes?.xs}
                    style={{ textAlign: "center", top: 35 }}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                  />
                </TouchableOpacity>
              )}

              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Shoulder Up, Facing Camera"
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>

              {shoulderUpImageData?.uri ? (
                <View
                  style={{
                    position: "relative",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={{ uri: shoulderUpImageData?.uri }}
                    style={{
                      width: dimensionheight(12),
                      height: dimensionheight(12),
                      borderRadius: dimensionheight(2),
                      borderWidth: 5,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      removeSelectedImage("", "shoulders_up_straight")
                    }
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={25}
                      style={{
                        ...styling.cameraIcon,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => selectDigitalsPhoto("shoulders_up_straight")}
                  style={{
                    ...styling?.digitalView,
                  }}
                >
                  <Entypo
                    name="camera"
                    size={25}
                    style={{
                      ...styling.cameraIcon,
                    }}
                  />
                  <TextComponent
                    text="Tap to upload Profile Photo"
                    size={Sizes?.xs}
                    style={{ textAlign: "center", top: 35 }}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                  />
                </TouchableOpacity>
              )}

              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Shoulder Up, Side Profile"
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>

              {shoulderDownImageData?.uri ? (
                <View
                  style={{
                    position: "relative",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={{ uri: shoulderDownImageData?.uri }}
                    style={{
                      width: dimensionheight(12),
                      height: dimensionheight(12),
                      borderRadius: dimensionheight(2),
                      borderWidth: 5,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeSelectedImage("", "shoulders_up_turn")}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={25}
                      style={{
                        ...styling.cameraIcon,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => selectDigitalsPhoto("shoulders_up_turn")}
                  style={{
                    ...styling?.digitalView,
                  }}
                >
                  <Entypo
                    name="camera"
                    size={25}
                    style={{
                      ...styling.cameraIcon,
                    }}
                  />
                  <TextComponent
                    text="Tap to upload Profile Photo"
                    size={Sizes?.xs}
                    style={{ textAlign: "center", top: 35 }}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                  />
                </TouchableOpacity>
              )}

              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent text="Happy" size={Sizes?.s} fontWeight="400" />
              </View>

              {happyData ? (
                <View
                  style={{
                    position: "relative",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={{ uri: happyData?.uri }}
                    style={{
                      width: dimensionheight(12),
                      height: dimensionheight(12),
                      borderRadius: dimensionheight(2),
                      borderWidth: 5,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeSelectedImage("", "happy")}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={25}
                      style={{
                        ...styling.cameraIcon,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => selectDigitalsPhoto("happy")}
                  style={{
                    ...styling?.digitalView,
                  }}
                >
                  <Entypo
                    name="camera"
                    size={25}
                    style={{
                      ...styling.cameraIcon,
                    }}
                  />
                  <TextComponent
                    text="Tap to upload Profile Photo"
                    size={Sizes?.xs}
                    style={{ textAlign: "center", top: 35 }}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                  />
                </TouchableOpacity>
              )}

              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent text="Sad" size={Sizes?.s} fontWeight="400" />
              </View>

              {sadData?.uri ? (
                <View
                  style={{
                    position: "relative",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={{ uri: sadData?.uri }}
                    style={{
                      width: dimensionheight(12),
                      height: dimensionheight(12),
                      borderRadius: dimensionheight(2),
                      borderWidth: 5,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeSelectedImage("", "sad")}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={25}
                      style={{
                        ...styling.cameraIcon,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => selectDigitalsPhoto("sad")}
                  style={{
                    ...styling?.digitalView,
                  }}
                >
                  <Entypo
                    name="camera"
                    size={25}
                    style={{
                      ...styling.cameraIcon,
                    }}
                  />
                  <TextComponent
                    text="Tap to upload Profile Photo"
                    size={Sizes?.xs}
                    style={{ textAlign: "center", top: 35 }}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                  />
                </TouchableOpacity>
              )}

              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent text="Angry" size={Sizes?.s} fontWeight="400" />
              </View>

              {AngryData?.uri ? (
                <View
                  style={{
                    position: "relative",
                    alignSelf: "center",
                  }}
                >
                  <Image
                    source={{ uri: AngryData?.uri }}
                    style={{
                      width: dimensionheight(12),
                      height: dimensionheight(12),
                      borderRadius: dimensionheight(2),
                      borderWidth: 5,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => removeSelectedImage("", "angry")}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={25}
                      style={{
                        ...styling.cameraIcon,
                      }}
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity
                  onPress={() => selectDigitalsPhoto("angry")}
                  style={{
                    ...styling?.digitalView,
                  }}
                >
                  <Entypo
                    name="camera"
                    size={25}
                    style={{
                      ...styling.cameraIcon,
                    }}
                  />
                  <TextComponent
                    text="Tap to upload Profile Photo"
                    size={Sizes?.xs}
                    style={{ textAlign: "center", top: 35 }}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                  />
                </TouchableOpacity>
              )}
            </>
          )}

          <Button
            title="Submit"
            icon={true}
            background={true}
            onPress={() => handleNext()}
            style={{ paddingVertical: 5 }}
          />
        </View>
      </ScrollView>
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
  digitalView: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    borderRadius: dimensionheight(2),
    borderWidth: 1,
    alignSelf: "center",
    position: "relative",
    marginVertical: 20,
    borderColor: Colors?.darkgrey,
  },
  cameraIcon: {
    position: "absolute",
    right: 35,
    zIndex: -99,
    bottom: -10,
    borderRadius: 100,
    backgroundColor: Colors?.white,
    color: Colors?.themeColor,
  },
});

// const selectProfilePhoto = () => {
// let options = {
//   storageOptions: {
//     skipBackup: true,
//     path: "images",
//   },
// };
// ImagePicker?.launchImageLibrary(options, (response) => {
//   if (response.didCancel) {
//     console.log("User cancelled image picker");
//   } else if (response.error) {
//     console.log("ImagePicker Error: ");
//   } else if (response.customButton) {
//     console.log("User tapped custom button: ");
//   } else {
// console.log("selectProfilePhoto response--- ", response);
// // setProfilePhoto(response.assets[0].uri);
// let img_obj = {
//   name: response?.assets[0]?.fileName,
//   uri: response?.assets[0]?.uri,
//   type: response?.assets[0]?.type,
// };
// console.log("img_obj----", img_obj);
// uploadProfilePhoto(img_obj, "profile");
//   }
// });
// };

// const selectGalleryImages = async () => {
// if (galleryImages?.length >= 10) {
//   alert("You cannot upload another Image. You reached your limit");
// } else {
//   let options = {
//     storageOptions: {
//       skipBackup: true,
//       path: "images",
//     },
//     selectionLimit: 10,
//   };
//   ImagePicker?.launchImageLibrary(options, async (response) => {
//     if (response.didCancel) {
//       console.log("User cancelled image picker");
//     } else if (response.error) {
//       console.log("ImagePicker Error: ");
//     } else if (response.customButton) {
//       console.log("User tapped custom button: ");
//     } else {
//       console.log("selectGalleryImages response--- ", response);
// let uploadData = new FormData();
// uploadData.append("upload_type", "gallery");
// uploadData.append("user_id", registrationData?.user_id);
// uploadData.append("profile_id", registrationData?.profile_id);
// response?.assets?.map(async (item, index) => {
//   let img_obj = {
//     name: response?.assets[index]?.fileName,
//     uri: response?.assets[index]?.uri,
//     type: response?.assets[index]?.type,
//   };
//   uploadData.append("file_type" + "[" + [index] + "]", img_obj);
//   console.log("img_obj----", img_obj);
//   // let arrr = [...galleryImages];
//   // let newArr = arrr.concat(...response.assets);
//   // if (newArr?.length >= 10) {
//   //   alert("Please Choose Minimum 3 Images or Maximum 10 Images.");
//   // } else {
//   //   await setGalleryImages(newArr);
//   // }
// });
// let res = await dispatch(uploadGalleryProfile(uploadData));
// console.log("uploadData---", uploadData);
// let arrr = [...galleryImages];
// let newArr = arrr.concat(...res.results);
// if (newArr?.length >= 10) {
//   alert("Please Choose Minimum 3 Images or Maximum 10 Images.");
// } else {
//   await setGalleryImages(newArr);
// }
//     }
//   });
// }
// };
