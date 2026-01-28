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
import {
  DropDownList,
  Header,
  ImageView,
  InputBox,
  Loader,
  ReportUser,
  TextComponent,
  ViewImages,
} from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import CountryFlag from "react-native-country-flag";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import moment from "moment";
import { getData, storageKey } from "../../Utility/Storage";

export const PhotographerUserProfile = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);
  const [userData, setUserData] = useState([]);
  const [imagesModal, setImagesModal] = useState(false);

  useEffect(() => {
    getUserDetails();
  }, []);

  const getUserDetails = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON.parse(userId),
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      setUserData(res?.results);
    }
  };

  const userDetail = [
    {
      title: "Email ID :",
      name: userData?.user_data?.user_email,
    },
    {
      title: "Phone Number :",
      name:
        userData &&
        userData?.fw_option?.length != 0 &&
        userData?.fw_option &&
        userData?.fw_option[0]?.user_phone_number
          ? userData?.fw_option[0]?.user_phone_number
          : "",
    },
    {
      title: "Date of birth :",
      name: moment(new Date(userData?.personal_details?.date_of_birth)).format(
        "DD-MM-YYYY"
      ),
    },
    {
      title: "Age :",
      name: userData?.personal_details?.photographer_age,
    },
    {
      title: "Expertise :",
      name: userData?.personal_details?.expertise.map((item) => item.value),
    },
    {
      title: "Custom Expertise :",
      name: userData?.personal_details?.custom_expertise,
    },
    {
      title: "Years of experience :",
      name: userData?.personal_details?.years_experience,
    },
  ];

  const socialMediaDetail = [
    {
      link: userData?.social_followers?.facebook_profile_link,
      icon: (
        <Entypo
          name={"facebook-with-circle"}
          color={Colors?.themeColor}
          size={40}
        />
      ),
    },

    {
      icon: (
        <Entypo
          name={"instagram-with-circle"}
          color={Colors?.themeColor}
          size={40}
        />
      ),
      link: userData?.social_followers?.instagram_profile_link,
    },
    {
      icon: (
        <View
          style={{
            padding: 10,
            borderRadius: 100,
            backgroundColor: Colors?.pink,
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
        <Entypo
          name={"vimeo-with-circle"}
          color={Colors?.themeColor}
          size={40}
        />
      ),
      link: userData?.social_followers?.vimeo_profile_link,
    },
    {
      icon: (
        <Entypo
          name={"youtube-with-circle"}
          color={Colors?.themeColor}
          size={40}
        />
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
      <Header text={"My Profile"} navigation={navigation} />
      <Loader loading={auth?.isLoading ? auth?.isLoading : other?.isLoading} />
      {userData && (
        <ScrollView>
          <View
            style={{
              ...Styles?.container,
            }}
          >
            <View style={{ alignSelf: "center", alignItems: "center" }}>
              <ImageView
                uri={
                  userData?.profile_image &&
                  userData?.profile_image?.length != 0 &&
                  userData?.profile_image[0] &&
                  userData?.profile_image[0]?.guid
                    ? userData?.profile_image[0]?.guid
                    : ""
                }
                style={{
                  ...styling?.profileImg,
                }}
                loading={other?.isLoading}
              />
              <TextComponent
                text={
                  userData?.user_data?.full_name +
                  " (" +
                  userData?.personal_details?.gender +
                  ")"
                }
                size={Sizes?.l}
                fontWeight="400"
                style={{ textTransform: "capitalize" }}
              />
            </View>
            <View style={Styles?.separator} />

            <View
              style={{
                ...Styles?.row,
                justifyContent: "center",
              }}
            >
              <Image
                source={Images?.dollarCash}
                style={{ width: 20, height: 20 }}
              />
              <TextComponent
                text={`$${
                  userData?.personal_details?.perhour_rate
                    ? userData?.personal_details?.perhour_rate
                    : "0"
                } / hr`}
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
                style={{ padding: 4 }}
              />
            </View>
            <View style={Styles?.separator} />
            {userData?.post_meta_details?.country && (
              <>
                <View
                  style={{
                    ...Styles?.row,
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome
                    name={"flag"}
                    size={18}
                    color={Colors?.themeColor}
                  />

                  <TextComponent
                    text={
                      " " +
                      userData?.post_meta_details?.country +
                      " | " +
                      userData?.post_meta_details?.city
                    }
                    size={Sizes?.xs}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                    style={{ padding: 4 }}
                  />
                </View>
                <View style={Styles?.separator} />
              </>
            )}
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
            <View
              style={{
                ...Styles?.row,
                width: "100%",
                justifyContent: "center",
                marginBottom: 10,
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  navigation?.navigate(routeName?.EDIT_PHOTOGRAPHER)
                }
                style={{
                  ...Styles?.smallButton,
                  backgroundColor: Colors?.pink,
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
              {userData?.images_gallery?.length != 0 && (
                <TouchableOpacity
                  onPress={() => setImagesModal(true)}
                  // onPress={() =>
                  //   navigation?.navigate(routeName?.GALLERY_IMAGES, {
                  //     userId: userData?.user_data?.user_id,
                  //     images: userData?.images_gallery,
                  //   })
                  // }

                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.themeColor,
                    marginHorizontal: 10,
                  }}
                >
                  <TextComponent
                    text="Gallery"
                    color={Colors?.white}
                    size={Sizes?.l}
                    style={{ paddingHorizontal: 10, paddingVertical: 2 }}
                  />
                </TouchableOpacity>
              )}
              {imagesModal && (
                <ViewImages
                  images={userData?.images_gallery}
                  show={imagesModal}
                  setShow={setImagesModal}
                />
              )}
            </View>
          </View>

          <View
            style={{
              ...Styles?.container,
            }}
          >
            <View
              style={{
                ...Styles?.flexRow,
                ...styling?.headingView,
                marginVertical: 10,
              }}
            >
              <TextComponent
                text="Projects Detail"
                size={Sizes?.s}
                fontWeight="400"
              />
            </View>
            <View
              style={{
                ...Styles?.container,
                marginHorizontal: 0,
                width: "100%",
                marginTop: 10,
              }}
            >
              <View style={{ ...Styles?.flexRow, paddingVertical: 15 }}>
                <View
                  style={{
                    alignItems: "center",
                    width: "50%",
                  }}
                >
                  <TextComponent
                    text={
                      userData?.project_count_details?.ongoing_project
                        ? userData?.project_count_details?.ongoing_project
                        : "0"
                    }
                    size={Sizes?.xl}
                    color={Colors?.themeColor}
                  />
                  <TextComponent
                    text={"Ongoing Projects"}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                </View>
                <View style={{ alignItems: "center", width: "50%" }}>
                  <TextComponent
                    text={
                      userData?.project_count_details?.complete_project
                        ? userData?.project_count_details?.complete_project
                        : "0"
                    }
                    size={Sizes?.xl}
                    color={Colors?.blue}
                  />
                  <TextComponent
                    text={"Completed Projects"}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                </View>
              </View>
              <View style={{ ...Styles?.flexRow, paddingVertical: 15 }}>
                <View style={{ alignItems: "center", width: "50%" }}>
                  <TextComponent
                    text={
                      userData?.project_count_details?.cancelled_project
                        ? userData?.project_count_details?.cancelled_project
                        : "0"
                    }
                    size={Sizes?.xl}
                    color={Colors?.pink}
                  />
                  <TextComponent
                    text={"Cancelled Projects"}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                </View>
                <View style={{ alignItems: "center", width: "50%" }}>
                  <TextComponent
                    text={
                      userData?.project_count_details?.followers_count
                        ? userData?.project_count_details?.followers_count
                        : "0"
                    }
                    size={Sizes?.xl}
                    color={Colors?.yellow}
                  />
                  <TextComponent
                    text={"Followers"}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                </View>
              </View>
              <View style={{ ...Styles?.flexRow, paddingVertical: 15 }}>
                <View style={{ alignItems: "center", width: "50%" }}>
                  <TextComponent
                    text={
                      userData?.personal_details?.full_day_rate
                        ? userData?.personal_details?.full_day_rate
                        : "0"
                    }
                    size={Sizes?.xl}
                    color={Colors?.gray}
                  />
                  <TextComponent
                    text={"Full Day Rate"}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                </View>
                <View style={{ alignItems: "center", width: "50%" }}>
                  <TextComponent
                    text={
                      userData?.personal_details?.half_day_rate
                        ? userData?.personal_details?.half_day_rate
                        : "0"
                    }
                    size={Sizes?.xl}
                    color={Colors?.blue}
                  />
                  <TextComponent
                    text={"Half Day Rate"}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                </View>
              </View>
            </View>
          </View>
          <View
            style={{
              ...Styles?.container,
            }}
          >
            <View
              style={{
                ...Styles?.flexRow,
                ...styling?.headingView,
                marginVertical: 10,
              }}
            >
              <TextComponent
                text="Bio Details"
                size={Sizes?.s}
                fontWeight="400"
              />
            </View>

            {userData?.personal_details?.professional_bio ||
            userData?.personal_details?.personal_bio ? (
              <View
                style={{
                  ...Styles?.container,
                  marginHorizontal: 0,
                  width: "100%",
                  marginTop: 10,
                }}
              >
                {userData?.personal_details?.professional_bio ? (
                  <>
                    <TextComponent
                      text={"Professional Bio :"}
                      size={Sizes?.l}
                    />
                    <TextComponent
                      text={userData?.personal_details?.professional_bio}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{ lineHeight: 26 }}
                    />
                    <View style={{ ...Styles?.separator, padding: 20 }} />
                  </>
                ) : null}
                {userData?.personal_details?.personal_bio ? (
                  <>
                    <TextComponent text={"Personal bio :"} size={Sizes?.l} />
                    <TextComponent
                      text={userData?.personal_details?.personal_bio}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{ lineHeight: 26 }}
                    />
                  </>
                ) : null}
              </View>
            ) : null}
          </View>
          <View
            style={{
              ...Styles?.container,
              padding: 20,
            }}
          >
            <View
              style={{
                ...Styles?.flexRow,
                ...styling?.headingView,
                marginVertical: 10,
                marginBottom: 20,
              }}
            >
              <TextComponent
                text="Profile Details"
                size={Sizes?.s}
                fontWeight="400"
              />
            </View>
            {userDetail?.map((item) => {
              return (
                <>
                  {item?.name && item?.name?.length != 0 ? (
                    <>
                      <View style={Styles?.flexRow}>
                        <TextComponent
                          text={item?.title}
                          size={Sizes?.l}
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

          <View style={{ height: 30 }} />
        </ScrollView>
      )}
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
  profileImg: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    borderRadius: dimensionheight(100),
    marginVertical: 8,
    // resizeMode: "contain",
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
