import axios from "axios";
import { logout } from "../utils/logout";

export const llpClient = axios.create({
  baseURL: "http://lalaplat2.huolala.work",
  timeout: 3000,
});

llpClient.interceptors.response.use(
  (res) => {
    if (res.data.ret !== 0) {
      switch (res.data.ret) {
        case 101:
          // used for getting login url
          return res;
        case 50002:
          logout();
          throw new Error(res.data.msg);
        default:
          throw new Error(res.data.msg);
      }
    }
    return res;
  },
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject("Timeout Error");
    }

    return Promise.reject(error);
  }
);

export const ssoClient = axios.create({
  baseURL: "https://sso.huolala.work",
  timeout: 3000,
});
