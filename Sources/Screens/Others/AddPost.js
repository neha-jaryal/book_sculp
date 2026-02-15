import React, { useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
  Alert,
  PermissionsAndroid,
} from "react-native";
import {
  Button,
  InputBox,
  TextComponent,
  Header,
  Tabs,
  Loader,
} from "../../Components";
import { Sizes, Colors, Fonts, dimensionheight } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
// import * as ImagePicker from "react-native-image-picker";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Video from "react-native-video";
import ImagePicker from "react-native-image-crop-picker";

import Entypo from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { getData, storageKey } from "../../Utility/Storage";
import {
  getUserDetail,
  uploadGalleryProfile,
} from "../../Redux/Services/AuthServices";
import { useDispatch, useSelector } from "react-redux";
import {
  getConnects,
  getTrimmedVideo,
  uploadPortfolio,
  uploadSocialPost,
  uploadVideo,
} from "../../Redux/Services/OtherServices";

import { useRef } from "react";
import { getAccountApproval, isFieldEmpty, showToast } from "../../Utility";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import { useFocusEffect } from "@react-navigation/native";

const totalDuration = 60000;
let scrubberInterval;
const scrubInterval = 50;

export const AddPost = ({ navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  const trimmerRef = useRef(null);
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    detail: "",
  });

  const [postlisting, setPostlisting] = useState([]);
  const [optionsModal, setOptionsModal] = useState(false);
  const [error, setError] = useState(false);

  const [postType, setPostType] = useState(1);
  useFocusEffect(
    React.useCallback(() => {
      setError(false);
      setPostType(1);
    }, [])
  );

  // Camera Permission
  const requestGalleryPermission = async () => {
    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "App Camera Permission",
          message: "App needs access to your gallery ",
          buttonNeutral: "Ask Me Later",
          buttonNegative: "Cancel",
          buttonPositive: "OK",
        }
      );
      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Camera permission given");
        launchImageGallery();
      } else {
        console.log("Camera permission denied");
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const checkGalleryPermission = async () => {
    const status = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
    );

    if (status === PermissionsAndroid.RESULTS.granted) {
      launchImageGallery();

      // Permission is granted. You can access the gallery.
      console.log("Gallery permission granted.");
    } else {
      // Permission is not granted. You need to request it.
      requestGalleryPermission();
    }
  };

  const attachmentList = [
    {
      id: 2,
      heading: "Use Gallery For Image",
      separator: true,
      onPress: () => checkGalleryPermission(),
      icon: (
        <Entypo
          name="folder-images"
          color={Colors?.themeColor}
          size={Sizes?.xl}
          style={{ marginRight: 20 }}
        />
      ),
    },
  ];

  const launchImageGallery = async () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      width: 1000,
      height: 800,
      cropping: true,
      multiple: true,
      includeBase64: false,
      showCropGuidelines: true,
      // compressImageQuality: 0.8,

      // mediaType: "photo",
      // width: 1000,
      // height: 1000,
      // cropping: true,
      // multiple: true,
      // showCropFrame: true,
      // showCropGuidelines: true,
      // compressImageMaxWidth: 300,
      // compressImageMaxHeight: 300,
      // compressImageQuality: 1,
      // cropperActiveWidgetColor: Colors?.themeColor,
    }).then(async (response) => {
      if (response) {
        console.log("resposresihsfsfhvshsngjns=====", response);
        const result = [];
        for await (const image of response) {
          console.log("each image in responmse-----", image);
          let fileIndex = image?.path?.lastIndexOf("/") + 1;
          let fileName = image?.path?.slice(fileIndex, image?.path?.length);
          const img = await ImagePicker.openCropper({
            // mediaType: "photo",
            path: image.path,
            freeStyleCropEnabled: true,
            // name: fileName,
            // type: image?.mime,
            width: 1000,
            height: 1000,
            compressImageMaxWidth: 1000,
            compressImageMaxHeight: 1000,
            compressImageQuality: 0.8,
          });
          let img_obj = {
            name: fileName,
            uri: img?.path,
            type: img?.mime,
          };
          result.push(img_obj);
          setPostlisting(postlisting?.concat(result));
          console.log("resultresultresultresult-------", result);
        }
      }
      setOptionsModal(false);
    });
  };

  const handleValidation = async () => {
    setError(true);
    if (postlisting?.length == 0) {
      showToast("Please select any file", "error");
    } else {
      setError(false);
      UploadPost();
    }
  };

  const handlePost = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    if (accountApproval) {
      if (postType == 2) {
        let userID = await getData(storageKey?.USER_ID);
        var body = {
          user_id: userID,
        };
        let resp = await dispatch(getConnects(body));
        if (resp?.status == 200) {
          if (resp?.results?.total_services == 0) {
            Alert.alert(
              "Upgrade Your Plan",
              "You have reached your image upload limit for your portfolio. Please upgrade to increase the amount of images you are allowed to upload.",
              [
                {
                  text: "No",
                  style: "cancel",
                },
                {
                  text: "Yes",
                  onPress: () => {
                    navigation?.navigate(routeName?.PACKAGES);
                  },
                },
              ]
            );
          } else {
            handleValidation();
          }
        }
      } else if (postType == 1) {
        handleValidation();
      }
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };
  const UploadPost = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userID,
    };
    let resp = await dispatch(getConnects(body));
    if (resp?.status == 200) {
    }
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON?.parse(userId),
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      let uploadData = new FormData();
      uploadData.append(
        "upload_type",
        postType == 2 ? "portfolio" : "social_post"
      );
      uploadData.append("port_title", portfolioData?.title);
      uploadData.append("port_description", portfolioData?.detail);
      uploadData.append("user_id", userId);
      uploadData.append("profile_id", res?.results?.user_data?.profile_id);
      postlisting?.map(async (item, index) => {
        let img_obj = {
          name: postlisting?.[index]?.name,
          uri: postlisting?.[index]?.uri,
          type: postlisting?.[index]?.type,
        };
        uploadData.append("file_type" + "[" + [index] + "]", img_obj);
      });
      let response;
      if (postType == 2) {
        response = await dispatch(uploadPortfolio(uploadData));
      } else {
        response = await dispatch(uploadSocialPost(uploadData));
      }
      console.log("uploaddataforthesocialpost----", JSON.stringify(uploadData));
      if (response?.status == 200) {
        setPortfolioData({ ...portfolioData, title: "", detail: "" });
        setPostlisting([]);
        // navigation?.goBack();
        // dispatch(navigatorStatus(routeName?.HOME_STACKS, "", false));
        if (postType == 2) {
          navigation?.navigate(routeName?.MANAGE_PORTFOLIOS);
        } else {
          navigation?.navigate(routeName?.MANAGE_SOCIAL_POSTS);
        }
      }
    }
  };

  const removeFile = (eachImage) => {
    let imageArr = [];
    imageArr = postlisting?.filter((item) => item.uri != eachImage.uri);
    setPostlisting(imageArr);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1,  }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header
        navigation={navigation}
        text={postType == 2 ? "Add New Portfolio" : "Add New Social Post"}
      />
      <Loader loading={other?.isLoading} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{paddingBottom:  100  }}>
        <View style={{ ...Styles?.container, marginBottom: 10 }}>
          <Tabs
            leftTitle="Social Post"
            rightTitle="Portfolio"
            onLeftTab={() => setPostType(1)}
            onRightTab={() => setPostType(2)}
            tab={postType}
          />
          <View style={{ height: 20 }} />
          <InputBox
            type="text"
            fontIcon={"subtitles-outline"}
            value={portfolioData?.title}
            placeholder="Write a caption"
            onChangeText={(val) =>
              setPortfolioData({ ...portfolioData, title: val })
            }
            // isEmpty={error && isFieldEmpty(portfolioData?.title)}
          />
          <InputBox
            type="description"
            value={portfolioData?.detail}
            placeholder="Enter Description *"
            onChangeText={(val) =>
              setPortfolioData({ ...portfolioData, detail: val })
            }
            style={{ marginVertical: 10 }}
            // isEmpty={error && isFieldEmpty(portfolioData?.detail)}
          />

          <TouchableOpacity
            onPress={
              () => launchImageGallery()
              // postType == 2 ? launchImageGallery() : setOptionsModal(true)
            }
            style={{
              ...Styles?.flexRow,
              borderWidth: 1,
              borderColor:
                error && postlisting?.length == 0
                  ? Colors?.red
                  : Colors?.themeColor,
              borderStyle: "dotted",
              borderRadius: 15,
              marginTop: 10,
            }}
          >
            <View
              style={{
                backgroundColor:
                  error && postlisting?.length == 0
                    ? Colors?.red
                    : Colors?.themeColor,
                paddingVertical: 10,
                borderRadius: 15,
                width: 150,
                alignItems: "center",
              }}
            >
              <TextComponent
                text="Choose Gallery *"
                size={Sizes?.xs}
                fontWeight="400"
                color={Colors?.white}
              />
            </View>
          </TouchableOpacity>
          <TextComponent
            text="You are only allowed to upload 10 images per service. if you will upload more images then first 10 images will be attached to this service."
            size={Sizes?.xs}
            fontWeight="400"
            color={Colors?.darkgrey}
            style={{ width: "100%", padding: 8 }}
            fontStyle={Fonts?.Italic}
          />
          <View style={{ height: 30 }} />
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            {postlisting?.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    key={index}
                    style={{
                      margin: 5,
                      shadowOpacity: 0.2,
                      shadowOffset: { width: 0, height: 2 },
                      elevation: 5,
                      shadowColor: Colors?.black,
                      position: "relative",
                    }}
                  >
                    <Image
                      source={{ uri: item?.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                      }}
                    />

                    <TouchableOpacity
                      onPress={() => removeFile(item)}
                      style={{ right: -2, position: "absolute", top: -2 }}
                    >
                      <Entypo
                        name="circle-with-cross"
                        size={18}
                        color={Colors?.pink}
                        style={{
                          backgroundColor: Colors?.white,
                          borderRadius: 100,
                        }}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                </>
              );
            })}
          </View>
        </View>

        <Button
          title="Post"
          icon={true}
          background={true}
          backgroundColor={Colors?.themeColor}
          onPress={() => handlePost()}
        />
      </ScrollView>

      <Modal
        transparent={true}
        visible={optionsModal}
        animationType="slide"
        useNativeDriver={true}
        onRequestClose={() => setOptionsModal(false)}
      >
        <View
          style={{
            flex: 1,
            width: "100%",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View style={styles.modalView}>
            {attachmentList.map((item, index) => {
              return (
                <>
                  <TouchableOpacity
                    onPress={() => item?.onPress()}
                    style={{
                      ...Styles?.row,
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                    }}
                  >
                    {item.icon}
                    <TextComponent
                      text={item.heading}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                    />
                  </TouchableOpacity>
                  <View style={{ ...Styles?.separator }} />
                </>
              );
            })}
            <TouchableOpacity
              onPress={() => setOptionsModal(false)}
              style={{
                ...Styles?.row,
                justifyContent: "flex-end",
                paddingRight: 30,
              }}
            >
              <Entypo
                name="circle-with-cross"
                size={Sizes?.xl}
                color={Colors?.red}
                style={{ paddingRight: 5 }}
              />
              <TextComponent
                text={"Cancel"}
                size={Sizes?.l}
                color={Colors?.red}
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  modalView: {
    justifyContent: "center",
    position: "absolute",
    bottom: "0%",
    backgroundColor: Colors?.white,
    borderTopRightRadius: 25,
    borderTopLeftRadius: 25,
    width: "100%",
    elevation: 3,
    paddingVertical: 20,
  },
  trimmerModal: {
    // flex: 1,
    justifyContent: "center",
    position: "absolute",
    // bottom: "0%",
    height: dimensionheight("100%"),
    top: Platform?.OS == "android" ? 0 : "5%",
    backgroundColor: "rgba(0, 0, 0, 10)",
    borderRadius: 5,
    width: "100%",
    elevation: 3,
    paddingVertical: 20,
  },
  progessModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // bottom: "10%",
    // height: dimensionheight("100%"),
    // top: "10%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: "100%",
    elevation: 3,
    // paddingVertical: 20,
  },
});
