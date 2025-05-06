import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { customRenderers } from "./customRenderer/custom-renderers";

export const configuredRenderer = [
  ...customRenderers,
  ...angularMaterialRenderers,
];

export class IngestorMetadataEditorHelper {
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
      return IngestorMetadataEditorHelper.resolveRefs(ref, rootSchema);
    } else if (typeof schema === "object") {
      for (const key in schema) {
        if (Object.prototype.hasOwnProperty.call(schema, key)) {
          schema[key] = IngestorMetadataEditorHelper.resolveRefs(
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

    // Kopiere das Schema und initialisiere die reduzierte Struktur
    const reducedSchema: any = { ...schema };

    // Entferne nicht benötigte Eigenschaften
    if (schema.properties && Array.isArray(schema.required)) {
      reducedSchema.properties = {};
      for (const key of schema.required) {
        if (schema.properties[key]) {
          const property = schema.properties[key];
          // Rekursiver Aufruf für verschachtelte Objekte
          reducedSchema.properties[key] =
            IngestorMetadataEditorHelper.reduceToRequiredProperties(property);
        }
      }
    }

    // Falls es sich um ein Array handelt, reduziere das Items-Schema
    if (schema.type === "array" && schema.items) {
      reducedSchema.items =
        IngestorMetadataEditorHelper.reduceToRequiredProperties(schema.items);
    }

    return reducedSchema;
  }
}

export const convertJSONFormsErrorToString = (error: any): string => {
  let errorString = "";

  error.forEach((error, number) => {
    if (error.message) {
      const ctrNum = number + 1;
      errorString += ctrNum + ": " + error.message + "\n";
    }
  });

  return errorString;
};
