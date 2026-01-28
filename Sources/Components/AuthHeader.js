import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Images } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./index";
import AntDesign from "react-native-vector-icons/AntDesign";
export const AuthHeader = (props) => {
  return (
    <View style={Styles?.headerContainer}>
      <View style={styling.headerTopView}>
        <TouchableOpacity
          style={styling?.backButton}
          onPress={() => props?.navigation.goBack()}
        >
          <AntDesign name="left" size={14} color={Colors?.black} />
        </TouchableOpacity>
        <TextComponent text={props?.name} />
      </View>
      <View style={styling.logoView}>
        <Image source={Images?.logo} style={styling.logoImg} />
      </View>
    </View>
  );
};

const styling = StyleSheet.create({
  headerTopView: {
    flexDirection: "row",
    justifyContent: "center",
    padding: 10,
    alignItems: "center",
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  logoImg: {
    width: 150,
    height: 70,
    position: "absolute",
    top: Platform?.OS == "android" ? 50 : 40,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 10,
  },
});
