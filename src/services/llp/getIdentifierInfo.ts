import { getEnv, getRegion } from "./../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import queryString from "query-string";

export const getIdentifierInfo = async ({
  identifier,
}: {
  identifier: string;
}) => {
  const res = await llpClient.post<
    APIResponse<{
      isAdmin: false;
      pristr: string;
      english_name: string;
      user_name: string;
      uid: string;
      login_url: string;
      idc: string;
      login_mode: 0;
      lalaplat_socket: [];
      log_socket: [];
      region_list: null;
      region: "aliyun";
    }>
  >(
    "/index.php",
    queryString.stringify({
      env: getEnv(),
      region: getRegion(),
      identifier,
    }),
    {
      params: {
        _m: "user",
        _a: "getIdentifierInfo",
      },
    }
  );

  return res.data.data;
};
