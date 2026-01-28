import React from "react";
import { useState } from "react";
import Video from "react-native-video";
// import VideoTrimmer from "react-native-video-processing";
import { View, StyleSheet, Button } from "react-native";
const VideoTrimming = ({ source }) => {
  const [trimmerState, setTrimmerState] = useState({});

  // Function to handle the onTrim event
  const handleTrim = async () => {
    const { startTime, endTime } = trimmerState;
    const options = {
      startTime: startTime,
      endTime: endTime,
      quality: VideoTrimmer.Constants.quality.QUALITY_1280x720,
      saveToCameraRoll: true,
      saveWithCurrentDate: true,
    };
    const newSource = await VideoTrimmer.trim(source, options);
    // Do something with the trimmed video source
  };

  return (
    <View style={styles.container}>
      <Video
        source={{ uri: source }}
        resizeMode="contain"
        style={styles.video}
        paused={true}
      />
      <VideoTrimmer
        source={source}
        onTrimmerChange={(state) => setTrimmerState(state)}
        style={styles.trimmer}
      />
      <Button title="Trim" onPress={handleTrim} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  video: {
    width: "100%",
    height: 200,
  },
  trimmer: {
    width: "100%",
    height: 50,
  },
});

export default VideoTrimming;
