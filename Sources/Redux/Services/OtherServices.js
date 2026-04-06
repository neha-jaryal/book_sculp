import axios from "axios";
import * as url from "../../API Services/Url";

import * as Services from "../../API Services/services";
import {
  getModelsListError,
  getModelsListLoading,
  getModelsListSuccess,
  getKidsListError,
  getKidsListLoading,
  getKidsListSuccess,
  getPhotographerListError,
  getPhotographerListLoading,
  getPhotographerListSuccess,
  getJobDetailsError,
  getJobDetailsLoading,
  getJobDetailsSuccess,
  repostJobError,
  repostJobLoading,
  repostJobSuccess,
  getLanguagesListError,
  getLanguagesListLoading,
  getLanguagesListSuccess,
  getCountryListError,
  getCountryListLoading,
  getCountryListSuccess,
  getJobFilterError,
  getJobFilterLoading,
  getJobFilterSuccess,
  getJobsListError,
  getJobsListLoading,
  getJobsListSuccess,
  postJobError,
  postJobLoading,
  postJobSuccess,
  updatePostedJobError,
  updatePostedJobLoading,
  updatePostedJobSuccess,
  userFollowingError,
  userFollowingLoading,
  userFollowingSuccess,
  getFollowDetailsError,
  getFollowDetailsLoading,
  getFollowDetailsSuccess,
  userReportingError,
  userReportingLoading,
  userReportingSuccess,
  getSearchResultsLoading,
  getSearchResultsSuccess,
  getSearchResultsError,
  submitJobProposalError,
  submitJobProposalLoading,
  submitJobProposalSuccess,
  UpdateJobProposalError,
  UpdateJobProposalLoading,
  UpdateJobProposalSuccess,
  getPostedListingError,
  getPostedListingLoading,
  getPostedListingSuccess,
  getProposalListingError,
  getProposalListingLoading,
  getProposalListingSuccess,
  blockUserError,
  blockUserLoading,
  blockUserSuccess,
  getRatingOptionsError,
  getRatingOptionsLoading,
  getRatingOptionsSuccess,
  completePayError,
  completePayLoading,
  completePaySuccess,
  getLatestProposalsLoading,
  getLatestProposalsSuccess,
  getLatestProposalsError,
  hireCheckoutLoading,
  hireCheckoutSuccess,
  hireCheckoutError,
  getNotificationListLoading,
  getNotificationListSuccess,
  getNotificationListError,
  updateNotifyStatusLoading,
  updateNotifyStatusSuccess,
  updateNotifyStatusError,
  submitContactFormLoading,
  submitContactFormSuccess,
  submitContactFormError,
  getProposalStatusLoading,
  getProposalStatusSuccess,
  getProposalStatusError,
  getModelProjectsLoading,
  getModelProjectsSuccess,
  getModelProjectsError,
  getAccountSettingDetailsError,
  getAccountSettingDetailsLoading,
  getAccountSettingDetailsSuccess,
  deleteUserError,
  deleteUserLoading,
  deleteUserSuccess,
  getAllTalentsListError,
  getAllTalentsListLoading,
  getAllTalentsListSuccess,
  getAllClientsListListError,
  getAllClientsListListLoading,
  getAllClientsListListSuccess,
  uploadPortfolioLoading,
  uploadPortfolioSuccess,
  uploadPortfolioError,
  uploadVideoLoading,
  uploadVideoSuccess,
  uploadVideoError,
  getReelListLoading,
  getReelListSuccess,
  getReelListError,
  updatePortfolioLoading,
  updatePortfolioSuccess,
  updatePortfolioError,
  uploadSocialPostLoading,
  uploadSocialPostSuccess,
  uploadSocialPostError,
  updateSocialPostLoading,
  updateSocialPostSuccess,
  updateSocialPostError,
  getUserPortfolioLoading,
  getUserPortfolioSuccess,
  getUserPortfolioError,
  getUserSocialPostsLoading,
  getUserSocialPostsSuccess,
  getUserSocialPostsError,
  getPortfolioDetailsLoading,
  getPortfolioDetailsSuccess,
  getPortfolioDetailsError,
  getSocialPostDetailsLoading,
  getSocialPostDetailsSuccess,
  getSocialPostDetailsError,
  addCommentLoading,
  addCommentSuccess,
  addCommentError,
  likeDislikeLoading,
  likeDislikeSuccess,
  likeDislikeError,
  getChatListLoading,
  getChatListSuccess,
  getChatListError,
  getUserChatLoading,
  getUserChatSuccess,
  getUserChatError,
  sendMessageLoading,
  sendMessageSuccess,
  sendMessageError,
  getTypingStatusLoading,
  getTypingStatusSuccess,
  getTypingStatusError,
  getNotificationBadgeLoading,
  getNotificationBadgeSuccess,
  getNotificationBadgeError,
  getReadStatusLoading,
  getReadStatusSuccess,
  getReadStatusError,
  clearUserChatLoading,
  clearUserChatSuccess,
  clearUserChatError,
  getPortfoliosLoading,
  getPortfoliosSuccess,
  getPortfoliosError,
  getSocialPostsLoading,
  getSocialPostsSuccess,
  getSocialPostsError,
  deletePostLoading,
  deletePostSuccess,
  deletePostError,
  getTrimmedVideoLoading,
  getTrimmedVideoSuccess,
  getTrimmedVideoError,
  savePostLoading,
  savePostSuccess,
  savePostError,
  getSavedPostLoading,
  getSavedPostSuccess,
  getSavedPostError,
  deleteJobLoading,
  deleteJobSuccess,
  deleteJobError,
  getConnectsLoading,
  getConnectsSuccess,
  getConnectsError,

  // Payment Checkout
  getProductListLoading,
  getProductListSuccess,
  getProductListError,
  createSessionLoading,
  createSessionSuccess,
  createSessionError,
  productCheckoutLoading,
  productCheckoutSuccess,
  productCheckoutError,
  addStripeAccountLoading,
  addStripeAccountSuccess,
  addStripeAccountError,
  handleWithdrawLoading,
  handleWithdrawSuccess,
  handleWithdrawError,
  getPayoutsListLoading,
  getPayoutsListSuccess,
  getPayoutsListError,
} from "../Actions/OtherActions";
import { getData, storageKey } from "../../Utility/Storage";
import { FIREBASE_SERVER_KEY } from "../../Utility";
import { Images } from "../../Constants";
import { GoogleAuth } from "google-auth-library";
// const serviceAccountPath = path.join(
//   __dirname,
//   "config",
//   "firebase_server_key.json"
// ); // Path to JSON file
// const serviceAccountPath = require("../../Assets/Firebase/firebase_server_key.json");
// const auth = new GoogleAuth({
//   keyFile: serviceAccountPath,
//   scopes: ["https://www.googleapis.com/auth/firebase.messaging"],
// });
export const getModelsList = (body) => async (dispatch) => {
  dispatch(getModelsListLoading(true));
  try {
    const response = await Services.post(
      url.GET_MODELS_LIST + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getModelsList response --", response);
    dispatch(getModelsListSuccess(false));
    return response;
  } catch (error) {
    console.log("getModelsList error --", error);
    dispatch(getModelsListError(false));
    return { message: error };
  }
};

export const getKidsList = (body) => async (dispatch) => {
  dispatch(getKidsListLoading(true));
  try {
    const response = await Services.post(
      url.GET_KIDS_LIST + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getKidsList response --", response);
    dispatch(getKidsListSuccess(false));
    return response;
  } catch (error) {
    console.log("getKidsList error --", error);
    dispatch(getKidsListError(false));
    return { message: error };
  }
};

export const getPhotographerList = (body) => async (dispatch) => {
  dispatch(getPhotographerListLoading(true));
  try {
    const response = await Services.post(
      url.GET_PHOTOGRAPHER_LIST + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getPhotographerList response --", response);
    dispatch(getPhotographerListSuccess(false));
    return response;
  } catch (error) {
    console.log("getPhotographerList error --", error);
    dispatch(getPhotographerListError(false));
    return { message: error };
  }
};
export const getJobDetails = (body) => async (dispatch) => {
  dispatch(getJobDetailsLoading(true));
  try {
    const response = await Services.post(
      url.GET_JOB_DETAILS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getJobDetails response --", response);
    dispatch(getJobDetailsSuccess(false));
    return response;
  } catch (error) {
    console.log("getJobDetails error --", error);
    dispatch(getJobDetailsError(false));
    return { message: error };
  }
};
export const repostJob = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);

  dispatch(repostJobLoading(true));
  try {
    const response = await Services.post(
      url.REPOST_JOB + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("repostJob response --", response);
    dispatch(repostJobSuccess(false));
    return response;
  } catch (error) {
    console.log("repostJob error --", error);
    dispatch(repostJobError(false));
    return { message: error };
  }
};

export const getLanguagesList = (body) => async (dispatch) => {
  dispatch(getLanguagesListLoading(true));
  try {
    const response = await Services.post(
      url.GET_LANGUAGES_LIST + "?apiKey=apiKey",
      "",
      body
    );
    console.log("getLanguagesList response --", response);
    dispatch(getLanguagesListSuccess(false));
    return response;
  } catch (error) {
    console.log("getLanguagesList error --", error);
    dispatch(getLanguagesListError(false));
    return { message: error };
  }
};
export const getCountryList = (body) => async (dispatch) => {
  // console.log("getCountryList body --", body);
  dispatch(getCountryListLoading(true));
  try {
    const response = await Services.post(
      url.GET_COUNTRY_LIST + "?apiKey=apiKey",
      "",
      body,
      true
    );
    // console.log("getCountryList response --", response);
    if (response?.status == 200) {
      dispatch(getCountryListSuccess(false));
    } else {
      dispatch(getCountryListSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("getCountryList error --", error);
    dispatch(getCountryListError(false));
    return { message: error };
  }
};

export const getJobFilter = (body) => async (dispatch) => {
  console.log("getJobFilter body --", body);
  dispatch(getJobFilterLoading(true));
  try {
    const response = await Services.post(
      url.GET_JOB_FILTER + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getJobFilter response --", response);
    if (response?.status == 200) {
      dispatch(getJobFilterSuccess(false));
    } else {
      dispatch(getJobFilterSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("getJobFilter error --", error);
    dispatch(getJobFilterError(false));
    return { message: error };
  }
};

export const postJob = (body) => async (dispatch) => {
  dispatch(postJobLoading(true));
  try {
    const response = await Services.post(
      url.POST_JOB + "?apiKey=apiKey",
      "",
      body
    );
    console.log("postJob response --", response);
    dispatch(postJobSuccess(false));
    return response;
  } catch (error) {
    console.log("postJob error --", error);
    dispatch(postJobError(false));
    return { message: error };
  }
};

export const updatePostedJob = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(updatePostedJobLoading(true));
  try {
    const response = await Services.post(
      url.UPDATE_POSTED_JOB + "?apiKey=apiKey",
      token,
      body
    );
    console.log("updatePostedJob response --", response);
    dispatch(updatePostedJobSuccess(false));
    return response;
  } catch (error) {
    console.log("updatePostedJob error --", error);
    dispatch(updatePostedJobError(false));
    return { message: error };
  }
};
export const getJobsList = (body) => async (dispatch) => {
  dispatch(getJobsListLoading(true));
  try {
    const response = await Services.post(
      url.GET_JOBS_LIST + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getJobsList response --", response);
    dispatch(getJobsListSuccess(false));
    return response;
  } catch (error) {
    console.log("getJobsList error --", error);
    dispatch(getJobsListError(false));
    return { message: error };
  }
};
export const getAllLikesUsers = (body) => async (dispatch) => {
  dispatch(getSocialPostDetailsLoading(false));
  try {
    const response = await Services.post(
      url.GET_ALL_LIKES_USERS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    if (response?.status == 200) {
      dispatch(getSocialPostDetailsSuccess(false));
      return response;
    } else {
      dispatch(getSocialPostDetailsSuccess(false));
    }
  } catch (error) {
    console.log("getSocialPostDetails error--", error);
    dispatch(getSocialPostDetailsError(false));
    return { message: error };
  }
};

export const userFollowing = (body) => async (dispatch) => {
  dispatch(userFollowingLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.USER_FOLLOWING + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("userFollowing response --", response);
    if (response?.status == 200) {
      dispatch(userFollowingSuccess(false));
    } else {
      dispatch(userFollowingSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("userFollowing error --", error);
    dispatch(userFollowingError(false));
    return { message: error };
  }
};

export const getFollowDetails = (body) => async (dispatch) => {
  dispatch(getFollowDetailsLoading(true));
  try {
    const response = await Services.post(
      url.FOLLOW_DETAILS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getFollowDetails response --", response);
    if (response?.status == 200) {
      dispatch(getFollowDetailsSuccess(false));
    } else {
      dispatch(getFollowDetailsSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("getFollowDetails error --", error);
    dispatch(getFollowDetailsError(false));
    return { message: error };
  }
};

export const userReporting = (body) => async (dispatch) => {
  dispatch(userReportingLoading(true));
  try {
    const response = await Services.post(
      url.USER_REPORTING + "?apiKey=apiKey",
      "",
      body
    );
    console.log("userReporting response --", response);
    dispatch(userReportingSuccess(false));
    return response;
  } catch (error) {
    console.log("userReporting error --", error);
    dispatch(userReportingError(false));
    return { message: error };
  }
};
export const savePost = (body, url) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(savePostLoading(true));
  try {
    const response = await Services.post(url + "?apiKey=apiKey", token, body);
    console.log("savePost response --", response);
    dispatch(savePostSuccess(false));
    return response;
  } catch (error) {
    console.log("savePost error --", error);
    dispatch(savePostError(false));
    return { message: error };
  }
};

export const getSavedPost = (body) => async (dispatch) => {
  dispatch(getSavedPostLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url?.GET_SAVED_POST + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getSavedPost response --", response);
    dispatch(getSavedPostSuccess(false));
    return response;
  } catch (error) {
    console.log("getSavedPost error --", error);
    dispatch(getSavedPostError(false));
    return { message: error };
  }
};
export const deleteJob = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(deleteJobLoading(true));
  try {
    const response = await Services.post(
      url?.DELETE_JOB + "?apiKey=apiKey",
      token,
      body
    );
    console.log("deleteJob response --", response);
    dispatch(deleteJobSuccess(false));
    return response;
  } catch (error) {
    console.log("deleteJob error --", error);
    dispatch(deleteJobError(false));
    return { message: error };
  }
};

// Payment Gateway
export const getProductList = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getProductListLoading(true));
  try {
    const response = await Services.post(
      url.STRIPE_URL + "?apiKey=apiKey",
      token,
      body
    );
    console.log("getProductList response --", response);
    dispatch(getProductListSuccess(false));
    return response;
  } catch (error) {
    console.log("getProductList error --", error);
    dispatch(getProductListError(false));
    return { message: error };
  }
};

export const createSession = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(createSessionLoading(true));
  try {
    const response = await Services.post(
      url.STRIPE_URL + "?apiKey=apiKey",
      token,
      body,
      true,
      false
    );
    console.log("createSession response --", response);
    dispatch(createSessionSuccess(false));
    return response;
  } catch (error) {
    console.log("createSession error --", error);
    dispatch(createSessionError(false));
    return { message: error };
  }
};

export const productCheckout = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(productCheckoutLoading(true));
  try {
    const response = await Services.post(
      url.STRIPE_URL + "?apiKey=apiKey",
      token,
      body
    );
    console.log("productCheckout response --", response);
    dispatch(productCheckoutSuccess(false));
    return response;
  } catch (error) {
    console.log("productCheckout error --", error);
    dispatch(productCheckoutError(false));
    return { message: error };
  }
};

export const addStripeAccount = (body) => async (dispatch) => {
  dispatch(addStripeAccountLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.ADD_STRIPE_ACCOUNT + "?apiKey=apiKey",
      token,
      body,
      true,
      true
    );
    console.log("addStripeAccount response --", response);
    dispatch(addStripeAccountSuccess(false));
    return response;
  } catch (error) {
    console.log("addStripeAccount error --", error);
    dispatch(addStripeAccountError(false));
    return { message: error };
  }
};

export const getStripeBalance = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_STRIPE_BALANCE + "?apiKey=apiKey",
      token,
      body,
      true,
      true
    );
    console.log("getStripeBalance response --", response);
    return response;
  } catch (error) {
    console.log("getStripeBalance error --", error);
    return { message: error };
  }
};

export const handleWithdraw = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(handleWithdrawLoading(true));
  try {
    const response = await Services.post(
      url.HANDLE_WITHDRAW + "?apiKey=apiKey",
      token,
      body,
      true,
      true
    );
    console.log("handleWithdraw response --", response);
    dispatch(handleWithdrawSuccess(false));
    return response;
  } catch (error) {
    console.log("handleWithdraw error --", error);
    dispatch(handleWithdrawError(false));
    return { message: error };
  }
};

export const getPayoutsList = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getPayoutsListLoading(true));
  try {
    const response = await Services.post(
      url.GET_PAYOUTS_LIST + "?apiKey=apiKey",
      token,
      body,
      true,
      true
    );
    console.log("getPayoutsList response --", response);
    dispatch(getPayoutsListSuccess(false));
    return response;
  } catch (error) {
    console.log("getPayoutsList error --", error);
    dispatch(getPayoutsListError(false));
    return { message: error };
  }
};

export const getSuperTransactionHistory = (body) => async (dispatch) => {
  try {
    const response = await Services.post(
      url.GET_SUPER_TRANSACTION_HISTORY + "?apiKey=apiKey",
      "",
      body,
      true
    );
    return response;
  } catch (error) {
    console.log("getSuperTransactionHistory error --", error);
    return { message: error };
  }
};

export const addRemoveEventsApi = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.ADD_REMOVE_EVENTS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    if (response?.status == 200) {
      return response;
    }
  } catch (error) {
    console.log("addRemoveEventsApi error--", error);
    return { message: error };
  }
};

