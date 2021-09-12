"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.whoAmI = void 0;
const getIdentifierInfo_1 = require("./services/llp/getIdentifierInfo");
const configs_1 = require("./configs");
const whoAmI = async () => {
    try {
        const identifier = configs_1.config.get("identifier");
        if (!identifier) {
            console.log("You're not logged in!");
            return;
        }
        const { english_name, uid } = await (0, getIdentifierInfo_1.getIdentifierInfo)({ identifier });
        console.log({ username: english_name, uid });
    }
    catch (e) {
        console.error("Failed to get user:", e);
    }
};
exports.whoAmI = whoAmI;
//# sourceMappingURL=whoAmI.js.map