import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, TextComponent } from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import { routeName } from "../../Utility/routeName";
import { PostCard } from "../../Components/PostCard";
import FontAwesome from "react-native-vector-icons/FontAwesome";

export const PostListing = ({ navigation }) => {
  const postCardsList = [
    {
      name: "Neha Thakur",
      location: "Mumbai, India",
      image: {
        uri:
          "https://fastly.picsum.photos/id/1/200/300.jpg?hmac=jH5bDkLr6Tgy3oAg5khKCHeunZMHq0ehBZr6vGifPLY",
      },
      profile: Images?.postProfile,
      likes: "3,787",
      caption: "Its Just Transition Magic.. 😉 👍 💞",
      comments: "586",
    },
    {
      name: "Neha Thakur",
      location: "Himachal Pardesh, India",
      image: {
        uri:
          "https://fastly.picsum.photos/id/0/5000/3333.jpg?hmac=_j6ghY5fCfSD6tvtcV74zXivkJSPIfR9B8w34XeQmvU",
      },
      profile: Images?.postProfile,
      likes: "2,542",
      caption: "Some days start better than others.. 💞",
      comments: "586",
    },
    {
      name: "Neha Thakur",
      location: "Mumbai, India",
      image: {
        uri:
          "https://fastly.picsum.photos/id/11/2500/1667.jpg?hmac=xxjFJtAPgshYkysU_aqx2sZir-kIOjNR9vx0te7GycQ",
      },
      profile: Images?.postProfile,
      likes: "3,787",
      caption: "Its Just Transition Magic.. 😉 👍 💞",
      comments: "586",
    },
    {
      name: "Neha Thakur",
      location: "Himachal Pardesh, India",
      image: {
        uri:
          "https://fastly.picsum.photos/id/13/2500/1667.jpg?hmac=SoX9UoHhN8HyklRA4A3vcCWJMVtiBXUg0W4ljWTor7s",
      },
      profile: Images?.postProfile,
      likes: "2,542",
      caption: "Some days start better than others.. 💞",
      comments: "586",
    },
    {
      name: "Neha Thakur",
      location: "Mumbai, India",
      image: {
        uri:
          "https://fastly.picsum.photos/id/29/4000/2670.jpg?hmac=rCbRAl24FzrSzwlR5tL-Aqzyu5tX_PA95VJtnUXegGU",
      },
      profile: Images?.postProfile,
      likes: "3,787",
      caption: "Its Just Transition Magic.. 😉 👍 💞",
      comments: "586",
    },
    {
      name: "Neha Thakur",
      location: "Himachal Pardesh, India",
      image: {
        uri:
          "https://fastly.picsum.photos/id/26/4209/2769.jpg?hmac=vcInmowFvPCyKGtV7Vfh7zWcA_Z0kStrPDW3ppP0iGI",
      },
      profile: Images?.postProfile,
      likes: "2,542",
      caption: "Some days start better than others.. 💞",
      comments: "586",
    },
  ];

  return (
    <>
      <Header text="Posts" navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false}>
        {postCardsList?.map((item, index) => {
          return <PostCard cardData={item} index={index} />;
        })}
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
};

const styling = StyleSheet.create({
  headerTopView: {
    flexDirection: "row",
    padding: 10,
    alignItems: "center",
  },
  profileView: {
    alignItems: "center",
    marginBottom: 15,
    width: "35%",
    // backgroundColor: 'red',
  },
  profileImg: {
    width: dimensionheight(12),
    height: dimensionheight(12),
    top: 0,
    borderRadius: dimensionheight(100),
    resizeMode: "cover",
  },
  userDeatilView: {
    width: "35%",
    alignItems: "center",
    // bottom: 20,
  },
});
