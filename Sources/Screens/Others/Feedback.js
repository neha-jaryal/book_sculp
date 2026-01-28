import React, { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import { Button, InputBox, TextComponent, Header } from "../../Components";
import { Sizes, Colors } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Rating } from "react-native-elements";
import { useDispatch, useSelector } from "react-redux";
import { useFocusEffect } from "@react-navigation/native";
import { getData, storageKey } from "../../Utility/Storage";
import {
  completePay,
  getRatingOptions,
} from "../../Redux/Services/OtherServices";
export const Feedback = ({ navigation, route }) => {
  const { proposalId, projectId, proposal_status } = route?.params;
  const [feedback, setFeedback] = useState([]);
  const [rating, setRating] = useState([]);
  const [description, setDescription] = useState("");
  const other = useSelector((state) => state?.otherReducer);
  const dispatch = useDispatch();

  useFocusEffect(
    React.useCallback(() => {
      getProjectRatingOptionList();
    }, [navigation, route])
  );
  const getProjectRatingOptionList = async () => {
    let res = await dispatch(getRatingOptions());
    if (res?.status == 200) {
      setFeedback(res?.results);
    }
  };
  console.log("ratingratingratingrating-----", rating);

  // const feedbackTypes = [
  //   { heading: "How professional was this model?" },
  //   { heading: "How was their quality of work?" },
  //   { heading: "Was this model focused on the job?" },
  //   { heading: "Was it worth having their services?" },
  //   { heading: "Did they have a good attitude?" },
  // ];
  const ratingCompleted = (item, ele) => {
    console.log("ratingCompleted-----", ele);
    let arr = [];
    let newarr = arr?.push({ ...item, value: ele });
    console.log("newarr----", arr);
    setRating(arr);
  };

  const submitRating = async () => {
    let userId = await getData(storageKey?.USER_ID);
    let body = {
      user_id: userId,
      // action: "complete",
      action: "complete_react",
      rating: rating,
      message: description,
      proposal_id: proposalId,
      project_id: projectId,
    };
    let res = await dispatch(completePay(body));
    if (res?.status == 200) {
      navigation?.navigate(routeName?.MANAGE_JOBS);
    }
  };

  return (
    <>
      <Header navigation={navigation} text={"Feedback"} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={{ ...Styles?.container }}>
          <TextComponent
            text="Complete Project"
            size={Sizes?.xl}
            fontWeight="400"
          />
          <View style={Styles?.separator} />

          <InputBox
            type="description"
            value={description}
            placeholder="Add Your Feedback"
            onChangeText={(val) => setDescription(val)}
            style={{ marginTop: 5 }}
          />
          {feedback?.map((item) => {
            return (
              <View
                style={{
                  ...Styles?.container,
                  marginHorizontal: 0,
                  width: "100%",
                }}
              >
                <TextComponent
                  text={item?.value}
                  size={Sizes?.l}
                  fontWeight="400"
                />
                <View
                  style={{
                    ...Styles?.row,
                    marginTop: 10,
                    justifyContent: "center",
                  }}
                >
                  <Rating
                    showRating
                    fractions="{1}"
                    startingValue="{2.5}"
                    imageSize={20}
                    style={{ paddingHorizontal: 2 }}
                    onFinishRating={(ele) => {
                      ratingCompleted(item, ele);
                    }}
                  />
                </View>
              </View>
            );
          })}
          <View style={{ height: 20 }} />

          <Button
            title="Send Feedback"
            icon={true}
            background={true}
            // onPress={() => navigation.navigate(routeName.USER_DASHBOARD)}
            onPress={() => submitRating()}
            style={{ paddingVertical: 5 }}
          />
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
};
