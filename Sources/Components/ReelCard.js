import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  Pressable,
  FlatList,
} from "react-native";
import Slider from "@react-native-community/slider";
import Video from "react-native-video";
import AntDesign from "react-native-vector-icons/AntDesign";
import { GetDurationFormat } from "../Utility";
const ScreenWidth = Dimensions.get("window").width;
const ScreenHeight = Dimensions.get("window").height;

export const Reels = ({
  videos,
  backgroundColor = "red",
  headerTitle,
  headerIconName,
  headerIconColor,
  headerIconSize,
  headerIcon,
  headerComponent,
  onHeaderIconPress,
  optionsComponent,
  pauseOnOptionsShow,
  onSharePress,
  onCommentPress,
  onLikePress,
  onDislikePress,
  onFinishPlaying,
  minimumTrackTintColor,
  maximumTrackTintColor,
  thumbTintColor,
  timeElapsedColor,
  totalTimeColor,
}) => {
  const FlatlistRef = useRef(null);
  const [index, setIndex] = useState(0);
  const [ViewableItem, SetViewableItem] = useState("");
  const viewConfigRef = useRef({ viewAreaCoveragePercentThreshold: 70 });
  const applyProps = {
    backgroundColor: backgroundColor,
    headerTitle: headerTitle,
    headerIconName: headerIconName,
    headerIconColor: headerIconColor,
    headerIconSize: headerIconSize,
    headerIcon: headerIcon,
    headerComponent: headerComponent,
    onHeaderIconPress: onHeaderIconPress,
    optionsComponent: optionsComponent,
    pauseOnOptionsShow: pauseOnOptionsShow,
    onSharePress: onSharePress,
    onCommentPress: onCommentPress,
    onLikePress: onLikePress,
    onDislikePress: onDislikePress,
    onFinishPlaying: onFinishPlaying,
    minimumTrackTintColor: minimumTrackTintColor,
    maximumTrackTintColor: maximumTrackTintColor,
    thumbTintColor: thumbTintColor,
    timeElapsedColor: timeElapsedColor,
    totalTimeColor: totalTimeColor,
  };

  const onViewRef = useRef((viewableItems) => {
    if (viewableItems?.viewableItems?.length > 0)
      SetViewableItem(viewableItems.viewableItems[0].item._id || 0);
  });

  useEffect(() => {
    FlatlistRef.current.scrollToIndex({
      index,
      animated: true,
      viewPosition: 0,
    });
  }, [index]);

  return (
    <FlatList
      contentContainerStyle={{ flexGrow: 1 }}
      disableIntervalMomentum={true}
      onScrollEndDrag={() => console.log("end")}
      onScrollBeginDrag={() => console.log("start")}
      onScroll={(item) => {}}
      ref={FlatlistRef}
      data={videos}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item, index }) => (
        <ReelCard
          {...item}
          index={index}
          ViewableItem={ViewableItem}
          onFinishPlaying={(index) => {
            if (index !== videos.length - 1) {
              FlatlistRef.current.scrollToIndex({
                index: index,
                animated: true,
                viewPosition: 1,
              });
            }
          }}
          {...applyProps}
        />
      )}
      getItemLayout={(_data, index) => ({
        length: ScreenHeight,
        offset: ScreenHeight,
        index,
      })}
      pagingEnabled
      decelerationRate={0.9}
      onViewableItemsChanged={onViewRef.current}
      viewabilityConfig={viewConfigRef.current}
    />
  );
};

