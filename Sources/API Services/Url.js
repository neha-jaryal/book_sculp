// Base URLs
export const BASE_URL = "https://api.booksculp.com/v1/";
// export const BASE_URL = "https://dev.sculpagency.com/API/v1/";
// export const BASE_URL = "https://68.178.150.231/API/v1/";
// export const LIVE_URL = "https://dev.sculpagency.com/LIVE/v1/";
export const LIVE_URL = "https://api.booksculp.com/v1/";

// Authentication URLs
export const USER_REGISTER = "register.php";
export const PHOTOGRAPHER_REGISTER = "super_new_photographer_register.php";
export const UPDATE_PHOTOGRAPHER_REGISTER = "super_new_photographer_update.php";
export const SEND_VARIFICATION_EMAIL = "send_email_verification.php";
export const VERIFY_OTP = "verify_phone.php";
export const SOCIAL_USER_REGISTER = "social-register.php";
export const SOCIAL_USER_LOGIN = "social-login.php";
export const PROFILE_SETUP = "user_details.php";
export const USER_LOGIN = "login.php";
export const SAVE_FIREBASE_UID = "add_firebase_chat.php";
export const CHECK_EMAIL_EXIST = "email_check_users.php";
export const REGISTER_TOKEN = "register_device.php";
export const REMOVE_TOKEN = "logout_delete_device.php";
export const USER_LOGOUT = "logout_delete_device.php";

export const GET_OPTIONS_DATA = "get_model_register_fields_options.php";
export const GET_USER_DETAIL = "get_user_details.php";
export const UPLOAD_GALLERY_PROFILE = "upload_img.php";
export const UPLOAD_PORTFOLIO = "upload_portfolio.php";
export const UPLOAD_VIDEO = "upload_video.php";
export const GET_REEL_LIST = "get_video_listing.php";
export const UPDATE_PORTFOLIO = "update_portfolio.php";
export const UPLOAD_SOCIAL_POST = "upload_social_post.php";
export const UPDATE_SOCIAL_POST = "update_social_post.php";
export const GET_PORTFOLIOS = "get_portfolio_listing.php";
export const GET_SOCIAL_POSTS = "get_social_post_listing.php";
export const DELETE_POST = "del_post.php";
export const GET_USER_PORTPOLIO = "get_user_portfolio.php";
export const GET_USER_SOCIAL_POSTS = "get_users_social_post.php";
export const GET_PORTPOLIO_DETAILS = "get_single_portfolio.php";
export const GET_SOCIAL_POST_DETAILS = "get_single_social_post.php";
export const ADD_COMMENT = "comment.php";
export const LIKE_DISLIKE = "portfolio_likes.php";
export const OTP_VERIFICATION = "email_verify.php";
export const SEND_VARIFICATION = "email_verify.php";
export const RESET_PASSWORD = "update_password.php";
export const REMOVE_IMAGE = "remove_image.php";
export const GET_CHAT_LIST = "get_user_chat_list.php";
export const GET_USER_CHAT = "get_user_chat.php";
export const SEND_MESSAGE = "send_chat.php";
export const GET_TYPING_STATUS = "update_typing_status.php";
export const GET_NOTIFICATION_BADGE = "get_notifications_count.php";
export const GET_CHAT_BADGE = "get_chat_count.php";
export const GET_READ_STATUS = "update_chat_status.php";
export const CLEAR_USER_CHAT = "clear_user_chat.php";
export const HANDLE_NOTIFICATION = "current_screen.php";
export const GET_CURRENT_DATA = "Get_location_data.php";

export const FORGOT_PASSWORD = "forget_password.php";

// other URLs
export const IDENTITY_VERIFICATION = "identity_verify.php";
export const GET_LANGUAGES_LIST = "location.php";
export const GET_COUNTRY_LIST = "location.php";
export const GET_JOB_FILTER = "project_search.php";
export const GET_ACCOUNT_SETTING_DETAILS = "view_account_settings.php";
export const GET_NOTIFICATION_LIST = "get_notifications_list.php";
export const UPDATE_NOTIFY_STATUS = "update_notifications_status.php";
export const GET_PROPOSAL_STATUS = "proposal_submition_status.php";
export const CONTACT_US = "contact_us.php";

