import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { Sizes, Colors } from "../Constants";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextComponent } from "./TextComponent";
import { useFocusEffect } from "@react-navigation/native";
export const Checkbox = (props) => {
  const {
    checked,
    setChecked,
    text,
    span,
    style,
    onPress,
    multiple,
    index,
    element,
    isChecked,
  } = props;
  const [check, setCheck] = useState(false);
  const handleMultiCheckBox = () => {
    onPress();
    setCheck(!check);
  };

  useFocusEffect(
    React.useCallback(() => {
      if (isChecked) {
        setCheck(true);
      } else {
        setCheck(false);
      }
    }, [props])
  );

  return (
    <TouchableOpacity
      onPress={() =>
        multiple
          ? handleMultiCheckBox()
          : onPress
          ? onPress()
          : setChecked(!checked)
      }
      style={{
        ...style,
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: 10,
        width: "90%",
      }}
    >
      {checked || check ? (
        <Feather
          name="check-square"
          size={15}
          color={Colors?.themeColor}
          style={{ marginRight: 5 }}
        />
      ) : (
        <MaterialCommunityIcons
          name="checkbox-blank-outline"
          size={15}
          color={Colors?.themeColor}
          style={{ marginRight: 5 }}
        />
      )}
      <TextComponent
        text={text}
        color={Colors?.black}
        size={Sizes?.s}
        fontWeight="400"
      />
      {span && (
        <TextComponent text={span} color={Colors?.themeColor} size={Sizes?.s} />
      )}
    </TouchableOpacity>
  );
};
