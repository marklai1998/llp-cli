"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDefaultBranch = exports.Env = void 0;
var Env;
(function (Env) {
    Env[Env["PRD"] = 4] = "PRD";
    Env[Env["PRE"] = 5] = "PRE";
    Env[Env["STG"] = 2] = "STG";
    Env[Env["DEV"] = 1] = "DEV";
})(Env = exports.Env || (exports.Env = {}));
const getDefaultBranch = (env) => {
    switch (env) {
        case Env.PRD:
            return "global/master";
        case Env.STG:
            return "global/stg";
        case Env.PRE:
            return "global/pre";
        default:
            return "global/stg";
    }
};
exports.getDefaultBranch = getDefaultBranch;
//# sourceMappingURL=env.js.map