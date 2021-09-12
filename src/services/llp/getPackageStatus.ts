import { getEnv, getIdentifier, getRegion } from "./../../configs/index";
import { llpClient } from "../apiClient";
import { APIResponse } from "../../types/apiResponse";
import { Region } from "../../constants/region";
import { StringNumber } from "../../types/value";
import { Env } from "../../constants/env";
import { logout } from "../../utils/logout";

export const getPackageStatus = async ({ buildId }: { buildId: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      id: StringNumber;
      bus_id: StringNumber;
      env: Env;
      region: Region;
      task_id: StringNumber;
      branch: string;
      version: string;
      release_type: StringNumber;
      job_id: StringNumber;
      uid: StringNumber;
      build_number: StringNumber;
      stoper: "";
      deploy_status: "";
      start_time: StringNumber;
      end_time: StringNumber;
      duration_times: StringNumber;
      package_name: StringNumber;
      package_size: StringNumber;
      status: StringNumber;
      rel_des: "";
      rel_cfg: "";
      rel_type: StringNumber;
      rel_target: StringNumber;
      node_ids: "";
      build_tag: "";
      service_version: string;
      is_gra: StringNumber;
      application_id: StringNumber;
      create_time: StringNumber;
      bus_name: string;
      service: string;
      jenkins_name: string;
      bus_type: StringNumber;
      user_name: string;
      task_name: "";
      is_rel: number;
      approval_user: [];
      approval_flow: [];
      package_id: StringNumber;
      step: {
        name: string;
        start_time_millis: number;
        end_time_millis: number;
        duration_millis: number;
        cn_name: string;
        stage_type: StringNumber;
        status: StringNumber;
        parameters: {
          name: string;
          cn_name: string;
          type: "text";
          default_value: string;
          description: string;
          readonly: boolean;
          required: boolean;
          sort: number;
        }[];
      }[];
    }>
  >("/index.php", {
    params: {
      _g: "cicd",
      _m: "builded",
      _a: "getCicdBuildedInfo",
      id: buildId,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    },
  });

  if (res.data.ret !== 0) {
    if (res.data.ret === 50002) {
      logout();
    }
    throw new Error(res.data.msg);
  }

  return res.data.data;
};
