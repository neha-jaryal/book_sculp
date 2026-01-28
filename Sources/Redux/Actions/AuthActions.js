import {
  NAVIGATOR_STATUS,
  USER_LOGIN_ERROR,
  USER_LOGIN_LOADING,
  USER_LOGIN_SUCCESS,
  SEND_MESSAGE_LOADING,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  REGISTER_TOKEN_ERROR,
  REGISTER_TOKEN_LOADING,
  REGISTER_TOKEN_SUCCESS,
  USER_LOGOUT_ERROR,
  USER_LOGOUT_LOADING,
  USER_LOGOUT_SUCCESS,
  USER_REGISTER_ERROR,
  USER_REGISTER_LOADING,
  USER_REGISTER_SUCCESS,
  PHOTOGRAPHER_REGISTER_LOADING,
  PHOTOGRAPHER_REGISTER_SUCCESS,
  PHOTOGRAPHER_REGISTER_ERROR,
  UPDATE_PHOTOGRAPHER_PROFILE_LOADING,
  UPDATE_PHOTOGRAPHER_PROFILE_SUCCESS,
  UPDATE_PHOTOGRAPHER_PROFILE_ERROR,
  PROFILE_SETUP_LOADING,
  PROFILE_SETUP_SUCCESS,
  PROFILE_SETUP_ERROR,
  GET_OPTIONS_DATA_LOADING,
  GET_OPTIONS_DATA_SUCCESS,
  GET_OPTIONS_DATA_ERROR,
  GET_USER_DETAIL_LOADING,
  GET_USER_DETAIL_SUCCESS,
  GET_USER_DETAIL_ERROR,
  UPLOAD_GALLERY_PROFILE_LOADING,
  UPLOAD_GALLERY_PROFILE_SUCCESS,
  UPLOAD_GALLERY_PROFILE_ERROR,
  GET_PACKAGES_LOADING,
  GET_PACKAGES_SUCCESS,
  GET_PACKAGES_ERROR,
  SEND_VARIFICATION_LOADING,
  SEND_VARIFICATION_SUCCESS,
  SEND_VARIFICATION_ERROR,
  SEND_VARIFICATION_EMAIL_LOADING,
  SEND_VARIFICATION_EMAIL_SUCCESS,
  SEND_VARIFICATION_EMAIL_ERROR,
  OTP_VERIFICATION_LOADING,
  OTP_VERIFICATION_SUCCESS,
  OTP_VERIFICATION_ERROR,
  RESET_PASSWORD_LOADING,
  RESET_PASSWORD_SUCCESS,
  RESET_PASSWORD_ERROR,
  FORGET_PASSWORD_LOADING,
  FORGET_PASSWORD_SUCCESS,
  FORGET_PASSWORD_ERROR,
  IDENTITY_VERIFICATION_LOADING,
  IDENTITY_VERIFICATION_SUCCESS,
  IDENTITY_VERIFICATION_ERROR,
  REMOVE_IMAGE_LOADING,
  REMOVE_IMAGE_SUCCESS,
  REMOVE_IMAGE_ERROR,
} from "../Consts/AuthConsts";

export const navigatorStatus = (status, splash, success, paramsData) => ({
  type: NAVIGATOR_STATUS,
  navigator: status,
  splash: splash,
  success: success,
  paramsData : paramsData
});

export const userLoginLoading = (isLoading) => ({
  type: USER_LOGIN_LOADING,
  isLoading: isLoading,
});
export const userLoginSuccess = (isLoading) => ({
  type: USER_LOGIN_SUCCESS,
  isLoading: isLoading,
});
export const userLoginError = (isLoading) => ({
  type: USER_LOGIN_ERROR,
  isLoading: isLoading,
});

export const sendMessageLoading = (isLoading) => ({
  type: SEND_MESSAGE_LOADING,
  isLoading: isLoading,
});
export const sendMessageSuccess = (isLoading) => ({
  type: SEND_MESSAGE_SUCCESS,
  isLoading: isLoading,
});
export const sendMessageError = (isLoading) => ({
  type: SEND_MESSAGE_ERROR,
  isLoading: isLoading,
});

