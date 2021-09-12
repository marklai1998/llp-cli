import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import queryString from "query-string";

export const deployPackageToNodeGroup = async ({
  serviceId,
  nodeIds,
  packageId,
}: {
  serviceId: number;
  nodeIds: number[];
  packageId: number;
}) => {
  const res = await llpClient.post<APIResponse<{ rel_id: number }>>(
    "/index.php",
    queryString.stringify({
      bus_id: serviceId,
      package_id: packageId,
      node_ids: nodeIds,
      task_id: "",
      // TODO: understand what this type for
      rel_type: 1,
      cluster_id: 0,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    }),
    {
      params: {
        _g: "newdeployment",
        _m: "rel",
        _a: "execGroupRel",
      },
    }
  );

  return res.data.data;
};
