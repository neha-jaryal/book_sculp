import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { WebView } from "react-native-webview";
import { Header } from "../../Components";
import { routeName, showToast } from "../../Utility";

export const AddStripAccount = ({ route, navigation }) => {
  const { stripeUrl, type } = route?.params;
  const [currentUrl, setCurrentUrl] = useState("");
  const webViewRef = useRef();

  const successUrl = "https://booksculp.com/stripe-responce/?success=true";
  // https://booksculp.com/stripe-responce/?success=true

  // "https://booksculp.com/stripe-responce/?success=true&code=";
  // "https://dev.sculpagency.com/API/v1/stripe_responce.php?code=";

  const updateUrl =
    "https://api.booksculp.com/v1/stripe_responce.php?state=user_";
  // "https://dev.sculpagency.com/API/v1/stripe_responce.php?state=user_";
  const cancelUrl = "https://booksculp.com/API/cancel.php?canceled=true";
  useEffect(() => {
    if (currentUrl) {
      if (currentUrl.includes(successUrl) || currentUrl.includes(updateUrl)) {
        navigation.navigate(routeName?.PAYOUT_SETTING);
        if (type == "update") {
          showToast("Account updated successfully", "success");
        }
      } else if (currentUrl.includes(cancelUrl)) {
        navigation.navigate(routeName?.PAYOUT_SETTING);
      }
    }
  }, [currentUrl]);
  console.log("currentUrlcurrentUrl----", currentUrl);

  const runBeforeFirst = `
  window.isNativeApp = true;
  true; // note: this is required, or you'll sometimes get silent failures
`;
  return (
    <>
      <Header
        text={type == "add" ? "Add Stripe Account" : "Update Stripe Account"}
        navigation={navigation}
      />
      <WebView
        ref={webViewRef}
        source={{ uri: stripeUrl }}
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
