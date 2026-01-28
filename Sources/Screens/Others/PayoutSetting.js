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
  Header,
  InputBox,
  Loader,
  Tabs,
  TextComponent,
} from "../../Components";
import {
  Colors,
  dimensionheight,
  Fonts,
  Images,
  JSONS,
  Sizes,
} from "../../Constants";
import { Styles } from "../../Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { routeName, showToast } from "../../Utility";
import { getData, storageKey } from "../../Utility/Storage";
import { useDispatch, useSelector } from "react-redux";
import {
  addStripeAccount,
  getPayoutsList,
  getStripeBalance,
  handleWithdraw,
} from "../../Redux/Services/OtherServices";
import { useFocusEffect } from "@react-navigation/native";
import { Modal } from "react-native-paper";
import Entypo from "react-native-vector-icons/Entypo";

export const PayoutSetting = ({ navigation }) => {
  const dispatch = useDispatch();
  const [tab, setTab] = useState(2);
  const other = useSelector((state) => state?.otherReducer);

  const [accountList, setAccountList] = useState("");
  const [pendingBalance, setPendingBalance] = useState("");
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [payoutList, setPayoutList] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      getAllBankAccounts();
      setTab(2);
      getStripePendingBalance();
    }, [])
  );

  console.log("accountListaccountList----------", accountList);
  const handleAddAccount = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      action: "add",
      user_id: userId,
    };
    let res = await dispatch(addStripeAccount(body));
    if (res?.status == 200) {
      navigation.navigate(routeName?.ADD_STRIPE_ACCOUNT, {
        stripeUrl: res?.results,
        type: "add",
      });
    }
  };
  const getAllBankAccounts = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      action: "get",
      user_id: userId,
    };
    console.log("bodyyyyyy-------", body);
    let res = await dispatch(addStripeAccount(body));
    if (res?.status == 200) {
      setAccountList(res?.results);
      setTab(2);
    }
  };
  const getStripePendingBalance = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userId,
    };
    console.log("bodyyyyyy-------", body);
    let res = await dispatch(getStripeBalance(body));
    if (res?.status == 200) {
      setPendingBalance(res?.results);
    }
  };
  const handleUpdateAccount = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      action: "update",
      user_id: userId,
    };
    let res = await dispatch(addStripeAccount(body));
    if (res?.status == 200) {
      navigation.navigate(routeName?.ADD_STRIPE_ACCOUNT, {
        stripeUrl: res?.results?.url,
        type: "update",
      });
    }
  };

  const handleWithdrawAmount = async () => {
    if (!amount) {
      showToast("Please enter amount", "error");
    } else if (parseFloat(amount) > parseFloat(accountList?.amount)) {
      showToast("Insufficient Balance", "error");
    } else {
      let userId = await getData(storageKey?.USER_ID);
      var body = {
        user_id: userId,
        action: "withdraw",
        amount: amount,
      };
      let res = await dispatch(handleWithdraw(body));
      if (res?.status == 200) {
        showToast("Payout created successfully", "success");
        setShowModal(false);
        setAmount("");
        getAllBankAccounts();
        setTab(1);
      }
    }
  };

  const getPayoutHistory = async () => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userId,
    };
    let res = await dispatch(getPayoutsList(body));
    if (res?.status == 200) {
      setPayoutList(res?.results);
    }
  };

  return (
    <>
      <Header text={"Payout Settings"} navigation={navigation} />
      <Loader loader={other?.isLoading} />
      <ScrollView>
        <View style={{ ...Styles?.container, paddingTop: 30 }}>
          {/* <View
            style={{
              ...Styles?.flexRow,
              ...styling?.emailView,
              paddingHorizontal: 10,
            }}
          >
            <TextComponent
              text="Email Verification : Your account is not verified. Please check your email for the verification"
              size={Sizes?.xs}
              fontWeight="400"
              style={{ marginHorizontal: 10, width: 260 }}
            />
            <TouchableOpacity style={Styles?.smallButton}>
              <TextComponent text="Resend" size={Sizes?.xs} fontWeight="400" />
            </TouchableOpacity>
          </View> */}
          <Tabs
            leftTitle="Your Payouts"
            rightTitle="Payout Settings"
            onLeftTab={() => {
              getPayoutHistory();
              setTab(1);
            }}
            onRightTab={() => {
              getAllBankAccounts();
            }}
            tab={tab}
          />
          {tab == 1 ? (
            <>
              {payoutList?.length != 0 ? (
                payoutList?.map((item) => {
                  console.log("itemitem------", item?.payout_amount);
                  return (
                    <View
                      style={{
                        ...Styles?.container,
                        marginHorizontal: 0,
                        width: "100%",
                        paddingVertical: 15,
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          ...Styles?.flexRow,
                          marginHorizontal: 10,
                          width: "90%",
                        }}
                      >
                        <TextComponent text={"Amount"} size={Sizes?.l} />

                        <TextComponent
                          text={`${parseFloat(item?.payout_amount)}`}
                          size={Sizes?.s}
                          color={Colors?.darkgrey}
                          fontWeight="400"
                          style={{ paddingHorizontal: 8 }}
                        />
                      </View>
                      <View style={Styles?.separator} />
                      <View
                        style={{
                          ...Styles?.flexRow,
                          marginHorizontal: 10,
                          width: "90%",
                        }}
                      >
                        <TextComponent text={"Currency"} size={Sizes?.l} />

                        <TextComponent
                          text={item?.payout_currency}
                          size={Sizes?.s}
                          color={Colors?.darkgrey}
                          fontWeight="400"
                          style={{ paddingHorizontal: 8 }}
                        />
                      </View>
                      <View style={Styles?.separator} />
                      <View
                        style={{
                          ...Styles?.flexRow,
                          marginHorizontal: 10,
                          width: "90%",
                        }}
                      >
                        <TextComponent text={"Payment Type"} size={Sizes?.l} />

                        <TextComponent
                          text={item?.payout_type}
                          size={Sizes?.s}
                          color={Colors?.darkgrey}
                          fontWeight="400"
                          style={{
                            paddingHorizontal: 8,
                            textTransform: "capitalize",
                          }}
                        />
                      </View>
                      <View style={Styles?.separator} />
                      <View
                        style={{
                          ...Styles?.flexRow,
                          marginHorizontal: 10,
                          width: "90%",
                        }}
                      >
                        <TextComponent text={"Created Date"} size={Sizes?.l} />

                        <TextComponent
                          text={item?.payout_created_date}
                          size={Sizes?.xs}
                          color={Colors?.darkgrey}
                          fontWeight="400"
                          style={{ paddingHorizontal: 8 }}
                        />
                      </View>
                      <View style={Styles?.separator} />
                      <View
                        style={{
                          ...Styles?.flexRow,
                          marginHorizontal: 10,
                          width: "90%",
                        }}
                      >
                        <TextComponent text={"Deposit Date"} size={Sizes?.l} />

                        <TextComponent
                          text={item?.payout_arrival_date}
                          size={Sizes?.xs}
                          color={Colors?.darkgrey}
                          fontWeight="400"
                          style={{ paddingHorizontal: 8 }}
                        />
                      </View>
                      <View style={Styles?.separator} />
                      <View
                        style={{
                          ...Styles?.flexRow,
                          marginHorizontal: 10,
                          width: "90%",
                        }}
                      >
                        <TextComponent text={"Status"} size={Sizes?.l} />

                        <TouchableOpacity
                          //   onPress={() => navigation?.navigate(routeName?.SIGNIN)}
                          style={{
                            ...Styles?.smallButton,
                            backgroundColor: Colors?.themeColor,
                            marginVertical: 0,
                          }}
                        >
                          <TextComponent
                            text={item?.payout_status}
                            color={Colors?.white}
                            size={Sizes?.s}
                            style={{
                              paddingHorizontal: 8,
                              textTransform: "capitalize",
                            }}
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={Styles?.separator} />
                    </View>
                  );
                })
              ) : (
                <View style={{ marginTop: 200, alignSelf: "center" }}>
                  <TextComponent
                    text={"No Data Found"}
                    size={Sizes?.xl}
                    color={Colors?.darkgrey}
                  />
                </View>
              )}
            </>
          ) : accountList?.length != 0 ? (
            <>
              <View style={{ alignContent: "center", paddingVertical: 15 }}>
                <TextComponent
                  text={
                    "All the earning will be sent to below selected payout method"
                  }
                  size={Sizes?.l}
                  fontWeight="400"
                  color={Colors?.darkgrey}
                  fontStyle={Fonts?.Italic}
                  style={{ marginHorizontal: 10 }}
                />

                <View
                  style={{
                    ...Styles?.container,
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <Image
                    source={Images?.balance}
                    style={{ width: 35, height: 35 }}
                  />
                  <TextComponent
                    text={"Available balance"}
                    size={Sizes?.xs}
                    fontWeight="400"
                    style={{ marginVertical: 8 }}
                  />
                  <TextComponent
                    text={`${accountList?.symbol} ${accountList?.amount} ${accountList?.curency}`}
                    size={Sizes?.s}
                    fontWeight="400"
                    color={Colors?.blue}
                    style={{ textTransform: "uppercase" }}
                  />
                  <TouchableOpacity
                    onPress={() => setShowModal(true)}
                    style={{
                      ...Styles?.smallButton,
                      backgroundColor: Colors?.themeColor,
                    }}
                  >
                    <TextComponent
                      text="Withdraw Now"
                      color={Colors?.white}
                      size={Sizes?.s}
                      style={{ paddingHorizontal: 8 }}
                    />
                  </TouchableOpacity>
                </View>
                {/* {pendingBalance?.pending_amount > 0 ? ( */}
                <View
                  style={{
                    ...Styles?.container,
                    flex: 1,
                    flexDirection: "column",
                    alignItems: "center",
                    backgroundColor: Colors?.offWhite,
                  }}
                >
                  <Image
                    source={Images?.balance}
                    style={{ width: 35, height: 35 }}
                  />
                  <TextComponent
                    text={"Funds in process"}
                    size={Sizes?.xs}
                    fontWeight="400"
                    style={{ marginVertical: 8 }}
                  />
                  {pendingBalance > 0 && (
                    <TextComponent
                      text={`${pendingBalance?.symbol} ${pendingBalance?.pending_amount} ${pendingBalance?.curency}`}
                      size={Sizes?.s}
                      fontWeight="400"
                      color={Colors?.blue}
                      style={{ textTransform: "uppercase" }}
                    />
                  )}

                  {pendingBalance?.balance_transaction?.map((item) => {
                    return item?.status == "pending" ? (
                      <View
                        style={{
                          ...Styles?.container,
                          marginHorizontal: 0,
                          width: "100%",
                          paddingVertical: 15,
                          alignItems: "center",
                          padding: 0,
                        }}
                      >
                        <View
                          style={{
                            ...Styles?.flexRow,
                            marginHorizontal: 10,
                            width: "90%",
                          }}
                        >
                          <TextComponent
                            text={"Amount"}
                            size={Sizes?.s}
                            fontWeight="400"
                          />

                          <TextComponent
                            text={`${parseFloat(item?.totle_price)}`}
                            size={Sizes?.s}
                            color={Colors?.darkgrey}
                            fontWeight="400"
                            style={{ paddingHorizontal: 8 }}
                          />
                        </View>
                        <View style={Styles?.separator} />

                        <View
                          style={{
                            ...Styles?.flexRow,
                            marginHorizontal: 10,
                            width: "90%",
                          }}
                        >
                          <TextComponent
                            text={"Created Date"}
                            size={Sizes?.s}
                            fontWeight="400"
                          />

                          <TextComponent
                            text={item?.created}
                            size={Sizes?.xs}
                            color={Colors?.darkgrey}
                            fontWeight="400"
                            style={{ paddingHorizontal: 8 }}
                          />
                        </View>
                        <View style={Styles?.separator} />
                        <View
                          style={{
                            ...Styles?.flexRow,
                            marginHorizontal: 10,
                            width: "90%",
                          }}
                        >
                          <TextComponent
                            text={"Available On"}
                            size={Sizes?.s}
                            fontWeight="400"
                          />

                          <TextComponent
                            text={item?.available_on}
                            size={Sizes?.xs}
                            color={Colors?.darkgrey}
                            fontWeight="400"
                            style={{ paddingHorizontal: 8 }}
                          />
                        </View>
                        <View style={Styles?.separator} />
                        <View
                          style={{
                            ...Styles?.flexRow,
                            marginHorizontal: 10,
                            width: "90%",
                          }}
                        >
                          <TextComponent
                            text={"Status"}
                            size={Sizes?.s}
                            fontWeight="400"
                          />

                          <TouchableOpacity
                            style={{
                              ...Styles?.smallButton,
                              backgroundColor: Colors?.themeColor,
                              marginVertical: 0,
                            }}
                          >
                            <TextComponent
                              text={item?.status}
                              color={Colors?.white}
                              size={Sizes?.xs}
                              style={{
                                paddingHorizontal: 8,
                                textTransform: "capitalize",
                              }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={Styles?.separator} />
                      </View>
                    ) : null;
                  })}
                </View>
                {/* ) : null} */}

                <View
                  style={{
                    ...Styles?.container,
                    ...Styles?.row,
                    marginHorizontal: 10,
                    paddingHorizontal: 25,
                    width: "92%",
                    marginLeft: 14,
                  }}
                >
                  <FontAwesome name="bank" size={40} />
                  <View
                    style={{
                      marginHorizontal: 20,
                    }}
                  >
                    <TextComponent
                      text={accountList?.user_stripe_bank_details?.bank_name}
                      size={Sizes?.l}
                      fontWeight="400"
                      style={{ marginVertical: 8 }}
                    />
                    <TextComponent
                      text={
                        "*************" +
                        accountList?.user_stripe_bank_details?.last4
                      }
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                    />
                    <TextComponent
                      text={
                        accountList?.user_stripe_bank_details?.routing_number
                      }
                      fontWeight="400"
                      size={Sizes?.s}
                      color={Colors?.blue}
                    />
                  </View>
                </View>
                <View style={{ height: 20 }} />
                <TextComponent
                  text={
                    "Please note: There is different payout process for different countries. It will take 3-7 business days for your funds to transfer to your bank account"
                  }
                  fontWeight="400"
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  style={{ marginHorizontal: 12 }}
                />
                <View style={{ height: 10 }} />
                <Button
                  title="Edit Your Account"
                  icon={true}
                  background={true}
                  onPress={() => handleUpdateAccount()}
                />
              </View>
            </>
          ) : (
            <>
              <View
                style={{
                  ...Styles?.container,
                  marginHorizontal: 0,
                  width: "100%",
                  paddingVertical: 15,
                  alignItems: "center",
                }}
              >
                <TextComponent
                  text={"Please add your bank account information for payout"}
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                />
                <TouchableOpacity
                  onPress={() => handleAddAccount()}
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.pink,
                  }}
                >
                  <TextComponent
                    text={"Add Your Account"}
                    color={Colors?.white}
                    size={Sizes?.s}
                    style={{ paddingHorizontal: 10 }}
                  />
                </TouchableOpacity>

                <TextComponent
                  text={
                    "Please Note: When proceeding to the next step after clicking “add account”, please select “Other personal services” under “Personal services” and add your BookSculp profile page for your website link."
                  }
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                  style={{
                    lineHeight: 22,
                    textAlign: "justify",
                    marginHorizontal: 8,
                  }}
                />
              </View>
            </>
          )}
        </View>
        <Modal
          transparent={true}
          visible={showModal}
          animationType="slide"
          useNativeDriver={true}
          onRequestClose={() => setShowModal(false)}
        >
          <View style={styling.dropdownModal}>
            <View
              style={{
                ...Styles?.container,
                // maxHeight: 400,
                padding: 20,
              }}
            >
              <TextComponent text={"Withdraw Earnings"} size={Sizes?.l} />
              <View style={Styles?.separator} />
              <InputBox
                type="numeric"
                value={amount}
                placeholder="Enter amount *"
                onChangeText={(val) => setAmount(val)}
                icon={Images?.dollarIcon}
                keyboardType="numeric"
                toolTipText={"Enter your withdraw amount"}
              />

              <TouchableOpacity
                style={{
                  ...Styles?.smallButton,
                  backgroundColor: Colors?.themeColor,
                  width: "45%",
                  alignSelf: "center",
                  marginHorizontal: 10,
                }}
                onPress={() => handleWithdrawAmount()}
              >
                <TextComponent
                  text="Withdraw Now"
                  color={Colors?.white}
                  size={Sizes?.s}
                />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowModal(false)}
                style={{
                  position: "absolute",
                  top: -10,
                  right: -10,
                  backgroundColor: Colors?.white,
                  borderRadius: 100,
                }}
              >
                <Entypo name="circle-with-cross" size={35} color={Colors.red} />
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};
const styling = StyleSheet.create({
  emailView: {
    backgroundColor: Colors?.yellow,
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
    justifyContent: "space-around",
  },
});
