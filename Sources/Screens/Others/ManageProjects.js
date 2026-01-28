import React, { useState } from "react";
import {
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import {
  Button,
  Header,
  Loader,
  NoDataFound,
  TextComponent,
} from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useDispatch, useSelector } from "react-redux";
import {
  getJobDetails,
  getLatestProposals,
  getModelProjects,
  getProposalListing,
} from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { GET_MODEL_ONGOING_JOBS } from "../../API Services/Url";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { Searchbar } from "react-native-paper";
import { useFocusEffect } from "@react-navigation/native";

export const ManageProjects = ({ route, navigation }) => {
  const other = useSelector((state) => state?.otherReducer);
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [tab, setTab] = useState("proposals");
  const [proposalList, setProposalList] = useState("");
  const [projectList, setProjectList] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [emptyList, setEmptyList] = useState(false);
  const onChangeSearch = (query) => setSearchQuery(query);

  const handleViewJob = async (item) => {
    var body = {
      project_id: item?.profile?.ID,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.VIEW_JOBS, {
        jobDetail: res?.results[0],
        disableApply: tab == "completed" ? true : false,
      });
    }
  };
  const options = [
    {
      name: "Proposals",
      type: "proposals",
      onPress: () => getLatestProposalsList(),
    },
    {
      name: "Ongoing Projects",
      type: "ongoing",
    },
    {
      name: "Completed Projects",
      type: "completed",
    },
    // {
    //   name: "Cancelled Projects",
    //   type: "cancelled",
    // },
  ];

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.prevRoute == routeName?.CHECKOUT) {
        setTab(route?.params?.tab);
        getProjectList(route?.params?.tab);
      } else {
        getLatestProposalsList();
      }
    }, [])
  );

  const getLatestProposalsList = async () => {
    let userID = await getData(storageKey?.USER_ID);
    let body = {
      user_id: userID,
    };
    let res = await dispatch(getLatestProposals(body));
    if (res?.status == 200) {
      setProposalList(res?.results);
      if (res?.results?.length == 0) {
        setEmptyList(true);
      } else {
        setEmptyList(false);
      }
    }
  };
  const getProjectList = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    var userbody = {
      user_id: JSON?.parse(userID),
    };
    let userRes = await dispatch(getUserDetail(userbody));
    if (userRes?.status == 200) {
      var body = {
        user_id: userID,
        profile_id: userRes?.results?.user_data?.profile_id,
        job_status: type,
      };
      let res = await dispatch(getModelProjects(body));
      if (res?.status == 200) {
        setProjectList(res?.results);
        if (res?.results?.length == 0) {
          setEmptyList(true);
        } else {
          setEmptyList(false);
        }
      }
    }
  };
  const getProposalsList = async (item) => {
    let body = {
      project_id: item?.profile?.ID,
      get_result: "proposal",
    };
    let res = await dispatch(getProposalListing(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.MANAGE_PROPOSAL, {
        jobData: item,
        proposalData: res?.results,
      });
    }
  };
  const handleEditProposal = async (item) => {
    var body = {
      project_id: item?.project_id,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.EDIT_SUBMIT_PROPOSAL, {
        jobDetail: res?.results[0],
        proposalId: item?.proposal_id,
        proposed_amount: item?.amount,
        route_name: routeName?.EDIT_SUBMIT_PROPOSAL,
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

  console.log("projectListprojectList------", projectList, emptyList);
  return (
    <>
      <Header text={"Manage Projects"} navigation={navigation} />
      <Loader loading={other?.isLoading} />

      <ScrollView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{
            marginTop: 15,
            marginHorizontal: 10,
          }}
        >
          {options?.map((item, index) => {
            return (
              <TouchableOpacity
                onPress={() => {
                  item?.onPress ? item?.onPress() : getProjectList(item?.type);
                  setTab(item?.type);
                }}
                style={{
                  ...Styles?.smallButton,
                  backgroundColor:
                    tab == item?.type ? Colors?.themeColor : Colors?.white,
                  marginRight: 10,
                }}
              >
                <TextComponent
                  text={item?.name}
                  color={tab == item?.type ? Colors?.white : Colors?.black}
                  size={Sizes?.s}
                  fontWeight="400"
                  style={{ paddingHorizontal: 10 }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {tab == "proposals" ? (
          proposalList?.length != 0 ? (
            <>
              <View
                style={{
                  ...Styles?.container,
                  ...Styles?.row,
                  ...Styles?.headingView,
                }}
              >
                <TextComponent
                  text="Submitted proposals"
                  size={Sizes?.l}
                  fontWeight="400"
                />
              </View>

              {/* <Searchbar
                placeholder="Search by title..."
                onChangeText={onChangeSearch}
                value={searchQuery}
                loading={true}
                style={{
                  borderRadius: 10,
                  marginHorizontal: 20,
                  marginTop: 20,
                }}
              /> */}

              {proposalList?.map((item) => {
                return (
                  <View
                    style={{
                      ...Styles?.container,
                      alignItems: "center",
                    }}
                  >
                    <TextComponent
                      text={item?.post_title}
                      size={Sizes?.s}
                      fontWeight="400"
                      style={{ textAlign: "center" }}
                    />
                    <View style={Styles?.separator} />
                    <View style={{ alignItems: "center" }}>
                      <TextComponent
                        text="Quoted Price"
                        size={Sizes?.l}
                        style={{ padding: 2 }}
                        fontWeight="400"
                      />
                      <TextComponent
                        text={`$${item?.amount}`}
                        size={Sizes?.s}
                        style={{ padding: 2 }}
                      />
                      {item?.fw_options?.estimeted_time && (
                        <TextComponent
                          text={`Estimated hours (${item?.fw_options?.estimeted_time})`}
                          size={Sizes?.xs}
                          style={{ padding: 2 }}
                          color={Colors?.blue}
                        />
                      )}
                      {item?.fw_options?.per_hour_amount && (
                        <TextComponent
                          text={`Amount per hour (${item?.fw_options?.per_hour_amount})`}
                          size={Sizes?.xs}
                          style={{ padding: 2 }}
                          color={Colors?.blue}
                        />
                      )}
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
                        size={Sizes?.xs}
                        style={{ padding: 2 }}
                        color={Colors?.blue}
                      />
                    </View>
                    <View style={Styles?.separator} />
                    {item?.files && (
                      <>
                        <View style={{ alignItems: "center" }}>
                          <Entypo
                            name="attachment"
                            size={20}
                            color={Colors?.darkgrey}
                          />
                          <TextComponent
                            text={`${item?.files} file attached`}
                            size={Sizes?.xs}
                            style={{ padding: 2 }}
                            color={Colors?.blue}
                          />
                        </View>
                        <View style={Styles?.separator} />
                      </>
                    )}

                    <View style={{ ...Styles?.row, justifyContent: "center" }}>
                      <TouchableOpacity
                        style={{
                          ...Styles?.smallButton,
                          backgroundColor:
                            item?.status == "Pending" ||
                            item?.status == "pending"
                              ? Colors?.pink
                              : item?.status == "Cancelled"
                              ? Colors?.red
                              : Colors?.themeColor,
                          width: "35%",
                          margin: 4,
                          borderRadius: 6,
                        }}
                        onPress={() => handleEditProposal(item)}
                      >
                        <TextComponent
                          text={
                            item?.status == "Pending" ||
                            item?.status == "pending"
                              ? "Edit Proposal"
                              : item?.status == "Cancelled"
                              ? "Cancelled"
                              : "Completed"
                          }
                          color={Colors?.white}
                          size={Sizes?.s}
                        />
                      </TouchableOpacity>

                      {item?.status == "Pending" ||
                      item?.status == "pending" ? (
                        <View
                          style={{
                            ...Styles?.smallButton,
                            backgroundColor: Colors?.grey,
                            width: "28%",
                            margin: 4,
                            borderRadius: 6,
                          }}
                        >
                          <TextComponent
                            text="Pending"
                            color={Colors?.white}
                            size={Sizes?.s}
                          />
                        </View>
                      ) : null}
                    </View>
                  </View>
                );
              })}
            </>
          ) : other?.isLoading ? null : (
            <NoDataFound emptyList={emptyList} />
          )
        ) : projectList?.length != 0 ? (
          projectList?.map((item) => {
            return (
              <>
                <TouchableOpacity style={Styles?.container}>
                  <View style={Styles?.flexRow}>
                    <TextComponent
                      text={item?.profile?.post_title}
                      size={Sizes?.l}
                    />
                  </View>
                  {item?.profile?.post_content && (
                    <TextComponent
                      text={` ${item?.profile?.post_content}`}
                      size={Sizes?.s}
                      color={Colors?.darkgrey}
                      fontWeight="400"
                    />
                  )}

                  <View style={Styles?.separator} />

                  <View style={styling?.employeeDetailView}>
                    <TextComponent
                      text={"Publish By :"}
                      size={Sizes?.s}
                      style={{ marginHorizontal: 8 }}
                      color={Colors?.darkgrey}
                    />
                    <TextComponent
                      text={`${item?.post_meta_details?.published_by}`}
                      size={Sizes?.l}
                    />
                  </View>
                  <View style={Styles?.separator} />

                  {item?.post_meta_details?.country ||
                  item?.post_meta_details?.city ? (
                    <View style={styling?.employeeDetailView}>
                      <FontAwesome
                        name="flag"
                        size={20}
                        color={Colors?.darkgrey}
                        style={{ marginHorizontal: 10 }}
                      />

                      <TextComponent
                        text={`${item?.post_meta_details?.country} | ${item?.post_meta_details?.city}`}
                        size={Sizes?.s}
                        fontWeight="400"
                        color={Colors?.black}
                      />
                    </View>
                  ) : null}

                  <View style={{ ...styling?.employeeDetailView }}>
                    <FontAwesome5
                      name="business-time"
                      size={18}
                      color={Colors?.darkgrey}
                      style={{ marginHorizontal: 10 }}
                    />
                    <TextComponent
                      text={`Project Type : ${item?.post_meta_details?._project_type}`}
                      size={Sizes?.s}
                      fontWeight="400"
                      color={Colors?.black}
                      style={{ textTransform: "capitalize" }}
                    />
                  </View>
                  <View style={Styles?.separator} />
                  {tab == "ongoing" ? (
                    <View
                      style={{ ...Styles?.row, justifyContent: "flex-start" }}
                    >
                      {item?.post_meta_details?.proposal_count != 0 ? (
                        <TouchableOpacity
                          onPress={() => handleViewJob(item)}
                          style={{
                            ...Styles?.smallButton,
                            marginVertical: 0,
                            backgroundColor: Colors?.themeColor,
                            marginRight: 5,
                          }}
                        >
                          <TextComponent
                            text={"View Detail"}
                            color={Colors?.white}
                            size={Sizes?.s}
                            fontWeight="400"
                            style={{ paddingHorizontal: 5 }}
                          />
                        </TouchableOpacity>
                      ) : null}

                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        style={{
                          ...Styles?.smallButton,
                          marginVertical: 0,
                          backgroundColor: Colors?.blue,
                          alignSelf: "flex-end",
                        }}
                      >
                        <TextComponent
                          text={"Payment Requests"}
                          color={Colors?.white}
                          size={Sizes?.xs}
                          style={{ paddingVertical: 2, paddingHorizontal: 8 }}
                        />
                      </TouchableOpacity>
                    
                      <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => setModalVisible(false)}
                      >
                        <View style={styling.modalContainer}>
                          <View style={styling.modalContent}>
                            <TouchableOpacity
                              onPress={() => setModalVisible(false)}
                              style={styling.closeIcon}
                            >
                              <Ionicons
                                name="ios-close"
                                size={24}
                                color="black"
                              />
                            </TouchableOpacity>
                            <TextComponent
                              text={"Info"}
                              size={Sizes?.l}
                              style={styling.modalTitle}
                            />
                            <TextComponent
                              text={
                                "You will be redirected to the Book Sculp official website for request to complete the job."
                              }
                              size={Sizes?.s}
                              style={styling.modalDescription}
                              fontWeight="400"
                            />

                            <TouchableOpacity
                              style={styling.yesButton}
                              onPress={() => {
                                Linking?.openURL(
                                  item?.post_meta_details?.request_link
                                );
                                setModalVisible(false);
                              }}
                            >
                              <TextComponent
                                text={"Go"}
                                color={Colors?.white}
                                size={Sizes?.s}
                                style={styling.yesButtonText}
                                fontWeight="400"
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </Modal> 
                    </View>
                  ) : tab == "completed" ? (
                    <View
                      style={{ ...Styles?.row, justifyContent: "flex-start" }}
                    >
                      <TouchableOpacity
                        onPress={() => handleViewJob(item)}
                        style={{
                          ...Styles?.smallButton,
                          marginVertical: 0,
                          backgroundColor: Colors?.themeColor,
                          marginRight: 5,
                        }}
                      >
                        <TextComponent
                          text={"View Detail"}
                          color={Colors?.white}
                          size={Sizes?.s}
                          fontWeight="400"
                          style={{ paddingHorizontal: 5 }}
                        />
                      </TouchableOpacity>
                      {/* <TouchableOpacity
                        onPress={() => handleViewJob(item)}
                        style={{
                          ...Styles?.smallButton,
                          marginVertical: 0,
                          backgroundColor: Colors?.blue,
                          marginRight: 5,
                        }}
                      >
                        <TextComponent
                          text={"Chat"}
                          color={Colors?.white}
                          size={Sizes?.s}
                          fontWeight="400"
                          style={{ paddingHorizontal: 5 }}
                        />
                      </TouchableOpacity> */}
                    </View>
                  ) : null}
                </TouchableOpacity>
              </>
            );
          })
        ) : other?.isLoading ? null : (
          <NoDataFound emptyList={emptyList} />
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};

// {tab == "completed" ? (
//   <TouchableOpacity
//     style={{
//       ...Styles?.smallButton,
//       backgroundColor: Colors?.blue,
//       alignSelf: "flex-end",
//     }}
//   >
//     <TextComponent
//       text={"View History"}
//       color={Colors?.white}
//       size={Sizes?.s}
//       style={{ paddingVertical: 2, paddingHorizontal: 8 }}
//     />
//   </TouchableOpacity>
// ) : tab == "cancelled" ? (
//   <TouchableOpacity
//     style={{
//       ...Styles?.smallButton,
//       backgroundColor: Colors?.pink,
//       alignSelf: "flex-end",
//     }}
//   >
//     <TextComponent
//       text={"Repost"}
//       color={Colors?.white}
//       size={Sizes?.s}
//       style={{ paddingVertical: 2, paddingHorizontal: 8 }}
//     />
//   </TouchableOpacity>
// ) : null}
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
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
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
    backgroundColor: Colors?.blue,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesButtonText: {
    color: "white",
  },
});
