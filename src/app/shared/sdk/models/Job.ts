/* tslint:disable */

declare var Object: any;
export interface JobInterface {
  "emailJobInitiator": string;
  "type": string;
  "creationTime"?: Date;
  "executionTime"?: Date;
  "jobParams"?: any;
  "jobStatusMessage"?: string;
  "datasetList": any;
  "jobResultObject"?: any;
  "id"?: any;
  "createdAt"?: Date;
  "updatedAt"?: Date;
}

export class Job implements JobInterface {
  "emailJobInitiator": string;
  "type": string;
  "creationTime": Date;
  "executionTime": Date;
  "jobParams": any;
  "jobStatusMessage": string;
  "datasetList": any;
  "jobResultObject": any;
  "id": any;
  "createdAt": Date;
  "updatedAt": Date;
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
  public static factory(data: JobInterface): Job{
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
      name: 'Job',
      plural: 'Jobs',
      path: 'Jobs',
      idName: 'id',
      properties: {
        "emailJobInitiator": {
          name: 'emailJobInitiator',
          type: 'string'
        },
        "type": {
          name: 'type',
          type: 'string',
          default: 'retrieve'
        },
        "creationTime": {
          name: 'creationTime',
          type: 'Date'
        },
        "executionTime": {
          name: 'executionTime',
          type: 'Date'
        },
        "jobParams": {
          name: 'jobParams',
          type: 'any'
        },
        "jobStatusMessage": {
          name: 'jobStatusMessage',
          type: 'string'
        },
        "datasetList": {
          name: 'datasetList',
          type: 'any'
        },
        "jobResultObject": {
          name: 'jobResultObject',
          type: 'any'
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
