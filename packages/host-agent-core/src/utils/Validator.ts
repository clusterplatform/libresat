import * as Ajv from "ajv";

import { resolve } from "path";

import * as TJS from "typescript-json-schema";
import { IncompatibleAPIVersionError } from "../errors/incompatibleAPIVersionError";
import { DeployableDidNotPassValidationError } from "../errors/deployableDidNotPassValidationError";

type Validateable = any;

interface IValidator {
  apiVersion: string;
  type: string;
  validateable: Validateable;
  validate(validateable: Validateable): any;
}

class Validator implements IValidator {
  private ajv: any;
  validateable: Validateable;

  constructor(
    public apiVersion: IValidator["apiVersion"],
    public type: IValidator["type"]
  ) {
    this.ajv = new Ajv();
  }

  private getSchema(type: IValidator["type"]) {
    const settings: TJS.PartialArgs = {
      noExtraProps: true,
      required: true
    };

    const program = TJS.getProgramFromFiles([
      resolve(__dirname, "../../src/types/cloud.types.ts"),
      resolve(__dirname, "../../src/types/cluster.types.ts"),
      resolve(__dirname, "../../src/types/deployable.types.ts"),
      resolve(__dirname, "../../src/types/host.types.ts"),
      resolve(__dirname, "../../src/types/publicKey.types.ts"),
      resolve(__dirname, "../../src/types/user.types.ts")
    ]);

    const schema = TJS.generateSchema(program, type, settings);

    return schema;
  }

  validate(validateable: any) {
    if (validateable.apiVersion === this.apiVersion) {
      const valid = this.ajv.validate(this.getSchema(this.type), validateable);
      if (valid) {
        return validateable;
      } else {
        throw new DeployableDidNotPassValidationError(this.ajv.errors);
      }
    } else {
      throw new IncompatibleAPIVersionError(
        validateable.apiVersion,
        this.apiVersion
      );
    }
  }
}

export { Validator };
