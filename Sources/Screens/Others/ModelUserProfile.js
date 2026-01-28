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
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect } from "@react-navigation/native";

export const ModelUserProfile = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [follow, setFollow] = useState(false);
  const [modelData, setModelData] = useState([]);
  const [imagesModal, setImagesModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getModelDetails();
    }, [])
  );

  const getModelDetails = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON?.parse(userId),
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      setModelData(res?.results);
    }
  };

  const reasonList = [
    {
      label: "This is fake",
      value: "very slow",
    },
    {
      label: "Other",
      value: "no quality",
    },
  ];

  const modelDetail = [
    {
      title: "Dress Shirt Size:",
      name: modelData?.measurment?.dress_shirt_size,
    },
    {
      title: "Dress Shirt Sleeve:",
      name: modelData?.measurment?.dress_shirt_sleeve,
    },
    {
      title: "Jacket:",
      name: modelData?.measurment?.jacket,
    },
    {
      title: "Gender :",
      name: modelData?.user_data?.gender,
    },
    {
      title: "Age :",
      name: modelData?.post_meta_details?.age,
    },
    {
      title: "Height:",
      name: modelData?.post_meta_details?.height,
    },
    {
      title: "Hair Color",
      name: modelData?.post_meta_details?.hair_colour,
    },
    {
      title: "Weight:",
      name: modelData?.post_meta_details?.weight,
    },
  ];
  const measurementDetail = [
    {
      title: "Ethnicity :",
      name:
        modelData?.post_meta_details?.ethnicity?.length != 0
          ? modelData?.post_meta_details?.ethnicity
          : [],
    },
    {
      title: "Shirt Size :",
      name:
        modelData?.measurment?.shirt_size?.length != 0
          ? modelData?.measurment?.shirt_size
          : [],
    },
    {
      title: "Pant Size :",
      name:
        modelData?.user_data?.gender != "male" ||
        modelData?.post_meta_details?.freelancer_type == "child"
          ? modelData?.measurment?.pant_size?.length != 0
            ? modelData?.measurment?.pant_size
            : []
          : [],
    },
    {
      title: "Pant Size (Waist):",
      name:
        modelData?.measurment?.pant_size_waist?.length != 0
          ? modelData?.measurment?.pant_size_waist
          : [],
    },
    {
      title: "Pant Size (Length):",
      name:
        modelData?.measurment?.pant_size_length?.length != 0
          ? modelData?.measurment?.pant_size_length
          : [],
    },
    {
      title: "Shoe Size :",
      name:
        modelData?.measurment?.shoe_size?.length != 0
          ? modelData?.measurment?.shoe_size
          : [],
    },
    {
      title: "Dress Size :",
      name:
        modelData?.measurment?.dress_size?.length != 0
          ? modelData?.measurment?.dress_size
          : [],
    },
  ];

  const socialMediaDetail = [
    {
      name: modelData?.social_followers?.facebook_follower,
      link: modelData?.social_followers?.facebook_profile_link,
      // link: "https://www.facebook.com/",
      icon: (
        <Entypo name={"facebook-with-circle"} color={Colors?.pink} size={40} />
      ),
    },
    {
      icon: (
        <Entypo name={"instagram-with-circle"} color={Colors?.pink} size={40} />
      ),
      name: modelData?.social_followers?.instagram_follower,
      link: modelData?.social_followers?.instagram_profile_link,
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

      name: modelData?.social_followers?.twitter_follower,
      link: modelData?.social_followers?.twitter_profile_link,
    },
    {
      icon: (
        <Entypo name={"vimeo-with-circle"} color={Colors?.pink} size={40} />
      ),
      name: modelData?.social_followers?.vimeo_follower,
      link: modelData?.social_followers?.vimeo_profile_link,
    },
    {
      icon: (
        <Entypo name={"youtube-with-circle"} color={Colors?.pink} size={40} />
      ),
      name: modelData?.social_followers?.youtube_follower,
      link: modelData?.social_followers?.youtube_profile_link,
    },
    {
      icon: (
        <View
          style={{
            padding: 6,
            borderRadius: 100,
            backgroundColor: Colors?.pink,
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
      // <MaterialIcons name={"shopping-bag"} {} color={Colors?.pink} size={40} />,
      name: modelData?.social_followers?.tiktok_follower,
      link: modelData?.social_followers?.tiktok_profile_link,
    },
  ];

  return (
    <>
      <Header text={"My Profile"} navigation={navigation} />
      <Loader loading={auth?.isLoading ? auth?.isLoading : other?.isLoading} />
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
              <ImageView
                uri={
                  modelData?.profile_image &&
                  modelData?.profile_image?.length != 0 &&
                  modelData?.profile_image[0] &&
                  modelData?.profile_image[0]?.guid
                    ? modelData?.profile_image[0]?.guid
                    : ""
                }
                style={{
                  ...styling?.profileImg,
                  borderWidth: 2,
                  borderColor: Colors?.lightThemeColor,
                  position: "relative",
                }}
                loading={other?.isLoading}
              />
              <View
                style={{
                  top: 90,
                  // right: 70,
                  position: "absolute",
                  paddingHorizontal: 8,
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
            </TouchableOpacity>
            <TextComponent
              text={
                modelData?.user_data?.display_name
                // +
                // " (" +
                // modelData?.user_data?.gender +
                // ")"
              }
              size={Sizes?.l}
              fontWeight="400"
              style={{ textTransform: "capitalize" }}
            />
          </View>
          {modelData?.post_meta_details?.user_rating && (
            <View
              style={{
                ...Styles?.row,
                justifyContent: "center",
                marginTop: 10,
              }}
            >
              <FontAwesome
                name={"star-half-o"}
                color={Colors?.yellow}
                size={12}
                style={{ paddingHorizontal: 2 }}
              />

              <TextComponent
                text={modelData?.post_meta_details?.user_rating}
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
              />
            </View>
          )}
          <TextComponent
            text={modelData?.user_data?.user_email}
            size={Sizes?.s}
            color={Colors?.blue}
            fontWeight="400"
            style={{ textAlign: "center", paddingVertical: 5 }}
          />

          {/* <TextComponent
            text={"2286 feedback"}
            size={Sizes?.s}
            color={Colors?.darkgrey}
            fontWeight="400"
            style={{ textAlign: "center", paddingVertical: 5 }}
          /> */}
          <TextComponent
            text={`Member since ${moment(
              modelData?.user_data?.post_date
            ).format("Do MMM, YYYY")}`}
            size={Sizes?.s}
            color={Colors?.darkgrey}
            fontWeight="400"
            style={{ textAlign: "center", paddingVertical: 5 }}
          />
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
                modelData?.post_meta_details?.perhour_rate
                  ? modelData?.post_meta_details?.perhour_rate
                  : "0"
              } / hr`}
              size={Sizes?.s}
              color={Colors?.darkgrey}
              fontWeight="400"
              style={{ padding: 4 }}
            />
          </View>
          <View style={Styles?.separator} />
          {modelData?.post_meta_details?.country && (
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
                    modelData?.post_meta_details?.country +
                    " | " +
                    modelData?.post_meta_details?.city
                  }
                  size={Sizes?.xs}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                  style={{ padding: 4 }}
                />
              </View>
            </>
          )}
          {/* <View style={Styles?.separator} />
          <View
            style={{
              ...Styles?.flexRow,
              width: "80%",
              alignSelf: "center",
              marginVertical: 6,
            }}
          >
            <TouchableOpacity
              style={styling.container}
              onPress={() =>
                props?.navigation?.navigate(routeName?.NOTIFICATIONS)
              }
            >
              <Entypo
                name={"facebook-with-circle"}
                color={Colors?.blue}
                size={40}
              />

              <View style={styling.badgeContainer}>
                <TextComponent text={"121"} color={Colors?.white} size={10} />
              </View>
            </TouchableOpacity>

            <Entypo
              name={"instagram-with-circle"}
              color={Colors?.blue}
              size={40}
            />
            <Entypo
              name={"twitter-with-circle"}
              color={Colors?.blue}
              size={40}
            />
            <Entypo
              name={"youtube-with-circle"}
              color={Colors?.blue}
              size={40}
            />
            <Entypo name={"vimeo-with-circle"} color={Colors?.blue} size={40} />
          </View> */}
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
              onPress={() => navigation?.navigate(routeName?.EDIT_PROFILE)}
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
            {modelData?.images_gallery?.length != 0 && (
              <>
                <TouchableOpacity
                  onPress={() => setImagesModal(true)}
                  // onPress={() =>
                  //   navigation?.navigate(routeName?.GALLERY_IMAGES, {
                  //     userId: modelData?.user_data?.user_id,
                  //     images: modelData?.images_gallery,
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
                {imagesModal && (
                  <ViewImages
                    images={modelData?.images_gallery}
                    show={imagesModal}
                    setShow={setImagesModal}
                  />
                )}
              </>
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
                  text={modelData?.project_count_details?.ongoing_project}
                  size={Sizes?.xxl}
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
                  text={modelData?.project_count_details?.complete_project}
                  size={Sizes?.xxl}
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
                  text={modelData?.project_count_details?.cancelled_project}
                  size={Sizes?.xxl}
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
                    modelData?.project_count_details?.followers_count
                      ? modelData?.project_count_details?.followers_count
                      : "0"
                  }
                  size={Sizes?.xxl}
                  color={Colors?.yellow}
                />
                <TextComponent
                  text={"Followers"}
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                />
              </View>
            </View>
          </View>
          <View
            style={{
              ...Styles?.container,
              padding: 5,
              marginHorizontal: 0,
              width: "100%",
            }}
          >
            <FlatList
              data={socialMediaDetail}
              contentContainerStyle={{
                paddingHorizontal: 10,
                paddingBottom: 20,
              }}
              keyExtractor={(item, index) => index}
              renderItem={({ item }) =>
                item?.link || (item?.link && item?.name) ? (
                  <TouchableOpacity
                    onPress={() =>
                      item?.link ? Linking.openURL(item?.link) : null
                    }
                    style={{
                      ...Styles?.container,
                      padding: 5,
                      flex: 1,
                      flexDirection: "column",
                      alignItems: "center",
                      marginHorizontal: 8,
                    }}
                  >
                    {item?.icon}

                    <TextComponent
                      text={item?.name ? item?.name : "0"}
                      size={Sizes?.xs}
                      style={{ marginVertical: 8 }}
                    />
                  </TouchableOpacity>
                ) : null
              }
              numColumns={3}
            />
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

          {modelData?.post_meta_details?.professional_bio != "    " ||
          modelData?.post_meta_details?.personal_bio != "   " ? (
            <View
              style={{
                ...Styles?.container,
                marginHorizontal: 0,
                width: "100%",
                marginTop: 10,
              }}
            >
              {modelData?.post_meta_details?.professional_bio != "" ? (
                <>
                  <TextComponent text={"Professional Bio :"} size={Sizes?.l} />
                  <TextComponent
                    text={modelData?.post_meta_details?.professional_bio}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                    style={{ lineHeight: 26 }}
                  />
                  <View style={{ ...Styles?.separator, padding: 20 }} />
                </>
              ) : null}
              {modelData?.post_meta_details?.personal_bio != "" ? (
                <>
                  <TextComponent text={"Personal bio :"} size={Sizes?.l} />
                  <TextComponent
                    text={modelData?.post_meta_details?.personal_bio}
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
              text="Measurement Details"
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          {measurementDetail?.map((item) => {
            return (
              <>
                {item?.name && item?.name?.length != 0 ? (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        width: "100%",
                      }}
                    >
                      <TextComponent
                        text={item?.title}
                        size={Sizes?.l}
                        fontWeight="400"
                      />
                      <View
                        style={{
                          alignItems: "center",
                          flexDirection: "row",
                          flexWrap: "wrap",
                          width: "50%",
                          justifyContent: "flex-end",
                        }}
                      >
                        {item?.name?.length != 0
                          ? item?.name?.map((ele, index) => {
                              return (
                                <TextComponent
                                  text={
                                    ele?.value
                                      ? item?.name?.length - 1 == index
                                        ? ele?.value
                                        : ele?.value + ", "
                                      : item?.name?.length - 1 == index
                                      ? ele
                                      : ele + ", "
                                  }
                                  size={Sizes?.s}
                                  fontWeight="400"
                                  style={{
                                    textAlign: "right",
                                    // backgroundColor: "red",
                                    // width: 180,
                                  }}
                                />
                              );
                            })
                          : null}
                      </View>
                    </View>
                    <View style={Styles?.separator} />
                  </>
                ) : null}
              </>
            );
          })}
          {modelDetail?.map((item) => {
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
                      />
                    </View>
                    <View style={Styles?.separator} />
                  </>
                ) : null}
              </>
            );
          })}
        </View>
        {modelData?.post_meta_details?.skills_names?.length != 0 && (
          <View
            style={{
              ...Styles?.container,
              padding: 20,
            }}
          >
            <TextComponent
              text={"Skills"}
              size={Sizes?.l}
              style={{ margin: 10 }}
            />

            <ScrollView showsHorizontalScrollIndicator={false} horizontal>
              {modelData?.post_meta_details?.skills_names?.map((ele) => {
                return (
                  <View
                    style={{
                      ...Styles?.smallButton,
                      backgroundColor: Colors?.white,
                      borderWidth: 0.8,
                      borderColor: Colors?.darkgrey,
                      marginHorizontal: 5,
                      marginVertical: 5,
                      paddingVertical: 2,
                      paddingBottom: 2.5,
                    }}
                  >
                    <TextComponent
                      text={ele?.value}
                      color={Colors?.darkgrey}
                      size={Sizes?.s}
                      fontWeight="400"
                      style={{ paddingHorizontal: 8 }}
                    />
                  </View>
                );
              })}
            </ScrollView>
            <View style={{ ...Styles?.separator }} />
          </View>
        )}
        <View style={{ height: 30 }} />
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
  badgeContainer: {
    position: "absolute",
    top: -8,
    right: -8,
    borderRadius: 20,
    minWidth: 20,
    height: 20,
    backgroundColor: Colors?.pink,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#FFF",
    fontSize: 10,
    fontWeight: "bold",
  },
});
