import React from "react";
import { View, StyleSheet, Text, ImageBackground, Image } from "react-native";
import { Colors, dimensionheight, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { useSelector } from "react-redux";
import { Loader } from "./Loader";

export const NoDataFound = (props) => {
  const { emptyList } = props;
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  return (
    <>
      {other?.isLoading || auth?.isLoading ? null : emptyList ? (
        <View
          style={{
            justifyContent: "center",
            padding: 0,
          }}
        >
          <Image
            source={Images?.noDataImg}
            style={{
              width: "100%",
              resizeMode: "contain",
              height: 350,
            }}
          />
        </View>
      ) : null}
    </>
  );
};

const styling = StyleSheet.create({
  errorView: {
    flexDirection: "row",
    width: "100%",
  },
  errorMessage: {
    color: Colors.red,
    fontSize: Sizes?.s,
  },
});
