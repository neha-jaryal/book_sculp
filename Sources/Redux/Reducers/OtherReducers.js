import {
  APPLIED_FILTER,
  GET_MODELS_LIST_LOADING,
  GET_MODELS_LIST_SUCCESS,
  GET_MODELS_LIST_ERROR,
  GET_KIDS_LIST_LOADING,
  GET_KIDS_LIST_SUCCESS,
  GET_KIDS_LIST_ERROR,
  GET_PHOTOGRAPHER_LIST_LOADING,
  GET_PHOTOGRAPHER_LIST_SUCCESS,
  GET_PHOTOGRAPHER_LIST_ERROR,
  GET_JOB_DETAILS_LOADING,
  GET_JOB_DETAILS_SUCCESS,
  GET_JOB_DETAILS_ERROR,
  REPOST_JOB_LOADING,
  REPOST_JOB_SUCCESS,
  REPOST_JOB_ERROR,
  GET_LANGUAGES_LIST_LOADING,
  GET_LANGUAGES_LIST_SUCCESS,
  GET_LANGUAGES_LIST_ERROR,
  GET_COUNTRY_LIST_LOADING,
  GET_COUNTRY_LIST_SUCCESS,
  GET_COUNTRY_LIST_ERROR,
  GET_JOB_FILTER_LOADING,
  GET_JOB_FILTER_SUCCESS,
  GET_JOB_FILTER_ERROR,
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
  GET_FOLLOW_DETAILS_LOADING,
  GET_FOLLOW_DETAILS_SUCCESS,
  GET_FOLLOW_DETAILS_ERROR,
  USER_REPORTING_LOADING,
  USER_REPORTING_SUCCESS,
  USER_REPORTING_ERROR,
  GET_SEARCH_RESULTS_LOADING,
  GET_SEARCH_RESULTS_SUCCESS,
  GET_SEARCH_RESULTS_ERROR,
  GET_POSTED_LISTING_LOADING,
  GET_POSTED_LISTING_SUCCESS,
  GET_POSTED_LISTING_ERROR,
  GET_PROPOSAL_LIST_LOADING,
  GET_PROPOSAL_LIST_SUCCESS,
  GET_PROPOSAL_LIST_ERROR,
  SUBMIT_POST_PROPOSAL_LOADING,
  SUBMIT_POST_PROPOSAL_SUCCESS,
  SUBMIT_POST_PROPOSAL_ERROR,
  UPDATE_POST_PROPOSAL_LOADING,
  UPDATE_POST_PROPOSAL_SUCCESS,
  UPDATE_POST_PROPOSAL_ERROR,
  GET_LATEST_PROPOSALS_LOADING,
  GET_LATEST_PROPOSALS_SUCCESS,
  GET_LATEST_PROPOSALS_ERROR,
  GET_MODEL_PROJECTS_LOADING,
  GET_MODEL_PROJECTS_SUCCESS,
  GET_MODEL_PROJECTS_ERROR,
  GET_ALL_TALENTS_LIST_LOADING,
  GET_ALL_TALENTS_LIST_SUCCESS,
  GET_ALL_TALENTS_LIST_ERROR,
  GET_ALL_CLIENTS_LIST_LOADING,
  GET_ALL_CLIENTS_LIST_SUCCESS,
  GET_ALL_CLIENTS_LIST_ERROR,
  GET_ACCOUNT_SETTING_DETAILS_LOADING,
  GET_ACCOUNT_SETTING_DETAILS_SUCCESS,
  GET_ACCOUNT_SETTING_DETAILS_ERROR,
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
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  UPLOAD_PORTFOLIO_LOADING,
  UPLOAD_PORTFOLIO_SUCCESS,
  UPLOAD_PORTFOLIO_ERROR,
  UPLOAD_VIDEO_LOADING,
  UPLOAD_VIDEO_SUCCESS,
  UPLOAD_VIDEO_ERROR,
  GET_REEL_LIST_LOADING,
  GET_REEL_LIST_SUCCESS,
  GET_REEL_LIST_ERROR,
  UPLOAD_SOCIAL_POST_LOADING,
  UPLOAD_SOCIAL_POST_SUCCESS,
  UPLOAD_SOCIAL_POST_ERROR,
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
  DELETE_JOB_LOADING,
  DELETE_JOB_SUCCESS,
  DELETE_JOB_ERROR,
  GET_SAVED_POST_LOADING,
  GET_SAVED_POST_SUCCESS,
  GET_SAVED_POST_ERROR,
  GET_CONNECTS_LOADING,
  GET_CONNECTS_SUCCESS,
  GET_CONNECTS_ERROR,
  COMPLETE_PAY_LOADING,
  COMPLETE_PAY_SUCCESS,
  COMPLETE_PAY_ERROR,
  JOB_RATING_LOADING,
  JOB_RATING_SUCCESS,
  JOB_RATING_ERROR,
  GET_PAYOUTS_LIST_LOADING,
  GET_PAYOUTS_LIST_SUCCESS,
  GET_PAYOUTS_LIST_ERROR,
   GET_RATING_OPTIONS_LOADING,
   GET_RATING_OPTIONS_SUCCESS,
   GET_RATING_OPTIONS_ERROR,

  // // pagination
  // FETCH_MORE_LIST_REQUEST,
  // FETCH_MORE_LIST_SUCCESS,
  // FETCH_MORE_LIST_ERROR,

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
  ADD_STRIPE_ACCOUNT_LOADING,
  ADD_STRIPE_ACCOUNT_SUCCESS,
  ADD_STRIPE_ACCOUNT_ERROR,
} from "../Consts/OtherConsts";

