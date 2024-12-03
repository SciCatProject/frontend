import { IIngestionRequestInformation } from "ingestor/ingestor/ingestor.component";

export interface Schema {
  type?: string;
  properties?: {
    [key: string]: {
      type: string;
      format?: string;
      enum?: string[];
      minLength?: number;
    };
  };
  required?: string[];
}

export interface UISchema {
  type: string;
  elements: { type: string; scope: string; label?: boolean }[];
}

export class IngestorMetadaEditorHelper {
  static generateUISchemaFromSchema(schema: string): UISchema {
    const parsedSchema: Schema = JSON.parse(schema);

    const flattenProperties = (properties: any, parentKey: string = ''): any[] => {
      if (!properties) {
        return [];
      }

      return Object.keys(properties).reduce((acc, key) => {
        const property = properties[key];
        const fullKey = parentKey ? `${parentKey}.${key}` : key;

        if (property.type === 'object' && property.properties) {
          acc.push({
            type: 'Label',
            text: key.charAt(0).toUpperCase() + key.slice(1)
          });
          acc.push(...flattenProperties(property.properties, fullKey));
        } else {
          acc.push({
            type: 'Control',
            scope: `#/properties/${fullKey}`,
            label: parsedSchema.required && parsedSchema.required.includes(key) ? true : undefined
          });
        }

        return acc;
      }, []);
    };

    const uischema = {
      type: 'VerticalLayout',
      elements: flattenProperties(parsedSchema.properties)
    };

    return uischema;
  }

  static mergeUserAndExtractorMetadata(userMetadata: Object, extractorMetadata: Object, space: number): string {
    return JSON.stringify({ ...userMetadata, ...extractorMetadata }, null, space);
  }

  static createEmptyRequestInformation = (): IIngestionRequestInformation => {
    return {
      selectedPath: '',
      selectedMethod: '',
      scicatHeader: {},
      userMetaData: {},
      extractorMetaData: {},
      mergedMetaDataString: ''
    };
  };
};