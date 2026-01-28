import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Alert,
  Image,
  Button,
  Linking,
  Platform,
} from "react-native";
import InAppReview from "react-native-in-app-review";
import { Colors, Images } from "../Constants";
import { Styles } from "../Styles";
import { Rating } from "react-native-elements";
import { getData, storageKey } from "../Utility/Storage";
import { addAppRating } from "../Redux/Services/OtherServices";
import { useDispatch } from "react-redux";

export const AppReview = (props) => {
  const { show, setShow, status } = props;
  const dispatch = useDispatch();
  // const handleRateNow = () => {
  //   if (InAppReview.isAvailable()) {
  //     InAppReview.RequestInAppReview()
  //       .then((hasFlowFinishedSuccessfully) => {
  //         if (hasFlowFinishedSuccessfully) {
  //           // In-App Review flow completed successfully
  //           Alert.alert("Thank you for your feedback!");
  //         } else {
  //           // User dismissed the review prompt or it failed
  //           Alert.alert("Could not submit review");
  //         }
  //       })
  //       .catch((error) => {
  //         console.error("InAppReview Error:", error);
  //       });
  //   } else {
  //     Alert.alert("In-app review is not supported on this device.");
  //   }

  // if (InAppReview.isAvailable()) {
  //   console.log('InAppReview.isAvailable()------',InAppReview.isAvailable())
  //   InAppReview.RequestInAppReview()
  //     .then((hasFlowFinishedSuccessfully) => {
  //       console.log(
  //         'In-app review flow finished successfully:',
  //         hasFlowFinishedSuccessfully
  //       );
  //       alert('Review request triggered (dialog may not appear in development mode).');
  //     })
  //     .catch((error) => {
  //       console.error('Error during in-app review:', error);
  //     });
  // } else {
  //   alert('In-app review is not available on this device.');
  // }

  // Close the popup after attempting to rate
  //   setShow(false);
  // };

  const handleNotNow = () => {
    // Close the popup
    setShow(false);
  };

  const handleRating = async (status) => {
    const userId = await getData(storageKey?.USER_ID);
    const url =
      Platform.OS === "ios"
        ? "https://apps.apple.com/app/6444509575?action=write-review"
        : "https://play.google.com/store/apps/details?id=com.sculp_agency";

    var body = {
      user_id: JSON.parse(userId),
      app_rating: JSON.stringify(status),
    };
    const res = await dispatch(addAppRating(body));
    if (res?.status == 200) {
      if (status == 1) {
        Linking.openURL(url);
      }
      setShow(false);
    }
  };

  return (
    <Modal
      transparent={true}
      visible={show}
      animationType="slide"
      useNativeDriver={true}
      onRequestClose={() => setShow(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.popupContainer}>
          <Image source={Images?.appLogo} style={styles.appIcon} />

          <Text style={styles.title}>Enjoying Book Sculp?</Text>
          <Text style={styles.subtitle}>
            Would you like to rate our app on{" "}
            {Platform?.OS == "ios" ? "app store" : "play store"}?
          </Text>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => handleRating(1)}
              style={styles?.button}
            >
              <Text style={{ ...styles.buttonText, color: Colors?.themeColor }}>
                Rate Now
              </Text>
            </TouchableOpacity>
            {status == 1 && (
              <TouchableOpacity
                onPress={() => handleRating(2)}
                style={styles?.button}
              >
                <Text style={{ ...styles.buttonText, color: Colors?.blue }}>
                  Already Rated
                </Text>
              </TouchableOpacity>
            )}
            {status != 1 && (
              <TouchableOpacity
                onPress={() => handleRating(0)}
                style={styles?.button}
              >
                <Text style={{ ...styles.buttonText, color: Colors?.pink }}>
                  Not Now
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalOverlay: {
    flex: 1,
    // backgroundColor: "rgba(0, 0, 0, 0.5)",
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
  },
  popupContainer: {
    backgroundColor: "white",
    borderRadius: 5,
    padding: 15,
    alignItems: "center",
    width: 260,
  },
  appIcon: {
    width: 40,
    height: 40,
    marginBottom: 10,
  },
  title: {
    fontSize: 15,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 12,
    textAlign: "center",
    color: Colors?.darkgrey,
    width: "80%",
  },
  starContainer: {
    flexDirection: "row",
    justifyContent: "center",
    // marginBottom: 16,
    marginVertical: 10,
  },
  star: {
    fontSize: 25,
    color: Colors?.yellow,
    marginHorizontal: 10,
  },
  buttonContainer: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },

  rateButton: {
    backgroundColor: Colors?.themeColor,
    borderRadius: 5,
    // padding: 5,
  },
  notNowButton: {
    backgroundColor: Colors?.pink,
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttonText: {
    fontSize: 13,
    fontWeight: "500",
  },
  button: {
    backgroundColor: Colors?.lightGray,
    width: "100%",
    alignItems: "center",
    paddingVertical: 6,
    marginVertical: 5,
    borderRadius: 5,
  },
});
