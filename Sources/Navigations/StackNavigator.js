import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../Utility/routeName";
import { authScreens } from "../Layouts/AuthLayouts";
import { otherScreens } from "../Layouts/OtherLayouts";
import DrawerNavigator from "./DrawerNavigator";

const Stack = createStackNavigator();
const MainStackNavigator = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routeName.SPLASH}
        component={authScreens?.Splash}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.DRAWER}
        component={DrawerNavigator}
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
        name={routeName.PROFILE_SETUP}
        component={authScreens?.ProfileSetup}
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
        name={routeName.HOME}
        component={otherScreens?.Home}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.JOBS}
        component={otherScreens?.Jobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SEARCH}
        component={otherScreens?.Search}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PROFILE}
        component={otherScreens?.Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.ADD_POST}
        component={otherScreens?.AddPost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.GUEST_DASHBOARD}
        component={otherScreens?.GuestDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VIEW_JOBS}
        component={otherScreens?.ViewJobs}
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
        name={routeName.IDENTITY_VERIFICATION}
        component={otherScreens?.IdentityVerification}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.USER_DASHBOARD}
        component={otherScreens?.UserDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PACKAGES}
        component={otherScreens?.Packages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.NOTIFICATIONS}
        component={otherScreens?.Notifications}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_PROFILE}
        component={authScreens?.EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.POST_LISTING}
        component={otherScreens?.PostListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SUBMIT_PROPOSAL}
        component={otherScreens?.SubmitProposal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.LATEST_PROPOSAL}
        component={otherScreens?.LatestProposal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SAVED_JOB_DETAILS}
        component={otherScreens?.SavedJobDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FOLLOW_DETAILS}
        component={otherScreens?.FollowDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_ACCOUNT}
        component={otherScreens?.ManageAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PRIVACY_POLICY}
        component={otherScreens?.PrivacyPolicy}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.TERMS_OF_SERVICE}
        component={otherScreens?.TermsOfService}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.CONTACT_US}
        component={otherScreens?.ContactUs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.HELP_SUPPORT}
        component={otherScreens?.HelpSupport}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_JOBS}
        component={otherScreens?.ManageJobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_PROPOSAL}
        component={otherScreens?.ManageProposal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.CHECKOUT}
        component={otherScreens?.Checkout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.POST_JOB}
        component={otherScreens?.PostJob}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PROJECT_DETAILS}
        component={otherScreens?.ProjectDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.INVOICE}
        component={otherScreens?.Invoice}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.ORDER_CHECKOUT}
        component={otherScreens?.OrderCheckout}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.FEEDBACK}
        component={otherScreens?.Feedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.BOTTOM_TAB}
        component={otherScreens?.BottomTab}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default MainStackNavigator;