// Models applictation
export const GET_PACKAGES = "get_packages.php";
export const GET_PAYMENT_STATUS = "settings.php";
export const GET_MODELS_LIST = "get_models.php";
export const GET_KIDS_LIST = "get_child_list.php";
export const GET_PHOTOGRAPHER_LIST = "get_photographer_list.php";
export const GET_JOB_DETAILS = "get_single_project_details.php";
export const REPOST_JOB = "job_reopen.php";

export const GET_SEARCH_RESULTS = "get_search.php";
export const GET_MODEL_ONGOING_JOBS = "user_ongoing_projects.php";
export const GET_MODEL_PROJECTS = "model_projects_list.php";
export const ADD_REMOVE_EVENTS = "event_avalability_calander.php";
export const ADD_EVENT_TO_CALENDAR = "google_calender.php";

// Client Application
export const POST_JOB = "post_job.php";
export const UPDATE_POSTED_JOB = "update_job.php";
export const GET_JOBS_LIST = "get_project_list.php";
export const SUBMIT_PROPOSAL = "submit_proposal.php";
export const UPDATE_PROPOSAL = "edit_proposal.php";
export const GET_POSTED_LISTING = "get_project_list_users.php";
export const GET_PROPOSAL_LIST = "get_project_proposal_list.php";
export const BLOCK_USER = "block_user.php";
export const GET_RATING_OPTIONS = "get_project_rating_options.php";
export const APP_RATING = "App_rating.php";
export const COMPLETE_PAY = "job_complete.php";
export const GET_LATEST_PROPOSALS = "get_user_proposal_list.php";
export const HIRE_CHECKOUT = "hire_checkout.php";

// Admin Process
export const GET_ALL_TALENTS_LIST = "super_view_all_user.php";
export const GET_ALL_CLIENTS_LIST = "super_view_all_client.php";
export const DELETE_USER = "super_view_del_user.php";

// user following
export const FOLLOW_DETAILS = "get_follower_list.php";
export const USER_FOLLOWING = "followers.php";
export const GET_ALL_LIKES_USERS = "get_like_user_details.php";
export const USER_REPORTING = "report.php";
export const SAVE_POST = "saved_post.php";
export const UNSAVE_POST = "unsaved_post.php";
export const GET_SAVED_POST = "get_saved_data.php";
export const DELETE_JOB = "delete_job.php";
export const GET_CONNECTS = "get_connects.php";
export const GET_STRIPE_BALANCE = "get_stripe_account_balance.php";

// Payment Gateway
export const STRIPE_URL = "stripe.php";
export const ADD_STRIPE_ACCOUNT = "add_user_stripe_account.php";
export const HANDLE_WITHDRAW = "stripe_withdraw.php";
export const GET_PAYOUTS_LIST = "stripe_payout_history.php";
export const GET_SUPER_TRANSACTION_HISTORY =
  "user_wise_transaction_history_email.php";

// old
export const UPDATE_PROFILE = "v1/user/updateProfile";
export const SOCIAL_LOGIN = "v1/user/socialLogin";

export const USER_DETAILS = "v1/user/getProfile";

// Password Section URLs
export const FORGOT_PASSWORD_OTP = "v1/user/verifyOtp";
export const CHANGE_PASSWORD = "v1/user/changePassword";

// Footer Section URLs
export const GET_CMS = "v1/user/getCms";

// Chat Module URLs and Referal Code
export const GET_CHAT = "v1/user/getChat";
export const GET_REFERRAL_CODE = "v1/user/getReferalCode";

// Notification URLs
export const GET_NOTOFICATION_LIST = "v1/user/getNotification";

// Payment Gateway Section
export const ADD_CARD = "v1/user/addCard";
export const GET_CARD = "v1/user/getCard";
export const DELETE_CARD = "v1/user/deleteCard";
