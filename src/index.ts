import { Vorpal } from "./vorpalInstance";
import { pluck } from "ramda";
import { listServices } from "./services/llp/listServices";
import { env } from "./env";
import { ls } from "./ls";
import { login } from "./login";
import { whoAmI } from "./whoAmI";
import { checkout } from "./checkout";
import { deploy } from "./deploy";

Vorpal.command("login <username> <password> <mfa>").action(login);

Vorpal.command("whoami").action(whoAmI);

Vorpal.command("env").action(env);

Vorpal.command("ls").option("-p, --page", "Page").action(ls);

Vorpal.command("checkout")
  .option("-e, --env <env>", "Environment")
  .option("-r, --region <region>", "Region")
  .action(checkout);

Vorpal.command("deploy <serviceName>")
  .autocomplete({
    data: async (input?: string) => {
      const services = await listServices({ name: input });
      return pluck("service", services.list);
    },
  })
  .action(deploy);

Vorpal.delimiter("llp$").show();
