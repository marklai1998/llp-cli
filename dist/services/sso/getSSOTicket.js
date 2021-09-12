"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSSOTicket = void 0;
const apiClient_1 = require("../apiClient");
const query_string_1 = __importDefault(require("query-string"));
const getSSOTicket = async ({ appid, callback, sign, }) => {
    const res = await apiClient_1.ssoClient.post("/index.php", query_string_1.default.stringify({
        appid,
        callback,
        _t: Date.now() / 1000,
        _sign: sign,
        uclang: "sc",
        _path: "html",
        show_name_en: "",
        show_name_cn: "",
    }), {
        headers: { "content-type": "application/x-www-form-urlencoded" },
        params: {
            _m: "login",
            _a: "index",
        },
    });
    if (res.data.ret !== 0)
        throw new Error(res.data.msg);
    return res.data.data.ssoTicket;
};
exports.getSSOTicket = getSSOTicket;
//# sourceMappingURL=getSSOTicket.js.map