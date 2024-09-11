/* eslint-disable */

declare var Object: any;
export interface JobInterface {
  id?: string;
  ownerUser?: string;
  type: string;
  statusCode?: string;
  statusMessage?: string;
  jobParams: any;
  datasetsValidation?: boolean;
  contactEmail?: string;
  configVersion?: string;
  jobResultObject?: any;
  createdBy: string;
  updatedBy?: string;
  ownerGroup?: string;
  accessGroups?: any;
  DateTime?: Date;
}

export class Job implements JobInterface {
  "id": string;
  "ownerUser": string;
  "type": string;
  "statusCode": string;
  "statusMessage": string;
  "jobParams": any;
  "datasetsValidation": boolean;
  "contactEmail": string;
  "configVersion": string;
  "jobResultObject": any;
  "createdBy": string;
  "updatedBy": string;
  "ownerGroup": string;
  "accessGroups": any;
  "DateTime": Date;

  constructor(data?: JobInterface) {
    Object.assign(this, data);
  }
  /**
   * The name of the model represented by this $resource,
   * i.e. `Job`.
   */
  public static getModelName() {
    return "Job";
  }
  /**
   * @method factory
   * @author Jonathan Casarrubias
   * @license MIT
   * This method creates an instance of Job for dynamic purposes.
   **/
  public static factory(data: JobInterface): Job {
    return new Job(data);
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
      name: "Job",
      plural: "Jobs",
      path: "Jobs",
      idName: "id",
      properties: {
        id: {
          name: "id",
          type: "string",
        },
        ownerUser: {
          name: "ownerUser",
          type: "string",
        },
        type: {
          name: "type",
          type: "string",
          default: "retrieve",
        },
        statusCode: {
          name: "statusCode",
          type: "string",
        },
        statusMessage: {
          name: "statusMessage",
          type: "string",
        },
        jobParams: {
          name: "jobParams",
          type: "any",
        },
        datasetsValidation: {
          name: "datasetsValidation",
          type: "boolean",
        },
        contactEmail: {
          name: "contactEmail",
          type: "string",
        },
        configVersion: {
          name: "configVersion",
          type: "string",
        },
        jobResultObject: {
          name: "jobResultObject",
          type: "any",
        },
        createdBy: {
          name: "createdBy",
          type: "string",
        },
        updatedBy: {
          name: "updatedBy",
          type: "string",
        },
        ownerGroup: {
          name: "ownerGroup",
          type: "string",
        },
        accessGroups: {
          name: "accessGroups",
          type: "any",
        },
        DateTime: {
          name: "DateTime",
          type: "Date",
        },
      },
      relations: {},
    };
  }
}
