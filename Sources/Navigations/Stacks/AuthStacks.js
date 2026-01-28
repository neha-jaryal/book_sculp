import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../Utility";
import { authScreens } from "../../Layouts/AuthLayouts";
import { otherScreens } from "../../Layouts/OtherLayouts";
import DrawerNavigator from "../DrawerNavigator";
import { Stacks } from ".";
import { useSelector } from "react-redux";

const Stack = createStackNavigator();
const AuthStacks = () => {
  const auth = useSelector((state) => state?.authReducer);

  return (
    <Stack.Navigator>
      {auth?.navigator == routeName?.AUTHSTACKS && auth?.splash == true ? (
        <>
          <Stack.Screen
            name={routeName.SPLASH}
            component={authScreens?.Splash}
            options={{ headerShown: false }}
          />
        </>
      ) : null}
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
        name={routeName.REGISTERATION}
        component={authScreens?.Registeration}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PROFILE_GALLERY}
        component={authScreens?.ProfileGallery}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={routeName.FORGOT_PASSWORD}
        component={authScreens?.ForgotPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.RESET_PASSWORD}
        component={authScreens?.ResetPassword}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VERIFICATION}
        component={authScreens?.Verification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SUCCESS}
        component={authScreens?.Success}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.BOTTOM_TAB}
        component={otherScreens?.BottomTab}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name={routeName?.PROFILE_STACKS}
        component={Stacks?.ProfileStacks}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.GUEST_STACKS}
        component={Stacks?.GuestStacks}
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
        name={routeName.HOME_STACKS}
        component={Stacks?.HomeStacks}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default AuthStacks;
