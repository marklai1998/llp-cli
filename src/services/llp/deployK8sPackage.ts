import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import queryString from "query-string";
import { logout } from "../../utils/logout";

export const deployK8sPackage = async ({
  id,
  k8sId,
  packageId,
}: {
  id: number;
  k8sId: number;
  packageId: number;
}) => {
  const res = await llpClient.post<APIResponse<{ rel_id: number }>>(
    "/index.php",
    queryString.stringify({
      id: k8sId,
      bus_id: id,
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
