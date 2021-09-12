"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPackageStatus = void 0;
const index_1 = require("./../../configs/index");
const apiClient_1 = require("../apiClient");
const logout_1 = require("../../utils/logout");
const getPackageStatus = async ({ buildId }) => {
    const res = await apiClient_1.llpClient.get("/index.php", {
        params: {
            _g: "cicd",
            _m: "builded",
            _a: "getCicdBuildedInfo",
            id: buildId,
            identifier: (0, index_1.getIdentifier)(),
            env: (0, index_1.getEnv)(),
            region: (0, index_1.getRegion)(),
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
exports.getPackageStatus = getPackageStatus;
//# sourceMappingURL=getPackageStatus.js.map