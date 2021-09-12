"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deployK8sPackage = void 0;
const index_1 = require("../../configs/index");
const apiClient_1 = require("../apiClient");
const query_string_1 = __importDefault(require("query-string"));
const logout_1 = require("../../utils/logout");
const deployK8sPackage = async ({ id, k8sId, packageId, }) => {
    const res = await apiClient_1.llpClient.post("/index.php", query_string_1.default.stringify({
        id: k8sId,
        bus_id: id,
        package_id: packageId,
        task_id: "",
        rel_type: { isTrusted: true },
        identifier: (0, index_1.getIdentifier)(),
        env: (0, index_1.getEnv)(),
        region: (0, index_1.getRegion)(),
    }), {
        params: {
            _g: "docker",
            _m: "rel",
            _a: "execDockerRel",
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
exports.deployK8sPackage = deployK8sPackage;
//# sourceMappingURL=deployK8sPackage.js.map