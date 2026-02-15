import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, Skeletoning, TextComponent } from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { Searchbar } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Entypo from "react-native-vector-icons/Entypo";
import {
  getModelsList,
  getSearchResults,
} from "../../Redux/Services/OtherServices";
import { useDispatch, useSelector } from "react-redux";
import FastImage from "@d11/react-native-fast-image";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { useFocusEffect } from "@react-navigation/native";
import { getData, storageKey } from "../../Utility/Storage";
import { getAccountApproval } from "../../Utility";
const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const imageSize = screenWidth / numColumns - 10;

export const Search = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const flatListRef = useRef(null);
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchFor, setSearchFor] = useState("Model");
  const [modelsList, setModelsList] = useState([]);
  const [isBottomRefreshing, setIsBottomRefreshing] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(0);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [totalResult, setTotalResult] = useState("");
  const [searching, setSearching] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const [filterRoute, setFilterRoute] = useState(
    route?.params?.routeName == routeName?.FILTER,
  );
  const filterData = other?.filterData;
  const subscriptionProIds = [103, 104, 105, 106];

  useEffect(() => {
    getAccountApprovalStatus();
    getSearchResultDetails();
  }, []);

  const getAccountApprovalStatus = async () => {
    const status = await getData(storageKey?.APPROVAL_STATUS);
    const userrole = await getData(storageKey?.USER_ROLE);
    setUserRole(userrole);
    setApprovalStatus(JSON.parse(status));
  };

  useFocusEffect(
    useCallback(() => {
      setPage(1);
      if (route?.params?.routeName == routeName?.FILTER) {
        setFilterRoute(true);
        setLoading(true);
        const talentType = filterData?.talent_type || "Model";
        setSearchFor(talentType);
        setSearchQuery("");
        getFilterResultDetails();
      } else {
        setFilterRoute(false);
      }
    }, [route?.params]),
  );

  const onChangeSearch = (query) => {
    setPage(1);
    setLastPage(1);
    setSearchQuery(query);
    setSearching(false);
  };

  const fetchList = async (body, type) => {
    const res = await dispatch(getSearchResults(body));
    if (res?.status == 200) {
      const { search, pagination } = res.results;
      console.log("res.resultsres.results----", res.results);
      setLastPage(pagination?.end_page);
      setTotalResult(pagination?.total_result);
      setModelsList(search);
      setRefreshing(false);
      setSearching(true);
      setPage(2);
      setLoading(false);
    }
  };

  const getSearchResultDetails = async (type) => {
    let userId = await getData(storageKey?.USER_ID);
    setLoading(true);
    const body = {
      keyword: type != "clear" && searchQuery,
      page_number: 1,
      per_page: 15,
      talent_type: filterData?.talent_type || searchFor,
      user_type: filterData?.user_type || "searchFor",
      user_id: userId,
    };
    await fetchList(body, searchFor);
    setLoading(false);
    if (type === "clear") {
      setSearchQuery("");
    }
  };

  const getFilterResultDetails = async () => {
    let userId = await getData(storageKey?.USER_ID);
    const body = {
      ...filterData,
      page_number: 1,
      per_page: 15,
      user_id: userId,
    };
    await fetchList(body, searchFor);
  };

  const getModelDetails = async (item) => {
    if (!approvalStatus && searchFor == "Model Kid") {
      getAccountApproval(true, navigation, auth);
      return;
    }
    const body = { user_id: item?.post_meta_details?.user_id };
    const res = await dispatch(getUserDetail(body));
    if (res?.status === 200) {
      if (res.results?.user_data?.user_role == 13) {
        navigation?.navigate(routeName?.PHOTOGRAPHER_PROFILE, {
          photographerData: res.results,
          userId: item?.post_meta_details?.user_id,
        });
      } else if (
        res.results?.user_data?.user_role == 11 ||
        res.results?.user_data?.user_role == 15
      ) {
        navigation?.navigate(routeName?.MODEL_PROFILE, {
          modelData: res.results,
          listData: modelsList,
        });
      }
    }
  };

  const endReached = async () => {
    if (isFetchingMore || (lastPage && page >= lastPage)) {
      return;
    }

    if (page == lastPage) {
      setIsBottomRefreshing(false);
      setIsFetchingMore(false);
      return null;
    } else {
      setIsBottomRefreshing(true);
      setIsFetchingMore(true);
      try {
        const userId = await getData(storageKey?.USER_ID);
        const body = searchQuery
          ? {
              keyword: searchQuery,
              page_number: page + 1,
              per_page: 20,
              talent_type: filterData?.talent_type,
              user_type: filterData?.user_type,
              user_id: userId,
            }
          : {
              ...filterData,
              page_number: page + 1,
              per_page: 20,
              user_id: userId,
            };

        const res = await dispatch(getSearchResults(body));

        if (res?.status === 200) {
          const newResults = res?.results?.search || [];

          if (newResults.length > 0) {
            const uniqueUsers = newResults.filter(
              (u) =>
                !modelsList.some(
                  (existing) =>
                    existing.post_meta_details?.user_id ===
                    u.post_meta_details?.user_id,
                ),
            );

            setModelsList((prev) => [...prev, ...uniqueUsers]);
            setPage((prev) => prev + 1);
            setLastPage(res.results.pagination?.number_pages || prevLastPage);
          } else {
            setLastPage(page); // stop further requests
          }
        }
      } finally {
        setIsFetchingMore(false);
        setIsBottomRefreshing(false);
        setLoading(false);
      }
    }
  };

  const onRefresh = async () => {
    setPage(1);
    await getFilterResultDetails();
    setRefreshing(true);
  };

  const ListEmptyComponent = () =>
    !loading || !other?.isLoading ? (
      <View style={{ marginTop: 200, alignSelf: "center" }}>
        <TextComponent
          text="No Data Found"
          size={Sizes.xl}
          color={Colors.darkgrey}
        />
      </View>
    ) : null;

  const ListFooterComponent = () =>
    isBottomRefreshing && (
      <View style={styling.footer}>
        <ActivityIndicator color="black" style={{ marginRight: 8 }} />
        <TextComponent text="Loading more..." size={Sizes.l} />
      </View>
    );

  const ListHeaderComponent = useMemo(
    () => (
      <View style={Styles.row}>
        <Searchbar
          placeholder="Start Your Search..."
          onChangeText={onChangeSearch}
          value={searchQuery}
          icon={() => <FontAwesome name="search" color={Colors.darkgrey} />}
          style={styling.searchBar}
          inputStyle={{ left: -10, fontSize: Sizes.s, paddingBottom: 9 }}
          clearIcon={() =>
            searchQuery && (
              <TouchableOpacity
                onPress={() => {
                  getSearchResultDetails("clear");
                }}
              >
                <Entypo name="cross" size={25} color={Colors.white} />
              </TouchableOpacity>
            )
          }
        />
        <TouchableOpacity
          onPress={getSearchResultDetails}
          style={styling.searchBtn}
        >
          <FontAwesome
            name="search"
            color={Colors.white}
            size={19}
            style={{ padding: 10, paddingHorizontal: 20 }}
          />
        </TouchableOpacity>
      </View>
    ),
    [searchQuery], // only update when query changes
  );

  const renderItem = useCallback(
    ({ item }) => {
      const subId = item?.post_meta_details?.subscription_pro_id;
      const rating = item?.post_meta_details?.user_rating || 0;
      const displayStar =
        rating === 5 ? "star" : rating > 0 ? "star-half-o" : "star-o";
      return (
        <TouchableOpacity
          onPress={() => getModelDetails(item)}
          style={{ margin: 2 }}
        >
          {subscriptionProIds.includes(subId) && (
            <View style={styling.crownIcon}>
              <MaterialCommunityIcons
                name="crown"
                color={
                  subId === 103 || subId === 105 ? Colors.orange : Colors.yellow
                }
                size={30}
              />
            </View>
          )}

          {(loading && !isBottomRefreshing) ||
          (other?.isLoading && !isBottomRefreshing) ? (
            <Skeletoning
              width={imageSize}
              height={imageSize + 30}
              horizontal={0}
            />
          ) : (
            <FastImage
              source={{ uri: item?.profile_image }}
              style={styling.image}
              transition={false}
            />
          )}
        </TouchableOpacity>
      );
    },
    [modelsList, loading, filterRoute, other?.isLoading],
  );

  const skeletonData = Array.from({ length: 21 }, (_, i) => ({
    id: `skeleton-${i}`,
  }));

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <Header
        text={
          filterRoute && totalResult
            ? `${totalResult} Result Found`
            : "Refine your search"
        }
        filter={Boolean(searchFor)}
        navigation={navigation}
        onFilterIcon={() => navigation?.navigate(routeName?.FILTER)}
      />

      <FlatList
        ref={flatListRef}
        data={modelsList.length > 0 ? modelsList : skeletonData}
        keyExtractor={(item, index) =>
          item?.post_meta_details?.user_id?.toString() ?? `skeleton-${index}`
        }
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        onEndReached={endReached}
        onEndReachedThreshold={0.5}
        ListEmptyComponent={ListEmptyComponent}
        ListFooterComponent={ListFooterComponent}
        ListHeaderComponent={ListHeaderComponent}
        ListHeaderComponentStyle={{ marginBottom: 15 }}
        renderItem={renderItem}
        numColumns={numColumns}
        contentContainerStyle={{ alignItems: "center", paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      />
    </KeyboardAvoidingView>
  );
};

