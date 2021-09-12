"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listK8sPackages = void 0;
const index_1 = require("../../configs/index");
const apiClient_1 = require("../apiClient");
const logout_1 = require("../../utils/logout");
const listK8sPackages = async ({ id }) => {
    const res = await apiClient_1.llpClient.get("/index.php", {
        params: {
            _g: "newdeployment",
            _m: "rel",
            _a: "getRelPackage",
            bus_id: id,
            env: (0, index_1.getEnv)(),
            page_num: 1,
            num_per_page: 6,
            is_rel: 0,
            o_env: "",
            b_env: (0, index_1.getEnv)(),
            identifier: (0, index_1.getIdentifier)(),
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
exports.listK8sPackages = listK8sPackages;
//# sourceMappingURL=listK8sPackages.js.map