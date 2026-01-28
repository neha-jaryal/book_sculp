// InputToolbar.js
import React, { useState } from "react";
import {
  TextInput,
  Button,
  View,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../Constants";
import Ionicons from "react-native-vector-icons/Ionicons";

const InputToolbar = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = (e) => {
   
      
    // if (message.trim()) {
    //   onSend(message);
    setMessage(e); // Clear input
    // }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0} // Adjust offset for iOS
    >
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      {/* <View style={styles.inputContainer}>
        <TextInput
          style={styles.textInput}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor="#aaa"
        />
        <TouchableOpacity onPress={handleSend} style={styles.sendButton}>
          <Ionicons name="send" size={35} color={Colors?.themeColor} />
        </TouchableOpacity>
      </View> */}
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    backgroundColor: Colors?.white,
  },
  input: {
    flex: 1,
    height: 40,
    paddingHorizontal: 15,
    borderRadius: 15,
    backgroundColor: "#f2f2f2",
    fontSize: 16,
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: Colors?.themeColor,
    width: 41,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  //   input: {
  //     flex: 1,
  //     height: 40,
  //     paddingHorizontal: 10,
  //     borderRadius: 20,
  //     backgroundColor: "#f0f0f0",
  //     fontSize: 16,
  //   },

  //   inputContainer: {
  //     flexDirection: "row",
  //     padding: 10,
  //     alignItems: "center",
  //     justifyContent: "space-between",
  //   },

  //   textInput: {
  //     width: "85%",
  //     padding: 10,
  //     borderWidth: 1,
  //     borderRadius: 10,
  //     marginRight: 5,
  //     borderColor: Colors?.gredient,
  //   },
  //   sendButton: {
  //     // marginRight: 5,
  //     // marginBottom: 5,
  //     padding: 10,
  //     // backgroundColor: "red",
  //   shadowColor: "#000",
  //   shadowOffset: { width: 0, height: 3 },
  //   shadowOpacity: 0.3,
  //   shadowRadius: 3,
  //   elevation: 5, // Shadow for Android
  //   },
});

export default InputToolbar;
