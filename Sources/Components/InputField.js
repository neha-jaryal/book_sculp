import React from "react";
import {
  Image,
  Platform,
  StyleSheet,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
} from "react-native";
import { Colors, Fonts, Images, Sizes } from "../Constants";
import { Styles } from "../Styles"; 
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TextComponent } from "./TextComponent";
import { colors, Tooltip } from "react-native-elements";

export const InputField = (props) => {
  const {
    type,
    placeholder,
    value,
    onChangeText,
    maxLength,
    keyboardType,
    icon,
    arrow,

    span,
    fontIcon,
    error,
    isEmpty,
    toolTipText,
    ref,
    style,
  } = props;

  const handleToolTipAlert = () => {
    Alert.alert("", toolTipText, [
      { text: "OK", onPress: () => console.log("OK Pressed") },
    ]);
  };
  return (
    <>
      <View
        style={{
          ...style,
          ...Styles?.inputField,
          borderColor:
            (error && value) || isEmpty ? Colors?.red : Colors?.inputBorder,
          borderWidth: (error && value) || isEmpty ? 1.5 : 0.5,
        }}
      >
        <View
          style={{
            ...styling.inputView,
          }}
        >
          {fontIcon ? (
            <MaterialCommunityIcons
              name={fontIcon}
              size={20}
              color={Colors?.darkgrey}
              style={{ marginRight: 8 }}
            />
          ) : icon ? (
            <Image
              source={icon}
              style={{ marginRight: 8, width: 17, height: 17 }}
            />
          ) : null}

          {Platform?.OS == "android" ? (
            <TextInput
              {...props}
              ref={ref}
              onChangeText={onChangeText}
              value={value}
              placeholder={placeholder}
              placeholderTextColor={Colors?.darkgrey}
              maxLength={maxLength}
              keyboardType={keyboardType}
              style={{
                width: "100%",
                paddingVertical: Platform?.OS == "android" ? 8 : 15,
              }}
            />
          ) : (
            <TouchableOpacity>
              <TextInput
                {...props}
                ref={ref}
                onChangeText={onChangeText}
                value={value}
                placeholder={placeholder}
                placeholderTextColor={Colors?.darkgrey}
                maxLength={maxLength}
                keyboardType={keyboardType}
                style={{
                  paddingVertical: Platform?.OS == "android" ? 8 : 15,

                  width:
                    type === "datePicker" || type == "timePicker"
                      ? "100%"
                      : 270,
                }}
              />
            </TouchableOpacity>
          )}

          {arrow && (
            <Image
              source={Images?.downArrow}
              style={{
                position: "absolute",
                right: 10,
              }}
            />
          )}
          {toolTipText && (
            // <Tooltip
            //   backgroundColor={Colors?.pink}
            //   height={"auto"}
            //    popover={
            //     <Text
            //       style={{
            //         color: Colors?.white,
            //         // width: "90%",
            //       }}
            //     >
            //       {toolTipText}
            //     </Text>
            //   }
            // >
            <TouchableOpacity
              onPress={() => handleToolTipAlert()}
              style={{
                position: "absolute",
                right: -2,
                top: 5,
              }}
            >
              <AntDesign
                name="questioncircle"
                size={16}
                style={{
                  position: "absolute",

                  top: 0,
                  padding: 10,
                  right: 0,
                }}
                color={Colors?.darkgrey}
              />
            </TouchableOpacity>
            // {/* </Tooltip> */}
          )}
        </View>
      </View>
      {span && (
        <TextComponent
          text={span}
          color={Colors?.grey}
          fontStyle={Fonts?.Italic}
          size={Sizes?.xs}
          fontWeight="500"
          style={{ marginTop: -5, marginBottom: 5, paddingHorizontal: 10 }}
        />
      )}
    </>
  );
};

const styling = StyleSheet.create({
  buttonView: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
  },
  inputView: {
    flexDirection: "row",
    // paddingHorizontal: 8,
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
});

// type === "dropdown" ? (
//   <DropDownPicker
//     // containerStyle={{zIndex: 60}}
//     // dropDownStyle={{color:Colors?.themeColor}}
//     // dropDownStyle={{backgroundColor: '#fafafa',borderWidth:0.5,borderColor:Colors?.darkgrey}}
//     open={open}
//     value={selectedItem}
//     items={options}
//     setOpen={setOpen}
//     setValue={setSelectedItem}
//     placeholder={placeholder}
//     dropDownDirection="BOTTOM"
//     style={{
//       // right:15,
//       borderWidth: 0,
//       // borderBottomWidth: 1,
//       borderBottomColor: Colors?.darkgrey,
//       color: Colors?.black,
//       backgroundColor: "#fff",
//     }}
//     // labelStyle={{fontSize: 14, color: Colors?.themeColor}}
//     placeholderStyle={{ color: "#999" }}
//     // activeItemStyle={{color: 'red'}}
//     // activeLabelStyle={{color: 'red'}}
//     // arrowStyle={{color: '#999'}}
//     // itemStyle={{
//     //   backgroundColor: 'red',
//     // }}
//     dropDownContainerStyle={{
//       backgroundColor: "#fff",
//       borderWidth: 1,
//       borderColor: Colors?.grey,
//       paddingLeft: 20,
//       width: "100%",
//       marginLeft: -25,
//       backgroundColor: "red",
//       zIndex: 99999,
//     }}
//     textStyle={{ color: "#999" }}
//     arrowIconStyle={{ right: 10 }}
//     tickIconStyle={{ color: "red" }}
//     // searchable={true}
//     // disableBorderRadius={true}
//     // stickyHeader={true}
//     autoScroll={true}
//     // zIndex={1000}
//     listMode="SCROLLVIEW"
//     onChangeValue={(val) => onChangeText(val)}
//   />
// )
