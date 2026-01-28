import React, { useCallback, useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  View,
  StyleSheet,
  RefreshControl,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  NativeModules,
  Linking,
  Text,
  Modal,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  AppReview,
  Banner,
  DashboardHeader,
  Loader,
  StripeCard,
  TextComponent,
  VideoModal,
} from "../../Components";
import { PostCard } from "../../Components/PostCard";
import { Colors, Images, Sizes } from "../../Constants";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import {
  OffsetYProvider,
  IndexProvider,
  InCenterConsumer,
} from "@n1ru4l/react-in-center-of-screen";
import {
  addAppRating,
  getReelList,
  getSocialPosts,
} from "../../Redux/Services/OtherServices";
import { useFocusEffect } from "@react-navigation/native";
import { AccountApproval } from "../../Components/AccountApproval";
import {
  getAppOpenedCount,
  getTimeOfDayGreeting,
  getTimePeriod,
  handleSubscriptionAlert,
  incrementAppOpenedCount,
  routeName,
  startAppOpenedTracking,
  stopAppOpenedTracking,
} from "../../Utility";
import { Styles } from "../../Styles";
import { TextInput } from "react-native-paper";
import Rate, { AndroidMarket } from "react-native-rate";
import InAppReview from "react-native-in-app-review";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const Home = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);
  const greeting = getTimeOfDayGreeting();
  const [modal, setModal] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [postCards, setPostCards] = useState([]);
  const [volume, setVolume] = useState(false);
  const [accountApproval, setAccountApproval] = useState(true);
  const [paused, setPaused] = useState(false);
  const [userData, setUserData] = useState("");
  const [userDetail, setUserDetail] = useState("");
  const [reelList, setReelList] = useState([]);
  const [count, setCount] = useState(0);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [ratingModal, setRatingModal] = useState(false);
  const [isBottomRefreshing, setIsBottomRefreshing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [totalResult, setTotalResult] = useState("");

  useEffect(() => {
    getPaymentStatus();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      // getUserSubscriptionID();
      getAllPostListing();
      getUserData("hide");
      // getAllReelList();
    }, []),
  );

  const getPaymentStatus = async () => {
    let paymentStatus = await getData(storageKey?.PAYMENT_STATUS);
    setPaymentStatus(JSON.parse(paymentStatus));
  };

  useEffect(() => {
    if (paymentStatus) {
      incrementAppOpenedCount();

      getAppOpenedCount().then((count) => {
        setCount(count);
        console.log("App opened count:", count, count % 3);
        if (count % 3 == 0) {
          getUserData("rating");
        } else if (count % 5 == 0) {
          getUserData("subscibe");
        }
      });

      const onAppStateChange = (newState) => {
        if (newState === "active") {
          incrementAppOpenedCount();
        }
      };

      startAppOpenedTracking(onAppStateChange);

      return () => {
        stopAppOpenedTracking(onAppStateChange);
      };
    }
  }, [paymentStatus]);

  const showRatingPopup = async () => {
    const options = {
      AppleAppID: "6444509575", // Replace with your iOS app ID
      GooglePackageName: "com.sculp_agency", // Replace with your Android package name
      preferredAndroidMarket: AndroidMarket.Google,
      preferInApp: true,
      openAppStoreIfInAppFails: true,
    };
    Rate.rate(options, (success, errorMessage) => {
      if (success) {
        console.log("Thank you for your feedback!");
        // handleAppRatingByUser(); // This will only be called if the user submits a rating.
      } else if (errorMessage) {
        console.error("Rating Error:", errorMessage);
        Alert.alert(
          "Rate Our App",
          "Would you like to rate us on the App Store/Play Store?",
          [
            { text: "No", style: "cancel" },
            {
              text: "Yes",
              onPress: () => {
                const url =
                  Platform.OS === "ios"
                    ? "https://apps.apple.com/app/6444509575?action=write-review"
                    : "https://play.google.com/store/apps/details?id=com.sculp_agency";
                Linking.openURL(url);
              },
            },
          ],
        );
      } else {
        console.log("Rating not submitted or popup closed.");
        // Do nothing if the user closes the popup or skips rating.
      }
    });
    // Rate.rate(options, (success, errorMessage) => {
    //   if (success) {
    //     console.log("Thank you for your feedback!");
    //     handleAppRatingByUser();
    //   } else if (errorMessage) {
    //     console.error("Rating Error:", errorMessage);
    //   }
    // });
  };

  const handleAppRatingByUser = async () => {
    const userId = await getData(storageKey?.USER_ID);
    let body = {
      user_id: JSON.parse(userId),
      android_rating: Platform?.OS == "android" ? "true" : "false",
      ios_rating: Platform?.OS == "ios" ? "true" : "false",
    };
    console.log("bidybdhbdhd-----", body);
    const res = await dispatch(addAppRating(body));
    console.log("handleAppRatingByUser response----", res);
  };

  const showRatingAlert = () => {
    Alert.alert(
      "Rate Our App",
      "If you enjoy using our app, would you mind taking a moment to rate it? It won’t take more than a minute. Thank you for your support!",
      [
        {
          text: "Cancel",
          onPress: () => console.log("User cancelled the rating."),
          style: "cancel",
        },
        {
          text: "Rate Now",
          onPress: showRatingPopup,
        },
      ],
      { cancelable: true },
    );
  };

  const getAllReelList = async () => {
    const userId = await getData(storageKey?.USER_ID);

    var body = {
      user_id: userId ? userId : "",
      page_number: "1",
      per_page: "10",
    };
    let res = await dispatch(getReelList(body));
    if (res?.status == 200) {
      setReelList(res.results);
    }
  };

  const getUserData = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res?.status == 200) {
        // console.log("res?.results-----", res?.results);
        if (type == "subscibe") {
          if (
            res?.results?.post_meta_details?.freelancer_type == "model" ||
            res?.results?.post_meta_details?.freelancer_type == "Model"
          ) {
            handleSubscriptionAlert(navigation);
          }
        }
        if (type == "rating" && res?.results?.user_data?.app_rating != 2) {
          setRatingModal(true);
          // showRatingAlert(navigation);
          // if (
          //   res?.results?.user_data?.android_rating == "false" &&
          //   Platform?.OS == "android"
          // ) {
          //   showRatingAlert(navigation);
          // } else if (
          //   res?.results?.user_data?.ios_rating == "false" &&
          //   Platform.OS == "ios"
          // ) {
          //   showRatingAlert(navigation);
          // }
        }
        setUserData(res?.results);
        storeData(
          storageKey?.APPROVAL_STATUS,
          JSON?.stringify(res?.results?.user_data?.profile_approval),
        );
        storeData(
          storageKey?.USER_STATUS,
          JSON?.stringify(res?.results?.user_data?.completed_step),
        );
        getApprovalStatus();
      }

      setRefresh(false);
    }
  };
  const getUserSubscriptionID = async () => {
    let userID = await getData(storageKey?.USER_ID);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      console.log(
        "userDetail?.user_data?.subscription_pro_id-----",
        res?.results?.user_data?.subscription_pro_id,
      );
      if (res?.status == 200) {
        setUserDetail(res?.results);
      }
    }
  };

  const getApprovalStatus = async () => {
    let accountApproval = await getData(storageKey?.APPROVAL_STATUS);
    setAccountApproval(JSON?.parse(accountApproval));
  };

  const getAllPostListing = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: JSON.parse(userID),
      per_page: 5,
      page_number: type == "refresh" ? 1 : page,
    };
    console.log("bodybodybodybody-----", body);

    let res = await dispatch(getSocialPosts(body));
    if (res?.status == 200) {
      console.log("getSocialPostsgetSocialPosts-----", res);

      // let data = res?.results?.data;
      let data = res?.results;
      let arr = data?.filter(
        (item) => item?.extra?.hide_profile_status == false,
      );
      if (type == "more") {
        setPostCards(postCards?.concat(arr));
      } else {
        let arr = data?.filter(
          (item) => item?.extra?.hide_profile_status == false,
        );
        setPostCards(arr);
      }

      setRefresh(false);
      // setLastPage(res?.results?.pagination?.end_page);
      // setTotalResult(res?.results?.pagination?.total_users);
      // setPage(res?.results?.pagination?.selected_page + 1);
      setIsBottomRefreshing(false);
    }
  };

  const onRefresh = async () => {
    getAllPostListing("refresh");
    setRefresh(true);
    getApprovalStatus();
  };

  const { height: windowHeight } = Dimensions.get("window");
  const boxHeight = (windowHeight * 2) / 3.3;

  const handleRating = async (status) => {
    const userId = await getData(storageKey?.USER_ID);
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/6444509575?action=write-review"
        : "https://play.google.com/store/apps/details?id=com.sculp_agency";

    var body = {
      user_id: JSON.parse(userId),
      app_rating: JSON.stringify(status),
    };
    const res = await dispatch(addAppRating(body));
    if (res?.status == 200) {
      if (status == 1) {
        Linking.openURL(url);
      }
      setRatingModal(false);
    }
  };

  const renderHeader = useCallback(() => {
    const loading = auth?.isLoading || other?.isLoading;
    if (auth?.navigator === routeName.GUEST_STACKS) {
      return <Banner />;
    }
    if (!loading) {
      return <AccountApproval navigation={navigation} />;
    }
    return null;
  }, [accountApproval]);

  const endReached = async () => {
    if (isBottomRefreshing || (lastPage && page >= lastPage)) {
      return;
    }

    if (page == lastPage) {
      setIsBottomRefreshing(false);
      return null;
    } else {
      setIsBottomRefreshing(true);
      getAllPostListing("more");
    }
  };
  const ListFooterComponent = () =>
    isBottomRefreshing ? (
      <View style={styles.footer}>
        <ActivityIndicator color="black" style={{ marginRight: 8 }} />
        <TextComponent text="Loading more..." size={Sizes.l} />
      </View>
    ) : (
      <View style={{ height: 20 }} />
    );
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      enabled={true}
      behavior={Platform?.OS == "ios" ? "padding" : null}
    >
      <DashboardHeader navigation={navigation} />
      {/* {ratingModal && ( */}
      <Modal
        transparent={true}
        visible={ratingModal}
        animationType="slide"
        useNativeDriver={true}
        onRequestClose={() => setRatingModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.popupContainer}>
            <Image source={Images?.appLogo} style={styles.appIcon} />

            <Text style={styles.title}>Enjoying Book Sculp?</Text>
            <Text style={styles.subtitle}>
              Would you like to rate our app on{" "}
              {Platform?.OS == "ios" ? "app store" : "play store"}?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                onPress={() => handleRating(1)}
                style={styles?.button}
              >
                <Text
                  style={{ ...styles.buttonText, color: Colors?.themeColor }}
                >
                  Rate Now
                </Text>
              </TouchableOpacity>
              {userData?.user_data?.app_rating == 1 && (
                <TouchableOpacity
                  onPress={() => handleRating(2)}
                  style={styles?.button}
                >
                  <Text style={{ ...styles.buttonText, color: Colors?.blue }}>
                    Already Rated
                  </Text>
                </TouchableOpacity>
              )}
              {userData?.user_data?.app_rating != 1 && (
                <TouchableOpacity
                  onPress={() => handleRating(0)}
                  style={styles?.button}
                >
                  <Text style={{ ...styles.buttonText, color: Colors?.pink }}>
                    Not Now
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      </Modal>
      {/* )} */}
      {/* <AppReview
        show={ratingModal}
        setShow={setRatingModal}
        status={userData?.user_data?.app_rating}
      /> */}
      <Loader
        loading={
          auth?.isLoading
            ? auth?.isLoading
            : other?.isLoading
            ? other?.isLoading
            : false
        }
      />

      <FlatList
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refresh}
            onRefresh={onRefresh}
            tintColor={Colors?.darkgrey}
          />
        }
        ListHeaderComponent={renderHeader}
        ListEmptyComponent={() =>
          other?.isLoading || auth?.isLoading ? null : (
            <View style={{ marginTop: 200, alignItems: "center" }}>
              <TextComponent
                text="No Social Post Uploaded"
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
          )
        }
        nestedScrollEnabled={true}
        data={postCards}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ index, item }) => (
          <>
            <View
              key={index}
              style={{
                height: item?.reelsList == 0 ? boxHeight : null,
              }}
            >
              <PostCard
                paused={false}
                cardData={item}
                index={index}
                isLoading={false}
                type={
                  item?.gallery?.gallery_imgs?.length != 0
                    ? "image"
                    : item?.gallery?.videos?.length != 0
                    ? "Vedio"
                    : null
                }
                setPaused={setPaused}
                navigation={navigation}
                modal={modal}
                setModal={setModal}
                onPress={() => setModal(true)}
                onReelTap={() => setModal(true)}
                refreshList={getAllPostListing}
                postType="social"
                volume={volume}
                setVolume={setVolume}
                reelList={reelList}
                setReelList={setReelList}
              />
            </View>
          </>
        )}
        onEndReachedThreshold={0.5}
        onEndReached={endReached}
        ListFooterComponent={ListFooterComponent}
      />
    </KeyboardAvoidingView>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  cardContainer: {
    width: "90%",
    height: 350,
    backgroundColor: "red",
  },
  card: {
    width: "100%",
    height: "100%",
    shadowColor: "#000000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.07,
    shadowRadius: 3.3,
  },
  cardImg: {
    width: "100%",
    height: 370,
    borderRadius: 13,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "red",
  },
  video: {
    width: "100%",
    height: 200,
  },
  trimmer: {
    width: "100%",
    height: 50,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    width: 260,
  },
  appIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: Colors?.darkgrey,
    width: "80%",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginBottom: 16,
    marginVertical: 10,
  },
  star: {
    fontSize: 25,
    color: Colors?.yellow,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },

  rateButton: {
    backgroundColor: Colors?.themeColor,
    borderRadius: 5,
    // padding: 5,
  },
  notNowButton: {
    backgroundColor: Colors?.pink,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    backgroundColor: Colors?.lightGray,
    width: "100%",
    alignItems: "center",
    paddingVertical: 6,
    marginVertical: 5,
    borderRadius: 5,
  },
  footer: {
    padding: 10,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

{
  /* 
      <OffsetYProvider
        columnsPerRow={1}
        listItemHeight={boxHeight}
        centerYStart={(windowHeight * 1) / 10}
        // centerYEnd={(windowHeight * 2) / 5}
        centerYEnd={(windowHeight * 2) / 5}
      >
        {({ setOffsetY }) => (
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refresh}
                onRefresh={onRefresh}
                tintColor={Colors?.darkgrey}
              />
            }
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={() =>
              other?.isLoading || auth?.isLoading ? null : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <TextComponent
                    text="No Social Post Uploaded"
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                  />
                  {/* <TextComponent
                  text="Tap on the + Button to add new social post" //⨁
                  size={Sizes?.s}
                  fontWeight="400"
                  color={Colors?.darkgrey}
                />  
                </View>
              )
            }
            nestedScrollEnabled={true}
            data={postCards}
            onScroll={(ev) => {
              setOffsetY(ev.nativeEvent.contentOffset.y);
            }}
            keyExtractor={({ item, index }) => index}
            renderItem={({ index, item }) => (
              <>
                <IndexProvider index={index}>
                  {() => (
                    <View
                      key={index}
                      style={{
                        height: item?.reelsList == 0 ? boxHeight : null,
                        // height: boxHeight,
                      }}
                    >
                      <InCenterConsumer>
                        {({ isInCenter }) =>
                          isInCenter ? (
                            <PostCard
                              paused={false}
                              cardData={item}
                              index={index}
                              isLoading={false}
                              type={
                                item?.gallery?.gallery_imgs?.length != 0
                                  ? "image"
                                  : item?.gallery?.videos?.length != 0
                                  ? "Vedio"
                                  : null
                              }
                              setPaused={setPaused}
                              navigation={navigation}
                              modal={modal}
                              setModal={setModal}
                              onPress={() => setModal(true)}
                              onReelTap={() => setModal(true)}
                              refreshList={getAllPostListing}
                              postType="social"
                              volume={volume}
                              setVolume={setVolume}
                              reelList={reelList}
                              setReelList={setReelList}
                            />
                          ) : (
                            <PostCard
                              paused={true}
                              cardData={item}
                              index={index}
                              isLoading={false}
                              type={
                                item?.gallery?.gallery_imgs?.length != 0
                                  ? "image"
                                  : item?.gallery?.videos?.length != 0
                                  ? "Vedio"
                                  : null
                              }
                              navigation={navigation}
                              modal={modal}
                              setModal={setModal}
                              onPress={() => setModal(true)}
                              onReelTap={() => setModal(true)}
                              refreshList={getAllPostListing}
                              postType="social"
                              volume={volume}
                              setVolume={setVolume}
                              reelList={reelList}
                              setReelList={setReelList}
                            />
                          )
                        }
                      </InCenterConsumer>
                    </View>
                  )}
                </IndexProvider>
                {modal && (
                  <VideoModal
                    cards={item?.gallery?.videos}
                    uri={item?.url}
                    modal={modal}
                    setModal={setModal}
                    navigation={navigation}
                  />
                )}
              </>
            )}
            onEndReachedThreshold={0.5}
            onEndReached={endReached}
            ListFooterComponent={ListFooterComponent}
          />
        )}
      </OffsetYProvider> */
}
