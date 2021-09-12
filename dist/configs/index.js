"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getRegion = exports.getEnv = exports.getIdentifier = exports.config = void 0;
const conf_1 = __importDefault(require("conf"));
const enum_values_1 = require("enum-values");
const env_1 = require("../constants/env");
const region_1 = require("../constants/region");
const schema = {
    identifier: { type: "string" },
    env: {
        enum: enum_values_1.EnumValues.getValues(env_1.Env),
    },
    region: {
        enum: enum_values_1.EnumValues.getValues(region_1.Region),
    },
};
exports.config = new conf_1.default({ schema });
const getIdentifier = () => exports.config.get("identifier");
exports.getIdentifier = getIdentifier;
const getEnv = () => exports.config.get("env") || env_1.Env.STG;
exports.getEnv = getEnv;
const getRegion = () => exports.config.get("region") || region_1.Region.SG;
exports.getRegion = getRegion;
//# sourceMappingURL=index.js.map