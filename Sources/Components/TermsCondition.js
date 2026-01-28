import React from "react";
import {
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from "react-native";
import { Sizes, Colors, JSONS } from "../Constants";
import { Styles } from "../Styles";
import { TextComponent } from "./TextComponent";
import { Lotties } from "./Lottie";

export const TermsCondition = (props) => {
  const { setAgree, setTermsModal } = props;
  return (
    <>
      <TextComponent
        text={`Terms & Conditions`}
        size={Sizes?.xl}
        style={{ textAlign: "center", paddingVertical: 10 }}
      />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Lotties
          source={JSONS?.termsOfServiceJSON}
          style={{ width: "100%", marginTop: 10 }}
        />
        <TextComponent
          text={`Introduction`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Welcome to www.booksculp.com. This website is owned and operated by www.booksculp.com. By visiting our website and accessing the information, resources, services, products, and tools we provide, you understand and agree to accept and adhere to the following terms and conditions as stated in this policy (hereafter referred to as ‘User Agreement’).`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={styling?.text}
        />
        <TextComponent
          text={`This agreement is in effect as of Feb 22, 2018.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text, marginVertical: 10 }}
        />
        <TextComponent
          text={`BookSculp reserves the right to change the Terms from time to time without notice. You acknowledge and agree that it is your responsibility to review the Terms periodically to familiarize yourself with any modifications. Your continued use of the Service after such modifications will constitute acknowledgment and agreement of the modified Terms.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`What BookSculp Offers`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`BookSculp is a listing service wherein models and talent scouts may create profiles and photo books and for creating business contacts, including with modeling agents and/or agencies and photographers. BookSculp does not participate in any communication between its users, whether models, agencies or otherwise. If its users utilize BookSculp to enter into agreements with each other, BookSculp is not a party to these agreements, is not liable for any breach of these agreements, and is not responsible for ensuring these agreements are executed or fulfilled. BookSculp’s users are responsible for setting their own pricing schemes in accordance with the law in whichever jurisdiction applies, including state and federal income tax and sales tax. BookSculp collects its fees from its users directly, and is not a party to any payment agreement between users and cannot be held liable for any breach of payment between users.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Responsible Use and Conduct`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`By visiting our website and accessing the Service, you agree to use these Services only for the purposes intended as permitted by (a) the terms of these Terms, and (b) applicable laws, regulations and generally accepted online practices or guidelines.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Wherein, you understand that:`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text, marginVertical: 10 }}
        />
        <TextComponent
          text={`1. Account Information: In order to access our Service, you may be required to provide certain information about yourself (such as identification, contact details, etc.) as part of the registration process, or as part of your ability to use the Service. You agree that any information you provide will always be accurate, correct, and up to date.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`2. Confidentiality of Account Information: You are responsible for maintaining the confidentiality of any login information associated with any account you use to access our Service. Accordingly, you are responsible for all activities that occur under your account/s`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`3. Age of Users: By creating an account with BookSculp, you affirm that you are 18 years of age or older, or possess legal parental or guardian consent, and are fully competent to enter into these Terms. If you are under 18 years of age, please do not use BookSculp’s Services`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`4. Member Profiles: In the making of a model profile, you represent and warrant that you own the necessary licenses, rights, consents and permissions to use any and all member content, and likewise authorize BookSculp to use all trademark, copyright or other proprietary rights in and to any and all content to enable inclusion and use of the profile content in the manner intended. You agree that you will not submit profile content that violates these Terms`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`5. Access: Accessing (or attempting to access) any of our Service by any means other than through the means we provide, is strictly prohibited. You specifically agree not to access (or attempt to access) any of our Services through any automated, unethical or unconventional means.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`6. Permitted Activity: Engaging in any activity that disrupts or interferes with our Services, including the servers and/or networks to which our Services are located or connected, is strictly prohibited. Attempting to copy, duplicate, reproduce, sell, trade, or resell our Services is strictly prohibited.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`7. Disclaimer of Liability: You are solely responsible any consequences, losses, or damages that we may directly or indirectly incur or suffer due to any unauthorized activities conducted by you, as explained above, and may incur criminal or civil liability.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`8. Posting Content: BookSculp may provide various open communication tools on the website, such as blog comments, blog posts, public chat, forums, message boards, newsgroups, product ratings and reviews, various social media services, etc. You understand that generally BookSculp does not pre-screen or monitor the content posted by users of these various communication tools, which means that if you choose to use these tools to submit any type of content to our website, then it is your personal responsibility to use these tools in a responsible and ethical manner. By posting information or otherwise using any open communication tools as mentioned, you agree that you will not upload, post, share, or otherwise distribute any content that:`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <View style={{ marginLeft: 10 }}>
          <TextComponent
            text={`1. is illegal, threatening, defamatory, abusive, harassing, degrading, intimidating, fraudulent, deceptive, invasive, racist, or contains any type of suggestive, inappropriate, or explicit language;`}
            size={Sizes?.s}
            fontWeight="400"
            color={Colors?.gray}
            style={{ ...styling?.text }}
          />
          <TextComponent
            text={`2. infringes on any trademark, patent, trade secret, copyright, or other proprietary right of any party;`}
            size={Sizes?.s}
            fontWeight="400"
            color={Colors?.gray}
            style={{ ...styling?.text }}
          />
          <TextComponent
            text={`3. contains any type of unauthorized or unsolicited advertising; or`}
            size={Sizes?.s}
            fontWeight="400"
            color={Colors?.gray}
            style={{ ...styling?.text }}
          />
          <TextComponent
            text={`4. impersonates any person or entity, including any BookSculp employees or representatives.`}
            size={Sizes?.s}
            fontWeight="400"
            color={Colors?.gray}
            style={{ ...styling?.text }}
          />
        </View>
        <TextComponent
          text={`9. Removal of Content: BookSculp has the right at its sole discretion to remove any content that does not comply with these Terms, along with any content that it deems otherwise offensive, harmful, objectionable, inaccurate, or violates any third party copyrights or trademarks. BookSculp not responsible for any delay or failure in removing such content. If you post content that BookSculp chooses to remove, you hereby consent to such removal, and consent to waive any claim against BookSculp.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`10. Ownership of Public Postings: BookSculp does not assume any liability for any content posted by you or any other third party users of www.booksculp.com. However, any content posted by you using any open communication tools on www.booksculp.com, provided that it doesn’t violate or infringe on any third party copyrights or trademarks, becomes the property of BookSculp, and as such, gives BookSculp a perpetual, irrevocable, worldwide, royalty-free, exclusive license to reproduce, modify, adapt, translate, publish, publicly display and/or distribute as it sees fit. This only refers and applies to content posted via open communication tools as described, and does not refer to information that is provided as part of the registration process, necessary in order to use the Services.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`11. You agree to indemnify and hold harmless BookSculp and its parent company and affiliates, and their directors, officers, managers, employees, donors, agents, and licensors, from and against all losses, expenses, damages and costs, including reasonable attorneys’ fees, resulting from any violation of these Terms or the failure to fulfill any obligations relating to your account incurred by you or any other person using your account. BookSculp reserves the right to take over the exclusive defense of any claim for which it is entitled to indemnification under these Terms. In such event, you shall provide BookSculp with such cooperation as is reasonably requested.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Limitation of Warranties`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`By using www.booksculp.com, you understand and agree that all Services provided are “as is” and “as available.” This means that BookSculp does not represent or warrant to you that:`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`1. the use of the Services will meet your needs or requirements;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text, marginTop: 10 }}
        />
        <TextComponent
          text={`2. the use of the Services will be uninterrupted, timely, secure or free from errors;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`3. information obtained by using the Services will be accurate or reliable;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`4. any defects in the operation or functionality of any Services provided will be repaired or corrected;`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`5. any content downloaded or otherwise obtained through the use of the Services is done at your own discretion and risk, and that you are solely responsible for any damage to your computer or other devices for any loss of data that may result from the download of such content; and`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`6. no information or advice, whether expressed, implied, oral or written, obtained by you from www.booksculp.com or through any Services provided shall create any warranty, guarantee, or conditions of any kind, except for those expressly outlined in these Terms.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Limitation of Liability`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`In conjunction with the Limitation of Warranties as explained above, you expressly understand and agree that any claim against BookSculp shall be limited to the amount you paid, if any, for use of products and/or services. BookSculp will not be liable for any direct, indirect, incidental, consequential or exemplary loss or damages which may be incurred by you as a result of using the Services, or as a result of any changes, data loss or corruption, cancellation, loss of access, or downtime to the full extent that applicable limitation of liability laws apply.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Copyrights/Trademarks`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`All content and materials available on www.booksculp.com, including but not limited to text, graphics, website name, code, images and logos are the intellectual property of BookSculp, and are protected by applicable copyright and trademark law. Any inappropriate use, including but not limited to the reproduction, distribution, display or transmission of any content on this site is strictly prohibited, unless specifically authorized by BookSculp.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Termination of Use`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`You agree that BookSculp may, at its sole discretion, suspend or terminate your access to all or part of the website and Services with or without notice and for any reason, including, without limitation, breach of these Terms. Any suspected illegal, fraudulent or abusive activity may be grounds for terminating your relationship and may be referred to appropriate law enforcement authorities. Upon suspension or termination, your right to use the Services will immediately cease, and BookSculp reserves the right to remove or delete any information that you may have on file, including any account or login information.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Arbitration`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`Any controversy or claim arising out of these Terms shall be settled by the arbitration administered by the American Arbitration Association and governed by the American Arbitration Association Consumer Arbitration Rules. All claims for arbitration must be brought within one (1) year after the claim or cause of action arose or the claim is waived, regardless of any statute or law to the contrary. You agree to arbitrate only in your individual capacity, not as a representative or a member of a class. No claims may be joined with any other claims.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Governing Law`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`This website is controlled by BookSculp from our offices located in the state of Arkansas, USA. It can be accessed by most countries around the world. As each country has laws that may differ from those of Arkansas, by accessing our website, you agree that the statutes and laws of Arkansas, without regard to the conflict of laws and the United Nations Convention on the International Sales of Goods, will apply to all matters relating to the use of this website and the purchase of any products or services through this site.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Furthermore, for any claims or causes of action arising out of these Terms that are not subject to arbitration shall be brought in the federal or state courts located in Pulaski County, Arkansas, USA. You hereby agree to personal jurisdiction by such courts, and waive any jurisdictional, venue, or inconvenient forum objections to such courts.`}
          size={Sizes?.s}
          fontWeight="400"
          color={Colors?.gray}
          style={{ ...styling?.text, marginTop: 10 }}
        />
        <TextComponent
          text={`Guarantee`}
          size={Sizes?.xl}
          style={styling?.headingView}
        />
        <TextComponent
          text={`UNLESS OTHERWISE EXPRESSED, BOOKSCULP EXPRESSLY DISCLAIMS ALL WARRANTIES AND CONDITIONS OF ANY KIND, WHETHER EXPRESS OR IMPLIED, INCLUDING, BUT NOT LIMITED TO THE IMPLIED WARRANTIES AND CONDITIONS OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NON-INFRINGEMENT. If you have any questions or comments about these our Terms of Service as outlined above, you can contact BookSculp at:`}
          size={Sizes?.s}
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`BookSculp`}
          size={Sizes?.s}
          color={Colors?.gray}
          style={{ ...styling?.text, marginTop: 10 }}
        />
        {/* <TextComponent
          text={`1901 Napa Valley Drive, Suite 100`}
          size={Sizes?.s}
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`Little Rock, Arkansas 72212`}
          size={Sizes?.s}
          color={Colors?.gray}
          style={{ ...styling?.text }}
        />
        <TextComponent
          text={`USA`}
          size={Sizes?.s}
          color={Colors?.gray}
          style={{ ...styling?.text }}
        /> */}
        <TextComponent
          text={`Info@booksculp.com`}
          size={Sizes?.s}
          color={Colors?.red}
          style={{ ...styling?.text }}
        />
        {/* <TextComponent
          text={`(501) 777-8090`}
          size={Sizes?.s}
          color={Colors?.red}
          style={{ ...styling?.text }}
        /> */}
      </ScrollView>

      <View
        style={{
          ...Styles?.flexRow,
          paddingTop: 10,
          width: "45%",
          alignSelf: "flex-end",
        }}
      >
        <TouchableOpacity
          onPress={() => {
            setAgree(false);
            setTermsModal(false);
          }}
          style={{
            ...Styles?.smallButton,
            backgroundColor: Colors?.red,
            borderRadius: 10,
          }}
        >
          <TextComponent
            text={"Cancel"}
            size={Sizes?.l}
            color={Colors?.white}
            style={{ ...styling?.text }}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            setAgree(true);
            setTermsModal(false);
          }}
          style={{
            ...Styles?.smallButton,
            backgroundColor: Colors?.themeColor,
            borderRadius: 10,
          }}
        >
          <TextComponent
            text={"I agree"}
            size={Sizes?.l}
            color={Colors?.white}
            style={{ ...styling?.text }}
          />
        </TouchableOpacity>
      </View>
    </>
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
