import { useFocusEffect } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Button,
  TextComponent,
  DashboardHeader,
  PlansCard,
  Header,
  Loader,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { getPackages } from "../../Redux/Services/AuthServices";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { getProductList } from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";

export const Packages = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);
  const [packagesList, setPackagesList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      getAllPackages();
    }, [])
  );
  const getAllPackages = async () => {
    let paymentStatus = await getData(storageKey?.PAYMENT_STATUS);
    setPaymentStatus(JSON.parse(paymentStatus));
    if (paymentStatus) {
      var body = {
        action: "products",
      };
      let res = await dispatch(getPackages());
      setPackagesList(res?.results);
    }
  };

  return (
    <>
      <Header text="Packages" navigation={navigation} />
      <Loader loading={auth?.isLoading ? auth?.isLoading : other?.isLoading} />
      <View
        style={{
          ...Styles?.container,
          ...Styles?.headingView,
        }}
      >
        <TextComponent text="All Packages" size={Sizes?.xl} fontWeight="400" />
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {packagesList?.map((item, index) => {
          return (
            <View style={{ ...Styles?.container, marginBottom: 30 }}>
              <PlansCard
                cardData={item}
                index={index}
                navigation={navigation}
              />
            </View>
          );
        })}
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: Colors?.white,
    borderRadius: 10,
    marginTop: 10,
    marginHorizontal: 18,
    width: "90%",
  },
});
