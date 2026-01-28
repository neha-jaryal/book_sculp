import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { routeName } from "../Utility/routeName";
import { Colors, dimensionheight, Sizes } from "../Constants";
import { otherScreens } from "../Layouts/OtherLayouts";
import { TextComponent } from "../Components";
import { Stacks } from "./Stacks";
import { useDispatch, useSelector } from "react-redux";
import { getData, storageKey, storeData } from "../Utility/Storage";
import { AdminStacks } from "./Stacks/Admin";
import { useFocusEffect } from "@react-navigation/native";
import { getUserDetail } from "../Redux/Services/AuthServices";
import { KeyboardAvoidingView, Platform } from "react-native";

const Tab = createBottomTabNavigator();

const BottomTab = ({ route }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    getUserRole();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getUserData();
    }, [userRole])
  );
  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let accountApproval = await getData(storageKey?.APPROVAL_STATUS);

    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res?.status == 200) {
        storeData(
          storageKey?.APPROVAL_STATUS,
          JSON?.stringify(res?.results?.user_data?.profile_approval)
        );
        storeData(
          storageKey?.USER_STATUS,
          JSON?.stringify(res?.results?.user_data?.completed_step)
        );
      }
    }
  };

  const getUserRole = async () => {
    let role = await getData(storageKey?.USER_ROLE);
    setUserRole(role);
  };

  return (
    <Tab.Navigator
      initialRouteName={
        auth?.navigator == routeName?.GUEST_STACKS
          ? routeName?.HOME
          : routeName?.HOME_STACKS
      }
      barStyle={{
        activeTintColor: Colors?.themeColor,
        inactiveTintColor: Colors?.darkgrey,
        labelStyle: {
          color: Colors?.black,
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarAllowFontScaling: false,
        tabBarStyle: {
          paddingVertical: dimensionheight("0.5%"),
        },
        tabBarActiveTintColor: Colors?.themeColor,
        tabBarShowLabel: false,
      }}
    >
      <Tab.Screen
        name={
          auth?.navigator == routeName?.GUEST_STACKS
            ? routeName.GUEST_DASHBOARD
            : routeName?.HOME_STACKS
        }
        component={
          auth?.navigator == routeName?.GUEST_STACKS
            ? otherScreens?.GuestDashboard
            : Stacks?.HomeStacks
        }
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <>
              <Ionicons
                name={focused ? "home" : "home-outline"}
                color={Colors?.themeColor}
                size={20}
              />
              <TextComponent
                text="Home"
                color={focused ? Colors.themeColor : "#000"}
                size={Sizes.xs}
              />
            </>
          ),
        })}
      />
      <Tab.Screen
        name={routeName?.SEARCH_STACKS}
        component={Stacks?.SearchStacks}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <>
              <Ionicons
                name={focused ? "search" : "search-outline"}
                color={Colors?.themeColor}
                size={20}
              />
              <TextComponent
                text="Search"
                color={focused ? Colors.themeColor : "#000"}
                size={Sizes.xs}
              />
            </>
          ),
        })}
      />
      {auth?.navigator == routeName?.GUEST_STACKS ? (
        <Tab.Screen
          name={routeName?.HOME}
          component={otherScreens?.Home}
          options={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <>
                <MaterialCommunityIcons
                  name={focused ? "post" : "post-outline"}
                  color={Colors?.themeColor}
                  size={20}
                />
                <TextComponent
                  text="Feed"
                  color={focused ? Colors.themeColor : "#000"}
                  size={Sizes.xs}
                />
              </>
            ),
          })}
        />
      ) : (
        <Tab.Screen
          name={
            userRole == 11 || userRole == 15
              ? routeName?.ADD_POST
              : userRole == 12
              ? routeName?.POST_JOB
              : routeName?.ADD_POST
          }
          component={
            userRole == 11 || userRole == 15
              ? otherScreens?.AddPost
              : userRole == 12
              ? otherScreens?.PostJob
              : otherScreens?.AddPost
          }
          options={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <>
                <AntDesign
                  name={"pluscircle"}
                  color={Colors?.themeColor}
                  size={50}
                  style={{
                    position: "absolute",
                    bottom: 20,
                    // backgroundColor: Colors?.white,
                    // borderRadius: 100,
                  }}
                />
              </>
            ),
          })}
        />
      )}
      <Tab.Screen
        name={routeName?.JOB_STACKS}
        component={Stacks?.JobStacks}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <>
              {focused ? (
                <Ionicons
                  name={"briefcase"}
                  color={Colors?.themeColor}
                  size={20}
                />
              ) : (
                <MaterialIcons
                  name={"work-outline"}
                  color={Colors?.themeColor}
                  size={20}
                />
              )}

              {/* <MaterialCommunityIcons
                name={
                  focused ? "briefcase-variant" : "briefcase-variant-outline"
                }
                color={Colors?.themeColor}
                size={20}
              /> */}

              <TextComponent
                text="Jobs"
                color={focused ? Colors.themeColor : "#000"}
                size={Sizes.xs}
              />
            </>
          ),
        })}
      />
      <Tab.Screen
        name={routeName?.PROFILE_STACKS}
        component={Stacks?.ProfileStacks}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <>
              <FontAwesome
                name={focused ? "user" : "user-o"}
                color={Colors?.themeColor}
                size={20}
              />
              <TextComponent
                text="Profile"
                color={focused ? Colors.themeColor : "#000"}
                size={Sizes.xs}
              />
            </>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;
