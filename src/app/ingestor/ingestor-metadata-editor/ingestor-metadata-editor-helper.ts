import { angularMaterialRenderers } from "@jsonforms/angular-material";
import { customRenderers } from "./customRenderer/custom-renderers";
import { JsonSchema } from "@jsonforms/core";

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
  
      // Remove leading slash and split the path
      const pathSegments = errorPath.replace(/^\//, '').split('/');
      
      // If empty path, return false
      if (pathSegments.length === 0 || pathSegments[0] === '') {
        return false;
      }
  
      // Start from the root schema
      let currentSchema = schema;
  
      // Navigate through nested objects if the path is nested
      for (let i = 0; i < pathSegments.length - 1; i++) {
        const segment = pathSegments[i];
        
        if (currentSchema.properties && currentSchema.properties[segment]) {
          currentSchema = currentSchema.properties[segment];
        } else {
          // Path doesn't exist in schema
          return false;
        }
      }
  
      // Get the final field name
      const fieldName = pathSegments[pathSegments.length - 1];
  
      // Check if the field is in the required array of the current schema level
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
      renderView: string
    ): any[] {
      if (renderView !== 'requiredOnly' || !errors || errors.length === 0) {
        return errors;
      }
  
      return errors.filter(error => {
        // Try different possible error path properties
        const errorPath = error.instancePath || error.dataPath || error.schemaPath || '';
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
      renderView: string
    ): { isValid: boolean; errorString: string } {
      const filteredErrors = this.filterErrorsForRenderView(errors, schema, renderView || 'all');
      
      return {
        isValid: filteredErrors.length === 0,
        errorString: convertJSONFormsErrorToString(filteredErrors)
      };
    }

/**
 * Removes SI-related fields from a JSON schema
 * @param schema - The original JSON schema
 * @returns A new schema with SI fields removed
 */
static removeSIFieldsFromSchema(schema: JsonSchema): JsonSchema {
  if (!schema || typeof schema !== 'object') {
    return schema;
  }

  // Deep clone the schema to avoid mutating the original
  const cleanedSchema = JSON.parse(JSON.stringify(schema));

  // Recursively clean properties
  if (cleanedSchema.properties) {
    cleanedSchema.properties = this.cleanProperties(cleanedSchema.properties);
  }

  // Clean required array if it exists
  if (cleanedSchema.required && Array.isArray(cleanedSchema.required)) {
    cleanedSchema.required = cleanedSchema.required.filter(
      (field: string) => !this.isSIField(field)
    );
  }

  return cleanedSchema;
}

private static cleanProperties(properties: any): any {
  const cleaned = {};
  
  for (const [key, value] of Object.entries(properties)) {
    // Skip SI fields entirely
    if (this.isSIField(key)) {
      continue;
    }

    // If it's an object with nested properties, recursively clean it
    if (value && typeof value === 'object' && (value as any).properties) {
      cleaned[key] = {
        ...value,
        properties: this.cleanProperties((value as any).properties),
        // Also clean nested required arrays
        ...(((value as any).required && Array.isArray((value as any).required)) && {
          required: (value as any).required.filter((field: string) => !this.isSIField(field))
        })
      };
    } else {
      cleaned[key] = value;
    }
  }

  return cleaned;
}

private static isSIField(fieldName: string): boolean {
  // Define patterns for SI fields
  const siPatterns = ['unitSI', 'valueSI'];
  return siPatterns.some(pattern => fieldName.includes(pattern));
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
