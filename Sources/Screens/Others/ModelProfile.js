import React, { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Linking,
  Dimensions,
  Text,
} from "react-native";
import {
  DropDownList,
  Header,
  ImageView,
  Loader,
  ReportUser,
  Tabs,
  TextComponent,
  ViewImages,
} from "../../Components";
import Modal from "react-native-modal";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { encode as btoa } from "base-64";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import moment from "moment";
import { getData, storageKey } from "../../Utility/Storage";
import {
  blockUser,
  getFollowDetails,
  getModelProjects,
  userFollowing,
} from "../../Redux/Services/OtherServices";
import { getAccountApproval } from "../../Utility";
import { Rating } from "react-native-elements";
import { reasonList } from "../../Global";
import { useHandleMessage } from "../../Utility/FirestoreHelper";
import { ChatContext } from "../../Context/ChatContext";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import ImageViewing from "react-native-image-viewing";
import FastImage from "@d11/react-native-fast-image";
import { ManageAvailability } from "./ManageAvailability";

const screenWidth = Dimensions.get("window").width;
const numColumns = 2;
const imageSize = screenWidth / numColumns - 40;

export const ModelProfile = ({ route, navigation }) => {
  const dispatching = useDispatch();
  const { dispatch: chatDispatch } = useContext(ChatContext);
  const handleMessage = useHandleMessage();

  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  const { modelData, listData, userId } = route?.params || {};

  const [follow, setFollow] = useState(false);
  const [block, setBlock] = useState(false);
  const [tab, setTab] = useState("About");
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [imagesModal, setImagesModal] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [followList, setFollowList] = useState([]);
  const [showFollowers, setShowFollowers] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [projectsType, setProjectsType] = useState("");
  const [projectsList, setProjectsList] = useState([]);
  const [modelUserData, setModelUserData] = useState(modelData || null);
  const [showMoreProfessional, setShowMoreProfessional] = useState(false);
  const [showMorePersonal, setShowMorePersonal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["60%", "90%"], []);

  const talentList = listData?.length > 0 ? listData : [];
  const currentIndex = talentList.findIndex(
    (user) => user?.post_meta_details?.user_id === userId,
  );

  useEffect(() => {
    if (userId && !modelData?.user_data?.user_id) {
      getModelDetails();
    } else {
      setModelUserData(modelData);
    }
  }, [userId, modelData]);

  useEffect(() => {
    getFollowingList();
    getUserData();
    getBlockStatus();
    getAccountApprovalStatus();
  }, [navigation, route]);

  const getModelDetails = async () => {
    var body = {
      user_id: userId,
    };
    let res = await dispatching(getUserDetail(body));
    if (res?.status == 200) {
      setModelUserData(res?.results);
    }
  };

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let body = {
      user_id: modelUserData?.user_data?.user_id,
    };
    let res = await dispatching(getUserDetail(body));
    if (res?.status == 200) {
      setUserData(res?.results?.user_data);
      let followList = res?.results?.post_meta_details?.user_followers;
      if (followList?.length != 0) {
        followList?.filter((item) =>
          userID == item
            ? setFollow(true)
            : userID != item
            ? setFollow(false)
            : setFollow(false),
        );
      } else {
        setFollow(false);
      }
    }
  };

  const getBlockStatus = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let body = {
      user_id: userID,
    };
    let res = await dispatching(getUserDetail(body));
    if (res?.status == 200) {
      let blockList = res?.results?.user_data?.user_blocked_list;
      if (blockList?.length != 0) {
        blockList.filter((item) =>
          item.id != modelUserData?.user_data?.user_id
            ? setBlock(false)
            : item.id == modelUserData?.user_data?.user_id
            ? setBlock(true)
            : setBlock(false),
        );
      } else {
        setBlock(false);
      }
    }
  };

  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
  };

  const handleFollow = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: type,
      user_id: userID,
      post_id: modelUserData?.user_data?.profile_id,
    };
    let res = await dispatching(userFollowing(body));
    if (res?.status == 200) {
      getUserData();
    }
  };

  const handleBlock = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: type,
      user_id: userID,
      post_id: modelUserData?.user_data?.user_id,
    };
    let res = await dispatching(blockUser(body));
    if (res?.status == 200) {
      getBlockStatus();
    }
  };

  const handleMessageClick = async () => {
    setLoading(true);
    if (approvalStatus) {
      const profileImage =
        modelUserData?.profile_image &&
        modelUserData?.profile_image?.length != 0 &&
        modelUserData?.profile_image[0] &&
        modelUserData?.profile_image[0]?.guid;
      const userData = {
        displayName: modelUserData?.user_data?.display_name,
        uid: modelUserData?.user_data?.firebase_udi,
        photoURL: profileImage,
        user_id: modelUserData?.user_data?.user_id,
      };
      dispatch({ type: "CHANGE_USER", payload: userData });
      handleMessage(
        modelUserData?.user_data?.user_email,
        modelUserData?.user_data?.firebase_udi,
        modelUserData?.user_data?.display_name,
        setLoading,
        profileImage,
        modelUserData?.user_data?.user_id,
        modelUserData?.user_data?.user_role,
      );
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };

  const getFollowingList = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: "followers",
      user_id: userID,
      post_id: modelUserData?.user_data?.profile_id,
    };
    let res = await dispatching(getFollowDetails(body));
    if (res?.status == 200) {
      setFollowList(res?.results);
    }
  };

  const handleNext = async () => {
    if (currentIndex < talentList.length - 1) {
      setCurrentUserId(
        talentList[currentIndex + 1]?.post_meta_details?.user_id,
      );
      const body = {
        user_id: talentList[currentIndex + 1]?.post_meta_details?.user_id,
      };
      const res = await dispatching(getUserDetail(body));
      if (res?.status === 200) {
        navigation?.navigate(routeName?.MODEL_PROFILE, {
          modelData: res.results,
          listData: talentList,
        });
      }
    }
  };

  const handlePrevious = async () => {
    if (currentIndex > 0) {
      setCurrentUserId(
        talentList[currentIndex - 1]?.post_meta_details?.user_id,
      );
      const body = {
        user_id: talentList[currentIndex - 1]?.post_meta_details?.user_id,
      };
      const res = await dispatching(getUserDetail(body));
      if (res?.status === 200) {
        navigation?.navigate(routeName?.MODEL_PROFILE, {
          modelData: res.results,
          listData: talentList,
        });
      }
    }
  };

  const getProjectsList = async (type) => {
    setProjectsType(type);
    let modelID = modelUserData?.user_data?.user_id;
    let profileID = modelUserData?.user_data?.profile_id;
    setLoading(true);
    const body = {
      user_id: modelID,
      profile_id: profileID,
      job_status: type,
    };
    const res = await dispatching(getModelProjects(body));
    setLoading(false);
    if (res?.status === 200) {
      setProjectsList(res?.results || []);
      bottomSheetRef.current?.expand();
    }
  };

  const openImages = (index) => {
    setSelectedIndex(index);
    setImagesModal(true);
  };


  const modelDetail = [
    {
      title: "Neck Size:",
      name: modelUserData?.measurment?.neck_size,
    },
    {
      title: "Chest size:",
      name: modelUserData?.measurment?.chest_size,
    },
    {
      title: "Dress Shirt Size:",
      name: modelUserData?.measurment?.dress_shirt_size,
    },
    {
      title: "Dress Shirt Sleeve:",
      name: modelUserData?.measurment?.dress_shirt_sleeve,
    },
    {
      title: "Jacket:",
      name: modelUserData?.measurment?.jacket,
    },
    {
      title: "Gender :",
      name: modelUserData?.user_data?.gender,
    },
    {
      title: "Age :",
      name: modelUserData?.post_meta_details?.age,
    },
    {
      title: "Height:",
      name: modelUserData?.post_meta_details?.height,
    },
    {
      title: "Hair Color",
      name: modelUserData?.post_meta_details?.hair_colour,
    },
    {
      title: "Weight:",
      name: modelUserData?.post_meta_details?.weight,
    },
  ];

  const actorDetail = [
    {
      title: "Occupation:",
      name: modelUserData?.post_meta_details?.occupation,
    },
    {
      title: "How many children do you have?:",
      name: modelUserData?.post_meta_details?.have_children,
    },
    {
      title: "Awards:",
      name: modelUserData?.post_meta_details?.list_awards,
    },
    {
      title: "Tattoo Location:",
      name: modelUserData?.post_meta_details?.tattoo_location,
    },
    {
      title: "Theater Experience:",
      name: modelUserData?.post_meta_details?.theater_exp,
    },
    {
      title: "Member of:",
      name: modelUserData?.post_meta_details?.member_of,
    },
    {
      title: "Education Or Training:",
      name: modelUserData?.post_meta_details?.edu_training,
    },
    {
      title: "Commercial Experience:",
      name: modelUserData?.post_meta_details?.comm_exp,
    },
  ];

  const measurementDetail = [
    {
      title: "Ethnicity :",
      name:
        modelUserData?.post_meta_details?.ethnicity?.length != 0
          ? modelUserData?.post_meta_details?.ethnicity
          : [],
    },
    {
      title: "Shirt Size :",
      name:
        modelUserData?.measurment?.shirt_size?.length != 0
          ? modelUserData?.measurment?.shirt_size
          : [],
    },
    {
      title: "Pant Size :",
      name:
        modelUserData?.user_data?.gender != "male" ||
        modelUserData?.post_meta_details?.freelancer_type == "child"
          ? modelUserData?.measurment?.pant_size?.length != 0
            ? modelUserData?.measurment?.pant_size
            : []
          : [],
    },
    {
      title: "Pant Size (Waist):",
      name:
        modelUserData?.measurment?.pant_size_waist?.length != 0
          ? modelUserData?.measurment?.pant_size_waist
          : [],
    },
    {
      title: "Pant Size (Length):",
      name:
        modelUserData?.measurment?.pant_size_length?.length != 0
          ? modelUserData?.measurment?.pant_size_length
          : [],
    },
    {
      title: "Shoe Size :",
      name:
        modelUserData?.measurment?.shoe_size?.length != 0
          ? modelUserData?.measurment?.shoe_size
          : [],
    },
    {
      title: "Dress Size :",
      name:
        modelUserData?.measurment?.dress_size?.length != 0
          ? modelUserData?.measurment?.dress_size
          : [],
    },
  ];

  const socialMediaDetail = [
    {
      name: modelUserData?.social_followers?.facebook_follower,
      link: modelUserData?.social_followers?.facebook_profile_link,
      icon: (
        <Entypo name={"facebook-with-circle"} color={Colors?.pink} size={40} />
      ),
    },
    {
      icon: (
        <Entypo name={"instagram-with-circle"} color={Colors?.pink} size={40} />
      ),
      name: modelUserData?.social_followers?.instagram_follower,
      link: modelUserData?.social_followers?.instagram_profile_link,
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
            }}
          />
        </View>
      ),
      name: modelUserData?.social_followers?.twitter_follower,
      link: modelUserData?.social_followers?.twitter_profile_link,
    },
    {
      icon: (
        <Entypo name={"vimeo-with-circle"} color={Colors?.pink} size={40} />
      ),
      name: modelUserData?.social_followers?.vimeo_follower,
      link: modelUserData?.social_followers?.vimeo_profile_link,
    },
    {
      icon: (
        <Entypo name={"youtube-with-circle"} color={Colors?.pink} size={40} />
      ),
      name: modelUserData?.social_followers?.youtube_follower,
      link: modelUserData?.social_followers?.youtube_profile_link,
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
            style={{
              height: 25,
              width: 25,
              tintColor: Colors?.white,
            }}
          />
        </View>
      ),
      name: modelUserData?.social_followers?.tiktok_follower,
      link: modelUserData?.social_followers?.tiktok_profile_link,
    },
  ];

  const dataTabs = [
    {
      title: "About",
      show: true,
    },
    { title: "Gallery", show: true },
    { title: "Portfolio", show: true },
    { title: "Social Post", show: true },
    {
      title: "Digitals",
      show: modelUserData?.user_data?.user_role == 15 ? true : false,
    },
    { title: "Availability", show: true },
  ];

  const professionalBio =
    modelUserData?.post_meta_details?.professional_bio?.replace(/\n/g, "") ||
    "";
  const personalBio =
    modelUserData?.post_meta_details?.personal_bio?.replace(/\n/g, "") || "";
  const hasAnyBio = professionalBio || personalBio;
  const MAX_LENGTH = 300;

  const renderRightHeader = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          justifyContent: "flex-end",
        }}
      >
        <TouchableOpacity onPress={() => handlePrevious()}>
          <Entypo
            name="chevron-with-circle-left"
            size={30}
            color={Colors?.darkgrey}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleNext()}>
          <Entypo
            name="chevron-with-circle-right"
            size={30}
            color={Colors?.themeColor}
            style={{ marginHorizontal: 12 }}
          />
        </TouchableOpacity>
      </View>
    );
  };

  const loader = other?.isLoading || auth?.isLoading || loading;

  return (
    <>
      <Header
        text={modelUserData?.user_data?.display_name}
        navigation={navigation}
        rightHeader={talentList?.length != 0 ? renderRightHeader : null}
      />
      <Loader loading={loader} />

      <ScrollView nestedScrollEnabled>
        <View style={{ ...Styles?.container }}>
          <View style={{ alignItems: "center" }}>
            <View>
              <ImageView
                uri={
                  modelUserData?.profile_image &&
                  modelUserData?.profile_image?.length != 0 &&
                  modelUserData?.profile_image[0] &&
                  modelUserData?.profile_image[0]?.guid
                    ? modelUserData?.profile_image[0]?.guid
                    : ""
                }
                style={{
                  ...styling?.profileImg,
                }}
                loading={loader}
              />
              <TextComponent
                text={modelUserData?.user_data?.display_name}
                size={Sizes?.l}
                style={{
                  textTransform: "capitalize",
                  textAlign: "center",
                }}
              />
            </View>

            {modelUserData?.post_meta_details?.user_rating > 0 && (
              <>
                <View
                  style={{
                    ...Styles?.row,
                    marginVertical: 8,
                    justifyContent: "center",
                  }}
                >
                  <Rating
                    imageSize={15}
                    readonly
                    startingValue={
                      modelUserData?.post_meta_details?.user_rating == ""
                        ? 0
                        : modelUserData?.post_meta_details?.user_rating
                    }
                    style={{
                      paddingHorizontal: 10,
                    }}
                  />
                </View>
                <TextComponent
                  text={`${parseFloat(
                    modelUserData?.post_meta_details?.user_rating,
                  )}/5 (0 Feedback)`}
                  size={Sizes?.xs}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                />
                <View style={{ ...Styles?.separator }} />
              </>
            )}

            <View style={{ paddingHorizontal: 10, alignItems: "center" }}>
              {modelUserData?.user_data?.hourly_rate_status == 0 ? (
                <>
                  <View
                    style={{
                      ...Styles?.row,
                      paddingHorizontal: 10,
                    }}
                  >
                    <Image
                      source={Images?.dollarCash}
                      style={{ width: 20, height: 20 }}
                    />
                    <TextComponent
                      text={`$${
                        modelUserData?.post_meta_details?.perhour_rate
                          ? modelUserData?.post_meta_details?.perhour_rate
                          : "0"
                      } / hr`}
                      size={Sizes?.xs}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{ padding: 4 }}
                    />
                  </View>
                </>
              ) : null}

              {modelUserData?.post_meta_details?.country && (
                <>
                  <View
                    style={{
                      ...Styles?.row,
                      paddingVertical: 2,
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
                        modelUserData?.post_meta_details?.country +
                        " | " +
                        modelUserData?.post_meta_details?.city
                      }
                      size={Sizes?.xs}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{ padding: 4 }}
                    />
                  </View>
                </>
              )}
            </View>
          </View>

          {modelUserData?.post_meta_details?.tag_line && (
            <>
              <View style={Styles?.separator} />
              <TextComponent
                text={modelUserData?.post_meta_details?.tag_line}
                size={Sizes?.s}
                fontWeight="400"
                style={{ textAlign: "center", lineHeight: 22 }}
              />
            </>
          )}

          {!loader && userId != modelUserData?.user_data?.user_id ? (
            <>
              <View style={Styles?.separator} />
              <View
                style={{
                  ...Styles?.row,
                  width: "100%",
                  justifyContent: "center",
                  marginBottom: 10,
                }}
              >
                {!block && (
                  <TouchableOpacity
                    onPress={() =>
                      approvalStatus
                        ? follow
                          ? handleFollow("unfollow")
                          : handleFollow("follow")
                        : getAccountApproval(true, navigation, auth)
                    }
                    style={{
                      ...Styles?.smallButton,
                      backgroundColor: Colors?.pink,
                    }}
                  >
                    <TextComponent
                      text={follow ? "Following" : "+ Follow"}
                      color={Colors?.white}
                      size={Sizes?.xs}
                      fontWeight="400"
                      style={{ paddingHorizontal: 4 }}
                    />
                  </TouchableOpacity>
                )}
                <TouchableOpacity
                  onPress={() =>
                    approvalStatus
                      ? block
                        ? handleBlock("unblock")
                        : handleBlock("block")
                      : getAccountApproval(true, navigation, auth)
                  }
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.black,
                    marginHorizontal: 10,
                  }}
                >
                  <TextComponent
                    text={block ? "Unblock" : "Block"}
                    color={Colors?.white}
                    size={Sizes?.xs}
                    fontWeight="400"
                    style={{ paddingHorizontal: 4 }}
                  />
                </TouchableOpacity>
                {!block && (
                  <>
                    <TouchableOpacity
                      onPress={() => handleMessageClick()}
                      style={{
                        ...Styles?.smallButton,
                        backgroundColor: Colors?.yellow,
                      }}
                    >
                      <TextComponent
                        text="Message"
                        color={Colors?.white}
                        size={Sizes?.xs}
                        fontWeight="400"
                        style={{ paddingHorizontal: 4 }}
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => setModalVisible(true)}
                      style={{
                        ...Styles?.smallButton,
                        backgroundColor: Colors?.blue,
                        marginHorizontal: 10,
                      }}
                    >
                      <TextComponent
                        text="Book Now"
                        color={Colors?.white}
                        size={Sizes?.xs}
                        fontWeight="400"
                        style={{ paddingHorizontal: 4, paddingVertical: 2 }}
                      />
                    </TouchableOpacity>
                  </>
                )}
              </View>
            </>
          ) : null}
        </View>

        {!block && (
          <View
            style={{
              ...Styles?.container,
              padding: 0,
            }}
          >
            <View
              style={{
                ...Styles?.container,
                marginTop: 0,
                marginHorizontal: 0,
                width: "100%",
                ...Styles?.flexRow,
                flexDirection: "row",
                justifyContent: "center",
                flexWrap: "wrap",
              }}
            >
              {dataTabs?.map((item, index) => {
                return item?.show ? (
                  <TouchableOpacity
                    key={index}
                    onPress={() => {
                      setTab(item?.title);
                      if (item?.path) {
                        navigation?.navigate(item?.path, {
                          userId: modelUserData?.user_data?.user_id,
                          type:
                            item?.title == "Portfolio" ? "portfolio" : "social",
                        });
                      }
                    }}
                    style={{
                      ...Styles?.smallButton,
                      backgroundColor:
                        tab == item?.title
                          ? Colors?.themeColor
                          : Colors?.lightGray,
                      marginHorizontal: 2,
                      marginBottom: 10,
                      borderRadius: 15,
                    }}
                  >
                    <TextComponent
                      text={item?.title}
                      color={
                        tab == item?.title ? Colors?.white : Colors?.darkgrey
                      }
                      size={Sizes?.s}
                      style={{
                        textDecorationLine:
                          tab == item?.title ? "underline" : "none",
                      }}
                    />
                  </TouchableOpacity>
                ) : null;
              })}
            </View>

            {tab == "About" ? (
              <>
                {!block ? (
                  <>
                    <View
                      style={{
                        ...Styles?.container,
                        marginHorizontal: 0,
                        width: "100%",
                      }}
                    >
                      <View style={{ ...Styles?.flexRow, paddingVertical: 15 }}>
                        <TouchableOpacity
                          onPress={() =>
                            modelUserData?.project_count_details
                              ?.ongoing_project > 0
                              ? openProjects("ongoing")
                              : null
                          }
                          style={{
                            alignItems: "center",
                            width: "50%",
                          }}
                        >
                          <TextComponent
                            text={
                              modelUserData?.project_count_details
                                ?.ongoing_project
                            }
                            size={Sizes?.xxl}
                            color={Colors?.themeColor}
                          />
                          <TextComponent
                            text={"Ongoing Projects"}
                            size={Sizes?.xs}
                            color={Colors?.darkgrey}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={() =>
                            modelUserData?.project_count_details
                              ?.complete_project > 0
                              ? openProjects("completed")
                              : null
                          }
                          style={{ alignItems: "center", width: "50%" }}
                        >
                          <TextComponent
                            text={
                              modelUserData?.project_count_details
                                ?.complete_project
                            }
                            size={Sizes?.xxl}
                            color={Colors?.blue}
                          />
                          <TextComponent
                            text={"Completed Projects"}
                            size={Sizes?.xs}
                            color={Colors?.darkgrey}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={{ ...Styles?.flexRow, paddingVertical: 15 }}>
                        <TouchableOpacity
                          onPress={() =>
                            modelUserData?.project_count_details
                              ?.cancelled_project > 0
                              ? openProjects("cancelled")
                              : null
                          }
                          style={{ alignItems: "center", width: "50%" }}
                        >
                          <TextComponent
                            text={
                              modelUserData?.project_count_details
                                ?.cancelled_project
                            }
                            size={Sizes?.xxl}
                            color={Colors?.pink}
                          />
                          <TextComponent
                            text={"Cancelled Projects"}
                            size={Sizes?.xs}
                            color={Colors?.darkgrey}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={{ alignItems: "center", width: "50%" }}
                          onPress={() =>
                            followList?.length != 0 ? openFollowers() : null
                          }
                        >
                          <TextComponent
                            text={
                              modelUserData?.project_count_details
                                ?.followers_count
                                ? modelUserData?.project_count_details
                                    ?.followers_count
                                : "0"
                            }
                            size={Sizes?.xxl}
                            color={Colors?.yellow}
                          />
                          <TextComponent
                            text={"Followers"}
                            size={Sizes?.xs}
                            color={Colors?.darkgrey}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {modelUserData?.user_data?.subscription_pro_id != "107" && (
                      <View
                        style={{
                          ...Styles?.container,
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
                          keyExtractor={(item, index) => index.toString()}
                          renderItem={({ item }) =>
                            item?.link || (item?.link && item?.name) ? (
                              <TouchableOpacity
                                onPress={() =>
                                  item?.link
                                    ? Linking.openURL(item?.link)
                                    : null
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
                          numColumns={2}
                        />
                      </View>
                    )}

                    {hasAnyBio ? (
                      <View
                        style={{
                          ...Styles?.container,
                          marginHorizontal: 0,
                          width: "100%",
                        }}
                      >
                        {/* Professional Bio */}
                        {professionalBio ? (
                          <>
                            <TextComponent
                              text="Professional Bio :"
                              size={Sizes?.l}
                            />
                            <TextComponent
                              text={
                                showMoreProfessional ||
                                professionalBio.length <= MAX_LENGTH
                                  ? professionalBio
                                  : professionalBio.slice(0, MAX_LENGTH) + "..."
                              }
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ lineHeight: 26 }}
                            />
                            {professionalBio.length > MAX_LENGTH && (
                              <TouchableOpacity
                                onPress={() =>
                                  setShowMoreProfessional(!showMoreProfessional)
                                }
                              >
                                <TextComponent
                                  text={
                                    showMoreProfessional
                                      ? "Read Less"
                                      : "Read More"
                                  }
                                  color={
                                    showMoreProfessional
                                      ? Colors?.darkgrey
                                      : Colors?.blue
                                  }
                                  size={Sizes?.s}
                                  fontWeight="600"
                                />
                              </TouchableOpacity>
                            )}
                          </>
                        ) : null}

                        {/* Personal Bio */}
                        {personalBio ? (
                          <>
                            <View
                              style={{ ...Styles?.separator, padding: 20 }}
                            />
                            <TextComponent
                              text="Personal Bio :"
                              size={Sizes?.l}
                            />
                            <TextComponent
                              text={
                                showMorePersonal ||
                                personalBio.length <= MAX_LENGTH
                                  ? personalBio
                                  : personalBio.slice(0, MAX_LENGTH) + "..."
                              }
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ lineHeight: 26 }}
                            />
                            {personalBio.length > MAX_LENGTH && (
                              <TouchableOpacity
                                onPress={() =>
                                  setShowMorePersonal(!showMorePersonal)
                                }
                              >
                                <TextComponent
                                  text={
                                    showMorePersonal ? "Read Less" : "Read More"
                                  }
                                  color={
                                    showMorePersonal
                                      ? Colors?.darkgrey
                                      : Colors?.blue
                                  }
                                  size={Sizes?.s}
                                  fontWeight="600"
                                />
                              </TouchableOpacity>
                            )}
                          </>
                        ) : null}
                      </View>
                    ) : null}

                    {modelUserData?.user_data?.user_role == 15 && (
                      <View
                        style={{
                          ...Styles?.container,
                          marginHorizontal: 0,
                          width: "100%",
                        }}
                      >
                        {modelUserData?.post_meta_details
                          ?.about_you_nobody_knows && (
                          <>
                            <TextComponent
                              text={
                                "Three things about you that no one knows :"
                              }
                              size={Sizes?.l}
                            />
                            <TextComponent
                              text={modelUserData?.post_meta_details?.about_you_nobody_knows.replace(
                                /\n/g,
                                "",
                              )}
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ lineHeight: 26 }}
                            />
                          </>
                        )}
                        {modelUserData?.post_meta_details
                          ?.reality_show_yourself_why && (
                          <>
                            <View
                              style={{ ...Styles?.separator, padding: 20 }}
                            />
                            <TextComponent
                              text={
                                "What reality show can you see yourself on and why? :"
                              }
                              size={Sizes?.l}
                            />
                            <TextComponent
                              text={modelUserData?.post_meta_details?.reality_show_yourself_why.replace(
                                /\n/g,
                                "",
                              )}
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ lineHeight: 26 }}
                            />
                          </>
                        )}
                        {modelUserData?.post_meta_details
                          ?.reality_show_yourself_why && (
                          <>
                            <View
                              style={{ ...Styles?.separator, padding: 20 }}
                            />
                            <TextComponent
                              text={
                                "Have you ever been on a reality show? If yes, which show and when? :"
                              }
                              size={Sizes?.l}
                            />
                            <TextComponent
                              text={modelUserData?.post_meta_details?.reality_show_what_when.replace(
                                /\n/g,
                                "",
                              )}
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ lineHeight: 26 }}
                            />
                          </>
                        )}
                        {modelUserData?.post_meta_details
                          ?.reality_show_yourself_why && (
                          <>
                            <View
                              style={{ ...Styles?.separator, padding: 20 }}
                            />
                            <TextComponent
                              text={
                                "What reality show can you see yourself on and why? :"
                              }
                              size={Sizes?.l}
                            />
                            <TextComponent
                              text={modelUserData?.post_meta_details?.reality_show_what_when.replace(
                                /\n/g,
                                "",
                              )}
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ lineHeight: 26 }}
                            />
                          </>
                        )}
                      </View>
                    )}

                    <View
                      style={{
                        ...Styles?.container,
                        marginHorizontal: 0,
                        width: "100%",
                      }}
                    >
                      <TextComponent
                        text={"Measurement Details"}
                        size={Sizes.l}
                        fontWeight={"600"}
                        style={{ marginBottom: 20 }}
                      />
                      {measurementDetail?.map((item, idx) => {
                        if (!item?.name?.length) return null;
                        const values = item?.name
                          ?.map((ele) =>
                            typeof ele === "object" ? ele?.value : ele,
                          )
                          ?.filter(Boolean)
                          ?.join(", ");
                        return (
                          <View key={idx}>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                flexWrap: "wrap",
                              }}
                            >
                              <TextComponent
                                text={item?.title}
                                size={Sizes.l}
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
                                <TextComponent
                                  text={values}
                                  size={Sizes.s}
                                  fontWeight="400"
                                  color={Colors.darkgrey}
                                  style={{ textAlign: "right" }}
                                />
                              </View>
                            </View>
                            <View style={Styles.separator} />
                          </View>
                        );
                      })}

                      {modelDetail?.map((item) => {
                        return (
                          <>
                            {item?.name && item?.name?.length != 0 ? (
                              <>
                                <View
                                  style={{
                                    ...Styles?.flexRow,
                                    flexWrap: "wrap",
                                  }}
                                >
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
                                    style={{ textTransform: "capitalize" }}
                                  />
                                </View>
                                <View style={Styles?.separator} />
                              </>
                            ) : null}
                          </>
                        );
                      })}

                      {modelUserData?.user_data?.user_role == 15 && (
                        <>
                          {actorDetail?.map((item) => {
                            return (
                              <>
                                {item?.name && item?.name?.length != 0 ? (
                                  <>
                                    <View
                                      style={{
                                        ...Styles?.flexRow,
                                        flexWrap: "wrap",
                                      }}
                                    >
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
                        </>
                      )}
                    </View>

                    {modelUserData?.post_meta_details?.skills_names?.length !=
                      0 && (
                      <View
                        style={{
                          ...Styles?.container,
                          marginHorizontal: 0,
                          width: "100%",
                        }}
                      >
                        <TextComponent
                          text={"Skills"}
                          size={Sizes?.l}
                          style={{ margin: 10 }}
                        />
                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                          nestedScrollEnabled
                        >
                          {modelUserData?.post_meta_details?.skills_names?.map(
                            (ele) => {
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
                            },
                          )}
                        </ScrollView>
                        <View style={{ ...Styles?.separator }} />
                      </View>
                    )}
                  </>
                ) : null}
              </>
            ) : tab == "Gallery" ? (
              <>
                {modelUserData?.images_gallery?.length == 0 ? (
                  <TextComponent
                    text={"No Gallery Found"}
                    size={Sizes?.l}
                    style={{ textAlign: "center", padding: 20 }}
                  />
                ) : (
                  <View
                    style={{
                      marginTop: 15,
                      flexDirection: "row",
                      flexWrap: "wrap",
                      justifyContent: "center",
                    }}
                  >
                    {modelUserData?.images_gallery?.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => openImages(index)}
                        >
                          <FastImage
                            source={{ uri: item?.url }}
                            style={styling.image}
                            transition={false}
                          />
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            ) : tab == "Digitals" ? (
              <>
                {modelUserData?.measument_gallery?.length == 0 ? (
                  <TextComponent
                    text={"No Digitals Found"}
                    size={Sizes?.l}
                    style={{ textAlign: "center", padding: 20 }}
                  />
                ) : (
                  <View
                    style={{
                      marginTop: 15,
                      flexDirection: "row",
                      flexWrap: "wrap",
                    }}
                  >
                    {modelUserData?.measument_gallery?.map((item, index) => {
                      return (
                        <TouchableOpacity
                          key={index}
                          onPress={() => openImages(index)}
                        >
                          <FastImage
                            source={{ uri: item?.value }}
                            style={styling.image}
                            transition={false}
                          />
                          <View style={styling.infoOverlay}>
                            <TextComponent
                              text={" ◉ " + item?.label}
                              size={Sizes.s}
                              color={Colors.white}
                              style={{
                                ...styling.shadowText,
                                textAlign: "center",
                              }}
                            />
                          </View>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </>
            ) : tab == "Availability" ? (
              <View style={{ marginVertical: 10 }}>
                <ManageAvailability
                  userId={modelUserData?.user_data?.user_id}
                  readonly={true}
                />
              </View>
            ) : null}
          </View>
        )}
        <View
          style={{
            ...Styles?.container,
            padding: 20,
            marginBottom: 20,
          }}
        >
          <ReportUser
            type="freelancer"
            reasonList={reasonList}
            reportUserID={modelUserData?.user_id}
          />
        </View>
      </ScrollView>

      {/* Shared Bottom Sheet for all modals */}
      <BottomSheet
        ref={bottomSheetRef}
        index={-1}
        snapPoints={["60%", "90%"]}
        enablePanDownToClose
        backdropComponent={(props) => (
          <BottomSheetBackdrop
            {...props}
            disappearsOnIndex={-1}
            appearsOnIndex={0}
            opacity={0.5}
          />
        )}
        backgroundStyle={{ backgroundColor: Colors.white }}
        onClose={() => {
          setShowFollowers(false);
          setShowProjectsModal(false);
        }}
      >
        {showFollowers && (
          <FollowersContent
            userList={followList}
            navigation={navigation}
            onClose={() => bottomSheetRef.current?.close()}
          />
        )}

        {showProjectsModal && (
          <ProjectsContent
            projectsList={projectsList}
            type={projectsType}
            navigation={navigation}
            onClose={() => bottomSheetRef.current?.close()}
          />
        )}
      </BottomSheet>

      {/* Image Zoom Modal */}
      {imagesModal && selectedIndex >= 0 && (
        <ImageViewing
          images={modelUserData?.images_gallery?.map((img) => ({
            uri: img.url,
          }))}
          imageIndex={selectedIndex}
          visible={imagesModal}
          onRequestClose={() => setImagesModal(false)}
        />
      )}

      {/* Book Now Info Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styling.modalContainer}>
          <View style={styling.modalContent}>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              style={styling.closeIcon}
            >
              <Ionicons name="ios-close" size={24} color="black" />
            </TouchableOpacity>
            <TextComponent
              text={"Info"}
              size={Sizes?.l}
              style={styling.modalTitle}
            />
            <TextComponent
              text={
                "You will be redirected to the Book Sculp official website for the booking."
              }
              size={Sizes?.s}
              style={styling.modalDescription}
              fontWeight="400"
            />
            <TouchableOpacity
              style={styling.yesButton}
              onPress={() => {
                const url = `https://booksculp.com/talentprofile?id=${btoa(
                  modelUserData?.user_data?.user_id,
                )}`;
                console.log("urlurlurlurlurlurlurl-------", url);
                Linking.openURL(url);
                setModalVisible(false);
              }}
            >
              <TextComponent
                text={"Go"}
                color={Colors?.white}
                size={Sizes?.s}
                style={styling.yesButtonText}
                fontWeight="400"
              />
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

// Bottom Sheet Content Components
const FollowersContent = ({ userList, navigation, onClose }) => {
  const handleUserInfo = async (item) => {
    // Your existing navigation logic based on role
    onClose();
  };

  return (
    <FlatList
      data={userList}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleUserInfo(item)}
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
        >
          <ImageView
            uri={item?.profile_img}
            style={{
              ...styling.profile_img,
              borderWidth: 3,
              borderColor: Colors?.lightThemeColor,
            }}
          />
          <TextComponent
            text={item?.full_name}
            size={Sizes?.s}
            fontWeight="400"
            style={{ marginLeft: 10 }}
          />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <TextComponent text="No followers yet" size={Sizes.l} />
      }
    />
  );
};

const ProjectsContent = ({ projectsList, type, navigation, onClose }) => {
  const handleUserInfo = async (item) => {
    // Your existing navigation logic
    onClose();
  };

  return (
    <FlatList
      data={projectsList || []}
      keyExtractor={(_, index) => index.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          onPress={() => handleUserInfo(item)}
          style={{
            paddingVertical: 12,
            borderBottomWidth: 1,
            borderColor: Colors.lightGray,
          }}
        >
          <TextComponent
            text={item?.profile?.post_title}
            size={Sizes.m}
            fontWeight="600"
          />
          <TextComponent
            text={`Duration: ${item?.post_meta_details?.starting_date} to ${item?.post_meta_details?.end_date}`}
            size={Sizes.s}
            color={Colors.darkgrey}
          />
          {type !== "completed" && item?.profile?.post_content && (
            <TextComponent
              text={item?.profile?.post_content}
              size={Sizes.s}
              fontWeight="400"
            />
          )}
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <TextComponent text={`No ${type} projects`} size={Sizes.l} />
      }
    />
  );
};

const styling = StyleSheet.create({
  containerContent: { flex: 1 },
  Modal: {
    backgroundColor: Colors?.white,
    top: 160,
  },
  containerHeader: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    // height: 100,
    backgroundColor: Colors?.lightThemeColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    top: 50,
  },
  profile_img: {
    resizeMode: "contain",
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors?.white,
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  userContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    width: "100%",
  },
  userImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  userName: {
    fontSize: 18,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    width: "40%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 5,
  },
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
    width: dimensionheight(15),
    height: dimensionheight(15),
    borderRadius: 10,
    borderWidth: 5,
    borderColor: Colors?.lightGray,
    marginVertical: 3,
    resizeMode: "cover",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    marginBottom: 20,
  },
  yesButton: {
    alignSelf: "flex-end",
    backgroundColor: Colors?.blue,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesButtonText: {
    color: "white",
  },

  image: {
    width: imageSize,
    height: imageSize + 100,
    borderRadius: 8,
    margin: 5,
  },
  infoOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    bottom: 2,
    width: imageSize - 1,
    paddingVertical: 10,
    borderBottomEndRadius: 8,
    borderBottomStartRadius: 8,
    alignSelf: "center",
  },
  shadowText: {
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -2, height: 0 },
    textShadowRadius: 5,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-between",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 6,
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginLeft: 4,
  },
  activeButton: {
    backgroundColor: "#ddd",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedCell: {
    backgroundColor: Colors?.lightBlue,
    borderRadius: 8,
  },
  eventCell: {
    backgroundColor: "red",
    borderRadius: 8,
  },
});
