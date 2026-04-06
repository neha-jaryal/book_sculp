import React, { useCallback, useContext, useEffect, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Dimensions,
  Share,
  Alert,
  TextInput,
  Keyboard,
  Modal,
  Platform,
  KeyboardAvoidingView,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { Skeletoning } from "./Skeletoning";
import { TextComponent } from "./TextComponent";
// import VideoPlayer from "react-native-video";
import { useRef } from "react";
import {
  convertUTCToLocalTime,
  getAccountApproval,
  getImageDimensions,
  routeName,
  showToast,
  timeSince,
} from "../Utility";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import Video from "react-native-video";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import {
  addComment,
  deletePost,
  getAllLikesUsers,
  getModelsList,
  getPortfolioDetails,
  getReelList,
  getSearchResults,
  getSocialPostDetails,
  likeDislike,
  savePost,
  userFollowing,
} from "../Redux/Services/OtherServices";
import { Searchbar } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Ionicons from "react-native-vector-icons/Ionicons";
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { ImageView } from "./ImageView";
import { ViewImages } from "./ViewImages";
import { getData, storageKey } from "../Utility/Storage";
import { VideoModal } from "./VideoModal";
import { getUserDetail } from "../Redux/Services/AuthServices";
import { SAVE_POST, UNSAVE_POST } from "../API Services/Url";
import moment from "moment";
import { ReportUser } from "./ReportUser";
import { reasonList } from "../Global";
import { useHandleMessage } from "../Utility/FirestoreHelper";
import { ChatContext } from "../Context/ChatContext";
import { Loader } from "./Loader";
import { TapGestureHandler, State } from "react-native-gesture-handler";
import AntDesign from "react-native-vector-icons/AntDesign";
import { set } from "ramda";
import { PostMediaViewer } from "./PostMediaViewer";

export const PostCard = (props) => {
  const {
    cardData,
    isLoading,
    type,
    navigation,
    onPress,
    // modal,
    // setModal,
    onReelTap,
    paused,
    refreshList,
    postType,
    userId,
    volume,
    setVolume,
    reelList,
    setReelList,
  } = props;
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);
  const playVedio = useRef(null);
  const dispatch = useDispatch();

  const [sendSwiper, setSendSwiper] = useState(false);
  const [likeModal, setLikeModal] = useState(false);
  const [commentSwiper, setCommentSwiper] = useState(false);
  const [threeDotsSwiper, setThreeDotsSwiper] = useState(false);
  const [imagesModal, setImagesModal] = useState(false);
  const [postData, setPostData] = useState("");
  // const [volume, setVolume] = useState(true);
  const [modal, setModal] = useState(false);
  const [userID, setUserID] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [expendView, setExpendView] = useState(false);
  const [like, setLike] = useState(false);
  const [loadImage, setLoadImage] = useState(false);
  const [likeStatus, setLikeStatus] = useState({
    status: cardData?.extra?.like_status,
    count: cardData?.extra?.likes_count,
  });
  // Heart animation
  const [showHeart, setShowHeart] = useState(false);
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);
  const lastTap = useRef(null);
  const tapTimeout = useRef(null);

  useEffect(() => {
    return () => {
      if (tapTimeout.current) clearTimeout(tapTimeout.current);
      scaleAnim.stopAnimation();
      opacityAnim.stopAnimation();
    };
  }, []);

  useFocusEffect(
    useCallback(() => {
      let isActive = true;

      const getAccountApprovalStatus = async () => {
        let status = await getData(storageKey?.APPROVAL_STATUS);
        let accountApproval = JSON?.parse(status);
        if (isActive) setApprovalStatus(accountApproval);

        const userId = await getData(storageKey?.USER_ID);
        if (isActive) setUserID(userId);
      };
      getAccountApprovalStatus();

      return () => {
        isActive = false;
      };
    }, [cardData?.id]),
  );

  const showHeartAnimation = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    setShowHeart(true);

    scaleAnim.setValue(0);
    opacityAnim.setValue(1);

    Animated.parallel([
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.2,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 150,
          useNativeDriver: true,
        }),
      ]),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 600,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowHeart(false);
      isAnimating.current = false;
    });
  };

  const handleCardTap = (event, status) => {
    if (event.nativeEvent.state !== State.END) return;
    const now = Date.now();
    const DOUBLE_TAP_DELAY = 300;

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      clearTimeout(tapTimeout.current);
      lastTap.current = null;
      handleLikeDislike(status);
      showHeartAnimation();
    } else {
      lastTap.current = now;
      tapTimeout.current = setTimeout(() => {
        if (lastTap.current === now) {
          // Single tap action (optional navigation)

          lastTap.current = null;
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      getAccountApprovalStatus();
    }, [cardData?.id]), // or specific props
  );
  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
    const userId = await getData(storageKey?.USER_ID);
    setUserID(userId);
  };
  const handleLikeDislike = async (status) => {
    setLikeStatus({
      ...likeStatus,
      status: status == 0 ? 1 : 0,
      count:
        status == 0
          ? JSON.parse(likeStatus?.count) + 1
          : JSON.parse(likeStatus?.count) - 1,
    });
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      type: status == 0 ? "like" : "unlike",
      user_id: userId,
      post_id: cardData?.post_details?.ID,
    };
    let res = await dispatch(likeDislike(body));
    if (res?.status == 200) {
      refreshList();
    }
  };
  const getPortDetails = async (id) => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      port_id: id,
      user_id: userId,
    };
    let res = await dispatch(getPortfolioDetails(body));
    if (res?.status == 200) {
      setPostData(res?.results[0]);
      setCommentSwiper(true);
    }
  };
  const getSocialPostData = async (id) => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      social_id: id,
      user_id: userId,
    };
    let res = await dispatch(getSocialPostDetails(body));
    if (res?.status == 200) {
      setCommentSwiper(true);
      setPostData(res?.results[0]);
    }
  };

  const handleReelSwiper = async () => {
    setModal(true);
    let arrr = [cardData];
    let newArr = arrr.concat(...reelList);
    setReelList(newArr);
  };

  const userRole =
    cardData?.user_data?.user_role == 11
      ? "Model"
      : cardData?.user_data?.user_role == 13
      ? "Photographer"
      : cardData?.user_data?.user_role == 15
      ? "Actor"
      : "Admin";

  // onPress={() =>
  //   navigation?.navigate(routeName?.VIEW_POST_DETAILS, {
  //     portId: cardData?.post_details?.ID,
  //     socialId: cardData?.post_details?.ID,
  //     postType: postType,
  //   })
  // }

  const getModelDetails = async (item) => {
    if (!approvalStatus) {
      getAccountApproval(true, navigation, auth);
    } else {
      const body = { user_id: cardData?.post_details?.post_author };
      const res = await dispatch(getUserDetail(body));
      if (res?.status === 200) {
        if (res.results?.user_data?.user_role == 13) {
          navigation?.navigate(routeName?.PHOTOGRAPHER_PROFILE, {
            photographerData: res.results,
            userId: cardData?.post_details?.post_author,
          });
        } else if (
          res.results?.user_data?.user_role == 11 ||
          res.results?.user_data?.user_role == 15
        ) {
          navigation?.navigate(routeName?.MODEL_PROFILE, {
            modelData: res.results,
            listData: [],
          });
        }
      }
    }
  };

  return (
    <>
      {/* <View
        style={{
          marginVertical: 10,
          marginHorizontal: 10,
          borderWidth: 2,
          borderRadius: 10,
          borderColor: Colors?.lightPink,
          backgroundColor: Colors?.white,
        }}
      >
        {other?.isLoading ? null : (
          <>
            <PostMediaViewer
              media={cardData?.media ?? []}
              onLike={() => {
                handleLikeDislike(likeStatus?.status);
              }}
              containerHeight={380}
            />

            <View
              style={{
                ...styling?.cardContentView,
              }}
            >
              <TouchableOpacity
                style={{
                  ...styling?.cardProfileView,
                }}
                onPress={
                  () => getModelDetails(cardData)
                  // userID == cardData?.post_details?.post_author
                  //   ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                  //       userId: cardData?.post_details?.post_author,
                  //     })
                  //   : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
                  //       userId: cardData?.post_details?.post_author,
                  //       type: postType,
                  //     })
                }
              >
                {cardData?.user_data?.attachment?.url ? (
                  <Image
                    source={{ uri: cardData?.user_data?.attachment?.url }}
                    style={styling.profileImg}
                  />
                ) : (
                  <FontAwesome
                    name="user-circle-o"
                    size={50}
                    color={Colors?.gredient}
                  />
                )}

                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                  }}
                >
                  <TextComponent
                    text={cardData?.user_data?.display_name}
                    color={Colors?.white}
                    size={Sizes?.l}
                    style={{
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: -2, height: 0 },
                      textShadowRadius: 5,
                    }}
                  />
                  <TextComponent
                    text={`• ${userRole}`}
                    color={Colors?.white}
                    size={Sizes?.xs}
                    fontWeight="400"
                    style={{
                      textShadowColor: "rgba(0,0,0,0.8)",
                      textShadowOffset: { width: -1, height: 1 },
                      textShadowRadius: 5,
                    }}
                  />
                </View>
              </TouchableOpacity>

              <View
                style={{ right: 16, paddingVertical: 15, position: "absolute" }}
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
                    color={Colors?.white}
                    style={{ top: -10, padding: 10 }}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}

        <View
          style={{
            ...styling?.postDeatils,
            padding: 0,
            paddingTop: 5,
            paddingBottom: 20,
            paddingHorizontal: isLoading ? 0 : 20,

            marginTop: -15,
          }}
        >
          <View style={{ ...Styles?.row, paddingVertical: 10 }}>
            <View
              onPress={() =>
                approvalStatus
                  ? handleLikeDislike(likeStatus?.status)
                  : getAccountApproval(true, navigation, auth)
              }
              style={{ flexDirection: "row", alignItems: "center" }}
            >
              <TouchableOpacity
                onPress={() =>
                  approvalStatus
                    ? handleLikeDislike(likeStatus?.status)
                    : getAccountApproval(true, navigation, auth)
                }
              >
                <FontAwesome
                  name={likeStatus?.status == 1 ? "heart" : "heart-o"}
                  size={14}
                  color={Colors?.pink}
                  style={{ paddingRight: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLikeModal(true)}>
                <TextComponent
                  text={` ${likeStatus?.count ? likeStatus?.count : 0} ${
                    likeStatus?.count > 1 ? "Likes" : "Like"
                  } `}
                  color={Colors?.darkgrey}
                  size={Sizes?.s}
                  loading={isLoading}
                  style={{ paddingRight: 5 }}
                  width={200}
                />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() =>
                approvalStatus
                  ? postType == "social"
                    ? getSocialPostData(cardData?.post_details?.ID)
                    : getPortDetails(cardData?.post_details?.ID)
                  : getAccountApproval(true, navigation, auth)
              }
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 10,
              }}
            >
              <FontAwesome
                name="comments"
                size={14}
                color={Colors?.blue}
                style={{ paddingRight: 5 }}
              />
              <TextComponent
                text={`${
                  cardData?.extra?.comments_count
                    ? cardData?.extra?.comments_count
                    : 0
                } ${
                  cardData?.extra?.comments_count > 1 ? "Comments" : "Comment"
                } `}
                color={Colors?.darkgrey}
                size={Sizes?.s}
                loading={isLoading}
                style={{ paddingRight: 5 }}
                width={150}
              />
            </TouchableOpacity>
          </View>
          <TextComponent
            text={cardData?.post_details?.post_title}
            color={Colors?.gray}
            size={Sizes?.xs}
            style={{
              textTransform: "capitalize",
              lineHeight: 20,
              letterSpacing: 0.2,
            }}
          />
          <TouchableOpacity onPress={() => setExpendView(!expendView)}>
            {cardData?.post_details?.post_content && (
              <TextComponent
                text={cardData?.post_details?.post_content}
                color={Colors?.darkgrey}
                size={Sizes?.xs}
                fontWeight="400"
                loading={isLoading}
                numberOfLines={expendView ? 0 : Math.floor(2.5)}
                style={{
                  textTransform: "capitalize",
                  lineHeight: 20,
                  letterSpacing: 0.2,
                }}
              />
            )}
          </TouchableOpacity>
          {cardData?.post_details?.post_content?.length > 50 && (
            <TouchableOpacity onPress={() => setExpendView(!expendView)}>
              <TextComponent
                text={expendView ? "Less" : "...Read More"}
                size={Sizes?.xs}
                color={Colors?.blue}
                numberOfLines={expendView ? 0 : Math.floor(2.5)}
                fontWeight="400"
              />
            </TouchableOpacity>
          )}

          {cardData?.post_details?.post_date && (
            <TextComponent
              text={timeSince(
                convertUTCToLocalTime(cardData?.post_details?.post_date),
              )}
              color={Colors?.gray} //
              size={Sizes?.xs}
              fontWeight="400"
              style={{
                letterSpacing: 0.2,
                paddingVertical: 4,
              }}
            />
          )}
        </View>
      </View> */}

      <View
  style={{
    marginVertical: 10,
    marginHorizontal: 10,
    borderWidth: 2,
    borderRadius: 4, // ✅ changed to 4px
    borderColor: Colors?.lightPink,
    backgroundColor: Colors?.white,
  }}
>
  {other?.isLoading ? null : (
    <>
      <PostMediaViewer
        media={cardData?.media ?? []}
        onLike={() => {
          handleLikeDislike(likeStatus?.status);
        }}
        containerHeight={380}
      />

      <View
        style={{
          ...styling?.cardContentView,
        }}
      >
        <TouchableOpacity
          style={{
            ...styling?.cardProfileView,
          }}
          onPress={() => getModelDetails(cardData)}
        >
          {cardData?.user_data?.attachment?.url ? (
            <Image
              source={{ uri: cardData?.user_data?.attachment?.url }}
              style={styling.profileImg}
            />
          ) : (
            <FontAwesome
              name="user-circle-o"
              size={50}
              color={Colors?.gredient}
            />
          )}

          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 5,
            }}
          >
            <TextComponent
              text={cardData?.user_data?.display_name}
              color={Colors?.white}
              size={Sizes?.l}
              style={{
                textShadowColor: "rgba(0,0,0,0.8)",
                textShadowOffset: { width: -2, height: 0 },
                textShadowRadius: 5,
              }}
            />
            <TextComponent
              text={`• ${userRole}`}
              color={Colors?.white}
              size={Sizes?.xs}
              fontWeight="400"
              style={{
                textShadowColor: "rgba(0,0,0,0.8)",
                textShadowOffset: { width: -1, height: 1 },
                textShadowRadius: 5,
              }}
            />
          </View>
        </TouchableOpacity>

        <View
          style={{ right: 16, paddingVertical: 15, position: "absolute" }}
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
              color={Colors?.white}
              style={{ top: -10, padding: 10 }}
            />
          </TouchableOpacity>
        </View>
      </View>
    </>
  )}

  <View
    style={{
      ...styling?.postDeatils,
      padding: 0,
      paddingTop: 5,
      paddingBottom: 10,
      paddingHorizontal: isLoading ? 0 : 20,
      marginTop: -15,
    }}
  >
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingVertical: 7,
      }}
    >
      <TouchableOpacity
        onPress={() =>
          approvalStatus
            ? handleLikeDislike(likeStatus?.status)
            : getAccountApproval(true, navigation, auth)
        }
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <FontAwesome
          name={likeStatus?.status == 1 ? "heart" : "heart-o"}
          size={20}
          color={likeStatus?.status == 1 ? "#E1306C" : Colors?.darkgrey}
        />
        <TextComponent
          text={` ${likeStatus?.count || 0}`}
          color={Colors?.darkgrey}
          size={Sizes?.s}
          fontWeight="500"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() =>
          approvalStatus
            ? postType == "social"
              ? getSocialPostData(cardData?.post_details?.ID)
              : getPortDetails(cardData?.post_details?.ID)
            : getAccountApproval(true, navigation, auth)
        }
        style={{ flexDirection: "row", alignItems: "center" }}
      >
        <FontAwesome
          name="comment-o"
          size={20}
          color={Colors?.darkgrey}
        />
        <TextComponent
          text={` ${cardData?.extra?.comments_count || 0}`}
          color={Colors?.darkgrey}
          size={Sizes?.s}
          fontWeight="500"
          style={{ marginLeft: 6 }}
        />
      </TouchableOpacity>
    </View>

    {/* Title */}
    <TextComponent
      text={cardData?.post_details?.post_title}
      color={Colors?.gray}
      size={Sizes?.xs}
      style={{
        textTransform: "capitalize",
        lineHeight: 20,
        letterSpacing: 0.2,
      }}
    />

    {/* Content */}
    <TouchableOpacity onPress={() => setExpendView(!expendView)}>
  {cardData?.post_details?.post_content && (
    <TextComponent
      text={
        expendView
          ? `${cardData?.post_details?.post_content}  Less`
          : cardData?.post_details?.post_content?.length > 30
          ? `${cardData?.post_details?.post_content}  read more`
          : cardData?.post_details?.post_content
      }
      color={Colors?.darkgrey}
      size={12}
      fontWeight="400"
      loading={isLoading}
      numberOfLines={expendView ? 0 : 1}
      style={{
        lineHeight: 18,
        letterSpacing: 0.2,
        textTransform: "capitalize",
      }}
    />
  )}
