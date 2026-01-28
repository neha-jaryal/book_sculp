import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Colors,
  dimensionheight,
  dimensionWidth,
  Images,
  Sizes,
} from "../Constants";
import { Styles } from "../Styles";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TextComponent } from "./TextComponent";
import { routeName } from "../Utility/routeName";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useNavigation } from "@react-navigation/native";

export const Header = (props) => {
  const navigation = useNavigation();

  const {
    text,
    filter,
    onFilterIcon,
    button,
    buttonText,
    icon,
    onRightClick,
    chatHeader,
    profileImg,
    onlineStatus,
    inbox,
    onPressProfile,
    rightHeader,
  } = props;
  return (
    <View
      style={{
        ...Styles?.dashboardHeader,
      }}
    >
      <View style={{ ...styling?.logoView }}>
        <TouchableOpacity
          onPress={() =>
            chatHeader
              ? navigation?.navigate(routeName?.INBOX)
              : navigation.goBack()
          }
          style={{ paddingVertical: 10, paddingRight: 20 }}
        >
          <Image source={Images?.backButton} />
        </TouchableOpacity>
        {chatHeader ? (
          <View style={{ ...Styles?.row, width: "70%" }}>
            <TouchableOpacity onPress={onPressProfile}>
              {profileImg?.uri ? (
                <Image
                  source={profileImg}
                  style={{
                    width: dimensionheight(6),
                    height: dimensionheight(6),
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: Colors?.lightThemeColor,
                    resizeMode: "contain",
                    // marginHorizontal: 10,
                  }}
                />
              ) : (
                <FontAwesome
                  name="user-circle-o"
                  size={45}
                  color={Colors?.gredient}
                />
              )}
            </TouchableOpacity>
            <View style={{ paddingHorizontal: 10 }}>
              <TextComponent
                text={text}
                color={Colors?.black}
                size={Sizes?.l}
                style={{ textTransform: "capitalize" }}
              />

              <TextComponent
                // text={"● " + onlineStatus}
                text={onlineStatus}
                color={
                  onlineStatus == "Typing....."
                    ? Colors?.darkYellow
                    : onlineStatus === "online"
                    ? Colors?.themeColor
                    : onlineStatus === "away"
                    ? Colors?.yellow
                    : Colors?.gray
                }
                size={Sizes?.s}
              />
            </View>
          </View>
        ) : filter ? (
          <TextComponent
            text={text}
            color={Colors?.darkgrey}
            size={Sizes?.s}
            style={{ marginLeft: -30 }}
          />
        ) : (
          <TextComponent text={text} color={Colors?.black} size={Sizes?.l} />
        )}

        {button ? (
          <TouchableOpacity
            onPress={onRightClick}
            style={{
              ...Styles?.smallButton,
              flexDirection: "row",
              alignItems: "center",
              backgroundColor: Colors?.themeColor,
              marginVertical: 0,
            }}
          >
            {icon && (
              <FontAwesome name={icon} size={18} color={Colors?.white} />
            )}
            <TextComponent
              text={buttonText}
              color={Colors?.white}
              size={Sizes?.s}
              style={{ paddingHorizontal: 8 }}
            />
          </TouchableOpacity>
        ) : filter ? (
          <TouchableOpacity
            onPress={onFilterIcon}
            style={
              {
                // ...Styles?.smallButton,
                // backgroundColor: Colors?.themeColor,
                // flexDirection: "row",
                // alignItems: "center",
                // marginVertical: 0,
                // borderRadius: 80,
              }
            }
          >
            <FontAwesome name="filter" size={25} color={Colors?.themeColor} />
            {/* <TextComponent
                text={"Refine Your Search"}
                color={Colors?.white}
                size={Sizes?.s}
                style={{ paddingHorizontal: 8 }}
                fontWeight="400"
              /> */}
            {/* <Image source={Images?.filterIcon} /> */}
          </TouchableOpacity>
        ) : inbox ? (
          <View>{icon}</View>
        ) : rightHeader ? (
          rightHeader()
        ) : (
          <View />
        )}
      </View>
    </View>
  );
};

const styling = StyleSheet.create({
  logoView: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
    paddingTop: 15,
    paddingHorizontal: 15,
  },
  logoImg: {
    width: 70,
    height: 35,
  },
});
