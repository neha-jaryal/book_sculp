import React, { useState } from "react";
import { View, FlatList, Button, StyleSheet, Text } from "react-native";
import SwipeUpDownModal from "react-native-swipe-modal-up-down";
import { Colors, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";

export const BottomSwiper = (props) => {
  let [animateModal, setanimateModal] = useState(false);
  const { ShowComment, setShowModelComment } = props;
  return (
    <SwipeUpDownModal
      modalVisible={ShowComment}
      PressToanimate={animateModal}
      ContentModal={
        <View style={{ ...styles.containerContent }}>
          <FlatList
            data={data}
            renderItem={({ item, index }) => <item key={index} Data={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      }
      HeaderStyle={styles.headerContent}
      ContentModalStyle={styles.Modal}
      HeaderContent={
        <View style={styles.containerHeader}>
          <TextComponent text="Comments" size={Sizes?.l} />
        </View>
      }
      onClose={() => {
        setShowModelComment(false);
        setanimateModal(false);
      }}
    />
  );
};

const styles = StyleSheet.create({
  containerContent: { flex: 1, marginTop: 40 },
  containerHeader: {
    flex: 1,
    alignContent: "center",
    alignItems: "center",
    justifyContent: "center",
    height: 55,
    backgroundColor: Colors?.lightThemeColor,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  headerContent: {
    marginTop: 0,
  },
  Modal: {
    backgroundColor: Colors?.white,
    // marginTop: 300,
  },
});
