import React, { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, Loader, TextComponent } from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { getData, storageKey } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const ClientProfile = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const { userId } = route?.params;
  const [userData, setUserData] = useState("");

  const clientDetail = [
    {
      title: "Email",
      name: userData?.user_data?.user_email,
    },
    {
      title: "Phone Number",
      name: userData && userData?.fw_option[0]?.user_phone_number,
    },
    {
      title: "Gender",
      name: userData && userData?.fw_option[0]?.gender,
    },
    {
      title: "Address",
      name:
        userData?.post_meta_details?.country +
        " | " +
        userData?.post_meta_details?.city,
    },
  ];
  const companyDetail = [
    {
      title: "Company Name :",
      name: userData?.company_details?.title,
    },
    {
      title: "Business Website :",
      name: userData?.company_details?.bussiness_website,
    },
    {
      title: "Business Email:",
      name: userData?.company_details?.bussiness_email_address,
    },
    {
      title: "Organization",
      name: userData?.company_details?.organization,
    },
    {
      title: "We have been in bussiness since :",
      name: userData?.company_details?.bussiness_since,
    },
  ];
  useEffect(() => {
    getUserData();
  }, []);
  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);

    if (userID || userId) {
      let body = {
        user_id: userId ? userId : JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
      }
    }
  };

  const socialMediaDetail = [
    {
      link: userData?.social_followers?.facebook_profile_link,
      icon: (
        <Entypo name={"facebook-with-circle"} color={Colors?.blue} size={40} />
      ),
    },

    {
      icon: (
        <Entypo name={"instagram-with-circle"} color={Colors?.blue} size={40} />
      ),
      link: userData?.social_followers?.instagram_profile_link,
    },
    {
      icon: (
        <View
          style={{
            padding: 10,
            borderRadius: 100,
            backgroundColor: Colors?.blue,
          }}
        >
          <Image
            source={Images?.xIcon}
            tintColor={Colors?.white}
            style={{
              height: 16,
              width: 16,
              // paddingTop: 10,
            }}
          />
        </View>
      ),

      link: userData?.social_followers?.twitter_profile_link,
    },
    {
      icon: (
        <Entypo name={"vimeo-with-circle"} color={Colors?.blue} size={40} />
      ),
      link: userData?.social_followers?.vimeo_profile_link,
    },
    {
      icon: (
        <Entypo name={"youtube-with-circle"} color={Colors?.blue} size={40} />
      ),
      link: userData?.social_followers?.youtube_profile_link,
    },
    {
      icon: (
        <View
          style={{
            padding: 6,
            borderRadius: 100,
            backgroundColor: Colors?.blue,
          }}
        >
          <Image
            source={Images?.tiktokIcon}
            tintColor={Colors?.white}
            style={{
              height: 25,
              width: 25,
              // paddingTop: 10,
            }}
          />
        </View>
      ),
      link: userData?.social_followers?.tiktok_profile_link,
    },
  ];
  return (
    <>
      <Header
        text={
          route?.params?.userId
            ? userData?.user_data?.display_name
            : "My Profile"
        }
        navigation={navigation}
      />
      <Loader loading={other?.isLoading} />
      <ScrollView>
        <View
          style={{
            ...Styles?.container,
          }}
        >
          <View style={{ alignSelf: "center", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() =>
                navigation?.navigate(routeName?.UPDATE_PROFILE_GALLERY)
              }
            >
              {userData &&
              userData?.profile_image &&
              userData?.profile_image[0]?.guid ? (
                <Image
                  source={{ uri: userData?.profile_image[0]?.guid }}
                  style={{
                    alignSelf: "center",
                    width: 100,
                    height: 100,
                    borderRadius: 100,
                    position: "relative",
                  }}
                />
              ) : (
                <FontAwesome
                  name={"user-circle-o"}
                  size={120}
                  color={Colors?.themeColor}
                  style={{
                    top: 10,
                    marginVertical: 20,
                    position: "relative",
                  }}
                />
              )}
              {!userId && (
                <View
                  style={{
                    top: 80,
                    // right: 70,
                    position: "absolute",
                    paddingHorizontal: 6,
                    // paddingTop: 10,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    alignSelf: "center",
                    // borderBRadius: 100,
                    borderBottomLeftRadius: 20,
                    borderBottomRightRadius: 20,
                  }}
                >
                  <TextComponent
                    text={"Edit"}
                    size={Sizes?.l}
                    color={Colors?.white}
                    style={{ paddingHorizontal: 6 }}
                  />
                </View>
              )}
            </TouchableOpacity>
            <View style={{ ...Styles?.row, alignSelf: "center" }}>
              <MaterialIcons
                name="verified-user"
                size={20}
                color={
                  userData?.company_details?.is_verified == "yes" ||
                  userData?.company_details?.is_verified == "Yes"
                    ? Colors?.green
                    : Colors?.red
                }
              />
              <TextComponent
                text={
                  userData?.company_details?.is_verified == "yes" ||
                  userData?.company_details?.is_verified == "Yes"
                    ? "Verified"
                    : "Unverified"
                }
                size={Sizes?.s}
                fontWeight="400"
                style={{ padding: 4 }}
              />
            </View>
            <TextComponent
              text={userData?.user_data?.display_name}
              size={Sizes?.xl}
            />
            <TextComponent
              text={userData && userData?.fw_option[0]?.tag_line}
              size={Sizes?.s}
              fontWeight="400"
              style={{ padding: 4 }}
            />
          </View>
          <View style={Styles?.separator} />

          {/* <View style={{ ...Styles?.row, justifyContent: "center" }}>
            <TextComponent text={"Company ID :"} size={Sizes?.s} />
            <TextComponent
              text={"000" + userData?.company_details?.linked_profile}
              size={Sizes?.s}
              color={Colors?.blue}
              style={{ padding: 4 }}
            />
          </View>

          <View style={Styles?.separator} /> */}

          <FlatList
            data={socialMediaDetail}
            contentContainerStyle={{
              paddingHorizontal: 10,
              ...Styles?.row,
              // width: "90%",
              alignSelf: "center",
              // marginVertical: 6,
              justifyContent: "center",
            }}
            keyExtractor={(item, index) => index}
            renderItem={({ item }) =>
              item?.link && (
                <TouchableOpacity
                  style={{ marginHorizontal: 4 }}
                  onPress={() =>
                    item?.link ? Linking.openURL(item?.link) : null
                  }
                >
                  {item?.icon}
                </TouchableOpacity>
              )
            }
          />
          <View style={Styles?.separator} />
          <TouchableOpacity
            onPress={() => navigation?.navigate(routeName?.EDIT_PROFILE)}
            style={{
              ...Styles?.smallButton,
              backgroundColor: Colors?.blue,
              marginHorizontal: 10,
            }}
          >
            <TextComponent
              text="Edit Profile"
              color={Colors?.white}
              size={Sizes?.l}
              style={{ paddingHorizontal: 10, paddingVertical: 2 }}
            />
          </TouchableOpacity>
        </View>
        <View
          style={{
            ...Styles?.container,
            padding: 20,
          }}
        >
          <TextComponent
            text={"Personal Details"}
            size={Sizes?.l}
            color={Colors?.blue}
            style={{ textAlign: "center" }}
          />
          <View
            style={{
              ...Styles?.separator,
              borderBottomWidth: 2,
              marginBottom: 20,
              borderColor: Colors?.blue,
            }}
          />
          {clientDetail?.map((item) => {
            return (
              <>
                {item?.name ? (
                  <>
                    <View style={Styles?.flexRow}>
                      <TextComponent
                        text={item?.title}
                        size={Sizes?.s}
                        fontWeight="400"
                      />
                      <TextComponent
                        text={item?.name}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.darkgrey}
                      />
                    </View>
                    <View style={Styles?.separator} />
                  </>
                ) : null}
              </>
            );
          })}
        </View>
        <View
          style={{
            ...Styles?.container,
            padding: 20,
          }}
        >
          <TextComponent
            text={"Company Details"}
            size={Sizes?.l}
            color={Colors?.blue}
            style={{ textAlign: "center" }}
          />
          <View
            style={{
              ...Styles?.separator,
              borderBottomWidth: 2,
              marginBottom: 20,
              borderColor: Colors?.blue,
            }}
          />
          {companyDetail?.map((item) => {
            return (
              <>
                {item?.name ? (
                  <>
                    <View style={Styles?.flexRow}>
                      <TextComponent
                        text={item?.title}
                        size={Sizes?.s}
                        fontWeight="400"
                      />
                      <TextComponent
                        text={item?.name}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.darkgrey}
                      />
                    </View>
                    <View style={Styles?.separator} />
                  </>
                ) : null}
              </>
            );
          })}
        </View>
        <TouchableOpacity
          onPress={() => navigation?.navigate(routeName?.MANAGE_JOBS)}
          style={{
            ...Styles?.container,
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Image
            source={Images?.postedJobs}
            style={{ width: 60, height: 60 }}
          />
          <TextComponent
            // text={"Posted Jobs (5)"}
            text={"Posted Jobs"}
            size={Sizes?.l}
            style={{ marginVertical: 8 }}
          />
          <TextComponent
            text={"Tap to view"}
            size={Sizes?.l}
            color={Colors?.blue}
          />
        </TouchableOpacity>
        <View style={{ height: 20 }} />
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  headerTopView: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  logoImg: {
    width: 150,
    height: 70,
    position: "absolute",
    top: 50,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 10,
  },
});
