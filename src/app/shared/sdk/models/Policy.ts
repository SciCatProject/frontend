/* tslint:disable */

declare var Object: any;
export interface PolicyInterface {
  "availability"?: any;
  "tapeRetentionTime"?: any;
  "autoArchiveDelay"?: any;
  "ownerGroup": any;
  "accessGroups"?: any;
  "id"?: any;
  "createdAt"?: any;
  "updatedAt"?: any;
}

export class Policy implements PolicyInterface {
  "availability": any;
  "tapeRetentionTime": any;
  "autoArchiveDelay": any;
  "ownerGroup": any;
  "accessGroups": any;
  "id": any;
  "createdAt": any;
  "updatedAt": any;
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
      properties: {
        "availability": {
          name: 'availability',
          type: 'any',
          default: 'low'
        },
        "tapeRetentionTime": {
          name: 'tapeRetentionTime',
          type: 'any',
          default: 10
        },
        "autoArchiveDelay": {
          name: 'autoArchiveDelay',
          type: 'any',
          default: 7
        },
        "ownerGroup": {
          name: 'ownerGroup',
          type: 'any'
        },
        "accessGroups": {
          name: 'accessGroups',
          type: 'any'
        },
        "id": {
          name: 'id',
          type: 'any'
        },
        "createdAt": {
          name: 'createdAt',
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
