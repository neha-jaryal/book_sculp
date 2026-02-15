// PostMediaViewer.js
import React, { useEffect, useMemo, useState } from "react";
import { View, Modal, Dimensions } from "react-native";
import SwiperFlatList from "react-native-swiper-flatlist";
import FastImage from "@d11/react-native-fast-image";
import ImageViewing from "react-native-image-viewing"; // ← New zoom viewer
import MediaSlide from "./MediaSlide";

const { width } = Dimensions.get("window");

export const PostMediaViewer = ({
  media = [],
  onLike = () => {},
  onOpenProfileImage = () => {},
  containerHeight = 500,
}) => {
  const [zoomVisible, setZoomVisible] = useState(false);
  const [zoomIndex, setZoomIndex] = useState(0);

  // Preload images (only non-video media)
  useEffect(() => {
    const imgs = media
      .filter((m) => m?.media_type !== "video" && m?.url)
      .map((m) => ({ uri: m.url }));
    if (imgs.length) FastImage.preload(imgs);
  }, [media]);

  // Prepare list for zoom viewer (images only)
  const imageViewerList = useMemo(() => {
    return media
      .filter((m) => m?.media_type !== "video" && m?.url)
      .map((m) => ({ uri: m.url }));
  }, [media]);

  const handleSingleTap = (item) => {
    if (item?.media_type === "video" || !item?.url) return;
    const idx = imageViewerList.findIndex((x) => x.uri === item.url);
    if (idx >= 0) {
      setZoomIndex(idx);
      setZoomVisible(true);
    }
  };

  const handleDoubleTap = (item) => {
    onLike(item);
  };

  if (!media || media.length === 0) {
    return (
      <View style={{ height: containerHeight, backgroundColor: "#f0f0f0" }} />
    );
  }

  return (
    <>
      <View style={{ height: containerHeight }}>
        <SwiperFlatList
          data={media}
          renderItem={({ item, index }) => (
            <View
              key={`media-${index}-${item?.url || "no-url"}`}
              style={{
                width: width - 25,
                height: containerHeight,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <MediaSlide
                item={item}
                height={containerHeight}
                onSingleTap={() => handleSingleTap(item)}
                onDoubleTap={() => handleDoubleTap(item)}
              />
            </View>
          )}
          showPagination={media.length > 1}
          paginationActiveDotColor="#ff2b70"
          paginationDotColor="#ffffff"
          paginationStyle={{ bottom: 15 }}
          paginationStyleItemActive={{ width: 10, height: 10, borderRadius: 5 }}
          paginationStyleItemInactive={{ width: 8, height: 8, borderRadius: 4 }}
        />
      </View>

      {/* Modern Zoom Viewer */}
      <ImageViewing
        images={imageViewerList}
        imageIndex={zoomIndex}
        visible={zoomVisible}
        onRequestClose={() => setZoomVisible(false)}
        doubleTapToZoomInEnabled={true}
        doubleTapInterval={200}
        swipeToCloseEnabled={true}
        presentationStyle="overFullScreen"
      />
    </>
  );
};
