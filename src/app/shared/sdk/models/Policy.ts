/* tslint:disable */

declare var Object: any;
export interface PolicyInterface {
  "availability"?: string;
  "tapeRetentionTime"?: number;
  "autoArchiveDelay"?: number;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "id"?: any;
  "createdAt"?: Date;
  "updatedAt"?: Date;
}

export class Policy implements PolicyInterface {
  "availability": string;
  "tapeRetentionTime": number;
  "autoArchiveDelay": number;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "id": any;
  "createdAt": Date;
  "updatedAt": Date;
  constructor(data?: PolicyInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Policy`.
   */
  public static getModelName() {
    return "Policy";
  }
  /**
  * @method factory
  * @author Jonathan Casarrubias
  * @license MIT
  * This method creates an instance of Policy for dynamic purposes.
  **/
  public static factory(data: PolicyInterface): Policy{
    return new Policy(data);
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
      name: 'Policy',
      plural: 'Policies',
      path: 'Policies',
      idName: 'id',
      properties: {
        "availability": {
          name: 'availability',
          type: 'string',
          default: 'low'
        },
        "tapeRetentionTime": {
          name: 'tapeRetentionTime',
          type: 'number',
          default: 10
        },
        "autoArchiveDelay": {
          name: 'autoArchiveDelay',
          type: 'number',
          default: 7
        },
        "ownerGroup": {
          name: 'ownerGroup',
          type: 'string'
        },
        "accessGroups": {
          name: 'accessGroups',
          type: 'Array&lt;any&gt;'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "createdAt": {
          name: 'createdAt',
          type: 'Date'
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
