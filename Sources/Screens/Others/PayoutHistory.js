import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, FlatList } from "react-native";
import { Header, TextComponent } from "../../Components";
import { Styles } from "../../Styles";
import { Colors, Sizes } from "../../Constants";
import { getData, storageKey } from "../../Utility/Storage";
import { useDispatch } from "react-redux";
import { getSuperTransactionHistory } from "../../Redux/Services/OtherServices";
import moment from "moment";

const transactions = [
  {
    receiver: "Anup Kumar",
    email: "Anupjaryal01@Gmail.Com",
    jobTitle: "BookSculp - Order 17506",
    amount: "$1.04",
    charges: "$0.03",
    paid: "$1.07",
    date: "26th July, 2025 05:53 am",
    status: "Succeeded",
  },
  {
    receiver: "Anup Kumar",
    email: "Anupjaryal01@Gmail.Com",
    jobTitle: "--",
    amount: "$3.1",
    charges: "$0.1",
    paid: "$3.20",
    date: "26th July, 2025 05:53 am",
    status: "Succeeded",
  },
  {
    receiver: "Anup Kumar",
    email: "Anupjaryal01@Gmail.Com",
    jobTitle: "--",
    amount: "$207.24",
    charges: "$6.38",
    paid: "$213.62",
    date: "26th July, 2025 05:53 am",
    status: "Succeeded",
  },
];

export const PayoutHistory = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [startingAfter, setStartingAfter] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(0);

  const getAllTransactions = async (type) => {
    let userId = await getData(storageKey?.USER_ID);
    if (loading || !hasMore) return;
    setLoading(true);
    try {
      let body = {
        action: "trans_list",
      };

      const res = await dispatch(getSuperTransactionHistory(body));
      if (res?.status === 200) {
        const newTransactions = res?.results?.data;
        console.log("newTransactions-----", newTransactions);
        // let filteredData = newTransactions?.filter((item) => item?.charge?.id);
        if (newTransactions.length > 0) {
          // Append new transactions to the existing state
          if (res?.results?.has_more && type == "load") {
            setTransactions((prevTransactions) => [
              ...prevTransactions,
              ...newTransactions,
            ]);
          } else {
            setTransactions(newTransactions);
          }

          // Check if more data is available
          setHasMore(res?.results?.has_more);

          // Update startingAfter with the ID of the last transaction in the current batch
          setStartingAfter(
            res?.results?.last_transaction_id
            // newTransactions[newTransactions.length - 1].transaction_id
          );
        } else {
          // No more data available
          setHasMore(false);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTransactions();
  }, []);
  const renderItem = ({ item }) => (
    <View
      style={{
        ...Styles?.container,
        width: "95%",
        marginHorizontal: 10,
      }}
    >
      <TextComponent text={"Receiver Details"} size={Sizes?.l} />

      <TextComponent text={item?.receiver_info?.name} size={Sizes?.s} />
      <TextComponent
        text={item?.receiver_info?.email}
        size={Sizes?.s}
        fontWeight="400"
      />

      <View style={Styles?.separator} />

      <TextComponent text={"Job Title"} size={Sizes?.l} />
      <TextComponent text={item.description} size={Sizes?.s} fontWeight="400" />
      <View style={Styles?.separator} />
      <TextComponent text={"Amount"} size={Sizes?.l} />
      <TextComponent
        text={`$${parseFloat(item?.amount - item?.charge_amount) || 0}`}
        size={Sizes?.s}
        fontWeight="400"
      />
      <View style={Styles?.separator} />
      <TextComponent text={"Platform Charges"} size={Sizes?.l} />
      <TextComponent
        text={`$${item?.charge_amount || 0}`}
        size={Sizes?.s}
        fontWeight="400"
      />
      <View style={Styles?.separator} />
      <TextComponent text={"Paid Amount"} size={Sizes?.l} />
      <TextComponent
        text={`$${item?.amount || 0}`}
        size={Sizes?.s}
        fontWeight="400"
      />
      <View style={Styles?.separator} />
      <TextComponent text={"Transaction Date"} size={Sizes?.l} />
      <TextComponent
        text={
          moment(new Date(item?.created_at)).format("Do MMMM, YYYY hh:mm a") ||
          ""
        }
        size={Sizes?.s}
        fontWeight="400"
      />
      <View style={Styles?.separator} />
      <TextComponent text={"Status"} size={Sizes?.l} />
      <TextComponent
        text={item.status || ""}
        size={Sizes?.s}
        fontWeight="400"
        color={
          item?.status === "succeeded" || item?.status === "complete"
            ? "green"
            : item?.status === "refunded"
            ? "orange"
            : "red"
        }
      />
    </View>
  );

  return (
    <>
      <Header text="Transaction History" navigation={navigation} />
      <FlatList
        data={transactions}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
      />
    </>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 3, // for android shadow
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  label: {
    fontSize: 12,
    color: "#666",
    marginTop: 8,
  },
  bold: {
    fontSize: 14,
    fontWeight: "600",
    color: "#222",
  },
  small: {
    fontSize: 12,
    color: "#444",
  },
  value: {
    fontSize: 14,
    color: "#333",
  },
  success: {
    color: "green",
    fontWeight: "600",
  },
});
