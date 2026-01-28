import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  DropDownList,
  Header,
  Loader,
  NoDataFound,
  TextComponent,
} from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import AntDesign from "react-native-vector-icons/AntDesign";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import { useDispatch, useSelector } from "react-redux";
import {
  blockUser,
  getFollowDetails,
  userFollowing,
} from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";

export const FollowDetails = ({ navigation }) => {
  const [tab, setTab] = useState(1);
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const [followList, setFollowList] = useState("");
  const [followedID, setFollowedID] = useState("");
  const [profileID, setProfileID] = useState("");
  const [emptyList, setEmptyList] = useState(false);

  useEffect(() => {
    getUserData();
  }, []);

  const getUserData = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON?.parse(userID),
    };
    let response = await dispatch(getUserDetail(body));
    if (response?.status == 200) {
      setProfileID(response?.results?.user_data?.profile_id);
      getFollowingList(
        "followers",
        1,
        response?.results?.user_data?.profile_id
      );
    }
  };
  const getFollowingList = async (type, tab, profile_id) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: type,
      user_id: userID,
      post_id: profile_id ? profile_id : profileID,
    };
    let res = await dispatch(getFollowDetails(body));
    if (res?.status == 200) {
      setTab(tab);
      setFollowList(res?.results);
      if (res?.results?.length == 0) {
        setEmptyList(true);
      } else {
        setEmptyList(false);
      }
    } else {
      setEmptyList(true);
    }
  };
  const handleFollow = async (type, data) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: type,
      user_id: userID,
      post_id: data?.profile_id,
    };
    let res = await dispatch(userFollowing(body));
    if (res?.status == 200) {
      if (tab == 1) {
        if (type == "follow" || type == "remove" || type == "unfollow") {
          getFollowingList("followers", 1);
        }
      } else if (tab == 2) {
        if (type == "unfollow") {
          getFollowingList("following", 2);
        }
      } else if (tab == 3) {
        if (type == "accept" || type == "decline") {
          getFollowingList("requests", 3);
        }
      } else if (tab == 4) {
        if (type == "accept" || type == "decline") {
          getFollowingList("blocked", 4);
        }
      }
    }
  };

  return (
    <>
      <Header text={"Follow Details"} navigation={navigation} />
      <Loader loading={other?.isLoading} />
      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            marginTop: 10,
            marginHorizontal: 5,
            ...Styles?.boxShadow,
          }}
        >
          <TouchableOpacity
            onPress={() => getFollowingList("followers", 1)}
            style={{
              ...Styles?.tabButton,
              width: 105,
              backgroundColor: tab == 1 ? Colors?.themeColor : Colors?.white,
              margin: 5,
            }}
          >
            <TextComponent
              text={"Followers"}
              size={Sizes.s}
              fontWeight="400"
              color={tab == 1 ? Colors?.white : Colors?.themeColor}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => getFollowingList("following", 2)}
            style={{
              ...Styles?.tabButton,
              width: 105,
              backgroundColor: tab == 2 ? Colors?.themeColor : Colors?.white,
              margin: 5,
            }}
          >
            <TextComponent
              text={"Following"}
              size={Sizes.s}
              fontWeight="400"
              color={tab == 2 ? Colors?.white : Colors?.themeColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => getFollowingList("requests", 3)}
            style={{
              ...Styles?.tabButton,
              width: 105,
              backgroundColor: tab == 3 ? Colors?.themeColor : Colors?.white,
              margin: 5,
            }}
          >
            {/* <View
            style={{
              borderRadius: 100,
              backgroundColor: Colors?.pink,
              width: 18,
              height: 18,
              marginRight: 5,
            }}
          >
            <TextComponent
              text="3"
              size={Sizes.xs}
              fontWeight="400"
              color={Colors?.white}
              style={{ textAlign: "center" }}
            />
          </View> */}
            <TextComponent
              text="Requests"
              size={Sizes.s}
              fontWeight="400"
              color={tab == 3 ? Colors?.white : Colors?.themeColor}
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => getFollowingList("blocked", 4)}
            style={{
              ...Styles?.tabButton,
              width: 105,
              backgroundColor: tab == 4 ? Colors?.themeColor : Colors?.white,
              margin: 5,
            }}
          >
            <TextComponent
              text="Blocked"
              size={Sizes.s}
              fontWeight="400"
              color={tab == 4 ? Colors?.white : Colors?.themeColor}
            />
          </TouchableOpacity>
        </ScrollView>
        <ScrollView>
          {other?.isLoading ? null : followList?.length != 0 ? (
            followList?.map((item) => {
              return (
                <>
                  {tab != 4 ? (
                    <RequestCard
                      cardData={item}
                      tab={tab}
                      handleFollow={handleFollow}
                      followedID={followedID}
                      setFollowedID={setFollowedID}
                      navigation={navigation}
                    />
                  ) : (
                    <BlockedCard
                      cardData={item}
                      tab={tab}
                      setTab={setTab}
                      navigation={navigation}
                      getFollowingList={getFollowingList}
                    />
                  )}
                </>
              );
            })
          ) : (
            <NoDataFound emptyList={emptyList} />
          )}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </>
  );
};

