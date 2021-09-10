import { APIResponse } from "../types/apiResponse";
import { ssoClient } from "./apiClient";
import md5 from "md5";
import queryString from "query-string";

export const loginSSO = async ({
  appid,
  ssoTicket,
  username,
  password,
  otp,
}: {
  appid: string;
  ssoTicket: string;
  username: string;
  password: string;
  otp: string;
}) => {
  const result = await ssoClient.post<
    APIResponse<{
      identifier: string;
      account: string;
      hller_id: string;
      depart_id: string;
      user_name: string;
      expire_ts: number;
      login_client: number;
      jump_to: { callback: string };
      permission: [];
      syncCallback: string;
      syncTo?: [];
    }>
  >(
    "/index.php",
    queryString.stringify({
      user_name: username,
      user_pwd_md5: md5(password),
      ggcode: String(otp),
      loginType: "hll",
      appid: appid,
      ssoTicket: ssoTicket,
      uclang: "sc",
      client_type: "pc",
      dlp_info: "",
      dlp_request_time: "65",
      refer_url: "",
    }),
    {
      headers: { "content-type": "application/x-www-form-urlencoded" },
      params: {
        _m: "login",
        _a: "login",
      },
    }
  );

  if (result.data.ret !== 0) throw new Error(result.data.msg);

  return {
    username: result.data.data.account,
    identifier: result.data.data.identifier,
  };
};
