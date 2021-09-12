"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const region_1 = require("./constants/region");
const index_1 = require("./configs/index");
const enum_values_1 = require("enum-values");
const env_1 = require("./constants/env");
const env = async () => {
    const currentEnv = (0, index_1.getEnv)();
    const currentRegion = (0, index_1.getRegion)();
    console.log({
        env: enum_values_1.EnumValues.getNamesAndValues(env_1.Env).find(({ value }) => value === currentEnv)?.name,
        region: enum_values_1.EnumValues.getNamesAndValues(region_1.Region).find(({ value }) => value === currentRegion)?.name,
    });
};
exports.env = env;
//# sourceMappingURL=env.js.map