"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.doneMsg = exports.errorMsg = void 0;
const cli_color_1 = __importDefault(require("cli-color"));
const errorMsg = (msg) => {
    console.log(cli_color_1.default.black.bgRed(" Error "), msg);
};
exports.errorMsg = errorMsg;
const doneMsg = (msg) => {
    console.log(cli_color_1.default.black.bgGreen(" Done "), msg);
};
exports.doneMsg = doneMsg;
//# sourceMappingURL=console.js.map