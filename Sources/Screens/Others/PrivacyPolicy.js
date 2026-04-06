import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { AuthHeader, TextComponent, Lotties } from "../../Components";
import { Sizes, Colors, JSONS } from "../../Constants";
import { Styles } from "../../Styles";

export const PrivacyPolicy = ({ navigation }) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <AuthHeader name="Privacy Policy" navigation={navigation} />
      <View style={Styles?.cardContainer}>
        <Lotties
          source={JSONS?.privacyPolicyJSON}
          style={{
            width: 250, 
            alignSelf: "center",
            height: 150
          }}
        />
        <TextComponent
          text={`This privacy policy has been compiled to better serve those who are concerned with how their ‘Personally Identifiable Information’ (PII) is being used online. PII, as described in US privacy law and information security, is information that can be used on its own or with other information to identify, contact, or locate a single person, or to identify an individual in context. Please read our privacy policy carefully to get a clear understanding of how we collect, use, protect or otherwise handle your Personally Identifiable Information in accordance with our website.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`What personal information do we collect from the people that visit our blog, website or app?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`When ordering or registering on our site, as appropriate, you may be asked to enter your name, email address, mailing address, phone number, credit card information, social security number, hobbies or other details to help you with your experience.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`When do we collect information?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`We collect information from you when you register on our site, respond to a survey, fill out a form or enter information on our site.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`How do we use your information?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`We may use the information we collect from you when you register, make a purchase, sign up for our newsletter, respond to a survey or marketing communication, surf the website, or use certain other site features in some of, but not limited to, the following ways:`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`1. To personalize your experience and to allow us to deliver the type of content and product offerings in which you are most interested.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`2. To improve our website in order to better serve you;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`3. To allow us to better service you in responding to your customer service requests;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`4. To administer a contest, promotion, survey or other site feature;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`5. To quickly process your transactions;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`6. To ask for ratings and reviews of services or products; and`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`7. To follow up after correspondence (live chat, email or phone inquiries).`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />

        <TextComponent
          text={`How do we protect your information?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Our website is scanned on a regular basis for security holes and known vulnerabilities in order to make your visit to our site as safe as possible. We use regular Malware Scanning. Your personal information is contained behind secured networks and is only accessible by a limited number of persons who have special access rights to such systems, and are required to keep the information confidential. In addition, all sensitive/credit information you supply is encrypted via Secure Socket Layer (SSL) technology. We implement a variety of security measures when a user places an order enters, submits, or accesses their information to maintain the safety of your personal information. ?All transactions are processed through a gateway provider and are not stored or processed on our servers.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Do we use ‘cookies’?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Yes. Cookies are small files that a site or its service provider transfers to your computer’s hard drive through your Web browser (if you allow) that enables the site’s or service provider’s systems to recognize your browser and capture and remember certain information. For instance, we use cookies to help us remember and process the items in your shopping cart. They are also used to help us understand your preferences based on previous or current site activity, which enables us to provide you with improved services. We also use cookies to help us compile aggregate data about site traffic and site interaction so that we can offer better site experiences and tools in the future.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`We use cookies to:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`1. Help remember and process the items in the shopping cart;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`2. Understand and save user’s preferences for future visits;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`3. Keep track of advertisements; and`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`4. Compile aggregate data about site traffic and site interactions in order to offer better site experiences and tools in the future. We may also use trusted third-party services that track this information on our behalf.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`You can choose to have your computer warn you each time a cookie is being sent, or you can choose to turn off all cookies. You do this through your browser settings. Since each browser is a little different, look at your browser’s Help Menu to learn the correct way to modify your cookies.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`If users disable cookies in their browser:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`If you turn cookies off, some of the features that make your site experience more efficient may not function properly.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Third-party disclosure`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`We do not sell, trade, or otherwise transfer to outside parties your Personally Identifiable Information unless we provide users with advance notice. This does not include website hosting partners and other parties who assist us in operating our website, conducting our business, or serving our users, so long as those parties agree to keep this information confidential. We may also release information when its release is appropriate to comply with the law, enforce our site policies, or protect ours or others’ rights, property or safety. However, non-personally identifiable visitor information may be provided to other parties for marketing, advertising, or other uses.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Third-party links`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Occasionally, at our discretion, we may include or offer third-party products or services on our website. These third-party sites have separate and independent privacy policies. We therefore have no responsibility or liability for the content and activities of these linked sites. Nonetheless, we seek to protect the integrity of our site and welcome any feedback about these sites.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Google`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Google’s advertising requirements can be summed up by Google’s Advertising Principles. They are put in place to provide a positive experience for users and may be read in full at the following: https://support.google.com/adwordspolicy/answer/1316548?hl=en We use Google AdSense Advertising on our website. Google, as a third-party vendor, uses cookies to serve ads on our site. Google’s use of the DART cookie enables it to serve ads to our users based on previous visits to our site and other sites on the Internet. Users may opt-out of the use of the DART cookie by visiting the Google Ad and Content Network privacy policy.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`We have implemented the following:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`1. Remarketing with Google AdSense`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`2. Google Display Network Impression Reporting`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`3. Demographics and Interests Reporting`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`4. DoubleClick Platform Integration`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`We, along with third-party vendors such as Google use first-party cookies (such as the Google Analytics cookies) and third-party cookies (such as the DoubleClick cookie) or other third-party identifiers together to compile data regarding user interactions with ad impressions and other ad service functions as they relate to our website.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Opting out:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Users can set preferences for how Google advertises to you using the Google Ad Settings page. Alternatively, you can opt out by visiting the Network Advertising Initiative Opt Out page or by using the Google Analytics Opt Out Browser add on.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`California Online Privacy Protection Act`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`CalOPPA is the first state law in the nation to require commercial websites and online services to post a privacy policy. The law’s reach stretches well beyond California to require any person or company in the United States (and conceivably the world) that operates websites collecting Personally Identifiable Information from California consumers to post a conspicuous privacy policy on its website stating exactly the information being collected and those individuals or companies with whom it is being shared. – See more at: http://consumercal.org/california-online- privacy-protection-act-caloppa/#sthash.0FdRbT51.dpuf`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`According to CalOPPA, we agree to the following:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Users can visit our site anonymously. Once this privacy policy is created, we will add a link to it on our home page or as a minimum, on the first significant page after entering our website. Our Privacy Policy link includes the word ‘Privacy’ and can easily be found on the page specified above. You will be notified of any Privacy Policy changes:`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`1. On our Privacy Policy Page`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Can change your personal information:`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`1. By logging in to your account`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`How does our site handle Do Not Track signals?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`We honor Do Not Track signals and Do Not Track, plant cookies, or use advertising when a Do Not Track (DNT) browser mechanism is in place.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Does our site allow third-party behavioral tracking?`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`It’s also important to note that we allow third-party behavioral tracking.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`COPPA (Children Online Privacy Protection Act)`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`When it comes to the collection of personal information from children under the age of 13 years old, the Children’s Online Privacy Protection Act (COPPA) puts parents in control. The Federal Trade Commission, United States’ consumer protection agency, enforces the COPPA Rule, which spells out what operators of websites and online services must do to protect children’s privacy and safety online. We do not specifically market to children under the age of 13 years old. Do we let third-parties, including ad networks or plug-ins collect PII from children under 13?`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Fair Information Practices`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`The Fair Information Practices Principles form the backbone of privacy law in the United States and the concepts they include have played a significant role in the development of data protection laws around the globe. Understanding the Fair Information Practice Principles and how they should be implemented is critical to comply with the various privacy laws that protect personal information.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`In order to be in line with Fair Information Practices we will take the following responsive action, should a data breach occur:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`We will notify you via email within 7 business days. We also agree to the Individual Redress Principle which requires that individuals have the right to legally pursue enforceable rights against data collectors and processors who fail to adhere to the law. This principle requires not only that individuals have enforceable rights against data users, but also that individuals have recourse to courts or government agencies to investigate and/or prosecute non-compliance by data processors.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`CAN SPAM Act`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`The CAN-SPAM Act is a law that sets the rules for commercial email, establishes requirements for commercial messages, gives recipients the right to have emails stopped from being sent to them, and spells out tough penalties for violations.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`We collect your email address in order to:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`1. Send information, respond to inquiries, and/or other requests or questions`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`2. Process orders and to send information and updates pertaining to orders.`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`3. Send you additional information related to your product and/or service`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`4. Market to our mailing list or continue to send emails to our clients after the original transaction has occurred.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`To be in accordance with CANSPAM, we agree to the following:`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`1. Not to use false or misleading subjects or email addresses;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`2. Identify the message as an advertisement in some reasonable way;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`3. Include the physical address of our business or site headquarters;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`4. Monitor third-party email marketing services for compliance, if one is used;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`5. Honor opt-out/unsubscribe requests quickly; and`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`6. Allow users to unsubscribe by using the link at the bottom of each email.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`If at any time you would like to unsubscribe from receiving future emails, you can follow the instructions at the bottom of each email and we will promptly remove you from ALL correspondence.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`Contacting Us`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`If there are any questions regarding this privacy policy, you may contact us using the information below: BookSculp1901 Napa Valley Drive, Suite 100 Little Rock, Arkansas 72212 USA info@sculpagency.com (479) 841-6729`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
      </View>
      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

const styling = StyleSheet.create({
  headingView: {
    lineHeight: 24,
    textAlign: "justify",
    marginTop: 25,
    marginBottom: 10,
  },
  text: {
    lineHeight: 24,
    textAlign: "justify",
  },
});
