import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, TextComponent, InputBox } from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import FontAwesome from "react-native-vector-icons/FontAwesome";
// import * as ImagePicker from "react-native-image-picker";
import ImagePicker from "react-native-image-crop-picker";
import { useFocusEffect } from "@react-navigation/native";
import { FlatList } from "react-native";
import Entypo from "react-native-vector-icons/Entypo";
import { getData, storageKey } from "../../Utility/Storage";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  getConnects,
  submitJobProposal,
} from "../../Redux/Services/OtherServices";
import { isFieldEmpty, showToast } from "../../Utility";
import { KeyboardAvoidingView } from "react-native";
export const SubmitProposal = ({ route, navigation }) => {
  const { jobDetail } = route?.params;
  const dispatch = useDispatch();
  const [totalAmount, setTotalAmount] = useState(0);
  const [coverLatter, setCoverLatter] = useState("");
  const [showDetails, setShowDetails] = useState(true);
  const [error, setError] = useState(false);
  const [serviceFee, setServiceFee] = useState("");
  const [projectCost, setProjectCost] = useState({
    grandTotal: 0,
    totalDiemPrice: 0,
  });
  const [adminShare, setAdminShare] = useState(0);
  const [files, setFiles] = useState("");
  useEffect(() => {
    if (jobDetail?.post_meta_details?._hourly_rate) {
      setTotalAmount(jobDetail?.post_meta_details?._hourly_rate);
    } else {
      setTotalAmount(jobDetail?.post_meta_details?._project_cost);
    }
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getServiceFee();
    }, []),
  );

  useEffect(() => {
    handleProposedAmount();
  }, [
    totalAmount,
    serviceFee,
    projectCost?.grandTotal,
    projectCost?.totalDiemPrice,
  ]);

  const SelectFiles = async () => {
    ImagePicker.openPicker({
      width: 1000,
      height: 1000,
      cropping: true,
      multiple: true,
      compressImageMaxWidth: 300,
      compressImageMaxHeight: 300,
      compressImageQuality: 0.5,
    }).then(async (response) => {
      if (response) {
        const result = [];
        for await (const image of response) {
          let fileIndex = image?.path?.lastIndexOf("/") + 1;
          let fileName = image?.path?.slice(fileIndex, image?.path?.length);
          const img = await ImagePicker.openCropper({
            freeStyleCropEnabled: true,
            path: image.path,
          });
          let img_obj = {
            name: fileName,
            uri: img?.path,
            type: img?.mime,
          };
          result.push(img_obj);
        }
        let arrr = [...files];
        let newArr = arrr.concat(...result);
        await setFiles(newArr);
      }
    });
  };

  const getServiceFee = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userID,
    };
    let resp = await dispatch(getConnects(body));
    if (resp?.status == 200) {
      let adminShare = resp?.results?.admin_share_percentage;
      setAdminShare(adminShare);
      handleProposedAmount(adminShare);
    }
  };
  const handleProposedAmount = async (adminCommition) => {
    let durationAmount = 0;
    if (jobDetail?.post_meta_details?._hourly_rate) {
      durationAmount =
        parseFloat(totalAmount) *
        parseFloat(jobDetail?.post_meta_details?._estimated_hours);
    } else {
      durationAmount = totalAmount;
    }
    const timeDifference =
      new Date(jobDetail?.post_meta_details?.end_date) -
      new Date(jobDetail?.post_meta_details?.starting_date);
    const daysDifference =
      Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;
    let totalDiemPrice = jobDetail?.post_meta_details
      ?.amount_of_per_diem_provided
      ? parseFloat(jobDetail?.post_meta_details?.amount_of_per_diem_provided) *
        daysDifference
      : 0;
    let amount =
      parseFloat(durationAmount) +
      parseFloat(
        jobDetail?.post_meta_details?.usage_fee
          ? jobDetail?.post_meta_details?.usage_fee
          : 0,
      );
    // console.log(
    //   "amountamountamount------",
    //   "durationAmount",
    //   durationAmount,
    //   "totalDiemPrice",
    //   totalDiemPrice,
    //   "amount",
    //   amount,
    //   "adminShare",
    //   adminShare
    // );
    setProjectCost({
      ...projectCost,
      grandTotal: amount,
      totalDiemPrice: totalDiemPrice,
    });
    let adminFee = adminShare ? adminShare : adminCommition;
    let fee = amount * (adminFee / 100);
    setServiceFee(fee);
  };
  // console.log("serviceFee------", serviceFee);
  const SubmitProposal = async () => {
    setError(true);
    if (!coverLatter) {
      showToast("Please fill the cover letter!", "error");
    } else {
      let userId = await getData(storageKey?.USER_ID);
      let total =
        parseFloat(projectCost?.grandTotal) -
        parseFloat(serviceFee) +
        parseFloat(projectCost?.totalDiemPrice);
      // parseFloat(totalAmount) +
      // parseFloat(jobDetail?.post_meta_details?.usage_fee) -
      // serviceFee +
      // parseFloat(jobDetail?.post_meta_details?.amount_of_per_diem_provided);
      let startDate = moment(
        jobDetail?.post_meta_details?.starting_date,
      ).format("DD/MM/YYYY");
      let endDate = moment(jobDetail?.post_meta_details?.end_date).format(
        "DD/MM/YYYY",
      );
      var diffDays = parseFloat(endDate) - parseFloat(startDate);
      let body = {
        user_id: JSON?.parse(userId),
        project_id: jobDetail?.profile?.ID,
        total_amount: parseFloat(total + serviceFee),
        admin_share: serviceFee,
        freelancer_share: total,
        _amt_provided:
          jobDetail?.post_meta_details?.amount_of_per_diem_provided,
        _total_work_days: parseFloat(diffDays) + 1,
        per_hour_amount: totalAmount,
        proposed_amount: totalAmount,
        estimeted_time: jobDetail?.post_meta_details?._estimated_hours,
        proposal_desc: coverLatter,
      };
      console.log("submitJobProposal body----", JSON.stringify(body));
      let res = await dispatch(submitJobProposal(body));
      if (res?.status == 200) {
        navigation?.goBack();
      }
    }
  };

  return (
    <>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 0}
        enabled={true}
      >
        <Header text={"Submit Proposal"} navigation={navigation} />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            paddingBottom: 100,
          }}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
          showsVerticalScrollIndicator={true}
          bounces={true}
        >
          <View style={Styles?.container}>
            <View style={Styles?.flexRow}>
              <TextComponent
                text={jobDetail?.profile?.post_title}
                size={Sizes?.l}
              />
            </View>
            <View style={Styles?.separator} />

            <View style={styling?.employeeDetailView}>
              <Image
                source={Images?.jobTypeIcon}
                style={styling?.imageIconView}
              />
              <TextComponent
                text={`Job Type : ${jobDetail?.fw_option[0]?.job_option}`}
                size={Sizes?.s}
                fontWeight="400"
                color={Colors?.black}
              />
              <Image
                source={Images?.watchIcon}
                style={styling?.imageIconView}
              />
              <TextComponent
                text={jobDetail?.post_meta_details?._project_type}
                size={Sizes?.s}
                fontWeight="400"
                color={Colors?.black}
              />
            </View>

            <View style={styling?.employeeDetailView}>
              <Image
                source={Images?.employeeIcon}
                style={styling?.imageIconView}
              />
              <TextComponent
                text={jobDetail?.fw_option[0]?.project_level}
                size={Sizes?.s}
                fontWeight="400"
                color={Colors?.black}
              />
              <Image source={Images?.flagIcon} style={styling?.imageIconView} />
              <TextComponent
                text={`${jobDetail?.post_meta_details?.country}`}
                size={Sizes?.s}
                fontWeight="400"
                color={Colors?.black}
              />
            </View>
          </View>

          <View style={{ ...Styles?.container }}>
            <TextComponent
              text="Total amount the client will see on your proposal"
              size={Sizes?.l}
              style={{ padding: 10 }}
            />
            <View
              style={{ ...Styles?.flexRow, width: "95%", position: "relative" }}
            >
              <InputBox
                type="numeric"
                value={totalAmount}
                placeholder="Enter Your Proposal Amount"
                onChangeText={(val) => {
                  if (val?.length) {
                    setTotalAmount(val);
                  } else {
                    setTotalAmount(0);
                  }
                }}
                icon={Images?.dollarIcon}
                keyboardType="numeric"
              />
              <TouchableOpacity
                onPress={() => setShowDetails(!showDetails)}
                style={{ position: "absolute", right: 10, top: 12 }}
              >
                <FontAwesome
                  name={showDetails ? "angle-up" : "angle-down"}
                  color={Colors?.themeColor}
                  size={25}
                />
              </TouchableOpacity>
            </View>

            {showDetails ? (
              <>
                {jobDetail?.post_meta_details?._hourly_rate &&
                !jobDetail?.post_meta_details?._project_cost ? (
                  <>
                    <View style={{ marginHorizontal: 10 }}>
                      <TextComponent
                        text={`$${totalAmount}.00 Per hour rate (for ${jobDetail?.post_meta_details?._estimated_hours} hours)`}
                        size={Sizes?.l}
                        color={Colors?.green}
                        style={{ marginTop: 6 }}
                      />
                      <TextComponent
                        text="Employer’s proposed hours and hourly rate"
                        size={Sizes?.s}
                        fontWeight="300"
                        color={Colors?.darkgrey}
                        style={{ marginTop: 4 }}
                      />
                    </View>
                    <View style={Styles?.separator} />
                  </>
                ) : null}

                <View style={{ marginHorizontal: 10 }}>
                  <TextComponent
                    text={
                      jobDetail?.post_meta_details?._hourly_rate
                        ? "$" +
                          parseFloat(totalAmount) *
                            parseFloat(
                              jobDetail?.post_meta_details?._estimated_hours,
                            )
                        : parseFloat(totalAmount)
                    }
                    size={Sizes?.l}
                    color={Colors?.green}
                  />
                  <TextComponent
                    text="Your proposed amount"
                    size={Sizes?.s}
                    fontWeight="300"
                    color={Colors?.darkgrey}
                    style={{ marginTop: 4 }}
                  />
                </View>

                <View style={Styles?.separator} />

                {jobDetail?.post_meta_details?.usage_fee ? (
                  <>
                    <View style={{ marginHorizontal: 10 }}>
                      <TextComponent
                        text={`+ $${jobDetail?.post_meta_details?.usage_fee}`}
                        size={Sizes?.l}
                        color={Colors?.green}
                      />
                      <TextComponent
                        text="Your Usage Fee"
                        size={Sizes?.s}
                        fontWeight="300"
                        color={Colors?.darkgrey}
                        style={{ marginTop: 4 }}
                      />
                    </View>
                    <View style={Styles?.separator} />
                  </>
                ) : null}

                <View style={{ marginHorizontal: 10 }}>
                  <TextComponent
                    text={`- $${parseFloat(serviceFee)}`}
                    size={Sizes?.l}
                    color={Colors?.green}
                  />
                  <TextComponent
                    text="Book Sculp Service fee"
                    size={Sizes?.s}
                    fontWeight="300"
                    color={Colors?.darkgrey}
                    style={{ marginTop: 4 }}
                  />
                </View>

                <View style={Styles?.separator} />

                <View style={{ marginHorizontal: 10 }}>
                  <TextComponent
                    text={`$${
                      parseFloat(projectCost?.grandTotal) -
                      parseFloat(serviceFee)
                    }`}
                    size={Sizes?.l}
                    color={Colors?.green}
                  />
                  <TextComponent
                    text="Amount, You’ll receive after Book Sculp service fee deduction"
                    size={Sizes?.s}
                    fontWeight="300"
                    color={Colors?.darkgrey}
                    style={{ marginTop: 4 }}
                  />
                </View>

                <View style={Styles?.separator} />

                <>
                  <View style={{ marginHorizontal: 10 }}>
                    <TextComponent
                      text={`+ $${parseFloat(projectCost?.totalDiemPrice)}`}
                      size={Sizes?.l}
                      color={Colors?.green}
                    />
                    <TextComponent
                      text="Total per diem price"
                      size={Sizes?.s}
                      fontWeight="300"
                      color={Colors?.darkgrey}
                      style={{ marginTop: 4 }}
                    />
                  </View>
                  <View style={Styles?.separator} />
                </>

                <View style={Styles?.separator} />

                <>
                  <View style={{ marginHorizontal: 10 }}>
                    <TextComponent
                      text={`$${
                        parseFloat(projectCost?.grandTotal) -
                        parseFloat(serviceFee) +
                        parseFloat(projectCost?.totalDiemPrice)
                      }`}
                      size={Sizes?.l}
                      color={Colors?.green}
                    />
                    <TextComponent
                      text="Grand Total"
                      size={Sizes?.s}
                      fontWeight="300"
                      color={Colors?.darkgrey}
                      style={{ marginTop: 4 }}
                    />
                  </View>
                  <View style={Styles?.separator} />
                </>
              </>
            ) : null}

            <InputBox
              type="description"
              value={coverLatter}
              placeholder="Add Cover Letter"
              onChangeText={(val) => setCoverLatter(val)}
              style={{ marginVertical: 8 }}
              isEmpty={error && isFieldEmpty(coverLatter)}
            />

            <TouchableOpacity
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.themeColor,
                borderWidth: 2,
                borderColor: Colors?.themeColor,
                width: "45%",
                marginVertical: 20,
              }}
              onPress={() => SubmitProposal()}
            >
              <TextComponent
                text="Send Now"
                color={Colors?.white}
                size={Sizes?.l}
                style={{ paddingVertical: 4, paddingHorizontal: 6 }}
              />
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </>
  );
};

const styling = StyleSheet.create({
  imageIconView: {
    marginLeft: 12,
    marginRight: 5,
  },
  employeeDetailView: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  head: { height: 40, textAlign: "center" },
  text: { color: Colors?.darkgrey, textAlign: "center", padding: 10 },
});
