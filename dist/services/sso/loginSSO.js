"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSSO = void 0;
const apiClient_1 = require("../apiClient");
const md5_1 = __importDefault(require("md5"));
const query_string_1 = __importDefault(require("query-string"));
const loginSSO = async ({ appid, ssoTicket, username, password, otp, }) => {
    const res = await apiClient_1.ssoClient.post("/index.php", query_string_1.default.stringify({
        user_name: username,
        user_pwd_md5: (0, md5_1.default)(password),
        ggcode: String(otp),
        loginType: "hll",
        appid: appid,
        ssoTicket: ssoTicket,
        uclang: "sc",
        client_type: "pc",
        dlp_info: "",
        dlp_request_time: "65",
        refer_url: "",
    }), {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        params: {
            _m: "login",
            _a: "login",
        },
    });
    if (res.data.ret !== 0)
        throw new Error(res.data.msg);
    return {
        username: res.data.data.account,
        identifier: res.data.data.identifier,
    };
};
exports.loginSSO = loginSSO;
//# sourceMappingURL=loginSSO.js.map