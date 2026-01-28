import React, { useEffect, useState } from "react";
import {
  Linking,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  InputBox,
  Tabs,
  TextComponent,
  DropDownList,
  DashboardHeader,
  Header,
  Loader,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { CountryNames } from "../../Global";
import {
  isValidCardExpiry,
  isValidCardNumber,
  isValidEmail,
  isValidPhoneNumber,
  regName,
  showToast,
} from "../../Utility";
import { useDispatch, useSelector } from "react-redux";
import {
  hireCheckout,
  productCheckout,
} from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { useFocusEffect } from "@react-navigation/native";

export const Checkout = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { projectId, proposalId, proposal_status } = route?.params;
  console.log("proposal_status----", proposal_status);
  const other = useSelector((state) => state?.otherReducer);

  const [country, setCountry] = useState("");
  const [coupon, setCoupon] = useState("");
  const [expendCouponView, setExpendCouponView] = useState(false);
  const [cardNumber, setCardNumber] = useState("");
  const [expiryDate, setExpiryDatey] = useState("");
  const [cvc, setCvc] = useState("");
  const [checkoutDetails, setCheckoutDetails] = useState("");
  const [billingDetails, setBillingDetails] = useState({
    fname: "",
    lname: "",
    mobileNumber: "",
    email: "",
    addressLine: "",
    addressLine2: "",
    townCity: "",
    county: "",
    postalCode: "",
  });

  const fnameValid = regName(billingDetails?.fname);
  const lnameValid = regName(billingDetails?.lname);
  const mobileNumberValid = isValidPhoneNumber(billingDetails?.mobileNumber);
  const cardNumberValid = isValidCardNumber(cardNumber);
  const cardExpiryValid = isValidCardExpiry(expiryDate);
  const emailValid = isValidEmail(billingDetails?.email);
  const projectDetails = [
    {
      title: "Project title",
      name: checkoutDetails?.prop_detail?.proposal_data?.basic?.post_title,
    },
    {
      title: "Talent",
      name:
        checkoutDetails?.prop_detail?.proposal_data?.proposal_details
          ?.display_name,
    },
    {
      title: "Project Cost & Usage Fee",
      name: `$${checkoutDetails?.prop_detail?.checkout_amt?.sub_total}`,
    },
    {
      title: "Total per diem provided:",
      name: `$${checkoutDetails?.prop_detail?.checkout_amt?.amount_of_per_diem}`,
    },
    {
      title: "Service fee",
      name: `$${checkoutDetails?.prop_detail?.checkout_amt?.admin_amount}`,
    },
    {
      title: "Grand Total",
      name: `$${checkoutDetails?.prop_detail?.checkout_amt?.total_amount}`,
    },
  ];
  const summaryDetails = [
    {
      title: "Test 20  × 1",
      name: `$${checkoutDetails?.checkout_amt?.amount_of_per_diem}`,
    },
    {
      title: "Subtotal",
      name: `$${checkoutDetails?.checkout_amt?.amount_of_per_diem}`,
    },
    {
      title: "Processing/taxes fee",
      name: `$${checkoutDetails?.checkout_amt?.amount_of_per_diem}`,
    },
    {
      title: "Total",
      name: `$${checkoutDetails?.checkout_amt?.amount_of_per_diem}`,
    },
  ];

  useFocusEffect(
    React.useCallback(() => {
      getProjectCheckoutDetails();
    }, [])
  );

  const getProjectCheckoutDetails = async () => {
    let userId = await getData(storageKey?.USER_ID);
    let body = {
      action: "hire",
      user_id: userId,
      project_id: projectId,
      proposal_id: proposalId,
    };
    console.log("productCheckoutbodybody----", body);
    let res = await dispatch(productCheckout(body));
    if (res?.status == 200) {
      setCheckoutDetails(res.results);
    }
  };
  const handlePlaceOrder = async () => {
    if (checkoutDetails?.url) {
      navigation?.navigate(routeName?.PACKAGE_PAYMENT, {
        stripe_URL: checkoutDetails?.url,
        onSuccessURL: "https://api.booksculp.com/success.php?success=true",
      });
    }
  };
  console.log(
    "checkoutDetailscheckoutDetails-----",
    JSON?.stringify(checkoutDetails)
  );
  return (
    <>
      <Header navigation={navigation} text="Checkout" />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Loader loader={other?.isLoading} />

        <View
          style={{
            ...Styles?.container,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Project Details"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          {projectDetails?.map((item, index) => {
            return (
              <>
                <View
                  style={{
                    ...Styles?.flexRow,
                    marginHorizontal: 10,
                    width: "90%",
                  }}
                >
                  <TextComponent
                    text={item?.title}
                    size={Sizes?.s}
                    fontWeight="400"
                  />
                  <TextComponent
                    text={other.isLoading ? 0 : item?.name ? item?.name : 0}
                    size={Sizes?.xs}
                    fontWeight="400"
                  />
                </View>
                {projectDetails?.length - 1 == index ? null : (
                  <View style={Styles?.separator} />
                )}
              </>
            );
          })}
        </View>

        <View style={{ alignItems: "center" }}>
          <TextComponent
            text={
              checkoutDetails?.url
                ? `Note : You will be redirected to the payment page to complete the booking. The full amount will be held until you mark the job as completed. At that time, the funds will be released to the talent.`
                : `Hire limit must be between $1 to $1M.`
            }
            size={Sizes?.s}
            color={Colors?.gray}
            fontWeight="400"
            style={{ padding: 10, lineHeight: 20, textAlign: "center" }}
          />
          <Button
            title={proposal_status == "hired" ? "Hired" : "Hire Now"}
            icon={true}
            background={true}
            backgroundColor={
              checkoutDetails?.url && proposal_status != "hired"
                ? Colors?.themeColor
                : Colors?.lightThemeColor
            }
            style={{ paddingVertical: 5 }}
            onPress={() =>
              checkoutDetails?.url && proposal_status != "hired"
                ? handlePlaceOrder()
                : null
            }
          />
        </View>
        <View style={{ height: 30 }} />
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
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 10,
    marginVertical: 20,
  },
});

