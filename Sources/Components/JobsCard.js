import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, dimensionWidth, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { routeName } from "../Utility";
import { getJobDetails } from "../Redux/Services/OtherServices";
import { useDispatch } from "react-redux";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

export const JobsCard = (props) => {
  const { cardData, navigation } = props;
  const dispatch = useDispatch();
  const handleViewJob = async (item) => {
    var body = {
      project_id: item?.profile?.ID,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.VIEW_JOBS, {
        jobDetail: res?.results[0],
      });
    }
  };
  return (
    <View style={{ margin: 15 }}>
      {cardData && (
        <FlatList
          data={cardData}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item, index) => index}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styling?.postDeatils}
              onPress={() => handleViewJob(item)}
            >
              <View
                style={{
                  ...styling?.cardContentView,
                  justifyContent: "space-between",
                }}
              >
                <View style={{ width: "80%" }}>
                  <TextComponent
                    text={item?.profile?.post_title}
                    color={Colors?.black}
                    size={Sizes?.l}
                    style={{ textTransform: "capitalize" }}
                  />
                </View>
                <View style={styling?.cardContentView}>
                  <FontAwesome
                    name={"star-half-o"}
                    color={Colors?.yellow}
                    size={20}
                    style={{ paddingHorizontal: 6 }}
                  />
                  <TextComponent
                    text={item?.rating}
                    color={Colors?.black}
                    size={Sizes?.s}
                  />
                </View>
              </View>
              {item?.profile?.post_content && (
                <TextComponent
                  text={item?.profile?.post_content}
                  color={Colors?.darkgrey}
                  size={Sizes?.l}
                  fontWeight="400"
                  style={{ textTransform: "capitalize" }}
                />
              )}

              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: Colors?.grey,
                  marginVertical: 10,
                }}
              />
              <TextComponent
                text={"Project Budget"}
                size={Sizes?.s}
                fontWeight="400"
                style={{ paddingVertical: 5 }}
              />
              {item?.post_meta_details?._hourly_rate && (
                <TextComponent
                  text={`Hourly Rate - ${item?.post_meta_details?._hourly_rate}`}
                  color={Colors?.darkgrey}
                  size={Sizes?.xs}
                  fontWeight="400"
                  style={{ textTransform: "capitalize" }}
                />
              )}

              {item?.post_meta_details?._estimated_hours && (
                <TextComponent
                  text={`Estimated Hours - ${item?.post_meta_details?._estimated_hours}`}
                  color={Colors?.darkgrey}
                  size={Sizes?.xs}
                  fontWeight="400"
                  style={{ textTransform: "capitalize" }}
                />
              )}

              {item?.post_meta_details?._project_type && (
                <TextComponent
                  text={`Project Type - ${item?.post_meta_details?._project_type}`}
                  color={Colors?.darkgrey}
                  size={Sizes?.xs}
                  fontWeight="400"
                  style={{ textTransform: "capitalize" }}
                />
              )}
              <View
                style={{
                  borderBottomWidth: 1,
                  borderColor: Colors?.grey,
                  marginVertical: 10,
                }}
              />

              <View style={{ ...styling?.cardContentView }}>
                <MaterialIcons
                  name="verified"
                  size={20}
                  color={Colors?.themeColor}
                />
                <TextComponent
                  text={"Payment Verified"}
                  color={Colors?.darkgrey}
                  size={Sizes?.s}
                  fontWeight="400"
                  style={{ paddingHorizontal: 6 }}
                />
              </View>
              {item?.post_meta_details?.country ||
              item?.post_meta_details?.state ||
              item?.post_meta_details?.city ? (
                <View
                  style={{ ...styling?.cardContentView, marginVertical: 5 }}
                >
                  <Image
                    source={Images?.locationIcon}
                    style={{ width: 22, height: 22, marginTop: 5 }}
                  />
                  <TextComponent
                    text={`${item?.post_meta_details?.country} ${item?.post_meta_details?.state} ${item?.post_meta_details?.city}`}
                    color={Colors?.darkgrey}
                    size={Sizes?.s}
                    style={{ padding: 6, textTransform: "capitalize" }}
                    fontWeight="400"
                  />
                </View>
              ) : null}
            </TouchableOpacity>
          )}
        />
      )}
    </View>
  );
};
const styling = StyleSheet.create({
  cardContentView: {
    flexDirection: "row",
    width: "100%",
    alignContent: "flex-end",
  },
  cardProfileView: {
    flexDirection: "row",
    width: "80%",
    left: 5,
    alignItems: "flex-start",
  },
  postDeatils: {
    backgroundColor: Colors.white,
    padding: 20,
    marginHorizontal: 8,
    width: 220,
    borderRadius: 10,
  },
  profileImg: {
    resizeMode: "contain",
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors?.white,
  },
  cardView: {
    width: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
