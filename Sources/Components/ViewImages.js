import React, { useState, useEffect } from "react";
import { View, StyleSheet } from "react-native";
import ImageViewing from "react-native-image-viewing";
import { Colors, Sizes } from "../Constants";
import { TextComponent } from "./TextComponent";

export const ViewImages = ({ show, setShow, images, initialIndex = 0 }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    if (show) {
      setCurrentIndex(initialIndex);
    }
  }, [show, initialIndex]);

  const formattedImages = images.map((img, i) => ({
    uri: img?.url || img?.uri || img?.value || img,
  }));

  return (
    <ImageViewing
      images={formattedImages}
      imageIndex={initialIndex}
      visible={show}
      onRequestClose={() => setShow(false)}
      onImageIndexChange={(index) => setCurrentIndex(index)}
      presentationStyle="overFullScreen"
      swipeToCloseEnabled={true}
      doubleTapToZoomEnabled={true}
      FooterComponent={() => (
        <>
          {images[currentIndex]?.label && (
            <TextComponent
              text={" ◉ " + images[currentIndex]?.label}
              size={Sizes.s}
              color={Colors.white}
              style={{
                ...styles.shadowText,
                textAlign: "center",
                marginBottom: 30,
              }}
            />
          )}
          <View style={styles.footerContainer}>
            {formattedImages.map((_, index) => (
              <View
                key={`dot-${index}`}
                style={[
                  styles.dot,
                  {
                    backgroundColor:
                      index === currentIndex ? Colors.pink : Colors.darkgrey,
                  },
                ]}
              />
            ))}
          </View>
        </>
      )}
    />
  );
};

const styles = StyleSheet.create({
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingBottom: 40,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 5,
  },
  shadowText: {
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: -2, height: 0 },
    textShadowRadius: 5,
  },
});
