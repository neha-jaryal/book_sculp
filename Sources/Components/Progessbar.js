import { StyleSheet, Text, View,   } from "react-native";

export const Progessbar = (props) => {
  const {
    navigation,
    percentage,
    height,
    backgroundColor,
    completedColor,
  } = props;
  return (
    <View style={{ justifyContent: "center" }}>
      <View
        style={{
          width: "100%",
          height: height,
          marginVertical: 10,
          borderRadius: 5,
          borderColor: backgroundColor,
          borderWidth: 1,
        }}
      />
      <View
        style={{
          width: percentage ? percentage : 0,
          height: height,
          marginVertical: 10,
          borderRadius: 5,
          backgroundColor: completedColor,
          position: "absolute",
          bottom: 20,
        }}
      />
      <View
        style={{
          width: percentage ? percentage : 0,
          height: height,
          bottom: 10,
        }}
      >
        <Text style={{ textAlign: "right" }}>{percentage}</Text>
      </View>
    </View>
  );
};