export const addEventToCalendar = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.ADD_EVENT_TO_CALENDAR + "?apiKey=apiKey",
      token,
      body,
      true
    );
    if (response?.status == 200) {
      return response;
    }
  } catch (error) {
    console.log("addEventToCalendar error--", error);
    return { message: error };
  }
};

export const getSearchResults = (body) => async (dispatch) => {
  dispatch(getSearchResultsLoading(true));
  try {
    const response = await Services.post(
      url.GET_SEARCH_RESULTS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    // console.log("getSearchResults response --", response);
    dispatch(getSearchResultsSuccess(false));
    return response;
  } catch (error) {
    console.log("getSearchResults error --", error);
    dispatch(getSearchResultsError(false));
    return { message: error };
  }
};

export const submitJobProposal = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(submitJobProposalLoading(true));
  try {
    const response = await Services.post(
      url.SUBMIT_PROPOSAL + "?apiKey=apiKey",
      token,
      body
    );
    console.log("submitJobProposal response --", response);
    dispatch(submitJobProposalSuccess(false));
    return response;
  } catch (error) {
    console.log("submitJobProposal error --", error);
    dispatch(submitJobProposalError(false));
    return { message: error };
  }
};

export const UpdateJobProposal = (body) => async (dispatch) => {
  dispatch(UpdateJobProposalLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.UPDATE_PROPOSAL + "?apiKey=apiKey",
      token,
      body
    );
    console.log("UpdateJobProposal response --", response);
    dispatch(UpdateJobProposalSuccess(false));
    return response;
  } catch (error) {
    console.log("UpdateJobProposal error --", error);
    dispatch(UpdateJobProposalError(false));
    return { message: error };
  }
};

