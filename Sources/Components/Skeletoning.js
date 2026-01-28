import React from "react";
import { useRef } from "react";
import { useEffect } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { Skeleton } from "@rneui/themed";

export const Skeletoning = (props) => {
  const { style, height, width, horizontal } = props;
  return (
    <Skeleton
      width={width ? width : 370}
      height={height ? height : 100}
      animation="pulse"
      style={[
        horizontal ? { marginHorizontal: horizontal } : null,
        {
          ...style,
          backgroundColor: Colors?.gredient,
          padding: 0,
          width: width ? width : "90%",
        },
      ]}
      skeletonStyle={{ backgroundColor: "#ebf2f7" }}
    />
  );
};
