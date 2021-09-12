import { StringNumber } from "./../../types/value";
import { getEnv, getRegion, getIdentifier } from "../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";

export const getK8sInfo = async ({ serviceId }: { serviceId: number }) => {
  const res = await llpClient.get<
    APIResponse<{
      appInfo: {
        id: StringNumber;
        bus_id: StringNumber;
        template_id: StringNumber;
        template_ch_id: StringNumber;
        create_uid: StringNumber;
        update_msg: "";
        forbidden: StringNumber;
        updated_at: string;
        created_at: string;
        service: string;
        lang_type: StringNumber;
      };
      deploy_param: {
        protected: number;
        value: string;
        name: string;
        cn_name: string;
      }[];
      deployment_status: {
        availableReplicas: number;
        readyReplicas: number;
        replicas: number;
        updatedReplicas: number;
        status: number;
      };
      stageInfo: { id: StringNumber; name: string }[];
      k8s_check_count: StringNumber;
      k8s_check_time: StringNumber;
    }>
  >("/index.php", {
    params: {
      _g: "docker",
      _m: "app",
      _a: "getDockerAppDeploymentStatus",
      bus_id: serviceId,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    },
  });

  return res.data.data;
};
