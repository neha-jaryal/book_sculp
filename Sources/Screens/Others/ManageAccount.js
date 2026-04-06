import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  DropDownList,
  Header,
  InputBox,
  Loader,
  Lotties,
  Tabs,
  TextComponent,
} from "../../Components";
import { Colors, dimensionheight, Fonts, JSONS, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { passwordPattern, routeName } from "../../Utility";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserDetail,
  resetPassword,
  userLogout,
} from "../../Redux/Services/AuthServices";
import { getData, storageKey } from "../../Utility/Storage";
import {
  deleteUser,
  getAccountSettingDetails,
} from "../../Redux/Services/OtherServices";
import { Alert } from "react-native";
import { Modal } from "react-native";
import { navigatorStatus } from "../../Redux/Actions/AuthActions";

export const ManageAccount = ({ navigation }) => {
  const dispatch = useDispatch();
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);
  const [tab, setTab] = useState(1);
  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [userData, setUserData] = useState("");
  const [userRole, setUserRole] = useState("");
  const [modal, setModal] = useState("");
  const [reason, setReason] = useState("");
  const [blockAccount, setblockAccount] = useState({
    password: "",
    confirmPassword: "",
    describe: "",
  });
  const [selectedPartner, setSelectedPartner] = useState("");
  const [checkedItems, setCheckedItems] = useState({
    all: true,
  });
  const [accountSwitches, setAccountSwitches] = useState({
    disableAccount: false,
    hourlyRate: false,
    projectNotification: false,
    messages: false,
    hideAdult: false,
  });
  const passwordValid = passwordPattern(password);
  const NewPasswordValid = passwordPattern(newPassword);

  const reasons = [
    {
      label: "No longer using this account",
      value: "No longer using this account",
    },
    {
      label: "I have privacy concern",
      value: "I have privacy concern",
    },
    {
      label: "Account inactivity",
      value: "Account inactivity",
    },
  ];

  useEffect(() => {
    getUserData();
    getAccountDetails();
  }, []);
  const getUserData = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let userRole = await getData(storageKey?.USER_ROLE);
    setUserRole(userRole);
    if (userID) {
      let body = {
        user_id: JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res.status == 200) {
        setUserData(res.results);
      }
    }
  };

  const handleResetPassword = async () => {
    var body = {
      user_email: userData?.user_data?.user_email,
      old_password: password,
      new_password: newPassword,
      new_re_password: newPassword,
    };
    let res = await dispatch(resetPassword(body));
    if (res?.status == 200) {
      navigation.goBack();
    }
  };

  // const deleteAccount = async (item) => {
  //   let userID = await getData(storageKey?.USER_ID);
  //   let profileID = userData?.user_data?.profile_id;
  //   var body = {
  //     user_id: userID,
  //     profile_id: profileID,
  //   };
  //   let res = await dispatch(deleteUser(body));
  //   if (res?.status == 200) {
  //     let fcmToken = await getData(storageKey?.FCM_TOKEN);
  //     var body = {
  //       user_id: userID,
  //       device_token: JSON?.parse(fcmToken),
  //     };
  //     await dispatch(userLogout(body));
  //     dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
  //   }
  // };

  const deleteAccount = async (item) => {
    let userID = await getData(storageKey?.USER_ID);
    let profileID = userData?.user_data?.profile_id;
    var body = {
      user_id: userID,
      action: "delete",
      password: blockAccount?.password,
      reason: reason,
      description: blockAccount?.describe,
    };
    let res = await dispatch(getAccountSettingDetails(body));
    if (res?.status == 200) {
      let fcmToken = await getData(storageKey?.FCM_TOKEN);
      var body = {
        user_id: userID,
        device_token: JSON?.parse(fcmToken),
      };
      await dispatch(userLogout(body));
      dispatch(navigatorStatus(routeName?.AUTHSTACKS, false, ""));
    }
  };
  const getAccountDetails = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userID,
      action: "get",
    };
    let res = await dispatch(getAccountSettingDetails(body, true));
    if (res?.status == 200) {
      setAccountSwitches({
        ...accountSwitches,
        disableAccount:
          res?.results?.profile_blocked == "off" ||
          res?.results?.profile_blocked == ""
            ? false
            : true,
        hourlyRate:
          res?.results?.hourly_rate_settings == "off" ||
          res?.results?.hourly_rate_settings == ""
            ? false
            : true,
        projectNotification:
          res?.results?.project_notification == "off" ||
          res?.results?.project_notification == ""
            ? false
            : true,
        messages:
          res?.results?.allow_recived_messages == "off" ||
          res?.results?.allow_recived_messages == ""
            ? false
            : true,
        hideAdult:
          res?.results?.hide_adult_profile == "off" ||
          res?.results?.hide_adult_profile == ""
            ? false
            : true,
      });
    }
  };
  const updateAccountDetails = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userID,
      action: "update",
      profile_blocked: accountSwitches?.disableAccount ? "on" : "off",
      delete_account: "off",
      hourly_rate_settings: accountSwitches?.hourlyRate ? "on" : "off",
      project_notification: accountSwitches?.projectNotification ? "on" : "off",
      allow_recived_messages: accountSwitches?.messages ? "on" : "off",
      hide_adult_profile: accountSwitches?.hideAdult ? "on" : "off",
    };
    console.log("updateAccountDetails-----", body);
    let res = await dispatch(getAccountSettingDetails(body, false));
    if (res?.status == 200) {
      getAccountDetails();
    }
  };

  const handleDeleteAccount = () => {
    Alert.alert(
      "Are you sure?",
      "You want to delete the account permanently? You will not be able to login this account if you delete the account.",
      [
        {
          text: "No",
          style: "cancel",
        },
        {
          text: "Yes",
          onPress: () => deleteAccount(),
        },
      ],
    );
  };

  const dataTabs = [
    {
      title: "Security & Settings",
      show: true,
      key: 1,
    },
    { title: "Change Password", show: true, key: 2 },
    { title: "Delete Account", show: true, key: 3 },
    // { title: "Agency Access", show: true, key: 4 },
  ];

  const settingsOptions = [
    {
      name: "Pause my account",
      type: "pause-account",
      checked: accountSwitches?.disableAccount ? true : false,
      show: true,
      onclick: () => {
        setAccountSwitches({
          ...accountSwitches,
          disableAccount: !accountSwitches?.disableAccount,
        });
      },
    },
    {
      name: "Hide your rate on your profile",
      type: "disable-rate",
      checked: accountSwitches?.hourlyRate ? true : false,
      show: userRole == 12 ? false : true,
      onclick: () => {
        setAccountSwitches({
          ...accountSwitches,
          hourlyRate: !accountSwitches?.hourlyRate,
        });
      },
    },
    {
      name: "Hide adult social post",
      type: "hide-post",
      checked: accountSwitches?.hideAdult ? true : false,
      show:
        userData?.post_meta_details?.freelancer_type == "child" ||
        userData?.post_meta_details?.freelancer_type == "Child"
          ? false
          : true,
      onclick: () => {
        setAccountSwitches({
          ...accountSwitches,
          hideAdult: !accountSwitches?.hideAdult,
        });
      },
    },
    {
      name:
        "Would you like to receive SMS messages from clients and Book Sculp?",
      type: "sms-notification",
      checked: accountSwitches?.messages ? true : false,
      show: true,
      onclick: () => {
        setAccountSwitches({
          ...accountSwitches,
          messages: !accountSwitches?.messages,
        });
      },
    },
    {
      name: "Would you like to receive Job Notifications?",
      type: "project_notification",
      checked: accountSwitches?.projectNotification ? true : false,
      show: true,
      onclick: () => {
        setAccountSwitches({
          ...accountSwitches,
          projectNotification: !accountSwitches?.projectNotification,
        });
      },
    },
  ];
  return (
    <>
      <Header text={"Manage Account"} navigation={navigation} />
      <Loader loading={auth?.isLoading || other?.isLoading} />
      <ScrollView>
        <View style={{ ...Styles?.container, paddingTop: 0 }}>
          {/* <Tabs
            leftTitle="Account"
            rightTitle="Password"
            onLeftTab={() => setTab(1)}
            onRightTab={() => setTab(2)}
            tab={tab}
          /> */}

          <View
            style={{
              ...Styles?.container,
              marginHorizontal: 0,
              ...Styles?.flexRow,
              flexWrap: "wrap",
              paddingTop: 0,
            }}
          >
            {dataTabs?.map((item, index) => {
              return item?.show ? (
                <TouchableOpacity
                  key={index}
                  onPress={() => setTab(item?.key)}
                  style={{ marginRight: 20, marginBottom: 10 }}
                >
                  <TextComponent
                    text={item?.title}
                    color={
                      tab == item?.key ? Colors?.themeColor : Colors?.darkgrey
                    }
                    size={Sizes?.l}
                    fontWeight={tab == item?.key ? "700" : "400"}
                    style={{
                      textDecorationLine:
                        tab == item?.key ? "underline" : "none",
                    }}
                  />
                </TouchableOpacity>
              ) : null;
            })}
          </View>
          <View
            style={{
              // ...Styles?.container,
              marginHorizontal: 0,
              width: "100%",
            }}
          >
            {tab == 1 ? (
              <>
                <View style={{ alignContent: "center", paddingVertical: 15 }}>
                  <TextComponent
                    text={
                      "To hide your profile all over the site you can disable your profile temporarily"
                    }
                    size={Sizes?.s}
                    fontWeight="400"
                    color={Colors?.darkgrey}
                    fontStyle={Fonts?.Italic}
                    style={{ marginHorizontal: 10 }}
                  />
                  <View style={{ padding: 10 }}>
                    {settingsOptions?.map((item) => {
                      return (
                        <View style={{ ...Styles?.flexRow }} key={item?.type}>
                          <TextComponent
                            text={item?.name}
                            size={Sizes?.l}
                            fontWeight="400"
                            color={Colors?.darkgrey}
                            style={{ marginVertical: 8, width: 280 }}
                          />
                          <TouchableOpacity
                            onPress={() => item?.onclick()}
                            style={{ position: "absolute", right: 0 }}
                          >
                            <MaterialCommunityIcons
                              size={45}
                              name={
                                item?.checked
                                  ? "toggle-switch"
                                  : "toggle-switch-off"
                              }
                              color={
                                item?.checked
                                  ? Colors?.themeColor
                                  : Colors?.darkgrey
                              }
                            />
                          </TouchableOpacity>
                        </View>
                      );
                    })}
                    {/* <View style={Styles?.flexRow}>
                    <TextComponent
                      text={"Pause my account"}
                      size={Sizes?.l}
                      fontWeight="400"
                      color={Colors?.darkgrey}
                      style={{ marginVertical: 8 }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setAccountSwitches({
                          ...accountSwitches,
                          disableAccount: !accountSwitches?.disableAccount,
                        })
                      }
                    >
                      <MaterialCommunityIcons
                        size={45}
                        name={
                          accountSwitches?.disableAccount
                            ? "toggle-switch"
                            : "toggle-switch-off"
                        }
                        color={
                          accountSwitches?.disableAccount
                            ? Colors?.themeColor
                            : Colors?.darkgrey
                        }
                      />
                    </TouchableOpacity>
                  </View>
            
                  {userRole != 12 && (
                    <View style={Styles?.flexRow}>
                      <TextComponent
                        text={"Disable hourly rate on frontend"}
                        size={Sizes?.l}
                        fontWeight="400"
                        color={Colors?.darkgrey}
                        style={{ marginVertical: 8 }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setAccountSwitches({
                            ...accountSwitches,
                            hourlyRate: !accountSwitches?.hourlyRate,
                          })
                        }
                      >
                        <MaterialCommunityIcons
                          size={45}
                          name={
                            accountSwitches?.hourlyRate
                              ? "toggle-switch"
                              : "toggle-switch-off"
                          }
                          color={
                            accountSwitches?.hourlyRate
                              ? Colors?.themeColor
                              : Colors?.darkgrey
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  )}
                  {userData?.post_meta_details?.freelancer_type == "child" ||
                  userData?.post_meta_details?.freelancer_type == "Child" ? (
                    <View style={Styles?.flexRow}>
                      <TextComponent
                        text={"Hide adult social post"}
                        size={Sizes?.l}
                        fontWeight="400"
                        color={Colors?.darkgrey}
                        style={{ marginVertical: 8 }}
                      />
                      <TouchableOpacity
                        onPress={() =>
                          setAccountSwitches({
                            ...accountSwitches,
                            hideAdult: !accountSwitches?.hideAdult,
                          })
                        }
                      >
                        <MaterialCommunityIcons
                          size={45}
                          name={
                            accountSwitches?.hideAdult
                              ? "toggle-switch"
                              : "toggle-switch-off"
                          }
                          color={
                            accountSwitches?.hideAdult
                              ? Colors?.themeColor
                              : Colors?.darkgrey
                          }
                        />
                      </TouchableOpacity>
                    </View>
                  ) : null}

                  <View style={Styles?.flexRow}>
                    <TextComponent
                      text={"New project notifications"}
                      size={Sizes?.l}
                      fontWeight="400"
                      color={Colors?.darkgrey}
                      style={{ marginVertical: 8 }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setAccountSwitches({
                          ...accountSwitches,
                          projectNotification: !accountSwitches?.projectNotification,
                        })
                      }
                    >
                      <MaterialCommunityIcons
                        size={45}
                        name={
                          accountSwitches?.projectNotification
                            ? "toggle-switch"
                            : "toggle-switch-off"
                        }
                        color={
                          accountSwitches?.projectNotification
                            ? Colors?.themeColor
                            : Colors?.darkgrey
                        }
                      />
                    </TouchableOpacity>
                  </View>
                  <View style={Styles?.flexRow}>
                    <TextComponent
                      text={
                        "Do you want to receive SMS notification form the client and Book Sculp?"
                      }
                      size={Sizes?.l}
                      fontWeight="400"
                      color={Colors?.darkgrey}
                      style={{ marginVertical: 8, width: 250 }}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        setAccountSwitches({
                          ...accountSwitches,
                          messages: !accountSwitches?.messages,
                        })
                      }
                    >
                      <MaterialCommunityIcons
                        size={45}
                        name={
                          accountSwitches?.messages
                            ? "toggle-switch"
                            : "toggle-switch-off"
                        }
                        color={
                          accountSwitches?.messages
                            ? Colors?.themeColor
                            : Colors?.darkgrey
                        }
                      />
                    </TouchableOpacity>
                  </View> */}
                  </View>
                </View>
                <Button
                  title="Save Account"
                  icon={true}
                  background={true}
                  onPress={() => updateAccountDetails()}
                />
                {/* <TouchableOpacity
                  onPress={() => handleDeleteAccount()}
                  // onPress={() => setModal(true)}
                  style={{
                    alignItems: "center",
                  }}
                >
                  <TextComponent
                    text="Delete Account"
                    color={Colors?.red}
                    size={Sizes?.s}
                    style={{ paddingHorizontal: 6, paddingVertical: 4 }}
                  />
                </TouchableOpacity> */}
              </>
            ) : tab == 2 ? (
              <View style={{ paddingVertical: 15 }}>
                <Lotties
                  source={JSONS?.passordJSON}
                  style={{
                    width: "100%",
                    marginTop: -15,
                    marginLeft: 10,
                    height: 150,
                  }}
                />
                <View
                  style={{
                    marginTop: 10,
                    paddingHorizontal: 20,
                    marginTop: -50,
                  }}
                >
                  <InputBox
                    type="password"
                    value={password.trim()}
                    placeholder="Current Password"
                    onChangeText={(val) => setPassword(val)}
                    // error={passwordValid}
                    fontIcon="lock"
                  />
                  <InputBox
                    type="password"
                    value={newPassword.trim()}
                    placeholder="New Password"
                    onChangeText={(val) => setNewPassword(val)}
                    error={NewPasswordValid}
                    fontIcon="lock"
                  />
                </View>
                <Button
                  title="Done"
                  icon={true}
                  background={true}
                  onPress={() => handleResetPassword()}
                />
              </View>
            ) : tab == 3 ? (
              <View style={{ paddingVertical: 15 }}>
                <InputBox
                  required
                  type="password"
                  className="form-group"
                  placeholder="Enter Password"
                  value={blockAccount?.password}
                  onChangeText={(e) => {
                    setblockAccount({
                      ...blockAccount,
                      password: e?.target?.value,
                    });
                  }}
                />
                <DropDownList
                  required
                  placeholder="Select Reason to Leave"
                  options={reasons}
                  value={reason}
                  setValue={setReason}
                />
                <InputBox
                  type="description"
                  placeholder="Enter Description"
                  value={blockAccount?.describe}
                  onChangeText={(e) => {
                    setblockAccount({
                      ...blockAccount,
                      describe: e?.target?.value,
                    });
                  }}
                  style={{ marginVertical: 10 }}
                />
                <Button
                  title="Delete Account"
                  background={true}
                  onPress={() => handleDeleteAccount()}
                />
              </View>
            ) : null}
          </View>
        </View>

        <View style={{ height: 40 }} />
        {/* <Modal
          animationIn={"fadeIn"}
          animationOut={"fadeOut"}
          transparent={true}
          backdropOpacity={0.4}
          visible={modal}
          style={{ position: "relative", backgroundColor: "red" }}
        >
          <View
            style={{
              ...Styles.container,
              justifyContent: "center",
              position: "absolute",
              top: "50%",
            }}
          >
            <TextComponent
              text="Loading..."
              color={Colors?.gray}
              size={Sizes?.s}
              fontWeight="400"
              style={{ letterSpacing: 0.5 }}
            />
            <TouchableOpacity
              onPress={() => setModal(false)}
              style={{
                alignItems: "center",
              }}
            >
              <TextComponent
                text="Delete Account"
                color={Colors?.red}
                size={Sizes?.s}
                style={{ paddingHorizontal: 6, paddingVertical: 4 }}
              />
            </TouchableOpacity>
          </View>
        </Modal> */}
      </ScrollView>
    </>
  );
};
const styles = StyleSheet.create({
  loader: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    opacity: 2,
  },
  container: {
    // flexDirection: "row",
    // justifyContent: "space-around",
    // alignItems: "center",
    // backgroundColor: "white",
    // width: "40%",
    // alignSelf: "center",
    // padding: 20,
    // borderRadius: 5,
  },
  text: {
    marginLeft: "5%",
    color: "red",
  },
});
