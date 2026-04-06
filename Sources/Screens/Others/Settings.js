import React, { useEffect, useState } from "react";
import {
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Header, TextComponent } from "../../Components";
import { Colors, dimensionheight, Images, Sizes } from "../../Constants";
import { Styles } from "../../Styles";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import { routeName } from "../../Utility/routeName";
import { useDispatch } from "react-redux";
import { getData, storageKey } from "../../Utility/Storage";
import { getUserDetail } from "../../Redux/Services/AuthServices";

export const Settings = ({ navigation }) => {
  const [listItems, setListItems] = useState("");
  const [userRole, setUserRole] = useState("");
  const [paymentStatus, setPaymentStatus] = useState(false);

  useEffect(() => {
    handlePaymentStatus();
  }, []);
  useEffect(() => {
    getUserRole();
  }, [paymentStatus]);
  const getUserRole = async () => {
    let userRole = await getData(storageKey?.USER_ROLE);
    setUserRole(userRole);
    if (userRole == 11 || userRole == 15) {
      setListItems(freelancerListItems);
    } else if (userRole == 12) {
      setListItems(employerListItems);
    } else if (userRole == 13) {
      setListItems(photographerListItems);
    } else {
      setListItems(guestUserListItems);
    }
  };
  const handlePaymentStatus = async () => {
    let paymentStatus = await getData(storageKey?.PAYMENT_STATUS);
    setPaymentStatus(JSON.parse(paymentStatus));
  };

  const freelancerListItems = [
    {
      key: 1,
      icon: <FontAwesome name="dashboard" size={14} color={Colors?.white} />,
      name: "Dashboard",
      path: routeName?.USER_DASHBOARD,
      show: true,
    },
    {
      key: 1,
      icon: <FontAwesome name="edit" size={14} color={Colors?.white} />,
      name: "Edit Profile",
      path: routeName?.EDIT_PROFILE,
      show: true,
    },
    {
      key: 4,
      icon: <Feather name="edit" size={14} color={Colors?.white} />,
      name: "Manage Social Posts",
      path: routeName?.MANAGE_SOCIAL_POSTS,
      show: true,
    },
    {
      key: 4,
      icon: <Feather name="edit" size={14} color={Colors?.white} />,
      name: "Manage Portfolios",
      path: routeName?.MANAGE_PORTFOLIOS,
      show: true,
    },

    {
      key: 1,
      icon: <Feather name="package" size={14} color={Colors?.white} />,
      name: "Package Settings",
      path: routeName?.PACKAGES,
      show: paymentStatus ? true : false,
    },
    {
      key: 1,
      icon: <FontAwesome name="credit-card" size={14} color={Colors?.white} />,
      name: "Payout Settings",
      path: routeName?.PAYOUT_SETTING,
      show: true,
    },
    {
      key: 4,
      icon: (
        <MaterialIcons name="business-center" size={14} color={Colors?.white} />
      ),
      name: "Manage Projects",
      path: routeName?.MANAGE_PROJECTS,
      show: true,
    },

    {
      key: 1,
      icon: (
        <FontAwesome
          name="user"
          size={15}
          color={Colors?.white}
          style={{ paddingHorizontal: 1 }}
        />
      ),
      name: "Manage Account",
      path: routeName?.MANAGE_ACCOUNT,
      show: true,
    },
    {
      key: 1,
      icon: (
        <Entypo
          name="images"
          size={14}
          color={Colors?.white}
          // style={{ paddingHorizontal: 1 }}
        />
      ),
      name: "Update Profile & Gallery Images",
      path: routeName?.UPDATE_PROFILE_GALLERY,
      show: true,
    },
    {
      key: 1,
      icon: <MaterialIcons name="policy" size={14} color={Colors?.white} />,
      name: "Privacy Policy",
      path: routeName?.PRIVACY_POLICY,
      show: true,
    },
    {
      key: 1,
      icon: <Entypo name="documents" size={14} color={Colors?.white} />,
      name: "Terms of Services",
      path: routeName?.TERMS_OF_SERVICE,
      show: true,
    },
  ];
  const photographerListItems = [
    {
      key: 1,
      icon: <FontAwesome name="dashboard" size={14} color={Colors?.white} />,
      name: "Dashboard",
      path: routeName?.USER_DASHBOARD,
      show: true,
    },
    {
      key: 1,
      icon: <FontAwesome name="edit" size={14} color={Colors?.white} />,
      name: "Edit Profile",
      path: routeName?.EDIT_PHOTOGRAPHER,
      show: true,
    },
    {
      key: 4,
      icon: <Feather name="edit" size={14} color={Colors?.white} />,
      name: "Manage Social Posts",
      path: routeName?.MANAGE_SOCIAL_POSTS,
      show: true,
    },
    {
      key: 4,
      icon: (
        <MaterialCommunityIcons name="post" size={14} color={Colors?.white} />
      ),
      name: "Manage Portfolios",
      path: routeName?.MANAGE_PORTFOLIOS,
      show: true,
    },
    {
      key: 1,
      icon: <Feather name="package" size={14} color={Colors?.white} />,
      name: "Package Settings",
      path: routeName?.PACKAGES,
      show: true,
    },
    {
      key: 1,
      icon: <FontAwesome name="credit-card" size={14} color={Colors?.white} />,
      name: "Payout Settings",
      path: routeName?.PAYOUT_SETTING,
      show: true,
    },
    // {
    //   key: 4,
    //   icon: (
    //     <MaterialIcons name="business-center" size={14} color={Colors?.white} />
    //   ),
    //   name: "Manage Projects",
    //   path: routeName?.MANAGE_PROJECTS,
    // },
    {
      key: 1,
      icon: (
        <FontAwesome
          name="user"
          size={15}
          color={Colors?.white}
          style={{ paddingHorizontal: 1 }}
        />
      ),
      name: "Manage Account",
      path: routeName?.MANAGE_ACCOUNT,
      show: true,
    },
    {
      key: 1,
      icon: (
        <Entypo
          name="images"
          size={14}
          color={Colors?.white}
          // style={{ paddingHorizontal: 1 }}
        />
      ),
      name: "Update Profile & Gallery",
      path: routeName?.UPDATE_PROFILE_GALLERY,
      show: true,
    },
    {
      key: 1,
      icon: <MaterialIcons name="policy" size={14} color={Colors?.white} />,
      name: "Privacy Policy",
      path: routeName?.PRIVACY_POLICY,
      show: true,
    },
    {
      key: 1,
      icon: <Entypo name="documents" size={14} color={Colors?.white} />,
      name: "Terms of Services",
      path: routeName?.TERMS_OF_SERVICE,
      show: true,
    },
  ];
  const employerListItems = [
    {
      key: 1,
      icon: <FontAwesome name="dashboard" size={14} color={Colors?.white} />,
      name: "Dashboard",
      path: routeName?.USER_DASHBOARD,
      show: true,
    },
    {
      key: 1,
      icon: <FontAwesome name="edit" size={14} color={Colors?.white} />,
      name: "Edit Profile",
      path: routeName?.EDIT_PROFILE,
      show: true,
    },
    {
      key: 4,
      icon: (
        <MaterialIcons name="business-center" size={14} color={Colors?.white} />
      ),
      name: "Manage Jobs",
      path: routeName?.MANAGE_JOBS,
      show: true,
    },
    // {
    //   key: 4,
    //   icon: (
    //     <MaterialIcons name="business-center" size={14} color={Colors?.white} />
    //   ),
    //   name: "Latest Proposals",
    //   path: routeName?.LATEST_PROPOSAL,
    // },
    {
      key: 1,
      icon: (
        <FontAwesome
          name="user"
          size={15}
          color={Colors?.white}
          style={{ paddingHorizontal: 1 }}
        />
      ),
      name: "Manage Account",
      path: routeName?.MANAGE_ACCOUNT,
      show: true,
    },
    {
      key: 1,
      icon: (
        <Entypo
          name="images"
          size={14}
          color={Colors?.white}
          // style={{ paddingHorizontal: 1 }}
        />
      ),
      name: "Update Profile Picture",
      path: routeName?.UPDATE_PROFILE_GALLERY,
      show: true,
    },
    {
      key: 1,
      icon: <MaterialIcons name="policy" size={14} color={Colors?.white} />,
      name: "Privacy Policy",
      path: routeName?.PRIVACY_POLICY,
      show: true,
    },
    {
      key: 1,
      icon: <Entypo name="documents" size={14} color={Colors?.white} />,
      name: "Terms of Services",
      path: routeName?.TERMS_OF_SERVICE,
      show: true,
    },
  ];
  const guestUserListItems = [
    {
      key: 1,
      icon: (
        <MaterialIcons
          name="connect-without-contact"
          size={14}
          color={Colors?.white}
        />
      ),
      name: "Contact Us",
      path: routeName?.CONTACT_US,
      show: true,
    },
    {
      key: 1,
      icon: <MaterialIcons name="live-help" size={20} color={Colors?.white} />,
      name: "Help & Support",
      path: routeName?.HELP_SUPPORT,
      show: true,
    },
    {
      key: 1,
      icon: <MaterialIcons name="policy" size={14} color={Colors?.white} />,
      name: "Privacy Policy",
      path: routeName?.PRIVACY_POLICY,
      show: true,
    },
    {
      key: 1,
      icon: <Entypo name="documents" size={14} color={Colors?.white} />,
      name: "Terms of Services",
      path: routeName?.TERMS_OF_SERVICE,
      show: true,
    },
  ];

  return (
    <>
      <Header text={"Settings"} navigation={navigation} />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={{ ...Styles?.container }}>
          {listItems?.length != 0 &&
            listItems?.map((item, index) => {
              return item?.show ? (
                <>
                  <TouchableOpacity
                    key={index}
                    onPress={() => navigation?.navigate(item?.path)}
                    style={{
                      ...Styles?.flexRow,
                      padding: 15,
                    }}
                  >
                    <View style={Styles?.row}>
                      <View
                        style={{
                          backgroundColor: Colors?.themeColor,
                          paddingVertical: 4,
                          borderRadius: 6,
                          paddingHorizontal: 8,
                        }}
                      >
                        {item?.icon}
                      </View>
                      <TextComponent
                        text={item?.name}
                        color={Colors?.black}
                        size={Sizes?.l}
                        fontWeight="400"
                        style={{ marginHorizontal: 15 }}
                      />
                    </View>
                    <FontAwesome name="angle-right" size={20} />
                  </TouchableOpacity>
                  {listItems?.length - 1 != index && (
                    <View style={{ ...Styles?.separator }} />
                  )}
                </>
              ) : null;
            })}
        </View>
        <View style={{ height: 20 }} />
      </ScrollView>
    </>
  );
};
