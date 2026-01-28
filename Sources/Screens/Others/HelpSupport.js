import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  TextComponent,
  Header,
  NotificationCard,
  DropDownList,
  InputBox,
} from "../../Components";
import { Sizes, Colors, Images } from "../../Constants";
import { Styles } from "../../Styles";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Image } from "react-native";
import { Searchbar } from "react-native-paper";

export const HelpSupport = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFor, setSearchFor] = useState("");
  const [message, setMessage] = useState("");

  const onChangeSearch = (query) => setSearchQuery(query);
  const questionsList = [
    {
      question: "Where can I update my payment information?",
      answer:
        "At the top corner of the page, move your cursor over your profile image. Click on “Settings” and then “Payout Settings”. Next you will need to click “Edit your Account” and log into Stripe. Once you are logged in you will be able to edit your card on file.",
    },
    {
      question: "Where do I update my password?",
      answer: "In the account setting",
    },
    {
      question: "How long does it take to get a job?",
      answer:
        "Landing a job typically doesn’t happen overnight. Apply to as many jobs that you qualify for and you will have a better chance to land a booking. There is no time frame on when you can get a booking, so be patient. You can find out more about the booking process by reading our blog post.",
    },
    {
      question: "Can I get a refund after purchasing a package?",
      answer:
        "We do not offer any refunds. All sales are final. You can cancel your package plan and switch over to Hobby, which is our free portfolio option. Any questions or concerns, please email us at info@booksculp.com.",
    },
    {
      question: "How may I get in touch with you?",
      answer:
        "The best way to get in touch with us is through email: info@booksculp.com or you can message us on any of our social media platforms.",
    },
    {
      question: "What information is needed for Stripe?",
      answer:
        "To transact through Stripe, you must verify your personal identification or business identification and your current bank account information (account number/routing number). Your Social Security #",
    },
    {
      question: "Is your site secure? Is stripe secure?",
      answer:
        "Stripe's Privacy Policy explains how and for what purposes they collect, use, retain, disclose, and safeguard any personal data you provide to them. You can also visit Stripe’s Privacy Center to learn more about privacy at Stripe. https://stripe.com/privacy-center/legal",
    },
    {
      question: "How do I update my albums?",
      answer:
        "If you have the Hobby package, go to settings, then click “edit profile” and you can remove any images you want in place of your new images. To update your albums in Professional/Premium/Professional Pro/Premium Pro, go to your dashboard and click on the three lined icon at the top left corner of your screen, then click on “Manage portfolios” and add your new portfolio.",
    },
    {
      question: "What types of jobs are listed?",
      answer:
        "Clients are booking talent for a variety of different jobs. Most jobs include, photoshoots, apparel shoots, commercials, runway events, fit modeling, tv appearances, etc.",
    },
    {
      question: "How do I get a booking?",
      answer:
        "Keep an eye out for job posts on the website. If there is a job you qualify for, submit a proposal for it. The client will view your profile and their next steps would either be to book you, or pass for this specific project. Clients may also follow you to connect for future projects. There is no guarantee that you will be booked, that is just how this industry works. Though there are ways you can better your chances of being booked on jobs. Having a good profile with eye catching images will help your chances of being booked for a project.",
    },
    {
      question: "How do I disable my account?",
      answer:
        "To disable your account, move your cursor over your profile image, click on “Settings” and then “Account Settings” and you will see the option to disable your account.",
    },
    {
      question: "Why can I not delete my account?",
      answer:
        "When a model has bad reviews, they can delete their account and open up a new account with the same email. Which removes their reviews to start fresh. Not deleting your account makes sure this does not happen.",
    },
    {
      question: "How do I connect with clients?",
      answer:
        "Models are unable to view clients we have listed on our website, clients can only see your profile. If a client decides to follow you, you will be able to message them and view their profile.",
    },
    {
      question: "(Client) Can I book more than one model for a job?",
      answer: "",
    },
  ];
  const searchType = [
    { label: "Model", value: "Model" },
    { label: "Jobs", value: "Jobs" },
    { label: "Kids", value: "Kids" },
  ];

  return (
    <>
      <Header text={"Help & Support"} navigation={navigation} />
      <Searchbar
        placeholder="Start Your Search..."
        onChangeText={onChangeSearch}
        value={searchQuery}
        loading={true}
        style={{
          borderRadius: 10,
          marginHorizontal: 20,
          marginTop: 20,
        }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
          }}
        >
          <TextComponent
            text="Account Security & Settings"
            size={Sizes?.xl}
            fontWeight="400"
          />
          <TextComponent
            text={
              "Consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua aut enim ad minim veniamac quis nostrud exercitation ullamco laboris."
            }
            size={Sizes?.s}
            style={{ paddingVertical: 10 }}
            fontWeight="400"
            color={Colors?.darkgrey}
          />
        </View> */}

        <View style={{ marginBottom: 20 }}>
          {questionsList?.map((item) => {
            return <QuestionCard cardData={item} />;
          })}
        </View>
        <View
          style={{
            ...Styles?.container,
            ...Styles?.headingView,
          }}
        >
          <TextComponent
            text="Didn't find your solution?"
            size={Sizes?.xl}
            fontWeight="400"
          />
          <View style={Styles?.separator} />
          <View
            style={{
              ...Styles?.container,
              ...Styles?.headingView,
              marginHorizontal: 0,
              width: "100%",
              paddingVertical: 15,
            }}
          >
            <TextComponent
              text="Ask your query"
              size={Sizes?.l}
              fontWeight="400"
            />
          </View>
          <DropDownList
            placeholder={"Select Query type"}
            value={searchFor}
            setValue={setSearchFor}
            options={searchType}
            border={true}
            style={{ marginTop: 20 }}
          />
          <InputBox
            type="description"
            value={message}
            placeholder="Message"
            onChangeText={(val) => setMessage(val)}
            style={{ marginVertical: 8 }}
          />
          <TouchableOpacity
            style={{
              ...Styles?.smallButton,
              backgroundColor: Colors?.themeColor,
              width: "40%",
              marginVertical: 10,
            }}
            onPress={() => navigation?.goBack()}
          >
            <TextComponent
              text="Submit"
              color={Colors?.white}
              size={Sizes?.l}
              style={{ paddingVertical: 4, paddingHorizontal: 10 }}
            />
          </TouchableOpacity>
        </View>
        <View style={{ height: 40 }} />
      </ScrollView>
    </>
  );
};

