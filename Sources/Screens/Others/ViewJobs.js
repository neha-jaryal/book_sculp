import React, { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Header,
  TextComponent,
  DropDownList,
  InputBox,
  Loader,
  ReportUser,
} from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { Table, Row, Rows } from "react-native-table-component";
import { useFocusEffect } from "@react-navigation/native";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { useDispatch, useSelector } from "react-redux";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import moment from "moment";
import { getData, storageKey } from "../../Utility/Storage";
import {
  getConnects,
  getJobDetails,
  getProposalStatus,
  userFollowing,
} from "../../Redux/Services/OtherServices";
import {
  convertUTCToLocalTime,
  getAccountApproval,
  timeSince,
} from "../../Utility";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

export const ViewJobs = ({ route, navigation }) => {
  const { jobDetail, disableApply } = route?.params;
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);

  const [autherData, setAutherData] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userID, setUserID] = useState("");
  const [jobStatus, setJobStatus] = useState(false);
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [follow, setFollow] = useState(false);
  const [projectCostDetails, setProjectCostDetails] = useState({
    durationAmount: 0,
    daysDifference: 1,
    totalPerDiemPrice: 0,
    totalAmount: 0,
  });
  const tableHead = ["Start Date", "End Date"];
  const tableData = [
    [
      moment(jobDetail?.post_meta_details?.starting_date).format(
        "Do MMMM, YYYY"
      ),
      moment(jobDetail?.post_meta_details?.end_date).format("Do MMMM, YYYY"),
    ],
    [
      jobDetail?.post_meta_details?.starting_time,
      jobDetail?.post_meta_details?.end_time,
    ],
  ];
  const reasonList = [
    {
      label: "Very Slow",
      value: "very slow",
    },
    {
      label: "No Quality",
      value: "no quality",
    },
    {
      label: "No Useful",
      value: "no useful",
    },
    {
      label: "Other",
      value: "Other",
    },
  ];

  const usage = [
    { name: "Duration", value: jobDetail?.post_meta_details?.duration_usage },
    {
      name: "Media Type	",
      value: jobDetail?.post_meta_details?.media_type_usage,
    },
  ];
  useFocusEffect(
    React.useCallback(() => {
      getUserData();
      handleProposalstatus();
      getAccountApprovalStatus();
      handleJobCost();
    }, [])
  );
  const handleJobCost = () => {
    let durationAmount = 0;
    if (jobDetail?.post_meta_details?._hourly_rate) {
      durationAmount =
        parseFloat(jobDetail?.post_meta_details?._hourly_rate) *
        parseFloat(jobDetail?.post_meta_details?._estimated_hours);
    } else {
      durationAmount = jobDetail?.post_meta_details?._project_cost;
    }

    const timeDifference =
      new Date(jobDetail?.post_meta_details?.end_date) -
      new Date(jobDetail?.post_meta_details?.starting_date);
    const daysDifference =
      Math.floor(timeDifference / (1000 * 60 * 60 * 24)) + 1;

    let totalPerDiemPrice = jobDetail?.post_meta_details
      ?.amount_of_per_diem_provided
      ? parseFloat(jobDetail?.post_meta_details?.amount_of_per_diem_provided) *
        daysDifference
      : 0;

    let totalUsage = jobDetail?.post_meta_details?.usage_fee
      ? parseFloat(jobDetail?.post_meta_details?.usage_fee)
      : 0;

    let totalAmount =
      parseFloat(durationAmount) +
      parseFloat(totalPerDiemPrice) +
      parseFloat(totalUsage);
    setProjectCostDetails({
      ...projectCostDetails,
      durationAmount: durationAmount,
      daysDifference: daysDifference,
      totalPerDiemPrice: totalPerDiemPrice,
      totalAmount: totalAmount,
    });
  };
  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
  };
  const getUserData = async () => {
    let userRole = await getData(storageKey?.USER_ROLE);
    let userId = await getData(storageKey?.USER_ID);
    setUserRole(userRole);
    setUserID(userId);
    let body = {
      user_id: jobDetail?.profile?.post_author,
    };
    let res = await dispatch(getUserDetail(body));
    if (res.status == 200) {
      let data = res?.results?.post_meta_details?.user_followers;
      data?.map((item) =>
        item == userId ? setFollow(true) : setFollow(false)
      );
      setAutherData(res?.results);
    }
  };

  const handleProposalstatus = async () => {
    const userId = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userId,
      project_id: jobDetail?.profile?.ID,
    };
    let res = await dispatch(getProposalStatus(body));
    if (res?.status == 200) {
      if (res?.message == "Proposal already submitted") {
        setJobStatus(true);
      } else {
        setJobStatus(false);
      }
    }
  };

  const requirements = [
    {
      name: "Arrival Time",
      value: jobDetail?.post_meta_details?.reached_time
        ? moment(new Date(jobDetail?.post_meta_details?.reached_time)).format(
            "hh:mm a"
          )
        : "",
    },
    {
      name: "Required Gender",
      value: jobDetail?.post_meta_details?.required_gender,
    },
    { name: "Height", value: jobDetail?.post_meta_details?.height_req },
    { name: "Weight", value: jobDetail?.post_meta_details?.weight_req },
    { name: "Hair Color", value: jobDetail?.post_meta_details?.hair_color_req },
    {
      name: "Dress Shirt Size:",
      value: jobDetail?.measurement_details?.dress_shirt_size,
    },

    {
      name: "Dress Shirt Sleeve:",
      value: jobDetail?.measurement_details?.dress_shirt_sleeve,
    },
    {
      name: "Jacket:",
      value: jobDetail?.measurement_details?.jacket,
    },
  ];

  const measurementDetail = [
    {
      title: "Shirt Size :",
      name: jobDetail?.measurement_details?.shirt_size || [],
    },
    {
      title: "Pant Size :",
      name: jobDetail?.measurement_details?.pant_size || [],
    },
    {
      title: "Pant Size (Waist) :",
      name: jobDetail?.measurement_details?.pant_size_waist || [],
    },
    {
      title: "Pant Size (Length):",
      name: jobDetail?.measurement_details?.pant_size_length || [],
    },
    {
      title: "Shoe Size :",
      name: jobDetail?.measurement_details?.shoe_size || [],
    },
  ];

  const extraJobDetails = [
    {
      title: "Ethnicity :",
      name: jobDetail?.post_meta_details?.ethnicity_req || [],
    },
    {
      title: "Skills :",
      name: jobDetail?.post_meta_details?.skills_names || [],
    },
    {
      title: "Client Providers :",
      name: jobDetail?.post_meta_details?.client_provide,
    },
    {
      title: "Types of work :",
      name: jobDetail?.post_meta_details?.type_of_work,
    },
    {
      title: "Talent Arrival Required :",
      name: jobDetail?.post_meta_details?.talent_requirements,
    },
  ];

  const jobCostDetails = [
    {
      title: `Language Level`,
      name: jobDetail?.post_meta_details?._english_level,
      hide: false,
      image: Images?.chatsIcons,
    },
    {
      title: `Per hour rate for estimated ${jobDetail?.post_meta_details?._estimated_hours} hours`,
      name: jobDetail?.post_meta_details?._hourly_rate,
      hide: !jobDetail?.post_meta_details?._hourly_rate ? true : false,
      image: Images?.timerImg,
    },
    {
      title: "Total Project Budget",
      name: jobDetail?.post_meta_details?._project_cost,
      hide: jobDetail?.post_meta_details?._hourly_rate ? true : false,
      image: Images?.dollarCash,
    },
    {
      title: "Total Per diem Price",
      name: jobDetail?.post_meta_details?.amount_of_per_diem_provided
        ? projectCostDetails?.totalPerDiemPrice
        : 0,
      hide: false,
      image: Images?.dollarCash,
    },

    {
      title: "Usage Fee",
      name: jobDetail?.post_meta_details?.usage_fee
        ? jobDetail?.post_meta_details?.usage_fee
        : 0,
      hide: false,
      image: Images?.dollarCash,
    },
    {
      title: "Grand Total",
      name: projectCostDetails?.totalAmount,
      hide: false,
      image: Images?.dollarCash,
    },
    // {
    //   title: `Total Hours Amount ${jobDetail?.post_meta_details?._hourly_rate} x ${jobDetail?.post_meta_details?._estimated_hours} hours`,
    //   name: projectCostDetails?.durationAmount,
    //   hide: !jobDetail?.post_meta_details?._hourly_rate ? true : false,
    //   image: Images?.timerImg,
    // },
    // {
    //   title: `Total Diems Price ${jobDetail?.post_meta_details?.amount_of_per_diem_provided} x ${projectCostDetails?.daysDifference}`,
    //   name: projectCostDetails?.totalPerDiemPrice,
    //   hide: false,
    //   image: Images?.timerImg,
    // },
  ];

  console.log("jobDetail----", JSON.stringify(jobDetail));
  const handleFollow = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    if (!accountApproval) {
      getAccountApproval(true, navigation, auth);
    } else {
      var body = {
        action: type,
        user_id: userID,
        post_id: autherData?.user_data?.profile_id,
      };
      let res = await dispatch(userFollowing(body));
      if (res?.status == 200) {
        getUserData();
      }
    }
  };

  const handleApplyJob = async () => {
    navigation?.navigate(routeName?.SUBMIT_PROPOSAL, {
      jobDetail: jobDetail,
    });
    // let userId = await getData(storageKey?.USER_ID);
    // var body = {
    //   user_id: userId,
    //   project_id: jobDetail?.profile?.ID,
    // };
    // let res = await dispatch(getJobDetails(body));

    // if (res?.status == 200) {
    //   let jobDetail = res?.results[0];
    //   if (!jobDetail?.verification_detail?.bank_account_status) {
    //     Alert.alert(
    //       "Bank Account Required",
    //       "To submit to this job, please verify your Bank Account Details",
    //       [
    //         {
    //           text: "No",
    //           style: "cancel",
    //         },
    //         {
    //           text: "Yes",
    //           onPress: () => {
    //             navigation?.navigate(routeName?.PAYOUT_SETTING);
    //           },
    //         },
    //       ]
    //     );
    //   } else if (!jobDetail?.verification_detail?.identity_status) {
    //     Alert.alert(
    //       "Identity Verification Required",
    //       "To submit to this job, please verify your identity",
    //       [
    //         {
    //           text: "No",
    //           style: "cancel",
    //         },
    //         {
    //           text: "Yes",
    //           onPress: () => {
    //             navigation?.navigate(routeName?.IDENTITY_VERIFICATION);
    //           },
    //         },
    //       ]
    //     );
    //   } else if (!approvalStatus) {
    //     getAccountApproval(true, navigation, auth);
    //   } else {
    //     let userID = await getData(storageKey?.USER_ID);
    //     var body = {
    //       user_id: JSON.parse(userID),
    //     };
    //     let res = await dispatch(getConnects(body));
    //     if (res?.status == 200) {
    //       if (res?.results?.total_connects == 0) {
    //         Alert.alert(
    //           "Upgrade Your Plan",
    //           "You have reached the limit of job credits for the month. To apply for more jobs, please upgrade your plan.",
    //           [
    //             {
    //               text: "No",
    //               style: "cancel",
    //             },
    //             {
    //               text: "Yes",
    //               onPress: () => {
    //                 navigation?.navigate(routeName?.PACKAGES);
    //               },
    //             },
    //           ]
    //         );
    //       } else {
    //         navigation?.navigate(routeName?.SUBMIT_PROPOSAL, {
    //           jobDetail: jobDetail,
    //         });
    //       }
    //     }
    //   }
    // }
  };
  const handleEditJob = async () => {
    var body = {
      project_id: jobDetail?.profile?.ID,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      if (jobDetail?.post_meta_details?.model_type_req == "casting calls") {
        navigation?.navigate(routeName?.EDIT_CASTING_CALLS, {
          jobData: res?.results[0],
        });
      } else {
        navigation?.navigate(routeName?.EDIT_POST_JOB, {
          jobData: res?.results[0],
        });
      }
    }
  };
  const hasAnyRequirement = requirements.some(
    (item) => String(item.value || "").trim() !== ""
  );
  return (
    <>
      <Header text={"Job Details"} navigation={navigation} />
      <Loader loading={other?.isLoading} />
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={Styles?.container}>
          <View style={Styles?.flexRow}>
            <TextComponent
              text={jobDetail?.profile?.post_title}
              size={Sizes?.l}
            />
          </View>
          <View style={Styles?.separator} />

          <View style={styling?.employeeDetailView}>
            <FontAwesome5
              name="business-time"
              size={18}
              color={Colors?.darkgrey}
              style={{ marginHorizontal: 10 }}
            />
            <TextComponent
              text={`Job Type : ${jobDetail?.fw_option[0]?.job_option}`}
              size={Sizes?.s}
              fontWeight="400"
              color={Colors?.black}
            />
            <FontAwesome5
              name="clock"
              size={18}
              color={Colors?.darkgrey}
              style={{ marginHorizontal: 10 }}
            />
            <TextComponent
              text={jobDetail?.post_meta_details?._project_type}
              size={Sizes?.s}
              fontWeight="400"
              color={Colors?.black}
            />
          </View>
          <View style={styling?.employeeDetailView}>
            <FontAwesome5
              name="project-diagram"
              size={18}
              color={Colors?.darkgrey}
              style={{ marginHorizontal: 10 }}
            />
            <TextComponent
              text={jobDetail?.fw_option[0]?.project_level}
              size={Sizes?.s}
              fontWeight="400"
              color={Colors?.black}
            />
          </View>
        </View>
        <View style={{ ...Styles?.container, marginBottom: 10 }}>
          <View style={{ ...Styles?.flexRow }}>
            <TextComponent
              text={jobDetail?.profile?.post_title}
              size={Sizes?.l}
              style={{ textTransform: "capitalize" }}
              loading={other?.isLoading}
              width={150}
            />
          </View>
          {jobDetail?.profile?.post_content && (
            <TextComponent
              text={jobDetail?.profile?.post_content}
              size={Sizes?.s}
              color={Colors?.darkgrey}
              fontWeight="400"
              style={{
                marginVertical: 10,
                textTransform: "capitalize",
              }}
              loading={other?.isLoading}
              width={200}
            />
          )}
          <View style={Styles?.separator} />
          <View
            style={{
              ...Styles?.flexRow,
              paddingVertical: 6,
              paddingHorizontal: 8,
            }}
          >
            <View style={{ width: "35%" }}>
              <TextComponent
                text="Project Type:"
                size={Sizes?.s}
                style={{ paddingVertical: 4 }}
                loading={other?.isLoading}
                width={80}
              />
              <TextComponent
                text={jobDetail?.post_meta_details?._project_type}
                size={Sizes?.s}
                color={Colors?.darkgrey}
                fontWeight="400"
                style={{ textTransform: "capitalize" }}
                loading={other?.isLoading}
                width={100}
              />
            </View>
            <View
              style={{
                borderRightWidth: 0.5,
                borderColor: Colors?.grey,
                height: 40,
              }}
            />
            {jobDetail?.post_meta_details?.project_budget ||
            jobDetail?.post_meta_details?._hourly_rate ||
            jobDetail?.post_meta_details?._estimated_hours ? (
              <View style={{ paddingRight: 10, width: "40%" }}>
                <TextComponent
                  text="Project Budget:"
                  size={Sizes?.s}
                  style={{ paddingVertical: 4 }}
                  loading={other?.isLoading}
                  width={100}
                />
                <TextComponent
                  text={
                    jobDetail?.post_meta_details?._project_cost
                      ? "$" + jobDetail?.post_meta_details?._project_cost
                      : jobDetail?.post_meta_details?._hourly_rate
                      ? `$${jobDetail?.post_meta_details?._hourly_rate}  (${jobDetail?.post_meta_details?._estimated_hours} hours)`
                      : 0
                  }
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                  loading={other?.isLoading}
                  width={100}
                />
              </View>
            ) : null}
          </View>

          <View style={Styles?.separator} />
          {jobDetail?.post_meta_details?.country && (
            <>
              <View
                style={{
                  ...Styles?.row,
                  justifyContent: "center",
                }}
              >
                <FontAwesome5
                  name="flag"
                  size={18}
                  color={Colors?.lightBlue}
                  style={{ marginHorizontal: 8 }}
                />
                <TextComponent
                  text={`${jobDetail?.post_meta_details?.country}${
                    jobDetail?.post_meta_details?.city
                      ? " | " + jobDetail?.post_meta_details?.city
                      : ""
                  }`}
                  size={Sizes?.s}
                  color={Colors?.darkgrey}
                  fontWeight="400"
                  style={{ padding: 4, textAlign: "center" }}
                  loading={other?.isLoading}
                  width={200}
                />
              </View>
              <View style={Styles?.separator} />
            </>
          )}

          <View
            style={{
              ...Styles?.flexRow,
              paddingVertical: 4,
              paddingHorizontal: 8,
            }}
          >
            {jobDetail?.post_meta_details?._job_option && (
              <>
                <View style={{ width: "45%", paddingRight: 10 }}>
                  <TextComponent
                    text="Project Location :"
                    size={Sizes?.s}
                    style={{ paddingVertical: 4 }}
                    loading={other?.isLoading}
                    width={100}
                  />
                  <TextComponent
                    text={jobDetail?.post_meta_details?._job_option}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                    loading={other?.isLoading}
                    width={80}
                  />
                </View>
                <View
                  style={{
                    borderRightWidth: 0.5,
                    borderColor: Colors?.grey,
                    height: 40,
                  }}
                />
              </>
            )}
            {jobDetail?.post_meta_details?.number_of_model ? (
              <>
                <View style={{ width: "45%", paddingRight: 10 }}>
                  <TextComponent
                    text="Numbers of Model:"
                    size={Sizes?.s}
                    style={{ paddingVertical: 4 }}
                    loading={other?.isLoading}
                    width={80}
                  />
                  <TextComponent
                    text={jobDetail?.post_meta_details?.number_of_model}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                    loading={other?.isLoading}
                    width={80}
                  />
                </View>
              </>
            ) : null}
          </View>
          <View style={Styles?.separator} />

          {jobDetail?.post_meta_details?._project_duration && (
            <View
              style={{
                ...Styles?.flexRow,
                paddingVertical: 4,
                paddingHorizontal: 8,
              }}
            >
              <>
                <View style={{ width: "40%" }}>
                  <TextComponent
                    text="Project Duration"
                    size={Sizes?.s}
                    style={{ paddingVertical: 4 }}
                    loading={other?.isLoading}
                    width={80}
                  />
                  <TextComponent
                    text={jobDetail?.post_meta_details?._project_duration}
                    size={Sizes?.s}
                    color={Colors?.darkgrey}
                    fontWeight="400"
                    style={{ textTransform: "capitalize" }}
                    loading={other?.isLoading}
                    width={80}
                  />
                </View>
              </>
            </View>
          )}
          {other?.isLoading ? null : (
            <>
              <View
                style={{
                  ...Styles?.row,
                  justifyContent: "center",
                  marginTop: 10,
                }}
              >
                {jobDetail?.post_meta_details?.count_proposal != 0 &&
                autherData?.user_data?.user_id == userID ? (
                  <TouchableOpacity
                    onPress={() =>
                      navigation?.navigate(routeName?.MANAGE_PROPOSAL, {
                        project_id: jobDetail?.profile?.ID,
                      })
                    }
                    style={{
                      ...Styles?.smallButton,
                      marginVertical: 0,
                      backgroundColor: Colors?.themeColor,
                      marginRight: 5,
                    }}
                  >
                    <TextComponent
                      text={"View Proposal"}
                      color={Colors?.white}
                      size={Sizes?.s}
                      fontWeight="400"
                      style={{ paddingHorizontal: 5 }}
                    />
                  </TouchableOpacity>
                ) : null}
                {autherData?.user_data?.user_id == userID ? (
                  <TouchableOpacity
                    onPress={() => handleEditJob()}
                    style={{
                      ...Styles?.smallButton,
                      marginVertical: 0,
                      backgroundColor: Colors?.yellow,
                    }}
                  >
                    <TextComponent
                      text={"Edit"}
                      color={Colors?.black}
                      size={Sizes?.s}
                      fontWeight="400"
                      style={{ paddingHorizontal: 10 }}
                    />
                  </TouchableOpacity>
                ) : null}
                {(userRole == 11 && !jobStatus && !disableApply) ||
                (userRole == 15 && !jobStatus && !disableApply) ? (
                  <TouchableOpacity
                    style={{
                      ...Styles?.smallButton,
                      backgroundColor: Colors?.blue,
                      width: "35%",
                      alignSelf: "flex-end",
                      marginHorizontal: 10,
                    }}
                    onPress={() => handleApplyJob()}
                  >
                    <TextComponent
                      text="Apply Now"
                      color={Colors?.white}
                      size={Sizes?.s}
                    />
                  </TouchableOpacity>
                ) : null}
              </View>
              {(userRole == 11 && jobStatus) ||
              (userRole == 15 && jobStatus) ? (
                <View
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.lightThemeColor,
                    borderWidth: 0,
                    marginTop: 10,
                  }}
                >
                  <TextComponent
                    text="Proposal already submitted !"
                    color={Colors?.themeColor}
                    size={Sizes?.l}
                    style={{ paddingVertical: 2 }}
                  />
                </View>
              ) : (userRole == 11 && disableApply) ||
                (userRole == 15 && disableApply) ? (
                <View
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.lightThemeColor,
                    borderWidth: 0,
                    marginTop: 10,
                  }}
                >
                  <TextComponent
                    text="Completed"
                    color={Colors?.themeColor}
                    size={Sizes?.l}
                    style={{ paddingVertical: 2 }}
                  />
                </View>
              ) : null}
            </>
          )}
        </View>
        {jobDetail?.post_meta_details || projectCostDetails ? (
          <View style={{ ...Styles?.container, padding: 20 }}>
            <TextComponent
              text="Freelancer type Required for this project"
              size={Sizes?.l}
            />
            <View style={Styles?.separator} />

            {jobCostDetails?.map((item) => {
              return !item?.hide ? (
                <>
                  {item?.name?.length != 0 || item?.name != 0 ? (
                    <>
                      <View style={{ ...styling?.employeeDetailView }}>
                        <Image
                          source={item?.image}
                          style={styling?.imageIconView}
                        />
                        <View
                          style={{
                            marginHorizontal: 10,
                            alignContent: "center",
                          }}
                        >
                          <TextComponent
                            text={item?.name}
                            size={Sizes?.l}
                            fontWeight="400"
                            color={Colors?.themeColor}
                          />
                          <TextComponent
                            text={item?.title}
                            size={Sizes?.s}
                            fontWeight="400"
                            color={Colors?.darkgrey}
                          />
                        </View>
                      </View>
                      <View style={Styles?.separator} />
                    </>
                  ) : null}
                </>
              ) : null;
            })}
          </View>
        ) : null}

        {hasAnyRequirement && (
          <View style={Styles?.container}>
            <View style={Styles?.flexRow}>
              <TextComponent text="Project detail" size={Sizes?.l} />
            </View>

            <View style={Styles?.separator} />
            <TextComponent
              text="Requirements"
              size={Sizes?.l}
              style={{ marginHorizontal: 10, marginTop: 10 }}
            />
            <View
              style={{
                ...Styles?.container,
                width: "95%",
                marginHorizontal: 5,
                padding: 20,
              }}
            >
              {jobDetail?.post_meta_details?.age_req?.length != 0 ? (
                <>
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                      // width: "100%",
                    }}
                  >
                    <TextComponent
                      text={"Age"}
                      size={Sizes?.l}
                      fontWeight="400"
                    />
                    <View
                      style={{
                        alignItems: "center",
                        flexDirection: "row",
                        flexWrap: "wrap",
                        width: "50%",
                        justifyContent: "flex-end",
                      }}
                    >
                      {jobDetail?.post_meta_details?.age_req?.map(
                        (ele, index) => {
                          return (
                            <TextComponent
                              text={
                                ele?.value
                                  ? index ==
                                    jobDetail?.post_meta_details?.age_req
                                      ?.length -
                                      1
                                    ? ele?.value
                                    : ele?.value + ", "
                                  : index ==
                                    jobDetail?.post_meta_details?.age_req
                                      ?.length -
                                      1
                                  ? ele
                                  : ele + ", "
                              }
                              size={Sizes?.s}
                              fontWeight="400"
                              color={Colors?.darkgrey}
                              style={{
                                textAlign: "right",
                              }}
                            />
                          );
                        }
                      )}
                    </View>
                  </View>
                  <View style={Styles?.separator} />
                </>
              ) : null}

              {requirements?.map((item, index) => {
                return (
                  <>
                    {!item?.value || item?.value?.length == 0 ? null : (
                      <>
                        <View style={Styles?.flexRow}>
                          <TextComponent
                            text={item?.name}
                            size={Sizes?.s}
                            fontWeight="400"
                          />
                          <TextComponent
                            text={item?.value}
                            //{
                            //   title: "Age :",
                            //   name:
                            //     jobDetail?.post_meta_details?.age_req?.length != 0
                            //       ? jobDetail?.post_meta_details?.age_req
                            //       : [],
                            // },
                            size={Sizes?.s}
                            fontWeight="400"
                            color={Colors?.darkgrey}
                          />
                        </View>

                        <View style={Styles?.separator} />
                      </>
                    )}
                  </>
                );
              })}
              {jobDetail?.post_meta_details?._freelancer_level ==
              "Casting calls"
                ? null
                : jobDetail?.measurement_details &&
                  measurementDetail?.map((item) => {
                    return (
                      <>
                        {item?.name?.length != 0 ? (
                          <>
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",

                                // width: "100%",
                              }}
                            >
                              <TextComponent
                                text={item?.title}
                                size={Sizes?.l}
                                fontWeight="400"
                              />
                              <View
                                style={{
                                  alignItems: "center",
                                  flexDirection: "row",
                                  flexWrap: "wrap",
                                  width: "50%",
                                  justifyContent: "flex-end",
                                }}
                              >
                                {item?.name?.length != 0 ? (
                                  item?.name?.map((ele, index) => {
                                    return (
                                      <TextComponent
                                        text={
                                          index == item?.name?.length - 1
                                            ? ele?.value
                                            : ele?.value + ", "
                                        }
                                        size={Sizes?.s}
                                        fontWeight="400"
                                        color={Colors?.darkgrey}
                                        style={{
                                          textAlign: "right",
                                        }}
                                      />
                                    );
                                  })
                                ) : (
                                  <TextComponent
                                    text={item}
                                    size={Sizes?.s}
                                    fontWeight="400"
                                    color={Colors?.darkgrey}
                                    style={{
                                      textAlign: "right",
                                    }}
                                  />
                                )}
                              </View>
                            </View>
                            <View style={Styles?.separator} />
                          </>
                        ) : null}
                      </>
                    );
                  })}
            </View>
            {jobDetail?.post_meta_details?.duration_usage ||
            jobDetail?.post_meta_details?.media_type_usage?.length != 0 ? (
              <>
                <View style={Styles?.separator} />
                <TextComponent
                  text="Usage"
                  size={Sizes?.l}
                  style={{ marginHorizontal: 10, marginTop: 10 }}
                />

                <View
                  style={{
                    ...Styles?.container,
                    width: "95%",
                    marginHorizontal: 5,
                    padding: 20,
                  }}
                >
                  {jobDetail?.post_meta_details?.duration_usage ? (
                    <>
                      <View style={{ ...Styles?.flexRow }}>
                        <TextComponent
                          text={"Duration"}
                          size={Sizes?.s}
                          // fontWeight="400"
                        />

                        <TextComponent
                          text={jobDetail?.post_meta_details?.duration_usage}
                          size={Sizes?.s}
                          fontWeight="400"
                          color={Colors?.darkgrey}
                          // style={{ marginHorizontal: 10 }}
                        />
                      </View>
                      <View style={{ ...Styles?.separator }} />
                    </>
                  ) : null}
                  {jobDetail?.post_meta_details?.media_type_usage?.length !=
                  0 ? (
                    <>
                      <TextComponent text={"Media Type"} size={Sizes?.s} />
                      <ScrollView
                        showsHorizontalScrollIndicator={false}
                        horizontal
                      >
                        {jobDetail?.post_meta_details?.media_type_usage?.map(
                          (ele) => {
                            return (
                              <TouchableOpacity
                                style={{
                                  ...Styles?.smallButton,
                                  backgroundColor: Colors?.white,
                                  borderWidth: 0.8,
                                  borderColor: Colors?.darkgrey,
                                  marginRight: 10,
                                  paddingVertical: 2,
                                  paddingBottom: 2.5,
                                }}
                              >
                                <TextComponent
                                  text={ele?.value}
                                  color={Colors?.darkgrey}
                                  size={Sizes?.s}
                                  fontWeight="400"
                                  style={{ paddingHorizontal: 8 }}
                                />
                              </TouchableOpacity>
                            );
                          }
                        )}
                      </ScrollView>
                    </>
                  ) : null}
                </View>
              </>
            ) : null}

            {jobDetail?.post_meta_details?.set_custom_time?.length != 0 && (
              <>
                <View style={{ ...Styles?.separator }} />

                <TextComponent
                  text="Date And Time"
                  size={Sizes?.l}
                  style={{ margin: 5 }}
                />
                <View
                  style={{
                    ...Styles?.container,
                    marginHorizontal: 0,
                    width: "100%",
                    marginTop: 5,
                  }}
                >
                  <View
                    style={{
                      ...Styles?.flexRow,
                      marginVertical: 5,
                      alignSelf: "flex-end",
                    }}
                  >
                    <TextComponent
                      text={"Date"}
                      size={Sizes.l}
                      fontWeight="400"
                    />
                    <TextComponent
                      text={"Start Time"}
                      size={Sizes.l}
                      fontWeight="400"
                      style={{ marginLeft: 20 }}
                    />
                    <TextComponent
                      text={"End Time"}
                      size={Sizes.l}
                      fontWeight="400"
                    />
                  </View>
                  <View style={{ ...Styles?.separator }} />
                  {jobDetail?.post_meta_details?.set_custom_time?.map(
                    (item, index) => (
                      <>
                        <View
                          style={{
                            ...Styles?.flexRow,
                            alignItems: "center",
                            paddingVertical: 6,
                            alignContent: "center",
                          }}
                        >
                          <View style={{ ...Styles?.row, width: 100 }}>
                            <MaterialCommunityIcons
                              name="calendar-clock"
                              size={15}
                              color={Colors?.darkgrey}
                            />
                            <TextComponent
                              text={item?.label}
                              size={Sizes.s}
                              fontWeight="400"
                              color={Colors?.darkgrey}
                              style={{ textAlign: "center", paddingLeft: 5 }}
                            />
                          </View>
                          <TouchableOpacity
                            key={index}
                            style={{
                              ...Styles?.row,
                              width: 90,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="clock-outline"
                              size={15}
                              color={Colors?.darkgrey}
                            />
                            <TextComponent
                              text={item?.value?.format_start_time}
                              size={Sizes.s}
                              fontWeight="400"
                              color={Colors?.darkgrey}
                              style={{ textAlign: "center", paddingLeft: 3 }}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity
                            key={index}
                            style={{
                              ...Styles?.row,
                              width: 90,
                              marginRight: -8,
                            }}
                          >
                            <MaterialCommunityIcons
                              name="clock-outline"
                              size={15}
                              color={Colors?.darkgrey}
                            />

                            <TextComponent
                              // text={item?.value?.end_time}
                              text={item?.value?.format_end_time}
                              size={Sizes.s}
                              fontWeight="400"
                              color={Colors?.darkgrey}
                              style={{ textAlign: "center", paddingLeft: 3 }}
                            />
                          </TouchableOpacity>
                        </View>
                        <View style={{ ...Styles?.separator }} />
                      </>
                    )
                  )}
                </View>
              </>
            )}

            <View style={{ ...Styles?.separator, marginTop: 15 }} />

            {jobDetail?.post_meta_details?.time_zone?.length != 0 && (
              <>
                <TextComponent
                  text="Timezone :"
                  size={Sizes?.l}
                  style={{ margin: 5 }}
                />
                <ScrollView contentContainerStyle={{ ...Styles?.row }}>
                  {jobDetail?.post_meta_details?.time_zone?.map((item) => {
                    return (
                      <TouchableOpacity
                        style={{
                          borderRadius: 20,
                          backgroundColor: Colors?.white,
                          borderWidth: 0.8,
                          borderColor: Colors?.darkgrey,
                          marginHorizontal: 5,
                          marginVertical: 5,
                          paddingVertical: 2,
                          paddingBottom: 2.5,
                        }}
                      >
                        <TextComponent
                          text={item?.value}
                          color={Colors?.darkgrey}
                          size={Sizes?.s}
                          fontWeight="400"
                          style={{ paddingHorizontal: 8 }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}

            <View style={{ ...Styles?.separator }} />

            <>
              {extraJobDetails?.map((item) => {
                return (
                  <>
                    {item?.name?.length != 0 && (
                      <>
                        <TextComponent
                          text={item?.title}
                          size={Sizes?.l}
                          style={{ margin: 5 }}
                        />

                        <ScrollView
                          showsHorizontalScrollIndicator={false}
                          horizontal
                        >
                          {item?.name?.map((ele) => {
                            return (
                              <View
                                style={{
                                  borderRadius: 20,
                                  backgroundColor: Colors?.white,
                                  borderWidth: 0.8,
                                  borderColor: Colors?.darkgrey,
                                  marginHorizontal: 5,
                                  marginVertical: 5,
                                  paddingVertical: 2,
                                  paddingBottom: 2.5,
                                }}
                              >
                                <TextComponent
                                  text={ele?.value}
                                  color={Colors?.darkgrey}
                                  size={Sizes?.s}
                                  fontWeight="400"
                                  style={{ paddingHorizontal: 8 }}
                                />
                              </View>
                            );
                          })}
                        </ScrollView>
                        <View style={{ ...Styles?.separator }} />
                      </>
                    )}
                  </>
                );
              })}
            </>

            {jobDetail?.post_meta_details?.languages?.length != 0 && (
              <>
                <TextComponent
                  text="Languages Required"
                  size={Sizes?.l}
                  style={{ margin: 5 }}
                />
                <ScrollView contentContainerStyle={{ ...Styles?.row }}>
                  {jobDetail?.post_meta_details?.languages?.map((item) => {
                    return (
                      <TouchableOpacity
                        style={{
                          borderRadius: 20,
                          backgroundColor: Colors?.white,
                          borderWidth: 0.8,
                          borderColor: Colors?.darkgrey,
                          marginHorizontal: 5,
                          marginVertical: 5,
                          paddingVertical: 2,
                          paddingBottom: 2.5,
                        }}
                        onPress={() =>
                          navigation?.navigate(routeName?.VIEW_JOBS)
                        }
                      >
                        <TextComponent
                          text={item?.name}
                          color={Colors?.darkgrey}
                          size={Sizes?.s}
                          fontWeight="400"
                          style={{ paddingHorizontal: 8 }}
                        />
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>
              </>
            )}
          </View>
        )}

        <View style={Styles?.container}>
          <View style={{ ...Styles?.row, paddingVertical: 10 }}>
            <View
            // onPress={() =>
            //   navigation?.navigate(routeName?.CLIENT_PROFILE, {
            //     userId: autherData?.user_data?.user_id,
            //   })
            // }
            >
              {autherData &&
              autherData?.profile_image &&
              autherData?.profile_image?.length != 0 ? (
                <Image
                  source={{ uri: autherData?.profile_image[0]?.guid }}
                  resizeMode="cover"
                  style={{
                    width: 70,
                    height: 70,
                    borderRadius: 100,
                    borderWidth: 2,
                    borderColor: Colors?.lightBlue,
                  }}
                />
              ) : (
                <FontAwesome
                  name={"user-circle-o"}
                  size={70}
                  color={Colors?.themeColor}
                  style={{
                    marginHorizontal: 10,
                  }}
                />
              )}
            </View>
            <View style={{ marginLeft: 20 }}>
              <TextComponent
                text={`Posted by ${autherData?.user_data?.full_name}`}
                size={Sizes?.s}
              />
              {autherData?.user_data?.user_id != userID && (
                <TouchableOpacity
                  onPress={() =>
                    follow ? handleFollow("unfollow") : handleFollow("follow")
                  }
                  style={{
                    ...Styles?.smallButton,
                    backgroundColor: Colors?.white,
                    backgroundColor: Colors?.themeColor,
                  }}
                >
                  <TextComponent
                    text={follow ? "Following" : "+ Follow"}
                    color={Colors?.white}
                    size={Sizes?.xs}
                  />
                </TouchableOpacity>
              )}
            </View>
          </View>
          <View style={Styles?.separator} />
          {/* <TextComponent
            text="Share this project"
            size={Sizes?.l}
            style={{ margin: 5 }}
          />
          <View style={{ ...styling?.employeeDetailView }}>
            <Image
              source={Images?.linkedInIcon}
              style={{ marginHorizontal: 15 }}
            />
            <TextComponent
              text="Share On linkedin"
              color={Colors?.black}
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          <View style={{ ...styling?.employeeDetailView }}>
            <Image
              source={Images?.facebookIcon}
              style={{ marginHorizontal: 15 }}
            />
            <TextComponent
              text="Share On Facebook"
              color={Colors?.black}
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          <View style={{ ...styling?.employeeDetailView }}>
            <Image
              source={Images?.twitterIcon}
              style={{ marginHorizontal: 15 }}
            />
            <TextComponent
              text="Share On Twitter"
              color={Colors?.black}
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>
          <View style={{ ...styling?.employeeDetailView }}>
            <Image
              source={Images?.pinteristIcon}
              style={{ marginHorizontal: 15 }}
            />
            <TextComponent
              text="Share On Pintrest"
              color={Colors?.black}
              size={Sizes?.s}
              fontWeight="400"
            />
          </View>   */}
          <ReportUser
            type="freelancer"
            reasonList={reasonList}
            reportUserID={jobDetail?.profile?.post_author}
          />
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
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

{
  /* <View style={Styles?.container}>
<TextComponent
  text="Freelancer type Required for this project"
  size={Sizes?.l}
  style={{ padding: 10 }}
/>
{jobDetail?.post_meta_details?._hourly_rate &&
jobDetail?.post_meta_details?._estimated_hours ? (
  <View style={{ ...styling?.employeeDetailView }}>
    <Image
      source={Images?.dollarCash}
      style={styling?.imageIconView}
    />
    <View style={{ marginHorizontal: 10 }}>
      {jobDetail?.post_meta_details?._hourly_rate && (
        <TextComponent
          text={jobDetail?.post_meta_details?._hourly_rate}
          size={Sizes?.l}
          color={Colors?.green}
        />
      )}

      {jobDetail?.post_meta_details?._estimated_hours && (
        <TextComponent
          text={`Per hour rate for estimated ${jobDetail?.post_meta_details?._estimated_hours} hours`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.darkgrey}
          style={{ marginTop: 4 }}
        />
      )}
    </View>
  </View>
) : null}
<View style={Styles?.separator} />
{jobDetail?.post_meta_details?.amount_of_per_diem_provided ? (
  <>
    <View style={{ ...styling?.employeeDetailView }}>
      <Image
        source={Images?.timerImg}
        style={styling?.imageIconView}
      />
      <View style={{ marginHorizontal: 10 }}>
        <TextComponent
          text={
            jobDetail?.post_meta_details?.amount_of_per_diem_provided
          }
          size={Sizes?.l}
          color={Colors?.green}
        />
        <TextComponent
          text="Per diem Price"
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.darkgrey}
          style={{ marginTop: 4 }}
        />
      </View>
    </View>
    <View style={Styles?.separator} />
  </>
) : null}

<View style={Styles?.separator} />
{jobDetail?.post_meta_details?.usage_fee ? (
  <>
    <View style={{ ...styling?.employeeDetailView }}>
      <Image
        source={Images?.timerImg}
        style={styling?.imageIconView}
      />
      <View style={{ marginHorizontal: 10 }}>
        <TextComponent
          text={jobDetail?.post_meta_details?.usage_fee}
          size={Sizes?.l}
          color={Colors?.green}
        />
        <TextComponent
          text="Usage Fee"
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.darkgrey}
          style={{ marginTop: 4 }}
        />
      </View>
    </View>
    <View style={Styles?.separator} />
  </>
) : null}
{jobDetail?.post_meta_details?._hourly_rate &&
jobDetail?.post_meta_details?._estimated_hours &&
jobDetail?.post_meta_details?.amount_of_per_diem_provided ? (
  <>
    <View style={{ ...styling?.employeeDetailView }}>
      <Image
        source={Images?.dollarCash}
        style={styling?.imageIconView}
      />
      <View style={{ marginHorizontal: 10 }}>
        <TextComponent
          text={total}
          size={Sizes?.l}
          color={Colors?.green}
        />
        <TextComponent
          text="Total"
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.darkgrey}
          style={{ marginTop: 4 }}
        />
      </View>
    </View>
    <View style={Styles?.separator} />
  </>
) : null}
<View style={{ ...styling?.employeeDetailView }}>
  <Image source={Images?.chatsIcons} style={styling?.imageIconView} />
  <View style={{ marginHorizontal: 10 }}>
    <TextComponent
      text="Language Level"
      size={Sizes?.l}
      color={Colors?.green}
    />
    <TextComponent
      text={jobDetail?.post_meta_details?._english_level}
      size={Sizes?.s}
      fontWeight="400"
      color={Colors?.darkgrey}
      style={{ marginTop: 4 }}
    />
  </View>
</View>
<View style={Styles?.separator} />
<View style={{ ...styling?.employeeDetailView }}>
  <Image source={Images?.documents} style={styling?.imageIconView} />
  <View style={{ marginHorizontal: 10 }}>
    <TextComponent
      text={`${
        jobDetail?.post_meta_details?.count_proposal
          ? jobDetail?.post_meta_details?.count_proposal
          : 0
      } Proposals`}
      size={Sizes?.l}
      color={Colors?.green}
    />
    <TextComponent
      text={`Received till ${moment(new Date()).format(
        "Do MMMM, YYYY"
      )}`}
      size={Sizes?.s}
      fontWeight="400"
      color={Colors?.darkgrey}
      style={{ marginTop: 4 }}
    />
  </View>
</View>
</View> */
}
