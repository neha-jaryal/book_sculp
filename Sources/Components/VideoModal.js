import React, { useState, useRef } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
  Modal,
  PermissionsAndroid,
  Platform,
  Dimensions,
  Text,
  Slider,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Video from "react-native-video";
import SwiperFlatList from "react-native-swiper-flatlist"; // ← Replacement
import { Colors, Images, Sizes } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { routeName } from "../Utility";
import Entypo from "react-native-vector-icons/Entypo";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Ionicons from "react-native-vector-icons/Ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { CommentsModal, ShareModal, ThreeDotsModal } from "./PostCard";

const { width, height } = Dimensions.get("window");

export const VideoModal = (props) => {
  const {
    modal,
    setModal,
    navigation,
    cardData, // array of video cards
    userId,
    postType,
    refreshList,
    postData,
    getPortDetails,
    getSocialPostData,
    approvalStatus,
    handleLikeDislike,
  } = props;

  const dispatch = useDispatch();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [sendSwiper, setSendSwiper] = useState(false);
  const [commentSwiper, setCommentSwiper] = useState(false);
  const [threeDotsSwiper, setThreeDotsSwiper] = useState(false);

  const videoRefs = useRef({}); // Store refs for each video

  const vediosIcons = [
    {
      name: "heart-o",
      method: () =>
        approvalStatus
          ? handleLikeDislike(postData?.extra?.like_status)
          : console.log("Approval needed"),
    },
    { name: "commenting-o", method: () => setCommentSwiper(true) },
    { name: "download", method: () => checkPermission() },
  ];

  const checkPermission = async () => {
    if (Platform.OS === "ios") {
      console.log("Download not implemented for iOS yet");
      return;
    }

    try {
      const granted = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        {
          title: "Storage Permission",
          message: "App needs storage access to download videos",
        }
      );

      if (granted === PermissionsAndroid.RESULTS.GRANTED) {
        console.log("Storage permission granted – implement download here");
        // Add download logic (e.g., rn-fetch-blob or fetch + FileSystem)
      } else {
        console.log("Storage permission denied");
      }
    } catch (err) {
      console.warn("Permission error:", err);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  return (
    <>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modal}
        supportedOrientations={["portrait", "landscape"]}
        onRequestClose={() => setModal(false)}
      >
        <SwiperFlatList
          data={cardData || []}
          renderItem={({ item: card, index }) => {
            const videoUri = card?.media?.url || card?.media?.[0]?.url;

            return (
              <View style={{ width, height, backgroundColor: Colors.black }}>
                <Video
                  ref={(ref) => (videoRefs.current[index] = ref)}
                  source={{ uri: videoUri }}
                  style={StyleSheet.absoluteFill}
                  resizeMode="cover"
                  repeat={true}
                  paused={paused || currentIndex !== index}
                  onProgress={(progress) => {
                    if (currentIndex === index) {
                      setCurrentTime(progress.currentTime);
                    }
                  }}
                  onLoad={(data) => {
                    if (currentIndex === index) {
                      setDuration(data.duration);
                    }
                  }}
                  playInBackground={false}
                  ignoreSilentSwitch="obey"
                  rate={1.0}
                />

                {/* Custom Controls Overlay */}
                <View style={styles.controlsOverlay}>
                  {/* Top right icons */}
                  <View style={styles.topRightIcons}>
                    <TouchableOpacity onPress={() => setThreeDotsSwiper(true)}>
                      <Entypo
                        name="dots-three-vertical"
                        size={24}
                        color={Colors.white}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Bottom action icons */}
                  <View style={styles.bottomIcons}>
                    <FlatList
                      data={vediosIcons}
                      horizontal
                      contentContainerStyle={{
                        flexDirection: "row",
                        justifyContent: "space-around",
                        width: "100%",
                      }}
                      showsHorizontalScrollIndicator={false}
                      keyExtractor={(_, i) => i.toString()}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          style={styles.iconButton}
                          onPress={item.method}
                        >
                          <FontAwesome
                            name={item.name}
                            size={30}
                            color={Colors.white}
                          />
                        </TouchableOpacity>
                      )}
                    />
                  </View>

                  {/* Progress & Play/Pause */}
                  <View style={styles.progressContainer}>
                    <TouchableOpacity
                      style={styles.playPauseButton}
                      onPress={() => setPaused(!paused)}
                    >
                      <Ionicons
                        name={paused ? "play" : "pause"}
                        size={40}
                        color={Colors.white}
                      />
                    </TouchableOpacity>

                    <View style={styles.timeRow}>
                      <Text style={styles.timeText}>
                        {formatTime(currentTime)}
                      </Text>
                      <Slider
                        style={styles.slider}
                        minimumValue={0}
                        maximumValue={duration}
                        value={currentTime}
                        minimumTrackTintColor={Colors.themeColor}
                        maximumTrackTintColor="rgba(255,255,255,0.5)"
                        thumbTintColor={Colors.white}
                        onValueChange={(val) => {
                          videoRefs.current[currentIndex]?.seek(val);
                        }}
                      />
                      <Text style={styles.timeText}>
                        {formatTime(duration)}
                      </Text>
                    </View>
                  </View>

                  {/* Bottom profile info */}
                  <View style={styles.profileContainer}>
                    <TouchableOpacity
                      style={Styles.row}
                      onPress={() => {
                        if (userId === card?.post_details?.post_author) {
                          navigation.navigate(routeName.MODEL_USER_PROFILE);
                        } else {
                          navigation.navigate(routeName.FEED_USER_PROFILE, {
                            userId: card?.post_details?.post_author,
                            type: postType,
                          });
                        }
                      }}
                    >
                      {card?.user_data?.attachment?.url ? (
                        <Image
                          source={{ uri: card.user_data.attachment.url }}
                          style={styling.profileImg}
                        />
                      ) : (
                        <FontAwesome
                          name="user-circle-o"
                          size={50}
                          color={Colors.gredient}
                        />
                      )}

                      <View style={{ marginLeft: 12 }}>
                        <TextComponent
                          text={card?.user_data?.user_name || "User"}
                          color={Colors.white}
                          size={Sizes.l}
                        />
                        <TextComponent
                          text={card?.post_details?.post_title || ""}
                          color={Colors.white}
                          size={Sizes.s}
                          fontWeight="400"
                        />
                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={{
                        ...Styles.smallButton,
                        backgroundColor: Colors.pink,
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                      }}
                    >
                      <TextComponent
                        text="Follow"
                        color={Colors.white}
                        size={Sizes.s}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* Close button */}
                  <TouchableOpacity
                    style={styles.closeButton}
                    onPress={() => setModal(false)}
                  >
                    <Entypo name="cross" size={32} color={Colors.white} />
                  </TouchableOpacity>
                </View>
              </View>
            );
          }}
          showPagination={false}
          vertical={true}               // Enables vertical swiping
          index={0}
          onChangeIndex={(index) => {
            setCurrentIndex(index);
            setPaused(false);           // Auto-play on swipe
          }}
        />
      </Modal>

      {/* Other modals */}
      {sendSwiper && (
        <ShareModal
          setShowModelComment={setSendSwiper}
          ShowComment={sendSwiper}
        />
      )}

      {commentSwiper && (
        <CommentsModal
          postId={cardData?.[currentIndex]?.post_details?.ID}
          portId={cardData?.[currentIndex]?.post_details?.ID}
          socialId={cardData?.[currentIndex]?.post_details?.ID}
          type={postType}
          userData={postData?.user_data}
          comments={postData?.comment_result}
          setShowModelComment={setCommentSwiper}
          ShowComment={commentSwiper}
          getPortDetails={getPortDetails}
          getSocialPostData={getSocialPostData}
          refreshList={refreshList}
          cardData={cardData?.[currentIndex]}
        />
      )}

      {threeDotsSwiper && (
        <ThreeDotsModal
          navigation={navigation}
          cardData={cardData?.[currentIndex]}
          userId={userId}
          postId={cardData?.[currentIndex]?.post_details?.ID}
          setShowModelComment={setThreeDotsSwiper}
          ShowComment={threeDotsSwiper}
          refreshList={refreshList}
          type={postType}
        />
      )}
    </>
  );
};

const styling = StyleSheet.create({
  profileImg: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
});

const styles = StyleSheet.create({
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
    padding: 20,
  },
  topRightIcons: {
    alignItems: "flex-end",
  },
  bottomIcons: {
    position: "absolute",
    bottom: 140,
    left: 0,
    right: 0,
    alignItems: "center",
  },
  iconButton: {
    padding: 12,
    borderRadius: 50,
    backgroundColor: "rgba(0,0,0,0.4)",
    marginHorizontal: 10,
  },
  progressContainer: {
    position: "absolute",
    bottom: 80,
    left: 20,
    right: 20,
    flexDirection: "row",
    alignItems: "center",
  },
  playPauseButton: {
    padding: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
  },
  timeRow: {
    flex: 1,
    marginHorizontal: 10,
  },
  slider: {
    width: "100%",
    height: 40,
  },
  timeText: {
    color: "white",
    fontSize: 12,
    marginHorizontal: 8,
  },
  profileContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 12,
    borderRadius: 12,
    position: "absolute",
    bottom: 20,
    left: 20,
    right: 20,
  },
  closeButton: {
    position: "absolute",
    top: 40,
    right: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 8,
  },
});