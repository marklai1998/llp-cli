import { EnumValues } from "enum-values";
import { config } from "./configs";
import { Env } from "./constants/env";
import { Region } from "./constants/region";
import { env as EnvCommand } from "./env";

export const checkout = async ({
  options: { env, region },
}: {
  options: {
    env?: string;
    region?: string;
  };
}) => {
  if (env) {
    const item = EnumValues.getNamesAndValues(Env).find(
      ({ name }) => name.toLowerCase() === env.toLowerCase()
    );

    if (!item) {
      console.error("unknown env");
      return;
    }

    config.set("env", item.value);
  }

  if (region) {
    const item = EnumValues.getNamesAndValues(Region).find(
      ({ name }) => name.toLowerCase() === region.toLowerCase()
    );

    if (!item) {
      console.error("unknown region");
      return;
    }

    config.set("region", item.value);
  }

  console.log("Switched to: ");
  EnvCommand();
};
