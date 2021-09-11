import Conf from "conf";
import { EnumValues } from "enum-values";
import { Env } from "../constants/env";
import { Region } from "../constants/region";

const schema = {
  identifier: { type: "string" as const },
  env: {
    enum: EnumValues.getValues(Env),
  },
  region: {
    enum: EnumValues.getValues(Region),
  },
};

export const config = new Conf<{
  identifier: string;
  env: Env;
  region: Region;
}>({ schema });

export const getIdentifier = () => config.get("identifier");
export const getRegion = () => config.get("env") || Env.STG;
export const getEnv = () => config.get("region") || Region.SG;