{
  /* <InputBox
      type="dropdown"
      value={country}
      placeholder="Select Gender"
      onChangeText={(val) => setCountry(val)}
      icon={Images?.genderType}
      editable={false}
      options={CountryNames}
      style={{backgroundColor: 'blue'}}
    /> */
}

{
  /* {country ? null : (
      <TouchableOpacity
        style={{
          ...Styles?.row,
          // position: "absolute",
          // marginLeft: 28,
          paddingTop: 15,
          // marginTop:100
        }}
        onPress={() => onChangeCountry()}
      >
        <Entypo
          name={"location"}
          size={15}
          color={Colors?.darkgrey}
          style={{ marginRight: 8 }}
        />
        <TextComponent
          text="Select Country"
          color={Colors?.darkgrey}
          size={Sizes?.s}
          fontWeight="400"
        />
      </TouchableOpacity>
    )} */
}
{
  /* <CountryPicker
      ref={countryRef}
      selectedItem={handleSelection}
      ContainerStyle={{
        marginBottom: 10,
        color: Colors?.darkgrey,
        position: "relative",
      }}
      placeholderTextColor={Colors?.darkgrey}
      countryNameStyle={{ fontSize: Sizes?.s, marginBottom: -8 }}
      DropdownCountryTextStyle={{
        fontSize: Sizes?.s,
        color: Colors?.darkgrey,
        padding: 10,
      }}
      color={Colors?.darkgrey}
      DropdownContainerStyle={{
        borderWidth: 0.5,
        borderColor: Colors?.grey,
        borderRadius: 10,
      }}
      InputFieldStyle={{
        borderBottomWidth: 0.5,
        borderColor: Colors?.inputBorder,
        // color:Colors?.darkgrey
      }}
      Placeholder="Select Country"
      style={{ placeholderTextColor: Colors?.darkgrey }}
    /> */
}
{
  /* <DropDownList
      placeholder={"Select Languages"}
      icon={Images?.userType}
      value={talent}
      setValue={setTalent}
      options={}
      border={false}
    /> */
}

// function handleSelection(e) {
//   setCountry(e?.country);
// }

