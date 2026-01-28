import React, { useState } from "react";
import {
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
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
// import * as ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { documentTypes } from "../../Global";
import {
  isFieldEmpty,
  isValidPhoneNumber,
  regName,
  showToast,
} from "../../Utility";
import { useDispatch } from "react-redux";
import {
  getUserDetail,
  identityVerification,
} from "../../Redux/Services/AuthServices";
import { getData, storageKey } from "../../Utility/Storage";
import { useEffect } from "react";
import Entypo from "react-native-vector-icons/Entypo";
import { Image } from "react-native";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import { useFocusEffect } from "@react-navigation/native";

export const IdentityVerification = ({ navigation }) => {
  const dispatch = useDispatch();
  const [documentType, setDocumentType] = useState("");
  const [userData, setUserData] = useState("");
  const [error, setError] = useState("");
  const [cancel, setCancel] = useState("");
  const [basicDetails, setBasicDetails] = useState({
    name: "",
    mobileNumber: "",
    address: "",
    document: [],
  });
  const [callingCode, setCallingCode] = useState("91");
  const nameValid = regName(basicDetails?.name);
  const mobileNumberValid = isValidPhoneNumber(basicDetails?.mobileNumber);

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [navigation])
  );

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
      }
    }
  };

  console.log("userDatauserData----", JSON.stringify(userData));

  const selectDocument = () => {
    ImagePicker.openPicker({
      mediaType: "photo",
      cropping: true,
      multiple: true,
      compressImageQuality: 0.8,
    }).then(async (response) => {
      if (response) {
        const result = [];
        for await (const image of response) {
          let fileIndex = image?.path?.lastIndexOf("/") + 1;
          let fileName = image?.path?.slice(fileIndex, image?.path?.length);
          const img = await ImagePicker.openCropper({
            path: image.path,
            freeStyleCropEnabled: true,
          });
          let img_obj = {
            name: fileName,
            uri: img?.path,
            type: img?.mime,
          };
          result.push(img_obj);
          setBasicDetails({
            ...basicDetails,
            document: basicDetails?.document?.concat(result),
          });
        }
      }
    });
  };

  const handleSubmitIdentity = async () => {
    setError(true);
    let userID = await getData(storageKey?.USER_ID);
    if (
      !basicDetails?.name ||
      !basicDetails?.document ||
      !basicDetails?.address ||
      !basicDetails?.mobileNumber ||
      !documentType
    ) {
      showToast("Please Fill all required field");
    } else {
      let uploadData = new FormData();
      uploadData?.append("user_id", JSON?.parse(userID));
      uploadData?.append("profile_id", userData?.user_data?.profile_id);
      uploadData?.append("name", basicDetails?.name);
      uploadData?.append("contact number", basicDetails?.mobileNumber);
      uploadData?.append("document_type", documentType);
      uploadData?.append("address", basicDetails?.address);
      basicDetails?.document?.map(async (item, index) => {
        let img_obj = {
          name: basicDetails?.document?.[index]?.name,
          uri: basicDetails?.document?.[index]?.uri,
          type: basicDetails?.document?.[index]?.type,
        };
        // uploadData?.append("identity_doc", basicDetails?.document);
        uploadData.append("identity_doc" + "[" + [index] + "]", img_obj);
      });
      let res = await dispatch(identityVerification(uploadData));
      if (res?.status == 200) {
        setError(false);
        getUserData();
        // navigation?.navigate(routeName?.BOTTOM_TAB);
        setBasicDetails({
          ...basicDetails,
          name: "",
          document: [],
          mobileNumber: "",
          address: "",
        });
        setDocumentType("");
      }
    }
  };
  const removeFile = (eachImage) => {
    let imageArr = [];
    imageArr = basicDetails?.document?.filter(
      (item) => item.uri != eachImage.uri
    );
    setBasicDetails({ ...basicDetails, document: imageArr });
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      {/* <DashboardHeader navigation={navigation} /> */}
      <Header text="Identity Verification" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...Styles?.container, marginBottom: 30 }}>
          {/* <TextComponent
            text="Upload Identity Information"
            size={Sizes?.xl}
            fontWeight="400"
          /> 
          <View style={Styles?.separator} />*/}
          {userData?.user_data?.identity_status == 0 || cancel ? (
            <>
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                }}
              >
                <TextComponent
                  text="Upload identity documents"
                  size={Sizes?.l}
                  fontWeight="400"
                />
              </View>
              <TextComponent
                text="You will not be able to apply for a job or post services before verifying your identity."
                size={Sizes?.s}
                fontWeight="400"
              />
              <View style={{ margin: 15 }}>
                <InputBox
                  type="text"
                  value={basicDetails?.name}
                  placeholder="Your Name"
                  onChangeText={(val) =>
                    setBasicDetails({ ...basicDetails, name: val })
                  }
                  error={nameValid}
                  isEmpty={error && isFieldEmpty(basicDetails?.name)}
                />

                <InputBox
                  type="phone"
                  value={basicDetails?.mobileNumber}
                  placeholder="Contact Number"
                  onChangeText={(val) =>
                    setBasicDetails({ ...basicDetails, mobileNumber: val })
                  }
                  //        callingCode={callingCode}
                  // setCallingCode={setCallingCode}
                  error={mobileNumberValid}
                  isEmpty={error && isFieldEmpty(basicDetails?.mobileNumber)}
                />
                <DropDownList
                  placeholder={"Select Document Type"}
                  icon={Images?.documents}
                  value={documentType}
                  setValue={setDocumentType}
                  options={documentTypes}
                  border={false}
                  isEmpty={error && isFieldEmpty(documentType)}
                />
              </View>
              <InputBox
                type="description"
                value={basicDetails?.address}
                placeholder="Add Address"
                onChangeText={(val) =>
                  setBasicDetails({ ...basicDetails, address: val })
                }
                isEmpty={error && isFieldEmpty(basicDetails?.address)}
              />

              <TouchableOpacity
                onPress={() => selectDocument()}
                style={{
                  ...Styles?.flexRow,
                  borderWidth: 1,
                  borderColor:
                    error && !basicDetails?.document?.length != 0
                      ? Colors?.red
                      : Colors?.themeColor,
                  borderStyle:
                    error && !basicDetails?.document ? null : "dotted",
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
                    text="Select File"
                    size={Sizes?.xs}
                    fontWeight="400"
                    color={Colors?.white}
                  />
                </View>
              </TouchableOpacity>
              <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                {basicDetails?.document?.map((item, index) => {
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
              {/* {basicDetails?.document ? (
                <View
                  style={{
                    position: "relative",
                    width: 90,
                    margin: 6,
                  }}
                >
                  <Image
                    source={{ uri: basicDetails?.document?.uri }}
                    style={{
                      width: 90,
                      height: 90,
                      borderRadius: 10,
                    }}
                  />
                  <TouchableOpacity
                    onPress={() =>
                      setBasicDetails({ ...basicDetails, document: "" })
                    }
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
              ) : null} */}
              <TextComponent
                text="Update all the latest changes made by you, by just clicking on “Save & Update“ button."
                size={Sizes?.s}
                fontWeight="400"
                style={{ width: "100%", padding: 10 }}
              />
              <Button
                title="Save & Update"
                icon={true}
                background={true}
                onPress={() => handleSubmitIdentity()}
                style={{ paddingVertical: 5 }}
              />
            </>
          ) : userData?.user_data?.identity_status == 1 ? (
            <>
              <View
                style={{
                  ...Styles?.container,
                  backgroundColor: Colors?.yellow,
                  width: "98%",
                  marginHorizontal: 5,
                }}
              >
                <TextComponent
                  text="Woohoo !"
                  fontWeight="400"
                  style={{ marginVertical: 10 }}
                />
                <TextComponent
                  text="Please allow one to two weeks for our team to
                  review your application. We will notify you
                  soon. Thanks for your patience and
                  understanding."
                  size={Sizes?.s}
                  fontWeight="400"
                  color={Colors?.gray}
                  style={{ lineHeight: 23 }}
                />
                <View style={{ ...Styles?.row, marginVertical: 10 }}>
                  <Feather name="loader" size={20} color={Colors?.gray} />
                  <TextComponent
                    text="  Request under review"
                    size={Sizes?.s}
                    fontWeight="400"
                    color={Colors?.gray}
                  />
                </View>
              </View>
              <View
                style={{
                  ...Styles?.flexRow,
                  ...styling?.headingView,
                  marginVertical: 25,
                }}
              >
                <TextComponent
                  text="Identity Verification inprogress"
                  size={Sizes?.l}
                  fontWeight="400"
                />
              </View>
              <TextComponent
                style={{ lineHeight: 24, letterSpacing: 0.2 }}
                text="Thank you so much for submitting your identity
                documents, we will review and send you an email very
                soon."
                size={Sizes?.s}
                fontWeight="400"
              />
              <View style={{ height: 20 }} />
              <Button
                title="Cancel & Re-Upload"
                icon={true}
                background={true}
                backgroundColor={Colors?.pink}
                onPress={() => setCancel(true)}
                style={{ paddingVertical: 5 }}
              />
            </>
          ) : userData?.user_data?.identity_status == 2 ? (
            <>
              <View
                style={{
                  alignSelf: "center",
                  alignItems: "center",
                  marginVertical: 20,
                }}
              >
                <MaterialCommunityIcons
                  name="text-box-check"
                  size={100}
                  color={Colors?.themeColor}
                  style={{ marginVertical: 20 }}
                />

                <TextComponent
                  style={{ lineHeight: 24, letterSpacing: 0.2 }}
                  text="Congratulation! Your identity has been verified,
                  You are ready to post a job"
                  size={Sizes?.l}
                  fontWeight="bold"
                  color={Colors?.darkgrey}
                />
                <View style={{ height: 15 }} />
              </View>
            </>
          ) : null}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
});
