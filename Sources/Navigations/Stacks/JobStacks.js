import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../Utility";
import { authScreens } from "../../Layouts/AuthLayouts";
import { otherScreens } from "../../Layouts/OtherLayouts";

const Stack = createStackNavigator();
const JobStacks = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routeName.JOBS}
        component={otherScreens?.Jobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VIEW_JOBS}
        component={otherScreens?.ViewJobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SUBMIT_PROPOSAL}
        component={otherScreens?.SubmitProposal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FEEDBACK}
        component={otherScreens?.Feedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_POST_JOB}
        component={otherScreens?.EditPostJob}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_PROPOSAL}
        component={otherScreens?.ManageProposal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FILTER}
        component={otherScreens?.Filter}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default JobStacks;
