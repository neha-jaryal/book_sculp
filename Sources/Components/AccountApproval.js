import React, { useCallback } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import { TextComponent } from "./TextComponent";
import { Colors, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { useState } from "react";
import { routeName } from "../Utility";
import { getData, storageKey } from "../Utility/Storage";
import { getUserDetail } from "../Redux/Services/AuthServices";
import { useFocusEffect } from "@react-navigation/native";
export const AccountApproval = ({ props, navigation }) => {
  const dispatch = useDispatch();
  const [userRole, setUserRole] = useState("");
  const [accountApproval, setAccountApproval] = useState(true);
  const [userData, setUserData] = useState("");

  useFocusEffect(
    useCallback(() => {
      getUserData();
    }, [props])
  );
  const [showApproval, setShowApproval] = useState(false);

  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    const approval = await getData(storageKey?.APPROVAL_STATUS);
    setAccountApproval(JSON?.parse(approval));
    const role = await getData(storageKey?.USER_ROLE);
    setUserRole(role);
    if (userID) {
      let body = { user_id: JSON.parse(userID) };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res?.results);
        const role = res.results?.user_data?.user_role;
        const isFreelancer = [11, 13, 15].includes(role);
        const noApproval = !accountApproval;
        const noSubscription =
          !res.results?.user_data?.subscription_pro_id && isFreelancer;

        if (noApproval || noSubscription) {
          setShowApproval(true);
        }
      }
    }
  };

  if (showApproval)
    return (
      <>
        <View
          style={{
            ...Styles?.container,
            backgroundColor: Colors?.yellow,
          }}
        >
          <TextComponent
            text={
              accountApproval == false
                ? "Application Verification in progress"
                : !userData?.user_data?.subscription_pro_id
                ? "🎉 Congratulations!"
                : null
            }
            style={{ paddingVertical: 5 }}
            size={Sizes?.s}
          />

          <TextComponent
            text={
              accountApproval == false
                ? `Thank you for submitting an application to Book Sculp. Our team will review your application within two weeks. If we think you are a good fit then we'll be in touch.`
                : !userData?.user_data?.subscription_pro_id
                ? `Your application has been approved on Book Sculp. To start getting job offers, casting calls, and client bookings, please subscribe to one of our packages. Your account will not be viewable until a package has been selected. If you have any questions in the meantime, don’t hesitate to reach out to us at info@booksculp.com We're excited to connect with you!`
                : null
            }
            size={Sizes?.xs}
            color={Colors?.gray}
            fontWeight="400"
          />
          <TouchableOpacity
            onPress={() =>
              accountApproval == false
                ? userRole == 11 || userRole == 12 || userRole == 15
                  ? navigation?.navigate(routeName?.EDIT_PROFILE, {
                      routeName: routeName?.HOME,
                    })
                  : navigation?.navigate(routeName?.EDIT_PHOTOGRAPHER)
                : navigation?.navigate(routeName?.PACKAGES)
            }
            style={{
              ...Styles?.smallButton,
              width: "40%",
              backgroundColor: Colors?.themeColor,
              top: 6,
            }}
          >
            <TextComponent
              text={
                accountApproval == false
                  ? "Edit Application"
                  : !userData?.user_data?.subscription_pro_id
                  ? "Buy Package"
                  : null
              }
              color={Colors?.white}
              size={Sizes?.xs}
              style={{ textAlign: "center" }}
            />
          </TouchableOpacity>
        </View>
      </>
    );
};
