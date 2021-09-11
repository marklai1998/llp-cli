import { config, getEnv, getRegion } from "./../../configs/index";
import { llpClient } from "../apiClient";
import { APIResponse } from "../../types/apiResponse";
import { Region } from "../../constants/region";
import { StringNumber } from "../../types/value";

export const listServices = async ({ page = 1 }: { page?: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      page_sum: number;
      list: {
        id: string;
        service: string;
        name: string;
        type: StringNumber;
        level: StringNumber;
        domain_id: StringNumber;
        cmdb_id: StringNumber;
        rel_cfg: StringNumber;
        git_link: string;
        region: Region;
        des: "";
        approval_cfg: "";
        update_uid: StringNumber;
        cmdb_service_id: StringNumber;
        switch: "";
        deploy_path: string;
        jenkins_name: string;
        old_bus_id: StringNumber;
        health_check_url: "";
        app_type: StringNumber;
        is_core: StringNumber;
        is_crux: StringNumber;
        access_type: StringNumber;
        create_time: StringNumber;
        modify_time: StringNumber;
        forbidden: StringNumber;
        job_id: StringNumber;
        domain: "";
      }[];
    }>
  >("/index.php", {
    params: {
      _g: "newdeployment",
      _m: "bus",
      _a: "getMybusList",
      num_per_page: 20,
      page_num: page,
      keyword: "",
      domain_id: "",
      level: "",
      uid: "",
      app_type: "",
      type: "",
      access_type: "",
      identifier: config.get("identifier"),
      env: getEnv(),
      region: getRegion(),
    },
  });

  if (res.data.ret !== 0) throw new Error(res.data.msg);

  return res.data.data;
};