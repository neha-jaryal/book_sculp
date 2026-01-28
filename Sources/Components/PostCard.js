import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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
  Platform,
  Animated,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { Skeletoning } from "./Skeletoning";
import { TextComponent } from "./TextComponent";
import Video from "react-native-video";
import BottomSheet, { BottomSheetBackdrop } from "@gorhom/bottom-sheet";
import {
  convertUTCToLocalTime,
  getAccountApproval,
  routeName,
  showToast,
  timeSince,
} from "../Utility";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import {
  getAllLikesUsers,
  getModelsList,
  getPortfolioDetails,
  getSocialPostDetails,
  likeDislike,
  savePost,
  userFollowing,
} from "../Redux/Services/OtherServices";
import FontAwesome from "react-native-vector-icons/FontAwesome"; 
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons"; 
import Entypo from "react-native-vector-icons/Entypo";
import { useDispatch, useSelector } from "react-redux";
import { ImageView } from "./ImageView";  
import { getData, storageKey } from "../Utility/Storage"; 
import { getUserDetail } from "../Redux/Services/AuthServices";
import { SAVE_POST, UNSAVE_POST } from "../API Services/Url"; 
import { ReportUser } from "./ReportUser";
import { reasonList } from "../Global";
import { useHandleMessage } from "../Utility/FirestoreHelper";
import { ChatContext } from "../Context/ChatContext"; 
import { TapGestureHandler, State } from "react-native-gesture-handler"; 
import { PostMediaViewer } from "./PostMediaViewer";

const { width, height } = Dimensions.get("window");

