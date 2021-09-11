import { env } from "./env";
import { listServices } from "./listServices";
import { login } from "./login";
import vorpal from "vorpal";
import { whoAmI } from "./whoAmI";
import { checkout } from "./checkout";

const Vorpal = vorpal();

Vorpal.command("login <username> <password> <mfa>").action(login);

Vorpal.command("whoami").action(whoAmI);

Vorpal.command("env").action(env);

Vorpal.command("ls").option("-p, --page", "Page").action(listServices);

Vorpal.command("checkout")
  .option("-e, --env <env>", "Environment")
  .option("-r, --region <region>", "Region")
  .action(checkout);

Vorpal.delimiter("llp$").show();
