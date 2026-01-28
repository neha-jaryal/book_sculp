import "react-native-gesture-handler";
import React from "react";
import { TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Colors, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { useEffect } from "react";

export const ToastContainer = (props) => {
  const toastConfig = {
    success: (initialState) => {
      return (
        <Container
          backgroundColor={Colors?.themeColor}
          initialState={initialState}
        />
      );
    },
    error: (initialState) => {
      return (
        <Container backgroundColor={Colors?.pink} initialState={initialState} />
      );
    },
    info: (initialState) => {
      return (
        <Container backgroundColor={Colors?.blue} initialState={initialState} />
      );
    },
  };
  return <Toast config={toastConfig} position="bottom" topOffset={5} />;
};

export const Container = (props) => {
  const { backgroundColor, initialState } = props;
  return (
    <View
      style={{
        ...Styles?.container,
        ...Styles?.flexRow,
        width: "90%",
        paddingHorzontal: 30,
        backgroundColor: backgroundColor,
      }}
    >
      <View style={{ marginHorizontal: 10 }}>
        {initialState?.text2 && (
          <TextComponent
            text={initialState?.text2}
            color={Colors?.white}
            size={Sizes?.s}
            style={{ textTransform: "capitalize" }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={() => {
          Toast.hide();
        }}
      >
        <FontAwesome
          name="times-circle-o"
          size={Sizes?.xxl}
          color={Colors?.white}
        />
      </TouchableOpacity>
    </View>
  );
};
