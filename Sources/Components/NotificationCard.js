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
          ...Styles?.container,
          borderRadius: 5,
          marginTop: 10,
          ...Styles?.flexRow,
          marginHorizontal: 0,
          backgroundColor:
            cardData?.notify_status == "true"
              ? Colors?.white
              : Colors?.lightPink,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {cardData?.notify_status == "true" ? (
            <Foundation
              name="mail"
              size={28}
              color={Colors?.blue}
              // style={{ alignSelf: "flex-start" }}
            />
          ) : (
            <MaterialIcons
              name="mark-email-unread"
              size={28}
              color={Colors?.pink}
              // style={{ alignSelf: "flex-start" }}
            />
          )}

          <TextComponent
            text={cardData?.notify_msg}
            size={Sizes?.s}
            fontWeight="400"
            // numberOfLines={expendView ? 0 : 2}
            style={{
              paddingLeft: 10,
              width: 245,
              lineHeight: 20,
              letterSpacing: 0.1,
            }}
          />
          <TouchableOpacity
            // onPress={() => setExpendView(!expendView)}
            style={{ alignItems: "flex-end" }}
          >
            <TextComponent
              text={timeSince(cardData?.date)}
              size={Sizes?.xs}
              fontWeight="400"
            />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
