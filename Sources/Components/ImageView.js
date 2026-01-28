import React from "react";
import { Image, StyleSheet } from "react-native";
import FastImage from "@d11/react-native-fast-image"; // Maintained fork
import { Colors, dimensionheight, Images } from "../Constants";
import { Skeletoning } from "./Skeletoning";
import { useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const ImageView = (props) => {
  const {
    style,
    height = dimensionheight(12),
    width = dimensionheight(12),
    uri,
    loading,
    user, // if true, show user icon fallback
  } = props;

  const { themeColor } = useSelector((state) => state?.otherReducer) || {}; // optional chaining
  const auth = useSelector((state) => state?.authReducer); // unused currently, kept for future

  // Default profile size & radius
  const profileSize = dimensionheight(14);
  const isProfile = !!user || !!style?.borderRadius; // heuristic for profile images

  if (loading) {
    return (
      <Skeletoning
        width={width}
        height={height}
        style={[
          styles.skeleton,
          isProfile && { borderRadius: profileSize / 2 },
        ]}
      />
    );
  }

  if (uri) {
    return (
      <FastImage
        source={{ uri, priority: FastImage.priority.normal }}
        style={[
          styles.image,
          { width, height },
          style,
          isProfile && styles.profileImage,
        ]}
        resizeMode={FastImage.resizeMode.cover}
        cache={FastImage.cacheControl.immutable} // better caching
        transitionDuration={300} // smooth fade-in (optional)
      />
    );
  }

  if (user) {
    return (
      <FontAwesome
        name="user-circle-o"
        size={120} // can make dynamic later: Math.min(width, height) * 0.8
        color={themeColor || Colors?.themeColor}
        style={styles.userIcon}
      />
    );
  }

  // Default fallback placeholder
  return (
    <Image
      source={Images?.dummyUser}
      style={[
        styles.profileImg,
        { width: profileSize, height: profileSize },
        style,
      ]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  image: {
    // Base styles – override with props.style
  },
  profileImage: {
    borderRadius: dimensionheight(100), // full circle
    borderWidth: 1.5,
    borderColor: Colors?.white,
  },
  skeleton: {
    borderRadius: dimensionheight(100),
  },
  userIcon: {
    top: 10,
    marginVertical: 20,
  },
  profileImg: {
    borderRadius: dimensionheight(100),
  },
});