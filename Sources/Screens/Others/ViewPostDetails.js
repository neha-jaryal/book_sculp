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
    }, []),
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
        setPostData(res?.results[0]);
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
        setPostData(res?.results[0]);
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

  console.log('postadcgfascxnc-----', postData)

  return (
    <>
      <Header text="Post Details" navigation={navigation} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            // ...Styles.container,
            // padding: 0,
            // marginHorizontal: 10,
            // width: "95%",
            // paddingBottom: 8,
          }}
        >
          <PostCard
            cardData={postData}
            isLoading={false}
            type={"image"}
            navigation={navigation}
            refreshList={getPostDetails}
            postType={postType}
          />
        </View>

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
