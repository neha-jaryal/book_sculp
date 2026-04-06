import React, { useEffect, useState } from "react";
import { Alert, ImageBackground, Platform } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Lotties } from "../../Components";
// import { useNetInfo } from "@react-native-community/netinfo";

import {
  Colors,
  dimensionheight,
  dimensionWidth,
  Images,
  JSONS,
} from "../../Constants";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import { routeName } from "../../Utility/routeName";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import {
  handleSubscriptionAlert,
  isNetworkAvailable,
  showToast,
} from "../../Utility";
import {
  getPaymentStatus,
  getUserDetail,
} from "../../Redux/Services/AuthServices";

export const Splash = ({ navigation }) => {
  const dispatch = useDispatch();
  // const NetInfo = useNetInfo();
  const [connected, SetConnected] = useState(false);
  const auth = useSelector((state) => state?.authReducer);
  useEffect(() => {
    // getUserID();
    networkStatus();
    handlePaymentStatus();
    // CheckConnectivity();
  }, []);

  const handlePaymentStatus = async () => {
    let res = await dispatch(getPaymentStatus());
    if (res?.status == 200) {
      storeData(
        storageKey?.PAYMENT_STATUS,
        JSON?.stringify(res?.results?.p_status),
      );
    }
  };

  const getUserID = async () => {
    let userId = await getData(storageKey?.USER_ID);
    setTimeout(async () => {
      if (userId) {
        var body = {
          user_id: JSON?.parse(userId),
        };
        let res = await dispatch(getUserDetail(body));
        if (res?.status == 200) {
          let userRole = await getData(storageKey?.USER_ROLE);
          let data = res?.results?.user_data;
          console.log("datadatadata-----", data);
          if (data?.delete_account_status == 0) {
            storeData(
              storageKey?.APPROVAL_STATUS,
              JSON?.stringify(data?.profile_approval),
            );
            storeData(
              storageKey?.USER_STATUS,
              JSON?.stringify(data?.completed_step),
            );
            storeData(storageKey?.SUBSCRIPTION_HIDE, "false");
            let post_meta_details = res?.results?.post_meta_details;

            if (userRole == 11 || userRole == 12 || userRole == 15) {
              if (
                data?.completed_step == 0 ||
                data?.completed_step == 1 ||
                data?.completed_step == 2
              ) {
                dispatch(navigatorStatus(routeName?.AUTHSTACKS, "", false));
              } else {
                dispatch(navigatorStatus(routeName?.DRAWER, "", false));
                // handleSubscriptionAlert(post_meta_details, navigation);
              }
            } else if (userRole == 13) {
              if (
                data?.completed_step == 0 ||
                data?.completed_step == 1 ||
                data?.completed_step == 2
              ) {
                dispatch(navigatorStatus(routeName?.AUTHSTACKS, "", false));
              } else {
                dispatch(navigatorStatus(routeName?.DRAWER, "", false));
                // handleSubscriptionAlert(post_meta_details, navigation);
              }
            } else {
              dispatch(navigatorStatus(routeName?.DRAWER, "", false));
              // handleSubscriptionAlert(post_meta_details, navigation);
            }
          } else {
            dispatch(navigatorStatus(routeName?.AUTHSTACKS, "", false));
          }
        } else {
          dispatch(navigatorStatus(routeName?.AUTHSTACKS, "", false));
        }
      } else {
        dispatch(navigatorStatus(routeName?.AUTHSTACKS, false));
      }
    }, 4000);
  };

  const networkStatus = async () => {
    const isConnected = await isNetworkAvailable();
    SetConnected(isConnected);
    if (isConnected) {
      getUserID();
    } else {
      setTimeout(() => {
        navigation?.navigate(routeName?.CONNECTION_STATUS);
      }, 6000);
    }
  };

  // const CheckConnectivity = () => {
  //   // For Android devices
  //   if (Platform.OS === "android") {
  //     NetInfo.isConnected.fetch().then((isConnected) => {
  //       if (isConnected) {
  //         Alert.alert("You are online!");
  //       } else {
  //         Alert.alert("You are offline!");
  //       }
  //     });
  //   } else {
  //     // For iOS devices
  //     NetInfo.isConnected.addEventListener(
  //       "connectionChange",
  //       handleFirstConnectivityChange
  //     );
  //   }
  // };

  // const handleFirstConnectivityChange = (isConnected) => {
  //   NetInfo.isConnected.removeEventListener(
  //     "connectionChange",
  //     handleFirstConnectivityChange
  //   );
  //   if (isConnected === false) {
  //     Alert.alert("You are offline!");
  //   } else {
  //     Alert.alert("You are online!");
  //   }
  // };
  return (
    // <ImageBackground
    //   source={Images?.splash}
    //   imageStyle={{
    //     height: dimensionheight('100%'),
    //     width: dimensionWidth('100%'),
    //   }}
    // />
    <Lotties
      source={JSONS?.splashJSON}
      style={{
        width: "100%",
        backgroundColor: Colors?.white,
        height: dimensionheight("100%"),
      }}
    />
  );
};
