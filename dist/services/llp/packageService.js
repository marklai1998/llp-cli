"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.packageService = void 0;
const index_1 = require("./../../configs/index");
const apiClient_1 = require("../apiClient");
const query_string_1 = __importDefault(require("query-string"));
const logout_1 = require("../../utils/logout");
const packageService = async ({ jobId, version, description, }) => {
    const res = await apiClient_1.llpClient.post("/index.php", query_string_1.default.stringify({
        branch: "global/stg",
        version: version,
        release_type: 0,
        rel_type: 1,
        rel_des: description,
        node_ids: "",
        env: (0, index_1.getEnv)(),
        id: jobId,
        identifier: (0, index_1.getIdentifier)(),
        region: (0, index_1.getRegion)(),
    }), {
        params: {
            _g: "cicd",
            _m: "rel",
            _a: "execCicdRel",
        },
    });
    if (res.data.ret !== 0) {
        if (res.data.ret === 50002) {
            (0, logout_1.logout)();
        }
        throw new Error(res.data.msg);
    }
    return res.data.data;
};
exports.packageService = packageService;
//# sourceMappingURL=packageService.js.map