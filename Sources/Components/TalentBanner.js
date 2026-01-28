import React from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { routeName } from "../Utility/routeName";
import { Button } from "./Button";
import { TextComponent } from "./TextComponent";
import { navigatorStatus } from "../Redux/Actions/AuthActions";
import { useDispatch } from "react-redux";

export const TalentBanner = (props) => {
  const { cardData, navigation } = props;
  const dispatch = useDispatch();
  return (
    <ImageBackground
      source={cardData?.image}
      imageStyle={{ height: 250, resizeMode: "contain", position: "relative" }}
    >
      <View style={styling?.cardContentView}>
        <TextComponent
          text={cardData?.heading}
          color={Colors?.white}
          size={Sizes?.xxl}
          style={{ textAlign: "center", textTransform: "capitalize" }}
        />
        <TextComponent
          text={cardData?.discription}
          color={Colors?.white}
          size={Sizes?.l}
          style={{ textAlign: "center", padding: 6, letterSpacing: 1 }}
          fontWeight="400"
        />
        <TouchableOpacity
          onPress={() => {
            navigation?.navigate(routeName?.SIGNUP);
            dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
          }}
          style={{
            ...Styles?.smallButton,
            backgroundColor: Colors?.themeColor,
            width: "35%",
          }}
        >
          <TextComponent
            text="Sign Up Now"
            color={Colors?.white}
            size={Sizes?.s}
          />
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
};
const styling = StyleSheet.create({
  cardContentView: {
    position: "absolute",
    width: "90%",
    paddingVertical: 60,
    alignSelf: "center",
    alignItems: "center",
  },
  cardProfileView: {
    flexDirection: "row",
    width: "80%",
    left: 5,
    alignItems: "flex-start",
  },
  postDeatils: {
    backgroundColor: Colors.white,
    borderBottomEndRadius: 20,
    borderBottomStartRadius: 20,
    padding: 20,
  },
  profileImg: {
    resizeMode: "contain",
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors?.white,
  },
});
