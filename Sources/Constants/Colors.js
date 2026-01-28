// import { getUserRole } from "../Utility";
// const getColors = async (userRole) => {
//   let lightThemeColor;
//   let themeColor;

//   if (userRole === 12) {
//     lightThemeColor = "#addcea";
//     themeColor = "#1d90b4";
//   } else if (userRole === 13) {
//     lightThemeColor = "#FFEBF0";
//     themeColor = "#EF4D74";
//   } else {
//     lightThemeColor = "#b7e5d7";
//     themeColor = "#4BBE9D";
//   }

//   return {
//     lightThemeColor,
//     themeColor,
//   };
// };

// var colors;
// (async () => {
//   const userRole = await getData(storageKey.USER_ROLE);
//   colors = await getColors(userRole);
//   console.log("colors-----", colors);

//   // const themeColor = colors.themeColor;
//   // console.log(themeColor);
// })();
// console.log("colors-----", colors);

// if (colors) {
//   const themeColor = colors.themeColor;
//   console.log("themeColor----", themeColor);
// }

// let lightThemeColor;
// let themeColor;
// const getColors = async () => {
//   let userRole = await getData(storageKey.USER_ROLE);

//   if (userRole === 12) {
//     lightThemeColor = "#addcea";
//     themeColor = "#1d90b4";
//   } else if (userRole === 13) {
//     lightThemeColor = "#FFEBF0";
//     themeColor = "#EF4D74";
//   } else {
//     lightThemeColor = "#b7e5d7";
//     themeColor = "#4BBE9D";
//   }

//   return {
//     lightThemeColor,
//     themeColor,
//   };
// };
// getColors();
// console.log("lightThemeColorlightThemeColor-------", lightThemeColor);
export const Colors = {
  lightThemeColor: "#b7e5d7",
  themeColor: "#4BBE9D",
  // lightThemeColor:
  //   userRole == 12 ? "#addcea" : userRole == 13 ? "#FFEBF0" : "#b7e5d7",
  // themeColor:
  //   userRole == 12 ? "#1d90b4" : userRole == 13 ? "#EF4D74" : "#4BBE9D",
  // lightThemeColor: '#D3D3D3',
  // themeColor: '#676767',
  // lightThemeColor: '#FFEBF0',
  // themeColor: '#EF4D74', //ED1045
  // lightThemeColor: '#addcea',
  // themeColor: '#1d90b4',
  // lightThemeColor: '#f5e2c0',
  // themeColor: '#ffce71',
  backgroundColor: "#656565",
  inputBorder: "#999",
  black: "#000",
  white: "#fff",
  green: "#4BBE9D",
  grey: "#D3D3D3",
  darkgrey: "#7A869A",
  red: "#E84242",
  yellow: "#FFCE71",
  lightYellow: "#f0e19d",
  darkYellow: "#fea600",
  gray: "#676767",
  lightGray: "#f7f7f7",
  blue: "#1d90b4",
  lightBlue: "#addcea",
  pink: "#EF4D74",
  lightPink: "#FFEBF0",
  plainPink: "#f0b5bb",
  gredient: "#dadde1",
  offWhite: "#f2f2f2",
  orange: "#ff6600",
};

export const pastelColors = [
  "#FFF3CD",
  "#D6EAF8",
  "#FADBD8",
  "#E8DAEF",
  "#D4EFDF",
  "#FCF3CF",
  "#F5EEF8",
  "#D1F2EB",
  "#EAF2F8",
  "#F9E79F",
  "#addcea",
  "#f0b5bb",
  "#b7e5d7",
];
