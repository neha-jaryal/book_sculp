import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, TextComponent, ViewImages } from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import {
  CommentsModal,
  PostCard,
  ShareModal,
  ThreeDotsModal,
} from "../../Components/PostCard";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import SwiperFlatList from "react-native-swiper-flatlist"; // ← Replacement
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import {
  getPortfolioDetails,
  getReelList,
  getSocialPostDetails,
  likeDislike,
} from "../../Redux/Services/OtherServices";
import Video from "react-native-video";
import { getData, storageKey } from "../../Utility/Storage";
import {
  convertUTCToLocalTime,
  getAccountApproval,
  timeSince,
} from "../../Utility";

export const ViewPostDetails = ({ navigation, route }) => {
  console.log("route?.params------", route?.params);

  const { portId, socialId, postType, showSwiper } = route?.params || {};

  const auth = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();

  const [postData, setPostData] = useState([]);
  const [imagesModal, setImagesModal] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [sendSwiper, setSendSwiper] = useState(false);
  const [commentSwiper, setCommentSwiper] = useState(false);
  const [threeDotsSwiper, setThreeDotsSwiper] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [modal, setModal] = useState(false);
  const [reelList, setReelList] = useState([]);
  const [userID, setUserID] = useState("");

  useFocusEffect(
    React.useCallback(() => {
      getPostDetails();
      getAccountApprovalStatus();
    }, [])
  );

  useEffect(() => {
    getSwiper();
  }, [route.params]);

  const getSwiper = async () => {
    if (route?.params?.routeName === routeName.NOTIFICATIONS && showSwiper) {
      getPostDetails("NOTIFICATIONS");
    }
  };

  const getPostDetails = async (type) => {
    const userId = await getData(storageKey?.USER_ID);
    if (postType === "portfolio") {
      const body = {
        port_id: portId,
        user_id: userId,
      };
      const res = await dispatch(getPortfolioDetails(body));
      if (res?.status === 200) {
        setPostData(res?.results?.[0]);
        if (type === "NOTIFICATIONS") {
          setCommentSwiper(true);
        }
      }
    } else if (postType === "social") {
      const body = {
        social_id: socialId,
        user_id: userId,
      };
      const res = await dispatch(getSocialPostDetails(body));
      if (res?.status === 200) {
        setPostData(res?.results?.[0]);
        if (type === "NOTIFICATIONS") {
          setCommentSwiper(true);
        }
      }
    }
  };

  const handleLikeDislike = async (status) => {
    const userId = await getData(storageKey?.USER_ID);
    const body = {
      type: status === 0 ? "like" : "unlike",
      user_id: userId,
      post_id: portId ? portId : socialId,
    };
    const res = await dispatch(likeDislike(body));
    if (res?.status === 200) {
      getPostDetails();
    }
  };

  useEffect(() => {
    getAllReelList();
  }, []);

  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
  };

  const getAllReelList = async () => {
    const userId = await getData(storageKey?.USER_ID);
    setUserID(userId);
    const body = {
      user_id: userId ? userId : "",
      page_number: "1",
      per_page: "10",
    };
    const res = await dispatch(getReelList(body));
    if (res?.status === 200) {
      setReelList(res.results);
    }
  };

  const handleReelSwiper = async () => {
    setModal(true);
    let arrr = [postData];
    let newArr = arrr.concat(...reelList);
    setReelList(newArr);
  };

  return (
    <>
      <Header text="Post Details" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {postData?.length !== 0 && (
          <View
            style={{
              ...Styles.container,
              padding: 0,
              marginHorizontal: 10,
              width: "95%",
              paddingBottom: 8,
            }}
          >
            <SwiperFlatList
              data={postData?.media || []}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setImagesModal(true)}
                  key={index}
                >
                  {item?.media_type === "video" ? (
                    <>
                      <Video
                        source={{ uri: item?.url }}
                        style={{
                          height: 370,
                          width: "100%",
                          backgroundColor: Colors.black,
                          borderTopLeftRadius: 12,
                          borderTopRightRadius: 12,
                          borderRadius: 12,
                        }}
                        paused={false}
                        muted={true}
                        repeat={true}
                        resizeMode="cover"
                        rate={1.0}
                        ignoreSilentSwitch="obey"
                        automaticallyWaitsToMinimizeStalling={true}
                      />
                      {modal && (
                        <VideoModal
                          postData={postData}
                          reelData={postData}
                          cardData={reelList}
                          uri={item?.url}
                          modal={modal}
                          setModal={setModal}
                          userId={userID}
                          postType={postType}
                          refreshList={getPostDetails}
                          getPortDetails={getPostDetails}
                          getSocialPostData={getPostDetails}
                        />
                      )}
                    </>
                  ) : (
                    <Image
                      key={index}
                      source={{ uri: item?.url }}
                      style={{
                        ...Styles.postCard,
                        borderTopLeftRadius: 12,
                        borderTopRightRadius: 12,
                        borderRadius: 12,
                      }}
                    />
                  )}
                </TouchableOpacity>
              )}
              showPagination={postData?.media?.length > 1}
              paginationActiveDotColor={Colors.pink}
              paginationDotColor={Colors.white}
              paginationStyle={{ bottom: 10 }}
            />

            <View style={styling.cardContentView}>
              <TouchableOpacity
                style={styling.cardProfileView}
                onPress={() =>
                  userID === postData?.post_details?.post_author
                    ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                        userId: postData?.post_details?.post_author,
                      })
                    : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
                        userId: postData?.post_details?.post_author,
                        type: postType,
                      })
                }
              >
                <Image
                  source={{ uri: postData?.user_data?.attachment?.url }}
                  style={styling.profileImg}
                />
                <View style={{ paddingHorizontal: 10 }}>
                  <TextComponent
                    text={postData?.user_data?.display_name}
                    color={Colors.white}
                    size={Sizes.l}
                    style={{
                      textShadowColor: "rgba(0,0,0,0.5)",
                      textShadowOffset: { width: -2, height: 0 },
                      textShadowRadius: 5,
                    }}
                  />
                  <TextComponent
                    text={postData?.post_details?.post_title}
                    color={Colors.white}
                    size={Sizes.xs}
                    fontWeight="400"
                    style={{
                      textShadowColor: "rgba(0,0,0,0.5)",
                      textShadowOffset: { width: -2, height: 0 },
                      textShadowRadius: 5,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <View
                style={{
                  right: 16,
                  paddingVertical: 15,
                  position: "absolute",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    approvalStatus
                      ? setThreeDotsSwiper(true)
                      : getAccountApproval(true, navigation, auth)
                  }
                >
                  <Entypo
                    name="dots-three-vertical"
                    size={18}
                    color={Colors.white}
                    style={{ top: 0 }}
                  />
                </TouchableOpacity>

                <View style={{ marginTop: 120 }}>
                  <TouchableOpacity
                    onPress={() =>
                      approvalStatus
                        ? handleLikeDislike(postData?.extra?.like_status)
                        : getAccountApproval(true, navigation, auth)
                    }
                    style={{
                      padding: 9,
                      paddingTop: 10,
                      paddingLeft: 10,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: 100,
                    }}
                  >
                    <FontAwesome
                      name="heart"
                      size={16}
                      color={
                        postData?.extra?.like_status === 1
                          ? Colors.pink
                          : Colors.white
                      }
                    />
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={{
                      padding: 9,
                      paddingBottom: 10,
                      paddingLeft: 10,
                      backgroundColor: "rgba(0,0,0,0.5)",
                      borderRadius: 100,
                      marginVertical: 20,
                    }}
                    onPress={() =>
                      approvalStatus
                        ? setCommentSwiper(true)
                        : getAccountApproval(true, navigation, auth)
                    }
                  >
                    <FontAwesome name="comment" size={16} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View style={{ paddingHorizontal: 10 }}>
              {postData?.post_details?.post_content && (
                <TextComponent
                  text={postData?.post_details?.post_content}
                  color={Colors.darkgrey}
                  size={Sizes.xs}
                  fontWeight="400"
                  numberOfLines={2.5}
                  style={{
                    textTransform: "capitalize",
                    lineHeight: 20,
                    letterSpacing: 0.2,
                    paddingTop: 5,
                  }}
                />
              )}

              <View
                style={{
                  ...styling.postDeatils,
                  padding: 0,
                }}
              >
                <View style={{ ...Styles.row, paddingVertical: 5 }}>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1.5,
                      borderColor: Colors.pink,
                      paddingVertical: 5,
                      paddingHorizontal: 6,
                      borderRadius: 20,
                      alignContent: "center",
                    }}
                  >
                    <FontAwesome
                      name="heart"
                      size={12}
                      color={Colors.pink}
                      style={{ paddingRight: 5 }}
                    />
                    <TextComponent
                      text={`View all ${
                        postData?.extra?.likes_count
                          ? postData?.extra?.likes_count
                          : 0
                      } likes`}
                      color={Colors.darkgrey}
                      size={10}
                      style={{ paddingRight: 5 }}
                      width={200}
                    />
                  </View>

                  <TouchableOpacity
                    onPress={() =>
                      approvalStatus
                        ? setCommentSwiper(true)
                        : getAccountApproval(true, navigation, auth)
                    }
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      borderWidth: 1.5,
                      borderColor: Colors.blue,
                      paddingVertical: 4,
                      marginHorizontal: 10,
                      paddingHorizontal: 5,
                      borderRadius: 20,
                      backgroundColor: showComments ? Colors.blue : Colors.white,
                    }}
                  >
                    <FontAwesome
                      name="comments"
                      size={14}
                      color={showComments ? Colors.white : Colors.blue}
                      style={{ paddingRight: 5 }}
                    />
                    <TextComponent
                      text={`View All ${
                        postData?.extra?.comments_count
                          ? postData?.extra?.comments_count
                          : 0
                      } Comments `}
                      color={showComments ? Colors.white : Colors.darkgrey}
                      size={10}
                      style={{ paddingRight: 5 }}
                      width={150}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <TextComponent
                text={timeSince(
                  convertUTCToLocalTime(postData?.post_details?.post_date)
                )}
                color={Colors.darkgrey}
                size={Sizes.xs}
                fontWeight="400"
                style={{
                  paddingVertical: 4,
                }}
              />
            </View>
          </View>
        )}

        {imagesModal && (
          <ViewImages
            images={postData?.gallery?.gallery_imgs}
            show={imagesModal}
            setShow={setImagesModal}
          />
        )}

        {sendSwiper && (
          <ShareModal
            setShowModelComment={setSendSwiper}
            ShowComment={sendSwiper}
          />
        )}

        {commentSwiper && (
          <CommentsModal
            type={postType}
            portId={postData?.post_details?.ID}
            socialId={postData?.post_details?.ID}
            userData={postData?.user_data}
            comments={postData?.comment_result}
            setShowModelComment={setCommentSwiper}
            ShowComment={commentSwiper}
            refreshList={getPostDetails}
            cardData={postData}
            getPortDetails={getPostDetails}
            getSocialPostData={getPostDetails}
          />
        )}

        {threeDotsSwiper && (
          <ThreeDotsModal
            setShowModelComment={setThreeDotsSwiper}
            ShowComment={threeDotsSwiper}
            navigation={navigation}
            cardData={postData}
            userId={userID}
            postId={postData?.post_details?.ID}
            refreshList={getPostDetails}
            type={postType}
          />
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
  profileView: {
    alignItems: "center",
    marginBottom: 15,
    width: "35%",
  },
  profileImg: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    top: 0,
    borderRadius: dimensionheight(100),
    resizeMode: "cover",
  },
  userDeatilView: {
    width: "35%",
    alignItems: "center",
  },
  cardContentView: {
    flexDirection: "row",
    margin: 10,
    justifyContent: "space-between",
    position: "absolute",
    width: "100%",
  },
  cardProfileView: {
    flexDirection: "row",
    width: "80%",
    left: 5,
    alignItems: "flex-start",
  },
  postDeatils: {
    backgroundColor: Colors.white,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 20,
  },
  profileImg: {
    resizeMode: "contain",
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors.white,
  },
});