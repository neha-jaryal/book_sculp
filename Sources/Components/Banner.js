import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { routeName } from "../Utility";
import { useNavigation } from "@react-navigation/native";
export const Banner = (props) => {
  const navigation = useNavigation();

  return (
    <View style={Styles?.bannerCard}>
      <View
        style={{
          width: "60%",
          padding: 10,
        }}
      >
        <TextComponent
          text={"Matching the needs of fashion houses and more..."}
          size={Sizes?.l}
          color={Colors?.white}
        />
        <View style={styling?.findView}>
          <TouchableOpacity
            style={Styles?.smallButton}
            onPress={() => navigation?.navigate(routeName?.SEARCH_STACKS)}
          >
            <TextComponent
              text="Find Now"
              color={Colors?.themeColor}
              size={Sizes?.s}
              style={{ paddingHorizontal: 8 }}
            />
          </TouchableOpacity>
          <Image source={Images?.Frame} />
        </View>
      </View>
      <Image source={Images?.bannerImg} />
    </View>
  );
};

const styling = StyleSheet.create({
  findView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "75%",
    alignItems: "baseline",
  },
});
