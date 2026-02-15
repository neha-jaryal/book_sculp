import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Keyboard,
  Text,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import {
  Sizes,
  Images,
  Colors,
  CountryNames,
  dimensionheight,
} from "../Constants";
import DateTimePicker from "@react-native-community/datetimepicker";
import CountryPicker from "react-native-country-codes-picker"; // ← NEW PACKAGE
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import moment from "moment";
import { InputField } from "./InputField";
import { ErrorMessage } from "./ErrorMessage";
import { TextComponent } from "./TextComponent";
import Modal from "react-native-modal";
import { Styles } from "../Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Button } from "./Button";
import { convertTime } from "../Utility";
import { useFocusEffect } from "@react-navigation/native";

export const InputBox = ({ ...props }) => {
  const {
    type,
    icon,
    value,
    placeholder,
    options,
    onChangeText,
    setDate,
    date,
    setTime,
    time,
    span,
    setValue,
    style,
    setOption,
    fontIcon,
    error,
    isEmpty,
    disable,
    minimum,
    maximum,
    currentDateDisable,
    ref,
    dateType,
    startDate,
    showDate,
    customTime,
    filter,
    onPress,
    toolTipText,
    state,
    setState,
    callingCode,
    setCallingCode,
    verified_status,
    hideVerify,
    onVerify,
  } = props;

  const [open, setOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedItem, setSelectedItem] = useState("");
  const [datePicker, setDatePicker] = useState(false);
  const [datePicked, setDatePicked] = useState(false);
  const today = moment();
  const newToday = moment();
  const minDate = today.subtract(13, "years");
  const talentMinDate = newToday.subtract(14, "years");
  const newDate = new Date();
  const [isModalVisible, setModalVisible] = useState(false);
  const [autoFocus, setAutoFocus] = useState(false);
  const [customTimer, setCustomTimer] = useState(true);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [currentDate, setCurrentDate] = useState(false);
  const inputRef = useRef(null);

  // New state for country-codes-picker
  const [showCountryPicker, setShowCountryPicker] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null); // { name, code, dial_code, flag }

  useFocusEffect(
    React.useCallback(() => {
      setCustomTimer(true);
    }, [customTime]),
  );

  useEffect(() => {
    if (showDate) {
      if (new Date(date).toDateString() == newDate?.toDateString()) {
        setCurrentDate(true);
      } else {
        setCurrentDate(false);
      }
    }
  }, [props, showDate, currentDate]);

  // Optional: if you want to initialize selectedCountry from callingCode
  useEffect(() => {
    if (callingCode && !selectedCountry) {
      // You can pre-select if needed (new lib doesn't require manual mapping)
    }
  }, [callingCode]);

  const onDateSelected = (event, value) => {
    if (showDate) {
      setCurrentDate(false);
    }
    if (event?.type == "dismissed") {
      setDate(new Date());
      setDatePicker(false);
    } else {
      let dateee = moment(value).format("LL");
      setDatePicker(Platform.OS == "ios");
      if (new Date(value)?.toDateString() == newDate?.toDateString()) {
        setCurrentDate(true);
        setDate(value);
      } else {
        setCurrentDate(false);
        setDate(value);
      }
    }
  };

  const handleDatePicker = () => {
    if (!disable) {
      setDatePicker(!datePicker);
      if (Platform?.OS == "ios") {
        setDate(newDate);
        setCurrentDate(true);
      }
    } else {
      setDate(date);
    }
  };

  const onTimeSelected = (event, value) => {
    if (event?.type == "dismissed") {
      setTime(new Date());
      setDatePicker(false);
    } else {
      setCustomTimer(false);
      setDatePicked(true);
      setDatePicker(Platform.OS == "ios");
      setTime(new Date(value));
    }
  };

  let arr = [];
  const requireMessage = "This field is required";

  const selectItem = (index) => {
    if (value) {
      arr = [...value];
      if (
        value?.some((obj) =>
          obj.id ? obj.id === index.id : obj.value === index.value,
        )
      ) {
        arr = value?.filter((item) =>
          item.id ? item.id !== index.id : item.value !== index.value,
        );
      } else {
        arr.push(index);
      }
    } else {
      arr.push(index);
    }
    setOption(arr);
  };

  const handleCheckBox = (ele) => {
    let arr = [];
    if (value?.includes(ele?.value)) {
      arr = value?.filter((item) => item != ele?.value);
      setState({ ...state, value: arr });
    } else if (value?.includes(ele?.name)) {
      arr = value?.filter((item) => item != ele?.name);
      setState({ ...state, value: arr });
    } else {
      if (ele?.name) {
        value?.push(ele?.name);
      } else {
        value?.push(ele?.value);
      }
      setState({ ...state, value: value });
    }
  };

  const removeTag = (eachTag) => {
    let tagArr = [];
    tagArr = props.value.filter((item) => item != eachTag);
    setOption(tagArr);
  };

  const handleRemoveFilter = (ele) => {
    let arr = [];
    if (value?.includes(ele)) {
      arr = value?.filter((item) => item != ele);
      setState({ ...state, value: arr });
    } else {
      value?.push(ele?.value);
      setState({ ...state, value: value });
    }
  };

  const handlingCardNumber = (number) => {
    let value = number
      .replace(/\s?/g, "")
      .replace(/(\d{4})/g, "$1 ")
      .trim();
    setValue(value);
  };

  const handlingCardExpiry = (date) => {
    if (date.indexOf(".") >= 0 || date.length > 5) {
      return;
    }
    if (date.length === 2 && value.length === 1) {
      date += "/";
    }
    setValue(date);
  };

  return (
    <View style={{ ...style }}>
      {type === "phone" ? (
        <View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            {!hideVerify && (
              <>
                {/* Replaced old CountryPicker with new one */}
                <TouchableOpacity
                  onPress={() => setShowCountryPicker(true)}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    paddingLeft: 10,
                    position: "absolute",
                    zIndex: 1,
                  }}
                >
                  {selectedCountry?.flag && (
                    <Text style={{ fontSize: 20, marginRight: 4 }}>
                      {selectedCountry.flag}
                    </Text>
                  )}
                  <Text style={{ fontSize: 16 }}>
                    +{callingCode || selectedCountry?.dial_code || ""}
                  </Text>
                </TouchableOpacity>

                {/* Show the picker modal when button pressed */}
                <CountryPicker
                  show={showCountryPicker}
                  pickerButtonOnPress={(item) => {
                    setSelectedCountry(item);
                    setCallingCode(item.dial_code.replace("+", "")); // remove + sign if needed
                    setShowCountryPicker(false);
                  }}
                  // You can add more props like lang='en', popularCountries={['us', 'in']}, etc.
                />
              </>
            )}

            <InputField
              ref={ref}
              {...props}
              maxLength={13}
              value={`${value}`}
              keyboardType={"numeric"}
              icon={hideVerify ? (icon ? icon : Images?.phonIcon) : null}
              style={{ paddingLeft: hideVerify ? 15 : 100, zIndex: -1 }}
            />

            {!hideVerify && (
              <>
                {verified_status ? (
                  <Text
                    style={{
                      color: Colors?.themeColor,
                      position: "absolute",
                      right: 10,
                      fontWeight: "700",
                    }}
                  >
                    {"✓ Verified"}
                  </Text>
                ) : (
                  <TouchableOpacity
                    onPress={onVerify}
                    style={{
                      ...Styles?.smallButton,
                      position: "absolute",
                      right: 10,
                      backgroundColor: Colors?.themeColor,
                      borderRadius: 8,
                    }}
                  >
                    <Text style={{ color: Colors?.white }}>{"Verify"}</Text>
                  </TouchableOpacity>
                )}
              </>
            )}
          </View>

          {!isEmpty && (
            <ErrorMessage
              {...props}
              message={
                error
                  ? "Please enter valid phone number."
                  : isEmpty
                  ? requireMessage
                  : null
              }
            />
          )}
        </View>
      ) : type === "text" ? (
        <View>
          <InputField
            ref={ref}
            {...props}
            icon={icon}
            fontIcon={fontIcon || "account"}
          />
          {!isEmpty && (
            <ErrorMessage
              {...props}
              message={
                error
                  ? "Please enter valid input."
                  : isEmpty
                  ? requireMessage
                  : null
              }
            />
          )}
        </View>
      ) : type === "numeric" ? (
        <View>
          <InputField
            {...props}
            ref={ref}
            type={type}
            icon={icon}
            fontIcon={fontIcon}
          />
          {!isEmpty && (
            <ErrorMessage
              {...props}
              message={
                error
                  ? "Please enter valid input."
                  : isEmpty
                  ? requireMessage
                  : null
              }
            />
          )}
        </View>
      ) : type === "email" ? (
        <View>
          <InputField
            {...props}
            ref={ref}
            autoCapitalize="none"
            icon={icon ? icon : Images?.emailIcon}
            fontIcon={fontIcon}
          />
          {!isEmpty && (
            <ErrorMessage
              {...props}
              message={
                error
                  ? "Please enter valid email."
                  : isEmpty
                  ? requireMessage
                  : null
              }
            />
          )}
        </View>
      ) : type === "password" ? (
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "100%" }}>
              <InputField
                {...props}
                ref={ref}
                secureTextEntry={isVisible}
                icon={icon ? icon : null}
                fontIcon={fontIcon}
              />
            </View>

            <View style={{ justifyContent: "center", right: 15 }}>
              <TouchableOpacity
                onPress={() => setIsVisible(!isVisible)}
                style={{
                  position: "absolute",
                  right: 2,
                }}
              >
                <Ionicons
                  name={!isVisible ? "eye" : "eye-off"}
                  size={20}
                  color={Colors?.black}
                />
              </TouchableOpacity>
            </View>
          </View>
          {!isEmpty && (
            <ErrorMessage
              {...props}
              type="password"
              message={
                error
                  ? `The password must contain at least 8 character categories: Uppercase characters (A-Z), Lowercase characters (a-z), Digits (0-9), special characters`
                  : isEmpty
                  ? requireMessage
                  : null
              }
            />
          )}
        </View>
      ) : type === "confirmPassword" ? (
        <View>
          <View style={{ flexDirection: "row" }}>
            <View style={{ width: "100%" }}>
              <InputField
                {...props}
                ref={ref}
                secureTextEntry={isVisible}
                icon={icon ? icon : Images?.passwordLock}
                fontIcon={fontIcon}
              />
            </View>
            {icon ? (
              <View
                style={{ justifyContent: "center", backgroundColor: "red" }}
              >
                <TouchableOpacity
                  onPress={() => setIsVisible(!isVisible)}
                  style={{
                    position: "absolute",
                    right: 1,
                  }}
                >
                  <Ionicons
                    name={!isVisible ? "eye-outline" : "eye-off-outline"}
                    size={20}
                  />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
          {!isEmpty && (
            <ErrorMessage {...props} message={"Both password should match."} />
          )}
        </View>
      ) : type === "dropdown" ? (
        <InputField
          {...props}
          ref={ref}
          type="dropdown"
          icon={icon}
          open={open}
          setOpen={setOpen}
          selectedItem={selectedItem}
          setSelectedItem={setSelectedItem}
          onChangeText={onChangeText}
          options={options}
          fontIcon={fontIcon}
        />
      ) : type === "datePicker" ? (
        <>
          <View>
            <TouchableOpacity
              onPress={() => handleDatePicker()}
              style={{ width: "100%" }}
            >
              <InputField
                {...props}
                ref={ref}
                editable={false}
                value={
                  date
                    ? currentDate
                      ? moment(new Date(date)).format("MMM D YYYY")
                      : new Date(date)?.toDateString() ==
                        newDate?.toDateString()
                      ? ""
                      : new Date(date)?.toDateString()?.slice(4)
                    : null
                }
                isEmpty={isEmpty}
                fontIcon="calendar-month"
                type={type}
              />
            </TouchableOpacity>
          </View>
          {datePicker ? (
            <View
              style={{
                ...Styles.container,
                marginHorizontal: 0,
                width: "100%",
                marginTop: 0,
                padding: 5,
              }}
            >
              <DateTimePicker
                testID="dateTimePicker"
                maximumDate={
                  maximum
                    ? new Date()
                    : dateType == "startDate"
                    ? null
                    : dateType == "endDate"
                    ? null
                    : new Date(talentMinDate)
                }
                minimumDate={
                  currentDateDisable
                    ? new Date()
                    : minimum
                    ? new Date(minDate)
                    : dateType == "startDate"
                    ? new Date()
                    : dateType == "endDate"
                    ? new Date(startDate)
                    : null
                }
                value={Platform?.OS == "ios" ? date : new Date(date)}
                date={new Date()}
                mode={"date"}
                is24Hour={true}
                onChange={onDateSelected}
                themeVariant={"light"}
                display={Platform.OS === "ios" ? "spinner" : "spinner"}
              />
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => {
                    setDatePicker(!datePicker);
                  }}
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.themeColor,
                    marginVertical: 0,
                    alignSelf: "flex-end",
                    margin: 10,
                  }}
                >
                  <TextComponent
                    text="Done"
                    color={Colors?.white}
                    size={Sizes?.s}
                    style={{ paddingHorizontal: 5 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </>
      ) : type == "timePicker" ? (
        <>
          <TouchableOpacity
            style={{ ...style }}
            onPress={() => {
              setTime(newDate);
              setDatePicker(true);
            }}
          >
            <InputField
              {...props}
              style={{ ...style }}
              ref={ref}
              editable={false}
              value={
                showDate || datePicked
                  ? customTime && customTimer
                    ? customTime
                    : moment(new Date(time)).format("hh:mm a")
                  : null
              }
              type={type}
            />
          </TouchableOpacity>
          {datePicker && (
            <View
              style={
                Platform.OS === "ios"
                  ? {
                      ...Styles.container,
                      marginHorizontal: 0,
                      width: "100%",
                      marginTop: 0,
                      padding: 5,
                    }
                  : null
              }
            >
              {Platform?.OS == "ios" ? (
                <DateTimePicker
                  value={time}
                  mode={"time"}
                  date={newDate}
                  is24Hour={false}
                  onChange={onTimeSelected}
                  display={Platform.OS === "ios" ? "spinner" : "spinner"}
                  themeVariant={"light"}
                />
              ) : (
                <DateTimePicker
                  value={new Date(time)}
                  mode={"time"}
                  date={newDate}
                  is24Hour={false}
                  onChange={onTimeSelected}
                  display={Platform.OS === "ios" ? "spinner" : "spinner"}
                />
              )}
              {Platform.OS === "ios" && (
                <TouchableOpacity
                  onPress={() => {
                    setDatePicker(!datePicker);
                  }}
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.themeColor,
                    marginVertical: 0,
                    alignSelf: "flex-end",
                    margin: 10,
                  }}
                >
                  <TextComponent
                    text="Done"
                    color={Colors?.white}
                    size={Sizes?.s}
                    style={{ paddingHorizontal: 5 }}
                  />
                </TouchableOpacity>
              )}
            </View>
          )}
        </>
      ) : type == "description" ? (
        <TouchableOpacity
          onPress={() =>
            inputRef.current.focus ? inputRef.current.focus() : ""
          }
          style={{
            ...style,
            borderWidth: isEmpty ? 1.5 : 0.5,
            borderRadius: 18,
            borderColor: isEmpty ? Colors?.red : Colors?.darkgrey,
            paddingHorizontal: 10,
            marginHorizontal: 4,
            alignItems: "flex-start",
            height: 100,
            paddingTop: Platform.OS == "android" ? 0 : 8,
          }}
        >
          <TextInput
            {...props}
            ref={inputRef}
            onChangeText={onChangeText}
            value={value}
            multiline={true}
            placeholder={placeholder}
            autoCapitalize="sentences"
            autoFocus={autoFocus}
            style={{
              width: "100%",
            }}
          />
        </TouchableOpacity>
      ) : type == "multiselect" ? (
        <>
          <TouchableOpacity
            style={{ ...Styles?.flexRow }}
            onPress={() => setModalVisible(!isModalVisible)}
          >
            <View
              style={{
                width: "100%",
                borderWidth: isEmpty ? 1.5 : 0.5,
                borderColor: isEmpty ? Colors?.red : Colors?.darkgrey,
                paddingTop: 12,
                borderRadius: 10,
                paddingHorizontal: 10,
                paddingVertical: 6,
                marginBottom: 10,
                justifyContent: "center",
                alignContent: "center",
              }}
            >
              {value?.length == 0 ? (
                <View style={{ ...Styles?.row }}>
                  {fontIcon ? (
                    <MaterialCommunityIcons
                      name={fontIcon}
                      size={18}
                      color={Colors.darkgrey}
                      style={{
                        marginHorizontal: 4,
                        bottom: 5,
                      }}
                    />
                  ) : icon ? (
                    <Image
                      source={icon}
                      style={{
                        marginRight: 8,
                        width: 17,
                        height: 17,
                        bottom: 5,
                      }}
                    />
                  ) : null}
                  <TextComponent
                    color={Colors?.darkgrey}
                    text={placeholder}
                    size={Sizes?.s}
                    fontWeight="400"
                    style={{ marginBottom: 10, paddingHorizontal: 8 }}
                  />
                </View>
              ) : (
                <View style={{ width: "92%", ...Styles?.row }}>
                  {fontIcon ? (
                    <MaterialCommunityIcons
                      name={fontIcon}
                      size={18}
                      color={Colors.darkgrey}
                      style={{
                        marginHorizontal: 4,
                        bottom: 5,
                      }}
                    />
                  ) : icon ? (
                    <Image
                      source={icon}
                      style={{
                        marginRight: 8,
                        width: 17,
                        height: 17,
                        bottom: 5,
                      }}
                    />
                  ) : null}
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {value?.length != 0 &&
                      value?.map((item, index) => {
                        return (
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              backgroundColor: Colors?.themeColor,
                              paddingHorizontal: 10,
                              paddingVertical: 5,
                              borderRadius: 20,
                              marginHorizontal: 5,
                              marginBottom: 10,
                            }}
                            key={index}
                          >
                            <TextComponent
                              color={Colors?.white}
                              text={
                                item?.value
                                  ? item?.value
                                  : item?.name
                                  ? item?.name
                                  : item
                              }
                              size={Sizes?.xs}
                            />
                            <TouchableOpacity
                              onPress={() =>
                                filter
                                  ? handleRemoveFilter(item)
                                  : removeTag(item)
                              }
                            >
                              <Entypo
                                name="circle-with-cross"
                                size={12}
                                color={Colors.white}
                                style={{ paddingLeft: 6 }}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      })}
                  </ScrollView>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={() => setModalVisible(!isModalVisible)}
              style={{}}
            >
              <MaterialIcons
                style={{
                  bottom: 4,
                  right: 55,
                  padding: 15,
                  alignSelf: "center",
                  marginLeft: 10,
                }}
                name="arrow-drop-down"
                size={20}
              />
            </TouchableOpacity>
          </TouchableOpacity>

          <Modal
            isVisible={isModalVisible}
            style={{ position: "relative" }}
            onBackdropPress={() => setModalVisible(false)}
            onRequestClose={() => setModalVisible(false)}
          >
            <View style={styles.modalMainView}>
              <TextComponent
                text={placeholder}
                size={Sizes?.l}
                style={{ textAlign: "center", paddingBottom: 15 }}
              />
              <ScrollView showsVerticalScrollIndicator={false}>
                {options?.map((item, index) => {
                  return (
                    <View key={index} style={{ padding: 8 }}>
                      <TouchableOpacity
                        onPress={() =>
                          filter ? handleCheckBox(item) : selectItem(item)
                        }
                        style={Styles?.flexRow}
                      >
                        <TextComponent
                          text={
                            item.value
                              ? item.value
                              : item.name
                              ? item.name
                              : item
                          }
                          size={Sizes?.l}
                          fontWeight="400"
                        />
                        {value?.length != 0 ? (
                          placeholder == "Select Language" ? (
                            <MaterialIcons
                              name={
                                filter
                                  ? value?.length != 0
                                    ? value?.includes(item?.name)
                                      ? "check-box"
                                      : "check-box-outline-blank"
                                    : "check-box-outline-blank"
                                  : value?.some((obj) => obj.id == item.id)
                                  ? "check-box"
                                  : "check-box-outline-blank"
                              }
                              size={20}
                              color={
                                filter
                                  ? value?.length != 0
                                    ? value?.includes(item?.name)
                                      ? Colors?.themeColor
                                      : Colors?.darkgrey
                                    : Colors?.darkgrey
                                  : value?.some((obj) => obj.id == item.id)
                                  ? Colors?.themeColor
                                  : Colors?.darkgrey
                              }
                            />
                          ) : (
                            <MaterialIcons
                              name={
                                filter
                                  ? value?.length != 0
                                    ? value?.includes(item?.value) ||
                                      value?.includes(item?.name)
                                      ? "check-box"
                                      : "check-box-outline-blank"
                                    : "check-box-outline-blank"
                                  : value?.some(
                                      (obj) => obj.value == item.value,
                                    )
                                  ? "check-box"
                                  : "check-box-outline-blank"
                              }
                              size={20}
                              color={
                                filter
                                  ? value?.length != 0
                                    ? value?.includes(item?.value) ||
                                      value?.includes(item?.name)
                                      ? Colors?.themeColor
                                      : Colors?.darkgrey
                                    : Colors?.darkgrey
                                  : value?.some(
                                      (obj) => obj.value == item.value,
                                    )
                                  ? Colors?.themeColor
                                  : Colors?.darkgrey
                              }
                            />
                          )
                        ) : (
                          <MaterialIcons
                            name={"check-box-outline-blank"}
                            size={20}
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
              <Button
                title="Done"
                background={true}
                onPress={() => setModalVisible(false)}
              />
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
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
          </Modal>
        </>
      ) : type === "cardNumber" ? (
        <View style={{ ...style }}>
          <InputField
            {...props}
            ref={ref}
            maxLength={19}
            keyboardType={"numeric"}
            icon={icon ? icon : Images?.phonIcon}
            fontIcon={"credit-card"}
            onChangeText={(val) => handlingCardNumber(val)}
          />
          <ErrorMessage
            {...props}
            message={
              error
                ? "Please enter valid Card Number."
                : isEmpty
                ? requireMessage
                : null
            }
          />
        </View>
      ) : type === "expiryDate" ? (
        <View style={{ ...style }}>
          <InputField
            {...props}
            ref={ref}
            maxLength={5}
            keyboardType={"numeric"}
            fontIcon={"credit-card-clock"}
            onChangeText={(val) => handlingCardExpiry(val)}
          />
          <ErrorMessage
            {...props}
            message={
              error
                ? "Please enter valid Expiry Date."
                : isEmpty
                ? requireMessage
                : null
            }
          />
        </View>
      ) : type === "cvc" ? (
        <View style={{ ...style }}>
          <InputField
            {...props}
            ref={ref}
            maxLength={3}
            keyboardType={"numeric"}
            fontIcon={"code-equal"}
          />
          <ErrorMessage
            {...props}
            message={
              error
                ? "Please enter valid Expiry Date."
                : isEmpty
                ? requireMessage
                : null
            }
          />
        </View>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    padding: Sizes.xxs,
  },
  inputBox: {
    borderWidth: 0,
  },
  modalMainView: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    maxHeight: 400,
    position: "relative",
  },
  modalItemTouch: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});
