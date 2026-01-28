import * as url from "../../API Services/Url";
import * as Services from "../../API Services/services";
import {
  userLoginLoading,
  userLoginSuccess,
  userLoginError,
  registerTokenLoading,
  registerTokenSuccess,
  registerTokenError,
  userLogoutLoading,
  userLogoutSuccess,
  userLogoutError,
  userRegisterLoading,
  userRegisterSuccess,
  userRegisterError,
  photographerRegisterLoading,
  photographerRegisterSuccess,
  photographerRegisterError,
  updatePhotographerProfileLoading,
  updatePhotographerProfileSuccess,
  updatePhotographerProfileError,
  profileSetupLoading,
  profileSetupSuccess,
  profileSetupError,
  navigatorStatus,
  getOptionsDataLoading,
  getOptionsDataSuccess,
  getOptionsDataError,
  getUserDetailLoading,
  getUserDetailSuccess,
  getUserDetailError,
  uploadGalleryProfileLoading,
  uploadGalleryProfileSuccess,
  uploadGalleryProfileError,
  getPackagesLoading,
  getPackagesSuccess,
  getPackagesError,
  sendVerficationError,
  sendVerficationLoading,
  sendVerficationSuccess,
  sendVerficationEmailError,
  sendVerficationEmailLoading,
  sendVerficationEmailSuccess,
  otpVerifyLoading,
  otpVerifySuccess,
  otpVerifyError,
  resetPasswordLoading,
  resetPasswordSuccess,
  resetPasswordError,
  forgetPasswordLoading,
  forgetPasswordSuccess,
  forgetPasswordError,
  identityVerificationLoading,
  identityVerificationSuccess,
  identityVerificationError,
  removeImageLoading,
  removeImageSuccess,
  removeImageError,
  sendMessageLoading,
  sendMessageSuccess,
  sendMessageError,
  // forgetPasswordOtpVerifyLoading,
  // forgetPasswordOtpVerifySuccess,
  // forgetPasswordOtpVerifyError,
  // changePasswordLoading,
  // changePasswordSuccess,
  // changePasswordError,
} from "../Actions/AuthActions";
import {
  clearData,
  getData,
  storageKey,
  storeData,
} from "../../Utility/Storage";
import { routeName, showToast } from "../../Utility";
import axios from "axios";

