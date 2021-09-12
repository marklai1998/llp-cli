"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = void 0;
const configs_1 = require("../configs");
const console_1 = require("./console");
const logout = () => {
    (0, console_1.errorMsg)("You've been logged out");
    configs_1.config.reset("identifier");
};
exports.logout = logout;
//# sourceMappingURL=logout.js.map