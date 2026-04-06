import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
  RefreshControl,
} from "react-native";
import { Calendar } from "react-native-big-calendar";
import { Header, Loader } from "../../Components";
import { getUserDetail } from "../../Redux/Services/AuthServices";
import { getData, storageKey, storeData } from "../../Utility/Storage";
import { useDispatch } from "react-redux";
import { addRemoveEventsApi } from "../../Redux/Services/OtherServices";
import { Colors } from "../../Constants";
import { Styles } from "../../Styles";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { showToast } from "../../Utility";
import { useNavigation } from "@react-navigation/native";

export const ManageAvailability = (props) => {
  const { userId, readonly } = props;
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const selectionTimer = useRef(null);

  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("month");

  const [events, setEvents] = useState([]);
  const [selectedCells, setSelectedCells] = useState([]);
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState("");
  const [refreshing, setRefreshing] = useState(false);

  GoogleSignin.configure({
    scopes: ["https://www.googleapis.com/auth/calendar.readonly"],
    webClientId:
      "646055473905-qos5st7u0a5knrnlahspdafvpv0a9076.apps.googleusercontent.com",
    offlineAccess: true,
  });

  useEffect(() => {
    getUserData();
    getValidAccessToken();
  }, []);

  const formatMonthYear = (date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  const goToToday = () => setCurrentDate(new Date());
  const goBack = () => {
    let newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() - 1);
    else if (view === "week") newDate.setDate(currentDate.getDate() - 7);
    else newDate.setDate(currentDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const goNext = () => {
    let newDate = new Date(currentDate);
    if (view === "month") newDate.setMonth(currentDate.getMonth() + 1);
    else if (view === "week") newDate.setDate(currentDate.getDate() + 7);
    else newDate.setDate(currentDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const getUserData = async () => {
    try {
      setLoading(true);
      let userID = await getData(storageKey?.USER_ID);

      let body = {
        user_id: userId || JSON?.parse(userID),
      };
      let res = await dispatch(getUserDetail(body));
      if (res?.status === 200) {
        console.log("eventsArreventsArr----", res?.results?.event_details);
        //   const startDate = new Date(event.start);
        //   const day = startDate.getDate();
        //   const month = startDate.getMonth() + 1;
        //   const year = startDate.getFullYear();

        //   const shouldBeBooked =
        //     year === 2025 && month === 10 && [21, 22, 23].includes(day);

        //   return {
        //     ...event,
        //     start: startDate,
        //     end: new Date(event.end),
        //     title: shouldBeBooked ? "Booked" : event.title,
        //   };
        // });

        const eventsArr = res?.results?.event_details?.map((event) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end),
          allDay: event.allDay,
          allday: event.allDay,
        }));

        setEvents(eventsArr || []);
        setRefreshing(false);
      }
    } catch (err) {
      console.error("Error fetching user data:", err);
    } finally {
      setLoading(false);
    }
  };
  function formatDate(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return `${year}-${month}-${day}`;
  }
  function formatDateTime(date, time = "00:00:00") {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;

    return `${year}-${month}-${day} ${time}`;
  }
  function formatEndDate(date, time = "00:00:00") {
    var year = date.getUTCFullYear();
    var month = date.getUTCMonth() + 1;
    var day = date.getUTCDate();
    month = month < 10 ? "0" + month : month;
    day = day < 10 ? "0" + day : day;
    return `${year}-${month}-${day} ${time}`;
  }

  function formatTime(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    hours = hours < 10 ? "0" + hours : hours;
    minutes = minutes < 10 ? "0" + minutes : minutes;
    return `${hours}:${minutes}:00`;
  }

  const isTokenExpired = (tokenData) => {
    const ONE_HOUR = 60 * 60 * 1000;
    return Date.now() - tokenData.timestamp > ONE_HOUR;
  };

  const getValidAccessToken = async () => {
    const saved = await getData(storageKey?.GOOGLE_CALENDAR_DATA);
    const accessData = JSON.parse(saved);
    if (
      accessData?.accessToken &&
      !isTokenExpired(saved) &&
      accessData?.status == "active"
    ) {
      const userInfo = await GoogleSignin?.signInSilently();
      console.log("userInfouserInfo-----", userInfo);
      // const userInfo = await GoogleSignin?.getCurrentUser();
      setUserData(userInfo?.user);
    }
    if (
      accessData?.accessToken &&
      isTokenExpired(saved) &&
      accessData?.status == "active"
    ) {
      console.log("Token expired, refreshing...");
      const tokens = await GoogleSignin.getTokens();
      const newData = {
        accessToken: tokens.accessToken,
        email: userInfo?.user?.email,
        timestamp: Date.now(),
        status: "active",
      };
      storeData(storageKey?.GOOGLE_CALENDAR_DATA, JSON.stringify(newData));
      setAccessToken(tokens.accessToken);
      return tokens.accessToken;
    }
  };

  const handleGoogleCalendar = async () => {
    setLoading(true);
    try {
      await GoogleSignin.hasPlayServices();
      const userInfo = await GoogleSignin.signIn();
      setUserData(userInfo?.user);
      const tokens = await GoogleSignin.getTokens();
      if (tokens.accessToken) {
        const newData = {
          accessToken: tokens.accessToken,
          timestamp: Date.now(),
          status: "active",
        };
        setAccessToken(newData.accessToken);
        storeData(storageKey?.GOOGLE_CALENDAR_DATA, JSON.stringify(newData));
        setTimeout(() => {
          setLoading(false);
          showToast("You account has been connected", "success");
        }, 2000);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectCalendar = async () => {
    // await GoogleSignin?.revokeAccess();
    setLoading(true);
    const newData = {
      accessToken: null,
      timestamp: null,
      status: "inactive",
    };
    setAccessToken("");
    storeData(storageKey?.GOOGLE_CALENDAR_DATA, JSON.stringify(newData));
    setTimeout(() => {
      setLoading(false);
      setUserData(null);
      showToast("You account has been disconnected", "success");
    }, 2000);
  };
  const today = new Date();
  const handlePressCell = (date) => {
    if (date < today.setHours(0, 0, 0, 0)) {
      Alert.alert("Not allowed", "You can’t select past dates.");
      return;
    }
    const dateObj = new Date(date);

    const existingEvent = events.find(
      (event) =>
        new Date(event.start).toDateString() === dateObj.toDateString(),
    );
    if (existingEvent) {
      Alert.alert(
        "Remove Event",
        `An event exists on ${dateObj.toDateString()}. Do you want to remove it?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Remove",
            style: "destructive",
            onPress: () => {
              removeEventsData(existingEvent);
              setSelectedCells((prev) =>
                prev.filter(
                  (d) => new Date(d).toDateString() !== dateObj.toDateString(),
                ),
              );
            },
          },
        ],
      );
      return;
    }

    const alreadySelected = selectedCells.some(
      (d) => new Date(d).toDateString() === dateObj.toDateString(),
    );

    const newSelection = alreadySelected
      ? selectedCells.filter(
          (d) => new Date(d).toDateString() !== dateObj.toDateString(),
        )
      : [...selectedCells, dateObj];

    setSelectedCells(newSelection);
    if (selectionTimer.current) clearTimeout(selectionTimer.current);
    selectionTimer.current = setTimeout(() => {
      handleConfirmSelection(newSelection);
    }, 1000);
  };

  const handleConfirmSelection = (selection) => {
    if (!selection || selection.length === 0) {
      resetSelection();
      return;
    }
    Alert.alert(
      "Create Event",
      `You selected ${selection.length} date(s). Create an event?`,
      [
        {
          text: "Cancel",
          style: "cancel",
          onPress: () => resetSelection(),
        },
        {
          text: "Create",
          onPress: () => confirmEvent(selection),
        },
      ],
    );
  };

  const confirmEvent = (selection) => {
    if (!selection || selection.length === 0) return;

    const sortedDates = [...selection].sort((a, b) => a - b);
    const start = sortedDates[0];
    const end = sortedDates[sortedDates.length - 1];

    const newEvent = {
      title: "Unavailable",
      start,
      end,
      allday: true,
    };
    addEventData(newEvent);
    resetSelection();
  };

  const resetSelection = () => {
    setSelectedCells([]);
    if (selectionTimer.current) clearTimeout(selectionTimer.current);
  };

  const cellStyle = (date) => {
    const formatYMDLocal = (d) => {
      const nd = new Date(d);
      const year = nd.getFullYear();
      const month = String(nd.getMonth() + 1).padStart(2, "0");
      const day = String(nd.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };
    const formattedDate = formatYMDLocal(date);
    const isSelected = selectedCells.some(
      (d) => formatYMDLocal(d) === formattedDate,
    );
    const eventExists = events.find((e) => {
      const start = formatYMDLocal(e.start);
      const end = formatYMDLocal(e.end);
      const current = formattedDate;
      return current >= start && current <= end;
    });

    let style = {
      borderWidth: 1,
      borderColor: Colors?.gredient,
      borderRadius: 8,
      margin: 2,
      overflow: "hidden",
      backgroundColor: Colors?.white,
    };
    if (isSelected) {
      return {
        ...style,
        backgroundColor: Colors?.lightBlue,
        borderColor: Colors?.lightBlue,
      };
    }
    if (eventExists) {
      if (eventExists.title === "Unavailable") {
        style.backgroundColor = Colors?.gredient;
        style.borderColor = Colors?.gredient;
      } else if (eventExists.title === "Booked") {
        style.backgroundColor = Colors?.lightThemeColor;
        style.borderColor = Colors?.lightThemeColor;
      }
    }
    return style;
  };

  const addEventData = async (newEvent) => {
    console.log("newEvent---", newEvent);
    setLoading(true);
    let userID = await getData(storageKey?.USER_ID);
    let data = await getData(storageKey?.GOOGLE_CALENDAR_DATA);
    const calendarData = JSON.parse(data);
    let body = {
      user_id: userId || userID,
      action: "add_event",
      event_date: newEvent?.start,
      google_access_token: calendarData?.accessToken || accessToken || "",
      event_title: newEvent?.title || "Unavaliable",
      event_start: formatDateTime(new Date(newEvent?.start)),
      event_end: formatEndDate(new Date(newEvent?.end)),
      event_start_time: newEvent?.start,
      event_end_time: newEvent?.end,
      // start_time: formatTime(new Date(newEvent?.start)),
      // end_time: formatTime(new Date(newEvent?.end)),
      start_time: "00:00:00",
      end_time: "00:00:00",
      all_day: 1,
    };
    console.log("bodybody-----", body);
    let res = await dispatch(addRemoveEventsApi(body));
    if (res?.status === 200) {
      getUserData();
      showToast("Event added successfully", "success");
    } else {
      setLoading(false);
    }
  };

  const removeEventsData = async (event) => {
    setLoading(true);
    let userID = await getData(storageKey?.USER_ID);
    let data = await getData(storageKey?.GOOGLE_CALENDAR_DATA);
    const calendarData = JSON.parse(data);

    if (userId || userID) {
      let body = {
        user_id: userId || userID,
        action: "remove_event",
        event_id: event?.event_id,
        google_access_token: calendarData?.accessToken || accessToken || "",
        event_date: event?.start,
        event_title: event?.title,
        event_start: event?.start,
        event_end: event?.end,
        start_time: formatTime(new Date(event?.start)),
        end_time: formatTime(new Date(event?.end)),
        event_start_time: formatTime(new Date(event?.start)),
        event_end_time: formatTime(new Date(event?.end)),
        all_day: 1,
      };
      console.log("bodybody-----", body);
      let res = await dispatch(addRemoveEventsApi(body));
      if (res?.status === 200) {
        getUserData();
        showToast("Event removed successfully", "success");
      } else {
        setLoading(false);
      }
    }
  };
  const onRefresh = () => {
    setRefreshing(true);
    getUserData();
    // getValidAccessToken();
  };
  return (
    <>
      {!readonly && (
        <>
          <Header text="Manage Availablity" navigation={navigation} />
        </>
      )}
      <Loader loading={loading} />
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors?.darkgrey}
          />
        }
        style={{
          ...Styles?.container,
          padding: 0,
          paddingVertical: 15,
          marginHorizontal: 0,
          marginTop: 5,
          width: "100%",
        }}
      >
        {userData?.email && (
          <>
            <View style={{ marginVertical: 20, alignSelf: "center" }}>
              <Text
                style={{
                  color: Colors?.darkgrey,
                  fontWeight: "500",
                  fontSize: 15,
                  textAlign: "center",
                  paddingVertical: 2,
                }}
              >
                Connected with
              </Text>
              <Text
                style={{
                  color: Colors?.themeColor,
                  textDecorationLine: "underline",
                  fontWeight: "bold",
                }}
              >
                {userData?.email}
              </Text>
            </View>
          </>
        )}

        <View
          style={{
            ...Styles?.row,
            margin: 10,
          }}
        >
          <View
            style={{
              ...styles.viewButton,
              backgroundColor: Colors?.lightThemeColor,
              borderWidth: 0,
              marginHorizontal: 5,
            }}
          ></View>
          <Text>Booked</Text>

          <View
            style={{
              ...styles.viewButton,
              backgroundColor: Colors?.gredient,
              borderWidth: 0,
              marginHorizontal: 5,
              marginLeft: 15,
            }}
          ></View>
          <Text>Unvailabile</Text>
          {!readonly && (
            <TouchableOpacity
              onPress={() =>
                userData?.email ? disconnectCalendar() : handleGoogleCalendar()
              }
              style={{
                ...styles.viewButton,
                backgroundColor: userData?.email
                  ? Colors?.lightPink
                  : Colors?.gredient,
                borderWidth: 0,
                position: "absolute",
                right: 20,
              }}
            >
              <Text
                style={{ color: userData?.email ? Colors?.red : Colors?.black }}
              >
                {userData?.email ? "Disconnect Google" : "Connect Google"}
              </Text>
            </TouchableOpacity>
          )}
        </View>
        <Text style={styles.monthText}>{formatMonthYear(currentDate)}</Text>

        <View style={styles.header}>
          <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
            <TouchableOpacity style={styles.button} onPress={goToToday}>
              <Text>Today</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goBack}>
              <Text>{readonly ? "<" : "Back"}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={goNext}>
              <Text>{readonly ? ">" : "Next"}</Text>
            </TouchableOpacity>
          </View>

          <View style={{ flexDirection: "row" }}>
            <TouchableOpacity
              onPress={() => setView("day")}
              style={[styles.viewButton, view === "day" && styles.activeButton]}
            >
              <Text>Day</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setView("week")}
              style={[
                styles.viewButton,
                view === "week" && styles.activeButton,
              ]}
            >
              <Text>Week</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setView("month")}
              style={[
                styles.viewButton,
                view === "month" && styles.activeButton,
              ]}
            >
              <Text>Month</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Calendar
          mode={view}
          events={Array.isArray(events) ? events : []}
          height={500}
          // onLongPressCell={!readonly && handleLongPressCell}
          onPressCell={!readonly && handlePressCell}
          calendarCellStyle={cellStyle}
          swipeEnabled={false}
          calendarCellTextStyle={{
            paddingTop: readonly ? 10 : 20,
            paddingBottom: 10,
            fontSize: 15,
            fontWeight: "600",
          }}
          bodyContainerStyle={{
            height: readonly ? 400 : 500,
            backgroundColor: "white",
            borderRadius: 10,
            marginHorizontal: 5,
          }}
          renderEvent={() => null}
          // renderEvent={(item) => {
          //   return (
          //     <View
          //       style={{
          //         backgroundColor: Colors?.blue,
          //         borderRadius: readonly ? 2 : 5,
          //         paddingVertical: 5,
          //       }}
          //     >
          //       <Text
          //         style={{
          //           color: Colors?.white,
          //           fontSize: readonly ? 6 : 7,
          //           textAlign: "center",
          //         }}
          //       >
          //         {item?.title}
          //       </Text>
          //     </View>
          //   );
          // }}
        />
        {/* <TouchableOpacity
          onPress={() => disconnectCalendar()}
          style={{ marginVertical: 20, alignSelf: "center" }}
        >
          <Text
            style={{
              color: Colors?.red,
              textDecorationLine: "underline",
              fontWeight: "bold",
              fontSize: 15,
            }}
          >
            Disconnect Google calendar
          </Text>
        </TouchableOpacity> */}
        <View style={{ height: 30 }} />
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    textAlign: "center",
    marginVertical: 10,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    justifyContent: "space-evenly",
  },
  button: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginRight: 6,
  },
  viewButton: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 4,
    marginLeft: 4,
  },
  activeButton: {
    backgroundColor: "#ddd",
  },
  monthText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
    marginVertical: 10,
  },
  footer: {
    position: "absolute",
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 20,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  cancelButton: {
    backgroundColor: "#E53935",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedCell: {
    backgroundColor: Colors?.lightBlue,
    borderColor: Colors?.lightBlue,
    borderRadius: 8,
    margin: 2,
    overflow: "hidden",
  },
  eventCell: {
    backgroundColor: "red",
    borderRadius: 8,
  },
});

// import { View } from "react-native";
// import EventCalendar from "react-native-events-calendar";
// import { Header } from "../../Components";
// import { dimensionWidth } from "../../Constants";
// import { Styles } from "../../Styles";
// export const ManageAvailablity = ({ navigation }) => {
//   const events = [
//     {
//       start: "2017-09-07 00:30:00",
//       end: "2017-09-07 01:30:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-07 01:30:00",
//       end: "2017-09-07 02:20:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-07 04:10:00",
//       end: "2017-09-07 04:40:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-07 01:05:00",
//       end: "2017-09-07 01:45:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-07 14:30:00",
//       end: "2017-09-07 16:30:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-08 01:20:00",
//       end: "2017-09-08 02:20:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-08 04:10:00",
//       end: "2017-09-08 04:40:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-08 00:45:00",
//       end: "2017-09-08 01:45:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-08 11:30:00",
//       end: "2017-09-08 12:30:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-09 01:30:00",
//       end: "2017-09-09 02:00:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-09 03:10:00",
//       end: "2017-09-09 03:40:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//     {
//       start: "2017-09-09 00:10:00",
//       end: "2017-09-09 01:45:00",
//       title: "Dr. Mariana Joseph",
//       summary: "3412 Piedmont Rd NE, GA 3032",
//     },
//   ];

//   return (
//     <>
{
  /* <Header text="Manage Availablity" navigation={navigation} />
<View style={{ height: 10 }} /> */
}
//       <EventCalendar
//         eventTapped={() => alert("Hello Developer!")}
//         events={events}
//         width={dimensionWidth(100)}
//         initDate={"2017-09-08"}
//       />
//     </>
//   );
// };
