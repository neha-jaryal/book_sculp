import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { routeName } from "../Utility/routeName";
import { Colors, dimensionheight, Sizes } from "../Constants";
import { otherScreens } from "../Layouts/OtherLayouts";
import { TextComponent } from "../Components";
import { Stacks } from "./Stacks";

const Tab = createBottomTabNavigator();

const BottomTab = ({ route }) => {
  // const { guest } = route?.params;
  return (
    <Tab.Navigator
      initialRouteName={routeName?.HOME}
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
          route?.params?.guest ? routeName.GUEST_DASHBOARD : routeName?.HOME
        }
        component={
          route?.params?.guest
            ? otherScreens?.GuestDashboard
            : Stacks?.HomeStacks
          // otherScreens?.Home
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
        name={routeName?.SEARCH}
        component={Stacks?.SearchStacks}
        // component={otherScreens?.Search}
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
      <Tab.Screen
        name={routeName?.ADD_POST}
        component={otherScreens?.AddPost}
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
                  // borderWidth: 0.5,
                  // borderColor: Colors?.themeColor,
                }}
              />
            </>
          ),
        })}
      />
      <Tab.Screen
        name={routeName?.JOBS}
        component={Stacks?.JobStacks}
        // component={otherScreens?.Jobs}
        options={({ route }) => ({
          tabBarIcon: ({ focused }) => (
            <>
              <MaterialIcons
                name={focused ? "work" : "work-outline"}
                color={Colors?.themeColor}
                size={20}
              />

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
        name={routeName?.PROFILE}
        component={Stacks?.ProfileStacks}
        // component={otherScreens?.Profile}
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
