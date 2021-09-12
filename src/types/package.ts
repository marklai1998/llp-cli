import { StringNumber } from "./value";

export type Package = {
  branch: string;
  bus_id: StringNumber;
  bus_name: string;
  create_time: StringNumber;
  des: "";
  env: StringNumber;
  filename: string;
  gra_rel_time: StringNumber;
  gra_version: "";
  id: StringNumber;
  package_id: StringNumber;
  package_name: string;
  prd_rel_time: StringNumber;
  pre_rel_time: StringNumber;
  size: StringNumber;
  stg_rel_time: StringNumber;
  task_id: StringNumber;
  uid: StringNumber;
  user_name: string;
  version: string;
};
