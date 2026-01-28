import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  KeyboardAvoidingView,
  Platform,
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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { getData, storageKey } from "../../Utility/Storage";
import {
  getUserDetail,
  uploadGalleryProfile,
} from "../../Redux/Services/AuthServices";
import { useDispatch, useSelector } from "react-redux";
import {
  getPortfolioDetails,
  getSocialPostDetails,
  updatePortfolio,
  updateSocialPost,
  uploadPortfolio,
  uploadSocialPost,
} from "../../Redux/Services/OtherServices";
import { useFocusEffect } from "@react-navigation/native";
// import VideoProcessing from "react-native-video-processing";

export const EditPost = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { postType, postId } = route?.params;
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    detail: "",
  });
  const [postlisting, setPostlisting] = useState([]);
  const [tab, setTab] = useState(postType);
  const [profileID, setProfileID] = useState("");
  const [optionsModal, setOptionsModal] = useState(false);
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  useFocusEffect(
    React.useCallback(() => {
      setTab(postType);
      getUserProfileID();
      if (postType == 1) {
        getSocialPostData();
      } else {
        getPostDetails();
      }
    }, [])
  );

  const getPostDetails = async () => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      port_id: postId,
      user_id: JSON?.parse(userId),
    };
    let res = await dispatch(getPortfolioDetails(body));
    if (res?.status == 200) {
      setPostlisting(res?.results[0]?.media);
      setPortfolioData({
        ...portfolioData,
        title: res?.results[0]?.post_details?.post_title,
        detail: res?.results[0]?.post_details?.post_content,
      });
    }
  };
  console.log("postListing------", postlisting);
  const getSocialPostData = async () => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      social_id: postId,
      user_id: JSON?.parse(userId),
    };
    let res = await dispatch(getSocialPostDetails(body));
    if (res?.status == 200) {
      setPostlisting(res?.results[0]?.media);
      setPortfolioData({
        ...portfolioData,
        title: res?.results[0]?.post_details?.post_title,
        detail: res?.results[0]?.post_details?.post_content,
      });
    }
  };

  const attachmentList = [
    {
      id: 2,
      heading: "Use Gallery For Image",
      separator: true,
      onPress: () => launchImageGallery(),
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
      // width: 1000,
      // height: 1000,
      cropping: true,
      multiple: true,
      // compressImageMaxWidth: 300,
      // compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
      cropperActiveWidgetColor: Colors?.themeColor,
      freeStyleCropEnabled: true,
    }).then(async (response) => {
      if (response) {
        const result = [];
        for await (const image of response) {
          let fileIndex = image?.path?.lastIndexOf("/") + 1;
          let fileName = image?.path?.slice(fileIndex, image?.path?.length);
          const img = await ImagePicker.openCropper({
            // mediaType: "photo",
            path: image.path,
            // name: fileName,
            // type: image?.mime,
            // width: 1000,
            // height: 1000,
            // compressImageMaxWidth: 300,
            // compressImageMaxHeight: 300,
            // compressImageQuality: 0.5,
          });
          let img_obj = {
            name: fileName,
            uri: img?.path,
            type: img?.mime,
          };
          result.push(img_obj);
          setPostlisting(postlisting?.concat(result));
        }
      }
      setOptionsModal(false);
    });
  };

  const handleValidation = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    if (!accountApproval) {
      getAccountApproval(true, navigation, auth);
    } else if (!portfolioData?.title) {
      showToast("Please write a caption", "error");
    } else if (!portfolioData?.detail) {
      showToast("Please enter discription", "error");
    } else if (postlisting?.length == 0) {
      showToast("Please select any file", "error");
    } else {
      UploadPost();
    }
  };

  const getUserProfileID = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON?.parse(userId),
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      setProfileID(res?.results?.user_data?.profile_id);
    }
  };
  const UploadPost = async () => {
    let userId = await getData(storageKey?.USER_ID);
    let uploadData = new FormData();
    uploadData.append("update_type", tab == 2 ? "portfolio" : "social_post");
    uploadData.append("port_title", portfolioData?.title);
    uploadData.append("post_id", postId);
    uploadData.append("port_description", portfolioData?.detail);
    uploadData.append("user_id", JSON.parse(userId));
    uploadData.append("profile_id", profileID);
    postlisting?.map(async (item, index) => {
      let img_obj = {
        name: postlisting?.[index]?.name,
        uri: postlisting?.[index]?.uri
          ? postlisting?.[index]?.uri
          : postlisting?.[index]?.url,
        type: postlisting?.[index]?.type,
      };
      uploadData.append("file_type" + "[" + [index] + "]", img_obj);
    });
    console.log(
      "uploadDatauploadDatauploadData------",
      JSON.stringify(uploadData)
    );
    let response;
    if (tab == 2) {
      response = await dispatch(updatePortfolio(uploadData));
    } else {
      response = await dispatch(updateSocialPost(uploadData));
    }
    if (response?.status == 200) {
      setPortfolioData({ ...portfolioData, title: "", detail: "" });
      setPostlisting([]);
      // navigation?.goBack();
      // dispatch(navigatorStatus(routeName?.HOME_STACKS, "", false));
      if (tab == 2) {
        navigation?.navigate(routeName?.MANAGE_PORTFOLIOS);
      } else {
        navigation?.navigate(routeName?.MANAGE_SOCIAL_POSTS);
      }
    }
  };

  const removeFile = (eachImage) => {
    let imageArr = [];
    imageArr = postlisting?.filter((item) =>
      item.uri ? item.uri != eachImage.uri : item.url != eachImage.url
    );
    setPostlisting(imageArr);
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header
        navigation={navigation}
        text={tab == 2 ? "Edit Portfolio" : "Edit Social Post"}
      />
      <Loader loading={auth?.isLoading ? auth?.isLoading : other?.isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...Styles?.container, marginBottom: 10 }}>
          <Tabs
            leftTitle="Social Post"
            rightTitle="Portfolio"
            onLeftTab={() => setTab(1)}
            onRightTab={() => setTab(2)}
            tab={tab}
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
          />
          <InputBox
            type="description"
            value={portfolioData?.detail}
            placeholder="Enter Description"
            onChangeText={(val) =>
              setPortfolioData({ ...portfolioData, detail: val })
            }
            style={{ marginVertical: 10 }}
          />

          <TouchableOpacity
            onPress={() =>
              tab == 2 ? launchImageGallery() : setOptionsModal(true)
            }
            style={{
              ...Styles?.flexRow,
              borderWidth: 1,
              borderColor: Colors?.themeColor,
              borderStyle: "dotted",
              borderRadius: 25,
              marginTop: 10,
            }}
          >
            <View
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                paddingHorizontal: 30,
                paddingVertical: 10,
                marginVertical: 2,
                marginHorizontal: 2,
              }}
            >
              <TextComponent
                text="Select File"
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
                      shadowOffset: 
                        { width: 0, height: 2 } ,
                      elevation: 5,
                      shadowColor: Colors?.black,
                      position: "relative",
                    }}
                  >
                    <Image
                      source={{ uri: item?.url ? item?.url : item?.uri }}
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
          title="Save"
          icon={true}
          background={true}
          backgroundColor={Colors?.themeColor}
          onPress={() => handleValidation()}
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
