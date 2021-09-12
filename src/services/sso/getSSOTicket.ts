import { APIResponse } from "../../types/apiResponse";
import { ssoClient } from "../apiClient";
import queryString from "query-string";

export const getSSOTicket = async ({
  appid,
  callback,
  sign,
}: {
  appid: string;
  callback: string;
  sign: string;
}) => {
  const res = await ssoClient.post<
    APIResponse<{
      callback: string;
      appid: number;
      account: "";
      token: "";
      email: "";
      show_name_cn: "";
      show_name_en: "";
      ssoTicket: string;
    }>
  >(
    "/index.php",
    queryString.stringify({
      appid,
      callback,
      _t: Date.now() / 1000,
      _sign: sign,
      uclang: "sc",
      _path: "html",
      show_name_en: "",
      show_name_cn: "",
    }),
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      params: {
        _m: "login",
        _a: "index",
      },
    }
  );

  return res.data.data.ssoTicket;
};
