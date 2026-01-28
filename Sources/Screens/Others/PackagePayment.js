import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { WebView } from "react-native-webview";
import { Header, TextComponent } from "../../Components";
import { routeName } from "../../Utility";
import { productCheckout } from "../../Redux/Services/OtherServices";
import { getData, storageKey } from "../../Utility/Storage";
import { Modal, StyleSheet, TouchableOpacity, View } from "react-native";
import { Styles } from "../../Styles";
import { Colors, Sizes } from "../../Constants";
import Ionicons from "react-native-vector-icons/Ionicons";

export const PackagePayment = ({ route, navigation }) => {
  const { stripe_URL, onSuccessURL } = route?.params;
  const dispatch = useDispatch();
  const [currentUrl, setCurrentUrl] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const webViewRef = useRef();
  const successUrl = "https://api.booksculp.com/success.php?success=true";
  // "https://kaksha.co/API/success.php?success=true&session_id=";

  const cancelUrl = "https://api.booksculp.com/cancel.php?canceled=true";
  // "https://kaksha.co/API/success.php?success=true";
  //  https://kaksha.co/API/success.php?success=true&userID
  // const successUrl =
  //   "https://booksculp.com/API/success.php?success=true&session_id=";
  // const cancelUrl = "https://booksculp.com/API/cancel.php?canceled=true";
  // https://booksculp.com/API/success.php?success=true&session_id=cs_test_a18PeMjbkielSCqYb0wLZ89lGiz7MCmnkKFn1t5QEWsWow9azX9RzDbPKR

  useEffect(() => {
    if (currentUrl) {
      if (currentUrl.includes(successUrl)) {
        // let sessionId = currentUrl.slice(
        //   successUrl?.length,
        //   currentUrl?.length
        // );
        const match = currentUrl.match(/[?&]session_id=([^&]*)/);
        const sessionId = match ? match[1] : null;
        handleCheckout(sessionId);
      } else if (currentUrl.includes(onSuccessURL)) {
        const match = currentUrl.match(/[?&]session_id=([^&]*)/);
        const sessionId = match ? match[1] : null;
        handleCheckout(sessionId, "hire");
      } else if (currentUrl.includes(cancelUrl)) {
        navigation.navigate(routeName?.PACKAGES);
      }
    }
  }, [currentUrl]);

  const handleCheckout = async (sessionId, type) => {
    let userId = await getData(storageKey?.USER_ID);
    var body = {
      action: "session",
      sessions_id: sessionId,
      user_id: userId,
    };
    console.log("sessionId body-----", body);
    let res = await dispatch(productCheckout(body));
    if (res?.status == 200) {
      if (type == "hire") {
        navigation?.navigate(routeName?.MANAGE_JOBS, {
          prevRoute: routeName?.CHECKOUT,
          tab: "ongoing",
          modelName: res?.results?.model_name,
          jobTitle: res?.results?.project_title,
        });
      } else {
        navigation.navigate(routeName?.SUCCESS);
      }
    }
  };
  const runBeforeFirst = `
  window.isNativeApp = true;
  true; // note: this is required, or you'll sometimes get silent failures
`;
  // https://booksculp.com/API/cancel.php?canceled=true
  console.log("currentUrlcurrentUrl----", currentUrl);

  return (
    <>
      <Header text="Payment" navigation={navigation} />
      <WebView
        ref={webViewRef}
        source={{ uri: stripe_URL }}
        javaScriptEnabled={true}
        originWhitelist={["*"]}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
        onNavigationStateChange={(state) => {
          console.log("state?.url----", state?.url);

          setCurrentUrl(state?.url);
        }}
        // injectedJavaScript={jsCode}
      />
    </>
  );
};

const styling = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  closeIcon: {
    position: "absolute",
    top: 10,
    right: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalDescription: {
    marginBottom: 20,
  },
  yesButton: {
    alignSelf: "flex-end",
    backgroundColor: Colors?.blue,
    paddingVertical: 6,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  yesButtonText: {
    color: "white",
  },
});
// BackHandler.addEventListener("hardwareBackPress", function () {
//   webViewRef.current.goBack();
//   return true;
// });
// let showAlert = `window.alert("hello")`;
// console.log("webViewRef---", webViewRef);
// // webViewRef?.current.injectJavaScript(showAlert);
// webViewRef.current.goBack();
{
  /* <StripeProvider
        publishableKey="pk_test_51LL6lUGWMbQmKARoRYt7UMPdjPy6vHRJdCoWOxPEAWLbEJAMrU6d2Ndq2oRdUQWyUphn4aOBBCzdeC8NXvP6k64c00SetHr7gJ"
        // urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
        merchantIdentifier="com.sculp_agency" // required for Apple Pay
      >
        <Payment />
      </StripeProvider> */
}
{
  /* <StripeCheckout
        stripePublicKey={
          "sk_test_51LL6lUGWMbQmKARo1Xx8IlRQYiIcilY86wVgeLZD8oLDVtJcRnFhPhAOzPBg8N36Ko4hne5BR10dZavuHta7EAYo00GLKfg49f"
        }
        checkoutSessionInput={{
          sessionId:
            "cs_test_a1Dx0V09gPH46hhteAhPQTAfGkdzZw2xpILmp2LmkUL3lnGSfWMamleRj6",
        }}
        onSuccess={({ checkoutSessionId }) => {
          console.log(
            `Stripe checkout session succeeded. session id: ${checkoutSessionId}.`
          );
        }}
        onLoadingComplete={() =>
          console.log(`Stripe checkout session on Loading Complete.`)
        }
        onCancel={() => {
          console.log(`Stripe checkout session cancelled.`);
        }}
        onLoadStart={() => alert("loading")}
      /> */
}
{
  /* <TouchableOpacity onPress={() => setShow(true)}>
          <Text>webview</Text>
        </TouchableOpacity> */
}
// const jsCode = `console.log("testing-------");
// console.log("subBtn----");
// window.postMessage("subBtn");`;

// const onMessage = (event) => {
//   alert("onMessage"); //got no any response
//   console.log("onMessage-----", JSON.parse(event.nativeEvent.data));
//   console.log(event.nativeEvent.data);
// };