export const ReelCard = ({
  uri,
  _id,
  ViewableItem,
  liked = false,
  disliked = false,
  index,
  backgroundColor = "transparent",
  headerTitle = "Reels",
  headerIconName,
  headerIconColor,
  headerIconSize,
  headerIcon,
  headerComponent,
  onHeaderIconPress = () => {},

  // Options Props
  optionsComponent,
  pauseOnOptionsShow = true,
  onSharePress = () => {},
  onCommentPress = () => {},
  onLikePress = () => {},
  onDislikePress = () => {},

  // Player Props
  onFinishPlaying = () => {},

  // Slider Props
  minimumTrackTintColor = "white",
  maximumTrackTintColor = "grey",
  thumbTintColor = "white",

  // Time Props
  timeElapsedColor = "white",
  totalTimeColor = "white",
}) => {
  // ref for Video Player
  const VideoPlayer = useRef(null);
  // States
  const [VideoDimensions, SetVideoDimensions] = useState({
    width: ScreenWidth,
    height: ScreenWidth,
  });
  const [Progress, SetProgress] = useState(0);
  const [Duration, SetDuration] = useState(0);
  const [Paused, SetPaused] = useState(false);
  const [ShowOptions, SetShowOptions] = useState(false);

  // Play/Pause video according to viisibility
  useEffect(() => {
    if (ViewableItem === _id) SetPaused(false);
    else SetPaused(true);
  }, [ViewableItem]);

  // Pause when use toggle options to True
  useEffect(() => {
    if (pauseOnOptionsShow) {
      if (ShowOptions) SetPaused(true);
      else SetPaused(false);
    }
  }, [ShowOptions, pauseOnOptionsShow]);

  // Callbhack for Seek Update
  const SeekUpdate = useCallback(
    async (seekTime) => {
      try {
        if (VideoPlayer.current)
          VideoPlayer.current.seek((seekTime * Duration) / 100 / 1000);
      } catch (error) {}
    },
    [Duration, ShowOptions]
  );

  // Callback for PlayBackStatusUpdate
  const PlayBackStatusUpdate = (playbackStatus) => {
    try {
      let currentTime = Math.round(playbackStatus.currentTime);
      let duration = Math.round(playbackStatus.seekableDuration);
      if (currentTime)
        if (duration) SetProgress((currentTime / duration) * 100);
    } catch (error) {}
  };

  // function for getting video dimensions on load complete
  const onLoadComplete = (event) => {
    const { naturalSize } = event;

    try {
      const naturalWidth = naturalSize.width;
      const naturalHeight = naturalSize.height;
      if (naturalWidth > naturalHeight) {
        SetVideoDimensions({
          width: ScreenWidth,
          height: ScreenWidth * (naturalHeight / naturalWidth),
        });
      } else {
        SetVideoDimensions({
          width: ScreenHeight * (naturalWidth / naturalHeight),
          height: ScreenHeight,
        });
      }
      SetDuration(event.duration * 1000);
    } catch (error) {}
  };

  // function for showing options
  const onMiddlePress = async () => {
    try {
      SetShowOptions(!ShowOptions);
    } catch (error) {}
  };

  // fuction to Go back 10 seconds
  const onFirstHalfPress = async () => {
    try {
      if (VideoPlayer.current) {
        let toSeek = Math.floor((Progress * Duration) / 100) / 1000;
        if (toSeek > 10) VideoPlayer.current.seek(toSeek - 10);
      }
    } catch (error) {}
  };

  // fuction to skip 10 seconds
  const onSecondHalfPress = async () => {
    try {
      if (VideoPlayer.current) {
        let toSeek = Math.floor((Progress * Duration) / 100) / 1000;
        VideoPlayer.current.seek(toSeek + 10);
      }
    } catch (error) {}
  };

  // Manage error here
  const videoError = (error) => {};

  // useMemo for Slider
  const GetSlider = useMemo(
    () => (
      <View style={styles.SliderContainer}>
        <Text style={[styles.TimeOne, { color: timeElapsedColor }]}>
          {GetDurationFormat(Math.floor((Progress * Duration) / 100))}
        </Text>
        <Slider
          style={{ height: 40, width: "100%" }}
          minimumValue={0}
          maximumValue={100}
          minimumTrackTintColor={minimumTrackTintColor}
          maximumTrackTintColor={maximumTrackTintColor}
          thumbTintColor={thumbTintColor}
          value={Progress}
          onSlidingComplete={(data) => SeekUpdate(data)}
        />
        <Text style={[styles.TimeTwo, { color: totalTimeColor }]}>
          {GetDurationFormat(Duration || 0)}
        </Text>
      </View>
    ),
    [
      Duration,
      Progress,
      ShowOptions,
      thumbTintColor,
      totalTimeColor,
      timeElapsedColor,
      minimumTrackTintColor,
      maximumTrackTintColor,
    ]
  );

  // useMemo for Slider
  const GetHeader = useMemo(
    () => (
      <View style={styles.HeaderContainer}>
        <Header
          onPress={onHeaderIconPress}
          text={headerTitle}
          customComponent={headerComponent}
          customIcon={headerIcon}
          color={headerIconColor}
          name={headerIconName}
          size={headerIconSize}
        />
      </View>
    ),
    [
      ShowOptions,
      headerComponent,
      headerIcon,
      headerIconColor,
      headerIconName,
      headerIconSize,
      headerTitle,
      onHeaderIconPress,
    ]
  );

  // useMemo for Options
  const GetButtons = useMemo(
    () => (
      <View style={styles.OptionsContainer}>
        {optionsComponent ? null : (
          <>
            <Buttons
              name={liked ? "like1" : "like2"}
              text="like"
              color={liked ? "dodgerblue" : "white"}
              onPress={() => onLikePress(_id)}
            />
            <Buttons
              name={disliked ? "dislike1" : "dislike2"}
              text="like"
              color={disliked ? "dodgerblue" : "white"}
              onPress={() => onDislikePress(_id)}
            />
            <Buttons
              name="message1"
              text="comment"
              onPress={() => onCommentPress(_id)}
            />
            <Buttons
              name="sharealt"
              text="share"
              onPress={() => onSharePress(_id)}
            />
          </>
        )}
      </View>
    ),
    [ShowOptions, optionsComponent, liked, disliked]
  );

  return (
    <Video
      ref={VideoPlayer}
      source={{
        uri: uri,
      }}
      style={{
        ...VideoDimensions,
      }}
      resizeMode="cover"
      onError={videoError}
      playInBackground={false}
      progressUpdateInterval={1000}
      paused={Paused}
      muted={false}
      repeat={true}
      onLoad={onLoadComplete}
      onProgress={PlayBackStatusUpdate}
      onEnd={() => onFinishPlaying(index)}
    />
  );
};

