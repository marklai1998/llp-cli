"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ssoClient = exports.llpClient = void 0;
const axios_1 = __importDefault(require("axios"));
exports.llpClient = axios_1.default.create({
    baseURL: "http://lalaplat2.huolala.work",
    timeout: 3000,
});
exports.llpClient.interceptors.response.use((response) => response, (error) => {
    if (error.code === "ECONNABORTED") {
        return Promise.reject("Timeout Error");
    }
    return Promise.reject(error);
});
exports.ssoClient = axios_1.default.create({
    baseURL: "https://sso.huolala.work",
    timeout: 3000,
});
//# sourceMappingURL=apiClient.js.map