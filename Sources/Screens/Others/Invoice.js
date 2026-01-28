import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { DashboardHeader, TextComponent } from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";

export const Invoice = ({ navigation }) => {
  const invoiceDetail = [
    {
      to: {
        name: "Anup Jaryal",
        address: "8 Phase Mohali 140501 Punjab, India",
      },
    },
    {
      from: {
        name: "Simran testing",
        address: "kharad Mohali 140501 Punjab, India",
      },
    },
  ];

  return (
    <>
      <DashboardHeader navigation={navigation} />
      <ScrollView>
        <View style={Styles?.container}>
          <View style={{ marginVertical: 10, paddingHorizontal: 10 }}>
            <TextComponent
              text="Invoice"
              size={Sizes?.xxl}
              color={Colors?.themeColor}
              fontWeight="bold"
            />
            <TextComponent text="#17071" size={Sizes?.l} fontWeight="bold" />
          </View>
          <View
            style={{
              ...Styles?.row,
              paddingVertical: 15,
              marginHorizontal: 10,
            }}
          >
            <TextComponent
              text="Project title : "
              size={Sizes?.l}
              color={Colors?.darkgrey}
            />
            <TextComponent
              text="Hiring Model"
              size={Sizes?.l}
              color={Colors?.black}
            />
          </View>
          <TextComponent
            text="Issue date: November 3, 2022, 9:43 am"
            size={Sizes?.s}
            color={Colors?.darkgrey}
            style={{ marginHorizontal: 10 }}
          />
          <View style={Styles?.separator} />
          <View
            style={{
              ...Styles?.container,
              width: "100%",
              marginHorizontal: 0,
              padding: 25,
            }}
          >
            <View style={Styles?.flexRow}>
              <TextComponent text={"To"} size={Sizes?.xl} />
              <TextComponent text={"From"} size={Sizes?.xl} />
            </View>
            <View style={Styles?.separator} />

            <View
              style={{
                ...Styles?.flexRow,
              }}
            >
              <TextComponent
                text={"Anup Jaryal"}
                size={Sizes?.s}
                fontWeight="400"
                style={{
                  width: "50%",
                  textAlign: "left",
                }}
              />
              <TextComponent
                text={"Harsimaran"}
                size={Sizes?.s}
                fontWeight="400"
                style={{
                  width: "50%",
                  textAlign: "right",
                }}
              />
            </View>
            <View style={Styles?.separator} />
            <View
              style={{
                ...Styles?.flexRow,
              }}
            >
              <TextComponent
                text={"8 Phase Mohali 140501 Punjab, India"}
                size={Sizes?.s}
                fontWeight="400"
                style={{
                  width: "45%",
                  textAlign: "left",
                }}
              />
              <TextComponent
                text={"kharad Mohali 140501 Punjab, India"}
                size={Sizes?.s}
                fontWeight="400"
                style={{
                  width: "45%",
                  textAlign: "right",
                }}
              />
            </View>
          </View>

          <View
            style={{
              ...Styles?.container,
              width: "100%",
              marginHorizontal: 0,
              padding: 25,
            }}
          >
            <View style={Styles?.flexRow}>
              <TextComponent text={"Item#"} size={Sizes?.l} />
              <TextComponent
                text={"1"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Description"} size={Sizes?.l} />
              <TextComponent
                text={"Hiring Model"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Cost"} size={Sizes?.l} />
              <TextComponent
                text={"$600.00	"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Taxes"} size={Sizes?.l} />
              <TextComponent
                text={"$0.00"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Amount"} size={Sizes?.l} />
              <TextComponent
                text={"$600.00"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Subtotal :"} size={Sizes?.l} />
              <TextComponent
                text={"$600.00"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Processing/taxes fee "} size={Sizes?.l} />
              <TextComponent
                text={"+$20.00"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
            <View style={Styles?.separator} />
            <View style={Styles?.flexRow}>
              <TextComponent text={"Total :"} size={Sizes?.l} />
              <TextComponent
                text={"$620.00"}
                size={Sizes?.s}
                color={Colors?.darkgrey}
              />
            </View>
          </View>
          <TextComponent
            text={"This is not a tax receipt or invoice"}
            size={Sizes?.l}
            color={Colors?.darkgrey}
            fontWeight="400"
            style={{ marginVertical: 15, textAlign: "center" }}
          />
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  headerTopView: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  logoImg: {
    width: 150,
    height: 70,
    position: "absolute",
    top: 50,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 10,
  },
});
