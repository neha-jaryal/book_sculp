import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  AppState,
  Linking,
  Platform,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch } from "react-redux";
import { TextComponent } from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { getData, storageKey } from "../../Utility/Storage";
import { Styles } from "../../Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
// import { isNetworkAvailable, routeName } from "../../Utility";
export const ConnectionStatus = ({ navigation }) => {
  const dispatch = useDispatch();

  // useEffect(() => {
  //   const subscription = AppState.addEventListener("change", (nextAppState) => {
  //     if (nextAppState === "active") {
  //       networkStatus();
  //       console.log("App has come to the foreground!", nextAppState);
  //     }
  //   });

  //   return () => {
  //     subscription.remove();
  //   };
  // }, []);
  // const getUserID = async () => {
  //   let userId = await getData(storageKey?.USER_ID);

  //   if (userId) {
  //     dispatch(navigatorStatus(routeName?.DRAWER, "", false));
  //   } else {
  //     navigation?.navigate(routeName?.SIGNIN);
  //   }
  // };
  // const networkStatus = async () => {
  //   const isConnected = await isNetworkAvailable();
  //   console.log("isConnected----", isConnected);
  //   if (isConnected) {
  //     getUserID();
  //   } else {
  //     navigation?.navigate(routeName?.CONNECTION_STATUS);
  //   }
  // };
  // const handleAppSetting = useCallback(async () => {
  //   if (Platform?.OS == "android") {
  //     await Linking.sendIntent("android.settings.SETTINGS");
  //   } else {
  //     await Linking.openSettings();
  //   }
  // }, []);

  return (
    <View
      style={{
        ...Styles?.container,
        alignItems: "center",
        height: dimensionheight("90%"),
        justifyContent: "center",
        marginTop: 30,
      }}
    >
      <MaterialCommunityIcons
        name="wifi-off"
        size={80}
        color={Colors?.darkgrey}
      />
      <TextComponent
        text="Ooooooooops !"
        size={Sizes?.xl}
        color={Colors?.pink}
      />
      <TextComponent
        text="No Internet Connection! Make sure that Wi-Fi or Mobile Data is turned on, then try again."
        size={Sizes?.s}
        color={Colors?.darkgrey}
        style={{
          lineHeight: 22,
          letterSpacing: 0.5,
          textAlign: "center",
          marginVertical: 10,
        }}
      />
      {/* <TouchableOpacity
        // onPress={() => handleAppSetting()}
        style={{
          ...Styles?.smallButton,
          backgroundColor: Colors?.themeColor,
        }}
      >
        <TextComponent
          text="Turn on Mobile Data"
          color={Colors?.white}
          size={Sizes?.s}
          style={{ paddingHorizontal: 8 }}
        />
      </TouchableOpacity> */}
    </View>
  );
};
