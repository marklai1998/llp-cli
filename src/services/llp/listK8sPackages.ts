import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { llpClient } from "../apiClient";
import { APIResponse } from "../../types/apiResponse";
import { StringNumber } from "../../types/value";

export const listK8sPackages = async ({ id }: { id: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      page_sum: number;
      list: {
        branch: string;
        bus_id: StringNumber;
        bus_name: string;
        create_time: StringNumber;
        des: "";
        env: StringNumber;
        filename: string;
        gra_rel_time: StringNumber;
        gra_version: "";
        id: StringNumber;
        package_id: StringNumber;
        package_name: string;
        prd_rel_time: StringNumber;
        pre_rel_time: StringNumber;
        size: StringNumber;
        stg_rel_time: StringNumber;
        task_id: StringNumber;
        uid: StringNumber;
        user_name: string;
        version: string;
      }[];
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

  if (res.data.ret !== 0) throw new Error(res.data.msg);

  return res.data.data;
};
