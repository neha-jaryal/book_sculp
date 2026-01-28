import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { Colors, Sizes } from "../Constants";

export const ErrorMessage = (props) => {
  const { error, value, message, isEmpty } = props;

  return (
    <View style={styling?.errorView}>
      {(error && value) || isEmpty ? (
        <Text style={styling?.errorMessage}>{message}</Text>
      ) : null}
    </View>
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
