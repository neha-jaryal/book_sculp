import React, { useState } from "react";
import { isValidCardExpiry, isValidCardNumber, regName } from "../Utility";
import { Styles } from "../Styles";
import { Colors, Sizes } from "../Constants";
import { TextComponent } from "./TextComponent";
import { InputBox } from "./InputBox";
import { StyleSheet, View } from "react-native";

export const StripeCard = () => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDatey] = useState("");
  const [cvc, setCvc] = useState("");

  const cardNumberValid = isValidCardNumber(cardNumber);
  const cardExpiryValid = isValidCardExpiry(expiryDate);

  return (
    <View
      style={{
        ...Styles?.container,
        padding: 20,
        marginBottom: 10,
      }}
    >
      <View
        style={{
          ...Styles?.flexRow,
          ...styling?.headingView,
        }}
      >
        <TextComponent
          text="Card Payment (Stripe)"
          size={Sizes?.l}
          fontWeight="400"
        />
      </View>
      <TextComponent
        text={`Pay with your credit card / debit card via Stripe.`}
        size={Sizes?.s}
        color={Colors?.darkgrey}
        fontWeight="400"
        style={{ width: "100%", marginBottom: 10 }}
      />
      <View style={{ paddingVertical: 25, paddingHorizontal: 15 }}>
        <View style={{ marginBottom: 20 }}>
          <TextComponent text="Card Number" size={Sizes?.l} fontWeight="400" />
          <InputBox
            type="cardNumber"
            value={cardNumber}
            placeholder="0000 0000 0000 0000"
            setValue={setCardNumber}
            error={cardNumberValid}
          />
        </View>
        <View style={{ marginBottom: 20 }}>
          <TextComponent text="Expiry Date" size={Sizes?.l} fontWeight="400" />
          <InputBox
            type="expiryDate"
            value={expiryDate}
            placeholder="MM/YY"
            setValue={setExpiryDatey}
            error={cardExpiryValid}
          />
        </View>
        <TextComponent
          text="Card Code (CVC)"
          size={Sizes?.l}
          fontWeight="400"
        />
        <InputBox
          type="cvc"
          value={cvc}
          placeholder="CVC"
          onChangeText={(val) => setCvc(val)}
        />
      </View>
    </View>
  );
};

const styling = StyleSheet.create({
  emailView: {
    backgroundColor: Colors?.yellow,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: "space-around",
  },
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});
