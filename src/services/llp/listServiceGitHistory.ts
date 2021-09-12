import { getIdentifier, getEnv, getRegion } from "./../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";

export const listServiceGitHistory = async ({
  serviceId,
  gitLink,
  branch,
}: {
  serviceId: number;
  gitLink: string;
  branch: string;
}) => {
  const res = await llpClient.get<APIResponse<string[]>>("/index.php", {
    params: {
      _g: "newdeployment",
      _m: "git",
      _a: "switchBranchOrTag",
      bus_id: serviceId,
      git_link: gitLink,
      branch,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    },
  });

  return res.data.data;
};