export const getPostedListing = (body) => async (dispatch) => {
  dispatch(getPostedListingLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url?.GET_POSTED_LISTING + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getPostedListing response --", response);
    dispatch(getPostedListingSuccess(false));
    return response;
  } catch (error) {
    console.log("getPostedListing error --", error);
    dispatch(getPostedListingError(false));
    return { message: error };
  }
};

export const getProposalListing = (body) => async (dispatch) => {
  dispatch(getProposalListingLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_PROPOSAL_LIST + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getProposalListing response --", response);
    dispatch(getProposalListingSuccess(false));
    return response;
  } catch (error) {
    console.log("getProposalListing error --", error);
    dispatch(getProposalListingError(false));
    return { message: error };
  }
};

export const blockUser = (body) => async (dispatch) => {
  dispatch(blockUserLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.BLOCK_USER + "?apiKey=apiKey",
      token,
      body
    );
    console.log("blockUser response --", response);
    dispatch(blockUserSuccess(false));
    return response;
  } catch (error) {
    console.log("blockUser error --", error);
    dispatch(blockUserError(false));
    return { message: error };
  }
};

export const getRatingOptions = (body) => async (dispatch) => {
  dispatch(getRatingOptionsLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.get(
      url.GET_RATING_OPTIONS + "?apiKey=apiKey",
      token,
      true
    );
    console.log("getRatingOptions response --", response);
    dispatch(getRatingOptionsSuccess(false));
    return response;
  } catch (error) {
    console.log("getRatingOptions error --", error);
    dispatch(getRatingOptionsError(false));
    return { message: error };
  }
};

