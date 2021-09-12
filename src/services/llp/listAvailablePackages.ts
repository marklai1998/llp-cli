import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { llpClient } from "../apiClient";
import { APIResponse } from "../../types/apiResponse";
import { StringNumber } from "../../types/value";
import { Package } from "../../types/package";

export const listAvailablePackages = async ({ id }: { id: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      page_sum: number;
      list: Package[];
    }>
  >("/index.php", {
    params: {
      _g: "newdeployment",
      _m: "rel",
      _a: "getRelPackage",
      bus_id: id,
      env: getEnv(),
      page_num: 1,
      num_per_page: 6,
      is_rel: 0,
      o_env: "",
      b_env: getEnv(),
      identifier: getIdentifier(),
      region: getRegion(),
    },
  });

  return res.data.data;
};
