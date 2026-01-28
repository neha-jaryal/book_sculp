// ManagePortfolios.js
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
import { Header, TextComponent } from "../../Components";
import { Colors, dimensionheight, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { PostCard } from "../../Components/PostCard";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { getUserPortfolio } from "../../Redux/Services/OtherServices";
import { useDispatch } from "react-redux";
import { getData, storageKey } from "../../Utility/Storage";
import FastImage from "@d11/react-native-fast-image";
import { VideoModal } from "../../Components/VideoModal";

const { height: windowHeight } = Dimensions.get("window");
const boxHeight = (windowHeight * 2) / 3.3;

export const ManagePortfolios = ({ navigation }) => {
  const dispatch = useDispatch();

  const [refreshing, setRefreshing] = useState(false);
  const [postCards, setPostCards] = useState([]);
  const [userData, setUserData] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCard, setSelectedCard] = useState(null);
  const [currentVisibleIndex, setCurrentVisibleIndex] = useState(0);

  useEffect(() => {
    fetchUserData();
    fetchPortfolios();
  }, []);

  const fetchUserData = async () => {
    const userID = await getData(storageKey?.USER_ID);
    if (userID) {
      const body = { user_id: JSON.parse(userID) };
      const res = await dispatch(getUserDetail(body));
      if (res?.status === 200) {
        setUserData(res.results);
      }
    }
  };

  const fetchPortfolios = async () => {
    setRefreshing(true);
    const userID = await getData(storageKey?.USER_ID);
    if (userID) {
      const body = { user_id: JSON.parse(userID) };
      const res = await dispatch(getUserPortfolio(body));
      if (res?.status === 200) {
        setPostCards(res.results || []);
      }
    }
    setRefreshing(false);
  };

  const onRefresh = useCallback(() => {
    fetchPortfolios();
  }, []);

  const handleCardPress = (card) => {
    setSelectedCard(card);
    setModalVisible(true);
  };

  const viewabilityConfig = useRef({
    itemVisiblePercentThreshold: 60, // 60% visible → considered "in center"
  }).current;

  const onViewableItemsChanged = useRef(({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const mostVisible = viewableItems.reduce((prev, curr) =>
        curr.itemVisiblePercent > prev.itemVisiblePercent ? curr : prev
      );
      setCurrentVisibleIndex(mostVisible.index);
    }
  }).current;

  const ListHeader = () => (
    <>
      {userData && (
        <View
          style={{
            ...Styles.container,
            backgroundColor: Colors.themeColor,
            paddingBottom: 20,
          }}
        >
          <View style={{ ...Styles.flexRow }}>
            <TouchableOpacity
              onPress={() => navigation.navigate(routeName.ADD_POST)}
              style={{
                position: "absolute",
                bottom: 10,
                right: 10,
                ...Styles.smallButton,
                ...Styles.row,
                width: "32%",
              }}
            >
              <FontAwesome name="plus-square-o" size={18} color={Colors.themeColor} />
              <TextComponent
                text="New Post"
                size={Sizes.s}
                color={Colors.themeColor}
                style={{ paddingHorizontal: 5 }}
              />
            </TouchableOpacity>

            <View style={styling.profileView}>
              {userData?.profile_image?.[0]?.guid ? (
                <FastImage
                  source={{ uri: userData.profile_image[0].guid }}
                  style={{
                    ...styling.profileImg,
                    borderWidth: 2,
                    borderColor: Colors.lightThemeColor,
                  }}
                />
              ) : (
                <FontAwesome
                  name="user-circle-o"
                  size={120}
                  color={Colors.themeColor}
                  style={{ marginVertical: 20 }}
                />
              )}

              <View style={{ marginVertical: 5, alignItems: "center" }}>
                <TextComponent
                  text={userData?.user_data?.full_name || "User"}
                  size={Sizes.l}
                  color={Colors.white}
                />
                <TextComponent
                  text={userData?.personal_details?.tag_line || ""}
                  size={Sizes.xs}
                  fontWeight="400"
                  color={Colors.white}
                />
              </View>
            </View>

            <View style={{ ...Styles.flexRow, width: "60%", bottom: 35 }}>
              <View style={styling.userDeatilView}>
                <TextComponent
                  text={userData?.project_count_details?.total_portfolio_post_count || "0"}
                  size={Sizes.l}
                  color={Colors.white}
                />
                <TextComponent text="Portfolios" size={Sizes.s} fontWeight="400" color={Colors.white} />
              </View>
              <View style={styling.userDeatilView}>
                <TextComponent
                  text={userData?.project_count_details?.followers_count || "0"}
                  size={Sizes.l}
                  color={Colors.white}
                />
                <TextComponent text="Followers" size={Sizes.s} fontWeight="400" color={Colors.white} />
              </View>
              <View style={styling.userDeatilView}>
                <TextComponent
                  text={userData?.project_count_details?.following_count || "0"}
                  size={Sizes.l}
                  color={Colors.white}
                />
                <TextComponent text="Following" size={Sizes.s} fontWeight="400" color={Colors.white} />
              </View>
            </View>
          </View>
        </View>
      )}
    </>
  );

  return (
    <>
      <Header text="Manage Portfolios" navigation={navigation} />

      <FlatList
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.darkgrey}
          />
        }
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={() => (
          <View style={{ marginTop: 200, alignItems: "center" }}>
            <TextComponent text="No Portfolio Uploaded" size={Sizes.s} color={Colors.darkgrey} />
            <TextComponent
              text="Tap on the + New Post to add new portfolio"
              size={Sizes.s}
              fontWeight="400"
              color={Colors.darkgrey}
            />
          </View>
        )}
        data={postCards}
        keyExtractor={(item, index) => index.toString()}
        viewabilityConfig={viewabilityConfig}
        onViewableItemsChanged={onViewableItemsChanged}
        renderItem={({ item, index }) => (
          <View style={{ height: item?.reelsList?.length > 0 ? undefined : boxHeight }}>
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
              modal={modalVisible}
              setModal={setModalVisible}
              onPress={() => setModalVisible(true)}
              onReelTap={() => setModalVisible(true)}
              refreshList={fetchUserData}
              postType="portfolio"
              userId={true}
            />
          </View>
        )}
      />

      {modalVisible && selectedCard && (
        <VideoModal
          cards={postCards}
          uri={selectedCard?.uri}
          modal={modalVisible}
          setModal={setModalVisible}
          navigation={navigation}
        />
      )}
    </>
  );
};

const styling = StyleSheet.create({
  profileView: {
    alignItems: "center",
    marginBottom: 15,
    width: "35%",
  },
  profileImg: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    borderRadius: dimensionheight(100),
    borderWidth: 2,
    borderColor: Colors.lightThemeColor,
  },
  userDeatilView: {
    alignItems: "center",
  },
});

// Viewability config for detecting visible item
const viewabilityConfig = {
  itemVisiblePercentThreshold: 60,
};