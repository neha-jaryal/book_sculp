import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../Utility";
import { authScreens } from "../../Layouts/AuthLayouts";
import { otherScreens } from "../../Layouts/OtherLayouts";
import { Stacks } from ".";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();
const GuestStacks = () => {
  const auth = useSelector((state) => state?.authReducer);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routeName.BOTTOM_TAB}
        component={otherScreens?.BottomTab}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.GUEST_DASHBOARD}
        component={otherScreens?.GuestDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.CHECKOUT}
        component={otherScreens?.Checkout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.ORDER_CHECKOUT}
        component={otherScreens?.OrderCheckout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SIGNIN}
        component={authScreens?.Signin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SIGNUP}
        component={authScreens?.Signup}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MODEL_PROFILE}
        component={otherScreens?.ModelProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName?.GALLERY_IMAGES}
        component={otherScreens?.GalleryImages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VIEW_JOBS}
        component={otherScreens?.ViewJobs}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={routeName.CONNECTION_STATUS}
        component={otherScreens?.ConnectionStatus}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FEED_USER_PROFILE}
        component={otherScreens?.FeedUserProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default GuestStacks;
