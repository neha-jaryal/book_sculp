// UpdateProfileGallery.js
import React, { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
  Platform,
} from "react-native";
import { Button, TextComponent, Loader, Header } from "../../Components";
import { Sizes, Colors, Images, dimensionheight } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { launchImageLibrary, launchCamera } from "react-native-image-picker";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetail,
  removeImage,
  uploadGalleryProfile,
} from "../../Redux/Services/AuthServices";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import FastImage from "@d11/react-native-fast-image";
import { useFocusEffect } from "@react-navigation/native";

export const UpdateProfileGallery = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const [galleryImages, setGalleryImages] = useState([]);
  const [profilePhoto, setProfilePhoto] = useState("");
  const [userData, setUserData] = useState("");
  const [userId, setUserId] = useState("");
  const [userRole, setUserRole] = useState("");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    getUserRole();
  }, []);

  const getUserRole = async () => {
    let role = await getData(storageKey?.USER_ROLE);
    setUserRole(role);
  };

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );

  const getUserData = async () => {
    let uid = await getData(storageKey?.USER_ID);
    setUserId(uid);
    if (uid) {
      let body = { user_id: JSON.parse(uid) };
      let res = await dispatch(getUserDetail(body));
      if (res?.status === 200) {
        setUserData(res.results);
        setProfilePhoto(
          res?.results?.profile_image?.[0]?.guid ||
            res?.results?.profile_image?.[0]?.url ||
            ""
        );
        setGalleryImages(res?.results?.images_gallery || []);
      }
    }
  };

  // Request permissions
  const requestPermissions = async () => {
    if (Platform.OS === "ios") {
      const photoStatus = await check(PERMISSIONS.IOS.PHOTO_LIBRARY);
      if (photoStatus !== RESULTS.GRANTED) {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result !== RESULTS.GRANTED) {
          Alert.alert("Permission Denied", "Photo library access is required.");
          return false;
        }
      }
      return true;
    } else {
      // Android 13+ uses READ_MEDIA_IMAGES, but image-picker handles it
      return true;
    }
  };

  const selectProfilePhoto = async () => {
    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: "photo",
        quality: 0.8,
        includeBase64: false,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Error", response.errorMessage);
          return;
        }

        const asset = response.assets?.[0];
        if (asset) {
          const fileIndex = asset.uri.lastIndexOf("/") + 1;
          const fileName = asset.uri.slice(fileIndex);
          const imgObj = {
            name: fileName,
            uri: asset.uri,
            type: asset.type || "image/jpeg",
          };
          uploadProfilePhoto(imgObj, "profile");
        }
      }
    );
  };

  const selectGalleryImages = async () => {
    if (galleryImages.length >= 10) {
      Alert.alert("Limit Reached", "You can upload maximum 10 images.");
      return;
    }

    const hasPermission = await requestPermissions();
    if (!hasPermission) return;

    launchImageLibrary(
      {
        mediaType: "photo",
        selectionLimit: 10 - galleryImages.length,
        quality: 0.8,
      },
      async (response) => {
        if (response.didCancel) return;
        if (response.errorCode) {
          Alert.alert("Error", response.errorMessage);
          return;
        }

        const assets = response.assets || [];
        if (galleryImages.length + assets.length > 10) {
          Alert.alert("Limit Exceeded", "Maximum 10 images allowed.");
          return;
        }

        setUploading(true);
        const uploadData = new FormData();
        uploadData.append("upload_type", "gallery");
        uploadData.append("user_id", userId);
        uploadData.append("profile_id", userData?.user_data?.profile_id);

        assets.forEach((asset, index) => {
          const fileIndex = asset.uri.lastIndexOf("/") + 1;
          const fileName = asset.uri.slice(fileIndex);
          uploadData.append(`file_type[${index}]`, {
            name: fileName,
            uri: asset.uri,
            type: asset.type || "image/jpeg",
          });
        });

        const res = await dispatch(uploadGalleryProfile(uploadData));
        setUploading(false);

        if (res?.status === 200) {
          const newImages = res.results || [];
          setGalleryImages((prev) => [...prev, ...newImages]);
          getUserData(); // Refresh full data
        } else {
          Alert.alert("Upload Failed", "Could not upload images.");
        }
      }
    );
  };

  const removeSelectedImage = async (image, type) => {
    const body = {
      user_id: userId,
      profile_id: userData?.user_data?.profile_id,
      image_type: type === "gallery" ? "gallery" : "profile",
      image_id:
        type === "gallery"
          ? image?.attachment_id || image?.ID
          : userData?.profile_image?.[0]?.ID,
      action: "remove",
    };

    const res = await dispatch(removeImage(body));
    if (res?.status === 200) {
      getUserData();
      if (type === "profile") setProfilePhoto("");
    } else {
      Alert.alert("Error", "Failed to remove image.");
    }
  };

  const uploadProfilePhoto = async (data, type) => {
    setUploading(true);
    const uploadData = new FormData();
    uploadData.append("upload_type", "profile");
    uploadData.append("user_id", userId);
    uploadData.append("profile_id", userData?.user_data?.profile_id);
    uploadData.append("file_type", data);

    const res = await dispatch(uploadGalleryProfile(uploadData));
    setUploading(false);

    if (res?.status === 200) {
      setProfilePhoto(res?.results?.uri || res?.results?.url || "");
      getUserData();
    } else {
      Alert.alert("Upload Failed", "Could not upload profile photo.");
    }
  };

  const handleNext = async () => {
    if (userRole === "11" || userRole === "13") {
      if (galleryImages.length < 3) {
        Alert.alert(
          "Minimum Required",
          "Please upload at least 3 images in your gallery."
        );
        return;
      }
      if (galleryImages.length > 10) {
        Alert.alert("Limit Exceeded", "Maximum 10 images allowed in gallery.");
        return;
      }
    }

    if (!profilePhoto) {
      Alert.alert("Profile Photo Required", "Please upload a profile photo.");
      return;
    }

    navigation?.goBack();
  };

  return (
    <>
      <Header
        text={
          userRole === "11" || userRole === "13"
            ? "Update Profile & Gallery Images"
            : "Update Profile Image"
        }
        navigation={navigation}
      />
      <Loader loading={auth?.isLoading || uploading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...Styles.container, marginBottom: 30 }}>
          {/* Profile Photo Section */}
          {profilePhoto ? (
            <View
              style={{
                position: "relative",
                alignSelf: "center",
                marginVertical: 20,
              }}
            >
              <TouchableOpacity onPress={selectProfilePhoto}>
                <FastImage
                  source={{ uri: profilePhoto }}
                  style={{
                    width: dimensionheight(12),
                    height: dimensionheight(12),
                    borderRadius: dimensionheight(100),
                    borderWidth: 5,
                    borderColor: Colors?.lightThemeColor,
                  }}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => removeSelectedImage({}, "profile")}
                style={{
                  position: "absolute",
                  right: -10,
                  bottom: -10,
                  backgroundColor: Colors.white,
                  borderRadius: 20,
                }}
              >
                <Entypo name="circle-with-cross" size={28} color={Colors.pink} />
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              onPress={selectProfilePhoto}
              style={{
                width: dimensionheight(12),
                height: dimensionheight(12),
                borderRadius: dimensionheight(100),
                borderWidth: 1,
                borderStyle: "dashed",
                borderColor: Colors.darkgrey,
                alignSelf: "center",
                marginVertical: 20,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Entypo name="camera" size={30} color={Colors.themeColor} />
              <TextComponent
                text="Tap to upload Profile Photo"
                size={Sizes.xs}
                color={Colors.darkgrey}
                style={{ marginTop: 8, textAlign: "center" }}
              />
            </TouchableOpacity>
          )}

          {/* Gallery Section (only for Model/Photographer) */}
          {(userRole === "11" || userRole === "13") && (
            <>
              <View style={{ ...Styles.flexRow, ...styling.headingView }}>
                <TextComponent text="Gallery Photos" size={Sizes.s} fontWeight="400" />
              </View>

              <TouchableOpacity
                onPress={selectGalleryImages}
                style={{
                  ...Styles.row,
                  borderWidth: 1,
                  borderColor: Colors.themeColor,
                  borderStyle: "dotted",
                  borderRadius: 25,
                  marginVertical: 15,
                  padding: 12,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    ...Styles.smallButton,
                    backgroundColor: Colors.themeColor,
                    paddingHorizontal: 20,
                    paddingVertical: 8,
                    marginRight: 15,
                  }}
                >
                  <TextComponent text="Choose Images" size={Sizes.xs} color={Colors.white} />
                </View>
                <TextComponent
                  text="Tap to upload from Gallery"
                  size={Sizes.xxs}
                  color={Colors.darkgrey}
                />
              </TouchableOpacity>

              <TextComponent
                text="Note: Add minimum 3 images (max 10)"
                size={Sizes.xs}
                color={galleryImages.length < 3 ? Colors.red : Colors.darkgrey}
                style={{ textAlign: "center", marginBottom: 15 }}
              />

              {galleryImages.length === 0 ? (
                <View style={{ marginVertical: 30, alignItems: "center" }}>
                  <MaterialIcons name="image-not-supported" size={60} color={Colors.grey} />
                  <TextComponent
                    text="No Images Added"
                    size={Sizes.s}
                    color={Colors.darkgrey}
                    style={{ marginTop: 10 }}
                  />
                </View>
              ) : (
                <FlatList
                  data={galleryImages}
                  numColumns={3}
                  keyExtractor={(item, index) => index.toString()}
                  renderItem={({ item, index }) => (
                    <View
                      style={{
                        position: "relative",
                        width: "30%",
                        margin: 6,
                        aspectRatio: 1,
                      }}
                    >
                      <FastImage
                        source={{ uri: item?.uri || item?.url }}
                        style={{
                          width: "100%",
                          height: "100%",
                          borderRadius: 10,
                        }}
                        resizeMode={FastImage.resizeMode.cover}
                      />
                      <TouchableOpacity
                        onPress={() => removeSelectedImage(item, "gallery")}
                        style={{
                          position: "absolute",
                          top: -8,
                          right: -8,
                          backgroundColor: Colors.white,
                          borderRadius: 20,
                        }}
                      >
                        <Entypo name="circle-with-cross" size={24} color={Colors.pink} />
                      </TouchableOpacity>
                    </View>
                  )}
                />
              )}
            </>
          )}

          <Button
            title="Submit"
            icon={true}
            background={true}
            onPress={handleNext}
            loading={uploading}
          />
        </View>
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  emailView: {
    backgroundColor: Colors.yellow,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: "space-around",
  },
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});