const QuestionCard = (props) => {
  const { cardData } = props;
  const [showDetails, setShowDetails] = useState();

  return (
    <>
      <TouchableOpacity
        onPress={() => {
          setShowDetails(!showDetails);
        }}
        style={{
          ...Styles?.container,
          ...Styles?.headingView,
        }}
      >
        <View style={Styles?.flexRow}>
          <TextComponent
            text={cardData?.question}
            size={Sizes?.l}
            fontWeight="400"
            style={{ paddingLeft: 10 }}
          />
        </View>

        {showDetails && (
          <>
            <View style={Styles?.separator} />
            <View
              style={{
                ...Styles?.container,
                // backgroundColor: Colors?.lightThemeColor,
                marginHorizontal: 0,
                width: "100%",
                marginTop: 8,
                borderRadius: 8,
              }}
            >
              <View style={{ ...Styles?.flexRow, marginBottom: 8 }}>
                <TextComponent text={cardData?.question} size={Sizes?.l} />
              </View>
              <View style={{ ...Styles?.row }}>
                <TextComponent
                  text={cardData?.answer}
                  size={Sizes?.s}
                  fontWeight="400"
                />
              </View>
            </View>
          </>
        )}
      </TouchableOpacity>
    </>
  );
};

const styling = StyleSheet.create({
  headingView: {
    borderLeftWidth: 4,
    borderColor: Colors?.themeColor,
    backgroundColor: Colors?.white,
    borderRadius: 10,
    marginTop: 15,
    paddingVertical: 25,
  },
  imageIconView: {
    marginLeft: 12,
    marginRight: 5,
  },
});
