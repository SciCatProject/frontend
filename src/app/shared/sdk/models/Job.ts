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
  "archiveReturnMessage"?: string;
  "dateOfLastMessage"?: Date;
  "id"?: any;
  "createdAt"?: Date;
  "updatedAt"?: Date;
  "MessageHistory"?: Array<any>;
  messageHistory?: any[];
}

export class Job implements JobInterface {
  "emailJobInitiator": string;
  "type": string;
  "creationTime": Date;
  "executionTime": Date;
  "jobParams": any;
  "jobStatusMessage": string;
  "datasetList": any;
  "archiveReturnMessage": string;
  "dateOfLastMessage": Date;
  "id": any;
  "createdAt": Date;
  "updatedAt": Date;
  "MessageHistory": Array<any>;
  messageHistory: any[];
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
        "archiveReturnMessage": {
          name: 'archiveReturnMessage',
          type: 'string'
        },
        "dateOfLastMessage": {
          name: 'dateOfLastMessage',
          type: 'Date'
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
        "MessageHistory": {
          name: 'MessageHistory',
          type: 'Array&lt;any&gt;',
          default: <any>[]
        },
      },
      relations: {
        messageHistory: {
          name: 'messageHistory',
          type: 'any[]',
          model: '',
          relationType: 'embedsMany',
                  keyFrom: 'MessageHistory',
          keyTo: 'id'
        },
      }
    }
  }
}
