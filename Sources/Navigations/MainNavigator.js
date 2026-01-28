import "react-native-gesture-handler";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AuthStacks from "./Stacks/AuthStacks";
import DrawerNavigator from "./DrawerNavigator";
import { routeName } from "../Utility";
import GuestStacks from "./Stacks/GuestStacks";
import { getData, storageKey } from "../Utility/Storage";
import { navigatorStatus } from "../Redux/Actions/AuthActions";

const MainNavigator = () => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);

  useEffect(() => {
    // getUserID();
    dispatch(navigatorStatus(routeName?.AUTHSTACKS, true));
    // alert(auth?.navigator);
  }, []);

  // const getUserID = async () => {
  //   let userId = await getData(storageKey?.USER_ID);
  //   if (userId) {
  //     dispatch(navigatorStatus(routeName?.DRAWER));
  //   } else {
  //     dispatch(navigatorStatus(routeName?.AUTHSTACKS));
  //   }
  // };

  return (
    <>
      {auth?.navigator == routeName?.AUTHSTACKS ? (
        <AuthStacks />
      ) : auth?.navigator == routeName?.GUEST_STACKS ? (
        <GuestStacks />
      ) : (
        <DrawerNavigator />
      )}
    </>
  );
};
export default MainNavigator;
