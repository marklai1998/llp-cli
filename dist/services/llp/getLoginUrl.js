"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLoginUrl = void 0;
const index_1 = require("./../../configs/index");
const apiClient_1 = require("../apiClient");
const query_string_1 = __importDefault(require("query-string"));
const getLoginUrl = async () => {
    const res = await apiClient_1.llpClient.post("/index.php", query_string_1.default.stringify({
        env: (0, index_1.getEnv)(),
        region: (0, index_1.getRegion)(),
    }), {
        params: {
            _m: "user",
            _a: "getIdentifierInfo",
        },
    });
    return res.data.data.login_url;
};
exports.getLoginUrl = getLoginUrl;
//# sourceMappingURL=getLoginUrl.js.map