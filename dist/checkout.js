"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkout = void 0;
const enum_values_1 = require("enum-values");
const configs_1 = require("./configs");
const env_1 = require("./constants/env");
const region_1 = require("./constants/region");
const env_2 = require("./env");
const checkout = async ({ options: { env, region }, }) => {
    if (env) {
        const item = enum_values_1.EnumValues.getNamesAndValues(env_1.Env).find(({ name }) => name.toLowerCase() === env.toLowerCase());
        if (!item) {
            console.error("unknown env");
            return;
        }
        configs_1.config.set("env", item.value);
    }
    if (region) {
        const item = enum_values_1.EnumValues.getNamesAndValues(region_1.Region).find(({ name }) => name.toLowerCase() === region.toLowerCase());
        if (!item) {
            console.error("unknown region");
            return;
        }
        configs_1.config.set("region", item.value);
    }
    console.log("Switched to: ");
    (0, env_2.env)();
};
exports.checkout = checkout;
//# sourceMappingURL=checkout.js.map