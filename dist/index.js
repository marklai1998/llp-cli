"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vorpalInstance_1 = require("./vorpalInstance");
const ramda_1 = require("ramda");
const listServices_1 = require("./services/llp/listServices");
const env_1 = require("./env");
const ls_1 = require("./ls");
const login_1 = require("./login");
const whoAmI_1 = require("./whoAmI");
const checkout_1 = require("./checkout");
const deploy_1 = require("./deploy");
vorpalInstance_1.Vorpal.command("login <username> <password> <mfa>").action(login_1.login);
vorpalInstance_1.Vorpal.command("whoami").action(whoAmI_1.whoAmI);
vorpalInstance_1.Vorpal.command("env").action(env_1.env);
vorpalInstance_1.Vorpal.command("ls").option("-p, --page", "Page").action(ls_1.ls);
vorpalInstance_1.Vorpal.command("checkout")
    .option("-e, --env <env>", "Environment")
    .option("-r, --region <region>", "Region")
    .action(checkout_1.checkout);
vorpalInstance_1.Vorpal.command("deploy <serviceName>")
    .autocomplete({
    data: async (input) => {
        const services = await (0, listServices_1.listServices)({ name: input });
        return (0, ramda_1.pluck)("service", services.list);
    },
})
    .action(deploy_1.deploy);
vorpalInstance_1.Vorpal.delimiter("llp$").show();
//# sourceMappingURL=index.js.map