import axios from "axios";

export const llpClient = axios.create({
  baseURL: "http://lalaplat2.huolala.work",
});

export const ssoClient = axios.create({
  baseURL: "https://sso.huolala.work",
});
