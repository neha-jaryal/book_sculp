import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Header, Loader, TextComponent } from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import { useDispatch, useSelector } from "react-redux";
import {
  getJobDetails,
  getProposalListing,
} from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { useFocusEffect } from "@react-navigation/native";

export const ManageProposal = ({ route, navigation }) => {
  const { project_id } = route?.params;
  const other = useSelector((state) => state?.otherReducer);
  const [proposalData, setProposalData] = useState([]);
  const [proposalStatus, setProposalStatus] = useState("");
  const [expendView, setExpendView] = useState(false);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      getProposalsList();
    }, [navigation, route])
  );
  const getProposalsList = async () => {
    let userId = await getData(storageKey?.USER_ID);
    let body = {
      user_id: userId,
      project_id: project_id,
      get_result: "proposal",
    };
    let res = await dispatch(getProposalListing(body));
    if (res?.status == 200) {
      if (res?.results && res?.results?.length != 0) {
        setProposalData(res?.results.reverse());
        res?.results?.map((item) => {
          if (item?.proposal_details?.proposal_status == "hired") {
            setProposalStatus("hired");
          }
        });
      } else {
        setProposalData([]);
      }
    }
  };

  const handleViewJob = async (item) => {
    var body = {
      project_id: item?.profile?.ID,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.VIEW_JOBS, {
        jobDetail: res?.results[0],
      });
    }
  };
  const handleSingleChat = async (item) => {
    var receiverData = {
      id: item?.basic?.post_author,
      user_name: item?.proposal_details?.display_name,
      profile_image: [{ guid: item?.proposal_details?.profile_image }],
    };
    console.log("itemmmmmm-------", JSON.stringify(item));
    let userId = await getData(storageKey?.USER_ID);
    let res = await dispatch(getUserDetail({ user_id: userId }));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.CHAT, {
        senderId: userId,
        receiverId: item?.basic?.post_author,
        senderData: res?.results,
        receiverData: receiverData,
      });
    }
  };
  console.log("proposalData------", proposalData);
  return (
    <>
      <Header text={"Manage Proposals"} navigation={navigation} />
      <Loader loading={other?.isLoading} />
      {other?.isLoading ? null : (
        <ScrollView>
          {/* <View style={Styles?.container}>
          <View style={Styles?.flexRow}>
            <TextComponent
              text={jobData?.profile?.post_title}
              size={Sizes?.l}
            />
          </View>
          {jobData?.profile?.post_content && (
            <TextComponent
              text={` ${jobData?.profile?.post_content}`}
              size={Sizes?.s}
              color={Colors?.darkgrey}
              fontWeight="400"
            />
          )}
          <View style={Styles?.separator} />
          <View style={styling?.employeeDetailView}>
            <Image
              source={Images?.employeeIcon}
              style={styling?.imageIconView}
            />
            <TextComponent
              text={jobData?.profile?.post_title}
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
            />
            <Image source={Images?.flagIcon} style={styling?.imageIconView} />
            <TextComponent
              text={`${jobData?.post_meta_details?.country} ${jobData?.post_meta_details?.state} ${jobData?.post_meta_details?.city}`}
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
            />
          </View>
          <View style={{ ...styling?.employeeDetailView, marginVertical: 10 }}>
            <Image
              source={Images?.jobTypeIcon}
              style={styling?.imageIconView}
            />
            <TextComponent
              text={`Project Type : ${jobData?.post_meta_details?._project_type}`}
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
            />
            <TextComponent
              text={`Purposals  : ${jobData?.post_meta_details?.proposal_count}`}
              size={Sizes?.s}
              fontWeight="300"
              color={Colors?.black}
              style={styling?.imageIconView}
            />
          </View>

          <View style={Styles?.separator} />
          <Button
            title="Preview Project"
            icon={true}
            background={true}
            onPress={() => handleViewJob(jobData)}
            style={{ paddingVertical: 5 }}
          />
        </View> */}
          <View
            style={{
              ...Styles?.container,
              ...Styles?.headingView,
              marginTop: 20,
            }}
          >
            <TextComponent
              text="Received Proposals"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          {proposalData?.map((item) => {
            return (
              <View
                style={{
                  ...Styles?.container,
                  alignItems: "center",
                }}
              >
                <View style={{ ...Styles?.row, justifyContent: "center" }}>
                  <Image
                    source={{ uri: item?.proposal_details?.profile_image }}
                    style={styling?.profileImg}
                  />
                  <View style={{ paddingHorizontal: 20 }}>
                    <TextComponent
                      text={item?.proposal_details?.full_name}
                      size={Sizes?.l}
                      style={{
                        textAlign: "center",
                        textTransform: "capitalize",
                      }}
                    />
                    {item?.proposal_details?.proposal_status == "hired" ? (
                      <TextComponent
                        text="Hired"
                        color={Colors?.themeColor}
                        size={Sizes?.l}
                        style={{
                          textAlign: "center",
                          textTransform: "capitalize",
                          paddingVertical: 5,
                        }}
                      />
                    ) : null}
                    {/* <TextComponent
                    text={"(2260 Feedback)"}
                    size={Sizes?.xs}
                    color={Colors?.themeColor}
                    style={{ textAlign: "center" }}
                  /> */}
                    {/* <TextComponent
                    text={"1.26/5"}
                    size={Sizes?.xs}
                    color={Colors?.darkgrey}
                    style={{ textAlign: "center" }}
                  /> */}
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
                    text={`$${item?.proposal_details?.proposal_amount}`}
                    size={Sizes?.s}
                    style={{ padding: 2 }}
                  />
                </View>
                <View style={Styles?.separator} />
                {item?.proposal_details?.cover_letter ? (
                  <>
                    <TouchableOpacity
                      style={{ alignItems: "center" }}
                      onPress={() => setExpendView(!expendView)}
                    >
                      {/* <MaterialCommunityIcons
                  name="email"
                  size={20}
                  color={Colors?.darkgrey}
                />
                <TextComponent
                  text="Cover Letter"
                  size={Sizes?.xs}
                  style={{ padding: 2 }}
                  color={Colors?.blue}
                /> */}
                      <TextComponent
                        text={item?.proposal_details?.cover_letter}
                        // text={
                        //   "Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document or a typeface without relying on meaningful content. Lorem ipsum may be used as a placeholder before final copy is available."
                        // }
                        size={Sizes?.xs}
                        style={{ padding: 2 }}
                        color={Colors?.darkgrey}
                        numberOfLines={expendView ? 0 : Math.floor(2.5)}
                        fontWeight="400"
                      />
                      {item?.proposal_details?.cover_letter?.length > 50 && (
                        <TouchableOpacity
                          style={{ alignItems: "center" }}
                          onPress={() => setExpendView(!expendView)}
                        >
                          <TextComponent
                            text={expendView ? "Less" : "...Show More"}
                            size={Sizes?.xs}
                            color={Colors?.blue}
                            numberOfLines={expendView ? 0 : Math.floor(2.5)}
                            fontWeight="400"
                          />
                        </TouchableOpacity>
                      )}
                    </TouchableOpacity>
                    <View style={Styles?.separator} />
                  </>
                ) : null}

                {/* <View style={{ alignItems: "center" }}>
                <Entypo name="attachment" size={20} color={Colors?.darkgrey} />
                <TextComponent
                  text={`0 file attached`}
                  size={Sizes?.xxs}
                  style={{ padding: 2 }}
                  color={Colors?.blue}
                />
              </View>
              <View style={Styles?.separator} /> */}
                <View style={{ ...Styles?.row, justifyContent: "center" }}>
                  <TouchableOpacity
                    style={{
                      ...Styles?.smallButton,
                      backgroundColor: Colors?.pink,
                      width: "28%",
                      margin: 4,
                      borderRadius: 6,
                    }}
                    onPress={() => handleSingleChat(item)}
                  >
                    <TextComponent
                      text={"Chat Now"}
                      color={Colors?.white}
                      size={Sizes?.s}
                    />
                  </TouchableOpacity>

                  {item?.proposal_details?.proposal_status == "hired" ? (
                    <TouchableOpacity
                      // onPress={() => navigation?.navigate(routeName?.FEEDBACK)}
                      onPress={() =>
                        navigation?.navigate(routeName?.FEEDBACK, {
                          proposalId: item?.basic?.ID,
                          projectId: item?.proposal_details?.project_id,
                          proposal_status: proposalStatus,
                          // item?.proposal_details?.proposal_status,
                        })
                      }
                      style={{
                        ...Styles?.smallButton,
                        backgroundColor: Colors?.themeColor,
                        width: "45%",
                        margin: 4,
                        borderRadius: 6,
                      }}
                    >
                      <TextComponent
                        text="Complete and Pay"
                        color={Colors?.white}
                        size={Sizes?.s}
                      />
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() =>
                        navigation?.navigate(routeName?.CHECKOUT, {
                          proposalId: item?.basic?.ID,
                          projectId: item?.proposal_details?.project_id,
                          proposal_status: proposalStatus,
                          // item?.proposal_details?.proposal_status,
                        })
                      }
                      style={{
                        ...Styles?.smallButton,
                        backgroundColor: Colors?.themeColor,
                        width: "40%",
                        margin: 4,
                        borderRadius: 6,
                      }}
                    >
                      <TextComponent
                        text="View Details"
                        color={Colors?.white}
                        size={Sizes?.s}
                      />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}

          {/* <View
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
            <Image source={Images?.nehaAnup} style={styling?.profileImg} />
            <View style={{ paddingHorizontal: 20 }}>
              <TextComponent
                text={"Anup Jaryal"}
                size={Sizes?.l}
                style={{ textAlign: "center" }}
              />
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
          <View style={{ ...Styles?.row, justifyContent: "center" }}>
            <TouchableOpacity
              style={{
                ...Styles?.smallButton,
                backgroundColor: Colors?.pink,
                width: "50%",
                margin: 4,
                borderRadius: 6,
              }}
              onPress={() => navigation?.navigate(routeName?.PROJECT_DETAILS)}
            >
              <TextComponent
                text={"View History"}
                color={Colors?.white}
                size={Sizes?.s}
              />
            </TouchableOpacity>
          </View>
        </View> */}
          <View style={{ height: 40 }} />
        </ScrollView>
      )}
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
