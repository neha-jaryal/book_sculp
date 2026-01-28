import { combineReducers } from "redux";
import { authReducer } from "./AuthReducers";
import { otherReducer } from "./OtherReducers";

const appReduder = combineReducers({
  authReducer: authReducer,
  otherReducer: otherReducer,
});
const rootReducer = (state, action) => {
  if (action.type === "LOGOUT") {
    state = undefined;
  } else {
    appReduder;
  }
  return appReduder(state, action);
};
export default rootReducer;
