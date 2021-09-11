import { getEnv, getRegion } from "./../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import queryString from "query-string";

export const getLoginUrl = async () => {
  const res = await llpClient.post<
    APIResponse<{
      identifier: "";
      login_url: string;
      login_mode: number;
    }>
  >(
    "/index.php",
    queryString.stringify({
      env: getEnv(),
      region: getRegion(),
    }),
    {
      params: {
        _m: "user",
        _a: "getIdentifierInfo",
      },
    }
  );

  return res.data.data.login_url;
};
