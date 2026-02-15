import React, { useEffect, useRef, useState } from "react";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { Colors, Sizes, dimensionheight } from "../Constants";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { Searchbar } from "react-native-paper";
import {
  Image,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { storageKey, storeData } from "../Utility/Storage";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";
import Entypo from "react-native-vector-icons/Entypo";
export const DropDownList = (props) => {
  const {
    value,
    options,
    setValue,
    placeholder,
    border,
    icon,
    style,
    fontIcon,
    isEmpty,
    disable,
    onPress,
    onSelect,
    setSelectedRow,
    type,
    search,
  } = props;
  const [showDropDown, setShowDropDown] = useState(false);
  const [editable, setEditable] = useState(true);
  const [optionsList, setOptionsList] = useState(options);
  const [searchQuery, setSearchQuery] = useState("");
  const optionsRef = useRef(null);
  const auth = useSelector((state) => state?.authReducer);
  const other = useSelector((state) => state?.otherReducer);

  useFocusEffect(
    React.useCallback(() => {
      setSearchQuery("");
      if (options?.length != 0) {
        setOptionsList(options);
      } else {
        setOptionsList([]);
      }
    }, [options, props])
  );

  const handleSelectOption = (item) => {
    if (type) {
      if (type == "country") {
        storeData(storageKey?.COUNTRY_ID, JSON?.stringify(item?.id));
      } else if (type == "state") {
        storeData(storageKey?.STATE_ID, JSON?.stringify(item?.id));
      }
    }

    if (onSelect) {
      onSelect();
    }
    if (setSelectedRow) {
      setSelectedRow(item);
    }

    if (item?.value) {
      setValue(item?.value);
    } else if (item) {
      setValue(item?.name);
    } else {
      null;
    }
    setShowDropDown(false);
  };
  const onChangeSearch = (query) => {
    setSearchQuery(query);

    if (options?.length != 0) {
      if (query) {
        let arr = [];
        var expr = new RegExp(query, "gi");
        var wordList = options.filter((elem, index) => expr.test(elem?.name));
        setOptionsList(wordList);
      }
    } else {
      setOptionsList(options);
    }
  };

  const handleShowDropDown = () => {
    if (onPress && !showDropDown) {
      onPress();
    }
    setShowDropDown(!showDropDown);
  };
  return (
    <>
      <TouchableOpacity
        {...props}
        onPress={() =>
          disable ? null : editable ? handleShowDropDown() : null
        }
        style={{
          ...style,
          borderWidth: isEmpty ? 1.5 : border ? 0.5 : 0.5,
          borderRadius: border ? 25 : 10,
          borderColor: isEmpty
            ? Colors?.red
            : border
            ? Colors?.darkgrey
            : Colors?.darkgrey,
          paddingHorizontal: icon ? 20 : fontIcon ? 20 : 6,
          paddingVertical: 14,
          position: "relative",
          flexDirection: "row",
          marginVertical: 8,
        }}
      >
        {icon ? (
          <Image
            source={icon}
            style={{ marginLeft: -10, marginRight: 6, width: 17, height: 17 }}
          />
        ) : fontIcon ? (
          <MaterialCommunityIcons
            name={fontIcon}
            color={Colors?.darkgrey}
            size={20}
            style={{ marginLeft: -10, marginRight: 6 }}
          />
        ) : null}
        <View style={Styles?.flexRow}>
          <TextComponent
            text={value ? value : placeholder}
            size={Sizes?.s}
            fontWeight="400"
            color={value ? Colors?.black : Colors?.darkgrey}
            style={{ paddingLeft: 4, textTransform: "capitalize" }}
          />
          <FontAwesome
            name={showDropDown ? "caret-up" : "caret-down"}
            color={Colors?.darkgrey}
            size={12}
            style={{ paddingRight: 10 }}
          />
        </View>
      </TouchableOpacity>
      {showDropDown ? (
        <>
          {options?.length == 0 ? (
            <TouchableOpacity
              style={{
                backgroundColor: Colors?.white,
                borderRadius: 10,
                padding: 10,
                width: "100%",
                shadowColor: Colors?.black,
                elevation: 5,
                shadowOffset: { width: 0, height: 10 },
                shadowOpacity: 0.2,
                alignContent: "center",
                marginTop: -9,
              }}
            >
              <View
                style={{
                  paddingVertical: 10,
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <TextComponent
                  text={"No Option Available !"}
                  size={Sizes?.s}
                  fontWeight="400"
                  color={Colors?.darkgrey}
                />
              </View>
            </TouchableOpacity>
          ) : (
            <Modal
              transparent={true}
              visible={showDropDown}
              animationType="slide"
              useNativeDriver={true}
              onRequestClose={() => setShowDropDown(false)}
            >
              <View style={styling.dropdownModal}>
                <View
                  style={{
                    ...Styles?.container,
                    maxHeight: 400,
                    padding: 20,
                  }}
                >
                  <>
                    {search ? (
                      <View style={{ ...Styles?.row }}>
                        <Searchbar
                          placeholder="Start Your Searching..."
                          onChangeText={onChangeSearch}
                          value={searchQuery}
                          loading={true}
                          icon={() => (
                            <FontAwesome name="search" color={Colors?.white} />
                          )}
                          style={{
                            borderRadius: 10,
                            marginTop: 10,
                            width: "100%",
                          }}
                          inputStyle={{
                            left: -40,
                            fontSize: Sizes?.s,
                          }}
                        />
                      </View>
                    ) : null}

                    {optionsList?.length == 0 ? (
                      <View
                        style={{
                          paddingVertical: 20,
                          flexDirection: "row",
                          justifyContent: "center",
                        }}
                      >
                        <TextComponent
                          text={"Not Found !"}
                          size={Sizes?.l}
                          color={Colors?.darkgrey}
                        />
                      </View>
                    ) : (
                      <>
                        <TouchableOpacity
                          onPress={() => {
                            setValue("");
                            setShowDropDown(false);
                          }}
                          style={{
                            padding: 10,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor:
                              value == ""
                                ? Colors?.lightThemeColor
                                : Colors?.offWhite,
                            borderRadius: 10,
                            marginVertical: 5,
                            marginTop: 20,
                          }}
                        >
                          <TextComponent
                            text={placeholder}
                            size={Sizes?.s}
                            color={Colors?.black}
                          />
                        </TouchableOpacity>
                        <ScrollView showsVerticalScrollIndicator={false}>
                          {optionsList?.length != 0 &&
                            optionsList?.map((item, index) => {
                              return (
                                <TouchableOpacity
                                  key={index}
                                  onPress={() => handleSelectOption(item)}
                                  style={{
                                    padding: 10,
                                    flexDirection: "row",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    backgroundColor:
                                      value == item?.value ||
                                      value == item?.name ||
                                      value == item?.label
                                        ? Colors?.lightThemeColor
                                        : Colors?.offWhite,
                                    borderRadius: 10,
                                    marginVertical: 2,
                                  }}
                                >
                                  <TextComponent
                                    text={
                                      item?.value
                                        ? item?.value
                                        : item?.name
                                        ? item?.name
                                        : null
                                    }
                                    size={Sizes?.s}
                                    fontWeight="400"
                                    color={Colors?.black}
                                  />
                                </TouchableOpacity>
                              );
                            })}
                        </ScrollView>
                      </>
                    )}
                  </>

                  <TouchableOpacity
                    onPress={() => {
                      setShowDropDown(false);
                      setValue(value);
                    }}
                    style={{
                      position: "absolute",
                      top: -10,
                      right: -10,
                      backgroundColor: Colors?.white,
                      borderRadius: 100,
                    }}
                  >
                    <Entypo
                      name="circle-with-cross"
                      size={35}
                      color={Colors.red}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>
          )}
        </>
      ) : other?.isLoading ? null : null}
    </>
  );
};

const styling = StyleSheet.create({
  dropdownModal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    width: "100%",
    elevation: 3,
  },
  modalMainView: {
    backgroundColor: "white",
    padding: 30,
    borderRadius: 15,
    height: dimensionheight("50%"),
    position: "relative",
  },
  headerTopView: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  logoView: {
    flexDirection: "row",
    justifyContent: "center",
  },
  logoImg: {
    width: 150,
    height: 70,
    position: "absolute",
    top: 50,
  },
  backButton: {
    position: "absolute",
    left: 0,
    top: 10,
    padding: 10,
  },
  employeeDetailView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  imageIconView: {
    marginLeft: 12,
    marginRight: 5,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.1)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    marginBottom: 20,
  },
  yesButton: {
    alignSelf: "flex-end",
    backgroundColor: Colors?.themeColor,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesButtonText: {
    color: "white",
  },
});
