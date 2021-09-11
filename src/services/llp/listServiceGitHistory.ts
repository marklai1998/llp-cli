import { getIdentifier, getEnv, getRegion } from "./../../configs/index";
import { APIResponse } from "../../types/apiResponse";
import { llpClient } from "../apiClient";

export const listServiceGitHistory = async ({
  id,
  gitLink,
  branch,
}: {
  id: number;
  gitLink: string;
  branch: string;
}) => {
  const res = await llpClient.get<APIResponse<string[]>>("/index.php", {
    params: {
      _g: "newdeployment",
      _m: "git",
      _a: "switchBranchOrTag",
      bus_id: id,
      git_link: gitLink,
      branch,
      identifier: getIdentifier(),
      env: getEnv(),
      region: getRegion(),
    },
  });

  if (res.data.ret !== 0) throw new Error(res.data.msg);

  return res.data.data;
};
