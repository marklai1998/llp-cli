import { StringNumber } from "./../../types/value";
import { getEnv, getRegion, getIdentifier } from "../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";

export const getGroupInfo = async ({ id }: { id: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      openSlb: number;
      node_list: {
        [host: string]: {
          id: StringNumber;
          host: string;
          is_ok: number;
          slb: [];
          slb_status: number;
          has_gray: number;
          openSlb: number;
          slb_weight: number;
        };
      };
      openGateway: number;
    }>
  >("/index.php", {
    params: {
      _g: "newdeployment",
      _m: "busnode",
      _a: "getBusNodeSlb",
      bus_id: id,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    },
  });

  return res.data.data;
};
