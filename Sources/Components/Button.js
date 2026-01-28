import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, View } from "react-native";
import { Images, Sizes, Colors } from "../Constants";
import { Styles } from "../Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const Button = (props) => {
  const { style, title, icon, background, onPress, backgroundColor } = props;
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        ...style,
        ...Styles?.buttonContainer,
        backgroundColor: backgroundColor
          ? backgroundColor
          : background
          ? Colors?.themeColor
          : Colors?.white,
        borderColor: backgroundColor ? backgroundColor : Colors?.themeColor,
        marginVertical: 10,
      }}
    >
      <View style={styling.buttonView}>
        <Text
          style={{
            ...style,
            fontSize: Sizes.l,
            fontWeight: "500",
            color: background ? Colors?.white : Colors?.themeColor,
          }}
        >
          {title}
        </Text>
        {icon && (
          <MaterialCommunityIcons
            name="arrow-right-thin"
            size={35}
            color={background ? Colors?.white : Colors?.themeColor}
            style={{ position: "absolute", right: 10 }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
const styling = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
  },
});
