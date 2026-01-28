import React, { useEffect, useState } from "react";
import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, Skeletoning, TextComponent, NoDataFound } from "../../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../../Constants";
import { Styles } from "../../../Styles";
import { routeName } from "../../../Utility/routeName";
import { Searchbar } from "react-native-paper";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { useDispatch, useSelector } from "react-redux";
import { getAllClientsList, deleteUser } from "../../../Redux/Services/OtherServices";
import { getUserDetail } from "../../../Redux/Services/AuthServices";
import FastImage from "@d11/react-native-fast-image";
import { getData, storageKey } from "../../../Utility/Storage";
import { getAccountApproval } from "../../../Utility";

const screenWidth = Dimensions.get("window").width;
const numColumns = 3;
const imageSize = screenWidth / numColumns - 10;

export const ClientsList = ({ navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("All");
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    getUserRole();
    getClients();
  }, []);

  const getUserRole = async () => {
    let role = await getData(storageKey?.USER_ROLE);
    setUserRole(role);
  };

  const getClients = async () => {
    setLoading(true);
    const res = await dispatch(getAllClientsList());
    setLoading(false);
    if (res?.status === 200) {
      setUsersList(res?.results || []);
    }
  };

  const getModelDetails = async (item) => {
    if (!await getAccountApproval(true, navigation, auth)) return;

    const modelID = item?.post_meta_details?.user_id;
    const body = { user_id: modelID };
    const res = await dispatch(getUserDetail(body));
    if (res?.status === 200) {
      navigation?.navigate(routeName?.CLIENT_PROFILE, {
        userId: item?.post_meta_details?.user_id,
      });
    }
  };

  const handleDeleteUser = async (item) => {
    Alert.alert(
      "Delete Client",
      "Are you sure you want to delete this client?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            const userID = item?.post_meta_details?.user_id;
            const profileID = item?.profile?.ID;
            const body = { user_id: userID, profile_id: profileID };
            const res = await dispatch(deleteUser(body));
            if (res?.status === 200) {
              getClients(); // refresh list
            }
          },
        },
      ]
    );
  };

  const options = [
    { name: "All" },
    { name: "Verified Clients" },
    { name: "New Applications" },
    { name: "ID Verification Requests" },
    { name: "Rejected Accounts" },
  ];

  const renderItem = ({ item, index }) => {
    const subId = item?.post_meta_details?.subscription_pro_id;
    const isPro = subscriptionProIds.includes(subId);

    return (
      <TouchableOpacity
        style={{
          ...Styles.container,
          position: "relative",
          margin: 5,
          width: imageSize,
        }}
        onPress={() => getModelDetails(item)}
      >
        {isPro && (
          <View style={styling.crownIcon}>
            <MaterialCommunityIcons
              name="crown"
              color={subId === 103 || subId === 105 ? Colors.orange : Colors.yellow}
              size={30}
            />
          </View>
        )}

        {loading ? (
          <Skeletoning width={imageSize} height={imageSize + 30} style={{ margin: 5 }} />
        ) : (
          <FastImage
            source={{ uri: item?.profile_image }}
            style={styling.image}
            resizeMode={FastImage.resizeMode.cover}
          />
        )}

        <View style={{ padding: 8 }}>
          <TextComponent
            text={item?.post_meta_details?.display_name || "Client"}
            size={Sizes.m}
            fontWeight="500"
            numberOfLines={1}
          />
          <TextComponent
            text={item?.post_meta_details?.user_email || ""}
            size={Sizes.xs}
            color={Colors.darkgrey}
            numberOfLines={1}
          />
          <TextComponent
            text={item?.post_meta_details?.phone_number || ""}
            size={Sizes.xs}
            color={Colors.blue}
            numberOfLines={1}
          />
        </View>

        <View style={{ flexDirection: "row", justifyContent: "space-around", padding: 8 }}>
          <TouchableOpacity onPress={() => getModelDetails(item)}>
            <TextComponent text="Profile" size={Sizes.xs} color={Colors.blue} />
          </TouchableOpacity>

          <TouchableOpacity>
            <TextComponent text="Edit" size={Sizes.xs} color={Colors.pink} />
          </TouchableOpacity>

          <TouchableOpacity>
            <TextComponent text="Reset Password" size={Sizes.xs} color={Colors.yellow} />
          </TouchableOpacity>

          <TouchableOpacity>
            <TextComponent text="View ID" size={Sizes.xs} color={Colors.blue} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={{ position: "absolute", top: 8, right: 8 }}
          onPress={() => handleDeleteUser(item)}
        >
          <AntDesign name="delete" color={Colors.red} size={22} />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Header
        text={"Manage All Clients"}
        navigation={navigation}
        button={true}
        buttonText="New Client"
        icon={"plus-square"}
      />

      <Loader loading={other?.isLoading || loading} />

      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 15,
            marginHorizontal: 10,
          }}
        >
          {options?.map((item) => (
            <TouchableOpacity
              onPress={() => setTab(item.name)}
              style={{
                ...Styles.smallButton,
                backgroundColor: tab === item.name ? Colors.themeColor : Colors.white,
                marginRight: 10,
              }}
            >
              <TextComponent
                text={item.name}
                color={tab === item.name ? Colors.white : Colors.black}
                size={Sizes.s}
                fontWeight="400"
                style={{ paddingHorizontal: 10 }}
              />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={{ ...Styles.row }}>
          <Searchbar
            placeholder="Start Your Search..."
            onChangeText={setSearchQuery}
            value={searchQuery}
            loading={other?.isLoading}
            icon={() => <FontAwesome name="search" color={Colors.white} />}
            style={{
              borderRadius: 10,
              borderTopRightRadius: 0,
              borderBottomRightRadius: 0,
              marginHorizontal: 20,
              marginTop: 20,
              width: "76%",
            }}
            inputStyle={{ left: -25, fontSize: Sizes.l }}
          />
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: Colors.themeColor,
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
              color={Colors.white}
              size={19}
              style={{ paddingHorizontal: 20, paddingVertical: 10 }}
            />
          </TouchableOpacity>
        </View>

        <FlatList
          data={loading ? Array(12).fill({}) : usersList}
          numColumns={numColumns}
          keyExtractor={(item, index) => index.toString()}
          contentContainerStyle={{ padding: 10 }}
          renderItem={renderItem}
          ListEmptyComponent={
            !loading && (
              <NoDataFound />
            )
          }
        />
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
    width: dimensionheight(8),
    height: dimensionheight(8),
    borderRadius: dimensionheight(100),
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
  image: {
    width: imageSize,
    height: imageSize + 30,
    borderRadius: 5,
  },
});