export const PostCard = (props) => {
  const {
    cardData,
    isLoading,
    type,
    navigation,
    onPress,
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
  const dispatch = useDispatch();
  const bottomSheetRef = useRef(null);

  const [sendSwiper, setSendSwiper] = useState(false);
  const [likeModal, setLikeModal] = useState(false);
  const [commentSwiper, setCommentSwiper] = useState(false);
  const [threeDotsSwiper, setThreeDotsSwiper] = useState(false);
  const [imagesModal, setImagesModal] = useState(false);
  const [postData, setPostData] = useState("");
  const [modal, setModal] = useState(false);
  const [userID, setUserID] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [expendView, setExpendView] = useState(false);
  const [likeStatus, setLikeStatus] = useState({
    status: cardData?.extra?.like_status,
    count: cardData?.extra?.likes_count,
  });
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
          lastTap.current = null;
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  const handleLikeDislike = async (status) => {
    setLikeStatus({
      ...likeStatus,
      status: status === 0 ? 1 : 0,
      count:
        status === 0
          ? parseInt(likeStatus?.count || 0) + 1
          : parseInt(likeStatus?.count || 0) - 1,
    });

    const userId = await getData(storageKey?.USER_ID);
    const body = {
      type: status === 0 ? "like" : "unlike",
      user_id: userId,
      post_id: cardData?.post_details?.ID,
    };

    const res = await dispatch(likeDislike(body));
    if (res?.status === 200) {
      refreshList();
    }
  };

  const getPortDetails = async (id) => {
    const userId = await getData(storageKey?.USER_ID);
    const body = { port_id: id, user_id: userId };
    const res = await dispatch(getPortfolioDetails(body));
    if (res?.status === 200) {
      setPostData(res?.results[0]);
      setCommentSwiper(true);
    }
  };

  const getSocialPostData = async (id) => {
    const userId = await getData(storageKey?.USER_ID);
    const body = { social_id: id, user_id: userId };
    const res = await dispatch(getSocialPostDetails(body));
    if (res?.status === 200) {
      setCommentSwiper(true);
      setPostData(res?.results[0]);
    }
  };

  const userRole =
    cardData?.user_data?.user_role === 11
      ? "Model"
      : cardData?.user_data?.user_role === 13
      ? "Photographer"
      : cardData?.user_data?.user_role === 15
      ? "Actor"
      : "Admin";

  return (
    <>
      <View
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
              onLike={() => handleLikeDislike(likeStatus?.status)}
              containerHeight={500}
            />
            <View style={styling.cardContentView}>
              <TouchableOpacity
                style={styling.cardProfileView}
                onPress={() =>
                  userID === cardData?.post_details?.post_author
                    ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                        userId: cardData?.post_details?.post_author,
                      })
                    : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
                        userId: cardData?.post_details?.post_author,
                        type: postType,
                      })
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
                <View style={{ paddingHorizontal: 10, paddingVertical: 5 }}>
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
            ...styling.postDeatils,
            padding: 0,
            paddingTop: 5,
            paddingBottom: 20,
            paddingHorizontal: isLoading ? 0 : 20,
            marginTop: -15,
          }}
        >
          <View style={{ ...Styles?.row, paddingVertical: 10 }}>
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <TouchableOpacity
                onPress={() =>
                  approvalStatus
                    ? handleLikeDislike(likeStatus?.status)
                    : getAccountApproval(true, navigation, auth)
                }
              >
                <FontAwesome
                  name={likeStatus?.status === 1 ? "heart" : "heart-o"}
                  size={14}
                  color={Colors?.pink}
                  style={{ paddingRight: 5 }}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setLikeModal(true)}>
                <TextComponent
                  text={` ${likeStatus?.count || 0} ${
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
                  ? postType === "social"
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
              color={Colors?.gray}
              size={Sizes?.xs}
              fontWeight="400"
              style={{ letterSpacing: 0.2, paddingVertical: 4 }}
            />
          )}
        </View>
      </View>

      {/* Bottom Sheet Modals */}
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
          setLikeModal(false);
          setCommentSwiper(false);
          setThreeDotsSwiper(false);
          setSendSwiper(false);
        }}
      >
        {likeModal && (
          <LikeModalContent
            socialId={cardData?.post_details?.ID}
            navigation={navigation}
            onClose={() => bottomSheetRef.current?.close()}
          />
        )}

        {commentSwiper && (
          <CommentsModalContent
            postId={cardData?.post_details?.ID}
            portId={cardData?.post_details?.ID}
            socialId={cardData?.post_details?.ID}
            type={postType}
            userData={postData?.user_data}
            comments={postData?.comment_result}
            setShowModelComment={() => bottomSheetRef.current?.close()}
            getPortDetails={getPortDetails}
            getSocialPostData={getSocialPostData}
            refreshList={refreshList}
            cardData={cardData}
            userID={userID}
          />
        )}

        {threeDotsSwiper && (
          <ThreeDotsModalContent
            navigation={navigation}
            cardData={cardData}
            userId={userId}
            postId={cardData?.post_details?.ID}
            setShowModelComment={() => bottomSheetRef.current?.close()}
            refreshList={refreshList}
            type={postType}
          />
        )}

        {sendSwiper && (
          <ShareModalContent
            setShowModelComment={() => bottomSheetRef.current?.close()}
            ShowComment={sendSwiper}
          />
        )}
      </BottomSheet>
    </>
  );
};

// Helper Components (moved inside file for completeness)

const LikeModalContent = ({ socialId, navigation, onClose }) => {
  const dispatch = useDispatch();
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    getUsersList();
  }, []);

  const getUsersList = async () => {
    const body = {
      type: "like",
      post_id: socialId,
      page: 1,
      limit: 15,
    };
    const res = await dispatch(getAllLikesUsers(body));
    if (res?.status === 200) {
      setUserList(res?.results?.like_list || []);
    }
  };

  const getModelDetails = async (item) => {
    const modelID = item?.user_id;
    const body = { user_id: modelID };
    const res = await dispatch(getUserDetail(body));
    if (res?.status === 200) {
      onClose();
      navigation?.navigate(routeName?.MODEL_PROFILE, {
        modelData: res?.results,
      });
    }
  };

  return (
    <FlatList
      data={userList}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ padding: 20 }}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginBottom: 15,
          }}
          onPress={() => getModelDetails(item)}
        >
          <ImageView
            uri={item?.user_image}
            style={{
              width: 50,
              height: 50,
              borderRadius: 25,
              borderWidth: 3,
              borderColor: Colors?.lightThemeColor,
            }}
          />
          <TextComponent
            text={item?.user_name}
            size={Sizes?.l}
            fontWeight="400"
            style={{ marginLeft: 12 }}
          />
          <FontAwesome
            name="heart"
            size={20}
            color={Colors?.pink}
            style={{ marginLeft: "auto" }}
          />
        </TouchableOpacity>
      )}
      ListEmptyComponent={
        <TextComponent
          text="No likes yet"
          size={Sizes?.l}
          color={Colors?.darkgrey}
        />
      }
    />
  );
};

// Add similar content wrappers for CommentsModalContent, ThreeDotsModalContent, ShareModalContent

const CommentsModalContent = (props) => {
  const {
    postId,
    portId,
    socialId,
    type,
    userData,
    comments: initialComments,
    setShowModelComment,
    getPortDetails,
    // getSocialPostData,
    refreshList,
    cardData,
    userID,
  } = props;

  const dispatch = useDispatch();
  const [comment, setComment] = useState("");
  const [commentData, setCommentData] = useState(initialComments || []);
  const [commentID, setCommentID] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (type === "social") {
      getSocialPostData(socialId);
    } else {
      getPortDetails(portId);
    }
  }, []);

  const getPostDetails = async () => {
    const userId = await getData(storageKey?.USER_ID);
    const body = { port_id: portId, user_id: userId };
    const res = await dispatch(getPortfolioDetails(body));
    if (res?.status === 200) {
      setCommentData(res?.results[0]?.comment_result || []);
    }
  };

  const getSocialPostData = async () => {
    const userId = await getData(storageKey?.USER_ID);
    const body = { social_id: socialId, user_id: userId };
    const res = await dispatch(getSocialPostDetails(body));
    if (res?.status === 200) {
      setCommentData(res?.results[0]?.comment_result || []);
    }
  };

  const handleAddCommentOnPost = async () => {
    if (!comment.trim()) {
      showToast("Please enter a comment", "error");
      return;
    }

    const userId = await getData(storageKey?.USER_ID);
    const body = {
      user_id: userId,
      portfolio_id: type === "social" ? socialId : portId,
      type: commentID ? "reply" : "comment",
      comment_id: commentID,
      comment,
    };

    const res = await dispatch(addComment(body));
    if (res?.status === 200) {
      setComment("");
      setCommentID("");
      if (type === "social") {
        getSocialPostData();
      } else {
        getPostDetails();
      }
      refreshList();
      Keyboard.dismiss();
    }
  };

  const handleReply = (item) => {
    setCommentID(item?.comment?.comment_ID);
    inputRef.current?.focus();
  };

  const renderComments = ({ item, index }) => (
    <View key={index} style={{ marginHorizontal: 15, marginVertical: 8 }}>
      <View style={{ ...Styles.flexRow, width: "90%" }}>
        <TouchableOpacity
          style={{ ...Styles.row, width: "82%" }}
          onPress={() => {
            setShowModelComment();
            userID === item?.comment?.user_id
              ? navigation?.navigate(routeName?.MODEL_PROFILE, {
                  userId: item?.comment?.user_id,
                })
              : navigation?.navigate(routeName?.FEED_USER_PROFILE, {
                  userId: item?.comment?.user_id,
                  type,
                });
          }}
        >
          <ImageView
            uri={item?.comment?.user_data?.attachment?.url}
            style={{
              ...styling.profileImg,
              borderWidth: 3,
              borderColor: Colors?.lightThemeColor,
            }}
            width={45}
            height={45}
          />
          <View style={{ marginLeft: 10, flex: 1 }}>
            <TextComponent
              text={
                item?.comment?.user_data?.delete_account === 0
                  ? item?.comment?.comment_author
                  : "Deleted User"
              }
              size={Sizes.s}
              fontWeight="500"
            />
            <TextComponent
              text={item?.comment?.comment_content}
              size={Sizes.xs}
              color={Colors.darkgrey}
              numberOfLines={0}
            />
            <TextComponent
              text={timeSince(
                convertUTCToLocalTime(item?.comment?.comment_date),
              )}
              size={10}
              color={Colors.darkgrey}
              style={{ marginTop: 4 }}
            />
          </View>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => handleReply(item)}>
          <FontAwesome
            name="reply"
            size={15}
            color={
              commentID === item?.comment?.comment_ID
                ? Colors.black
                : Colors.gredient
            }
          />
        </TouchableOpacity>
      </View>

      {item?.reply?.length > 0 &&
        item.reply.map((reply, replyIndex) => (
          <View
            key={replyIndex}
            style={{
              ...Styles.flexRow,
              marginLeft: 60,
              width: "75%",
              marginVertical: 6,
            }}
          >
            <ImageView
              uri={reply?.user_data?.attachment?.url}
              style={{
                ...styling.profileImg,
                width: 35,
                height: 35,
                borderWidth: 2,
                borderColor: Colors.lightThemeColor,
              }}
            />
            <View style={{ marginLeft: 10, flex: 1 }}>
              <TextComponent
                text={reply?.comment_author || "User"}
                size={Sizes.xs}
                fontWeight="500"
              />
              <TextComponent
                text={reply?.comment_content}
                size={Sizes.xs}
                color={Colors.darkgrey}
              />
            </View>
          </View>
        ))}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} keyboardShouldPersistTaps="handled">
      <View style={{ padding: 15 }}>
        {/* Post author preview at top */}
        <View style={{ ...Styles.flexRow, marginBottom: 15 }}>
          <ImageView
            uri={userData?.attachment?.url}
            style={{
              ...styling.profileImg,
              width: 60,
              height: 60,
              borderWidth: 3,
              borderColor: Colors.lightThemeColor,
            }}
          />
          <View style={{ marginLeft: 12, flex: 1 }}>
            <TextComponent
              text={userData?.user_name}
              size={Sizes.l}
              fontWeight="600"
            />
            <TextComponent
              text={cardData?.post_details?.post_content || "Post content"}
              size={Sizes.s}
              color={Colors.darkgrey}
              numberOfLines={3}
            />
          </View>
        </View>

        <FlatList
          data={commentData}
          renderItem={renderComments}
          keyExtractor={(item, index) => index.toString()}
          ListEmptyComponent={
            <View style={{ padding: 40, alignItems: "center" }}>
              <TextComponent
                text="No comments yet"
                size={Sizes.l}
                color={Colors.darkgrey}
              />
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Comment Input Bar */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          borderTopWidth: 1,
          borderTopColor: Colors.lightGray,
          backgroundColor: Colors.white,
          paddingHorizontal: 15,
          paddingVertical: 10,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <MaterialCommunityIcons
          name="comment-quote-outline"
          size={24}
          color={Colors.darkgrey}
          style={{ marginRight: 10 }}
        />
        <TextInput
          ref={inputRef}
          value={comment}
          onChangeText={setComment}
          placeholder="Add a comment..."
          placeholderTextColor={Colors.darkgrey}
          style={{
            flex: 1,
            fontSize: Sizes.m,
            paddingVertical: 8,
            color: Colors.black,
          }}
          multiline
          maxLength={300}
        />
        <TouchableOpacity
          onPress={handleAddCommentOnPost}
          disabled={!comment.trim()}
          style={{
            paddingHorizontal: 16,
            paddingVertical: 8,
            backgroundColor: comment.trim() ? Colors.blue : Colors.lightGray,
            borderRadius: 20,
          }}
        >
          <TextComponent text="Post" color={Colors.white} size={Sizes.s} />
        </TouchableOpacity>
      </KeyboardAvoidingView>
    </ScrollView>
  );
};

const ThreeDotsModalContent = (props) => {
  const {
    navigation,
    cardData,
    userId,
    postId,
    setShowModelComment,
    refreshList,
    type,
  } = props;

  const dispatch = useDispatch();
  const handleMessage = useHandleMessage();
  const { dispatch: chatDispatch } = useContext(ChatContext);
  const [loading, setLoading] = useState(false);
  const [userID, setUserID] = useState("");
  const [follow, setFollow] = useState(cardData?.extra?.following_status);
  const [reportModal, setReportModal] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    getUserID();
  }, []);

  const getUserID = async () => {
    const uid = await getData(storageKey?.USER_ID);
    setUserID(uid);
    setFollow(cardData?.extra?.following_status);
  };

  const handleDeletePost = async () => {
    const uid = await getData(storageKey?.USER_ID);
    const body = {
      action: "delete",
      post_id: postId,
      user_id: uid,
    };
    const res = await dispatch(deletePost(body));
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
    const res = await dispatch(savePost(body, endpoint));
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
    const res = await dispatch(userFollowing(body));
    if (res?.status === 200) {
      setFollow((prev) => (prev === 0 ? 1 : 0));
      refreshList();
    }
  };

  const handleChat = async () => {
    if (userID === cardData?.post_details?.post_author) {
      showToast("You cannot message yourself", "info");
      return;
    }

    setLoading(true);
    const receiver = {
      id: cardData?.post_details?.post_author,
      user_name: cardData?.user_data?.user_name,
      photoURL: cardData?.user_data?.attachment?.url,
      firebase_udi: cardData?.user_data?.firebase_udi,
    };

    chatDispatch({ type: "CHANGE_USER", payload: receiver });
    handleMessage(
      cardData?.user_data?.email,
      cardData?.user_data?.firebase_udi,
      cardData?.user_data?.user_name,
      setLoading,
      cardData?.user_data?.attachment?.url,
      cardData?.post_details?.post_author,
      cardData?.post_details?.user_role,
    );

    setShowModelComment();
    setLoading(false);
  };

  const options = [
    {
      title: "Message",
      icon: <FontAwesome name="send" size={26} color={Colors.themeColor} />,
      show: userID !== cardData?.post_details?.post_author,
      method: handleChat,
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

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ paddingVertical: 20 }}> 
        <View
          style={{
            ...Styles.flexRow,
            justifyContent: "space-around",
            paddingBottom: 20,
          }}
        >
          {options
            .filter(
              (opt) =>
                opt.show &&
                !["Edit Post", "Delete Post", "Report"].includes(opt.title),
            )
            .map((opt, i) => (
              <TouchableOpacity
                key={i}
                onPress={opt.method}
                style={{ alignItems: "center" }}
              >
                <View
                  style={{
                    borderWidth: 2,
                    borderColor: Colors.themeColor,
                    borderRadius: 50,
                    padding: 12,
                    marginBottom: 8,
                  }}
                >
                  {opt.icon}
                </View>
                <TextComponent
                  text={opt.title}
                  size={Sizes.s}
                  color={Colors.darkgrey}
                />
              </TouchableOpacity>
            ))}
        </View>

        <View style={{ ...Styles.separator, marginVertical: 10 }} />

        <FlatList
          data={options.filter((opt) => opt.show)}
          keyExtractor={(_, i) => i.toString()}
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
                  item.title.includes("Delete") || item.title.includes("Report")
                    ? Colors.red
                    : Colors.black
                }
                style={{ marginLeft: 16 }}
              />
            </TouchableOpacity>
          )}
        />

        <Modal
          transparent
          visible={reportModal}
          animationType="slide"
          onRequestClose={() => setReportModal(false)}
        >
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "rgba(0,0,0,0.5)",
            }}
          >
            <View
              style={{
                backgroundColor: Colors.white,
                marginHorizontal: 20,
                borderRadius: 16,
                padding: 24,
                maxHeight: height * 0.8,
              }}
            >
              <TouchableOpacity
                onPress={() => setReportModal(false)}
                style={{ alignSelf: "flex-end", marginBottom: 16 }}
              >
                <Entypo name="circle-with-cross" size={32} color={Colors.red} />
              </TouchableOpacity>

              <ReportUser
                type={type === "social" ? "social_post" : "portfolio"}
                postId={postId}
                reasonList={reasonList}
                reportUserID={cardData?.post_details?.post_author}
                onSucess={() => {
                  setReportModal(false);
                  setShowModelComment();
                }}
              />
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
};

const ShareModalContent = (props) => {
  const { setShowModelComment, ShowComment } = props;

  const dispatch = useDispatch();
  const [modelsList, setModelsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(-1);

  useEffect(() => {
    getAllModelsList();
  }, []);

  const getAllModelsList = async () => {
    const res = await dispatch(getModelsList());
    if (res?.status === 200) {
      setModelsList(res?.results || []);
      setLastPage(res?.results?.pagination?.end_page || -1);
    }
  };

  const onEndReached = async () => {
    if (page >= lastPage) return;
    const body = {
      page_number: page + 1,
      per_page: 10,
      keyword: searchQuery,
    };
    const res = await dispatch(getSearchResults(body));
    if (res?.status === 200) {
      setModelsList((prev) => [...prev, ...(res?.results?.search || [])]);
      setPage((prev) => prev + 1);
    }
  };

  const onShareExternal = async () => {
    try {
      await Share.share({
        message: "Check out this post on Book Sculp!",
        url: "https://booksulp.com/post/" + cardData?.post_details?.ID, // customize
        title: "Book Sculp Post",
      });
    } catch (error) {
      showToast("Error sharing", "error");
    }
  };

  const renderItem = ({ item }) => (
    <View
      style={{
        ...Styles.flexRow,
        marginHorizontal: 15,
        marginVertical: 8,
        width: "90%",
      }}
    >
      <ImageView
        uri={item?.profile_image}
        style={{
          ...styling.profileImg,
          borderWidth: 3,
          borderColor: Colors.lightThemeColor,
        }}
        width={50}
        height={50}
      />
      <TextComponent
        text={item?.post_meta_details?.display_name}
        size={Sizes.l}
        fontWeight="400"
        style={{ marginHorizontal: 12, flex: 1 }}
      />
      <TouchableOpacity
        style={{
          ...Styles.smallButton,
          backgroundColor: Colors.blue,
          paddingHorizontal: 16,
          paddingVertical: 8,
        }}
      >
        <TextComponent text="Send" color={Colors.white} size={Sizes.s} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={modelsList}
        renderItem={renderItem}
        keyExtractor={(_, i) => i.toString()}
        contentContainerStyle={{ paddingVertical: 20 }}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.5}
        ListHeaderComponent={
          <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
            <TextComponent
              text="Share with friends"
              size={Sizes.l}
              fontWeight="600"
            />
          </View>
        }
        ListFooterComponent={
          <View
            style={{
              ...Styles.flexRow,
              padding: 20,
              borderTopWidth: 1,
              borderTopColor: Colors.lightGray,
              backgroundColor: Colors.gredient,
            }}
          >
            <TextComponent
              text="Share externally..."
              size={Sizes.l}
              style={{ flex: 1 }}
            />
            <TouchableOpacity
              style={{
                ...Styles.smallButton,
                backgroundColor: Colors.blue,
                paddingHorizontal: 20,
                paddingVertical: 10,
              }}
              onPress={onShareExternal}
            >
              <TextComponent
                text="Share Now"
                color={Colors.white}
                size={Sizes.s}
              />
            </TouchableOpacity>
          </View>
        }
      />
    </View>
  );
};

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
});
