import React, { useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  DropDownList,
  Header,
  InputBox,
  TextComponent,
} from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import * as ImagePicker from "react-native-image-picker";

export const ProjectDetails = ({ navigation }) => {
  const [status, setStatus] = useState("");
  const [projectHistory, setProjectHistory] = useState("");

  const projectStatus = [
    { label: "Hired", value: "Hired" },
    { label: "Completed", value: "Completed" },
    { label: "Cancelled", value: "Cancelled" },
  ];

  const selectProjectFiles = () => {
    let options = {
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };
    ImagePicker?.launchImageLibrary(options, (response) => {
      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ");
      } else if (response.customButton) {
        console.log("User tapped custom button: ");
      } else {
      }
    });
  };
  return (
    <>
      <Header text={"Project Details"} navigation={navigation} />
      <ScrollView>
        <View style={Styles?.container}>
          <View style={Styles?.flexRow}>
            <TextComponent text="Hiring Model" size={Sizes?.l} />
          </View>
          <TextComponent
            text="Publish by : Simran testing"
            size={Sizes?.s}
            color={Colors?.darkgrey}
            fontWeight="400"
          />
          <View style={Styles?.separator} />
          <View style={styling?.employeeDetailView}>
            <Image
              source={Images?.employeeIcon}
              style={styling?.imageIconView}
            />
            <TextComponent
              text="Beginner"
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
            />
            <Image source={Images?.flagIcon} style={styling?.imageIconView} />
            <TextComponent
              text="Asadabad/Kunar/Afghanistan"
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
            />
          </View>
          <View style={styling?.employeeDetailView}>
            <Image
              source={Images?.jobTypeIcon}
              style={styling?.imageIconView}
            />
            <TextComponent
              text="Project Type : Fixed Price"
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
            />
          </View>

          <View style={Styles?.separator} />
          <View
            style={{
              ...Styles?.flexRow,
              alignItems: "center",
              width: "85%",
              marginHorizontal: 20,
            }}
          >
            <Image
              source={Images?.anup}
              style={{
                width: dimensionheight(5),
                height: dimensionheight(5),
                borderRadius: dimensionheight(100),
              }}
            />
            <TextComponent
              text="Anup Jaryal"
              size={Sizes?.s}
              fontWeight="400"
            />

            <TextComponent
              text="Hired"
              size={Sizes?.xl}
              color={Colors?.themeColor}
              style={styling?.imageIconView}
            />
          </View>
        </View>
        <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
            marginTop: 20,
          }}
        >
          <TextComponent
            text="Hired freelancer"
            size={Sizes?.l}
            fontWeight="400"
          />
        </View>
        <View
          style={{
            ...Styles?.container,
            alignItems: "center",
          }}
        >
          <View style={{ ...Styles?.row, justifyContent: "center" }}>
            <Image source={Images?.anup} style={styling?.profileImg} />
            <View style={{ paddingHorizontal: 20 }}>
              <TextComponent
                text={"Anup Jaryal"}
                size={Sizes?.l}
                style={{ textAlign: "center" }}
              />
              <View
                style={{
                  ...Styles?.row,
                  marginVertical: 6,
                }}
              >
                {[1, 2, 3, 4, 5]?.map((item) => {
                  return (
                    <FontAwesome5
                      name="star"
                      color={Colors?.yellow}
                      size={12}
                      style={{ marginHorizontal: 2 }}
                    />
                  );
                })}
              </View>
              <TextComponent
                text={"(2260 Feedback)"}
                size={Sizes?.xs}
                color={Colors?.themeColor}
                style={{ textAlign: "center" }}
              />
              <TextComponent
                text={"1.26/5"}
                size={Sizes?.xs}
                color={Colors?.darkgrey}
                style={{ textAlign: "center" }}
              />
            </View>
          </View>

          <View style={Styles?.separator} />
          <View style={{ alignItems: "center" }}>
            <TextComponent
              text="Quoted Price"
              size={Sizes?.l}
              style={{ padding: 2 }}
            />
            <TextComponent
              text={"$100.00"}
              size={Sizes?.s}
              style={{ padding: 2 }}
            />
          </View>
          <View style={Styles?.separator} />
          <View style={{ alignItems: "center" }}>
            <MaterialCommunityIcons
              name="email"
              size={20}
              color={Colors?.darkgrey}
            />
            <TextComponent
              text="Cover Letter"
              size={Sizes?.xxs}
              style={{ padding: 2 }}
              color={Colors?.blue}
            />
          </View>
          <View style={Styles?.separator} />

          <View style={{ alignItems: "center" }}>
            <Entypo name="attachment" size={20} color={Colors?.darkgrey} />
            <TextComponent
              text={`0 file attached`}
              size={Sizes?.xxs}
              style={{ padding: 2 }}
              color={Colors?.blue}
            />
          </View>
          <View style={Styles?.separator} />
          <DropDownList
            placeholder={"Change Status"}
            value={status}
            setValue={setStatus}
            options={projectStatus}
            border={true}
            style={{ width: "90%" }}
          />
          <Button
            title="Update"
            icon={true}
            background={true}
            style={{ paddingVertical: 5 }}
          />
        </View>
        <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
            marginTop: 20,
          }}
        >
          <TextComponent
            text="Project History"
            size={Sizes?.l}
            fontWeight="400"
          />
        </View>
        <View
          style={{
            ...Styles?.container,
            alignItems: "center",
          }}
        >
          <InputBox
            type="description"
            value={projectHistory}
            placeholder="Job Description"
            onChangeText={(val) => setProjectHistory(val)}
            style={{ marginTop: 8, marginHorizontal: 0, width: "100%" }}
          />
          <TouchableOpacity
            onPress={() => selectProjectFiles()}
            style={{
              ...Styles?.flexRow,
              borderWidth: 1,
              borderColor: Colors?.themeColor,
              borderStyle: "dotted",
              borderRadius: 25,
              marginVertical: 20,
            }}
          >
            <View
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                paddingHorizontal: 20,
                marginVertical: 0,
                paddingVertical: 8,
              }}
            >
              <TextComponent
                text="Select Files"
                size={Sizes?.xs}
                fontWeight="400"
                color={Colors?.white}
              />
            </View>
          </TouchableOpacity>
          <View style={Styles?.separator} />
          <Button
            title="Invoice"
            icon={true}
            background={true}
            style={{ paddingVertical: 5 }}
            onPress={() => navigation?.navigate(routeName?.INVOICE)}
          />
          <Button
            title="Send Now"
            icon={true}
            background={true}
            style={{ paddingVertical: 5 }}
          />
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  profileImg: {
    width: dimensionheight(10),
    height: dimensionheight(10),
    borderRadius: dimensionheight(100),
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
});
