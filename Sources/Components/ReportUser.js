import React, { useEffect, useState } from "react";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { Colors, Sizes } from "../Constants";
import { DropDownList } from "./DropDownList";
import { InputBox } from "./InputBox";
import { View } from "react-native";
import { userReporting } from "../Redux/Services/OtherServices";
import { useDispatch, useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";
import { getData, storageKey } from "../Utility/Storage";
import { getAccountApproval, showToast } from "../Utility";
import { useNavigation } from "@react-navigation/native";
import { Loader } from "./Loader";

export const ReportUser = (props) => {
  const { reportUserID, style, reasonList, onSucess, type, postId } = props;
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const auth = useSelector((state) => state?.authReducer);
  const navigation = useNavigation();
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [approvalStatus, setApprovalStatus] = useState(false);
  const [userID, setUserID] = useState(""); 
  useEffect(() => {
    getAccountApprovalStatus();
  }, []);

  const getAccountApprovalStatus = async () => {
    let status = await getData(storageKey?.APPROVAL_STATUS);
    let accountApproval = JSON?.parse(status);
    setApprovalStatus(accountApproval);
    let userID = await getData(storageKey?.USER_ID);
    setUserID(userID);
  };
  const reportUser = async () => {
    if (approvalStatus) {
      if (!reason) {
        showToast("Please select any reason", "error");
      } else if (!description) {
        showToast("Please Enter the report description", "error");
      } else {
        let userID = await getData(storageKey?.USER_ID);
        setUserID(userID);
        var body = {
          user_by: userID,
          reported_user_id: reportUserID,
          reported_post_id: postId,
          report_type: type,
          title: reason,
          content: description,
        };
        console.log("report body------", body);
        let res = await dispatch(userReporting(body));
        if (res?.status == 200) {
          setReason("");
          setDescription("");
          onSucess();
        }
      }
    } else {
      getAccountApproval(true, navigation, auth);
    }
  };
  return (
    <>
      {userID != reportUserID && (
        <>
          <Loader loading={other?.isLoading} />
          <TextComponent
            text={
              type == "social_post" ? "Report on this post" : "Report this user"
            }
            size={Sizes?.l}
            style={{ margin: 10 }}
          />
          <DropDownList
            placeholder={"Select Reason*"}
            value={reason}
            setValue={setReason}
            options={reasonList}
            border={true}
          />
          <InputBox
            type="description"
            value={description}
            placeholder="Report Description*"
            onChangeText={(val) => setDescription(val)}
            style={{ marginVertical: 10 }}
          />
          <TouchableOpacity
            onPress={() => reportUser()}
            style={{
              ...Styles?.smallButton,
              backgroundColor: Colors?.themeColor,
              width: "40%",
            }}
          >
            <TextComponent
              text="Report Now"
              color={Colors?.white}
              size={Sizes?.s}
              style={{ paddingVertical: 2 }}
            />
          </TouchableOpacity>
        </>
      )}
    </>
  );
};