export const registerTokenLoading = (isLoading) => ({
  type: REGISTER_TOKEN_LOADING,
  isLoading: isLoading,
});
export const registerTokenSuccess = (isLoading) => ({
  type: REGISTER_TOKEN_SUCCESS,
  isLoading: isLoading,
});
export const registerTokenError = (isLoading) => ({
  type: REGISTER_TOKEN_ERROR,
  isLoading: isLoading,
});

export const userRegisterLoading = (isLoading) => ({
  type: USER_REGISTER_LOADING,
  isLoading: isLoading,
});
export const userRegisterSuccess = (isLoading, data) => ({
  type: USER_REGISTER_SUCCESS,
  isLoading: isLoading,
  registrationData: data,
});
export const userRegisterError = (isLoading) => ({
  type: USER_REGISTER_ERROR,
  isLoading: isLoading,
});

export const profileSetupLoading = (isLoading) => ({
  type: PROFILE_SETUP_LOADING,
  isLoading: isLoading,
});
export const profileSetupSuccess = (isLoading) => ({
  type: PROFILE_SETUP_SUCCESS,
  isLoading: isLoading,
});
export const profileSetupError = (isLoading) => ({
  type: PROFILE_SETUP_ERROR,
  isLoading: isLoading,
});

export const photographerRegisterLoading = (isLoading) => ({
  type: PHOTOGRAPHER_REGISTER_LOADING,
  isLoading: isLoading,
});
export const photographerRegisterSuccess = (isLoading, data) => ({
  type: PHOTOGRAPHER_REGISTER_SUCCESS,
  isLoading: isLoading,
  registrationData: data,
});
export const photographerRegisterError = (isLoading) => ({
  type: PHOTOGRAPHER_REGISTER_ERROR,
  isLoading: isLoading,
});

export const updatePhotographerProfileLoading = (isLoading) => ({
  type: UPDATE_PHOTOGRAPHER_PROFILE_LOADING,
  isLoading: isLoading,
});
export const updatePhotographerProfileSuccess = (isLoading) => ({
  type: UPDATE_PHOTOGRAPHER_PROFILE_SUCCESS,
  isLoading: isLoading,
});
export const updatePhotographerProfileError = (isLoading) => ({
  type: UPDATE_PHOTOGRAPHER_PROFILE_ERROR,
  isLoading: isLoading,
});

export const userLogoutLoading = (isLoading) => ({
  type: USER_LOGOUT_LOADING,
  isLoading: isLoading,
});
export const userLogoutSuccess = (isLoading) => ({
  type: USER_LOGOUT_SUCCESS,
  isLoading: isLoading,
});
export const userLogoutError = (isLoading) => ({
  type: USER_LOGOUT_ERROR,
  isLoading: isLoading,
});

export const getOptionsDataLoading = (isLoading) => ({
  type: GET_OPTIONS_DATA_LOADING,
  isLoading: isLoading,
});
export const getOptionsDataSuccess = (isLoading, data) => ({
  type: GET_OPTIONS_DATA_SUCCESS,
  isLoading: isLoading,
  allOptionData: data,
   
});
export const getOptionsDataError = (isLoading) => ({
  type: GET_OPTIONS_DATA_ERROR,
  isLoading: isLoading,
});

export const getUserDetailLoading = (isLoading) => ({
  type: GET_USER_DETAIL_LOADING,
  isLoading: isLoading,
});
export const getUserDetailSuccess = (isLoading, data) => ({
  type: GET_USER_DETAIL_SUCCESS,
  isLoading: isLoading,
  // allOptionData: data,
  userData: data,
});
export const getUserDetailError = (isLoading) => ({
  type: GET_USER_DETAIL_ERROR,
  isLoading: isLoading,
});

