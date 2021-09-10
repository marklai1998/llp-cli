import { getLoginUrl } from "./services/getLoginUrl";
import URL from "url";
import { getSSOTicket } from "./services/getSSOTicket";
import { loginSSO } from "./services/loginSSO";

export const login = async (
  username: string,
  password: string,
  mfa: string
) => {
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

    console.log(user);
  } catch (e) {
    console.error("Failed to login", e);
  }
};
