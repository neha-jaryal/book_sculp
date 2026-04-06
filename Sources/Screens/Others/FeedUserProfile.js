// FeedUserProfile.js
import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
} from "react-native";
import {
  Button,
  Header,
  ImageView,
  Loader,
  Tabs,
  TextComponent,
} from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import moment from "moment";
import { getData, storageKey } from "../../Utility/Storage";
import {
  getUserPortfolio,
  getUserSocialPosts,
  userFollowing,
} from "../../Redux/Services/OtherServices";
import FastImage from "@d11/react-native-fast-image";
import Video from "react-native-video";
import { getAccountApproval } from "../../Utility";
import { useHandleMessage } from "../../Utility/FirestoreHelper";
import { ChatContext } from "../../Context/ChatContext";
import { useFocusEffect } from "@react-navigation/native";

export const FeedUserProfile = ({ route, navigation }) => {
  const { userId, type } = route?.params || {};
  const dispatch = useDispatch();
  const { dispatch: chatDispatch } = useContext(ChatContext);
  const handleMessage = useHandleMessage();

  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  const [follow, setFollow] = useState(false);
  const [postType, setPostType] = useState(1); // 1 = portfolio, 2 = social
  const [socialPosts, setSocialPosts] = useState([]);
  const [portfolioList, setPortfolioList] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(false);

  useEffect(() => {
    fetchUserData();
    fetchSocialPosts();
    fetchPortfolioPosts();
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAccountApprovalStatus = async () => {
        let status = await getData(storageKey?.APPROVAL_STATUS);
        let accountApproval = JSON?.parse(status);
        if (isActive) setApprovalStatus(accountApproval);
      };
      getAccountApprovalStatus();

      return () => {
        isActive = false;
      };
    }, []),
  );

  const fetchUserData = async () => {
    setLoading(true);
    const body = { user_id: userId };
    const res = await dispatch(getUserDetail(body));
    setLoading(false);

    if (res?.status === 200) {
      setUserData(res.results);
      const followers = res.results?.post_meta_details?.user_followers || [];
      const currentUserId = await getData(storageKey.USER_ID);
      setFollow(followers.includes(currentUserId));
    }
  };

  const fetchSocialPosts = async () => {
    const body = { user_id: userId };
    const res = await dispatch(getUserSocialPosts(body));
    if (res?.status === 200) {
      setSocialPosts(res.results || []);
    }
  };

  const fetchPortfolioPosts = async () => {
    const body = { user_id: userId };
    const res = await dispatch(getUserPortfolio(body));
    if (res?.status === 200) {
      setPortfolioList(res.results || []);
    }
  };

  const toggleFollow = async () => {
    if (approvalStatus) {
      const currentUserId = await getData(storageKey.USER_ID);
      const body = {
        action: follow ? "unfollow" : "follow",
        user_id: currentUserId,
        post_id: userData?.user_data?.profile_id,
      };

      const res = await dispatch(userFollowing(body));
      if (res?.status === 200) {
        setFollow(!follow);
        fetchUserData(); // refresh follower count
      }
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };

  const startChat = async () => {
    if (approvalStatus) {
      const profileImage = userData?.profile_image?.[0]?.guid || "";
      const receiver = {
        displayName: userData?.user_data?.display_name,
        uid: userData?.user_data?.firebase_udi,
        photoURL: profileImage,
        user_id: userData?.user_data?.user_id,
      };

      chatDispatch({ type: "CHANGE_USER", payload: receiver });
      handleMessage(
        userData?.user_data?.user_email,
        userData?.user_data?.firebase_udi,
        userData?.user_data?.display_name,
        () => {}, // no loading setter needed here
        profileImage,
        userData?.user_data?.user_id,
        userData?.user_data?.user_role,
      );
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };

  const viewFullProfile = async () => {
    const body = { user_id: userData?.user_data?.user_id };
    const res = await dispatch(getUserDetail(body));
    if (res?.status === 200) {
      navigation.navigate(routeName.MODEL_PROFILE, {
        modelData: res.results,
      });
    }
  };
  return (
    <>
      <Header
        text={userData?.user_data?.display_name || "Profile"}
        navigation={navigation}
      />
      <Loader loading={loading || other?.isLoading} />

      <ScrollView>
        <View
          style={{ ...Styles.container, marginHorizontal: 10, width: "95%" }}
        >
          {/* Profile Header */}
          <View style={styles.profileHeader}>
            <View>
              {userData?.profile_image?.[0]?.guid ? (
                <FastImage
                  source={{ uri: userData.profile_image[0].guid }}
                  style={styling.profileImg}
                />
              ) : (
                <FontAwesome
                  name="user-circle-o"
                  size={dimensionheight(12)}
                  color={Colors.themeColor}
                />
              )}

              <View style={{ marginLeft: 16 }}>
                <TextComponent
                  text={userData?.user_data?.display_name || "User"}
                  size={Sizes.l}
                  fontWeight="600"
                />
                <TextComponent
                  text={userData?.personal_details?.tag_line || ""}
                  size={Sizes.xs}
                  color={Colors.darkgrey}
                />
              </View>
            </View>

            {/* Stats */}
            <View
              style={{
                position: "absolute",
                right: 0,
              }}
            >
              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <TextComponent
                    text={
                      userData?.project_count_details?.portfolio_count || "0"
                    }
                    size={Sizes.l}
                  />
                  <TextComponent
                    text="Posts"
                    size={Sizes.s}
                    color={Colors.darkgrey}
                  />
                </View>
                <View style={styles.statItem}>
                  <TextComponent
                    text={
                      userData?.project_count_details?.followers_count || "0"
                    }
                    size={Sizes.l}
                  />
                  <TextComponent
                    text="Followers"
                    size={Sizes.s}
                    color={Colors.darkgrey}
                  />
                </View>
                <View style={styles.statItem}>
                  <TextComponent
                    text={
                      userData?.project_count_details?.following_count || "0"
                    }
                    size={Sizes.l}
                  />
                  <TextComponent
                    text="Following"
                    size={Sizes.s}
                    color={Colors.darkgrey}
                  />
                </View>
              </View>
              {/* Action Buttons */}
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => toggleFollow()}
                  style={styles.optionButton}
                >
                  <TextComponent
                    text={follow ? "Following" : "+ Follow"}
                    size={Sizes.xs}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => startChat()}
                  style={styles.optionButton}
                >
                  <TextComponent text="Message" size={Sizes.xs} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => viewFullProfile()}
                  style={styles.optionButton}
                >
                  <TextComponent text="View Profile" size={Sizes.xs} />
                </TouchableOpacity>
                {/* <Button
                  title={follow ? "Following" : "+ Follow"}
                  onPress={toggleFollow}
                  background={true}
                  style={{ flex: 1, marginRight: 8 }}
                />
                <Button
                  title="Message"
                  onPress={startChat}
                  background={true}
                  style={{ flex: 1, marginHorizontal: 8 }}
                />
                <Button
                  title="View Profile"
                  onPress={viewFullProfile}
                  background={true}
                  style={{ flex: 1, marginLeft: 8 }}
                /> */}
              </View>
            </View>
          </View>
          {/* <View style={{ ...Styles?.separator, width: "100%" }} /> */}
          {/* Tabs & Content */}
          <Tabs
            leftTitle="Portfolios"
            rightTitle="Social Posts"
            onLeftTab={() => setPostType(1)}
            onRightTab={() => setPostType(2)}
            tab={postType}
          />

          <FlatList
            data={postType === 1 ? portfolioList : socialPosts}
            numColumns={2}
            keyExtractor={(item, index) => index.toString()}
            contentContainerStyle={{ padding: 5, marginTop: 10 }}
            ListEmptyComponent={
              <View style={{ padding: 40, alignItems: "center" }}>
                <TextComponent
                  text="No posts yet"
                  size={Sizes.l}
                  color={Colors.darkgrey}
                />
              </View>
            }
            renderItem={({ item }) => {
              const media = item?.media?.[0];
              const isVideo = media?.media_type === "video";
              return (
                <TouchableOpacity
                  style={{
                    width: "48%",
                    margin: 4,
                    borderRadius: 12,
                    overflow: "hidden",
                    backgroundColor: Colors.gredient,
                  }}
                  onPress={() =>
                    navigation.navigate(routeName.VIEW_POST_DETAILS, {
                      portId: postType === 1 ? item?.post_details?.ID : "",
                      socialId: postType === 2 ? item?.post_details?.ID : "",
                      postType: postType === 1 ? "portfolio" : "social",
                    })
                  }
                >
                  {isVideo ? (
                    <Video
                      source={{ uri: media?.url }}
                      style={{ width: "100%", aspectRatio: 1 }}
                      resizeMode="cover"
                      paused={true}
                      muted={true}
                    />
                  ) : (
                    <FastImage
                      source={{ uri: media?.url }}
                      style={{ width: "100%", aspectRatio: 1 }}
                      resizeMode={FastImage.resizeMode.cover}
                    />
                  )}
                </TouchableOpacity>
              );
            }}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  profileImg: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    borderRadius: dimensionheight(100),
    borderWidth: 3,
    borderColor: Colors.lightThemeColor,
  },
});

const styles = StyleSheet.create({
  profileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    // marginBottom: 20,
  },
  profileLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  statsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 10,
    // width: "60%",
  },
  statItem: {
    alignItems: "center",
    paddingHorizontal: 8,
    // borderRadius: 8,
    // borderWidth: 1,
    // borderColor: Colors.darkgrey,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  optionButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 15,
    borderWidth: 0.8,
    borderColor: Colors.darkgrey,
    marginRight: 5,
  },
});
