import React, { useEffect, useState } from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import {
  Banner,
  DashboardHeader,
  JobsCard,
  Loader,
  PlansCard,
  TalentBanner,
  TextComponent,
} from "../../Components";
import { FeaturedTalent } from "../../Components/FeaturedTalent";
import { Colors, Images, Sizes } from "../../Constants";
import BottomTab from "../../Navigations/BottomTab";
import { getPackages } from "../../Redux/Services/AuthServices";
import {
  getJobDetails,
  getJobsList,
  getKidsList,
  getModelsList,
} from "../../Redux/Services/OtherServices";
import { routeName } from "../../Utility";
import { getData, storageKey } from "../../Utility/Storage";
export const GuestDashboard = ({ route, navigation }) => {
  const dispatch = useDispatch();
  const other = useSelector((state) => state?.otherReducer);
  const [packagesList, setPackagesList] = useState([]);
  const [modelsList, setModelsList] = useState([]);
  const [jobsList, setJobsList] = useState([]);
  const [kidsList, setKidsList] = useState([]);
  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    getAllModelsList();
    getAllKidsList();
    getAllJobsList();
    getAllPackages();
  }, []);
  const getAllPackages = async () => {
    let paymentStatus = await getData(storageKey?.PAYMENT_STATUS);
    setPaymentStatus(JSON.parse(paymentStatus));
    if (paymentStatus) {
      let res = await dispatch(getPackages());
      setPackagesList(res?.results);
    }
  };
  const getAllModelsList = async () => {
    let res = await dispatch(getModelsList());
    let arr = res?.results?.user_list?.filter(
      (item) => item?.post_meta_details?.subscription_pro_id != 107
    ); //subscription_pro_id
    setModelsList(arr);
    // setModelsList(res?.results);
  };
  const getAllKidsList = async () => {
    let res = await dispatch(getKidsList());
    if (res?.status == 200) {
      setKidsList(res?.results?.user_list);
    }
  };

  const getAllJobsList = async () => {
    let res = await dispatch(getJobsList());
    if (res?.status == 200) {
      setJobsList(res?.results?.list);
    }
  };

  const talentBanner = {
    image: Images?.talentBannerImg,
    heading: "book talent anywhere",
    discription:
      "A platform dedicated to helping find diverse talent for all types of projects.",
  };
  return (
    <>
      <DashboardHeader guest={true} />
      <Loader loading={other?.isLoading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Banner guest={true} navigation={navigation} />
        {modelsList?.length != 0 ? (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation?.navigate(routeName?.SEARCH_STACKS, {
                  searchFor: "Kids",
                })
              }
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
                margin: 15,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <TextComponent
                  text="Featured Talent"
                  color={Colors?.black}
                  size={Sizes?.l}
                />
                <TextComponent
                  text="Find the talent for your needs"
                  color={Colors?.darkgrey}
                  size={Sizes?.s}
                  fontWeight={"400"}
                  style={{ paddingVertical: 4 }}
                />
              </View>
              <TextComponent
                text="View All"
                color={Colors?.themeColor}
                size={Sizes?.l}
              />
            </TouchableOpacity>
            <FeaturedTalent cardData={modelsList} navigation={navigation} />
          </>
        ) : null}
        {kidsList?.length != 0 ? (
          <>
            <TouchableOpacity
              onPress={() =>
                navigation?.navigate(routeName?.SEARCH_STACKS, {
                  searchFor: "Kids",
                })
              }
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
                margin: 15,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <TextComponent
                  text="Featured Kids Talent"
                  color={Colors?.black}
                  size={Sizes?.l}
                />
                <TextComponent
                  text="Find the kid talent for your needs"
                  color={Colors?.darkgrey}
                  size={Sizes?.s}
                  fontWeight={"400"}
                  style={{ paddingVertical: 4 }}
                />
              </View>
              <TextComponent
                text="View All"
                color={Colors?.themeColor}
                size={Sizes?.l}
              />
            </TouchableOpacity>
            <FeaturedTalent cardData={kidsList} navigation={navigation} />
          </>
        ) : null}

        {jobsList?.length != 0 ? (
          <>
            <TouchableOpacity
              onPress={() => navigation?.navigate(routeName?.JOB_STACKS)}
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                paddingHorizontal: 8,
                margin: 15,
              }}
            >
              <View style={{ flexDirection: "column" }}>
                <TextComponent
                  text="Listing Projects"
                  color={Colors?.black}
                  size={Sizes?.l}
                />
                <TextComponent
                  text="Find the Job for your needs"
                  color={Colors?.darkgrey}
                  size={Sizes?.s}
                  fontWeight={"400"}
                  style={{ paddingVertical: 4 }}
                />
              </View>
              <TextComponent
                text="View All"
                color={Colors?.themeColor}
                size={Sizes?.l}
              />
            </TouchableOpacity>
            <JobsCard cardData={jobsList} navigation={navigation} />
          </>
        ) : null}

        <TalentBanner cardData={talentBanner} navigation={navigation} />
        {paymentStatus ? (
          <>
            <TextComponent
              text="Talent Choose Right Plan For You"
              color={Colors?.black}
              size={Sizes?.xl}
              style={{ textAlign: "center" }}
            />
            {packagesList?.map((item, index) => {
              return (
                <PlansCard
                  cardData={item}
                  index={index}
                  navigation={navigation}
                />
              );
            })}
          </>
        ) : null}
      </ScrollView>
    </>
  );
};
