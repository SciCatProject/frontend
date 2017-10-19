/* tslint:disable */

declare var Object: any;
export interface JobInterface {
  "emailJobInitiator": any;
  "type": any;
  "creationTime"?: any;
  "executionTime"?: any;
  "jobParams"?: any;
  "jobStatusMessage"?: any;
  "archiveReturnMessage"?: any;
  "dateOfLastMessage"?: any;
  "datasetList": any;
  "id"?: any;
  "createdAt"?: any;
  "updatedAt"?: any;
}

export class Job implements JobInterface {
  "emailJobInitiator": any;
  "type": any;
  "creationTime": any;
  "executionTime": any;
  "jobParams": any;
  "jobStatusMessage": any;
  "archiveReturnMessage": any;
  "dateOfLastMessage": any;
  "datasetList": any;
  "id": any;
  "createdAt": any;
  "updatedAt": any;
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
      properties: {
        "emailJobInitiator": {
          name: 'emailJobInitiator',
          type: 'any'
        },
        "type": {
          name: 'type',
          type: 'any',
          default: 'retrieve'
        },
        "creationTime": {
          name: 'creationTime',
          type: 'any'
        },
        "executionTime": {
          name: 'executionTime',
          type: 'any'
        },
        "jobParams": {
          name: 'jobParams',
          type: 'any'
        },
        "jobStatusMessage": {
          name: 'jobStatusMessage',
          type: 'any'
        },
        "archiveReturnMessage": {
          name: 'archiveReturnMessage',
          type: 'any'
        },
        "dateOfLastMessage": {
          name: 'dateOfLastMessage',
          type: 'any'
        },
        "datasetList": {
          name: 'datasetList',
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
