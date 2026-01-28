import React from "react";
import { StyleSheet, ActivityIndicator, View } from "react-native";
import Modal from "react-native-modal";
import { Colors, JSONS, Sizes } from "../Constants";
import { TextComponent } from "./TextComponent";
export const Loader = (props) => {
  return (
    <Modal
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      isVisible={props?.loading}
      backdropOpacity={0.4}
    >
      {props?.loading && (
        <View style={styles.container}>
          <ActivityIndicator size="small" color={Colors?.black} />
          <TextComponent
            text="Loading..."
            color={Colors?.gray}
            size={Sizes?.s}
            style={{ letterSpacing: 0.5 }}
          />
        </View>
      )}
    </Modal>
  );
};

const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 2,
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    backgroundColor: "white",
    width: "40%",
    alignSelf: "center",
    padding: 20,
    borderRadius: 5,
  },
  text: {
    marginLeft: "5%",
    color: "red",
  },
});
