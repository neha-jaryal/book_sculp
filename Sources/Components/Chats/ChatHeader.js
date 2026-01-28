import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";
import Ionicons from "react-native-vector-icons/Ionicons";
import { Header } from "../Header";
import { Colors } from "../../Constants";
import { routeName } from "../../Utility";

const ChatHeader = (props) => {
  const { navigation, username, profilePhoto } = props;
  return (
    <View style={styles.headerContainer}>
      <TouchableOpacity
        onPress={() => navigation?.navigate(routeName?.INBOX)}
        style={styles.backButton}
      >
        <Ionicons name="chevron-back" size={24} color="#333" />
      </TouchableOpacity>

      <Image source={{ uri: profilePhoto }} style={styles.profileImage} />
      <View style={styles.userInfo}>
        <Text style={styles.username}>{username}</Text>
        <Text style={styles.status}>{"online"}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomColor: Colors?.white,
    borderBottomWidth: 1,
    backgroundColor: Colors?.white,
    borderBottomEndRadius: 25,
    borderBottomStartRadius: 25,
    paddingVertical: 15,
    paddingHorizontal: 10,
    shadowColor: Colors?.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    overflow: "visible",
  },
  backButton: {
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  status: {
    fontSize: 12,
    color: "gray",
  },
});

export default ChatHeader;
