import React, { useEffect, useState } from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../../Utility";
import { otherScreens } from "../../../Layouts/OtherLayouts";

const Stack = createStackNavigator();
const ClientsStacks = () => {
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
    </Stack.Navigator>
  );
};

export default ClientsStacks;