const initialState = {
  isLoading: false,
  filterData: {},
  moreLoading: false,
  error: null,
  moreError: null,
  isListEnd: false,
  listData: [],
};

export const otherReducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_MODELS_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_MODELS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_MODELS_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_KIDS_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_KIDS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_KIDS_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_PHOTOGRAPHER_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PHOTOGRAPHER_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PHOTOGRAPHER_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_JOB_DETAILS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_JOB_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_JOB_DETAILS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case REPOST_JOB_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case REPOST_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case REPOST_JOB_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_LANGUAGES_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_LANGUAGES_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_LANGUAGES_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_COUNTRY_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_COUNTRY_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_COUNTRY_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_JOB_FILTER_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_JOB_FILTER_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_JOB_FILTER_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case POST_JOB_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case POST_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case POST_JOB_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPDATE_POSTED_JOB_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_POSTED_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_POSTED_JOB_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_JOBS_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_JOBS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_JOBS_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case USER_FOLLOWING_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_FOLLOWING_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_FOLLOWING_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_FOLLOW_DETAILS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_FOLLOW_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_FOLLOW_DETAILS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case USER_REPORTING_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_REPORTING_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case USER_REPORTING_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case APPLIED_FILTER:
      return {
        ...state,
        filterData: action?.filterData,
      };

    // pagination
    // case FETCH_MORE_LIST_REQUEST:
    //   if (action.payload.page === 1) {
    //     return { ...state, isLoading: true };
    //   } else {
    //     return { ...state, moreLoading: true };
    //   }
    // case FETCH_MORE_LIST_SUCCESS:
    //   return {
    //     ...state,
    //     data: [...state.data, ...action.data.articles],
    //     error: "",
    //     isLoading: false,
    //     moreLoading: false,
    //   };
    // case FETCH_MORE_LIST_ERROR:
    //   return {
    //     error: action.error,
    //     isLoading: false,
    //     moreLoading: false,
    //   };
    // case FETCHING_LIST_END:
    //   return {
    //     ...state,
    //     isLoading: false,
    //     isListEnd: true,
    //     moreLoading: false,
    //   };

    case UPLOAD_PORTFOLIO_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_PORTFOLIO_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_PORTFOLIO_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_VIDEO_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_VIDEO_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_VIDEO_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_REEL_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_REEL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_REEL_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPLOAD_SOCIAL_POST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_SOCIAL_POST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPLOAD_SOCIAL_POST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPDATE_PORTFOLIO_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_PORTFOLIO_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_PORTFOLIO_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPDATE_SOCIAL_POST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_SOCIAL_POST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_SOCIAL_POST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_USER_PORTFOLIO_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_PORTFOLIO_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_PORTFOLIO_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_USER_SOCIAL_POSTS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_SOCIAL_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_SOCIAL_POSTS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_PORTFOLIO_DETAILS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PORTFOLIO_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PORTFOLIO_DETAILS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_SOCIAL_POST_DETAILS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SOCIAL_POST_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SOCIAL_POST_DETAILS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case ADD_COMMENT_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case ADD_COMMENT_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case ADD_COMMENT_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case LIKE_DISLIKE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case LIKE_DISLIKE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case LIKE_DISLIKE_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_CHAT_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_CHAT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_CHAT_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_USER_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_USER_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case SEND_MESSAGE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SEND_MESSAGE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SEND_MESSAGE_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case CLEAR_USER_CHAT_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case CLEAR_USER_CHAT_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case CLEAR_USER_CHAT_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_TYPING_STATUS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_TYPING_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_TYPING_STATUS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_NOTIFICATION_BADGE_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_NOTIFICATION_BADGE_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_NOTIFICATION_BADGE_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_READ_STATUS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_READ_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_READ_STATUS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_PORTFOLIOS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PORTFOLIOS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PORTFOLIOS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_SOCIAL_POSTS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SOCIAL_POSTS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SOCIAL_POSTS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case DELETE_POST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_POST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_POST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_TRIMMED_VIDEO_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_TRIMMED_VIDEO_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_TRIMMED_VIDEO_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    // Payment Gateway
    case GET_PRODUCT_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PRODUCT_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PRODUCT_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case CREATE_SESSION_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case CREATE_SESSION_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case CREATE_SESSION_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case PRODUCT_CHECKOUT_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case PRODUCT_CHECKOUT_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case PRODUCT_CHECKOUT_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case ADD_STRIPE_ACCOUNT_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case ADD_STRIPE_ACCOUNT_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case ADD_STRIPE_ACCOUNT_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_SEARCH_RESULTS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SEARCH_RESULTS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SEARCH_RESULTS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_POSTED_LISTING_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_POSTED_LISTING_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_POSTED_LISTING_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PROPOSAL_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PROPOSAL_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PROPOSAL_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SUBMIT_POST_PROPOSAL_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SUBMIT_POST_PROPOSAL_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SUBMIT_POST_PROPOSAL_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_POST_PROPOSAL_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_POST_PROPOSAL_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_POST_PROPOSAL_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_LATEST_PROPOSALS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_LATEST_PROPOSALS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_LATEST_PROPOSALS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_MODEL_PROJECTS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_MODEL_PROJECTS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_MODEL_PROJECTS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ALL_TALENTS_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ALL_TALENTS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ALL_TALENTS_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ALL_CLIENTS_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ALL_CLIENTS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ALL_CLIENTS_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_USER_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_USER_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_USER_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_ACCOUNT_SETTING_DETAILS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ACCOUNT_SETTING_DETAILS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_ACCOUNT_SETTING_DETAILS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_NOTIFICATION_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_NOTIFICATION_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_NOTIFICATION_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case UPDATE_NOTIFY_STATUS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_NOTIFY_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case UPDATE_NOTIFY_STATUS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case SUMBMIT_CONTACT_FORM_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SUMBMIT_CONTACT_FORM_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case SUMBMIT_CONTACT_FORM_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_PROPOSAL_STATUS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PROPOSAL_STATUS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PROPOSAL_STATUS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_SAVED_POST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SAVED_POST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_SAVED_POST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case DELETE_JOB_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_JOB_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case DELETE_JOB_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_CONNECTS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_CONNECTS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_CONNECTS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case COMPLETE_PAY_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case COMPLETE_PAY_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case COMPLETE_PAY_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case JOB_RATING_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case JOB_RATING_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case JOB_RATING_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case GET_PAYOUTS_LIST_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PAYOUTS_LIST_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case GET_PAYOUTS_LIST_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    case  GET_RATING_OPTIONS_LOADING:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case  GET_RATING_OPTIONS_SUCCESS:
      return {
        ...state,
        isLoading: action.isLoading,
      };
    case  GET_RATING_OPTIONS_ERROR:
      return {
        ...state,
        isLoading: action.isLoading,
      };

    default:
      return state;
  }
};
