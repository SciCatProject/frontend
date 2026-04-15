import { Injectable } from "@angular/core";
import Ajv2019 from "ajv/dist/2019";
import addFormats from "ajv-formats";
import addKeywords from "ajv-keywords";
import { cloneDeep } from "lodash-es";

@Injectable()
export class AjvService {
  private static deleteDynamicDefaults(schema: object): void {
    if (Array.isArray(schema)) {
      schema.forEach((entry) => AjvService.deleteDynamicDefaults(entry));
    } else if (typeof schema === "object" && schema !== null) {
      if (Object.prototype.hasOwnProperty.call(schema, "dynamicDefaults")) {
        delete schema["dynamicDefaults"];
      }

      for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          AjvService.deleteDynamicDefaults(schema[key]);
        }
      }
    }
  }

  private readonly ajv: Ajv2019;

  constructor() {
    this.ajv = new Ajv2019({
      strict: false,
      useDefaults: "empty",
      allErrors: true,
    });
    addFormats(this.ajv);
    addKeywords(this.ajv);
  }

  getAjv() {
    return this.ajv;
  }

  cleanupSchema(schema: object) {
    const cleanSchema = cloneDeep(schema);
    AjvService.deleteDynamicDefaults(cleanSchema);
    return cleanSchema;
  }
}
