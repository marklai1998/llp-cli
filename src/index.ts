import { getLoginUrl } from "./services/getLoginUrl";
import { login } from "./login";
import { Command } from "commander";

const main = async () => {
  const cli = new Command();
  cli.version("1.0.0");

  cli
    .command("login")
    .argument("<username>")
    .argument("<password>")
    .argument("<mfa>")
    .action(login);

  await cli.parseAsync(process.argv);
};

main();
