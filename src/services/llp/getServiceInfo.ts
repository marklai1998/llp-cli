import { getEnv, getRegion, getIdentifier } from "../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import { StringNumber } from "../../types/value";
import { Region } from "../../constants/region";

export const getServicesInfo = async ({ serviceId }: { serviceId: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      id: StringNumber;
      service: string;
      name: string;
      type: StringNumber;
      level: StringNumber;
      domain_id: StringNumber;
      cmdb_id: StringNumber;
      rel_cfg: StringNumber;
      git_link: string;
      region: Region;
      des: string;
      approval_cfg: string;
      update_uid: StringNumber;
      cmdb_service_id: StringNumber;
      switch: string;
      deploy_path: {
        [key: StringNumber]: string;
      };
      jenkins_name: string;
      old_bus_id: StringNumber;
      health_check_url: string;
      app_type: StringNumber;
      is_core: StringNumber;
      is_crux: StringNumber;
      access_type: StringNumber;
      create_time: StringNumber;
      modify_time: StringNumber;
      forbidden: StringNumber;
      domain: string;
      job_id: StringNumber;
      is_operate_slb: 0;
      bus_user: {
        leader: string;
        develop: string;
        tester: string;
        devops: string;
        dbaops: string;
        region: Region;
        is_leader: number;
        leader_list_cn: string[];
        leader_list: string[];
        is_develop: number;
        develop_list_cn: string[];
        develop_list: string[];
        is_tester: number;
        tester_list_cn: string[];
        tester_list: string[];
        is_devops: number;
        devops_list_cn: string[];
        devops_list: string[];
        is_dbaops: number;
        dbaops_list_cn: string[];
        dbaops_list: string[];
      };
      is_update_user: number;
      deploy_default_path: string;
      supervisor: {
        status: number;
        config_type: number;
        supervisor_cfg_dev: [];
        supervisor_cfg_stg: [];
        supervisor_cfg_pre: [];
        supervisor_cfg_gra: [];
        supervisor_cfg_prd: [];
        management_port: string;
        create_time: number;
        modify_time: number;
      };
      use_new_supervisor: number;
      git_url: string;
      temp_relwindow: [];
      close_network: [];
      is_hll_auth: number;
      window_type: number;
      is_approval: number;
      is_gra_to_prd_window: number;
      relwindow: [];
      gra_relwindow: [];
      switch_cfg: {
        openSlb: number;
        openSupervisor: number;
        closeIteration: number;
        openHealthCheck: number;
        openlink: number;
        open_llconfig: number;
        open_new_agent: number;
        open_lala_job: number;
        openKong: number;
        close_ecs_rel: number;
        close_ecs_rel_pre: number;
        close_ecs_rel_prd: number;
        close_k8s_rel: number;
        open_group_rel: number;
        opentask: number;
      };
      service_open_soa: number;
    }>
  >("/index.php", {
    params: {
      _g: "newdeployment",
      _m: "bus",
      _a: "getOneBusInfo",
      bus_id: serviceId,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    },
  });

  return res.data.data;
};
