import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { routeName } from "../Utility";
import { otherScreens } from "../Layouts/OtherLayouts";
import { CustomDrawerContent } from "../Components";
import { Stacks } from "./Stacks";
import { authScreens } from "../Layouts/AuthLayouts";
import { createStackNavigator } from "@react-navigation/stack";
import { useSelector } from "react-redux";
import { AdminStacks } from "./Stacks/Admin";
import { adminScreens } from "../Layouts/AdminLayouts";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

const DrawerNavigator = () => {
  const auth = useSelector((state) => state?.authReducer);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerActiveTintColor: "#000",
      }}
    >
      {auth?.navigator == routeName?.DRAWER && auth?.success == true ? (
        <Drawer.Screen
          name={routeName.PROFILE_SETUP}
          component={authScreens?.ProfileSetup}
          options={{ headerShown: false }}
        />
      ) : null}
      <>
        <Drawer.Screen
          name={routeName?.BOTTOM_TAB}
          component={otherScreens?.BottomTab}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.USER_DASHBOARD}
          component={otherScreens?.UserDashboard}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.AUTHSTACKS}
          component={Stacks?.AuthStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.HOME_STACKS}
          component={Stacks?.HomeStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.HOME}
          component={otherScreens?.Home}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.SEARCH}
          component={Stacks?.SearchStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.JOBS}
          component={Stacks?.JobStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.PROFILE}
          component={Stacks?.ProfileStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.GUEST_DASHBOARD}
          component={otherScreens?.GuestDashboard}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.PROFILE_GALLERY}
          component={authScreens?.ProfileGallery}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.UPDATE_PROFILE_GALLERY}
          component={authScreens?.UpdateProfileGallery}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.PHOTOGRAPHER_USER_PROFILE}
          component={otherScreens?.PhotographerUserProfile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.IDENTITY_VERIFICATION}
          component={otherScreens?.IdentityVerification}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.PACKAGES}
          component={otherScreens?.Packages}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.PROFILE_STACKS}
          component={Stacks?.ProfileStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.CHECKOUT}
          component={otherScreens?.Checkout}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.ORDER_CHECKOUT}
          component={otherScreens?.OrderCheckout}
          options={{ headerShown: false }}
        />

        <Drawer.Screen
          name={routeName?.LATEST_PROPOSAL}
          component={otherScreens?.LatestProposal}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.SUBMIT_PROPOSAL}
          component={otherScreens?.SubmitProposal}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.SAVED_JOB_DETAILS}
          component={otherScreens?.SavedJobDetails}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.FOLLOW_DETAILS}
          component={otherScreens?.FollowDetails}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.EDIT_PROFILE}
          component={authScreens?.EditProfile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.MANAGE_ACCOUNT}
          component={otherScreens?.ManageAccount}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.HELP_SUPPORT}
          component={otherScreens?.HelpSupport}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.MANAGE_JOBS}
          component={otherScreens?.ManageJobs}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.INBOX}
          component={otherScreens?.Inbox}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.CHAT}
          component={otherScreens?.Chat}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.PAYOUT_SETTING}
          component={otherScreens?.PayoutSetting}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.CASTING_CALLS}
          component={otherScreens?.CastingCalls}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.MANAGE_AVAILABLITY}
          component={otherScreens?.ManageAvailability}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.CLIENT_PROFILE}
          component={otherScreens?.ClientProfile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.SETTINGS}
          component={otherScreens?.Settings}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.PACKAGE_PAYMENT}
          component={otherScreens?.PackagePayment}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.SUCCESS}
          component={authScreens?.Success}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.FEED_USER_PROFILE}
          component={otherScreens?.FeedUserProfile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.DASHBOARD_STACKS}
          component={AdminStacks?.DashboardStacks}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.MODELS_LIST}
          component={adminScreens?.ModelsList}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.CLIENTS_LIST}
          component={adminScreens?.ClientsList}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.MODEL_PROFILE}
          component={otherScreens?.ModelProfile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName?.GALLERY_IMAGES}
          component={otherScreens?.GalleryImages}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.CONNECTION_STATUS}
          component={otherScreens?.ConnectionStatus}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.ADD_STRIPE_ACCOUNT}
          component={otherScreens?.AddStripAccount}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.EDIT_CASTING_CALLS}
          component={otherScreens?.EditCastingCalls}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.MANAGE_PROJECTS}
          component={otherScreens?.ManageProjects}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.EDIT_SUBMIT_PROPOSAL}
          component={otherScreens?.EditSubmitProposal}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.MODEL_USER_PROFILE}
          component={otherScreens?.ModelUserProfile}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.ADD_PORTFOLIO}
          component={otherScreens?.AddPortfolio}
          options={{ headerShown: false }}
        />
        
        <Drawer.Screen
          name={routeName.ADD_POST}
          component={otherScreens?.AddPost}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.EDIT_POST}
          component={otherScreens?.EditPost}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.EDIT_PHOTOGRAPHER}
          component={authScreens?.EditPhotographer}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.PUSH_NOTIFICATION_SCREEN}
          component={otherScreens?.PushNotificationScreen}
          options={{ headerShown: false }}
        />
        <Drawer.Screen
          name={routeName.MANAGE_PROPOSAL}
          component={otherScreens?.ManageProposal}
          options={{ headerShown: false }}
        />
      </>
    </Drawer.Navigator>
  );
};

export default DrawerNavigator;
