// GalleryImages.js
import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Text,
} from "react-native";
import { Header, TextComponent } from "../../Components";
import { Colors, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import ImageViewing from "react-native-image-viewing"; // ← Modern zoom viewer
import FastImage from "@d11/react-native-fast-image"; // assuming you have this fork
import { getData, storageKey } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { useDispatch } from "react-redux";

export const GalleryImages = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const { images = [] } = route?.params || {};

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [zoomVisible, setZoomVisible] = useState(true); // auto-open on mount
  const [zoomIndex, setZoomIndex] = useState(0);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    const userID = await getData(storageKey?.USER_ID);
    if (userID) {
      const body = { user_id: JSON.parse(userID) };
      const res = await dispatch(getUserDetail(body));
      if (res?.status === 200) {
        setUserData(res.results);
      }
    }
    setLoading(false);
  };

  // Prepare images for viewer (only valid images)
  const imageViewerList = images
    .filter((img) => img?.url || img?.uri)
    .map((img) => ({
      uri: img.url || img.uri,
    }));

  // If no images → show empty state
  if (imageViewerList.length === 0) {
    return (
      <>
        <Header text="Gallery" navigation={navigation} />
        <View style={styles.emptyContainer}>
          <TextComponent
            text="No images in gallery"
            size={Sizes.l}
            color={Colors.darkgrey}
          />
        </View>
      </>
    );
  }

  return (
    <>
      <Header text="Gallery" navigation={navigation} />

      <Loader loading={loading} />

      {/* Full-screen Image Viewer */}
      <ImageViewing
        images={imageViewerList}
        imageIndex={zoomIndex}
        visible={zoomVisible}
        onRequestClose={() => {
          setZoomVisible(false);
          navigation.goBack(); // go back when closed
        }}
        doubleTapToZoomInEnabled={true}
        doubleTapInterval={180}
        swipeToCloseEnabled={true}
        presentationStyle="overFullScreen"
        // Optional: add header/footer if needed
        // header={(imageIndex) => (
        //   <Text style={{ color: 'white', padding: 20 }}>
        //     {imageIndex + 1} / {imageViewerList.length}
        //   </Text>
        // )}
      />
    </>
  );
};

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.white,
  },
});