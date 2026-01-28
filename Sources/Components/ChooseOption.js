import React, { useState } from "react";
import { Image, Text, TouchableOpacity, View } from "react-native";
import { Sizes, Colors, Images } from "../Constants";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { TextComponent } from "./TextComponent";
export const ChooseOption = (props) => {
  const { title, options } = props;
  const [checked, setChecked] = useState(false);
  return (
    <View onPress={() => setChecked(!checked)}>
      <TouchableOpacity
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          width: "95%",
        }}
      >
        <TextComponent
          text={title}
          color={Colors?.black}
          size={Sizes?.l}
          fontWeight="500"
        />
        <Image source={Images?.downArrow} />
      </TouchableOpacity>

      <View style={{ padding: 10 }}>
        {options?.map((item) => {
          return (
            <TouchableOpacity
              onPress={() => setChecked(!checked)}
              style={{
                flexDirection: "row",
                paddingVertical: 4,
              }}
            >
              {checked ? (
                <Feather name="check-square" size={15} color={Colors?.black} />
              ) : (
                <MaterialCommunityIcons
                  name="checkbox-blank-outline"
                  size={15}
                  color={Colors?.gray}
                />
              )}
              <TextComponent
                text={item?.name}
                color={Colors?.black}
                size={Sizes?.s}
                fontWeight="400"
                style={{ paddingHorizontal: 8 }}
              />
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};
