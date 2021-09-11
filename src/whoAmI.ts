import { getIdentifierInfo } from "./services/llp/getIdentifierInfo";
import { config } from "./configs";

export const whoAmI = async () => {
  const identifier: string | undefined = config.get("identifier");

  if (!identifier) {
    console.log("You're not logged in!");
    return;
  }

  const { english_name, uid } = await getIdentifierInfo({ identifier });

  console.log({ username: english_name, uid });
};
