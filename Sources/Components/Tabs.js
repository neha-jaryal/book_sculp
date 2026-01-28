import React from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Sizes, Colors } from "../Constants";
import { Styles } from "../Styles";

export const Tabs = (props) => {
  const { style, leftTitle, rightTitle, onLeftTab, onRightTab, tab } = props;

  return (
    <View style={{ ...Styles?.tabButtonsContainer }}>
      <TouchableOpacity
        onPress={onLeftTab}
        style={{
          ...Styles?.tabButton,
          backgroundColor: tab == 1 ? Colors?.themeColor : Colors?.white,
        }}
      >
        <Text
          style={{
            ...style,
            fontSize: Sizes.l,
            fontWeight: "500",
            color: tab == 1 ? Colors?.white : Colors?.themeColor,
          }}
        >
          {leftTitle}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onRightTab}
        style={{
          ...Styles?.tabButton,
          backgroundColor: tab == 1 ? Colors?.white : Colors?.themeColor,
        }}
      >
        <Text
          style={{
            ...style,
            fontSize: Sizes.l,
            fontWeight: "500",
            color: tab == 1 ? Colors?.themeColor : Colors?.white,
          }}
        >
          {rightTitle}
        </Text>
      </TouchableOpacity>
    </View>
  );
};
