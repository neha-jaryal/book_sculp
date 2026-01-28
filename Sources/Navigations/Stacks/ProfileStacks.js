import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import { routeName } from "../../Utility";
import { authScreens } from "../../Layouts/AuthLayouts";
import { otherScreens } from "../../Layouts/OtherLayouts";

const Stack = createStackNavigator();
const ProfileStacks = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name={routeName.PROFILE}
        component={otherScreens?.Profile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.USER_DASHBOARD}
        component={otherScreens?.UserDashboard}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_PROFILE}
        component={authScreens?.EditProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PACKAGES}
        component={otherScreens?.Packages}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_ACCOUNT}
        component={otherScreens?.ManageAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.POST_LISTING}
        component={otherScreens?.PostListing}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_POST_JOB}
        component={otherScreens?.EditPostJob}
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
        name={routeName.MANAGE_JOBS}
        component={otherScreens?.ManageJobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.TERMS_OF_SERVICE}
        component={otherScreens?.TermsOfService}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PRIVACY_POLICY}
        component={otherScreens?.PrivacyPolicy}
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
        name={routeName.SUBMIT_PROPOSAL}
        component={otherScreens?.SubmitProposal}
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
        name={routeName.ORDER_CHECKOUT}
        component={otherScreens?.OrderCheckout}
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
        name={routeName.FEEDBACK}
        component={otherScreens?.Feedback}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SETTINGS}
        component={otherScreens?.Settings}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SIGNIN}
        component={authScreens?.Signin}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PAYOUT_SETTING}
        component={otherScreens?.PayoutSetting}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.CLIENT_PROFILE}
        component={otherScreens?.ClientProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_AVAILABLITY}
        component={otherScreens?.ManageAvailability}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PACKAGE_PAYMENT}
        component={otherScreens?.PackagePayment}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.SUCCESS}
        component={authScreens?.Success}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VIEW_JOBS}
        component={otherScreens?.ViewJobs}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.ADD_STRIPE_ACCOUNT}
        component={otherScreens?.AddStripAccount}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_CASTING_CALLS}
        component={otherScreens?.EditCastingCalls}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MANAGE_PROJECTS}
        component={otherScreens?.ManageProjects}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_SUBMIT_PROPOSAL}
        component={otherScreens?.EditSubmitProposal}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.MODEL_USER_PROFILE}
        component={otherScreens?.ModelUserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_PHOTOGRAPHER}
        component={authScreens?.EditPhotographer}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PHOTOGRAPHER_PROFILE}
        component={otherScreens?.PhotographerProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.PHOTOGRAPHER_USER_PROFILE}
        component={otherScreens?.PhotographerUserProfile}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.VIEW_POST_DETAILS}
        component={otherScreens?.ViewPostDetails}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.EDIT_POST}
        component={otherScreens?.EditPost}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name={routeName.CHAT}
        component={otherScreens?.Chat}
        options={{ headerShown: false }}
      />
    </Stack.Navigator>
  );
};

export default ProfileStacks;
