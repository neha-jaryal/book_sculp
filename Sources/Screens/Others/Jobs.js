import { useFocusEffect } from "@react-navigation/native";
import React, { useCallback, useRef, useState } from "react";
import { useEffect } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  ImageBackground,
  Linking,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Header, Loader, NoDataFound, TextComponent } from "../../Components";
import {
  Colors,
  dimensionheight,
  dimensionWidth,
  Images,
  Sizes,
} from "../../Constants";
import {
  getJobDetails,
  getJobFilter,
  getJobsList,
  savePost,
} from "../../Redux/Services/OtherServices";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { SAVE_POST, UNSAVE_POST } from "../../API Services/Url";
import {
  convertUTCToLocalTime,
  getAccountApproval,
  numericFormatted,
  timeSince,
} from "../../Utility";
import { getData, storageKey } from "../../Utility/Storage";
import { BlurView } from "@react-native-community/blur";

export const Jobs = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const auth = useSelector((state) => state?.authReducer);

  // console.log("routerouteroute----", JSON.stringify(route));
  const [page, setPage] = useState(0);
  const [lastPage, setLastPage] = useState(-1);
  const [isBottomRefreshing, setIsBottomRefreshing] = useState(false);
  const [jobsList, setJobsList] = useState([]);
  const other = useSelector((state) => state?.otherReducer);
  const [refreshing, setRefreshing] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const [totalResult, setTotalResult] = useState("");
  const [userId, setUserId] = useState("");
  const [filterRoute, setFilterRoute] = useState(
    route?.params?.routeName == routeName?.FILTER
  );
  useFocusEffect(
    React.useCallback(() => {
      setPage(0);
      if (route?.params?.routeName == routeName?.FILTER) {
        getFilterResultDetails();
        setFilterRoute(true);
      } else {
        getAllJobsList();
      }
    }, [route?.params])
  );
  // useEffect(() => {
  //   setPage(0);
  //   if (route?.params?.routeName == routeName?.FILTER) {
  //     getFilterResultDetails();
  //     setFilterRoute(true);
  //   } else {
  //     getAllJobsList();
  //   }
  // }, [route?.params]);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.routeName == routeName?.FILTER) {
        if (flatListRef.current) {
          flatListRef.current.scrollToOffset({ offset: 0, animated: true });
        }
      }
    }, [navigation, route?.params])
  );

  const getFilterResultDetails = async () => {
    let body = {
      ...route?.params?.filterBody,
      per_page: 10,
      page_number: 1,
    };
    let res = await dispatch(getJobFilter(body));
    if (res?.status == 200) {
      setPage(1);
      setLastPage(res.results.pagination?.end_page);
      setTotalResult(res.results.pagination?.total_result);
      if (res?.results?.search?.length == 0) {
        setEmptyList(true);
        setJobsList([]);
      } else {
        // console.log("bhgfbfgb-----", res?.results?.search);
        setJobsList(res?.results?.search);
        setRefreshing(false);
      }
    } else {
      setEmptyList(true);
    }
  };

  const getAllJobsList = async () => {
    let userId = await getData(storageKey?.USER_ID);
    setUserId(userId);
    var body = {
      user_id: userId,
      per_page: 10,
      page_number: 1,
    };
    let res = await dispatch(getJobsList(body));
    if (res?.status == 200) {
      // if (res?.results?.length == 0) {
      //   setEmptyList(true);
      // } else {
      //   setRefreshing(false);
      // }

      setJobsList(res?.results?.list);
      setLastPage(res.results.pagination?.end_page);
      setRefreshing(false);
      setPage(1);
    } else {
      setEmptyList(true);
    }
  };

  const onRefresh = async () => {
    setPage(0);
    if (route?.params?.routeName == routeName?.FILTER) {
      getFilterResultDetails();
    } else {
      setFilterRoute(false);
      getAllJobsList();
    }
    setRefreshing(true);
  };
  const handleViewJob = async (item) => {
    let userId = await getData(storageKey?.USER_ID);
    if (userId) {
      var body = {
        user_id: userId,
        project_id: item?.profile?.ID,
      };
      let res = await dispatch(getJobDetails(body));
      console.log("res?.results[0]------", res?.results[0]);
      if (res?.status == 200) {
        navigation?.navigate(routeName?.VIEW_JOBS, {
          jobDetail: res?.results[0],
        });
      }
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };
  const handleSavePost = async (item, type) => {
    let userId = await getData(storageKey?.USER_ID);
    if (userId) {
      var body;
      if (type == "saved") {
        body = {
          user_id: userId,
          post_id: item?.profile?.ID,
          type: "saved",
          post_type: "213",
        };
        let res = await dispatch(savePost(body, SAVE_POST));
        if (res?.status == 200) {
          getAllJobsList();
        }
      } else {
        body = {
          user_id: userId,
          post_id: item?.profile?.ID,
          type: "unsaved",
          post_type: "213",
        };
        let res = await dispatch(savePost(body, UNSAVE_POST));
        if (res?.status == 200) {
          getAllJobsList();
        }
      }
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };

  const endReached = useCallback(async () => {
    let userId = await getData(storageKey?.USER_ID);

    if (page == lastPage) {
      setIsBottomRefreshing(false);
      return null;
    } else if (page != lastPage) {
      setIsBottomRefreshing(true);
      var body;
      if (filterRoute) {
        body = {
          ...route?.params?.filterBody,
          page_number: page + 1,
          per_page: 10,
        };
        let res = await dispatch(getJobFilter(body));
        if (res?.status == 200) {
          setLastPage(res.results.pagination?.number_pages);
          setIsBottomRefreshing(false);
          setTotalResult(res.results.pagination?.total_result);
          if (res?.results?.search?.length != 0) {
            setJobsList([...jobsList, ...res?.results?.search]);
            setPage(page + 1);
          }
        } else {
          setIsBottomRefreshing(false);
          setTotalResult(res.results.pagination?.total_result);
        }
      } else {
        var body = {
          user_id: userId,
          page_number: page + 1,
          per_page: 10,
        };
        let res = await dispatch(getJobsList(body));
        if (res?.status == 200) {
          setJobsList([...jobsList, ...res?.results?.list]);
          setLastPage(res.results.pagination?.number_pages);
          setIsBottomRefreshing(false);
          setRefreshing(false);
          setPage(page + 1);
        } else {
          setRefreshing(false);
          setIsBottomRefreshing(false);
        }
      }
    }
    // setIsBottomRefreshing(false);
  }, [page, lastPage]);

  const renderParsedText = (text) => {
    if (!text) return null;

    const parts = text.split(
      /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
    );

    return parts.map((part, index) => {
      const isLink = part.match(
        /(https?:\/\/[^\s]+|www\.[^\s]+|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/
      );

      if (isLink) {
        return (
          <Text
            key={index}
            style={{
              color: Colors?.blue,
              textDecorationLine: "underline",
            }}
            onPress={() => {
              if (part.includes("@")) {
                Linking.openURL(`mailto:${part}`);
              } else {
                const url = part.startsWith("http") ? part : `https://${part}`;
                Linking.openURL(url);
              }
            }}
          >
            {part}
          </Text>
        );
      }

      // Normal text (non-link)
      return <Text key={index}>{part}</Text>;
    });
  };

  const ListFooterComponent = () => {
    return isBottomRefreshing ? (
      <View
        style={{
          padding: 10,
          borderRadius: 4,
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator color="black" style={{ marginRight: 8 }} />
        <TextComponent
          text={"Loading more..."}
          size={Sizes?.l}
          style={{ paddingVertical: 4 }}
        />
      </View>
    ) : null;
  };
  const ListEmptyComponent = () => {
    return (
      <View style={{ marginTop: 200, alignSelf: "center" }}>
        <TextComponent
          text={"No Data Found"}
          size={Sizes?.xl}
          color={Colors?.darkgrey}
        />
      </View>
    );
  };
  const renderItem = ({ item, index }) => {
    return (
      <>
        <View style={{ ...Styles?.container, marginBottom: 10 }} key={index}>
          <Image
            source={{
              uri: item?.profile_image,
            }}
            style={{
              ...styling?.profileImg,
              borderWidth: 3,
              borderColor: Colors?.lightBlue,
              position: "absolute",
              top: -20,
            }}
          />
          <TouchableOpacity
            style={{ alignSelf: "flex-end", marginHorizontal: 10 }}
            onPress={() =>
              item?.post_meta_details?.saved_status == 1
                ? handleSavePost(item, "unsaved")
                : handleSavePost(item, "saved")
            }
          >
            <FontAwesome
              name={
                item?.post_meta_details?.saved_status == 1
                  ? "bookmark"
                  : "bookmark-o"
              }
              size={25}
              color={Colors?.blue}
            />
          </TouchableOpacity>

          <View
            style={{
              ...Styles?.flexRow,
              marginTop: 15,
              // flexWrap: "wrap",
            }}
          >
            <TextComponent
              text={`${item?.profile?.post_title}`}
              size={Sizes?.l}
              style={{
                textTransform: "capitalize",
                width: 200,
              }}
              loading={other?.isLoading}
              width={150}
            />

            {item?.profile?.post_date && (
              <TextComponent
                text={timeSince(
                  convertUTCToLocalTime(item?.profile?.post_date)
                )}
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
                style={{
                  textAlign: "right",
                  alignSelf: "flex-end",
                  width: 100,
                }}
                loading={other?.isLoading}
                width={50}
              />
            )}
          </View>
          <View
            style={{
              position: "relative",
              overflow: "hidden",
              borderRadius: 10,
            }}
          >
            <TextComponent
              text={`${item?.post_meta_details?.model_type_req}`}
              size={Sizes?.s}
              style={{
                marginVertical: 10,
                textTransform: "capitalize",
                width: 100,
              }}
              loading={other?.isLoading}
              width={150}
              color={Colors?.blue}
            />

            {item?.profile?.post_content && (
              <TextComponent
                text={renderParsedText(item?.profile?.post_content || "")}
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
                style={{ textTransform: "capitalize", width: "90%" }}
                loading={other?.isLoading}
                width={200}
              />
            )}

            <View style={Styles?.separator} />

            {item?.post_meta_details?._project_type ||
            item?.post_meta_details?.project_budget ? (
              <>
                <View
                  style={{
                    ...Styles?.flexRow,
                    paddingVertical: 6,
                    paddingHorizontal: 8,
                  }}
                >
                  {item?.post_meta_details?._project_type && (
                    <View style={{ width: "35%", alignItems: "center" }}>
                      <TextComponent
                        text="Project Type:"
                        size={Sizes?.s}
                        style={{ paddingVertical: 4 }}
                        loading={other?.isLoading}
                        width={80}
                      />
                      <TextComponent
                        text={item?.post_meta_details?._project_type}
                        size={Sizes?.s}
                        color={Colors?.darkgrey}
                        fontWeight="400"
                        style={{ textTransform: "capitalize" }}
                        loading={other?.isLoading}
                        width={100}
                      />
                    </View>
                  )}

                  {item?.post_meta_details?.project_budget ||
                  item?.post_meta_details?._hourly_rate ||
                  item?.post_meta_details?._estimated_hours ? (
                    <>
                      <View
                        style={{
                          borderRightWidth: 0.5,
                          borderColor: Colors?.grey,
                          height: 40,
                        }}
                      />
                      <View
                        style={{
                          paddingRight: 10,
                          width: "40%",
                          alignItems: "center",
                        }}
                      >
                        <TextComponent
                          text="Project Budget:"
                          size={Sizes?.s}
                          style={{ paddingVertical: 4 }}
                          loading={other?.isLoading}
                          width={100}
                        />
                        <TextComponent
                          text={
                            item?.post_meta_details?.project_budget
                              ? "$" + item?.post_meta_details?.project_budget
                              : item?.post_meta_details?._hourly_rate
                              ? `$${item?.post_meta_details?._hourly_rate}  (${item?.post_meta_details?._estimated_hours} hours)`
                              : 0
                          }
                          size={Sizes?.s}
                          color={Colors?.darkgrey}
                          fontWeight="400"
                          loading={other?.isLoading}
                          width={100}
                        />
                      </View>
                    </>
                  ) : null}
                </View>
                <View style={Styles?.separator} />
              </>
            ) : null}
            {item?.post_meta_details?.country && (
              <>
                <View
                  style={{
                    ...Styles?.row,
                    justifyContent: "center",
                  }}
                >
                  <FontAwesome
                    name={"flag"}
                    size={20}
                    color={Colors?.lightBlue}
                  />

                  <TextComponent
                    text={`${item?.post_meta_details?.country}${
                      item?.post_meta_details?.city
                        ? " | " + item?.post_meta_details?.city
                        : ""
                    }`}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                    style={{ paddingHorizontal: 8, textAlign: "center" }}
                    loading={other?.isLoading}
                    width={200}
                  />
                </View>
                <View style={Styles?.separator} />
              </>
            )}

            <View
              style={{
                ...Styles?.flexRow,
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
            >
              {item?.post_meta_details?.project_level && (
                <>
                  <View style={{ width: "35%", alignItems: "center" }}>
                    <TextComponent
                      text="Expert:"
                      size={Sizes?.s}
                      style={{ paddingVertical: 4 }}
                      loading={other?.isLoading}
                      width={100}
                    />
                    <TextComponent
                      text={item?.post_meta_details?.project_level}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{ textTransform: "capitalize" }}
                      loading={other?.isLoading}
                      width={80}
                    />
                  </View>
                  <View
                    style={{
                      borderRightWidth: 0.5,
                      borderColor: Colors?.grey,
                      height: 40,
                    }}
                  />
                </>
              )}

              <View
                style={{ width: "35%", paddingRight: 10, alignItems: "center" }}
              >
                <TextComponent
                  text="Proposal:"
                  size={Sizes?.s}
                  style={{ paddingVertical: 4 }}
                  loading={other?.isLoading}
                  width={100}
                />
                <TextComponent
                  text={item?.post_meta_details?.proposal_count}
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                  loading={other?.isLoading}
                  width={80}
                />
              </View>
            </View>

            <View style={Styles?.separator} />
            {item?.post_meta_details?.skills_names &&
              item?.post_meta_details?.skills_names?.length != 0 && (
                <>
                  <View
                    style={{
                      ...Styles?.row,
                      justifyContent: "center",
                      // alignItems: "flex-start",
                      // width: "90%",
                    }}
                  >
                    <TextComponent
                      text={"Skills : "}
                      size={Sizes?.s}
                      loading={other?.isLoading}
                      width={80}
                    />
                    {typeof item?.post_meta_details?.skills_names ==
                    "object" ? (
                      item?.post_meta_details?.skills_names?.map(
                        (ele, index) => {
                          return (
                            <TextComponent
                              text={
                                index ==
                                item?.post_meta_details.skills_names?.length - 1
                                  ? ele?.value
                                    ? ele?.value + ", "
                                    : ele
                                  : ""
                              }
                              size={Sizes?.s}
                              color={Colors?.darkgrey}
                              fontWeight="400"
                              style={{ padding: 2 }}
                              loading={other?.isLoading}
                              width={80}
                              numberOfLines={1}
                            />
                          );
                        }
                      )
                    ) : (
                      <TextComponent
                        text={item?.post_meta_details?.skills_names}
                        size={Sizes?.s}
                        color={Colors?.darkgrey}
                        fontWeight="400"
                        style={{ padding: 2 }}
                        loading={other?.isLoading}
                        width={80}
                        numberOfLines={1}
                      />
                    )}
                  </View>
                  <View style={Styles?.separator} />
                </>
              )}

            <View
              style={{
                ...Styles?.flexRow,
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
            >
              {item?.post_meta_details?._project_type == "Hourly Rate" ? (
                <>
                  <View style={{ width: "40%" }}>
                    <TextComponent
                      text="Estimated Hours:"
                      size={Sizes?.s}
                      style={{ paddingVertical: 4 }}
                      loading={other?.isLoading}
                      width={80}
                    />
                    <TextComponent
                      text={item?.post_meta_details?._estimated_hours}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      style={{ textTransform: "capitalize" }}
                      loading={other?.isLoading}
                      width={80}
                    />
                  </View>
                  <View
                    style={{
                      borderRightWidth: 0.5,
                      borderColor: Colors?.grey,
                      height: 40,
                    }}
                  />
                  <View style={{ width: "35%", paddingRight: 10 }}>
                    <TextComponent
                      text="Hourly Rate:"
                      size={Sizes?.s}
                      style={{ paddingVertical: 4 }}
                      loading={other?.isLoading}
                      width={80}
                    />
                    <TextComponent
                      text={item?.post_meta_details?._hourly_rate}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                      loading={other?.isLoading}
                      width={80}
                    />
                  </View>
                </>
              ) : null}
            </View>

            {!userId && (
              <BlurView
                style={StyleSheet.absoluteFill}
                blurType="light"
                blurAmount={5}
                reducedTransparencyFallbackColor="white"
              />
            )}
          </View>
          {!other?.isLoading && (
            <TouchableOpacity
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.blue,
                width: "35%",
                alignSelf: "flex-end",
              }}
              onPress={() => handleViewJob(item)}
            >
              <TextComponent
                text="View Job"
                color={Colors?.white}
                size={Sizes?.s}
              />
            </TouchableOpacity>
          )}
        </View>
      </>
    );
  };

  return (
    <>
      <Header
        text={filterRoute && totalResult ? `${totalResult} Result Found` : ""}
        navigation={navigation}
        filter={true}
        onFilterIcon={() =>
          navigation?.navigate(routeName?.FILTER, {
            prevRoute: routeName?.JOBS,
          })
        }
      />
      <Loader loading={isBottomRefreshing ? false : other?.isLoading} />
      {jobsList?.length != 0 ? (
        <FlatList
          ref={flatListRef}
          data={jobsList}
          contentContainerStyle={{ marginVertical: 10, paddingBottom: 100 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
          keyExtractor={({ index }) => index}
          renderItem={renderItem}
          ListEmptyComponent={ListEmptyComponent}
          ListFooterComponent={ListFooterComponent}
          onEndReachedThreshold={0.9}
          onEndReached={lastPage == 1 ? null : endReached}
          // initialNumToRender={modelsList.length}
        />
      ) : (
        <NoDataFound emptyList={emptyList} />
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
    resizeMode: "contain",
    width: 65,
    height: 65,
    borderRadius: 100,
    borderWidth: 1.5,
    borderColor: Colors?.white,
  },
});