const styling = StyleSheet.create({
  profileImg: { width: 355, height: 350, borderRadius: 10 },
  itemContainer: {
    ...Styles.container,
    padding: 0,
    position: "relative",
    marginBottom: 20,
  },
  crownIcon: {
    backgroundColor: Colors.white,
    borderRadius: 100,
    position: "absolute",
    left: 10,
    top: 10,
    zIndex: 99,
    padding: 5,
  },
  infoOverlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    position: "absolute",
    bottom: 0,
    width: 355,
    paddingVertical: 10,
    paddingHorizontal: 10,
    borderBottomEndRadius: 10,
    borderBottomStartRadius: 10,
  },
  shadowText: {
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -2, height: 0 },
    textShadowRadius: 5,
  },
  searchBar: {
    borderRadius: 10,
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    marginHorizontal: 10,
    marginTop: 15,
    height: 45,
    width: "80%",
    backgroundColor: Colors.white,
  },
  searchBtn: {
    borderRadius: 10,
    backgroundColor: Colors.themeColor,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    alignSelf: "flex-end",
    height: 45,
    justifyContent: "center",
    right: 10,
  },
  footer: {
    padding: 10,
    borderRadius: 4,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },

  image: {
    width: imageSize,
    height: imageSize + 30,
    borderRadius: 5,
  },
});
