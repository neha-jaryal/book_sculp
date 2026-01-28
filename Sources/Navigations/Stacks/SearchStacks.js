import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../Utility";
import { otherScreens } from "../../Layouts/OtherLayouts";

const Stack = createStackNavigator();
const SearchStacks = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routeName.SEARCH}
        component={otherScreens?.Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FILTER}
        component={otherScreens?.Filter}
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
        name={routeName.PHOTOGRAPHER_PROFILE}
        component={otherScreens?.PhotographerProfile}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default SearchStacks;
