import React, { useEffect } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { Lotties, TextComponent } from "../../Components";
import { Colors, JSONS, Sizes } from "../../Constants";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";
import { routeName } from "../../Utility";
import { Styles } from "../../Styles";
export const Success = ({ navigation }) => {
  const auth = useSelector((state) => state?.authReducer);
  const dispatch = useDispatch();

  // useEffect(() => {
  //   setTimeout(() => {
  // if (auth?.navigator == routeName?.AUTHSTACKS) {
  //   // navigation.navigate(routeName?.HOME_STACKS);
  //   dispatch(navigatorStatus(routeName?.DRAWER, "", false));
  // } else {
  //   navigation.navigate(routeName?.PACKAGES);

  //   // navigation.navigate(routeName?.USER_DASHBOARD);
  //   // dispatch(navigatorStatus(routeName?.DRAWER, "", false));
  // }
  //   }, 5000);
  // }, []);

  const handleOK = async () => {
    if (auth?.navigator == routeName?.AUTHSTACKS) {
      dispatch(navigatorStatus(routeName?.DRAWER, "", false));
    } else {
      navigation.navigate(routeName?.PACKAGES);
    }
  };
  return (
    <>
      <Lotties
        source={JSONS?.successJSON}
        style={{
          width: "100%",
          height: 400,
          backgroundColor: Colors?.white,
          paddingTop: 100,
          alignItems: "center",
          paddingBottom: 0,
          alignSelf: "center",
          justifyContent: "center",
        }}
      />
      <View
        style={{
          backgroundColor: Colors?.white,
          width: "100%",
          height: 400,
          alignItems: "center",
          alignSelf: "center",
          justifyContent: "center",
        }}
      >
        <TextComponent text={"Congratulations !"} size={Sizes?.xxl} />
        <TextComponent
          text={"Your Package Purchased Successfully! "}
          color={Colors?.darkgrey}
          style={{ paddingVertical: 10 }}
        />
        <TouchableOpacity
          onPress={() => handleOK()}
          style={{
            ...Styles?.smallButton,
            backgroundColor: Colors?.themeColor,
            width: "30%",
            marginVertical: 10,
          }}
        >
          <TextComponent
            text="Done"
            color={Colors?.white}
            size={Sizes?.s}
            style={{ paddingVertical: 2 }}
          />
        </TouchableOpacity>
      </View>
    </>
  );
};