</TouchableOpacity>

    {/* Date */}
    {cardData?.post_details?.post_date && (
      <TextComponent
        text={timeSince(
          convertUTCToLocalTime(cardData?.post_details?.post_date),
        )}
        color={Colors?.gray}
        size={Sizes?.xs}
        fontWeight="400"
        style={{
          letterSpacing: 0.2,
          paddingVertical: 4,
        }}
      />
    )}
  </View>
</View> 

      {sendSwiper && (
        <ShareModal
          setShowModelComment={setSendSwiper}
          ShowComment={sendSwiper}
        />
      )}
      {likeModal && (
        <LikeModal
          setShowModelComment={setLikeModal}
          ShowComment={likeModal}
          socialId={cardData?.post_details?.ID}
          navigation={navigation}
        />
      )}
      {commentSwiper && (
        <CommentsModal
          postId={cardData?.post_details?.ID}
          portId={cardData?.post_details?.ID}
          socialId={cardData?.post_details?.ID}
          type={postType}
          userData={postData?.user_data}
          comments={postData?.comment_result}
          setShowModelComment={setCommentSwiper}
          ShowComment={commentSwiper}
          getPortDetails={getPortDetails}
          getSocialPostData={getSocialPostData}
          refreshList={refreshList}
          cardData={cardData}
          userID={userID}
        />
      )}
      {threeDotsSwiper && (
        <ThreeDotsModal
          postData={postData}
          navigation={navigation}
          cardData={cardData}
          userId={userId}
          postId={cardData?.post_details?.ID}
          setShowModelComment={setThreeDotsSwiper}
          ShowComment={threeDotsSwiper}
          refreshList={refreshList}
          type={postType}
        />
      )}

      {imagesModal && (
        <ViewImages
          images={cardData?.gallery?.gallery_imgs}
          show={imagesModal}
          setShow={setImagesModal}
        />
      )}
      {/* )} */}
    </>
  );
};

