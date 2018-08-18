/* tslint:disable */

declare var Object: any;
export interface PolicyInterface {
  "manager"?: Array<any>;
  "tapeRedundancy"?: string;
  "autoArchive"?: boolean;
  "autoArchiveDelay"?: number;
  "archiveEmailNotification"?: boolean;
  "archiveEmailsToBeNotified"?: Array<any>;
  "retrieveEmailNotification"?: boolean;
  "retrieveEmailsToBeNotified"?: Array<any>;
  "ownerGroup": string;
  "accessGroups"?: Array<any>;
  "createdBy"?: string;
  "updatedBy"?: string;
  "id"?: any;
  "createdAt"?: Date;
  "updatedAt"?: Date;
}

export class Policy implements PolicyInterface {
  "manager": Array<any>;
  "tapeRedundancy": string;
  "autoArchive": boolean;
  "autoArchiveDelay": number;
  "archiveEmailNotification": boolean;
  "archiveEmailsToBeNotified": Array<any>;
  "retrieveEmailNotification": boolean;
  "retrieveEmailsToBeNotified": Array<any>;
  "ownerGroup": string;
  "accessGroups": Array<any>;
  "createdBy": string;
  "updatedBy": string;
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
        "manager": {
          name: 'manager',
          type: 'Array&lt;any&gt;'
        },
        "tapeRedundancy": {
          name: 'tapeRedundancy',
          type: 'string',
          default: 'low'
        },
        "autoArchive": {
          name: 'autoArchive',
          type: 'boolean'
        },
        "autoArchiveDelay": {
          name: 'autoArchiveDelay',
          type: 'number',
          default: 7
        },
        "archiveEmailNotification": {
          name: 'archiveEmailNotification',
          type: 'boolean',
          default: false
        },
        "archiveEmailsToBeNotified": {
          name: 'archiveEmailsToBeNotified',
          type: 'Array&lt;any&gt;'
        },
        "retrieveEmailNotification": {
          name: 'retrieveEmailNotification',
          type: 'boolean',
          default: false
        },
        "retrieveEmailsToBeNotified": {
          name: 'retrieveEmailsToBeNotified',
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
