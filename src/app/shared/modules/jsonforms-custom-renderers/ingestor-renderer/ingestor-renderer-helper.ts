import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { customRenderers } from "./custom-renderers";
import { JsonSchema } from "@jsonforms/core";

export const configuredRenderer = [
  ...customRenderers,
  ...angularMaterialRenderers,
];

export class IngestorRendererHelper {
  // Resolve all $ref in a schema
  static resolveRefs(schema: any, rootSchema: any): any {
    if (schema === null || schema === undefined) {
      return schema;
    }

    if (schema.$ref) {
      const refPath = schema.$ref.replace("#/", "").split("/");
      let ref = rootSchema;
      refPath.forEach((part) => {
        ref = ref[part];
      });
      return IngestorRendererHelper.resolveRefs(ref, rootSchema);
    } else if (typeof schema === "object") {
      for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          schema[key] = IngestorRendererHelper.resolveRefs(
            schema[key],
            rootSchema,
          );
        }
      }
    }
    return schema;
  }

  static reduceToRequiredProperties(schema: any): any {
    if (!schema || typeof schema !== "object") {
      return schema;
    }

    // Copy the schema and initialize a reduced structure
    const reducedSchema: any = { ...schema };

    // remove not required properties
    if (schema.properties && Array.isArray(schema.required)) {
      reducedSchema.properties = {};
      for (const key of schema.required) {
        if (schema.properties[key]) {
          const property = schema.properties[key];
          // recursive call for the nested structur
          reducedSchema.properties[key] =
            IngestorRendererHelper.reduceToRequiredProperties(property);
        }
      }
    }

    // when type is an array, reduce the items as well
    if (schema.type === "array" && schema.items) {
      reducedSchema.items = IngestorRendererHelper.reduceToRequiredProperties(
        schema.items,
      );
    }

    return reducedSchema;
  }

  /**
   * Checks if a field at the given error path is marked as required in the JSON schema
   * @param errorPath - The path to the field (e.g., "/instrument/name" or "/acquisition/voltage")
   * @param schema - The JSON schema to check against
   * @returns true if the field is required, false otherwise
   */
  static isRequiredField(errorPath: string, schema: JsonSchema): boolean {
    if (!schema || !errorPath) {
      return false;
    }
    const pathSegments = errorPath.replace(/^\//, "").split("/");
    if (pathSegments.length === 0 || pathSegments[0] === "") {
      return false;
    }
    let currentSchema = schema;

    for (let i = 0; i < pathSegments.length - 1; i++) {
      const segment = pathSegments[i];

      if (currentSchema.properties && currentSchema.properties[segment]) {
        currentSchema = currentSchema.properties[segment];
      } else {
        return false;
      }
    }

    const fieldName = pathSegments[pathSegments.length - 1];

    if (currentSchema.required && Array.isArray(currentSchema.required)) {
      return currentSchema.required.includes(fieldName);
    }

    // If no required array found, field is not required
    return false;
  }

  /**
   * Filters validation errors to only include those for required fields when in 'requiredOnly' render mode
   * @param errors - Array of validation errors from JSONForms
   * @param schema - The JSON schema to validate against
   * @param renderView - The current render view mode
   * @returns Filtered array of errors (only required field errors if renderView is 'requiredOnly')
   */
  static filterErrorsForRenderView(
    errors: any[],
    schema: JsonSchema,
    renderView: string,
  ): any[] {
    if (renderView !== "requiredOnly" || !errors || errors.length === 0) {
      return errors;
    }

    return errors.filter((error) => {
      const errorPath =
        error.instancePath || error.dataPath || error.schemaPath || "";
      return this.isRequiredField(errorPath, schema);
    });
  }

  /**
   * Processes validation errors for metadata forms
   * @param errors - Array of validation errors from JSONForms
   * @param schema - The JSON schema to validate against
   * @param renderView - The current render view mode
   * @returns Object containing processed validation results
   */
  static processMetadataErrors(
    errors: any[],
    schema: JsonSchema,
    renderView: string,
  ): { isValid: boolean; errorString: string } {
    const filteredErrors = this.filterErrorsForRenderView(
      errors,
      schema,
      renderView || "all",
    );

    return {
      isValid: filteredErrors.length === 0,
      errorString: convertJSONFormsErrorToString(filteredErrors),
    };
  }
}

export const convertJSONFormsErrorToString = (error: any): string => {
  let errorString = "";
  let displayIterNum = 1;

  for (let counter = 0; counter < error.length; counter++) {
    const currentError = error[counter];

    if (currentError.message === undefined || currentError.message === null)
      continue;

    // Filter json forms internal errors
    if (currentError.message === "must NOT have additional properties") {
      continue;
    }

    errorString +=
      displayIterNum +
      ". " +
      (currentError.instancePath && currentError.instancePath !== ""
        ? "@" + currentError.instancePath + " "
        : "") +
      currentError.message +
      " ";

    displayIterNum++;
  }

  return errorString;
};
