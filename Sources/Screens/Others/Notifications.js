import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View, TouchableOpacity } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  TextComponent,
  Header,
  NotificationCard,
  NoDataFound,
} from "../../Components";
import { Sizes, Colors } from "../../Constants";
import {
  getNotificationList,
  updateNotifyStatus,
} from "../../Redux/Services/OtherServices";
import { Styles } from "../../Styles";
import { getData, storageKey } from "../../Utility/Storage";

export const Notifications = ({ navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const [cardList, setCardList] = useState("");
  useEffect(() => {
    getAllNotifications();
  }, []);

  const getAllNotifications = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userId,
    };
    let res = await dispatch(getNotificationList(body));
    if (res?.status == 200) {
      setCardList(res?.results);
    }
  };

  return (
    <>
      <Header text="Notifications" navigation={navigation} />
      {/* <View
        style={{
          ...Styles?.container,
          ...Styles?.row,
          ...Styles?.headingView,
          borderColor: Colors?.pink,
          width: "95%",
          marginHorizontal: 10,
        }}
      >
        <TextComponent text="All Notifications" size={Sizes?.l} />
      </View> */}
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        {/* other?.isLoading ? null : */}
        {cardList?.length != 0 ? (
          <View
            style={
              {
                // ...Styles?.container,
                // width: "95%",
                // marginHorizontal: 10,
              }
            }
          >
            {cardList?.map((item) => {
              return (
                <>
                  <NotificationCard
                    cardData={item}
                    getAllNotifications={getAllNotifications}
                    navigation={navigation}
                  />
                  {/* <View
                    style={{
                      ...Styles?.separator,
                      marginVertical: 0,
                      paddingVertical: 0,
                    }}
                  /> */}
                </>
              );
            })}
          </View>
        ) : (
          <NoDataFound />
        )}

        <View style={{ height: 30 }} />
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
