// MediaSlide.js
import React, { useRef, useState } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Animated,
  TouchableWithoutFeedback,
  Text,
  Dimensions,
  Image,
} from "react-native";
import Video from "react-native-video";
import AntDesign from "react-native-vector-icons/AntDesign";

const { width: SCREEN_W } = Dimensions.get("window");

const MediaSlide = ({
  item,
  onSingleTap = () => {},
  onDoubleTap = () => {},
  containerStyle,
  height = 500,
}) => {
  const isVideo = item?.media_type === "video" || item?.type === "video";
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  // Heart animation on double-tap
  const heartScale = useRef(new Animated.Value(0)).current;
  const heartOpacity = useRef(new Animated.Value(0)).current;

  const showHeart = () => {
    heartScale.setValue(0.6);
    heartOpacity.setValue(1);
    Animated.parallel([
      Animated.spring(heartScale, {
        toValue: 1.1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.timing(heartOpacity, {
        toValue: 0,
        duration: 700,
        delay: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  // Double-tap detection
  const lastTap = useRef(null);
  const DOUBLE_TAP_DELAY = 300;

  const handlePress = () => {
    const now = Date.now();

    if (lastTap.current && now - lastTap.current < DOUBLE_TAP_DELAY) {
      // Double tap detected
      lastTap.current = null;
      showHeart();
      onDoubleTap(item);
    } else {
      lastTap.current = now;
      setTimeout(() => {
        if (lastTap.current === now) {
          // Single tap
          lastTap.current = null;
          onSingleTap(item);
        }
      }, DOUBLE_TAP_DELAY);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress} accessible={true}>
      <View style={[styles.wrapper, { height }, containerStyle]}>
        <View style={[styles.mediaContainer, { height }]}>
          {isVideo ? (
            <Video
              source={{ uri: item?.url }}
              style={[styles.media, { height }]}
              resizeMode="cover"
              paused={false}
              repeat={true}
              muted={true}
              playInBackground={false}
              ignoreSilentSwitch="obey"
              onLoadStart={() => {
                setLoading(true);
                setError(false);
              }}
              onLoad={() => setLoading(false)}
              onError={() => {
                setLoading(false);
                setError(true);
              }}
              onLoadEnd={() => setLoading(false)}
            />
          ) : (
            <View style={styles.container}>
              <Image
                source={{ uri: item?.url }}
                style={StyleSheet.absoluteFillObject} // fills the container
                blurRadius={10} // adjust blur strength (10-30 usually looks good)
              />

              {/* Semi-transparent overlay to make blur softer */}
              <View
                style={[
                  StyleSheet.absoluteFillObject,
                  { backgroundColor: "rgba(0,0,0,0.4)" },
                ]}
              />

              {/* Main image on top */}
              <Image
                source={{ uri: item?.url }}
                style={[styles.media, { height }]}
                resizeMode="contain"
                // onLoadStart={() => {
                //   setLoading(true);
                //   setError(false);
                // }}
                // onLoadEnd={() => setLoading(false)}
                // onError={() => {
                //   setLoading(false);
                //   setError(true);
                // }}
              />
            </View>
          )}

          {loading && (
            <View style={[styles.loadingOverlay, { height }]}>
              <ActivityIndicator size="large" color="#ff2b70" />
            </View>
          )}

          {error && (
            <View style={[styles.errorOverlay, { height }]}>
              <AntDesign name="exclamationcircleo" size={36} color="#fff" />
              <Text style={styles.errorText}>Failed to load</Text>
            </View>
          )}

          {/* Heart animation overlay */}
          <Animated.View
            pointerEvents="none"
            style={[
              styles.heartOverlay,
              {
                transform: [{ scale: heartScale }],
                opacity: heartOpacity,
              },
            ]}
          >
            <AntDesign name="heart" size={120} color="#ff2b70" />
          </Animated.View>

          {/* Video play badge */}
          {isVideo && (
            <View style={styles.playBadge}>
              <AntDesign name="playcircleo" size={32} color="#fff" />
            </View>
          )}
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

export default MediaSlide;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
    justifyContent: "center",
    alignItems: "center",
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(255,255,255,0.1)", // or dark transparent
    backdropFilter: "blur(20px)", // iOS + modern Android
    // Fallback for older Android
    backgroundColor: "rgba(0,0,0,0.6)",
  },
  media: {
    width: "100%",
    height: "100%",
  },
  wrapper: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
  },
  mediaContainer: {
    width: "100%",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#111",
  },
  media: {
    width: "100%",
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
  },
  errorOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  errorText: {
    color: "#fff",
    marginTop: 12,
    fontSize: 16,
  },
  heartOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    pointerEvents: "none",
  },
  playBadge: {
    position: "absolute",
    right: 16,
    bottom: 16,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 30,
    padding: 8,
  },
});
