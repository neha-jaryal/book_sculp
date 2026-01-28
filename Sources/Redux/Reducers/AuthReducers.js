import { routeName } from "../../Utility";
import {
  NAVIGATOR_STATUS,
  USER_LOGIN_ERROR,
  USER_LOGIN_LOADING,
  USER_LOGIN_SUCCESS,
  USER_LOGOUT_ERROR,
  USER_LOGOUT_LOADING,
  USER_LOGOUT_SUCCESS,
  USER_REGISTER_ERROR,
  USER_REGISTER_LOADING,
  USER_REGISTER_SUCCESS,
  PROFILE_SETUP_LOADING,
  PROFILE_SETUP_SUCCESS,
  PROFILE_SETUP_ERROR,
  PHOTOGRAPHER_REGISTER_LOADING,
  PHOTOGRAPHER_REGISTER_SUCCESS,
  PHOTOGRAPHER_REGISTER_ERROR,
  UPDATE_PHOTOGRAPHER_PROFILE_LOADING,
  UPDATE_PHOTOGRAPHER_PROFILE_SUCCESS,
  UPDATE_PHOTOGRAPHER_PROFILE_ERROR,
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

const initialState = {
  isLoading: false,
  isLogin: false,
  navigator: routeName?.AUTHSTACKS,
  splash: true,
  success: false,
};

export const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case NAVIGATOR_STATUS:
      return {
        ...state,
        navigator: action?.navigator,
        splash: action?.splash,
        success: action?.success,
        paramsData: action?.paramsData,
      };

    case USER_REGISTER_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        isLogin: true,
        registrationData: action?.registrationData,
      };
    case USER_REGISTER_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case PROFILE_SETUP_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case PROFILE_SETUP_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case PROFILE_SETUP_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case PHOTOGRAPHER_REGISTER_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case PHOTOGRAPHER_REGISTER_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        isLogin: true,
        registrationData: action?.registrationData,
      };
    case PHOTOGRAPHER_REGISTER_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPDATE_PHOTOGRAPHER_PROFILE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_PHOTOGRAPHER_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_PHOTOGRAPHER_PROFILE_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case USER_LOGIN_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_LOGIN_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        isLogin: true,
        userData: action?.userData,
      };
    case USER_LOGIN_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
        isLogin: false,
      };

    case USER_LOGOUT_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_LOGOUT_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        isLogin: false,
      };
    case USER_LOGOUT_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
        isLogin: true,
      };

    case GET_OPTIONS_DATA_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_OPTIONS_DATA_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case GET_OPTIONS_DATA_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_DETAIL_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_DETAIL_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case GET_USER_DETAIL_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPLOAD_GALLERY_PROFILE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_GALLERY_PROFILE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case UPLOAD_GALLERY_PROFILE_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_PACKAGES_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PACKAGES_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case GET_PACKAGES_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case SEND_VARIFICATION_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SEND_VARIFICATION_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case SEND_VARIFICATION_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case SEND_VARIFICATION_EMAIL_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SEND_VARIFICATION_EMAIL_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case SEND_VARIFICATION_EMAIL_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case OTP_VERIFICATION_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case OTP_VERIFICATION_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case OTP_VERIFICATION_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case RESET_PASSWORD_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case RESET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case RESET_PASSWORD_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case FORGET_PASSWORD_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case FORGET_PASSWORD_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case FORGET_PASSWORD_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case IDENTITY_VERIFICATION_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case IDENTITY_VERIFICATION_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case IDENTITY_VERIFICATION_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case REMOVE_IMAGE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case REMOVE_IMAGE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
        allOptionData: action?.allOptionData,
      };
    case REMOVE_IMAGE_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
};