const RequestCard = (props) => {
  const {
    cardData,
    tab,
    handleFollow,
    setFollowedID,
    followedID,
    navigation,
  } = props;
  const [expendView, setExpendView] = useState(false);
  const other = useSelector((state) => state?.otherReducer);
  const dispatch = useDispatch();
  const handleUserInfo = async () => {
    var body = {
      user_id: cardData?.id,
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      if (cardData?.user_role == 11 || cardData?.user_role == 15) {
        navigation?.navigate(routeName?.MODEL_PROFILE, {
          modelData: res?.results,
        });
      } else if (cardData?.user_role == 12) {
        navigation?.navigate(routeName?.CLIENT_PROFILE, {
          userId: cardData?.id,
        });
      } else if (cardData?.user_role == 13) {
        navigation?.navigate(routeName?.PHOTOGRAPHER_PROFILE, {
          userId: cardData?.id,
        });
      }
    }
  };
  return (
    <>
      <TouchableOpacity
        style={{
          ...Styles?.container,
          padding: 10,
          ...Styles?.flexRow,
          marginHorizontal: 10,
          width: "95%",
          opacity: cardData?.pause_status == 0 ? null : 0.4,
          // backgroundColor:
          //   cardData?.pause_status != 0 ? Colors?.white : Colors?.offWhite,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            cardData?.pause_status == 0 ? handleUserInfo() : null
          }
          style={{
            flexDirection: "row",
            width: "75%",
            paddingHorizontal: 10,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {cardData?.profile_img ? (
            <Image
              source={{ uri: cardData?.profile_img }}
              style={styling?.profileImg}
            />
          ) : (
            <FontAwesome
              name="user-circle-o"
              size={50}
              color={Colors?.gredient}
            />
          )}
          <View>
            <TextComponent
              text={cardData?.full_name}
              size={Sizes?.s}
              fontWeight="400"
              style={{ paddingHorizontal: 10, width: "100%" }}
            />
            {tab == 1 || tab == 2 ? (
              <View
                style={{ ...Styles?.row, paddingVertical: 2, width: "85%" }}
              >
                <Image
                  source={Images?.locationIcon}
                  style={{
                    width: 18,
                    height: 18,
                    alignSelf: "flex-start",
                    marginHorizontal: 5,
                  }}
                />
                <TextComponent
                  text={
                    cardData?.country &&
                    cardData?.country + cardData?.state &&
                    cardData?.state + cardData?.city &&
                    cardData?.city
                  }
                  size={Sizes?.xs}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                />
              </View>
            ) : (
              <TextComponent
                // text={`requested to follow you. ${cardData?.time}`}
                text={`Do you want to follow back?`}
                size={Sizes?.xs}
                fontWeight="400"
                color={Colors?.darkgrey}
                style={{ paddingHorizontal: 10, width: "100%" }}
              />
            )}

            {expendView && (
              <>
                {tab == 1 ? null : (
                  <View
                    style={{ ...Styles?.row, paddingVertical: 2, width: "85%" }}
                  >
                    <Image
                      source={Images?.locationIcon}
                      style={{ width: 20, height: 20 }}
                    />
                    <TextComponent
                      text={
                        cardData?.country &&
                        cardData?.country + cardData?.state &&
                        cardData?.state + cardData?.city &&
                        cardData?.city
                      }
                      size={Sizes?.xs}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                    />
                  </View>
                )}
                {/* <View style={{ ...Styles?.row }}>
                <Image
                  source={Images?.dollarCash}
                  style={{ width: 20, height: 20 }}
                />
                <TextComponent
                  text={`${cardData?.rate}/hr  |  `}
                  size={Sizes?.xs}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                />
                <AntDesign
                  name={"star"}
                  color={Colors?.yellow}
                  size={12}
                  style={{ paddingHorizontal: 2 }}
                />
                <TextComponent
                  text={`${cardData?.rating}`}
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                />
              </View> */}
              </>
            )}
          </View>
        </TouchableOpacity>
        <View
          style={{
            ...Styles?.row,
            width: "25%",
            justifyContent: "space-around",
          }}
        >
          {tab == 1 ? (
            <>
              {cardData?.status ? (
                <TouchableOpacity
                  onPress={() => {
                    if (cardData?.pause_status == 0) {
                      setFollowedID(cardData?.profile_id);
                      handleFollow("unfollow", cardData);
                    }
                  }}
                >
                  <SimpleLineIcons
                    name="user-unfollow"
                    color={Colors?.pink}
                    size={30}
                  />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity
                  onPress={() => {
                    if (cardData?.pause_status == 0) {
                      setFollowedID(cardData?.profile_id);
                      handleFollow("follow", cardData);
                    }
                  }}
                >
                  <SimpleLineIcons
                    name="user-follow"
                    color={Colors?.themeColor}
                    size={30}
                  />
                </TouchableOpacity>
              )}

              <TouchableOpacity
                onPress={() => {
                  if (cardData?.pause_status == 0) {
                    setFollowedID(cardData?.profile_id);
                    handleFollow("remove", cardData);
                  }
                }}
              >
                <FontAwesome5
                  name="times-circle"
                  color={Colors?.pink}
                  size={30}
                />
              </TouchableOpacity>
            </>
          ) : tab == 2 ? (
            <>
              <View />
              <TouchableOpacity
                onPress={() => {
                  if (cardData?.pause_status == 0) {
                    setFollowedID(cardData?.profile_id);
                    handleFollow("unfollow", cardData);
                  }
                }}
              >
                <SimpleLineIcons
                  name="user-unfollow"
                  color={Colors?.pink}
                  size={30}
                />
              </TouchableOpacity>
            </>
          ) : (
            <>
              <TouchableOpacity
                onPress={() => {
                  if (cardData?.pause_status == 0) {
                    setFollowedID(cardData?.profile_id);
                    handleFollow("accept", cardData);
                  }
                }}
              >
                <AntDesign
                  name="checkcircle"
                  color={Colors?.themeColor}
                  size={30}
                />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  if (cardData?.pause_status == 0) {
                    setFollowedID(cardData?.profile_id);
                    handleFollow("decline", cardData);
                  }
                }}
              >
                <FontAwesome5
                  name="times-circle"
                  color={Colors?.pink}
                  size={30}
                />
              </TouchableOpacity>
            </>
          )}
        </View>
      </TouchableOpacity>
    </>
  );
};
const BlockedCard = (props) => {
  const { cardData, tab, navigation, getFollowingList, setTab } = props;
  const other = useSelector((state) => state?.otherReducer);
  const dispatch = useDispatch();
  const handleUserInfo = async () => {
    var body = {
      user_id: cardData?.id,
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      if (cardData?.user_role == 11 || cardData?.user_role == 15) {
        navigation?.navigate(routeName?.MODEL_PROFILE, {
          modelData: res?.results,
        });
      } else if (cardData?.user_role == 12) {
        navigation?.navigate(routeName?.CLIENT_PROFILE, {
          userId: cardData?.id,
        });
      } else if (cardData?.user_role == 13) {
        navigation?.navigate(routeName?.PHOTOGRAPHER_PROFILE, {
          userId: cardData?.id,
        });
      }
    }
  };
  const handleUnblock = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: "unblock",
      user_id: userID,
      post_id: cardData?.id,
    };
    let res = await dispatch(blockUser(body));
    if (res?.status == 200) {
      if (tab == 4) {
        getFollowingList("blocked", 4);
        setTab(4);
      }
    }
  };

  return (
    <>
      <View
        style={{
          ...Styles?.container,
          padding: 10,
          ...Styles?.flexRow,
          marginHorizontal: 10,
          width: "95%",
          opacity: cardData?.pause_status == 0 ? null : 0.4,
          // backgroundColor:
          //   cardData?.pause_status != 0 ? Colors?.white : Colors?.offWhite,
        }}
      >
        <TouchableOpacity
          onPress={() =>
            cardData?.pause_status == 0 ? handleUserInfo() : null
          }
          style={{
            flexDirection: "row",
            width: "75%",
            paddingHorizontal: 10,
            alignContent: "center",
            alignItems: "center",
          }}
        >
          {cardData?.profile_img ? (
            <Image
              source={{ uri: cardData?.profile_img }}
              style={styling?.profileImg}
            />
          ) : (
            <FontAwesome
              name="user-circle-o"
              size={50}
              color={Colors?.gredient}
            />
          )}
          <View>
            <TextComponent
              text={cardData?.full_name}
              size={Sizes?.s}
              fontWeight="400"
              style={{ paddingHorizontal: 10, width: "100%" }}
            />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => handleUnblock("unblock")}
          style={{
            ...Styles?.smallButton,
            backgroundColor: Colors?.themeColor,
          }}
        >
          <TextComponent
            text={"Unblock"}
            size={Sizes.s}
            fontWeight="400"
            color={Colors?.white}
          />
        </TouchableOpacity>
      </View>
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
  profileImg: {
    width: dimensionheight(6),
    height: dimensionheight(6),
    borderRadius: dimensionheight(100),
    marginRight: 10,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 10,
  },
});
