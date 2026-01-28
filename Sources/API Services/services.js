import { showToast } from "../Utility";
import * as Url from "./Url";

export const get = async (url, token, hide = false) => {
  var headers;
  if (token == "" || token == null || token == undefined) {
    headers = {
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      Authorization: token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  try {
    const res = await fetch(completeUrl, {
      method: "GET",
      headers,
    });
    const response = await res.json();
    if (response.status == 200) {
      const message = response.message;
      // !hide ? showToast(message, "success") : null;
    } else {
      const message = response.message;
      // showToast(message, "error");
    }
    return response;
  } catch (error) {
    if (error) {
      console.log("Get Service error--", error);
      // showToast(error, "error");
      return error;
    }
  }
};
 
export const post = async (url, token, body, hide = false, error = true) => {
  var headers;
  if (token == "" || token == null || token == undefined) {
    headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "false",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers":
        "Origin, OPTIONS, X-Requested-With, Content-Type, Accept",
    };
  } else {
    headers = {
      "Content-Type": "application/json",
      Accept: "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": "false",
      "Access-Control-Allow-Methods": "GET",
      "Access-Control-Allow-Headers":
        "Origin, OPTIONS, X-Requested-With, Content-Type, Accept",
      Authorization: token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  let data = JSON.stringify(body);
  // console.log("Post service completeUrl----", completeUrl);
  try {
    const res = await fetch(completeUrl, {
      method: "POST",
      body: JSON.stringify(body),
      headers,
    });
    // console.log("Post Service res----", res);
    const response = await res.json();
    if (response.status == 200) {
      const message = response.message;
      if (message) {
        !hide ? showToast(message, "success") : null;
        // showToast(message, "success");
      }
    } else {
      const message = response.message;
      if (message) {
        error ? showToast(message, "error") : null;
        // showToast(message, "error");
      }
    }
    return response;
  } catch (err) {
    if (err) {
      console.log("Post Service err--", err);
      error ? showToast(err?.message, "error") : null;
      return err;
    }
  }
};

export const formDataPost = async (
  url,
  token,
  body,
  hide = false,
  error = true
) => { 
  var headers;
  if (token == "" || token == null || token == undefined) {
    headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
    };
  } else {
    headers = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log("completeUrl", completeUrl);
  try {
    const res = await fetch(completeUrl, {
      method: "POST",
      headers: headers,
      body: body,
    });
    let response = await res.json();
    if (response.status == 200) {
      const message = response.message;
      if (message) {
        !hide ? showToast(message, "success") : null;
      }
    } else {
      const message = response.message;
      if (message) {
        error ? showToast(message, "error") : null;
      }
    }
    return response;
  } catch (error) {
    if (error) {
      console.log("Some issue while posting form data - ", error);
      error ? showToast(error?.message, "error") : null;
      return error;
    }
  }
};
 
export const put = async (url, token, body) => {
  var headers;
  if (token == "" || token == null || token == undefined) {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log("completeUrl", completeUrl);
  let data = JSON.stringify(body);
  try {
    const response = await fetch(completeUrl, {
      method: "PUT",
      headers,
      body: data,
    });
    if (response.status == 200) {
      const message = response.message;
      if (message) {
        !hide ? showToast(message, "success") : null;
      }
    } else {
      const message = response.message;
      if (message) {
        showToast(message, "error");
      }
    }
    return response;
  } catch (error) {
    if (error) {
      console.log("Put Service error--", error);
      // showToast(error, "error");
      return error;
    }
  }
};

export const deleteService = async (url, token, body, guest) => {
  var headers;
  if (token == "" || token == null || token == undefined) {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  } else {
    headers = {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: token,
    };
  }
  const completeUrl = Url.BASE_URL + url;
  console.log("Delete servive completeUrl---", completeUrl);
  let data = JSON.stringify(body);
  try {
    const res = await fetch(completeUrl, {
      method: "DELETE",
      headers,
      body: data,
    });
    let response = await res.json();
    if (response.status == 200) {
      const message = response.message;
      if (message) {
        !hide ? showToast(message, "success") : null;
      }
    } else {
      const message = response.message;
      if (message) {
        showToast(message, "error");
      }
    }
    return response;
  } catch (error) {
    if (error) {
      console.log("Delete Service error--", error);
      // showToast(error, "error");
      return error;
    }
  }
};
