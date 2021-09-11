import { Region } from "./constants/region";
import { getEnv, getRegion } from "./configs/index";
import { EnumValues } from "enum-values";
import { Env } from "./constants/env";

export const env = async () => {
  const currentEnv = getEnv();
  const currentRegion = getRegion();

  console.log({
    env: EnumValues.getNamesAndValues(Env).find(
      ({ value }) => value === currentEnv
    ).name,
    region: EnumValues.getNamesAndValues(Region).find(
      ({ value }) => value === currentRegion
    ).name,
  });
};
