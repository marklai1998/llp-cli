"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const getLoginUrl_1 = require("./services/llp/getLoginUrl");
const url_1 = __importDefault(require("url"));
const getSSOTicket_1 = require("./services/sso/getSSOTicket");
const loginSSO_1 = require("./services/sso/loginSSO");
const configs_1 = require("./configs");
const login = async ({ username, password, mfa }) => {
    try {
        const url = await (0, getLoginUrl_1.getLoginUrl)();
        const { appid, _sign, callback } = url_1.default.parse(url, true).query;
        const ssoTicket = await (0, getSSOTicket_1.getSSOTicket)({ appid, callback, sign: _sign });
        const user = await (0, loginSSO_1.loginSSO)({
            appid: String(appid),
            ssoTicket,
            username: username,
            password,
            otp: mfa,
        });
        console.log("logged in as: ", user.username);
        configs_1.config.set("identifier", user.identifier);
    }
    catch (e) {
        console.error("Failed to login", e);
    }
};
exports.login = login;
//# sourceMappingURL=login.js.map