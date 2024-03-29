import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import queryString from "query-string";

export const deployPackageToK8s = async ({
  serviceId,
  k8sId,
  packageId,
}: {
  serviceId: number;
  k8sId: number;
  packageId: number;
}) => {
  const res = await llpClient.post<APIResponse<{ rel_id: number }>>(
    "/index.php",
    queryString.stringify({
      id: k8sId,
      bus_id: serviceId,
      package_id: packageId,
      task_id: "",
      rel_type: { isTrusted: true },
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    }),
    {
      params: {
        _g: "docker",
        _m: "rel",
        _a: "execDockerRel",
      },
    }
  );

  return res.data.data;
};