export const uploadGalleryProfileLoading = (isLoading) => ({
  type: UPLOAD_GALLERY_PROFILE_LOADING,
  isLoading: isLoading,
});
export const uploadGalleryProfileSuccess = (isLoading, data) => ({
  type: UPLOAD_GALLERY_PROFILE_SUCCESS,
  isLoading: isLoading,
});
export const uploadGalleryProfileError = (isLoading) => ({
  type: UPLOAD_GALLERY_PROFILE_ERROR,
  isLoading: isLoading,
});

export const getPackagesLoading = (isLoading) => ({
  type: GET_PACKAGES_LOADING,
  isLoading: isLoading,
});
export const getPackagesSuccess = (isLoading, data) => ({
  type: GET_PACKAGES_SUCCESS,
  isLoading: isLoading,
});
export const getPackagesError = (isLoading) => ({
  type: GET_PACKAGES_ERROR,
  isLoading: isLoading,
});

export const sendVerficationLoading = (isLoading) => ({
  type: SEND_VARIFICATION_LOADING,
  isLoading: isLoading,
});
export const sendVerficationSuccess = (isLoading, data) => ({
  type: SEND_VARIFICATION_SUCCESS,
  isLoading: isLoading,
});
export const sendVerficationError = (isLoading) => ({
  type: SEND_VARIFICATION_ERROR,
  isLoading: isLoading,
});

export const sendVerficationEmailLoading = (isLoading) => ({
  type: SEND_VARIFICATION_EMAIL_LOADING,
  isLoading: isLoading,
});
export const sendVerficationEmailSuccess = (isLoading, data) => ({
  type: SEND_VARIFICATION_EMAIL_SUCCESS,
  isLoading: isLoading,
});
export const sendVerficationEmailError = (isLoading) => ({
  type: SEND_VARIFICATION_EMAIL_ERROR,
  isLoading: isLoading,
});

export const otpVerifyLoading = (isLoading) => ({
  type: OTP_VERIFICATION_LOADING,
  isLoading: isLoading,
});
export const otpVerifySuccess = (isLoading, data) => ({
  type: OTP_VERIFICATION_SUCCESS,
  isLoading: isLoading,
});
export const otpVerifyError = (isLoading) => ({
  type: OTP_VERIFICATION_ERROR,
  isLoading: isLoading,
});

export const resetPasswordLoading = (isLoading) => ({
  type: RESET_PASSWORD_LOADING,
  isLoading: isLoading,
});
export const resetPasswordSuccess = (isLoading) => ({
  type: RESET_PASSWORD_SUCCESS,
  isLoading: isLoading,
});
export const resetPasswordError = (isLoading) => ({
  type: RESET_PASSWORD_ERROR,
  isLoading: isLoading,
});

export const forgetPasswordLoading = (isLoading) => ({
  type: FORGET_PASSWORD_LOADING,
  isLoading: isLoading,
});
export const forgetPasswordSuccess = (isLoading) => ({
  type: FORGET_PASSWORD_SUCCESS,
  isLoading: isLoading,
});
export const forgetPasswordError = (isLoading) => ({
  type: FORGET_PASSWORD_ERROR,
  isLoading: isLoading,
});

export const identityVerificationLoading = (isLoading) => ({
  type: IDENTITY_VERIFICATION_LOADING,
  isLoading: isLoading,
});
export const identityVerificationSuccess = (isLoading) => ({
  type: IDENTITY_VERIFICATION_SUCCESS,
  isLoading: isLoading,
});
export const identityVerificationError = (isLoading) => ({
  type: IDENTITY_VERIFICATION_ERROR,
  isLoading: isLoading,
});

export const removeImageLoading = (isLoading) => ({
  type: REMOVE_IMAGE_LOADING,
  isLoading: isLoading,
});
export const removeImageSuccess = (isLoading) => ({
  type: REMOVE_IMAGE_SUCCESS,
  isLoading: isLoading,
});
export const removeImageError = (isLoading) => ({
  type: REMOVE_IMAGE_ERROR,
  isLoading: isLoading,
});
