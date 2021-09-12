"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ls = void 0;
const listServices_1 = require("./services/llp/listServices");
const ls = async ({ page }) => {
    try {
        const { list } = await (0, listServices_1.listServices)({ page });
        list.forEach(({ service }) => {
            console.log(service);
        });
    }
    catch (e) {
        console.error("Failed to list services:", e);
    }
};
exports.ls = ls;
//# sourceMappingURL=ls.js.map