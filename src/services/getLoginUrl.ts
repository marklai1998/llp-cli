import { APIResponse } from "../types/apiResponse";
import { llpClient } from "./apiClient";
import queryString from "query-string";

export const getLoginUrl = async () => {
  const result = await llpClient.post<
    APIResponse<{
      identifier: "";
      login_url: string;
      login_mode: number;
    }>
  >(
    "/index.php",
    queryString.stringify({
      env: "4",
      region: "3",
    }),
    {
      params: {
        _m: "user",
        _a: "getIdentifierInfo",
      },
    }
  );

  return result.data.data.login_url;
};
