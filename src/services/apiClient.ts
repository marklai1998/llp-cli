import axios from "axios";

export const llpClient = axios.create({
  baseURL: "http://lalaplat2.huolala.work",
  timeout: 3000,
});

llpClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.code === "ECONNABORTED") {
      return Promise.reject("Timeout Error");
    }

    return Promise.reject(error);
  }
);

export const ssoClient = axios.create({
  baseURL: "https://sso.huolala.work",
  timeout: 2,
});
