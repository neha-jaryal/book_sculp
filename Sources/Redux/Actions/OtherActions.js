import {
  APPLIED_FILTER,
  GET_MODELS_LIST_ERROR,
  GET_MODELS_LIST_LOADING,
  GET_MODELS_LIST_SUCCESS,
  GET_KIDS_LIST_ERROR,
  GET_KIDS_LIST_LOADING,
  GET_KIDS_LIST_SUCCESS,
  GET_PHOTOGRAPHER_LIST_ERROR,
  GET_PHOTOGRAPHER_LIST_LOADING,
  GET_PHOTOGRAPHER_LIST_SUCCESS,
  GET_JOB_DETAILS_ERROR,
  GET_JOB_DETAILS_LOADING,
  GET_JOB_DETAILS_SUCCESS,
  REPOST_JOB_ERROR,
  REPOST_JOB_LOADING,
  REPOST_JOB_SUCCESS,
  GET_LANGUAGES_LIST_ERROR,
  GET_LANGUAGES_LIST_LOADING,
  GET_LANGUAGES_LIST_SUCCESS,
  GET_COUNTRY_LIST_ERROR,
  GET_COUNTRY_LIST_LOADING,
  GET_COUNTRY_LIST_SUCCESS,
  GET_JOB_FILTER_ERROR,
  GET_JOB_FILTER_LOADING,
  GET_JOB_FILTER_SUCCESS,
  POST_JOB_LOADING,
  POST_JOB_SUCCESS,
  POST_JOB_ERROR,
  UPDATE_POSTED_JOB_LOADING,
  UPDATE_POSTED_JOB_SUCCESS,
  UPDATE_POSTED_JOB_ERROR,
  GET_JOBS_LIST_LOADING,
  GET_JOBS_LIST_SUCCESS,
  GET_JOBS_LIST_ERROR,
  USER_FOLLOWING_LOADING,
  USER_FOLLOWING_SUCCESS,
  USER_FOLLOWING_ERROR,
  GET_FOLLOW_LIST_LOADING,
  GET_FOLLOW_LIST_SUCCESS,
  GET_FOLLOW_LIST_ERROR,
  USER_REPORTING_LOADING,
  USER_REPORTING_SUCCESS,
  USER_REPORTING_ERROR,
  GET_SEARCH_RESULTS_LOADING,
  GET_SEARCH_RESULTS_SUCCESS,
  GET_SEARCH_RESULTS_ERROR,
  SUBMIT_POST_PROPOSAL_LOADING,
  SUBMIT_POST_PROPOSAL_SUCCESS,
  SUBMIT_POST_PROPOSAL_ERROR,
  UPDATE_POST_PROPOSAL_LOADING,
  UPDATE_POST_PROPOSAL_SUCCESS,
  UPDATE_POST_PROPOSAL_ERROR,
  GET_POSTED_LISTING_LOADING,
  GET_POSTED_LISTING_SUCCESS,
  GET_POSTED_LISTING_ERROR,
  GET_PROPOSAL_LIST_LOADING,
  GET_PROPOSAL_LIST_SUCCESS,
  GET_PROPOSAL_LIST_ERROR,
  GET_LATEST_PROPOSALS_LOADING,
  GET_LATEST_PROPOSALS_SUCCESS,
  GET_LATEST_PROPOSALS_ERROR,
  HIRE_CHECKOUT_LOADING,
  HIRE_CHECKOUT_SUCCESS,
  HIRE_CHECKOUT_ERROR,
  GET_NOTIFICATION_LIST_LOADING,
  GET_NOTIFICATION_LIST_SUCCESS,
  GET_NOTIFICATION_LIST_ERROR,
  UPDATE_NOTIFY_STATUS_LOADING,
  UPDATE_NOTIFY_STATUS_SUCCESS,
  UPDATE_NOTIFY_STATUS_ERROR,
  SUMBMIT_CONTACT_FORM_LOADING,
  SUMBMIT_CONTACT_FORM_SUCCESS,
  SUMBMIT_CONTACT_FORM_ERROR,
  GET_PROPOSAL_STATUS_LOADING,
  GET_PROPOSAL_STATUS_SUCCESS,
  GET_PROPOSAL_STATUS_ERROR,
  GET_MODEL_PROJECTS_LOADING,
  GET_MODEL_PROJECTS_SUCCESS,
  GET_MODEL_PROJECTS_ERROR,
  GET_ACCOUNT_SETTING_DETAILS_LOADING,
  GET_ACCOUNT_SETTING_DETAILS_SUCCESS,
  GET_ACCOUNT_SETTING_DETAILS_ERROR,
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  GET_ALL_TALENTS_LIST_LOADING,
  GET_ALL_TALENTS_LIST_SUCCESS,
  GET_ALL_TALENTS_LIST_ERROR,
  GET_ALL_CLIENTS_LIST_LOADING,
  GET_ALL_CLIENTS_LIST_SUCCESS,
  GET_ALL_CLIENTS_LIST_ERROR,
  UPLOAD_PORTFOLIO_LOADING,
  UPLOAD_PORTFOLIO_SUCCESS,
  UPLOAD_PORTFOLIO_ERROR,
  UPLOAD_SOCIAL_POST_LOADING,
  UPLOAD_SOCIAL_POST_SUCCESS,
  UPLOAD_SOCIAL_POST_ERROR,
  UPLOAD_VIDEO_LOADING,
  UPLOAD_VIDEO_SUCCESS,
  UPLOAD_VIDEO_ERROR,
  GET_REEL_LIST_LOADING,
  GET_REEL_LIST_SUCCESS,
  GET_REEL_LIST_ERROR,
  UPDATE_PORTFOLIO_LOADING,
  UPDATE_PORTFOLIO_SUCCESS,
  UPDATE_PORTFOLIO_ERROR,
  UPDATE_SOCIAL_POST_LOADING,
  UPDATE_SOCIAL_POST_SUCCESS,
  UPDATE_SOCIAL_POST_ERROR,
  GET_USER_PORTFOLIO_LOADING,
  GET_USER_PORTFOLIO_SUCCESS,
  GET_USER_PORTFOLIO_ERROR,
  GET_USER_SOCIAL_POSTS_LOADING,
  GET_USER_SOCIAL_POSTS_SUCCESS,
  GET_USER_SOCIAL_POSTS_ERROR,
  GET_PORTFOLIO_DETAILS_LOADING,
  GET_PORTFOLIO_DETAILS_SUCCESS,
  GET_PORTFOLIO_DETAILS_ERROR,
  GET_SOCIAL_POST_DETAILS_LOADING,
  GET_SOCIAL_POST_DETAILS_SUCCESS,
  GET_SOCIAL_POST_DETAILS_ERROR,
  ADD_COMMENT_LOADING,
  ADD_COMMENT_SUCCESS,
  ADD_COMMENT_ERROR,
  LIKE_DISLIKE_LOADING,
  LIKE_DISLIKE_SUCCESS,
  LIKE_DISLIKE_ERROR,
  GET_CHAT_LIST_LOADING,
  GET_CHAT_LIST_SUCCESS,
  GET_CHAT_LIST_ERROR,
  GET_USER_LIST_LOADING,
  GET_USER_LIST_SUCCESS,
  GET_USER_LIST_ERROR,
  SEND_MESSAGE_LOADING,
  SEND_MESSAGE_SUCCESS,
  SEND_MESSAGE_ERROR,
  CLEAR_USER_CHAT_LOADING,
  CLEAR_USER_CHAT_SUCCESS,
  CLEAR_USER_CHAT_ERROR,
  GET_TYPING_STATUS_LOADING,
  GET_TYPING_STATUS_SUCCESS,
  GET_TYPING_STATUS_ERROR,
  GET_NOTIFICATION_BADGE_LOADING,
  GET_NOTIFICATION_BADGE_SUCCESS,
  GET_NOTIFICATION_BADGE_ERROR,
  GET_READ_STATUS_LOADING,
  GET_READ_STATUS_SUCCESS,
  GET_READ_STATUS_ERROR,
  GET_PORTFOLIOS_LOADING,
  GET_PORTFOLIOS_SUCCESS,
  GET_PORTFOLIOS_ERROR,
  GET_SOCIAL_POSTS_LOADING,
  GET_SOCIAL_POSTS_SUCCESS,
  GET_SOCIAL_POSTS_ERROR,
  DELETE_POST_LOADING,
  DELETE_POST_SUCCESS,
  DELETE_POST_ERROR,
  GET_TRIMMED_VIDEO_LOADING,
  GET_TRIMMED_VIDEO_SUCCESS,
  GET_TRIMMED_VIDEO_ERROR,
  SAVE_POST_LOADING,
  SAVE_POST_SUCCESS,
  SAVE_POST_ERROR,
  GET_SAVED_POST_LOADING,
  GET_SAVED_POST_SUCCESS,
  GET_SAVED_POST_ERROR,
  DELETE_JOB_LOADING,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_ERROR,
  GET_CONNECTS_LOADING,
  GET_CONNECTS_SUCCESS,
  GET_CONNECTS_ERROR,
  COMPLETE_PAY_LOADING,
  COMPLETE_PAY_SUCCESS,
  COMPLETE_PAY_ERROR,
  JOB_RATING_LOADING,
  JOB_RATING_SUCCESS,
  JOB_RATING_ERROR,
  GET_RATING_OPTIONS_LOADING,
  GET_RATING_OPTIONS_SUCCESS,
  GET_RATING_OPTIONS_ERROR,

  // Payment Gateway
  GET_PRODUCT_LIST_LOADING,
  GET_PRODUCT_LIST_SUCCESS,
  GET_PRODUCT_LIST_ERROR,
  CREATE_SESSION_LOADING,
  CREATE_SESSION_SUCCESS,
  CREATE_SESSION_ERROR,
  PRODUCT_CHECKOUT_LOADING,
  PRODUCT_CHECKOUT_SUCCESS,
  PRODUCT_CHECKOUT_ERROR,
  HANDLE_WITHDRAW_LOADING,
  HANDLE_WITHDRAW_SUCCESS,
  HANDLE_WITHDRAW_ERROR,
  GET_PAYOUTS_LIST_LOADING,
  GET_PAYOUTS_LIST_SUCCESS,
  GET_PAYOUTS_LIST_ERROR,
} from "../Consts/OtherConsts";
export const getModelsListLoading = (isLoading) => ({
  type: GET_MODELS_LIST_LOADING,
  isLoading: isLoading,
});
export const getModelsListSuccess = (isLoading) => ({
  type: GET_MODELS_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getModelsListError = (isLoading) => ({
  type: GET_MODELS_LIST_ERROR,
  isLoading: isLoading,
});

export const getKidsListLoading = (isLoading) => ({
  type: GET_KIDS_LIST_LOADING,
  isLoading: isLoading,
});
export const getKidsListSuccess = (isLoading) => ({
  type: GET_KIDS_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getKidsListError = (isLoading) => ({
  type: GET_KIDS_LIST_ERROR,
  isLoading: isLoading,
});

export const getPhotographerListLoading = (isLoading) => ({
  type: GET_PHOTOGRAPHER_LIST_LOADING,
  isLoading: isLoading,
});
export const getPhotographerListSuccess = (isLoading) => ({
  type: GET_PHOTOGRAPHER_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getPhotographerListError = (isLoading) => ({
  type: GET_PHOTOGRAPHER_LIST_ERROR,
  isLoading: isLoading,
});

export const getJobDetailsLoading = (isLoading) => ({
  type: GET_JOB_DETAILS_LOADING,
  isLoading: isLoading,
});
export const getJobDetailsSuccess = (isLoading) => ({
  type: GET_JOB_DETAILS_SUCCESS,
  isLoading: isLoading,
});
export const getJobDetailsError = (isLoading) => ({
  type: GET_JOB_DETAILS_ERROR,
  isLoading: isLoading,
});

export const repostJobLoading = (isLoading) => ({
  type: REPOST_JOB_LOADING,
  isLoading: isLoading,
});
export const repostJobSuccess = (isLoading) => ({
  type: REPOST_JOB_SUCCESS,
  isLoading: isLoading,
});
export const repostJobError = (isLoading) => ({
  type: REPOST_JOB_ERROR,
  isLoading: isLoading,
});

export const getLanguagesListLoading = (isLoading) => ({
  type: GET_LANGUAGES_LIST_LOADING,
  isLoading: isLoading,
});
export const getLanguagesListSuccess = (isLoading) => ({
  type: GET_LANGUAGES_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getLanguagesListError = (isLoading) => ({
  type: GET_LANGUAGES_LIST_ERROR,
  isLoading: isLoading,
});

export const getCountryListLoading = (isLoading) => ({
  type: GET_COUNTRY_LIST_LOADING,
  isLoading: isLoading,
});
export const getCountryListSuccess = (isLoading) => ({
  type: GET_COUNTRY_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getCountryListError = (isLoading) => ({
  type: GET_COUNTRY_LIST_ERROR,
  isLoading: isLoading,
});

export const getJobFilterLoading = (isLoading) => ({
  type: GET_JOB_FILTER_LOADING,
  isLoading: isLoading,
});
export const getJobFilterSuccess = (isLoading) => ({
  type: GET_JOB_FILTER_SUCCESS,
  isLoading: isLoading,
});
export const getJobFilterError = (isLoading) => ({
  type: GET_JOB_FILTER_ERROR,
  isLoading: isLoading,
});

export const postJobLoading = (isLoading) => ({
  type: POST_JOB_LOADING,
  isLoading: isLoading,
});
export const postJobSuccess = (isLoading) => ({
  type: POST_JOB_SUCCESS,
  isLoading: isLoading,
});
export const postJobError = (isLoading) => ({
  type: POST_JOB_ERROR,
  isLoading: isLoading,
});

export const updatePostedJobLoading = (isLoading) => ({
  type: UPDATE_POSTED_JOB_LOADING,
  isLoading: isLoading,
});
export const updatePostedJobSuccess = (isLoading) => ({
  type: UPDATE_POSTED_JOB_SUCCESS,
  isLoading: isLoading,
});
export const updatePostedJobError = (isLoading) => ({
  type: UPDATE_POSTED_JOB_ERROR,
  isLoading: isLoading,
});

export const getJobsListLoading = (isLoading) => ({
  type: GET_JOBS_LIST_LOADING,
  isLoading: isLoading,
});
export const getJobsListSuccess = (isLoading) => ({
  type: GET_JOBS_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getJobsListError = (isLoading) => ({
  type: GET_JOBS_LIST_ERROR,
  isLoading: isLoading,
});

export const userFollowingLoading = (isLoading) => ({
  type: USER_FOLLOWING_LOADING,
  isLoading: isLoading,
});
export const userFollowingSuccess = (isLoading) => ({
  type: USER_FOLLOWING_SUCCESS,
  isLoading: isLoading,
});
export const userFollowingError = (isLoading) => ({
  type: USER_FOLLOWING_ERROR,
  isLoading: isLoading,
});

export const savePostLoading = (isLoading) => ({
  type: SAVE_POST_LOADING,
  isLoading: isLoading,
});
export const savePostSuccess = (isLoading) => ({
  type: SAVE_POST_SUCCESS,
  isLoading: isLoading,
});
export const savePostError = (isLoading) => ({
  type: SAVE_POST_ERROR,
  isLoading: isLoading,
});

export const getSavedPostLoading = (isLoading) => ({
  type: GET_SAVED_POST_LOADING,
  isLoading: isLoading,
});
export const getSavedPostSuccess = (isLoading) => ({
  type: GET_SAVED_POST_SUCCESS,
  isLoading: isLoading,
});
export const getSavedPostError = (isLoading) => ({
  type: GET_SAVED_POST_ERROR,
  isLoading: isLoading,
});
export const deleteJobLoading = (isLoading) => ({
  type: DELETE_JOB_LOADING,
  isLoading: isLoading,
});
export const deleteJobSuccess = (isLoading) => ({
  type: DELETE_JOB_SUCCESS,
  isLoading: isLoading,
});
export const deleteJobError = (isLoading) => ({
  type: DELETE_JOB_ERROR,
  isLoading: isLoading,
});
export const getConnectsLoading = (isLoading) => ({
  type: GET_CONNECTS_LOADING,
  isLoading: isLoading,
});
export const getConnectsSuccess = (isLoading) => ({
  type: GET_CONNECTS_SUCCESS,
  isLoading: isLoading,
});
export const getConnectsError = (isLoading) => ({
  type: GET_CONNECTS_ERROR,
  isLoading: isLoading,
});

export const getFollowDetailsLoading = (isLoading) => ({
  type: GET_FOLLOW_LIST_LOADING,
  isLoading: isLoading,
});
export const getFollowDetailsSuccess = (isLoading) => ({
  type: GET_FOLLOW_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getFollowDetailsError = (isLoading) => ({
  type: GET_FOLLOW_LIST_ERROR,
  isLoading: isLoading,
});

export const userReportingLoading = (isLoading) => ({
  type: USER_REPORTING_LOADING,
  isLoading: isLoading,
});
export const userReportingSuccess = (isLoading) => ({
  type: USER_REPORTING_SUCCESS,
  isLoading: isLoading,
});
export const userReportingError = (isLoading) => ({
  type: USER_REPORTING_ERROR,
  isLoading: isLoading,
});

export const getProposalListingLoading = (isLoading) => ({
  type: GET_PROPOSAL_LIST_LOADING,
  isLoading: isLoading,
});
export const getProposalListingSuccess = (isLoading) => ({
  type: GET_PROPOSAL_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getProposalListingError = (isLoading) => ({
  type: GET_PROPOSAL_LIST_ERROR,
  isLoading: isLoading,
});

export const getLatestProposalsLoading = (isLoading) => ({
  type: GET_LATEST_PROPOSALS_LOADING,
  isLoading: isLoading,
});
export const getLatestProposalsSuccess = (isLoading) => ({
  type: GET_LATEST_PROPOSALS_SUCCESS,
  isLoading: isLoading,
});
export const getLatestProposalsError = (isLoading) => ({
  type: GET_LATEST_PROPOSALS_ERROR,
  isLoading: isLoading,
});

export const hireCheckoutLoading = (isLoading) => ({
  type: HIRE_CHECKOUT_LOADING,
  isLoading: isLoading,
});
export const hireCheckoutSuccess = (isLoading) => ({
  type: HIRE_CHECKOUT_SUCCESS,
  isLoading: isLoading,
});
export const hireCheckoutError = (isLoading) => ({
  type: HIRE_CHECKOUT_ERROR,
  isLoading: isLoading,
});

export const getNotificationListLoading = (isLoading) => ({
  type: GET_NOTIFICATION_LIST_LOADING,
  isLoading: isLoading,
});
export const getNotificationListSuccess = (isLoading) => ({
  type: GET_NOTIFICATION_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getNotificationListError = (isLoading) => ({
  type: GET_NOTIFICATION_LIST_ERROR,
  isLoading: isLoading,
});

export const updateNotifyStatusLoading = (isLoading) => ({
  type: UPDATE_NOTIFY_STATUS_LOADING,
  isLoading: isLoading,
});
export const updateNotifyStatusSuccess = (isLoading) => ({
  type: UPDATE_NOTIFY_STATUS_SUCCESS,
  isLoading: isLoading,
});
export const updateNotifyStatusError = (isLoading) => ({
  type: UPDATE_NOTIFY_STATUS_ERROR,
  isLoading: isLoading,
});

export const submitContactFormLoading = (isLoading) => ({
  type: SUMBMIT_CONTACT_FORM_LOADING,
  isLoading: isLoading,
});
export const submitContactFormSuccess = (isLoading) => ({
  type: SUMBMIT_CONTACT_FORM_SUCCESS,
  isLoading: isLoading,
});
export const submitContactFormError = (isLoading) => ({
  type: SUMBMIT_CONTACT_FORM_ERROR,
  isLoading: isLoading,
});

export const getProposalStatusLoading = (isLoading) => ({
  type: GET_PROPOSAL_STATUS_LOADING,
  isLoading: isLoading,
});
export const getProposalStatusSuccess = (isLoading) => ({
  type: GET_PROPOSAL_STATUS_SUCCESS,
  isLoading: isLoading,
});
export const getProposalStatusError = (isLoading) => ({
  type: GET_PROPOSAL_STATUS_ERROR,
  isLoading: isLoading,
});

export const getModelProjectsLoading = (isLoading) => ({
  type: GET_MODEL_PROJECTS_LOADING,
  isLoading: isLoading,
});
export const getModelProjectsSuccess = (isLoading) => ({
  type: GET_MODEL_PROJECTS_SUCCESS,
  isLoading: isLoading,
});
export const getModelProjectsError = (isLoading) => ({
  type: GET_MODEL_PROJECTS_ERROR,
  isLoading: isLoading,
});

export const getAccountSettingDetailsLoading = (isLoading) => ({
  type: GET_ACCOUNT_SETTING_DETAILS_LOADING,
  isLoading: isLoading,
});
export const getAccountSettingDetailsSuccess = (isLoading) => ({
  type: GET_ACCOUNT_SETTING_DETAILS_SUCCESS,
  isLoading: isLoading,
});
export const getAccountSettingDetailsError = (isLoading) => ({
  type: GET_ACCOUNT_SETTING_DETAILS_ERROR,
  isLoading: isLoading,
});

export const deleteUserLoading = (isLoading) => ({
  type: DELETE_USER_LOADING,
  isLoading: isLoading,
});
export const deleteUserSuccess = (isLoading) => ({
  type: DELETE_USER_SUCCESS,
  isLoading: isLoading,
});
export const deleteUserError = (isLoading) => ({
  type: DELETE_USER_ERROR,
  isLoading: isLoading,
});

export const getAllTalentsListLoading = (isLoading) => ({
  type: GET_ALL_TALENTS_LIST_LOADING,
  isLoading: isLoading,
});
export const getAllTalentsListSuccess = (isLoading) => ({
  type: GET_ALL_TALENTS_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getAllTalentsListError = (isLoading) => ({
  type: GET_ALL_TALENTS_LIST_ERROR,
  isLoading: isLoading,
});

export const getAllClientsListListLoading = (isLoading) => ({
  type: GET_ALL_CLIENTS_LIST_LOADING,
  isLoading: isLoading,
});
export const getAllClientsListListSuccess = (isLoading) => ({
  type: GET_ALL_CLIENTS_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getAllClientsListListError = (isLoading) => ({
  type: GET_ALL_CLIENTS_LIST_ERROR,
  isLoading: isLoading,
});

export const appliedFilter = (filterData) => ({
  type: APPLIED_FILTER,
  filterData: filterData,
});

export const uploadPortfolioLoading = (isLoading) => ({
  type: UPLOAD_PORTFOLIO_LOADING,
  isLoading: isLoading,
});
export const uploadPortfolioSuccess = (isLoading, data) => ({
  type: UPLOAD_PORTFOLIO_SUCCESS,
  isLoading: isLoading,
});
export const uploadPortfolioError = (isLoading) => ({
  type: UPLOAD_PORTFOLIO_ERROR,
  isLoading: isLoading,
});

export const uploadSocialPostLoading = (isLoading) => ({
  type: UPLOAD_SOCIAL_POST_LOADING,
  isLoading: isLoading,
});
export const uploadSocialPostSuccess = (isLoading, data) => ({
  type: UPLOAD_SOCIAL_POST_SUCCESS,
  isLoading: isLoading,
});
export const uploadSocialPostError = (isLoading) => ({
  type: UPLOAD_SOCIAL_POST_ERROR,
  isLoading: isLoading,
});

export const updatePortfolioLoading = (isLoading) => ({
  type: UPDATE_PORTFOLIO_LOADING,
  isLoading: isLoading,
});
export const updatePortfolioSuccess = (isLoading, data) => ({
  type: UPDATE_PORTFOLIO_SUCCESS,
  isLoading: isLoading,
});
export const updatePortfolioError = (isLoading) => ({
  type: UPDATE_PORTFOLIO_ERROR,
  isLoading: isLoading,
});

export const uploadVideoLoading = (isLoading) => ({
  type: UPLOAD_VIDEO_LOADING,
  isLoading: isLoading,
});
export const uploadVideoSuccess = (isLoading, data) => ({
  type: UPLOAD_VIDEO_SUCCESS,
  isLoading: isLoading,
});
export const uploadVideoError = (isLoading) => ({
  type: UPLOAD_VIDEO_ERROR,
  isLoading: isLoading,
});

export const getReelListLoading = (isLoading) => ({
  type: GET_REEL_LIST_LOADING,
  isLoading: isLoading,
});
export const getReelListSuccess = (isLoading, data) => ({
  type: GET_REEL_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getReelListError = (isLoading) => ({
  type: GET_REEL_LIST_ERROR,
  isLoading: isLoading,
});

export const updateSocialPostLoading = (isLoading) => ({
  type: UPDATE_SOCIAL_POST_LOADING,
  isLoading: isLoading,
});
export const updateSocialPostSuccess = (isLoading, data) => ({
  type: UPDATE_SOCIAL_POST_SUCCESS,
  isLoading: isLoading,
});
export const updateSocialPostError = (isLoading) => ({
  type: UPDATE_SOCIAL_POST_ERROR,
  isLoading: isLoading,
});

export const getUserPortfolioLoading = (isLoading) => ({
  type: GET_USER_PORTFOLIO_LOADING,
  isLoading: isLoading,
});
export const getUserPortfolioSuccess = (isLoading) => ({
  type: GET_USER_PORTFOLIO_SUCCESS,
  isLoading: isLoading,
});
export const getUserPortfolioError = (isLoading) => ({
  type: GET_USER_PORTFOLIO_ERROR,
  isLoading: isLoading,
});

export const getUserSocialPostsLoading = (isLoading) => ({
  type: GET_USER_SOCIAL_POSTS_LOADING,
  isLoading: isLoading,
});
export const getUserSocialPostsSuccess = (isLoading) => ({
  type: GET_USER_SOCIAL_POSTS_SUCCESS,
  isLoading: isLoading,
});
export const getUserSocialPostsError = (isLoading) => ({
  type: GET_USER_SOCIAL_POSTS_ERROR,
  isLoading: isLoading,
});

export const getPortfolioDetailsLoading = (isLoading) => ({
  type: GET_PORTFOLIO_DETAILS_LOADING,
  isLoading: isLoading,
});
export const getPortfolioDetailsSuccess = (isLoading) => ({
  type: GET_PORTFOLIO_DETAILS_SUCCESS,
  isLoading: isLoading,
});
export const getPortfolioDetailsError = (isLoading) => ({
  type: GET_PORTFOLIO_DETAILS_ERROR,
  isLoading: isLoading,
});

export const getSocialPostDetailsLoading = (isLoading) => ({
  type: GET_SOCIAL_POST_DETAILS_LOADING,
  isLoading: isLoading,
});
export const getSocialPostDetailsSuccess = (isLoading) => ({
  type: GET_SOCIAL_POST_DETAILS_SUCCESS,
  isLoading: isLoading,
});
export const getSocialPostDetailsError = (isLoading) => ({
  type: GET_SOCIAL_POST_DETAILS_ERROR,
  isLoading: isLoading,
});

export const addCommentLoading = (isLoading) => ({
  type: ADD_COMMENT_LOADING,
  isLoading: isLoading,
});
export const addCommentSuccess = (isLoading) => ({
  type: ADD_COMMENT_SUCCESS,
  isLoading: isLoading,
});
export const addCommentError = (isLoading) => ({
  type: ADD_COMMENT_ERROR,
  isLoading: isLoading,
});

export const likeDislikeLoading = (isLoading) => ({
  type: LIKE_DISLIKE_LOADING,
  isLoading: isLoading,
});
export const likeDislikeSuccess = (isLoading) => ({
  type: LIKE_DISLIKE_SUCCESS,
  isLoading: isLoading,
});
export const likeDislikeError = (isLoading) => ({
  type: LIKE_DISLIKE_ERROR,
  isLoading: isLoading,
});

export const getChatListLoading = (isLoading) => ({
  type: GET_CHAT_LIST_LOADING,
  isLoading: isLoading,
});
export const getChatListSuccess = (isLoading) => ({
  type: GET_CHAT_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getChatListError = (isLoading) => ({
  type: GET_CHAT_LIST_ERROR,
  isLoading: isLoading,
});

export const getUserChatLoading = (isLoading) => ({
  type: GET_USER_LIST_LOADING,
  isLoading: isLoading,
});
export const getUserChatSuccess = (isLoading) => ({
  type: GET_USER_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getUserChatError = (isLoading) => ({
  type: GET_USER_LIST_ERROR,
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

export const clearUserChatLoading = (isLoading) => ({
  type: CLEAR_USER_CHAT_LOADING,
  isLoading: isLoading,
});
export const clearUserChatSuccess = (isLoading) => ({
  type: CLEAR_USER_CHAT_SUCCESS,
  isLoading: isLoading,
});
export const clearUserChatError = (isLoading) => ({
  type: CLEAR_USER_CHAT_ERROR,
  isLoading: isLoading,
});

export const getTypingStatusLoading = (isLoading) => ({
  type: GET_TYPING_STATUS_LOADING,
  isLoading: isLoading,
});
export const getTypingStatusSuccess = (isLoading) => ({
  type: GET_TYPING_STATUS_SUCCESS,
  isLoading: isLoading,
});
export const getTypingStatusError = (isLoading) => ({
  type: GET_TYPING_STATUS_ERROR,
  isLoading: isLoading,
});

export const getNotificationBadgeLoading = (isLoading) => ({
  type: GET_NOTIFICATION_BADGE_LOADING,
  isLoading: isLoading,
});
export const getNotificationBadgeSuccess = (isLoading) => ({
  type: GET_NOTIFICATION_BADGE_SUCCESS,
  isLoading: isLoading,
});
export const getNotificationBadgeError = (isLoading) => ({
  type: GET_NOTIFICATION_BADGE_ERROR,
  isLoading: isLoading,
});

export const getReadStatusLoading = (isLoading) => ({
  type: GET_READ_STATUS_LOADING,
  isLoading: isLoading,
});
export const getReadStatusSuccess = (isLoading) => ({
  type: GET_READ_STATUS_SUCCESS,
  isLoading: isLoading,
});
export const getReadStatusError = (isLoading) => ({
  type: GET_READ_STATUS_ERROR,
  isLoading: isLoading,
});

export const getPortfoliosLoading = (isLoading) => ({
  type: GET_PORTFOLIOS_LOADING,
  isLoading: isLoading,
});
export const getPortfoliosSuccess = (isLoading, data) => ({
  type: GET_PORTFOLIOS_SUCCESS,
  isLoading: isLoading,
});
export const getPortfoliosError = (isLoading) => ({
  type: GET_PORTFOLIOS_ERROR,
  isLoading: isLoading,
});

export const getSocialPostsLoading = (isLoading) => ({
  type: GET_SOCIAL_POSTS_LOADING,
  isLoading: isLoading,
});
export const getSocialPostsSuccess = (isLoading, data) => ({
  type: GET_SOCIAL_POSTS_SUCCESS,
  isLoading: isLoading,
});
export const getSocialPostsError = (isLoading) => ({
  type: GET_SOCIAL_POSTS_ERROR,
  isLoading: isLoading,
});

export const deletePostLoading = (isLoading) => ({
  type: DELETE_POST_LOADING,
  isLoading: isLoading,
});
export const deletePostSuccess = (isLoading, data) => ({
  type: DELETE_POST_SUCCESS,
  isLoading: isLoading,
});
export const deletePostError = (isLoading) => ({
  type: DELETE_POST_ERROR,
  isLoading: isLoading,
});

export const getTrimmedVideoLoading = (isLoading) => ({
  type: GET_TRIMMED_VIDEO_LOADING,
  isLoading: isLoading,
});
export const getTrimmedVideoSuccess = (isLoading, data) => ({
  type: GET_TRIMMED_VIDEO_SUCCESS,
  isLoading: isLoading,
});
export const getTrimmedVideoError = (isLoading) => ({
  type: GET_TRIMMED_VIDEO_ERROR,
  isLoading: isLoading,
});

// Payment Gateway
export const getProductListLoading = (isLoading) => ({
  type: GET_PRODUCT_LIST_LOADING,
  isLoading: isLoading,
});
export const getProductListSuccess = (isLoading) => ({
  type: GET_PRODUCT_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getProductListError = (isLoading) => ({
  type: GET_PRODUCT_LIST_ERROR,
  isLoading: isLoading,
});
export const createSessionLoading = (isLoading) => ({
  type: CREATE_SESSION_LOADING,
  isLoading: isLoading,
});
export const createSessionSuccess = (isLoading) => ({
  type: CREATE_SESSION_SUCCESS,
  isLoading: isLoading,
});
export const createSessionError = (isLoading) => ({
  type: CREATE_SESSION_ERROR,
  isLoading: isLoading,
});
export const productCheckoutLoading = (isLoading) => ({
  type: PRODUCT_CHECKOUT_LOADING,
  isLoading: isLoading,
});
export const productCheckoutSuccess = (isLoading) => ({
  type: PRODUCT_CHECKOUT_SUCCESS,
  isLoading: isLoading,
});
export const productCheckoutError = (isLoading) => ({
  type: PRODUCT_CHECKOUT_ERROR,
  isLoading: isLoading,
});
export const addStripeAccountLoading = (isLoading) => ({
  type: PRODUCT_CHECKOUT_LOADING,
  isLoading: isLoading,
});
export const addStripeAccountSuccess = (isLoading) => ({
  type: PRODUCT_CHECKOUT_SUCCESS,
  isLoading: isLoading,
});
export const addStripeAccountError = (isLoading) => ({
  type: PRODUCT_CHECKOUT_ERROR,
  isLoading: isLoading,
});
export const handleWithdrawLoading = (isLoading) => ({
  type: HANDLE_WITHDRAW_LOADING,
  isLoading: isLoading,
});
export const handleWithdrawSuccess = (isLoading) => ({
  type: HANDLE_WITHDRAW_SUCCESS,
  isLoading: isLoading,
});
export const handleWithdrawError = (isLoading) => ({
  type: HANDLE_WITHDRAW_ERROR,
  isLoading: isLoading,
});
export const getPayoutsListLoading = (isLoading) => ({
  type: GET_PAYOUTS_LIST_LOADING,
  isLoading: isLoading,
});
export const getPayoutsListSuccess = (isLoading) => ({
  type: GET_PAYOUTS_LIST_SUCCESS,
  isLoading: isLoading,
});
export const getPayoutsListError = (isLoading) => ({
  type: GET_PAYOUTS_LIST_ERROR,
  isLoading: isLoading,
});
export const getSearchResultsLoading = (isLoading) => ({
  type: GET_SEARCH_RESULTS_LOADING,
  isLoading: isLoading,
});
export const getSearchResultsSuccess = (isLoading) => ({
  type: GET_SEARCH_RESULTS_SUCCESS,
  isLoading: isLoading,
});
export const getSearchResultsError = (isLoading) => ({
  type: GET_SEARCH_RESULTS_ERROR,
  isLoading: isLoading,
});
export const submitJobProposalLoading = (isLoading) => ({
  type: SUBMIT_POST_PROPOSAL_LOADING,
  isLoading: isLoading,
});
export const submitJobProposalSuccess = (isLoading) => ({
  type: SUBMIT_POST_PROPOSAL_SUCCESS,
  isLoading: isLoading,
});
export const submitJobProposalError = (isLoading) => ({
  type: SUBMIT_POST_PROPOSAL_ERROR,
  isLoading: isLoading,
});
export const UpdateJobProposalLoading = (isLoading) => ({
  type: UPDATE_POST_PROPOSAL_LOADING,
  isLoading: isLoading,
});
export const UpdateJobProposalSuccess = (isLoading) => ({
  type: UPDATE_POST_PROPOSAL_SUCCESS,
  isLoading: isLoading,
});
export const UpdateJobProposalError = (isLoading) => ({
  type: UPDATE_POST_PROPOSAL_ERROR,
  isLoading: isLoading,
});
export const getPostedListingLoading = (isLoading) => ({
  type: GET_POSTED_LISTING_LOADING,
  isLoading: isLoading,
});
export const getPostedListingSuccess = (isLoading) => ({
  type: GET_POSTED_LISTING_SUCCESS,
  isLoading: isLoading,
});
export const getPostedListingError = (isLoading) => ({
  type: GET_POSTED_LISTING_ERROR,
  isLoading: isLoading,
});
export const completePayLoading = (isLoading) => ({
  type: COMPLETE_PAY_LOADING,
  isLoading: isLoading,
});
export const completePaySuccess = (isLoading) => ({
  type: COMPLETE_PAY_SUCCESS,
  isLoading: isLoading,
});
export const completePayError = (isLoading) => ({
  type: COMPLETE_PAY_ERROR,
  isLoading: isLoading,
});
export const blockUserLoading = (isLoading) => ({
  type: JOB_RATING_LOADING,
  isLoading: isLoading,
});
export const blockUserSuccess = (isLoading) => ({
  type: JOB_RATING_SUCCESS,
  isLoading: isLoading,
});
export const blockUserError = (isLoading) => ({
  type: JOB_RATING_ERROR,
  isLoading: isLoading,
});
export const getRatingOptionsLoading = (isLoading) => ({
  type: GET_RATING_OPTIONS_LOADING,
  isLoading: isLoading,
});
export const getRatingOptionsSuccess = (isLoading) => ({
  type: GET_RATING_OPTIONS_SUCCESS,
  isLoading: isLoading,
});
export const getRatingOptionsError = (isLoading) => ({
  type: GET_RATING_OPTIONS_ERROR,
  isLoading: isLoading,
});
