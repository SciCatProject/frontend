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
}
