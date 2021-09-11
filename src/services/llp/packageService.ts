import { getEnv, getIdentifier, getRegion } from "./../../configs/index";
import { Env } from "../../constants/env";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";
import queryString from "query-string";

export const packageService = async ({
  jobId,
  version,
  description,
}: {
  jobId: number;
  version: string;
  description: string;
}) => {
  const res = await llpClient.post<APIResponse<{ build_id: number; env: Env }>>(
    "/index.php",
    queryString.stringify({
      branch: "global/stg",
      version: version,
      release_type: 0,
      rel_type: 1,
      rel_des: description,
      node_ids: "",
      env: getEnv(),
      id: jobId,
      identifier: getIdentifier(),
      region: getRegion(),
    }),

    {
      params: {
        _g: "cicd",
        _m: "rel",
        _a: "execCicdRel",
      },
    }
  );

  if (res.data.ret !== 0) throw new Error(res.data.msg);

  return res.data.data;
};