export const LikeModal = (props) => {
  const dispatch = useDispatch();
  let [animateModal, setanimateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [userList, setUserList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(-1);
  const { ShowComment, setShowModelComment, socialId, navigation } = props;
  const other = useSelector((state) => state?.otherReducer);

  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = async () => {
    var body = {
      type: "like",
      post_id: socialId,
      page: 1,
      limit: 15,
    };
    let res = await dispatch(getAllLikesUsers(body));
    if (res?.status == 200) {
      setUserList(res?.results?.like_list);
    }
  };

  const getModelDetails = async (item) => {
    let modelID = item?.user_id;
    var body = {
      user_id: modelID,
    };
    let res = await dispatch(getUserDetail(body));
    if (res?.status == 200) {
      setShowModelComment(false);
      navigation?.navigate(routeName?.MODEL_PROFILE, {
        modelData: res?.results,
      });
    }
  };

  const renderEmpty = () => (other?.isLoading ? null : <NoDataFound />);
  const renderModelItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={{
            ...Styles?.flexRow,
            marginHorizontal: 15,
            width: "90%",
            marginBottom: 10,
          }}
        >
          <TouchableOpacity
            onPress={() => getModelDetails(item)}
            style={{
              ...Styles?.row,
              width: "82%",
            }}
          >
            <ImageView
              uri={item?.user_image}
              style={{
                ...styling?.profileImg,
                borderWidth: 3,
                borderColor: Colors?.lightThemeColor,
              }}
              width={50}
              height={50}
              loading={other?.isLoading}
            />

            <TextComponent
              text={item?.user_name}
              size={Sizes?.l}
              fontWeight="400"
              style={{ marginHorizontal: 10 }}
              loading={other?.isLoading}
              width={120}
            />
            <FontAwesome
              name="heart"
              size={20}
              color={Colors?.pink}
              style={{ paddingRight: 5 }}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [userList],
  );

  return (
    <SwipeUpDownModal
      modalVisible={ShowComment}
      PressToanimate={animateModal}
      ContentModal={
        <View style={{ ...styling.containerContent }}>
          <FlatList
            data={userList}
            keyExtractor={({ index }) => index}
            contentContainerStyle={{ paddingVertical: 20 }}
            onEndReachedThreshold={0.5}
            renderEmpty={renderEmpty}
            renderItem={renderModelItem}
          />
        </View>
      }
      HeaderStyle={{ top: 60 }}
      ContentModalStyle={{ backgroundColor: Colors?.white, top: 140 }}
      HeaderContent={
        <View>
          <TouchableOpacity
            onPress={() => setShowModelComment(false)}
            style={{
              width: 45,
              height: 45,
              borderRadius: 100,
              backgroundColor: "rgba(0,0,0,0.6)",
              bottom: 30,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <FontAwesome5
              name="times"
              color={Colors?.white}
              size={20}
              style={{ alignItems: "center" }}
            />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors?.lightThemeColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: 70,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              // top: 100,
            }}
          >
            <View
              style={{
                backgroundColor: Colors?.gray,
                width: 100,
                height: 4,
                alignItems: "center",
                marginBottom: 10,
                borderRadius: 20,
              }}
            />
            <TextComponent text="Who Liked this Post" size={Sizes?.l} />
          </View>
        </View>
      }
      onClose={() => {
        setShowModelComment(false);
        setanimateModal(false);
      }}
    />
  );
};
export const CommentsModal = (props) => {
  const dispatch = useDispatch();

  let [animateModal, setanimateModal] = useState(false);
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState("");
  const [commentID, setCommentID] = useState("");
  // const [addComment, setAddComment] = useState(false);

  const [follow, setFollow] = useState(cardData?.extra?.following_status);
  let {
    ShowComment,
    setShowModelComment,
    comments,
    userData,
    portId,
    socialId,
    type,
    refreshList,
    cardData,
    userID,
  } = props;
  const commentRef = useRef(null);
  const inputRef = useRef(null);
  const navigation = useNavigation(null);
  useFocusEffect(
    React.useCallback(() => {
      setFollow(cardData?.extra?.following_status);
      if (type == "social") {
        getSocialPostData();
      } else {
        getPostDetails();
      }
    }, []),
  );

  useEffect(() => {
    const keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      handleKeyboardDismiss,
    );
    return () => {
      keyboardDidHideListener.remove();
    };
  }, []);

  const handleKeyboardDismiss = () => {
    inputRef.current.blur();
    // setCommentID("");
  };
  const getPostDetails = async () => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      port_id: portId,
      user_id: userId,
    };
    let res = await dispatch(getPortfolioDetails(body));
    if (res?.status == 200) {
      setCommentData(res?.results[0]?.comment_result);
      setFollow(res?.results[0].extra?.following_status);
    }
  };
  const getSocialPostData = async () => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      social_id: socialId,
      user_id: userId,
    };
    let res = await dispatch(getSocialPostDetails(body));
    if (res?.status == 200) {
      setCommentData(res?.results[0]?.comment_result);
      setFollow(cardData?.extra?.following_status);
    }
  };
  const handleAddCommentOnPost = async () => {
    // inputRef.current.focus();
    if (!comment) {
      showToast("Please enter the comment", "error");
    } else {
      const userId = await getData(storageKey?.USER_ID);
      var body = {
        user_id: userId,
        portfolio_id: type == "social" ? socialId : portId,
        type: commentID ? "reply" : "comment",
        comment_id: commentID,
        comment: comment,
      };
      let res = await dispatch(addComment(body));
      if (res?.status == 200) {
        if (type == "social") {
          getSocialPostData();
        } else {
          getPostDetails();
        }
        refreshList();
        setCommentID("");
        setComment("");
      }
    }
  };

  const handleFollow = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      action: type,
      user_id: userID,
      post_id: cardData?.post_details?.profile_id,
    };
    let res = await dispatch(userFollowing(body));
    if (res?.status == 200) {
      refreshList();
    }
  };
  // if (commentID) {
  //   commentRef?.focus();
  // }
  const handleReply = (item) => {
    if (inputRef.current.focus) {
      inputRef.current.focus();
      setCommentID(item?.comment?.comment_ID);
    } else {
      setCommentID("");
    }
  };
  const ListEmptyComponent = () => {
    return (
      <View
        style={{
          height: 500,
          justifyContent: "center",
        }}
      >
        <TextComponent
          text={"No comments yet!"}
          size={Sizes?.l}
          color={Colors?.darkgrey}
          width={120}
          style={{ textAlign: "center" }}
        />
      </View>
    );
  };
  const renderComments = ({ item, index }) => {
    return (
      <>
        <View
          key={index}
          style={{
            ...Styles?.flexRow,
            marginHorizontal: 15,
            width: "90%",
            marginVertical: 8,
          }}
        >
          <TouchableOpacity
            style={{
              ...Styles?.row,
              width: "82%",
            }}
            onPress={() => {
              setShowModelComment(false);
              userID == item?.comment?.user_id
                ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                    userId: item?.comment?.user_id,
                  })
                : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
                    userId: item?.comment?.user_id,
                    type: type,
                  });
            }}
          >
            {item?.comment?.user_data?.delete_account == 0 ? (
              <Image
                source={{ uri: item?.comment?.user_data?.attachment?.url }}
                style={{
                  ...styling?.profileImg,
                  borderWidth: 3,
                  borderColor: Colors?.lightThemeColor,
                }}
              />
            ) : (
              <FontAwesome
                name="user-circle-o"
                size={45}
                color={Colors?.gredient}
              />
            )}
            <View style={{ marginHorizontal: 10 }}>
              {/* <TextComponent
                text={item?.comment?.comment_author}
                size={Sizes?.s}
                fontWeight="400"
                width={120}
              /> */}
              <View style={{ ...Styles?.row, width: "90%" }}>
                <TextComponent
                  text={
                    item?.comment?.user_data?.delete_account == 0
                      ? item?.comment?.comment_author
                      : "User"
                  }
                  size={Sizes?.s}
                  fontWeight="400"
                  width={120}
                />
                <TextComponent
                  text={timeSince(
                    convertUTCToLocalTime(item?.comment?.comment_date),
                  )}
                  size={10}
                  width={120}
                  color={Colors?.darkgrey}
                  style={{ marginHorizontal: 10 }}
                />
              </View>
              <TextComponent
                text={item?.comment?.comment_content}
                size={Sizes?.xs}
                color={Colors?.darkgrey}
                width={150}
              />
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => handleReply(item)}>
            <FontAwesome
              name="reply"
              size={15}
              color={
                commentID == item?.comment?.comment_ID
                  ? Colors?.black
                  : Colors?.gredient
              }
            />
          </TouchableOpacity>
          {/* <FontAwesome name="heart-o" size={15} color={Colors?.darkgrey} /> */}
        </View>
        {item?.reply?.length != 0 &&
          item?.reply?.map((ele) => {
            return (
              <View
                style={{
                  ...Styles?.flexRow,
                  marginHorizontal: 30,
                  width: "75%",
                  marginVertical: 2,
                  // paddingLeft: 50,
                  alignSelf: "flex-end",
                }}
              >
                <View
                  style={{
                    ...Styles?.row,
                    width: "95%",
                  }}
                >
                  <ImageView
                    uri={ele?.user_data?.attachment?.url}
                    style={{
                      ...styling?.profileImg,
                      resizeMode: "cover",
                      width: 40,
                      height: 40,
                      borderWidth: 2,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <View style={{ marginHorizontal: 10 }}>
                    <View style={{ ...Styles?.row, width: "100%" }}>
                      <TextComponent
                        text={ele?.comment_author}
                        size={Sizes?.xs}
                        fontWeight="400"
                        width={120}
                      />
                      {/* <TextComponent
                        text={timeSince(ele?.comment_date)}
                        size={10}
                        width={120}
                        color={Colors?.darkgrey}
                        style={{ marginHorizontal: 10 }}
                      /> */}
                    </View>
                    <TextComponent
                      text={ele?.comment_content}
                      size={Sizes?.xs}
                      color={Colors?.darkgrey}
                      width={150}
                    />
                  </View>
                </View>
                {/* <FontAwesome
                  name="heart-o"
                  size={12}
                  color={Colors?.darkgrey}
                /> */}
              </View>
            );
          })}
      </>
    );
  };

  return (
    <Modal
      transparent={true}
      visible={ShowComment}
      animationType="slide"
      useNativeDriver={true}
      onRequestClose={() => setShowModelComment(false)}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        enabled={true}
        behavior={Platform?.OS == "ios" ? "padding" : null}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        >
          <TouchableOpacity
            onPress={() => setShowModelComment(false)}
            style={{
              width: 45,
              height: 45,
              borderRadius: 100,
              backgroundColor: "rgba(0,0,0,0.7)",
              // bottom: 30,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <FontAwesome5
              name="times"
              color={Colors?.white}
              size={20}
              style={{ alignItems: "center" }}
            />
          </TouchableOpacity>
          <View
            style={{
              backgroundColor: Colors?.lightThemeColor,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              height: 70,
              alignContent: "center",
              alignItems: "center",
              justifyContent: "center",
              marginTop: 20,
              // top: 100,
            }}
          >
            <View
              style={{
                backgroundColor: Colors?.gray,
                width: 100,
                height: 4,
                alignItems: "center",
                marginBottom: 10,
                borderRadius: 20,
              }}
            />
            <TextComponent text="Comments" size={Sizes?.l} />
          </View>

          <View
            style={{
              // position: "relative",
              backgroundColor: "white",
              height: 500,
              // overflow: "scroll",
            }}
          >
            <>
              <View
                style={{
                  ...Styles?.flexRow,
                  marginHorizontal: 15,
                  width: "90%",
                }}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigation?.navigate(routeName?.FEED_USER_PROFILE, {
                      userId: cardData?.post_details?.post_author,
                      type: type,
                    })
                  }
                  style={{
                    ...Styles?.row,
                    width: "82%",
                    paddingTop: 10,
                  }}
                >
                  <ImageView
                    uri={userData?.attachment?.url}
                    style={{
                      ...styling?.profileImg,
                      width: 70,
                      height: 70,
                      borderWidth: 3,
                      borderColor: Colors?.lightThemeColor,
                    }}
                  />
                  <View style={{ marginHorizontal: 10 }}>
                    <TextComponent
                      text={userData?.user_name}
                      size={Sizes?.l}
                      width={120}
                    />
                    <TextComponent
                      text={cardData?.post_details?.post_content}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      width={120}
                      numberOfLines={Math.floor(2.5)}
                    />
                  </View>
                </TouchableOpacity>
                {/* <TouchableOpacity
            onPress={() =>
              follow == 0 ? handleFollow("follow") : handleFollow("unfollow")
            }
          >
            <TextComponent
              text={follow == 0 ? "+ Follow" : "Following"}
              color={Colors?.blue}
              size={Sizes?.s}
              style={{ paddingHorizontal: 10 }}
            />
          </TouchableOpacity> */}
              </View>
              <View style={{ ...Styles?.separator }} />
            </>
            <FlatList
              data={commentData}
              // showsVerticalScrollIndicator={false}
              showsHorizontalScrollIndicator={false}
              keyExtractor={({ index }) => index}
              contentContainerStyle={{
                // backgroundColor: "red",
                paddingVertical: 10,

                // position: "absolute",
              }}
              // ListEmptyComponent={ListEmptyComponent}
              renderItem={renderComments}
            />
            <TouchableOpacity
              style={{
                ...Styles?.row,
                paddingVertical: 10,
                paddingHorizontal: Platform?.OS == "android" ? 20 : 25,
                borderTopRightRadius: 20,
                borderTopLeftRadius: 20,
                backgroundColor: Colors?.lightGray,
              }}
            >
              <View style={{ ...styling.inputView, width: "85%" }}>
                <MaterialCommunityIcons
                  name={"comment-quote-outline"}
                  size={20}
                  color={Colors?.darkgrey}
                  style={{ marginRight: 8 }}
                />
                <TextInput
                  ref={inputRef}
                  type="text"
                  value={comment}
                  placeholder="Add your comment..."
                  onChangeText={(val) => setComment(val)}
                  style={{
                    width: "90%",
                    borderBottomWidth: 0.8,
                    borderColor: Colors?.darkgrey,
                    paddingVertical: Platform?.OS == "android" ? 10 : 15,
                    paddingHorizontal: 5,
                  }}
                />
              </View>

              <TouchableOpacity onPress={() => handleAddCommentOnPost()}>
                <TextComponent
                  text="Post"
                  color={Colors?.blue}
                  size={Sizes?.s}
                  style={{ paddingHorizontal: 10 }}
                />
              </TouchableOpacity>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export const ThreeDotsModal = (props) => {
  const dispatching = useDispatch();
  const handleMessage = useHandleMessage();
  const { dispatch } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [follow, setFollow] = useState(cardData?.extra?.following_status);
  const [reportModal, setReportModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  let [animateModal, setanimateModal] = useState(false);

  const {
    ShowComment,
    setShowModelComment,
    userId,
    postId,
    refreshList,
    navigation,
    type,
    cardData,
    postData,
  } = props;

  useEffect(() => {
    getUserID();
  }, []);

  const getUserID = async () => {
    let userId = await getData(storageKey?.USER_ID);
    setUserID(userId);
    setFollow(cardData?.extra?.following_status);
  };

  const renderItem = ({ item, index }) => {
    return (
      <>
        {item?.show ? (
          <TouchableOpacity
            onPress={() => item?.method()}
            style={{
              ...Styles?.row,
              width: "82%",
              margin: 15,
            }}
          >
            <View
              style={{
                borderRadius: 100,
                paddingHorizontal: 10,
              }}
            >
              {item?.icon}
            </View>
            <TextComponent
              text={item?.title}
              size={Sizes?.l}
              fontWeight="400"
              style={{ marginHorizontal: 10 }}
              width={120}
            />
          </TouchableOpacity>
        ) : null}
      </>
    );
  };

  const options = [
    {
      title: "Message",
      icon: <FontAwesome name="send" size={26} color={Colors.themeColor} />,
      show: userID !== cardData?.post_details?.post_author,
      method: () => handleChat(),
    },
    {
      title: cardData?.extra?.saved_status === 1 ? "Unsave" : "Save",
      icon: (
        <FontAwesome
          name={cardData?.extra?.saved_status === 1 ? "bookmark" : "bookmark-o"}
          size={26}
          color={Colors.pink}
        />
      ),
      show: true,
      method: () =>
        handleSavePost(cardData?.extra?.saved_status === 1 ? "unsave" : "save"),
    },
    {
      title: follow === 0 ? "Follow" : "Unfollow",
      icon: (
        <SimpleLineIcons
          name={follow === 0 ? "user-follow" : "user-following"}
          size={25}
          color={Colors.blue}
        />
      ),
      show: userID !== cardData?.post_details?.post_author,
      method: handleFollowToggle,
    },
    {
      title: "Edit Post",
      icon: <FontAwesome name="edit" size={22} color={Colors.blue} />,
      show: userID === cardData?.post_details?.post_author,
      method: () => {
        setShowModelComment();
        navigation?.navigate(routeName?.EDIT_POST, {
          postType: type === "social" ? 1 : 2,
          postId,
        });
      },
    },
    {
      title: "Delete Post",
      icon: (
        <MaterialCommunityIcons name="delete" size={26} color={Colors.red} />
      ),
      show: userID === cardData?.post_details?.post_author,
      method: () => {
        Alert.alert("Delete Post", "Are you sure?", [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", onPress: handleDeletePost, style: "destructive" },
        ]);
      },
    },
    {
      title: "Report",
      icon: <Octicons name="report" size={24} color={Colors.red} />,
      show: userID !== cardData?.post_details?.post_author,
      method: () => setReportModal(true),
    },
  ];

  const handleDeletePost = async () => {
    const uid = await getData(storageKey?.USER_ID);
    const body = {
      action: "delete",
      post_id: postId,
      user_id: uid,
    };
    const res = await dispatching(deletePost(body));
    if (res?.status === 200) {
      refreshList();
      setShowModelComment();
    }
  };

  const handleSavePost = async (actionType) => {
    const uid = await getData(storageKey?.USER_ID);
    const body = {
      user_id: uid,
      post_id: postId,
      type: actionType === "save" ? "saved" : "unsaved",
      post_type: "211",
    };
    const endpoint = actionType === "save" ? SAVE_POST : UNSAVE_POST;
    const res = await dispatching(savePost(body, endpoint));
    if (res?.status === 200) {
      refreshList();
      setShowModelComment();
    }
  };

  const handleFollowToggle = async () => {
    const uid = await getData(storageKey?.USER_ID);
    const body = {
      action: follow === 0 ? "follow" : "unfollow",
      user_id: uid,
      post_id: cardData?.post_details?.profile_id,
    };
    const res = await dispatching(userFollowing(body));
    if (res?.status === 200) {
      setFollow((prev) => (prev === 0 ? 1 : 0));
      refreshList();
    }
  };

  const handleChat = async () => {
    setLoading(true);
    if (userID === cardData?.post_details?.post_author) {
      setLoading(false);
      return;
    }
    const userData = {
      displayName: cardData?.user_data?.user_name,
      uid: cardData?.user_data?.firebase_udi,
      photoURL: cardData?.user_data?.attachment?.url,
      user_id: cardData?.post_details?.post_author,
    };

    dispatch({ type: "CHANGE_USER", payload: userData });
    handleMessage(
      cardData?.user_data?.email,
      cardData?.user_data?.firebase_udi,
      cardData?.user_data?.user_name,
      setLoading,
      cardData?.user_data?.attachment?.url,
      cardData?.post_details?.post_author,
      cardData?.post_details?.user_role,
    );
    setShowModelComment(false);
  };

  return (
    <>
      <Loader loading={loading} />
      <SwipeUpDownModal
        modalVisible={ShowComment}
        PressToanimate={animateModal}
        ContentModal={
          <>
            <TouchableOpacity
              onPress={() => setShowModelComment(false)}
              style={{
                width: 45,
                height: 45,
                borderRadius: 100,
                backgroundColor: "rgba(0,0,0,0.6)",
                bottom: 30,
                justifyContent: "center",
                alignItems: "center",
                alignSelf: "center",
              }}
            >
              <FontAwesome5
                name="times"
                color={Colors?.white}
                size={20}
                style={{ alignItems: "center" }}
              />
            </TouchableOpacity>

            <View
              style={{
                // ...styling.threeDotsheaderContent,
                // height: 170,
                backgroundColor: Colors?.white,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20,
                maxHeight: 700,
                // height: 300,
              }}
            >
              <View
                style={{
                  backgroundColor: Colors?.gray,
                  width: 80,
                  height: 5,
                  marginTop: 20,
                  borderRadius: 50,
                  alignSelf: "center",
                }}
              />
              <FlatList
                data={options.filter((opt) => opt.show)}
                keyExtractor={(_, i) => i.toString()}
                contentContainerStyle={{ paddingVertical: 20 }}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={item.method}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 14,
                      paddingHorizontal: 20,
                    }}
                  >
                    <View style={{ width: 40, alignItems: "center" }}>
                      {item.icon}
                    </View>
                    <TextComponent
                      text={item.title}
                      size={Sizes.l}
                      color={
                        item.title.includes("Delete") ||
                        item.title.includes("Report")
                          ? Colors.red
                          : Colors.black
                      }
                      style={{ marginLeft: 16 }}
                    />
                  </TouchableOpacity>
                )}
              />
            </View>
            <Modal
              transparent={true}
              visible={reportModal}
              animationType="slide"
              useNativeDriver={true}
              onRequestClose={() => setReportModal(false)}
            >
              <View style={{ ...styling.reportModal }}>
                <View
                  style={{
                    ...Styles?.container,
                    padding: 20,
                    marginBottom: 20,
                  }}
                >
                  <ReportUser
                    type={type == "social" ? "social_post" : "portfolio"}
                    postId={postId}
                    reasonList={reasonList}
                    reportUserID={cardData?.post_details?.post_author}
                    onSucess={() => {
                      setReportModal(false);
                      setShowModelComment(false);
                      setanimateModal(false);
                    }}
                  />
                  <TouchableOpacity
                    onPress={() => {
                      {
                        setReportModal(false);
                        setShowModelComment(false);
                        setanimateModal(false);
                      }
                    }}
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: Colors?.white,
                      borderRadius: 100,
                    }}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={35}
                      color={Colors.red}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
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
                      Linking.openURL(modelData?.user_data.web_profile_link);
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
        }
        // HeaderStyle={{ position: "absolute", bottom: 0 }}
        ContentModalStyle={{
          // borderTopLeftRadius: 20,
          // borderTopRightRadius: 20,
          position: "absolute",
          // backgroundColor: Colors?.white,
          bottom: 0,
          width: "100%",
          zIndex: 99,
          // ...styling.threeDotsModal,
          // top: 520, //480
          // height: 20,
          // top: 480,
        }}
        // HeaderContent={

        // }
        onClose={() => {
          setShowModelComment(false);
          setanimateModal(false);
        }}
      />
    </>
  );
};
export const ShareModal = (props) => {
  const dispatch = useDispatch();
  let [animateModal, setanimateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [modelsList, setModelsList] = useState([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(-1);
  const { ShowComment, setShowModelComment } = props;
  const other = useSelector((state) => state?.otherReducer);

  useEffect(() => {
    getAllModelsList();
    // onShare();
  }, []);

  const getAllModelsList = async () => {
    let res = await dispatch(getModelsList());
    if (res?.status == 200) {
      setModelsList(res?.results);
      setLastPage(res.results.pagination?.end_page);
    }
  };
  const endReached = async () => {
    if (page == lastPage) {
      return;
    } else {
      var body = {
        page_number: page + 1,
        per_page: 10,
        keyword: "",
      };
      let res = await dispatch(getSearchResults(body));
      if (res?.status == 200) {
        setModelsList([...modelsList, ...res?.results?.search]);
        setPage(page + 1);
      }
    }
  };
  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  const getSearchResultDetails = async () => {
    if (searchQuery) {
      var body = {
        keyword: searchQuery,
      };
      let res = await dispatch(getSearchResults(body));
      if (res?.status == 200) {
        setModelsList(JSON?.stringify(res?.results?.search));
      }
    } else {
      getModelDetails();
    }
  };
  const renderEmpty = () => (other?.isLoading ? null : <NoDataFound />);
  const renderModelItem = useCallback(
    ({ item, index }) => {
      return (
        <View
          style={{
            ...Styles?.flexRow,
            marginHorizontal: 15,
            width: "90%",
            marginVertical: 8,
          }}
        >
          <View
            style={{
              ...Styles?.row,
              width: "82%",
            }}
          >
            <ImageView
              uri={item?.profile_image}
              style={{
                ...styling?.profileImg,
                borderWidth: 3,
                borderColor: Colors?.lightThemeColor,
              }}
              width={50}
              height={50}
              loading={other?.isLoading}
            />
            <TextComponent
              text={item?.post_meta_details?.display_name}
              size={Sizes?.l}
              fontWeight="400"
              style={{ marginHorizontal: 10 }}
              loading={other?.isLoading}
              width={120}
            />
          </View>
          <TouchableOpacity
            style={{
              ...Styles?.smallButton,
              backgroundColor: Colors?.blue,
            }}
          >
            <TextComponent
              text="Send"
              color={Colors?.white}
              size={Sizes?.s}
              style={{ paddingHorizontal: 10 }}
            />
          </TouchableOpacity>
        </View>
      );
    },
    [modelsList],
  );
  const onShare = async () => {
    try {
      const result = await Share.share({
        message:
          "React Native | A framework for building native apps using React",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  return (
    <SwipeUpDownModal
      modalVisible={ShowComment}
      PressToanimate={animateModal}
      //if you don't pass HeaderContent you should pass marginTop in view of ContentModel to Make modal swipeable
      ContentModal={
        <View style={{ ...styling.containerContent }}>
          <FlatList
            data={modelsList}
            keyExtractor={({ index }) => index}
            contentContainerStyle={{ paddingVertical: 40 }}
            onEndReachedThreshold={0.5}
            renderEmpty={renderEmpty}
            onEndReached={endReached}
            renderItem={renderModelItem}
          />
          <View
            style={{
              ...Styles?.flexRow,
              paddingVertical: 5,
              paddingHorizontal: 20,
              borderTopRightRadius: 20,
              borderTopLeftRadius: 20,
              backgroundColor: Colors?.gredient,
            }}
          >
            <TextComponent
              text="Share on another application..."
              size={Sizes?.l}
            />
            <TouchableOpacity
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.blue,
              }}
              onPress={() => onShare()}
            >
              <TextComponent
                text="Share Now"
                color={Colors?.white}
                size={Sizes?.s}
                style={{ paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      }
      HeaderStyle={styling.headerContent}
      ContentModalStyle={styling.Modal}
      HeaderContent={
        <>
          <TouchableOpacity
            onPress={() => setShowModelComment(false)}
            style={{
              width: 45,
              height: 45,
              borderRadius: 100,
              backgroundColor: "rgba(0,0,0,0.6)",
              bottom: 30,
              justifyContent: "center",
              alignItems: "center",
              alignSelf: "center",
            }}
          >
            <FontAwesome5
              name="times"
              color={Colors?.white}
              size={20}
              style={{ alignItems: "center" }}
            />
          </TouchableOpacity>
          <View style={styling.containerHeader}>
            <View
              style={{
                backgroundColor: Colors?.gray,
                width: 100,
                height: 5,
                alignItems: "center",
                marginBottom: 20,
                borderRadius: 20,
              }}
            />
            <View style={{ ...Styles?.row }}>
              <Searchbar
                placeholder="Search...."
                onChangeText={onChangeSearch}
                value={searchQuery}
                loading={other?.isLoading}
                icon={() => <FontAwesome name="search" color={Colors?.white} />}
                style={{
                  borderRadius: 10,
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  marginHorizontal: 15,
                  width: "80%",
                }}
                inputStyle={{ left: -25, fontSize: Sizes?.l }}
              />
              <TouchableOpacity
                onPress={() => getSearchResultDetails()}
                style={{
                  borderRadius: 10,
                  backgroundColor: Colors?.themeColor,
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                  alignSelf: "flex-end",
                  height: 49,
                  justifyContent: "center",
                  right: 20,
                }}
              >
                <FontAwesome
                  name="search"
                  color={Colors?.white}
                  size={19}
                  style={{ paddingHorizontal: 20, paddingVertical: 10 }}
                />
              </TouchableOpacity>
            </View>
          </View>
        </>
      }
      onClose={() => {
        setShowModelComment(false);
        setanimateModal(false);
      }}
    />
  );
};
const { width, height } = Dimensions.get("window");

const styling = StyleSheet.create({
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
    borderRadius: 10,
    // borderBottomEndRadius: 20,
    // borderBottomStartRadius: 20,
    padding: 20,
  },
  profileImg: {
    resizeMode: "contain",
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 2,
    borderColor: Colors?.white,
  },
  backgroundVideo: {
    height: height,
    position: "absolute",
    top: 0,
    left: 0,
    alignItems: "stretch",
    bottom: 0,
    right: 0,
  },
  containerContent: { marginTop: 40 },
  containerHeader: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 150,
    backgroundColor: Colors?.lightThemeColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  threeDotsheaderContent: {
    marginTop: 30,
  },
  headerContent: {
    marginTop: 170,
  },
  Modal: {
    backgroundColor: Colors?.white,
    marginTop: 230,
  },
  threeDotsModal: {
    backgroundColor: Colors?.white,
    marginTop: 30,
  },
  inputView: {
    flexDirection: "row",
    // paddingHorizontal: 8,
    alignItems: "center",
    paddingBottom: 10,
  },
  reportModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    // position: "absolute",
    // bottom: "10%",
    // height: dimensionheight("100%"),
    // top: "10%",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    width: "100%",
    elevation: 3,
    // paddingVertical: 20,
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

  // heart animating
  container: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  postImage: {
    width: 300,
    height: 400,
    borderRadius: 10,
  },
  heartContainer: {
    position: "absolute",
    top: "35%",
    left: "35%",
    transform: [{ translateX: -40 }, { translateY: -40 }],
    opacity: 1,
  },
  heartIcon: {
    width: 80,
    height: 80,
    // tintColor: "red",
  },
});

// import React, {
//   useCallback,
//   useContext,
//   useEffect,
//   useRef,
//   useState,
// } from "react";
// import {
//   FlatList,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   View,
//   Dimensions,
//   Share,
//   Alert,
//   TextInput,
//   Keyboard,
//   Modal,
//   Platform,
//   KeyboardAvoidingView,
//   Animated,
//   ScrollView,
//   ActivityIndicator,
// } from "react-native";
// import { Colors, Images, Sizes } from "../Constants";
// import { Styles } from "../Styles";
// import { Skeletoning } from "./Skeletoning";
// import { TextComponent } from "./TextComponent";
// import {
//   convertUTCToLocalTime,
//   getAccountApproval,
//   routeName,
//   showToast,
//   timeSince,
// } from "../Utility";
// import { useFocusEffect, useNavigation } from "@react-navigation/native";
// import BottomSheet, {
//   BottomSheetModal,
//   BottomSheetModalProvider,
//   BottomSheetTextInput,
//   BottomSheetView,
// } from "@gorhom/bottom-sheet";
// import {
//   addComment,
//   deletePost,
//   getAllLikesUsers,
//   getModelsList,
//   getPortfolioDetails,
//   getSocialPostDetails,
//   likeDislike,
// } from "../Redux/Services/OtherServices";
// import FontAwesome from "react-native-vector-icons/FontAwesome";
// import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
// import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
// import Octicons from "react-native-vector-icons/Octicons";
// import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
// import Entypo from "react-native-vector-icons/Entypo";
// import { useDispatch, useSelector } from "react-redux";
// import { ImageView } from "./ImageView";
// import { ViewImages } from "./ViewImages";
// import { getData, storageKey } from "../Utility/Storage";
// import { getUserDetail } from "../Redux/Services/AuthServices";
// import { SAVE_POST, UNSAVE_POST } from "../API Services/Url";
// import { ReportUser } from "./ReportUser";
// import { reasonList } from "../Global";
// import { useHandleMessage } from "../Utility/FirestoreHelper";
// import { ChatContext } from "../Context/ChatContext";
// import { Loader } from "./Loader";
// import { PostMediaViewer } from "./PostMediaViewer";
// import { TapGestureHandler, State } from "react-native-gesture-handler";

// export const PostCard = (props) => {
//   const {
//     cardData,
//     isLoading,
//     type,
//     navigation,
//     onPress,
//     onReelTap,
//     paused,
//     refreshList,
//     postType,
//     userId,
//     volume,
//     setVolume,
//     reelList,
//     setReelList,
//   } = props;

//   const other = useSelector((state) => state?.otherReducer);
//   const auth = useSelector((state) => state?.authReducer);
//   const playVedio = useRef(null);
//   const dispatch = useDispatch();

//   const [sendSwiper, setSendSwiper] = useState(false);
//   const [likeModal, setLikeModal] = useState(false);
//   const [commentSwiper, setCommentSwiper] = useState(false);
//   const [threeDotsSwiper, setThreeDotsSwiper] = useState(false);
//   const [imagesModal, setImagesModal] = useState(false);
//   const [postData, setPostData] = useState("");
//   const [modal, setModal] = useState(false);
//   const [userID, setUserID] = useState("");
//   const [approvalStatus, setApprovalStatus] = useState(false);
//   const [expendView, setExpendView] = useState(false);
//   const [like, setLike] = useState(false);
//   const [loadImage, setLoadImage] = useState(false);
//   const [likeStatus, setLikeStatus] = useState({
//     status: cardData?.extra?.like_status,
//     count: cardData?.extra?.likes_count,
//   });

//   // Heart animation
//   const [showHeart, setShowHeart] = useState(false);
//   const scaleAnim = useRef(new Animated.Value(0)).current;
//   const opacityAnim = useRef(new Animated.Value(0)).current;
//   const isAnimating = useRef(false);
//   const lastTap = useRef(null);
//   const tapTimeout = useRef(null);

//   // Bottom sheet refs
//   const likeModalRef = useRef(null);
//   const commentModalRef = useRef(null);
//   const threeDotsModalRef = useRef(null);
//   const shareModalRef = useRef(null);

//   useEffect(() => {
//     return () => {
//       if (tapTimeout.current) clearTimeout(tapTimeout.current);
//       scaleAnim.stopAnimation();
//       opacityAnim.stopAnimation();
//     };
//   }, []);

//   useFocusEffect(
//     useCallback(() => {
//       let isActive = true;
//       const getAccountApprovalStatus = async () => {
//         let status = await getData(storageKey?.APPROVAL_STATUS);
//         let accountApproval = JSON?.parse(status);
//         if (isActive) setApprovalStatus(accountApproval);
//         const userId = await getData(storageKey?.USER_ID);
//         if (isActive) setUserID(userId);
//       };
//       getAccountApprovalStatus();
//       return () => {
//         isActive = false;
//       };
//     }, [cardData?.id]),
//   );

//   const showHeartAnimation = () => {
//     if (isAnimating.current) return;
//     isAnimating.current = true;
//     setShowHeart(true);
//     scaleAnim.setValue(0);
//     opacityAnim.setValue(1);
//     Animated.parallel([
//       Animated.sequence([
//         Animated.timing(scaleAnim, {
//           toValue: 1.2,
//           duration: 200,
//           useNativeDriver: true,
//         }),
//         Animated.timing(scaleAnim, {
//           toValue: 1,
//           duration: 150,
//           useNativeDriver: true,
//         }),
//       ]),
//       Animated.timing(opacityAnim, {
//         toValue: 0,
//         duration: 600,
//         delay: 200,
//         useNativeDriver: true,
//       }),
//     ]).start(() => {
//       setShowHeart(false);
//       isAnimating.current = false;
//     });
//   };

//   const handleCardTap = (event, status) => {
//     if (event.nativeEvent.state !== State.END) return;
//     const now = Date.now();
//     const DOUBLE_TAP_DELAY = 300;
//     if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
//       clearTimeout(tapTimeout.current);
//       lastTap.current = null;
//       handleLikeDislike(status);
//       showHeartAnimation();
//     } else {
//       lastTap.current = now;
//       tapTimeout.current = setTimeout(() => {
//         if (lastTap.current === now) {
//           lastTap.current = null;
//         }
//       }, DOUBLE_TAP_DELAY);
//     }
//   };

//   const handleLikeDislike = async (status) => {
//     setLikeStatus({
//       ...likeStatus,
//       status: status == 0 ? 1 : 0,
//       count:
//         status == 0
//           ? JSON.parse(likeStatus?.count) + 1
//           : JSON.parse(likeStatus?.count) - 1,
//     });
//     const userId = await getData(storageKey?.USER_ID);
//     var body = {
//       type: status == 0 ? "like" : "unlike",
//       user_id: userId,
//       post_id: cardData?.post_details?.ID,
//     };
//     let res = await dispatch(likeDislike(body));
//     if (res?.status == 200) {
//       refreshList();
//     }
//   };

//   const getPortDetails = async (id) => {
//     const userId = await getData(storageKey?.USER_ID);
//     var body = {
//       port_id: id,
//       user_id: userId,
//     };
//     let res = await dispatch(getPortfolioDetails(body));
//     if (res?.status == 200) {
//       setPostData(res?.results[0]);
//       setCommentSwiper(true);
//     }
//   };

//   const getSocialPostData = async (id) => {
//     const userId = await getData(storageKey?.USER_ID);
//     var body = {
//       social_id: id,
//       user_id: userId,
//     };
//     let res = await dispatch(getSocialPostDetails(body));
//     if (res?.status == 200) {
//       setCommentSwiper(true);
//       setPostData(res?.results[0]);
//     }
//   };

//   const handleReelSwiper = async () => {
//     setModal(true);
//     let arrr = [cardData];
//     let newArr = arrr.concat(...reelList);
//     setReelList(newArr);
//   };

//   const userRole =
//     cardData?.user_data?.user_role == 11
//       ? "Model"
//       : cardData?.user_data?.user_role == 13
//       ? "Photographer"
//       : cardData?.user_data?.user_role == 15
//       ? "Actor"
//       : "Admin";

//   return (
//     <BottomSheetModalProvider>
//       <>
//         <View
//           style={{
//             marginVertical: 10,
//             marginHorizontal: 10,
//             borderWidth: 2,
//             borderRadius: 10,
//             borderColor: Colors?.lightPink,
//             backgroundColor: Colors?.white,
//           }}
//         >
//           {other?.isLoading ? null : (
//             <>
//               <PostMediaViewer
//                 media={cardData?.media ?? []}
//                 onLike={() => {
//                   handleLikeDislike(likeStatus?.status);
//                 }}
//                 containerHeight={500}
//               />
//               <View style={{ ...styling?.cardContentView }}>
//                 <TouchableOpacity
//                   style={{ ...styling?.cardProfileView }}
//                   onPress={() =>
//                     userID == cardData?.post_details?.post_author
//                       ? navigation?.navigate(routeName?.MODEL_PROFILE, {
//                           userId: cardData?.post_details?.post_author,
//                         })
//                       : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
//                           userId: cardData?.post_details?.post_author,
//                           type: postType,
//                         })
//                   }
//                 >
//                   {cardData?.user_data?.attachment?.url ? (
//                     <Image
//                       source={{ uri: cardData?.user_data?.attachment?.url }}
//                       style={styling.profileImg}
//                     />
//                   ) : (
//                     <FontAwesome
//                       name="user-circle-o"
//                       size={50}
//                       color={Colors?.gredient}
//                     />
//                   )}
//                   <View
//                     style={{
//                       paddingHorizontal: 10,
//                       paddingVertical: 5,
//                     }}
//                   >
//                     <TextComponent
//                       text={cardData?.user_data?.display_name}
//                       color={Colors?.white}
//                       size={Sizes?.l}
//                       style={{
//                         textShadowColor: "rgba(0,0,0,0.8)",
//                         textShadowOffset: { width: -2, height: 0 },
//                         textShadowRadius: 5,
//                       }}
//                     />
//                     <TextComponent
//                       text={`• ${userRole}`}
//                       color={Colors?.white}
//                       size={Sizes?.xs}
//                       fontWeight="400"
//                       style={{
//                         textShadowColor: "rgba(0,0,0,0.8)",
//                         textShadowOffset: { width: -1, height: 1 },
//                         textShadowRadius: 5,
//                       }}
//                     />
//                   </View>
//                 </TouchableOpacity>
//                 <View
//                   style={{
//                     right: 16,
//                     paddingVertical: 15,
//                     position: "absolute",
//                   }}
//                 >
//                   <TouchableOpacity
//                     onPress={() =>
//                       approvalStatus
//                         ? setThreeDotsSwiper(true)
//                         : getAccountApproval(true, navigation, auth)
//                     }
//                   >
//                     <Entypo
//                       name="dots-three-vertical"
//                       size={18}
//                       color={Colors?.white}
//                       style={{ top: -10, padding: 10 }}
//                     />
//                   </TouchableOpacity>
//                 </View>
//               </View>
//             </>
//           )}
//           <View
//             style={{
//               ...styling?.postDeatils,
//               padding: 0,
//               paddingTop: 5,
//               paddingBottom: 20,
//               paddingHorizontal: isLoading ? 0 : 20,
//               marginTop: -15,
//             }}
//           >
//             <View style={{ ...Styles?.row, paddingVertical: 10 }}>
//               <View style={{ flexDirection: "row", alignItems: "center" }}>
//                 <TouchableOpacity
//                   onPress={() =>
//                     approvalStatus
//                       ? handleLikeDislike(likeStatus?.status)
//                       : getAccountApproval(true, navigation, auth)
//                   }
//                 >
//                   <FontAwesome
//                     name={likeStatus?.status == 1 ? "heart" : "heart-o"}
//                     size={14}
//                     color={Colors?.pink}
//                     style={{ paddingRight: 5 }}
//                   />
//                 </TouchableOpacity>
//                 <TouchableOpacity onPress={() => setLikeModal(true)}>
//                   <TextComponent
//                     text={` ${likeStatus?.count ? likeStatus?.count : 0} ${
//                       likeStatus?.count > 1 ? "Likes" : "Like"
//                     } `}
//                     color={Colors?.darkgrey}
//                     size={Sizes?.s}
//                     loading={isLoading}
//                     style={{ paddingRight: 5 }}
//                     width={200}
//                   />
//                 </TouchableOpacity>
//               </View>
//               <TouchableOpacity
//                 onPress={() =>
//                   approvalStatus
//                     ? postType == "social"
//                       ? getSocialPostData(cardData?.post_details?.ID)
//                       : getPortDetails(cardData?.post_details?.ID)
//                     : getAccountApproval(true, navigation, auth)
//                 }
//                 style={{
//                   flexDirection: "row",
//                   alignItems: "center",
//                   paddingHorizontal: 10,
//                 }}
//               >
//                 <FontAwesome
//                   name="comments"
//                   size={14}
//                   color={Colors?.blue}
//                   style={{ paddingRight: 5 }}
//                 />
//                 <TextComponent
//                   text={`${
//                     cardData?.extra?.comments_count
//                       ? cardData?.extra?.comments_count
//                       : 0
//                   } ${
//                     cardData?.extra?.comments_count > 1 ? "Comments" : "Comment"
//                   } `}
//                   color={Colors?.darkgrey}
//                   size={Sizes?.s}
//                   loading={isLoading}
//                   style={{ paddingRight: 5 }}
//                   width={150}
//                 />
//               </TouchableOpacity>
//             </View>
//             <TextComponent
//               text={cardData?.post_details?.post_title}
//               color={Colors?.gray}
//               size={Sizes?.xs}
//               style={{
//                 textTransform: "capitalize",
//                 lineHeight: 20,
//                 letterSpacing: 0.2,
//               }}
//             />
//             <TouchableOpacity onPress={() => setExpendView(!expendView)}>
//               {cardData?.post_details?.post_content && (
//                 <TextComponent
//                   text={cardData?.post_details?.post_content}
//                   color={Colors?.darkgrey}
//                   size={Sizes?.xs}
//                   fontWeight="400"
//                   loading={isLoading}
//                   numberOfLines={expendView ? 0 : Math.floor(2.5)}
//                   style={{
//                     textTransform: "capitalize",
//                     lineHeight: 20,
//                     letterSpacing: 0.2,
//                   }}
//                 />
//               )}
//             </TouchableOpacity>
//             {cardData?.post_details?.post_content?.length > 50 && (
//               <TouchableOpacity onPress={() => setExpendView(!expendView)}>
//                 <TextComponent
//                   text={expendView ? "Less" : "...Read More"}
//                   size={Sizes?.xs}
//                   color={Colors?.blue}
//                   numberOfLines={expendView ? 0 : Math.floor(2.5)}
//                   fontWeight="400"
//                 />
//               </TouchableOpacity>
//             )}
//             {cardData?.post_details?.post_date && (
//               <TextComponent
//                 text={timeSince(
//                   convertUTCToLocalTime(cardData?.post_details?.post_date),
//                 )}
//                 color={Colors?.gray}
//                 size={Sizes?.xs}
//                 fontWeight="400"
//                 style={{
//                   letterSpacing: 0.2,
//                   paddingVertical: 4,
//                 }}
//               />
//             )}
//           </View>
//         </View>

//         {sendSwiper && (
//           <ShareModal
//             ref={shareModalRef}
//             setShowModelComment={setSendSwiper}
//             ShowComment={sendSwiper}
//           />
//         )}
//         {likeModal && (
//           <LikeModal
//             ref={likeModalRef}
//             setShowModelComment={setLikeModal}
//             ShowComment={likeModal}
//             socialId={cardData?.post_details?.ID}
//             navigation={navigation}
//           />
//         )}
//         {commentSwiper && (
//           <CommentsModal
//             ref={commentModalRef}
//             postId={cardData?.post_details?.ID}
//             portId={cardData?.post_details?.ID}
//             socialId={cardData?.post_details?.ID}
//             type={postType}
//             userData={postData?.user_data}
//             comments={postData?.comment_result}
//             setShowModelComment={setCommentSwiper}
//             ShowComment={commentSwiper}
//             getPortDetails={getPortDetails}
//             getSocialPostData={getSocialPostData}
//             refreshList={refreshList}
//             cardData={cardData}
//             userID={userID}
//           />
//         )}
//         {threeDotsSwiper && (
//           <ThreeDotsModal
//             ref={threeDotsModalRef}
//             postData={postData}
//             navigation={navigation}
//             cardData={cardData}
//             userId={userId}
//             postId={cardData?.post_details?.ID}
//             setShowModelComment={setThreeDotsSwiper}
//             ShowComment={threeDotsSwiper}
//             refreshList={refreshList}
//             type={postType}
//           />
//         )}
//         {imagesModal && (
//           <ViewImages
//             images={cardData?.gallery?.gallery_imgs}
//             show={imagesModal}
//             setShow={setImagesModal}
//           />
//         )}
//       </>
//     </BottomSheetModalProvider>
//   );
// };

// const LikeModal = React.forwardRef((props, ref) => {
//   const dispatch = useDispatch();
//   const { ShowComment, setShowModelComment, socialId, navigation } = props;
//   const [userList, setUserList] = useState([]);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(-1);
//   const snapPoints = useRef(["60%", "90%"]).current;

//   useEffect(() => {
//     if (ShowComment) {
//       ref.current?.present();
//       getUsersList();
//     }
//   }, [ShowComment]);

//   const getUsersList = async () => {
//     var body = {
//       type: "like",
//       post_id: socialId,
//       page: 1,
//       limit: 15,
//     };
//     let res = await dispatch(getAllLikesUsers(body));
//     if (res?.status == 200) {
//       setUserList(res?.results?.like_list);
//     }
//   };

//   const getModelDetails = async (item) => {
//     let modelID = item?.user_id;
//     var body = {
//       user_id: modelID,
//     };
//     let res = await dispatch(getUserDetail(body));
//     if (res?.status == 200) {
//       setShowModelComment(false);
//       navigation?.navigate(routeName?.MODEL_PROFILE, {
//         modelData: res?.results,
//       });
//     }
//   };

//   const renderEmpty = () => <TextComponent text="No data found" />;

//   const renderModelItem = useCallback(
//     ({ item, index }) => {
//       return (
//         <View
//           style={{
//             ...Styles?.flexRow,
//             marginHorizontal: 15,
//             width: "90%",
//             marginBottom: 10,
//           }}
//         >
//           <TouchableOpacity
//             onPress={() => getModelDetails(item)}
//             style={{
//               ...Styles?.row,
//               width: "82%",
//             }}
//           >
//             <ImageView
//               uri={item?.user_image}
//               style={{
//                 ...styling?.profileImg,
//                 borderWidth: 3,
//                 borderColor: Colors?.lightThemeColor,
//               }}
//               width={50}
//               height={50}
//             />
//             <TextComponent
//               text={item?.user_name}
//               size={Sizes?.l}
//               fontWeight="400"
//               style={{ marginHorizontal: 10 }}
//               width={120}
//             />
//             <FontAwesome
//               name="heart"
//               size={20}
//               color={Colors?.pink}
//               style={{ paddingRight: 5 }}
//             />
//           </TouchableOpacity>
//         </View>
//       );
//     },
//     [userList],
//   );

//   return (
//     <BottomSheetModal
//       ref={ref}
//       index={0}
//       snapPoints={snapPoints}
//       enablePanDownToClose={true}
//       backdropComponent={({ style }) => (
//         <View style={[style, { backgroundColor: "rgba(0,0,0,0.5)" }]} />
//       )}
//       onDismiss={() => setShowModelComment(false)}
//     >
//       <BottomSheetView style={{ flex: 1 }}>
//         <TouchableOpacity
//           onPress={() => ref.current?.dismiss()}
//           style={{
//             width: 45,
//             height: 45,
//             borderRadius: 100,
//             backgroundColor: "rgba(0,0,0,0.6)",
//             alignSelf: "center",
//             marginVertical: 16,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <FontAwesome5 name="times" color={Colors?.white} size={20} />
//         </TouchableOpacity>

//         <View
//           style={{
//             backgroundColor: Colors?.lightThemeColor,
//             borderTopLeftRadius: 20,
//             borderTopRightRadius: 20,
//             height: 70,
//             alignItems: "center",
//             justifyContent: "center",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: Colors?.gray,
//               width: 100,
//               height: 4,
//               borderRadius: 20,
//               marginBottom: 10,
//             }}
//           />
//           <TextComponent text="Who Liked this Post" size={Sizes?.l} />
//         </View>

//         <FlatList
//           data={userList}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={{ paddingVertical: 20 }}
//           renderItem={renderModelItem}
//           ListEmptyComponent={renderEmpty}
//         />
//       </BottomSheetView>
//     </BottomSheetModal>
//   );
// });

// const CommentsModal = React.forwardRef((props, ref) => {
//   const dispatch = useDispatch();
//   const navigation = useNavigation();
//   const {
//     ShowComment,
//     setShowModelComment,
//     comments,
//     userData,
//     portId,
//     socialId,
//     type,
//     refreshList,
//     cardData,
//     userID,
//   } = props;

//   const [comment, setComment] = useState("");
//   const [commentData, setCommentData] = useState("");
//   const [commentID, setCommentID] = useState("");
//   const [follow, setFollow] = useState(cardData?.extra?.following_status);
//   const inputRef = useRef(null);
//   const snapPoints = useRef(["75%", "90%"]).current;

//   useEffect(() => {
//     if (ShowComment) {
//       ref.current?.present();
//       if (type == "social") {
//         getSocialPostData();
//       } else {
//         getPostDetails();
//       }
//     }
//   }, [ShowComment]);

//   useEffect(() => {
//     const keyboardDidHideListener = Keyboard.addListener(
//       "keyboardDidHide",
//       () => inputRef.current?.blur(),
//     );
//     return () => keyboardDidHideListener.remove();
//   }, []);

//   const getPostDetails = async () => {
//     const userId = await getData(storageKey?.USER_ID);
//     var body = {
//       port_id: portId,
//       user_id: userId,
//     };
//     let res = await dispatch(getPortfolioDetails(body));
//     if (res?.status == 200) {
//       setCommentData(res?.results[0]?.comment_result);
//       setFollow(res?.results[0].extra?.following_status);
//     }
//   };

//   const getSocialPostData = async () => {
//     const userId = await getData(storageKey?.USER_ID);
//     var body = {
//       social_id: socialId,
//       user_id: userId,
//     };
//     let res = await dispatch(getSocialPostDetails(body));
//     if (res?.status == 200) {
//       setCommentData(res?.results[0]?.comment_result);
//     }
//   };

//   const handleAddCommentOnPost = async () => {
//     if (!comment.trim()) {
//       showToast("Please enter a comment", "error");
//       return;
//     }

//     const userId = await getData(storageKey?.USER_ID);
//     const body = {
//       user_id: userId,
//       portfolio_id: type === "social" ? socialId : portId,
//       type: commentID ? "reply" : "comment",
//       comment_id: commentID,
//       comment,
//     };

//     const res = await dispatch(addComment(body));
//     if (res?.status === 200) {
//       setComment("");
//       setCommentID("");
//       if (type === "social") {
//         getSocialPostData();
//       } else {
//         getPostDetails();
//       }
//       refreshList();
//       Keyboard.dismiss();
//     }
//   };

//   const handleReply = (item) => {
//     inputRef.current?.focus();
//     setCommentID(item?.comment?.comment_ID);
//   };

//   const ListEmptyComponent = () => (
//     <View
//       style={{ height: 300, justifyContent: "center", alignItems: "center" }}
//     >
//       <TextComponent
//         text={"No comments yet!"}
//         size={Sizes?.l}
//         color={Colors?.darkgrey}
//       />
//     </View>
//   );

//   const renderComments = ({ item, index }) => {
//     return (
//       <React.Fragment key={index}>
//         <View
//           style={{
//             ...Styles?.flexRow,
//             marginHorizontal: 15,
//             width: "90%",
//             marginVertical: 8,
//           }}
//         >
//           <TouchableOpacity
//             style={{ ...Styles?.row, width: "82%" }}
//             onPress={() => {
//               setShowModelComment(false);
//               userID == item?.comment?.user_id
//                 ? navigation?.navigate(routeName?.MODEL_PROFILE, {
//                     userId: item?.comment?.user_id,
//                   })
//                 : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
//                     userId: item?.comment?.user_id,
//                     type: type,
//                   });
//             }}
//           >
//             {item?.comment?.user_data?.delete_account == 0 ? (
//               <Image
//                 source={{ uri: item?.comment?.user_data?.attachment?.url }}
//                 style={{
//                   ...styling?.profileImg,
//                   borderWidth: 3,
//                   borderColor: Colors?.lightThemeColor,
//                 }}
//               />
//             ) : (
//               <FontAwesome
//                 name="user-circle-o"
//                 size={45}
//                 color={Colors?.gredient}
//               />
//             )}
//             <View style={{ marginHorizontal: 10 }}>
//               <View style={{ ...Styles?.row, width: "90%" }}>
//                 <TextComponent
//                   text={
//                     item?.comment?.user_data?.delete_account == 0
//                       ? item?.comment?.comment_author
//                       : "User"
//                   }
//                   size={Sizes?.s}
//                   fontWeight="400"
//                   width={120}
//                 />
//                 <TextComponent
//                   text={timeSince(
//                     convertUTCToLocalTime(item?.comment?.comment_date),
//                   )}
//                   size={10}
//                   width={120}
//                   color={Colors?.darkgrey}
//                   style={{ marginHorizontal: 10 }}
//                 />
//               </View>
//               <TextComponent
//                 text={item?.comment?.comment_content}
//                 size={Sizes?.xs}
//                 color={Colors?.darkgrey}
//                 width={150}
//               />
//             </View>
//           </TouchableOpacity>
//           <TouchableOpacity onPress={() => handleReply(item)}>
//             <FontAwesome
//               name="reply"
//               size={15}
//               color={
//                 commentID == item?.comment?.comment_ID
//                   ? Colors?.black
//                   : Colors?.gredient
//               }
//             />
//           </TouchableOpacity>
//         </View>

//         {item?.reply?.length > 0 &&
//           item.reply.map((ele, idx) => (
//             <View
//               key={idx}
//               style={{
//                 ...Styles?.flexRow,
//                 marginHorizontal: 30,
//                 width: "75%",
//                 marginVertical: 2,
//                 alignSelf: "flex-end",
//               }}
//             >
//               <View style={{ ...Styles?.row, width: "95%" }}>
//                 <ImageView
//                   uri={ele?.user_data?.attachment?.url}
//                   style={{
//                     ...styling?.profileImg,
//                     width: 40,
//                     height: 40,
//                     borderWidth: 2,
//                     borderColor: Colors?.lightThemeColor,
//                   }}
//                 />
//                 <View style={{ marginHorizontal: 10 }}>
//                   <TextComponent
//                     text={ele?.comment_author}
//                     size={Sizes?.xs}
//                     fontWeight="400"
//                     width={120}
//                   />
//                   <TextComponent
//                     text={ele?.comment_content}
//                     size={Sizes?.xs}
//                     color={Colors?.darkgrey}
//                     width={150}
//                   />
//                 </View>
//               </View>
//             </View>
//           ))}
//       </React.Fragment>
//     );
//   };

//   return (
//     <BottomSheetModal
//       ref={ref}
//       index={1}
//       snapPoints={snapPoints}
//       enablePanDownToClose={true}
//       keyboardBehavior="interactive" // core for expansion
//       keyboardBlurBehavior="restore" // restores position on blur
//       android_keyboardInputMode="adjustResize" // critical for Android
//       backdropComponent={({ style }) => (
//         <View style={[style, { backgroundColor: "rgba(0,0,0,0.5)" }]} />
//       )}
//       onDismiss={() => setShowModelComment(false)}
//     >
//       <BottomSheetView style={{ flex: 1 }}>
//         {/* Post preview header */}
//         <View
//           style={{ paddingHorizontal: 15, paddingTop: 10, paddingBottom: 8 }}
//         >
//           <TouchableOpacity
//             style={{ ...Styles?.row, width: "100%" }}
//             onPress={() =>
//               navigation?.navigate(routeName?.FEED_USER_PROFILE, {
//                 userId: cardData?.post_details?.post_author,
//                 type: type,
//               })
//             }
//           >
//             <ImageView
//               uri={userData?.attachment?.url}
//               style={{
//                 ...styling?.profileImg,
//                 width: 70,
//                 height: 70,
//                 borderWidth: 3,
//                 borderColor: Colors?.lightThemeColor,
//               }}
//             />
//             <View style={{ marginHorizontal: 10, flex: 1 }}>
//               <TextComponent
//                 text={userData?.user_name}
//                 size={Sizes?.l}
//                 width={120}
//               />
//               <TextComponent
//                 text={cardData?.post_details?.post_content}
//                 size={Sizes?.s}
//                 color={Colors?.darkgrey}
//                 numberOfLines={2}
//               />
//             </View>
//           </TouchableOpacity>
//         </View>

//         <View style={{ ...Styles?.separator }} />

//         {/* Fixed-height scrollable comments */}
//         <View style={{ height: 300, flexGrow: 0 }}>
//           <FlatList
//             data={commentData || []}
//             showsVerticalScrollIndicator={false}
//             keyExtractor={(item, index) => index.toString()}
//             contentContainerStyle={{
//               paddingHorizontal: 15,
//               paddingBottom: 40, // increased slightly for better spacing
//             }}
//             renderItem={renderComments}
//             ListEmptyComponent={ListEmptyComponent}
//             keyboardShouldPersistTaps="handled"
//             style={{ flex: 1 }}
//           />
//         </View>

//         {/* Input bar – direct child, no KeyboardAvoidingView */}
//         <View
//           style={{
//             borderTopWidth: 1,
//             borderTopColor: Colors.lightGray,
//             backgroundColor: Colors.white,
//             paddingHorizontal: 15,
//             paddingVertical: 12,
//             paddingBottom: Platform.OS === "ios" ? 44 : 20, // bigger safe-area + margin
//             flexDirection: "row",
//             alignItems: "center",
//             // floating look
//             shadowColor: "#000",
//             shadowOffset: { width: 0, height: -3 },
//             shadowOpacity: 0.12,
//             shadowRadius: 6,
//             elevation: 8,
//           }}
//         >
//           <MaterialCommunityIcons
//             name="comment-quote-outline"
//             size={24}
//             color={Colors.darkgrey}
//             style={{ marginRight: 10 }}
//           />

//           <BottomSheetTextInput
//             value={comment}
//             onChangeText={setComment}
//             placeholder="Add your comment..."
//             placeholderTextColor={Colors?.darkgrey}
//             multiline
//             style={{
//               flex: 1,
//               minHeight: 44,
//               maxHeight: 120,
//               backgroundColor: "#f8f9fa",
//               borderRadius: 22,
//               paddingHorizontal: 16,
//               paddingVertical: 10,
//               fontSize: 16,
//               borderWidth: 1,
//               borderColor: "#ddd",
//             }}
//           />

//           <TouchableOpacity
//             onPress={handleAddCommentOnPost}
//             style={{ marginLeft: 12, paddingHorizontal: 8 }}
//             disabled={!comment.trim()}
//           >
//             <TextComponent
//               text="Post"
//               color={comment.trim() ? Colors?.blue : Colors?.gray}
//               size={Sizes?.l}
//               style={{ fontWeight: comment.trim() ? "600" : "400" }}
//             />
//           </TouchableOpacity>
//         </View>
//       </BottomSheetView>
//     </BottomSheetModal>
//   );
// });

// const ThreeDotsModal = React.forwardRef((props, ref) => {
//   const handleMessage = useHandleMessage();
//   const dispatching = useDispatch();
//   const { dispatch } = useContext(ChatContext);
//   const {
//     ShowComment,
//     setShowModelComment,
//     userId,
//     postId,
//     refreshList,
//     navigation,
//     type,
//     cardData,
//   } = props;

//   const [userID, setUserID] = useState("");
//   const [loading, setLoading] = useState(false);
//   const [follow, setFollow] = useState(cardData?.extra?.following_status);
//   const [reportModal, setReportModal] = useState(false);
//   const [modalVisible, setModalVisible] = useState(false);

//   const snapPoints = useRef(["60%", "80%"]).current;

//   useEffect(() => {
//     if (ShowComment) {
//       ref.current?.present();
//       getUserID();
//     }
//   }, [ShowComment]);

//   const getUserID = async () => {
//     let id = await getData(storageKey?.USER_ID);
//     setUserID(id);
//   };

//   const handleDeletePost = async () => {
//     let userId = await getData(storageKey?.USER_ID);
//     var body = {
//       action: "delete",
//       post_id: postId,
//       user_id: userId,
//     };
//     let res = await dispatching(deletePost(body));
//     if (res?.status == 200) {
//       refreshList();
//       ref.current?.dismiss();
//     }
//   };

//   const handleDelete = () => {
//     Alert.alert("Are you sure?", "You want to delete this post.", [
//       { text: "No", style: "cancel" },
//       { text: "Yes", onPress: handleDeletePost },
//     ]);
//   };
//   const handleSavePost = async (actionType) => {
//     const uid = await getData(storageKey?.USER_ID);
//     const body = {
//       user_id: uid,
//       post_id: postId,
//       type: actionType === "save" ? "saved" : "unsaved",
//       post_type: "211",
//     };
//     const endpoint = actionType === "save" ? SAVE_POST : UNSAVE_POST;
//     const res = await dispatch(savePost(body, endpoint));
//     if (res?.status === 200) {
//       refreshList();
//       setShowModelComment();
//     }
//   };

//   const handleFollowToggle = async () => {
//     const uid = await getData(storageKey?.USER_ID);
//     const body = {
//       action: follow === 0 ? "follow" : "unfollow",
//       user_id: uid,
//       post_id: cardData?.post_details?.profile_id,
//     };
//     const res = await dispatch(userFollowing(body));
//     if (res?.status === 200) {
//       setFollow((prev) => (prev === 0 ? 1 : 0));
//       refreshList();
//     }
//   };

// const handleChat = async () => {
//   setLoading(true);
//   if (userID === cardData?.post_details?.post_author) {
//     setLoading(false);
//     return;
//   }
//   const userData = {
//     displayName: cardData?.user_data?.user_name,
//     uid: cardData?.user_data?.firebase_udi,
//     photoURL: cardData?.user_data?.attachment?.url,
//     user_id: cardData?.post_details?.post_author,
//   };
//   dispatch({ type: "CHANGE_USER", payload: userData });
//   handleMessage(
//     cardData?.user_data?.email,
//     cardData?.user_data?.firebase_udi,
//     cardData?.user_data?.user_name,
//     setLoading,
//     cardData?.user_data?.attachment?.url,
//     cardData?.post_details?.post_author,
//     cardData?.post_details?.user_role,
//   );
//   ref.current?.dismiss();
// };

//   // Add your other handlers (save, follow, etc.) here if needed

//   const options = [
//     {
//       title: "Message",
//       icon: <FontAwesome name="send" size={26} color={Colors.themeColor} />,
//       show: userID !== cardData?.post_details?.post_author,
//       method: handleChat,
//     },
//     {
//       title: cardData?.extra?.saved_status === 1 ? "Unsave" : "Save",
//       icon: (
//         <FontAwesome
//           name={cardData?.extra?.saved_status === 1 ? "bookmark" : "bookmark-o"}
//           size={26}
//           color={Colors.pink}
//         />
//       ),
//       show: true,
//       method: () =>
//         handleSavePost(cardData?.extra?.saved_status === 1 ? "unsave" : "save"),
//     },
//     {
//       title: follow === 0 ? "Follow" : "Unfollow",
//       icon: (
//         <SimpleLineIcons
//           name={follow === 0 ? "user-follow" : "user-following"}
//           size={25}
//           color={Colors.blue}
//         />
//       ),
//       show: userID !== cardData?.post_details?.post_author,
//       method: handleFollowToggle,
//     },
//     {
//       title: "Edit Post",
//       icon: <FontAwesome name="edit" size={22} color={Colors.blue} />,
//       show: userID === cardData?.post_details?.post_author,
//       method: () => {
//         setShowModelComment();
//         navigation?.navigate(routeName?.EDIT_POST, {
//           postType: type === "social" ? 1 : 2,
//           postId,
//         });
//       },
//     },
//     {
//       title: "Delete Post",
//       icon: (
//         <MaterialCommunityIcons name="delete" size={26} color={Colors.red} />
//       ),
//       show: userID === cardData?.post_details?.post_author,
//       method: () => {
//         Alert.alert("Delete Post", "Are you sure?", [
//           { text: "Cancel", style: "cancel" },
//           { text: "Delete", onPress: handleDeletePost, style: "destructive" },
//         ]);
//       },
//     },
//     {
//       title: "Report",
//       icon: <Octicons name="report" size={24} color={Colors.red} />,
//       show: userID !== cardData?.post_details?.post_author,
//       method: () => setReportModal(true),
//     },
//   ];

//   return (
//     <>
//       <Loader loading={loading} />
//       <BottomSheetModal
//         ref={ref}
//         index={0}
//         snapPoints={snapPoints}
//         enablePanDownToClose={true}
//         backdropComponent={({ style }) => (
//           <View style={[style, { backgroundColor: "rgba(0,0,0,0.5)" }]} />
//         )}
//         onDismiss={() => setShowModelComment(false)}
//       >
//         <TouchableOpacity
//           onPress={() => ref.current?.dismiss()}
//           style={{
//             width: 45,
//             height: 45,
//             borderRadius: 100,
//             backgroundColor: "rgba(18, 8, 8, 0.6)",
//             alignSelf: "center",
//             marginBottom: 16,
//             justifyContent: "center",
//             alignItems: "center",
//             top: -100,
//           }}
//         >
//           <FontAwesome5 name="times" color={Colors.white} size={20} />
//         </TouchableOpacity>
//         <BottomSheetView style={{ padding: 16 }}>
//           {/* <TouchableOpacity
//             onPress={() => ref.current?.dismiss()}
//             style={{
//               width: 45,
//               height: 45,
//               borderRadius: 100,
//               backgroundColor: "rgba(0,0,0,0.6)",
//               alignSelf: "center",
//               marginBottom: 16,
//               justifyContent: "center",
//               alignItems: "center",
//             }}
//           >
//             <FontAwesome5 name="times" color={Colors.white} size={20} />
//           </TouchableOpacity> */}

//           <FlatList
//             data={options.filter((item) => item.show)}
//             keyExtractor={(item, index) => index.toString()}
//             renderItem={({ item }) => (
//               <TouchableOpacity
//                 onPress={item.method}
//                 style={{
//                   ...Styles.row,
//                   paddingVertical: 12,
//                   alignItems: "center",
//                 }}
//               >
//                 <View style={{ width: 40, alignItems: "center" }}>
//                   {item.icon}
//                 </View>
//                 <TextComponent
//                   text={item.title}
//                   size={Sizes.l}
//                   style={{ marginLeft: 16 }}
//                 />
//               </TouchableOpacity>
//             )}
//           />
//         </BottomSheetView>
//       </BottomSheetModal>
//       <Modal
//         transparent
//         visible={reportModal}
//         animationType="slide"
//         onRequestClose={() => setReportModal(false)}
//       >
//         <View
//           style={{
//             flex: 1,
//             justifyContent: "center",
//             backgroundColor: "rgba(0,0,0,0.5)",
//           }}
//         >
//           <View
//             style={{
//               backgroundColor: Colors.white,
//               marginHorizontal: 20,
//               borderRadius: 16,
//               padding: 24,
//               maxHeight: height * 0.8,
//             }}
//           >
//             <TouchableOpacity
//               onPress={() => setReportModal(false)}
//               style={{ alignSelf: "flex-end", marginBottom: 16 }}
//             >
//               <Entypo name="circle-with-cross" size={32} color={Colors.red} />
//             </TouchableOpacity>

//             <ReportUser
//               type={type === "social" ? "social_post" : "portfolio"}
//               postId={postId}
//               reasonList={reasonList}
//               reportUserID={cardData?.post_details?.post_author}
//               onSucess={() => {
//                 setReportModal(false);
//                 setShowModelComment();
//               }}
//             />
//           </View>
//         </View>
//       </Modal>
//     </>
//   );
// });

// const ShareModal = React.forwardRef((props, ref) => {
//   const dispatch = useDispatch();
//   const { ShowComment, setShowModelComment } = props;
//   const [searchQuery, setSearchQuery] = useState("");
//   const [modelsList, setModelsList] = useState([]);
//   const [page, setPage] = useState(1);
//   const [lastPage, setLastPage] = useState(-1);
//   const snapPoints = useRef(["70%", "90%"]).current;

//   useEffect(() => {
//     if (ShowComment) {
//       ref.current?.present();
//       getAllModelsList();
//     }
//   }, [ShowComment]);

//   const getAllModelsList = async () => {
//     let res = await dispatch(getModelsList());
//     if (res?.status == 200) {
//       setModelsList(res?.results);
//       setLastPage(res.results.pagination?.end_page);
//     }
//   };

//   const onShare = async () => {
//     try {
//       await Share.share({
//         message: "Check out this post!",
//       });
//     } catch (error) {
//       Alert.alert("Error", error.message);
//     }
//   };

//   const renderModelItem = ({ item }) => (
//     <View
//       style={{
//         ...Styles.flexRow,
//         marginHorizontal: 15,
//         marginVertical: 8,
//         alignItems: "center",
//       }}
//     >
//       <ImageView
//         uri={item?.profile_image}
//         style={{
//           ...styling.profileImg,
//           borderWidth: 3,
//           borderColor: Colors.lightThemeColor,
//         }}
//         width={50}
//         height={50}
//       />
//       <TextComponent
//         text={item?.post_meta_details?.display_name}
//         size={Sizes.l}
//         style={{ marginHorizontal: 12, flex: 1 }}
//       />
//       <TouchableOpacity
//         style={{ ...Styles.smallButton, backgroundColor: Colors.blue }}
//       >
//         <TextComponent text="Send" color={Colors.white} size={Sizes.s} />
//       </TouchableOpacity>
//     </View>
//   );

//   return (
//     <BottomSheetModal
//       ref={ref}
//       index={0}
//       snapPoints={snapPoints}
//       enablePanDownToClose={true}
//       backdropComponent={({ style }) => (
//         <View style={[style, { backgroundColor: "rgba(0,0,0,0.5)" }]} />
//       )}
//       onDismiss={() => setShowModelComment(false)}
//     >
//       <BottomSheetView style={{ flex: 1 }}>
//         <TouchableOpacity
//           onPress={() => ref.current?.dismiss()}
//           style={{
//             width: 45,
//             height: 45,
//             borderRadius: 100,
//             backgroundColor: "rgba(0,0,0,0.6)",
//             alignSelf: "center",
//             marginVertical: 16,
//             justifyContent: "center",
//             alignItems: "center",
//           }}
//         >
//           <FontAwesome5 name="times" color={Colors.white} size={20} />
//         </TouchableOpacity>

//         {/* Search bar can be added here if needed */}

//         <FlatList
//           data={modelsList}
//           keyExtractor={(item, index) => index.toString()}
//           contentContainerStyle={{ paddingVertical: 16 }}
//           renderItem={renderModelItem}
//           onEndReached={() => {
//             /* implement pagination if needed */
//           }}
//         />

//         <View
//           style={{
//             ...Styles.row,
//             padding: 16,
//             backgroundColor: Colors.gredient,
//             justifyContent: "space-between",
//             alignItems: "center",
//           }}
//         >
//           <TextComponent
//             text="Share on another application..."
//             size={Sizes.l}
//           />
//           <TouchableOpacity
//             style={{ ...Styles.smallButton, backgroundColor: Colors.blue }}
//             onPress={onShare}
//           >
//             <TextComponent
//               text="Share Now"
//               color={Colors.white}
//               size={Sizes.s}
//             />
//           </TouchableOpacity>
//         </View>
//       </BottomSheetView>
//     </BottomSheetModal>
//   );
// });

// const { width, height } = Dimensions.get("window");

// const styling = StyleSheet.create({
//   cardContentView: {
//     flexDirection: "row",
//     margin: 10,
//     justifyContent: "space-between",
//     position: "absolute",
//     width: "100%",
//   },
//   cardProfileView: {
//     flexDirection: "row",
//     width: "80%",
//     left: 5,
//     alignItems: "flex-start",
//   },
//   postDeatils: {
//     backgroundColor: Colors.white,
//     borderRadius: 10,
//     padding: 20,
//   },
//   profileImg: {
//     resizeMode: "contain",
//     width: 45,
//     height: 45,
//     borderRadius: 100,
//     borderWidth: 2,
//     borderColor: Colors?.white,
//   },
//   inputView: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   quickActionCircle: {
//     borderRadius: 100,
//     borderWidth: 2,
//     borderColor: Colors.themeColor,
//     padding: 12,
//     marginBottom: 6,
//   },
//   // ... add any other styles you had before
// });

// export default PostCard;