// const onChangeCountry = () => {
//   countryRef.current.focus();
//   console?.log('countryRef-----', countryRef);
// };
// const onSelectedItemsChange = selectedItems => {
//   setLanguage({selectedItems});
//   console?.log('setLanguage ---', {selectedItems});
// };
{
  /* <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
            marginVertical: 6,
          }}
        >
          <TouchableOpacity
            onPress={() => setExpendCouponView(!expendCouponView)}
            style={{ ...Styles?.row }}
          >
            <TextComponent
              text="Have a coupon ? "
              size={Sizes?.l}
              fontWeight="400"
            />
            <TextComponent
              text="Tap here to enter your code"
              size={Sizes?.l}
              color={Colors?.themeColor}
            />
          </TouchableOpacity>
          {expendCouponView && (
            <View style={{ marginVertical: 15 }}>
              <TextComponent
                text="If you have a coupon code, please apply it below."
                size={Sizes?.s}
                fontWeight="400"
                color={Colors?.darkgrey}
              />
              <InputBox
                type="text"
                value={coupon}
                placeholder="Coupon"
                onChangeText={(val) => setCoupon(val)}
                icon={Images?.couponIcon}
              />
              <View
                style={{
                  ...Styles?.smallButton,
                  backgroundColor: Colors?.themeColor,
                  paddingHorizontal: 20,
                  marginVertical: 10,
                  paddingVertical: 8,
                  width: "30%",
                }}
              >
                <TextComponent
                  text="Apply"
                  size={Sizes?.xs}
                  fontWeight="400"
                  color={Colors?.white}
                />
              </View>
            </View>
          )}
        </View>  
        <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
          }}
        >
          <TextComponent
            text="Payment Required"
            size={Sizes?.xl}
            fontWeight="400"
          />
        </View>
       <View style={{ ...Styles?.container }}>
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Billing Details"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          <InputBox
            type="text"
            value={billingDetails?.fname}
            placeholder="First Name"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, fname: val })
            }
            error={fnameValid}
          />
          <InputBox
            type="text"
            value={billingDetails?.lname}
            placeholder="Last Name"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, lname: val })
            }
            error={lnameValid}
          />
          <InputBox
            type="phone"
            value={billingDetails?.mobileNumber}
            placeholder="Phone Number"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, mobileNumber: val })
            }
            error={mobileNumberValid}
          />
          <InputBox
            type="email"
            value={billingDetails?.email.trim()}
            placeholder="Email Address"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, email: val })
            }
            error={emailValid}
            fontIcon="email"
          />
          <DropDownList
            options={CountryNames}
            placeholder={"Select Country"}
            icon={Images?.locationIcon}
            value={country}
            setValue={setCountry}
            border={false}
          />
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Street address"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={billingDetails?.addressLine}
            placeholder="House number and street name"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, addressLine: val })
            }
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={billingDetails?.addressLine2}
            placeholder="Apartment, suite, unit, etc. (optional)"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, addressLine2: val })
            }
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={billingDetails?.postalCode}
            placeholder="Town / City"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, townCity: val })
            }
          />
          <InputBox
            type="text"
            icon={Images?.locationIcon}
            value={billingDetails?.postalCode}
            placeholder="Postal Code"
            onChangeText={(val) =>
              setBillingDetails({ ...billingDetails, postalCode: val })
            }
          />
        </View>  
         <View
          style={{
            ...Styles?.container,
            padding: 20,
            marginBottom: 10,
          }}
        >
          <View
            style={{
              ...Styles?.flexRow,
              ...styling?.headingView,
            }}
          >
            <TextComponent
              text="Card Payment (Stripe)"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          <TextComponent
            text={`Pay with your credit card / debit card via Stripe.`}
            size={Sizes?.s}
            color={Colors?.darkgrey}
            fontWeight="400"
            style={{ width: "100%", marginBottom: 10 }}
          />
          <View style={{ paddingVertical: 25, paddingHorizontal: 15 }}>
            <View style={{ marginBottom: 20 }}>
              <TextComponent
                text="Card Number"
                size={Sizes?.l}
                fontWeight="400"
              />
              <InputBox
                type="cardNumber"
                value={cardNumber}
                placeholder="0000 0000 0000 0000"
                setValue={setCardNumber}
                error={cardNumberValid}
              />
            </View>
            <View style={{ marginBottom: 20 }}>
              <TextComponent
                text="Expiry Date"
                size={Sizes?.l}
                fontWeight="400"
              />
              <InputBox
                type="expiryDate"
                value={expiryDate}
                placeholder="MM/YY"
                setValue={setExpiryDatey}
                error={cardExpiryValid}
              />
            </View>
            <TextComponent
              text="Card Code (CVC)"
              size={Sizes?.l}
              fontWeight="400"
            />
            <InputBox
              type="cvc"
              value={cvc}
              placeholder="CVC"
              onChangeText={(val) => setCvc(val)}
            />
          </View>
        </View> */
}
