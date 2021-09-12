"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getK8sDeployStatus = void 0;
const query_string_1 = __importDefault(require("query-string"));
const index_1 = require("../../configs/index");
const apiClient_1 = require("../apiClient");
const logout_1 = require("../../utils/logout");
const getK8sDeployStatus = async ({ deploymentId, }) => {
    const res = await apiClient_1.llpClient.post("/index.php", query_string_1.default.stringify({
        rel_id: deploymentId,
        identifier: (0, index_1.getIdentifier)(),
        env: (0, index_1.getEnv)(),
        region: (0, index_1.getRegion)(),
    }), {
        params: {
            _g: "docker",
            _m: "rel",
            _a: "getDockerRellogList",
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
exports.getK8sDeployStatus = getK8sDeployStatus;
//# sourceMappingURL=getK8sDeployStatus.js.map