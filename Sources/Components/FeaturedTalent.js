import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import FastImage from "@d11/react-native-fast-image"; // ← Maintained fork
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { routeName } from "../Utility";
import { useDispatch } from "react-redux";
import { getUserDetail } from "../Redux/Services/AuthServices";

export const FeaturedTalent = ({ cardData, navigation }) => {
  const dispatch = useDispatch();

  const getModelDetails = async (item) => {
    const modelID = item?.post_meta_details?.user_id;
    if (!modelID) return; // Safety check

    const body = { user_id: modelID };
    try {
      const res = await dispatch(getUserDetail(body)).unwrap(); // Assuming thunk with unwrap
      if (res?.status === 200) {
        navigation?.navigate(routeName?.MODEL_PROFILE, {
          modelData: res?.results,
        });
      }
    } catch (error) {
      console.error("Failed to fetch model details:", error);
      // Optional: show toast/error message here
    }
  };

  const renderItem = ({ item }) => {
    const profileUri = item?.profile_image; // assuming string URI
    const displayName = item?.post_meta_details?.display_name || "Unknown";
    const isVerified = item?.post_meta_details?.is_verified === "yes";
    const perHourRate = item?.post_meta_details?.perhour_rate;
    const rating = item?.post_meta_details?.user_rating;
    const location = item?.profile_image?.[0]?.address; // ← if array (check your API data)

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.8}
        onPress={() => getModelDetails(item)}
      >
        {profileUri ? (
          <FastImage
            source={{ uri: profileUri }}
            style={styles.cardImage}
            resizeMode={FastImage.resizeMode.cover}
            onLoadStart={() => {} /* optional loader state if needed */}
            onError={(e) => console.log("Image load error:", e.nativeEvent.error)}
          />
        ) : (
          <Image
            source={Images?.avtarImg}
            style={[styles.cardImage, styles.fallbackImage]}
            resizeMode="contain"
          />
        )}

        <View style={styles.detailsContainer}>
          <View style={Styles?.flexRow}>
            <TextComponent
              text={displayName}
              color={Colors?.black}
              size={Sizes?.l}
              style={styles.nameText}
            />
            <MaterialIcons
              name="verified"
              size={20}
              color={isVerified ? Colors?.themeColor : Colors?.red}
            />
          </View>

          {location && (
            <View style={[styles.cardContentView, { marginVertical: 6 }]}>
              <Image
                source={Images?.locationIcon}
                style={styles.locationIcon}
              />
              <TextComponent
                text={location}
                color={Colors?.darkgrey}
                size={Sizes?.l}
                style={{ paddingLeft: 5 }}
                fontWeight="400"
              />
            </View>
          )}

          <View style={[styles.cardContentView, { marginVertical: 12 }]}>
            {perHourRate && (
              <View style={styles.rateBadge}>
                <TextComponent
                  text={`$${perHourRate} / Hr`}
                  color={Colors?.black}
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>
            )}

            {rating && (
              <View style={styles.ratingContainer}>
                <FontAwesome
                  name="star-half-o"
                  color={Colors?.yellow}
                  size={18}
                  style={{ paddingHorizontal: 6 }}
                />
                <TextComponent
                  text={rating}
                  color={Colors?.black}
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (!cardData?.length) {
    return null; // or show empty state
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={cardData}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item, index) => item?.id?.toString() || index.toString()} // better if ID exists
        renderItem={renderItem}
        ListEmptyComponent={<ActivityIndicator size="large" color={Colors?.themeColor} />}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    margin: 15,
  },
  card: {
    marginHorizontal: 8,
    width: 200,
    borderWidth: 1,
    borderRadius: 10,
    borderColor: Colors?.gredient,
    overflow: "hidden", // better rounded corners
    backgroundColor: Colors?.white,
  },
  cardImage: {
    width: 198,
    height: 198,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  fallbackImage: {
    borderWidth: 1.5,
    borderColor: Colors?.white,
  },
  detailsContainer: {
    backgroundColor: Colors.white,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: Colors?.gredient,
  },
  cardContentView: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },
  nameText: {
    width: 140, // adjusted for verified icon
    textTransform: "capitalize",
  },
  locationIcon: {
    width: 20,
    height: 20,
    marginTop: 5,
  },
  rateBadge: {
    backgroundColor: Colors?.yellow,
    paddingHorizontal: 15,
    paddingVertical: 4,
    borderRadius: 8,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
});