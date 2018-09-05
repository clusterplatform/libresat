import { Command, flags } from "@oclif/command";
import { loadFile } from "./utils";
const { version, help } = flags;
import {
  Host,
  Validator,
  HostValidator,
  ObjectDoesNotPassTypeGuardException,
  deployableFactory
} from "@libresat/host-agent-core";

/**
 * Main command
 */
class Main extends Command {
  static description = `"kubectl"-like CLI to develop or/and control satellites using the LibreSat Platform (https://libresat.space).`;

  static flags = {
    version: version({ char: "v" }),
    help: help({ char: "h" })
  };

  static args = [
    {
      name: "file"
    }
  ];

  handleFile(file) {
    try {
      new Validator(file, HostValidator).evaluate();
      const host1 = deployableFactory(Host, file);
      this.log(host1);
    } catch (e) {
      if (e instanceof ObjectDoesNotPassTypeGuardException) {
        this.warn(
          `${e}. Aborting, please check whether deployable is implemented correctly!`
        );
      } else {
        this.error(e);
      }
    }
  }

  async run() {
    const {
      args: { file }
    } = this.parse(Main);

    if (file) {
      this.handleFile(loadFile(file));
    } else {
      this.warn("Please provide a YAML file to parse.");
    }
  }
}

export { Main };
