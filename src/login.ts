import { getLoginUrl } from "./services/llp/getLoginUrl";
import URL from "url";
import { getSSOTicket } from "./services/sso/getSSOTicket";
import { loginSSO } from "./services/sso/loginSSO";
import { config } from "./configs";

export const login = async ({
  username,
  password,
  mfa,
}: {
  username: string;
  password: string;
  mfa: string;
  options: {};
}) => {
  try {
    const url = await getLoginUrl();
    const { appid, _sign, callback } = URL.parse(url, true).query as {
      callback: string;
      appid: string;
      _t: string;
      _sign: string;
    };

    const ssoTicket = await getSSOTicket({ appid, callback, sign: _sign });

    const user = await loginSSO({
      appid: String(appid),
      ssoTicket,
      username: username,
      password,
      otp: mfa,
    });

    console.log("logged in as: ", user.username);

    config.set("identifier", user.identifier);
  } catch (e) {
    console.error("Failed to login", e);
  }
};
