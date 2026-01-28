import React, { useState } from "react";
import { Text, View, TouchableOpacity, Alert } from "react-native";
import { Sizes, Colors } from "../Constants";
import { Styles } from "../Styles";
import { InputBox } from "./InputBox";

export const Payment = (props) => {
  alert("hihi");
  const { style } = props;
  const [name, setName] = useState("");

  const subscribe = async () => {};

  return (
    <View style={{ ...Styles?.tabButtonsContainer }}>
      <InputBox
        placeholder={"Name"}
        value={name}
        onChangeText={(e) => setName(e)}
      />
      <TouchableOpacity
        onPress={() => subscribe()}
        style={{
          ...Styles?.tabButton,
          backgroundColor: Colors?.themeColor,
        }}
      >
        <Text
          style={{
            ...style,
            fontSize: Sizes.l,
            fontWeight: "500",
            color: Colors?.white,
          }}
        >
          Pay
        </Text>
      </TouchableOpacity>
    </View>
  );
};
