/* tslint:disable */

declare var Object: any;
export interface SampleInterface {
  "samplelId"?: any;
  "owner"?: any;
  "description"?: any;
  "createdAt"?: any;
  "sampleCharacteristics"?: any;
  "attachments"?: any;
  "ownerGroup": any;
  "accessGroups"?: any;
  "updatedAt"?: any;
}

export class Sample implements SampleInterface {
  "samplelId": any;
  "owner": any;
  "description": any;
  "createdAt": any;
  "sampleCharacteristics": any;
  "attachments": any;
  "ownerGroup": any;
  "accessGroups": any;
  "updatedAt": any;
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
      properties: {
        "samplelId": {
          name: 'samplelId',
          type: 'any'
        },
        "owner": {
          name: 'owner',
          type: 'any'
        },
        "description": {
          name: 'description',
          type: 'any'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'any'
        },
        "sampleCharacteristics": {
          name: 'sampleCharacteristics',
          type: 'any'
        },
        "attachments": {
          name: 'attachments',
          type: 'any'
        },
        "ownerGroup": {
          name: 'ownerGroup',
          type: 'any'
        },
        "accessGroups": {
          name: 'accessGroups',
          type: 'any'
        },
        "updatedAt": {
          name: 'updatedAt',
          type: 'any'
        },
      },
      relations: {
      }
    }
  }
}
