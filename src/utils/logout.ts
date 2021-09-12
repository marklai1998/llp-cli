import { config } from "../configs";
import { errorMsg } from "./console";

export const logout = () => {
  errorMsg("You've been logged out");
  config.reset("identifier");
};