export const addAppRating = (body) => async (dispatch) => {
  dispatch(getRatingOptionsLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.APP_RATING + "?apiKey=apiKey",
      token,
      body,
      true
    );
    dispatch(getRatingOptionsSuccess(false));
    return response;
  } catch (error) {
    console.log("getRatingOptions error --", error);
    dispatch(getRatingOptionsError(false));
    return { message: error };
  }
};

export const completePay = (body) => async (dispatch) => {
  dispatch(completePayLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.COMPLETE_PAY + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("completePay response --", response);
    dispatch(completePaySuccess(false));
    return response;
  } catch (error) {
    console.log("completePay error --", error);
    dispatch(completePayError(false));
    return { message: error };
  }
};

export const getLatestProposals = (body) => async (dispatch) => {
  dispatch(getLatestProposalsLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_LATEST_PROPOSALS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getLatestProposals response --", response);
    dispatch(getLatestProposalsSuccess(false));
    return response;
  } catch (error) {
    console.log("getLatestProposals error --", error);
    dispatch(getLatestProposalsError(false));
    return { message: error };
  }
};

export const hireCheckout = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(hireCheckoutLoading(true));
  try {
    const response = await Services.post(
      url.HIRE_CHECKOUT + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("hireCheckout response --", response);
    dispatch(hireCheckoutSuccess(false));
    return response;
  } catch (error) {
    console.log("hireCheckout error --", error);
    dispatch(hireCheckoutError(false));
    return { message: error };
  }
};

export const getNotificationList = (body) => async (dispatch) => {
  dispatch(getNotificationListLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_NOTIFICATION_LIST + "?apiKey=apiKey",
      token,
      body,
      true
    ); 
    dispatch(getNotificationListSuccess(false));
    return response;
  } catch (error) {
    console.log("getNotificationList error --", error);
    dispatch(getNotificationListError(false));
    return { message: error };
  }
};

export const updateNotifyStatus = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(updateNotifyStatusLoading(true));
  try {
    const response = await Services.post(
      url.UPDATE_NOTIFY_STATUS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("updateNotifyStatus response --", response);
    dispatch(updateNotifyStatusSuccess(false));
    return response;
  } catch (error) {
    console.log("updateNotifyStatus error --", error);
    dispatch(updateNotifyStatusError(false));
    return { message: error };
  }
};

