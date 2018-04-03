/* tslint:disable */

declare var Object: any;
export interface SampleInterface {
  "samplelId"?: string;
  "owner"?: string;
  "description"?: string;
  "createdAt"?: Date;
  "sampleCharacteristics"?: any;
  "attachments"?: Array<any>;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "updatedAt"?: Date;
}

export class Sample implements SampleInterface {
  "samplelId": string;
  "owner": string;
  "description": string;
  "createdAt": Date;
  "sampleCharacteristics": any;
  "attachments": Array<any>;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
  "updatedAt": Date;
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
      idName: 'samplelId',
      properties: {
        "samplelId": {
          name: 'samplelId',
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
        "attachments": {
          name: 'attachments',
          type: 'Array&lt;any&gt;'
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
      }
    }
  }
}