// Authentication APIs
export const userRegister = (body, url) => async (dispatch) => {
  console.log("userRegister body--", body);
  dispatch(userRegisterLoading(true));
  try {
    const response = await Services.post(
      url + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("userRegister response--", response);
    if (response.status == 200) {
      showToast("Saved !", "success");

      dispatch(
        userRegisterSuccess(false, { registrationData: response?.results[0] })
      );
      storeData(storageKey?.USER_ID, response?.results[0]?.user_id);
      storeData(
        storageKey?.USER_ROLE,
        JSON.stringify(response?.results[0]?.user_role)
      );
      // storeData(
      //   storageKey?.PACKAGE_ID,
      //   JSON.stringify(response?.results?.packages_id)
      // );
      storeData(storageKey?.AUTH_TOKEN, response?.results[0]?.access_token);
    } else {
      dispatch(userRegisterSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("userRegister error--", error);
    dispatch(userRegisterError(false));
    return { message: error };
  }
};

export const photographerRegister = (body) => async (dispatch) => {
  console.log("photographerRegister body--", body);
  dispatch(photographerRegisterLoading(true));
  try {
    const response = await Services.post(
      url.PHOTOGRAPHER_REGISTER + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("photographerRegister response--", response);
    if (response) {
      dispatch(
        photographerRegisterSuccess(false, {
          registrationData: response?.results,
        })
      );
      storeData(storageKey?.USER_ID, response?.results?.user_id);
      storeData(
        storageKey?.USER_ROLE,
        JSON.stringify(response?.results?.user_role)
      );
      // storeData(
      //   storageKey?.PACKAGE_ID,
      //   JSON.stringify(response?.results?.packages_id)
      // );
      storeData(storageKey?.AUTH_TOKEN, response?.results?.access_token);
      if (response?.status == 200) {
        showToast("Saved !", "success");
      }
      // dispatch(photographerRegisterSuccess(false));
    }
    dispatch(photographerRegisterSuccess(false));
    return response;
  } catch (error) {
    console.log("photographerRegister error--", error);
    dispatch(photographerRegisterError(false));
    return { message: error };
  }
};

export const updatePhotographerProfile = (body) => async (dispatch) => {
  console.log("photographerRegister body--", body);
  dispatch(updatePhotographerProfileLoading(true));
  try {
    const response = await Services.post(
      url.UPDATE_PHOTOGRAPHER_REGISTER + "?apiKey=apiKey",
      "",
      body
    );
    console.log("updatePhotographerProfile response--", response);
    if (response.data) {
      dispatch(updatePhotographerProfileSuccess(false));
    }
    dispatch(updatePhotographerProfileSuccess(false));
    return response;
  } catch (error) {
    console.log("updatePhotographerProfile error--", error);
    dispatch(updatePhotographerProfileError(false));
    return { message: error };
  }
};
export const profileSetup = (body) => async (dispatch) => {
  console.log("profileSetup body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(profileSetupLoading(true));
  try {
    const response = await Services.post(
      url.PROFILE_SETUP + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("profileSetup response--", JSON.stringify(response));
    if (response.status == 200) {
      dispatch(profileSetupSuccess(false));
    }

    dispatch(profileSetupSuccess(false));
    return response;
  } catch (error) {
    console.log("profileSetup error--", error);
    dispatch(profileSetupError(false));
    return { message: error };
  }
};

export const userLogin = (body, url) => async (dispatch) => {
  console.log("userLogin body--", url, body);
  dispatch(userLoginLoading(true));
  try {
    const response = await Services.post(
      url + "?apiKey=apiKey",
      "",
      body,
      true
    );
    if (response.status == 200) {
      console.log("userLogin response--", response);
      storeData(storageKey.USER_ID, response?.results?.id);
      dispatch(userLoginSuccess(false, response?.results?.user_role));
      dispatch(
        userRegisterSuccess(false, { registrationData: response?.results })
      );
      storeData(storageKey?.AUTH_TOKEN, response?.results?.access_token);
      storeData(
        storageKey?.USER_ROLE,
        JSON.stringify(response?.results?.user_role)
      );
      storeData(
        storageKey?.APPROVAL_STATUS,
        JSON?.stringify(response?.results?.profile_approval)
      );
      storeData(
        storageKey?.USER_STATUS,
        JSON?.stringify(response?.results?.completed_step)
      );
      storeData(
        storageKey?.PACKAGE_ID,
        JSON.stringify(response?.results?.packages_id)
      );
    } else {
      dispatch(userLoginSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("userLogin error--", error);
    dispatch(userLoginError(false));
    return { message: error };
  }
};

export const addFirebaseUid = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(sendMessageLoading(false));
  try {
    const response = await Services.post(
      url.SAVE_FIREBASE_UID + "?apiKey=apiKey",
      token,
      body,
      true
    );
    if (response?.status == 200) {
      dispatch(sendMessageSuccess(false));
      return response;
    } else {
      dispatch(sendMessageSuccess(false));
    }
  } catch (error) {
    console.log("sendMessage error--", error);
    dispatch(sendMessageError(false));
    return { message: error };
  }
};

export const checkEmailExist = (body) => async (dispatch) => {
  try {
    const response = await Services.post(
      url.CHECK_EMAIL_EXIST + "?apiKey=apiKey",
      "",
      body,
      true
    );

    return response;
  } catch (error) {
    console.log("sendVerficationEmail error --", error);
    return { message: error };
  }
};

export const registerToken = (body) => async (dispatch) => {
  console.log("registerToken body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(registerTokenLoading(true));
  try {
    const response = await Services.post(
      url.REGISTER_TOKEN + "?apiKey=apiKey",
      token,
      body,
      true
    );
    if (response.status == 200) {
      console.log("registerToken response--", response);

      dispatch(registerTokenSuccess(false));
    } else {
      dispatch(registerTokenSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("registerToken error--", error);
    dispatch(registerTokenError(false));
    return { message: error };
  }
};

export const removeToken = (body) => async (dispatch) => {
  console.log("removeToken body--", body);
  try {
    const response = await Services.post(
      url.REMOVE_TOKEN + "?apiKey=apiKey",
      "",
      body,
      true
    );
    if (response.status == 200) {
      console.log("removeToken response--", response);
    }
    return response;
  } catch (error) {
    console.log("removeToken error--", error);
    return { message: error };
  }
};

export const userLogout = (body) => async (dispatch) => {
  console.log("userLogout body--", body);
  dispatch(userLogoutLoading(true));
  try {
    const response = await Services.post(
      url.USER_LOGOUT + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("userLogout response--", response);
    if (response.status == 200) {
      clearData();
      dispatch(userLogoutSuccess(false));
      return response;
    } else {
      clearData();
    }
    dispatch(userLogoutSuccess(false));
  } catch (error) {
    console.log("userLogout error--", error);
    dispatch(userLogoutError(false));
    return { message: error };
  }
};

export const getOptionsData = () => async (dispatch) => {
  dispatch(getOptionsDataLoading(true));
  try {
    const response = await Services.get(
      url.GET_OPTIONS_DATA + "?apiKey=apiKey",
      "",
      true
    );
    // console.log("getOptionsData response--", response);

    if (response.status == 200) {
      dispatch(
        getOptionsDataSuccess(false, {
          femaleOptions: response?.results?.group_62749b609360c,
          maleOptions: response?.results?.group_62749a513bf1a,
          childOptions: response?.results?.group_63181d08b6357,
          otherOptions: response?.results?.group_627497cf304a6,
          socialMediaOptions: response?.results?.group_62849b4520284,
          postJobOptions: response?.results?.group_628774e8ce197,
          filterOption: response?.results?.group_62e2bb6565f61,
          languages: response?.results?.languages,
          englishLevel: response?.results?.english_level,
          socialMediaOptions: response?.results?.group_62849b4520284,
          postJobOptions: response?.results?.group_628774e8ce197,
          filterOption: response?.results?.group_62e2bb6565f61,
          languages: response?.results?.languages,
          englishLevel: response?.results?.english_level,
          actorRelation: response?.results?.group_63181d08b7031,
          postReportOptions: response?.results?.post_report_options,
          userReportOptions: response?.results?.user_report_options,
          pay_type: response?.results?.pay_type,
          when_you_expect_payment: response?.results?.when_you_expect_payment,
          time_zone: response?.results?.time_zone,
          project_location_type: response?.results?.project_location_type,
          project_levels: response?.results?.project_levels,
          job_durations: response?.results?.job_durations,
          identityVerify: response?.results?.identity_document_type,
          cancelReason: response?.results?.cancel_project_options,
          jobReport: response?.results?.job_report_options,
          userRole: response?.results?.user_roles_list,
        })
      );
    } else {
      dispatch(getOptionsDataSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("getOptionsData error--", error);
    dispatch(getOptionsDataError(false));
    return { message: error };
  }
};

export const getUserDetail = (body) => async (dispatch) => {
  // console.log("getUserDetail body--", body);
  dispatch(getUserDetailLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_USER_DETAIL + "?apiKey=apiKey",
      "",
      body,
      true,
      false
    );
    // console.log("getUserDetail response--", response);
    if (response.status == 200) {
      dispatch(
        getUserDetailSuccess(false, {
          userData: response?.results,
        })
      );
      return response;
    } else {
      dispatch(getUserDetailSuccess(false, { userData: {} }));
    }
  } catch (error) {
    console.log("getUserDetail error--", error);
    dispatch(getUserDetailError(false));
    return { message: error };
  }
};

export const uploadGalleryProfile = (body) => async (dispatch) => {
  console.log("uploadGalleryProfile body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(uploadGalleryProfileLoading(true));
  try {
    const response = await Services.formDataPost(
      url.UPLOAD_GALLERY_PROFILE + "?apiKey=apiKey",
      token,
      body
    );
    console.log("uploadGalleryProfile response--", response);
    if (response.status == 200) {
      dispatch(uploadGalleryProfileSuccess(false));
      return response;
    } else {
      dispatch(uploadGalleryProfileSuccess(false));
    }
  } catch (error) {
    console.log("uploadGalleryProfile error--", error);
    dispatch(uploadGalleryProfileError(false));
    return { message: error };
  }
};

export const getPackages = (body) => async (dispatch) => {
  console.log("getPackages body--", body);
  dispatch(getPackagesLoading(true));
  try {
    const response = await Services.get(
      url.GET_PACKAGES + "?apiKey=apiKey",
      "",
      true
    );
    console.log("getPackages response--", response);
    if (response.status == 200) {
      dispatch(getPackagesSuccess(false));
      return response;
    }
    dispatch(getPackagesSuccess(false));
  } catch (error) {
    console.log("getPackages error--", error);
    dispatch(getPackagesError(false));
    return { message: error };
  }
};

export const getFirebaseUser = async (email) => {
  try {
    const response = await axios.get(
      `https://api.booksculp.com/v1/get-firebase-user.php`,
      {
        params: { email: email.trim() },
      }
    );

    console.log("✅ User data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching user:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const getFirebaseUserByToken = async (email) => {
  try {
    const response = await axios.get(
      `https://api.booksculp.com/v1/get-firebase-user.php`,
      {
        params: { email: email.trim() },
      }
    );

    console.log("✅ getFirebaseUserByToken User data:", response.data);
    return response.data;
  } catch (error) {
    console.error(
      "❌ Error fetching user:",
      error.response?.data || error.message
    );
    return null;
  }
};

export const getPaymentStatus = () => async () => {
  try {
    const response = await Services.get(
      url.GET_PAYMENT_STATUS + "?apiKey=apiKey",
      "",
      true
    );
    console.log("getPaymentStatus response--", response);
    if (response.status == 200) {
      return response;
    }
  } catch (error) {
    console.log("getPaymentStatus error--", error);
    return { message: error };
  }
};

export const sendVerficationEmail = (body) => async (dispatch) => {
  console.log("sendVerficationEmail body --", body);
  dispatch(sendVerficationEmailLoading(true));
  try {
    const response = await Services.post(
      url.SEND_VARIFICATION_EMAIL + "?apiKey=apiKey",
      "",
      body
    );
    console.log("sendVerficationEmail response --", response);
    dispatch(sendVerficationEmailSuccess(false));
    return response;
  } catch (error) {
    console.log("sendVerficationEmail error --", error);
    dispatch(sendVerficationEmailError(false));
    return { message: error };
  }
};
export const verifyOtpApi = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.VERIFY_OTP + "?apiKey=apiKey",
      token,
      body,
      false
    );
    if (response?.status == 200) {
    }

    return response;
  } catch (error) {
    return { message: error };
  }
};

export const sendVerfication = (body) => async (dispatch) => {
  console.log("sendVerfication body --", body);
  dispatch(sendVerficationLoading(true));
  try {
    const response = await Services.post(
      url.SEND_VARIFICATION + "?apiKey=apiKey",
      "",
      body
    );
    console.log("sendVerfication response --", response);
    dispatch(sendVerficationSuccess(false));
    return response;
  } catch (error) {
    console.log("sendVerfication error --", error);
    dispatch(sendVerficationError(false));
    return { message: error };
  }
};

export const otpVerify = (body) => async (dispatch) => {
  console.log("otpVerify body --", body);
  dispatch(otpVerifyLoading(true));
  try {
    const response = await Services.post(
      url.OTP_VERIFICATION + "?apiKey=apiKey",
      "",
      body
    );
    console.log("otpVerify response --", response);
    dispatch(otpVerifySuccess(false));
    return response;
  } catch (error) {
    console.log("otpVerify error --", error);
    dispatch(otpVerifyError(false));
    return { message: error };
  }
};

export const resetPassword = (body) => async (dispatch) => {
  console.log("resetPassword body --", body);
  dispatch(resetPasswordLoading(true));
  try {
    const response = await Services.post(
      url.RESET_PASSWORD + "?apiKey=apiKey",
      "",
      body
    );
    console.log("resetPassword response --", response);
    dispatch(resetPasswordSuccess(false));
    return response;
  } catch (error) {
    console.log("resetPassword error --", error);
    dispatch(resetPasswordError(false));
    return { message: error };
  }
};
export const forgetPassword = (body) => async (dispatch) => {
  console.log("forgetPassword body --", body);
  dispatch(forgetPasswordLoading(true));
  try {
    const response = await Services.post(
      url.FORGOT_PASSWORD + "?apiKey=apiKey",
      "",
      body
    );
    console.log("forgetPassword response --", response);
    dispatch(forgetPasswordSuccess(false));
    return response;
  } catch (error) {
    console.log("forgetPassword error --", error);
    dispatch(forgetPasswordError(false));
    return { message: error };
  }
};
export const identityVerification = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  console.log("identityVerification body --", body);
  dispatch(identityVerificationLoading(true));
  try {
    const response = await Services.formDataPost(
      url.IDENTITY_VERIFICATION + "?apiKey=apiKey",
      token,
      body
    );
    console.log("identityVerification response --", response);
    dispatch(identityVerificationSuccess(false));
    return response;
  } catch (error) {
    console.log("identityVerification error --", error);
    dispatch(identityVerificationError(false));
    return { message: error };
  }
};
export const removeImage = (body) => async (dispatch) => {
  console.log("removeImage body --", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(removeImageLoading(true));
  try {
    const response = await Services.post(
      url.REMOVE_IMAGE + "?apiKey=apiKey",
      token,
      body
    );
    console.log("removeImage response --", response);
    dispatch(removeImageSuccess(false));
    return response;
  } catch (error) {
    console.log("removeImage error --", error);
    dispatch(removeImageError(false));
    return { message: error };
  }
};

export const getCurrentLocationApi = (body) => async (dispatch) => {
  try {
    const response = await Services.post(
      url.GET_CURRENT_DATA + "?apiKey=apiKey",
      "",
      body,
      true
    );

    return response;
  } catch (error) {
    console.log("updatePhotographerProfile error--", error);

    return { message: error };
  }
};

// export const forgetPasswordOtpVerify = body => async dispatch => {
//   console.log('forgetPasswordOtpVerify body--', body);
//   dispatch(forgetPasswordOtpVerifyLoading(true));
//   try {
//     const response = await Services.post(
//       url.FORGOT_PASSWORD_OTP_VERIFY,
//       '',
//       body,
//     );
//     console.log('forgetPasswordOtpVerify response--', response);
//     if (response.data) {
//       dispatch(forgetPasswordOtpVerifySuccess(false));
//       storeData(storageKey.TEMP_TOKEN, JSON.stringify(response.data.token));
//     }
//     dispatch(forgetPasswordOtpVerifySuccess(false));
//     return response;
//   } catch (error) {
//     console.log('forgetPasswordOtpVerify error--', error);
//     dispatch(forgetPasswordOtpVerifyError(false));
//     return {message: error};
//   }
// };

// export const userDetails = () => async dispatch => {
//   dispatch(userDetailsLoading(true));
//   const token = await getData(storageKey.AUTH_TOKEN);
//   try {
//     const response = await Services.get(url.USER_DETAILS, token);
//     console.log('userDetails response --', response);
//     dispatch(userDetailsSuccess(false));
//     return response;
//   } catch (error) {
//     console.log('userDetails error --', error);
//     dispatch(userDetailsError(false));
//     return {message: error};
//   }
// };

// export const updateProfile = body => async dispatch => {
//   const token = await getData(storageKey.AUTH_TOKEN);
//   console.log('updateProfile data --', body);
//   dispatch(updateProfileLoading(true));
//   try {
//     const response = await Services.formDataPost(
//       url.UPDATE_PROFILE,
//       token,
//       body,
//     );
//     if (response.data) {
//       storeData(storageKey.USER_DATA, response.data);
//       console.log('updateProfile response --', response);
//       dispatch(updateProfileSuccess(false));
//       return response;
//     }
//     dispatch(updateProfileSuccess(false));
//   } catch (error) {
//     console.log('updateProfile error --', error);
//     dispatch(updateProfileError(false));
//     return {message: error};
//   }
// };

// export const changePassword = body => async dispatch => {
//   console.log('changePassword body--', body);
//   dispatch(changePasswordLoading(true));
//   const token = await getData(storageKey.AUTH_TOKEN);
//   console.log('checking the token--', token);
//   try {
//     const response = await Services.formDataPost(
//       url.CHANGE_PASSWORD,
//       token,
//       body,
//     );
//     console.log('changePasswordResponse--', response);
//     showToast(response.message);
//     dispatch(changePasswordSuccess(false));
//     return JSON.stringify(response);
//   } catch (error) {
//     console.log('changePasswordResponse--', error);
//     dispatch(changePasswordError(false));
//     return {message: error};
//   }
// };
