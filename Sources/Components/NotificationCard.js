import React, { useState } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import { Image, Text, View } from "react-native";
import { Images, Sizes, Colors } from "../Constants";
import { Styles } from "../Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Foundation from "react-native-vector-icons/Foundation";
import { TextComponent } from "./TextComponent";
import { useDispatch } from "react-redux";
import { updateNotifyStatus } from "../Redux/Services/OtherServices";
import { getData, storageKey } from "../Utility/Storage";
import moment from "moment";
import { convertUTCToLocalTime, routeName, timeSince } from "../Utility";

export const NotificationCard = (props) => {
  const { cardData, getAllNotifications, navigation } = props;
  const dispatch = useDispatch();
  const [expendView, setExpendView] = useState(false);
  const handleNotifyStatus = async (item) => {
    readNotify(item);
    if (item.notify_type == 1 || item.notify_type == 2) {
      navigation.navigate(routeName?.FOLLOW_DETAILS);
    } else if (item.notify_type == 3 || item.notify_type == 4) {
      if (item?.post_id) {
        navigation?.navigate(routeName?.VIEW_POST_DETAILS, {
          portId: item?.post_id,
          socialId: item?.post_id,
          postType: item.post_type == "social_post" ? "social" : "portfolio",
          routeName: routeName?.NOTIFICATIONS,
          showSwiper: item.notify_type == 4 ? true : false,
        });
      } else {
        alert("This post is not available !");
      }
    } else if (item.notify_type == 5) {
      if (item?.post_id) {
        navigation?.navigate(routeName?.MANAGE_PROPOSAL, {
          project_id: item?.post_id,
        });
      } else {
        alert("This job is closed !");
      }
    } else if (item.notify_type == 6) {
      navigation?.navigate(routeName?.MANAGE_PROJECTS, {
        prevRoute: routeName?.CHECKOUT,
        tab: "ongoing",
      });
    } else {
      readNotify(item);
    }
  };

  const readNotify = async (item) => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      notification_id: item?.notify_id,
      user_id: userId,
      status: "update",
    };
    let res = await dispatch(updateNotifyStatus(body));
    if (res?.status == 200) {
      getAllNotifications();
    }
  };
  return (
    <>
      <TouchableOpacity
        onPress={() => handleNotifyStatus(cardData)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "flex-start",
          backgroundColor:
            cardData?.notify_status === "true" ? "#F8F9FB" : "#EAF4FF",
          padding: 15,
          marginHorizontal: 15,
          marginVertical: 6,
          borderRadius: 12,

          // Shadow (iOS)
          shadowColor: "#000",
          shadowOpacity: 0.05,
          shadowRadius: 6,
          shadowOffset: { width: 0, height: 2 },

          // Elevation (Android)
          elevation: 2,
        }}
      >
        {/* LEFT SIDE */}
        <View style={{ flexDirection: "row", flex: 1 }}>
          {/* Icon Circle */}
          <View
            style={{
              height: 42,
              width: 42,
              borderRadius: 21,
              backgroundColor: "#FFFFFF",
              justifyContent: "center",
              alignItems: "center",
              marginRight: 12,
            }}
          >
            <FontAwesome
              name={cardData?.notify_status === "true" ? "bell-o" : "bell"}
              size={18}
              color="#2979FF"
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              numberOfLines={2}
              style={{
                fontSize: 14,
                color: "#333",
                lineHeight: 20,
              }}
            >
              {cardData?.notify_msg}
            </Text>

            <Text
              style={{
                fontSize: 12,
                color: "#888",
                marginTop: 4,
              }}
            >
              {timeSince(cardData?.date)}
            </Text>
          </View>
        </View>

        {cardData?.notify_status === "false" && (
          <View
            style={{
              height: 10,
              width: 10,
              borderRadius: 5,
              backgroundColor: "#2979FF",
              marginLeft: 8,
              marginTop: 4,
            }}
          />
        )}
      </TouchableOpacity>
      {/* <TouchableOpacity
        onPress={() => handleNotifyStatus(cardData)}
        style={{
          // ...Styles?.container,
          // borderRadius: 5,
          // marginTop: 10,
          ...Styles?.flexRow,
          // alignItems: "flex-start",
          // marginHorizontal: 10,
          backgroundColor:
            cardData?.notify_status == "true"
              ? Colors?.white
              : Colors?.lightBlue,
          padding: 20,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <View
            style={{
              padding: 6,
              backgroundColor: Colors?.white,
              borderRadius: 100,
            }}
          >
            <FontAwesome
              name={cardData?.notify_status == "true" ? "bell-o" : "bell"}
              size={20}
              color={Colors?.blue}
              // style={{ alignSelf: "flex-start" }}
            />
          </View>
          <TextComponent
            text={cardData?.notify_msg}
            size={Sizes?.s}
            fontWeight="400"
            numberOfLines={expendView ? 0 : 2}
            style={{
              paddingLeft: 10,
              width: 280,
              lineHeight: 20,
              letterSpacing: 0.1,
            }}
          />
        </View>

        <TouchableOpacity
          // onPress={() => setExpendView(!expendView)}
          style={{ alignItems: "flex-end" }}
        >
          {cardData?.notify_status == "false" && (
            <TextComponent
              text={"●"}
              size={Sizes?.xxs}
              style={{ marginBottom: 10 }}
            />
          )}
          <TextComponent
            text={timeSince(cardData?.date)}
            size={Sizes?.xs}
            fontWeight="400"
          />
        </TouchableOpacity>
      </TouchableOpacity> */}
    </>
  );
};
const styling = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
  },
});
