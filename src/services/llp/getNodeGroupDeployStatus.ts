import queryString from "query-string";
import { getEnv, getIdentifier, getRegion } from "../../configs/index";
import { llpClient } from "../apiClient";
import { APIResponse } from "../../types/apiResponse";
import { StringNumber } from "../../types/value";
import {
  GroupDeployStatus,
  GroupJobStatus,
} from "../../constants/groupDeployStatus";

export const getNodeGroupDeployStatus = async ({
  deploymentId,
}: {
  deploymentId: number;
}) => {
  const res = await llpClient.post<
    APIResponse<{
      rel_node_list: {
        node_info: { host: string; status: GroupDeployStatus; extra: "" };
        stage: {
          stage: string;
          name: string;
          status: GroupDeployStatus;
          logs: string[];
        }[];
      }[];
      rel_record_info: {
        rel_log: string;
        node_ids: StringNumber;
        status: GroupJobStatus;
      };
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
        _g: "newdeployment",
        _m: "rel",
        _a: "getRellogList",
      },
    }
  );

  return res.data.data;
};