export const Buttons = ({
  customComponent,
  name = "like2",
  text = "Like",
  color = "white",
  size = 30,
  onPress,
}) => {
  return (
    <Pressable style={styles.buttonContainer} onPress={onPress}>
      {customComponent ? (
        customComponent
      ) : (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <AntDesign name={name} color={color} size={size} />
          <Text style={{ marginTop: 10, fontWeight: "bold", color: "white" }}>
            {text}
          </Text>
        </View>
      )}
    </Pressable>
  );
};

export const Header = ({
  customComponent,
  customIcon,
  name = "arrowleft",
  text = "Reels",
  color = "white",
  size = 30,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress}>
      {customComponent ? (
        customComponent
      ) : (
        <View style={styles.headerContainer}>
          {customIcon ? null : (
            <AntDesign name={name} color={color} size={size} />
          )}

          <Text style={styles.Text}>{text}</Text>
        </View>
      )}
    </Pressable>
  );
};

// Stylesheet
const styles = StyleSheet.create({
  container: {
    width: ScreenWidth,
    height: ScreenHeight,
    justifyContent: "center",
  },
  buttonContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: 10,
    paddingBottom: 10,
    marginBottom: 5,
  },
  SliderContainer: {
    position: "absolute",
    width: ScreenWidth,
    height: 55,
    bottom: 0,
    zIndex: 100,
  },
  TimeOne: {
    color: "grey",
    position: "absolute",
    left: 15,
    fontSize: 13,
    bottom: 5,
  },
  TimeTwo: {
    color: "grey",
    position: "absolute",
    right: 15,
    fontSize: 13,
    bottom: 5,
  },
  OptionsContainer: {
    position: "absolute",
    right: 10,
    bottom: 70,
    zIndex: 100,
  },
  HeaderContainer: {
    position: "absolute",
    width: ScreenWidth,
    top: 0,
    height: 50,
    zIndex: 100,
  },
  FirstHalf: {
    position: "absolute",
    top: 0,
    left: 0,
    width: ScreenWidth * 0.25,
    height: ScreenHeight,
    zIndex: 99,
  },
  SecondHalf: {
    position: "absolute",
    top: 0,
    right: 0,
    width: ScreenWidth * 0.25,
    height: ScreenHeight,
    zIndex: 99,
  },
  headerContainer: {
    alignItems: "center",
    flexDirection: "row",
    padding: 10,
    marginLeft: 20,
  },
  Text: {
    fontWeight: "bold",
    color: "white",
    fontSize: 20,
    marginLeft: 20,
  },
});
