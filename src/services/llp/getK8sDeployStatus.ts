import queryString from "query-string";
import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { llpClient } from "../apiClient";
import { APIResponse } from "../../types/apiResponse";
import { K8sDeployStatus } from "../../constants/k8sDeployStatus";

export const getK8sDeployStatus = async ({
  deploymentId,
}: {
  deploymentId: number;
}) => {
  const res = await llpClient.post<
    APIResponse<{
      info: {
        extra: string;
        stage: string;
        status: K8sDeployStatus;
      };
      stage: {
        logs: string[];
        name: string;
        stage: string;
        status: K8sDeployStatus;
      }[];
    }>
  >(
    "/index.php",
    queryString.stringify({
      rel_id: deploymentId,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    }),
    {
      params: {
        _g: "docker",
        _m: "rel",
        _a: "getDockerRellogList",
      },
    }
  );

  return res.data.data;
};
