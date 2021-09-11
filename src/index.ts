import { listServices } from "./listServices";
import { login } from "./login";
import { Command } from "commander";
import { whoAmI } from "./whoAmI";

const main = async () => {
  const cli = new Command();
  cli.version("1.0.0");

  cli
    .command("login")
    .argument("<username>")
    .argument("<password>")
    .argument("<mfa>")
    .action(login);

  cli.command("whoami").action(whoAmI);

  cli.command("env").action(listServices);

  cli.command("ls").option("-p, --page", "Page").action(listServices);

  await cli.parseAsync(process.argv);
};

main();
