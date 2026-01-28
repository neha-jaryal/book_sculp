import React, { useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  Modal,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import {
  Button,
  InputBox,
  TextComponent,
  Header,
  Tabs,
} from "../../Components";
import { Sizes, Colors, Fonts } from "../../Constants";
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
import { useDispatch } from "react-redux";
import {
  uploadPortfolio,
  uploadSocialPost,
} from "../../Redux/Services/OtherServices";
// import VideoProcessing from "react-native-video-processing";

export const AddPortfolio = ({ navigation }) => {
  const dispatch = useDispatch();
  const [portfolioData, setPortfolioData] = useState({
    title: "",
    detail: "",
  });
  const [postlisting, setPostlisting] = useState([]);
  const [optionsModal, setOptionsModal] = useState(false);
  const [postType, setPostType] = useState(1);

  const attachmentList = [
    // {
    //   id: 1,
    //   heading: "Use Camera For Image",
    //   separator: true,
    //   onPress: () => launchImageCamera(),
    //   icon: (
    //     <Entypo
    //       name="camera"
    //       color={Colors?.themeColor}
    //       size={Sizes?.xl}
    //       style={{ marginRight: 20 }}
    //     />
    //   ),
    // },

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
    // {
    //   id: 3,
    //   heading: "Use Camera For Video",
    //   separator: true,
    //   onPress: () => launchVedioCamera(),
    //   icon: (
    //     <Entypo
    //       name="video-camera"
    //       color={Colors?.themeColor}
    //       size={Sizes?.xl}
    //       style={{ marginRight: 20 }}
    //     />
    //   ),
    // },
    {
      id: 4,
      heading: "Use Gallery For Video",
      separator: false,
      onPress: () => launchVedioGallery(),
      icon: (
        <Entypo
          name="video"
          color={Colors?.themeColor}
          size={Sizes?.xl}
          style={{ marginRight: 20 }}
        />
      ),
    },
  ];

  // const launchGallery = () => {
  //   let options = {
  //     storageOptions: {
  //       skipBackup: true,
  //       path: "images",
  //     },
  //   };
  //   ImagePicker?.launchImageLibrary(options, (response) => {
  //     if (response.didCancel) {
  //       console.log("User cancelled image picker");
  //     } else if (response.error) {
  //       console.log("ImagePicker Error: ");
  //     } else if (response.customButton) {
  //       console.log("User tapped custom button: ");
  //     } else {
  //     }
  //   });
  // };
  const selectGalleryImages = async () => {
    launchImageLibrary(
      {
        mediaType: "video",
        videoQuality: "high",
        durationLimit: 10,

        // mediaType: "image",
        // maxHeight: 800,
        // maxWidth: 800,
        // quality: 0.8,
        // selectionLimit: 0,
        // durationLimit: 3,
        // allowsEditing: true,
      },
      async (response) => {
        if (!response.didCancel) {
          response.assets.map(async (item, index) => {
            let uri = response.assets[index].type;
            let uriParts = uri.split("/");
            fileType = uriParts[uriParts.length - 2];
            // formdata.append('mediaArray' + '[' + [index] + ']', {
            //     type: response.assets[index].type,
            //     uri: response.assets[index].uri,
            //     name: response.assets[index].fileName
            // });
            // sendMedia(fileType, response.assets);
            // console.log(formdata, "====formdata");
          });
          // let arr = [...postlisting];
          setPostlisting(postlisting?.concat(response?.assets));
        }
      }
    );
  };
  const launchVedioGallery = async () => {
    setOptionsModal(false);
    launchImageLibrary(
      {
        // mediaType: "video",
        // maxHeight: 800,
        // maxWidth: 800,

        // mediaType: "video",
        // videoQuality: "low",
        // durationLimit: 10,
        // thumbnail: true,
        // allowsEditing: true,
        // quality: 0.5,
        // selectionLimit: 0,
        // cropping: true,

        mediaType: "video",
        videoQuality: "high",
        durationLimit: 60, // maximum duration in seconds
        cropping: true, // enable trimming
      },
      async (response) => {
        if (!response.didCancel) {
          console.log("response on vedio upload-------", response?.assets);
          let img_obj;
          response.assets.map(async (item, index) => {
            let uri = response.assets[index].type;
            let uriParts = uri.split("/");
            fileType = uriParts[uriParts.length - 2];
            img_obj = {
              name: response.assets?.[index]?.fileName,
              uri: response.assets?.[index]?.uri,
              type: response.assets?.[index]?.type,
            };
            try {
              const options = {
                startTime: 0, // start time in seconds
                endTime: 10, // end time in seconds
                outputFileName: "trimmed_video.mp4", // optional, set a new filename for the trimmed video
              };
              // const result = await VideoProcessing?.trim(
              //   response.assets[0]?.uri,
              //   options
              // );
              // console.log("trimmed vedio --------", result);
              // setTrimmedVideoUri(result);
              // console.log("Trimmed video:", result);
            } catch (error) {
              console.log("Error trimming video:", error);
            }
          });
          setPostlisting(postlisting?.concat(img_obj));
        }
      }
    );
  };

  const launchVedioCamera = async () => {
    setOptionsModal(false);
    ImagePicker.openCamera({
      mediaType: "video",
      width: 1000,
      height: 1000,
      // cropping: true,
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
            // mediaType: "any",
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
          setPostlisting(postlisting?.concat(result));
        }
      }
    });
  };
  const launchImageCamera = async () => {
    setOptionsModal(false);
    ImagePicker.openCamera({
      mediaType: "photo",
      width: 1000,
      height: 1000,
      cropping: true,
      multiple: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
      cropperActiveWidgetColor: Colors?.themeColor,
      freeStyleCropEnabled: true,
    }).then(async (response) => {
      if (response) {
        const result = [];
        for await (const image of response?.cropRect) {
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
            id: fileIndex,
            name: img?.fileName,
            uri: img?.path,
            type: img?.mime,
          };
          result.push(img_obj);
          // setPostlisting(postlisting?.concat(result));
        }
      }
    });
  };
  const launchImageGallery = async () => {
    setOptionsModal(false);
    ImagePicker.openPicker({
      mediaType: "photo",
      width: 1000,
      height: 1000,
      cropping: true,
      multiple: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
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
          setPostlisting(postlisting?.concat(result));
        }
      }
    });
  };

  const UploadPost = async () => {
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
      if (response?.status == 200) {
        navigation?.navigate(routeName?.HOME_STACKS);
      }
    }
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <Header
        navigation={navigation}
        text={postType == 2 ? "Add New Portfolio" : "Add New Social Post"}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
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
              postType == 2 ? launchImageGallery() : setOptionsModal(true)
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
                <TouchableOpacity
                  // onPress={() => alert("hii")}
                  key={index}
                  style={{
                    margin: 5,
                    shadowOpacity: 0.2,
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 5,
                    shadowColor: Colors?.black,
                  }}
                >
                  {item?.type == "video/mp4" ? (
                    <Video
                      source={{ uri: item?.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                      }}
                      playVedio={false}
                      autoplay={false}
                      muted={false}
                      repeat={false}
                      resizeMode={"cover"}
                      automaticallyWaitsToMinimizeStalling={false}
                    />
                  ) : (
                    <Image
                      source={{ uri: item?.uri }}
                      style={{
                        width: 100,
                        height: 100,
                        borderRadius: 10,
                      }}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <Button
          title="Post"
          icon={true}
          background={true}
          backgroundColor={Colors?.themeColor}
          onPress={() => UploadPost()}
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
});
