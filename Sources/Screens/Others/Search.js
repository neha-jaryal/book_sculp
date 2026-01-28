import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  RefreshControl,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  TextComponent,
  Header,
  NotificationCard,
  VideoModal,
  Tabs,
  NoDataFound,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { Styles } from "../../Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getSavedPost } from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { PostCard } from "../../Components/PostCard";
import { useFocusEffect } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { routeName } from "../../Utility";

const { height: windowHeight } = Dimensions.get("window");
const boxHeight = (windowHeight * 2) / 3.3;

export const SavedJobDetails = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);

  const [heading, setHeading] = useState("Saved Jobs");
  const [modal, setModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [postCards, setPostCards] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [tab, setTab] = useState("social");
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);

  useFocusEffect(
    React.useCallback(() => {
      getAllPostListing("social");
      setTab("social");
    }, [])
  );

  const getAllPostListing = async (type) => {
    const userID = await getData(storageKey?.USER_ID);
    if (!userID) return;

    const body = {
      user_id: JSON.parse(userID),
      post_type: type === "social" ? "211" : type === "portfolios" ? 212 : 213,
    };

    const res = await dispatch(getSavedPost(body));
    if (res?.status === 200) {
      setTab(type);
      if (type === "jobs") {
        setJobsList(res?.results || []);
      } else {
        setPostCards(res?.results || []);
      }
      setRefreshing(false);
    }
  };

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    getAllPostListing(tab);
  }, [tab]);

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModal(true);
  };

  // Detect visible card for video play/pause
  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60, // 60% visible = "in center"
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const mostVisible = viewableItems.reduce((prev, curr) =>
        curr.itemVisiblePercent > prev.itemVisiblePercent ? curr : prev
      );
      setCurrentVisibleIndex(mostVisible.index);
    }
  }).current;

  const options = [
    { name: "Social Post", type: "social" },
    { name: "Portfolios", type: "portfolios" },
    { name: "Jobs", type: "jobs" },
  ];

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
      <View style={{ ...Styles.container, marginBottom: 10 }} key={index}>
        <Image
          source={{ uri: item?.profile_image }}
          style={{
            ...styling.profileImg,
            borderWidth: 3,
            borderColor: Colors.lightBlue,
            position: "absolute",
            top: -20,
          }}
        />
        <TouchableOpacity
          style={{ alignSelf: "flex-end", marginHorizontal: 10 }}
          onPress={() =>
            item?.post_meta_details?.saved_status === 1
              ? handleSavePost(item, "unsaved")
              : handleSavePost(item, "saved")
          }
        >
          <FontAwesome
            name={item?.post_meta_details?.saved_status === 1 ? "bookmark" : "bookmark-o"}
            size={25}
            color={Colors.blue}
          />
        </TouchableOpacity>

        <View style={{ ...Styles.flexRow, marginTop: 15 }}>
          <TextComponent
            text={`${item?.profile?.post_title}`}
            size={Sizes.l}
            style={{ textTransform: "capitalize", width: 200 }}
            loading={other?.isLoading}
            width={150}
          />
          {item?.profile?.post_date && (
            <TextComponent
              text={timeSince(convertUTCToLocalTime(item?.profile?.post_date))}
              size={Sizes.s}
              color={Colors.darkgrey}
              fontWeight="400"
              style={{ textAlign: "right", alignSelf: "flex-end", width: 100 }}
              loading={other?.isLoading}
              width={50}
            />
          )}
        </View>

        <TextComponent
          text={`${item?.post_meta_details?.model_type_req}`}
          size={Sizes.s}
          style={{ marginVertical: 10, textTransform: "capitalize", width: 100 }}
          loading={other?.isLoading}
          fontWeight="400"
          width={150}
          color={Colors.darkgrey}
        />

        {item?.profile?.post_content && (
          <TextComponent
            text={item?.profile?.post_content}
            size={Sizes.s}
            color={Colors.darkgrey}
            fontWeight="400"
            style={{ textTransform: "capitalize", width: "90%" }}
            loading={other?.isLoading}
            width={200}
          />
        )}

        <View style={Styles.separator} />

        <View style={{ ...Styles.flexRow, paddingVertical: 6, paddingHorizontal: 8 }}>
          <View style={{ width: "35%" }}>
            <TextComponent
              text="Project Type:"
              size={Sizes.s}
              style={{ paddingVertical: 4 }}
              loading={other?.isLoading}
              width={80}
            />
            <TextComponent
              text={item?.post_meta_details?._project_type}
              size={Sizes.s}
              color={Colors.darkgrey}
              fontWeight="400"
              style={{ textTransform: "capitalize" }}
              loading={other?.isLoading}
              width={100}
            />
          </View>
          <View style={{ borderRightWidth: 0.5, borderColor: Colors.grey, height: 40 }} />
          <View style={{ paddingRight: 10, width: "40%" }}>
            <TextComponent
              text="Project Budget:"
              size={Sizes.s}
              style={{ paddingVertical: 4 }}
              loading={other?.isLoading}
              width={100}
            />
            <TextComponent
              text={
                item?.post_meta_details?.project_budget
                  ? "$" + item?.post_meta_details?.project_budget
                  : item?.post_meta_details?._hourly_rate
                  ? `$${item?.post_meta_details?._hourly_rate} (${item?.post_meta_details?._estimated_hours} hours)`
                  : "0"
              }
              size={Sizes.s}
              color={Colors.darkgrey}
              fontWeight="400"
              loading={other?.isLoading}
              width={100}
            />
          </View>
        </View>

        <View style={Styles.separator} />

        {item?.post_meta_details?.country && (
          <>
            <View style={{ ...Styles.row, justifyContent: "center" }}>
              <FontAwesome name="flag" size={20} color={Colors.lightBlue} />
              <TextComponent
                text={" " + item?.post_meta_details?.country + " | " + item?.post_meta_details?.city}
                size={Sizes.s}
                color={Colors.darkgrey}
                fontWeight="400"
                style={{ padding: 4, textAlign: "center" }}
                loading={other?.isLoading}
                width={200}
              />
            </View>
            <View style={Styles.separator} />
          </>
        )}

        <View style={{ ...Styles.flexRow, paddingVertical: 4, paddingHorizontal: 8 }}>
          <View style={{ width: "35%" }}>
            <TextComponent
              text="Expert:"
              size={Sizes.s}
              style={{ paddingVertical: 4 }}
              loading={other?.isLoading}
              width={100}
            />
            <TextComponent
              text={item?.post_meta_details?.project_level}
              size={Sizes.s}
              color={Colors.darkgrey}
              fontWeight="400"
              style={{ textTransform: "capitalize" }}
              loading={other?.isLoading}
              width={80}
            />
          </View>
          <View style={{ borderRightWidth: 0.5, borderColor: Colors.grey, height: 40 }} />
          <View style={{ width: "35%", paddingRight: 10 }}>
            <TextComponent
              text="Proposal:"
              size={Sizes.s}
              style={{ paddingVertical: 4 }}
              loading={other?.isLoading}
              width={100}
            />
            <TextComponent
              text={item?.post_meta_details?.proposal_count}
              size={Sizes.s}
              color={Colors.darkgrey}
              fontWeight="400"
              loading={other?.isLoading}
              width={80}
            />
          </View>
        </View>

        <View style={Styles.separator} />

        {item?.post_meta_details?.skills_names &&
          item?.post_meta_details?.skills_names?.length !== 0 && (
            <>
              <View style={{ ...Styles.row, justifyContent: "center" }}>
                <TextComponent text="Skills : " size={Sizes.s} loading={other?.isLoading} width={80} />
                {typeof item?.post_meta_details?.skills_names === "object" ? (
                  item.post_meta_details.skills_names.map((ele, idx) => (
                    <TextComponent
                      key={idx}
                      text={
                        idx === item.post_meta_details.skills_names.length - 1
                          ? ele?.value
                            ? ele.value + ", "
                            : ele
                          : ""
                      }
                      size={Sizes.s}
                      color={Colors.darkgrey}
                      fontWeight="400"
                      style={{ padding: 2 }}
                      loading={other?.isLoading}
                      width={80}
                      numberOfLines={1}
                    />
                  ))
                ) : (
                  <TextComponent
                    text={item.post_meta_details.skills_names}
                    size={Sizes.s}
                    color={Colors.darkgrey}
                    fontWeight="400"
                    style={{ padding: 2 }}
                    loading={other?.isLoading}
                    width={80}
                    numberOfLines={1}
                  />
                )}
              </View>
              <View style={Styles.separator} />
            </>
          )}

        <View style={{ ...Styles.flexRow, paddingVertical: 4, paddingHorizontal: 8 }}>
          {item?.post_meta_details?._project_type === "Hourly Rate" ? (
            <>
              <View style={{ width: "40%" }}>
                <TextComponent
                  text="Estimated Hours:"
                  size={Sizes.s}
                  style={{ paddingVertical: 4 }}
                  loading={other?.isLoading}
                  width={80}
                />
                <TextComponent
                  text={item?.post_meta_details?._estimated_hours}
                  size={Sizes.s}
                  color={Colors.darkgrey}
                  fontWeight="400"
                  style={{ textTransform: "capitalize" }}
                  loading={other?.isLoading}
                  width={80}
                />
              </View>
              <View style={{ borderRightWidth: 0.5, borderColor: Colors.grey, height: 40 }} />
              <View style={{ width: "35%", paddingRight: 10 }}>
                <TextComponent
                  text="Hourly Rate:"
                  size={Sizes.s}
                  style={{ paddingVertical: 4 }}
                  loading={other?.isLoading}
                  width={80}
                />
                <TextComponent
                  text={item?.post_meta_details?._hourly_rate}
                  size={Sizes.s}
                  color={Colors.darkgrey}
                  fontWeight="400"
                  loading={other?.isLoading}
                  width={80}
                />
              </View>
            </>
          ) : null}
        </View>

        <View style={Styles.separator} />

        {!other?.isLoading && (
          <TouchableOpacity
            style={{
              ...Styles.smallButton,
              backgroundColor: Colors.blue,
              width: "35%",
              alignSelf: "flex-end",
            }}
            onPress={() => handleViewJob(item)}
          >
            <TextComponent text="View Job" color={Colors.white} size={Sizes.s} />
          </TouchableOpacity>
        )}
      </View>
    );
  };

  return (
    <>
      <Header text={"Saved Collection"} navigation={navigation} />

      <View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            flexDirection: "row",
            justifyContent: "space-between",
            width: "100%",
          }}
          style={{
            marginTop: 15,
            marginHorizontal: 10,
          }}
        >
          {options?.map((item, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => {
                getAllPostListing(item.type);
                setTab(item.type);
              }}
              style={{
                ...Styles.smallButton,
                backgroundColor: tab === item.type ? Colors.themeColor : Colors.white,
                borderColor: tab !== item.type ? Colors.themeColor : Colors.white,
                borderWidth: 1,
                marginRight: 10,
                width: 115,
              }}
            >
              <TextComponent
                text={item.name}
                color={tab === item.type ? Colors.white : Colors.black}
                size={Sizes.s}
                fontWeight="400"
                style={{ paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {tab === "jobs" ? (
          jobsList?.length !== 0 ? (
            <FlatList
              data={jobsList}
              contentContainerStyle={{
                marginTop: 50,
                paddingBottom: 20,
              }}
              refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
              }
              keyExtractor={(item, index) => index.toString()}
              renderItem={renderItem}
              ListEmptyComponent={ListEmptyComponent}
              onEndReachedThreshold={0.9}
            />
          ) : (
            <TextComponent
              text={"No Data Found"}
              size={Sizes.l}
              fontWeight="400"
              style={{ textAlign: "center" }}
            />
          )
        ) : (
          <FlatList
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor={Colors.darkgrey}
              />
            }
            ListEmptyComponent={() =>
              other?.isLoading || auth?.isLoading ? null : (
                <View style={{ marginTop: 200, alignItems: "center" }}>
                  <TextComponent
                    text="No Social Post Uploaded"
                    size={Sizes.s}
                    color={Colors.darkgrey}
                  />
                </View>
              )
            }
            nestedScrollEnabled={true}
            data={postCards}
            keyExtractor={(item, index) => index.toString()}
            viewabilityConfig={viewabilityConfig}
            onViewableItemsChanged={onViewableItemsChanged}
            renderItem={({ item, index }) => (
              <View style={{ minHeight: boxHeight }}>
                <PostCard
                  paused={currentVisibleIndex !== index}
                  cardData={item}
                  index={index}
                  isLoading={false}
                  type={
                    item?.gallery?.gallery_imgs?.length > 0
                      ? "image"
                      : item?.gallery?.videos?.length > 0
                      ? "Vedio"
                      : null
                  }
                  navigation={navigation}
                  modal={modal}
                  setModal={setModal}
                  onPress={() => {
                    setSelectedCard(item);
                    setModal(true);
                  }}
                  onReelTap={() => {
                    setSelectedCard(item);
                    setModal(true);
                  }}
                  refreshList={getAllPostListing}
                  postType="social"
                  userId={true}
                />
              </View>
            )}
          />
        )}
      </View>

      {modal && selectedCard && (
        <VideoModal
          cards={postCards}
          uri={selectedCard?.uri}
          modal={modal}
          setModal={setModal}
          navigation={navigation}
        />
      )}
    </>
  );
};

