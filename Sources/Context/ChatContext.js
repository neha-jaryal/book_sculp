import { createContext, useContext, useReducer } from "react";
import { AuthContext } from "./AuthContext";

export const ChatContext = createContext();

export const ChatContextProvider = ({ children }) => {
  const { currentUser } = useContext(AuthContext);
  const INITIAL_STATE = {
    chatId: "null",
    user: {},
  };

  const chatReducer = (state, action) => {
    switch (action.type) {
      case "CHANGE_USER":
        return {
          user: action.payload,
          chatId:
            currentUser.uid > action.payload.uid
              ? currentUser.uid + action.payload.uid
              : action.payload.uid + currentUser.uid,
        };

      case "SWITCH_USER_NULL":
        return {
          user: null,
          chatId: null,
        };

      default:
        return state;
    }
  };

  const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

  return (
    <ChatContext.Provider value={{ data: state, dispatch }}>
      {children}
    </ChatContext.Provider>
  );
};

// import { createContext, useContext, useReducer } from "react";
// import { AuthContext } from "./AuthContext";

// export const ChatContext = createContext();

// export const ChatContextProvider = ({ children }) => {
//   const { currentUser } = useContext(AuthContext);
//   const INITIAL_STATE = {
//     chatId: "null",
//     user: {},
//   };

//   const chatReducer = (state, action) => {
//     switch (action.type) {
//       case "CHANGE_USER":
//         return {
//           user: action.payload,
//           chatId:
//             // currentUser.uid != action.payload.uid
//             //   ? currentUser.uid + action.payload.uid
//             //   : action.payload.uid + currentUser.uid,

//             currentUser.uid > action.payload.uid
//               ? currentUser.uid + action.payload.uid
//               : action.payload.uid + currentUser.uid,
//           roomId: currentUser.uid + action.payload.uid,
//         };

//       default:
//         return state;
//     }
//   };

//   const [state, dispatch] = useReducer(chatReducer, INITIAL_STATE);

//   return (
//     <ChatContext.Provider value={{ data: state, dispatch }}>
//       {children}
//     </ChatContext.Provider>
//   );
// };
