"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listServices = void 0;
const index_1 = require("./../../configs/index");
const apiClient_1 = require("../apiClient");
const logout_1 = require("../../utils/logout");
const listServices = async ({ page = 1, name = "", }) => {
    const res = await apiClient_1.llpClient.get("/index.php", {
        params: {
            _g: "newdeployment",
            _m: "bus",
            _a: "getMybusList",
            num_per_page: 20,
            page_num: page,
            keyword: name,
            domain_id: "",
            level: "",
            uid: "",
            app_type: "",
            type: "",
            access_type: "",
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
exports.listServices = listServices;
//# sourceMappingURL=listServices.js.map