export const submitContactForm = (body) => async (dispatch) => {
  dispatch(submitContactFormLoading(true));
  try {
    const response = await Services.post(
      url.CONTACT_US + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("submitContactForm response --", response);
    dispatch(submitContactFormSuccess(false));
    return response;
  } catch (error) {
    console.log("submitContactForm error --", error);
    dispatch(submitContactFormError(false));
    return { message: error };
  }
};

export const getProposalStatus = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getProposalStatusLoading(true));
  try {
    const response = await Services.post(
      url.GET_PROPOSAL_STATUS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getProposalStatus response --", response);
    dispatch(getProposalStatusSuccess(false));
    return response;
  } catch (error) {
    console.log("getProposalStatus error --", error);
    dispatch(getProposalStatusError(false));
    return { message: error };
  }
};

export const getModelProjects = (body) => async (dispatch) => {
  dispatch(getModelProjectsLoading(true));
  try {
    const response = await Services.post(
      url?.GET_MODEL_PROJECTS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getModelProjects response --", response);
    dispatch(getModelProjectsSuccess(false));
    return response;
  } catch (error) {
    console.log("getModelProjects error --", error);
    dispatch(getModelProjectsError(false));
    return { message: error };
  }
};

export const getAccountSettingDetails = (body, hide) => async (dispatch) => {
  dispatch(getAccountSettingDetailsLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_ACCOUNT_SETTING_DETAILS + "?apiKey=apiKey",
      token,
      body,
      hide
    );
    console.log("getAccountSettingDetails response --", response);
    dispatch(getAccountSettingDetailsSuccess(false));
    return response;
  } catch (error) {
    console.log("getAccountSettingDetails error --", error);
    dispatch(getAccountSettingDetailsError(false));
    return { message: error };
  }
};

export const deleteUser = (body) => async (dispatch) => {
  dispatch(deleteUserLoading(true));
  try {
    const response = await Services.post(
      url.DELETE_USER + "?apiKey=apiKey",
      "",
      body
    );
    console.log("deleteUser response --", response);
    dispatch(deleteUserSuccess(false));
    return response;
  } catch (error) {
    console.log("deleteUser error --", error);
    dispatch(deleteUserError(false));
    return { message: error };
  }
};

