import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, Loader, NoDataFound, TextComponent } from "../../Components";
import { Colors, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteJob,
  getJobDetails,
  getPostedListing,
  getProposalListing,
  repostJob,
} from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { useFocusEffect } from "@react-navigation/native";
import {
  GET_JOBS_TYPE,
  GET_ONGOING_JOBS,
  GET_POSTED_LISTING,
} from "../../API Services/Url";
import { getUserDetail } from "../../Redux/Services/AuthServices";

export const ManageJobs = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const [postList, setPostList] = useState([]);
  const [tab, setTab] = useState("posted");
  const [modalVisible, setModalVisible] = useState(false);
  const [modal, setModal] = useState(false);

  useFocusEffect(
    React.useCallback(() => {
      if (route?.params?.prevRoute == routeName?.CHECKOUT) {
        setTab(route?.params?.tab);
        getPostedList(route?.params?.tab);
        setModal(true);
      } else {
        setTab("posted");
        getPostedList("posted");
      }
    }, [])
  );
  const getPostedList = async (type) => {
    let userID = await getData(storageKey?.USER_ID);
    let body = {
      client_id: userID,
      job_status: type,
      // client_id: "216",
      // job_status: "completed",
    };
    console.log("body----", body);
    let res = await dispatch(getPostedListing(body));
    if (res?.status == 200) {
      setTab(type);
      setPostList(res?.results);
    } else {
      setPostList([]);
    }
  };
  const handleTabs = async (type) => {
    let body = {
      client_id: userID,
      job_status: type,
    };

    let res = await dispatch(getPostedListing(body));
    if (res?.status == 200) {
      setPostList(res?.results);
    } else {
      setPostList([]);
    }
  };
  const getProposalsList = async (item) => {
    // let body = {
    //   project_id: item?.profile?.ID,
    //   get_result: "proposal",
    // };
    // let res = await dispatch(getProposalListing(body));
    // if (res?.status == 200) {
    navigation?.navigate(routeName?.MANAGE_PROPOSAL, {
      project_id: item?.profile?.ID,
    });
    // }
  };
  const deleteSingleJob = async (item) => {
    let userID = await getData(storageKey?.USER_ID);
    let body = {
      user_id: userID,
      post_id: item?.profile?.ID,
      action: "delete",
    };
    let res = await dispatch(deleteJob(body));
    if (res?.status == 200) {
      getPostedList("posted");
    }
  };
  const handleDelete = (item) => {
    Alert.alert("Are you sure?", "You want to delete this job.", [
      {
        text: "No",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => deleteSingleJob(item),
      },
    ]);
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
  const handleRepostJob = async (item) => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      project_id: item?.profile?.ID,
      user_id: userID,
      action: "open",
    };
    let res = await dispatch(repostJob(body));
    if (res?.status == 200) {
      getPostedList("posted");
    }
  };
  const handleEditJob = async (item) => {
    var body = {
      project_id: item?.profile?.ID,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      if (item?.post_meta_details?.model_type_req == "casting calls") {
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
  const options = [
    {
      name: "Posted Jobs",
      type: "posted",
    },
    {
      name: "Ongoing Jobs",
      type: "ongoing",
    },
    {
      name: "Completed Jobs",
      type: "completed",
    },
    {
      name: "Cancelled Jobs",
      type: "cancelled",
    },
  ];
  console.log("postListpostListpostList------", postList);
  return (
    <>
      <Header
        text={"Manage Jobs"}
        navigation={navigation}
        button={true}
        buttonText="Post job"
        icon={"plus-square"}
        onRightClick={() => navigation?.navigate(routeName?.POST_JOB)}
      />
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
                onPress={() => getPostedList(item?.type)}
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
        {postList?.length != 0 ? (
          postList?.map((item) => {
            return (
              <>
                <TouchableOpacity
                  style={Styles?.container}
                  onPress={() => handleViewJob(item)}
                >
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
                      text={`Project Type : ${item?.post_meta_details?.project_type}`}
                      size={Sizes?.s}
                      fontWeight="400"
                      color={Colors?.black}
                    />
                    <TextComponent
                      text={`Proposals  : ${item?.post_meta_details?.proposal_count}`}
                      size={Sizes?.s}
                      fontWeight="400"
                      color={Colors?.black}
                      style={styling?.imageIconView}
                    />
                  </View>
                  <View style={Styles?.separator} />
                  {tab == "posted" ? (
                    <View
                      style={{ ...Styles?.row, justifyContent: "flex-start" }}
                    >
                      {item?.post_meta_details?.proposal_count != 0 ? (
                        <TouchableOpacity
                          onPress={() => getProposalsList(item)}
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

                      <TouchableOpacity
                        onPress={() => handleDelete(item)}
                        style={{
                          ...Styles?.smallButton,
                          marginVertical: 0,
                          backgroundColor: Colors?.pink,
                          marginRight: 5,
                        }}
                      >
                        <TextComponent
                          text={"Delete"}
                          color={Colors?.white}
                          size={Sizes?.s}
                          fontWeight="400"
                          style={{ paddingHorizontal: 5 }}
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleEditJob(item)}
                        style={{
                          ...Styles?.smallButton,
                          marginVertical: 0,
                          backgroundColor: Colors?.blue,
                        }}
                      >
                        <TextComponent
                          text={"Edit"}
                          color={Colors?.white}
                          size={Sizes?.s}
                          fontWeight="400"
                          style={{ paddingHorizontal: 5 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : tab == "ongoing" ? (
                    <View
                      style={{ ...Styles?.row, justifyContent: "flex-start" }}
                    >
                      {item?.post_meta_details?.proposal_count != 0 ? (
                        <TouchableOpacity
                          onPress={() => getProposalsList(item)}
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

                      <TouchableOpacity
                        onPress={() => setModalVisible(true)}
                        // onPress={() =>
                        //   navigation?.navigate(routeName?.PROJECT_DETAILS)
                        // }
                        style={{
                          ...Styles?.smallButton,
                          marginVertical: 0,
                          backgroundColor: Colors?.blue,
                          alignSelf: "flex-end",
                        }}
                      >
                        <TextComponent
                          text={"View History"}
                          color={Colors?.white}
                          size={Sizes?.xs}
                          style={{ paddingVertical: 2, paddingHorizontal: 8 }}
                        />
                      </TouchableOpacity>
                    </View>
                  ) : tab == "completed" ? (
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
                        text={"View History"}
                        color={Colors?.white}
                        size={Sizes?.xs}
                        style={{ paddingVertical: 2, paddingHorizontal: 8 }}
                      />
                    </TouchableOpacity>
                  ) : tab == "cancelled" ? (
                    <TouchableOpacity
                      onPress={() => handleRepostJob(item)}
                      style={{
                        ...Styles?.smallButton,
                        marginVertical: 0,
                        backgroundColor: Colors?.pink,
                        alignSelf: "flex-end",
                      }}
                    >
                      <TextComponent
                        text={"Repost"}
                        color={Colors?.white}
                        size={Sizes?.xs}
                        style={{ paddingVertical: 2, paddingHorizontal: 8 }}
                      />
                    </TouchableOpacity>
                  ) : null}
                </TouchableOpacity>
                {/* {console.log(
                  "item?.post_meta_details?.view_history-----",
                  item
                )} */}
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
                        <Ionicons name="ios-close" size={24} color="black" />
                      </TouchableOpacity>
                      <TextComponent
                        text={"Info"}
                        size={Sizes?.l}
                        style={styling.modalTitle}
                      />
                      <TextComponent
                        text={
                          "You will be redirected to the Book Sculp official website to view the job history."
                        }
                        size={Sizes?.s}
                        style={styling.modalDescription}
                        fontWeight="400"
                      />

                      <TouchableOpacity
                        style={styling.yesButton}
                        onPress={() => {
                          Linking?.openURL(
                            item?.post_meta_details?.view_history
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
              </>
            );
          })
        ) : other?.isLoading ? null : (
          <NoDataFound />
        )}
        <View style={{ height: 30 }} />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modal}
          onRequestClose={() => setModal(false)}
        >
          <View style={styling.modalContainer}>
            <View style={styling.modalContent}>
              <TouchableOpacity
                onPress={() => setModal(false)}
                style={styling.closeIcon}
              >
                <Ionicons name="ios-close" size={24} color="black" />
              </TouchableOpacity>
              <TextComponent
                text={"Hired Succesfully!"}
                size={Sizes?.l}
                style={styling.modalTitle}
              />
              <View style={{ ...Styles?.separator }} />
              <TextComponent
                text={`Congratulations! You have booked ${route?.params?.modelName} for ${route?.params?.jobTitle}!`}
                size={Sizes?.s}
                style={styling.modalDescription}
                fontWeight="400"
                color={Colors?.darkgrey}
              />
              <TextComponent
                text={
                  "** These funds are held until the booking is marked complete. The model does not receive payment prior to the booking."
                }
                size={Sizes?.s}
                style={styling.modalDescription}
                fontWeight="400"
                color={Colors?.darkgrey}
              />
            </View>
          </View>
        </Modal>
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
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
