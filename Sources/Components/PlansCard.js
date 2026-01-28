import { useFocusEffect, useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { getAccountApproval, routeName } from "../Utility";
import { TextComponent } from "./TextComponent";
import { useDispatch, useSelector } from "react-redux";
import { createSession } from "../Redux/Services/OtherServices";
import { getUserDetail } from "../Redux/Services/AuthServices";
import { getData, storageKey } from "../Utility/Storage";

export const PlansCard = (props) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const { cardData } = props;
  const navigation = useNavigation();
  const [userData, setUserData] = useState();
  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [])
  );
  const getUserData = async () => {
    let userId = await getData(storageKey?.USER_ID);
    if (userId) {
      var body = {
        user_id: JSON?.parse(userId),
      };
      let res = await dispatch(getUserDetail(body));
      setUserData(res?.results);
    }
  };

  const createProductSeesion = async (item) => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      action: "product",
      product_id: item?.custom_product_id,
      price_id: item?.custom_price_id,
      user_id: userId,
    };
    let res = await dispatch(createSession(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.PACKAGE_PAYMENT, {
        stripe_URL: res?.results?.url,
      });
      // navigation.navigate(routeName?.SUCCESS);
    }
  };

  return (
    <View
      style={{
        margin: 15,
        width: "90%",
      }}
    >
      {cardData && (
        <TouchableOpacity
          style={{
            ...styling?.postDeatils,
            justifyContent: "center",
            alignSelf: "center",
          }}
          // onPress={() => createProductSeesion()}
        >
          <View
            style={{
              backgroundColor: cardData?.background
                ? Colors?.themeColor
                : Colors?.white,
              borderTopRightRadius: 10,
              borderTopLeftRadius: 10,
              margin: 0,
            }}
          >
            <View
              style={{
                margin: 30,
                alignItems: "center",
              }}
            >
              <TextComponent
                text={cardData?.post_title}
                color={cardData?.background ? Colors?.white : Colors?.black}
                size={Sizes?.xxl}
                fontWeight="400"
                style={{ textTransform: "capitalize" }}
              />
              <TextComponent
                text={`$${cardData?._price}`}
                color={cardData?.background ? Colors?.white : Colors?.black}
                size={Sizes?.xl}
                style={{ paddingVertical: 8 }}
                fontWeight="400"
              />
              <View style={{ ...Styles?.separator }} />

              <TextComponent
                text={cardData?.description?.top_content}
                color={cardData?.background ? Colors?.white : Colors?.darkgrey}
                size={Sizes?.s}
                fontWeight="400"
                style={{
                  textAlign: "center",
                  // textTransform: "capitalize",
                  lineHeight: 26,
                }}
              />
              {/* {cardData?.description?.bottom?.map((item) => {
                return (
                  <TextComponent
                    text={item}
                    color={
                      cardData?.background ? Colors?.white : Colors?.darkgrey
                    }
                    size={Sizes?.l}
                    style={{
                      textAlign: "center",
                      textTransform: "capitalize",
                      lineHeight: 26,
                    }}
                  />
                );
              })} */}
              <TextComponent
                text={cardData?.description?.bottom}
                color={cardData?.background ? Colors?.white : Colors?.darkgrey}
                size={Sizes?.l}
                fontWeight="400"
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                  lineHeight: 26,
                }}
              />

              {/* <TextComponent
                text={cardData?.description?.bottom[2]}
                color={cardData?.background ? Colors?.white : Colors?.darkgrey}
                size={Sizes?.l}
                fontWeight="400"
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              />
              <TextComponent
                text={cardData?.description?.bottom[3]}
                color={cardData?.background ? Colors?.white : Colors?.darkgrey}
                size={Sizes?.l}
                fontWeight="400"
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              />
              <TextComponent
                text={cardData?.description?.bottom[4]}
                color={cardData?.background ? Colors?.white : Colors?.darkgrey}
                size={Sizes?.l}
                fontWeight="400"
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              />
              <TextComponent
                text={cardData?.description?.bottom[5]}
                color={cardData?.background ? Colors?.white : Colors?.darkgrey}
                size={Sizes?.l}
                fontWeight="400"
                style={{
                  textAlign: "center",
                  textTransform: "capitalize",
                }}
              /> */}

              {/* <View style={{ height: 30 }} />
              <RenderHtml source={{ html: cardData?.description?.bottom }} /> */}
            </View>
          </View>
          <View style={Styles?.separator} />
          <View style={{ padding: 15, alignItems: "center" }}>
            {/* {cardData?.portfolioDeatil?.portfolioHeading && (
              <TextComponent
                text={cardData?.portfolioDeatil?.portfolioHeading}
                color={Colors?.darkgrey}
                size={Sizes?.l}
                fontWeight="400"
                style={{ paddingVertical: 5, textTransform: "capitalize" }}
              />
            )}
            <TextComponent
              text={cardData?.portfolioDeatil?.portfolio}
              color={Colors?.darkgrey}
              size={Sizes?.l}
              fontWeight="400"
              style={{ paddingVertical: 5, textTransform: "capitalize" }}
            />
            <TextComponent
              text={cardData?.portfolioDeatil?.ranking}
              color={Colors?.darkgrey}
              size={Sizes?.l}
              fontWeight="400"
              style={{ paddingVertical: 5, textTransform: "capitalize" }}
            />
            <TextComponent
              text={cardData?.portfolioDeatil?.fee}
              color={Colors?.darkgrey}
              size={Sizes?.l}
              fontWeight="400"
              style={{ paddingVertical: 5, textTransform: "capitalize" }}
            />
            <TextComponent
              text={`${cardData?.portfolioDeatil?.album} Albums`}
              color={Colors?.darkgrey}
              size={Sizes?.l}
              fontWeight="400"
              style={{ paddingVertical: 5, textTransform: "capitalize" }}
            /> */}

            <TouchableOpacity
              onPress={() =>
                // : cardData?.product_id == "107"
                // ? navigation?.navigate(routeName?.SUCCESS)
                auth?.navigator == routeName?.GUEST_STACKS
                  ? getAccountApproval(true, navigation, auth)
                  : userData?.user_data?.subscription_pro_id ==
                    cardData?.product_id
                  ? null
                  : createProductSeesion(cardData)
              }
              style={{
                ...Styles?.smallButton,
                backgroundColor:
                  userData?.user_data?.subscription_pro_id ==
                  cardData?.product_id
                    ? Colors?.lightGray
                    : cardData?.background
                    ? Colors?.themeColor
                    : Colors?.white,
                borderWidth: 2,
                borderColor:
                  userData?.user_data?.subscription_pro_id ==
                  cardData?.product_id
                    ? Colors?.lightGray
                    : Colors?.themeColor,
                // width: "60%",
                marginVertical: 10,
              }}
            >
              <TextComponent
                text="Choose Now"
                color={
                  userData?.user_data?.subscription_pro_id ==
                  cardData?.product_id
                    ? Colors?.grey
                    : cardData?.background
                    ? Colors?.white
                    : Colors?.themeColor
                }
                size={Sizes?.l}
                style={{ paddingVertical: 6, paddingHorizontal: 20 }}
              />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};
const styling = StyleSheet.create({
  cardContentView: {
    flexDirection: "row",
    width: "100%",
    alignContent: "flex-end",
  },
  cardProfileView: {
    flexDirection: "row",
    width: "80%",
    left: 5,
    aligncardDatas: "flex-start",
  },
  postDeatils: {
    backgroundColor: Colors.white,
    padding: 0,
    marginHorizontal: 8,
    width: "100%",
    borderRadius: 10,
    alignItems: "center",
  },
  profileImg: {
    resizeMode: "contain",
    width: 45,
    height: 45,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: Colors?.white,
  },
  cardView: {
    width: 220,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
});
