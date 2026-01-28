import {
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Platform,
  ScrollView,
  Text,
  Keyboard,
} from "react-native";
import React, { useCallback, useEffect, useRef, useState } from "react";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import DateTimePicker from "@react-native-community/datetimepicker";
import CountryCodesPicker from "react-native-country-codes-picker";
import moment from "moment";
import { Sizes, Images, Colors, dimensionheight } from "../Constants";
import { Styles } from "../Styles";
import { InputField } from "./InputField";
import { ErrorMessage } from "./ErrorMessage";
import { TextComponent } from "./TextComponent";
import Modal from "react-native-modal";
import { Button } from "./Button";
import { convertTime } from "../Utility";
import { useFocusEffect } from "@react-navigation/native";

export const InputBox = (props) => {
  const {
    type,
    icon,
    value,
    placeholder,
    options,
    onChangeText,
    setDate,
    date = new Date(),
    setTime,
    time = new Date(),
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

  const [isVisible, setIsVisible] = useState(true); // password visibility
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const [timePickerVisible, setTimePickerVisible] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false); // multiselect modal
  const [countryPickerVisible, setCountryPickerVisible] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState({
    code: "US",
    dial_code: "+1",
    name: "United States",
  });

  const inputRef = useRef(null);

  const today = moment().subtract(13, "years").toDate();
  const talentMinDate = moment().subtract(14, "years").toDate();

  useEffect(() => {
    if (callingCode) {
      setSelectedCountry((prev) => ({
        ...prev,
        dial_code: `+${callingCode}`,
      }));
    }
  }, [callingCode]);

  const handleDateChange = (event, selectedDate) => {
    if (event.type === "dismissed") {
      setDatePickerVisible(false);
      return;
    }

    const newDate = selectedDate || date;
    setDate(newDate);
    setDatePickerVisible(Platform.OS === "ios");
  };

  const handleTimeChange = (event, selectedTime) => {
    if (event.type === "dismissed") {
      setTimePickerVisible(false);
      return;
    }

    const newTime = selectedTime || time;
    setTime(newTime);
    setTimePickerVisible(Platform.OS === "ios");
  };

  const handleCountrySelect = (item) => {
    setSelectedCountry(item);
    setCallingCode(item.dial_code.replace("+", ""));
    setCountryPickerVisible(false);
  };

  const togglePasswordVisibility = () => setIsVisible((prev) => !prev);

  const handlingCardNumber = (number) => {
    let cleaned = number.replace(/\s?/g, "").replace(/(\d{4})/g, "$1 ").trim();
    setValue(cleaned);
  };

  const handlingCardExpiry = (dateStr) => {
    if (dateStr.indexOf(".") >= 0 || dateStr.length > 5) return;
    let formatted = dateStr;
    if (dateStr.length === 2 && value.length === 1) {
      formatted += "/";
    }
    setValue(formatted);
  };

  const selectItem = (index) => {
    let arr = value ? [...value] : [];
    const exists = value?.some((obj) =>
      obj.id ? obj.id === index.id : obj.value === index.value
    );

    if (exists) {
      arr = arr.filter((item) =>
        item.id ? item.id !== index.id : item.value !== index.value
      );
    } else {
      arr.push(index);
    }
    setOption(arr);
  };

  const handleCheckBox = (ele) => {
    let arr = value ? [...value] : [];
    const target = ele?.value || ele?.name;

    if (arr.includes(target)) {
      arr = arr.filter((item) => item !== target);
    } else {
      arr.push(target);
    }
    setState({ ...state, value: arr });
  };

  const removeTag = (eachTag) => {
    const updated = props.value.filter((item) => item !== eachTag);
    setOption(updated);
  };

  const handleRemoveFilter = (ele) => {
    let arr = value ? [...value] : [];
    if (arr.includes(ele)) {
      arr = arr.filter((item) => item !== ele);
      setState({ ...state, value: arr });
    }
  };

  // ────────────────────────────────────────────────
  // RENDER HELPERS
  // ────────────────────────────────────────────────

  const renderPhoneInput = () => (
    <>
      <View style={{ flexDirection: "row", alignItems: "center" }}>
        {!hideVerify && (
          <TouchableOpacity
            style={{
              position: "absolute",
              left: 10,
              zIndex: 1,
              flexDirection: "row",
              alignItems: "center",
            }}
            onPress={() => setCountryPickerVisible(true)}
          >
            <Text style={{ fontSize: Sizes.m, marginRight: 4 }}>
              {selectedCountry.dial_code}
            </Text>
          </TouchableOpacity>
        )}

        <InputField
          ref={ref}
          {...props}
          maxLength={13}
          value={value}
          keyboardType="numeric"
          icon={hideVerify ? (icon ? icon : Images?.phonIcon) : null}
          style={{ paddingLeft: hideVerify ? 15 : 80, zIndex: -1 }}
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
                ✓ Verified
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
                <Text style={{ color: Colors?.white }}>Verify</Text>
              </TouchableOpacity>
            )}
          </>
        )}
      </View>

      <CountryCodesPicker
        show={countryPickerVisible}
        pickerButtonOnPress={handleCountrySelect}
        onBackdropPress={() => setCountryPickerVisible(false)}
      />

      {!isEmpty && (
        <ErrorMessage
          {...props}
          message={
            error
              ? "Please enter valid phone number."
              : isEmpty
              ? "This field is required"
              : null
          }
        />
      )}
    </>
  );

  const renderDatePicker = () => (
    <>
      <TouchableOpacity
        onPress={() => !disable && setDatePickerVisible(true)}
        style={{ width: "100%" }}
      >
        <InputField
          {...props}
          ref={ref}
          editable={false}
          value={
            date
              ? moment(date).format("MMM D, YYYY")
              : placeholder || "Select date"
          }
          isEmpty={isEmpty}
          fontIcon="calendar-month"
          type={type}
        />
      </TouchableOpacity>

      {datePickerVisible && (
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
            value={date}
            mode="date"
            is24Hour={true}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            maximumDate={
              maximum
                ? new Date()
                : dateType === "startDate" || dateType === "endDate"
                ? null
                : talentMinDate
            }
            minimumDate={
              currentDateDisable
                ? new Date()
                : minimum
                ? today
                : dateType === "startDate"
                ? new Date()
                : dateType === "endDate"
                ? startDate
                : null
            }
            onChange={handleDateChange}
            themeVariant="light"
          />

          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={() => setDatePickerVisible(false)}
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                marginVertical: 10,
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
  );

  const renderTimePicker = () => (
    <>
      <TouchableOpacity
        style={{ ...style }}
        onPress={() => {
          setTime(new Date());
          setTimePickerVisible(true);
        }}
      >
        <InputField
          {...props}
          style={{ ...style }}
          ref={ref}
          editable={false}
          value={
            time
              ? customTime && !timePickerVisible
                ? customTime
                : moment(time).format("hh:mm a")
              : null
          }
          type={type}
        />
      </TouchableOpacity>

      {timePickerVisible && (
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
          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display={Platform.OS === "ios" ? "spinner" : "default"}
            onChange={handleTimeChange}
            themeVariant="light"
          />

          {Platform.OS === "ios" && (
            <TouchableOpacity
              onPress={() => setTimePickerVisible(false)}
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                marginVertical: 10,
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
  );

  const renderMultiselect = () => (
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
          {value?.length === 0 ? (
            <View style={{ ...Styles?.row }}>
              {fontIcon ? (
                <MaterialCommunityIcons
                  name={fontIcon}
                  size={18}
                  color={Colors.darkgrey}
                  style={{ marginHorizontal: 4, bottom: 5 }}
                />
              ) : icon ? (
                <Image
                  source={icon}
                  style={{ marginRight: 8, width: 17, height: 17, bottom: 5 }}
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
                  style={{ marginHorizontal: 4, bottom: 5 }}
                />
              ) : icon ? (
                <Image
                  source={icon}
                  style={{ marginRight: 8, width: 17, height: 17, bottom: 5 }}
                />
              ) : null}
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                {value?.map((item, index) => (
                  <View
                    key={index}
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
                  >
                    <TextComponent
                      color={Colors?.white}
                      text={
                        item?.value ? item.value : item?.name ? item.name : item
                      }
                      size={Sizes?.xs}
                    />
                    <TouchableOpacity
                      onPress={() =>
                        filter ? handleRemoveFilter(item) : removeTag(item)
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
                ))}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity onPress={() => setModalVisible(!isModalVisible)}>
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
            {options?.map((item, index) => (
              <View key={index} style={{ padding: 8 }}>
                <TouchableOpacity
                  onPress={() => (filter ? handleCheckBox(item) : selectItem(item))}
                  style={Styles?.flexRow}
                >
                  <TextComponent
                    text={
                      item.value ? item.value : item.name ? item.name : item
                    }
                    size={Sizes?.l}
                    fontWeight="400"
                  />
                  {value?.length !== 0 ? (
                    <MaterialIcons
                      name={
                        value?.some((v) =>
                          typeof v === "object"
                            ? v.id === item.id || v.value === item.value
                            : v === (item.value || item.name)
                        )
                          ? "check-box"
                          : "check-box-outline-blank"
                      }
                      size={20}
                      color={
                        value?.some((v) =>
                          typeof v === "object"
                            ? v.id === item.id || v.value === item.value
                            : v === (item.value || item.name)
                        )
                          ? Colors?.themeColor
                          : Colors?.darkgrey
                      }
                    />
                  ) : (
                    <MaterialIcons name="check-box-outline-blank" size={20} />
                  )}
                </TouchableOpacity>
              </View>
            ))}
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
  );

  // ────────────────────────────────────────────────
  // MAIN RETURN
  // ────────────────────────────────────────────────

  return (
    <View style={style}>
      {type === "phone" ? (
        renderPhoneInput()
      ) : type === "datePicker" ? (
        renderDatePicker()
      ) : type === "timePicker" ? (
        renderTimePicker()
      ) : type === "multiselect" ? (
        renderMultiselect()
      ) : type === "password" ? (
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <InputField
            {...props}
            ref={ref}
            secureTextEntry={isVisible}
            icon={icon ? icon : Images?.passwordLock}
            fontIcon={fontIcon}
          />
          <TouchableOpacity
            onPress={togglePasswordVisibility}
            style={{ position: "absolute", right: 15 }}
          >
            <Ionicons
              name={isVisible ? "eye-off" : "eye"}
              size={20}
              color={Colors?.black}
            />
          </TouchableOpacity>
        </View>
      ) : type === "cardNumber" ? (
        <InputField
          {...props}
          ref={ref}
          maxLength={19}
          keyboardType="numeric"
          icon={icon ? icon : Images?.phonIcon}
          fontIcon="credit-card"
          onChangeText={handlingCardNumber}
        />
      ) : type === "expiryDate" ? (
        <InputField
          {...props}
          ref={ref}
          maxLength={5}
          keyboardType="numeric"
          fontIcon="credit-card-clock"
          onChangeText={handlingCardExpiry}
        />
      ) : type === "cvc" ? (
        <InputField
          {...props}
          ref={ref}
          maxLength={3}
          keyboardType="numeric"
          fontIcon="code-equal"
        />
      ) : (
        <InputField
          {...props}
          ref={ref}
          icon={icon}
          fontIcon={fontIcon}
          onChangeText={onChangeText}
        />
      )}

      {!isEmpty && type !== "phone" && type !== "multiselect" && (
        <ErrorMessage
          {...props}
          message={
            error
              ? `Please enter valid ${type}.`
              : isEmpty
              ? "This field is required"
              : null
          }
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  modalMainView: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    maxHeight: 400,
    position: "relative",
  },
});