const styling = StyleSheet.create({
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: Colors?.white,
    borderRadius: 10,
    marginTop: 15,
    paddingVertical: 25,
  },
  imageIconView: {
    marginLeft: 12,
    marginRight: 5,
  },
});
///    return (
//   <TouchableOpacity
//     onPress={() => getModelDetails(item)}
//     style={styling.itemContainer}
//   >
// {subscriptionProIds.includes(subId) && (
//   <View style={styling.crownIcon}>
//     <MaterialCommunityIcons
//       name="crown"
//       color={
//         subId === 103 || subId === 105 ? Colors.orange : Colors.yellow
//       }
//       size={30}
//     />
//   </View>
// )}

//     <FastImage
//       source={{
//         uri: item?.profile_image,
//         priority: FastImage.priority.normal,
//       }}
//       style={styling.profileImg}
//       resizeMode={FastImage.resizeMode.cover}
//       transition={false}
//     />

// <View style={styling.infoOverlay}>
//   <View style={Styles.flexRow}>
//     <TextComponent
//       text={" ◉ " + item?.post_meta_details?.display_name}
//       size={Sizes.l}
//       color={Colors.white}
//       width={120}
//       style={styling.shadowText}
//       loading={other?.isLoading}
//     />
//     <View
//       style={{
//         flexDirection: "row",
//         alignItems: "center",
//       }}
//     >
//       <FontAwesome
//         name={displayStar}
//         color={Colors.yellow}
//         size={18}
//         style={{ right: 5 }}
//       />
//       <TextComponent
//         text={rating.toString()}
//         size={Sizes.l}
//         color={Colors.white}
//         width={10}
//         fontWeight="400"
//       />
//     </View>
//   </View>
//       <View style={{ ...Styles.flexRow, marginVertical: 6 }}>
//         {item?.post_meta_details?.country && (
//           <TextComponent
//             text={`${item?.post_meta_details?.country} | ${item?.post_meta_details?.city}`}
//             size={Sizes.s}
//             color={Colors.white}
//             width={150}
//           />
//         )}
//         {item?.post_meta_details?.perhour_rate && (
//           <TextComponent
//             text={`$${item?.post_meta_details?.perhour_rate} / hr`}
//             size={Sizes.s}
//             color={Colors.white}
//             width={150}
//           />
//         )}
//       </View>
//     </View>
//   </TouchableOpacity>
// );
