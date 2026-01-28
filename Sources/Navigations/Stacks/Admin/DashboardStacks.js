import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../../Utility";
import { otherScreens } from "../../../Layouts/OtherLayouts";

const Stack = createStackNavigator();
const DashboardStacks = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routeName.HOME}
        component={otherScreens?.Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.NOTIFICATIONS}
        component={otherScreens?.Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FEED_USER_PROFILE}
        component={otherScreens?.FeedUserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.POST_LISTING}
        component={otherScreens?.PostListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_PORTFOLIOS}
        component={otherScreens?.ManagePortfolios}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_SOCIAL_POSTS}
        component={otherScreens?.ManageSocialPosts}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default DashboardStacks;
