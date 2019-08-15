/* tslint:disable */
import {
  Attachment
} from '../index';

declare var Object: any;
export interface SampleInterface {
  "sampleId"?: string;
  "owner"?: string;
  "description"?: string;
  "createdAt"?: Date;
  "sampleCharacteristics"?: any;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "updatedAt"?: Date;
  attachments?: Attachment[];
}

export class Sample implements SampleInterface {
  "sampleId": string;
  "owner": string;
  "description": string;
  "createdAt": Date;
  "sampleCharacteristics": any;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
  "updatedAt": Date;
  attachments: Attachment[];
  constructor(data?: SampleInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Sample`.
   */
  public static getModelName() {
    return "Sample";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Sample for dynamic purposes.
  **/
  public static factory(data: SampleInterface): Sample{
    return new Sample(data);
  }
  /**
  * @method getModelDefinition
  * @author Julien Ledun
  * @license MIT
  * This method returns an object that represents some of the model
  * definitions.
  **/
  public static getModelDefinition() {
    return {
      name: 'Sample',
      plural: 'Samples',
      path: 'Samples',
      idName: 'sampleId',
      properties: {
        "sampleId": {
          name: 'sampleId',
          type: 'string'
        },
        "owner": {
          name: 'owner',
          type: 'string'
        },
        "description": {
          name: 'description',
          type: 'string'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
        },
        "sampleCharacteristics": {
          name: 'sampleCharacteristics',
          type: 'any'
        },
        "ownerGroup": {
          name: 'ownerGroup',
          type: 'string'
        },
        "accessGroups": {
          name: 'accessGroups',
          type: 'Array&lt;any&gt;'
        },
        "createdBy": {
          name: 'createdBy',
          type: 'string'
        },
        "updatedBy": {
          name: 'updatedBy',
          type: 'string'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'Date'
        },
      },
      relations: {
        attachments: {
          name: 'attachments',
          type: 'Attachment[]',
          model: 'Attachment',
          relationType: 'hasMany',
                  keyFrom: 'sampleId',
          keyTo: 'sampleId'
        },
      }
    }
  }
}
