import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  TextComponent,
  PlansCard,
  Header,
  NoDataFound,
} from "../../Components";
import { Sizes, Colors } from "../../Constants";
import { Styles } from "../../Styles";
import { Searchbar } from "react-native-paper";
import { routeName } from "../../Utility";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import {
  getJobDetails,
  getLatestProposals,
} from "../../Redux/Services/OtherServices";
import { useDispatch, useSelector } from "react-redux";
import { getData, storageKey } from "../../Utility/Storage";

export const LatestProposal = ({ navigation }) => {
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [proposalList, setProposalList] = useState("");
  const [emptyList, setEmptyList] = useState(false);
  const other = useSelector((state) => state?.otherReducer);
  const onChangeSearch = (query) => setSearchQuery(query);

  useEffect(() => {
    getLatestProposalsList();
  }, []);
  const getLatestProposalsList = async () => {
    let userID = await getData(storageKey?.USER_ID);
    var body = {
      user_id: userID,
    };
    let res = await dispatch(getLatestProposals(body));
    if (res?.status == 200) {
      if (res?.results?.length == 0) {
        setEmptyList(true);
      } else {
        setProposalList(res?.results);
      }
    } else {
      setEmptyList(true);
    }
  };
  const handleEditProposal = async (item) => {
    var body = {
      project_id: item?.profile?.ID,
    };
    let res = await dispatch(getJobDetails(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.SUBMIT_PROPOSAL, {
        jobDetail: res?.results[0],
      });
    }
  };

  return (
    <>
      <Header text="Latest Proposals" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {proposalList?.length != 0 ? (
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

            <Searchbar
              placeholder="Search by title..."
              onChangeText={onChangeSearch}
              value={searchQuery}
              loading={true}
              style={{
                borderRadius: 10,
                marginHorizontal: 20,
                marginTop: 20,
              }}
            />

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
                    size={Sizes?.l}
                    style={{ textAlign: "center" }}
                  />
                  <View style={Styles?.separator} />
                  <View style={{ alignItems: "center" }}>
                    <TextComponent
                      text="Quoted Price"
                      size={Sizes?.l}
                      style={{ padding: 2 }}
                    />
                    <TextComponent
                      text={item?.amount}
                      size={Sizes?.s}
                      style={{ padding: 2 }}
                    />
                    <TextComponent
                      text={`Estimated hours (${item?.fw_options?.estimeted_time})`}
                      size={Sizes?.xxs}
                      style={{ padding: 2 }}
                      color={Colors?.blue}
                    />
                    <TextComponent
                      text={`Amount per hour (${item?.fw_options?.per_hour_amount})`}
                      size={Sizes?.xxs}
                      style={{ padding: 2 }}
                      color={Colors?.blue}
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
                    <Entypo
                      name="attachment"
                      size={20}
                      color={Colors?.darkgrey}
                    />
                    <TextComponent
                      text={`${item?.files} file attached`}
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
                        backgroundColor:
                          item?.status == "Pending" || item?.status == "pending"
                            ? Colors?.pink
                            : item?.status == "Cancelled"
                            ? Colors?.red
                            : Colors?.themeColor,
                        width: "35%",
                        margin: 4,
                        borderRadius: 6,
                      }}
                      onPress={() => handleEditProposal()}
                    >
                      <TextComponent
                        text={
                          item?.status == "Pending" || item?.status == "pending"
                            ? "Edit Proposal"
                            : item?.status == "Cancelled"
                            ? "Cancelled"
                            : "Completed"
                        }
                        color={Colors?.white}
                        size={Sizes?.s}
                      />
                    </TouchableOpacity>

                    {item?.status == "Pending" || item?.status == "pending" ? (
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
        )}
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};
