import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useDispatch } from "react-redux";
import { Button, TextComponent, Header } from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import { Styles } from "../../Styles";
import { isValidCardExpiry, isValidCardNumber, routeName } from "../../Utility";

export const OrderCheckout = ({ navigation }) => {
  const dispatch = useDispatch();
  const projectDetails = [
    {
      title: "ORDER NUMBER:",
      name: "16497",
    },
    {
      title: "DATE:",
      name: "November 4, 2022",
    },
    {
      title: "EMAIL:",
      name: "anup@yopmail.com",
    },
    {
      title: "TOTAL:",
      name: "$0.00",
    },
    {
      title: "PAYMENT METHOD:",
      name: "Card Payment (Stripe)",
    },
  ];
  const orderDetails = [
    {
      title: "Hobby 20  × 1",
      name: "$0.00",
    },
    {
      title: "Subtotal",
      name: "$0.00",
    },
    {
      title: "Total",
      name: "$0.00",
    },
  ];

  const summaryDetails = [
    {
      title: "5 Portfolio Images",
      name: "",
    },
    {
      title: "Messaging to other Talent",
      name: "",
    },
    {
      title: "Basic Search Ranking",
      name: "",
    },
    {
      title: "15% service fee",
      name: "",
    },
    {
      title: "No Albums",
      name: "",
    },
    {
      title: "No of credits",
      name: "999999",
    },
    {
      title: "Duration",
      name: "30 Days",
    },
  ];

  return (
    <>
      <Header navigation={navigation} text="Checkout" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
            backgroundColor: Colors?.yellow,
            marginTop: 20,
          }}
        >
          <TextComponent
            text="Thank you. Your order has been received."
            size={Sizes?.l}
            fontWeight="400"
          />
        </View>
        <View
          style={{
            ...Styles?.container,
            padding: 20,
          }}
        >
          {projectDetails?.map((item) => {
            return (
              <>
                <View
                  style={{
                    ...Styles?.flexRow,
                    marginHorizontal: 10,
                    width: "90%",
                  }}
                >
                  <TextComponent
                    text={item?.title}
                    size={Sizes?.s}
                    fontWeight="400"
                  />
                  <TextComponent
                    text={item?.name}
                    size={Sizes?.xs}
                    fontWeight="400"
                  />
                </View>
                <View style={Styles?.separator} />
              </>
            );
          })}
        </View>

        <View
          style={{
            ...Styles?.container,
            padding: 20,
          }}
        >
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Order Details"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          <View
            style={{
              ...Styles?.flexRow,
              width: "90%",
            }}
          >
            <TextComponent text={"Product"} size={Sizes?.l} />
            <TextComponent text={"Total"} size={Sizes?.l} />
          </View>
          <View style={Styles?.separator} />
          {orderDetails?.map((item) => {
            return (
              <>
                <View
                  style={{
                    ...Styles?.flexRow,
                    marginHorizontal: 10,
                    width: "90%",
                  }}
                >
                  <TextComponent
                    text={item?.title}
                    size={Sizes?.s}
                    fontWeight="400"
                  />
                  <TextComponent
                    text={item?.name}
                    size={Sizes?.xs}
                    fontWeight="400"
                  />
                </View>
                <View style={Styles?.separator} />
              </>
            );
          })}
        </View>
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
              text="Hobby ( x1 )"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          {summaryDetails?.map((item) => {
            return (
              <>
                <View
                  style={{
                    ...Styles?.flexRow,
                    marginHorizontal: 10,
                    width: "90%",
                  }}
                >
                  <TextComponent
                    text={item?.title}
                    size={Sizes?.s}
                    fontWeight="400"
                  />
                  <TextComponent
                    text={item?.name}
                    size={Sizes?.xs}
                    fontWeight="400"
                  />
                </View>
                <View style={Styles?.separator} />
              </>
            );
          })}
        </View>
        <Button
          title="Return to dashboard"
          icon={true}
          background={true}
          style={{ paddingVertical: 5 }}
          onPress={() => {
            navigation?.navigate(routeName?.BOTTOM_TAB, {
              guest: false,
            });
            dispatch(navigatorStatus(routeName?.DRAWER, "", false));
          }}
        />
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
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
