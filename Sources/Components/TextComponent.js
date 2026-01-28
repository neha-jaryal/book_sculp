import React from "react";
import { Text, View } from "react-native";
import { Sizes, Colors, Fonts } from "../Constants";
import { Styles } from "../Styles";
import AntDesign from "react-native-vector-icons/AntDesign";
import { Tooltip } from "react-native-elements";
import { Skeletoning } from "./Skeletoning";

export const TextComponent = (props) => {
  const {
    style,
    text,
    fontWeight,
    color,
    size,
    fontStyle,
    numberOfLines,
    toolTipText,
    loading,
    width,
  } = props;

  return (
    <View style={toolTipText ? Styles?.row : null}>
      {loading ? (
        <Skeletoning
          height={20}
          horizontal={0}
          width={width ? width : 330}
          style={{
            borderRadius: 10,
            marginVertical: loading ? 5 : 0,
          }}
        />
      ) : (
        <Text
          style={{
            ...style,
            fontSize: size ? size : Sizes.xl,
            fontWeight: fontWeight ? fontWeight : "500",
            color: color ? color : Colors?.black,
            // fontFamily: fontStyle ? fontStyle : Fonts?.Regular,
            
          }}
          numberOfLines={numberOfLines}
        >
          {text}
        </Text>
      )}

      {toolTipText && (
        <Tooltip
          backgroundColor={Colors?.pink}
          popover={<Text style={{ color: Colors?.white }}>{toolTipText}</Text>}
        >
          <AntDesign
            name="questioncircle"
            size={14}
            style={{
              position: "absolute",
              right: 38,
            }}
            color={Colors?.darkgrey}
          />
        </Tooltip>
      )}
    </View>
  );
};
