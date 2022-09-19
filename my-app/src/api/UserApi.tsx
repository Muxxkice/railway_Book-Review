import React from "react";
import axios from "axios";

import { LoginUser, SiginupUser, UserName } from "../type/UserType";
import { Error } from "../page/Error";

axios.defaults.baseURL = "https://api-for-missions-and-railways.herokuapp.com";
// axios.defaults.headers.common["Content-Type"] = "application/form-data";
export const setDefaultHeader = (data: string) => {
  axios.defaults.headers.common["Authorization"] = `Bearer ${data}`;
};

// ユーザー認証
export const logInUser = (data: LoginUser) => {
  console.log(data);
  return axios
    .post("/signin", data)
    .then((res) => {
      console.log(res);
      if (res.status === 200) {
        console.log(res);
        return res.data.token;
      } else {
        return null;
      }
    })
    .catch((e) => {
      console.log(e);
      console.log(e.ErrorMessageJP);
      return <Error message={e.ErrorMessageJP} />;
    });
};

//ユーザー登録
export const signUp = async (data: SiginupUser) => {
  console.log(data);
  return axios
    .post(`/users`, data)
    .then((res) => {
      if (res.status === 200) {
        return res.data.token;
      } else {
        return null;
      }
    })
    .catch((e) => {
      console.log(e);
      console.log(e.ErrorMessageJP);
      return <Error message={e.ErrorMessageJP} />;
    });
};

// ユーザー名の取得
export const getUserInfo = async () => {
  try {
    const res = await axios.get(`/users`);
    if (res.status === 200) {
      console.log(res.data);
      return res.data;
    }
  } catch (error) {
    console.log(error);
    return <Error message={error.ErrorMessageJP} />;
  }
};

// ユーザー名の変更
export const changeUserName = (data: UserName) => {
  console.log(data);
  return axios
    .put(`/users`, data)
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data.name);
        return res.data.name;
      } else {
        return null;
      }
    })
    .catch((e) => {
      console.log(e);
      // console.log(e.ErrorMessageJP);
    });
};

//アイコンアップロード
export const postIcon = (formData, cookie: string) => {
  return axios
    .post(`/uploads`, formData, {
      headers: {
        // "Access-Control-Allow-Origin": "*",
        // Authorization: `Bearer ${cookie}`,
        "Content-Type": "application/form-data",
      },
    })
    .then((res) => {
      if (res.status === 200) {
        console.log(res.data.iconUrl);
        return res.data.iconUrl;
      } else {
        return null;
      }
    })
    .catch((e) => {
      // console.log(e);
      // console.log(e.code);
      Error(e);
      // console.log("エラーメッセージ" + e.ErrorMessageJP);
    });
};
