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
import { View } from "react-native";

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
    }, [userRole]),
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
          JSON?.stringify(res?.results?.user_data?.profile_approval),
        );
        storeData(
          storageKey?.USER_STATUS,
          JSON?.stringify(res?.results?.user_data?.completed_step),
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
      tabBarBackgroundColor={Colors?.white}
      screenOptions={{
        headerShown: false,
        tabBarAllowFontScaling: true,
        tabBarStyle: {
          ...styles.bottomTabStyle,
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
              <View
                style={{
                  height: 35,
                  width: 35,
                  alignContent: "center",
                  alignItems: "center",
                  // backgroundColor: Colors?.white,
                  // // padding: 10,
                  // borderRadius: 50,
                  // justifyContent: "center",
                  // alignItems: "center",
                }}
              >
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  color={Colors?.black}
                  size={20}
                />
                <TextComponent
                  text="Home"
                  color={Colors?.black}
                  fontWeight={focused ? "600" : "500"}
                  size={9}
                  style={{ marginTop: 2 }}
                />
              </View>
            </>
          ),
        })}
      />
      <Tab.Screen
        name={routeName?.SEARCH_STACKS}
        component={Stacks?.SearchStacks}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 35,
                width: 40,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialCommunityIcons
                name={focused ? "account-search" : "account-search-outline"}
                color={Colors?.black}
                size={20}
              />

              <TextComponent
                text="Explore"
                color={Colors?.black}
                fontWeight={focused ? "600" : "500"}
                size={9}
                style={{ marginTop: 2 }}
              />
            </View>
          ),
        })}
      />
      {auth?.navigator == routeName?.GUEST_STACKS ? (
        <Tab.Screen
          name={routeName?.HOME}
          component={otherScreens?.Home}
          options={({ route }) => ({
            tabBarIcon: ({ focused }) => (
              <View
                style={{
                  height: 35,
                  width: 35,
                  alignContent: "center",
                  alignItems: "center",
                }}
              >
                <MaterialCommunityIcons
                  name={focused ? "post" : "post-outline"}
                  color={Colors?.black}
                  size={20}
                />
                <TextComponent
                  text="Feed"
                  color={Colors?.black}
                  fontWeight={focused ? "600" : "500"}
                  size={9}
                  style={{ marginTop: 2 }}
                />
              </View>
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
                  name={focused ? "pluscircle" : "pluscircleo"}
                  color={Colors?.black}
                  size={30}
                  style={{
                    width: 35,
                    height: 35,
                    // position: "absolute",
                    // bottom: 25,
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
            <View
              style={{
                height: 35,
                width: 35,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <MaterialIcons
                name={focused ? "work" : "work-outline"}
                color={Colors?.black}
                fontWeight={focused ? "600" : "500"}
                size={20}
              />

              {/* <MaterialCommunityIcons
                name={
                  focused ? "briefcase-variant" : "briefcase-variant-outline"
                }
                color={Colors?.themeColor}
                size={20}
              /> */}

              <TextComponent
                text="Jobs"
                color={Colors?.black}
                fontWeight={focused ? "600" : "500"}
                size={9}
                style={{ marginTop: 2 }}
              />
            </View>
          ),
        })}
      />
      <Tab.Screen
        name={routeName?.PROFILE_STACKS}
        component={Stacks?.ProfileStacks}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                height: 35,
                width: 45,
                alignContent: "center",
                alignItems: "center",
              }}
            >
              <FontAwesome
                name={focused ? "user" : "user-o"}
                color={Colors?.black}
                size={20}
              />
              <TextComponent
                text="Account"
                color={Colors?.black}
                fontWeight={focused ? "600" : "500"}
                size={9}
                style={{ marginTop: 2 }}
              />
            </View>
          ),
        })}
      />
    </Tab.Navigator>
  );
};

export default BottomTab;

const styles = {
  bottomTabStyle: {
    position: "absolute",
    marginHorizontal: 15,
    height: dimensionheight("7%"),
    backgroundColor: Colors?.gredient,
    borderTopWidth: 0,
    elevation: 10,
    opacity: 0.8,
    shadowOpacity: 0,
    bottom: 25,
    borderRadius: 60,
    shadowColor: Colors?.black,
    paddingTop: 12,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    // shadowRadius: 3.5,
  },
};