export const getAllTalentsList = (body) => async (dispatch) => {
  dispatch(getAllTalentsListLoading(true));
  var headers = {
    "Content-Type": "application/json",
  };
  const completeUrl =
    url.LIVE_URL + url.GET_ALL_TALENTS_LIST + "?apiKey=apiKey";
  try {
    const res = await fetch(completeUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
    const response = await res.json();
    console.log("getAllTalentsList response --", response);
    dispatch(getAllTalentsListSuccess(false));
    return response;
  } catch (error) {
    if (error) {
      console.log("getAllTalentsList error --", error);
      dispatch(getAllTalentsListError(false));
      return { message: error };
    }
  }
  // try {
  //   const response = await Services.post(
  //     url.GET_ALL_TALENTS_LIST + "?apiKey=apiKey",
  //     "",
  //     body
  //   );
  //   console.log("getAllTalentsList response --", response);
  //   dispatch(getAllTalentsListSuccess(false));
  //   return response;
  // } catch (error) {
  // console.log("getAllTalentsList error --", error);
  // dispatch(getAllTalentsListError(false));
  // return { message: error };
  // }
};

export const uploadPortfolio = (body) => async (dispatch) => {
  console.log("uploadPortfolio body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(uploadPortfolioLoading(true));
  try {
    const response = await Services.formDataPost(
      url.UPLOAD_PORTFOLIO + "?apiKey=apiKey",
      token,
      body
    );
    console.log("uploadPortfolio response--", response);
    if (response.status == 200) {
      dispatch(uploadPortfolioSuccess(false));
    } else {
      dispatch(uploadPortfolioSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("uploadPortfolio error--", error);
    dispatch(uploadPortfolioError(false));
    return { message: error };
  }
};
export const uploadVideo = (body) => async (dispatch) => {
  console.log("uploadVideo body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(uploadVideoLoading(true));
  try {
    const response = await Services.formDataPost(
      url.UPLOAD_VIDEO + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("uploadVideo response--", response);
    if (response.status == 200) {
      dispatch(uploadVideoSuccess(false));
      return response;
    } else {
      dispatch(uploadVideoSuccess(false));
    }
  } catch (error) {
    console.log("uploadVideo error--", error);
    dispatch(uploadVideoError(false));
    return { message: error };
  }
};
export const getReelList = (body) => async (dispatch) => {
  console.log("getReelList body--", body);
  dispatch(getReelListLoading(true));
  try {
    const response = await Services.formDataPost(
      url.GET_REEL_LIST + "?apiKey=apiKey",
      "",
      body,
      true,
      false
    );
    console.log("getReelList response--", response);
    if (response.status == 200) {
      dispatch(getReelListSuccess(false));
      return response;
    } else {
      dispatch(getReelListSuccess(false));
    }
  } catch (error) {
    console.log("getReelList error--", error);
    dispatch(getReelListError(false));
    return { message: error };
  }
};
export const updatePortfolio = (body) => async (dispatch) => {
  console.log("updatePortfolio body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(updatePortfolioLoading(true));
  try {
    const response = await Services.formDataPost(
      url.UPDATE_PORTFOLIO + "?apiKey=apiKey",
      token,
      body
    );
    console.log("updatePortfolio response--", response);
    if (response.status == 200) {
      dispatch(updatePortfolioSuccess(false));
      return response;
    } else {
      dispatch(updatePortfolioSuccess(false));
    }
  } catch (error) {
    console.log("updatePortfolio error--", error);
    dispatch(updatePortfolioError(false));
    return { message: error };
  }
};
export const uploadSocialPost1 = (body) => async (dispatch) => {
  console.log("uploadSocialPost body--", body);
  dispatch(uploadSocialPostLoading(true));
  try {
    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: url?.BASE_URL + url.UPLOAD_SOCIAL_POST + "?apiKey=apiKey",
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "application/json",
      },
      data: body,
      onUploadProgress: (progressEvent) => {
        const { loaded, total } = progressEvent;
        let percent = Math.round((loaded * 100) / total);
        console.log(`${loaded}kb of ${total}kb | ${percent}%`);
      },
    };
    const res = await axios
      .request(config)
      .then((response) => {
        console.log("uploadSocialPost response--", response);
        if (response.status == 200) {
          dispatch(uploadSocialPostSuccess(false));
        } else {
          dispatch(uploadSocialPostSuccess(false));
        }
        return response;
      })
      .catch((error) => {
        console.log(error);
      });
  } catch (error) {
    console.log("uploadSocialPost error--", error);
    dispatch(uploadSocialPostError(false));
    return { message: error };
  }
};
export const uploadSocialPost = (body) => async (dispatch) => {
  let token = await getData(storageKey?.AUTH_TOKEN);
  console.log("uploadSocialPost body--", body);
  dispatch(uploadSocialPostLoading(true));
  try {
    const response = await Services.formDataPost(
      url.UPLOAD_SOCIAL_POST + "?apiKey=apiKey",
      token,
      body
    );
    console.log("uploadSocialPost response--", response);
    if (response.status == 200) {
      dispatch(uploadSocialPostSuccess(false));
    } else {
      dispatch(uploadSocialPostSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("uploadSocialPost error--", error);
    dispatch(uploadSocialPostError(false));
    return { message: error };
  }
};
export const updateSocialPost = (body) => async (dispatch) => {
  console.log("updateSocialPost body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);

  dispatch(updateSocialPostLoading(true));
  try {
    const response = await Services.formDataPost(
      url.UPDATE_SOCIAL_POST + "?apiKey=apiKey",
      token,
      body
    );
    console.log("updateSocialPost response--", response);
    if (response.status == 200) {
      dispatch(updateSocialPostSuccess(false));
    } else {
      dispatch(updateSocialPostSuccess(false));
    }
    return response;
  } catch (error) {
    console.log("updateSocialPost error--", error);
    dispatch(updateSocialPostError(false));
    return { message: error };
  }
};

export const getUserPortfolio = (body) => async (dispatch) => {
  console.log("getUserPortfolio body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getUserPortfolioLoading(false));
  try {
    const response = await Services.post(
      url.GET_USER_PORTPOLIO + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getUserPortfolio response--", response);
    if (response.status == 200) {
      dispatch(getUserPortfolioSuccess(false));
      return response;
    } else {
      dispatch(getUserPortfolioSuccess(false));
    }
  } catch (error) {
    console.log("getUserPortfolio error--", error);
    dispatch(getUserPortfolioError(false));
    return { message: error };
  }
};

export const getUserSocialPosts = (body) => async (dispatch) => {
  console.log("getUserSocialPosts body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getUserSocialPostsLoading(false));
  try {
    const response = await Services.post(
      url.GET_USER_SOCIAL_POSTS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getUserSocialPosts response--", response);
    if (response.status == 200) {
      dispatch(getUserSocialPostsSuccess(false));
      return response;
    } else {
      dispatch(getUserSocialPostsSuccess(false));
    }
  } catch (error) {
    console.log("getUserSocialPosts error--", error);
    dispatch(getUserSocialPostsError(false));
    return { message: error };
  }
};

export const getPortfolioDetails = (body) => async (dispatch) => {
  console.log("getPortfolioDetails body--", body);
  dispatch(getPortfolioDetailsLoading(false));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_PORTPOLIO_DETAILS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getPortfolioDetails response--", response?.results[0]);
    if (response.status == 200) {
      dispatch(getPortfolioDetailsSuccess(false));
      return response;
    } else {
      dispatch(getPortfolioDetailsSuccess(false));
    }
  } catch (error) {
    console.log("getPortfolioDetails error--", error);
    dispatch(getPortfolioDetailsError(false));
    return { message: error };
  }
};

export const getConnects = (body) => async (dispatch) => {
  console.log("getConnects body--", body);
  dispatch(getConnectsLoading(false));
  try {
    const response = await Services.post(
      url.GET_CONNECTS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getConnects response--", response);
    if (response.status == 200) {
      dispatch(getConnectsSuccess(false));
      return response;
    } else {
      dispatch(getConnectsSuccess(false));
    }
  } catch (error) {
    console.log("getConnects error--", error);
    dispatch(getConnectsError(false));
    return { message: error };
  }
};

export const getSocialPostDetails = (body) => async (dispatch) => {
  console.log("getSocialPostDetails body--", body);
  dispatch(getSocialPostDetailsLoading(false));
  try {
    const response = await Services.post(
      url.GET_SOCIAL_POST_DETAILS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getSocialPostDetails response--", response);
    if (response.status == 200) {
      dispatch(getSocialPostDetailsSuccess(false));
      return response;
    } else {
      dispatch(getSocialPostDetailsSuccess(false));
    }
  } catch (error) {
    console.log("getSocialPostDetails error--", error);
    dispatch(getSocialPostDetailsError(false));
    return { message: error };
  }
};

export const getPortfolios = (body) => async (dispatch) => {
  dispatch(getPortfoliosLoading(false));
  try {
    const response = await Services.post(
      url.GET_PORTFOLIOS + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("getPortfolios response--", response);
    if (response.status == 200) {
      dispatch(getPortfoliosSuccess(false));
      return response;
    } else {
      dispatch(getPortfoliosSuccess(false));
    }
  } catch (error) {
    console.log("getPortfolios error--", error);
    dispatch(getPortfoliosError(false));
    return { message: error };
  }
};
export const getSocialPosts = (body) => async (dispatch) => {
  dispatch(getSocialPostsLoading(false));
  try {
    const response = await Services.post(
      url.GET_SOCIAL_POSTS + "?apiKey=apiKey",
      "",
      body,
      true,
      false
    );
    // console.log("getSocialPosts response--", response);
    if (response.status == 200) {
      dispatch(getSocialPostsSuccess(false));
      return response;
    } else {
      dispatch(getSocialPostsSuccess(false));
    }
  } catch (error) {
    console.log("getSocialPosts error--", error);
    dispatch(getSocialPostsError(false));
    return { message: error };
  }
};
export const deletePost = (body) => async (dispatch) => {
  dispatch(deletePostLoading(false));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.DELETE_POST + "?apiKey=apiKey",
      token,
      body
    );
    console.log("deletePost response--", response);
    if (response.status == 200) {
      dispatch(deletePostSuccess(false));
      return response;
    } else {
      dispatch(deletePostSuccess(false));
    }
  } catch (error) {
    console.log("deletePost error--", error);
    dispatch(deletePostError(false));
    return { message: error };
  }
};
export const addComment = (body) => async (dispatch) => {
  console.log("addComment body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(addCommentLoading(false));
  try {
    const response = await Services.post(
      url.ADD_COMMENT + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("addComment response--", response);
    if (response.status == 200) {
      dispatch(addCommentSuccess(false));
      return response;
    } else {
      dispatch(addCommentSuccess(false));
    }
  } catch (error) {
    console.log("addComment error--", error);
    dispatch(addCommentError(false));
    return { message: error };
  }
};

export const likeDislike = (body) => async (dispatch) => {
  console.log("likeDislike body--", body);
  dispatch(likeDislikeLoading(false));
  try {
    const response = await Services.post(
      url.LIKE_DISLIKE + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("likeDislike response--", response);
    if (response.status == 200) {
      dispatch(likeDislikeSuccess(false));
      return response;
    } else {
      dispatch(likeDislikeSuccess(false));
    }
  } catch (error) {
    console.log("likeDislike error--", error);
    dispatch(likeDislikeError(false));
    return { message: error };
  }
};

// export const sendNotification = async (recieverToken, messageContent) => {
//   const message = {
//     to: recieverToken,
//     notification: {
//       title: `New message from ${messageContent?.user?.displayName}`,
//       body: messageContent?.title,
//       icon: Images?.appLogo,
//       sound: "default",
//     },
//     data: {
//       message: messageContent?.title,
//       story_id: messageContent?._id,
//       senderId: messageContent?.user?.displayName,
//       type: "chat",
//     },
//   };
//   //AIzaSyCEubgqpiBKLWQaBYuDtGo1E1KyL1H5AuY
//   try {
//     const response = await axios.post(
//       "https://fcm.googleapis.com/fcm/send",
//       // `https://fcm.googleapis.com/v1/projects/booksculp-47a10/${message}:send`,
//       message,
//       {
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${FIREBASE_SERVER_KEY}`,
//         },
//       }
//     );
//     console.log("Notification sent successfully!", response.data);
//   } catch (error) {
//     console.error("Error sending notification:", error.response.data);
//   }
// };

export const sendNotification = async (recieverToken, messageContent) => {
  // const client = await auth.getClient();
  // const accessToken = await client.getAccessToken();
  // console.log("clientclient-----", client);
  // console.log("accessTokenaccessToken-----", accessToken);
  // const message = {
  //   to: recieverToken,
  //   notification: {
  //     title: `New message from ${messageContent?.user?.displayName}`,
  //     body: messageContent?.title,
  //     icon: Images?.appLogo,
  //     sound: "default",
  //   },
  //   data: {
  //     message: messageContent?.title,
  //     story_id: messageContent?._id,
  //     senderId: messageContent?.user?.displayName,
  //     type: "chat",
  //   },
  // };
  // try {
  //   const response = await axios.post(
  //     "https://fcm.googleapis.com/fcm/send",
  //     // `https://fcm.googleapis.com/v1/projects/booksculp-47a10/${message}:send`,
  //     message,
  //     {
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${FIREBASE_SERVER_KEY}`,
  //       },
  //     }
  //   );
  //   console.log("Notification sent successfully!", response.data);
  // } catch (error) {
  //   console.error("Error sending notification:", error.response.data);
  // }
};

export const getChatList = (body) => async (dispatch) => {
  console.log("getChatList body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getChatListLoading(true));
  try {
    const response = await Services.post(
      url.GET_CHAT_LIST + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getChatList response--", response);
    if (response.status == 200) {
      dispatch(getChatListSuccess(false));
      return response;
    } else {
      dispatch(getChatListSuccess(false));
    }
  } catch (error) {
    console.log("getChatList error--", error);
    dispatch(getChatListError(false));
    return { message: error };
  }
};

export const getUserChat = (body) => async (dispatch) => {
  console.log("getUserChat body--", body);
  dispatch(getUserChatLoading(true));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_USER_CHAT + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getUserChat response--", response);
    if (response.status == 200) {
      dispatch(getUserChatSuccess(false));
      return response;
    } else {
      dispatch(getUserChatSuccess(false));
    }
  } catch (error) {
    console.log("getUserChat error--", error);
    dispatch(getUserChatError(false));
    return { message: error };
  }
};
export const handleNotification = (body) => async (dispatch) => {
  console.log("handleNotification body--", body);
  // dispatch(handleNotificationLoading(true));
  try {
    const response = await Services.post(
      url.HANDLE_NOTIFICATION + "?apiKey=apiKey",
      "",
      body,
      true
    );
    console.log("handleNotification response--", response);
    if (response.status == 200) {
      // dispatch(handleNotificationSuccess(false));
      return response;
    } else {
      // dispatch(handleNotificationSuccess(false));
    }
  } catch (error) {
    console.log("handleNotification error--", error);
    // dispatch(handleNotificationError(false));
    return { message: error };
  }
};

export const sendMessage = (body) => async (dispatch) => {
  // console.log("sendMessage body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(sendMessageLoading(false));
  try {
    const response = await Services.formDataPost(
      url.SEND_MESSAGE + "?apiKey=apiKey",
      token,
      body,
      true
    );
    // console.log("sendMessage response--", response);
    if (response.status == 200) {
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

export const getTypingStatus = (body) => async (dispatch) => {
  console.log("getTypingStatus body--", body);
  dispatch(getTypingStatusLoading(false));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url.GET_TYPING_STATUS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getTypingStatus response--", response);
    if (response.status == 200) {
      dispatch(getTypingStatusSuccess(false));
      return response;
    } else {
      dispatch(getTypingStatusSuccess(false));
    }
  } catch (error) {
    console.log("getTypingStatus error--", error);
    dispatch(getTypingStatusError(false));
    return { message: error };
  }
};

export const getNotificationBadge = (body, url) => async (dispatch) => {
  // console.log("getNotificationBadge body--", body);
  dispatch(getNotificationBadgeLoading(false));
  let token = await getData(storageKey?.AUTH_TOKEN);
  try {
    const response = await Services.post(
      url + "?apiKey=apiKey",
      token,
      body,
      true
    );
    // console.log("getNotificationBadge response--", response);
    if (response.status == 200) {
      dispatch(getNotificationBadgeSuccess(false));
      return response;
    } else {
      dispatch(getNotificationBadgeSuccess(false));
    }
  } catch (error) {
    console.log("getNotificationBadge error--", error);
    dispatch(getNotificationBadgeError(false));
    return { message: error };
  }
};

export const getReadStatus = (body) => async (dispatch) => {
  console.log("getReadStatus body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(getReadStatusLoading(false));
  try {
    const response = await Services.post(
      url.GET_READ_STATUS + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("getReadStatus response--", response);
    if (response.status == 200) {
      dispatch(getReadStatusSuccess(false));
      return response;
    } else {
      dispatch(getReadStatusSuccess(false));
    }
  } catch (error) {
    console.log("getReadStatus error--", error);
    dispatch(getReadStatusError(false));
    return { message: error };
  }
};

export const clearUserChat = (body) => async (dispatch) => {
  console.log("clearUserChat body--", body);
  let token = await getData(storageKey?.AUTH_TOKEN);
  dispatch(clearUserChatLoading(false));
  try {
    const response = await Services.post(
      url.CLEAR_USER_CHAT + "?apiKey=apiKey",
      token,
      body,
      true
    );
    console.log("clearUserChat response--", response);
    if (response.status == 200) {
      dispatch(clearUserChatSuccess(false));
      return response;
    } else {
      dispatch(clearUserChatSuccess(false));
    }
  } catch (error) {
    console.log("clearUserChat error--", error);
    dispatch(clearUserChatError(false));
    return { message: error };
  }
};
export const getAllClientsList = (body) => async (dispatch) => {
  dispatch(getAllClientsListListLoading(true));
  var headers = {
    "Content-Type": "application/json",
  };
  const completeUrl =
    url.LIVE_URL + url.GET_ALL_CLIENTS_LIST + "?apiKey=apiKey";
  try {
    const res = await fetch(completeUrl, {
      method: "GET",
      headers,
    });
    const response = await res.json();
    console.log("getAllClientsList response --", response);
    dispatch(getAllClientsListListSuccess(false));
    return response;
  } catch (error) {
    if (error) {
      console.log("getAllClientsList error --", error);
      dispatch(getAllClientsListListError(false));
      return { message: error };
    }
  }
};
export const getTrimmedVideo = (body) => async (dispatch) => {
  dispatch(getTrimmedVideoLoading(true));
  var headers = {
    "Content-Type": "application/json",
  };
  // const completeUrl = "https://app.kaksha.co/api/posts";
  const completeUrl = "https://app.booksculp.com/api/posts";
  try {
    const res = await fetch(completeUrl, {
      method: "POST",
      headers,
      body: JSON?.stringify(body),
    });
    const response = await res.json();
    console.log("res response --", response);
    console.log("getTrimmedVideo response --", response);
    dispatch(getTrimmedVideoSuccess(false));
    return response;
  } catch (error) {
    if (error) {
      console.log("getTrimmedVideo error --", error);
      dispatch(getTrimmedVideoError(false));
      return { message: error };
    }
  }
};

// export const getOldChat = (roomID, pageSize) => async (dispatch) => {
//   console.log("getOldChat roomID--", roomID, pageSize);
//   dispatch(getOldChatLoading(true));
//   const token = await getData(storageKey.AUTH_TOKEN);
//   try {
//     const response = await Services.get(
//       url.GET_OLD_CHAT + "?chat_relation_id=" + roomID + "&page=" + pageSize,
//       token,
//       true
//     );
//     console.log("getOldChat response--", response);
//     dispatch(getOldChatSuccess(false));
//     return response;
//   } catch (error) {
//     console.log("getOldChat error--", error);
//     dispatch(getOldChatError(false));
//     return { message: error };
//   }
// };

// export const saveMessage = (body) => async (dispatch) => {
//   console.log("saveMessage body--", body);
//   dispatch(saveMessageLoading(true));
//   const token = await getData(storageKey.AUTH_TOKEN);
//   try {
//     const response = await Services.formDataPost(url.SAVE_MESSAGE, token, body);
//     console.log("saveMessage response --", response);
//     dispatch(saveMessageSuccess(false));
//     return response;
//   } catch (error) {
//     console.log("saveMessage error --", error);
//     dispatch(saveMessageError(false));
//     return { message: error };
//   }
// };
// export const getOnlineInfo = (body) => async (dispatch) => {
//   console.log("getOnlineInfo body--", body);
//   dispatch(getOnlineInfoLoading(true));
//   const token = await getData(storageKey.AUTH_TOKEN);
//   try {
//     const response = await Services.formDataPost(url.IS_ONLINE, token, body);
//     console.log("getOnlineInfo response --", response);
//     dispatch(getOnlineInfoSuccess(false));
//     return response;
//   } catch (error) {
//     console.log("getOnlineInfo error --", error);
//     dispatch(getOnlineInfoError(false));
//     return { message: error };
//   }
// };

// export const getDocuments = (roomID) => async (dispatch) => {
//   console.log("getDocuments roomID--", roomID);
//   dispatch(getDocumentsLoading(true));
//   const token = await getData(storageKey.AUTH_TOKEN);
//   try {
//     const response = await Services.get(url.GET_DOCUMENTS, token, true);
//     console.log("getDocuments response--", response);
//     dispatch(getDocumentsSuccess(false));
//     return response;
//   } catch (error) {
//     console.log("getDocuments error--", error);
//     dispatch(getDocumentsError(false));
//     return { message: error };
//   }
// };
