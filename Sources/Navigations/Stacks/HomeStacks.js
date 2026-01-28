import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../Utility";
import { authScreens } from "../../Layouts/AuthLayouts";
import { otherScreens } from "../../Layouts/OtherLayouts";
import { getData, storageKey } from "../../Utility/Storage";

const Stack = createStackNavigator();
const HomeStacks = () => {
  // const [userID, setUserID] = useState("");

  // useEffect(() => {
  //   getUserID();
  // }, []);

  // const getUserID = async () => {
  //   let userId = await getData(storageKey?.USER_ID);
  //   setUserID(userId);
  // };
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
      <Stack.Screen
        name={routeName.CONNECTION_STATUS}
        component={otherScreens?.ConnectionStatus}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PACKAGES}
        component={otherScreens?.Packages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName?.MANAGE_AVAILABLITY}
        component={otherScreens?.ManageAvailability}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PROFILE_STACKS}
        component={otherScreens?.Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VIEW_POST_DETAILS}
        component={otherScreens?.ViewPostDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PAYOUT_HISTORY}
        component={otherScreens?.PayoutHistory}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_POST}
        component={otherScreens?.EditPost}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default HomeStacks;
