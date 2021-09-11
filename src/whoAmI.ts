import { getIdentifierInfo } from "./services/llp/getIdentifierInfo";
import { config } from "./configs";

export const whoAmI = async () => {
  try {
    const identifier: string | undefined = config.get("identifier");

    if (!identifier) {
      console.log("You're not logged in!");
      return;
    }

    const { english_name, uid } = await getIdentifierInfo({ identifier });

    console.log({ username: english_name, uid });
  } catch (e) {
    console.error("Failed to get user:", e);
  }
};
